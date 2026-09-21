import { d as money, l as getSql, u as iso } from "./utils-BjcRTCQS.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CZC9dlvp.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/handoff-BcaolvDH.js
function parseJson(raw, fallback) {
	if (raw == null) return fallback;
	if (typeof raw !== "string") return raw ?? fallback;
	try {
		return JSON.parse(raw);
	} catch {
		return fallback;
	}
}
function mintToken() {
	return `nlh_${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 6)}`;
}
function emptyPack() {
	return {
		title: "Recalled",
		venue: null,
		eventDate: null,
		loadIn: null,
		indoor: null,
		guestCount: null,
		notes: null,
		org: null,
		person: null,
		crew: [],
		files: [],
		notesList: [],
		gear: [],
		findings: [],
		guests: [],
		floor: null
	};
}
function asPack(raw) {
	if (!raw || typeof raw !== "object") return null;
	const snap = raw;
	if (!snap.title) return null;
	return {
		title: String(snap.title),
		venue: snap.venue == null ? null : String(snap.venue),
		eventDate: snap.eventDate == null ? null : String(snap.eventDate),
		loadIn: snap.loadIn == null ? null : String(snap.loadIn),
		indoor: snap.indoor == null ? null : Boolean(snap.indoor),
		guestCount: snap.guestCount == null ? null : Number(snap.guestCount),
		notes: snap.notes == null ? null : String(snap.notes),
		org: snap.org ?? null,
		person: snap.person ?? null,
		crew: Array.isArray(snap.crew) ? snap.crew : [],
		files: Array.isArray(snap.files) ? snap.files : [],
		notesList: Array.isArray(snap.notesList) ? snap.notesList : [],
		gear: Array.isArray(snap.gear) ? snap.gear : [],
		findings: Array.isArray(snap.findings) ? snap.findings : [],
		guests: Array.isArray(snap.guests) ? snap.guests : [],
		floor: snap.floor ?? null
	};
}
async function packDeal(sql, dealId) {
	const d = (await sql.query(`select d.title, d.venue, d.event_date, d.load_in, d.indoor, d.guest_count, d.notes, d.value,
              o.name as org, o.address, o.city, o.phone as org_phone,
              p.name as person, p.title as person_title, p.phone as person_phone, p.email as person_email
         from deals d
         left join organizations o on o.id = d.org_id
         left join people p on p.id = d.person_id
        where d.id = $1`, [dealId]))[0];
	if (!d) return null;
	const crew = await sql.query(`select m.name, s.role, s.kind, s.starts_at, s.ends_at
       from crew_shifts s join members m on m.id = s.member_id
      where s.deal_id = $1 order by s.starts_at`, [dealId]);
	const files = await sql.query(`select name, kind from files where entity_type = 'deal' and entity_id = $1 order by id`, [dealId]);
	const notes = await sql.query(`select category, body from event_notes where deal_id = $1 order by pinned desc, id`, [dealId]);
	const gear = await sql.query(`select p.name, p.category, dp.qty
       from deal_products dp join products p on p.id = dp.product_id
      where dp.deal_id = $1
      order by p.category, p.name`, [dealId]);
	const findings = await sql.query(`select kind, severity, detail from prep_findings
      where deal_id = $1 and coalesce(dismissed, false) is not true order by id`, [dealId]);
	const guests = await sql.query(`select name, party, rsvp, meal from guests where deal_id = $1 order by id`, [dealId]);
	const floorRow = d.venue ? (await sql.query(`select name, venue, notes, marks from floor_plans
            where venue = $1 and coalesce(archived, false) is not true order by id limit 1`, [String(d.venue)]))[0] : void 0;
	const inv = (await sql.query(`select count(*) as n, coalesce(sum(amount), 0) as total from invoices where deal_id = $1`, [dealId]))[0];
	const floorMarks = parseJson(floorRow?.marks, []);
	return {
		pack: {
			title: String(d.title),
			venue: d.venue == null ? null : String(d.venue),
			eventDate: iso(d.event_date)?.slice(0, 10) ?? null,
			loadIn: d.load_in == null ? null : String(d.load_in),
			indoor: d.indoor == null ? null : Boolean(d.indoor),
			guestCount: d.guest_count == null ? null : Number(d.guest_count),
			notes: d.notes == null ? null : String(d.notes),
			org: d.org ? {
				name: String(d.org),
				address: d.address == null ? null : String(d.address),
				city: d.city == null ? null : String(d.city),
				phone: d.org_phone == null ? null : String(d.org_phone)
			} : null,
			person: d.person ? {
				name: String(d.person),
				title: d.person_title == null ? null : String(d.person_title),
				phone: d.person_phone == null ? null : String(d.person_phone),
				email: d.person_email == null ? null : String(d.person_email)
			} : null,
			crew: crew.map((c) => ({
				name: String(c.name),
				role: String(c.role),
				kind: String(c.kind),
				startsAt: iso(c.starts_at),
				endsAt: iso(c.ends_at)
			})),
			files: files.map((f) => ({
				name: String(f.name),
				kind: String(f.kind)
			})),
			notesList: notes.map((n) => ({
				category: String(n.category),
				body: String(n.body)
			})),
			gear: gear.map((g) => ({
				name: String(g.name),
				qty: Number(g.qty),
				category: String(g.category)
			})),
			findings: findings.map((f) => ({
				kind: String(f.kind),
				severity: String(f.severity),
				detail: String(f.detail)
			})),
			guests: guests.map((g) => ({
				name: String(g.name),
				party: Number(g.party ?? 1),
				rsvp: String(g.rsvp ?? "pending"),
				meal: g.meal == null ? null : String(g.meal)
			})),
			floor: floorRow ? {
				name: String(floorRow.name),
				venue: floorRow.venue == null ? null : String(floorRow.venue),
				notes: floorRow.notes == null ? null : String(floorRow.notes),
				marks: floorMarks.filter((m) => m.label).map((m) => ({
					kind: String(m.kind ?? "power"),
					label: String(m.label)
				}))
			} : null
		},
		withheld: {
			value: money(d.value),
			invoices: Number(inv?.n ?? 0),
			invoiceTotal: money(inv?.total)
		}
	};
}
function mapRow(h, pack) {
	const reason = String(h.reason ?? "subcontract");
	return {
		id: Number(h.id),
		dealId: h.deal_id == null ? null : Number(h.deal_id),
		deal: h.deal == null ? null : String(h.deal),
		venue: h.venue == null ? null : String(h.venue),
		eventDate: iso(h.event_date)?.slice(0, 10) ?? null,
		value: money(h.value),
		to: String(h.to_company),
		reason: reason === "emergency" || reason === "overflow" ? reason : "subcontract",
		cover: h.cover == null ? null : String(h.cover),
		token: h.token == null ? null : String(h.token),
		finance: false,
		monitor: Boolean(h.monitor),
		status: String(h.status),
		createdAt: iso(h.created_at),
		lastOpenedAt: iso(h.last_opened_at),
		lastPingAt: iso(h.last_ping_at),
		pack
	};
}
async function loadDesk(sql) {
	const rows = await sql`select h.*, d.title as deal, d.venue, d.event_date, d.value
    from handoffs h left join deals d on d.id = h.deal_id
    order by h.id desc`;
	const packs = [];
	for (const h of rows) {
		const packed = asPack(parseJson(h.snapshot, {}));
		const live = !packed && h.deal_id != null ? await packDeal(sql, Number(h.deal_id)) : null;
		if (!packed && live && h.id != null) await sql.query(`update handoffs set snapshot = $1, include_finance = false where id = $2 and (snapshot is null or snapshot = '{}')`, [JSON.stringify(live.pack), Number(h.id)]);
		packs.push(mapRow(h, packed ?? live?.pack ?? null));
	}
	return {
		packs,
		vendors: (await sql`select name, category, city, available from directory_vendors where name <> 'Northline' order by name`).map((v) => ({
			name: String(v.name),
			category: String(v.category),
			city: v.city == null ? null : String(v.city),
			available: Boolean(v.available)
		})),
		deals: (await sql`select id, title, venue, event_date, value, status, load_in from deals
      where status in ('open','won') and event_date is not null
      order by (event_date < current_date)::int, event_date`).map((d) => ({
			id: Number(d.id),
			title: String(d.title),
			venue: d.venue == null ? null : String(d.venue),
			eventDate: iso(d.event_date)?.slice(0, 10) ?? null,
			value: money(d.value),
			status: String(d.status),
			loadIn: d.load_in == null ? null : String(d.load_in)
		}))
	};
}
var getHandoffDesk_createServerFn_handler = createServerRpc({
	id: "783eb0304d1257224dc34c47c610dbd56be077dadb21d32185ee09eb6f6b24cf",
	name: "getHandoffDesk",
	filename: "src/lib/crm/handoff.ts"
}, (opts) => getHandoffDesk.__executeServer(opts));
var getHandoffDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getHandoffDesk_createServerFn_handler, async () => loadDesk(await getSql()));
var getHandoffs_createServerFn_handler = createServerRpc({
	id: "46f0bb6a40d8601b1347c1cdf848e270c51003c64eecb15ace1b59bd550724e1",
	name: "getHandoffs",
	filename: "src/lib/crm/handoff.ts"
}, (opts) => getHandoffs.__executeServer(opts));
var getHandoffs = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getHandoffs_createServerFn_handler, async () => (await loadDesk(await getSql())).packs);
var previewHandoff_createServerFn_handler = createServerRpc({
	id: "d67e2c58fb2d8ddc84adab12f12af1fa5ac35b16bceba3f08a566d3ea2cba721",
	name: "previewHandoff",
	filename: "src/lib/crm/handoff.ts"
}, (opts) => previewHandoff.__executeServer(opts));
var previewHandoff = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(previewHandoff_createServerFn_handler, async ({ data }) => {
	return await packDeal(await getSql(), data.dealId) ?? {
		pack: null,
		withheld: {
			value: 0,
			invoices: 0,
			invoiceTotal: 0
		}
	};
});
var sendHandoff_createServerFn_handler = createServerRpc({
	id: "acdadea49f7bae8c06ae90eb9e69d5f22226500df7dc858063dad51eee25fcc1",
	name: "sendHandoff",
	filename: "src/lib/crm/handoff.ts"
}, (opts) => sendHandoff.__executeServer(opts));
var sendHandoff = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(sendHandoff_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const built = await packDeal(sql, data.dealId);
	if (!built) return { ok: false };
	const to = data.to.trim();
	if (!to) return { ok: false };
	const token = mintToken();
	const rows = await sql.query(`insert into handoffs (deal_id, to_company, include_finance, monitor, status, token, reason, cover, snapshot)
       values ($1,$2,false,$3,'sent',$4,$5,$6,$7) returning id, token`, [
		data.dealId,
		to,
		data.monitor,
		token,
		data.reason,
		data.cover?.trim() || null,
		JSON.stringify(built.pack)
	]);
	return {
		ok: true,
		id: Number(rows[0].id),
		token: String(rows[0].token)
	};
});
var setHandoffMonitor_createServerFn_handler = createServerRpc({
	id: "87203f7b187610b9764b9b1efd2e9efe4e477656e377a0a03ff846b68d52bfe9",
	name: "setHandoffMonitor",
	filename: "src/lib/crm/handoff.ts"
}, (opts) => setHandoffMonitor.__executeServer(opts));
var setHandoffMonitor = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(setHandoffMonitor_createServerFn_handler, async ({ data }) => {
	await (await getSql()).query(`update handoffs set monitor = $1 where id = $2`, [data.monitor, data.id]);
	return { ok: true };
});
var recallHandoff_createServerFn_handler = createServerRpc({
	id: "d2df3b62541747376bf909394aeb52c510bd544a157e7772362a8235c001e83f",
	name: "recallHandoff",
	filename: "src/lib/crm/handoff.ts"
}, (opts) => recallHandoff.__executeServer(opts));
var recallHandoff = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(recallHandoff_createServerFn_handler, async ({ data }) => {
	await (await getSql()).query(`update handoffs set status = 'recalled', monitor = false where id = $1`, [data.id]);
	return { ok: true };
});
var getHandoffPublic_createServerFn_handler = createServerRpc({
	id: "a3f792effcfba9efb7c36986fc084d8769d8da285096e4a71f02ab682ffb48f6",
	name: "getHandoffPublic",
	filename: "src/lib/crm/handoff.ts"
}, (opts) => getHandoffPublic.__executeServer(opts));
var getHandoffPublic = createServerFn({ method: "GET" }).validator((input) => input).handler(getHandoffPublic_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const h = (await sql.query(`select * from handoffs where token = $1`, [data.token.trim()]))[0];
	if (!h) return null;
	const reasonRaw = String(h.reason ?? "subcontract");
	const reason = reasonRaw === "emergency" || reasonRaw === "overflow" ? reasonRaw : "subcontract";
	if (String(h.status) === "recalled") return {
		to: String(h.to_company),
		reason,
		cover: null,
		status: "recalled",
		monitor: false,
		finance: false,
		pack: emptyPack()
	};
	let pack = asPack(parseJson(h.snapshot, {}));
	if (!pack && h.deal_id != null) {
		pack = (await packDeal(sql, Number(h.deal_id)))?.pack ?? null;
		if (pack) await sql.query(`update handoffs set snapshot = $1, include_finance = false where id = $2`, [JSON.stringify(pack), Number(h.id)]);
	}
	if (!pack) return null;
	return {
		to: String(h.to_company),
		reason,
		cover: h.cover == null ? null : String(h.cover),
		status: String(h.status),
		monitor: Boolean(h.monitor),
		finance: false,
		pack
	};
});
var pingHandoff_createServerFn_handler = createServerRpc({
	id: "8bcc590994cd80a2601c81a9ed5fde28793f4366cb3d9d60aef3042d5ae461d3",
	name: "pingHandoff",
	filename: "src/lib/crm/handoff.ts"
}, (opts) => pingHandoff.__executeServer(opts));
var pingHandoff = createServerFn({ method: "POST" }).validator((input) => input).handler(pingHandoff_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const h = (await sql.query(`select id, status, monitor from handoffs where token = $1`, [data.token.trim()]))[0];
	if (!h || String(h.status) === "recalled") return { ok: false };
	const next = data.status ?? (String(h.status) === "sent" ? "opened" : String(h.status));
	await sql.query(`update handoffs set last_opened_at = coalesce(last_opened_at, now()), last_ping_at = now(),
        status = case when status in ('recalled','complete') then status else $1 end
       where id = $2`, [next, Number(h.id)]);
	return {
		ok: true,
		status: next,
		monitor: Boolean(h.monitor)
	};
});
//#endregion
export { getHandoffDesk_createServerFn_handler, getHandoffPublic_createServerFn_handler, getHandoffs_createServerFn_handler, pingHandoff_createServerFn_handler, previewHandoff_createServerFn_handler, recallHandoff_createServerFn_handler, sendHandoff_createServerFn_handler, setHandoffMonitor_createServerFn_handler };
