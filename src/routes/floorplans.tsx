import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Copy, MousePointer2, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  archiveFloorPlan,
  CANVAS,
  createFloorPlan,
  duplicateFloorPlan,
  getFloorPlans,
  KINDS,
  saveFloorPlan,
  ZONE_SIZE,
  type FloorKind,
  type FloorLayout,
  type FloorMark,
  type FloorPlan,
  type FloorShape,
} from "@/lib/crm/floors";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/floorplans")({ component: FloorPage });

type Tool = FloorKind | "select";

function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n));
}

function svgPoint(svg: SVGSVGElement, clientX: number, clientY: number) {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: 0, y: 0 };
  const p = pt.matrixTransform(ctm.inverse());
  return { x: clamp(p.x, 0, CANVAS.w), y: clamp(p.y, 0, CANVAS.h) };
}

function isZone(kind: FloorKind) {
  return kind === "stage" || kind === "seat" || kind === "hold";
}

function zoneBox(m: FloorMark) {
  const w = m.w ?? 16;
  const h = m.h ?? 10;
  return { w, h, x: m.x - w / 2, y: m.y - h / 2 };
}

function hitMark(m: FloorMark, x: number, y: number) {
  if (isZone(m.kind)) {
    const b = zoneBox(m);
    return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
  }
  return Math.hypot(m.x - x, m.y - y) < 3.6;
}

function hitResize(m: FloorMark, x: number, y: number) {
  if (!isZone(m.kind)) return false;
  const b = zoneBox(m);
  return Math.hypot(x - (b.x + b.w), y - (b.y + b.h)) < 3.2;
}

