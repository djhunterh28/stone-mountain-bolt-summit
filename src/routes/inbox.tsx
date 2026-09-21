import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUnifiedInbox, sendSms } from "@/lib/crm/ops";
import { getBootstrap, sendChat, sendEmail } from "@/lib/crm/server";
import { useUi } from "@/lib/crm/store";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/inbox")({ component: InboxPage });

function InboxPage() {
  const box = useQuery({ queryKey: ["unified-inbox"], queryFn: () => getUnifiedInbox() });
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const qc = useQueryClient();
  const { memberId } = useUi();
  const me = boot.data?.members.find((m) => m.id === memberId);
  const [id, setId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const threads = box.data?.threads ?? [];
  const current = threads.find((t) => t.id === id) ?? threads[0];

  async function reply() {
    const body = text.trim();
    if (!body || !current) return;
    setText("");
    if (current.channel === "sms") {
      if (!current.personId) return toast.error("No person on this thread");
      const r = await sendSms({ data: { personId: current.personId, body, dealId: current.dealId ?? undefined } });
      if (!r.ok) return toast.error(r.error);
    } else if (current.channel === "email") {
      if (!me) return;
      await sendEmail({
        data: {
          fromName: me.name,
          fromAddr: me.email,
          toAddr: current.toAddr ?? "client@example.com",
          subject: `Re: ${current.title}`,
          body,
          dealId: current.dealId,
        },
      });
    } else {
      const chatId = Number(current.id.replace("chat-", ""));
      await sendChat({ data: { chatId, sender: "agent", body } });
    }
    toast.success("Sent");
    qc.invalidateQueries({ queryKey: ["unified-inbox"] });
  }

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col">
      <PageHeader
        title="Unified inbox"
        subtitle="Email, SMS via QUO, and site chat in one three-column desk. Event context stays in view."
      />
      <div className="flex min-h-0 flex-1 border-t border-border">
        <aside className="hidden w-72 shrink-0 overflow-y-auto border-r border-border sm:block">
          {threads.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setId(t.id)}
              className={cn(
                "w-full border-b border-border px-4 py-3 text-left hover:bg-accent/40",
                current?.id === t.id && "bg-accent",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium">{t.title}</span>
                <Badge variant="outline">{t.channel}</Badge>
              </div>
              <p className="truncate text-xs text-muted-foreground">{t.preview}</p>
            </button>
          ))}
        </aside>
        <section className="flex min-w-0 flex-1 flex-col">
          {current ? (
            <>
              <div className="border-b border-border px-4 py-3">
                <div className="text-sm font-medium">{current.title}</div>
                <div className="text-xs text-muted-foreground">
                  {current.subtitle}
                  {current.dealTitle ? ` · ${current.dealTitle}` : ""}
                </div>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {current.messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                      m.mine ? "ml-auto bg-primary text-primary-foreground" : "bg-muted",
                    )}
                  >
                    <div className="text-[10px] opacity-70">
                      {m.who} · {formatDateTime(m.at)}
                    </div>
                    {m.body}
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
                <Input value={text} onChange={(e) => setText(e.target.value)} placeholder={`Reply on ${current.channel}`} />
                <Button type="submit">Send</Button>
              </form>
            </>
          ) : (
            <p className="p-6 text-sm text-muted-foreground">No threads yet.</p>
          )}
        </section>
        <aside className="hidden w-64 shrink-0 overflow-y-auto border-l border-border xl:block">
          {current ? (
            <div className="space-y-3 p-4 text-sm">
              <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Context</h2>
              <p>
                <span className="text-muted-foreground">Channel</span>
                <span className="mt-0.5 block">{current.channel}</span>
              </p>
              {current.dealId != null && current.dealTitle && (
                <p>
                  <span className="text-muted-foreground">Event</span>
                  <Link
                    to="/deals/$dealId"
                    params={{ dealId: String(current.dealId) }}
                    className="mt-0.5 block underline-offset-4 hover:underline"
                  >
                    {current.dealTitle}
                  </Link>
                </p>
              )}
              {current.personId != null && (
                <p>
                  <span className="text-muted-foreground">Person</span>
                  <Link
                    to="/contacts/$personId"
                    params={{ personId: String(current.personId) }}
                    className="mt-0.5 block underline-offset-4 hover:underline"
                  >
                    Open registry
                  </Link>
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                SMS honors opt-in. Email tracking stays on. Chat is the site widget.
              </p>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
