import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getSmtpDesk,
  runSmtpWorkflows,
  sendSmtpTemplate,
  testSmtp,
  toggleSmtpWorkflow,
} from "@/lib/crm/smtp";
import { formatDateTime } from "@/lib/utils";

export const Route = createFileRoute("/smtp")({ component: SmtpPage });

function statusVariant(status: string) {
  if (status === "delivered") return "success" as const;
  if (status === "bounced") return "danger" as const;
  if (status === "opened" || status === "clicked") return "steel" as const;
  return "outline" as const;
}

function SmtpPage() {
  const desk = useQuery({ queryKey: ["smtp-desk"], queryFn: () => getSmtpDesk() });
  const qc = useQueryClient();
  const [templateId, setTemplateId] = useState<number | null>(null);
  const [personId, setPersonId] = useState<number>(1);

  function refresh() {
    void qc.invalidateQueries({ queryKey: ["smtp-desk"] });
    void qc.invalidateQueries({ queryKey: ["emails"] });
  }

  const d = desk.data;
  const tpl = d?.templates.find((t) => t.id === templateId) ?? d?.templates[0];
  const person = d?.people.find((p) => p.personId === personId);

  return (
    <div className="pb-12">
      <PageHeader
        title="SMTP"
        subtitle="Transactional mail through your own mail host. Receipts, call sheets, invoices, resets. Not the client broadcast."
      />

      {desk.isLoading || !d ? (
        <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6">
          <Stat label="Sent 7d" value={String(d.stats.sent7d)} hint="Transactional only" />
          <Stat label="Delivered" value={String(d.stats.delivered)} hint="250 OK from the host" />
          <Stat label="Opened" value={String(d.stats.opened)} hint="Public tracking link" />
          <Stat label="Bounced" value={String(d.stats.bounced)} hint="Never marketing" />
        </div>
      )}

      {d && (
        <article className="mx-4 mt-4 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:mx-6">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="text-sm font-medium">SMTP account</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {d.account.host}:{d.account.port} · {d.account.tls} · {d.account.username}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                From {d.account.fromAddr}
                {d.account.lastOk ? ` · last ok ${formatDateTime(d.account.lastOk)}` : ""}
              </p>
            </div>
            <Badge variant={d.account.status === "connected" ? "success" : "warn"}>{d.account.status}</Badge>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                testSmtp().then((r) => {
                  if (!r.ok) toast.error(r.error ?? "Failed");
                  else toast.success(`Test delivered from ${r.fromAddr}`);
                  refresh();
                })
              }
            >
              Send test
            </Button>
            <Button
              size="sm"
              onClick={() =>
                runSmtpWorkflows({ data: {} }).then((r) => {
                  toast.success(`Workflows sent ${r.sent} · skipped ${r.skipped}`);
                  refresh();
                })
              }
            >
              Run due workflows
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link to="/settings" search={{ tab: "domain" }}>Sending domain</Link>
            </Button>
          </div>
        </article>
      )}

      <div className="mt-6 grid gap-4 px-4 lg:grid-cols-2 sm:px-6">
        <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Transactional templates</h2>
          <p className="mt-1 text-xs text-muted-foreground">Receipts, call sheets, invoices, resets. Merge tags resolve per send.</p>
          <div className="mt-3 flex flex-wrap gap-1">
            {(d?.templates ?? []).map((t) => (
              <Button
                key={t.id}
                size="sm"
                variant={tpl?.id === t.id ? "secondary" : "ghost"}
                onClick={() => setTemplateId(t.id)}
              >
                {t.name}
              </Button>
            ))}
          </div>
          {tpl && (
            <div className="mt-3 rounded-lg bg-secondary p-3">
              <div className="text-sm font-medium">{tpl.subject}</div>
              <pre className="mt-2 whitespace-pre-wrap font-sans text-xs leading-relaxed text-muted-foreground">{tpl.body}</pre>
            </div>
          )}
          <form
            className="mt-3 space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!tpl) return;
              void sendSmtpTemplate({
                data: { templateId: tpl.id, personId, dealId: person?.dealId ?? null },
              }).then((r) => {
                if (!r.ok) toast.error(r.error ?? "Blocked");
                else toast.success(`Delivered · ${r.fromAddr}`);
                refresh();
              });
            }}
          >
            <Label htmlFor="smtp-to">Send to</Label>
            <select
              id="smtp-to"
              className="h-10 w-full rounded-md bg-secondary px-2 text-sm shadow-[var(--shadow-border)]"
              value={personId}
              onChange={(e) => setPersonId(Number(e.target.value))}
            >
              {(d?.people ?? []).map((p) => (
                <option key={p.personId} value={p.personId}>
                  {p.name} · {p.email}
                </option>
              ))}
            </select>
            <Button type="submit" size="sm" disabled={!tpl}>
              Send via SMTP
            </Button>
          </form>
        </section>

        <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Automated sending</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {d ? `${d.stats.dueWon} won shows still need a receipt.` : "Workflows fire once per record."}
          </p>
          <ul className="mt-3 divide-y divide-border">
            {(d?.workflows ?? []).map((w) => (
              <li key={w.id} className="flex flex-wrap items-start justify-between gap-2 py-2.5">
                <div className="min-w-0 flex-1">
                  <div className="text-sm">{w.name}</div>
                  <p className="text-xs text-muted-foreground">
                    {w.templateName} · {w.triggerKey}
                    {w.lastRun ? ` · last ${formatDateTime(w.lastRun)}` : ""} · {w.runs} runs
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={w.active ? "secondary" : "ghost"}
                    onClick={() =>
                      toggleSmtpWorkflow({ data: { id: w.id, active: !w.active } }).then(() => {
                        toast.success(w.active ? "Paused" : "Armed");
                        refresh();
                      })
                    }
                  >
                    {w.active ? "On" : "Off"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      runSmtpWorkflows({ data: { id: w.id } }).then((r) => {
                        toast.success(`Sent ${r.sent} · skipped ${r.skipped}`);
                        refresh();
                      })
                    }
                  >
                    Run
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6 px-4 sm:px-6">
        <h2 className="text-sm font-medium">Delivery log</h2>
        <ul className="mt-3 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
          {(d?.messages ?? []).map((m) => (
            <li key={m.id} className="px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={statusVariant(m.opened ? "opened" : m.status)}>{m.opened ? "opened" : m.status}</Badge>
                <span className="min-w-0 flex-1 truncate text-sm">{m.subject}</span>
                <a className="text-xs text-muted-foreground underline-offset-2 hover:underline" href={`/t/${m.id}`}>
                  Open track
                </a>
                <span className="text-xs text-muted-foreground">{formatDateTime(m.at)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {m.person ?? m.toAddr}
                {m.deal ? ` · ${m.deal}` : ""} · {m.fromAddr}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 px-4 sm:px-6">
        <h2 className="text-sm font-medium">SMTP events</h2>
        <ul className="mt-3 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
          {(d?.events ?? []).map((ev) => (
            <li key={ev.id} className="flex flex-wrap items-center gap-2 px-4 py-2.5 text-sm">
              <Badge variant="outline">{ev.event}</Badge>
              <span className="min-w-0 flex-1 truncate">{ev.subject}</span>
              <span className="text-xs text-muted-foreground">{ev.detail}</span>
              <span className="text-xs text-muted-foreground">{formatDateTime(ev.at)}</span>
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
