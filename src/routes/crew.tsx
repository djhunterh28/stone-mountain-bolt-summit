import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { addDays, format, startOfYear, setMonth, getDay } from "date-fns";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCrew } from "@/lib/crm/ops";
import { listDeals } from "@/lib/crm/server";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/crew")({ component: CrewPage });

function hour(isoStr: string) {
  return new Date(isoStr).getHours() + new Date(isoStr).getMinutes() / 60;
}

function CrewPage() {
  const crew = useQuery({ queryKey: ["crew"], queryFn: () => getCrew() });
  const deals = useQuery({ queryKey: ["deals-all"], queryFn: () => listDeals({ data: { pipelineId: 1, status: "all" } }) });
  const shifts = crew.data?.shifts ?? [];
  const members = [...new Set(shifts.map((s) => s.member))];
  const hours = Array.from({ length: 18 }, (_, i) => i + 6);

  return (
    <div className="pb-12">
      <PageHeader
        title="Crew & calendar"
        subtitle="Staff Gantt, year scan, travel/setup/strike, webcal for Apple and Google."
        actions={
          <a className="text-xs text-muted-foreground underline-offset-4 hover:underline" href="/cal/northline">
            Subscribe webcal
          </a>
        }
      />
      <div className="px-4 sm:px-6">
        <Tabs defaultValue="gantt">
          <TabsList className="flex h-auto flex-wrap">
            <TabsTrigger value="gantt">Staff Gantt</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="adv">Travel / setup / strike</TabsTrigger>
          </TabsList>
          <TabsContent value="gantt" className="mt-4 overflow-x-auto rounded-xl bg-card p-3 shadow-[var(--shadow-border)]">
            <div className="min-w-[52rem]">
              <div className="grid grid-cols-[8rem_repeat(18,minmax(2.2rem,1fr))] gap-px text-[10px] text-muted-foreground">
                <span />
                {hours.map((h) => (
                  <span key={h} className="text-center">{h}</span>
                ))}
                {members.map((m) => (
                  <>
                    <span key={`${m}-n`} className="truncate py-1 text-xs text-foreground">{m}</span>
                    {hours.map((h) => {
                      const hit = shifts.find((s) => s.member === m && hour(s.startsAt) <= h && hour(s.endsAt) > h);
                      return (
                        <span
                          key={`${m}-${h}`}
                          className={cn("h-7 rounded-sm", hit ? "bg-primary/80" : "bg-muted")}
                          title={hit ? `${hit.role} · ${hit.deal}` : ""}
                        />
                      );
                    })}
                  </>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="year" className="mt-4">
            <YearGrid deals={(deals.data ?? []).filter((d) => d.eventDate)} />
          </TabsContent>
          <TabsContent value="adv" className="mt-4">
            <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
              {shifts.map((s) => (
                <li key={s.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
                  <Badge variant="outline">{s.kind}</Badge>
                  <div className="flex-1">
                    {s.member} · {s.role}
                    <p className="text-xs text-muted-foreground">{s.deal} · {s.venue}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(s.startsAt), "HH:mm")}–{format(new Date(s.endsAt), "HH:mm")}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              Travel minutes come from Mileage. Setup and strike sit on the same Gantt as show time.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function YearGrid({ deals }: { deals: { id: number; title: string; eventDate: string | null }[] }) {
  const [year] = useState(2026);
  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, m) => {
      const start = setMonth(startOfYear(new Date(year, 0, 1)), m);
      const first = start;
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
                <span key={i} className={cn("rounded-sm py-0.5", n === 1 && "bg-primary/40", n > 1 && "bg-primary text-primary-foreground")}>
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
