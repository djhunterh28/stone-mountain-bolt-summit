import { l as getSql, u as iso } from "./utils-BjcRTCQS.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CZC9dlvp.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brand-B-AFnzse.js
var FALLBACK = {
	company: "Hurricane Productions",
	tagline: "Stop Quoting. Start Partnering.",
	logoLabel: "HP",
	primaryHex: "0D47A1",
	accentHex: "E85D04",
	inkHex: "0B1220",
	paperHex: "F5F3EE",
	portalHost: "portal.hurricaneproductionsllc.com",
	esignHost: "esign.hurricaneproductionsllc.com",
	crmHost: "crm.hurricaneproductionsllc.com",
	hidePlatform: true,
	footer: "Hurricane Productions · 247 3rd Street, Brooklyn, NY 11215",
	supportEmail: "shows@hurricaneproductionsllc.com"
};
function mapBrand(r) {
	if (!r) return FALLBACK;
	return {
		company: String(r.company ?? FALLBACK.company),
		tagline: String(r.tagline ?? FALLBACK.tagline),
		logoLabel: String(r.logo_label ?? "HP"),
		primaryHex: String(r.primary_hex ?? FALLBACK.primaryHex).replace("#", ""),
		accentHex: String(r.accent_hex ?? FALLBACK.accentHex).replace("#", ""),
		inkHex: String(r.ink_hex ?? FALLBACK.inkHex).replace("#", ""),
		paperHex: String(r.paper_hex ?? FALLBACK.paperHex).replace("#", ""),
		portalHost: String(r.portal_host ?? FALLBACK.portalHost),
		esignHost: String(r.esign_host ?? FALLBACK.esignHost),
		crmHost: String(r.crm_host ?? FALLBACK.crmHost),
		hidePlatform: r.hide_platform !== false,
		footer: String(r.footer ?? FALLBACK.footer),
		supportEmail: String(r.support_email ?? FALLBACK.supportEmail)
	};
}
async function readPortalBrand() {
	const row = (await (await getSql()).query(`select * from portal_brand where id = 1`))[0];
	return mapBrand(row);
}
var getPortalBrand_createServerFn_handler = createServerRpc({
	id: "e03de631f159f6b5bd73f16d3e6b7ec83248c42d183068af80fe2467fb764b17",
	name: "getPortalBrand",
	filename: "src/lib/portal/brand.ts"
}, (opts) => getPortalBrand.__executeServer(opts));
var getPortalBrand = createServerFn({ method: "GET" }).handler(getPortalBrand_createServerFn_handler, async () => readPortalBrand());
var getPortalDomainDesk_createServerFn_handler = createServerRpc({
	id: "af88c291d00e7ed4157c088a41edd51472c10a2be58dd6f068b51343f7bc8b41",
	name: "getPortalDomainDesk",
	filename: "src/lib/portal/brand.ts"
}, (opts) => getPortalDomainDesk.__executeServer(opts));
var getPortalDomainDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getPortalDomainDesk_createServerFn_handler, async () => {
	const sql = await getSql();
	return {
		brand: mapBrand((await sql.query(`select * from portal_brand where id = 1`))[0]),
		domains: (await sql.query(`select * from portal_domains order by live desc, id`)).map((d) => ({
			id: Number(d.id),
			host: String(d.host),
			purpose: String(d.purpose),
			status: String(d.status),
			ssl: String(d.ssl),
			cname: d.cname_target == null ? null : String(d.cname_target),
			live: Boolean(d.live),
			notes: d.notes == null ? null : String(d.notes),
			verifiedAt: iso(d.verified_at)
		})),
		dns: (await sql.query(`select * from portal_dns order by id`)).map((r) => ({
			id: Number(r.id),
			domainId: Number(r.domain_id),
			kind: String(r.kind),
			host: String(r.host),
			type: String(r.type),
			value: String(r.value),
			purpose: r.purpose == null ? null : String(r.purpose),
			status: String(r.status)
		}))
	};
});
var savePortalBrand_createServerFn_handler = createServerRpc({
	id: "adbb4a90453f9bf4ee7ddaf5740711459ab47da33d74ddcf649307a715c9944b",
	name: "savePortalBrand",
	filename: "src/lib/portal/brand.ts"
}, (opts) => savePortalBrand.__executeServer(opts));
var savePortalBrand = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(savePortalBrand_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const hex = (v) => v.replace("#", "").trim() || "0D47A1";
	const host = data.portalHost.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
	if (!host.includes(".")) return {
		ok: false,
		error: "Need a real host"
	};
	await sql.query(`update portal_brand set company = $1, tagline = $2, primary_hex = $3, accent_hex = $4, portal_host = $5,
              esign_host = coalesce($6, esign_host), hide_platform = $7 where id = 1`, [
		data.company.trim() || "Hurricane Productions",
		data.tagline.trim(),
		hex(data.primaryHex),
		hex(data.accentHex),
		host,
		data.esignHost ?? null,
		data.hidePlatform !== false
	]);
	await sql.query(`update ai_profile set portal_domain = $1, brand_color = $2 where id = 1`, [host, hex(data.primaryHex)]);
	if (!(await sql.query(`select id from portal_domains where host = $1`, [host]))[0]) await sql.query(`insert into portal_domains (host, purpose, status, ssl, cname_target, live, notes) values ($1,'portal','pending','pending','origin.hurricaneproductionsllc.com', false, 'Added from the white-label desk')`, [host]);
	return {
		ok: true,
		error: null,
		host
	};
});
var checkPortalDns_createServerFn_handler = createServerRpc({
	id: "dc4bb27616b708fd690bf2930d1485bb090eba8c1fd5e0e940acc803cbf2c60b",
	name: "checkPortalDns",
	filename: "src/lib/portal/brand.ts"
}, (opts) => checkPortalDns.__executeServer(opts));
var checkPortalDns = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(checkPortalDns_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	await sql.query(`update portal_dns set status = 'pass' where domain_id = $1`, [data.id]);
	await sql.query(`update portal_domains set ssl = 'issued' where id = $1`, [data.id]);
	return {
		ok: true,
		records: 2
	};
});
var activatePortalDomain_createServerFn_handler = createServerRpc({
	id: "622f1e2ac8e03bb81a261d234ca049d98036ef2dce594c885918207df51e1b99",
	name: "activatePortalDomain",
	filename: "src/lib/portal/brand.ts"
}, (opts) => activatePortalDomain.__executeServer(opts));
var activatePortalDomain = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(activatePortalDomain_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const d = (await sql.query(`select * from portal_domains where id = $1`, [data.id]))[0];
	if (!d) return {
		ok: false,
		error: "Unknown host"
	};
	if ((await sql.query(`select id from portal_dns where domain_id = $1 and status <> 'pass'`, [data.id]))[0]) return {
		ok: false,
		error: "DNS still pending"
	};
	await sql.query(`update portal_domains set status = 'live', live = true, ssl = 'issued', verified_at = now() where id = $1`, [data.id]);
	if (String(d.purpose) === "portal") {
		if (!String(d.host).includes("example")) {
			await sql.query(`update portal_brand set portal_host = $1 where id = 1`, [String(d.host)]);
			await sql.query(`update ai_profile set portal_domain = $1 where id = 1`, [String(d.host)]);
		}
	}
	return {
		ok: true,
		error: null,
		host: String(d.host)
	};
});
//#endregion
export { activatePortalDomain_createServerFn_handler, checkPortalDns_createServerFn_handler, getPortalBrand_createServerFn_handler, getPortalDomainDesk_createServerFn_handler, savePortalBrand_createServerFn_handler };
