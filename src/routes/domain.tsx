import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, Copy, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  activateDomain,
  addIdentity,
  addSendingDomain,
  checkDomainDns,
  getSendingDesk,
  setDefaultIdentity,
  setDomainApply,
  testDomainSend,
  type DomainRow,
  type DnsRow,
  type IdentityRow,
} from "@/lib/crm/domain";
import { formatDateTime } from "@/lib/utils";

export const Route = createFileRoute("/domain")({ component: DomainPage });

async function copy(text: string, label: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`Copied ${label}`);
  } catch {
    toast.message(text);
  }
}

function statusVariant(status: string): "success" | "warn" | "danger" | "steel" | "outline" {
  if (status === "authenticated" || status === "pass") return "success";
  if (status === "pending" || status === "verifying" || status === "missing") return "warn";
  if (status === "failed" || status === "mismatch") return "danger";
  return "outline";
}

function DomainPage() {
  const desk = useQuery({ queryKey: ["sending-desk"], queryFn: () => getSendingDesk() });
  const qc = useQueryClient();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  function refresh() {
    void qc.invalidateQueries({ queryKey: ["sending-desk"] });
    void qc.invalidateQueries({ queryKey: ["emails"] });
    void qc.invalidateQueries({ queryKey: ["active-sender"] });
  }

  const d = desk.data;
  const live = d?.live ?? null;
  const pending = (d?.domains ?? []).filter((x) => !x.active);
  const stats = d?.stats;

  return (
    <div className="pb-12">
      <PageHeader
        title="Sending domain"
        subtitle="Client mail leaves as you. SPF, DKIM, and DMARC sit on composed mail and every workflow — not on a platform address."
      />

      {desk.isLoading || !d ? (
        <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6">
          <Stat
            label="Live domain"
            value={live ? "Live" : "—"}
            hint={live?.domain ?? "None authenticated"}
          />
          <Stat
            label="DNS"
            value={live ? `${stats?.recordsPass}/${stats?.recordsTotal}` : "0/0"}
            hint="SPF · DKIM · DMARC · tracking"
          />
          <Stat label="Sent 7d" value={String(stats?.sent7d ?? 0)} hint="Authenticated outbound" />
          <Stat
            label="From"
            value={d.sender.authenticated ? "You" : "Platform"}
            hint={d.sender.fromAddr}
          />
        </div>
      )}

      <div className="mt-6 grid gap-4 px-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] sm:px-6">
        <div className="space-y-4">
          {live ? <LiveCard domain={live} onChange={refresh} /> : (
            <article className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
              <p className="text-sm">No live sending domain. Authenticate DNS, then activate.</p>
            </article>
          )}
          {live && (
            <DnsTable
              records={live.records}
              copiedId={copiedId}
              onCopy={async (row) => {
                await copy(row.value, `${row.kind.toUpperCase()} record`);
                setCopiedId(row.id);
                setTimeout(() => setCopiedId((id) => (id === row.id ? null : id)), 1600);
              }}
            />
          )}
        </div>

        <div className="space-y-4">
          {live && <IdentityCard domain={live} onChange={refresh} />}
          <TestSend identities={live?.identities ?? []} onChange={refresh} />
        </div>
      </div>

      <section className="mt-6 px-4 sm:px-6">
        <h2 className="text-sm font-medium">Other domains</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Platform mail stays on file. A pending root can be checked and cut over without touching the live house address.
        </p>
        <ul className="mt-3 space-y-3">
          {pending.map((row) => (
            <PendingRow key={row.id} row={row} onChange={refresh} />
          ))}
        </ul>
        <AddDomainForm onChange={refresh} />
      </section>

      <section className="mt-6 px-4 sm:px-6">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-medium">Recent authenticated mail</h2>
          <Link to="/mail" className="text-xs text-muted-foreground hover:text-foreground">
            Open mail
          </Link>
        </div>
        <ul className="mt-3 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
          {(d?.recent ?? []).length === 0 && (
            <li className="px-4 py-3 text-sm text-muted-foreground">Nothing has left the domain yet.</li>
          )}
          {(d?.recent ?? []).map((m) => (
            <li key={m.id} className="flex flex-wrap items-start gap-2 px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm">{m.subject}</div>
                <p className="truncate text-xs text-muted-foreground">
                  {m.fromName} · {m.fromAddr} → {m.toAddr}
                </p>
              </div>
              <Badge variant={m.authenticated ? "success" : "outline"}>{m.authenticated ? "aligned" : m.folder}</Badge>
              <span className="text-xs text-muted-foreground">{m.sentAt ? formatDateTime(m.sentAt) : m.folder}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function LiveCard({ domain, onChange }: { domain: DomainRow; onChange: () => void }) {
  return (
    <article className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Live sending domain</p>
          <h2 className="mt-1 font-mono text-lg">{domain.domain}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {domain.displayName}
            {domain.verifiedAt ? ` · authenticated ${formatDateTime(domain.verifiedAt)}` : ""}
          </p>
        </div>
        <Badge variant="success">
          <ShieldCheck className="mr-1 size-3" />
          Authenticated
        </Badge>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <AuthChip ok={domain.spf} label="SPF" />
        <AuthChip ok={domain.dkim} label="DKIM" />
        <AuthChip ok={domain.dmarc} label="DMARC" />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <ApplySwitch
          id="apply-compose"
          label="Composed mail"
          hint="One-to-one, inbox reply, deal follow-up"
          checked={domain.applyCompose}
          onCheckedChange={(v) =>
            setDomainApply({ data: { id: domain.id, applyCompose: v } }).then(() => {
              toast.success(v ? "Compose uses this domain" : "Compose falls back to the mailbox");
              onChange();
            })
          }
        />
        <ApplySwitch
          id="apply-workflow"
          label="Automated mail"
          hint="Sequences, automations, broadcasts, confirms"
          checked={domain.applyWorkflow}
          onCheckedChange={(v) =>
            setDomainApply({ data: { id: domain.id, applyWorkflow: v } }).then(() => {
              toast.success(v ? "Workflows use this domain" : "Workflows paused on this domain");
              onChange();
            })
          }
        />
      </div>
    </article>
  );
}

function AuthChip({ ok, label }: { ok: boolean; label: string }) {
  return (
    <Badge variant={ok ? "success" : "warn"}>
      {ok ? <Check className="mr-1 size-3" /> : null}
      {label} {ok ? "pass" : "fail"}
    </Badge>
  );
}

function ApplySwitch({
  id,
  label,
  hint,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  hint: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 rounded-lg bg-secondary px-3 py-2.5">
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} className="mt-0.5" />
      <span>
        <span className="block text-sm">{label}</span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
      </span>
    </label>
  );
}

function DnsTable({
  records,
  copiedId,
  onCopy,
}: {
  records: DnsRow[];
  copiedId: number | null;
  onCopy: (row: DnsRow) => void;
}) {
  return (
    <article className="overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-medium">DNS records</h2>
        <p className="text-xs text-muted-foreground">Publish these at your registrar. We check SPF, DKIM, DMARC, tracking, and bounce.</p>
      </div>
      <ul className="divide-y divide-border">
        {records.map((r) => (
          <li key={r.id} className="flex flex-wrap items-start gap-2 px-4 py-3">
            <div className="w-16 shrink-0">
              <span className="font-mono text-xs">{r.type}</span>
              <div className="text-xs text-muted-foreground">{r.host}</div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="break-all font-mono text-xs">{r.value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{r.purpose}</p>
            </div>
            <Badge variant={statusVariant(r.status)}>{r.status}</Badge>
            <Button size="sm" variant="ghost" onClick={() => onCopy(r)} aria-label={`Copy ${r.kind}`}>
              {copiedId === r.id ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            </Button>
          </li>
        ))}
      </ul>
    </article>
  );
}

function IdentityCard({ domain, onChange }: { domain: DomainRow; onChange: () => void }) {
  const [local, setLocal] = useState("");
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("compose");

  return (
    <article className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
      <h2 className="text-sm font-medium">From addresses</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Each AE keeps their own mailbox on the company domain. Workflows send as Shows.
      </p>
      <ul className="mt-3 space-y-2">
        {domain.identities.map((i) => (
          <IdentityRowView key={i.id} row={i} onChange={onChange} />
        ))}
      </ul>
      <form
        className="mt-3 grid gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void addIdentity({
            data: { domainId: domain.id, localPart: local, displayName: name, purpose },
          }).then((r) => {
            if (!r.ok) toast.error(r.error ?? "Could not add");
            else {
              toast.success(`${local}@${domain.domain} is live`);
              setLocal("");
              setName("");
              onChange();
            }
          });
        }}
      >
        <Label htmlFor="ident-local">New address</Label>
        <div className="flex flex-wrap gap-2">
          <Input
            id="ident-local"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            placeholder="ops"
            className="w-28"
          />
          <span className="self-center text-xs text-muted-foreground">@{domain.domain}</span>
        </div>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Display name" />
        <select
          className="h-10 rounded-md bg-secondary px-3 text-sm shadow-[var(--shadow-border)]"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
        >
          <option value="compose">Compose</option>
          <option value="workflow">Workflow</option>
          <option value="house">House</option>
        </select>
        <Button type="submit" size="sm" disabled={!local.trim()}>
          Add address
        </Button>
      </form>
    </article>
  );
}

function IdentityRowView({ row, onChange }: { row: IdentityRow; onChange: () => void }) {
  return (
    <li className="flex flex-wrap items-center gap-2 rounded-lg bg-secondary px-3 py-2">
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm">{row.displayName}</div>
        <p className="truncate font-mono text-xs text-muted-foreground">{row.address}</p>
      </div>
      <Badge variant="outline">{row.purpose}</Badge>
      {row.isDefault ? (
        <Badge variant="steel">default</Badge>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          onClick={() =>
            setDefaultIdentity({ data: { id: row.id } }).then(() => {
              toast.success(`Default ${row.purpose} is now ${row.address}`);
              onChange();
            })
          }
        >
          Make default
        </Button>
      )}
    </li>
  );
}

function TestSend({ identities, onChange }: { identities: IdentityRow[]; onChange: () => void }) {
  const compose = identities.find((i) => i.purpose === "compose" && i.isDefault) ?? identities[0];
  const workflow = identities.find((i) => i.purpose === "workflow");
  return (
    <article className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
      <h2 className="text-sm font-medium">Test send</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Drops a tracked message into Sent so you can see the aligned From before a client does.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() =>
            testDomainSend({ data: { identityId: compose?.id, purpose: "compose" } }).then((r) => {
              toast.success(`Sent to ${r.to} from ${r.sender.fromAddr}`);
              onChange();
            })
          }
          disabled={!compose}
        >
          Send as compose
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() =>
            testDomainSend({ data: { identityId: workflow?.id, purpose: "workflow" } }).then((r) => {
              toast.success(`Workflow mail from ${r.sender.fromAddr}`);
              onChange();
            })
          }
          disabled={!workflow}
        >
          Send as workflow
        </Button>
      </div>
    </article>
  );
}

