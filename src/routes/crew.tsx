import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCrewGantt, StaffDayGantt, WeekendYear } from "@/components/crm/unique-views";
import { getCrew } from "@/lib/crm/ops";
import { getUniqueViews } from "@/lib/crm/views";

export const Route = createFileRoute("/crew")({ component: CrewPage });

function CrewPage() {
  const crew = useQuery({ queryKey: ["crew"], queryFn: () => getCrew() });
  const desk = useQuery({ queryKey: ["unique-views"], queryFn: () => getUniqueViews() });
  const shifts = crew.data?.shifts ?? [];

  return (
    <div className="pb-12">
      <PageHeader
        title="Crew & calendar"
        subtitle="Staff Gantt, year scan, travel/setup/strike, webcal for Apple and Google."
        actions={
          <div className="flex items-center gap-3">
            <Link to="/views" className="text-xs text-muted-foreground underline-offset-4 hover:underline">
              Unique views
            </Link>
            <a className="text-xs text-muted-foreground underline-offset-4 hover:underline" href="/cal/northline">
              Subscribe webcal
            </a>
          </div>
        }
      />
      <div className="px-4 sm:px-6">
        <Tabs defaultValue="gantt">
          <TabsList className="flex h-auto flex-wrap">
            <TabsTrigger value="gantt">Staff Gantt</TabsTrigger>
            <TabsTrigger value="event">Per event</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="adv">Travel / setup / strike</TabsTrigger>
          </TabsList>
          <TabsContent value="gantt" className="mt-4">
            <StaffDayGantt shows={desk.data?.shows ?? []} shifts={desk.data?.shifts ?? []} />
          </TabsContent>
          <TabsContent value="event" className="mt-4">
            <EventCrewGantt shows={desk.data?.shows ?? []} shifts={desk.data?.shifts ?? []} />
          </TabsContent>
          <TabsContent value="year" className="mt-4">
            <WeekendYear shows={desk.data?.shows ?? []} year={new Date().getFullYear()} />
          </TabsContent>
          <TabsContent value="adv" className="mt-4">
            <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
              {shifts.map((s) => (
                <li key={s.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
                  <Badge variant="outline">{s.kind}</Badge>
                  <div className="flex-1">
                    {s.member} · {s.role}
                    <p className="text-xs text-muted-foreground">
                      {s.deal} · {s.venue}
                    </p>
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
