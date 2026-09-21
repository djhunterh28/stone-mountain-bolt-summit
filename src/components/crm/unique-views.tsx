import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  addDays,
  format,
  getDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  setMonth,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { InquiryDay, ViewShift, ViewShow } from "@/lib/crm/views";
import { cn, formatUsd } from "@/lib/utils";

export const DAY_START = 4;
export const DAY_END = 24;
const HOURS = Array.from({ length: DAY_END - DAY_START }, (_, i) => i + DAY_START);
const WEEKDAYS = ["Sa", "Su", "Mo", "Tu", "We", "Th", "Fr"];

export function pct(hour: number) {
  const clamped = Math.min(DAY_END, Math.max(DAY_START, hour));
  return ((clamped - DAY_START) / (DAY_END - DAY_START)) * 100;
}

export function formatHour(h: number) {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60) % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export function kindClass(kind: string) {
  if (kind === "setup") return "bg-warn/80";
  if (kind === "strike") return "bg-muted-foreground/45";
  if (kind === "travel") return "bg-steel/70";
  return "bg-primary/85";
}

function ymd(d: Date) {
  return format(d, "yyyy-MM-dd");
}

export function overlapDays(shows: ViewShow[]) {
  const map = new Map<string, ViewShow[]>();
  for (const s of shows) {
    const list = map.get(s.eventDate) ?? [];
    list.push(s);
    map.set(s.eventDate, list);
  }
  return [...map.entries()].filter(([, list]) => list.length > 1).sort(([a], [b]) => a.localeCompare(b));
}

export function defaultBusyDay(shows: ViewShow[], fallbackDays: string[] = []) {
  const today = ymd(new Date());
  const doubles = overlapDays(shows);
  const upcoming = doubles.filter(([d]) => d >= today);
  const weekend = upcoming.filter(([d]) => {
    const dow = new Date(`${d}T12:00:00`).getDay();
    return dow === 0 || dow === 6;
  });
  return (
    weekend[0]?.[0] ??
    upcoming[0]?.[0] ??
    doubles[0]?.[0] ??
    shows.slice().sort((a, b) => a.eventDate.localeCompare(b.eventDate)).find((s) => s.eventDate >= today)?.eventDate ??
    fallbackDays.slice().sort()[0] ??
    today
  );
}

function ClockHead({ labelWidth }: { labelWidth: string }) {
  return (
    <div className={cn("mb-1 grid text-[10px] text-muted-foreground", labelWidth)}>
      <span />
      <div className="relative h-4">
        {HOURS.filter((h) => h % 2 === 0).map((h) => (
          <span key={h} className="absolute -translate-x-1/2 tabular-nums" style={{ left: `${pct(h)}%` }}>
            {String(h).padStart(2, "0")}
          </span>
        ))}
      </div>
    </div>
  );
}

export function KindLegend() {
  return (
    <div className="mb-2 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <i className="size-2 rounded-sm bg-steel/70" /> Travel
      </span>
      <span className="inline-flex items-center gap-1.5">
        <i className="size-2 rounded-sm bg-warn/80" /> Setup
      </span>
      <span className="inline-flex items-center gap-1.5">
        <i className="size-2 rounded-sm bg-primary/85" /> Show
      </span>
      <span className="inline-flex items-center gap-1.5">
        <i className="size-2 rounded-sm bg-muted-foreground/45" /> Strike
      </span>
    </div>
  );
}

export function ViewsSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }, (_, i) => (
        <Skeleton key={i} className="h-40 rounded-xl" />
      ))}
    </div>
  );
}