function PendingRow({ row, onChange }: { row: DomainRow; onChange: () => void }) {
  const platform = row.domain.includes("mail.northline");
  return (
    <li className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="font-mono text-sm">{row.domain}</div>
          <p className="text-xs text-muted-foreground">
            {row.displayName}
            {platform ? " · retired platform sender" : ""}
          </p>
        </div>
        <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <AuthChip ok={row.spf} label="SPF" />
        <AuthChip ok={row.dkim} label="DKIM" />
        <AuthChip ok={row.dmarc} label="DMARC" />
      </div>
      {!platform && (
        <div className="mt-3 flex flex-wrap gap-2">
          {row.status !== "authenticated" && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                checkDomainDns({ data: { id: row.id } }).then((r) => {
                  if (!r.ok) toast.error(r.error ?? "Check failed");
                  else toast.success("SPF, DKIM, and DMARC all pass. Activate to send.");
                  onChange();
                })
              }
            >
              Check DNS
            </Button>
          )}
          {row.status === "authenticated" && (
            <Button
              size="sm"
              onClick={() =>
                activateDomain({ data: { id: row.id } }).then((r) => {
                  if (!r.ok) toast.error(r.error ?? "Could not activate");
                  else toast.success(`Client mail now leaves ${row.domain}`);
                  onChange();
                })
              }
            >
              Activate
            </Button>
          )}
        </div>
      )}
    </li>
  );
}

function AddDomainForm({ onChange }: { onChange: () => void }) {
  const [domain, setDomain] = useState("");
  return (
    <form
      className="mt-4 flex flex-wrap items-end gap-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]"
      onSubmit={(e) => {
        e.preventDefault();
        void addSendingDomain({ data: { domain } }).then((r) => {
          if (!r.ok) toast.error(r.error ?? "Could not add");
          else {
            toast.success("Domain added — publish the DNS records, then Check DNS");
            setDomain("");
            onChange();
          }
        });
      }}
    >
      <div className="min-w-48 flex-1 space-y-1.5">
        <Label htmlFor="new-domain">Add a domain</Label>
        <Input
          id="new-domain"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="events.hurricaneproductionsllc.com"
        />
      </div>
      <Button type="submit" size="sm" disabled={!domain.trim()}>
        Generate records
      </Button>
    </form>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <article className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
      <div className="text-xs tracking-wide text-muted-foreground uppercase">{label}</div>
      <div className="mt-2 truncate font-mono text-2xl tabular-nums">{value}</div>
      <p className="mt-1 truncate text-xs text-muted-foreground">{hint}</p>
    </article>
  );
}
