import { localeNumberFormat, type Locale } from "@/lib/i18n";
import type { ShippedMetric } from "@/lib/types";

export function formatMetricValue(
  value: number,
  decimals: number,
  locale: Locale = "en",
) {
  const localeTag = localeNumberFormat(locale);

  if (Math.abs(value) >= 1_000_000_000) {
    return new Intl.NumberFormat(localeTag, {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 2,
    }).format(value);
  }

  return new Intl.NumberFormat(localeTag, {
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

  if (delta === 0) {
    return {
      fromYear: first.year,
      fromValue: first.value,
      toYear: year,
      toValue: current,
      delta,
      direction: "unchanged" as const,
    };
  }

  if (metric.higherIsBetter === null) {
    return {
      fromYear: first.year,
      fromValue: first.value,
      toYear: year,
      toValue: current,
      delta,
      direction: "neutral" as const,
    };
  }

  const improved = metric.higherIsBetter ? delta > 0 : delta < 0;

  return {
    fromYear: first.year,
    fromValue: first.value,
    toYear: year,
    toValue: current,
    delta,
    direction: improved ? ("better" as const) : ("worse" as const),
  };
}

export type Trend = NonNullable<ReturnType<typeof trendForYear>>;

export function trendLabel(
  direction: Trend["direction"],
  labels: {
    better: string;
    worse: string;
    unchanged: string;
    neutral: string;
  },
) {
  return labels[direction];
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
