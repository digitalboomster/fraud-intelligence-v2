import { AlertsView } from "@/features/alerts/alerts-view";

export default async function AlertDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AlertsView focusId={id} />;
}
