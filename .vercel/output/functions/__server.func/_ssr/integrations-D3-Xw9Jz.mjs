import { l as getSql, u as iso } from "./utils-BjcRTCQS.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CZC9dlvp.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/integrations-D3-Xw9Jz.js
function parseTypes(raw) {
	if (Array.isArray(raw)) return raw.map(String);
	if (typeof raw === "string") try {
		const v = JSON.parse(raw);
		return Array.isArray(v) ? v.map(String) : [raw];
	} catch {
		return [raw];
	}
	return [];
}
function mapPlace(r) {
	return {
		placeId: String(r.place_id),
		name: String(r.name),
		address: r.address == null ? null : String(r.address),
		city: r.city == null ? null : String(r.city),
		lat: r.lat == null ? null : Number(r.lat),
		lng: r.lng == null ? null : Number(r.lng),
		types: parseTypes(r.types),
		rating: r.rating == null ? null : Number(r.rating),
		ratingsCount: r.ratings_count == null ? null : Number(r.ratings_count),
		phone: r.phone == null ? null : String(r.phone),
		website: r.website == null ? null : String(r.website),
		hours: r.hours == null ? null : String(r.hours),
		mapsUrl: r.maps_url == null ? null : String(r.maps_url)
	};
}
var listIntegrationStatus_createServerFn_handler = createServerRpc({
	id: "bdca3df12a79a77c25c5a7aefe62c84a1a2bb707d24d0a4e6aa077a5c5ec2bc1",
	name: "listIntegrationStatus",
	filename: "src/lib/crm/integrations.ts"
}, (opts) => listIntegrationStatus.__executeServer(opts));
var listIntegrationStatus = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listIntegrationStatus_createServerFn_handler, async () => {
	const sql = await getSql();
	const rows = await sql`select * from integration_status order by provider`;
	const tracks = Number((await sql`select count(*)::int as n from show_tracks`)[0]?.n ?? 0);
	const places = Number((await sql`select count(*)::int as n from places`)[0]?.n ?? 0);
	return {
		rows: rows.map((r) => ({
			provider: String(r.provider),
			connected: Boolean(r.connected),
			detail: r.detail == null ? null : String(r.detail),
			lastOk: iso(r.last_ok)
		})),
		tracks,
		places
	};
});
var searchPlaces_createServerFn_handler = createServerRpc({
	id: "084cac8da7a1ed0fd166b05f774764751144bd93d04bfb0b1d6082076d065d1a",
	name: "searchPlaces",
	filename: "src/lib/crm/integrations.ts"
}, (opts) => searchPlaces.__executeServer(opts));
var searchPlaces = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(searchPlaces_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const q = `%${data.q.trim()}%`;
	if (data.q.trim().length < 2) return (await sql`select * from places order by rating desc nulls last limit 8`).map(mapPlace);
	const rows = await sql.query(`select * from places
       where name ilike $1 or address ilike $1 or city ilike $1 or types ilike $1
       order by rating desc nulls last limit 12`, [q]);
	await sql.query(`update integration_status set last_ok = now() where provider = 'google_places'`);
	return rows.map(mapPlace);
});
var pinPlaceToDeal_createServerFn_handler = createServerRpc({
	id: "e3e8c21c0891ef5969580037e1936c38029f1cc30b47319e6372d5d28b8b837a",
	name: "pinPlaceToDeal",
	filename: "src/lib/crm/integrations.ts"
}, (opts) => pinPlaceToDeal.__executeServer(opts));
var pinPlaceToDeal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(pinPlaceToDeal_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const place = (await sql.query(`select * from places where place_id = $1`, [data.placeId]))[0];
	if (!place) return {
		ok: false,
		error: "Place not found"
	};
	const venue = String(place.name);
	const address = place.address == null ? null : String(place.address);
	const city = place.city == null ? null : String(place.city);
	const lat = place.lat == null ? null : Number(place.lat);
	const lng = place.lng == null ? null : Number(place.lng);
	await sql.query(`update deals set venue = $1, updated_at = now() where id = $2`, [venue, data.dealId]);
	if (lat != null && lng != null) {
		if (!(await sql.query(`select id from travel_places where name = $1`, [venue]))[0]) await sql.query(`insert into travel_places (name, kind, address, city, lat, lng) values ($1,'venue',$2,$3,$4,$5)`, [
			venue,
			address,
			city,
			lat,
			lng
		]);
	}
	return {
		ok: true,
		venue
	};
});
var FALLBACK_TRACKS = [{
	deezerId: "3135556",
	title: "Get Lucky",
	artist: "Daft Punk",
	album: "Random Access Memories",
	durationSec: 369,
	previewUrl: null,
	coverUrl: null,
	link: "https://www.deezer.com/track/3135556"
}, {
	deezerId: "1109731",
	title: "Midnight City",
	artist: "M83",
	album: "Hurry Up, We're Dreaming",
	durationSec: 244,
	previewUrl: null,
	coverUrl: null,
	link: "https://www.deezer.com/track/1109731"
}];
var searchDeezer_createServerFn_handler = createServerRpc({
	id: "366c57187fbc4ad92697c1b2e7718b912796bb54b2dd2adaa428930715e1b10b",
	name: "searchDeezer",
	filename: "src/lib/crm/integrations.ts"
}, (opts) => searchDeezer.__executeServer(opts));
var searchDeezer = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(searchDeezer_createServerFn_handler, async ({ data }) => {
	const q = data.q.trim();
	if (q.length < 2) return [];
	try {
		const res = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(q)}&limit=12`, { signal: AbortSignal.timeout(7e3) });
		if (!res.ok) return FALLBACK_TRACKS.filter((t) => t.title.toLowerCase().includes(q.toLowerCase()));
		const json = await res.json();
		await (await getSql()).query(`update integration_status set last_ok = now() where provider = 'deezer'`);
		return (json.data ?? []).map((t) => ({
			deezerId: String(t.id),
			title: t.title,
			artist: t.artist?.name ?? "Unknown",
			album: t.album?.title ?? null,
			durationSec: Number(t.duration ?? 0),
			previewUrl: t.preview || null,
			coverUrl: t.album?.cover_medium ?? (t.md5_image ? `https://e-cdns-images.dzcdn.net/images/cover/${t.md5_image}/250x250.jpg` : null),
			link: t.link || null
		}));
	} catch {
		return FALLBACK_TRACKS;
	}
});
var pinTrack_createServerFn_handler = createServerRpc({
	id: "a6aec907146359a93d29875d957b1aeb2713877b07e15c4cd77e24270b8152e8",
	name: "pinTrack",
	filename: "src/lib/crm/integrations.ts"
}, (opts) => pinTrack.__executeServer(opts));
var pinTrack = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(pinTrack_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const t = data.track;
	await sql.query(`insert into show_tracks (deal_id, deezer_id, title, artist, album, duration_sec, preview_url, cover_url, link, role)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`, [
		data.dealId,
		t.deezerId,
		t.title,
		t.artist,
		t.album,
		t.durationSec,
		t.previewUrl,
		t.coverUrl,
		t.link,
		data.role
	]);
	return { ok: true };
});
var listShowTracks_createServerFn_handler = createServerRpc({
	id: "35e88dcf75a282c33b8c8f8ca7903c13907766db8c4bd2d89af307f1e1bafeba",
	name: "listShowTracks",
	filename: "src/lib/crm/integrations.ts"
}, (opts) => listShowTracks.__executeServer(opts));
var listShowTracks = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listShowTracks_createServerFn_handler, async () => {
	return (await (await getSql()).query(`select t.*, d.title as deal_title from show_tracks t left join deals d on d.id = t.deal_id order by t.id desc limit 40`)).map((r) => ({
		id: Number(r.id),
		dealId: r.deal_id == null ? null : Number(r.deal_id),
		dealTitle: r.deal_title == null ? null : String(r.deal_title),
		title: String(r.title),
		artist: String(r.artist),
		album: r.album == null ? null : String(r.album),
		durationSec: r.duration_sec == null ? null : Number(r.duration_sec),
		previewUrl: r.preview_url == null ? null : String(r.preview_url),
		coverUrl: r.cover_url == null ? null : String(r.cover_url),
		link: r.link == null ? null : String(r.link),
		role: String(r.role)
	}));
});
var createDealZoom_createServerFn_handler = createServerRpc({
	id: "79a53b5e765b82ee27873159cd5dd8b1fe374bc7b18f3956fd9ab4446ae9ee08",
	name: "createDealZoom",
	filename: "src/lib/crm/integrations.ts"
}, (opts) => createDealZoom.__executeServer(opts));
var createDealZoom = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createDealZoom_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const deal = (await sql.query(`select id, title, owner_id from deals where id = $1`, [data.dealId]))[0];
	if (!deal) return {
		ok: false,
		error: "Deal not found"
	};
	let n = 0;
	const seed = `deal:${data.dealId}:${Date.now()}`;
	for (let i = 0; i < seed.length; i++) n = n * 33 + seed.charCodeAt(i) >>> 0;
	const id = String(8e10 + n % 19999999999);
	const pass = (n.toString(36) + "nlzoom").slice(0, 6).toUpperCase();
	const join = `https://northline.zoom.us/j/${id}?pwd=${pass.toLowerCase()}`;
	await sql.query(`insert into activities (type, subject, owner_id, deal_id, duration_min, notes, due_at)
       values ('meeting', $1, $2, $3, 30, $4, now() + interval '1 day')`, [
		`Zoom — ${String(deal.title)}`,
		deal.owner_id == null ? 1 : Number(deal.owner_id),
		data.dealId,
		`Join ${join} · passcode ${pass}`
	]);
	await sql.query(`update integration_status set last_ok = now() where provider = 'zoom'`);
	return {
		ok: true,
		join,
		pass
	};
});
//#endregion
export { createDealZoom_createServerFn_handler, listIntegrationStatus_createServerFn_handler, listShowTracks_createServerFn_handler, pinPlaceToDeal_createServerFn_handler, pinTrack_createServerFn_handler, searchDeezer_createServerFn_handler, searchPlaces_createServerFn_handler };
