import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MemberAvatar } from "@/components/crm/avatar";
import { getPersonDetail, enrichRecord } from "@/lib/crm/ultimate";
import { getPersonPrefs, setCommPref } from "@/lib/crm/ops";
import { geocodePerson, getClientHistory, savePerson } from "@/lib/crm/registry";
import { formatDate, formatDateTime, formatUsdFull } from "@/lib/utils";

export const Route = createFileRoute("/contacts/$personId")({ component: PersonPage });

function PersonPage() {
  const { personId } = Route.useParams();
  const id = Number(personId);
  const detail = useQuery({ queryKey: ["person", id], queryFn: () => getPersonDetail({ data: { id } }) });
  const prefs = useQuery({ queryKey: ["person-prefs", id], queryFn: () => getPersonPrefs({ data: { id } }) });
  const history = useQuery({ queryKey: ["person-history", id], queryFn: () => getClientHistory({ data: { id } }) });
  const qc = useQueryClient();
  const d = detail.data;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  if (!d) {
    return (
      <div className="px-6 py-10 text-sm text-muted-foreground">
        {detail.isLoading ? "Loading…" : "Person not found."}
      </div>
    );
  }
  const p = d.person;

  function refresh() {
    void qc.invalidateQueries({ queryKey: ["person", id] });
    void qc.invalidateQueries({ queryKey: ["person-prefs", id] });
    void qc.invalidateQueries({ queryKey: ["person-history", id] });
    void qc.invalidateQueries({ queryKey: ["people"] });
    void qc.invalidateQueries({ queryKey: ["registry"] });
  }

  return (
    <div className="pb-12">
      <PageHeader
        title={p.name}
        subtitle={[p.title, p.orgName, p.city].filter(Boolean).join(" · ")}
        actions={
          <>
            <Button asChild size="sm" variant="secondary">
              <Link to="/registry">Registry</Link>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                enrichRecord({ data: { kind: "person", id: p.id } }).then((r) => {
                  if (r.ok) toast.success(`Enriched · ${r.remaining ?? "?"} credits left`);
                  else toast.error(r.error ?? "Enrichment failed");
                  refresh();
                })
              }
            >
              Enrich
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
          <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Contact</h3>
          <form
            className="mt-3 space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              void savePerson({
                data: {
                  id: p.id,
                  name: name || p.name,
                  email: email || p.email,
                  phone: phone || p.phone,
                  title: title || p.title,
                  city: city || p.city,
                  address: address || p.address,
                },
              }).then(() => {
                toast.success("Registry updated");
                refresh();
              });
            }}
          >
            <Label htmlFor="nm">Name</Label>
            <Input id="nm" defaultValue={p.name} onChange={(e) => setName(e.target.value)} />
            <Label htmlFor="em">Email</Label>
            <Input id="em" defaultValue={p.email ?? ""} onChange={(e) => setEmail(e.target.value)} />
            <Label htmlFor="ph">Phone</Label>
            <Input id="ph" defaultValue={p.phone ?? ""} onChange={(e) => setPhone(e.target.value)} />
            <Label htmlFor="ti">Title</Label>
            <Input id="ti" defaultValue={p.title ?? ""} onChange={(e) => setTitle(e.target.value)} />
            <Label htmlFor="ad">Street</Label>
            <Input id="ad" defaultValue={p.address ?? ""} onChange={(e) => setAddress(e.target.value)} />
            <Label htmlFor="ct">City</Label>
            <Input id="ct" defaultValue={p.city ?? ""} onChange={(e) => setCity(e.target.value)} />
            <div className="flex flex-wrap gap-2 pt-1">
              <Button type="submit" size="sm">
                Save contact
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() =>
                  geocodePerson({ data: { id: p.id, q: address || p.address || p.city || undefined } }).then((r) => {
                    if (!r.ok) toast.error(r.error ?? "No pin");
                    else toast.success(`${r.lat?.toFixed(4)}, ${r.lng?.toFixed(4)}`);
                    refresh();
                  })
                }
              >
                Geocode address
              </Button>
            </div>
          </form>
          <dl className="mt-4 space-y-2 border-t border-border pt-3 text-sm">
            <Row label="Mobile" value={p.mobile} />
            <Row label="Direct dial" value={p.directDial} />
            <Row
              label="Pin"
              value={
                p.lat != null && p.lng != null
                  ? `${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}`
                  : "Not geocoded"
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
                    setCommPref({ data: { personId: p.id, mail: e.target.checked } }).then(() => {
                      toast.success(e.target.checked ? "Mail on" : "Mail off");
                      refresh();
                    })
                  }
                />
              </label>
              <label className="flex items-center justify-between text-sm">
                SMS (QUO)
                <input
                  type="checkbox"
                  checked={prefs.data.sms}
                  onChange={(e) =>
                    setCommPref({ data: { personId: p.id, sms: e.target.checked } }).then(() => {
                      toast.success(e.target.checked ? "SMS on" : "SMS off");
                      refresh();
                    })
                  }
                />
              </label>
              <label className="flex items-center justify-between text-sm">
                Postal
                <input
                  type="checkbox"
                  checked={prefs.data.postal}
                  onChange={(e) =>
                    setCommPref({ data: { personId: p.id, postal: e.target.checked } }).then(() => {
                      toast.success(e.target.checked ? "Postal on" : "Postal off");
                      refresh();
                    })
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
          <h2 className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">History</h2>
          <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
            {(history.data ?? []).map((h, i) => (
              <li key={`${h.kind}-${h.at}-${i}`} className="px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{h.kind}</Badge>
                  <span className="text-sm">{h.title}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{formatDateTime(h.at)}</span>
                </div>
                {h.detail && <p className="mt-1 text-xs text-muted-foreground">{h.detail}</p>}
              </li>
            ))}
            {(history.data ?? []).length === 0 && (
              <li className="px-4 py-6 text-sm text-muted-foreground">No history on this client yet.</li>
            )}
          </ul>
          <h2 className="mt-6 mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">Shows</h2>
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
                    <Badge
                      variant={
                        deal.status === "won"
                          ? "success"
                          : deal.status === "lost"
                            ? "danger"
                            : deal.status === "cancelled"
                              ? "warn"
                              : "outline"
                      }
                    >
                      {deal.status}
                    </Badge>
                    <span className="font-mono text-sm tabular-nums">{formatUsdFull(deal.value)}</span>
                  </div>
                </Link>
              </li>
            ))}
            {d.deals.length === 0 && <li className="px-4 py-6 text-sm text-muted-foreground">No deals yet.</li>}
          </ul>
          <h2 className="mt-6 mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">Activities</h2>
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