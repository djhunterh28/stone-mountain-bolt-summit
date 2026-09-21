import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getBootstrap } from "@/lib/crm/server";
import {
  createVehicle,
  getTravelDesk,
  toggleVehicle,
  tripCost,
  FUEL_PRICE,
  type MileageTrip,
  type TravelPlace,
  type Vehicle,
} from "@/lib/crm/travel";
import { driveMinutes, naiveLoop, optimizeLoop, type RouteStop } from "@/lib/crm/geo";
import { Stat, TripForm, TripList, shopOf, todayIso, usd } from "@/components/crm/mileage-shared";
import { useUi } from "@/lib/crm/store";

export const Route = createFileRoute("/travel")({ component: TravelPage });

const KIND_LABEL: Record<string, string> = {
  "box-26": "26ft box",
  "trailer-53": "53ft trailer",
  van: "Cargo van",
  personal: "Personal",
};

function asStop(p: TravelPlace): RouteStop {
  return { id: p.id, name: p.name, lat: p.lat, lng: p.lng };
}

function speedKind(kind: string | null): "truck" | "van" | "car" {
  if (kind === "van") return "van";
  if (kind === "personal") return "car";
  return "truck";
}

function TravelPage() {
  const desk = useQuery({ queryKey: ["travel"], queryFn: () => getTravelDesk() });
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const qc = useQueryClient();
  const memberId = useUi((s) => s.memberId);
  const vehicles = desk.data?.vehicles ?? [];
  const places = desk.data?.places ?? [];
  const trips = desk.data?.trips ?? [];
  const members = boot.data?.members ?? [];

  const month = todayIso().slice(0, 7);
  const monthTrips = trips.filter((t) => t.traveledOn.startsWith(month));
  const totals = monthTrips.reduce(
    (acc, t) => {
      const c = tripCost(t);
      acc.miles += t.miles;
      acc.trips += 1;
      acc.fleet += c.fleet;
      acc.reimbursable += c.reimbursable;
      acc.fuel += c.fuel;
      acc.tolls += t.tolls;
      acc.parking += t.parking;
      return acc;
    },
    { miles: 0, trips: 0, fleet: 0, reimbursable: 0, fuel: 0, tolls: 0, parking: 0 },
  );

  return (
    <div className="pb-12">
      <PageHeader
        title="Mileage & travel"
        subtitle="House totals and reporting. Log trips on a deal or here — both feed this desk."
      />
      <div className="grid gap-3 px-4 sm:grid-cols-4 sm:px-6">
        <Stat label="Miles this month" value={`${totals.miles.toFixed(1)} mi`} hint={`${totals.trips} trips`} />
        <Stat label="Fleet cost" value={usd(totals.fleet)} hint={`${usd(totals.fuel)} fuel`} />
        <Stat label="Reimbursable" value={usd(totals.reimbursable)} hint="Personal + IRS" />
        <Stat label="Tolls & parking" value={usd(totals.tolls + totals.parking)} hint="All vehicles" />
      </div>
      <div className="mt-6 px-4 sm:px-6">
        <Tabs defaultValue="log">
          <TabsList className="flex h-auto flex-wrap">
            <TabsTrigger value="log">Mileage log</TabsTrigger>
            <TabsTrigger value="deals">By deal</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="routes">Route optimizer</TabsTrigger>
          </TabsList>
          <TabsContent value="log" className="mt-4 space-y-4">
            <TripForm
              vehicles={vehicles.filter((v) => v.active)}
              places={places}
              members={members}
              driverId={memberId}
              onSaved={() => qc.invalidateQueries({ queryKey: ["travel"] })}
            />
            <TripList trips={trips} showDeal onStatus={() => qc.invalidateQueries({ queryKey: ["travel"] })} />
          </TabsContent>
          <TabsContent value="deals" className="mt-4">
            <DealReport trips={trips} />
          </TabsContent>
          <TabsContent value="vehicles" className="mt-4 space-y-4">
            <VehicleForm onSaved={() => qc.invalidateQueries({ queryKey: ["travel"] })} />
            <VehicleList vehicles={vehicles} onToggle={() => qc.invalidateQueries({ queryKey: ["travel"] })} />
          </TabsContent>
          <TabsContent value="expenses" className="mt-4">
            <ExpensePanel trips={monthTrips} vehicles={vehicles} />
          </TabsContent>
          <TabsContent value="routes" className="mt-4">
            <RoutePanel places={places} vehicles={vehicles} todayIds={(desk.data?.todayStops ?? []).map((s) => s.id)} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


function DealReport({ trips }: { trips: MileageTrip[] }) {
  const rows = [...trips.reduce((map, t) => {
    const key = t.dealId ?? 0;
    const cur = map.get(key) ?? {
      dealId: t.dealId,
      title: t.dealTitle ?? "Unassigned",
      miles: 0,
      trips: 0,
      cost: 0,
      reimbursable: 0,
    };
    const c = tripCost(t);
    cur.miles += t.miles;
    cur.trips += 1;
    cur.cost += c.total;
    cur.reimbursable += c.reimbursable;
    map.set(key, cur);
    return map;
  }, new Map<number, { dealId: number | null; title: string; miles: number; trips: number; cost: number; reimbursable: number }>()).values()].sort((a, b) => b.miles - a.miles);

  if (!rows.length) return <p className="text-sm text-muted-foreground">No mileage logged yet.</p>;
  return (
    <table className="w-full text-sm">
      <thead className="text-left text-xs text-muted-foreground">
        <tr>
          <th className="px-3 py-2">Deal</th>
          <th className="px-3 py-2 text-right">Trips</th>
          <th className="px-3 py-2 text-right">Miles</th>
          <th className="px-3 py-2 text-right">Cost</th>
          <th className="px-3 py-2 text-right">Reimbursable</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.dealId ?? "none"} className="border-t border-border">
            <td className="px-3 py-2">
              {r.dealId ? (
                <Link to="/deals/$dealId" params={{ dealId: String(r.dealId) }} className="text-primary hover:underline">
                  {r.title}
                </Link>
              ) : (
                <span className="text-muted-foreground">{r.title}</span>
              )}
            </td>
            <td className="px-3 py-2 text-right font-mono tabular-nums">{r.trips}</td>
            <td className="px-3 py-2 text-right font-mono tabular-nums">{r.miles.toFixed(1)}</td>
            <td className="px-3 py-2 text-right font-mono tabular-nums">{usd(r.cost)}</td>
            <td className="px-3 py-2 text-right font-mono tabular-nums">{usd(r.reimbursable)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function VehicleForm({ onSaved }: { onSaved: () => void }) {
  return (
    <form
      className="grid gap-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:grid-cols-6"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        void createVehicle({
          data: {
            name: String(fd.get("name") || "Vehicle"),
            kind: String(fd.get("kind") || "van"),
            plate: String(fd.get("plate") || "") || undefined,
            mpg: Number(fd.get("mpg") || 0) || undefined,
            ratePerMile: Number(fd.get("rate") || 0.7),
            fuel: String(fd.get("fuel") || "diesel") === "gas" ? "gas" : "diesel",
            reimburse: fd.get("reimburse") === "on",
          },
        }).then(() => {
          toast.success("Vehicle added");
          onSaved();
          e.currentTarget.reset();
        });
      }}
    >
      <Input name="name" placeholder="Name" />
      <select name="kind" className="h-9 rounded-md border border-input bg-background px-2 text-sm" defaultValue="box-26">
        <option value="box-26">26ft box</option>
        <option value="trailer-53">53ft trailer</option>
        <option value="van">Cargo van</option>
        <option value="personal">Personal</option>
      </select>
      <Input name="plate" placeholder="Plate" />
      <Input name="mpg" type="number" step="0.1" placeholder="MPG" />
      <Input name="rate" type="number" step="0.01" placeholder="$ / mi" defaultValue="0.70" />
      <Button type="submit" size="sm">
        Add vehicle
      </Button>
      <label className="flex items-center gap-2 text-sm sm:col-span-3">
        <select name="fuel" className="h-9 rounded-md border border-input bg-background px-2 text-sm" defaultValue="diesel">
          <option value="diesel">Diesel</option>
          <option value="gas">Gas</option>
        </select>
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <input type="checkbox" name="reimburse" /> IRS reimburse
        </span>
      </label>
    </form>
  );
}

function VehicleList({ vehicles, onToggle }: { vehicles: Vehicle[]; onToggle: () => void }) {
  return (
    <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
      {vehicles.map((v) => (
        <li key={v.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{v.name}</span>
              <Badge variant="outline">{KIND_LABEL[v.kind] ?? v.kind}</Badge>
              {!v.active && <Badge variant="warn">parked</Badge>}
              {v.reimburse && <Badge variant="steel">IRS</Badge>}
            </div>
            <p className="text-xs text-muted-foreground">
              {v.plate} · {v.mpg ? `${v.mpg} mpg` : "no mpg"} · {usd(v.ratePerMile)}/mi · {v.fuel} @ {usd(FUEL_PRICE[v.fuel])}/gal
            </p>
          </div>
          <Button size="sm" variant="ghost" onClick={() => toggleVehicle({ data: { id: v.id, active: !v.active } }).then(onToggle)}>
            {v.active ? "Park" : "Activate"}
          </Button>
        </li>
      ))}
    </ul>
  );
}

function ExpensePanel({ trips, vehicles }: { trips: MileageTrip[]; vehicles: Vehicle[] }) {
  const byVehicle = vehicles.map((v) => {
    const rows = trips.filter((t) => t.vehicleId === v.id);
    const miles = rows.reduce((n, t) => n + t.miles, 0);
    const cost = rows.reduce((n, t) => n + tripCost(t).total, 0);
    return { v, miles, cost, n: rows.length };
  });
  const byDriver = new Map<string, { miles: number; cost: number }>();
  for (const t of trips) {
    const name = t.driverName ?? "Unassigned";
    const cur = byDriver.get(name) ?? { miles: 0, cost: 0 };
    cur.miles += t.miles;
    cur.cost += tripCost(t).total;
    byDriver.set(name, cur);
  }
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
        <h2 className="text-sm font-medium">By vehicle</h2>
        <ul className="mt-3 space-y-2">
          {byVehicle.map(({ v, miles, cost, n }) => (
            <li key={v.id} className="flex items-center justify-between text-sm">
              <span>
                {v.name}
                <span className="ml-2 text-xs text-muted-foreground">{n} trips</span>
              </span>
              <span className="font-mono tabular-nums">
                {miles.toFixed(1)} mi · {usd(cost)}
              </span>
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
        <h2 className="text-sm font-medium">By driver</h2>
        <ul className="mt-3 space-y-2">
          {[...byDriver.entries()].map(([name, row]) => (
            <li key={name} className="flex items-center justify-between text-sm">
              <span>{name}</span>
              <span className="font-mono tabular-nums">
                {row.miles.toFixed(1)} mi · {usd(row.cost)}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">
          Personal vehicles pay the IRS rate ({usd(0.7)}/mi) plus tolls and parking. Company trucks cost fuel at pump plus tolls — no mileage stipend.
        </p>
      </section>
    </div>
  );
}

function RoutePanel({ places, vehicles, todayIds }: { places: TravelPlace[]; vehicles: Vehicle[]; todayIds: number[] }) {
  const shop = shopOf(places);
  const venues = places.filter((p) => p.kind !== "shop");
  const [picked, setPicked] = useState<number[]>(todayIds);
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id ?? 0);
  useEffect(() => {
    if (todayIds.length) setPicked(todayIds);
  }, [todayIds.join(",")]);
  useEffect(() => {
    if (vehicleId === 0 && vehicles[0]) setVehicleId(vehicles[0].id);
  }, [vehicles, vehicleId]);
  const vehicle = vehicles.find((v) => v.id === vehicleId);
  const kind = speedKind(vehicle?.kind ?? "box-26");

  const stops = useMemo(() => venues.filter((p) => picked.includes(p.id)).map(asStop), [venues, picked]);
  const result = useMemo(() => {
    if (!shop) return null;
    const s = asStop(shop);
    return { naive: naiveLoop(s, stops), best: optimizeLoop(s, stops) };
  }, [shop, stops]);

  const saved = result ? Math.max(0, result.naive.miles - result.best.miles) : 0;

  return (
    <div className="grid gap-4 lg:grid-cols-[18rem_1fr]">
      <aside className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
        <label className="text-xs text-muted-foreground">
          Vehicle
          <select
            className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
            value={vehicleId}
            onChange={(e) => setVehicleId(Number(e.target.value))}
          >
            {vehicles.filter((v) => v.active).map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </label>
        <p className="mt-4 text-[11px] tracking-[0.12em] text-muted-foreground uppercase">Stops today</p>
        <ul className="mt-2 max-h-80 space-y-1 overflow-y-auto scrollbar-thin">
          {venues.map((p) => (
            <li key={p.id}>
              <label className="flex min-h-9 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={picked.includes(p.id)}
                  onChange={() =>
                    setPicked((cur) => (cur.includes(p.id) ? cur.filter((id) => id !== p.id) : [...cur, p.id]))
                  }
                />
                <span className="truncate">{p.name}</span>
                {todayIds.includes(p.id) && <Badge variant="steel">today</Badge>}
              </label>
            </li>
          ))}
        </ul>
      </aside>
      <div className="space-y-4">
        {result && (
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Naive order" value={`${result.naive.miles.toFixed(1)} mi`} hint={`${driveMinutes(result.naive.miles, kind)} min`} />
            <Stat label="Optimized" value={`${result.best.miles.toFixed(1)} mi`} hint={`${driveMinutes(result.best.miles, kind)} min`} />
            <Stat label="Saved" value={`${saved.toFixed(1)} mi`} hint={saved ? `${driveMinutes(saved, kind)} min back` : "Already tight"} />
          </div>
        )}
        {shop && result && <NycMap shop={asStop(shop)} route={result.best} />}
        {result && (
          <ol className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
            {result.best.legs.map((leg, i) => (
              <li key={`${leg.from.id}-${leg.to.id}-${i}`} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                <span className="w-6 font-mono text-xs text-muted-foreground">{i + 1}</span>
                <span className="flex-1">
                  {leg.from.name} → {leg.to.name}
                </span>
                <span className="font-mono tabular-nums">{leg.miles.toFixed(1)} mi</span>
                <span className="w-16 text-right text-xs text-muted-foreground">{driveMinutes(leg.miles, kind)} min</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

function NycMap({ shop, route }: { shop: RouteStop; route: { order: RouteStop[] } }) {
  const minLat = 40.66;
  const maxLat = 40.82;
  const minLng = -74.03;
  const maxLng = -73.93;
  const w = 640;
  const h = 420;
  const xy = (lat: number, lng: number) => ({
    x: ((lng - minLng) / (maxLng - minLng)) * w,
    y: ((maxLat - lat) / (maxLat - minLat)) * h,
  });
  const d = route.order
    .map((p, i) => {
      const { x, y } = xy(p.lat, p.lng);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  const labeled = route.order.filter((p, i) => i === 0 || p.id !== shop.id);

  return (
    <div className="overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full text-foreground" role="img" aria-label="Route map">
        <rect width={w} height={h} className="fill-muted" />
        <text x="24" y="28" className="fill-muted-foreground" fontSize="11" fontFamily="IBM Plex Mono, monospace">
          HUDSON
        </text>
        <text x="520" y="200" className="fill-muted-foreground" fontSize="11" fontFamily="IBM Plex Mono, monospace">
          BKLYN
        </text>
        <path d={d} fill="none" stroke="currentColor" className="text-primary" strokeWidth="2.2" />
        {labeled.map((p, i) => {
          const { x, y } = xy(p.lat, p.lng);
          return (
            <g key={`${p.id}-${i}`} transform={`translate(${x},${y})`}>
              <circle r="9" className="fill-primary" />
              <text textAnchor="middle" y="4" fontSize="10" fontFamily="IBM Plex Mono, monospace" className="fill-primary-foreground">
                {i}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
