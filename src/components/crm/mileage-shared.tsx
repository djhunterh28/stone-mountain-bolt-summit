import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTrip, setTripStatus, tripCost, type MileageTrip, type TravelPlace, type Vehicle } from "@/lib/crm/travel";
import { driveMinutes, roadMiles } from "@/lib/crm/geo";
import { formatDate } from "@/lib/utils";

export function usd(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export function todayIso() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date());
}

export function shopOf(places: TravelPlace[]) {
  return places.find((p) => p.kind === "shop") ?? places[0];
}

export function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <article className="rounded-xl bg-card px-4 py-3 shadow-[var(--shadow-border)]">
      <p className="text-[11px] tracking-[0.12em] text-muted-foreground uppercase">{label}</p>
      <p className="mt-1 font-mono text-xl tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground">{hint}</p>
    </article>
  );
}

export function TripForm({
  vehicles,
  places,
  members,
  driverId,
  dealId,
  defaultDestId,
  onSaved,
}: {
  vehicles: Vehicle[];
  places: TravelPlace[];
  members: { id: number; name: string }[];
  driverId: number;
  dealId?: number;
  defaultDestId?: number | null;
  onSaved: () => void;
}) {
  const shop = shopOf(places);
  const [originId, setOriginId] = useState<number | "">("");
  const [destId, setDestId] = useState<number | "">(defaultDestId ?? "");
  useEffect(() => {
    if (!originId && shop) setOriginId(shop.id);
  }, [shop, originId]);
  useEffect(() => {
    if (!destId && defaultDestId) setDestId(defaultDestId);
  }, [defaultDestId, destId]);
  const origin = places.find((p) => p.id === originId);
  const dest = places.find((p) => p.id === destId);
  const preview = origin && dest ? roadMiles(origin, dest) : 0;
  const minutes = origin && dest ? driveMinutes(preview, "truck") : 0;
  const orderedPlaces = [...places].sort((a, b) => Number(b.kind === "shop") - Number(a.kind === "shop") || a.name.localeCompare(b.name));

  return (
    <form
      className="grid gap-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:grid-cols-4"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        if (!originId || !destId) {
          toast.error("Pick origin and destination");
          return;
        }
        void createTrip({
          data: {
            traveledOn: String(fd.get("traveledOn") || todayIso()),
            vehicleId: Number(fd.get("vehicleId")),
            driverId: Number(fd.get("driverId") || driverId),
            originId: Number(originId),
            destId: Number(destId),
            purpose: String(fd.get("purpose") || "") || undefined,
            tolls: Number(fd.get("tolls") || 0),
            parking: Number(fd.get("parking") || 0),
            milesOverride: Number(fd.get("miles") || 0) || undefined,
            dealId,
          },
        }).then((r) => {
          if (!r.ok) toast.error(r.error);
          else {
            toast.success(`${r.miles.toFixed(1)} mi logged${dealId ? " on this deal" : ""}`);
            onSaved();
          }
        });
      }}
    >
      <label className="text-xs text-muted-foreground">
        Date
        <Input name="traveledOn" type="date" defaultValue={todayIso()} className="mt-1" />
      </label>
      <label className="text-xs text-muted-foreground">
        Vehicle
        <select name="vehicleId" className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-sm" defaultValue={vehicles[0]?.id}>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs text-muted-foreground">
        Driver
        <select name="driverId" className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-sm" defaultValue={driverId}>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs text-muted-foreground">
        Purpose
        <Input name="purpose" placeholder="Load-in, site walk…" className="mt-1" />
      </label>
      <label className="text-xs text-muted-foreground">
        From
        <select
          className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
          value={originId}
          onChange={(e) => setOriginId(Number(e.target.value))}
        >
          {orderedPlaces.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs text-muted-foreground">
        To
        <select
          className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
          value={destId}
          onChange={(e) => setDestId(Number(e.target.value))}
        >
          <option value="">Venue</option>
          {orderedPlaces.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs text-muted-foreground">
        Miles {preview ? `(auto ${preview.toFixed(1)})` : ""}
        <Input name="miles" type="number" step="0.1" placeholder={preview ? String(preview) : "auto"} className="mt-1" />
      </label>
      <div className="flex items-end gap-2">
        <label className="flex-1 text-xs text-muted-foreground">
          Tolls
          <Input name="tolls" type="number" step="0.01" defaultValue="0" className="mt-1" />
        </label>
        <label className="flex-1 text-xs text-muted-foreground">
          Parking
          <Input name="parking" type="number" step="0.01" defaultValue="0" className="mt-1" />
        </label>
      </div>
      <div className="flex items-end justify-between gap-3 sm:col-span-4">
        <p className="text-sm text-muted-foreground">
          {origin && dest ? (
            <>
              {preview.toFixed(1)} mi · ~{minutes} min city
            </>
          ) : (
            "Distance fills in from venue coordinates."
          )}
        </p>
        <Button type="submit" size="sm">
          Log trip
        </Button>
      </div>
    </form>
  );
}

export function TripList({
  trips,
  onStatus,
  showDeal,
}: {
  trips: MileageTrip[];
  onStatus: () => void;
  showDeal?: boolean;
}) {
  if (!trips.length) return <p className="text-sm text-muted-foreground">No trips yet.</p>;
  return (
    <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
      {trips.map((t) => {
        const c = tripCost(t);
        return (
          <li key={t.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
            <div className="w-16 shrink-0 font-mono text-xs tabular-nums text-muted-foreground">{formatDate(t.traveledOn)}</div>
            <div className="min-w-0 flex-1">
              <div className="text-sm">
                {t.originName} → {t.destName}
              </div>
              <p className="text-xs text-muted-foreground">
                {t.vehicleName} · {t.driverName} {t.purpose ? `· ${t.purpose}` : ""}
                {showDeal && t.dealId ? (
                  <>
                    {" · "}
                    <Link to="/deals/$dealId" params={{ dealId: String(t.dealId) }} className="text-primary hover:underline">
                      {t.dealTitle ?? `Deal ${t.dealId}`}
                    </Link>
                  </>
                ) : null}
              </p>
            </div>
            <span className="font-mono text-sm tabular-nums">{t.miles.toFixed(1)} mi</span>
            <span className="font-mono text-sm tabular-nums">{usd(c.total)}</span>
            <Badge variant={t.status === "reimbursed" ? "success" : t.status === "submitted" ? "steel" : "outline"}>{t.status}</Badge>
            {t.status === "logged" && (
              <Button size="sm" variant="ghost" onClick={() => setTripStatus({ data: { id: t.id, status: "submitted" } }).then(onStatus)}>
                Submit
              </Button>
            )}
            {t.status === "submitted" && (
              <Button size="sm" variant="ghost" onClick={() => setTripStatus({ data: { id: t.id, status: "reimbursed" } }).then(onStatus)}>
                Reimburse
              </Button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
