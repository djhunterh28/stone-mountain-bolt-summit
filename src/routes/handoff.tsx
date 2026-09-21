import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Copy, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { PackBody } from "@/components/crm/handoff-pack";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  getHandoffDesk,
  previewHandoff,
  recallHandoff,
  sendHandoff,
  setHandoffMonitor,
  type HandoffReason,
  type HandoffRow,
} from "@/lib/crm/handoff";
import { formatDate, formatUsd } from "@/lib/utils";

export const Route = createFileRoute("/handoff")({ component: HandoffPage });

const REASONS: { id: HandoffReason; label: string; hint: string }[] = [
  { id: "subcontract", label: "Sub-contract", hint: "Labor or specialty shop takes the floor" },
  { id: "emergency", label: "Emergency", hint: "If the house goes dark, they can run the night" },
  { id: "overflow", label: "Overflow", hint: "Same-night double, extra crew from outside" },
];

function origin() {
  if (typeof window === "undefined") return "";
  return window.location.origin;
}

function packUrl(token: string) {
  return `${origin()}/h/${token}`;
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Pack link copied");
  } catch {
    toast.message(text);
  }
}

function statusVariant(status: string): "success" | "warn" | "danger" | "steel" | "outline" {
  if (status === "complete") return "success";
  if (status === "on_site" || status === "opened") return "steel";
  if (status === "recalled") return "danger";
  if (status === "sent") return "warn";
  return "outline";
}

