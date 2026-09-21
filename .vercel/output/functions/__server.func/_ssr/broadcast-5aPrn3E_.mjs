import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CZC9dlvp.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { c as insertOutbound } from "./domain-DTp-hrMr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/broadcast-5aPrn3E_.js
var CANSPAM_NAME = "Hurricane Productions";
var CANSPAM_ADDRESS = "247 3rd Street, Brooklyn, NY 11215";
function canspamFooter(token) {
	return [
		"",
		"—",
		CANSPAM_NAME,
		CANSPAM_ADDRESS,
		"This is a commercial message from our client book.",
		`Unsubscribe: https://hurricaneproductionsllc.com/u/${token}`
	].join("\n");
}
function htmlToMail(html) {
	return html.replace(/<\/(p|div|h3|li)>/gi, "\n").replace(/<br\s*\/?>/gi, "\n").replace(/<li>/gi, "• ").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/"/g, "\"").replace(/\n{3,}/g, "\n\n").trim();
}
function applyMerge(text, ctx) {
	return text.replaceAll("{{first_name}}", ctx.first).replaceAll("{{first}}", ctx.first).replaceAll("{{name}}", ctx.name).replaceAll("{{venue}}", ctx.venue).replaceAll("{{deal}}", ctx.deal).replaceAll("{{date}}", "").replaceAll("{{load_in}}", "").replace(/\{\{[^}]+\}\}/g, "").trim();
}
async function loadSignature(sql, memberId) {
	const rows = memberId ? await sql.query(`select body from mail_signatures where member_id = $1 limit 1`, [memberId]) : await sql.query(`select body from mail_signatures order by id limit 1`);
	return rows[0] ? String(rows[0].body) : "";
}
async function ensureToken(sql, email) {
	const addr = email.toLowerCase();
	const existing = await sql.query(`select token from mail_unsub_tokens where lower(email) = $1`, [addr]);
	if (existing[0]) return String(existing[0].token);
	const token = `${addr.replace(/[^a-z0-9]+/g, "").slice(0, 16)}-${Math.random().toString(36).slice(2, 8)}`;
	await sql.query(`insert into mail_unsub_tokens (token, email) values ($1,$2)`, [token, addr]);
	return token;
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
async function sendClientBroadcast(sql, data) {
	const subject = data.subject.trim();
	const rawBody = htmlToMail(data.body);
	if (!subject || !rawBody) return {
		ok: false,
		sent: 0,
		suppressed: 0,
		skipped: 0,
		error: "Subject and body are required"
	};
	const people = uniquePeople(await audienceRows(sql, data.audience));
	const suppressedRows = await sql.query(`select lower(email) as e from mail_suppressions`);
	const held = new Set(suppressedRows.map((r) => String(r.e)));
	const signature = await loadSignature(sql, data.memberId);
	let sent = 0;
	let suppressed = 0;
	let skipped = people.dupes;
	for (const r of people.unique) {
		const email = r.email.toLowerCase();
		if (held.has(email)) {
			suppressed += 1;
			continue;
		}
		const token = await ensureToken(sql, email);
		const ctx = {
			first: r.name.split(" ")[0] ?? r.name,
			name: r.name,
			venue: r.venue ?? "",
			deal: r.deal ?? ""
		};
		const body = [
			applyMerge(rawBody, ctx),
			signature ? `\n\n${signature}` : "",
			canspamFooter(token)
		].filter(Boolean).join("\n");
		await insertOutbound(sql, {
			purpose: "workflow",
			mailKind: "broadcast",
			toAddr: r.email,
			subject: applyMerge(subject, ctx),
			body,
			personId: r.personId,
			fallbackName: data.fromName,
			hintAddr: data.fromAddr,
			memberId: data.memberId ?? null
		});
		sent += 1;
	}
	await sql.query(`insert into mail_broadcasts (name, subject, body, audience, sent_count, opened, suppressed_count, skipped, template_id, from_addr)
     values ($1,$2,$3,$4,$5,0,$6,$7,$8,$9)`, [
		data.name?.trim() || subject,
		subject,
		rawBody,
		data.audience,
		sent,
		suppressed,
		skipped,
		data.templateId ?? null,
		data.fromAddr
	]);
	return {
		ok: true,
		sent,
		suppressed,
		skipped,
		error: null
	};
}
var getBroadcastComposer = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f6fd292bbcfdab3c0de8a5b769cbe785a18dcc971d60bf305c68df3d1439f1ef"));
var saveBroadcastTemplate = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("e2102636ba50c08f611001d487946e56367e422ff2444ccba8b56bdcffbdf673"));
var addSuppression = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("b3dd5173e9cc4e3c4e28a6fa1d8eb2cae7bdfac84095fae40feb1e77676cf964"));
var removeSuppression = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("ac18afcbc4092f67431d220a8cc9507b3d6a71982227a1641f7972aa54933d47"));
var getUnsubPage = createServerFn({ method: "GET" }).validator((input) => input).handler(createSsrRpc("419b418250e7c9dcce4b26664e76f96eb1e348cb79f8bf636921b95035310253"));
var confirmUnsub = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("722451ff6a851fb23861995fef98e6d9677d496373d28765780f60016c536eac"));
//#endregion
export { removeSuppression as a, getUnsubPage as i, confirmUnsub as n, saveBroadcastTemplate as o, getBroadcastComposer as r, sendClientBroadcast as s, addSuppression as t };
