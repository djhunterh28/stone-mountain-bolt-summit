import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { draftFromDeal, getAiDesk, markFinding, saveAiProfile } from "@/lib/crm/ops";
import { listDeals } from "@/lib/crm/server";

export const Route = createFileRoute("/ai")({ component: AiPage });

function AiPage() {
  const desk = useQuery({ queryKey: ["ai-desk"], queryFn: () => getAiDesk() });
  const deals = useQuery({ queryKey: ["deals", 1, "open"], queryFn: () => listDeals({ data: { pipelineId: 1, status: "open" } }) });
  const qc = useQueryClient();
  const p = desk.data?.profile;
  const [dealId, setDealId] = useState(1);
  const [prompt, setPrompt] = useState("Confirm load-in and ask if the dock is still 47th.");
  const [draft, setDraft] = useState<string | null>(null);

  return (
    <div className="pb-12">
      <PageHeader title="AI desk" subtitle="Company profile, one-click drafts, prep inspector, and the site chat widget." />
      <div className="px-4 sm:px-6">
        <Tabs defaultValue="draft">
          <TabsList className="flex h-auto flex-wrap">
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="prep">Prep inspector</TabsTrigger>
            <TabsTrigger value="profile">Company profile</TabsTrigger>
            <TabsTrigger value="widget">Chat widget</TabsTrigger>
          </TabsList>
          <TabsContent value="draft" className="mt-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Tone-matched to the company profile. Merge tags fill client, venue, date, AE, and signature. Edit before send.
            </p>
            <div className="flex flex-wrap gap-2">
              <select className="h-9 max-w-xs rounded-md border border-input bg-background px-2 text-sm" value={dealId} onChange={(e) => setDealId(Number(e.target.value))}>
                {(deals.data ?? []).map((d) => (
                  <option key={d.id} value={d.id}>{d.title}</option>
                ))}
              </select>
              <Input value={prompt} onChange={(e) => setPrompt(e.target.value)} className="max-w-md" />
              <Button
                size="sm"
                onClick={() =>
                  draftFromDeal({ data: { dealId, prompt } }).then((r) => {
                    if (r.ok) {
                      setDraft(r.body);
                      toast.success("Draft ready — still yours to send");
                      qc.invalidateQueries({ queryKey: ["ai-desk"] });
                    } else toast.error(r.error);
                  })
                }
              >
                One-click draft
              </Button>
            </div>
            {draft && <Textarea className="min-h-40 font-mono text-sm" value={draft} onChange={(e) => setDraft(e.target.value)} />}
            <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
              {(desk.data?.drafts ?? []).map((d) => (
                <li key={d.id} className="px-4 py-3 text-sm">
                  <span className="font-medium">{d.dealTitle}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{d.prompt}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="prep" className="mt-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Gaps on the record, plus read-only Gmail/Outlook comparisons. Findings stay marked until you verify. Nothing auto-applies.
            </p>
            <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
              {(desk.data?.findings ?? []).map((f) => (
                <li key={f.id} className="flex flex-wrap items-start gap-3 px-4 py-3">
                  <Badge variant={f.severity === "risk" ? "warn" : "outline"}>{f.kind}</Badge>
                  <div className="min-w-0 flex-1">
                    <Link to="/deals/$dealId" params={{ dealId: String(f.dealId) }} className="text-sm font-medium">
                      {f.dealTitle}
                    </Link>
                    <p className="text-sm text-muted-foreground">{f.detail}</p>
                    <p className="text-[11px] text-muted-foreground">{f.source === "email" ? "from connected mail" : "from the event record"}</p>
                  </div>
                  {f.verified ? (
                    <Badge variant="success">verified</Badge>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={() => markFinding({ data: { id: f.id, verified: true } }).then(() => qc.invalidateQueries({ queryKey: ["ai-desk"] }))}>
                      Verify
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => markFinding({ data: { id: f.id, dismissed: true } }).then(() => qc.invalidateQueries({ queryKey: ["ai-desk"] }))}>
                    Dismiss
                  </Button>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="profile" className="mt-4">
            {p && (
              <form
                className="grid max-w-xl gap-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]"
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  void saveAiProfile({
                    data: {
                      tone: String(fd.get("tone")),
                      specialties: String(fd.get("specialties")),
                      serviceArea: String(fd.get("serviceArea")),
                      greeting: String(fd.get("greeting")),
                      packages: String(fd.get("packages")),
                      portalDomain: String(fd.get("portalDomain") || p.portalDomain),
                    },
                  }).then(() => {
                    toast.success("Profile drives drafts and the widget");
                    qc.invalidateQueries({ queryKey: ["ai-desk"] });
                  });
                }}
              >
                <label className="text-sm">
                  Tone
                  <select name="tone" defaultValue={p.tone} className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2">
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="warm">Warm</option>
                    <option value="direct">Direct</option>
                  </select>
                </label>
                <label className="text-sm">Specialties<Input name="specialties" defaultValue={p.specialties} className="mt-1" /></label>
                <label className="text-sm">Service area<Input name="serviceArea" defaultValue={p.serviceArea} className="mt-1" /></label>
                <label className="text-sm">Greeting<Textarea name="greeting" defaultValue={p.greeting} className="mt-1" /></label>
                <label className="text-sm">Packages the widget may name<Input name="packages" defaultValue={JSON.stringify(p.packages)} className="mt-1" /></label>
                <label className="text-sm">White-label portal domain<Input name="portalDomain" defaultValue={p.portalDomain} className="mt-1" /></label>
                <Button type="submit" size="sm">Save profile</Button>
                <ul className="text-sm text-muted-foreground">
                  {p.faqs.map((f) => (
                    <li key={f.q}><span className="text-foreground">{f.q}</span> — {f.a}</li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground">White-label portal: {p.portalDomain}</p>
              </form>
            )}
          </TabsContent>
          <TabsContent value="widget" className="mt-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              One-line embed. Answers availability from the live calendar, captures a lead when they try to hold a date, branded with your greeting.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-card p-4 font-mono text-xs shadow-[var(--shadow-border)]">{`<script src="https://northline.av/w/${p?.widgetSlug ?? "northline"}" async></script>`}</pre>
            <Button asChild size="sm" variant="secondary">
              <Link to="/w/$slug" params={{ slug: p?.widgetSlug ?? "northline" }}>Open widget</Link>
            </Button>
            <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
              {(desk.data?.chats ?? []).map((c) => (
                <li key={c.id} className="px-4 py-2.5 text-sm">
                  {c.question}
                  <span className="ml-2 text-xs text-muted-foreground">{c.lead ? "lead captured" : c.answer.slice(0, 80)}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
