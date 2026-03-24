import { EntityView } from "@/features/entity/entity-view";

export default async function EntityDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ fromCase?: string; returnFrom?: "alerts" | "dashboard" | "case" }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  return <EntityView entityId={id} fromCaseId={query.fromCase} returnFrom={query.returnFrom} />;
}
