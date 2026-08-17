"use client";

import { useState } from "react";

import { MetricTile } from "@/components/metric-tile";
import { YearScrubber } from "@/components/year-scrubber";
import { CHAPTERS } from "@/lib/metrics-catalog";
import {
  firstObservation,
  formatMetricValue,
  trendForYear,
  valueAtYear,
  yearBounds,
} from "@/lib/format";
import type { Category } from "@/lib/metrics-catalog";
import type { ShippedMetric, WorldSeriesSnapshot } from "@/lib/types";

const CHAPTER_ORDER: Category[] = [
  "survival",
  "knowledge",
  "living",
  "planet",
];

type HumanityExplorerProps = {
  snapshot: WorldSeriesSnapshot;
};

export function HumanityExplorer({ snapshot }: HumanityExplorerProps) {
  const { minYear, maxYear } = yearBounds(snapshot.metrics);
  const [year, setYear] = useState(maxYear);

  const chapters = CHAPTER_ORDER.map((category) => ({
    category,
    ...CHAPTERS[category],
    metrics: snapshot.metrics.filter((metric) => metric.category === category),
  })).filter((chapter) => chapter.metrics.length > 0);

  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-6 pt-16 pb-12">
        <p className="text-xs tracking-[0.28em] text-white/70 uppercase">
          World · official series only
        </p>
        <h1 className="mt-4 max-w-3xl font-heading text-5xl leading-[1.05] font-light tracking-[0.08em] text-white uppercase text-balance sm:text-7xl">
          State of Humanity
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Published World aggregates from UN agencies, the World Bank, WHO,
          UNESCO, FAO, and the European Commission JRC.
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
            <h2 className="font-heading text-3xl">Then vs {year}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              First official World point compared with the selected year. No
              estimate means the producer did not publish a World value.
            </p>
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
        Last ingested {new Date(snapshot.fetchedAt).toISOString().slice(0, 10)}.
        Access channel: World Bank WDI, country code WLD.{" "}
        {snapshot.dropped.length > 0
          ? `${snapshot.dropped.length} candidate${snapshot.dropped.length === 1 ? "" : "s"} dropped for lack of a World series.`
          : `All ${snapshot.metrics.length} candidates had a published World series.`}{" "}
        <a href="/sources" className="text-foreground underline-offset-4 hover:underline">
          See sources
        </a>
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
  const first = firstObservation(metric);
  const current = valueAtYear(metric, year);
  const trend = trendForYear(metric, year);

  return (
    <div className="grid gap-3 px-5 py-4 sm:grid-cols-[1.2fr_1fr_1fr_auto] sm:items-center">
      <div>
        <p className="font-medium">{metric.shortLabel}</p>
        <p className="text-xs text-muted-foreground">{metric.unit}</p>
      </div>
      <p className="text-sm text-muted-foreground">
        {first
          ? `${first.year}: ${formatMetricValue(first.value, metric.decimals)}`
          : "—"}
      </p>
      <p className="text-sm">
        {current === null
          ? "No official estimate"
          : `${year}: ${formatMetricValue(current, metric.decimals)}`}
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
        {trend
          ? trend.direction === "better"
            ? "Better"
            : trend.direction === "worse"
              ? "Worse"
              : "Unchanged"
          : "—"}
      </p>
    </div>
  );
}
