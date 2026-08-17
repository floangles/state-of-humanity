"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { CATEGORY_COLORS, chartSeries } from "@/lib/chart";
import { formatMetricValue } from "@/lib/format";
import { translatedMetric } from "@/lib/i18n";
import type { ShippedMetric } from "@/lib/types";
import { useLocale } from "@/components/locale-provider";

type MetricChartProps = {
  metric: ShippedMetric;
  variant?: "spark" | "full";
};

export function MetricChart({
  metric,
  variant = "full",
}: MetricChartProps) {
  const { locale, t } = useLocale();
  const copy = translatedMetric(metric, locale);
  const data = chartSeries(metric);
  const color = CATEGORY_COLORS[metric.category];
  const isSpark = variant === "spark";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={
          isSpark
            ? { top: 4, right: 0, bottom: 0, left: 0 }
            : { top: 8, right: 8, bottom: 0, left: 8 }
        }
      >
        <defs>
          <linearGradient id={`fill-${metric.slug}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        {!isSpark ? (
          <>
            <CartesianGrid
              stroke="oklch(0.32 0.02 55)"
              strokeDasharray="3 6"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              tick={{ fill: "oklch(0.74 0.025 75)", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: "oklch(0.74 0.025 75)", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={Math.abs(metric.observations[0]?.value ?? 0) >= 1_000_000_000 ? 56 : 72}
              tickFormatter={(value: number) =>
                formatMetricValue(value, metric.decimals, locale)
              }
            />
            <Tooltip
              cursor={{ stroke: color, strokeOpacity: 0.35 }}
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null;
                const point = payload[0].payload as {
                  year: number;
                  value: number | null;
                };
                if (point.value === null) {
                  return (
                    <div className="rounded-md border border-border bg-card px-3 py-2 text-sm">
                      <div className="text-muted-foreground">{point.year}</div>
                      <div>{t.noEstimate}</div>
                    </div>
                  );
                }
                return (
                  <div className="rounded-md border border-border bg-card px-3 py-2 text-sm">
                    <div className="text-muted-foreground">{point.year}</div>
                    <div className="font-medium">
                      {formatMetricValue(point.value, metric.decimals, locale)}{" "}
                      <span className="text-muted-foreground">{copy.unit}</span>
                    </div>
                  </div>
                );
              }}
            />
          </>
        ) : null}
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={isSpark ? 1.5 : 2.25}
          fill={`url(#fill-${metric.slug})`}
          connectNulls={false}
          dot={false}
          activeDot={isSpark ? false : { r: 4, fill: color }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
