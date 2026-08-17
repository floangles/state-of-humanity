import type { Category } from "@/lib/metrics-catalog";

export type Observation = {
  year: number;
  value: number;
};

export type ShippedMetric = {
  slug: string;
  name: string;
  shortLabel: string;
  unit: string;
  description: string;
  methodologyNote: string;
  category: Category;
  higherIsBetter: boolean;
  worldBankCode: string;
  decimals: number;
  sortOrder: number;
  source: {
    name: string;
    organization: string;
    homepageUrl: string;
    dataUrl: string;
    license: string;
    fetchedAt: string;
  };
  observations: Observation[];
};

export type DroppedMetric = {
  slug: string;
  worldBankCode: string;
  reason: string;
};

export type WorldSeriesSnapshot = {
  geography: {
    code: "WLD";
    name: "World";
    type: "world";
  };
  fetchedAt: string;
  metrics: ShippedMetric[];
  dropped: DroppedMetric[];
};
