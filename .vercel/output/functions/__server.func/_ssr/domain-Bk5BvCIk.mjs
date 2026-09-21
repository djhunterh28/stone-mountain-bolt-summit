import { l as getSql, u as iso } from "./utils-BjcRTCQS.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CZC9dlvp.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/domain-Bk5BvCIk.js
function mapDomain(r, records, identities) {
	return {
		id: Number(r.id),
		domain: String(r.domain),
		displayName: String(r.display_name ?? r.domain),
		mailHost: r.mail_host == null ? null : String(r.mail_host),
		status: String(r.status ?? "pending"),
		spf: Boolean(r.spf),
		dkim: Boolean(r.dkim),
		dmarc: Boolean(r.dmarc),
		active: Boolean(r.active),
		applyCompose: r.apply_compose == null ? true : Boolean(r.apply_compose),
		applyWorkflow: r.apply_workflow == null ? true : Boolean(r.apply_workflow),
		verifiedAt: iso(r.verified_at),
		dkimSelector: String(r.dkim_selector ?? "nl"),
		trackingHost: r.tracking_host == null ? null : String(r.tracking_host),
		returnPath: r.return_path == null ? null : String(r.return_path),
		records,
		identities
	};
}
function mapDns(r) {
	return {
		id: Number(r.id),
		domainId: Number(r.domain_id),
		kind: String(r.kind),
		host: String(r.host),
		type: String(r.type),
		value: String(r.value),
		purpose: String(r.purpose),
		status: String(r.status)
	};
}
function mapIdent(r, domain) {
	return {
		id: Number(r.id),
		domainId: Number(r.domain_id),
		memberId: r.member_id == null ? null : Number(r.member_id),
		localPart: String(r.local_part),
		displayName: String(r.display_name),
		purpose: String(r.purpose),
		isDefault: Boolean(r.is_default),
		address: `${r.local_part}@${domain}`
	};
}
function localPart(addr) {
	if (!addr) return "";
	const at = addr.indexOf("@");
	return at === -1 ? addr.trim().toLowerCase() : addr.slice(0, at).trim().toLowerCase();
}
function recordsFor(domain, selector) {
	return [
		{
			kind: "spf",
			host: "@",
			type: "TXT",
			value: "v=spf1 include:spf.northline.av -all",
			purpose: "Authorize Northline to send"
		},
		{
			kind: "dkim",
			host: `${selector}._domainkey`,
			type: "TXT",
			value: "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2nLineHpSendKey7QvR4kM0wF8cHurr1c4n3Av",
			purpose: "Sign every outbound message"
		},
		{
			kind: "dmarc",
			host: "_dmarc",
			type: "TXT",
			value: `v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc@${domain}`,
			purpose: "Quarantine spoofed mail"
		},
		{
			kind: "cname",
			host: "track",
			type: "CNAME",
			value: "track.northline.send.net",
			purpose: "Open and click tracking"
		},
		{
			kind: "mx",
			host: "bounce",
			type: "CNAME",
			value: "bounce.northline.send.net",
			purpose: "Return-path / bounce handling"
		}
	];
}
async function resolveSender(sql, opts) {
	const purpose = opts?.purpose ?? "compose";
	const domain = (await sql.query(`select * from sending_domains where active = true and status = 'authenticated' order by id`)).find((d) => purpose === "compose" ? d.apply_compose !== false : d.apply_workflow !== false);
	if (!domain) return {
		fromName: opts?.fallbackName ?? "Northline",
		fromAddr: opts?.hintAddr ?? "hello@northline.av",
		domainId: null,
		domain: null,
		authenticated: false,
		displayName: null,
		emailId: 0
	};
	const host = String(domain.domain);
	const idents = await sql.query(`select * from sending_identities where domain_id = $1 order by id`, [Number(domain.id)]);
	const hint = localPart(opts?.hintAddr);
	const byMember = opts?.memberId ? idents.find((i) => Number(i.member_id) === opts.memberId) : void 0;
	const byHint = hint ? idents.find((i) => String(i.local_part).toLowerCase() === hint) : void 0;
	const byName = opts?.fallbackName ? idents.find((i) => String(i.display_name).toLowerCase() === opts.fallbackName.toLowerCase()) : void 0;
	const byPurposeDefault = idents.find((i) => Boolean(i.is_default) && String(i.purpose) === purpose);
	const byPurpose = idents.find((i) => String(i.purpose) === purpose);
	const byDefault = idents.find((i) => Boolean(i.is_default));
	const pick = byMember ?? byHint ?? byName ?? byPurposeDefault ?? byPurpose ?? byDefault ?? idents[0];
	return {
		fromName: pick ? String(pick.display_name) : opts?.fallbackName ?? String(domain.display_name ?? host),
		fromAddr: pick ? `${pick.local_part}@${host}` : `hello@${host}`,
		domainId: Number(domain.id),
		domain: host,
		authenticated: true,
		displayName: String(domain.display_name ?? host),
		emailId: 0
	};
}
async function insertOutbound(sql, opts) {
	const sender = await resolveSender(sql, {
		purpose: opts.purpose,
		memberId: opts.memberId,
		fallbackName: opts.fallbackName,
		hintAddr: opts.hintAddr
	});
	const folder = opts.folder ?? "sent";
	const mailKind = opts.mailKind ?? (opts.purpose === "workflow" ? "workflow" : "compose");
	const smtpId = folder === "drafts" ? null : `<${Date.now().toString(36)}.${Math.random().toString(36).slice(2, 8)}@mail.hurricaneproductionsllc.com>`;
	const inserted = await sql.query(`insert into emails (folder, from_name, from_addr, to_addr, subject, body, deal_id, person_id, opened, clicked, sent_at, domain_id, authenticated, purpose, delivery_status, smtp_message_id)
     values ($1,$2,$3,$4,$5,$6,$7,$8,false,false, case when $1 = 'drafts' then null else now() end, $9, $10, $11, $12, $13)
     returning id`, [
		folder,
		sender.fromName,
		sender.fromAddr,
		opts.toAddr,
		opts.subject,
		opts.body,
		opts.dealId ?? null,
		opts.personId ?? null,
		sender.domainId,
		sender.authenticated,
		mailKind,
		folder === "drafts" ? "queued" : "delivered",
		smtpId
	]);
	const emailId = Number(inserted[0]?.id ?? 0);
	if (folder !== "drafts" && emailId) {
		const sentAt = /* @__PURE__ */ new Date();
		await sql.query(`insert into smtp_events (email_id, event, detail, at) values
        ($1, 'queued', 'SMTP queued', $2),
        ($1, 'accepted', 'mail.hurricaneproductionsllc.com accepted', $3),
        ($1, 'delivered', '250 2.0.0 OK', $4)`, [
			emailId,
			sentAt,
			new Date(sentAt.getTime() + 900),
			new Date(sentAt.getTime() + 3200)
		]).catch(() => null);
	}
	return {
		...sender,
		emailId
	};
}
async function loadDesk(sql) {
	const domains = await sql.query(`select * from sending_domains order by active desc, id`);
	const dns = await sql.query(`select * from sending_dns order by id`);
	const idents = await sql.query(`select * from sending_identities order by is_default desc, id`);
	const mapped = domains.map((d) => {
		const host = String(d.domain);
		return mapDomain(d, dns.filter((r) => Number(r.domain_id) === Number(d.id)).map(mapDns), idents.filter((r) => Number(r.domain_id) === Number(d.id)).map((r) => mapIdent(r, host)));
	});
	const recent = (await sql.query(`select id, from_name, from_addr, to_addr, subject, folder, authenticated, sent_at
       from emails
       where authenticated = true or domain_id is not null
       order by coalesce(sent_at, created_at) desc
       limit 10`)).map((r) => ({
		id: Number(r.id),
		fromName: String(r.from_name),
		fromAddr: String(r.from_addr),
		toAddr: String(r.to_addr),
		subject: String(r.subject),
		folder: String(r.folder),
		authenticated: Boolean(r.authenticated),
		sentAt: iso(r.sent_at)
	}));
	const sent7d = Number((await sql.query(`select count(*) as c from emails
         where authenticated = true and folder = 'sent'
           and coalesce(sent_at, created_at) >= now() - interval '7 days'`))[0]?.c ?? 0);
	const live = mapped.find((d) => d.active && d.status === "authenticated") ?? null;
	return {
		domains: mapped,
		live,
		recent,
		sender: await resolveSender(sql, { purpose: "compose" }),
		workflow: await resolveSender(sql, { purpose: "workflow" }),
		stats: {
			authenticated: mapped.filter((d) => d.status === "authenticated").length,
			pending: mapped.filter((d) => d.status === "pending" || d.status === "verifying").length,
			sent7d,
			recordsPass: live ? live.records.filter((r) => r.status === "pass").length : 0,
			recordsTotal: live ? live.records.length : 0
		}
	};
}
var getSendingDesk_createServerFn_handler = createServerRpc({
	id: "d5ab74db9cb2a225e8d5eb99cbe9157f76dc2684371bbcb058694bee40b4355d",
	name: "getSendingDesk",
	filename: "src/lib/crm/domain.ts"
}, (opts) => getSendingDesk.__executeServer(opts));
var getSendingDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getSendingDesk_createServerFn_handler, async () => {
	return loadDesk(await getSql());
});
var getActiveSender_createServerFn_handler = createServerRpc({
	id: "05aab7d24c0c72aeb99ed4fa24fdebab4e5ce17409aa588a0fcad8732f164be3",
	name: "getActiveSender",
	filename: "src/lib/crm/domain.ts"
}, (opts) => getActiveSender.__executeServer(opts));
var getActiveSender = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(getActiveSender_createServerFn_handler, async ({ data }) => {
	return resolveSender(await getSql(), data);
});
var addSendingDomain_createServerFn_handler = createServerRpc({
	id: "77c59e092cefe4eb32e7d7a5a6216925804530405c65679b7a8f4cc1bcc23fdc",
	name: "addSendingDomain",
	filename: "src/lib/crm/domain.ts"
}, (opts) => addSendingDomain.__executeServer(opts));
var addSendingDomain = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(addSendingDomain_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const domain = data.domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
	if (!domain.includes(".") || domain.includes(" ")) return {
		ok: false,
		error: "Use a real domain, like hurricaneproductionsllc.com"
	};
	if ((await sql.query(`select id from sending_domains where lower(domain) = $1`, [domain]))[0]) return {
		ok: false,
		error: "That domain is already on the desk"
	};
	const selector = "nl";
	const inserted = await sql.query(`insert into sending_domains (domain, display_name, mail_host, spf, dkim, dmarc, active, status, apply_compose, apply_workflow, dkim_selector, tracking_host, return_path)
       values ($1,$2,$3,false,false,false,false,'pending',true,true,$4,$5,$6) returning id`, [
		domain,
		data.displayName?.trim() || domain,
		`mail.${domain}`,
		selector,
		`track.${domain}`,
		`bounce.${domain}`
	]);
	const id = Number(inserted[0].id);
	for (const rec of recordsFor(domain, selector)) await sql.query(`insert into sending_dns (domain_id, kind, host, type, value, purpose, status) values ($1,$2,$3,$4,$5,$6,'missing')`, [
		id,
		rec.kind,
		rec.host,
		rec.type,
		rec.value,
		rec.purpose
	]);
	return {
		ok: true,
		error: null
	};
});
var checkDomainDns_createServerFn_handler = createServerRpc({
	id: "42823209213fb03952fed36f7505357db3bd91d8cc08605ddc374e2712f6c959",
	name: "checkDomainDns",
	filename: "src/lib/crm/domain.ts"
}, (opts) => checkDomainDns.__executeServer(opts));
var checkDomainDns = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(checkDomainDns_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	if (!(await sql.query(`select * from sending_domains where id = $1`, [data.id]))[0]) return {
		ok: false,
		error: "Domain not found"
	};
	await sql.query(`update sending_dns set status = 'pass' where domain_id = $1`, [data.id]);
	await sql.query(`update sending_domains set spf = true, dkim = true, dmarc = true, status = 'authenticated', verified_at = now() where id = $1`, [data.id]);
	return {
		ok: true,
		error: null
	};
});
var activateDomain_createServerFn_handler = createServerRpc({
	id: "ed3283062f494fa4578fbfc4bc3834e026eb14d9be29dfd838ddd5ed172f8b6a",
	name: "activateDomain",
	filename: "src/lib/crm/domain.ts"
}, (opts) => activateDomain.__executeServer(opts));
var activateDomain = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(activateDomain_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const d = (await sql.query(`select * from sending_domains where id = $1`, [data.id]))[0];
	if (!d) return {
		ok: false,
		error: "Domain not found"
	};
	if (String(d.status) !== "authenticated") return {
		ok: false,
		error: "Authenticate DNS first"
	};
	await sql.query(`update sending_domains set active = false`);
	await sql.query(`update sending_domains set active = true, apply_compose = true, apply_workflow = true where id = $1`, [data.id]);
	return {
		ok: true,
		error: null
	};
});
var setDomainApply_createServerFn_handler = createServerRpc({
	id: "b46dc06a6888371e8fdee05edc82c8302f0e143544959bd695f5ccefd47159e7",
	name: "setDomainApply",
	filename: "src/lib/crm/domain.ts"
}, (opts) => setDomainApply.__executeServer(opts));
var setDomainApply = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(setDomainApply_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	if (data.applyCompose != null) await sql.query(`update sending_domains set apply_compose = $1 where id = $2`, [data.applyCompose, data.id]);
	if (data.applyWorkflow != null) await sql.query(`update sending_domains set apply_workflow = $1 where id = $2`, [data.applyWorkflow, data.id]);
	return { ok: true };
});
var addIdentity_createServerFn_handler = createServerRpc({
	id: "0ad4fc6d6e9a2e946bceb4d20d14d4c6e6fdd16365c4538e50a9ced7d835f879",
	name: "addIdentity",
	filename: "src/lib/crm/domain.ts"
}, (opts) => addIdentity.__executeServer(opts));
var addIdentity = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(addIdentity_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const local = data.localPart.trim().toLowerCase().replace(/[^a-z0-9._+-]/g, "");
	if (!local) return {
		ok: false,
		error: "Need a local-part (dana, hello, shows)"
	};
	if ((await sql.query(`select id from sending_identities where domain_id = $1 and lower(local_part) = $2`, [data.domainId, local]))[0]) return {
		ok: false,
		error: "That address already exists"
	};
	await sql.query(`insert into sending_identities (domain_id, local_part, display_name, purpose, is_default) values ($1,$2,$3,$4,false)`, [
		data.domainId,
		local,
		data.displayName.trim() || local,
		data.purpose || "compose"
	]);
	return {
		ok: true,
		error: null
	};
});
var setDefaultIdentity_createServerFn_handler = createServerRpc({
	id: "8969f3a326fa3fe0d8f5dfb82acc066ec079b9b1276a36ffa2b62c9b2214fc58",
	name: "setDefaultIdentity",
	filename: "src/lib/crm/domain.ts"
}, (opts) => setDefaultIdentity.__executeServer(opts));
var setDefaultIdentity = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(setDefaultIdentity_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const row = (await sql.query(`select * from sending_identities where id = $1`, [data.id]))[0];
	if (!row) return { ok: false };
	await sql.query(`update sending_identities set is_default = false where domain_id = $1 and purpose = $2`, [Number(row.domain_id), String(row.purpose)]);
	await sql.query(`update sending_identities set is_default = true where id = $1`, [data.id]);
	return { ok: true };
});
var testDomainSend_createServerFn_handler = createServerRpc({
	id: "8f48b4b80dcc28a703fd2c49aaab04ffc7e10fa5483695bd167c5ca7db240c3f",
	name: "testDomainSend",
	filename: "src/lib/crm/domain.ts"
}, (opts) => testDomainSend.__executeServer(opts));
var testDomainSend = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(testDomainSend_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const purpose = data.purpose ?? "compose";
	let hint;
	let name;
	if (data.identityId) {
		const ident = (await sql.query(`select i.*, d.domain from sending_identities i join sending_domains d on d.id = i.domain_id where i.id = $1`, [data.identityId]))[0];
		if (ident) {
			hint = `${ident.local_part}@${ident.domain}`;
			name = String(ident.display_name);
		}
	}
	const person = (await sql.query(`select p.email, p.name, d.id as deal_id from people p left join deals d on d.person_id = p.id
         where p.email is not null order by d.id nulls last limit 1`))[0];
	const to = person ? String(person.email) : "elena.voss@citadel.com";
	return {
		ok: true,
		sender: await insertOutbound(sql, {
			purpose,
			toAddr: to,
			subject: "Authenticated send from Hurricane Productions",
			body: `This left ${hint ?? "the live sending domain"} with SPF, DKIM, and DMARC aligned. Clients see us — not a platform.\n\n— ${name ?? "Northline"}`,
			dealId: person?.deal_id == null ? null : Number(person.deal_id),
			fallbackName: name,
			hintAddr: hint
		}),
		to
	};
});
//#endregion
export { activateDomain_createServerFn_handler, addIdentity_createServerFn_handler, addSendingDomain_createServerFn_handler, checkDomainDns_createServerFn_handler, getActiveSender_createServerFn_handler, getSendingDesk_createServerFn_handler, setDefaultIdentity_createServerFn_handler, setDomainApply_createServerFn_handler, testDomainSend_createServerFn_handler };
