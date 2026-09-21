import { useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClosedTable, FunnelStrip, LeadKanban, LifecycleSkeleton } from "@/components/crm/lifecycle";
import { getLifecycleDesk } from "@/lib/crm/lifecycle";
import { getBootstrap } from "@/lib/crm/server";
import { formatDate, formatUsd, formatUsdFull } from "@/lib/utils";
import { useUi } from "@/lib/crm/store";

export const Route = createFileRoute("/lifecycle")({ component: LifecyclePage });

const GRID = "var(--color-border)";
const FG = "var(--color-muted-foreground)";
const PR = "var(--color-primary)";

function LifecyclePage() {
  const desk = useQuery({ queryKey: ["lifecycle"], queryFn: () => getLifecycleDesk() });
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const { setAddOpen } = useUi();
  const [tab, setTab] = useState("funnel");
  const d = desk.data;
  const pipe = boot.data?.pipelines[0];

  const typeChart = useMemo(
    () =>
      (d?.types ?? []).map((t) => ({
        name: t.name.replace(" / ", " "),
        open: t.value,
        won: t.wonValue,
      })),
    [d],
  );

  return (
    <div className="pb-12">
      <PageHeader
        title="Event lifecycle"
        subtitle="Inquiry to load-out. Every show typed, sourced, and accounted for — including the ones that died."
        actions={
          <Button size="sm" onClick={() => setAddOpen(true, "lead")}>
            New inquiry
          </Button>
        }
      />

      {desk.isLoading || !d ? (
        <div className="px-4 sm:px-6">
          <LifecycleSkeleton />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 lg:grid-cols-6 sm:px-6">
            <Stat label="Inquiries" value={String(d.kpis.inquiries90)} hint="Last 90 days" />
            <Stat label="Qualify" value={`${d.kpis.qualifyRate}%`} hint="Fit vs worked" />
            <Stat label="Win rate" value={`${d.kpis.winRate}%`} hint="Won / (won + lost)" />
            <Stat label="Cancel rate" value={`${d.kpis.cancelRate}%`} hint="Event died" />
            <Stat label="Days to won" value={String(d.kpis.avgDaysToWon)} hint="Inquiry → signed" />
            <Stat label="Open book" value={formatUsd(d.kpis.openValue)} hint={`${formatUsd(d.kpis.lostValue)} lost`} />
          </div>

          <div className="mt-6 px-4 sm:px-6">
            <FunnelStrip
              steps={d.funnel}
              exits={d.exits}
              onPick={(key) => {
                if (key === "new" || key === "contacted" || key === "qualified" || key === "nurture" || key === "disqualified")
                  setTab("leads");
                else if (key === "lost" || key === "cancelled") setTab("closed");
                else if (key === "pipeline" || key === "won" || key === "complete") setTab("funnel");
              }}
            />
          </div>

          <div className="mt-6 px-4 sm:px-6">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="flex h-auto flex-wrap">
                <TabsTrigger value="funnel">Pipeline</TabsTrigger>
                <TabsTrigger value="leads">Lead stages</TabsTrigger>
                <TabsTrigger value="types">Event types</TabsTrigger>
                <TabsTrigger value="sources">Sources</TabsTrigger>
                <TabsTrigger value="closed">Lost & cancelled</TabsTrigger>
              </TabsList>

              <TabsContent value="funnel" className="mt-4 space-y-4">
                <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
                  <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Open stages</h2>
                  <ul className="mt-3 divide-y divide-border">
                    {d.pipeline.map((s) => (
                      <li key={s.name} className="flex items-center justify-between py-2 text-sm">
                        <span>{s.name}</span>
                        <span className="font-mono tabular-nums text-muted-foreground">
                          {s.count} · {formatUsd(s.value)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/" className="mt-3 inline-block text-sm text-primary">
                    Open the board →
                  </Link>
                </section>
                <section>
                  <h2 className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">Recent moves</h2>
                  <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
                    {d.recent.map((m) => (
                      <li key={m.id} className="flex flex-wrap items-center gap-3 px-4 py-2.5">
                        <Badge variant={m.kind === "lead" ? "outline" : "steel"}>{m.kind}</Badge>
                        {m.kind === "deal" ? (
                          <Link to="/deals/$dealId" params={{ dealId: String(m.entityId) }} className="flex-1 text-sm font-medium">
                            {m.title}
                          </Link>
                        ) : (
                          <Link to="/leads" className="flex-1 text-sm font-medium">
                            {m.title}
                          </Link>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {m.action}
                          {m.detail ? ` · ${m.detail}` : ""}
                        </span>
                        <span className="text-[11px] text-muted-foreground">{formatDate(m.at)}</span>
                      </li>
                    ))}
                    {d.recent.length === 0 && (
                      <li className="px-4 py-6 text-sm text-muted-foreground">No stage history yet.</li>
                    )}
                  </ul>
                </section>
              </TabsContent>

              <TabsContent value="leads" className="mt-4">
                <LeadKanban leads={d.leads} pipeline={pipe} />
              </TabsContent>

              <TabsContent value="types" className="mt-4 space-y-4">
                <div className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
                  <h2 className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">Open vs won by type</h2>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={typeChart} layout="vertical" margin={{ left: 8, right: 12 }}>
                      <CartesianGrid stroke={GRID} horizontal={false} />
                      <XAxis type="number" stroke={FG} fontSize={11} tickFormatter={(v) => formatUsd(Number(v))} />
                      <YAxis type="category" dataKey="name" stroke={FG} fontSize={11} width={128} tickLine={false} />
                      <Tooltip contentStyle={tip} formatter={(v) => formatUsdFull(Number(v))} />
                      <Bar dataKey="open" fill={PR} radius={[0, 4, 4, 0]} name="Open" barSize={10} />
                      <Bar dataKey="won" fill="var(--color-steel)" radius={[0, 4, 4, 0]} name="Won" barSize={10} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
                  {d.types.map((t) => (
                    <li key={t.name} className="flex flex-wrap items-center gap-3 px-4 py-3">
                      <div className="min-w-0 flex-1 text-sm font-medium">{t.name}</div>
                      <span className="text-xs text-muted-foreground">{t.open} open</span>
                      <span className="text-xs text-muted-foreground">{t.won} won</span>
                      {t.lost > 0 && <Badge variant="danger">{t.lost} lost</Badge>}
                      {t.cancelled > 0 && <Badge variant="warn">{t.cancelled} cancelled</Badge>}
                      <span className="font-mono text-sm tabular-nums">{formatUsd(t.value + t.wonValue)}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="sources" className="mt-4">
                <div className="overflow-x-auto rounded-xl bg-card shadow-[var(--shadow-border)]">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead className="text-left text-xs text-muted-foreground">
                      <tr>
                        <th className="px-4 py-2 font-medium">Source</th>
                        <th className="px-2 py-2 font-medium">Leads</th>
                        <th className="px-2 py-2 font-medium">Deals</th>
                        <th className="px-2 py-2 font-medium">Won</th>
                        <th className="px-2 py-2 font-medium">Lost</th>
                        <th className="px-2 py-2 font-medium">Cancelled</th>
                        <th className="px-2 py-2 font-medium">Win</th>
                        <th className="px-4 py-2 text-right font-medium">Won book</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.sources.map((s) => (
                        <tr key={s.name} className="border-t border-border">
                          <td className="px-4 py-2.5 font-medium">{s.name}</td>
                          <td className="px-2 py-2.5 tabular-nums">{s.leads}</td>
                          <td className="px-2 py-2.5 tabular-nums">{s.deals}</td>
                          <td className="px-2 py-2.5 tabular-nums">{s.won}</td>
                          <td className="px-2 py-2.5 tabular-nums">{s.lost}</td>
                          <td className="px-2 py-2.5 tabular-nums">{s.cancelled}</td>
                          <td className="px-2 py-2.5 tabular-nums">{s.winRate}%</td>
                          <td className="px-4 py-2.5 text-right font-mono tabular-nums">{formatUsd(s.wonValue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Win rate ignores cancelled shows — those events died, they were not lost to a competitor.
                </p>
              </TabsContent>

              <TabsContent value="closed" className="mt-4 space-y-6">
                <section>
                  <div className="mb-2 flex items-baseline justify-between gap-2">
                    <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Lost</h2>
                    <span className="font-mono text-sm tabular-nums">{formatUsdFull(d.kpis.lostValue)}</span>
                  </div>
                  <ClosedTable rows={d.lost} empty="No competitive losses on the book." />
                </section>
                <section>
                  <div className="mb-2 flex items-baseline justify-between gap-2">
                    <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Cancelled</h2>
                    <span className="font-mono text-sm tabular-nums">{formatUsdFull(d.kpis.cancelledValue)}</span>
                  </div>
                  <ClosedTable rows={d.cancelled} empty="No cancelled events." />
                </section>
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
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

const tip = {
  background: "var(--color-popover)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  color: "var(--color-foreground)",
  fontSize: 12,
};