function HandoffPage() {
  const desk = useQuery({
    queryKey: ["handoff-desk"],
    queryFn: () => getHandoffDesk(),
    refetchInterval: (q) => {
      const packs = q.state.data?.packs ?? [];
      return packs.some((p) => p.monitor && p.status !== "recalled" && p.status !== "complete") ? 12_000 : false;
    },
  });
  const qc = useQueryClient();
  const packs = desk.data?.packs ?? [];
  const vendors = desk.data?.vendors ?? [];
  const deals = desk.data?.deals ?? [];
  const [dealId, setDealId] = useState<number | null>(null);
  const [to, setTo] = useState("");
  const [reason, setReason] = useState<HandoffReason>("subcontract");
  const [monitor, setMonitor] = useState(true);
  const [cover, setCover] = useState("");
  const selectedDeal = deals.find((d) => d.id === dealId) ?? deals[0] ?? null;
  const activeId = selectedDeal?.id ?? 0;
  const preview = useQuery({
    queryKey: ["handoff-preview", activeId],
    queryFn: () => previewHandoff({ data: { dealId: activeId } }),
    enabled: activeId > 0,
  });

  function refresh() {
    void qc.invalidateQueries({ queryKey: ["handoff-desk"] });
    void qc.invalidateQueries({ queryKey: ["handoffs"] });
  }

  async function onSend() {
    if (!selectedDeal || !to.trim()) {
      toast.error("Pick a show and a receiving shop");
      return;
    }
    const res = await sendHandoff({
      data: { dealId: selectedDeal.id, to: to.trim(), monitor, reason, cover: cover.trim() || undefined },
    });
    if (!res.ok) {
      toast.error("Could not pack the show");
      return;
    }
    toast.success("Packed without invoices or rates");
    if (res.token) void copy(packUrl(res.token));
    setCover("");
    refresh();
  }

  const withheld = packs.reduce((s, p) => s + p.value, 0);
  const monitored = packs.filter((p) => p.monitor && p.status !== "recalled" && p.status !== "complete").length;
  const emergencies = packs.filter((p) => p.reason === "emergency" && p.status !== "recalled").length;

  return (
    <div className="pb-12">
      <PageHeader
        title="Event hand-off"
        subtitle="Pack a show for a sub or an emergency shop. Production data goes. Invoices, rates, and house value never leave this desk."
      />
      <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6">
        <Stat label="Packs" value={String(packs.length)} hint="Sent to outside shops" />
        <Stat label="Monitored" value={String(monitored)} hint="House still watching" />
        <Stat label="Withheld" value={formatUsd(withheld)} hint="Value that did not travel" />
        <Stat label="Emergency" value={String(emergencies)} hint="Ready if we go dark" />
      </div>

      <div className="mt-6 grid gap-4 px-4 lg:grid-cols-[minmax(0,1fr)_20rem] sm:px-6">
        <div className="space-y-4">
          <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">New pack</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="ho-deal">Show</Label>
                {desk.isLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <select
                    id="ho-deal"
                    className="h-10 w-full rounded-md bg-secondary px-3 text-sm shadow-[var(--shadow-border)]"
                    value={selectedDeal?.id ?? ""}
                    onChange={(e) => setDealId(Number(e.target.value))}
                  >
                    {deals.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.title}
                        {d.eventDate ? ` · ${formatDate(d.eventDate)}` : ""}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Receiving shop</Label>
                <div className="flex flex-wrap gap-1.5">
                  {vendors.map((v) => (
                    <Button
                      key={v.name}
                      type="button"
                      size="sm"
                      variant={to === v.name ? "secondary" : "ghost"}
                      title={v.available ? v.category : `${v.category} · unavailable`}
                      onClick={() => setTo(v.name)}
                    >
                      {v.name}
                    </Button>
                  ))}
                </div>
                <Input value={to} onChange={(e) => setTo(e.target.value)} placeholder="Or type a company" className="mt-1" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Why</Label>
                <div className="flex flex-wrap gap-1.5">
                  {REASONS.map((r) => (
                    <Button
                      key={r.id}
                      type="button"
                      size="sm"
                      variant={reason === r.id ? "secondary" : "ghost"}
                      title={r.hint}
                      onClick={() => setReason(r.id)}
                    >
                      {r.label}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">{REASONS.find((r) => r.id === reason)?.hint}</p>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-lg bg-muted/60 px-3 py-2 sm:col-span-2">
                <div>
                  <p className="text-sm font-medium">Monitor after send</p>
                  <p className="text-xs text-muted-foreground">See opens and on-site pings. Turn off for a clean hand-off.</p>
                </div>
                <Switch checked={monitor} onCheckedChange={setMonitor} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="ho-cover">Cover note</Label>
                <Textarea
                  id="ho-cover"
                  value={cover}
                  onChange={(e) => setCover(e.target.value)}
                  className="min-h-20"
                  placeholder="What they own on the floor. Never rates."
                />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button onClick={() => void onSend()}>Hand off</Button>
              <p className="text-xs text-muted-foreground">Financials stay here — always.</p>
            </div>
          </section>

          <section>
            <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">Sent packs</p>
            {desk.isLoading ? (
              <Skeleton className="h-24 w-full rounded-xl" />
            ) : packs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No packs yet. Sub a floor or stage an emergency copy.</p>
            ) : (
              <ul className="space-y-2">
                {packs.map((h) => (
                  <PackRow key={h.id} row={h} onChange={refresh} />
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-3">
          <div className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
            <div className="flex items-center gap-2">
              <ShieldAlert className="size-4 text-muted-foreground" />
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Pack preview</p>
            </div>
            {preview.data?.withheld && (
              <p className="mt-2 text-xs text-muted-foreground">
                Withheld: {formatUsd(preview.data.withheld.value)} house value
                {preview.data.withheld.invoices ? ` · ${preview.data.withheld.invoices} invoices` : ""} — not in the pack.
              </p>
            )}
            <div className="mt-3">
              {preview.data?.pack ? <PackBody pack={preview.data.pack} /> : <p className="text-sm text-muted-foreground">Pick a show.</p>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <article className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
      <div className="text-xs tracking-wide text-muted-foreground uppercase">{label}</div>
      <div className="mt-2 font-mono text-2xl tabular-nums">{value}</div>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </article>
  );
}

function PackRow({ row, onChange }: { row: HandoffRow; onChange: () => void }) {
  const live = useMemo(() => {
    if (!row.monitor || !row.lastPingAt) return false;
    return Date.now() - new Date(row.lastPingAt).getTime() < 120_000;
  }, [row.monitor, row.lastPingAt]);
  const href = row.token ? `/h/${row.token}` : null;
  return (
    <li className="rounded-xl bg-card px-4 py-3 shadow-[var(--shadow-border)]">
      <div className="flex flex-wrap items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{row.deal}</p>
          <p className="text-xs text-muted-foreground">
            to {row.to}
            {row.eventDate ? ` · ${formatDate(row.eventDate)}` : ""}
            {" · "}
            {formatUsd(row.value)} withheld
          </p>
        </div>
        <Badge variant={row.reason === "emergency" ? "danger" : "outline"}>{row.reason}</Badge>
        <Badge variant={statusVariant(row.status)}>{row.status.replace("_", " ")}</Badge>
        {row.monitor && <Badge variant={live ? "success" : "steel"}>{live ? "live" : "monitoring"}</Badge>}
      </div>
      {row.cover && <p className="mt-2 text-sm text-muted-foreground">{row.cover}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {row.token && href && (
          <>
            <Button size="sm" variant="secondary" onClick={() => void copy(packUrl(row.token!))}>
              <Copy className="size-3.5" />
              Copy link
            </Button>
            <Button size="sm" variant="ghost" asChild>
              <Link to="/h/$token" params={{ token: row.token }}>
                Open pack
              </Link>
            </Button>
          </>
        )}
        {row.status !== "recalled" && (
          <>
            <label className="ml-auto flex min-h-11 items-center gap-2 text-xs text-muted-foreground">
              Monitor
              <Switch
                checked={row.monitor}
                onCheckedChange={(on) => {
                  void setHandoffMonitor({ data: { id: row.id, monitor: on } }).then(onChange);
                }}
              />
            </label>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                void recallHandoff({ data: { id: row.id } }).then(() => {
                  toast.success("Pack recalled");
                  onChange();
                });
              }}
            >
              Recall
            </Button>
          </>
        )}
      </div>
    </li>
  );
}
