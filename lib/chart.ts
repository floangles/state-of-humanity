import type { ShippedMetric } from "@/lib/types";

export const CATEGORY_COLORS: Record<ShippedMetric["category"], string> = {
  survival: "#e08a4b",
  knowledge: "#d4b36a",
  living: "#8fa87a",
  conflict: "#9a6b6b",
  planet: "#c46a4a",
};

export function chartSeries(metric: ShippedMetric) {
  const first = metric.observations[0]?.year;
  const last = metric.observations[metric.observations.length - 1]?.year;

  if (first === undefined || last === undefined) {
    return [];
  }

  const byYear = new Map(
    metric.observations.map((point) => [point.year, point.value]),
  );

  const data: { year: number; value: number | null }[] = [];

  for (let year = first; year <= last; year += 1) {
    data.push({
      year,
      value: byYear.get(year) ?? null,
    });
  }

  return data;
}
