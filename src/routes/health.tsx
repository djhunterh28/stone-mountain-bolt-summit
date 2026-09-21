import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { InquiryHeat } from "@/components/crm/unique-views";
import { getHealth } from "@/lib/crm/ops";
import { getUniqueViews } from "@/lib/crm/views";
import { formatUsdFull } from "@/lib/utils";

export const Route = createFileRoute("/health")({ component: HealthPage });

function HealthPage() {
  const h = useQuery({ queryKey: ["health"], queryFn: () => getHealth() });
  const desk = useQuery({ queryKey: ["unique-views"], queryFn: () => getUniqueViews() });
  const d = h.data;
  return (
    <div className="pb-12">
      <PageHeader title="Business health" subtitle="Booked-event audit, ghosted leads, win/loss, quote abandonment, inquiry heatmap." />
      <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6">
        <Stat label="Win rate" value={`${d?.winRate ?? "—"}%`} hint={`${d?.won ?? 0} won / ${d?.lost ?? 0} lost`} />
        <Stat label="Lead conversion" value={`${d?.conversion ?? "—"}%`} hint={`${d?.leadConverted ?? 0} of ${d?.leadN ?? 0}`} />
        <Stat label="Collected" value={d ? formatUsdFull(d.kpis.collected) : "—"} hint={d ? `of ${formatUsdFull(d.kpis.invoiced)} invoiced` : ""} />
        <Stat label="Abandoned quotes" value={String(d?.abandoned ?? "—")} hint={`${d?.quotes ?? 0} quotes total`} />
      </div>
      <section className="mx-4 mt-6 sm:mx-6">
        <h2 className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">Health check</h2>
        <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
          {(d?.flags ?? []).map((f) => (
            <li key={f.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <Link to="/deals/$dealId" params={{ dealId: String(f.id) }} className="flex-1 text-sm font-medium">
                {f.title}
              </Link>
              {f.issues.map((i) => (
                <Badge key={i} variant="warn">{i}</Badge>
              ))}
            </li>
          ))}
          {d && d.flags.length === 0 && <li className="px-4 py-6 text-sm text-muted-foreground">Every booked show has a contract, a schedule, and a dollar amount.</li>}
        </ul>
      </section>
      <section className="mx-4 mt-6 sm:mx-6">
        <h2 className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">Ghosted leads</h2>
        <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
          {(d?.ghosted ?? []).map((g) => (
            <li key={g.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
              <Link to="/deals/$dealId" params={{ dealId: String(g.id) }}>{g.title}</Link>
              <span className="text-xs text-muted-foreground">{g.days}d silent</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="mx-4 mt-6 sm:mx-6">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Inquiry heatmap</h2>
          <Link to="/views" className="text-xs text-muted-foreground underline-offset-4 hover:underline">
            Unique views
          </Link>
        </div>
        <InquiryHeat days={desk.data?.inquiry ?? []} />
      </section>
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
