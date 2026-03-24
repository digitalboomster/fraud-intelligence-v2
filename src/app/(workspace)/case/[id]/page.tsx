import { CaseView } from "@/features/case/case-view";

export default async function CaseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: "alerts" | "dashboard" | "case" }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  return <CaseView caseId={id} from={query.from} />;
}