export function WeekendYear({
  shows,
  year: yearProp,
  onOpenDay,
}: {
  shows: ViewShow[];
  year?: number;
  onOpenDay?: (day: string) => void;
}) {
  const [year, setYear] = useState(yearProp ?? new Date().getFullYear());
  const [picked, setPicked] = useState<string | null>(null);
  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, m) => {
      const first = setMonth(startOfYear(new Date(year, 0, 1)), m);
      const gridStart = startOfWeek(startOfMonth(first), { weekStartsOn: 6 });
      const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
      return { name: format(first, "MMM"), month: m, days };
    });
  }, [year]);

  const byDay = useMemo(() => {
    const map = new Map<string, ViewShow[]>();
    for (const s of shows) {
      const list = map.get(s.eventDate) ?? [];
      list.push(s);
      map.set(s.eventDate, list);
    }
    return map;
  }, [shows]);

  const doubles = useMemo(() => overlapDays(shows).filter(([d]) => d.startsWith(String(year))), [shows, year]);
  const selected = picked ? (byDay.get(picked) ?? []) : [];

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Button size="icon-sm" variant="ghost" onClick={() => setYear((y) => y - 1)} aria-label="Previous year">
          <ChevronLeft className="size-4" />
        </Button>
        <h2 className="text-sm font-medium tabular-nums">{year}</h2>
        <Button size="icon-sm" variant="ghost" onClick={() => setYear((y) => y + 1)} aria-label="Next year">
          <ChevronRight className="size-4" />
        </Button>
        <p className="text-sm text-muted-foreground">
          Weeks start Saturday so Friday load-ins sit against the weekend they serve. Darker cells hold more than one show.
        </p>
      </div>
      {doubles.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {doubles.map(([day, list]) => (
            <Button
              key={day}
              size="sm"
              variant={picked === day ? "secondary" : "ghost"}
              onClick={() => setPicked(day)}
            >
              {format(new Date(`${day}T12:00:00`), "EEE MMM d")} · {list.length} shows
            </Button>
          ))}
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {months.map((mo) => (
          <article key={mo.name} className="rounded-xl bg-card p-3 shadow-[var(--shadow-border)]">
            <h3 className="mb-2 text-xs font-medium">{mo.name}</h3>
            <div className="grid grid-cols-7 gap-0.5 text-center text-[10px]">
              {WEEKDAYS.map((d, i) => (
                <span key={d} className={cn("py-0.5", i < 2 ? "font-medium text-steel" : "text-muted-foreground")}>
                  {d}
                </span>
              ))}
              {mo.days.map((day, i) => {
                const key = ymd(day);
                const inMonth = day.getMonth() === mo.month;
                const n = byDay.get(key)?.length ?? 0;
                const weekend = getDay(day) === 0 || getDay(day) === 6;
                return (
                  <button
                    key={`${key}-${i}`}
                    type="button"
                    disabled={!inMonth}
                    onClick={() => setPicked(n ? key : null)}
                    title={n ? `${n} show${n > 1 ? "s" : ""}` : undefined}
                    className={cn(
                      "rounded-sm py-0.5 tabular-nums",
                      !inMonth && "text-transparent",
                      inMonth && weekend && n === 0 && "bg-muted/60 text-muted-foreground",
                      inMonth && n === 1 && "bg-primary/40 text-foreground",
                      inMonth && n > 1 && "bg-primary text-primary-foreground",
                      picked === key && "ring-1 ring-ring",
                    )}
                  >
                    {inMonth ? day.getDate() : ""}
                  </button>
                );
              })}
            </div>
          </article>
        ))}
      </div>
      {picked && (
        <ul className="mt-4 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
          <li className="flex items-center justify-between gap-2 px-4 py-2 text-xs text-muted-foreground">
            <span>{format(new Date(`${picked}T12:00:00`), "EEEE, MMM d")}</span>
            {onOpenDay && selected.length > 0 && (
              <Button size="sm" variant="ghost" onClick={() => onOpenDay(picked)}>
                Open day Gantt
              </Button>
            )}
          </li>
          {selected.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center gap-2 px-4 py-2.5 text-sm">
              <Link to="/deals/$dealId" params={{ dealId: String(s.id) }} className="min-w-0 flex-1 truncate font-medium">
                {s.title}
              </Link>
              <span className="text-xs text-muted-foreground">{s.venue}</span>
              <Badge variant="outline">{formatHour(s.loadHour)} load-in</Badge>
            </li>
          ))}
          {selected.length === 0 && <li className="px-4 py-3 text-sm text-muted-foreground">Dark day.</li>}
        </ul>
      )}
    </div>
  );
}

