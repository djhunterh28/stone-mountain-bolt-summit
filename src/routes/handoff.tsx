import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getHandoffs, sendHandoff } from "@/lib/crm/ops";
import { listDeals } from "@/lib/crm/server";
import { formatUsd } from "@/lib/utils";

export const Route = createFileRoute("/handoff")({ component: HandoffPage });

function HandoffPage() {
  const rows = useQuery({ queryKey: ["handoffs"], queryFn: () => getHandoffs() });
  const deals = useQuery({ queryKey: ["deals", 1, "open"], queryFn: () => listDeals({ data: { pipelineId: 1, status: "open" } }) });
  const qc = useQueryClient();
  return (
    <div className="pb-12">
      <PageHeader title="Event hand-off" subtitle="Sub-contract or emergency transfer. Production data only — financials stay here. Monitor stays on." />
      <form
        className="mx-4 mb-4 flex flex-wrap gap-2 sm:mx-6"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          void sendHandoff({
            data: { dealId: Number(fd.get("dealId")), to: String(fd.get("to")), monitor: true },
          }).then(() => {
            toast.success("Packed without invoices or rates");
            qc.invalidateQueries({ queryKey: ["handoffs"] });
          });
        }}
      >
        <select name="dealId" className="h-9 rounded-md border border-input bg-background px-2 text-sm">
          {(deals.data ?? []).map((d) => (
            <option key={d.id} value={d.id}>{d.title}</option>
          ))}
        </select>
        <Input name="to" placeholder="Receiving company" className="w-56" required />
        <Button type="submit" size="sm">Hand off</Button>
      </form>
      <ul className="mx-4 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)] sm:mx-6">
        {(rows.data ?? []).map((h) => (
          <li key={h.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
            <div className="flex-1">
              {h.deal}
              <p className="text-xs text-muted-foreground">to {h.to} · house value {formatUsd(h.value)} not sent</p>
            </div>
            <Badge variant="outline">{h.finance ? "includes $ " : "no financials"}</Badge>
            <Badge variant={h.monitor ? "success" : "outline"}>{h.monitor ? "monitoring" : h.status}</Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}
