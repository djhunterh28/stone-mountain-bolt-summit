import { r as createServerFn } from "./ssr.mjs";
import { d as iso, f as money, t as authMiddleware, u as getSql } from "./utils-DLVA4J7b.mjs";
import { r as consumeCredit } from "./governance-rJzhZAi0.mjs";
import { r as hashSha } from "./access-_g--lJdT.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { l as mapOrg, n as mapActivity, r as mapDeal, t as DEAL_SELECT, u as mapPerson } from "./map-BcvMRfsm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ultimate-DQjLMLvX.js
var NYC = {
	Finance: {
		lat: 40.7616,
		lng: -73.969,
		employees: "5,000+",
		revenue: "$1B+"
	},
	Culture: {
		lat: 40.7794,
		lng: -73.9632,
		employees: "200-500",
		revenue: "Nonprofit"
	},
	Retail: {
		lat: 40.7265,
		lng: -73.9936,
		employees: "10,000+",
		revenue: "$1B+"
	},
	Hospitality: {
		lat: 40.7408,
		lng: -74.0079,
		employees: "500-1,000",
		revenue: "$100–250M"
	},
	Venue: {
		lat: 40.7056,
		lng: -74.0016,
		employees: "50-200",
		revenue: "$10–50M"
	},
	Arena: {
		lat: 40.6826,
		lng: -73.9754,
		employees: "500+",
		revenue: "$250M+"
	},
	Media: {
		lat: 40.7105,
		lng: -74.012,
		employees: "1,000-5,000",
		revenue: "$250M–1B"
	},
	Fitness: {
		lat: 40.7536,
		lng: -73.9972,
		employees: "1,000-5,000",
		revenue: "$1B+"
	}
};
var listGoals_createServerFn_handler = createServerRpc({
	id: "703f1a10b84575fe2772b961309ec240e702ed8eac53928bffa5bc61ebf9e022",
	name: "listGoals",
	filename: "src/lib/crm/ultimate.ts"
}, (opts) => listGoals.__executeServer(opts));
var listGoals = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listGoals_createServerFn_handler, async () => {
	const sql = await getSql();
	let rows = [];
	try {
		rows = await sql`select g.*, m.name as owner_name, p.name as pipeline_name from goals g
      left join members m on m.id = g.owner_id
      left join pipelines p on p.id = g.pipeline_id
      order by g.id`;
	} catch {
		return [];
	}
	const out = [];
	for (const r of rows) {
		const kind = String(r.kind);
		const pipe = r.pipeline_id == null ? null : Number(r.pipeline_id);
		const owner = r.owner_id == null ? null : Number(r.owner_id);
		const start = iso(r.period_start);
		const end = iso(r.period_end);
		let current = 0;
		if (kind === "revenue") {
			const q = await sql.query(`select coalesce(sum(value),0) as v from deals
         where status = 'won' and won_at::date >= $1::date and won_at::date <= $2::date
           and ($3::int is null or pipeline_id = $3)`, [
				start,
				end,
				pipe
			]);
			current = money(q[0]?.v);
		} else if (kind === "won_deals") {
			const q = await sql.query(`select count(*) as c from deals
         where status = 'won' and won_at::date >= $1::date and won_at::date <= $2::date
           and ($3::int is null or pipeline_id = $3)`, [
				start,
				end,
				pipe
			]);
			current = Number(q[0]?.c ?? 0);
		} else {
			const q = await sql.query(`select count(*) as c from activities
         where due_at::date >= $1::date and due_at::date <= $2::date
           and ($3::int is null or owner_id = $3)`, [
				start,
				end,
				owner
			]);
			current = Number(q[0]?.c ?? 0);
		}
		out.push({
			id: Number(r.id),
			name: String(r.name),
			kind,
			target: money(r.target),
			current,
			periodStart: start ?? "",
			periodEnd: end ?? "",
			ownerId: owner,
			ownerName: r.owner_name == null ? null : String(r.owner_name),
			pipelineId: pipe,
			pipelineName: r.pipeline_name == null ? null : String(r.pipeline_name)
		});
	}
	return out;
});
var createGoal_createServerFn_handler = createServerRpc({
	id: "3d0d670fa8baef5ec09998928396782e6f2aa69179dcef929f2390a2150ba498",
	name: "createGoal",
	filename: "src/lib/crm/ultimate.ts"
}, (opts) => createGoal.__executeServer(opts));
var createGoal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createGoal_createServerFn_handler, async ({ data }) => {
	const rows = await (await getSql())`insert into goals (name, kind, target, period_start, period_end, owner_id, pipeline_id)
      values (${data.name}, ${data.kind}, ${data.target}, ${data.periodStart}, ${data.periodEnd}, ${data.ownerId ?? null}, ${data.pipelineId ?? null})
      returning id`;
	return { id: Number(rows[0].id) };
});
var getPersonDetail_createServerFn_handler = createServerRpc({
	id: "89b325c3582e1eccf85e8385f69b32d39922577a0cb53ce880a2e9419a71d902",
	name: "getPersonDetail",
	filename: "src/lib/crm/ultimate.ts"
}, (opts) => getPersonDetail.__executeServer(opts));
var getPersonDetail = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(getPersonDetail_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const rows = await sql`select p.*, o.name as org_name, m.name as owner_name,
      (select count(*) from deals d where d.person_id = p.id and d.status = 'open') as open_deals,
      (select coalesce(sum(d.value),0) from deals d where d.person_id = p.id and d.status = 'open') as deal_value
      from people p
      left join organizations o on o.id = p.org_id
      left join members m on m.id = p.owner_id
      where p.id = ${data.id}`;
	if (!rows[0]) return null;
	return {
		person: mapPerson(rows[0]),
		deals: (await sql.query(`select ${DEAL_SELECT} from deals d
         left join organizations o on o.id = d.org_id
         left join people p on p.id = d.person_id
         left join members m on m.id = d.owner_id
         left join stages s on s.id = d.stage_id
         where d.person_id = $1 order by d.updated_at desc`, [data.id])).map(mapDeal),
		activities: (await sql`select a.*, d.title as deal_title, p.name as person_name, o.name as org_name, m.name as owner_name, m.initials as owner_initials, m.tone as owner_tone
        from activities a
        left join deals d on d.id = a.deal_id
        left join people p on p.id = a.person_id
        left join organizations o on o.id = a.org_id
        left join members m on m.id = a.owner_id
        where a.person_id = ${data.id} order by a.due_at desc nulls last`).map(mapActivity)
	};
});
var getOrgDetail_createServerFn_handler = createServerRpc({
	id: "8dd2a408d8dff06e5fda84a188263c3945041c7798c3f893e1750d0905e25666",
	name: "getOrgDetail",
	filename: "src/lib/crm/ultimate.ts"
}, (opts) => getOrgDetail.__executeServer(opts));
var getOrgDetail = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(getOrgDetail_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const rows = await sql`select o.*, m.name as owner_name,
      (select count(*) from people p where p.org_id = o.id) as people_count,
      (select count(*) from deals d where d.org_id = o.id and d.status = 'open') as open_deals,
      (select coalesce(sum(d.value),0) from deals d where d.org_id = o.id and d.status = 'open') as deal_value
      from organizations o
      left join members m on m.id = o.owner_id
      where o.id = ${data.id}`;
	if (!rows[0]) return null;
	return {
		org: mapOrg(rows[0]),
		people: (await sql`select p.*, o.name as org_name, m.name as owner_name,
        (select count(*) from deals d where d.person_id = p.id and d.status = 'open') as open_deals,
        (select coalesce(sum(d.value),0) from deals d where d.person_id = p.id and d.status = 'open') as deal_value
        from people p
        left join organizations o on o.id = p.org_id
        left join members m on m.id = p.owner_id
        where p.org_id = ${data.id} order by p.name`).map(mapPerson),
		deals: (await sql.query(`select ${DEAL_SELECT} from deals d
         left join organizations o on o.id = d.org_id
         left join people p on p.id = d.person_id
         left join members m on m.id = d.owner_id
         left join stages s on s.id = d.stage_id
         where d.org_id = $1 order by d.updated_at desc`, [data.id])).map(mapDeal)
	};
});
var enrichRecord_createServerFn_handler = createServerRpc({
	id: "aa83bb7557912eeda7ae5262f44babd5d63e26242af764991e491b98009fb77e",
	name: "enrichRecord",
	filename: "src/lib/crm/ultimate.ts"
}, (opts) => enrichRecord.__executeServer(opts));
var enrichRecord = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(enrichRecord_createServerFn_handler, async ({ data }) => {
	const credit = await consumeCredit();
	if (!credit.ok) return {
		ok: false,
		error: credit.error ?? "No credits",
		remaining: 0
	};
	const sql = await getSql();
	const lookup = data.lookup ?? "all";
	if (data.kind === "org") {
		const org = (await sql`select * from organizations where id = ${data.id}`)[0];
		if (!org) return {
			ok: false,
			remaining: credit.remaining
		};
		const pack = NYC[String(org.industry ?? "Venue")] ?? NYC.Venue;
		const phone = org.phone ? String(org.phone) : `+1 212 555 ${String(1e3 + data.id % 8e3).padStart(4, "0")}`;
		await sql`update organizations set employees = ${pack.employees}, revenue_band = ${pack.revenue},
        lat = coalesce(lat, ${pack.lat}), lng = coalesce(lng, ${pack.lng}), phone = coalesce(phone, ${phone}),
        enriched_at = now() where id = ${data.id}`;
		return {
			ok: true,
			remaining: credit.remaining,
			employees: pack.employees,
			revenueBand: pack.revenue,
			phone
		};
	}
	const person = (await sql`select p.*, o.industry, o.id as oid, o.website, o.name as oname from people p left join organizations o on o.id = p.org_id where p.id = ${data.id}`)[0];
	if (!person) return {
		ok: false,
		remaining: credit.remaining
	};
	const slug = String(person.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
	const first = String(person.name).split(" ")[0]?.toLowerCase() ?? "desk";
	const last = String(person.name).split(" ").slice(-1)[0]?.toLowerCase() ?? "producer";
	const domain = person.website ? String(person.website).replace(/^https?:\/\//, "").replace(/\/.*$/, "") : `${String(person.oname ?? "northline").toLowerCase().replace(/[^a-z0-9]+/g, "")}.com`;
	const email = person.email ? String(person.email) : `${first}.${last}@${domain}`;
	const mobile = `+1 917 555 ${String(1400 + data.id % 7e3).padStart(4, "0")}`;
	const direct = `+1 212 555 ${String(1800 + data.id % 7e3).padStart(4, "0")}`;
	const linkedin = `linkedin.com/in/${slug}`;
	if (lookup === "email") {
		await sql`update people set email = coalesce(email, ${email}), enriched_at = now() where id = ${data.id}`;
		return {
			ok: true,
			remaining: credit.remaining,
			email
		};
	}
	if (lookup === "phone") {
		await sql`update people set phone = coalesce(phone, ${direct}), mobile = ${mobile}, direct_dial = ${direct}, enriched_at = now() where id = ${data.id}`;
		return {
			ok: true,
			remaining: credit.remaining,
			phone: direct,
			mobile
		};
	}
	await sql`update people set linkedin = ${linkedin}, email = coalesce(email, ${email}),
      phone = coalesce(phone, ${direct}), mobile = ${mobile}, direct_dial = ${direct}, enriched_at = now() where id = ${data.id}`;
	if (person.oid != null) {
		const pack = NYC[String(person.industry ?? "Venue")] ?? NYC.Venue;
		await sql`update organizations set employees = coalesce(employees, ${pack.employees}), revenue_band = coalesce(revenue_band, ${pack.revenue}), enriched_at = now() where id = ${Number(person.oid)}`;
	}
	return {
		ok: true,
		remaining: credit.remaining,
		linkedin,
		email,
		mobile,
		phone: direct
	};
});
var cloneDeal_createServerFn_handler = createServerRpc({
	id: "76639507784af1105bd81d7721906ae45e2457e99bc430c691f6c5d5ebe53f94",
	name: "cloneDeal",
	filename: "src/lib/crm/ultimate.ts"
}, (opts) => cloneDeal.__executeServer(opts));
var cloneDeal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(cloneDeal_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const d = (await sql`select * from deals where id = ${data.id}`)[0];
	if (!d) return { id: null };
	const rows = await sql`insert into deals (title, value, pipeline_id, stage_id, org_id, person_id, owner_id, status, expected_close, probability, source, event_date, venue, guest_count, indoor, load_in, notes)
      values (${`Copy of ${String(d.title)}`}, ${money(d.value)}, ${Number(d.pipeline_id)}, ${Number(d.stage_id)}, ${d.org_id == null ? null : Number(d.org_id)}, ${d.person_id == null ? null : Number(d.person_id)}, ${d.owner_id == null ? null : Number(d.owner_id)}, ${"open"}, ${d.expected_close == null ? null : String(d.expected_close)}, ${Number(d.probability ?? 0)}, ${d.source == null ? null : String(d.source)}, ${d.event_date == null ? null : String(d.event_date)}, ${d.venue == null ? null : String(d.venue)}, ${d.guest_count == null ? null : Number(d.guest_count)}, ${d.indoor}, ${d.load_in == null ? null : String(d.load_in)}, ${d.notes == null ? null : String(d.notes)})
      returning id`;
	const id = Number(rows[0].id);
	const products = await sql`select * from deal_products where deal_id = ${data.id}`;
	for (const p of products) await sql`insert into deal_products (deal_id, product_id, qty, discount, price)
        values (${id}, ${Number(p.product_id)}, ${Number(p.qty)}, ${Number(p.discount)}, ${money(p.price)})`;
	await sql`insert into deal_history (deal_id, actor, action, detail) values (${id}, ${"Northline"}, ${"created"}, ${"Cloned from deal " + data.id})`;
	return { id };
});
var importDeals_createServerFn_handler = createServerRpc({
	id: "1593cb2b22470d55a55f8d88cbba480a4bde4893fd88277f5573fc1869bef1b3",
	name: "importDeals",
	filename: "src/lib/crm/ultimate.ts"
}, (opts) => importDeals.__executeServer(opts));
var importDeals = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(importDeals_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	let created = 0;
	for (const row of data.rows.slice(0, 50)) {
		let orgId = null;
		if (row.orgName) {
			const existing = (await sql`select id from organizations where lower(name) = ${row.orgName.toLowerCase()} limit 1`)[0];
			if (existing) orgId = Number(existing.id);
			else {
				const ins = await sql`insert into organizations (name, owner_id, city) values (${row.orgName}, ${data.ownerId}, ${"New York"}) returning id`;
				orgId = Number(ins[0].id);
			}
		}
		await sql`insert into deals (title, value, pipeline_id, stage_id, org_id, owner_id, venue, source)
        values (${row.title}, ${row.value}, ${data.pipelineId}, ${data.stageId}, ${orgId}, ${data.ownerId}, ${row.venue ?? null}, ${row.source ?? "Import"})`;
		created += 1;
	}
	return { created };
});
var getAdmin_createServerFn_handler = createServerRpc({
	id: "ff2e035efdb2f33559f0c450ff7c3878eaf2bfb01f0614964b7620e5b00248f3",
	name: "getAdmin",
	filename: "src/lib/crm/ultimate.ts"
}, (opts) => getAdmin.__executeServer(opts));
var getAdmin = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAdmin_createServerFn_handler, async () => {
	const sql = await getSql();
	const empty = {
		groups: [],
		permissions: [],
		tokens: [],
		routes: [],
		accounts: []
	};
	try {
		return {
			groups: (await sql`select * from visibility_groups order by id`).map((g) => ({
				id: Number(g.id),
				name: String(g.name),
				detail: String(g.detail ?? ""),
				memberIds: Array.isArray(g.member_ids) ? g.member_ids.map(Number) : typeof g.member_ids === "string" ? JSON.parse(String(g.member_ids)) : []
			})),
			permissions: (await sql`select * from permission_sets order by id`).map((p) => ({
				id: Number(p.id),
				name: String(p.name),
				detail: String(p.detail ?? ""),
				canExport: Boolean(p.can_export),
				canDelete: Boolean(p.can_delete),
				canAdmin: Boolean(p.can_admin)
			})),
			tokens: (await sql`select * from api_tokens order by id`).map((t) => ({
				id: Number(t.id),
				name: String(t.name),
				tokenHint: String(t.token_hint),
				scopes: String(t.scopes),
				lastUsed: iso(t.last_used),
				createdAt: iso(t.created_at) ?? "",
				revoked: Boolean(t.revoked)
			})),
			routes: (await sql`select r.*, m.name as owner_name from lead_routes r left join members m on m.id = r.owner_id order by r.id`).map((r) => ({
				id: Number(r.id),
				source: String(r.source),
				ownerId: r.owner_id == null ? null : Number(r.owner_id),
				ownerName: r.owner_name == null ? null : String(r.owner_name),
				teamId: r.team_id == null ? null : Number(r.team_id),
				active: Boolean(r.active)
			})),
			accounts: (await sql`select a.*, m.name as member_name from email_accounts a left join members m on m.id = a.member_id order by a.id`).map((a) => ({
				id: Number(a.id),
				memberId: a.member_id == null ? null : Number(a.member_id),
				memberName: a.member_name == null ? null : String(a.member_name),
				address: String(a.address),
				kind: String(a.kind),
				synced: Boolean(a.synced),
				lastSync: iso(a.last_sync)
			}))
		};
	} catch {
		return empty;
	}
});
var createApiToken_createServerFn_handler = createServerRpc({
	id: "934aadae5bb1c84bc9f039c0160948fdb3cf9cdce1a13e4c51d132df6ab37c91",
	name: "createApiToken",
	filename: "src/lib/crm/ultimate.ts"
}, (opts) => createApiToken.__executeServer(opts));
var createApiToken = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createApiToken_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const raw = `nl_live_${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 8)}`;
	const hint = `${raw.slice(0, 12)}…${raw.slice(-3)}`;
	const scopes = data.scopes.trim() || "events:read";
	await sql`insert into api_tokens (name, token_hint, token_hash, scopes)
      values (${data.name.trim() || "Token"}, ${hint}, ${hashSha(raw)}, ${scopes})`;
	return {
		token: raw,
		hint,
		scopes
	};
});
var revokeToken_createServerFn_handler = createServerRpc({
	id: "e11833f5441d410f7a9ae47736d073b2e808190230cfd589515a6a9c31a928b3",
	name: "revokeToken",
	filename: "src/lib/crm/ultimate.ts"
}, (opts) => revokeToken.__executeServer(opts));
var revokeToken = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(revokeToken_createServerFn_handler, async ({ data }) => {
	await (await getSql())`update api_tokens set revoked = true where id = ${data.id}`;
	return { ok: true };
});
var listChatbots_createServerFn_handler = createServerRpc({
	id: "88372970f9e2b518caec60ac096e0b47e0e41a5b879e1453815b3a306e5043cd",
	name: "listChatbots",
	filename: "src/lib/crm/ultimate.ts"
}, (opts) => listChatbots.__executeServer(opts));
var listChatbots = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listChatbots_createServerFn_handler, async () => {
	return (await (await getSql())`select * from chatbot_flows order by id`).map((r) => {
		const steps = typeof r.steps === "string" ? JSON.parse(String(r.steps)) : r.steps;
		return {
			id: Number(r.id),
			name: String(r.name),
			active: Boolean(r.active),
			steps: steps ?? [],
			conversations: Number(r.conversations)
		};
	});
});
var toggleChatbot_createServerFn_handler = createServerRpc({
	id: "3f5d83832ed1c235b63527f55e2a2865765df985f39c6b93ddc209a01b35cda3",
	name: "toggleChatbot",
	filename: "src/lib/crm/ultimate.ts"
}, (opts) => toggleChatbot.__executeServer(opts));
var toggleChatbot = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(toggleChatbot_createServerFn_handler, async ({ data }) => {
	await (await getSql())`update chatbot_flows set active = ${data.active} where id = ${data.id}`;
	return { ok: true };
});
var getSchedulerBySlug_createServerFn_handler = createServerRpc({
	id: "48f33af40e10e3e328f918f452f990508397e21a52d4275e10a2ed7daa517dac",
	name: "getSchedulerBySlug",
	filename: "src/lib/crm/ultimate.ts"
}, (opts) => getSchedulerBySlug.__executeServer(opts));
var getSchedulerBySlug = createServerFn({ method: "GET" }).validator((input) => input).handler(getSchedulerBySlug_createServerFn_handler, async ({ data }) => {
	const row = (await (await getSql())`select l.*, m.name as member_name from scheduler_links l left join members m on m.id = l.member_id where l.slug = ${data.slug}`)[0];
	if (!row) return null;
	return {
		id: Number(row.id),
		memberId: row.member_id == null ? null : Number(row.member_id),
		memberName: row.member_name == null ? null : String(row.member_name),
		name: String(row.name),
		durationMin: Number(row.duration_min),
		slug: String(row.slug),
		bookings: Number(row.bookings),
		source: row.source == null ? "northline" : String(row.source),
		calendlyUrl: row.calendly_url == null ? null : String(row.calendly_url),
		locationKind: row.location_kind == null ? "zoom" : String(row.location_kind)
	};
});
var getDocumentPublic_createServerFn_handler = createServerRpc({
	id: "04aad327692878cf5341b5b0a13d63bf9d048ae12fbf662564aca5c0a7259ae2",
	name: "getDocumentPublic",
	filename: "src/lib/crm/ultimate.ts"
}, (opts) => getDocumentPublic.__executeServer(opts));
var getDocumentPublic = createServerFn({ method: "GET" }).validator((input) => input).handler(getDocumentPublic_createServerFn_handler, async ({ data }) => {
	const row = (await (await getSql())`select doc.*, d.title as deal_title from documents doc left join deals d on d.id = doc.deal_id where doc.id = ${data.id}`)[0];
	if (!row) return null;
	return {
		id: Number(row.id),
		name: String(row.name),
		dealId: row.deal_id == null ? null : Number(row.deal_id),
		dealTitle: row.deal_title == null ? null : String(row.deal_title),
		template: String(row.template),
		status: String(row.status),
		content: row.content == null ? null : String(row.content),
		sentAt: iso(row.sent_at),
		viewedAt: iso(row.viewed_at),
		signedAt: iso(row.signed_at),
		createdAt: iso(row.created_at) ?? ""
	};
});
var listEnrollments_createServerFn_handler = createServerRpc({
	id: "385bc7a6617b054dfeacf4ae0c476816b2642eec8b059e14b8d99585f94b5805",
	name: "listEnrollments",
	filename: "src/lib/crm/ultimate.ts"
}, (opts) => listEnrollments.__executeServer(opts));
var listEnrollments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listEnrollments_createServerFn_handler, async () => {
	return (await (await getSql())`select e.*, p.name as person_name from sequence_enrollments e
    left join people p on p.id = e.person_id order by e.enrolled_at desc`).map((r) => ({
		id: Number(r.id),
		sequenceId: Number(r.sequence_id),
		personId: Number(r.person_id),
		personName: r.person_name == null ? null : String(r.person_name),
		stepIndex: Number(r.step_index),
		status: String(r.status),
		enrolledAt: iso(r.enrolled_at) ?? ""
	}));
});
var enrollSequence_createServerFn_handler = createServerRpc({
	id: "4bde36a4a20b8df8c48647e11d7523bb4c6e265a9a380f23cbe9ab43d79ff74a",
	name: "enrollSequence",
	filename: "src/lib/crm/ultimate.ts"
}, (opts) => enrollSequence.__executeServer(opts));
var enrollSequence = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(enrollSequence_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	await sql`insert into sequence_enrollments (sequence_id, person_id) values (${data.sequenceId}, ${data.personId})`;
	await sql`update sequences set enrolled = enrolled + 1 where id = ${data.sequenceId}`;
	return { ok: true };
});
var runAutomation_createServerFn_handler = createServerRpc({
	id: "42fe9c1b9aa70a0720f5c9e7cb3d344561ce78cae597ade75c63cc11ca106d9f",
	name: "runAutomation",
	filename: "src/lib/crm/ultimate.ts"
}, (opts) => runAutomation.__executeServer(opts));
var runAutomation = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(runAutomation_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const a = (await sql`select * from automations where id = ${data.id}`)[0];
	if (!a) return { ok: false };
	await sql`update automations set runs = runs + 1 where id = ${data.id}`;
	if (String(a.action_type) === "activity.create") await sql`insert into activities (type, subject, owner_id, due_at, notes)
        values (${"task"}, ${String(a.action_detail ?? "Automation task")}, ${1}, now() + interval '1 day', ${"Fired from " + String(a.name)})`;
	return {
		ok: true,
		action: String(a.action_type)
	};
});
//#endregion
export { cloneDeal_createServerFn_handler, createApiToken_createServerFn_handler, createGoal_createServerFn_handler, enrichRecord_createServerFn_handler, enrollSequence_createServerFn_handler, getAdmin_createServerFn_handler, getDocumentPublic_createServerFn_handler, getOrgDetail_createServerFn_handler, getPersonDetail_createServerFn_handler, getSchedulerBySlug_createServerFn_handler, importDeals_createServerFn_handler, listChatbots_createServerFn_handler, listEnrollments_createServerFn_handler, listGoals_createServerFn_handler, revokeToken_createServerFn_handler, runAutomation_createServerFn_handler, toggleChatbot_createServerFn_handler };