export function OpsDayGantt({
  shows,
  shifts,
  activities = [],
  day: controlled,
  onDayChange,
}: {
  shows: ViewShow[];
  shifts: ViewShift[];
  activities?: { id: number; subject: string; dueAt: string | null; ownerName: string | null }[];
  day?: string;
  onDayChange?: (day: string) => void;
}) {
  const doubles = useMemo(() => overlapDays(shows), [shows]);
  const busy = defaultBusyDay(shows);
  const [local, setLocal] = useState<string | null>(null);
  const day = controlled ?? local ?? busy;
  function setDay(next: string) {
    setLocal(next);
    onDayChange?.(next);
  }
  const rows = shows.filter((s) => s.eventDate === day);
  const dayShifts = shifts.filter((s) => s.day === day);
  const ticks = activities.filter((a) => a.dueAt && a.dueAt.slice(0, 10) === day);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label="Previous day"
          onClick={() => setDay(ymd(addDays(new Date(`${day}T12:00:00`), -1)))}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <h2 className="text-sm font-medium">{format(new Date(`${day}T12:00:00`), "EEEE, MMM d")}</h2>
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label="Next day"
          onClick={() => setDay(ymd(addDays(new Date(`${day}T12:00:00`), 1)))}
        >
          <ChevronRight className="size-4" />
        </Button>
        <span className="text-xs text-muted-foreground">
          {rows.length} show{rows.length === 1 ? "" : "s"} on the floor
        </span>
      </div>
      {doubles.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {doubles.map(([d, list]) => (
            <Button key={d} size="sm" variant={d === day ? "secondary" : "ghost"} onClick={() => setDay(d)}>
              {format(new Date(`${d}T12:00:00`), "EEE MMM d")} · {list.length}
            </Button>
          ))}
        </div>
      )}
      <p className="mb-3 text-sm text-muted-foreground">
        One row per event. Bars run load-in to wrap. Crew ticks sit on the same clock — travel, setup, show, strike.
      </p>
      <KindLegend />
      <div className="overflow-x-auto rounded-xl bg-card p-3 shadow-[var(--shadow-border)]">
        <div className="min-w-[44rem]">
          <ClockHead labelWidth="grid-cols-[11rem_1fr]" />
          {rows.length === 0 && (
            <p className="px-1 py-6 text-sm text-muted-foreground">No shows this day. Step to a darker cell on the year scan.</p>
          )}
          {rows.map((s) => (
            <div key={s.id} className="grid grid-cols-[11rem_1fr] items-center gap-2 border-t border-border py-2">
              <Link to="/deals/$dealId" params={{ dealId: String(s.id) }} className="min-w-0">
                <div className="truncate text-xs font-medium">{s.title}</div>
                <div className="truncate text-[10px] text-muted-foreground">{s.venue}</div>
              </Link>
              <div className="relative h-8 rounded-sm bg-muted">
                <span
                  className="absolute inset-y-1 rounded-sm bg-primary/80"
                  style={{ left: `${pct(s.loadHour)}%`, width: `${Math.max(3, pct(s.endHour) - pct(s.loadHour))}%` }}
                  title={`${s.title} · ${formatHour(s.loadHour)}–${formatHour(s.endHour)}`}
                />
                {dayShifts
                  .filter((sh) => sh.dealId === s.id)
                  .map((sh) => (
                    <span
                      key={sh.id}
                      className={cn("absolute top-0 h-1.5 rounded-full", kindClass(sh.kind))}
                      style={{ left: `${pct(sh.startHour)}%`, width: `${Math.max(2, pct(sh.endHour) - pct(sh.startHour))}%` }}
                      title={`${sh.member} · ${sh.kind} · ${formatHour(sh.startHour)}`}
                    />
                  ))}
                {ticks
                  .filter((a) => a.ownerName === s.ownerName)
                  .slice(0, 3)
                  .map((a) => {
                    const h = a.dueAt ? new Date(a.dueAt).getHours() + new Date(a.dueAt).getMinutes() / 60 : 12;
                    return (
                      <span
                        key={a.id}
                        className="absolute top-2 size-1.5 rounded-full bg-foreground"
                        style={{ left: `${pct(h)}%` }}
                        title={a.subject}
                      />
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function EventCrewGantt({ shows, shifts }: { shows: ViewShow[]; shifts: ViewShift[] }) {
  const withCrew = shows.filter((s) => shifts.some((sh) => sh.dealId === s.id));
  const preferred = useMemo(() => {
    const overlapIds = new Set(overlapDays(shows).flatMap(([, list]) => list.map((s) => s.id)));
    const ranked = (overlapIds.size ? withCrew.filter((s) => overlapIds.has(s.id)) : withCrew).slice().sort(
      (a, b) => shifts.filter((sh) => sh.dealId === b.id).length - shifts.filter((sh) => sh.dealId === a.id).length,
    );
    return ranked[0];
  }, [shows, shifts, withCrew]);
  const [dealId, setDealId] = useState<number | null>(null);
  const show = shows.find((s) => s.id === dealId) ?? preferred ?? withCrew[0] ?? shows[0];
  const rows = show ? shifts.filter((s) => s.dealId === show.id) : [];
  const members = [...new Set(rows.map((r) => r.member))];

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-end gap-2">
        <label className="space-y-1 text-xs text-muted-foreground">
          Event
          <select
            size={1}
            value={show?.id ?? ""}
            onChange={(e) => setDealId(Number(e.target.value))}
            className="mt-1 flex h-10 min-w-[16rem] rounded-md bg-secondary px-3 text-sm text-foreground shadow-[var(--shadow-border)]"
          >
            {(withCrew.length ? withCrew : shows).map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </label>
        {show && (
          <p className="pb-2 text-xs text-muted-foreground">
            {show.venue} · {format(new Date(`${show.eventDate}T12:00:00`), "MMM d")} · {formatUsd(show.value)}
          </p>
        )}
      </div>
      <p className="mb-3 text-sm text-muted-foreground">
        Who is on the floor, and when. Travel, setup, show, strike on one clock — not a spreadsheet.
      </p>
      <KindLegend />
      <div className="overflow-x-auto rounded-xl bg-card p-3 shadow-[var(--shadow-border)]">
        <div className="min-w-[44rem]">
          <ClockHead labelWidth="grid-cols-[9rem_1fr]" />
          {members.map((m) => {
            const blocks = rows.filter((r) => r.member === m);
            return (
              <div key={m} className="grid grid-cols-[9rem_1fr] items-center gap-2 border-t border-border py-1.5">
                <div className="min-w-0">
                  <div className="truncate text-xs">{m}</div>
                  <div className="truncate text-[10px] text-muted-foreground">{blocks[0]?.role}</div>
                </div>
                <div className="relative h-7 rounded-sm bg-muted">
                  {blocks.map((b) => (
                    <span
                      key={b.id}
                      className={cn("absolute inset-y-1 rounded-sm", kindClass(b.kind))}
                      style={{ left: `${pct(b.startHour)}%`, width: `${Math.max(3, pct(b.endHour) - pct(b.startHour))}%` }}
                      title={`${b.role} · ${b.kind} · ${formatHour(b.startHour)}–${formatHour(b.endHour)}`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
          {members.length === 0 && (
            <p className="py-6 text-sm text-muted-foreground">No crew plotted on this show yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function StaffDayGantt({
  shows,
  shifts,
}: {
  shows: ViewShow[];
  shifts: ViewShift[];
}) {
  const doubles = useMemo(() => overlapDays(shows), [shows]);
  const busy = defaultBusyDay(shows, shifts.map((s) => s.day));
  const [local, setLocal] = useState<string | null>(null);
  const day = local ?? busy;
  const dayShifts = shifts.filter((s) => s.day === day);
  const members = [...new Set(dayShifts.map((s) => s.member))];
  const dayShows = shows.filter((s) => s.eventDate === day);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label="Previous day"
          onClick={() => setLocal(ymd(addDays(new Date(`${day}T12:00:00`), -1)))}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <h2 className="text-sm font-medium">{format(new Date(`${day}T12:00:00`), "EEEE, MMM d")}</h2>
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label="Next day"
          onClick={() => setLocal(ymd(addDays(new Date(`${day}T12:00:00`), 1)))}
        >
          <ChevronRight className="size-4" />
        </Button>
        <span className="text-xs text-muted-foreground">
          {members.length} on the floor · {dayShows.length} show{dayShows.length === 1 ? "" : "s"}
        </span>
      </div>
      {doubles.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {doubles.map(([d, list]) => (
            <Button key={d} size="sm" variant={d === day ? "secondary" : "ghost"} onClick={() => setLocal(d)}>
              {format(new Date(`${d}T12:00:00`), "EEE MMM d")} · {list.length}
            </Button>
          ))}
        </div>
      )}
      <KindLegend />
      <div className="overflow-x-auto rounded-xl bg-card p-3 shadow-[var(--shadow-border)]">
        <div className="min-w-[44rem]">
          <ClockHead labelWidth="grid-cols-[9rem_1fr]" />
          {members.map((m) => {
            const blocks = dayShifts.filter((r) => r.member === m);
            return (
              <div key={m} className="grid grid-cols-[9rem_1fr] items-center gap-2 border-t border-border py-1.5">
                <div className="min-w-0">
                  <div className="truncate text-xs">{m}</div>
                  <div className="truncate text-[10px] text-muted-foreground">{blocks.map((b) => b.deal).join(" · ")}</div>
                </div>
                <div className="relative h-7 rounded-sm bg-muted">
                  {blocks.map((b) => (
                    <span
                      key={b.id}
                      className={cn("absolute inset-y-1 rounded-sm", kindClass(b.kind))}
                      style={{ left: `${pct(b.startHour)}%`, width: `${Math.max(3, pct(b.endHour) - pct(b.startHour))}%` }}
                      title={`${b.deal} · ${b.role} · ${b.kind}`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
          {members.length === 0 && (
            <p className="py-6 text-sm text-muted-foreground">No crew plotted this day. Jump a double-header chip.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function InquiryHeat({ days }: { days: InquiryDay[] }) {
  const byDay = useMemo(() => {
    const map = new Map<string, InquiryDay>();
    for (const d of days) map.set(d.day, d);
    return map;
  }, [days]);
  const end = new Date();
  const start = addDays(end, -53 * 7);
  const gridStart = startOfWeek(start, { weekStartsOn: 6 });
  const weeks = 53;
  const cells = useMemo(() => {
    return Array.from({ length: weeks }, (_, w) =>
      Array.from({ length: 7 }, (_, dow) => {
        const day = addDays(gridStart, w * 7 + dow);
        const key = ymd(day);
        return { day, key, cell: byDay.get(key), future: day > end };
      }),
    );
  }, [byDay, gridStart, end]);
  const max = Math.max(1, ...days.map((d) => d.n));
  const total = days.reduce((s, d) => s + d.n, 0);
  const [picked, setPicked] = useState<string | null>(null);
  const selected = picked ? byDay.get(picked) : null;

  return (
    <div>
      <p className="mb-3 text-sm text-muted-foreground">
        {total} inbound touches across 18 months. Galas stack Sep–Dec. Outdoor holds light up May–June. Weekends run hotter than Tuesdays.
      </p>
      <div className="overflow-x-auto rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
        <div className="flex gap-3">
          <div className="flex w-6 shrink-0 flex-col justify-between py-5 text-[9px] text-muted-foreground">
            <span>Sa</span>
            <span>Mo</span>
            <span>We</span>
            <span>Fr</span>
          </div>
          <div>
            <div className="relative mb-1 h-3">
              {cells.map((week, wi) => {
                const month = week[0].day.getMonth();
                const prev = wi === 0 ? -1 : cells[wi - 1][0].day.getMonth();
                if (month === prev) return null;
                return (
                  <span
                    key={wi}
                    className="absolute text-[9px] text-muted-foreground"
                    style={{ left: `${wi * 13}px` }}
                  >
                    {format(week[0].day, "MMM")}
                  </span>
                );
              })}
            </div>
            <div className="flex gap-px">
              {cells.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-px">
                  {week.map((c) => {
                    const n = c.cell?.n ?? 0;
                    const op = n === 0 ? 0.12 : 0.25 + (n / max) * 0.75;
                    return (
                      <button
                        key={c.key}
                        type="button"
                        disabled={c.future}
                        onClick={() => setPicked(c.future ? null : c.key)}
                        title={c.future ? "" : `${c.key} · ${n} inquiries`}
                        className={cn(
                          "block size-3 rounded-sm",
                          c.future ? "bg-transparent" : "bg-primary",
                          picked === c.key && "ring-1 ring-ring",
                        )}
                        style={{ opacity: c.future ? 0 : op }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
          Less
          {[0.12, 0.35, 0.55, 0.8, 1].map((o) => (
            <span key={o} className="size-3 rounded-sm bg-primary" style={{ opacity: o }} />
          ))}
          More
        </div>
      </div>
      {selected && picked && (
        <div className="mt-3 rounded-xl bg-card px-4 py-3 text-sm shadow-[var(--shadow-border)]">
          <div className="text-xs text-muted-foreground">{format(new Date(`${picked}T12:00:00`), "EEEE, MMM d yyyy")}</div>
          <div className="mt-1 flex flex-wrap gap-4 tabular-nums">
            <span>{selected.n} total</span>
            <span className="text-muted-foreground">{selected.leads} leads</span>
            <span className="text-muted-foreground">{selected.deals} deals</span>
            <span className="text-muted-foreground">{selected.forms} forms</span>
          </div>
        </div>
      )}
    </div>
  );
}
