import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { listPortalProjects } from "@/lib/portal/server";
import { formatDate, formatUsd } from "@/lib/utils";

export const Route = createFileRoute("/projects")({ component: ProjectsLayout });

function ProjectsLayout() {
  const nested = useRouterState({
    select: (s) => s.location.pathname !== "/projects" && s.location.pathname.startsWith("/projects/"),
  });
  if (nested) return <Outlet />;
  return <ProjectsPage />;
}

function ProjectsPage() {
  const projects = useQuery({ queryKey: ["portal-projects"], queryFn: () => listPortalProjects() });
  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle="Synced from Pipedrive — Estimate & Agreement Sent, On Hold, and Signed/Invoiced."
      />
      <div className="grid gap-3 px-4 pb-10 sm:grid-cols-2 sm:px-6 xl:grid-cols-3">
        {(projects.data ?? []).map((p) => (
          <Link
            key={p.id}
            to="/projects/$projectId"
            params={{ projectId: String(p.id) }}
            className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)] transition-shadow hover:shadow-[var(--shadow-border-hover)]"
          >
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-sm font-medium">{p.name}</h2>
              <Badge variant={p.status === "done" ? "success" : "steel"}>{p.stageLabel}</Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {p.venue ?? "Shop"} · {p.tenantName ?? "House"} · {formatUsd(p.value)}
            </p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary"
                style={{ width: `${p.taskCount ? Math.round((p.doneCount / p.taskCount) * 100) : 0}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {p.doneCount}/{p.taskCount} done · {formatDate(p.endDate)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
