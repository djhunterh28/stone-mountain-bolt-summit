import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { awardGig, getGigs } from "@/lib/crm/ops";
import { formatUsd } from "@/lib/utils";

export const Route = createFileRoute("/gigs")({ component: GigsPage });

function GigsPage() {
  const data = useQuery({ queryKey: ["gigs"], queryFn: () => getGigs() });
  const qc = useQueryClient();
  return (
    <div className="pb-12">
      <PageHeader title="Freelance gigs" subtitle="Open calls hide dates that conflict. Award from bio and stars. No financials leave the house." />
      {(data.data?.gigs ?? []).map((g) => (
        <section key={g.id} className="mx-4 mb-6 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:mx-6">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-medium">{g.role}</h2>
            <Badge variant="outline">{g.deal}</Badge>
            <Badge variant={g.status === "open" ? "success" : "steel"}>{g.status}</Badge>
            <span className="text-xs text-muted-foreground">{formatUsd(g.dayRate)} / day</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{g.notes}</p>
          <ul className="mt-3 divide-y divide-border">
            {(data.data?.apps ?? [])
              .filter((a) => a.gigId === g.id)
              .map((a) => (
                <li key={a.id} className="flex flex-wrap items-center gap-3 py-2.5 text-sm">
                  <div className="flex-1">
                    <span className="font-medium">{a.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{a.stars} ★ · {a.bio}</span>
                  </div>
                  <Badge variant="outline">{a.status}</Badge>
                  {a.status === "pending" && (
                    <>
                      <Button size="sm" onClick={() => awardGig({ data: { appId: a.id, accept: true } }).then(() => { toast.success("Onboarded"); qc.invalidateQueries({ queryKey: ["gigs"] }); })}>
                        Award
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => awardGig({ data: { appId: a.id, accept: false } }).then(() => qc.invalidateQueries({ queryKey: ["gigs"] }))}>
                        Decline
                      </Button>
                    </>
                  )}
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
