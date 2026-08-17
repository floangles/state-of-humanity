"use client";

import { useState } from "react";
import Link from "next/link";

import { useLocale } from "@/components/locale-provider";
import { MetricTile } from "@/components/metric-tile";
import { YearScrubber } from "@/components/year-scrubber";
import {
  defaultYear,
  displayForYear,
  firstObservation,
  formatMetricValue,
  trendForYear,
  trendLabel,
  yearBounds,
} from "@/lib/format";
import { translatedMetric } from "@/lib/i18n";
import type { Category } from "@/lib/metrics-catalog";
import type { ShippedMetric, WorldSeriesSnapshot } from "@/lib/types";

const CHAPTER_ORDER: Category[] = [
  "survival",
  "knowledge",
  "living",
  "conflict",
  "planet",
];

type HumanityExplorerProps = {
  snapshot: WorldSeriesSnapshot;
};

export function HumanityExplorer({ snapshot }: HumanityExplorerProps) {
  const { locale, t } = useLocale();
  const { minYear, maxYear } = yearBounds(snapshot.metrics);
  const initialYear = defaultYear(snapshot.metrics);
  const [year, setYear] = useState(initialYear);

  const chapters = CHAPTER_ORDER.map((category) => ({
    category,
    ...t.chapters[category],
    metrics: snapshot.metrics.filter((metric) => metric.category === category),
  })).filter((chapter) => chapter.metrics.length > 0);

  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-6 pt-16 pb-12">
        <p className="text-xs tracking-[0.28em] text-white/70 uppercase">
          {t.heroEyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl font-heading text-5xl leading-[1.05] font-light tracking-[0.08em] text-white uppercase text-balance sm:text-7xl">
          {t.heroTitle}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          {t.heroLead}
        </p>
      </section>

      <YearScrubber
        year={year}
        minYear={minYear}
        maxYear={maxYear}
        onYearChange={setYear}
      />

      <section className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-3xl">{t.thenVs(year)}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t.thenVsHint}</p>
          </div>
        </div>
        <div className="divide-y divide-border rounded-2xl border border-border bg-card/60">
          {snapshot.metrics.map((metric) => (
            <ThenNowRow key={metric.slug} metric={metric} year={year} />
          ))}
        </div>
      </section>

      {chapters.map((chapter) => (
        <section
          key={chapter.category}
          className="mx-auto w-full max-w-6xl px-6 py-10"
        >
          <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
            {chapter.eyebrow}
          </p>
          <h2 className="mt-2 font-heading text-4xl">{chapter.title}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {chapter.metrics.map((metric) => (
              <MetricTile key={metric.slug} metric={metric} year={year} />
            ))}
          </div>
        </section>
      ))}

      <footer className="mx-auto w-full max-w-6xl px-6 pt-8 pb-16 text-sm text-muted-foreground">
        {t.lastIngested(new Date(snapshot.fetchedAt).toISOString().slice(0, 10))}{" "}
        {t.accessChannel}{" "}
        {snapshot.dropped.length > 0
          ? t.droppedCandidates(snapshot.dropped.length)
          : t.allShipped(snapshot.metrics.length)}{" "}
        <Link
          href="/sources"
          className="text-foreground underline-offset-4 hover:underline"
        >
          {t.seeSources}
        </Link>
        .
      </footer>
    </>
  );
}

function ThenNowRow({
  metric,
  year,
}: {
  metric: ShippedMetric;
  year: number;
}) {
  const { locale, t } = useLocale();
  const copy = translatedMetric(metric, locale);
  const first = firstObservation(metric);
  const display = displayForYear(metric, year);
  const trend = display ? trendForYear(metric, display.year) : null;

  return (
    <div className="grid gap-3 px-5 py-4 sm:grid-cols-[1.2fr_1fr_1fr_auto] sm:items-center">
      <div>
        <p className="font-medium">{copy.shortLabel}</p>
        <p className="text-xs text-muted-foreground">{copy.unit}</p>
      </div>
      <p className="text-sm text-muted-foreground">
        {first
          ? `${first.year}: ${formatMetricValue(first.value, metric.decimals, locale)}`
          : "—"}
      </p>
      <p className="text-sm">
        {display === null
          ? t.noEstimate
          : display.kind === "last"
            ? `${t.lastReading(display.year)}: ${formatMetricValue(display.value, metric.decimals, locale)}`
            : `${year}: ${formatMetricValue(display.value, metric.decimals, locale)}`}
      </p>
      <p
        className={`text-sm ${
          trend?.direction === "better"
            ? "text-better"
            : trend?.direction === "worse"
              ? "text-worse"
              : "text-muted-foreground"
        }`}
      >
        {trend ? trendLabel(trend.direction, t) : "—"}
      </p>
    </div>
  );
}
