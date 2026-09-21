import { r as createServerFn } from "./ssr.mjs";
import { d as iso, f as money, u as getSql } from "./utils-DLVA4J7b.mjs";
import { n as assertCap, u as guardAction } from "./governance-rJzhZAi0.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as completeNewBooking } from "./schedule-URzAtCfo.mjs";
import { a as mapDoc, c as mapMember, d as mapProduct, f as mapProject, i as mapDealProduct, l as mapOrg, n as mapActivity, o as mapEmail, p as mapTask, r as mapDeal, s as mapLead, t as DEAL_SELECT, u as mapPerson } from "./map-BcvMRfsm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-DJUE0g_r.js
async function audit(actor, action, entity, detail) {
	await (await getSql())`insert into audit_log (actor, action, entity, detail, ip, device)
    values (${actor}, ${action}, ${entity}, ${detail ?? null}, ${"74.64.12.10"}, ${"Chrome · macOS"})`;
}
var getBootstrap_createServerFn_handler = createServerRpc({
	id: "6970d4457b01e6e6acac2e81c5cc8be9bf0e7bf16c42f4d4bb35e69d970d8244",
	name: "getBootstrap",
	filename: "src/lib/crm/server.ts"
}, (opts) => getBootstrap.__executeServer(opts));
var getBootstrap = createServerFn({ method: "GET" }).handler(getBootstrap_createServerFn_handler, async () => {
	const sql = await getSql();
	const members = (await sql`select m.*, t.name as team_name from members m left join teams t on t.id = m.team_id order by m.id`).map(mapMember);
	const pipes = await sql`select * from pipelines order by sort_order`;
	const stages = await sql`select * from stages order by sort_order`;
	const products = (await sql`select * from products order by category, name`).map(mapProduct);
	let lostReasons = [];
	let activityTypes = [];
	try {
		const lostRows = await sql`select * from lost_reasons where active = true order by sort_order`;
		const typeRows = await sql`select * from activity_types where active = true order by id`;
		lostReasons = lostRows.map((r) => ({
			id: Number(r.id),
			name: String(r.name),
			sortOrder: Number(r.sort_order),
			active: Boolean(r.active)
		}));
		activityTypes = typeRows.map((r) => ({
			id: Number(r.id),
			name: String(r.name),
			slug: String(r.slug),
			icon: String(r.icon),
			active: Boolean(r.active)
		}));
	} catch {}
	return {
		members,
		pipelines: pipes.map((p) => ({
			id: Number(p.id),
			name: String(p.name),
			sortOrder: Number(p.sort_order),
			stages: stages.filter((s) => Number(s.pipeline_id) === Number(p.id)).map((s) => ({
				id: Number(s.id),
				pipelineId: Number(s.pipeline_id),
				name: String(s.name),
				sortOrder: Number(s.sort_order),
				rottingDays: Number(s.rotting_days),
				probability: Number(s.probability)
			}))
		})),
		products,
		lostReasons,
		activityTypes
	};
});
var listDeals_createServerFn_handler = createServerRpc({
	id: "59891ab2dffb05c51f647402619d969c168f88abc8992b07971a7189d114d382",
	name: "listDeals",
	filename: "src/lib/crm/server.ts"
}, (opts) => listDeals.__executeServer(opts));
var listDeals = createServerFn({ method: "GET" }).validator((input = {}) => input).handler(listDeals_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const pipelineId = data.pipelineId ?? 1;
	const status = data.status ?? "open";
	const ownerId = data.ownerId;
	const q = data.q?.trim();
	return (await sql.query(`select ${DEAL_SELECT}
       from deals d
       left join organizations o on o.id = d.org_id
       left join people p on p.id = d.person_id
       left join members m on m.id = d.owner_id
       left join stages s on s.id = d.stage_id
       where d.pipeline_id = $1
         and ($2 = 'all' or d.status = $2)
         and ($3::int is null or d.owner_id = $3)
         and ($4::text is null or d.title ilike '%'||$4||'%' or coalesce(o.name,'') ilike '%'||$4||'%' or coalesce(d.venue,'') ilike '%'||$4||'%')
       order by d.value desc`, [
		pipelineId,
		status,
		ownerId ?? null,
		q || null
	])).map(mapDeal);
});
var getDeal_createServerFn_handler = createServerRpc({
	id: "8f0d647cb3a1ed6514175037ef9ab4b148df860679bff4a0a01332e84124ae40",
	name: "getDeal",
	filename: "src/lib/crm/server.ts"
}, (opts) => getDeal.__executeServer(opts));
var getDeal = createServerFn({ method: "GET" }).validator((input) => input).handler(getDeal_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const rows = await sql.query(`select ${DEAL_SELECT} from deals d
       left join organizations o on o.id = d.org_id
       left join people p on p.id = d.person_id
       left join members m on m.id = d.owner_id
       left join stages s on s.id = d.stage_id
       where d.id = $1`, [data.id]);
	if (!rows[0]) return null;
	const deal = mapDeal(rows[0]);
	const products = (await sql`select dp.*, pr.name, pr.sku, pr.unit from deal_products dp join products pr on pr.id = dp.product_id where dp.deal_id = ${data.id}`).map(mapDealProduct);
	const activities = (await sql`select a.*, d.title as deal_title, p.name as person_name, o.name as org_name, m.name as owner_name, m.initials as owner_initials, m.tone as owner_tone
        from activities a
        left join deals d on d.id = a.deal_id
        left join people p on p.id = a.person_id
        left join organizations o on o.id = a.org_id
        left join members m on m.id = a.owner_id
        where a.deal_id = ${data.id} order by a.due_at nulls last`).map(mapActivity);
	const comments = await sql`select c.*, m.name as author_name, m.initials as author_initials, m.tone as author_tone
      from comments c left join members m on m.id = c.author_id
      where c.entity_type = 'deal' and c.entity_id = ${data.id} order by c.created_at`;
	const files = await sql`select * from files where entity_type = 'deal' and entity_id = ${data.id} order by created_at desc`;
	const emails = (await sql`select e.*, d.title as deal_title from emails e left join deals d on d.id = e.deal_id where e.deal_id = ${data.id} order by coalesce(e.sent_at, e.created_at) desc`).map(mapEmail);
	const documents = (await sql`select doc.*, d.title as deal_title from documents doc left join deals d on d.id = doc.deal_id where doc.deal_id = ${data.id} order by doc.created_at desc`).map(mapDoc);
	let historyRows = [];
	try {
		historyRows = await sql`select * from deal_history where deal_id = ${data.id} order by created_at desc`;
	} catch {
		historyRows = [];
	}
	return {
		...deal,
		personEmail: rows[0].person_email == null ? null : String(rows[0].person_email),
		personPhone: rows[0].person_phone == null ? null : String(rows[0].person_phone),
		orgAddress: rows[0].org_address == null ? null : String(rows[0].org_address),
		products,
		activities,
		comments: comments.map((c) => ({
			id: Number(c.id),
			entityType: "deal",
			entityId: data.id,
			authorId: c.author_id == null ? null : Number(c.author_id),
			authorName: c.author_name == null ? null : String(c.author_name),
			authorInitials: c.author_initials == null ? null : String(c.author_initials),
			authorTone: c.author_tone == null ? null : String(c.author_tone),
			body: String(c.body),
			createdAt: iso(c.created_at) ?? ""
		})),
		files: files.map((f) => ({
			id: Number(f.id),
			entityType: "deal",
			entityId: data.id,
			name: String(f.name),
			kind: String(f.kind),
			sizeKb: Number(f.size_kb),
			uploadedBy: f.uploaded_by == null ? null : Number(f.uploaded_by),
			createdAt: iso(f.created_at) ?? ""
		})),
		emails,
		documents,
		history: historyRows.map((h) => ({
			id: Number(h.id),
			dealId: data.id,
			actor: String(h.actor),
			action: String(h.action),
			detail: h.detail == null ? null : String(h.detail),
			createdAt: iso(h.created_at) ?? ""
		}))
	};
});
var createDeal_createServerFn_handler = createServerRpc({
	id: "afafd8df505ef6eb6b568f2b74c1bea6b58c0574b2c0df1673c7fac4ef1fb0f9",
	name: "createDeal",
	filename: "src/lib/crm/server.ts"
}, (opts) => createDeal.__executeServer(opts));
var createDeal = createServerFn({ method: "POST" }).validator((input) => input).handler(createDeal_createServerFn_handler, async ({ data }) => {
	const rows = await (await getSql())`insert into deals (title, value, pipeline_id, stage_id, owner_id, org_id, person_id, venue, event_date, guest_count, source)
      values (${data.title}, ${data.value}, ${data.pipelineId}, ${data.stageId}, ${data.ownerId}, ${data.orgId ?? null}, ${data.personId ?? null}, ${data.venue ?? null}, ${data.eventDate ?? null}, ${data.guestCount ?? null}, ${data.source ?? "Manual"})
      returning id`;
	const id = Number(rows[0].id);
	await audit("Northline", "created", `deal:${id}`, data.title);
	return { id };
});
var moveDeal_createServerFn_handler = createServerRpc({
	id: "7ecd45ebcbd19fd4ae1874440dfef918874a06e942b7b4c391a1bff212dbe8dd",
	name: "moveDeal",
	filename: "src/lib/crm/server.ts"
}, (opts) => moveDeal.__executeServer(opts));
var moveDeal = createServerFn({ method: "POST" }).validator((input) => input).handler(moveDeal_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const stage = (await sql`select probability, name from stages where id = ${data.stageId}`)[0];
	await sql`update deals set stage_id = ${data.stageId}, probability = ${Number(stage?.probability ?? 0)}, stage_entered_at = now(), updated_at = now() where id = ${data.id} and status = 'open'`;
	await sql`insert into deal_history (deal_id, actor, action, detail) values (${data.id}, ${"Northline"}, ${"moved"}, ${`Moved to ${String(stage?.name ?? data.stageId)}`})`;
	await audit("Northline", "updated", `deal:${data.id}`, `Moved to ${String(stage?.name ?? data.stageId)}`);
	return { ok: true };
});
var setDealStatus_createServerFn_handler = createServerRpc({
	id: "cad926ee29ed91b95b8218c981baead39276784db310176dfa14e268b6401ed5",
	name: "setDealStatus",
	filename: "src/lib/crm/server.ts"
}, (opts) => setDealStatus.__executeServer(opts));
var setDealStatus = createServerFn({ method: "POST" }).validator((input) => input).handler(setDealStatus_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	if (data.status === "won") {
		await sql`update deals set status = 'won', won_at = now(), probability = 100, updated_at = now() where id = ${data.id}`;
		const deal = (await sql`select title, owner_id from deals where id = ${data.id}`)[0];
		if (deal) {
			await sql`insert into projects (name, deal_id, status, start_date, end_date, owner_id)
          values (${String(deal.title)}, ${data.id}, ${"open"}, CURRENT_DATE, CURRENT_DATE + 7, ${4})`;
			await sql`update automations set runs = runs + 1 where trigger_type = 'deal.won'`;
			await sql`insert into deal_history (deal_id, actor, action, detail) values (${data.id}, ${"Northline"}, ${"won"}, ${String(deal.title)})`;
		}
	} else if (data.status === "lost") {
		await sql`update deals set status = 'lost', lost_reason = ${data.lostReason ?? "Unspecified"}, lost_at = now(), probability = 0, updated_at = now() where id = ${data.id}`;
		await sql`insert into deal_history (deal_id, actor, action, detail) values (${data.id}, ${"Northline"}, ${"lost"}, ${data.lostReason ?? "Unspecified"})`;
	} else await sql`update deals set status = 'open', lost_reason = null, won_at = null, lost_at = null, updated_at = now() where id = ${data.id}`;
	await audit("Northline", "updated", `deal:${data.id}`, `Status ${data.status}`);
	return { ok: true };
});
var updateDeal_createServerFn_handler = createServerRpc({
	id: "0dc3589918c1b2559a2974d90efef2e115cb9cd2dc27610a19f8aaeb41c2bb28",
	name: "updateDeal",
	filename: "src/lib/crm/server.ts"
}, (opts) => updateDeal.__executeServer(opts));
var updateDeal = createServerFn({ method: "POST" }).validator((input) => input).handler(updateDeal_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const cur = (await sql`select * from deals where id = ${data.id}`)[0];
	if (!cur) return { ok: false };
	await sql`update deals set
      title = ${data.title ?? String(cur.title)},
      value = ${data.value ?? money(cur.value)},
      owner_id = ${data.ownerId ?? (cur.owner_id == null ? null : Number(cur.owner_id))},
      venue = ${data.venue === void 0 ? cur.venue : data.venue},
      event_date = ${data.eventDate === void 0 ? cur.event_date : data.eventDate},
      guest_count = ${data.guestCount === void 0 ? cur.guest_count : data.guestCount},
      indoor = ${data.indoor === void 0 ? cur.indoor : data.indoor},
      load_in = ${data.loadIn === void 0 ? cur.load_in : data.loadIn},
      notes = ${data.notes === void 0 ? cur.notes : data.notes},
      expected_close = ${data.expectedClose === void 0 ? cur.expected_close : data.expectedClose},
      updated_at = now()
      where id = ${data.id}`;
	return { ok: true };
});
var addDealProduct_createServerFn_handler = createServerRpc({
	id: "29e8aa96222c63bc849010293cbfe5032a6ede363c5b310e8863303216b6ed16",
	name: "addDealProduct",
	filename: "src/lib/crm/server.ts"
}, (opts) => addDealProduct.__executeServer(opts));
var addDealProduct = createServerFn({ method: "POST" }).validator((input) => input).handler(addDealProduct_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const p = (await sql`select unit_price from products where id = ${data.productId}`)[0];
	if (!p) return { ok: false };
	await sql`insert into deal_products (deal_id, product_id, qty, discount, price) values (${data.dealId}, ${data.productId}, ${data.qty}, 0, ${money(p.unit_price)})`;
	const sum = (await sql`select coalesce(sum(qty * price * (1 - discount/100.0)),0) as v from deal_products where deal_id = ${data.dealId}`)[0];
	await sql`update deals set value = ${money(sum?.v)}, updated_at = now() where id = ${data.dealId}`;
	return { ok: true };
});
var addComment_createServerFn_handler = createServerRpc({
	id: "21dd474b25d7ac73ab8fbc8bdf030370e634580ac10cf805f3f308f55f0472e5",
	name: "addComment",
	filename: "src/lib/crm/server.ts"
}, (opts) => addComment.__executeServer(opts));
var addComment = createServerFn({ method: "POST" }).validator((input) => input).handler(addComment_createServerFn_handler, async ({ data }) => {
	await (await getSql())`insert into comments (entity_type, entity_id, author_id, body) values (${data.entityType}, ${data.entityId}, ${data.authorId}, ${data.body})`;
	return { ok: true };
});
var addFileMeta_createServerFn_handler = createServerRpc({
	id: "595ff189c39732b2788954ca7fa175dee89cb6e7df07700aa18e3f0ae860a3f3",
	name: "addFileMeta",
	filename: "src/lib/crm/server.ts"
}, (opts) => addFileMeta.__executeServer(opts));
var addFileMeta = createServerFn({ method: "POST" }).validator((input) => input).handler(addFileMeta_createServerFn_handler, async ({ data }) => {
	await (await getSql())`insert into files (entity_type, entity_id, name, kind, size_kb, uploaded_by)
      values (${data.entityType}, ${data.entityId}, ${data.name}, ${"file"}, ${Math.round(40 + Math.random() * 800)}, ${data.uploadedBy})`;
	return { ok: true };
});
var listLeads_createServerFn_handler = createServerRpc({
	id: "d48b64b13516ca0e3ab73b57e154dd5959b115f28c92f5ea0af83fec6eb2d10c",
	name: "listLeads",
	filename: "src/lib/crm/server.ts"
}, (opts) => listLeads.__executeServer(opts));
var listLeads = createServerFn({ method: "GET" }).handler(listLeads_createServerFn_handler, async () => {
	return (await (await getSql())`select l.*, p.name as person_name, p.email as person_email, o.name as org_name,
    m.name as owner_name, m.initials as owner_initials, m.tone as owner_tone
    from leads l
    left join people p on p.id = l.person_id
    left join organizations o on o.id = l.org_id
    left join members m on m.id = l.owner_id
    where l.status <> 'archived'
    order by l.score desc, l.created_at desc`).map(mapLead);
});
var convertLead_createServerFn_handler = createServerRpc({
	id: "9376b723956999d721736457d517fdbade5dacaf4a225df48f5e9b6b87c235f3",
	name: "convertLead",
	filename: "src/lib/crm/server.ts"
}, (opts) => convertLead.__executeServer(opts));
var convertLead = createServerFn({ method: "POST" }).validator((input) => input).handler(convertLead_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const lead = (await sql`select * from leads where id = ${data.id}`)[0];
	if (!lead) return { id: null };
	const rows = await sql`insert into deals (title, value, pipeline_id, stage_id, owner_id, org_id, person_id, source)
      values (${String(lead.title)}, 0, ${data.pipelineId}, ${data.stageId}, ${lead.owner_id == null ? null : Number(lead.owner_id)}, ${lead.org_id == null ? null : Number(lead.org_id)}, ${lead.person_id == null ? null : Number(lead.person_id)}, ${String(lead.source)})
      returning id`;
	await sql`update leads set status = 'archived' where id = ${data.id}`;
	return { id: Number(rows[0].id) };
});
var createLead_createServerFn_handler = createServerRpc({
	id: "b1c130a8f205af62a861a12c29dedad21aeee85db1e2c7bdfde24c250df296de",
	name: "createLead",
	filename: "src/lib/crm/server.ts"
}, (opts) => createLead.__executeServer(opts));
var createLead = createServerFn({ method: "POST" }).validator((input) => input).handler(createLead_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const score = data.source === "Referral" ? 70 : data.source === "Prospector" ? 55 : 40;
	const rows = await sql`insert into leads (title, source, owner_id, notes, labels, score) values (${data.title}, ${data.source}, ${data.ownerId}, ${data.notes ?? null}, ${data.labels ?? null}, ${score}) returning id`;
	return { id: Number(rows[0].id) };
});
var updateLead_createServerFn_handler = createServerRpc({
	id: "966e6f6ca162895bb0129b8e27baa0d1045abf5152dd7cb46fb35a4e7cb6f772",
	name: "updateLead",
	filename: "src/lib/crm/server.ts"
}, (opts) => updateLead.__executeServer(opts));
var updateLead = createServerFn({ method: "POST" }).validator((input) => input).handler(updateLead_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const cur = (await sql`select * from leads where id = ${data.id}`)[0];
	if (!cur) return { ok: false };
	await sql`update leads set status = ${data.status ?? String(cur.status)}, owner_id = ${data.ownerId ?? cur.owner_id}, score = ${data.score ?? Number(cur.score)} where id = ${data.id}`;
	return { ok: true };
});
var listPeople_createServerFn_handler = createServerRpc({
	id: "28470d4cfdce369efb89424da3baa1b22a0f0b4ffd1babe4910d25de3d9caaac",
	name: "listPeople",
	filename: "src/lib/crm/server.ts"
}, (opts) => listPeople.__executeServer(opts));
var listPeople = createServerFn({ method: "GET" }).handler(listPeople_createServerFn_handler, async () => {
	return (await (await getSql())`select p.*, o.name as org_name, m.name as owner_name,
    (select count(*) from deals d where d.person_id = p.id and d.status = 'open') as open_deals,
    (select coalesce(sum(d.value),0) from deals d where d.person_id = p.id and d.status = 'open') as deal_value
    from people p
    left join organizations o on o.id = p.org_id
    left join members m on m.id = p.owner_id
    order by p.name`).map(mapPerson);
});
var listOrgs_createServerFn_handler = createServerRpc({
	id: "177a7b6554228661f8ad8967ec30bb8c90f944bfe6c5669f743b80b4d2fb7fb9",
	name: "listOrgs",
	filename: "src/lib/crm/server.ts"
}, (opts) => listOrgs.__executeServer(opts));
var listOrgs = createServerFn({ method: "GET" }).handler(listOrgs_createServerFn_handler, async () => {
	return (await (await getSql())`select o.*, m.name as owner_name,
    (select count(*) from people p where p.org_id = o.id) as people_count,
    (select count(*) from deals d where d.org_id = o.id and d.status = 'open') as open_deals,
    (select coalesce(sum(d.value),0) from deals d where d.org_id = o.id and d.status = 'open') as deal_value
    from organizations o
    left join members m on m.id = o.owner_id
    order by o.name`).map(mapOrg);
});
var createPerson_createServerFn_handler = createServerRpc({
	id: "276446dd2be584e2429fcaa835cf632769a7f4102b4ed5d216c7945735d21ebb",
	name: "createPerson",
	filename: "src/lib/crm/server.ts"
}, (opts) => createPerson.__executeServer(opts));
var createPerson = createServerFn({ method: "POST" }).validator((input) => input).handler(createPerson_createServerFn_handler, async ({ data }) => {
	const rows = await (await getSql())`insert into people (name, email, phone, title, org_id, owner_id, city)
      values (${data.name}, ${data.email ?? null}, ${data.phone ?? null}, ${data.title ?? null}, ${data.orgId ?? null}, ${data.ownerId}, ${data.city ?? "New York"})
      returning id`;
	return { id: Number(rows[0].id) };
});
var createOrg_createServerFn_handler = createServerRpc({
	id: "cbe09202cb5e2168349a9d5c7b6a552627ab7ac471176fa6c47c9813dd6b53c7",
	name: "createOrg",
	filename: "src/lib/crm/server.ts"
}, (opts) => createOrg.__executeServer(opts));
var createOrg = createServerFn({ method: "POST" }).validator((input) => input).handler(createOrg_createServerFn_handler, async ({ data }) => {
	const rows = await (await getSql())`insert into organizations (name, city, industry, website, owner_id)
      values (${data.name}, ${data.city ?? "New York"}, ${data.industry ?? "Events"}, ${data.website ?? null}, ${data.ownerId})
      returning id`;
	return { id: Number(rows[0].id) };
});
var listActivities_createServerFn_handler = createServerRpc({
	id: "0a4bda816681e87bafaaf31a344fbb047d2619552193112374805d697e74fcac",
	name: "listActivities",
	filename: "src/lib/crm/server.ts"
}, (opts) => listActivities.__executeServer(opts));
var listActivities = createServerFn({ method: "GET" }).validator((input = {}) => input).handler(listActivities_createServerFn_handler, async ({ data }) => {
	return (await (await getSql()).query(`select a.*, d.title as deal_title, p.name as person_name, o.name as org_name,
              m.name as owner_name, m.initials as owner_initials, m.tone as owner_tone
       from activities a
       left join deals d on d.id = a.deal_id
       left join people p on p.id = a.person_id
       left join organizations o on o.id = a.org_id
       left join members m on m.id = a.owner_id
       where ($1::int is null or a.owner_id = $1)
       order by a.due_at nulls last`, [data.ownerId ?? null])).map(mapActivity);
});
var createActivity_createServerFn_handler = createServerRpc({
	id: "5579849a083106c791c58697c2de300a27c1425393bd6124fea3ce495e5be301",
	name: "createActivity",
	filename: "src/lib/crm/server.ts"
}, (opts) => createActivity.__executeServer(opts));
var createActivity = createServerFn({ method: "POST" }).validator((input) => input).handler(createActivity_createServerFn_handler, async ({ data }) => {
	await (await getSql())`insert into activities (type, subject, owner_id, due_at, deal_id, person_id, org_id, location, duration_min)
      values (${data.type}, ${data.subject}, ${data.ownerId}, ${data.dueAt ?? null}, ${data.dealId ?? null}, ${data.personId ?? null}, ${data.orgId ?? null}, ${data.location ?? null}, ${data.durationMin ?? 30})`;
	return { ok: true };
});
var toggleActivity_createServerFn_handler = createServerRpc({
	id: "a064b50503311022a543709bb2f6936f3f0dc136c1296b3b63cd9febe683bec1",
	name: "toggleActivity",
	filename: "src/lib/crm/server.ts"
}, (opts) => toggleActivity.__executeServer(opts));
var toggleActivity = createServerFn({ method: "POST" }).validator((input) => input).handler(toggleActivity_createServerFn_handler, async ({ data }) => {
	await (await getSql())`update activities set done = ${data.done} where id = ${data.id}`;
	return { ok: true };
});
var listProducts_createServerFn_handler = createServerRpc({
	id: "4cc6da6bbc631aea662f4a53eca033ff60e19aad92505326ea31729d0e2f18b0",
	name: "listProducts",
	filename: "src/lib/crm/server.ts"
}, (opts) => listProducts.__executeServer(opts));
var listProducts = createServerFn({ method: "GET" }).handler(listProducts_createServerFn_handler, async () => {
	return (await (await getSql())`select * from products order by category, name`).map(mapProduct);
});
var createProduct_createServerFn_handler = createServerRpc({
	id: "aeb4116aa544918a20dd749db8e62a8db6ed5a013c5bb13c1d036f421bf114df",
	name: "createProduct",
	filename: "src/lib/crm/server.ts"
}, (opts) => createProduct.__executeServer(opts));
var createProduct = createServerFn({ method: "POST" }).validator((input) => input).handler(createProduct_createServerFn_handler, async ({ data }) => {
	await (await getSql())`insert into products (name, category, unit_price, unit, sku, billing)
      values (${data.name}, ${data.category}, ${data.unitPrice}, ${data.unit}, ${data.sku ?? null}, ${data.billing ?? "one-time"})`;
	return { ok: true };
});
var listProjects_createServerFn_handler = createServerRpc({
	id: "fcb882bfefe2490559cc1cdb8b3dc88bfbc52f8255e0b149cd9512b2deffe166",
	name: "listProjects",
	filename: "src/lib/crm/server.ts"
}, (opts) => listProjects.__executeServer(opts));
var listProjects = createServerFn({ method: "GET" }).handler(listProjects_createServerFn_handler, async () => {
	return (await (await getSql())`select pr.*, d.title as deal_title, d.venue, m.name as owner_name,
    (select count(*) from project_tasks t where t.project_id = pr.id) as task_count,
    (select count(*) from project_tasks t where t.project_id = pr.id and t.column_name = 'Done') as done_count
    from projects pr
    left join deals d on d.id = pr.deal_id
    left join members m on m.id = pr.owner_id
    order by pr.status, pr.end_date nulls last`).map(mapProject);
});
var getProject_createServerFn_handler = createServerRpc({
	id: "43343f15e025d60cca1f45a8c5fd5c2d5b04e25d00d135ad28e58e60768a01e4",
	name: "getProject",
	filename: "src/lib/crm/server.ts"
}, (opts) => getProject.__executeServer(opts));
var getProject = createServerFn({ method: "GET" }).validator((input) => input).handler(getProject_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const rows = await sql`select pr.*, d.title as deal_title, d.venue, m.name as owner_name,
      (select count(*) from project_tasks t where t.project_id = pr.id) as task_count,
      (select count(*) from project_tasks t where t.project_id = pr.id and t.column_name = 'Done') as done_count
      from projects pr
      left join deals d on d.id = pr.deal_id
      left join members m on m.id = pr.owner_id
      where pr.id = ${data.id}`;
	if (!rows[0]) return null;
	const tasks = (await sql`select t.*, m.name as assignee_name from project_tasks t left join members m on m.id = t.assignee_id where t.project_id = ${data.id} order by t.sort_order`).map(mapTask);
	return {
		project: mapProject(rows[0]),
		tasks
	};
});
var moveTask_createServerFn_handler = createServerRpc({
	id: "f4fb5ebe4529d2a0ae5448376a411d579f23bc2376c7b5d07b983a4ab37e6775",
	name: "moveTask",
	filename: "src/lib/crm/server.ts"
}, (opts) => moveTask.__executeServer(opts));
var moveTask = createServerFn({ method: "POST" }).validator((input) => input).handler(moveTask_createServerFn_handler, async ({ data }) => {
	await (await getSql())`update project_tasks set column_name = ${data.columnName} where id = ${data.id}`;
	return { ok: true };
});
var addTask_createServerFn_handler = createServerRpc({
	id: "e7f373e4fb3f80fd85659fd0ed89f80405b272c61f8c03f9484ac77964a06b85",
	name: "addTask",
	filename: "src/lib/crm/server.ts"
}, (opts) => addTask.__executeServer(opts));
var addTask = createServerFn({ method: "POST" }).validator((input) => input).handler(addTask_createServerFn_handler, async ({ data }) => {
	await (await getSql())`insert into project_tasks (project_id, title, column_name, assignee_id) values (${data.projectId}, ${data.title}, ${"To do"}, ${data.assigneeId ?? null})`;
	return { ok: true };
});
var listEmails_createServerFn_handler = createServerRpc({
	id: "2db3b254b3413d78fe2948b168951847b45d6563b7405bf6361824938f994e9f",
	name: "listEmails",
	filename: "src/lib/crm/server.ts"
}, (opts) => listEmails.__executeServer(opts));
var listEmails = createServerFn({ method: "GET" }).validator((input = {}) => input).handler(listEmails_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const folder = data.folder ?? "inbox";
	return (await sql.query(`select e.*, d.title as deal_title from emails e left join deals d on d.id = e.deal_id
       where ($1 = 'all' or e.folder = $1)
       order by coalesce(e.sent_at, e.created_at) desc`, [folder])).map(mapEmail);
});
var listTemplates_createServerFn_handler = createServerRpc({
	id: "6007178782253bee5d623f6eede20fd6b2985637f923bc4397563346a59c20b6",
	name: "listTemplates",
	filename: "src/lib/crm/server.ts"
}, (opts) => listTemplates.__executeServer(opts));
var listTemplates = createServerFn({ method: "GET" }).handler(listTemplates_createServerFn_handler, async () => {
	return (await (await getSql())`select * from email_templates order by id`).map((t) => ({
		id: Number(t.id),
		name: String(t.name),
		subject: String(t.subject),
		body: String(t.body)
	}));
});
var sendEmail_createServerFn_handler = createServerRpc({
	id: "265efa4634c6d815adff3363a49e0e2e1e018979d1f831e99629604863c78321",
	name: "sendEmail",
	filename: "src/lib/crm/server.ts"
}, (opts) => sendEmail.__executeServer(opts));
var sendEmail = createServerFn({ method: "POST" }).validator((input) => input).handler(sendEmail_createServerFn_handler, async ({ data }) => {
	await (await getSql())`insert into emails (folder, from_name, from_addr, to_addr, subject, body, deal_id, opened, clicked, sent_at)
      values (${data.folder ?? "sent"}, ${data.fromName}, ${data.fromAddr}, ${data.toAddr}, ${data.subject}, ${data.body}, ${data.dealId ?? null}, false, false, now())`;
	return { ok: true };
});
var listDocuments_createServerFn_handler = createServerRpc({
	id: "2c4073a01e48e169265a439d4cd8d34fad72909ce086657d42cec1529aa2fc03",
	name: "listDocuments",
	filename: "src/lib/crm/server.ts"
}, (opts) => listDocuments.__executeServer(opts));
var listDocuments = createServerFn({ method: "GET" }).handler(listDocuments_createServerFn_handler, async () => {
	return (await (await getSql())`select doc.*, d.title as deal_title from documents doc left join deals d on d.id = doc.deal_id order by doc.created_at desc`).map(mapDoc);
});
var createDocument_createServerFn_handler = createServerRpc({
	id: "63ae43edaaad14d2f2ce474ea5ffd396eb24bcb2b4d84e5c2ee31023ef4cf84d",
	name: "createDocument",
	filename: "src/lib/crm/server.ts"
}, (opts) => createDocument.__executeServer(opts));
var createDocument = createServerFn({ method: "POST" }).validator((input) => input).handler(createDocument_createServerFn_handler, async ({ data }) => {
	await (await getSql())`insert into documents (name, deal_id, template, status, content) values (${data.name}, ${data.dealId ?? null}, ${data.template}, ${"draft"}, ${data.content})`;
	return { ok: true };
});
var advanceDocument_createServerFn_handler = createServerRpc({
	id: "b94b10e00e53030a4b0e9e5921cabce341382ea8bb726f9c62bd6c1731cedffb",
	name: "advanceDocument",
	filename: "src/lib/crm/server.ts"
}, (opts) => advanceDocument.__executeServer(opts));
var advanceDocument = createServerFn({ method: "POST" }).validator((input) => input).handler(advanceDocument_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	if (data.action === "send") await sql`update documents set status = 'sent', sent_at = now() where id = ${data.id}`;
	if (data.action === "view") await sql`update documents set status = 'viewed', viewed_at = now() where id = ${data.id}`;
	if (data.action === "sign") await sql`update documents set status = 'signed', signed_at = now() where id = ${data.id}`;
	if (data.action === "decline") await sql`update documents set status = 'declined' where id = ${data.id}`;
	return { ok: true };
});
var listAutomations_createServerFn_handler = createServerRpc({
	id: "12befde8a803ce3f9b603c52148180ca22d161b2854cb9c6f42d96ab6433ef59",
	name: "listAutomations",
	filename: "src/lib/crm/server.ts"
}, (opts) => listAutomations.__executeServer(opts));
var listAutomations = createServerFn({ method: "GET" }).handler(listAutomations_createServerFn_handler, async () => {
	return (await (await getSql())`select * from automations order by id`).map((a) => ({
		id: Number(a.id),
		name: String(a.name),
		active: Boolean(a.active),
		triggerType: String(a.trigger_type),
		triggerDetail: a.trigger_detail == null ? null : String(a.trigger_detail),
		actionType: String(a.action_type),
		actionDetail: a.action_detail == null ? null : String(a.action_detail),
		conditions: a.conditions == null ? null : String(a.conditions),
		runs: Number(a.runs)
	}));
});
var toggleAutomation_createServerFn_handler = createServerRpc({
	id: "bf1ea20eaf95c9ddf2970f8cf22384b7a31e32f0978f2f224bd6096ae960e0aa",
	name: "toggleAutomation",
	filename: "src/lib/crm/server.ts"
}, (opts) => toggleAutomation.__executeServer(opts));
var toggleAutomation = createServerFn({ method: "POST" }).validator((input) => input).handler(toggleAutomation_createServerFn_handler, async ({ data }) => {
	await (await getSql())`update automations set active = ${data.active} where id = ${data.id}`;
	return { ok: true };
});
var createAutomation_createServerFn_handler = createServerRpc({
	id: "338b3dcb876ff6a240b196d3a776244d480494e11bf0e1465e792cc8c4a164d6",
	name: "createAutomation",
	filename: "src/lib/crm/server.ts"
}, (opts) => createAutomation.__executeServer(opts));
var createAutomation = createServerFn({ method: "POST" }).validator((input) => input).handler(createAutomation_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const cap = await assertCap("automations");
	if (cap) return {
		ok: false,
		error: cap
	};
	await sql`insert into automations (name, trigger_type, trigger_detail, action_type, action_detail, active)
      values (${data.name}, ${data.triggerType}, ${data.triggerDetail}, ${data.actionType}, ${data.actionDetail}, true)`;
	return {
		ok: true,
		error: null
	};
});
var listSequences_createServerFn_handler = createServerRpc({
	id: "11e5d6400ab8074f41cc011a761be1d10c739f79119f6692c0481b5780b72cf8",
	name: "listSequences",
	filename: "src/lib/crm/server.ts"
}, (opts) => listSequences.__executeServer(opts));
var listSequences = createServerFn({ method: "GET" }).handler(listSequences_createServerFn_handler, async () => {
	return (await (await getSql())`select * from sequences order by id`).map((s) => {
		const steps = typeof s.steps === "string" ? JSON.parse(s.steps) : s.steps;
		return {
			id: Number(s.id),
			name: String(s.name),
			active: Boolean(s.active),
			steps: steps ?? [],
			enrolled: Number(s.enrolled)
		};
	});
});
var toggleSequence_createServerFn_handler = createServerRpc({
	id: "92adbf909ab79db9e811e7393bd471e8f04e402aa5efebee5e918a9b7a673c82",
	name: "toggleSequence",
	filename: "src/lib/crm/server.ts"
}, (opts) => toggleSequence.__executeServer(opts));
var toggleSequence = createServerFn({ method: "POST" }).validator((input) => input).handler(toggleSequence_createServerFn_handler, async ({ data }) => {
	await (await getSql())`update sequences set active = ${data.active} where id = ${data.id}`;
	return { ok: true };
});
var listChats_createServerFn_handler = createServerRpc({
	id: "b81078ef238d619f1f671d784712a343e7e65db5dcbe3f29a39465109cd4b6f0",
	name: "listChats",
	filename: "src/lib/crm/server.ts"
}, (opts) => listChats.__executeServer(opts));
var listChats = createServerFn({ method: "GET" }).handler(listChats_createServerFn_handler, async () => {
	const sql = await getSql();
	const chats = await sql`select c.*, m.name as assignee_name from chats c left join members m on m.id = c.assignee_id order by c.updated_at desc`;
	const messages = await sql`select * from chat_messages order by created_at`;
	return chats.map((c) => ({
		id: Number(c.id),
		visitorName: String(c.visitor_name),
		visitorEmail: c.visitor_email == null ? null : String(c.visitor_email),
		status: String(c.status),
		assigneeId: c.assignee_id == null ? null : Number(c.assignee_id),
		assigneeName: c.assignee_name == null ? null : String(c.assignee_name),
		source: String(c.source),
		lastMessage: c.last_message == null ? null : String(c.last_message),
		updatedAt: iso(c.updated_at) ?? "",
		messages: messages.filter((m) => Number(m.chat_id) === Number(c.id)).map((m) => ({
			id: Number(m.id),
			chatId: Number(m.chat_id),
			sender: String(m.sender),
			body: String(m.body),
			createdAt: iso(m.created_at) ?? ""
		}))
	}));
});
var sendChat_createServerFn_handler = createServerRpc({
	id: "ea3b1c7a65066ea4a8f655fbd3dde340da3ac64b2dc384ccc045a5444ee79349",
	name: "sendChat",
	filename: "src/lib/crm/server.ts"
}, (opts) => sendChat.__executeServer(opts));
var sendChat = createServerFn({ method: "POST" }).validator((input) => input).handler(sendChat_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	await sql`insert into chat_messages (chat_id, sender, body) values (${data.chatId}, ${data.sender}, ${data.body})`;
	await sql`update chats set last_message = ${data.body}, updated_at = now() where id = ${data.chatId}`;
	return { ok: true };
});
var listProspects_createServerFn_handler = createServerRpc({
	id: "9812a299ae813329300c5ddd1c9da7c202df014c4b7063561854dda7d5ca1676",
	name: "listProspects",
	filename: "src/lib/crm/server.ts"
}, (opts) => listProspects.__executeServer(opts));
var listProspects = createServerFn({ method: "GET" }).handler(listProspects_createServerFn_handler, async () => {
	return (await (await getSql())`select * from prospect_companies order by name`).map((p) => ({
		id: Number(p.id),
		name: String(p.name),
		industry: p.industry == null ? null : String(p.industry),
		city: p.city == null ? null : String(p.city),
		employees: p.employees == null ? null : String(p.employees),
		website: p.website == null ? null : String(p.website),
		email: p.email == null ? null : String(p.email),
		phone: p.phone == null ? null : String(p.phone),
		added: Boolean(p.added)
	}));
});
var addProspect_createServerFn_handler = createServerRpc({
	id: "b35b59d5955ca97ae48017ec00ab278f901ff1d26cef5b01575a2be3468f9c2e",
	name: "addProspect",
	filename: "src/lib/crm/server.ts"
}, (opts) => addProspect.__executeServer(opts));
var addProspect = createServerFn({ method: "POST" }).validator((input) => input).handler(addProspect_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const p = (await sql`select * from prospect_companies where id = ${data.id}`)[0];
	if (!p) return { ok: false };
	await sql`update prospect_companies set added = true where id = ${data.id}`;
	const org = await sql`insert into organizations (name, website, city, industry, owner_id, phone)
      values (${String(p.name)}, ${p.website == null ? null : String(p.website)}, ${p.city == null ? null : String(p.city)}, ${p.industry == null ? null : String(p.industry)}, ${data.ownerId}, ${p.phone == null ? null : String(p.phone)})
      returning id`;
	await sql`insert into leads (title, org_id, owner_id, source, score, notes)
      values (${`${String(p.name)} — outbound`}, ${Number(org[0].id)}, ${data.ownerId}, ${"Prospector"}, ${55}, ${p.email == null ? null : String(p.email)})`;
	return { ok: true };
});
var listScheduler_createServerFn_handler = createServerRpc({
	id: "d11e09cec47a1dc451f14ece49f36f0166bf9b644de5ea8c6c523e6e1fb9c291",
	name: "listScheduler",
	filename: "src/lib/crm/server.ts"
}, (opts) => listScheduler.__executeServer(opts));
var listScheduler = createServerFn({ method: "GET" }).handler(listScheduler_createServerFn_handler, async () => {
	const sql = await getSql();
	return {
		links: (await sql`select s.*, m.name as member_name from scheduler_links s left join members m on m.id = s.member_id`).map((s) => ({
			id: Number(s.id),
			memberId: s.member_id == null ? null : Number(s.member_id),
			memberName: s.member_name == null ? null : String(s.member_name),
			name: String(s.name),
			durationMin: Number(s.duration_min),
			slug: String(s.slug),
			bookings: Number(s.bookings),
			source: s.source == null ? "northline" : String(s.source),
			calendlyUrl: s.calendly_url == null ? null : String(s.calendly_url),
			locationKind: s.location_kind == null ? "zoom" : String(s.location_kind)
		})),
		bookings: (await sql`select * from bookings order by starts_at`).map((b) => ({
			id: Number(b.id),
			linkId: b.link_id == null ? null : Number(b.link_id),
			guestName: String(b.guest_name),
			guestEmail: String(b.guest_email),
			startsAt: iso(b.starts_at) ?? "",
			notes: b.notes == null ? null : String(b.notes),
			status: b.status == null ? "confirmed" : String(b.status),
			durationMin: b.duration_min == null ? void 0 : Number(b.duration_min),
			zoomJoinUrl: b.zoom_join_url == null ? null : String(b.zoom_join_url),
			zoomPasscode: b.zoom_passcode == null ? null : String(b.zoom_passcode),
			confirmationSentAt: iso(b.confirmation_sent_at),
			calendlyEventUri: b.calendly_event_uri == null ? null : String(b.calendly_event_uri)
		}))
	};
});
var bookSlot_createServerFn_handler = createServerRpc({
	id: "8d99d1665fc6984c68a4060df237e502e65a80a98f50bd8f2bfd64125c035c6d",
	name: "bookSlot",
	filename: "src/lib/crm/server.ts"
}, (opts) => bookSlot.__executeServer(opts));
var bookSlot = createServerFn({ method: "POST" }).validator((input) => input).handler(bookSlot_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const inserted = await sql.query(`insert into bookings (link_id, guest_name, guest_email, starts_at, notes, status)
       values ($1,$2,$3,$4,$5,'confirmed') returning id`, [
		data.linkId,
		data.guestName,
		data.guestEmail,
		data.startsAt,
		data.notes ?? null
	]);
	await sql`update scheduler_links set bookings = bookings + 1 where id = ${data.linkId}`;
	const link = (await sql`select member_id, name, duration_min from scheduler_links where id = ${data.linkId}`)[0];
	const duration = Number(link?.duration_min ?? 30);
	await sql`insert into activities (type, subject, owner_id, due_at, duration_min)
      values (${"meeting"}, ${`${data.guestName} — ${String(link?.name ?? "Meeting")}`}, ${link?.member_id == null ? 1 : Number(link.member_id)}, ${data.startsAt}, ${duration})`;
	const bookingId = Number(inserted[0].id);
	return {
		ok: true,
		...await completeNewBooking(sql, bookingId) ?? {}
	};
});
var listNotifications_createServerFn_handler = createServerRpc({
	id: "d76bab05cbc525d89b473acd268ef193e8aeb41808d78a6fad1ff57f1c2c53b5",
	name: "listNotifications",
	filename: "src/lib/crm/server.ts"
}, (opts) => listNotifications.__executeServer(opts));
var listNotifications = createServerFn({ method: "GET" }).validator((input = {}) => input).handler(listNotifications_createServerFn_handler, async ({ data }) => {
	return (await (await getSql()).query(`select * from notifications where ($1::int is null or member_id = $1) order by created_at desc limit 30`, [data.memberId ?? null])).map((n) => ({
		id: Number(n.id),
		memberId: n.member_id == null ? null : Number(n.member_id),
		kind: String(n.kind),
		title: String(n.title),
		body: String(n.body),
		href: n.href == null ? null : String(n.href),
		read: Boolean(n.read),
		createdAt: iso(n.created_at) ?? ""
	}));
});
var markNotificationsRead_createServerFn_handler = createServerRpc({
	id: "adaaf188833a32955a2aa325aeef3fd4ea05ed40cd2385bd9621c31c148bcbcf",
	name: "markNotificationsRead",
	filename: "src/lib/crm/server.ts"
}, (opts) => markNotificationsRead.__executeServer(opts));
var markNotificationsRead = createServerFn({ method: "POST" }).validator((input) => input).handler(markNotificationsRead_createServerFn_handler, async ({ data }) => {
	await (await getSql())`update notifications set read = true where member_id = ${data.memberId}`;
	return { ok: true };
});
var getPulse_createServerFn_handler = createServerRpc({
	id: "94753740b8ec891b0ee5fd55634503990f5bbc0e003d13a1447b9039f81d9482",
	name: "getPulse",
	filename: "src/lib/crm/server.ts"
}, (opts) => getPulse.__executeServer(opts));
var getPulse = createServerFn({ method: "GET" }).handler(getPulse_createServerFn_handler, async () => {
	const sql = await getSql();
	const rotting = await sql.query(`select d.id, d.title, s.rotting_days,
            extract(epoch from (now() - d.stage_entered_at))/86400.0 as days
     from deals d join stages s on s.id = d.stage_id
     where d.status = 'open' and extract(epoch from (now() - d.stage_entered_at))/86400.0 > s.rotting_days`);
	const overdue = await sql`select a.id, a.subject, a.due_at, d.title as deal_title
    from activities a left join deals d on d.id = a.deal_id
    where a.done = false and a.due_at < now()`;
	const mentions = await sql`select c.id, c.body, c.created_at, m.name from comments c left join members m on m.id = c.author_id
    where c.body like '%@%' order by c.created_at desc limit 8`;
	const items = [];
	for (const r of rotting) items.push({
		id: `rot-${r.id}`,
		kind: "rot",
		title: String(r.title),
		body: `${Math.floor(Number(r.days))} days in stage · rotting after ${r.rotting_days}`,
		href: `/deals/${r.id}`,
		at: (/* @__PURE__ */ new Date()).toISOString()
	});
	for (const r of overdue) items.push({
		id: `ov-${r.id}`,
		kind: "overdue",
		title: String(r.subject),
		body: r.deal_title ? String(r.deal_title) : "Activity overdue",
		href: "/activities",
		at: iso(r.due_at) ?? ""
	});
	for (const r of mentions) items.push({
		id: `mn-${r.id}`,
		kind: "mention",
		title: `${r.name ?? "Teammate"} mentioned someone`,
		body: String(r.body),
		href: "/",
		at: iso(r.created_at) ?? ""
	});
	return items.slice(0, 24);
});
var getInsights_createServerFn_handler = createServerRpc({
	id: "507448c32c2c2536f14b5743f82c578e9beb9a9c7da5568221d76a5ae04735f3",
	name: "getInsights",
	filename: "src/lib/crm/server.ts"
}, (opts) => getInsights.__executeServer(opts));
var getInsights = createServerFn({ method: "GET" }).handler(getInsights_createServerFn_handler, async () => {
	const sql = await getSql();
	const deals = await sql`select d.*, s.name as stage_name, s.probability as stage_probability, m.name as owner_name
    from deals d left join stages s on s.id = d.stage_id left join members m on m.id = d.owner_id`;
	const activities = await sql`select done, due_at from activities`;
	const open = deals.filter((d) => d.status === "open");
	const won = deals.filter((d) => d.status === "won");
	const lost = deals.filter((d) => d.status === "lost");
	const openValue = open.reduce((s, d) => s + money(d.value), 0);
	const wonValue = won.reduce((s, d) => s + money(d.value), 0);
	const lostValue = lost.reduce((s, d) => s + money(d.value), 0);
	const weightedValue = open.reduce((s, d) => s + money(d.value) * (Number(d.probability ?? d.stage_probability ?? 0) / 100), 0);
	const closed = won.length + lost.length;
	const rottingCount = open.filter((d) => {
		const entered = d.stage_entered_at ? new Date(String(d.stage_entered_at)).getTime() : Date.now();
		return Date.now() - entered > 864e6;
	}).length;
	const byStageMap = /* @__PURE__ */ new Map();
	for (const d of open) {
		const name = String(d.stage_name ?? "—");
		const cur = byStageMap.get(name) ?? {
			value: 0,
			count: 0
		};
		cur.value += money(d.value);
		cur.count += 1;
		byStageMap.set(name, cur);
	}
	const byOwnerMap = /* @__PURE__ */ new Map();
	for (const d of deals) {
		const name = String(d.owner_name ?? "Unassigned");
		const cur = byOwnerMap.get(name) ?? {
			value: 0,
			won: 0
		};
		if (d.status === "open") cur.value += money(d.value);
		if (d.status === "won") cur.won += money(d.value);
		byOwnerMap.set(name, cur);
	}
	const bySourceMap = /* @__PURE__ */ new Map();
	for (const d of open) {
		const name = String(d.source ?? "Unknown");
		bySourceMap.set(name, (bySourceMap.get(name) ?? 0) + money(d.value));
	}
	const months = [];
	for (let i = 5; i >= 0; i--) {
		const dt = /* @__PURE__ */ new Date();
		dt.setDate(1);
		dt.setMonth(dt.getMonth() - i);
		const key = dt.toLocaleString("en-US", { month: "short" });
		const y = dt.getFullYear();
		const m = dt.getMonth();
		const wonM = won.filter((d) => {
			const t = d.won_at ? new Date(String(d.won_at)) : null;
			return t && t.getFullYear() === y && t.getMonth() === m;
		}).reduce((s, d) => s + money(d.value), 0);
		const openM = open.reduce((s, d) => s + money(d.value) / 6, 0);
		months.push({
			month: key,
			won: wonM,
			open: Math.round(openM)
		});
	}
	const activityWeek = [];
	for (let i = 6; i >= 0; i--) {
		const dt = /* @__PURE__ */ new Date();
		dt.setHours(0, 0, 0, 0);
		dt.setDate(dt.getDate() - i);
		const next = new Date(dt);
		next.setDate(dt.getDate() + 1);
		const dayActs = activities.filter((a) => {
			if (!a.due_at) return false;
			const t = new Date(String(a.due_at)).getTime();
			return t >= dt.getTime() && t < next.getTime();
		});
		activityWeek.push({
			day: dt.toLocaleString("en-US", { weekday: "short" }),
			done: dayActs.filter((a) => a.done).length,
			planned: dayActs.length
		});
	}
	return {
		openValue,
		wonValue,
		lostValue,
		weightedValue,
		winRate: closed ? Math.round(won.length / closed * 100) : 0,
		avgDeal: won.length ? Math.round(wonValue / won.length) : 0,
		openCount: open.length,
		wonCount: won.length,
		rottingCount,
		overdueActivities: activities.filter((a) => !a.done && a.due_at && new Date(String(a.due_at)) < /* @__PURE__ */ new Date()).length,
		byStage: [...byStageMap.entries()].map(([name, v]) => ({
			name,
			...v
		})),
		byOwner: [...byOwnerMap.entries()].map(([name, v]) => ({
			name,
			...v
		})),
		byMonth: months,
		bySource: [...bySourceMap.entries()].map(([name, value]) => ({
			name,
			value
		})),
		activityWeek
	};
});
var getSecurity_createServerFn_handler = createServerRpc({
	id: "1b8a11ff8dc1a2a31fd3c0dec3be89f7ae253e3ccf587474ceabf2969ff5c076",
	name: "getSecurity",
	filename: "src/lib/crm/server.ts"
}, (opts) => getSecurity.__executeServer(opts));
var getSecurity = createServerFn({ method: "GET" }).handler(getSecurity_createServerFn_handler, async () => {
	const sql = await getSql();
	return {
		alerts: (await sql`select * from security_alerts order by created_at desc`).map((a) => ({
			id: Number(a.id),
			severity: String(a.severity),
			title: String(a.title),
			detail: String(a.detail),
			resolved: Boolean(a.resolved),
			createdAt: iso(a.created_at) ?? ""
		})),
		rules: (await sql`select * from security_rules order by id`).map((r) => ({
			id: Number(r.id),
			name: String(r.name),
			detail: String(r.detail),
			active: Boolean(r.active)
		})),
		devices: (await sql`select * from devices order by last_active desc`).map((d) => ({
			id: Number(d.id),
			memberName: String(d.member_name),
			device: String(d.device),
			location: String(d.location),
			lastActive: iso(d.last_active) ?? "",
			current: Boolean(d.current)
		})),
		auditLog: (await sql`select * from audit_log order by created_at desc limit 40`).map((a) => ({
			id: Number(a.id),
			actor: String(a.actor),
			action: String(a.action),
			entity: String(a.entity),
			detail: a.detail == null ? null : String(a.detail),
			ip: a.ip == null ? null : String(a.ip),
			device: a.device == null ? null : String(a.device),
			createdAt: iso(a.created_at) ?? ""
		})),
		webhooks: (await sql`select * from webhooks order by id`).map((w) => ({
			id: Number(w.id),
			url: String(w.url),
			event: String(w.event),
			active: Boolean(w.active),
			lastStatus: w.last_status == null ? null : String(w.last_status)
		}))
	};
});
var toggleRule_createServerFn_handler = createServerRpc({
	id: "427baff95144cc91cb08311e9018ab6ff6dcc145b2b79fa1a45940cb6f7d0209",
	name: "toggleRule",
	filename: "src/lib/crm/server.ts"
}, (opts) => toggleRule.__executeServer(opts));
var toggleRule = createServerFn({ method: "POST" }).validator((input) => input).handler(toggleRule_createServerFn_handler, async ({ data }) => {
	await (await getSql())`update security_rules set active = ${data.active} where id = ${data.id}`;
	return { ok: true };
});
var resolveAlert_createServerFn_handler = createServerRpc({
	id: "2a24214969fd18af33f91899c1d3a28ddba51082fe5b0ecf4a85b8a0f6ba047b",
	name: "resolveAlert",
	filename: "src/lib/crm/server.ts"
}, (opts) => resolveAlert.__executeServer(opts));
var resolveAlert = createServerFn({ method: "POST" }).validator((input) => input).handler(resolveAlert_createServerFn_handler, async ({ data }) => {
	await (await getSql())`update security_alerts set resolved = true where id = ${data.id}`;
	return { ok: true };
});
var listFields_createServerFn_handler = createServerRpc({
	id: "6a8521f06900de506453cecb23ce883c90e99936cc8e18cebcf02170362ee023",
	name: "listFields",
	filename: "src/lib/crm/server.ts"
}, (opts) => listFields.__executeServer(opts));
var listFields = createServerFn({ method: "GET" }).handler(listFields_createServerFn_handler, async () => {
	return (await (await getSql())`select * from custom_fields order by id`).map((f) => ({
		id: Number(f.id),
		entity: String(f.entity),
		name: String(f.name),
		fieldType: String(f.field_type),
		options: f.options == null ? null : String(f.options),
		required: Boolean(f.required),
		pipelineId: f.pipeline_id == null ? null : Number(f.pipeline_id)
	}));
});
var createField_createServerFn_handler = createServerRpc({
	id: "acbdb3ad15396fe2c7dd1c462c17ffa2bd698a9f2fb0e158345c1dc552b351f4",
	name: "createField",
	filename: "src/lib/crm/server.ts"
}, (opts) => createField.__executeServer(opts));
var createField = createServerFn({ method: "POST" }).validator((input) => input).handler(createField_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const cap = await assertCap("fields");
	if (cap) return {
		ok: false,
		error: cap
	};
	await sql`insert into custom_fields (entity, name, field_type, required, pipeline_id)
      values (${data.entity}, ${data.name}, ${data.fieldType}, ${data.required}, ${data.pipelineId ?? null})`;
	return {
		ok: true,
		error: null
	};
});
var listMarketplace_createServerFn_handler = createServerRpc({
	id: "19f84c1309f43d5519013e0ddc8ff161c3040d1acb015779c552a8cc67fda286",
	name: "listMarketplace",
	filename: "src/lib/crm/server.ts"
}, (opts) => listMarketplace.__executeServer(opts));
var listMarketplace = createServerFn({ method: "GET" }).handler(listMarketplace_createServerFn_handler, async () => {
	return (await (await getSql())`select * from marketplace_apps order by category, name`).map((a) => ({
		id: Number(a.id),
		name: String(a.name),
		category: String(a.category),
		description: String(a.description),
		connected: Boolean(a.connected)
	}));
});
var toggleApp_createServerFn_handler = createServerRpc({
	id: "a077e7974f61c5b06a3f5f44c1ac28c11b5aa5e0a0ddedfe2390769c510b432f",
	name: "toggleApp",
	filename: "src/lib/crm/server.ts"
}, (opts) => toggleApp.__executeServer(opts));
var toggleApp = createServerFn({ method: "POST" }).validator((input) => input).handler(toggleApp_createServerFn_handler, async ({ data }) => {
	await (await getSql())`update marketplace_apps set connected = ${data.connected} where id = ${data.id}`;
	return { ok: true };
});
var listScores_createServerFn_handler = createServerRpc({
	id: "d9551306d049c946aa8513cb1ff5ee793c28d7ece41a9619db3ade099737d6c0",
	name: "listScores",
	filename: "src/lib/crm/server.ts"
}, (opts) => listScores.__executeServer(opts));
var listScores = createServerFn({ method: "GET" }).handler(listScores_createServerFn_handler, async () => {
	return (await (await getSql())`select * from score_models`).map((s) => {
		const rules = typeof s.rules === "string" ? JSON.parse(String(s.rules)) : s.rules;
		return {
			id: Number(s.id),
			name: String(s.name),
			entity: String(s.entity),
			rules: rules ?? [],
			active: Boolean(s.active)
		};
	});
});
var listReports_createServerFn_handler = createServerRpc({
	id: "1753a7c2bd0a38ad3555efdc2bf818d5667ff0cf2d7fa2c061ab02b650cad52b",
	name: "listReports",
	filename: "src/lib/crm/server.ts"
}, (opts) => listReports.__executeServer(opts));
var listReports = createServerFn({ method: "GET" }).handler(listReports_createServerFn_handler, async () => {
	return (await (await getSql())`select * from custom_reports`).map((r) => ({
		id: Number(r.id),
		name: String(r.name),
		kind: String(r.kind),
		config: typeof r.config === "string" ? JSON.parse(String(r.config)) : r.config
	}));
});
var createReport_createServerFn_handler = createServerRpc({
	id: "092e452659d04ffa311de43edb44b3eb281266fce36008f60639c1ce5bc2bdc2",
	name: "createReport",
	filename: "src/lib/crm/server.ts"
}, (opts) => createReport.__executeServer(opts));
var createReport = createServerFn({ method: "POST" }).validator((input) => input).handler(createReport_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const cap = await assertCap("reports");
	if (cap) return {
		ok: false,
		error: cap
	};
	await sql`insert into custom_reports (name, kind, config) values (${data.name}, ${data.kind}, '{}'::jsonb)`;
	return {
		ok: true,
		error: null
	};
});
var exportDealsCsv_createServerFn_handler = createServerRpc({
	id: "bd00faaeca7ebc3807e923c12aca2be8ff76878943ae1eaff5e38bf724b8175c",
	name: "exportDealsCsv",
	filename: "src/lib/crm/server.ts"
}, (opts) => exportDealsCsv.__executeServer(opts));
var exportDealsCsv = createServerFn({ method: "GET" }).validator((input) => input).handler(exportDealsCsv_createServerFn_handler, async ({ data }) => {
	const blocked = await guardAction("export");
	if (!blocked.ok) return {
		csv: "",
		error: blocked.reason ?? "Export blocked by access policy."
	};
	const rows = await (await getSql()).query(`select d.title, d.value, d.status, d.venue, d.event_date, o.name as org, m.name as owner, s.name as stage
       from deals d
       left join organizations o on o.id = d.org_id
       left join members m on m.id = d.owner_id
       left join stages s on s.id = d.stage_id
       where d.pipeline_id = $1
       order by d.value desc`, [data.pipelineId]);
	const header = "title,value,status,venue,event_date,org,owner,stage";
	const body = rows.map((r) => [
		r.title,
		r.value,
		r.status,
		r.venue,
		r.event_date,
		r.org,
		r.owner,
		r.stage
	].map((v) => `"${String(v ?? "").replaceAll("\"", "\"\"")}"`).join(",")).join("\n");
	await audit("Northline", "exported", "deals", "CSV export");
	return {
		csv: `${header}\n${body}`,
		error: null
	};
});
var mergePeople_createServerFn_handler = createServerRpc({
	id: "ec40a49d29167e63f96501aa076dd7e9dec07c10343c17392f1d0c753b94f096",
	name: "mergePeople",
	filename: "src/lib/crm/server.ts"
}, (opts) => mergePeople.__executeServer(opts));
var mergePeople = createServerFn({ method: "POST" }).validator((input) => input).handler(mergePeople_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	await sql`update deals set person_id = ${data.keepId} where person_id = ${data.dropId}`;
	await sql`update activities set person_id = ${data.keepId} where person_id = ${data.dropId}`;
	await sql`update emails set person_id = ${data.keepId} where person_id = ${data.dropId}`;
	await sql`update leads set person_id = ${data.keepId} where person_id = ${data.dropId}`;
	await sql`delete from people where id = ${data.dropId}`;
	return { ok: true };
});
var updateStage_createServerFn_handler = createServerRpc({
	id: "fa0a3f7f35a3f597c77e93ac2ca4caca79fe4941ad532a53990a03f140e803c2",
	name: "updateStage",
	filename: "src/lib/crm/server.ts"
}, (opts) => updateStage.__executeServer(opts));
var updateStage = createServerFn({ method: "POST" }).validator((input) => input).handler(updateStage_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const cur = (await sql`select * from stages where id = ${data.id}`)[0];
	if (!cur) return { ok: false };
	await sql`update stages set name = ${data.name ?? String(cur.name)}, rotting_days = ${data.rottingDays ?? Number(cur.rotting_days)}, probability = ${data.probability ?? Number(cur.probability)} where id = ${data.id}`;
	return { ok: true };
});
//#endregion
export { addComment_createServerFn_handler, addDealProduct_createServerFn_handler, addFileMeta_createServerFn_handler, addProspect_createServerFn_handler, addTask_createServerFn_handler, advanceDocument_createServerFn_handler, bookSlot_createServerFn_handler, convertLead_createServerFn_handler, createActivity_createServerFn_handler, createAutomation_createServerFn_handler, createDeal_createServerFn_handler, createDocument_createServerFn_handler, createField_createServerFn_handler, createLead_createServerFn_handler, createOrg_createServerFn_handler, createPerson_createServerFn_handler, createProduct_createServerFn_handler, createReport_createServerFn_handler, exportDealsCsv_createServerFn_handler, getBootstrap_createServerFn_handler, getDeal_createServerFn_handler, getInsights_createServerFn_handler, getProject_createServerFn_handler, getPulse_createServerFn_handler, getSecurity_createServerFn_handler, listActivities_createServerFn_handler, listAutomations_createServerFn_handler, listChats_createServerFn_handler, listDeals_createServerFn_handler, listDocuments_createServerFn_handler, listEmails_createServerFn_handler, listFields_createServerFn_handler, listLeads_createServerFn_handler, listMarketplace_createServerFn_handler, listNotifications_createServerFn_handler, listOrgs_createServerFn_handler, listPeople_createServerFn_handler, listProducts_createServerFn_handler, listProjects_createServerFn_handler, listProspects_createServerFn_handler, listReports_createServerFn_handler, listScheduler_createServerFn_handler, listScores_createServerFn_handler, listSequences_createServerFn_handler, listTemplates_createServerFn_handler, markNotificationsRead_createServerFn_handler, mergePeople_createServerFn_handler, moveDeal_createServerFn_handler, moveTask_createServerFn_handler, resolveAlert_createServerFn_handler, sendChat_createServerFn_handler, sendEmail_createServerFn_handler, setDealStatus_createServerFn_handler, toggleActivity_createServerFn_handler, toggleApp_createServerFn_handler, toggleAutomation_createServerFn_handler, toggleRule_createServerFn_handler, toggleSequence_createServerFn_handler, updateDeal_createServerFn_handler, updateLead_createServerFn_handler, updateStage_createServerFn_handler };
