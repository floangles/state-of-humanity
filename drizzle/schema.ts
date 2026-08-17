import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum("metric_category", [
  "survival",
  "knowledge",
  "living",
  "planet",
]);

export const geographyTypeEnum = pgEnum("geography_type", [
  "world",
  "region",
  "country",
]);

export const sources = pgTable("sources", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  organization: text("organization").notNull(),
  homepageUrl: text("homepage_url").notNull(),
  dataUrl: text("data_url").notNull(),
  license: text("license").notNull(),
  fetchedAt: timestamp("fetched_at", { withTimezone: true }).notNull(),
});

export const geographies = pgTable("geographies", {
  code: text("code").primaryKey(),
  name: text("name").notNull(),
  type: geographyTypeEnum("type").notNull(),
});

export const metrics = pgTable(
  "metrics",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    shortLabel: text("short_label").notNull(),
    unit: text("unit").notNull(),
    description: text("description").notNull(),
    methodologyNote: text("methodology_note").notNull(),
    category: categoryEnum("category").notNull(),
    higherIsBetter: boolean("higher_is_better").notNull(),
    worldBankCode: text("world_bank_code").notNull(),
    decimals: integer("decimals").notNull(),
    sortOrder: integer("sort_order").notNull(),
    shipped: boolean("shipped").notNull().default(false),
    sourceId: text("source_id")
      .notNull()
      .references(() => sources.id),
  },
  (table) => [uniqueIndex("metrics_slug_idx").on(table.slug)],
);

export const observations = pgTable(
  "observations",
  {
    metricId: text("metric_id")
      .notNull()
      .references(() => metrics.id),
    geoCode: text("geo_code")
      .notNull()
      .references(() => geographies.code),
    year: integer("year").notNull(),
    value: numeric("value", { precision: 18, scale: 6 }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.metricId, table.geoCode, table.year] })],
);
