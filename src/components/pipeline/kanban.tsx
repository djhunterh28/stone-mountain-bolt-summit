import { useMemo, useState } from "react";
import { Clock, Flame, GripVertical, MapPin } from "lucide-react";
import { MemberAvatar } from "@/components/crm/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate, formatUsd } from "@/lib/utils";
import type { DealCard, Stage } from "@/lib/crm/types";

export function Kanban({
  stages,
  deals,
  onMove,
  onOpen,
}: {
  stages: Stage[];
  deals: DealCard[];
  onMove: (dealId: number, stageId: number) => void;
  onOpen: (dealId: number) => void;
}) {
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<number, DealCard[]>();
    for (const s of stages) map.set(s.id, []);
    for (const d of deals) {
      const list = map.get(d.stageId) ?? [];
      list.push(d);
      map.set(d.stageId, list);
    }
    return map;
  }, [stages, deals]);

  return (
    <div className="flex h-full gap-3 overflow-x-auto px-4 pb-6 sm:px-6 scrollbar-thin">
      {stages.map((stage) => {
        const cards = grouped.get(stage.id) ?? [];
        const total = cards.reduce((s, d) => s + d.value, 0);
        return (
          <section
            key={stage.id}
            className={cn(
              "kanban-col flex max-h-full flex-col rounded-xl bg-card p-2 shadow-[var(--shadow-border)]",
              over === stage.id && "ring-1 ring-primary/50",
            )}
            onDragOver={(e) => {
              e.preventDefault();
              setOver(stage.id);
            }}
            onDragLeave={() => setOver((v) => (v === stage.id ? null : v))}
            onDrop={(e) => {
              e.preventDefault();
              const id = Number(e.dataTransfer.getData("text/deal-id") || dragging);
              if (id) onMove(id, stage.id);
              setDragging(null);
              setOver(null);
            }}
          >
            <header className="flex items-baseline justify-between gap-2 px-2 py-2">
              <div>
                <h2 className="text-sm font-medium">{stage.name}</h2>
                <p className="text-[11px] text-muted-foreground">
                  {cards.length} · {stage.probability}%
                </p>
              </div>
              <div className="font-mono text-sm tabular-nums text-muted-foreground">{formatUsd(total)}</div>
            </header>
            <div className="flex min-h-24 flex-1 flex-col gap-2 overflow-y-auto rounded-lg p-0.5">
              {cards.map((deal) => (
                <DealCardView
                  key={deal.id}
                  deal={deal}
                  dragging={dragging === deal.id}
                  onDragStart={() => setDragging(deal.id)}
                  onDragEnd={() => {
                    setDragging(null);
                    setOver(null);
                  }}
                  onOpen={() => onOpen(deal.id)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function DealCardView({
  deal,
  dragging,
  onDragStart,
  onDragEnd,
  onOpen,
}: {
  deal: DealCard;
  dragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onOpen: () => void;
}) {
  return (
    <article
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/deal-id", String(deal.id));
        e.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      onClick={onOpen}
      className={cn(
        "cursor-pointer rounded-lg bg-background p-3 text-left shadow-[var(--shadow-border)] transition-[box-shadow,transform,opacity] duration-150 ease-out hover:shadow-[var(--shadow-border-hover)]",
        dragging && "opacity-40",
        deal.rotting && "ring-1 ring-warn/40",
      )}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm leading-snug font-medium">{deal.title}</h3>
            <span className="shrink-0 font-mono text-xs tabular-nums">{formatUsd(deal.value)}</span>
          </div>
          <p className="mt-1 truncate text-xs text-muted-foreground">{deal.orgName ?? "Independent"}</p>
          {deal.venue && (
            <p className="mt-1 flex items-center gap-1 truncate text-[11px] text-muted-foreground">
              <MapPin className="size-3" />
              {deal.venue}
              {deal.eventDate ? ` · ${formatDate(deal.eventDate)}` : ""}
            </p>
          )}
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {deal.ownerInitials && (
                <MemberAvatar initials={deal.ownerInitials} tone={deal.ownerTone} size="sm" />
              )}
              {deal.nextActivity && (
                <span className="inline-flex max-w-28 items-center gap-1 truncate text-[11px] text-muted-foreground">
                  <Clock className="size-3" />
                  {deal.nextActivity}
                </span>
              )}
            </div>
            {deal.rotting && (
              <Badge variant="warn" className="gap-1">
                <Flame className="size-3" />
                {deal.daysInStage}d
              </Badge>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
