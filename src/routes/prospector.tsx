import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addProspect, listProspects } from "@/lib/crm/server";
import { useUi } from "@/lib/crm/store";

export const Route = createFileRoute("/prospector")({ component: ProspectorPage });

function ProspectorPage() {
  const list = useQuery({ queryKey: ["prospects"], queryFn: () => listProspects() });
  const qc = useQueryClient();
  const { memberId } = useUi();
  const [q, setQ] = useState("");
  const rows = (list.data ?? []).filter((p) =>
    `${p.name} ${p.industry ?? ""} ${p.city ?? ""}`.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <div className="pb-12">
      <PageHeader
        title="Prospector"
        subtitle="NYC venues and brands with contact enrichment. 500 credits on Ultimate."
        actions={<Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the graph" className="h-9 w-52" />}
      />
      <ul className="divide-y divide-border border-t border-border">
        {rows.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium">{p.name}</div>
              <p className="text-xs text-muted-foreground">
                {p.industry} · {p.city} · {p.employees} · {p.email}
              </p>
            </div>
            {p.added ? (
              <Badge variant="success">In CRM</Badge>
            ) : (
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  addProspect({ data: { id: p.id, ownerId: memberId } }).then(() => {
                    toast.success("Added as lead");
                    qc.invalidateQueries({ queryKey: ["prospects"] });
                    qc.invalidateQueries({ queryKey: ["leads"] });
                    qc.invalidateQueries({ queryKey: ["orgs"] });
                  })
                }
              >
                Add + enrich
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
