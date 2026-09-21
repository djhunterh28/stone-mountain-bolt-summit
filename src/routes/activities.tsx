import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addDays,
  format,
  isSameDay,
  startOfMonth,
  startOfWeek,
  addMonths,
  subMonths,
  startOfYear,
  setMonth,
  getDay,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { listActivities, listDeals, toggleActivity } from "@/lib/crm/server";
import { listCalendarAccounts, syncCalendars, toggleCalendar } from "@/lib/crm/governance";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useUi } from "@/lib/crm/store";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/activities")({ component: ActivitiesPage });

function ActivitiesPage() {
  const qc = useQueryClient();
  const { setAddOpen, memberId } = useUi();
  const [mine, setMine] = useState(false);
  const [view, setView] = useState("list");
  const [cursor, setCursor] = useState(() => new Date());
  const acts = useQuery({
    queryKey: ["activities", mine ? memberId : "all"],
    queryFn: () => listActivities({ data: { ownerId: mine ? memberId : undefined } }),
  });
  const cals = useQuery({ queryKey: ["calendars"], queryFn: () => listCalendarAccounts() });
  const deals = useQuery({
    queryKey: ["deals", 1, "all"],
    queryFn: () => listDeals({ data: { pipelineId: 1, status: "all" } }),
    enabled: view === "year" || view === "gantt",
  });
  const list = acts.data ?? [];
  const overdue = list.filter((a) => !a.done && a.dueAt && new Date(a.dueAt) < new Date()).length;

  return (
    <div>
      <PageHeader
        title="Calendar"
        subtitle={`${overdue} overdue · month, week, year, Gantt, and a webcal feed for Apple and Google.`}
        actions={
          <>
            <Tabs value={view} onValueChange={setView}>
              <TabsList className="flex h-auto flex-wrap">
                <TabsTrigger value="list">List</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
                <TabsTrigger value="gantt">Gantt</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button size="sm" variant={mine ? "secondary" : "ghost"} onClick={() => setMine(!mine)}>
              Mine
            </Button>
            <Button size="sm" onClick={() => setAddOpen(true, "activity")}>
              Schedule
            </Button>
            <Button asChild size="sm" variant="ghost">
              <a href="/cal/northline">Webcal</a>
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                syncCalendars({ data: { memberId } }).then((r) => {
                  toast.success(`Pulled ${r.pulled} events from Google / Outlook`);
                  qc.invalidateQueries({ queryKey: ["activities"] });
                  qc.invalidateQueries({ queryKey: ["calendars"] });
                })
              }
            >
              Sync calendars
            </Button>
          </>
        }
      />
      <div className="mx-4 mb-4 overflow-x-auto rounded-xl bg-card p-3 shadow-[var(--shadow-border)] sm:mx-6">
        <div className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">Connected calendars</div>
        <ul className="flex min-w-max gap-3">
          {(cals.data ?? []).map((c) => (
            <li key={c.id} className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm">
              <Switch
                checked={c.synced}
                onCheckedChange={(v) =>
                  toggleCalendar({ data: { id: c.id, synced: v } }).then(() =>
                    qc.invalidateQueries({ queryKey: ["calendars"] }),
                  )
                }
              />
              <span>
                {c.provider} · {c.address}
                <span className="block text-[11px] text-muted-foreground">
                  {c.twoWay ? "two-way" : "pull only"}
                </span>
              </span>
              {c.synced && <Badge variant="success">sync</Badge>}
            </li>
          ))}
        </ul>
      </div>
      {view === "list" && (
        <ul className="divide-y divide-border border-t border-border">
          {list.map((a) => {
            const late = !a.done && a.dueAt && new Date(a.dueAt) < new Date();
            return (
              <li key={a.id} className="flex items-start gap-3 px-4 py-3 sm:px-6">
                <Checkbox
                  checked={a.done}
                  onCheckedChange={(v) =>
                    toggleActivity({ data: { id: a.id, done: Boolean(v) } }).then(() =>
                      qc.invalidateQueries({ queryKey: ["activities"] }),
                    )
                  }
                  className="mt-1"
                />
                <div className="min-w-0 flex-1">
                  <div className={cn("text-sm", a.done && "text-muted-foreground line-through")}>{a.subject}</div>
                  <div className="text-xs text-muted-foreground">
                    {a.type} · {a.ownerName} · {a.dealTitle ?? a.orgName ?? a.personName ?? "Unlinked"}
                    {a.location ? ` · ${a.location}` : ""}
                  </div>
                </div>
                <div className={cn("text-xs tabular-nums", late ? "text-destructive" : "text-muted-foreground")}>
                  {formatDateTime(a.dueAt)}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {view === "month" && (
        <MonthGrid
          cursor={cursor}
          onPrev={() => setCursor((d) => subMonths(d, 1))}
          onNext={() => setCursor((d) => addMonths(d, 1))}
          activities={list}
        />
      )}
      {view === "week" && <WeekGrid activities={list} cursor={cursor} />}
      {view === "year" && (
        <div className="px-4 pb-10 sm:px-6">
          <p className="mb-3 text-sm text-muted-foreground">
            Weekend-aligned year. Multi-event days fill darker.{" "}
            <Link to="/crew" className="underline-offset-4 hover:underline">
              Staff Gantt lives with crew
            </Link>
            .
          </p>
          <YearScan deals={(deals.data ?? []).filter((d) => d.eventDate)} />
        </div>
      )}
      {view === "gantt" && <DayGantt deals={deals.data ?? []} activities={list} />}
    </div>
  );
}

function MonthGrid({
  cursor,
  onPrev,
  onNext,
  activities,
}: {
  cursor: Date;
  onPrev: () => void;
  onNext: () => void;
  activities: { id: number; subject: string; dueAt: string | null; done: boolean }[];
}) {
  const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 0 });
  const days = useMemo(() => Array.from({ length: 42 }, (_, i) => addDays(start, i)), [start]);
  return (
    <div className="px-4 pb-8 sm:px-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium">{format(cursor, "MMMM yyyy")}</h2>
        <div className="flex gap-1">
          <Button size="icon-sm" variant="ghost" onClick={onPrev}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button size="icon-sm" variant="ghost" onClick={onNext}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-[11px] text-muted-foreground">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="px-1 py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 rounded-xl border border-border">
        {days.map((day) => {
          const items = activities.filter((a) => a.dueAt && isSameDay(new Date(a.dueAt), day));
          const inMonth = day.getMonth() === cursor.getMonth();
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "min-h-24 border-r border-b border-border p-1 last:border-r-0",
                !inMonth && "bg-muted/40 text-muted-foreground",
              )}
            >
              <div className="px-1 text-[11px] tabular-nums">{format(day, "d")}</div>
              {items.slice(0, 3).map((a) => (
                <div
                  key={a.id}
                  className={cn(
                    "mt-0.5 truncate rounded-sm px-1 text-[10px]",
                    a.done ? "text-muted-foreground" : "bg-primary/10 text-foreground",
                  )}
                >
                  {a.subject}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekGrid({
  activities,
  cursor,
}: {
  activities: { id: number; subject: string; dueAt: string | null; done: boolean; ownerName: string | null }[];
  cursor: Date;
}) {
  const start = startOfWeek(cursor, { weekStartsOn: 0 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  return (
    <div className="grid gap-2 px-4 pb-10 sm:grid-cols-7 sm:px-6">
      {days.map((day) => {
        const items = activities.filter((a) => a.dueAt && isSameDay(new Date(a.dueAt), day));
        return (
          <article key={day.toISOString()} className="rounded-xl bg-card p-3 shadow-[var(--shadow-border)]">
            <h3 className="text-xs font-medium">{format(day, "EEE d")}</h3>
            <ul className="mt-2 space-y-1">
              {items.map((a) => (
                <li key={a.id} className={cn("text-xs", a.done && "text-muted-foreground line-through")}>
                  {a.subject}
                </li>
              ))}
              {items.length === 0 && <li className="text-xs text-muted-foreground">Clear</li>}
            </ul>
          </article>
        );
      })}
    </div>
  );
}

function YearScan({ deals }: { deals: { id: number; title: string; eventDate: string | null }[] }) {
  const year = 2026;
  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, m) => {
      const first = setMonth(startOfYear(new Date(year, 0, 1)), m);
      const pad = getDay(first);
      const days: (Date | null)[] = Array.from({ length: pad }, () => null);
      let d = first;
      while (d.getMonth() === m) {
        days.push(d);
        d = addDays(d, 1);
      }
      return { name: format(first, "MMM"), days };
    });
  }, [year]);
  function count(day: Date) {
    const key = format(day, "yyyy-MM-dd");
    return deals.filter((x) => (x.eventDate ?? "").slice(0, 10) === key).length;
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {months.map((mo) => (
        <article key={mo.name} className="rounded-xl bg-card p-3 shadow-[var(--shadow-border)]">
          <h3 className="mb-2 text-xs font-medium">{mo.name}</h3>
          <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] text-muted-foreground">
            {"SMTWTFS".split("").map((c, i) => (
              <span key={i}>{c}</span>
            ))}
            {mo.days.map((day, i) => {
              if (!day) return <span key={i} />;
              const n = count(day);
              return (
                <span
                  key={i}
                  className={cn("rounded-sm py-0.5", n === 1 && "bg-primary/40", n > 1 && "bg-primary text-primary-foreground")}
                >
                  {day.getDate()}
                </span>
              );
            })}
          </div>
        </article>
      ))}
    </div>
  );
}

function DayGantt({
  deals,
  activities,
}: {
  deals: { id: number; title: string; eventDate: string | null; venue: string | null; ownerName: string | null }[];
  activities: { id: number; subject: string; dueAt: string | null; ownerName: string | null }[];
}) {
  const rows = deals.filter((d) => d.eventDate).slice(0, 10);
  return (
    <div className="overflow-x-auto px-4 pb-10 sm:px-6">
      <p className="mb-2 text-sm text-muted-foreground">Gantt day — simultaneous shows and the activities sitting on them.</p>
      <div className="min-w-[40rem] rounded-xl bg-card p-3 shadow-[var(--shadow-border)]">
        {rows.map((d) => {
          const hits = activities.filter((a) => a.subject.toLowerCase().includes(d.title.slice(0, 8).toLowerCase()) || a.ownerName === d.ownerName);
          return (
            <div key={d.id} className="grid grid-cols-[12rem_1fr] items-center gap-2 border-b border-border py-2 last:border-0">
              <Link to="/deals/$dealId" params={{ dealId: String(d.id) }} className="truncate text-xs">
                {d.title}
              </Link>
              <div className="relative h-7 rounded-sm bg-muted">
                <span className="absolute inset-y-0 left-[20%] w-[55%] rounded-sm bg-primary/70" title={d.venue ?? ""} />
                {hits.slice(0, 2).map((a, i) => (
                  <span key={a.id} className="absolute top-0 h-2 w-8 rounded-sm bg-foreground/40" style={{ left: `${30 + i * 18}%` }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
