import { d as money, l as getSql, u as iso } from "./utils-BjcRTCQS.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CZC9dlvp.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/views-0GtFv4Fm.js
function parseHour(raw) {
	const s = raw == null ? "" : String(raw);
	const isoMatch = /T(\d{2}):(\d{2})/.exec(s);
	if (isoMatch) return Number(isoMatch[1]) + Number(isoMatch[2]) / 60;
	const clock = /(\d{1,2}):(\d{2})/.exec(s);
	if (clock) return Number(clock[1]) + Number(clock[2]) / 60;
	const d = new Date(s);
	if (!Number.isNaN(d.getTime())) return d.getHours() + d.getMinutes() / 60;
	return 8;
}
function dayKey(raw) {
	return (iso(raw) ?? String(raw ?? "")).slice(0, 10);
}
var getUniqueViews_createServerFn_handler = createServerRpc({
	id: "bbd1d40f5faa477aeae0887b2b2a05637d0b7d4524a21966cdd6eec476c90735",
	name: "getUniqueViews",
	filename: "src/lib/crm/views.ts"
}, (opts) => getUniqueViews.__executeServer(opts));
var getUniqueViews = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getUniqueViews_createServerFn_handler, async () => {
	const sql = await getSql();
	const shows = (await sql.query(`select d.id, d.title, d.venue, d.event_date, d.load_in, d.status, d.indoor, d.guest_count, d.value, m.name as owner_name
       from deals d left join members m on m.id = d.owner_id
       where d.event_date is not null
         and d.status not in ('lost', 'cancelled')
       order by d.event_date`)).map((d) => {
		const loadHour = parseHour(d.load_in);
		const indoor = d.indoor == null ? null : Boolean(d.indoor);
		const guests = d.guest_count == null ? null : Number(d.guest_count);
		const span = indoor === false || (guests ?? 0) > 500 ? 14 : 12;
		return {
			id: Number(d.id),
			title: String(d.title),
			venue: d.venue == null ? null : String(d.venue),
			eventDate: dayKey(d.event_date),
			loadHour,
			endHour: Math.min(24, loadHour + span),
			status: String(d.status),
			ownerName: d.owner_name == null ? null : String(d.owner_name),
			indoor,
			guestCount: guests,
			value: money(d.value)
		};
	});
	const shifts = (await sql.query(`select s.*, m.name as member, d.title as deal, d.venue
       from crew_shifts s
       left join members m on m.id = s.member_id
       left join deals d on d.id = s.deal_id
       order by s.starts_at`)).map((s) => ({
		id: Number(s.id),
		dealId: Number(s.deal_id),
		deal: String(s.deal ?? ""),
		venue: s.venue == null ? null : String(s.venue),
		member: String(s.member ?? ""),
		role: String(s.role),
		kind: String(s.kind),
		day: dayKey(s.starts_at),
		startHour: parseHour(s.starts_at),
		endHour: Math.max(parseHour(s.starts_at) + .5, parseHour(s.ends_at))
	}));
	const inquiry = (await sql.query(`select * from inquiry_log order by day`).catch(() => [])).map((r) => ({
		day: dayKey(r.day),
		leads: Number(r.leads ?? 0),
		deals: Number(r.deals ?? 0),
		forms: Number(r.forms ?? 0),
		n: Number(r.leads ?? 0) + Number(r.deals ?? 0) + Number(r.forms ?? 0)
	}));
	if (inquiry.length === 0) {
		const created = await sql.query(`select created_at::date as day, count(*)::int as n from deals group by 1
         union all
         select created_at::date, count(*)::int from leads group by 1`);
		const map = /* @__PURE__ */ new Map();
		for (const r of created) {
			const day = dayKey(r.day);
			const cur = map.get(day) ?? {
				day,
				n: 0,
				leads: 0,
				deals: 0,
				forms: 0
			};
			cur.deals += Number(r.n);
			cur.n += Number(r.n);
			map.set(day, cur);
		}
		inquiry.push(...map.values());
	}
	return {
		shows,
		shifts,
		inquiry
	};
});
//#endregion
export { getUniqueViews_createServerFn_handler };
