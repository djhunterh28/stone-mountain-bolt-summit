import { l as getSql } from "./utils-BjcRTCQS.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CZC9dlvp.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brand-BeQEY2zF.js
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
async function portalOrigin() {
	return `https://${(await readPortalBrand()).portalHost}`;
}
var getPortalBrand = createServerFn({ method: "GET" }).handler(createSsrRpc("e03de631f159f6b5bd73f16d3e6b7ec83248c42d183068af80fe2467fb764b17"));
var getPortalDomainDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("af88c291d00e7ed4157c088a41edd51472c10a2be58dd6f068b51343f7bc8b41"));
var savePortalBrand = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("adbb4a90453f9bf4ee7ddaf5740711459ab47da33d74ddcf649307a715c9944b"));
var checkPortalDns = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("dc4bb27616b708fd690bf2930d1485bb090eba8c1fd5e0e940acc803cbf2c60b"));
var activatePortalDomain = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("622f1e2ac8e03bb81a261d234ca049d98036ef2dce594c885918207df51e1b99"));
//#endregion
export { portalOrigin as a, getPortalDomainDesk as i, checkPortalDns as n, readPortalBrand as o, getPortalBrand as r, savePortalBrand as s, activatePortalDomain as t };
