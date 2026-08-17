"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { useLocale } from "@/components/locale-provider";
import { MetricChart } from "@/components/metric-chart";
import { CATEGORY_COLORS } from "@/lib/chart";
import {
  displayForYear,
  formatMetricValue,
  trendForYear,
  trendLabel,
} from "@/lib/format";
import { translatedMetric } from "@/lib/i18n";
import type { ShippedMetric } from "@/lib/types";

type MetricTileProps = {
  metric: ShippedMetric;
  year: number;
};

export function MetricTile({ metric, year }: MetricTileProps) {
  const { locale, t } = useLocale();
  const copy = translatedMetric(metric, locale);
  const display = displayForYear(metric, year);
  const trend = display ? trendForYear(metric, display.year) : null;
  const color = CATEGORY_COLORS[metric.category];

  return (
    <Link
      href={`/metrics/${metric.slug}`}
      className="group flex flex-col rounded-2xl border border-border/80 bg-card/80 p-5 transition-colors hover:border-primary/40 hover:bg-card"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{copy.shortLabel}</p>
          <div className="mt-1 min-h-[3.25rem]">
            {display === null ? (
              <p className="font-heading text-2xl leading-tight text-muted-foreground">
                {t.noEstimate}
              </p>
            ) : (
              <motion.p
                key={`${metric.slug}-${display.year}-${display.kind}`}
                initial={{ opacity: 0.35, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`font-heading text-4xl leading-none tracking-tight ${
                  display.kind === "last" ? "text-muted-foreground" : ""
                }`}
              >
                {formatMetricValue(display.value, metric.decimals, locale)}
              </motion.p>
            )}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {display?.kind === "last"
              ? `${t.lastReading(display.year)} · ${copy.unit}`
              : copy.unit}
          </p>
        </div>
        {trend ? (
          <span
            className={`rounded-full px-2.5 py-1 text-xs ${
              trend.direction === "better"
                ? "bg-better/15 text-better"
                : trend.direction === "worse"
                  ? "bg-worse/15 text-worse"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {trendLabel(trend.direction, t)} {t.vs} {trend.fromYear}
          </span>
        ) : null}
      </div>
      <div className="h-20">
        <MetricChart metric={metric} variant="spark" />
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span style={{ color }}>{metric.source.organization}</span>
        <span className="transition-colors group-hover:text-foreground">
          {t.openSeries}
        </span>
      </div>
    </Link>
  );
}
