import { readFile } from "node:fs/promises";
import path from "node:path";

import { asc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { metrics, observations, sources } from "@/drizzle/schema";
import type { Category } from "@/lib/metrics-catalog";
import type { ShippedMetric, WorldSeriesSnapshot } from "@/lib/types";

const SNAPSHOT_PATH = path.join(process.cwd(), "data", "world-series.json");

async function loadSnapshot(): Promise<WorldSeriesSnapshot> {
  const raw = await readFile(SNAPSHOT_PATH, "utf8");
  return JSON.parse(raw) as WorldSeriesSnapshot;
}

async function loadFromDatabase(): Promise<WorldSeriesSnapshot | null> {
  const db = getDb();

  if (!db) {
    return null;
  }

  const rows = await db
    .select({
      metric: metrics,
      source: sources,
    })
    .from(metrics)
    .innerJoin(sources, eq(metrics.sourceId, sources.id))
    .where(eq(metrics.shipped, true))
    .orderBy(asc(metrics.sortOrder));

  if (rows.length === 0) {
    return null;
  }

  const shipped: ShippedMetric[] = [];

  for (const row of rows) {
    const points = await db
      .select({
        year: observations.year,
        value: observations.value,
      })
      .from(observations)
      .where(eq(observations.metricId, row.metric.id))
      .orderBy(asc(observations.year));

    if (points.length === 0) {
      continue;
    }

    shipped.push({
      slug: row.metric.slug,
      name: row.metric.name,
      shortLabel: row.metric.shortLabel,
      unit: row.metric.unit,
      description: row.metric.description,
      methodologyNote: row.metric.methodologyNote,
      category: row.metric.category as Category,
      higherIsBetter: row.metric.higherIsBetter,
      worldBankCode: row.metric.worldBankCode,
      decimals: row.metric.decimals,
      sortOrder: row.metric.sortOrder,
      source: {
        name: row.source.name,
        organization: row.source.organization,
        homepageUrl: row.source.homepageUrl,
        dataUrl: row.source.dataUrl,
        license: row.source.license,
        fetchedAt: row.source.fetchedAt.toISOString(),
      },
      observations: points.map((point) => ({
        year: point.year,
        value: Number(point.value),
      })),
    });
  }

  if (shipped.length === 0) {
    return null;
  }

  return {
    geography: {
      code: "WLD",
      name: "World",
      type: "world",
    },
    fetchedAt: shipped
      .map((metric) => metric.source.fetchedAt)
      .sort()
      .at(-1) as string,
    metrics: shipped,
    dropped: [],
  };
}

export async function loadWorldSeries(): Promise<WorldSeriesSnapshot> {
  const fromDatabase = await loadFromDatabase();

  if (fromDatabase) {
    return fromDatabase;
  }

  return loadSnapshot();
}

export async function getShippedMetrics() {
  const snapshot = await loadWorldSeries();
  return snapshot.metrics;
}

export async function getShippedMetric(slug: string) {
  const metrics = await getShippedMetrics();
  return metrics.find((metric) => metric.slug === slug) ?? null;
}
