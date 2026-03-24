import { EntityIndexView } from "@/features/entity/entity-index-view";
import { redirect } from "next/navigation";

export default async function EntityPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  if (params.id) {
    redirect(`/entity/${params.id}`);
  }
  return <EntityIndexView />;
}
