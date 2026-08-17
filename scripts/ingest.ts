import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { config } from "dotenv";
import { eq } from "drizzle-orm";

import { getDb } from "../lib/db";
import { METRIC_CANDIDATES } from "../lib/metrics-catalog";
import type { DroppedMetric, ShippedMetric, WorldSeriesSnapshot } from "../lib/types";
import { geographies, metrics, observations, sources } from "../drizzle/schema";

config({ path: ".env.local" });
config();

const WDI_BASE = "https://api.worldbank.org/v2/country/WLD/indicator";
const SNAPSHOT_PATH = path.join(process.cwd(), "data", "world-series.json");

type WdiMeta = {
  page: number;
  pages: number;
  per_page: number;
  total: number;
};

type WdiRow = {
  countryiso3code?: string;
  date?: string;
  value?: number | null;
};

async function fetchWdiWorldSeries(code: string) {
  const points: { year: number; value: number }[] = [];
  let page = 1;
  let pages = 1;

  while (page <= pages) {
    const url = `${WDI_BASE}/${code}?format=json&per_page=500&page=${page}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`WDI ${code} HTTP ${response.status}`);
    }

    const payload = (await response.json()) as
      | [{ message?: { id?: string; value?: string }[] }]
      | [WdiMeta, WdiRow[] | undefined];

    if (!Array.isArray(payload)) {
      throw new Error(`WDI ${code} returned a non-array payload.`);
    }

    const first = payload[0];
    if (first && "message" in first && first.message) {
      const message = first.message.map((item) => item.value ?? item.id).join("; ");
      throw new Error(`WDI ${code}: ${message}`);
    }

    const meta = first as WdiMeta;
    const rows = (payload[1] ?? []) as WdiRow[];
    pages = meta.pages || 1;

    for (const row of rows) {
      if (row.countryiso3code && row.countryiso3code !== "WLD") {
        continue;
      }

      const year = Number(row.date);
      const value = row.value;

      if (!Number.isInteger(year) || value === null || value === undefined) {
        continue;
      }

      if (typeof value !== "number" || Number.isNaN(value)) {
        continue;
      }

      points.push({ year, value });
    }

    page += 1;
  }

  points.sort((a, b) => a.year - b.year);
  return points;
}

async function persistToDatabase(snapshot: WorldSeriesSnapshot) {
  const db = getDb();

  if (!db) {
    console.log("DATABASE_URL unset — snapshot written, Postgres sync skipped.");
    return;
  }

  await db
    .insert(geographies)
    .values({
      code: snapshot.geography.code,
      name: snapshot.geography.name,
      type: snapshot.geography.type,
    })
    .onConflictDoUpdate({
      target: geographies.code,
      set: {
        name: snapshot.geography.name,
        type: snapshot.geography.type,
      },
    });

  for (const metric of snapshot.metrics) {
    await db
      .insert(sources)
      .values({
        id: metric.slug,
        name: metric.source.name,
        organization: metric.source.organization,
        homepageUrl: metric.source.homepageUrl,
        dataUrl: metric.source.dataUrl,
        license: metric.source.license,
        fetchedAt: new Date(metric.source.fetchedAt),
      })
      .onConflictDoUpdate({
        target: sources.id,
        set: {
          name: metric.source.name,
          organization: metric.source.organization,
          homepageUrl: metric.source.homepageUrl,
          dataUrl: metric.source.dataUrl,
          license: metric.source.license,
          fetchedAt: new Date(metric.source.fetchedAt),
        },
      });

    await db
      .insert(metrics)
      .values({
        id: metric.slug,
        slug: metric.slug,
        name: metric.name,
        shortLabel: metric.shortLabel,
        unit: metric.unit,
        description: metric.description,
        methodologyNote: metric.methodologyNote,
        category: metric.category,
        higherIsBetter: metric.higherIsBetter,
        worldBankCode: metric.worldBankCode,
        decimals: metric.decimals,
        sortOrder: metric.sortOrder,
        shipped: true,
        sourceId: metric.slug,
      })
      .onConflictDoUpdate({
        target: metrics.id,
        set: {
          slug: metric.slug,
          name: metric.name,
          shortLabel: metric.shortLabel,
          unit: metric.unit,
          description: metric.description,
          methodologyNote: metric.methodologyNote,
          category: metric.category,
          higherIsBetter: metric.higherIsBetter,
          worldBankCode: metric.worldBankCode,
          decimals: metric.decimals,
          sortOrder: metric.sortOrder,
          shipped: true,
          sourceId: metric.slug,
        },
      });

    await db
      .delete(observations)
      .where(eq(observations.metricId, metric.slug));

    if (metric.observations.length > 0) {
      await db.insert(observations).values(
        metric.observations.map((point) => ({
          metricId: metric.slug,
          geoCode: "WLD",
          year: point.year,
          value: point.value.toString(),
        })),
      );
    }
  }

  console.log("Postgres sync complete.");
}

async function main() {
  const fetchedAt = new Date().toISOString();
  const shipped: ShippedMetric[] = [];
  const dropped: DroppedMetric[] = [];

  console.log("Fetching official World (WLD) series from World Bank WDI.\n");

  for (const candidate of METRIC_CANDIDATES) {
    process.stdout.write(`${candidate.worldBankCode} ${candidate.slug} ... `);

    try {
      const points = await fetchWdiWorldSeries(candidate.worldBankCode);

      if (points.length === 0) {
        dropped.push({
          slug: candidate.slug,
          worldBankCode: candidate.worldBankCode,
          reason: "No non-null World (WLD) values returned by WDI.",
        });
        console.log("DROPPED (0 World points)");
        continue;
      }

      shipped.push({
        ...candidate,
        source: {
          ...candidate.source,
          fetchedAt,
        },
        observations: points,
      });

      const minYear = points[0].year;
      const maxYear = points[points.length - 1].year;
      console.log(`SHIPPED ${points.length} points (${minYear}–${maxYear})`);
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      dropped.push({
        slug: candidate.slug,
        worldBankCode: candidate.worldBankCode,
        reason,
      });
      console.log(`DROPPED (${reason})`);
    }
  }

  const snapshot: WorldSeriesSnapshot = {
    geography: { code: "WLD", name: "World", type: "world" },
    fetchedAt,
    metrics: shipped.sort((a, b) => a.sortOrder - b.sortOrder),
    dropped,
  };

  await mkdir(path.dirname(SNAPSHOT_PATH), { recursive: true });
  await writeFile(SNAPSHOT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`);

  console.log(`\nSnapshot written to ${SNAPSHOT_PATH}`);
  console.log(`Shipped: ${shipped.length}`);
  console.log(`Dropped: ${dropped.length}`);

  if (dropped.length > 0) {
    for (const item of dropped) {
      console.log(`  - ${item.slug} (${item.worldBankCode}): ${item.reason}`);
    }
  }

  await persistToDatabase(snapshot);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
