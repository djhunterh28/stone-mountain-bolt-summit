import { r as createServerFn } from "./ssr.mjs";
import { d as iso, f as money, t as authMiddleware, u as getSql } from "./utils-DLVA4J7b.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { i as roadMiles } from "./geo-D62gvrqT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/travel-C7JH-Is-.js
function mapVehicle(r) {
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
		notes: r.notes == null ? null : String(r.notes)
	};
}
function mapPlace(r) {
	return {
		id: Number(r.id),
		name: String(r.name),
		kind: String(r.kind),
		orgId: r.org_id == null ? null : Number(r.org_id),
		address: r.address == null ? null : String(r.address),
		city: r.city == null ? null : String(r.city),
		lat: Number(r.lat),
		lng: Number(r.lng)
	};
}
function mapTrip(r) {
	return {
		id: Number(r.id),
		traveledOn: iso(r.traveled_on)?.slice(0, 10) ?? String(r.traveled_on).slice(0, 10),
		vehicleId: r.vehicle_id == null ? null : Number(r.vehicle_id),
		vehicleName: r.vehicle_name == null ? null : String(r.vehicle_name),
		vehicleKind: r.vehicle_kind == null ? null : String(r.vehicle_kind),
		driverId: r.driver_id == null ? null : Number(r.driver_id),
		driverName: r.driver_name == null ? null : String(r.driver_name),
		dealId: r.deal_id == null ? null : Number(r.deal_id),
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
		ratePerMile: money(r.rate_per_mile ?? .7),
		mpg: r.mpg == null ? null : money(r.mpg),
		fuel: r.fuel === "gas" ? "gas" : "diesel",
		reimburse: Boolean(r.reimburse)
	};
}
var TRIP_SQL = `select t.*, v.name as vehicle_name, v.kind as vehicle_kind, v.mpg, v.rate_per_mile, v.fuel, v.reimburse,
  m.name as driver_name, o.name as origin_name, d.name as dest_name
  from mileage_trips t
  left join vehicles v on v.id = t.vehicle_id
  left join members m on m.id = t.driver_id
  join travel_places o on o.id = t.origin_id
  join travel_places d on d.id = t.dest_id`;
var getTravelDesk_createServerFn_handler = createServerRpc({
	id: "2f4a335e5c6b6cbaed1b604d1ca2844834122c26f6bdc9bc7aee585b17b7a929",
	name: "getTravelDesk",
	filename: "src/lib/crm/travel.ts"
}, (opts) => getTravelDesk.__executeServer(opts));
var getTravelDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getTravelDesk_createServerFn_handler, async () => {
	const sql = await getSql();
	return {
		vehicles: (await sql`select * from vehicles order by id`).map(mapVehicle),
		places: (await sql`select * from travel_places order by kind desc, name`).map(mapPlace),
		trips: (await sql.query(`${TRIP_SQL} order by t.traveled_on desc, t.id desc`)).map(mapTrip),
		todayStops: (await sql.query(`select distinct p.id, p.name, p.lat, p.lng, d.title as deal_title, d.load_in
       from deals d
       join travel_places p on (p.org_id = d.org_id or p.name = d.venue)
       where d.status <> 'lost' and d.event_date = current_date
       order by d.load_in nulls last`)).map((r) => ({
			id: Number(r.id),
			name: String(r.name),
			lat: Number(r.lat),
			lng: Number(r.lng),
			dealTitle: r.deal_title == null ? null : String(r.deal_title),
			loadIn: r.load_in == null ? null : String(r.load_in)
		}))
	};
});
var createTrip_createServerFn_handler = createServerRpc({
	id: "5de130c8193838a41768f7f086f052e9cf5028c048aff8089c96deddf8bae7b8",
	name: "createTrip",
	filename: "src/lib/crm/travel.ts"
}, (opts) => createTrip.__executeServer(opts));
var createTrip = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createTrip_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const originRows = await sql`select * from travel_places where id = ${data.originId}`;
	const destRows = await sql`select * from travel_places where id = ${data.destId}`;
	const origin = originRows[0];
	const dest = destRows[0];
	if (!origin || !dest) return {
		ok: false,
		error: "Unknown place"
	};
	const auto = roadMiles({
		lat: Number(origin.lat),
		lng: Number(origin.lng)
	}, {
		lat: Number(dest.lat),
		lng: Number(dest.lng)
	});
	const miles = data.milesOverride && data.milesOverride > 0 ? data.milesOverride : auto;
	await sql.query(`insert into mileage_trips (traveled_on, vehicle_id, driver_id, deal_id, origin_id, dest_id, miles, purpose, tolls, parking)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`, [
		data.traveledOn,
		data.vehicleId,
		data.driverId,
		data.dealId ?? null,
		data.originId,
		data.destId,
		miles,
		data.purpose ?? null,
		data.tolls ?? 0,
		data.parking ?? 0
	]);
	return {
		ok: true,
		miles
	};
});
var setTripStatus_createServerFn_handler = createServerRpc({
	id: "99add479dfaece64d15db7c5fdc0ddcbd289f7e833583ac32531a7af8f3e486e",
	name: "setTripStatus",
	filename: "src/lib/crm/travel.ts"
}, (opts) => setTripStatus.__executeServer(opts));
var setTripStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(setTripStatus_createServerFn_handler, async ({ data }) => {
	await (await getSql()).query(`update mileage_trips set status = $1 where id = $2`, [data.status, data.id]);
	return { ok: true };
});
var createVehicle_createServerFn_handler = createServerRpc({
	id: "eddd8773a598e820277314b06afa61d4b04a3647410b59b0f87d8db5d1b586df",
	name: "createVehicle",
	filename: "src/lib/crm/travel.ts"
}, (opts) => createVehicle.__executeServer(opts));
var createVehicle = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createVehicle_createServerFn_handler, async ({ data }) => {
	await (await getSql()).query(`insert into vehicles (name, kind, plate, mpg, rate_per_mile, fuel, reimburse)
       values ($1,$2,$3,$4,$5,$6,$7)`, [
		data.name.trim() || "Vehicle",
		data.kind,
		data.plate ?? null,
		data.mpg ?? null,
		data.ratePerMile ?? .7,
		data.fuel === "gas" ? "gas" : "diesel",
		Boolean(data.reimburse)
	]);
	return { ok: true };
});
var toggleVehicle_createServerFn_handler = createServerRpc({
	id: "7982d811786273fa70d98965c24bc481af202659131a6b161f57f0532bd814f6",
	name: "toggleVehicle",
	filename: "src/lib/crm/travel.ts"
}, (opts) => toggleVehicle.__executeServer(opts));
var toggleVehicle = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(toggleVehicle_createServerFn_handler, async ({ data }) => {
	await (await getSql()).query(`update vehicles set active = $1 where id = $2`, [data.active, data.id]);
	return { ok: true };
});
//#endregion
export { createTrip_createServerFn_handler, createVehicle_createServerFn_handler, getTravelDesk_createServerFn_handler, setTripStatus_createServerFn_handler, toggleVehicle_createServerFn_handler };
