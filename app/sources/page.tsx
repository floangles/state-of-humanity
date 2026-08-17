import type { Metadata } from "next";
import Link from "next/link";

import { loadWorldSeries } from "@/lib/data";

export const metadata: Metadata = {
  title: "Sources",
  description:
    "Official producers, WDI codes, licenses, and last ingest date for every shipped World series.",
};

export const dynamic = "force-static";

export default async function SourcesPage() {
  const snapshot = await loadWorldSeries();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <p className="text-xs tracking-[0.22em] text-primary uppercase">
        Provenance
      </p>
      <h1 className="mt-3 font-heading text-5xl tracking-tight">Sources</h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
        Every number on this site is a published World aggregate. The app never
        averages country rows, never interpolates missing years, and never
        keeps a series with zero World points.
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        Access channel: World Bank World Development Indicators API, country
        code WLD, license CC BY 4.0. Last ingest{" "}
        {snapshot.fetchedAt.slice(0, 10)}.
      </p>

      <div className="mt-10 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-card/80 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Metric</th>
              <th className="px-4 py-3 font-medium">Producer</th>
              <th className="px-4 py-3 font-medium">WDI code</th>
              <th className="px-4 py-3 font-medium">Points</th>
              <th className="px-4 py-3 font-medium">License</th>
              <th className="px-4 py-3 font-medium">Links</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {snapshot.metrics.map((metric) => {
              const first = metric.observations[0];
              const last = metric.observations[metric.observations.length - 1];
              return (
                <tr key={metric.slug} className="bg-card/40">
                  <td className="px-4 py-4">
                    <Link
                      href={`/metrics/${metric.slug}`}
                      className="font-medium hover:underline"
                    >
                      {metric.name}
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {metric.source.organization}
                  </td>
                  <td className="px-4 py-4 font-mono text-xs">
                    {metric.worldBankCode}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {metric.observations.length} ({first.year}–{last.year})
                  </td>
                  <td className="px-4 py-4">{metric.source.license}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <a
                        href={metric.source.dataUrl}
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        WDI
                      </a>
                      <a
                        href={metric.source.homepageUrl}
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Producer
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {snapshot.dropped.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-heading text-2xl">Dropped candidates</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            These codes were requested and not shipped because WDI returned no
            non-null World values.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {snapshot.dropped.map((item) => (
              <li key={item.slug}>
                {item.slug} ({item.worldBankCode}): {item.reason}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
