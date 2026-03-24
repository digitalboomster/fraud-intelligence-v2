import { AlertsView } from "@/features/alerts/alerts-view";
import { redirect } from "next/navigation";

export default async function AlertsPage({
  searchParams,
}: {
  searchParams: Promise<{ focus?: string }>;
}) {
  const params = await searchParams;
  if (params.focus) {
    redirect(`/alerts/${params.focus}`);
  }
  return <AlertsView focusId={params.focus} />;
}
