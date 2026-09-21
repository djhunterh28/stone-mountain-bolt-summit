import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { LeadKanban } from "@/components/crm/lifecycle";
import { getBootstrap, listLeads } from "@/lib/crm/server";
import { useUi } from "@/lib/crm/store";

export const Route = createFileRoute("/leads")({ component: LeadsPage });

function LeadsPage() {
  const { setAddOpen } = useUi();
  const leads = useQuery({ queryKey: ["leads"], queryFn: () => listLeads() });
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const pipe = boot.data?.pipelines[0];
  const list = leads.data ?? [];
  const active = list.filter((l) => l.status !== "converted" && l.status !== "disqualified").length;

  return (
    <div className="pb-8">
      <PageHeader
        title="Leads inbox"
        subtitle="Multi-stage: new → contacted → qualified → nurture or convert. Disqualify what is not our work."
        actions={
          <>
            <span className="text-xs text-muted-foreground">{active} in play</span>
            <Button size="sm" onClick={() => setAddOpen(true, "lead")}>
              New lead
            </Button>
          </>
        }
      />
      <div className="px-4 sm:px-6">
        {leads.isLoading ? (
          <p className="py-12 text-sm text-muted-foreground">Loading the inbox…</p>
        ) : (
          <LeadKanban leads={list} pipeline={pipe} />
        )}
      </div>
    </div>
  );
}
