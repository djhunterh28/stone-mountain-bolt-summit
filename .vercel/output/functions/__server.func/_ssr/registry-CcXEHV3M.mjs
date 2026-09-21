import { l as getSql, u as iso } from "./utils-BjcRTCQS.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CZC9dlvp.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/registry-CcXEHV3M.js
var BORO = {
	Manhattan: [40.758, -73.9855],
	Brooklyn: [40.6782, -73.9442],
	Queens: [40.7282, -73.7949],
	Bronx: [40.8448, -73.8648],
	"Jersey City": [40.7178, -74.0431],
	"New York": [40.7128, -74.006]
};
function mapClient(r) {
	return {
		id: Number(r.id),
		name: String(r.name),
		email: r.email == null ? null : String(r.email),
		phone: r.phone == null ? null : String(r.phone),
		mobile: r.mobile == null ? null : String(r.mobile),
		title: r.title == null ? null : String(r.title),
		org: r.org_name == null ? null : String(r.org_name),
		orgId: r.org_id == null ? null : Number(r.org_id),
		city: r.city == null ? null : String(r.city),
		address: r.address == null ? null : String(r.address),
		lat: r.lat == null ? null : Number(r.lat),
		lng: r.lng == null ? null : Number(r.lng),
		geocodedAt: iso(r.geocoded_at),
		mail: r.mail == null ? true : Boolean(r.mail),
		sms: r.sms == null ? true : Boolean(r.sms),
		postal: r.postal == null ? false : Boolean(r.postal),
		shows: Number(r.shows ?? 0),
		lastTouch: iso(r.last_touch)
	};
}
var getRegistryDesk_createServerFn_handler = createServerRpc({
	id: "ce908b95d660187b423d9c2d3468bd7083e29cb9e2923a15ed369678caf8229e",
	name: "getRegistryDesk",
	filename: "src/lib/crm/registry.ts"
}, (opts) => getRegistryDesk.__executeServer(opts));
var getRegistryDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getRegistryDesk_createServerFn_handler, async () => {
	const clients = (await (await getSql()).query(`select p.*, o.name as org_name, c.mail, c.sms, c.postal,
                (select count(*)::int from deals d where d.person_id = p.id) as shows,
                (select max(d.updated_at) from deals d where d.person_id = p.id) as last_touch
         from people p
         left join organizations o on o.id = p.org_id
         left join comm_prefs c on c.person_id = p.id
         order by p.name`)).map(mapClient);
	const geocoded = clients.filter((c) => c.lat != null && c.lng != null).length;
	const mailOff = clients.filter((c) => !c.mail).length;
	const smsOff = clients.filter((c) => !c.sms).length;
	return {
		clients,
		stats: {
			n: clients.length,
			geocoded,
			mailOff,
			smsOff,
			withAddress: clients.filter((c) => c.address).length
		}
	};
});
var savePerson_createServerFn_handler = createServerRpc({
	id: "d205aea8d22b473e1e46c8d82795b77e9e8a1de364011be3833f351f67c509b0",
	name: "savePerson",
	filename: "src/lib/crm/registry.ts"
}, (opts) => savePerson.__executeServer(opts));
var savePerson = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(savePerson_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const cur = (await sql.query(`select * from people where id = $1`, [data.id]))[0];
	if (!cur) return { ok: false };
	await sql.query(`update people set name = $2, email = $3, phone = $4, mobile = $5, title = $6, city = $7, address = $8 where id = $1`, [
		data.id,
		data.name?.trim() || String(cur.name),
		data.email === void 0 ? cur.email : data.email,
		data.phone === void 0 ? cur.phone : data.phone,
		data.mobile === void 0 ? cur.mobile : data.mobile,
		data.title === void 0 ? cur.title : data.title,
		data.city === void 0 ? cur.city : data.city,
		data.address === void 0 ? cur.address : data.address
	]);
	return { ok: true };
});
var geocodePerson_createServerFn_handler = createServerRpc({
	id: "4d894afcaf762f462c5ed9bd40a7e3ff2f8cfc2dbfaa1e4d46e1e2bc73f9b409",
	name: "geocodePerson",
	filename: "src/lib/crm/registry.ts"
}, (opts) => geocodePerson.__executeServer(opts));
var geocodePerson = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(geocodePerson_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const p = (await sql.query(`select * from people where id = $1`, [data.id]))[0];
	if (!p) return {
		ok: false,
		error: "Unknown client",
		lat: null,
		lng: null,
		label: null
	};
	const q = (data.q ?? [
		p.address,
		p.city,
		p.name
	].filter(Boolean).join(" ")).trim();
	const hit = (await sql.query(`select * from places
         where name ilike $1 or address ilike $1 or city ilike $1
         order by rating desc nulls last limit 1`, [`%${q.split(" ")[0] ?? q}%`]))[0];
	let lat = hit?.lat == null ? null : Number(hit.lat);
	let lng = hit?.lng == null ? null : Number(hit.lng);
	let label = hit ? String(hit.address ?? hit.name) : null;
	if (lat == null || lng == null) {
		const city = String(p.city ?? "New York");
		const pin = BORO[city] ?? BORO["New York"];
		lat = pin[0];
		lng = pin[1];
		label = p.address ? `${p.address}, ${city}` : city;
	}
	await sql.query(`update people set lat = $2, lng = $3, geocoded_at = now(), address = coalesce(address, $4) where id = $1`, [
		data.id,
		lat,
		lng,
		label
	]);
	return {
		ok: true,
		error: null,
		lat,
		lng,
		label
	};
});
var getClientHistory_createServerFn_handler = createServerRpc({
	id: "00e14d6e738a4c55e0d24a4b7edabb61157c561319f03a4b46f02f5c50736305",
	name: "getClientHistory",
	filename: "src/lib/crm/registry.ts"
}, (opts) => getClientHistory.__executeServer(opts));
var getClientHistory = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(getClientHistory_createServerFn_handler, async ({ data }) => {
	return (await (await getSql()).query(`select kind, title, detail, at from (
         select 'deal' as kind, title as title, coalesce(status,'') || coalesce(' · ' || venue, '') as detail, updated_at as at
           from deals where person_id = $1
         union all
         select 'activity', subject, type, coalesce(due_at, created_at)
           from activities where person_id = $1
         union all
         select 'email', subject, folder, coalesce(sent_at, created_at)
           from emails where person_id = $1
         union all
         select 'sms', left(body, 90), coalesce(direction, 'out'), created_at
           from sms_messages where person_id = $1
         union all
         select 'review', coalesce(left(body, 90), 'Review request'), status, coalesce(submitted_at, requested_at, published_at)
           from reviews where person_id = $1
       ) x
       where at is not null
       order by at desc
       limit 40`, [data.id])).map((r) => ({
		kind: String(r.kind),
		title: String(r.title),
		detail: r.detail == null ? null : String(r.detail),
		at: iso(r.at) ?? ""
	}));
});
//#endregion
export { geocodePerson_createServerFn_handler, getClientHistory_createServerFn_handler, getRegistryDesk_createServerFn_handler, savePerson_createServerFn_handler };
