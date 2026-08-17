"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { MetricChart } from "@/components/metric-chart";
import { CATEGORY_COLORS } from "@/lib/chart";
import {
  formatMetricValue,
  trendForYear,
  valueAtYear,
} from "@/lib/format";
import type { ShippedMetric } from "@/lib/types";

type MetricTileProps = {
  metric: ShippedMetric;
  year: number;
};

export function MetricTile({ metric, year }: MetricTileProps) {
  const value = valueAtYear(metric, year);
  const trend = trendForYear(metric, year);
  const color = CATEGORY_COLORS[metric.category];

  return (
    <Link
      href={`/metrics/${metric.slug}`}
      className="group flex flex-col rounded-2xl border border-border/80 bg-card/80 p-5 transition-colors hover:border-primary/40 hover:bg-card"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{metric.shortLabel}</p>
          <div className="mt-1 min-h-[3.25rem]">
            {value === null ? (
              <p className="font-heading text-2xl leading-tight text-muted-foreground">
                No official estimate
              </p>
            ) : (
              <motion.p
                key={`${metric.slug}-${year}`}
                initial={{ opacity: 0.35, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-heading text-4xl leading-none tracking-tight"
              >
                {formatMetricValue(value, metric.decimals)}
              </motion.p>
            )}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{metric.unit}</p>
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
            {trend.direction === "better"
              ? "Better"
              : trend.direction === "worse"
                ? "Worse"
                : "Unchanged"}{" "}
            vs {trend.fromYear}
          </span>
        ) : null}
      </div>
      <div className="h-20">
        <MetricChart metric={metric} variant="spark" />
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span style={{ color }}>{metric.source.organization}</span>
        <span className="transition-colors group-hover:text-foreground">
          Open series →
        </span>
      </div>
    </Link>
  );
}
