import { l as getSql, u as iso } from "./utils-BjcRTCQS.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CZC9dlvp.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/broadcast-DqLpQZ8-.js
var CANSPAM_NAME = "Hurricane Productions";
var CANSPAM_ADDRESS = "247 3rd Street, Brooklyn, NY 11215";
var AUDIENCES = [
	{
		id: "clients",
		label: "Whole client book",
		hint: "Every person with an email. Not cold lists."
	},
	{
		id: "open-deals",
		label: "Open deals",
		hint: "Live pipeline contacts"
	},
	{
		id: "won",
		label: "Won / past",
		hint: "Closed-won clients"
	},
	{
		id: "rotting",
		label: "Rotting",
		hint: "Open deals past rotting days"
	},
	{
		id: "leads",
		label: "Leads",
		hint: "Lead inbox with an email"
	}
];
function htmlToMail(html) {
	return html.replace(/<\/(p|div|h3|li)>/gi, "\n").replace(/<br\s*\/?>/gi, "\n").replace(/<li>/gi, "• ").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/"/g, "\"").replace(/\n{3,}/g, "\n\n").trim();
}
function mapRecipient(r) {
	return {
		personId: r.id == null ? null : Number(r.id),
		name: String(r.name ?? ""),
		email: String(r.email),
		venue: r.venue == null ? null : String(r.venue),
		deal: r.deal == null ? null : String(r.deal)
	};
}
async function audienceRows(sql, audience) {
	if (audience === "leads") return (await sql.query(`select p.id, coalesce(p.name, l.title) as name, p.email, l.venue, l.title as deal
         from leads l left join people p on p.id = l.person_id
         where l.status <> 'archived' and p.email is not null and p.email <> ''`)).map(mapRecipient);
	if (audience === "rotting") return (await sql.query(`select p.id, coalesce(p.name, d.title) as name, p.email, d.venue, d.title as deal
         from deals d left join people p on p.id = d.person_id
         join stages s on s.id = d.stage_id
         where d.status = 'open' and p.email is not null and p.email <> ''
           and extract(day from now() - d.stage_entered_at) >= s.rotting_days`)).map(mapRecipient);
	if (audience === "won") return (await sql.query(`select p.id, coalesce(p.name, d.title) as name, p.email, d.venue, d.title as deal
         from deals d left join people p on p.id = d.person_id
         where d.status = 'won' and p.email is not null and p.email <> ''`)).map(mapRecipient);
	if (audience === "open-deals") return (await sql.query(`select p.id, coalesce(p.name, d.title) as name, p.email, d.venue, d.title as deal
         from deals d left join people p on p.id = d.person_id
         where d.status = 'open' and p.email is not null and p.email <> ''`)).map(mapRecipient);
	return (await sql.query(`select p.id, p.name, p.email, null as venue, null as deal
       from people p
       where p.email is not null and p.email <> ''
       order by p.name`)).map(mapRecipient);
}
function uniquePeople(rows) {
	const map = /* @__PURE__ */ new Map();
	let dupes = 0;
	for (const r of rows) {
		const key = r.email.toLowerCase();
		if (map.has(key)) {
			dupes += 1;
			continue;
		}
		map.set(key, r);
	}
	return {
		unique: [...map.values()],
		dupes
	};
}
var getBroadcastComposer_createServerFn_handler = createServerRpc({
	id: "f6fd292bbcfdab3c0de8a5b769cbe785a18dcc971d60bf305c68df3d1439f1ef",
	name: "getBroadcastComposer",
	filename: "src/lib/crm/broadcast.ts"
}, (opts) => getBroadcastComposer.__executeServer(opts));
var getBroadcastComposer = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getBroadcastComposer_createServerFn_handler, async () => {
	const sql = await getSql();
	const suppressed = (await sql.query(`select * from mail_suppressions order by created_at desc`)).map((s) => ({
		id: Number(s.id),
		email: String(s.email),
		name: s.name == null ? null : String(s.name),
		reason: String(s.reason),
		source: String(s.source),
		createdAt: iso(s.created_at) ?? ""
	}));
	const held = new Set(suppressed.map((s) => s.email.toLowerCase()));
	const audiences = [];
	for (const a of AUDIENCES) {
		const people = uniquePeople(await audienceRows(sql, a.id));
		const ready = people.unique.filter((p) => !held.has(p.email.toLowerCase()));
		audiences.push({
			id: a.id,
			label: a.label,
			hint: a.hint,
			total: people.unique.length,
			ready: ready.length,
			suppressed: people.unique.length - ready.length,
			preview: ready.slice(0, 6).map((p) => ({
				name: p.name,
				email: p.email
			}))
		});
	}
	const templates = (await sql.query(`select * from email_templates order by id`)).map((t) => ({
		id: Number(t.id),
		name: String(t.name),
		subject: String(t.subject),
		body: String(t.body)
	}));
	const broadcasts = (await sql.query(`select * from mail_broadcasts order by created_at desc`)).map((b) => ({
		id: Number(b.id),
		name: String(b.name),
		subject: String(b.subject),
		body: String(b.body),
		audience: String(b.audience),
		sentCount: Number(b.sent_count),
		opened: Number(b.opened),
		suppressedCount: Number(b.suppressed_count ?? 0),
		skipped: Number(b.skipped ?? 0),
		fromAddr: b.from_addr == null ? null : String(b.from_addr),
		createdAt: iso(b.created_at) ?? ""
	}));
	const signatures = (await sql.query(`select s.*, m.name from mail_signatures s left join members m on m.id = s.member_id`)).map((s) => ({
		member: s.name == null ? null : String(s.name),
		body: String(s.body)
	}));
	const book = audiences.find((a) => a.id === "clients");
	return {
		audiences,
		suppressed,
		templates,
		broadcasts,
		signatures,
		address: CANSPAM_ADDRESS,
		company: CANSPAM_NAME,
		stats: {
			book: book?.total ?? 0,
			ready: book?.ready ?? 0,
			held: suppressed.length,
			sent: broadcasts.reduce((n, b) => n + b.sentCount, 0)
		}
	};
});
var saveBroadcastTemplate_createServerFn_handler = createServerRpc({
	id: "e2102636ba50c08f611001d487946e56367e422ff2444ccba8b56bdcffbdf673",
	name: "saveBroadcastTemplate",
	filename: "src/lib/crm/broadcast.ts"
}, (opts) => saveBroadcastTemplate.__executeServer(opts));
var saveBroadcastTemplate = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveBroadcastTemplate_createServerFn_handler, async ({ data }) => {
	const name = data.name.trim() || data.subject.trim();
	const subject = data.subject.trim();
	const body = htmlToMail(data.body);
	if (!name || !subject || !body) return {
		ok: false,
		error: "Need a name, subject, and body",
		id: 0
	};
	const row = (await (await getSql()).query(`insert into email_templates (name, subject, body) values ($1,$2,$3) returning id`, [
		name,
		subject,
		body
	]))[0];
	return {
		ok: true,
		error: null,
		id: Number(row?.id ?? 0)
	};
});
var addSuppression_createServerFn_handler = createServerRpc({
	id: "b3dd5173e9cc4e3c4e28a6fa1d8eb2cae7bdfac84095fae40feb1e77676cf964",
	name: "addSuppression",
	filename: "src/lib/crm/broadcast.ts"
}, (opts) => addSuppression.__executeServer(opts));
var addSuppression = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(addSuppression_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const email = data.email.trim().toLowerCase();
	if (!email.includes("@")) return {
		ok: false,
		error: "Need a full email"
	};
	if ((await sql.query(`select id from mail_suppressions where lower(email) = $1`, [email]))[0]) return {
		ok: true,
		error: null
	};
	await sql.query(`insert into mail_suppressions (email, name, reason, source) values ($1,$2,$3,'manual')`, [
		email,
		data.name?.trim() || null,
		data.reason?.trim() || "unsubscribe"
	]);
	return {
		ok: true,
		error: null
	};
});
var removeSuppression_createServerFn_handler = createServerRpc({
	id: "ac18afcbc4092f67431d220a8cc9507b3d6a71982227a1641f7972aa54933d47",
	name: "removeSuppression",
	filename: "src/lib/crm/broadcast.ts"
}, (opts) => removeSuppression.__executeServer(opts));
var removeSuppression = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(removeSuppression_createServerFn_handler, async ({ data }) => {
	await (await getSql()).query(`delete from mail_suppressions where id = $1`, [data.id]);
	return { ok: true };
});
var getUnsubPage_createServerFn_handler = createServerRpc({
	id: "419b418250e7c9dcce4b26664e76f96eb1e348cb79f8bf636921b95035310253",
	name: "getUnsubPage",
	filename: "src/lib/crm/broadcast.ts"
}, (opts) => getUnsubPage.__executeServer(opts));
var getUnsubPage = createServerFn({ method: "GET" }).validator((input) => input).handler(getUnsubPage_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const row = (await sql.query(`select * from mail_unsub_tokens where token = $1`, [data.token]))[0];
	if (!row) return {
		ok: false,
		email: null,
		already: false
	};
	const email = String(row.email);
	const held = (await sql.query(`select id from mail_suppressions where lower(email) = $1`, [email.toLowerCase()]))[0];
	return {
		ok: true,
		email,
		already: Boolean(held)
	};
});
var confirmUnsub_createServerFn_handler = createServerRpc({
	id: "722451ff6a851fb23861995fef98e6d9677d496373d28765780f60016c536eac",
	name: "confirmUnsub",
	filename: "src/lib/crm/broadcast.ts"
}, (opts) => confirmUnsub.__executeServer(opts));
var confirmUnsub = createServerFn({ method: "POST" }).validator((input) => input).handler(confirmUnsub_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const row = (await sql.query(`select * from mail_unsub_tokens where token = $1`, [data.token]))[0];
	if (!row) return {
		ok: false,
		error: "Link is not valid"
	};
	const email = String(row.email).toLowerCase();
	if (!(await sql.query(`select id from mail_suppressions where lower(email) = $1`, [email]))[0]) await sql.query(`insert into mail_suppressions (email, reason, source) values ($1,'unsubscribe','unsub')`, [email]);
	return {
		ok: true,
		error: null
	};
});
//#endregion
export { addSuppression_createServerFn_handler, confirmUnsub_createServerFn_handler, getBroadcastComposer_createServerFn_handler, getUnsubPage_createServerFn_handler, removeSuppression_createServerFn_handler, saveBroadcastTemplate_createServerFn_handler };
