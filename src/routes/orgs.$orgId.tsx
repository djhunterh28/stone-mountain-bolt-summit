import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getOrgDetail, enrichRecord } from "@/lib/crm/ultimate";
import { formatUsdFull } from "@/lib/utils";

export const Route = createFileRoute("/orgs/$orgId")({ component: OrgPage });

function OrgPage() {
  const { orgId } = Route.useParams();
  const id = Number(orgId);
  const detail = useQuery({ queryKey: ["org", id], queryFn: () => getOrgDetail({ data: { id } }) });
  const qc = useQueryClient();
  const d = detail.data;
  if (!d) {
    return (
      <div className="px-6 py-10 text-sm text-muted-foreground">
        {detail.isLoading ? "Loading…" : "Organization not found."}
      </div>
    );
  }
  const o = d.org;
  return (
    <div className="pb-12">
      <PageHeader
        title={o.name}
        subtitle={[o.industry, o.city, o.address].filter(Boolean).join(" · ")}
        actions={
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              enrichRecord({ data: { kind: "org", id: o.id } }).then((r) => {
                if (r.ok) toast.success("Firmographic enrichment applied");
                qc.invalidateQueries({ queryKey: ["org", id] });
                qc.invalidateQueries({ queryKey: ["orgs"] });
              })
            }
          >
            Enrich
          </Button>
        }
      />
      <div className="grid gap-6 px-4 sm:px-6 lg:grid-cols-3">
        <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
          <dl className="space-y-3 text-sm">
            <Row label="Website" value={o.website} />
            <Row label="Phone" value={o.phone} />
            <Row label="Owner" value={o.ownerName} />
            <Row label="Employees" value={o.employees} />
            <Row label="Revenue band" value={o.revenueBand} />
            <Row label="Open pipeline" value={formatUsdFull(o.dealValue)} />
          </dl>
          {o.notes && <p className="mt-4 text-sm text-muted-foreground">{o.notes}</p>}
        </section>
        <section className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">People</h2>
            <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
              {d.people.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/contacts/$personId"
                    params={{ personId: String(p.id) }}
                    className="flex items-center justify-between px-4 py-3 text-sm hover:bg-accent/40"
                  >
                    <span>
                      {p.name}
                      <span className="text-muted-foreground"> · {p.title ?? "—"}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">{p.email}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">Deals</h2>
            <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
              {d.deals.map((deal) => (
                <li key={deal.id}>
                  <Link
                    to="/deals/$dealId"
                    params={{ dealId: String(deal.id) }}
                    className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-accent/40"
                  >
                    <div>
                      <div className="text-sm">{deal.title}</div>
                      <div className="text-xs text-muted-foreground">{deal.venue}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={deal.status === "open" ? "outline" : deal.status === "won" ? "success" : "danger"}>
                        {deal.status}
                      </Badge>
                      <span className="font-mono text-sm tabular-nums">{formatUsdFull(deal.value)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd>{value || "—"}</dd>
    </div>
  );
}
