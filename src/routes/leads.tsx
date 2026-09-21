import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MemberAvatar } from "@/components/crm/avatar";
import { convertLead, getBootstrap, listLeads, updateLead } from "@/lib/crm/server";
import { useUi } from "@/lib/crm/store";
import { formatDate } from "@/lib/utils";

export const Route = createFileRoute("/leads")({ component: LeadsPage });

function LeadsPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { setAddOpen } = useUi();
  const leads = useQuery({ queryKey: ["leads"], queryFn: () => listLeads() });
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const [filter, setFilter] = useState<string>("all");
  const pipe = boot.data?.pipelines[0];

  const convert = useMutation({
    mutationFn: (id: number) =>
      convertLead({ data: { id, pipelineId: pipe?.id ?? 1, stageId: pipe?.stages[0]?.id ?? 1 } }),
    onSuccess: (r) => {
      toast.success("Converted to deal");
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["deals"] });
      if (r.id) void navigate({ to: "/deals/$dealId", params: { dealId: String(r.id) } });
    },
  });

  const list = (leads.data ?? []).filter((l) => filter === "all" || l.status === filter);

  return (
    <div>
      <PageHeader
        title="Leads inbox"
        subtitle="Qualify inbound from forms, chat, prospector, and referrals."
        actions={
          <>
            <div className="flex gap-1">
              {["all", "new", "contacted", "qualified"].map((s) => (
                <Button key={s} size="sm" variant={filter === s ? "secondary" : "ghost"} onClick={() => setFilter(s)}>
                  {s}
                </Button>
              ))}
            </div>
            <Button size="sm" onClick={() => setAddOpen(true, "lead")}>
              New lead
            </Button>
          </>
        }
      />
      <div className="divide-y divide-border border-t border-border">
        {list.map((l) => (
          <article key={l.id} className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-medium">{l.title}</h2>
                <Badge variant={l.score >= 70 ? "success" : l.score >= 50 ? "steel" : "outline"}>
                  Score {l.score}
                </Badge>
                <Badge variant="outline">{l.source}</Badge>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {l.personName ?? "Unknown person"}
                {l.orgName ? ` · ${l.orgName}` : ""}
                {l.labels ? ` · ${l.labels}` : ""}
                · {formatDate(l.createdAt)}
              </p>
              {l.notes && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{l.notes}</p>}
            </div>
            <div className="flex items-center gap-2">
              {l.ownerInitials && <MemberAvatar initials={l.ownerInitials} tone={l.ownerTone} size="sm" />}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => updateLead({ data: { id: l.id, status: "contacted" } }).then(() => qc.invalidateQueries({ queryKey: ["leads"] }))}
              >
                Contacted
              </Button>
              <Button size="sm" variant="secondary" onClick={() => convert.mutate(l.id)}>
                Convert
              </Button>
            </div>
          </article>
        ))}
        {list.length === 0 && <p className="px-6 py-12 text-sm text-muted-foreground">Inbox is clear.</p>}
      </div>
    </div>
  );
}
