import { localeNumberFormat, type Locale } from "@/lib/i18n";
import type { ShippedMetric } from "@/lib/types";

export function formatMetricValue(
  value: number,
  decimals: number,
  locale: Locale = "en",
) {
  return new Intl.NumberFormat(localeNumberFormat(locale), {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatSignedDelta(
  value: number,
  decimals: number,
  locale: Locale = "en",
) {
  const formatted = formatMetricValue(Math.abs(value), decimals, locale);
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

export function displayForYear(metric: ShippedMetric, year: number) {
  const exact = valueAtYear(metric, year);

  if (exact !== null) {
    return { value: exact, year, kind: "exact" as const };
  }

  const last = lastObservation(metric);

  if (last && last.year < year) {
    return { value: last.value, year: last.year, kind: "last" as const };
  }

  return null;
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

export function defaultYear(metrics: ShippedMetric[]) {
  const { minYear, maxYear } = yearBounds(metrics);
  const needed = Math.max(1, Math.ceil(metrics.length / 2));

  for (let year = maxYear; year >= minYear; year -= 1) {
    const coverage = metrics.filter((metric) =>
      metric.observations.some((point) => point.year === year),
    ).length;

    if (coverage >= needed) {
      return year;
    }
  }

  return maxYear;
}
