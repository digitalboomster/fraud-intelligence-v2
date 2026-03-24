import { CaseIndexView } from "@/features/case/case-index-view";
import { redirect } from "next/navigation";

export default async function CasePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  if (params.id) {
    redirect(`/case/${params.id}`);
  }
  return <CaseIndexView />;
}
