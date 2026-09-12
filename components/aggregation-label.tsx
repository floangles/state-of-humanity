"use client";

import { useLocale } from "@/components/locale-provider";
import { aggregationLong, aggregationShort } from "@/lib/i18n";
import type { Aggregation } from "@/lib/metrics-catalog";

type AggregationLabelProps = {
  aggregation: Aggregation;
  variant?: "short" | "long";
  className?: string;
};

export function AggregationLabel({
  aggregation,
  variant = "short",
  className,
}: AggregationLabelProps) {
  const { locale } = useLocale();
  const text =
    variant === "long"
      ? aggregationLong(aggregation, locale)
      : aggregationShort(aggregation, locale);

  return <p className={className}>{text}</p>;
}
