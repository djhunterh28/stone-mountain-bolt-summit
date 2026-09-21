import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./rolldown-runtime-D7D4PA-g.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CZC9dlvp.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/domain-DTp-hrMr.js
var domain_DTp_hrMr_exports = /* @__PURE__ */ __exportAll({
	a: () => domain_exports,
	c: () => insertOutbound,
	d: () => testDomainSend,
	i: () => checkDomainDns,
	l: () => setDefaultIdentity,
	n: () => addIdentity,
	o: () => getActiveSender,
	r: () => addSendingDomain,
	s: () => getSendingDesk,
	t: () => activateDomain,
	u: () => setDomainApply
});
var domain_exports = /* @__PURE__ */ __exportAll$1({
	activateDomain: () => activateDomain,
	addIdentity: () => addIdentity,
	addSendingDomain: () => addSendingDomain,
	checkDomainDns: () => checkDomainDns,
	getActiveSender: () => getActiveSender,
	getSendingDesk: () => getSendingDesk,
	insertOutbound: () => insertOutbound,
	resolveSender: () => resolveSender,
	setDefaultIdentity: () => setDefaultIdentity,
	setDomainApply: () => setDomainApply,
	testDomainSend: () => testDomainSend
});
function localPart(addr) {
	if (!addr) return "";
	const at = addr.indexOf("@");
	return at === -1 ? addr.trim().toLowerCase() : addr.slice(0, at).trim().toLowerCase();
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
var getSendingDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("d5ab74db9cb2a225e8d5eb99cbe9157f76dc2684371bbcb058694bee40b4355d"));
var getActiveSender = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("05aab7d24c0c72aeb99ed4fa24fdebab4e5ce17409aa588a0fcad8732f164be3"));
var addSendingDomain = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("77c59e092cefe4eb32e7d7a5a6216925804530405c65679b7a8f4cc1bcc23fdc"));
var checkDomainDns = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("42823209213fb03952fed36f7505357db3bd91d8cc08605ddc374e2712f6c959"));
var activateDomain = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("ed3283062f494fa4578fbfc4bc3834e026eb14d9be29dfd838ddd5ed172f8b6a"));
var setDomainApply = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("b46dc06a6888371e8fdee05edc82c8302f0e143544959bd695f5ccefd47159e7"));
var addIdentity = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("0ad4fc6d6e9a2e946bceb4d20d14d4c6e6fdd16365c4538e50a9ced7d835f879"));
var setDefaultIdentity = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("8969f3a326fa3fe0d8f5dfb82acc066ec079b9b1276a36ffa2b62c9b2214fc58"));
var testDomainSend = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("8f48b4b80dcc28a703fd2c49aaab04ffc7e10fa5483695bd167c5ca7db240c3f"));
//#endregion
export { domain_DTp_hrMr_exports as a, insertOutbound as c, testDomainSend as d, checkDomainDns as i, setDefaultIdentity as l, addIdentity as n, getActiveSender as o, addSendingDomain as r, getSendingDesk as s, activateDomain as t, setDomainApply as u };
