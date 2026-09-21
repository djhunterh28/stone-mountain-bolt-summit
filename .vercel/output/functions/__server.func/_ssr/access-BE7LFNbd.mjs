import { l as getSql } from "./utils-BjcRTCQS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/access-BE7LFNbd.js
function hashSha(text) {
	const bytes = new TextEncoder().encode(text);
	let h1 = 2166136261;
	let h2 = 2654435769;
	for (let i = 0; i < bytes.length; i++) {
		h1 ^= bytes[i];
		h1 = Math.imul(h1, 16777619);
		h2 = Math.imul(h2 ^ bytes[i], 16777619);
	}
	return `${(h1 >>> 0).toString(16).padStart(8, "0")}${(h2 >>> 0).toString(16).padStart(8, "0")}${bytes.length.toString(16)}`;
}
function otpCode() {
	return String(1e5 + Math.floor(Math.random() * 9e5));
}
var STAFF_DOMAINS = ["northline.av", "hurricaneproductionsllc.com"];
async function lookupAuthUser(userId) {
	const sql = await getSql();
	if (userId === "dev-user") return {
		email: "dana@northline.av",
		name: "Dana Okonkwo"
	};
	const row = (await sql.query(`select email, name from "user" where id = $1`, [userId]))[0];
	if (!row) return null;
	return {
		email: String(row.email ?? ""),
		name: String(row.name ?? "")
	};
}
async function emailAllowed(email) {
	const sql = await getSql();
	const addr = email.trim().toLowerCase();
	const domain = addr.split("@")[1] ?? "";
	const member = await sql.query(`select id from members where lower(email) = $1`, [addr]);
	if (member[0] || STAFF_DOMAINS.includes(domain)) return {
		ok: true,
		kind: "staff",
		memberId: member[0] ? Number(member[0].id) : 1
	};
	const person = await sql.query(`select id, org_id from people where lower(email) = $1`, [addr]);
	if (person[0]) return {
		ok: true,
		kind: "client",
		personId: Number(person[0].id),
		orgId: person[0].org_id == null ? void 0 : Number(person[0].org_id)
	};
	return {
		ok: false,
		kind: "none"
	};
}
async function provisionProfile(userId) {
	const sql = await getSql();
	const existing = await loadProfile(userId);
	if (existing) return existing;
	const authUser = await lookupAuthUser(userId);
	const email = (authUser?.email || "").toLowerCase();
	const name = authUser?.name || email.split("@")[0] || "User";
	const gate = await emailAllowed(email);
	const previewLoose = !process.env.DATABASE_URL;
	let role = "blocked";
	let tenantId = null;
	if (gate.kind === "staff") role = "staff";
	else if (gate.kind === "client") {
		role = "client";
		if (gate.orgId) {
			const t = await sql.query(`select id from tenants where org_id = $1`, [gate.orgId]);
			tenantId = t[0] ? Number(t[0].id) : null;
			if (!tenantId) {
				const org = await sql.query(`select name from organizations where id = $1`, [gate.orgId]);
				const slug = String(org[0]?.name ?? "client").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
				const ins = await sql.query(`insert into tenants (org_id, name, slug) values ($1,$2,$3) returning id`, [
					gate.orgId,
					String(org[0]?.name ?? "Client"),
					slug || `t-${gate.orgId}`
				]);
				tenantId = Number(ins[0].id);
			}
		}
	} else if (previewLoose) role = "staff";
	await sql.query(`insert into portal_profiles (user_id, email, name, role, tenant_id, person_id, member_id, verified, onboarded)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     on conflict (user_id) do nothing`, [
		userId,
		email || `${userId}@northline.av`,
		name,
		role,
		tenantId,
		gate.personId ?? null,
		gate.memberId ?? null,
		role !== "blocked",
		false
	]);
	await sql.query(`insert into onboarding_state (user_id) values ($1) on conflict (user_id) do nothing`, [userId]);
	const profile = await loadProfile(userId);
	if (!profile) throw new Error("Could not provision profile");
	return profile;
}
async function loadProfile(userId) {
	const r = (await (await getSql()).query(`select p.*, t.name as tenant_name, i.tenant_id as imp_tenant,
            it.name as imp_name
     from portal_profiles p
     left join tenants t on t.id = p.tenant_id
     left join impersonation i on i.user_id = p.user_id
     left join tenants it on it.id = i.tenant_id
     where p.user_id = $1`, [userId]))[0];
	if (!r) return null;
	let permissions = {};
	try {
		const raw = typeof r.permissions === "string" ? JSON.parse(String(r.permissions)) : r.permissions;
		if (raw && typeof raw === "object") for (const [k, v] of Object.entries(raw)) permissions[k] = Boolean(v);
	} catch {
		permissions = {};
	}
	return {
		userId: String(r.user_id),
		email: String(r.email),
		name: String(r.name),
		role: r.role,
		tenantId: r.tenant_id == null ? null : Number(r.tenant_id),
		tenantName: r.tenant_name ? String(r.tenant_name) : null,
		personId: r.person_id == null ? null : Number(r.person_id),
		memberId: r.member_id == null ? null : Number(r.member_id),
		parentUserId: r.parent_user_id ? String(r.parent_user_id) : null,
		verified: Boolean(r.verified),
		onboarded: Boolean(r.onboarded),
		theme: String(r.theme ?? "paper"),
		compact: Boolean(r.compact),
		highContrast: Boolean(r.high_contrast),
		screenReader: Boolean(r.screen_reader),
		permissions,
		impersonatingTenantId: r.imp_tenant == null ? null : Number(r.imp_tenant),
		impersonatingTenantName: r.imp_name ? String(r.imp_name) : null
	};
}
function effectiveTenantId(p) {
	if (p.role === "staff") return p.impersonatingTenantId;
	return p.tenantId;
}
function isStaff(p) {
	return p.role === "staff";
}
async function writeAudit(p, action, entity, meta) {
	await (await getSql()).query(`insert into audit_events (user_id, email, action, entity, ip, user_agent, meta)
     values ($1,$2,$3,$4,$5,$6,$7)`, [
		p.userId,
		p.email,
		action,
		entity ?? null,
		"74.64.12.10",
		"Northline",
		meta ?? null
	]);
}
//#endregion
export { otpCode as a, isStaff as i, emailAllowed as n, provisionProfile as o, hashSha as r, writeAudit as s, effectiveTenantId as t };
