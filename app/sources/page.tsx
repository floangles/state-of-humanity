import type { Metadata } from "next";

import { SourcesList } from "@/components/sources-list";
import { loadWorldSeries } from "@/lib/data";

export const metadata: Metadata = {
  title: "Sources",
  description:
    "Official producers, WDI codes, licenses, and last ingest date for every shipped World series.",
};

export const dynamic = "force-static";

export default async function SourcesPage() {
  const snapshot = await loadWorldSeries();

  return <SourcesList snapshot={snapshot} />;
}
