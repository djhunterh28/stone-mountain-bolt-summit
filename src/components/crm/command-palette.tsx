import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUi } from "@/lib/crm/store";
import { getBootstrap, listDeals, listPeople } from "@/lib/crm/server";

const PAGES = [
  { label: "Home", to: "/home" },
  { label: "Pipeline", to: "/" },
  { label: "Leads inbox", to: "/leads" },
  { label: "Event lifecycle", to: "/lifecycle" },
  { label: "Pulse", to: "/pulse" },
  { label: "Client registry", to: "/registry" },
  { label: "Calendar", to: "/activities" },
  { label: "Projects", to: "/projects" },
  { label: "Insights", to: "/insights" },
  { label: "Goals", to: "/goals" },
  { label: "Mail", to: "/mail" },
  { label: "Sending domain", to: "/domain" },
  { label: "Documents", to: "/documents" },
  { label: "Products", to: "/products" },
  { label: "Automations", to: "/automations" },
  { label: "Sequences", to: "/sequences" },
  { label: "Live inbox", to: "/inbox" },
  { label: "LeadBooster", to: "/leadbooster" },
  { label: "Chatbot", to: "/chatbot" },
  { label: "Forms", to: "/forms" },
  { label: "Prospector", to: "/prospector" },
  { label: "Scheduler", to: "/scheduler" },
  { label: "Google Meet", to: "/integrations" },
  { label: "Marketplace", to: "/settings?tab=marketplace" },
  { label: "Forecast", to: "/forecast" },
  { label: "Display boards", to: "/boards" },
  { label: "Mileage & travel", to: "/travel" },
  { label: "Import / export", to: "/settings?tab=import" },
  { label: "Sandbox", to: "/settings?tab=sandbox" },
  { label: "Developers", to: "/developers" },
  { label: "Integrations", to: "/integrations" },
  { label: "Settings", to: "/settings" },
  { label: "Sidebar layout", to: "/settings?tab=sidebar" },
  { label: "Security", to: "/settings?tab=security" },
  { label: "Files", to: "/files" },
  { label: "Approvals", to: "/approvals" },
  { label: "Tasks", to: "/tasks" },
  { label: "E-sign", to: "/esign" },
  { label: "Proposals", to: "/proposals" },
  { label: "Admin", to: "/settings?tab=admin" },
  { label: "Profile", to: "/profile" },
  { label: "Bookmarks", to: "/bookmarks" },
  { label: "AI desk", to: "/ai" },
  { label: "Business health", to: "/health" },
  { label: "Finance", to: "/finance" },
  { label: "Quotes", to: "/quotes" },
  { label: "Broadcasts", to: "/broadcasts" },
  { label: "Sending domain", to: "/domain" },
  { label: "Portal domain", to: "/portal-domain" },
  { label: "Client portal", to: "/client-portal" },
  { label: "SMTP", to: "/smtp" },
  { label: "SMS via QUO", to: "/sms" },
  { label: "Cold lists", to: "/cold" },
  { label: "Crew & calendar", to: "/crew" },
  { label: "Unique views", to: "/views" },
  { label: "Guest lists", to: "/guests" },
  { label: "Floor plan designer", to: "/floorplans" },
  { label: "Reviews & reputation", to: "/reviews" },
  { label: "Event hand-off", to: "/handoff" },
  { label: "Directory", to: "/discover" },
];

export function CommandPalette() {
  const { commandOpen, setCommandOpen, setAddOpen } = useUi();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const deals = useQuery({
    queryKey: ["deals", 1, "all"],
    queryFn: () => listDeals({ data: { pipelineId: 1, status: "all" } }),
    enabled: commandOpen,
  });
  const people = useQuery({
    queryKey: ["people"],
    queryFn: () => listPeople(),
    enabled: commandOpen,
  });
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });

  useEffect(() => {
    if (!commandOpen) setQ("");
  }, [commandOpen]);

  const query = q.trim().toLowerCase();
  const items = useMemo(() => {
    const out: { group: string; label: string; run: () => void }[] = [];
    const go = (to: string) => {
      setCommandOpen(false);
      const deal = to.match(/^\/deals\/(\d+)/)?.[1];
      if (deal) {
        void navigate({ to: "/deals/$dealId", params: { dealId: deal } });
        return;
      }
      const qIx = to.indexOf("?");
      if (qIx >= 0) {
        const path = to.slice(0, qIx);
        const params = Object.fromEntries(new URLSearchParams(to.slice(qIx + 1)));
        void navigate({ to: path as "/", search: params });
        return;
      }
      void navigate({ to: to as "/" });
    };
    if (!query || "new deal".includes(query))
      out.push({ group: "Create", label: "New deal", run: () => { setCommandOpen(false); setAddOpen(true, "deal"); } });
    if (!query || "new lead".includes(query))
      out.push({ group: "Create", label: "New lead", run: () => { setCommandOpen(false); setAddOpen(true, "lead"); } });
    for (const p of PAGES) {
      if (!query || p.label.toLowerCase().includes(query))
        out.push({ group: "Go to", label: p.label, run: () => go(p.to) });
    }
    for (const d of deals.data ?? []) {
      if (query && `${d.title} ${d.orgName ?? ""} ${d.venue ?? ""}`.toLowerCase().includes(query))
        out.push({ group: "Deals", label: d.title, run: () => go(`/deals/${d.id}`) });
    }
    for (const p of people.data ?? []) {
      if (query && `${p.name} ${p.orgName ?? ""}`.toLowerCase().includes(query))
        out.push({
          group: "People",
          label: p.name,
          run: () => {
            setCommandOpen(false);
            void navigate({ to: "/contacts/$personId", params: { personId: String(p.id) } });
          },
        });
    }
    for (const m of boot.data?.members ?? []) {
      if (query && m.name.toLowerCase().includes(query))
        out.push({ group: "Team", label: m.name, run: () => go("/settings") });
    }
    return out.slice(0, 18);
  }, [query, deals.data, people.data, boot.data, navigate, setAddOpen, setCommandOpen]);

  return (
    <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
      <DialogContent className="max-w-lg p-0">
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <Input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Jump to a deal, person, or page"
          className="h-12 rounded-b-none border-0 shadow-none"
        />
        <div className="max-h-80 overflow-y-auto p-1">
          {items.length === 0 && (
            <p className="px-3 py-6 text-sm text-muted-foreground">Nothing matches.</p>
          )}
          {items.map((item, i) => (
            <button
              key={`${item.group}-${item.label}-${i}`}
              className="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm hover:bg-accent"
              onClick={item.run}
            >
              <span>{item.label}</span>
              <span className="text-[11px] text-muted-foreground">{item.group}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
