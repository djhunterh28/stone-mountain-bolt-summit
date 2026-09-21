import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { iso, money } from "@/lib/utils";
import { authMiddleware } from "@/lib/auth/middleware";
import { roadMiles } from "./geo";

export const FUEL_PRICE = { diesel: 4.18, gas: 3.39 } as const;

export type Vehicle = {
  id: number;
  name: string;
  kind: string;
  plate: string | null;
  mpg: number | null;
  ratePerMile: number;
  fuel: "diesel" | "gas";
  reimburse: boolean;
  active: boolean;
  notes: string | null;
};

export type TravelPlace = {
  id: number;
  name: string;
  kind: string;
  orgId: number | null;
  address: string | null;
  city: string | null;
  lat: number;
  lng: number;
};

export type MileageTrip = {
  id: number;
  traveledOn: string;
  vehicleId: number | null;
  vehicleName: string | null;
  vehicleKind: string | null;
  driverId: number | null;
  driverName: string | null;
  dealId: number | null;
  dealTitle: string | null;
  originId: number;
  originName: string;
  destId: number;
  destName: string;
  miles: number;
  purpose: string | null;
  tolls: number;
  parking: number;
  status: string;
  notes: string | null;
  ratePerMile: number;
  mpg: number | null;
  fuel: "diesel" | "gas";
  reimburse: boolean;
};

export type TravelSummary = {
  miles: number;
  trips: number;
  fleetCost: number;
  reimbursable: number;
  fuel: number;
  tolls: number;
  parking: number;
};

function mapVehicle(r: Record<string, unknown>): Vehicle {
  return {
    id: Number(r.id),
    name: String(r.name),
    kind: String(r.kind),
    plate: r.plate == null ? null : String(r.plate),
    mpg: r.mpg == null ? null : money(r.mpg),
    ratePerMile: money(r.rate_per_mile),
    fuel: r.fuel === "gas" ? "gas" : "diesel",
    reimburse: Boolean(r.reimburse),
    active: Boolean(r.active),
    notes: r.notes == null ? null : String(r.notes),
  };
}

function mapPlace(r: Record<string, unknown>): TravelPlace {
  return {
    id: Number(r.id),
    name: String(r.name),
    kind: String(r.kind),
    orgId: r.org_id == null ? null : Number(r.org_id),
    address: r.address == null ? null : String(r.address),
    city: r.city == null ? null : String(r.city),
    lat: Number(r.lat),
    lng: Number(r.lng),
  };
}

function mapTrip(r: Record<string, unknown>): MileageTrip {
  return {
    id: Number(r.id),
    traveledOn: iso(r.traveled_on)?.slice(0, 10) ?? String(r.traveled_on).slice(0, 10),
    vehicleId: r.vehicle_id == null ? null : Number(r.vehicle_id),
    vehicleName: r.vehicle_name == null ? null : String(r.vehicle_name),
    vehicleKind: r.vehicle_kind == null ? null : String(r.vehicle_kind),
    driverId: r.driver_id == null ? null : Number(r.driver_id),
    driverName: r.driver_name == null ? null : String(r.driver_name),
    dealId: r.deal_id == null ? null : Number(r.deal_id),
    dealTitle: r.deal_title == null ? null : String(r.deal_title),
    originId: Number(r.origin_id),
    originName: String(r.origin_name),
    destId: Number(r.dest_id),
    destName: String(r.dest_name),
    miles: money(r.miles),
    purpose: r.purpose == null ? null : String(r.purpose),
    tolls: money(r.tolls),
    parking: money(r.parking),
    status: String(r.status),
    notes: r.notes == null ? null : String(r.notes),
    ratePerMile: money(r.rate_per_mile ?? 0.7),
    mpg: r.mpg == null ? null : money(r.mpg),
    fuel: r.fuel === "gas" ? "gas" : "diesel",
    reimburse: Boolean(r.reimburse),
  };
}

export function tripCost(t: Pick<MileageTrip, "miles" | "ratePerMile" | "mpg" | "fuel" | "reimburse" | "tolls" | "parking">) {
  const fuelPrice = t.fuel === "gas" ? FUEL_PRICE.gas : FUEL_PRICE.diesel;
  const fuel = t.mpg && t.mpg > 0 ? (t.miles / t.mpg) * fuelPrice : 0;
  const mileage = t.miles * t.ratePerMile;
  const reimbursable = t.reimburse ? mileage + t.tolls + t.parking : 0;
  const fleet = t.reimburse ? 0 : fuel + t.tolls + t.parking;
  return { fuel, mileage, reimbursable, fleet, total: reimbursable + fleet };
}

