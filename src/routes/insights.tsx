import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createReport, getInsights, listReports } from "@/lib/crm/server";
import { getHealth } from "@/lib/crm/ops";
import { runAi } from "@/lib/crm/ai";
import { formatUsd, formatUsdFull } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/insights")({ component: InsightsPage });

const GRID = "var(--color-border)";
const FG = "var(--color-muted-foreground)";
const PR = "var(--color-primary)";
const MUTED = "var(--color-steel)";

function InsightsPage() {
  const insights = useQuery({ queryKey: ["insights"], queryFn: () => getInsights() });
  const reports = useQuery({ queryKey: ["reports"], queryFn: () => listReports() });
  const health = useQuery({ queryKey: ["health"], queryFn: () => getHealth() });
  const qc = useQueryClient();
  const [ai, setAi] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const d = insights.data;

  async function narrate() {
    if (!d) return;
    setBusy(true);
    const res = await runAi({
      data: {
        kind: "report",
        prompt: `Open ${d.openValue} across ${d.openCount} deals, weighted ${d.weightedValue}, won ${d.wonValue}, win rate ${d.winRate}%, rotting ${d.rottingCount}, overdue ${d.overdueActivities}. Owners: ${d.byOwner.map((o) => `${o.name} open ${o.value} won ${o.won}`).join("; ")}.`,
      },
    });
    setBusy(false);
    if (res.ok) setAi(res.text);
    else toast.error(res.error);
  }

  return (
    <div className="pb-12">
      <PageHeader
        title="Insights"
        subtitle="Revenue, velocity, and 500 custom reports on the live-events book."
        actions={
          <Button size="sm" variant="secondary" onClick={narrate} disabled={busy}>
            <Sparkles className="size-3.5" />
            {busy ? "Writing…" : "AI report"}
          </Button>
        }
      />
      {d && (
        <>
          <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6">
            <Stat label="Open pipeline" value={formatUsdFull(d.openValue)} hint={`${d.openCount} deals`} />
            <Stat label="Weighted" value={formatUsdFull(d.weightedValue)} hint="By stage probability" />
            <Stat label="Won (booked)" value={formatUsdFull(d.wonValue)} hint={`${d.winRate}% win rate`} />
            <Stat label="Lead conversion" value={`${health.data?.conversion ?? "—"}%`} hint={`${health.data?.leadConverted ?? 0} of ${health.data?.leadN ?? 0} leads`} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6">
            <Stat label="Collected" value={health.data ? formatUsdFull(health.data.kpis.collected) : "—"} hint={health.data ? `of ${formatUsdFull(health.data.kpis.invoiced)} invoiced` : ""} />
            <Stat label="Abandoned quotes" value={String(health.data?.abandoned ?? "—")} hint={`${health.data?.quotes ?? 0} quotes total`} />
            <Stat label="Ghosted" value={String(health.data?.ghosted.length ?? "—")} hint="Open > 14 days silent" />
            <Stat label="Health flags" value={String(health.data?.flags.length ?? "—")} hint="Contract / schedule / $0" />
          </div>
          {ai && <p className="mx-4 mt-4 rounded-xl bg-card p-4 text-sm leading-relaxed shadow-[var(--shadow-border)] sm:mx-6">{ai}</p>}
          <div className="mt-4 grid gap-4 px-4 sm:px-6 lg:grid-cols-2">
            <Card title="Won vs pipeline by month">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={d.byMonth}>
                  <CartesianGrid stroke={GRID} vertical={false} />
                  <XAxis dataKey="month" stroke={FG} fontSize={11} tickLine={false} />
                  <YAxis stroke={FG} fontSize={11} tickFormatter={(v) => formatUsd(Number(v))} width={48} />
                  <Tooltip contentStyle={tip} formatter={(v) => formatUsdFull(Number(v))} />
                  <Line type="monotone" dataKey="won" stroke={PR} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="open" stroke={MUTED} strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
            <Card title="Open value by stage">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={d.byStage}>
                  <CartesianGrid stroke={GRID} vertical={false} />
                  <XAxis dataKey="name" stroke={FG} fontSize={11} tickLine={false} />
                  <YAxis stroke={FG} fontSize={11} tickFormatter={(v) => formatUsd(Number(v))} width={48} />
                  <Tooltip contentStyle={tip} formatter={(v) => formatUsdFull(Number(v))} />
                  <Bar dataKey="value" fill={PR} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card title="Owner book">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={d.byOwner} layout="vertical" margin={{ left: 48 }}>
                  <CartesianGrid stroke={GRID} horizontal={false} />
                  <XAxis type="number" stroke={FG} fontSize={11} tickFormatter={(v) => formatUsd(Number(v))} />
                  <YAxis type="category" dataKey="name" stroke={FG} fontSize={11} width={80} />
                  <Tooltip contentStyle={tip} formatter={(v) => formatUsdFull(Number(v))} />
                  <Legend />
                  <Bar dataKey="value" name="Open" fill={PR} radius={[0, 4, 4, 0]} />
                  <Bar dataKey="won" name="Won" fill={MUTED} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card title="Source mix">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={d.bySource} dataKey="value" nameKey="name" innerRadius={48} outerRadius={80} paddingAngle={2}>
                    {d.bySource.map((_, i) => (
                      <Cell key={i} fill={i % 2 === 0 ? PR : MUTED} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tip} formatter={(v) => formatUsdFull(Number(v))} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
            <Card title="Activity this week">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={d.activityWeek}>
                  <CartesianGrid stroke={GRID} vertical={false} />
                  <XAxis dataKey="day" stroke={FG} fontSize={11} />
                  <YAxis stroke={FG} fontSize={11} allowDecimals={false} />
                  <Tooltip contentStyle={tip} />
                  <Bar dataKey="planned" fill={MUTED} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="done" fill={PR} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card title="Saved reports">
              <ul className="space-y-2 text-sm">
                {(reports.data ?? []).map((r) => (
                  <li key={r.id} className="flex justify-between rounded-md bg-muted px-3 py-2">
                    <span>{r.name}</span>
                    <span className="text-xs text-muted-foreground">{r.kind}</span>
                  </li>
                ))}
              </ul>
              <form
                className="mt-3 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  const name = String(fd.get("name") || "New report");
                  void createReport({ data: { name, kind: "column" } }).then((r) => {
                    if (r && "error" in r && r.error) toast.error(r.error);
                    else toast.success("Report saved");
                    qc.invalidateQueries({ queryKey: ["reports"] });
                    qc.invalidateQueries({ queryKey: ["usage"] });
                  });
                }}
              >
                <Input name="name" placeholder="Report name" />
                <Button type="submit" variant="secondary">
                  Save
                </Button>
              </form>
            </Card>
            <Card title="Ghosted leads">
              <ul className="space-y-2 text-sm">
                {(health.data?.ghosted ?? []).slice(0, 6).map((g) => (
                  <li key={g.id} className="flex justify-between gap-2">
                    <Link to="/deals/$dealId" params={{ dealId: String(g.id) }} className="truncate hover:underline">
                      {g.title}
                    </Link>
                    <span className="text-xs text-muted-foreground">{g.days}d silent</span>
                  </li>
                ))}
                {(health.data?.ghosted ?? []).length === 0 && (
                  <li className="text-muted-foreground">Nothing sitting silent past two weeks.</li>
                )}
              </ul>
              <Button asChild size="sm" variant="ghost" className="mt-3">
                <Link to="/health">Open health check</Link>
              </Button>
            </Card>
            <Card title="Inquiry heatmap">
              <p className="mb-2 text-xs text-muted-foreground">
                Win rate {health.data?.winRate ?? "—"}% · {health.data?.abandoned ?? 0} abandoned quotes
              </p>
              <div className="grid grid-cols-12 gap-1">
                {Array.from({ length: 12 }, (_, month) => {
                  const n = (health.data?.heat ?? []).filter((h) => h.month === month).reduce((s, h) => s + h.n, 0);
                  const max = Math.max(1, ...(health.data?.heat ?? []).map((h) => h.n));
                  return (
                    <div
                      key={month}
                      title={`${n}`}
                      className="h-8 rounded-sm bg-primary"
                      style={{ opacity: n === 0 ? 0.15 : 0.3 + (n / max) * 0.7 }}
                    />
                  );
                })}
              </div>
              <Button asChild size="sm" variant="ghost" className="mt-3">
                <Link to="/views">Open unique views</Link>
              </Button>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

const tip = {
  background: "var(--color-popover)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  fontSize: 12,
};

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-mono text-lg tabular-nums">{value}</div>
      <div className="mt-1 text-[11px] text-muted-foreground">{hint}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
      <h2 className="mb-3 text-sm font-medium">{title}</h2>
      {children}
    </section>
  );
}
