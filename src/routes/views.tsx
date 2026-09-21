import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/app-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  EventCrewGantt,
  InquiryHeat,
  OpsDayGantt,
  ViewsSkeleton,
  WeekendYear,
  overlapDays,
} from "@/components/crm/unique-views";
import { getUniqueViews } from "@/lib/crm/views";
import { listActivities } from "@/lib/crm/server";
import { formatUsd } from "@/lib/utils";

export const Route = createFileRoute("/views")({ component: ViewsPage });

function ViewsPage() {
  const desk = useQuery({ queryKey: ["unique-views"], queryFn: () => getUniqueViews() });
  const acts = useQuery({ queryKey: ["activities", "all"], queryFn: () => listActivities({ data: {} }) });
  const shows = desk.data?.shows ?? [];
  const shifts = desk.data?.shifts ?? [];
  const year = new Date().getFullYear();
  const [tab, setTab] = useState("year");
  const [focusDay, setFocusDay] = useState<string | undefined>();
  const doubles = useMemo(() => overlapDays(shows), [shows]);
  const inquiryN = (desk.data?.inquiry ?? []).reduce((s, d) => s + d.n, 0);
  const crewShows = new Set(shifts.map((s) => s.dealId)).size;
  const book = shows.filter((s) => s.status === "won" || s.status === "open").reduce((s, d) => s + d.value, 0);

  return (
    <div className="pb-12">
      <PageHeader
        title="Unique views"
        subtitle="Weekend-aligned year, multi-op day Gantt, per-event crew, and an 18-month inquiry heat — the way a shop actually looks at time."
      />
      <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6">
        <Stat label="Double days" value={String(doubles.length)} hint="Simultaneous shows" />
        <Stat label="Crew plots" value={String(crewShows)} hint="Events with a floor sheet" />
        <Stat label="Inquiries" value={inquiryN.toLocaleString()} hint="18-month inbound" />
        <Stat label="Dated book" value={formatUsd(book)} hint="Shows with an event date" />
      </div>
      <div className="mt-6 px-4 sm:px-6">
        <Tabs
          value={tab}
          onValueChange={setTab}
        >
          <TabsList className="flex h-auto flex-wrap">
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="day">Day Gantt</TabsTrigger>
            <TabsTrigger value="crew">Event crew</TabsTrigger>
            <TabsTrigger value="heat">Inquiry heat</TabsTrigger>
          </TabsList>
          {desk.isLoading ? (
            <div className="mt-4">
              <ViewsSkeleton />
            </div>
          ) : (
            <>
              <TabsContent value="year" className="mt-4">
                <WeekendYear
                  shows={shows}
                  year={year}
                  onOpenDay={(d) => {
                    setFocusDay(d);
                    setTab("day");
                  }}
                />
              </TabsContent>
              <TabsContent value="day" className="mt-4">
                <OpsDayGantt
                  shows={shows}
                  shifts={shifts}
                  activities={acts.data ?? []}
                  day={focusDay}
                  onDayChange={setFocusDay}
                />
              </TabsContent>
              <TabsContent value="crew" className="mt-4">
                <EventCrewGantt shows={shows} shifts={shifts} />
              </TabsContent>
              <TabsContent value="heat" className="mt-4">
                <InquiryHeat days={desk.data?.inquiry ?? []} />
              </TabsContent>
            </>
          )}
        </Tabs>
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
