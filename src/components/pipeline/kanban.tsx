import { useMemo, useRef, useState } from "react";
import { Clock, Flame, GripVertical, MapPin } from "lucide-react";
import { MemberAvatar } from "@/components/crm/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate, formatUsd } from "@/lib/utils";
import { DEFAULT_COL_WIDTH, MAX_COL_WIDTH, MIN_COL_WIDTH } from "@/lib/crm/prefs";
import type { DealCard, Stage } from "@/lib/crm/types";

export function Kanban({
  stages,
  deals,
  onMove,
  onOpen,
  columnWidths,
  onColumnWidths,
  onColumnWidthsCommit,
}: {
  stages: Stage[];
  deals: DealCard[];
  onMove: (dealId: number, stageId: number) => void;
  onOpen: (dealId: number) => void;
  columnWidths?: Record<number, number>;
  onColumnWidths?: (next: Record<number, number>) => void;
  onColumnWidthsCommit?: (next: Record<number, number>) => void;
}) {
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);
  const [resizing, setResizing] = useState<number | null>(null);
  const drag = useRef<{ id: number; startX: number; startW: number } | null>(null);

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

  function widthOf(id: number) {
    return columnWidths?.[id] ?? DEFAULT_COL_WIDTH;
  }

  function applyWidth(id: number, px: number) {
    const next = {
      ...(columnWidths ?? {}),
      [id]: Math.min(MAX_COL_WIDTH, Math.max(MIN_COL_WIDTH, Math.round(px))),
    };
    onColumnWidths?.(next);
    return next;
  }

  function startResize(e: React.PointerEvent, id: number) {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { id, startX: e.clientX, startW: widthOf(id) };
    setResizing(id);
  }

  function onResizeMove(e: React.PointerEvent) {
    const d = drag.current;
    if (!d) return;
    applyWidth(d.id, d.startW + (e.clientX - d.startX));
  }

  function endResize(e: React.PointerEvent) {
    const d = drag.current;
    if (!d) return;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
    const next = applyWidth(d.id, d.startW + (e.clientX - d.startX));
    drag.current = null;
    setResizing(null);
    onColumnWidthsCommit?.(next);
  }

  return (
    <div className="flex h-full gap-3 overflow-x-auto px-4 pb-6 sm:px-6 scrollbar-thin">
      {stages.map((stage) => {
        const cards = grouped.get(stage.id) ?? [];
        const total = cards.reduce((s, d) => s + d.value, 0);
        const w = widthOf(stage.id);
        return (
          <section
            key={stage.id}
            style={{ width: w, minWidth: w, maxWidth: w }}
            className={cn(
              "kanban-col flex max-h-full flex-col rounded-xl bg-card p-2 shadow-[var(--shadow-border)]",
              over === stage.id && "ring-1 ring-primary/50",
            )}
            onDragOver={(e) => {
              if (resizing) return;
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
              <div className="min-w-0">
                <h2 className="truncate text-sm font-medium">{stage.name}</h2>
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
            <div
              role="separator"
              aria-orientation="vertical"
              aria-label={`Resize ${stage.name}`}
              title="Drag to resize · double-click to reset"
              className={cn("kanban-resize", resizing === stage.id && "is-active")}
              onPointerDown={(e) => startResize(e, stage.id)}
              onPointerMove={onResizeMove}
              onPointerUp={endResize}
              onPointerCancel={endResize}
              onDoubleClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const next = { ...(columnWidths ?? {}) };
                delete next[stage.id];
                onColumnWidths?.(next);
                onColumnWidthsCommit?.(next);
              }}
            />
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
