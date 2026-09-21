import { createFileRoute } from "@tanstack/react-router";
import { DealWorkspace } from "@/components/pipeline/deal-drawer";

export const Route = createFileRoute("/deals/$dealId")({ component: DealPage });

function DealPage() {
  const { dealId } = Route.useParams();
  const id = Number(dealId);
  if (!Number.isFinite(id)) {
    return <div className="px-6 py-10 text-sm text-muted-foreground">Deal not found.</div>;
  }
  return <DealWorkspace dealId={id} />;
}
