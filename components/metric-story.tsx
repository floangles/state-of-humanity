"use client";

import Link from "next/link";

import { useLocale } from "@/components/locale-provider";
import { MetricChart } from "@/components/metric-chart";
import {
  firstObservation,
  formatMetricValue,
  lastObservation,
} from "@/lib/format";
import { translatedMetric } from "@/lib/i18n";
import type { ShippedMetric } from "@/lib/types";

export function MetricStory({ metric }: { metric: ShippedMetric }) {
  const { locale, t } = useLocale();
  const copy = translatedMetric(metric, locale);
  const first = firstObservation(metric);
  const last = lastObservation(metric);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <Link
        href="/"
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        {t.metricPage.back}
      </Link>
      <p className="mt-8 text-xs tracking-[0.18em] text-primary uppercase">
        {t.categoryLabels[metric.category]} · {metric.worldBankCode}
      </p>
      <h1 className="mt-3 max-w-3xl font-heading text-5xl tracking-tight text-balance">
        {copy.name}
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
        {copy.description}
      </p>

      {first && last ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Stat
            label={t.metricPage.firstPoint(first.year)}
            value={formatMetricValue(first.value, metric.decimals, locale)}
            unit={copy.unit}
          />
          <Stat
            label={t.metricPage.latestPoint(last.year)}
            value={formatMetricValue(last.value, metric.decimals, locale)}
            unit={copy.unit}
          />
          <Stat
            label={t.metricPage.publishedPoints}
            value={String(metric.observations.length)}
            unit={`${first.year}–${last.year}`}
          />
        </div>
      ) : null}

      <section className="mt-10 rounded-2xl border border-border bg-card/70 p-5">
        <div className="h-[360px]">
          <MetricChart metric={metric} />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          {t.metricPage.chartGaps}
        </p>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-border bg-card/70 p-6">
          <h2 className="font-heading text-2xl">{t.metricPage.howBuilt}</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            {copy.methodologyNote}
          </p>
        </article>
        <article className="rounded-2xl border border-border bg-card/70 p-6">
          <h2 className="font-heading text-2xl">{t.metricPage.source}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Row label={t.metricPage.producer} value={metric.source.organization} />
            <Row label={t.metricPage.series} value={metric.source.name} />
            <Row label={t.metricPage.wdiCode} value={metric.worldBankCode} />
            <Row label={t.metricPage.license} value={metric.source.license} />
            <Row
              label={t.metricPage.fetched}
              value={metric.source.fetchedAt.slice(0, 10)}
            />
          </dl>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <a
              href={metric.source.dataUrl}
              className="text-primary underline-offset-4 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              {t.metricPage.wdiLink}
            </a>
            <a
              href={metric.source.homepageUrl}
              className="text-primary underline-offset-4 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              {t.metricPage.producerLink}
            </a>
          </div>
        </article>
      </section>
    </main>
  );
}

function Stat({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/70 p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-heading text-3xl">{value}</p>
      <p className="mt-2 text-xs text-muted-foreground">{unit}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}
