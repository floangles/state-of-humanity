import Link from "next/link";
import { notFound } from "next/navigation";

import { MetricChart } from "@/components/metric-chart";
import { getShippedMetric, getShippedMetrics } from "@/lib/data";
import {
  firstObservation,
  formatMetricValue,
  lastObservation,
} from "@/lib/format";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const metrics = await getShippedMetrics();
  return metrics.map((metric) => ({ slug: metric.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/metrics/[slug]">) {
  const { slug } = await params;
  const metric = await getShippedMetric(slug);

  if (!metric) {
    return { title: "Metric not found" };
  }

  return {
    title: metric.name,
    description: metric.description,
  };
}

export default async function MetricPage({
  params,
}: PageProps<"/metrics/[slug]">) {
  const { slug } = await params;
  const metric = await getShippedMetric(slug);

  if (!metric) {
    notFound();
  }

  const first = firstObservation(metric);
  const last = lastObservation(metric);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <Link
        href="/"
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← World
      </Link>
      <p className="mt-8 text-xs tracking-[0.18em] text-primary uppercase">
        {metric.category} · {metric.worldBankCode}
      </p>
      <h1 className="mt-3 max-w-3xl font-heading text-5xl tracking-tight text-balance">
        {metric.name}
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
        {metric.description}
      </p>

      {first && last ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Stat
            label={`First official point · ${first.year}`}
            value={formatMetricValue(first.value, metric.decimals)}
            unit={metric.unit}
          />
          <Stat
            label={`Latest official point · ${last.year}`}
            value={formatMetricValue(last.value, metric.decimals)}
            unit={metric.unit}
          />
          <Stat
            label="Published World points"
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
          Gaps are years without a published World value. The line is not
          interpolated.
        </p>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-border bg-card/70 p-6">
          <h2 className="font-heading text-2xl">How this series is built</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            {metric.methodologyNote}
          </p>
        </article>
        <article className="rounded-2xl border border-border bg-card/70 p-6">
          <h2 className="font-heading text-2xl">Source</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Row label="Producer" value={metric.source.organization} />
            <Row label="Series" value={metric.source.name} />
            <Row label="WDI code" value={metric.worldBankCode} />
            <Row label="License" value={metric.source.license} />
            <Row
              label="Fetched"
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
              World Bank indicator
            </a>
            <a
              href={metric.source.homepageUrl}
              className="text-primary underline-offset-4 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Producer homepage
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
