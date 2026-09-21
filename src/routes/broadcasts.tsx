import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getBroadcastDesk } from "@/lib/crm/ops";
import { sendBroadcast } from "@/lib/crm/governance";
import { addSuppression, getBroadcastComposer, removeSuppression, saveBroadcastTemplate } from "@/lib/crm/broadcast";
import { RichTextEditor } from "@/components/crm/rich-text";
import { getActiveSender } from "@/lib/crm/domain";
import { getBootstrap } from "@/lib/crm/server";
import { runAi } from "@/lib/crm/ai";
import { useUi } from "@/lib/crm/store";
import { formatDateTime } from "@/lib/utils";

export const Route = createFileRoute("/broadcasts")({ component: BroadcastsPage });

function BroadcastsPage() {
  const desk = useQuery({ queryKey: ["bcast-desk"], queryFn: () => getBroadcastDesk() });
  const qc = useQueryClient();

  return (
    <div className="pb-12">
      <PageHeader
        title="Broadcasts"
        subtitle="The same composer as one-to-one mail, aimed at the client book. CAN-SPAM footer on every send. Suppression honored everywhere."
      />
      <div className="px-4 sm:px-6">
        <Tabs defaultValue="mail">
          <TabsList className="flex h-auto flex-wrap">
            <TabsTrigger value="mail">Client mail</TabsTrigger>
            <TabsTrigger value="sms">SMS / QUO</TabsTrigger>
            <TabsTrigger value="cold">Cold lists</TabsTrigger>
            <TabsTrigger value="domain">Domain & signatures</TabsTrigger>
          </TabsList>
          <TabsContent value="mail" className="mt-4">
            <ClientMailDesk />
          </TabsContent>
          <TabsContent value="sms" className="mt-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Event reminders, payment confirmations, status updates, and custom texts go out through QUO. STOP is honored on every send.
            </p>
            <Button asChild size="sm" variant="secondary">
              <Link to="/sms">Open SMS desk</Link>
            </Button>
          </TabsContent>
          <TabsContent value="cold" className="mt-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Expo scans and bought lists never enter pipeline metrics. Import, tag campaigns, and reply-to-lead live on the
              cold desk.
            </p>
            <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
              {(desk.data?.lists ?? []).map((l) => (
                <li key={l.id} className="flex justify-between px-4 py-2.5 text-sm">
                  <span>{l.name}</span>
                  <span className="text-xs text-muted-foreground">{l.n} names</span>
                </li>
              ))}
            </ul>
            <Button asChild size="sm" variant="secondary">
              <Link to="/cold">Open cold lists</Link>
            </Button>
          </TabsContent>
          <TabsContent value="domain" className="mt-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Broadcasts leave from the live sending domain. DNS, identities, and apply-toggles live on the sending domain
              desk.
            </p>
            {(desk.data?.domains ?? []).map((d) => (
              <article key={d.id} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h2 className="text-sm font-medium">{d.domain}</h2>
                  <Badge variant={d.active ? "success" : "outline"}>{d.active ? "live" : "idle"}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  SPF {d.spf ? "pass" : "fail"} · DKIM {d.dkim ? "pass" : "fail"} · DMARC {d.dmarc ? "pass" : "fail"}
                </p>
              </article>
            ))}
            <Button asChild size="sm" variant="secondary">
              <Link to="/domain">Open sending domain</Link>
            </Button>
            {(desk.data?.signatures ?? []).map((s) => (
              <pre key={s.id} className="rounded-xl bg-card p-4 font-mono text-xs shadow-[var(--shadow-border)]">
                {s.member}
                {"\n"}
                {s.body}
              </pre>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ClientMailDesk() {
  const book = useQuery({ queryKey: ["bcast-composer"], queryFn: () => getBroadcastComposer() });
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const { memberId } = useUi();
  const me = boot.data?.members.find((m) => m.id === memberId);
  const sender = useQuery({
    queryKey: ["active-sender", memberId, me?.email, "workflow"],
    queryFn: () =>
      getActiveSender({ data: { purpose: "workflow", memberId, hintAddr: "shows@hurricaneproductionsllc.com", fallbackName: "Northline Shows" } }),
    enabled: Boolean(me),
  });
  const qc = useQueryClient();
  const [audience, setAudience] = useState("clients");
  const [name, setName] = useState("Season hold note");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [templateId, setTemplateId] = useState<number | null>(null);

  function refresh() {
    void qc.invalidateQueries({ queryKey: ["bcast-composer"] });
    void qc.invalidateQueries({ queryKey: ["broadcasts"] });
    void qc.invalidateQueries({ queryKey: ["emails"] });
  }

  const d = book.data;
  const picked = d?.audiences.find((a) => a.id === audience);
  const signature = d?.signatures[0]?.body ?? "";

  async function draft() {
    const res = await runAi({
      data: {
        kind: "email",
        prompt: `Write a Northline client broadcast. Subject hint: ${subject || "season holds still open"}. Audience: ${picked?.label ?? "the client book"}. Keep merge tags {{first_name}} where a greeting belongs.`,
      },
    });
    if (res.ok) setBody(res.text);
    else toast.error(res.error);
  }

  return (
    <div className="space-y-4">
      {book.isLoading || !d ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Client book" value={String(d.stats.book)} hint="People with an email" />
          <Stat label="Ready" value={String(picked?.ready ?? d.stats.ready)} hint={picked?.label ?? "Whole book"} />
          <Stat label="Suppressed" value={String(d.stats.held)} hint="Honored on every send" />
          <Stat label="Sent" value={String(d.stats.sent)} hint="Historical client mail" />
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <section className="space-y-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-medium">Composer</h2>
            <Button size="sm" variant="ghost" onClick={() => void draft()}>
              <Sparkles className="size-3.5" />
              AI write
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Same editor as one-to-one mail. Templates fill subject and body. Signature and CAN-SPAM footer attach on send —
            they are not optional.
          </p>
          <div>
            <Label htmlFor="bcast-name">Internal name</Label>
            <Input id="bcast-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Start from a template</Label>
            <div className="mt-1 flex flex-wrap gap-1">
              {(d?.templates ?? []).map((t) => (
                <Button
                  key={t.id}
                  size="sm"
                  variant={templateId === t.id ? "secondary" : "ghost"}
                  onClick={() => {
                    setTemplateId(t.id);
                    setSubject(t.subject);
                    setBody(t.body);
                    setName(t.name);
                  }}
                >
                  {t.name}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="bcast-subject">Subject</Label>
            <Input
              id="bcast-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Hold dates still open"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Body</Label>
            <div className="mt-1">
              <RichTextEditor value={body} onChange={setBody} placeholder="Hi {{first_name}} —" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Full editor. Merge tags: first_name, name, venue, deal. Resolved per recipient.
            </p>
          </div>
          {signature && (
            <pre className="rounded-lg bg-secondary p-3 font-mono text-xs text-muted-foreground">{signature}</pre>
          )}
          <div className="rounded-lg bg-secondary p-3 text-xs leading-relaxed text-muted-foreground">
            <div className="font-medium text-foreground">CAN-SPAM footer — attached on every send</div>
            <p className="mt-1">
              {d?.company ?? "Hurricane Productions"}
              <br />
              {d?.address ?? "247 3rd Street, Brooklyn, NY 11215"}
              <br />
              This is a commercial message from our client book.
              <br />
              Unsubscribe: unique link per recipient
            </p>
          </div>
          {sender.data?.authenticated && (
            <p className="text-xs text-muted-foreground">
              Sending as {sender.data.fromName} · {sender.data.fromAddr} · SPF / DKIM / DMARC aligned
            </p>
          )}
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              {picked ? `${picked.ready} will receive · ${picked.suppressed} held on the suppression list` : "Pick an audience"}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="secondary"
                disabled={!subject.trim() || !body.trim()}
                onClick={() =>
                  saveBroadcastTemplate({ data: { name, subject, body } }).then((r) => {
                    if (!r.ok) toast.error(r.error ?? "Not saved");
                    else {
                      toast.success("Saved as a template");
                      setTemplateId(r.id);
                      refresh();
                    }
                  })
                }
              >
                Save as template
              </Button>
              <Button
                size="sm"
                disabled={!subject.trim() || !body.trim() || !picked?.ready || !me}
                onClick={() => {
                  if (!me) return;
                  void sendBroadcast({
                    data: {
                      name,
                      subject,
                      body,
                      audience,
                      fromName: sender.data?.fromName ?? me.name,
                      fromAddr: sender.data?.fromAddr ?? me.email,
                      memberId: me.id,
                      templateId,
                    },
                  }).then((r) => {
                    if (!r.ok) toast.error(r.error ?? "Blocked");
                    else {
                      toast.success(`Queued ${r.sent} · ${r.suppressed} suppressed · CAN-SPAM footer attached`);
                      refresh();
                    }
                  });
                }}
              >
                Send to {picked?.label ?? "client book"}
              </Button>
            </div>
          </div>
        </section>

        <div className="space-y-4">
          <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
            <h2 className="text-sm font-medium">Audience</h2>
            <p className="mt-1 text-xs text-muted-foreground">Cold lists are not in this book.</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {(d?.audiences ?? []).map((a) => (
                <Button key={a.id} size="sm" variant={audience === a.id ? "secondary" : "ghost"} onClick={() => setAudience(a.id)}>
                  {a.label}
                </Button>
              ))}
            </div>
            {picked && (
              <>
                <p className="mt-3 text-xs text-muted-foreground">
                  {picked.hint} · {picked.total} unique · {picked.suppressed} suppressed
                </p>
                <ul className="mt-2 divide-y divide-border rounded-lg bg-secondary">
                  {picked.preview.map((p) => (
                    <li key={p.email} className="px-3 py-2 text-sm">
                      <div className="truncate">{p.name}</div>
                      <p className="truncate text-xs text-muted-foreground">{p.email}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>

          <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
            <h2 className="text-sm font-medium">Suppression list</h2>
            <p className="mt-1 text-xs text-muted-foreground">Honored on client mail, group mail, and every future send.</p>
            <ul className="mt-3 divide-y divide-border">
              {(d?.suppressed ?? []).map((s) => (
                <li key={s.id} className="flex items-start justify-between gap-2 py-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm">{s.name ?? s.email}</div>
                    <p className="truncate text-xs text-muted-foreground">
                      {s.email} · {s.reason}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => removeSuppression({ data: { id: s.id } }).then(refresh)}>
                    Restore
                  </Button>
                </li>
              ))}
            </ul>
            <form
              className="mt-3 grid gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                void addSuppression({
                  data: {
                    email: String(fd.get("email") || ""),
                    name: String(fd.get("name") || "") || undefined,
                    reason: String(fd.get("reason") || "") || undefined,
                  },
                }).then((r) => {
                  if (!r.ok) toast.error(r.error ?? "Could not add");
                  else {
                    toast.success("On the suppression list — next send will skip them");
                    e.currentTarget.reset();
                    refresh();
                  }
                });
              }}
            >
              <Input name="email" placeholder="email" required />
              <div className="flex flex-wrap gap-2">
                <Input name="name" placeholder="Name" className="w-32" />
                <Input name="reason" placeholder="Reason" className="w-36" />
                <Button type="submit" size="sm" variant="secondary">
                  Suppress
                </Button>
              </div>
            </form>
          </section>
        </div>
      </div>

      <section>
        <h2 className="text-sm font-medium">Sent</h2>
        <ul className="mt-3 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
          {(d?.broadcasts ?? []).length === 0 && (
            <li className="px-4 py-3 text-sm text-muted-foreground">No client broadcasts yet.</li>
          )}
          {(d?.broadcasts ?? []).map((b) => (
            <li key={b.id} className="flex flex-wrap items-start gap-2 px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm">{b.name}</div>
                <p className="truncate text-xs text-muted-foreground">
                  {b.subject} · {b.audience}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                {b.sentCount} sent · {b.suppressedCount} suppressed · {b.opened} opened
              </span>
              <span className="text-xs text-muted-foreground">{formatDateTime(b.createdAt)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <article className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
      <div className="text-xs tracking-wide text-muted-foreground uppercase">{label}</div>
      <div className="mt-2 font-mono text-2xl tabular-nums">{value}</div>
      <p className="mt-1 truncate text-xs text-muted-foreground">{hint}</p>
    </article>
  );
}
