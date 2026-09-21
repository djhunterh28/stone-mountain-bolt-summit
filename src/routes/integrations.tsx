import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { listDeals } from "@/lib/crm/server";
import {
  createDealMeet,
  createDealZoom,
  listIntegrationStatus,
  listShowTracks,
  pinPlaceToDeal,
  pinTrack,
  searchDeezer,
  searchPlaces,
  type DeezerTrack,
  type PlaceHit,
} from "@/lib/crm/integrations";
import { formatDateTime } from "@/lib/utils";

export const Route = createFileRoute("/integrations")({ component: IntegrationsPage });

const LABELS: Record<string, string> = {
  calendly: "Calendly",
  tidycal: "TidyCal",
  acuity: "Acuity",
  zoom: "Zoom",
  google_meet: "Google Meet",
  deezer: "Deezer",
  google_places: "Google Places",
};

function IntegrationsPage() {
  const status = useQuery({ queryKey: ["integration-status"], queryFn: () => listIntegrationStatus() });
  const deals = useQuery({ queryKey: ["deals", 1, "open"], queryFn: () => listDeals({ data: { pipelineId: 1, status: "open" } }) });
  const tracks = useQuery({ queryKey: ["show-tracks"], queryFn: () => listShowTracks() });
  const [dealId, setDealId] = useState<number>(1);

  return (
    <div className="pb-12">
      <PageHeader
        title="Integrations"
        subtitle="Calendly, TidyCal, Acuity, Zoom, Google Meet, Deezer, and Google Places on the same desk."
      />
      <div className="grid gap-3 px-4 sm:grid-cols-3 sm:px-6">
        {(status.data?.rows ?? []).map((r) => (
          <article key={r.provider} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-medium">{LABELS[r.provider] ?? r.provider}</h2>
              <Badge variant={r.connected ? "success" : "outline"}>{r.connected ? "live" : "off"}</Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{r.detail}</p>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Last ok {r.lastOk ? formatDateTime(r.lastOk) : "—"}
            </p>
          </article>
        ))}
      </div>
      <div className="mt-6 px-4 sm:px-6">
        <label className="mb-3 flex items-center gap-2 text-sm">
          Pin to deal
          <select
            className="h-9 max-w-xs rounded-md border border-input bg-background px-2 text-sm"
            value={dealId}
            onChange={(e) => setDealId(Number(e.target.value))}
          >
            {(deals.data ?? []).map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </select>
        </label>
        <Tabs defaultValue="schedule">
          <TabsList className="flex h-auto flex-wrap">
            <TabsTrigger value="schedule">Scheduling</TabsTrigger>
            <TabsTrigger value="places">Google Places</TabsTrigger>
            <TabsTrigger value="music">Deezer</TabsTrigger>
            <TabsTrigger value="zoom">Zoom</TabsTrigger>
            <TabsTrigger value="meet">Google Meet</TabsTrigger>
          </TabsList>
          <TabsContent value="schedule" className="mt-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Per-user Calendly, TidyCal, and Acuity connections live on Scheduler. Confirmed holds mint Google Meet or Zoom and send mail.
            </p>
            <Button asChild size="sm" variant="secondary">
              <Link to="/scheduler">Open scheduler connections</Link>
            </Button>
          </TabsContent>
          <TabsContent value="places" className="mt-4">
            <PlacesPanel dealId={dealId} />
          </TabsContent>
          <TabsContent value="music" className="mt-4">
            <MusicPanel dealId={dealId} saved={tracks.data ?? []} onSaved={() => tracks.refetch()} />
          </TabsContent>
          <TabsContent value="zoom" className="mt-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Create a Zoom meeting from the selected event. Join URL lands on a calendar activity.
            </p>
            <Button
              size="sm"
              onClick={() =>
                createDealZoom({ data: { dealId } }).then((r) => {
                  if (!r.ok) toast.error(r.error);
                  else toast.success(`Zoom ${r.join} · pass ${r.pass}`);
                })
              }
            >
              Create Zoom for this deal
            </Button>
          </TabsContent>
          <TabsContent value="meet" className="mt-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Create a Google Meet space from the selected event. The join URL lands on a calendar activity.
            </p>
            <Button
              size="sm"
              onClick={() =>
                createDealMeet({ data: { dealId } }).then((r) => {
                  if (!r.ok) toast.error(r.error);
                  else toast.success(`Meet ${r.join}`);
                })
              }
            >
              Create Meet for this deal
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function PlacesPanel({ dealId }: { dealId: number }) {
  const [q, setQ] = useState("cipriani");
  const [hits, setHits] = useState<PlaceHit[] | null>(null);
  const [busy, setBusy] = useState(false);

  async function run(term = q) {
    setBusy(true);
    const res = await searchPlaces({ data: { q: term } });
    setHits(res);
    setBusy(false);
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Google Places–shaped venue lookup: rating, types, maps pin, load-in address. NYC production rooms are indexed.
      </p>
      <form
        className="flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void run();
        }}
      >
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Venue, neighborhood, type" className="max-w-sm" />
        <Button type="submit" size="sm" disabled={busy}>
          {busy ? "Looking up…" : "Search Places"}
        </Button>
      </form>
      <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
        {(hits ?? []).map((p) => (
          <li key={p.placeId} className="flex flex-wrap items-start gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">{p.name}</span>
                {p.rating != null && <Badge variant="steel">{p.rating.toFixed(1)}</Badge>}
              </div>
              <p className="text-xs text-muted-foreground">
                {p.address}
                {p.city ? `, ${p.city}` : ""} · {p.types.join(", ")}
                {p.hours ? ` · ${p.hours}` : ""}
              </p>
            </div>
            {p.mapsUrl && (
              <Button size="sm" variant="ghost" asChild>
                <a href={p.mapsUrl} target="_blank" rel="noreferrer">
                  Map
                </a>
              </Button>
            )}
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                pinPlaceToDeal({ data: { dealId, placeId: p.placeId } }).then((r) => {
                  if (r.ok) toast.success(`Venue set to ${r.venue}`);
                  else toast.error(r.error);
                })
              }
            >
              Pin to deal
            </Button>
          </li>
        ))}
        {hits && hits.length === 0 && <li className="px-4 py-6 text-sm text-muted-foreground">No venues matched.</li>}
      </ul>
    </div>
  );
}

