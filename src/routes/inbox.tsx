import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getUnifiedInbox, logInboxNote, replyInbox, type InboxChannel } from "@/lib/crm/inbox";
import { getBootstrap } from "@/lib/crm/server";
import { useUi } from "@/lib/crm/store";
import { formatDateTime, formatUsd } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/inbox")({ component: InboxPage });

const FILTERS: { id: "all" | InboxChannel; label: string }[] = [
  { id: "all", label: "All" },
  { id: "email", label: "Email" },
  { id: "sms", label: "SMS" },
  { id: "chat", label: "Chat" },
];

function InboxPage() {
  const box = useQuery({ queryKey: ["unified-inbox"], queryFn: () => getUnifiedInbox() });
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const qc = useQueryClient();
  const { memberId } = useUi();
  const me = boot.data?.members.find((m) => m.id === memberId);
  const [id, setId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | InboxChannel>("all");
  const [q, setQ] = useState("");
  const [text, setText] = useState("");
  const [note, setNote] = useState("");
  const [replyOn, setReplyOn] = useState<InboxChannel | null>(null);
  const [pane, setPane] = useState<"list" | "thread">("list");

  const threads = useMemo(() => {
    const list = box.data?.threads ?? [];
    return list.filter((t) => {
      if (filter !== "all" && !t.channels.includes(filter)) return false;
      if (!q.trim()) return true;
      const hay = `${t.title} ${t.subtitle} ${t.preview}`.toLowerCase();
      return hay.includes(q.trim().toLowerCase());
    });
  }, [box.data?.threads, filter, q]);

  const current = threads.find((t) => t.id === id) ?? threads[0];
  const channel: InboxChannel = replyOn ?? current?.channels[0] ?? "email";
  const bubbles =
    filter === "all" || !current ? (current?.messages ?? []) : (current?.messages.filter((m) => m.channel === filter) ?? []);

  function refresh() {
    void qc.invalidateQueries({ queryKey: ["unified-inbox"] });
  }

  async function reply() {
    const body = text.trim();
    if (!body || !current || !me) return;
    setText("");
    const r = await replyInbox({
      data: {
        channel,
        body,
        dealId: current.dealId,
        personId: current.personId,
        toAddr: current.toAddr,
        chatId: current.chatId,
        memberId: me.id,
        fromName: me.name,
        fromAddr: me.email,
        subject: current.kind === "event" ? `Re: ${current.title}` : `Re: ${current.title}`,
      },
    });
    if (!r.ok) return toast.error(r.error ?? "Not sent");
    toast.success(`${channel} logged`);
    refresh();
  }

  const stats = box.data?.stats;

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col">
      <PageHeader
        title="Unified inbox"
        subtitle="Email and SMS in one chat. Threads follow the event. Client context and the activity log stay on the right."
        actions={
          stats ? (
            <span className="text-xs text-muted-foreground">
              {stats.unread} waiting · {stats.events} shows · {stats.sms} with SMS
            </span>
          ) : null
        }
      />
      <div className="flex min-h-0 flex-1 border-t border-border">
        <aside
          className={cn(
            "w-full shrink-0 flex-col overflow-hidden border-r border-border sm:flex sm:w-72",
            pane === "thread" ? "hidden sm:flex" : "flex",
          )}
        >
          <div className="space-y-2 border-b border-border p-3">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a show or person" />
            <div className="flex flex-wrap gap-1">
              {FILTERS.map((f) => (
                <Button key={f.id} size="sm" variant={filter === f.id ? "secondary" : "ghost"} onClick={() => setFilter(f.id)}>
                  {f.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {threads.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setId(t.id);
                  setReplyOn(t.channels.includes("sms") && filter === "sms" ? "sms" : t.channels[0] ?? "email");
                  setPane("thread");
                }}
                className={cn(
                  "w-full border-b border-border px-4 py-3 text-left hover:bg-accent/40",
                  current?.id === t.id && "bg-accent",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium">{t.title}</span>
                  {t.unread && <span className="size-1.5 shrink-0 rounded-full bg-primary" />}
                </div>
                <p className="truncate text-xs text-muted-foreground">{t.subtitle || t.preview}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {t.channels.map((c) => (
                    <Badge key={c} variant="outline">
                      {c}
                    </Badge>
                  ))}
                  {t.kind === "event" && <Badge variant="steel">event</Badge>}
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section className={cn("min-w-0 flex-1 flex-col", pane === "list" ? "hidden sm:flex" : "flex")}>
          {current ? (
            <>
              <div className="flex items-start justify-between gap-2 border-b border-border px-4 py-3">
                <div className="min-w-0">
                  <button type="button" className="text-xs text-muted-foreground sm:hidden" onClick={() => setPane("list")}>
                    Back to threads
                  </button>
                  <div className="truncate text-sm font-medium">{current.title}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {current.personName}
                    {current.orgName ? ` · ${current.orgName}` : ""}
                    {current.dealTitle ? ` · ${current.dealTitle}` : ""}
                  </div>
                </div>
                <div className="flex gap-1">
                  {current.channels.map((c) => (
                    <Button key={c} size="sm" variant={channel === c ? "secondary" : "ghost"} onClick={() => setReplyOn(c)}>
                      {c}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {bubbles.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                      m.mine ? "ml-auto bg-primary text-primary-foreground" : "bg-muted",
                    )}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] opacity-70">
                      <span>{m.who}</span>
                      <span>·</span>
                      <span>{m.channel}</span>
                      <span>·</span>
                      <span>{formatDateTime(m.at)}</span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap">{m.body}</p>
                  </div>
                ))}
              </div>
              <form
                className="flex gap-2 border-t border-border p-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  void reply();
                }}
              >
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={`Reply on ${channel}${current.smsOpted === false && channel === "sms" ? " · STOP on file" : ""}`}
                />
                <Button type="submit" disabled={!text.trim()}>
                  Send
                </Button>
              </form>
            </>
          ) : (
            <p className="p-6 text-sm text-muted-foreground">No threads yet.</p>
          )}
        </section>

        <aside className="hidden w-72 shrink-0 overflow-y-auto border-l border-border lg:block">
          {current ? (
            <div className="space-y-4 p-4 text-sm">
              <div>
                <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Client</h2>
                {current.personId ? (
                  <Link
                    to="/contacts/$personId"
                    params={{ personId: String(current.personId) }}
                    className="mt-1 block font-medium underline-offset-4 hover:underline"
                  >
                    {current.personName ?? "Open registry"}
                  </Link>
                ) : (
                  <p className="mt-1 font-medium">{current.personName ?? "Visitor"}</p>
                )}
                <p className="text-xs text-muted-foreground">{current.orgName}</p>
                <p className="mt-1 text-xs text-muted-foreground">{current.personEmail}</p>
                <p className="text-xs text-muted-foreground">{current.personPhone}</p>
                {current.smsOpted != null && (
                  <Badge className="mt-2" variant={current.smsOpted ? "success" : "warn"}>
                    {current.smsOpted ? "SMS opted in" : "SMS STOP"}
                  </Badge>
                )}
              </div>

              {current.dealId != null && (
                <div>
                  <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Event</h2>
                  <Link
                    to="/deals/$dealId"
                    params={{ dealId: String(current.dealId) }}
                    className="mt-1 block font-medium underline-offset-4 hover:underline"
                  >
                    {current.dealTitle}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {current.stage}
                    {current.dealStatus ? ` · ${current.dealStatus}` : ""}
                    {current.value != null ? ` · ${formatUsd(current.value)}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {current.eventDate}
                    {current.loadIn ? ` · load-in ${current.loadIn}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">{current.venue}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {current.messages.filter((m) => m.channel === "email").length} emails ·{" "}
                    {current.messages.filter((m) => m.channel === "sms").length} SMS · history stays on this show
                  </p>
                </div>
              )}

              <div>
                <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Activity</h2>
                <ul className="mt-2 space-y-2">
                  {current.activities.length === 0 && (
                    <li className="text-xs text-muted-foreground">Replies log here automatically.</li>
                  )}
                  {current.activities.map((a) => (
                    <li key={a.id}>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline">{a.type}</Badge>
                        <span className="truncate text-xs">{a.subject}</span>
                      </div>
                      {a.notes && <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{a.notes}</p>}
                      <p className="text-[11px] text-muted-foreground">{formatDateTime(a.at)}</p>
                    </li>
                  ))}
                </ul>
                <form
                  className="mt-3 space-y-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!me || !note.trim()) return;
                    void logInboxNote({
                      data: { dealId: current.dealId, personId: current.personId, memberId: me.id, body: note },
                    }).then(() => {
                      setNote("");
                      toast.success("Note logged");
                      refresh();
                    });
                  }}
                >
                  <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Log a call or floor note" />
                  <Button type="submit" size="sm" variant="secondary" disabled={!note.trim()}>
                    Log activity
                  </Button>
                </form>
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
