import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, AtSign, Clock, Flame } from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { getPulse } from "@/lib/crm/server";
import { formatDateTime } from "@/lib/utils";

export const Route = createFileRoute("/pulse")({ component: PulsePage });

const ICON = {
  rot: Flame,
  overdue: Clock,
  mention: AtSign,
  won: AlertTriangle,
  lead: AlertTriangle,
};

function PulsePage() {
  const pulse = useQuery({ queryKey: ["pulse"], queryFn: () => getPulse() });
  return (
    <div>
      <PageHeader
        title="Pulse"
        subtitle="Rotting shows, overdue site walks, and mentions — the toolkit that keeps the floor moving."
      />
      <ul className="divide-y divide-border border-t border-border">
        {(pulse.data ?? []).map((item) => {
          const Icon = ICON[item.kind];
          return (
            <li key={item.id}>
              <Link
                to={item.href.startsWith("/deals/") ? "/deals/$dealId" : (item.href.split("?")[0] as "/")}
                params={
                  item.href.match(/\/deals\/(\d+)/)
                    ? { dealId: item.href.match(/\/deals\/(\d+)/)![1]! }
                    : undefined
                }
                className="flex gap-3 px-4 py-3 hover:bg-accent/40 sm:px-6"
              >
                <Icon className="mt-0.5 size-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">{item.title}</div>
                  <p className="text-sm text-muted-foreground">{item.body}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{formatDateTime(item.at)}</p>
                </div>
              </Link>
            </li>
          );
        })}
        {(pulse.data ?? []).length === 0 && (
          <p className="px-6 py-12 text-sm text-muted-foreground">Nothing rotting. Enjoy it while it lasts.</p>
        )}
      </ul>
    </div>
  );
}
