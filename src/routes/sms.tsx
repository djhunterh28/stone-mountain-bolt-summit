import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  getSmsDesk,
  runDueSms,
  sendCustomSms,
  sendEventReminders,
  sendPaymentNotices,
  sendStatusUpdate,
  setSmsOpt,
  toggleSmsAutomation,
} from "@/lib/crm/sms";
import { formatDateTime } from "@/lib/utils";

export const Route = createFileRoute("/sms")({ component: SmsPage });

function SmsPage() {
  const desk = useQuery({ queryKey: ["sms-desk"], queryFn: () => getSmsDesk() });
  const qc = useQueryClient();
  const [personId, setPersonId] = useState<number>(1);
  const [custom, setCustom] = useState("{{first}} — ");

  function refresh() {
    void qc.invalidateQueries({ queryKey: ["sms-desk"] });
    void qc.invalidateQueries({ queryKey: ["unified-inbox"] });
    void qc.invalidateQueries({ queryKey: ["bcast-desk"] });
  }

  const d = desk.data;
  const opted = (d?.optins ?? []).filter((o) => o.optedIn);

  return (
    <div className="pb-12">
      <PageHeader
        title="SMS via QUO"
        subtitle="Event reminders, payment confirmations, status updates, and custom texts. STOP is honored. Nothing goes out without an opt-in."
      />

      {desk.isLoading || !d ? (
        <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6">
          <Stat label="Opted in" value={String(d.stats.optedIn)} hint={`${d.stats.suppressed} STOP on file`} />
          <Stat label="Sent 7d" value={String(d.stats.sent7d)} hint={`From ${d.account.fromNumber}`} />
          <Stat label="Due reminders" value={String(d.stats.dueReminders)} hint="Next 21 days, not yet pinged" />
          <Stat label="Due payments" value={String(d.stats.duePayments)} hint="Won, no confirmation text" />
        </div>
      )}

      {d && (
        <article className="mx-4 mt-4 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:mx-6">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="text-sm font-medium">QUO</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {d.account.label} · {d.account.fromNumber}
              </p>
            </div>
            <Badge variant={d.account.status === "connected" ? "success" : "warn"}>{d.account.status}</Badge>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() =>
                runDueSms().then((r) => {
                  toast.success(`Automations sent ${r.sent} · skipped ${r.skipped}`);
                  refresh();
                })
              }
            >
              Run due automations
            </Button>
          </div>
        </article>
      )}

      <div className="mt-6 grid gap-4 px-4 lg:grid-cols-2 sm:px-6">
        <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Event reminders</h2>
          <p className="mt-1 text-xs text-muted-foreground">Shows in the next 21 days. One reminder per week per show.</p>
          <ul className="mt-3 divide-y divide-border">
            {(d?.upcoming ?? []).map((u) => (
              <li key={u.dealId} className="flex flex-wrap items-center gap-2 py-2.5">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm">{u.title}</div>
                  <p className="truncate text-xs text-muted-foreground">
                    {u.name} · {u.eventDate} · {u.loadIn ?? "no call"} · {u.venue}
                  </p>
                </div>
                {!u.opted ? (
                  <Badge variant="warn">no opt-in</Badge>
                ) : u.reminded ? (
                  <Badge variant="outline">sent</Badge>
                ) : (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      sendEventReminders({ data: { dealIds: [u.dealId] } }).then((r) => {
                        toast.success(r.sent ? "Reminder via QUO" : "Skipped");
                        refresh();
                      })
                    }
                  >
                    Send
                  </Button>
                )}
              </li>
            ))}
          </ul>
          <Button
            className="mt-3"
            size="sm"
            disabled={!d?.stats.dueReminders}
            onClick={() =>
              sendEventReminders({ data: {} }).then((r) => {
                toast.success(`Reminded ${r.sent} · skipped ${r.skipped}`);
                refresh();
              })
            }
          >
            Send all due
          </Button>
        </section>

        <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Payment confirmations</h2>
          <p className="mt-1 text-xs text-muted-foreground">Won shows that have not had a payment text.</p>
          {(d?.payments ?? []).length === 0 && (
            <p className="mt-3 text-sm text-muted-foreground">Every won show already has a confirmation, or no opt-in.</p>
          )}
          <ul className="mt-3 divide-y divide-border">
            {(d?.payments ?? []).map((p) => (
              <li key={p.dealId} className="flex flex-wrap items-center gap-2 py-2.5">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm">{p.title}</div>
                  <p className="truncate text-xs text-muted-foreground">
                    {p.name} · {p.amount}
                  </p>
                </div>
                {p.opted ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      sendPaymentNotices({ data: { dealIds: [p.dealId] } }).then((r) => {
                        toast.success(r.sent ? "Payment text delivered" : "Skipped");
                        refresh();
                      })
                    }
                  >
                    Confirm
                  </Button>
                ) : (
                  <Badge variant="warn">no opt-in</Badge>
                )}
              </li>
            ))}
          </ul>
          <Button
            className="mt-3"
            size="sm"
            disabled={!d?.stats.duePayments}
            onClick={() =>
              sendPaymentNotices({ data: {} }).then((r) => {
                toast.success(`Confirmed ${r.sent} · skipped ${r.skipped}`);
                refresh();
              })
            }
          >
            Confirm all due
          </Button>
        </section>

        <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Status updates</h2>
          <p className="mt-1 text-xs text-muted-foreground">Open shows with an opted-in day-of contact.</p>
          <ul className="mt-3 divide-y divide-border">
            {(d?.statusQueue ?? []).map((s) => (
              <li key={s.dealId} className="flex flex-wrap items-center gap-2 py-2.5">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm">{s.title}</div>
                  <p className="truncate text-xs text-muted-foreground">
                    {s.name} · {s.stage}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    sendStatusUpdate({ data: { dealId: s.dealId } }).then((r) => {
                      if (!r.ok) toast.error(r.error ?? "Blocked");
                      else toast.success("Status text via QUO");
                      refresh();
                    })
                  }
                >
                  Ping
                </Button>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Custom message</h2>
          <p className="mt-1 text-xs text-muted-foreground">Same 160-character note you would type on a phone. Merge tags resolve.</p>
          <form
            className="mt-3 space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              void sendCustomSms({ data: { personId, body: custom } }).then((r) => {
                if (!r.ok) toast.error(r.error ?? "Blocked");
                else {
                  toast.success("QUO delivered");
                  refresh();
                }
              });
            }}
          >
            <Label htmlFor="sms-who">To</Label>
            <select
              id="sms-who"
              className="h-10 w-full rounded-md bg-secondary px-2 text-sm shadow-[var(--shadow-border)]"
              value={personId}
              onChange={(e) => setPersonId(Number(e.target.value))}
            >
              {opted.map((o) => (
                <option key={o.personId} value={o.personId}>
                  {o.name}
                  {o.phone ? ` · ${o.phone}` : ""}
                </option>
              ))}
            </select>
            <Label htmlFor="sms-body">Message</Label>
            <Textarea id="sms-body" rows={4} value={custom} onChange={(e) => setCustom(e.target.value)} />
            <p className="text-xs text-muted-foreground">{custom.length} characters</p>
            <Button type="submit" size="sm" disabled={!custom.trim()}>
              Send via QUO
            </Button>
          </form>
        </section>
      </div>

      <div className="mt-6 grid gap-4 px-4 lg:grid-cols-2 sm:px-6">
        <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Automations</h2>
          <ul className="mt-3 divide-y divide-border">
            {(d?.automations ?? []).map((a) => (
              <li key={a.id} className="flex items-start justify-between gap-2 py-2.5">
                <div className="min-w-0">
                  <div className="text-sm">{a.name}</div>
                  <p className="text-xs text-muted-foreground">
                    {a.detail}
                    {a.lastRun ? ` · last ${formatDateTime(a.lastRun)}` : ""}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={a.active ? "secondary" : "ghost"}
                  onClick={() =>
                    toggleSmsAutomation({ data: { id: a.id, active: !a.active } }).then(() => {
                      toast.success(a.active ? "Paused" : "Armed");
                      refresh();
                    })
                  }
                >
                  {a.active ? "On" : "Off"}
                </Button>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Opt-in registry</h2>
          <p className="mt-1 text-xs text-muted-foreground">TCPA. A STOP reply takes them off. Restore only if they asked.</p>
          <ul className="mt-3 divide-y divide-border">
            {(d?.optins ?? []).map((o) => (
              <li key={o.personId} className="flex items-center justify-between gap-2 py-2">
                <div className="min-w-0">
                  <div className="truncate text-sm">{o.name}</div>
                  <p className="truncate text-xs text-muted-foreground">
                    {o.phone ?? "no mobile"} · {o.source}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={o.optedIn ? "ghost" : "secondary"}
                  onClick={() => setSmsOpt({ data: { personId: o.personId, optedIn: !o.optedIn } }).then(refresh)}
                >
                  {o.optedIn ? "Opted in" : "STOP"}
                </Button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6 px-4 sm:px-6">
        <h2 className="text-sm font-medium">Log</h2>
        <ul className="mt-3 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
          {(d?.messages ?? []).map((m) => (
            <li key={m.id} className="px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{m.kind}</Badge>
                <span className="text-xs text-muted-foreground">
                  {m.direction} · {m.person}
                  {m.deal ? ` · ${m.deal}` : ""}
                </span>
                <span className="ml-auto text-xs text-muted-foreground">{formatDateTime(m.at)}</span>
              </div>
              <p className="mt-1 text-sm">{m.body}</p>
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