function FloorPage() {
  const desk = useQuery({ queryKey: ["floors"], queryFn: () => getFloorPlans() });
  const qc = useQueryClient();
  const plans = desk.data ?? [];
  const [planId, setPlanId] = useState<number | null>(null);
  const [tool, setTool] = useState<Tool>("select");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [localMarks, setLocalMarks] = useState<FloorMark[] | null>(null);
  const [name, setName] = useState("");
  const [venue, setVenue] = useState("");
  const [notes, setNotes] = useState("");
  const drag = useRef<{ id: string; dx: number; dy: number; moved: boolean; mode: "move" | "resize" } | null>(null);
  const marksRef = useRef<FloorMark[]>([]);

  const plan = plans.find((p) => p.id === planId) ?? (planId == null ? plans[0] ?? null : null);
  const marks = localMarks ?? plan?.marks ?? [];
  marksRef.current = marks;
  const selected = marks.find((m) => m.id === selectedId) ?? null;
  const library = plans.filter((p) => p.template);
  const plots = plans.filter((p) => !p.template);

  useEffect(() => {
    if (plan && planId == null) setPlanId(plan.id);
  }, [plan, planId]);

  useEffect(() => {
    if (!plan) return;
    setLocalMarks(null);
    setSelectedId(null);
    setName(plan.name);
    setVenue(plan.venue ?? "");
    setNotes(plan.notes ?? "");
  }, [plan?.id]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.key === "Backspace" || e.key === "Delete") && selectedId && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        void removeMark(selectedId);
      }
      if (e.key === "Escape") {
        setSelectedId(null);
        setTool("select");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, plan?.id]);

  function writeCache(next: FloorPlan[]) {
    qc.setQueryData(["floors"], next);
  }

  function refresh() {
    void qc.invalidateQueries({ queryKey: ["floors"] });
  }

  async function persist(next: FloorMark[], extra?: Partial<Pick<FloorPlan, "name" | "venue" | "notes">>) {
    if (!plan) return;
    setLocalMarks(next);
    const res = await saveFloorPlan({
      data: {
        id: plan.id,
        marks: next,
        name: extra?.name ?? name,
        venue: extra?.venue ?? venue,
        notes: extra?.notes ?? notes,
      },
    });
    if (!res.ok) toast.error("Could not save the plot");
    refresh();
  }

  function place(x: number, y: number) {
    if (!plan || tool === "select") return;
    const kind = tool;
    const meta = KINDS.find((k) => k.id === kind);
    const zone = isZone(kind);
    const size = ZONE_SIZE[kind];
    const mark: FloorMark = {
      id: `m${Date.now()}`,
      kind,
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      label: meta?.label ?? kind,
      ...(zone && size ? { w: size.w, h: size.h } : {}),
    };
    setSelectedId(mark.id);
    void persist([...marksRef.current, mark]);
    toast.success(`${meta?.label ?? kind} dropped`);
  }

  function moveMark(id: string, x: number, y: number) {
    const next = marksRef.current.map((m) => (m.id === id ? { ...m, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 } : m));
    setLocalMarks(next);
  }

  function resizeMark(id: string, x: number, y: number) {
    const next = marksRef.current.map((m) => {
      if (m.id !== id || !isZone(m.kind)) return m;
      const b = zoneBox(m);
      const w = clamp(Math.round((x - b.x) * 10) / 10, 8, 80);
      const h = clamp(Math.round((y - b.y) * 10) / 10, 6, 48);
      return { ...m, w, h, x: Math.round((b.x + w / 2) * 10) / 10, y: Math.round((b.y + h / 2) * 10) / 10 };
    });
    setLocalMarks(next);
  }

  function patchMark(id: string, patch: Partial<FloorMark>) {
    void persist(marksRef.current.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }

  function removeMark(id: string) {
    setSelectedId(null);
    void persist(marksRef.current.filter((m) => m.id !== id));
  }

  function onPointerDown(e: ReactPointerEvent<SVGSVGElement>) {
    if (!plan) return;
    const svg = e.currentTarget;
    const p = svgPoint(svg, e.clientX, e.clientY);
    if (selected && hitResize(selected, p.x, p.y)) {
      drag.current = { id: selected.id, dx: 0, dy: 0, moved: false, mode: "resize" };
      svg.setPointerCapture(e.pointerId);
      return;
    }
    const hit = [...marks].reverse().find((m) => hitMark(m, p.x, p.y));
    if (hit) {
      setSelectedId(hit.id);
      drag.current = { id: hit.id, dx: p.x - hit.x, dy: p.y - hit.y, moved: false, mode: "move" };
      svg.setPointerCapture(e.pointerId);
      return;
    }
    drag.current = null;
    setSelectedId(null);
    if (tool !== "select") place(p.x, p.y);
  }

  function onPointerMove(e: ReactPointerEvent<SVGSVGElement>) {
    if (!drag.current) return;
    const p = svgPoint(e.currentTarget, e.clientX, e.clientY);
    drag.current.moved = true;
    if (drag.current.mode === "resize") resizeMark(drag.current.id, p.x, p.y);
    else moveMark(drag.current.id, p.x - drag.current.dx, p.y - drag.current.dy);
  }

  function onPointerUp() {
    if (drag.current?.moved) void persist(marksRef.current);
    drag.current = null;
  }

  async function onDuplicate() {
    if (!plan) return;
    const res = await duplicateFloorPlan({ data: { id: plan.id } });
    if (res.ok && res.plan) {
      writeCache([res.plan, ...plans.filter((p) => p.id !== res.plan!.id)]);
      setPlanId(res.plan.id);
      toast.success("Show plot copied from this venue");
      refresh();
    }
  }

  async function onCreate() {
    const made = await createFloorPlan({ data: { name: "New venue shell", venue: "" } });
    writeCache([made, ...plans.filter((p) => p.id !== made.id)]);
    setPlanId(made.id);
    toast.success("Blank shell ready");
    refresh();
  }

  async function onArchive() {
    if (!plan) return;
    await archiveFloorPlan({ data: { id: plan.id } });
    writeCache(plans.filter((p) => p.id !== plan.id));
    toast.success("Venue archived");
    setPlanId(null);
    refresh();
  }

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of marks) map.set(m.kind, (map.get(m.kind) ?? 0) + 1);
    return map;
  }, [marks]);

  const powerN = (counts.get("power") ?? 0) + (counts.get("distro") ?? 0);
  const zoneN = (counts.get("stage") ?? 0) + (counts.get("seat") ?? 0) + (counts.get("hold") ?? 0);
  const doorN = (counts.get("loadin") ?? 0) + (counts.get("ingress") ?? 0) + (counts.get("egress") ?? 0);

  return (
    <div className="pb-12">
      <PageHeader
        title="Floor plans"
        subtitle="Store a venue once. Plot power, docks, ingress, and holds — then copy the shell onto the next show."
        actions={
          <>
            <Button size="sm" variant="secondary" onClick={() => void onCreate()}>
              <Plus className="size-3.5" />
              New venue
            </Button>
            {plan && (
              <Button size="sm" onClick={() => void onDuplicate()}>
                <Copy className="size-3.5" />
                Plot for a show
              </Button>
            )}
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6">
        <Stat label="Library" value={String(library.length)} hint="Reusable venue shells" />
        <Stat label="Show plots" value={String(plots.length)} hint="Copied onto a hold" />
        <Stat label="Power" value={String(powerN)} hint="Outlets and distros on this plot" />
        <Stat label="Zones" value={String(zoneN)} hint="Staging, seating, restricted" />
      </div>

      <div className="mt-6 grid gap-4 px-4 lg:grid-cols-[16rem_minmax(0,1fr)_16rem] sm:px-6">
        <aside className="space-y-4">
          {desk.isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          ) : (
            <>
              <PlanGroup title="Library" items={library} activeId={plan?.id} onPick={setPlanId} />
              <PlanGroup title="Show plots" items={plots} activeId={plan?.id} onPick={setPlanId} empty="Copy a library shell with Plot for a show." />
            </>
          )}
        </aside>

        <section>
          <div className="mb-3 flex flex-wrap gap-1">
            <Button size="sm" variant={tool === "select" ? "secondary" : "ghost"} onClick={() => setTool("select")}>
              <MousePointer2 className="size-3.5" />
              Select
            </Button>
            {KINDS.map((k) => (
              <Button
                key={k.id}
                size="sm"
                className="shrink-0"
                variant={tool === k.id ? "secondary" : "ghost"}
                onClick={() => setTool(k.id)}
                title={k.hint}
              >
                <KindDot kind={k.id} />
                {k.label}
              </Button>
            ))}
          </div>
          <p className="mb-2 text-sm text-muted-foreground">
            {plan
              ? tool === "select"
                ? `${plan.name} · drag to move · pull the corner to size a zone`
                : `${plan.name} · click to drop ${KINDS.find((k) => k.id === tool)?.label.toLowerCase()}`
              : "Pick a venue"}
          </p>
          {desk.isLoading ? (
            <Skeleton className="aspect-[100/62] w-full rounded-xl" />
          ) : plan ? (
            <svg
              viewBox={`0 0 ${CANVAS.w} ${CANVAS.h}`}
              className={cn(
                "aspect-[100/62] w-full touch-none rounded-xl bg-card shadow-[var(--shadow-border)]",
                tool === "select" ? "cursor-default" : "cursor-crosshair",
              )}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              role="img"
              aria-label={`${plan.name} floor plan`}
            >
              <VenueShell layout={plan.layout} />
              {marks.map((m) => (
                <MarkShape key={m.id} mark={m} selected={m.id === selectedId} />
              ))}
            </svg>
          ) : (
            <div className="rounded-xl bg-card px-4 py-16 text-center text-sm text-muted-foreground shadow-[var(--shadow-border)]">
              No venues yet. Save a room once and reuse it on the next hold.
            </div>
          )}
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {KINDS.map((k) => (
              <li key={k.id}>
                <Badge variant={k.id === "hold" ? "danger" : k.id === "power" || k.id === "egress" ? "warn" : k.id === "distro" || k.id === "stage" ? "steel" : "outline"}>
                  {k.label} {counts.get(k.id) ?? 0}
                </Badge>
              </li>
            ))}
            <li>
              <Badge variant="outline">Doors {doorN}</Badge>
            </li>
          </ul>
        </section>

        <aside className="space-y-4">
          {plan && (
            <div className="space-y-2 rounded-xl bg-card p-3 shadow-[var(--shadow-border)]">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Venue</p>
              <Label htmlFor="fp-name">Name</Label>
              <Input
                id="fp-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => void persist(marks, { name })}
              />
              <Label htmlFor="fp-venue">Building</Label>
              <Input
                id="fp-venue"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                onBlur={() => void persist(marks, { venue })}
              />
              <Label htmlFor="fp-notes">Crew notes</Label>
              <Textarea
                id="fp-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={() => void persist(marks, { notes })}
                className="min-h-20"
              />
              <Button size="sm" variant="ghost" className="w-full" onClick={() => void onArchive()}>
                Archive venue
              </Button>
            </div>
          )}
          {selected ? (
            <div className="space-y-2 rounded-xl bg-card p-3 shadow-[var(--shadow-border)]">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Mark</p>
              <p className="text-sm font-medium">{KINDS.find((k) => k.id === selected.kind)?.label}</p>
              <Label htmlFor="mk-label">Label</Label>
              <Input
                id="mk-label"
                defaultValue={selected.label}
                key={selected.id}
                onBlur={(e) => patchMark(selected.id, { label: e.target.value })}
              />
              <Button size="sm" variant="ghost" className="w-full" onClick={() => removeMark(selected.id)}>
                <Trash2 className="size-3.5" />
                Remove
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Outlets and distros are points. Staging, seating, and restricted are zones — drop them, then drag or pull a corner.
            </p>
          )}
          {marks.length > 0 && (
            <ul className="space-y-1">
              <li className="text-xs font-medium tracking-wide text-muted-foreground uppercase">On this plot</li>
              {marks.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(m.id)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm",
                      m.id === selectedId ? "bg-card shadow-[var(--shadow-border)]" : "hover:bg-muted/70",
                    )}
                  >
                    <KindDot kind={m.kind} />
                    <span className="min-w-0 truncate">{m.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
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

function PlanGroup({
  title,
  items,
  activeId,
  onPick,
  empty,
}: {
  title: string;
  items: FloorPlan[];
  activeId?: number;
  onPick: (id: number) => void;
  empty?: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{title}</p>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{empty ?? "None yet."}</p>
      ) : (
        <ul className="flex gap-2 overflow-x-auto lg:block lg:space-y-2 lg:overflow-visible">
          {items.map((p) => (
            <li key={p.id} className="min-w-[12rem] lg:min-w-0">
              <button
                type="button"
                onClick={() => onPick(p.id)}
                className={cn(
                  "w-full rounded-xl px-3 py-2.5 text-left shadow-[var(--shadow-border)]",
                  p.id === activeId ? "bg-card" : "bg-muted/60 hover:bg-card",
                )}
              >
                <div className="truncate text-sm font-medium">{p.name}</div>
                <div className="truncate text-xs text-muted-foreground">{p.venue ?? "Unnamed room"}</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {p.template ? <Badge variant="steel">library</Badge> : <Badge variant="outline">show plot</Badge>}
                  <span className="text-xs text-muted-foreground">{p.marks.length} marks</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function KindDot({ kind }: { kind: FloorKind }) {
  return (
    <span
      className={cn(
        "inline-block size-2 shrink-0",
        kind === "distro" || kind === "loadin" ? "rounded-sm" : "rounded-full",
        kind === "hold" && "bg-destructive",
        (kind === "power" || kind === "egress") && "bg-warn",
        (kind === "distro" || kind === "stage") && "bg-primary",
        (kind === "loadin" || kind === "ingress" || kind === "seat") && "bg-steel",
      )}
    />
  );
}

function VenueShell({ layout }: { layout: FloorLayout }) {
  const shell = layout.shell;
  return (
    <g>
      <defs>
        <pattern id="nl-grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" className="stroke-border" strokeWidth="0.18" />
        </pattern>
        <pattern id="nl-hold" width="2.4" height="2.4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="2.4" className="stroke-destructive/45" strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect x="0" y="0" width={CANVAS.w} height={CANVAS.h} className="fill-muted" />
      <rect x={shell.x} y={shell.y} width={shell.w} height={shell.h} className="fill-card stroke-foreground/25" strokeWidth="0.6" />
      <rect x={shell.x} y={shell.y} width={shell.w} height={shell.h} fill="url(#nl-grid)" />
      {layout.rooms.map((r, i) => (
        <Shape key={`r${i}`} s={r} className="fill-muted/80 stroke-border" />
      ))}
      {layout.stage && <Shape s={layout.stage} className="fill-primary/15 stroke-primary/40" />}
      {layout.docks.map((d, i) => (
        <Shape key={`d${i}`} s={d} className="fill-steel/20 stroke-steel" />
      ))}
      {layout.doors.map((d, i) => (
        <g key={`door${i}`}>
          <rect x={d.x} y={d.y} width={d.w} height={d.h} className={d.kind === "ingress" ? "fill-primary/35" : "fill-warn/35"} />
        </g>
      ))}
      <text x="4" y="60" fontSize="2.2" className="fill-muted-foreground pointer-events-none">
        Plot · {CANVAS.w} × {CANVAS.h}
      </text>
    </g>
  );
}

function Shape({ s, className }: { s: FloorShape; className: string }) {
  return <rect x={s.x} y={s.y} width={s.w} height={s.h} className={className} strokeWidth="0.4" />;
}

function MarkShape({ mark, selected }: { mark: FloorMark; selected: boolean }) {
  if (isZone(mark.kind)) {
    const b = zoneBox(mark);
    return (
      <g>
        <rect
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          rx="1.2"
          fill={mark.kind === "hold" ? "url(#nl-hold)" : undefined}
          className={cn(
            mark.kind === "hold"
              ? "stroke-destructive"
              : mark.kind === "seat"
                ? "fill-steel/20 stroke-steel"
                : "fill-primary/20 stroke-primary",
            selected && "stroke-foreground",
          )}
          strokeWidth={selected ? 0.7 : 0.4}
          strokeDasharray={mark.kind === "seat" ? "1.2 0.8" : undefined}
        />
        <text x={mark.x} y={mark.y + 1} textAnchor="middle" fontSize="2.3" className="fill-foreground pointer-events-none">
          {mark.label}
        </text>
        {selected && (
          <rect x={b.x + b.w - 1.6} y={b.y + b.h - 1.6} width="3.2" height="3.2" className="fill-foreground stroke-background" strokeWidth="0.3" />
        )}
      </g>
    );
  }
  const r = selected ? 2.6 : 2.1;
  const fill =
    mark.kind === "power" || mark.kind === "egress"
      ? "fill-warn"
      : mark.kind === "distro"
        ? "fill-primary"
        : "fill-steel";
  return (
    <g>
      {mark.kind === "distro" ? (
        <rect x={mark.x - r} y={mark.y - r} width={r * 2} height={r * 2} className={fill} />
      ) : mark.kind === "loadin" ? (
        <polygon
          points={`${mark.x},${mark.y - 2.6} ${mark.x + 2.4},${mark.y} ${mark.x},${mark.y + 2.6} ${mark.x - 2.4},${mark.y}`}
          className={fill}
        />
      ) : mark.kind === "ingress" ? (
        <polygon points={`${mark.x},${mark.y - 2.5} ${mark.x + 2.2},${mark.y + 2} ${mark.x - 2.2},${mark.y + 2}`} className={fill} />
      ) : mark.kind === "egress" ? (
        <polygon points={`${mark.x - 2.2},${mark.y - 2} ${mark.x + 2.2},${mark.y - 2} ${mark.x},${mark.y + 2.5}`} className={fill} />
      ) : (
        <circle cx={mark.x} cy={mark.y} r={r} className={fill} />
      )}
      {selected && <circle cx={mark.x} cy={mark.y} r={r + 1.4} className="fill-none stroke-foreground" strokeWidth="0.4" />}
      <text x={mark.x} y={mark.y + 5.2} textAnchor="middle" fontSize="2.3" className="fill-foreground pointer-events-none">
        {mark.label}
      </text>
    </g>
  );
}