function MusicPanel({
  dealId,
  saved,
  onSaved,
}: {
  dealId: number;
  saved: Awaited<ReturnType<typeof listShowTracks>>;
  onSaved: () => void;
}) {
  const [q, setQ] = useState("daft punk");
  const [hits, setHits] = useState<DeezerTrack[]>([]);
  const [busy, setBusy] = useState(false);
  const [role, setRole] = useState("walk-in");

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Deezer track search for walk-in, dinner, and bump music. Preview plays from Deezer; pin it to the show.
      </p>
      <form
        className="flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setBusy(true);
          void searchDeezer({ data: { q } }).then((r) => {
            setHits(r);
            setBusy(false);
          });
        }}
      >
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Artist, track, playlist mood" className="max-w-sm" />
        <select className="h-9 rounded-md border border-input bg-background px-2 text-sm" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="walk-in">Walk-in</option>
          <option value="dinner">Dinner</option>
          <option value="bump">Bump</option>
          <option value="brand">Brand</option>
        </select>
        <Button type="submit" size="sm" disabled={busy}>
          {busy ? "Searching…" : "Search Deezer"}
        </Button>
      </form>
      <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
        {hits.map((t) => (
          <li key={t.deezerId} className="flex flex-wrap items-center gap-3 px-4 py-3">
            {t.coverUrl && <img src={t.coverUrl} alt="" className="size-10 rounded object-cover" />}
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium">{t.title}</div>
              <p className="text-xs text-muted-foreground">
                {t.artist}
                {t.album ? ` · ${t.album}` : ""} · {Math.floor(t.durationSec / 60)}:{String(t.durationSec % 60).padStart(2, "0")}
              </p>
              {t.previewUrl && <audio className="mt-2 h-8 w-full max-w-xs" controls src={t.previewUrl} preload="none" />}
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                pinTrack({ data: { dealId, track: t, role } }).then(() => {
                  toast.success("Pinned to the show");
                  onSaved();
                })
              }
            >
              Pin
            </Button>
          </li>
        ))}
      </ul>
      <section>
        <h2 className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">On the books</h2>
        <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
          {saved.map((t) => (
            <li key={t.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
              <span>
                {t.title}
                <span className="ml-2 text-xs text-muted-foreground">
                  {t.artist} · {t.role} · {t.dealTitle}
                </span>
              </span>
              {t.link && (
                <a className="text-xs text-muted-foreground underline-offset-4 hover:underline" href={t.link} target="_blank" rel="noreferrer">
                  Deezer
                </a>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
