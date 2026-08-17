import { HumanityExplorer } from "@/components/humanity-explorer";
import { loadWorldSeries } from "@/lib/data";

export const dynamic = "force-static";

export default async function HomePage() {
  const snapshot = await loadWorldSeries();

  return <HumanityExplorer snapshot={snapshot} />;
}