const TRIP_SQL = `select t.*, v.name as vehicle_name, v.kind as vehicle_kind, v.mpg, v.rate_per_mile, v.fuel, v.reimburse,
  m.name as driver_name, o.name as origin_name, d.name as dest_name, deal.title as deal_title
  from mileage_trips t
  left join vehicles v on v.id = t.vehicle_id
  left join members m on m.id = t.driver_id
  join travel_places o on o.id = t.origin_id
  join travel_places d on d.id = t.dest_id
  left join deals deal on deal.id = t.deal_id`;

export const getTravelDesk = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const vehicles = (await sql`select * from vehicles order by id`).map(mapVehicle);
    const places = (await sql`select * from travel_places order by kind desc, name`).map(mapPlace);
    const trips = (await sql.query(`${TRIP_SQL} order by t.traveled_on desc, t.id desc`)).map(mapTrip);
    const todayStops = await sql.query(
      `select distinct p.id, p.name, p.lat, p.lng, d.title as deal_title, d.load_in
       from deals d
       join travel_places p on (p.org_id = d.org_id or p.name = d.venue)
       where d.status not in ('lost', 'cancelled') and d.event_date = current_date
       order by d.load_in nulls last`,
    );
    return {
      vehicles,
      places,
      trips,
      todayStops: todayStops.map((r) => ({
        id: Number(r.id),
        name: String(r.name),
        lat: Number(r.lat),
        lng: Number(r.lng),
        dealTitle: r.deal_title == null ? null : String(r.deal_title),
        loadIn: r.load_in == null ? null : String(r.load_in),
      })),
    };
  });

export const createTrip = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      traveledOn: string;
      vehicleId: number;
      driverId: number;
      originId: number;
      destId: number;
      purpose?: string;
      tolls?: number;
      parking?: number;
      milesOverride?: number;
      dealId?: number;
    }) => input,
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const originRows = await sql`select * from travel_places where id = ${data.originId}`;
    const destRows = await sql`select * from travel_places where id = ${data.destId}`;
    const origin = originRows[0];
    const dest = destRows[0];
    if (!origin || !dest) return { ok: false as const, error: "Unknown place" };
    const auto = roadMiles(
      { lat: Number(origin.lat), lng: Number(origin.lng) },
      { lat: Number(dest.lat), lng: Number(dest.lng) },
    );
    const miles = data.milesOverride && data.milesOverride > 0 ? data.milesOverride : auto;
    await sql.query(
      `insert into mileage_trips (traveled_on, vehicle_id, driver_id, deal_id, origin_id, dest_id, miles, purpose, tolls, parking)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        data.traveledOn,
        data.vehicleId,
        data.driverId,
        data.dealId ?? null,
        data.originId,
        data.destId,
        miles,
        data.purpose ?? null,
        data.tolls ?? 0,
        data.parking ?? 0,
      ],
    );
    return { ok: true as const, miles };
  });

export const getDealTravel = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { dealId: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const vehicles = (await sql`select * from vehicles where active = true order by id`).map(mapVehicle);
    const places = (await sql`select * from travel_places order by kind desc, name`).map(mapPlace);
    const trips = (await sql.query(`${TRIP_SQL} where t.deal_id = $1 order by t.traveled_on desc, t.id desc`, [data.dealId])).map(mapTrip);
    const deal = (await sql.query(`select id, title, venue from deals where id = $1`, [data.dealId]))[0];
    const venueName = deal?.venue ? String(deal.venue) : null;
    const dest = venueName ? places.find((p) => p.name === venueName) ?? null : null;
    return {
      vehicles,
      places,
      trips,
      venueName,
      destId: dest?.id ?? null,
      dealTitle: deal ? String(deal.title) : null,
    };
  });

export const setTripStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; status: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql.query(`update mileage_trips set status = $1 where id = $2`, [data.status, data.id]);
    return { ok: true };
  });

export const createVehicle = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      name: string;
      kind: string;
      plate?: string;
      mpg?: number;
      ratePerMile?: number;
      fuel?: "diesel" | "gas";
      reimburse?: boolean;
    }) => input,
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql.query(
      `insert into vehicles (name, kind, plate, mpg, rate_per_mile, fuel, reimburse)
       values ($1,$2,$3,$4,$5,$6,$7)`,
      [
        data.name.trim() || "Vehicle",
        data.kind,
        data.plate ?? null,
        data.mpg ?? null,
        data.ratePerMile ?? 0.7,
        data.fuel === "gas" ? "gas" : "diesel",
        Boolean(data.reimburse),
      ],
    );
    return { ok: true };
  });

export const toggleVehicle = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; active: boolean }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql.query(`update vehicles set active = $1 where id = $2`, [data.active, data.id]);
    return { ok: true };
  });
