import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, FolderOpen, LayoutGrid, PenLine, ClipboardCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { completeOnboardingStep, getDashboard, getPortalMe } from "@/lib/portal/server";
import { getHealth, getOpsHome } from "@/lib/crm/ops";
import { formatBytes, formatDate, formatDateTime, formatUsd } from "@/lib/utils";

export const Route = createFileRoute("/home")({ component: HomePage });

const STEPS = [
  { id: "profile" as const, label: "Complete profile", to: "/profile" },
  { id: "team" as const, label: "Invite a teammate", to: "/profile" },
  { id: "project" as const, label: "Open your first project", to: "/projects" },
  { id: "docs" as const, label: "Review a document", to: "/documents" },
  { id: "prefs" as const, label: "Set notification preferences", to: "/profile" },
];

function HomePage() {
  const dash = useQuery({ queryKey: ["dashboard"], queryFn: () => getDashboard() });
  const me = useQuery({ queryKey: ["portal-me"], queryFn: () => getPortalMe() });
  const ops = useQuery({ queryKey: ["ops-home"], queryFn: () => getOpsHome() });
  const health = useQuery({ queryKey: ["health"], queryFn: () => getHealth() });
  const qc = useQueryClient();
  const d = dash.data;
  const onboard = me.data?.onboarding;

  return (
    <div className="pb-12">
      <PageHeader
        title={d ? `Good morning, ${d.profile.name.split(" ")[0]}` : "Home"}
        subtitle={d ? `${d.workspace} · ${d.profile.role}` : "Loading the house…"}
      />
      <div className="grid gap-3 px-4 sm:grid-cols-2 sm:px-6 xl:grid-cols-5">
        <Stat to="/projects" label="Projects" value={d?.projects ?? "—"} icon={LayoutGrid} />
        <Stat to="/files" label="Files" value={d?.files ?? "—"} icon={FolderOpen} />
        <Stat to="/tasks" label="Tasks" value={d ? `${d.tasksDone}/${d.tasks}` : "—"} icon={Check} />
        <Stat to="/approvals" label="Approvals" value={d?.approvals ?? "—"} icon={ClipboardCheck} />
        <Stat to="/esign" label="Signatures" value={d?.signatures ?? "—"} icon={PenLine} />
      </div>

      {onboard && (
        <section className="mx-4 mt-6 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:mx-6">
          <h2 className="text-sm font-medium">Onboarding</h2>
          <p className="mt-1 text-xs text-muted-foreground">Five steps to a working client desk.</p>
          <ul className="mt-3 divide-y divide-border">
            {STEPS.map((s) => {
              const done = Boolean(onboard[s.id]);
              return (
                <li key={s.id} className="flex items-center justify-between gap-3 py-2.5">
                  <span className={done ? "text-sm text-muted-foreground line-through" : "text-sm"}>{s.label}</span>
                  {done ? (
                    <Badge variant="success">done</Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        completeOnboardingStep({ data: { step: s.id } }).then(() => {
                          qc.invalidateQueries({ queryKey: ["portal-me"] });
                        })
                      }
                    >
                      Mark done
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div className="mt-6 flex flex-wrap gap-2 px-4 sm:px-6">
        <Button asChild size="sm"><Link to="/">New deal</Link></Button>
        <Button asChild size="sm" variant="secondary"><Link to="/quotes">Quote wizard</Link></Button>
        <Button asChild size="sm" variant="secondary"><Link to="/ai">AI draft</Link></Button>
        <Button asChild size="sm" variant="secondary"><Link to="/finance">Invoice</Link></Button>
        <Button asChild size="sm" variant="ghost"><Link to="/guests">Guests</Link></Button>
      </div>

      <div className="mt-6 grid gap-4 px-4 sm:px-6 lg:grid-cols-2 xl:grid-cols-4">
        <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Upcoming events</h2>
          <ul className="mt-2 space-y-2">
            {(ops.data?.upcoming ?? []).map((e) => (
              <li key={e.id} className="flex justify-between gap-2 text-sm">
                <Link to="/deals/$dealId" params={{ dealId: String(e.id) }} className="truncate">
                  {e.title}
                </Link>
                <span className="text-xs text-muted-foreground">{formatDate(e.eventDate)}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Activity feed</h2>
          <ul className="mt-2 space-y-2">
            {(ops.data?.feed ?? []).map((a, i) => (
              <li key={i} className="text-sm">
                <span className={a.done ? "text-muted-foreground line-through" : ""}>{a.subject}</span>
                <span className="ml-2 text-xs text-muted-foreground">{a.owner}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Health flags</h2>
          <ul className="mt-2 space-y-2">
            {(health.data?.flags ?? []).slice(0, 5).map((f) => (
              <li key={f.id} className="text-sm">
                <Link to="/deals/$dealId" params={{ dealId: String(f.id) }} className="hover:underline">
                  {f.title}
                </Link>
                <span className="ml-2 text-xs text-muted-foreground">{f.issues[0]}</span>
              </li>
            ))}
            {(health.data?.flags ?? []).length === 0 && (
              <li className="text-sm text-muted-foreground">Booked shows are clean.</li>
            )}
          </ul>
        </section>
        <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Pipeline</h2>
          <ul className="mt-2 space-y-2">
            {(ops.data?.pipeline ?? []).map((s) => (
              <li key={s.name} className="flex justify-between text-sm">
                <span>{s.name}</span>
                <span className="text-xs text-muted-foreground">{s.count} · {formatUsd(s.value)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-6 grid gap-4 px-4 sm:px-6 lg:grid-cols-2">
        <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Storage</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {d ? `${Math.round(d.usedMb)} MB of ${d.quotaGb} GB` : "—"} · Google Drive connected
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary"
              style={{ width: `${Math.min(100, ((d?.usedMb ?? 0) / ((d?.quotaGb ?? 1) * 1000)) * 100)}%` }}
            />
          </div>
        </section>
        <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Recent files</h2>
          <ul className="mt-2 space-y-2">
            {(d?.recent ?? []).map((f) => (
              <li key={f.name} className="flex justify-between gap-2 text-sm">
                <span className="truncate">{f.name}</span>
                <span className="text-xs text-muted-foreground">{formatDateTime(f.at)}</span>
              </li>
            ))}
            {(d?.recent ?? []).length === 0 && <p className="text-sm text-muted-foreground">No files yet.</p>}
          </ul>
        </section>
      </div>
      {d && (
        <p className="mt-4 px-4 text-xs text-muted-foreground sm:px-6">
          {formatBytes(d.fileBytes)} across the tenant · concierge is the spark in the header.
        </p>
      )}
    </div>
  );
}

function Stat({
  to,
  label,
  value,
  icon: Icon,
}: {
  to: string;
  label: string;
  value: string | number;
  icon: typeof LayoutGrid;
}) {
  return (
    <Link to={to as "/"} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-xs tracking-wide uppercase">{label}</span>
        <Icon className="size-4" />
      </div>
      <div className="mt-3 font-mono text-2xl tabular-nums">{value}</div>
    </Link>
  );
}
