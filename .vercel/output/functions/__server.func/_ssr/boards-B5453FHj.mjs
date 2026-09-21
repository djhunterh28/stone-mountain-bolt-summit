import { r as createServerFn } from "./ssr.mjs";
import { d as iso, f as money, t as authMiddleware, u as getSql } from "./utils-DLVA4J7b.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/boards-B5453FHj.js
function hint(token) {
	if (token.length < 10) return token;
	return `${token.slice(0, 8)}…${token.slice(-3)}`;
}
function mintToken() {
	return `nlb_${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 10)}`.slice(0, 22);
}
function nyToday() {
	return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(/* @__PURE__ */ new Date());
}
function nyMinutes() {
	const parts = new Intl.DateTimeFormat("en-GB", {
		timeZone: "America/New_York",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false
	}).formatToParts(/* @__PURE__ */ new Date());
	const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
	const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
	return h * 60 + m;
}
function dateKey(v) {
	const s = iso(v);
	if (!s) return "";
	return s.slice(0, 10);
}
function parseLoad(loadIn) {
	if (!loadIn) return null;
	const match = /^(\d{1,2}):(\d{2})/.exec(loadIn.trim());
	if (!match) return null;
	return Number(match[1]) * 60 + Number(match[2]);
}
function shiftDay(key, days) {
	const [y, mo, d] = key.split("-").map(Number);
	return new Date(Date.UTC(y, mo - 1, d + days)).toISOString().slice(0, 10);
}
function laneFor(eventDate, loadIn) {
	const today = nyToday();
	const yesterday = shiftDay(today, -1);
	const tomorrow = shiftDay(today, 1);
	let dayLabel = "today";
	if (eventDate <= yesterday) dayLabel = "yesterday";
	else if (eventDate >= tomorrow) dayLabel = "tomorrow";
	if (eventDate < today) return {
		lane: "returning",
		dayLabel
	};
	if (eventDate > today) return {
		lane: "going_out",
		dayLabel
	};
	const load = parseLoad(loadIn);
	const now = nyMinutes();
	if (load == null) return {
		lane: now < 720 ? "going_out" : "on_site",
		dayLabel
	};
	if (now < load - 20) return {
		lane: "going_out",
		dayLabel
	};
	if (now > load + 600) return {
		lane: "returning",
		dayLabel
	};
	return {
		lane: "on_site",
		dayLabel
	};
}
function mapBoard(r) {
	const token = String(r.token);
	return {
		id: Number(r.id),
		name: String(r.name),
		location: String(r.location),
		kind: r.kind === "office" ? "office" : "warehouse",
		token,
		tokenHint: hint(token),
		active: Boolean(r.active),
		lastSeen: iso(r.last_seen),
		createdAt: iso(r.created_at) ?? ""
	};
}
var listBoards_createServerFn_handler = createServerRpc({
	id: "2d7e3cf7426e24c3c40abfeca88f81e98cf80670f2f4d83308ee70d0ce2732f0",
	name: "listBoards",
	filename: "src/lib/crm/boards.ts"
}, (opts) => listBoards.__executeServer(opts));
var listBoards = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listBoards_createServerFn_handler, async () => {
	return (await (await getSql())`select * from display_boards order by id`).map(mapBoard);
});
var createBoard_createServerFn_handler = createServerRpc({
	id: "aa9ceb8ba0f696dabafa5dd4a373ddb3a0bd907cd7c46175209575a7791d86c2",
	name: "createBoard",
	filename: "src/lib/crm/boards.ts"
}, (opts) => createBoard.__executeServer(opts));
var createBoard = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createBoard_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const token = mintToken();
	const name = data.name.trim() || "Shop board";
	const location = data.location.trim() || "Warehouse";
	const kind = data.kind === "office" ? "office" : "warehouse";
	return mapBoard((await sql.query(`insert into display_boards (name, location, kind, token) values ($1, $2, $3, $4) returning *`, [
		name,
		location,
		kind,
		token
	]))[0]);
});
var rotateBoard_createServerFn_handler = createServerRpc({
	id: "ae92cbedca0d43ad1dcb0bb971c160a439ffb95b1b1cb0d3fa8bff36d51d1e0a",
	name: "rotateBoard",
	filename: "src/lib/crm/boards.ts"
}, (opts) => rotateBoard.__executeServer(opts));
var rotateBoard = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(rotateBoard_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const token = mintToken();
	const rows = await sql.query(`update display_boards set token = $1, last_seen = null where id = $2 and active = true returning *`, [token, data.id]);
	if (!rows[0]) return null;
	return mapBoard(rows[0]);
});
var revokeBoard_createServerFn_handler = createServerRpc({
	id: "3d2e7d72539bf5f631fd9159eb4e6752b3b416b8358d2ebbc01f6fd4afcd2ccc",
	name: "revokeBoard",
	filename: "src/lib/crm/boards.ts"
}, (opts) => revokeBoard.__executeServer(opts));
var revokeBoard = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(revokeBoard_createServerFn_handler, async ({ data }) => {
	await (await getSql())`update display_boards set active = false where id = ${data.id}`;
	return { ok: true };
});
var getBoardPublic_createServerFn_handler = createServerRpc({
	id: "cc890b99bd9742106809b56754591022242404c753194613f207d0e9a0213b40",
	name: "getBoardPublic",
	filename: "src/lib/crm/boards.ts"
}, (opts) => getBoardPublic.__executeServer(opts));
var getBoardPublic = createServerFn({ method: "GET" }).validator((input) => input).handler(getBoardPublic_createServerFn_handler, async ({ data }) => {
	const token = data.token.trim();
	if (!token) return null;
	const sql = await getSql();
	const boards = await sql.query(`select * from display_boards where token = $1 and active = true`, [token]);
	if (!boards[0]) return null;
	await sql.query(`update display_boards set last_seen = now() where id = $1`, [Number(boards[0].id)]);
	const today = nyToday();
	const from = shiftDay(today, -1);
	const to = shiftDay(today, 1);
	const dealRows = await sql.query(`select d.id, d.title, d.value, d.event_date, d.venue, d.load_in, d.guest_count, d.indoor,
              d.status, d.notes, o.name as org_name, m.name as owner_name, m.initials as owner_initials,
              s.name as stage_name
       from deals d
       left join organizations o on o.id = d.org_id
       left join members m on m.id = d.owner_id
       left join stages s on s.id = d.stage_id
       where d.status <> 'lost'
         and d.event_date is not null
         and d.event_date::date between $1::date and $2::date
       order by d.load_in nulls last, d.event_date, d.id`, [from, to]);
	const ids = dealRows.map((r) => Number(r.id)).filter((n) => Number.isInteger(n));
	const products = ids.length === 0 ? [] : await sql.query(`select dp.deal_id, pr.name, pr.category, dp.qty
             from deal_products dp
             join products pr on pr.id = dp.product_id
             where dp.deal_id in (${ids.join(",")})`);
	const byDeal = /* @__PURE__ */ new Map();
	for (const p of products) {
		const id = Number(p.deal_id);
		const list = byDeal.get(id) ?? [];
		list.push({
			name: String(p.name),
			category: String(p.category),
			qty: money(p.qty)
		});
		byDeal.set(id, list);
	}
	const jobs = dealRows.map((r) => {
		const id = Number(r.id);
		const eventDate = dateKey(r.event_date);
		const loadIn = r.load_in == null ? null : String(r.load_in);
		const { lane, dayLabel } = laneFor(eventDate, loadIn);
		const items = byDeal.get(id) ?? [];
		const labor = items.filter((i) => i.category === "Labor");
		const transport = items.filter((i) => i.category === "Transport");
		const gear = items.filter((i) => i.category !== "Labor" && i.category !== "Transport" && i.category !== "Prep").map((i) => i.qty > 1 ? `${i.name} ×${Math.round(i.qty)}` : i.name).slice(0, 5);
		return {
			id,
			title: String(r.title),
			orgName: r.org_name == null ? null : String(r.org_name),
			venue: r.venue == null ? null : String(r.venue),
			loadIn,
			eventDate,
			guestCount: r.guest_count == null ? null : Number(r.guest_count),
			indoor: r.indoor == null ? null : Boolean(r.indoor),
			status: String(r.status),
			stageName: r.stage_name == null ? null : String(r.stage_name),
			ownerName: r.owner_name == null ? null : String(r.owner_name),
			ownerInitials: r.owner_initials == null ? null : String(r.owner_initials),
			value: money(r.value),
			notes: r.notes == null ? null : String(r.notes),
			lane,
			dayLabel,
			gear,
			crew: labor.reduce((n, i) => n + i.qty, 0),
			trucks: transport.reduce((n, i) => n + i.qty, 0),
			truckLabels: transport.map((i) => i.qty > 1 ? `${Math.round(i.qty)}× ${i.name}` : i.name)
		};
	});
	return {
		board: {
			name: String(boards[0].name),
			location: String(boards[0].location),
			kind: boards[0].kind === "office" ? "office" : "warehouse"
		},
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		jobs
	};
});
//#endregion
export { createBoard_createServerFn_handler, getBoardPublic_createServerFn_handler, listBoards_createServerFn_handler, revokeBoard_createServerFn_handler, rotateBoard_createServerFn_handler };
