import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { geocodePerson, getRegistryDesk } from "@/lib/crm/registry";
import { formatDate } from "@/lib/utils";

export const Route = createFileRoute("/registry")({ component: RegistryPage });

function RegistryPage() {
  const desk = useQuery({ queryKey: ["registry"], queryFn: () => getRegistryDesk() });
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const d = desk.data;
  const rows = useMemo(() => {
    const s = q.toLowerCase();
    return (d?.clients ?? []).filter((c) =>
      `${c.name} ${c.email ?? ""} ${c.org ?? ""} ${c.city ?? ""} ${c.address ?? ""}`.toLowerCase().includes(s),
    );
  }, [d, q]);

  return (
    <div className="pb-12">
      <PageHeader
        title="Client registry"
        subtitle="One record per client: contact, history, geocoded address, and how they want to be reached."
        actions={<Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the book" className="h-9 w-48" />}
      />

      {desk.isLoading || !d ? (
        <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6">
          <Stat label="Clients" value={String(d.stats.n)} hint="People in the book" />
          <Stat label="Geocoded" value={`${d.stats.geocoded}/${d.stats.n}`} hint="Lat/lng on the record" />
          <Stat label="With street" value={String(d.stats.withAddress)} hint="Address on file" />
          <Stat label="Prefs" value={`${d.stats.mailOff} mail off · ${d.stats.smsOff} SMS off`} hint="Communication" />
        </div>
      )}

      <ul className="mt-6 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)] mx-4 sm:mx-6">
        {rows.map((c) => (
          <li key={c.id} className="flex flex-wrap items-start justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <Link to="/contacts/$personId" params={{ personId: String(c.id) }} className="text-sm font-medium hover:underline">
                {c.name}
              </Link>
              <p className="text-xs text-muted-foreground">
                {[c.title, c.org, c.email].filter(Boolean).join(" · ")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {c.address ? `${c.address}, ${c.city ?? ""}` : c.city ?? "No address"}
                {c.lat != null && c.lng != null ? ` · ${c.lat.toFixed(3)}, ${c.lng.toFixed(3)}` : ""}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                <Badge variant={c.mail ? "success" : "outline"}>mail {c.mail ? "on" : "off"}</Badge>
                <Badge variant={c.sms ? "success" : "outline"}>SMS {c.sms ? "on" : "off"}</Badge>
                <Badge variant={c.postal ? "steel" : "outline"}>postal {c.postal ? "on" : "off"}</Badge>
                {c.geocodedAt && <Badge variant="outline">geocoded {formatDate(c.geocodedAt)}</Badge>}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-muted-foreground">{c.shows} shows</span>
              {c.lat == null && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    geocodePerson({ data: { id: c.id } }).then((r) => {
                      if (!r.ok) toast.error(r.error ?? "No pin");
                      else toast.success(`Pinned ${r.label}`);
                      void qc.invalidateQueries({ queryKey: ["registry"] });
                    })
                  }
                >
                  Geocode
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <article className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
      <div className="text-xs tracking-wide text-muted-foreground uppercase">{label}</div>
      <div className="mt-2 truncate font-mono text-xl tabular-nums">{value}</div>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </article>
  );
}
