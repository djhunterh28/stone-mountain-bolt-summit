import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MemberAvatar } from "@/components/crm/avatar";
import { getPersonDetail, enrichRecord } from "@/lib/crm/ultimate";
import { getPersonPrefs, setCommPref } from "@/lib/crm/ops";
import { formatDate, formatUsdFull } from "@/lib/utils";

export const Route = createFileRoute("/contacts/$personId")({ component: PersonPage });

function PersonPage() {
  const { personId } = Route.useParams();
  const id = Number(personId);
  const detail = useQuery({ queryKey: ["person", id], queryFn: () => getPersonDetail({ data: { id } }) });
  const prefs = useQuery({ queryKey: ["person-prefs", id], queryFn: () => getPersonPrefs({ data: { id } }) });
  const qc = useQueryClient();
  const d = detail.data;
  if (!d) {
    return (
      <div className="px-6 py-10 text-sm text-muted-foreground">
        {detail.isLoading ? "Loading…" : "Person not found."}
      </div>
    );
  }
  const p = d.person;
  return (
    <div className="pb-12">
      <PageHeader
        title={p.name}
        subtitle={[p.title, p.orgName, p.city].filter(Boolean).join(" · ")}
        actions={
          <>
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                enrichRecord({ data: { kind: "person", id: p.id } }).then((r) => {
                  if (r.ok) toast.success(`Enriched · ${r.remaining ?? "?"} credits left`);
                  else toast.error(r.error ?? "Enrichment failed");
                  qc.invalidateQueries({ queryKey: ["person", id] });
                  qc.invalidateQueries({ queryKey: ["people"] });
                  qc.invalidateQueries({ queryKey: ["usage"] });
                })
              }
            >
              Enrich
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                enrichRecord({ data: { kind: "person", id: p.id, lookup: "email" } }).then((r) => {
                  if (r.ok) toast.success(r.email ? `Email ${r.email}` : "Email lookup done");
                  else toast.error(r.error ?? "Lookup failed");
                  qc.invalidateQueries({ queryKey: ["person", id] });
                  qc.invalidateQueries({ queryKey: ["usage"] });
                })
              }
            >
              Lookup email
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                enrichRecord({ data: { kind: "person", id: p.id, lookup: "phone" } }).then((r) => {
                  if (r.ok) toast.success(r.phone ? `Direct ${r.phone}` : "Phone lookup done");
                  else toast.error(r.error ?? "Lookup failed");
                  qc.invalidateQueries({ queryKey: ["person", id] });
                  qc.invalidateQueries({ queryKey: ["usage"] });
                })
              }
            >
              Lookup phone
            </Button>
            {p.orgId && (
              <Button asChild size="sm" variant="ghost">
                <Link to="/orgs/$orgId" params={{ orgId: String(p.orgId) }}>
                  Organization
                </Link>
              </Button>
            )}
          </>
        }
      />
      <div className="grid gap-6 px-4 sm:px-6 lg:grid-cols-3">
        <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)] lg:col-span-1">
          <dl className="space-y-3 text-sm">
            <Row label="Email" value={p.email} />
            <Row label="Phone" value={p.phone} />
            <Row label="Mobile" value={p.mobile} />
            <Row label="Direct dial" value={p.directDial} />
            <Row label="Owner" value={p.ownerName} />
            <Row label="LinkedIn" value={p.linkedin} />
            <Row label="Open pipeline" value={formatUsdFull(p.dealValue)} />
            {p.enrichedAt && <Row label="Enriched" value={formatDate(p.enrichedAt)} />}
            <Row
              label="Geocoded"
              value={
                prefs.data?.lat != null && prefs.data?.lng != null
                  ? `${prefs.data.city ?? p.city ?? "—"} · ${prefs.data.lat.toFixed(4)}, ${prefs.data.lng.toFixed(4)}`
                  : p.city
              }
            />
          </dl>
          {prefs.data && (
            <div className="mt-4 space-y-2 border-t border-border pt-3">
              <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Communication</h3>
              <label className="flex items-center justify-between text-sm">
                Email
                <input
                  type="checkbox"
                  checked={prefs.data.mail}
                  onChange={(e) =>
                    setCommPref({ data: { personId: p.id, mail: e.target.checked } }).then(() =>
                      qc.invalidateQueries({ queryKey: ["person-prefs", id] }),
                    )
                  }
                />
              </label>
              <label className="flex items-center justify-between text-sm">
                SMS (QUO)
                <input
                  type="checkbox"
                  checked={prefs.data.sms}
                  onChange={(e) =>
                    setCommPref({ data: { personId: p.id, sms: e.target.checked } }).then(() =>
                      qc.invalidateQueries({ queryKey: ["person-prefs", id] }),
                    )
                  }
                />
              </label>
              <label className="flex items-center justify-between text-sm">
                Postal
                <input
                  type="checkbox"
                  checked={prefs.data.postal}
                  onChange={(e) =>
                    setCommPref({ data: { personId: p.id, postal: e.target.checked } }).then(() =>
                      qc.invalidateQueries({ queryKey: ["person-prefs", id] }),
                    )
                  }
                />
              </label>
              {prefs.data.smsSource && (
                <p className="text-[11px] text-muted-foreground">SMS source · {prefs.data.smsSource}</p>
              )}
            </div>
          )}
        </section>
        <section className="lg:col-span-2">
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
                    <div className="text-xs text-muted-foreground">{deal.venue ?? deal.orgName}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={deal.status === "won" ? "success" : deal.status === "lost" ? "danger" : "outline"}>
                      {deal.status}
                    </Badge>
                    <span className="font-mono text-sm tabular-nums">{formatUsdFull(deal.value)}</span>
                  </div>
                </Link>
              </li>
            ))}
            {d.deals.length === 0 && <li className="px-4 py-6 text-sm text-muted-foreground">No deals yet.</li>}
          </ul>
          <h2 className="mt-6 mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Activities
          </h2>
          <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
            {d.activities.map((a) => (
              <li key={a.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                {a.ownerInitials && <MemberAvatar initials={a.ownerInitials} tone={a.ownerTone} size="sm" />}
                <div className="min-w-0 flex-1">
                  <div>{a.subject}</div>
                  <div className="text-xs text-muted-foreground">
                    {a.type} · {formatDate(a.dueAt)}
                  </div>
                </div>
              </li>
            ))}
            {d.activities.length === 0 && (
              <li className="px-4 py-6 text-sm text-muted-foreground">No activities.</li>
            )}
          </ul>
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
