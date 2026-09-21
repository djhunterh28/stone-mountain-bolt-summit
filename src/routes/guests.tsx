import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { getGuests } from "@/lib/crm/ops";

export const Route = createFileRoute("/guests")({ component: GuestsPage });

function GuestsPage() {
  const g = useQuery({ queryKey: ["guests"], queryFn: () => getGuests({ data: {} }) });
  return (
    <div className="pb-12">
      <PageHeader title="Guest lists" subtitle="RSVP, meals, plus-ones. Clients get a token link — no account." />
      <ul className="mx-4 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)] sm:mx-6">
        {(g.data ?? []).map((row) => (
          <li key={row.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
            <div className="min-w-0 flex-1">
              <div className="font-medium">{row.name}</div>
              <p className="text-xs text-muted-foreground">
                {row.deal} · party of {row.party}
                {row.meal ? ` · ${row.meal}` : ""}
              </p>
            </div>
            <Badge variant={row.rsvp === "yes" ? "success" : row.rsvp === "no" ? "warn" : "outline"}>{row.rsvp}</Badge>
            {row.token && (
              <Link to="/rsvp/$token" params={{ token: row.token }} className="text-xs text-muted-foreground underline-offset-4 hover:underline">
                Guest link
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
