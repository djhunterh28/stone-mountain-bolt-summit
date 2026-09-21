import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getBootstrap, listEmails, listTemplates, sendEmail } from "@/lib/crm/server";
import { listBroadcasts, sendBroadcast } from "@/lib/crm/governance";
import { runAi } from "@/lib/crm/ai";
import { useUi } from "@/lib/crm/store";
import { formatDateTime } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/mail")({ component: MailPage });

function MailPage() {
  const [folder, setFolder] = useState("inbox");
  const emails = useQuery({ queryKey: ["emails", folder], queryFn: () => listEmails({ data: { folder } }) });
  const broadcasts = useQuery({ queryKey: ["broadcasts"], queryFn: () => listBroadcasts() });
  const templates = useQuery({ queryKey: ["templates"], queryFn: () => listTemplates() });
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const { memberId } = useUi();
  const me = boot.data?.members.find((m) => m.id === memberId);
  const qc = useQueryClient();
  const [openId, setOpenId] = useState<number | null>(null);
  const selected = emails.data?.find((e) => e.id === openId) ?? emails.data?.[0];
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("open-deals");

  async function draft() {
    const res = await runAi({
      data: {
        kind: "email",
        prompt: `Write a Northline sales email. Subject hint: ${subject || "follow up on a live event"}. To: ${to || "a producer in NYC"}.`,
      },
    });
    if (res.ok) setBody(res.text);
    else toast.error(res.error);
  }

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col">
      <PageHeader
        title="Mail"
        subtitle="Two-way sync, templates, tracking, and group email. 10 shared inboxes on Ultimate."
      />
      <div className="flex min-h-0 flex-1 flex-col border-t border-border lg:flex-row">
        <aside className="w-full shrink-0 border-b border-border lg:w-80 lg:border-r lg:border-b-0">
          <div className="p-3">
            <Tabs value={folder} onValueChange={setFolder}>
              <TabsList>
                {["inbox", "sent", "drafts", "shared", "broadcast"].map((f) => (
                  <TabsTrigger key={f} value={f} className="capitalize">
                    {f}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <ul className="max-h-64 overflow-y-auto lg:max-h-none lg:h-[calc(100%-3.5rem)]">
            {folder === "broadcast"
              ? (broadcasts.data ?? []).map((b) => (
                  <li key={b.id} className="border-t border-border px-4 py-3">
                    <div className="text-sm">{b.subject}</div>
                    <p className="text-xs text-muted-foreground">
                      {b.audience} · {b.sentCount} sent · {b.opened} opened
                    </p>
                  </li>
                ))
              : (emails.data ?? []).map((e) => (
              <li key={e.id}>
                <button
                  className="w-full border-t border-border px-4 py-3 text-left hover:bg-accent/40"
                  onClick={() => setOpenId(e.id)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm">{e.subject}</span>
                    {e.opened && <Badge variant="outline">opened</Badge>}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {e.fromName} · {formatDateTime(e.sentAt ?? e.createdAt)}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <section className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">
          {selected && folder !== "drafts" && (
            <article className="mb-8">
              <h2 className="text-base font-semibold">{selected.subject}</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {`${selected.fromName} <${selected.fromAddr}> → ${selected.toAddr}`}
                {selected.clicked ? " · clicked" : selected.opened ? " · opened" : ""}
              </p>
              <p className="mt-4 text-sm leading-relaxed">{selected.body}</p>
            </article>
          )}
          <div className="space-y-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">{folder === "broadcast" ? "Group email" : "Compose"}</h3>
              <Button size="sm" variant="ghost" onClick={draft}>
                <Sparkles className="size-3.5" />
                AI write
              </Button>
            </div>
            {folder === "broadcast" ? (
              <div className="flex flex-wrap gap-1">
                {[
                  ["open-deals", "Open deals"],
                  ["rotting", "Rotting"],
                  ["leads", "Leads"],
                ].map(([id, label]) => (
                  <Button key={id} size="sm" variant={audience === id ? "secondary" : "ghost"} onClick={() => setAudience(id)}>
                    {label}
                  </Button>
                ))}
              </div>
            ) : (
              <Input value={to} onChange={(e) => setTo(e.target.value)} placeholder="To" />
            )}
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
            <div className="flex flex-wrap gap-1">
              {(templates.data ?? []).map((t) => (
                <Button
                  key={t.id}
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSubject(t.subject);
                    setBody(t.body);
                  }}
                >
                  {t.name}
                </Button>
              ))}
            </div>
            <Textarea rows={6} value={body} onChange={(e) => setBody(e.target.value)} />
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  if (!me) return;
                  void sendEmail({
                    data: {
                      fromName: me.name,
                      fromAddr: me.email,
                      toAddr: to || "client@example.com",
                      subject: subject || "(no subject)",
                      body,
                      folder: "drafts",
                    },
                  }).then(() => {
                    toast.success("Saved draft");
                    qc.invalidateQueries({ queryKey: ["emails"] });
                  });
                }}
              >
                Save draft
              </Button>
              <Button
                onClick={() => {
                  if (!me) return;
                  if (folder === "broadcast") {
                    void sendBroadcast({
                      data: {
                        name: subject || "Broadcast",
                        subject: subject || "(no subject)",
                        body,
                        audience,
                        fromName: me.name,
                        fromAddr: me.email,
                      },
                    }).then((r) => {
                      if (!r.ok) toast.error(r.error ?? "Blocked");
                      else {
                        toast.success(`Sent to ${r.sent} contacts · tracking on`);
                        setBody("");
                        qc.invalidateQueries({ queryKey: ["broadcasts"] });
                        qc.invalidateQueries({ queryKey: ["emails"] });
                        qc.invalidateQueries({ queryKey: ["security"] });
                      }
                    });
                    return;
                  }
                  void sendEmail({
                    data: {
                      fromName: me.name,
                      fromAddr: me.email,
                      toAddr: to || "client@example.com",
                      subject: subject || "(no subject)",
                      body,
                    },
                  }).then(() => {
                    toast.success("Sent · tracking on");
                    setBody("");
                    qc.invalidateQueries({ queryKey: ["emails"] });
                  });
                }}
                disabled={!body}
              >
                {folder === "broadcast" ? "Send group" : "Send"}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
