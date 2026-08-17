"use client";

import Link from "next/link";

import { useLocale } from "@/components/locale-provider";
import { translatedMetric } from "@/lib/i18n";
import type { WorldSeriesSnapshot } from "@/lib/types";

export function SourcesList({ snapshot }: { snapshot: WorldSeriesSnapshot }) {
  const { locale, t } = useLocale();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <p className="text-xs tracking-[0.22em] text-primary uppercase">
        {t.sourcesPage.eyebrow}
      </p>
      <h1 className="mt-3 font-heading text-5xl tracking-tight">
        {t.sourcesPage.title}
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
        {t.sourcesPage.lead}
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        {t.sourcesPage.access(snapshot.fetchedAt.slice(0, 10))}
      </p>

      <div className="mt-10 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-card/80 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">{t.sourcesPage.colMetric}</th>
              <th className="px-4 py-3 font-medium">
                {t.sourcesPage.colProducer}
              </th>
              <th className="px-4 py-3 font-medium">{t.sourcesPage.colCode}</th>
              <th className="px-4 py-3 font-medium">{t.sourcesPage.colPoints}</th>
              <th className="px-4 py-3 font-medium">
                {t.sourcesPage.colLicense}
              </th>
              <th className="px-4 py-3 font-medium">{t.sourcesPage.colLinks}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {snapshot.metrics.map((metric) => {
              const first = metric.observations[0];
              const last = metric.observations[metric.observations.length - 1];
              const copy = translatedMetric(metric, locale);
              return (
                <tr key={metric.slug} className="bg-card/40">
                  <td className="px-4 py-4">
                    <Link
                      href={`/metrics/${metric.slug}`}
                      className="font-medium hover:underline"
                    >
                      {copy.name}
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
                        {t.sourcesPage.producerLink}
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
          <h2 className="font-heading text-2xl">{t.sourcesPage.droppedTitle}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t.sourcesPage.droppedLead}
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
