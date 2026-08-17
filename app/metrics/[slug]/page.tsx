import { MetricStory } from "@/components/metric-story";
import { getShippedMetric, getShippedMetrics } from "@/lib/data";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const metrics = await getShippedMetrics();
  return metrics.map((metric) => ({ slug: metric.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/metrics/[slug]">) {
  const { slug } = await params;
  const metric = await getShippedMetric(slug);

  if (!metric) {
    return { title: "Metric not found" };
  }

  return {
    title: metric.name,
    description: metric.description,
  };
}

export default async function MetricPage({
  params,
}: PageProps<"/metrics/[slug]">) {
  const { slug } = await params;
  const metric = await getShippedMetric(slug);

  if (!metric) {
    notFound();
  }

  return <MetricStory metric={metric} />;
}
