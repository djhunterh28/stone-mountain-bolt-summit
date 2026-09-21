import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { HpMark } from "@/components/portal/hp-mark";
import {
  activatePortalDomain,
  checkPortalDns,
  getPortalDomainDesk,
  savePortalBrand,
} from "@/lib/portal/brand";
import { formatDateTime } from "@/lib/utils";

export const Route = createFileRoute("/portal-domain")({ component: PortalDomainPage });

function copy(text: string) {
  void navigator.clipboard.writeText(text).then(() => toast.success("Copied"));
}

function PortalDomainPage() {
  const desk = useQuery({ queryKey: ["portal-domain-desk"], queryFn: () => getPortalDomainDesk() });
  const qc = useQueryClient();
  const d = desk.data;
  const [company, setCompany] = useState("");
  const [tagline, setTagline] = useState("");
  const [primary, setPrimary] = useState("");
  const [accent, setAccent] = useState("");
  const [host, setHost] = useState("");

  function refresh() {
    void qc.invalidateQueries({ queryKey: ["portal-domain-desk"] });
    void qc.invalidateQueries({ queryKey: ["portal-brand"] });
    void qc.invalidateQueries({ queryKey: ["ai-desk"] });
  }

  const b = d?.brand;
  const live = d?.domains.filter((x) => x.live) ?? [];
  const pending = d?.domains.filter((x) => !x.live) ?? [];

  return (
    <div className="pb-12">
      <PageHeader
        title="Portal domain"
        subtitle="Client-facing host, logo, and colors. Separate from the CRM. Clients never see a third-party address."
      />

      {desk.isLoading || !d || !b ? (
        <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6">
          <Stat label="Portal" value={b.portalHost.split(".")[0] ?? "portal"} hint={b.portalHost} />
          <Stat label="E-sign" value="esign" hint={b.esignHost} />
          <Stat label="CRM (staff)" value="crm" hint="Never in client chrome" />
          <Stat label="Hosts live" value={String(live.length)} hint={b.hidePlatform ? "Platform name hidden" : "Visible"} />
        </div>
      )}

      {b && (
        <article className="mx-4 mt-4 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:mx-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <HpMark className="size-10" color={`#${b.primaryHex}`} />
              <div>
                <h2 className="text-sm font-medium">{b.company}</h2>
                <p className="text-xs text-muted-foreground">{b.tagline}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Clients open https://{b.portalHost} · envelopes on {b.esignHost}
                </p>
              </div>
            </div>
            <Badge variant="success">live</Badge>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-1 text-xs">
              <span className="size-3 rounded-sm" style={{ background: `#${b.primaryHex}` }} />
              #{b.primaryHex}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-1 text-xs">
              <span className="size-3 rounded-sm" style={{ background: `#${b.accentHex}` }} />
              #{b.accentHex}
            </span>
            <Button asChild size="sm" variant="secondary">
              <a href="/portal?preview=1">Preview as client</a>
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {b.footer}. Support {b.supportEmail}. The staff CRM stays on {b.crmHost} and is never printed in client mail or the portal chrome.
          </p>
        </article>
      )}

      <div className="mt-6 grid gap-4 px-4 lg:grid-cols-2 sm:px-6">
        <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">Brand on the portal</h2>
          <p className="mt-1 text-xs text-muted-foreground">Logo mark, company name, and colors follow every client page.</p>
          {b && (
            <form
              className="mt-3 space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                void savePortalBrand({
                  data: {
                    company: company || b.company,
                    tagline: tagline || b.tagline,
                    primaryHex: primary || b.primaryHex,
                    accentHex: accent || b.accentHex,
                    portalHost: host || b.portalHost,
                    hidePlatform: true,
                  },
                }).then((r) => {
                  if (!r.ok) toast.error(r.error ?? "Blocked");
                  else toast.success(`Portal host ${r.host}`);
                  refresh();
                });
              }}
            >
              <Label htmlFor="co">Company</Label>
              <Input id="co" defaultValue={b.company} onChange={(e) => setCompany(e.target.value)} />
              <Label htmlFor="tg">Tagline</Label>
              <Input id="tg" defaultValue={b.tagline} onChange={(e) => setTagline(e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="pr">Primary</Label>
                  <Input id="pr" defaultValue={b.primaryHex} onChange={(e) => setPrimary(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="ac">Accent</Label>
                  <Input id="ac" defaultValue={b.accentHex} onChange={(e) => setAccent(e.target.value)} />
                </div>
              </div>
              <Label htmlFor="ph">Portal host</Label>
              <Input id="ph" defaultValue={b.portalHost} onChange={(e) => setHost(e.target.value)} />
              <Button type="submit" size="sm">
                Save brand
              </Button>
            </form>
          )}
        </section>

        <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">DNS</h2>
          <ul className="mt-3 divide-y divide-border">
            {(d?.dns ?? []).map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-2 py-2 text-sm">
                <Badge variant={r.status === "pass" ? "success" : "warn"}>{r.status}</Badge>
                <span className="font-mono text-xs">{r.type}</span>
                <span className="min-w-0 flex-1 truncate font-mono text-xs">{r.host}</span>
                <Button size="sm" variant="ghost" onClick={() => copy(r.value)}>
                  Copy
                </Button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6 px-4 sm:px-6">
        <h2 className="text-sm font-medium">Hosts</h2>
        <ul className="mt-3 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
          {live.map((h) => (
            <li key={h.id} className="px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="success">{h.purpose}</Badge>
                <span className="font-medium">{h.host}</span>
                <Badge variant="outline">{h.ssl}</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {h.notes}
                {h.verifiedAt ? ` · live since ${formatDateTime(h.verifiedAt)}` : ""}
              </p>
            </li>
          ))}
        </ul>
        {pending.length > 0 && (
          <ul className="mt-3 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
            {pending.map((h) => (
              <li key={h.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <div>
                  <div className="text-sm">{h.host}</div>
                  <p className="text-xs text-muted-foreground">{h.notes}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      checkPortalDns({ data: { id: h.id } }).then((r) => {
                        toast.success(`DNS ${r.records} records pass`);
                        refresh();
                      })
                    }
                  >
                    Check DNS
                  </Button>
                  <Button
                    size="sm"
                    onClick={() =>
                      activatePortalDomain({ data: { id: h.id } }).then((r) => {
                        if (!r.ok) toast.error(r.error ?? "Blocked");
                        else toast.success(`Live on ${r.host}`);
                        refresh();
                      })
                    }
                  >
                    Activate
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <article className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
      <div className="text-xs tracking-wide text-muted-foreground uppercase">{label}</div>
      <div className="mt-2 truncate font-mono text-xl tabular-nums">{value}</div>
      <p className="mt-1 truncate text-xs text-muted-foreground">{hint}</p>
    </article>
  );
}
