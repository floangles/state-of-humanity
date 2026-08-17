import type { ShippedMetric } from "@/lib/types";

export function formatMetricValue(value: number, decimals: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatSignedDelta(value: number, decimals: number) {
  const formatted = formatMetricValue(Math.abs(value), decimals);
  if (value > 0) return `+${formatted}`;
  if (value < 0) return `−${formatted}`;
  return formatted;
}

export function valueAtYear(metric: ShippedMetric, year: number) {
  return metric.observations.find((point) => point.year === year)?.value ?? null;
}

export function firstObservation(metric: ShippedMetric) {
  return metric.observations[0] ?? null;
}

export function lastObservation(metric: ShippedMetric) {
  return metric.observations[metric.observations.length - 1] ?? null;
}

export function trendForYear(metric: ShippedMetric, year: number) {
  const first = firstObservation(metric);
  const current = valueAtYear(metric, year);

  if (!first || current === null || first.year === year) {
    return null;
  }

  const delta = current - first.value;
  const improved = metric.higherIsBetter ? delta > 0 : delta < 0;
  const worsened = metric.higherIsBetter ? delta < 0 : delta > 0;

  return {
    fromYear: first.year,
    fromValue: first.value,
    toYear: year,
    toValue: current,
    delta,
    direction: improved ? "better" : worsened ? "worse" : "unchanged",
  } as const;
}

export function yearBounds(metrics: ShippedMetric[]) {
  const years = metrics.flatMap((metric) =>
    metric.observations.map((point) => point.year),
  );

  return {
    minYear: Math.min(...years),
    maxYear: Math.max(...years),
  };
}
