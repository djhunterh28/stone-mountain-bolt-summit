import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MemberAvatar } from "@/components/crm/avatar";
import { convertLead, updateLead } from "@/lib/crm/server";
import { DISQUALIFY_REASONS, LEAD_STAGES, type FunnelStep } from "@/lib/crm/lifecycle";
import type { Lead, Pipeline } from "@/lib/crm/types";
import { cn, formatDate, formatUsd } from "@/lib/utils";

export function FunnelStrip({
  steps,
  exits,
  active,
  onPick,
}: {
  steps: FunnelStep[];
  exits: FunnelStep[];
  active?: string | null;
  onPick?: (key: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-stretch gap-2">
            <button
              type="button"
              onClick={() => onPick?.(s.key)}
              className={cn(
                "min-w-28 rounded-xl bg-card px-3 py-3 text-left shadow-[var(--shadow-border)] transition-shadow",
                active === s.key && "ring-1 ring-primary/50",
              )}
            >
              <div className="text-[11px] tracking-wide text-muted-foreground uppercase">{s.label}</div>
              <div className="mt-1 font-mono text-xl tabular-nums">{s.count}</div>
              <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                {s.value ? formatUsd(s.value) : s.hint}
              </p>
            </button>
            {i < steps.length - 1 && (
              <div className="hidden w-3 shrink-0 self-center border-t border-border sm:block" aria-hidden />
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {exits.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => onPick?.(s.key)}
            className={cn(
              "rounded-lg px-3 py-2 text-left shadow-[var(--shadow-border)]",
              s.key === "lost" || s.key === "disqualified" ? "bg-destructive/10" : "bg-card",
              active === s.key && "ring-1 ring-primary/50",
            )}
          >
            <div className="text-[11px] tracking-wide text-muted-foreground uppercase">{s.label}</div>
            <div className="mt-0.5 flex items-baseline gap-2">
              <span className="font-mono text-sm tabular-nums">{s.count}</span>
              <span className="text-[11px] text-muted-foreground">{s.value ? formatUsd(s.value) : s.hint}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function DealStageStrip({
  stages,
  stageId,
  status,
  daysInStage = 0,
  onStage,
  onWon,
  onLost,
}: {
  stages: { id: number; name: string }[];
  stageId: number;
  status: string;
  daysInStage?: number;
  onStage?: (id: number) => void;
  onWon?: () => void;
  onLost?: () => void;
}) {
  const idx = stages.findIndex((s) => s.id === stageId);
  const won = status === "won";
  const lost = status === "lost" || status === "cancelled";
  return (
    <div className="nl-stage-row" role="list">
      {stages.map((s, i) => {
        const current = !won && !lost && i === idx;
        const done = !won && !lost && i <= idx;
        const days = current ? daysInStage : done ? 0 : null;
        return (
          <button
            key={s.id}
            type="button"
            role="listitem"
            disabled={!onStage || won || lost}
            onClick={() => onStage?.(s.id)}
            className={cn("nl-stage", done && "is-done", current && "is-current")}
            title={s.name}
          >
            <span className="truncate">
              {days != null ? `${days}d · ` : ""}
              {s.name}
            </span>
          </button>
        );
      })}
      <button
        type="button"
        role="listitem"
        disabled={!onWon}
        onClick={() => onWon?.()}
        className={cn("nl-stage", won && "is-won")}
      >
        Won
      </button>
      <button
        type="button"
        role="listitem"
        disabled={!onLost}
        onClick={() => onLost?.()}
        className={cn("nl-stage", lost && "is-lost")}
      >
        {status === "cancelled" ? "Cancelled" : "Lost"}
      </button>
    </div>
  );
}

export function LeadKanban({
  leads,
  pipeline,
}: {
  leads: Lead[];
  pipeline?: Pipeline | null;
}) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const [dq, setDq] = useState<number | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<string, Lead[]>();
    for (const s of LEAD_STAGES) map.set(s.id, []);
    for (const l of leads) {
      if (l.status === "converted" || l.status === "archived") continue;
      const list = map.get(l.status) ?? [];
      list.push(l);
      map.set(l.status, list);
    }
    return map;
  }, [leads]);

  const move = useMutation({
    mutationFn: (payload: { id: number; status: string; disqualifyReason?: string }) =>
      updateLead({ data: payload }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["leads"] });
      void qc.invalidateQueries({ queryKey: ["lifecycle"] });
    },
  });

  const convert = useMutation({
    mutationFn: (id: number) =>
      convertLead({ data: { id, pipelineId: pipeline?.id ?? 1, stageId: pipeline?.stages[0]?.id ?? 1 } }),
    onSuccess: (r) => {
      toast.success("Converted to the book");
      void qc.invalidateQueries({ queryKey: ["leads"] });
      void qc.invalidateQueries({ queryKey: ["deals"] });
      void qc.invalidateQueries({ queryKey: ["lifecycle"] });
      if (r.id) void navigate({ to: "/deals/$dealId", params: { dealId: String(r.id) } });
    },
  });

  function dropOn(status: string, id: number) {
    if (status === "disqualified") {
      setDq(id);
      return;
    }
    move.mutate({ id, status });
  }

  return (
    <div>
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin">
        {LEAD_STAGES.map((stage) => {
          const cards = grouped.get(stage.id) ?? [];
          const total = cards.reduce((s, l) => s + l.estimatedValue, 0);
          return (
            <section
              key={stage.id}
              className={cn(
                "flex w-64 shrink-0 flex-col rounded-xl bg-card p-2 shadow-[var(--shadow-border)]",
                over === stage.id && "ring-1 ring-primary/50",
              )}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(stage.id);
              }}
              onDragLeave={() => setOver((v) => (v === stage.id ? null : v))}
              onDrop={(e) => {
                e.preventDefault();
                const id = Number(e.dataTransfer.getData("text/lead-id") || dragging);
                if (id) dropOn(stage.id, id);
                setDragging(null);
                setOver(null);
              }}
            >
              <header className="flex items-baseline justify-between gap-2 px-2 py-2">
                <div>
                  <h2 className="text-sm font-medium">{stage.label}</h2>
                  <p className="text-[11px] text-muted-foreground">
                    {cards.length} · {stage.hint}
                  </p>
                </div>
                {total > 0 && <div className="font-mono text-xs tabular-nums text-muted-foreground">{formatUsd(total)}</div>}
              </header>
              <div className="flex min-h-24 flex-1 flex-col gap-2">
                {cards.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    dragging={dragging === lead.id}
                    onDragStart={() => setDragging(lead.id)}
                    onDragEnd={() => {
                      setDragging(null);
                      setOver(null);
                    }}
                    onConvert={() => convert.mutate(lead.id)}
                    converting={convert.isPending}
                    onContact={() => move.mutate({ id: lead.id, status: "contacted" })}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
      {dq != null && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-card px-3 py-2 shadow-[var(--shadow-border)]">
          <span className="text-sm">Disqualify reason</span>
          {DISQUALIFY_REASONS.map((r) => (
            <Button
              key={r}
              size="sm"
              variant="secondary"
              onClick={() => {
                move.mutate({ id: dq, status: "disqualified", disqualifyReason: r });
                setDq(null);
              }}
            >
              {r}
            </Button>
          ))}
          <Button size="sm" variant="ghost" onClick={() => setDq(null)}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}

function LeadCard({
  lead,
  dragging,
  onDragStart,
  onDragEnd,
  onConvert,
  converting,
  onContact,
}: {
  lead: Lead;
  dragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onConvert: () => void;
  converting: boolean;
  onContact: () => void;
}) {
  return (
    <article
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/lead-id", String(lead.id));
        e.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      className={cn(
        "rounded-lg bg-background p-3 shadow-[var(--shadow-border)] transition-opacity",
        dragging && "opacity-40",
      )}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm leading-snug font-medium">{lead.title}</h3>
            {lead.estimatedValue > 0 && (
              <span className="shrink-0 font-mono text-xs tabular-nums">{formatUsd(lead.estimatedValue)}</span>
            )}
          </div>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {lead.personName ?? lead.orgName ?? "Unknown"}
            {lead.venue ? ` · ${lead.venue}` : ""}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <Badge variant="outline">{lead.source}</Badge>
            {lead.eventType && <Badge variant="steel">{lead.eventType}</Badge>}
            <Badge variant={lead.score >= 70 ? "success" : lead.score >= 50 ? "steel" : "outline"}>
              {lead.score}
            </Badge>
            {lead.status === "disqualified" && lead.disqualifyReason && (
              <Badge variant="danger">{lead.disqualifyReason}</Badge>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {lead.ownerInitials && <MemberAvatar initials={lead.ownerInitials} tone={lead.ownerTone} size="sm" />}
              <span className="text-[11px] text-muted-foreground">{formatDate(lead.createdAt)}</span>
            </div>
            {lead.status === "qualified" ? (
              <Button size="sm" onClick={onConvert} disabled={converting}>
                Convert
              </Button>
            ) : lead.status === "new" ? (
              <Button size="sm" variant="ghost" onClick={onContact}>
                Contacted
              </Button>
            ) : lead.status === "disqualified" ? null : (
              <Button size="sm" variant="ghost" onClick={onConvert} disabled={converting}>
                Convert
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export function ClosedTable({
  rows,
  empty,
}: {
  rows: {
    id: number;
    title: string;
    value: number;
    reason: string | null;
    at: string | null;
    source: string | null;
    eventType: string | null;
    orgName: string | null;
    venue: string | null;
  }[];
  empty: string;
}) {
  if (rows.length === 0) {
    return <p className="px-1 py-8 text-sm text-muted-foreground">{empty}</p>;
  }
  return (
    <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
      {rows.map((r) => (
        <li key={r.id}>
          <Link
            to="/deals/$dealId"
            params={{ dealId: String(r.id) }}
            className="flex flex-wrap items-center gap-3 px-4 py-3 hover:bg-accent/40"
          >
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium">{r.title}</div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {r.orgName ?? "Independent"}
                {r.venue ? ` · ${r.venue}` : ""}
                {r.source ? ` · ${r.source}` : ""}
              </p>
            </div>
            {r.eventType && <Badge variant="steel">{r.eventType}</Badge>}
            {r.reason && <Badge variant="outline">{r.reason}</Badge>}
            <div className="text-right">
              <div className="font-mono text-sm tabular-nums">{formatUsd(r.value)}</div>
              <div className="text-[11px] text-muted-foreground">{formatDate(r.at)}</div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function LifecycleSkeleton() {
  return (
    <div className="grid gap-3">
      <div className="h-24 animate-pulse rounded-xl bg-muted" />
      <div className="h-48 animate-pulse rounded-xl bg-muted" />
    </div>
  );
}
