import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";

import { config } from "dotenv";
import { eq } from "drizzle-orm";

import { getDb } from "../lib/db";
import {
  METRIC_CANDIDATES,
  type MetricCandidate,
} from "../lib/metrics-catalog";
import type { DroppedMetric, ShippedMetric, WorldSeriesSnapshot } from "../lib/types";
import { geographies, metrics, observations, sources } from "../drizzle/schema";

config({ path: ".env.local" });
config();

const execFileAsync = promisify(execFile);
const WDI_BASE = "https://api.worldbank.org/v2/country/WLD/indicator";
const SNAPSHOT_PATH = path.join(process.cwd(), "data", "world-series.json");
const UCDP_BRD_ZIP =
  "https://ucdp.uu.se/downloads/brd/ucdp-brd-conf-261-csv.zip";
const WID_WORLD_CSV = "https://wid.world/bulk_download/WID_data_WO.csv";

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

function splitCsvLine(line: string, delimiter = ",") {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  cells.push(current);
  return cells;
}

function parseCsv(text: string, delimiter = ",") {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter(Boolean);
  const headers = splitCsvLine(lines[0] ?? "", delimiter);
  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line, delimiter);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = cells[index] ?? "";
    });
    return row;
  });
}

function trailingAnnualRun(points: { year: number; value: number }[]) {
  if (points.length === 0) {
    return points;
  }

  const sorted = [...points].sort((a, b) => a.year - b.year);
  let start = 0;

  for (let i = 1; i < sorted.length; i += 1) {
    if (sorted[i].year !== sorted[i - 1].year + 1) {
      start = i;
    }
  }

  return sorted.slice(start);
}

async function fetchUcdpWorldBattleDeaths() {
  const response = await fetch(UCDP_BRD_ZIP);

  if (!response.ok) {
    throw new Error(`UCDP BRD HTTP ${response.status}`);
  }

  const dir = await mkdtemp(path.join(tmpdir(), "ucdp-brd-"));
  const zipPath = path.join(dir, "brd.zip");
  await writeFile(zipPath, Buffer.from(await response.arrayBuffer()));
  await execFileAsync("unzip", ["-o", zipPath, "-d", dir]);

  const { stdout } = await execFileAsync("unzip", ["-Z", "-1", zipPath]);
  const csvName = stdout
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.toLowerCase().endsWith(".csv"));

  if (!csvName) {
    throw new Error("UCDP BRD zip did not contain a CSV file.");
  }

  const csvText = await readFile(path.join(dir, csvName), "utf8");
  const rows = parseCsv(csvText);
  const totals = new Map<number, number>();

  for (const row of rows) {
    const year = Number(row.year);
    const value = Number(row.bd_best);

    if (!Number.isInteger(year) || Number.isNaN(value)) {
      continue;
    }

    totals.set(year, (totals.get(year) ?? 0) + value);
  }

  return [...totals.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([year, value]) => ({ year, value }));
}

async function fetchWidWorldTop10Share() {
  const response = await fetch(WID_WORLD_CSV);

  if (!response.ok) {
    throw new Error(`WID World CSV HTTP ${response.status}`);
  }

  const rows = parseCsv(await response.text(), ";");
  const byYear = new Map<number, number>();

  for (const row of rows) {
    if (
      row.country !== "WO" ||
      row.variable !== "sptincj992" ||
      row.percentile !== "p90p100" ||
      row.age !== "992" ||
      row.pop !== "j"
    ) {
      continue;
    }

    const year = Number(row.year);
    const fraction = Number(row.value);

    if (!Number.isInteger(year) || Number.isNaN(fraction)) {
      continue;
    }

    byYear.set(year, Math.round(fraction * 10000) / 100);
  }

  return trailingAnnualRun(
    [...byYear.entries()].map(([year, value]) => ({ year, value })),
  );
}

async function fetchCandidateSeries(candidate: MetricCandidate) {
  if (candidate.slug === "battle-deaths") {
    return fetchUcdpWorldBattleDeaths();
  }

  if (candidate.slug === "top-10-income-share") {
    return fetchWidWorldTop10Share();
  }

  return fetchWdiWorldSeries(candidate.worldBankCode);
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

  console.log("Fetching official World series.\n");

  for (const candidate of METRIC_CANDIDATES) {
    process.stdout.write(`${candidate.worldBankCode} ${candidate.slug} ... `);

    try {
      const points = await fetchCandidateSeries(candidate);

      if (points.length === 0) {
        dropped.push({
          slug: candidate.slug,
          worldBankCode: candidate.worldBankCode,
          reason: "No non-null World values returned by the producer.",
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
