import { l as getSql, u as iso } from "./utils-BjcRTCQS.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CZC9dlvp.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { c as insertOutbound } from "./domain-DTp-hrMr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cold-C5UqFQ3f.js
function splitTags(raw) {
	if (raw == null) return [];
	return String(raw).split(/[,;]+/).map((t) => t.trim().toLowerCase()).filter(Boolean);
}
function parseIds(raw) {
	if (raw == null || raw === "") return [];
	return String(raw).split(/[,\s]+/).map((n) => Number(n)).filter((n) => Number.isFinite(n) && n > 0);
}
function parsePaste(raw) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const line of raw.split(/\r?\n/)) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		if (/^name\s*[,;\t]/i.test(trimmed) || /^email\s*[,;\t]/i.test(trimmed)) continue;
		const angle = trimmed.match(/^(.*?)[<\s]+([^\s<>]+@[^\s<>]+)>\s*(?:[,;\t]\s*(.*))?$/);
		let name = "";
		let email = "";
		let company;
		if (angle) {
			name = angle[1].replace(/^["']|["']$/g, "").trim();
			email = angle[2].trim().toLowerCase();
			company = angle[3]?.replace(/^["']|["']$/g, "").trim() || void 0;
		} else {
			const parts = trimmed.split(/[,;\t]/).map((s) => s.replace(/^["']|["']$/g, "").trim()).filter(Boolean);
			const emailPart = parts.find((p) => p.includes("@"));
			if (!emailPart) continue;
			email = emailPart.toLowerCase();
			name = parts.find((p) => p !== emailPart && !p.includes("@")) ?? "";
			company = parts.find((p) => p !== emailPart && p !== name && !p.includes("@")) || void 0;
		}
		if (!email.includes("@")) continue;
		if (seen.has(email)) continue;
		seen.add(email);
		if (!name) name = email.split("@")[0] ?? email;
		out.push({
			name,
			email,
			company
		});
	}
	return out;
}
async function promoteEmail(sql, email, repliedAt, detail) {
	const addr = email.trim().toLowerCase();
	const rows = await sql.query(`select * from cold_prospects where lower(email) = $1`, [addr]);
	if (!rows.length) return {
		ok: false,
		promoted: 0,
		leadId: null
	};
	const already = rows.find((r) => r.promoted_lead_id != null);
	if (already) {
		await sql.query(`update cold_prospects set replied_at = coalesce(replied_at, $1::timestamptz), promoted_at = coalesce(promoted_at, $1::timestamptz) where lower(email) = $2`, [repliedAt, addr]);
		return {
			ok: true,
			promoted: 0,
			leadId: Number(already.promoted_lead_id)
		};
	}
	const first = rows[0];
	const lead = await sql.query(`insert into leads (title, source, status, notes, created_at, stage_entered_at)
     values ($1, 'Cold reply', 'new', $2, $3::timestamptz, $3::timestamptz) returning id`, [
		String(first.name),
		`${addr}${first.company ? ` · ${first.company}` : ""}`,
		repliedAt
	]);
	const leadId = Number(lead[0].id);
	await sql.query(`update cold_prospects set promoted_lead_id = $1, promoted_at = $2::timestamptz, replied_at = $2::timestamptz where lower(email) = $3`, [
		leadId,
		repliedAt,
		addr
	]);
	try {
		await sql.query(`insert into lead_history (lead_id, actor, action, detail) values ($1,'Northline','promoted',$2)`, [leadId, detail]);
	} catch {}
	return {
		ok: true,
		promoted: 1,
		leadId
	};
}
async function scanReplies(sql) {
	const pending = await sql.query(`select p.email, min(e.sent_at) as replied_at
     from cold_prospects p
     join emails e on lower(e.from_addr) = lower(p.email) and e.folder = 'inbox'
     where p.promoted_lead_id is null
     group by p.email`);
	let n = 0;
	for (const row of pending) {
		const at = iso(row.replied_at) ?? (/* @__PURE__ */ new Date()).toISOString();
		const r = await promoteEmail(sql, String(row.email), at, "Inbound reply — lead dated from the reply, not the list");
		n += r.promoted;
	}
	return n;
}
async function loadDesk(sql) {
	const scanned = await scanReplies(sql);
	const lists = (await sql.query(`select l.*,
        (select count(*) from cold_prospects c where c.list_id = l.id) as n,
        (select count(*) from cold_prospects c where c.list_id = l.id and c.promoted_lead_id is not null) as promoted
       from cold_lists l order by l.id`)).map((l) => ({
		id: Number(l.id),
		name: String(l.name),
		tags: splitTags(l.tags),
		source: String(l.source ?? "manual"),
		notes: l.notes == null ? null : String(l.notes),
		n: Number(l.n),
		promoted: Number(l.promoted),
		createdAt: iso(l.created_at) ?? ""
	}));
	const listName = new Map(lists.map((l) => [l.id, l.name]));
	const prospects = (await sql.query(`select * from cold_prospects order by id`)).map((p) => ({
		id: Number(p.id),
		listId: Number(p.list_id),
		listName: listName.get(Number(p.list_id)) ?? "List",
		name: String(p.name),
		email: String(p.email),
		company: p.company == null ? null : String(p.company),
		title: p.title == null ? null : String(p.title),
		promoted: p.promoted_lead_id != null,
		promotedLeadId: p.promoted_lead_id == null ? null : Number(p.promoted_lead_id),
		repliedAt: iso(p.replied_at),
		lastTouchedAt: iso(p.last_touched_at)
	}));
	const campaigns = (await sql.query(`select * from cold_campaigns order by id desc`)).map((c) => ({
		id: Number(c.id),
		name: String(c.name),
		subject: String(c.subject),
		listIds: parseIds(c.list_ids),
		tag: c.tag == null || c.tag === "" ? null : String(c.tag),
		sent: Number(c.sent_count),
		skipped: Number(c.skipped),
		createdAt: iso(c.created_at) ?? ""
	}));
	const unique = /* @__PURE__ */ new Map();
	for (const p of prospects) {
		const k = p.email.toLowerCase();
		const arr = unique.get(k) ?? [];
		arr.push(p);
		unique.set(k, arr);
	}
	const uniqueCold = [...unique.values()].filter((arr) => arr.every((p) => !p.promoted)).length;
	const uniquePromoted = [...unique.values()].filter((arr) => arr.some((p) => p.promoted)).length;
	const inFunnel = Number((await sql.query(`select count(*) as c from leads where source in ('Cold reply','cold-reply')`))[0]?.c ?? 0);
	const leaked = Number((await sql.query(`select count(*) as c from deals d
         where exists (
           select 1 from cold_prospects p
           where p.promoted_lead_id is null
             and d.person_id is not null
             and exists (select 1 from people pe where pe.id = d.person_id and lower(pe.email) = lower(p.email))
         )`))[0]?.c ?? 0);
	return {
		lists,
		prospects,
		campaigns,
		tags: [...new Set(lists.flatMap((l) => l.tags))].sort(),
		scanned,
		stats: {
			lists: lists.length,
			records: prospects.length,
			uniqueCold,
			uniquePromoted,
			inFunnel,
			leaked
		}
	};
}
var getColdDesk_createServerFn_handler = createServerRpc({
	id: "ccfc7061f2a2fffae133291c06403d1741cdc0c6019592ec9e5828b43e14ff93",
	name: "getColdDesk",
	filename: "src/lib/crm/cold.ts"
}, (opts) => getColdDesk.__executeServer(opts));
var getColdDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getColdDesk_createServerFn_handler, async () => {
	return loadDesk(await getSql());
});
var createColdList_createServerFn_handler = createServerRpc({
	id: "928fc6c269a7673856f6584235f91d5943c819318f37971f2ba2b22f25a0218f",
	name: "createColdList",
	filename: "src/lib/crm/cold.ts"
}, (opts) => createColdList.__executeServer(opts));
var createColdList = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createColdList_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const name = data.name.trim();
	if (!name) return {
		ok: false,
		error: "Name the list"
	};
	await sql.query(`insert into cold_lists (name, tags, source, notes) values ($1,$2,$3,$4)`, [
		name,
		data.tags?.trim() || null,
		data.source?.trim() || "manual",
		data.notes?.trim() || null
	]);
	return {
		ok: true,
		error: null
	};
});
var bulkImportCold_createServerFn_handler = createServerRpc({
	id: "a97fc7ffe4b8a9d893454d786b7186d054f5ef3d0ac197b10a80bb366f7124b8",
	name: "bulkImportCold",
	filename: "src/lib/crm/cold.ts"
}, (opts) => bulkImportCold.__executeServer(opts));
var bulkImportCold = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(bulkImportCold_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const rows = parsePaste(data.paste);
	if (!rows.length) return {
		ok: false,
		error: "No emails found in the paste",
		imported: 0,
		skipped: 0
	};
	let listId = data.listId ?? 0;
	if (!listId) {
		const name = (data.newName ?? "").trim() || "Imported list";
		const created = await sql.query(`insert into cold_lists (name, tags, source) values ($1,$2,'manual') returning id`, [name, data.newTags?.trim() || null]);
		listId = Number(created[0].id);
	}
	let imported = 0;
	let skipped = 0;
	for (const row of rows) {
		if ((await sql.query(`select id from cold_prospects where list_id = $1 and lower(email) = $2`, [listId, row.email]))[0]) {
			skipped += 1;
			continue;
		}
		await sql.query(`insert into cold_prospects (list_id, name, email, company) values ($1,$2,$3,$4)`, [
			listId,
			row.name,
			row.email,
			row.company ?? null
		]);
		imported += 1;
	}
	return {
		ok: true,
		error: null,
		imported,
		skipped,
		listId
	};
});
var recordColdReply_createServerFn_handler = createServerRpc({
	id: "4d7823fb6008e9ddfa6e21df4afedbc1352b9ab07a43c73e326b7ea72b048771",
	name: "recordColdReply",
	filename: "src/lib/crm/cold.ts"
}, (opts) => recordColdReply.__executeServer(opts));
var recordColdReply = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(recordColdReply_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const p = (await sql.query(`select * from cold_prospects where id = $1`, [data.id]))[0];
	if (!p) return {
		ok: false,
		error: "Not on a cold list"
	};
	const at = (/* @__PURE__ */ new Date()).toISOString();
	const r = await promoteEmail(sql, String(p.email), at, "Marked as reply on the cold desk");
	return {
		ok: r.ok,
		leadId: r.leadId,
		error: r.ok ? null : "Could not promote"
	};
});
var campaignCold_createServerFn_handler = createServerRpc({
	id: "66b5258ab5d1c2037a2ca8d0d5848290f978fe9dd5305817b98c4ad2f36e1f98",
	name: "campaignCold",
	filename: "src/lib/crm/cold.ts"
}, (opts) => campaignCold.__executeServer(opts));
var campaignCold = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(campaignCold_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const lists = (await sql.query(`select * from cold_lists`)).map((l) => ({
		id: Number(l.id),
		tags: splitTags(l.tags)
	}));
	const tag = data.tag?.trim().toLowerCase() || "";
	const selected = new Set(data.listIds);
	for (const l of lists) if (tag && l.tags.includes(tag)) selected.add(l.id);
	if (!selected.size) return {
		ok: false,
		sent: 0,
		skipped: 0,
		error: "Pick a list or a tag"
	};
	const ids = [...selected];
	const placeholders = ids.map((_, i) => `$${i + 1}`).join(",");
	const prospects = await sql.query(`select * from cold_prospects where list_id in (${placeholders}) order by id`, ids);
	const seen = /* @__PURE__ */ new Set();
	let sent = 0;
	let skipped = 0;
	const campaign = await sql.query(`insert into cold_campaigns (name, subject, body, list_ids, tag, sent_count, skipped)
       values ($1,$2,$3,$4,$5,0,0) returning id`, [
		data.name?.trim() || data.subject,
		data.subject,
		data.body,
		ids.join(","),
		tag || null
	]);
	const campaignId = Number(campaign[0].id);
	for (const p of prospects) {
		const email = String(p.email).toLowerCase();
		if (seen.has(email)) {
			skipped += 1;
			continue;
		}
		seen.add(email);
		if (p.promoted_lead_id != null) {
			skipped += 1;
			continue;
		}
		const first = String(p.name).split(" ")[0] ?? "there";
		await insertOutbound(sql, {
			purpose: "workflow",
			toAddr: String(p.email),
			subject: data.subject,
			body: data.body.replaceAll("{{first}}", first).replaceAll("{{name}}", String(p.name)),
			fallbackName: "Northline Shows",
			hintAddr: "shows@hurricaneproductionsllc.com"
		});
		await sql.query(`update cold_prospects set last_touched_at = now() where id = $1`, [Number(p.id)]);
		await sql.query(`insert into cold_touches (prospect_id, campaign_id, kind, detail) values ($1,$2,'campaign',$3)`, [
			Number(p.id),
			campaignId,
			data.subject
		]);
		sent += 1;
	}
	await sql.query(`update cold_campaigns set sent_count = $1, skipped = $2 where id = $3`, [
		sent,
		skipped,
		campaignId
	]);
	return {
		ok: true,
		sent,
		skipped,
		error: null
	};
});
//#endregion
export { bulkImportCold_createServerFn_handler, campaignCold_createServerFn_handler, createColdList_createServerFn_handler, getColdDesk_createServerFn_handler, recordColdReply_createServerFn_handler };
