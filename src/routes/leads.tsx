import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadKanban } from "@/components/crm/lifecycle";
import { LeadBoosterPanel } from "@/components/crm/leadbooster-panel";
import { getBootstrap, listLeads } from "@/lib/crm/server";
import { useUi } from "@/lib/crm/store";

export const Route = createFileRoute("/leads")({
  validateSearch: (s: Record<string, unknown>): { tab?: string } => ({
    tab: typeof s.tab === "string" ? s.tab : undefined,
  }),
  component: LeadsPage,
});

function LeadsPage() {
  const { tab } = Route.useSearch();
  const navigate = useNavigate({ from: "/leads" });
  const { setAddOpen } = useUi();
  const leads = useQuery({ queryKey: ["leads"], queryFn: () => listLeads() });
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const pipe = boot.data?.pipelines[0];
  const list = leads.data ?? [];
  const active = list.filter((l) => l.status !== "converted" && l.status !== "disqualified").length;
  const current = tab === "booster" ? "booster" : "inbox";

  return (
    <div className="pb-8">
      <PageHeader
        title={current === "booster" ? "LeadBooster" : "Leads inbox"}
        subtitle={
          current === "booster"
            ? "Chatbots, live chat, and web forms on the lead desk."
            : "Multi-stage: new → contacted → qualified → nurture or convert. Disqualify what is not our work."
        }
        actions={
          current === "inbox" ? (
            <>
              <span className="text-xs text-muted-foreground">{active} in play</span>
              <Button size="sm" onClick={() => setAddOpen(true, "lead")}>
                New lead
              </Button>
            </>
          ) : undefined
        }
      />
      <div className="px-4 sm:px-6">
        <Tabs
          value={current}
          onValueChange={(v) => void navigate({ search: { tab: v === "inbox" ? undefined : v } })}
        >
          <TabsList>
            <TabsTrigger value="inbox">Inbox</TabsTrigger>
            <TabsTrigger value="booster">LeadBooster</TabsTrigger>
          </TabsList>
          <TabsContent value="inbox" className="mt-4">
            {leads.isLoading ? (
              <p className="py-12 text-sm text-muted-foreground">Loading the inbox…</p>
            ) : (
              <LeadKanban leads={list} pipeline={pipe} />
            )}
          </TabsContent>
          <TabsContent value="booster" className="mt-4">
            <LeadBoosterPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
