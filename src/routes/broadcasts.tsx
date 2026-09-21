import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getBroadcastDesk, importCold, promoteProspect, sendSms } from "@/lib/crm/ops";
import { listBroadcasts, sendBroadcast } from "@/lib/crm/governance";
import { listTemplates } from "@/lib/crm/server";

export const Route = createFileRoute("/broadcasts")({ component: BroadcastsPage });

function BroadcastsPage() {
  const desk = useQuery({ queryKey: ["bcast-desk"], queryFn: () => getBroadcastDesk() });
  const mail = useQuery({ queryKey: ["broadcasts"], queryFn: () => listBroadcasts() });
  const templates = useQuery({ queryKey: ["templates"], queryFn: () => listTemplates() });
  const qc = useQueryClient();

  return (
    <div className="pb-12">
      <PageHeader title="Broadcasts" subtitle="Client mail with CAN-SPAM, SMS via QUO, cold lists kept off the pipeline, sending domain, signatures." />
      <div className="px-4 sm:px-6">
        <Tabs defaultValue="mail">
          <TabsList className="flex h-auto flex-wrap">
            <TabsTrigger value="mail">Client mail</TabsTrigger>
            <TabsTrigger value="sms">SMS / QUO</TabsTrigger>
            <TabsTrigger value="cold">Cold lists</TabsTrigger>
            <TabsTrigger value="domain">Domain & signatures</TabsTrigger>
          </TabsList>
          <TabsContent value="mail" className="mt-4 space-y-3">
            <p className="text-sm text-muted-foreground">Full editor. Suppression honored. Start from a saved template.</p>
            <form
              className="space-y-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                void sendBroadcast({
                  data: {
                    name: String(fd.get("name") || "Broadcast"),
                    audience: "open-deals",
                    subject: String(fd.get("subject") || "From Northline"),
                    body: String(fd.get("body") || ""),
                    fromName: "Northline",
                    fromAddr: "hello@mail.northline.av",
                  },
                }).then((r) => {
                  if (!r.ok) toast.error(r.error ?? "Blocked");
                  else toast.success(`Queued ${r.sent} · CAN-SPAM footer attached`);
                  qc.invalidateQueries({ queryKey: ["broadcasts"] });
                });
              }}
            >
              <Input name="name" placeholder="Internal name" />
              <select name="tpl" className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm">
                {(templates.data ?? []).map((t) => (
                  <option key={t.id}>{t.name}</option>
                ))}
              </select>
              <Input name="subject" placeholder="Subject" />
              <Textarea name="body" placeholder="Body — the same composer as one-to-one mail" />
              <Button type="submit" size="sm">Send to client book</Button>
            </form>
            <ul className="text-sm text-muted-foreground">
              {(mail.data ?? []).map((b) => (
                <li key={b.id}>{b.name} · {b.sentCount} sent</li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="sms" className="mt-4 space-y-3">
            <form
              className="flex flex-wrap gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                void sendSms({ data: { personId: 1, body: String(fd.get("body") || "") } }).then((r) => {
                  if (!r.ok) toast.error(r.error);
                  else toast.success("QUO delivered");
                  qc.invalidateQueries({ queryKey: ["bcast-desk"] });
                });
              }}
            >
              <Input name="body" placeholder="Reminder, payment, or custom" className="max-w-md" />
              <Button type="submit" size="sm">Text Elena (opted in)</Button>
            </form>
            <div className="grid gap-3 lg:grid-cols-2">
              <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
                {(desk.data?.sms ?? []).map((s) => (
                  <li key={s.id} className="px-4 py-2.5 text-sm">
                    <span className="text-xs text-muted-foreground">{s.direction} · {s.person}</span>
                    <p>{s.body}</p>
                  </li>
                ))}
              </ul>
              <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
                {(desk.data?.optins ?? []).map((o) => (
                  <li key={o.name} className="flex justify-between px-4 py-2.5 text-sm">
                    {o.name}
                    <Badge variant={o.optedIn ? "success" : "warn"}>{o.optedIn ? "opted in" : "suppressed"}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="cold" className="mt-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Expo scans and bought lists never enter pipeline metrics. A reply promotes them to a dated lead. Deduped on email.
            </p>
            <form
              className="flex flex-wrap gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                void importCold({
                  data: {
                    listId: Number(fd.get("listId") || 1),
                    name: String(fd.get("name")),
                    email: String(fd.get("email")),
                    company: String(fd.get("company") || "") || undefined,
                  },
                }).then((r) => {
                  toast.success(r.deduped ? "Already on a list — skipped" : "Imported");
                  qc.invalidateQueries({ queryKey: ["bcast-desk"] });
                });
              }}
            >
              <select name="listId" className="h-9 rounded-md border border-input bg-background px-2 text-sm">
                {(desk.data?.lists ?? []).map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
              <Input name="name" placeholder="Name" className="w-36" />
              <Input name="email" placeholder="Email" className="w-44" />
              <Input name="company" placeholder="Company" className="w-36" />
              <Button type="submit" size="sm">Import</Button>
            </form>
            <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
              {(desk.data?.prospects ?? []).map((p) => (
                <li key={p.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                  <div className="flex-1">
                    {p.name} <span className="text-xs text-muted-foreground">{p.email} · {p.company}</span>
                  </div>
                  {p.promoted ? (
                    <Badge variant="success">lead</Badge>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={() => promoteProspect({ data: { id: p.id } }).then(() => { toast.success("Promoted from the reply"); qc.invalidateQueries({ queryKey: ["bcast-desk"] }); })}>
                      Treat reply as lead
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="domain" className="mt-4 space-y-3">
            {(desk.data?.domains ?? []).map((d) => (
              <article key={d.id} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
                <h2 className="text-sm font-medium">{d.domain}</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  SPF {d.spf ? "pass" : "fail"} · DKIM {d.dkim ? "pass" : "fail"} · DMARC {d.dmarc ? "pass" : "fail"} · applies to composed and workflow mail
                </p>
              </article>
            ))}
            {(desk.data?.signatures ?? []).map((s) => (
              <pre key={s.id} className="rounded-xl bg-card p-4 font-mono text-xs shadow-[var(--shadow-border)]">
                {s.member}{"\n"}{s.body}
              </pre>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
