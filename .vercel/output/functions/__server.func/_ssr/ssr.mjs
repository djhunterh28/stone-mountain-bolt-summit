import { r as __exportAll$1 } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { A as _getRenderedMatches, B as isNotFound, D as getStylesheetHref, E as getScriptPreloadAttrs, F as isRedirect, I as isResolvedRedirect, L as parseRedirect, M as invariant, O as resolveManifestAssetLink, a as isSsrResponse, c as stripSsrResponseBody, f as RouterProvider, i as disposeSsrResponseDetached, j as executeRewriteInput, k as resolveManifestCssLink, n as bindSsrResponseToRequest, o as normalizeSsrResponse, r as defineHandlerCallback, s as replaceSsrResponse, t as renderRouterToStream, z as rootRouteId } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as createMemoryHistory } from "../_libs/tanstack__history.mjs";
import { a as getOrigin, c as createSerializationAdapter, d as toCrossJSONAsync, f as toCrossJSONStream, i as getNormalizedURL, l as makeSerovalPlugin, n as mergeHeaders, o as defaultSerovalPlugins, r as attachRouterServerSsrUtils, s as createRawStreamRPCPlugin, t as waitForRequest, u as fromJSON } from "../_libs/@tanstack/router-core+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as setCookie, r as toResponse, t as H3Event } from "../_libs/h3-v2+rou3.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region node_modules/.nitro/vite/services/ssr/index.js
var ssr_exports = /* @__PURE__ */ __exportAll$1({
	a: () => getServerFnById,
	createServerEntry: () => createServerEntry,
	default: () => server_default,
	i: () => TSS_SERVER_FUNCTION,
	n: () => createMiddleware,
	o: () => getRequest,
	r: () => createServerFn,
	s: () => __exportAll,
	t: () => server_exports
});
require_react();
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function StartServer(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RouterProvider, { router: props.router });
}
var defaultStreamHandler = defineHandlerCallback(({ request, router, responseHeaders }) => renderRouterToStream({
	request,
	router,
	responseHeaders,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartServer, { router })
}));
var GLOBAL_EVENT_STORAGE_KEY = Symbol.for("tanstack-start:event-storage");
var globalObj$1 = globalThis;
if (!globalObj$1[GLOBAL_EVENT_STORAGE_KEY]) globalObj$1[GLOBAL_EVENT_STORAGE_KEY] = new AsyncLocalStorage();
var eventStorage = globalObj$1[GLOBAL_EVENT_STORAGE_KEY];
function isPromiseLike(value) {
	return typeof value.then === "function";
}
function getSetCookieValues(headers) {
	const headersWithSetCookie = headers;
	if (typeof headersWithSetCookie.getSetCookie === "function") return headersWithSetCookie.getSetCookie();
	const value = headers.get("set-cookie");
	return value ? [value] : [];
}
function mergeEventResponseHeaders(response, event) {
	if (response.ok) return;
	const eventSetCookies = getSetCookieValues(event.res.headers);
	if (eventSetCookies.length === 0) return;
	const responseSetCookies = getSetCookieValues(response.headers);
	response.headers.delete("set-cookie");
	for (const cookie of responseSetCookies) response.headers.append("set-cookie", cookie);
	for (const cookie of eventSetCookies) response.headers.append("set-cookie", cookie);
}
function attachResponseHeaders(value, event) {
	if (isPromiseLike(value)) return value.then((resolved) => {
		if (resolved instanceof Response) mergeEventResponseHeaders(resolved, event);
		return resolved;
	});
	if (value instanceof Response) mergeEventResponseHeaders(value, event);
	return value;
}
function requestHandler(handler) {
	return (request, requestOpts) => {
		let h3Event;
		try {
			h3Event = new H3Event(request);
		} catch (error) {
			if (error instanceof URIError) return new Response(null, {
				status: 400,
				statusText: "Bad Request"
			});
			throw error;
		}
		return toResponse(attachResponseHeaders(eventStorage.run({ h3Event }, () => handler(request, requestOpts)), h3Event), h3Event);
	};
}
function getH3Event() {
	const event = eventStorage.getStore();
	if (!event) throw new Error(`No StartEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`);
	return event.h3Event;
}
function getRequest() {
	return getH3Event().req;
}
/**
* Set a cookie value by name.
* @param name Name of the cookie to set
* @param value Value of the cookie to set
* @param options {CookieSerializeOptions} Options for serializing the cookie
* ```ts
* setCookie('Authorization', '1234567')
* ```
*/
function setCookie$1(name, value, options) {
	setCookie(getH3Event(), name, value, options);
}
function getResponse() {
	return getH3Event().res;
}
var HEADERS = { TSS_SHELL: "X-TSS_SHELL" };
/**
* @description Returns the router manifest data that should be sent to the client.
* This includes only the assets and preloads for the current route and any
* special assets that are needed for the client. It does not include relationships
* between routes or any other data that is not needed for the client.
*
* @param matchedRoutes - In dev mode, the matched routes are used to build
* the dev styles URL for route-scoped CSS collection.
*/
async function getStartManifest(matchedRoutes) {
	const { tsrStartManifest } = await import("../_tanstack-start-manifest_v-DRKd35Z-.mjs");
	const startManifest = tsrStartManifest();
	let routes = startManifest.routes;
	routes[rootRouteId];
	const manifestRoutes = {};
	for (const k in routes) {
		const v = routes[k];
		const result = {};
		if (v.preloads && v.preloads.length > 0) result.preloads = v.preloads;
		if (v.scripts && v.scripts.length > 0) result.scripts = v.scripts;
		if (v.css?.length) result.css = v.css;
		if (result.preloads || result.scripts || result.css) manifestRoutes[k] = result;
	}
	return {
		...startManifest.scriptFormat ? { scriptFormat: startManifest.scriptFormat } : {},
		...startManifest.inlineCss ? { inlineCss: startManifest.inlineCss } : {},
		routes: manifestRoutes
	};
}
var manifest = {
	"02fee718af39c1991461cb3b2285b9959c046a882ece4f6cf5ecfc59d87b47aa": {
		functionName: "setTenantQuota_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"04aad327692878cf5341b5b0a13d63bf9d048ae12fbf662564aca5c0a7259ae2": {
		functionName: "getDocumentPublic_createServerFn_handler",
		importer: () => import("./ultimate-DQjLMLvX.mjs")
	},
	"07fc547dc5f81cd3b6ba27fe94fa789ee709f60f6d1175c24ddf6056d2b25aaf": {
		functionName: "getEsignMonitor_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"084cac8da7a1ed0fd166b05f774764751144bd93d04bfb0b1d6082076d065d1a": {
		functionName: "searchPlaces_createServerFn_handler",
		importer: () => import("./integrations-B7xhpPjx.mjs")
	},
	"092c550a3b7d2e4fc350b575d91af45ed8c27d045f51f4cb63c66610c8040720": {
		functionName: "syncPipedrive_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"092e452659d04ffa311de43edb44b3eb281266fce36008f60639c1ce5bc2bdc2": {
		functionName: "createReport_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"0a4bda816681e87bafaaf31a344fbb047d2619552193112374805d697e74fcac": {
		functionName: "listActivities_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"0aebdf04a7c92cbe0135b9a2084a87e8bfbe9a1c40189927d23663828d5a1d10": {
		functionName: "getUnifiedInbox_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"0dc3589918c1b2559a2974d90efef2e115cb9cd2dc27610a19f8aaeb41c2bb28": {
		functionName: "updateDeal_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"0f0f0fc177d8eff8f81b3a3b8980728644987a278af9a0433837bfa360cee6ac": {
		functionName: "connectScheduler_createServerFn_handler",
		importer: () => import("./schedule-Cx0LJKVc.mjs")
	},
	"10517c01ebf6ab1f40cdd2b831d641a56a513b85074754476e9e9f9893f0e59d": {
		functionName: "getGigs_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"107660959cecf6ce2cfdc97ad712ddd82619514fc764e705d2e382991fa851fa": {
		functionName: "setSessionContext_createServerFn_handler",
		importer: () => import("./governance-WUzBmkB-.mjs")
	},
	"1126647434684a5525c3c90b77f4afac09efa14ff1c54b42a8fa8818a99ac3cd": {
		functionName: "getAccessState_createServerFn_handler",
		importer: () => import("./governance-WUzBmkB-.mjs")
	},
	"115240cc6de18fbf8b8ac7e55e3e23af1abc3dd82c7fc2a3411dba9ad31b4235": {
		functionName: "updatePortalProfile_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"11e5d6400ab8074f41cc011a761be1d10c739f79119f6692c0481b5780b72cf8": {
		functionName: "listSequences_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"12befde8a803ce3f9b603c52148180ca22d161b2854cb9c6f42d96ab6433ef59": {
		functionName: "listAutomations_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"1311b91347ceed0b1ca187acd10656a5b3d81f762a4dd8c5d3a9e0487974f7d5": {
		functionName: "sharePortalFile_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"1593cb2b22470d55a55f8d88cbba480a4bde4893fd88277f5573fc1869bef1b3": {
		functionName: "importDeals_createServerFn_handler",
		importer: () => import("./ultimate-DQjLMLvX.mjs")
	},
	"15bb83266e4c061985a40b5cd81055d2f8f56e258b3571456aee5274569b15da": {
		functionName: "listEventNotes_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"1753a7c2bd0a38ad3555efdc2bf818d5667ff0cf2d7fa2c061ab02b650cad52b": {
		functionName: "listReports_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"177a7b6554228661f8ad8967ec30bb8c90f944bfe6c5669f743b80b4d2fb7fb9": {
		functionName: "listOrgs_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"19f84c1309f43d5519013e0ddc8ff161c3040d1acb015779c552a8cc67fda286": {
		functionName: "listMarketplace_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"1b8a11ff8dc1a2a31fd3c0dec3be89f7ae253e3ccf587474ceabf2969ff5c076": {
		functionName: "getSecurity_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"1f24c9c7c915f9627053f9b1ed17f334f2e77905972ae9efa5bc36caa2caa45a": {
		functionName: "listForms_createServerFn_handler",
		importer: () => import("./forms-Dev-spWV.mjs")
	},
	"21dd474b25d7ac73ab8fbc8bdf030370e634580ac10cf805f3f308f55f0472e5": {
		functionName: "addComment_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"24b579679a7e5500f1d0d8970c5ca115b27102056fc947eead28e482e4c95d3b": {
		functionName: "getHealth_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"250858188be72e897a7b57a42c4ff9a04290d82d7e4af845326fba3ebab46786": {
		functionName: "syncCalendly_createServerFn_handler",
		importer: () => import("./schedule-Cx0LJKVc.mjs")
	},
	"265efa4634c6d815adff3363a49e0e2e1e018979d1f831e99629604863c78321": {
		functionName: "sendEmail_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"276446dd2be584e2429fcaa835cf632769a7f4102b4ed5d216c7945735d21ebb": {
		functionName: "createPerson_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"28470d4cfdce369efb89424da3baa1b22a0f0b4ffd1babe4910d25de3d9caaac": {
		functionName: "listPeople_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"28b0fe78b3908494623378d093a3fadd32b6351a7feda38b6fa51165dbb3e508": {
		functionName: "createProposal_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"29e8aa96222c63bc849010293cbfe5032a6ede363c5b310e8863303216b6ed16": {
		functionName: "addDealProduct_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"2a24214969fd18af33f91899c1d3a28ddba51082fe5b0ecf4a85b8a0f6ba047b": {
		functionName: "resolveAlert_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"2c2ce75e1533faaa4b8de2f4342d0cdc415acd6afd9cd23a6ac072cd35b90381": {
		functionName: "listEnvelopes_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"2c4073a01e48e169265a439d4cd8d34fad72909ce086657d42cec1529aa2fc03": {
		functionName: "listDocuments_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"2d7e3cf7426e24c3c40abfeca88f81e98cf80670f2f4d83308ee70d0ce2732f0": {
		functionName: "listBoards_createServerFn_handler",
		importer: () => import("./boards-B5453FHj.mjs")
	},
	"2db3b254b3413d78fe2948b168951847b45d6563b7405bf6361824938f994e9f": {
		functionName: "listEmails_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"2f4a335e5c6b6cbaed1b604d1ca2844834122c26f6bdc9bc7aee585b17b7a929": {
		functionName: "getTravelDesk_createServerFn_handler",
		importer: () => import("./travel-C7JH-Is-.mjs")
	},
	"2fef8db125ebaa4230d127bf2b540ae65167222dbd41ee619e98c903c307e360": {
		functionName: "draftFromDeal_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"3096117bd40b954725dca50ef1cc1e8f30f5cb774b124036d62ddaaffecdcecc": {
		functionName: "setCommPref_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"30ce6010c9246e152fd6f6ba48c520b3ecf456db09a4e8bfc0e12f0de3cf0a0f": {
		functionName: "setRsvp_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"338b3dcb876ff6a240b196d3a776244d480494e11bf0e1465e792cc8c4a164d6": {
		functionName: "createAutomation_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"3478ebbb4a72eaffc6bf80ef949d8ee2f2f494d96822d5389d4128c6383b25f0": {
		functionName: "getPersonPrefs_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"35e88dcf75a282c33b8c8f8ca7903c13907766db8c4bd2d89af307f1e1bafeba": {
		functionName: "listShowTracks_createServerFn_handler",
		importer: () => import("./integrations-B7xhpPjx.mjs")
	},
	"366c57187fbc4ad92697c1b2e7718b912796bb54b2dd2adaa428930715e1b10b": {
		functionName: "searchDeezer_createServerFn_handler",
		importer: () => import("./integrations-B7xhpPjx.mjs")
	},
	"385bc7a6617b054dfeacf4ae0c476816b2642eec8b059e14b8d99585f94b5805": {
		functionName: "listEnrollments_createServerFn_handler",
		importer: () => import("./ultimate-DQjLMLvX.mjs")
	},
	"387b6eac553fe59cf7337821d4db1b0b2f715a7e70f8ce5bf169b7803f67156d": {
		functionName: "getGuests_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"388ad5f09e2e85a3e1672dac42bc606a4b673ea119b9916134f5280e3277e811": {
		functionName: "convertDealToProject_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"38a22361b3d9dc8e5301a2060125570dbb0a1d71384ad6ae128eacc4a5680129": {
		functionName: "getFormBySlug_createServerFn_handler",
		importer: () => import("./forms-Dev-spWV.mjs")
	},
	"399003620615d5554ce324c6942b9d3fc67f195aacbfb1b3695db01b9fe40427": {
		functionName: "listCalendarAccounts_createServerFn_handler",
		importer: () => import("./governance-WUzBmkB-.mjs")
	},
	"3d0d670fa8baef5ec09998928396782e6f2aa69179dcef929f2390a2150ba498": {
		functionName: "createGoal_createServerFn_handler",
		importer: () => import("./ultimate-DQjLMLvX.mjs")
	},
	"3d2e7d72539bf5f631fd9159eb4e6752b3b416b8358d2ebbc01f6fd4afcd2ccc": {
		functionName: "revokeBoard_createServerFn_handler",
		importer: () => import("./boards-B5453FHj.mjs")
	},
	"3e3c15c216d1c94fd37a34204ab1b75dc5f5f25cceb86beacfc9feb897a1961f": {
		functionName: "syncScheduler_createServerFn_handler",
		importer: () => import("./schedule-Cx0LJKVc.mjs")
	},
	"3f5d83832ed1c235b63527f55e2a2865765df985f39c6b93ddc209a01b35cda3": {
		functionName: "toggleChatbot_createServerFn_handler",
		importer: () => import("./ultimate-DQjLMLvX.mjs")
	},
	"3f97f66351023477deb69f905fbdda789fb8124b930ee2c79ce2a95ea86581f0": {
		functionName: "createEnvelope_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"4224834ae3a43d4539803522fe8bf6154b3834f1daef8616b23343faca9205ef": {
		functionName: "addEnvelopeField_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"427baff95144cc91cb08311e9018ab6ff6dcc145b2b79fa1a45940cb6f7d0209": {
		functionName: "toggleRule_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"42fe9c1b9aa70a0720f5c9e7cb3d344561ce78cae597ade75c63cc11ca106d9f": {
		functionName: "runAutomation_createServerFn_handler",
		importer: () => import("./ultimate-DQjLMLvX.mjs")
	},
	"43343f15e025d60cca1f45a8c5fd5c2d5b04e25d00d135ad28e58e60768a01e4": {
		functionName: "getProject_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"45378dea731466732e1f5ef16d0b3d07b5abcd4462b8cb38005eb60175821170": {
		functionName: "toggleProjectNote_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"478fc051f651105f4caefe354dde9ca2c151199407626308b865a93dac94f5bd": {
		functionName: "completeOnboardingStep_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"48ac317c961498652af996df99eb88873d68ab0b7c57ec8863f49ef558c29383": {
		functionName: "sendSms_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"48f33af40e10e3e328f918f452f990508397e21a52d4275e10a2ed7daa517dac": {
		functionName: "getSchedulerBySlug_createServerFn_handler",
		importer: () => import("./ultimate-DQjLMLvX.mjs")
	},
	"4931eed3acea1285773f41a67670c50c9bac403a0ff7f1acbaa28cb81cf1d947": {
		functionName: "lookupDocument_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"4b4c11184d03c0f75106b21af3c43d38164f164a2a7dd9c17ff635da63978096": {
		functionName: "listAudit_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"4bde36a4a20b8df8c48647e11d7523bb4c6e265a9a380f23cbe9ab43d79ff74a": {
		functionName: "enrollSequence_createServerFn_handler",
		importer: () => import("./ultimate-DQjLMLvX.mjs")
	},
	"4c81ed06625b143b2fefac5d4b23430c3a076129784e69c219ffd3169de98b03": {
		functionName: "checkEmailGate_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"4c8474eb0f11dfd2131b316c8a9bb1c4699a2c72042448daeca649b900c9d707": {
		functionName: "testWebhook_createServerFn_handler",
		importer: () => import("./developer-CgvmrJxK.mjs")
	},
	"4cc6da6bbc631aea662f4a53eca033ff60e19aad92505326ea31729d0e2f18b0": {
		functionName: "listProducts_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"4fef50a5c319285f231e2eee427b1c76880432fb221adc4071394296c554f776": {
		functionName: "importCold_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"507448c32c2c2536f14b5743f82c578e9beb9a9c7da5568221d76a5ae04735f3": {
		functionName: "getInsights_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"516b3e12944a59fcd0bb5965639542f1c1f63a67d3cc03f4ddb0bc7d44025e4b": {
		functionName: "createWebhook_createServerFn_handler",
		importer: () => import("./developer-CgvmrJxK.mjs")
	},
	"517d6a6b5d9c36eb5d59474c96b7064b1710b7ba13060070778ca16c11eeebe5": {
		functionName: "promoteProspect_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"52a5338b996fc7cc6eb49070551e9ba5b0b1b8e504bd7aa3c33eaf41b416c9c2": {
		functionName: "getFormsDesk_createServerFn_handler",
		importer: () => import("./forms-Dev-spWV.mjs")
	},
	"52c73266103d4bee47bfeb546011e997f94c531fb5c001ae1095b4b0e56a3041": {
		functionName: "setNotifPref_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"5425135e17295aa2deb74c401d8e7b9ad8c7a6b7c0f58f2b2246c4644ebc927e": {
		functionName: "pinNote_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"5579849a083106c791c58697c2de300a27c1425393bd6124fea3ce495e5be301": {
		functionName: "createActivity_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"56c74dced4b12f95a1b594b8ac50abe84441db4f1e62b87b0800bfee7b3df1f5": {
		functionName: "getBroadcastDesk_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"57060dadffe2e7beab61b39f516b3014b8f60754ad62e05957ad02dbe4013f78": {
		functionName: "listProposals_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"595ff189c39732b2788954ca7fa175dee89cb6e7df07700aa18e3f0ae860a3f3": {
		functionName: "addFileMeta_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"59891ab2dffb05c51f647402619d969c168f88abc8992b07971a7189d114d382": {
		functionName: "listDeals_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"5de130c8193838a41768f7f086f052e9cf5028c048aff8089c96deddf8bae7b8": {
		functionName: "createTrip_createServerFn_handler",
		importer: () => import("./travel-C7JH-Is-.mjs")
	},
	"5eaed6df3f84abfbd8a23c9cd07497e5b17ef918ec598f0a4b533830dba1ac6e": {
		functionName: "submitEventRequest_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"6007178782253bee5d623f6eede20fd6b2985637f923bc4397563346a59c20b6": {
		functionName: "listTemplates_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"63ae43edaaad14d2f2ce474ea5ffd396eb24bcb2b4d84e5c2ee31023ef4cf84d": {
		functionName: "createDocument_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"676660b52964fce29d259c48b16f3f53a396462476af213f5f3c5f69a4316743": {
		functionName: "inviteSubuser_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"6868c0ca30c7ea0f41a221c9e5be9f54bd31b74bc17dab5602c75a391c7b5d3c": {
		functionName: "remindEnvelope_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"6970d4457b01e6e6acac2e81c5cc8be9bf0e7bf16c42f4d4bb35e69d970d8244": {
		functionName: "getBootstrap_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"6a8521f06900de506453cecb23ce883c90e99936cc8e18cebcf02170362ee023": {
		functionName: "listFields_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"6b3f6c38a005d928a54c3386800d2ebfc722b65e7075cd257ba76d3c9d1b32df": {
		functionName: "getPortalProject_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"6b967c773e91478fc3e26494695a1e18e9638e2680b9b0aa3210835c796771f6": {
		functionName: "submitQuote_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"6ba63469f5c0271ed7bddb421f261268853d2de2b7304005459fb698dbd2b674": {
		functionName: "verifyOtp_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"6ed92127644641cc1ab2b415b3850fa50fdf50c2e88280f6c2767dd2ae3ef53e": {
		functionName: "promoteSandboxAutomation_createServerFn_handler",
		importer: () => import("./governance-WUzBmkB-.mjs")
	},
	"6f25ebce14453b450a5a81bffb6156b042419d1113b25af15963af97fde8e492": {
		functionName: "awardGig_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"703f1a10b84575fe2772b961309ec240e702ed8eac53928bffa5bc61ebf9e022": {
		functionName: "listGoals_createServerFn_handler",
		importer: () => import("./ultimate-DQjLMLvX.mjs")
	},
	"708faafe4ad45540cfcde51e56ff04ac37fcf41f6c37bc85f7753cc87ce34a1c": {
		functionName: "addEventNote_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"725a28d6aaf612ceca278a7fcc35ce034958a7a62c5d2837bbb28dacb797c38e": {
		functionName: "saveForm_createServerFn_handler",
		importer: () => import("./forms-Dev-spWV.mjs")
	},
	"7459998e01678afda80b4b84e573f67634474012251460cbf2036f72155a877c": {
		functionName: "getFloorPlans_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"76639507784af1105bd81d7721906ae45e2457e99bc430c691f6c5d5ebe53f94": {
		functionName: "cloneDeal_createServerFn_handler",
		importer: () => import("./ultimate-DQjLMLvX.mjs")
	},
	"78732908c9ce1faf9994cae19b93b76747f37b6c920666ae5d45cab7b4c73e85": {
		functionName: "createZoomMeeting_createServerFn_handler",
		importer: () => import("./schedule-Cx0LJKVc.mjs")
	},
	"78fc873733c5f6659ebe51d2fb947c12f07358065686168ba0972f115e4697ed": {
		functionName: "getDirectory_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"7982d811786273fa70d98965c24bc481af202659131a6b161f57f0532bd814f6": {
		functionName: "toggleVehicle_createServerFn_handler",
		importer: () => import("./travel-C7JH-Is-.mjs")
	},
	"79a53b5e765b82ee27873159cd5dd8b1fe374bc7b18f3956fd9ab4446ae9ee08": {
		functionName: "createDealZoom_createServerFn_handler",
		importer: () => import("./integrations-B7xhpPjx.mjs")
	},
	"7b1450d8ddc767bb61aa4e01b18ad97d0b4f4bf5273207d525d38ccbbe6978a5": {
		functionName: "decideApproval_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"7ecd45ebcbd19fd4ae1874440dfef918874a06e942b7b4c391a1bff212dbe8dd": {
		functionName: "moveDeal_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"806bf28a4e55309eb3a67956f4ac4cab7337aee8d20e06aa18c9794718f1fe07": {
		functionName: "createSandboxField_createServerFn_handler",
		importer: () => import("./governance-WUzBmkB-.mjs")
	},
	"80827c283054204cc582d46aef7da9526d3961827d7cd86b9c5e9b55dc7febf2": {
		functionName: "zipPortalFiles_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"81d4a196ae64f73aaa553042ac7137a6c461b9038149924da9c6b68e3ff8d70d": {
		functionName: "sendBroadcast_createServerFn_handler",
		importer: () => import("./governance-WUzBmkB-.mjs")
	},
	"8464588b7373152933c8f4c9773d441ff85f9f182bfca5586ba71708f1c92876": {
		functionName: "listPortalProjects_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"852bdd6cd58d005dcdf6371fe3f12602639f5feb4ae5e36edcd37230c40fa917": {
		functionName: "listNotifPrefs_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"872aff95bbd2b2990f74de83c4c87fa871e48b382e7004319f3244896988b90e": {
		functionName: "runAi_createServerFn_handler",
		importer: () => import("./ai-DdAzVdnY.mjs")
	},
	"88372970f9e2b518caec60ac096e0b47e0e41a5b879e1453815b3a306e5043cd": {
		functionName: "listChatbots_createServerFn_handler",
		importer: () => import("./ultimate-DQjLMLvX.mjs")
	},
	"88a3ac8cf6ac316abf8bf759f28524fc3723a079b10bebf0563e8f91c7cfdcd2": {
		functionName: "getBranding_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"89b325c3582e1eccf85e8385f69b32d39922577a0cb53ce880a2e9419a71d902": {
		functionName: "getPersonDetail_createServerFn_handler",
		importer: () => import("./ultimate-DQjLMLvX.mjs")
	},
	"8be540e362e17d5f3291dad0567600939827bd404db15de82c086c697ab7d37d": {
		functionName: "listBookmarks_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"8c989f1b7cd97de7b88fdf4264a67c06849113e03d9b11b578267eced64f2e3a": {
		functionName: "getFinance_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"8d99d1665fc6984c68a4060df237e502e65a80a98f50bd8f2bfd64125c035c6d": {
		functionName: "bookSlot_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"8da1c8bea9ce0d2e48fefc2a47e67ddd8d2e97ad5e2edd15b0b2156edd72d3c4": {
		functionName: "issueOtp_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"8dd2a408d8dff06e5fda84a188263c3945041c7798c3f893e1750d0905e25666": {
		functionName: "getOrgDetail_createServerFn_handler",
		importer: () => import("./ultimate-DQjLMLvX.mjs")
	},
	"8f0d647cb3a1ed6514175037ef9ab4b148df860679bff4a0a01332e84124ae40": {
		functionName: "getDeal_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"91c01453116e68dba9f72db5f0b3afc9c781b30d5d422e24f2a2820d73c648a0": {
		functionName: "mutateBookmark_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"92adbf909ab79db9e811e7393bd471e8f04e402aa5efebee5e918a9b7a673c82": {
		functionName: "toggleSequence_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"934aadae5bb1c84bc9f039c0160948fdb3cf9cdce1a13e4c51d132df6ab37c91": {
		functionName: "createApiToken_createServerFn_handler",
		importer: () => import("./ultimate-DQjLMLvX.mjs")
	},
	"9376b723956999d721736457d517fdbade5dacaf4a225df48f5e9b6b87c235f3": {
		functionName: "convertLead_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"93ad2ac0b6aeba1d2ac163ddb012a6d000641696fc4822c9431cd7fa27e506bb": {
		functionName: "getLeadBooster_createServerFn_handler",
		importer: () => import("./governance-WUzBmkB-.mjs")
	},
	"94753740b8ec891b0ee5fd55634503990f5bbc0e003d13a1447b9039f81d9482": {
		functionName: "getPulse_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"966e6f6ca162895bb0129b8e27baa0d1045abf5152dd7cb46fb35a4e7cb6f772": {
		functionName: "updateLead_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"9812a299ae813329300c5ddd1c9da7c202df014c4b7063561854dda7d5ca1676": {
		functionName: "listProspects_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"9885f8e7bb637a4fac18c569fa8a14b97585be7498d76fa586533d5642c739e4": {
		functionName: "getPublicWidget_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"99add479dfaece64d15db7c5fdc0ddcbd289f7e833583ac32531a7af8f3e486e": {
		functionName: "setTripStatus_createServerFn_handler",
		importer: () => import("./travel-C7JH-Is-.mjs")
	},
	"9bcafc02475067bb93a75af3a2a851de8dfbf63061ecbfdea4074c4e31b83dcb": {
		functionName: "downloadPortalFile_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"9d0fce2f12afdac60f70ec1b4f51cb1b4bf1477d3b0f170a8a2b93ef62aa2f9d": {
		functionName: "recordPayment_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"a064b50503311022a543709bb2f6936f3f0dc136c1296b3b63cd9febe683bec1": {
		functionName: "toggleActivity_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"a077e7974f61c5b06a3f5f44c1ac28c11b5aa5e0a0ddedfe2390769c510b432f": {
		functionName: "toggleApp_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"a0e69447efe3deffbd69bc685a561447b5177e78edc1c81958f94ec200f87808": {
		functionName: "testSignIn_createServerFn_handler",
		importer: () => import("./governance-WUzBmkB-.mjs")
	},
	"a4bc6143211dd8362b1165b092006e513c34fefc35fa62ff5fe9516d74da63a2": {
		functionName: "getCrew_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"a6aec907146359a93d29875d957b1aeb2713877b07e15c4cd77e24270b8152e8": {
		functionName: "pinTrack_createServerFn_handler",
		importer: () => import("./integrations-B7xhpPjx.mjs")
	},
	"a6c4b9228219b70113d237f4db01acaf5f02dbe8290b7539d23eef5f7a3c6c01": {
		functionName: "listSubusers_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"a7ddf5a4ff9e9a42f30ccf7a817e17f00ffd3716d107c803f2c0d9a71ccd0bdc": {
		functionName: "unlockSession_createServerFn_handler",
		importer: () => import("./governance-WUzBmkB-.mjs")
	},
	"aa519d1adba77860c00b704c0bef182ecddf9c19345a4a65dcce980794182c42": {
		functionName: "saveFloorPlan_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"aa83bb7557912eeda7ae5262f44babd5d63e26242af764991e491b98009fb77e": {
		functionName: "enrichRecord_createServerFn_handler",
		importer: () => import("./ultimate-DQjLMLvX.mjs")
	},
	"aa93d49b55388ce31e25a544feb93d0b60200395a863ec7eeac31304cd74adb3": {
		functionName: "sendHandoff_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"aa9ceb8ba0f696dabafa5dd4a373ddb3a0bd907cd7c46175209575a7791d86c2": {
		functionName: "createBoard_createServerFn_handler",
		importer: () => import("./boards-B5453FHj.mjs")
	},
	"aafc6cedf2a1d8ef4858368fa89a427641cae13c0b0a5fc5f047629157fd28ba": {
		functionName: "promoteSandboxField_createServerFn_handler",
		importer: () => import("./governance-WUzBmkB-.mjs")
	},
	"acbdb3ad15396fe2c7dd1c462c17ffa2bd698a9f2fb0e158345c1dc552b351f4": {
		functionName: "createField_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"adaaf188833a32955a2aa325aeef3fd4ea05ed40cd2385bd9621c31c148bcbcf": {
		functionName: "markNotificationsRead_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"ae92cbedca0d43ad1dcb0bb971c160a439ffb95b1b1cb0d3fa8bff36d51d1e0a": {
		functionName: "rotateBoard_createServerFn_handler",
		importer: () => import("./boards-B5453FHj.mjs")
	},
	"aeb4116aa544918a20dd749db8e62a8db6ed5a013c5bb13c1d036f421bf114df": {
		functionName: "createProduct_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"aefce33749e3b1485bfd5d0357d978b5d281928477d304c5a388361129382c83": {
		functionName: "getEnvelope_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"af89c8b165ae9d140e7f43a5d8c7498dc2b434b6bd93adf9e2bddbdfe5840111": {
		functionName: "getPortalMe_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"afafd8df505ef6eb6b568f2b74c1bea6b58c0574b2c0df1673c7fac4ef1fb0f9": {
		functionName: "createDeal_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"afdd5fffcb56b9ad09a8e2ac1317d78bd1a5f581bc40a501359bbbf6642b9989": {
		functionName: "downloadFormUpload_createServerFn_handler",
		importer: () => import("./forms-Dev-spWV.mjs")
	},
	"afdee20c77292268237f0444d823607edd8e42d4a4a84ef9cf85e3b48e51217b": {
		functionName: "listPortalFiles_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"b1c130a8f205af62a861a12c29dedad21aeee85db1e2c7bdfde24c250df296de": {
		functionName: "createLead_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"b1f2be161ed8c7ab13324e0970fb0c342131e416ec2b85f7a8bbf0df19156f13": {
		functionName: "createStandaloneInvoice_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"b35b59d5955ca97ae48017ec00ab278f901ff1d26cef5b01575a2be3468f9c2e": {
		functionName: "addProspect_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"b52930db7b0f372520a8a0ce8ed29d4fb6ae367759a88aa1bf86c63b84d7a89e": {
		functionName: "resetPasswordWithOtp_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"b79c58f14736d0f420bfd9963f419b83e42867f93a69d6ea09b024e5a322a753": {
		functionName: "listTaskLists_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"b81078ef238d619f1f671d784712a343e7e65db5dcbe3f29a39465109cd4b6f0": {
		functionName: "listChats_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"b94b10e00e53030a4b0e9e5921cabce341382ea8bb726f9c62bd6c1731cedffb": {
		functionName: "advanceDocument_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"ba88ea3e35fb378d768980ed368e21ad74a3a54c219b06a4754db453aa1446a9": {
		functionName: "getSchedulingDesk_createServerFn_handler",
		importer: () => import("./schedule-Cx0LJKVc.mjs")
	},
	"bd00faaeca7ebc3807e923c12aca2be8ff76878943ae1eaff5e38bf724b8175c": {
		functionName: "exportDealsCsv_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"bd186e3b3090f29f7d0437aeafa55cb7f2b23ebe495d71beb0592f6060252f13": {
		functionName: "getHandoffs_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"bdca3df12a79a77c25c5a7aefe62c84a1a2bb707d24d0a4e6aa077a5c5ec2bc1": {
		functionName: "listIntegrationStatus_createServerFn_handler",
		importer: () => import("./integrations-B7xhpPjx.mjs")
	},
	"bf1ea20eaf95c9ddf2970f8cf22384b7a31e32f0978f2f224bd6096ae960e0aa": {
		functionName: "toggleAutomation_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"bf32439614af746a2e6afcaa92c6dcb52d839d9c4d1c4fe77e30451160eef6fa": {
		functionName: "markFinding_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"bf71faea7b22fd1989ef68035586e21d5a7e64af3a0da5cd9b8f41fcf1624d8d": {
		functionName: "getDeveloperDesk_createServerFn_handler",
		importer: () => import("./developer-CgvmrJxK.mjs")
	},
	"bfb2bac394c9f53cd80ff0f837e382ab3efe9ac60b28517a578a0cdf738c5ce6": {
		functionName: "submitForm_createServerFn_handler",
		importer: () => import("./forms-Dev-spWV.mjs")
	},
	"c14e39c19b8dfb159be89529b7b16b78e09c4fa6c68077ed0590d0b38c1783da": {
		functionName: "submitContact_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"c5e815999659ccd3aaa97d27ee9f85412d8491a267e148422bcd9aeeb8241989": {
		functionName: "toggleCalendar_createServerFn_handler",
		importer: () => import("./governance-WUzBmkB-.mjs")
	},
	"caad77a72c5411e6b26d1b7650c855d558b29c9bf0ca57b3ffeaad9b9d3961aa": {
		functionName: "getReviews_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"cad926ee29ed91b95b8218c981baead39276784db310176dfa14e268b6401ed5": {
		functionName: "setDealStatus_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"cbe09202cb5e2168349a9d5c7b6a552627ab7ac471176fa6c47c9813dd6b53c7": {
		functionName: "createOrg_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"cc890b99bd9742106809b56754591022242404c753194613f207d0e9a0213b40": {
		functionName: "getBoardPublic_createServerFn_handler",
		importer: () => import("./boards-B5453FHj.mjs")
	},
	"cdbe2b2b14cb14316c93e7e8607b4ee37e84e3d14303d4300a2102efbd5bb5f9": {
		functionName: "syncCalendars_createServerFn_handler",
		importer: () => import("./governance-WUzBmkB-.mjs")
	},
	"d04dda16f20d220227317ce67988af68f1812877f71b34d02df09b558a51de51": {
		functionName: "resendConfirmation_createServerFn_handler",
		importer: () => import("./schedule-Cx0LJKVc.mjs")
	},
	"d11e09cec47a1dc451f14ece49f36f0166bf9b644de5ea8c6c523e6e1fb9c291": {
		functionName: "listScheduler_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"d2d7724ec7aaae622dea40d476f8e979d82ffb2e5c8afba645de14dd35601133": {
		functionName: "createTeamInbox_createServerFn_handler",
		importer: () => import("./governance-WUzBmkB-.mjs")
	},
	"d3b9bc0887bb532887ec6de69043b7d483b09ce8e3498ce482255034d00c6b0c": {
		functionName: "createSandboxAutomation_createServerFn_handler",
		importer: () => import("./governance-WUzBmkB-.mjs")
	},
	"d48b64b13516ca0e3ab73b57e154dd5959b115f28c92f5ea0af83fec6eb2d10c": {
		functionName: "listLeads_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"d76bab05cbc525d89b473acd268ef193e8aeb41808d78a6fad1ff57f1c2c53b5": {
		functionName: "listNotifications_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"d7a62694e87bed27ad2b03ecd0b170f3ade626f0f5f8e8229b7ccfa32dc2e38b": {
		functionName: "routeReview_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"d8252af4d821f130d4af367b56ea5d964062e0512f8227a91ba55645e3868a90": {
		functionName: "getDashboard_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"d9551306d049c946aa8513cb1ff5ee793c28d7ece41a9619db3ade099737d6c0": {
		functionName: "listScores_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"dc3eab996d393bafe8231a0cdcf3c18d68def839af60cfbf93da6bff87320158": {
		functionName: "signEnvelope_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"dfee2e6a778e0b2567114bb8eec7733d95b6712a6a72b8d0e0878935440b6716": {
		functionName: "updateAccessPolicy_createServerFn_handler",
		importer: () => import("./governance-WUzBmkB-.mjs")
	},
	"e0338cca616598bedafa268a935a92839c70e6b437137f8fae5a86d6f14bc51d": {
		functionName: "widgetAsk_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"e11833f5441d410f7a9ae47736d073b2e808190230cfd589515a6a9c31a928b3": {
		functionName: "revokeToken_createServerFn_handler",
		importer: () => import("./ultimate-DQjLMLvX.mjs")
	},
	"e1e13cda216d9727db9bc0a510d8b75f678556940f4182668ade71de1238490f": {
		functionName: "getProposalPublic_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"e2a1232fb373f50ceef48cf8df618b7b8c7767a250fbf167046acc7307d359dd": {
		functionName: "addProjectRequest_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"e3d686244eb679141e17e7129921ac231c720cc763e5d62836dd48bab1a10f9d": {
		functionName: "listBroadcasts_createServerFn_handler",
		importer: () => import("./governance-WUzBmkB-.mjs")
	},
	"e3e8c21c0891ef5969580037e1936c38029f1cc30b47319e6372d5d28b8b837a": {
		functionName: "pinPlaceToDeal_createServerFn_handler",
		importer: () => import("./integrations-B7xhpPjx.mjs")
	},
	"e5a5d8f3d6f1bcab4a2d337185c745bb49021ea474cc47706f1b07462eac7d02": {
		functionName: "getQuotes_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"e6061b49f5bfa1aa2523dcac89cece344e37cdae1b1f34131f0655edac83143d": {
		functionName: "listTenants_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"e6076d76338ef471f769a21d9968d55284d1a3e77d319c4fbb7f854a4823c377": {
		functionName: "saveBranding_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"e682363827ca155e055ae4abfb133f0a303937aa94d8b165b4b6ffd314136ef0": {
		functionName: "updateEnvelopeStatus_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"e734a7a45e66e02d284ca8073c3602a2107dc49c5ef4aa181a32111ffc05043b": {
		functionName: "createApproval_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"e7f373e4fb3f80fd85659fd0ed89f80405b272c61f8c03f9484ac77964a06b85": {
		functionName: "addTask_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"ea3b1c7a65066ea4a8f655fbd3dde340da3ac64b2dc384ccc045a5444ee79349": {
		functionName: "sendChat_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"ea5a95b754af30a6e2ad0ddfa0f71aa688f9286295de1f860b7726ddf3f9c0e9": {
		functionName: "createForm_createServerFn_handler",
		importer: () => import("./forms-Dev-spWV.mjs")
	},
	"ec40a49d29167e63f96501aa076dd7e9dec07c10343c17392f1d0c753b94f096": {
		functionName: "mergePeople_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"ed22bebc16a47e654ff8b3ba50d24347b01240dd7a0affcb5545859ab82760ae": {
		functionName: "revokeWebhook_createServerFn_handler",
		importer: () => import("./developer-CgvmrJxK.mjs")
	},
	"eddd8773a598e820277314b06afa61d4b04a3647410b59b0f87d8db5d1b586df": {
		functionName: "createVehicle_createServerFn_handler",
		importer: () => import("./travel-C7JH-Is-.mjs")
	},
	"ee3fc57e815237cd182a7fe6fe6b777d8266488a0e5d94a72ee2e7160bf6c12a": {
		functionName: "uploadPortalFile_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"ee63be7678ad3ffd52351582befc96272a1b17bcd628d2fbc850525b134105f9": {
		functionName: "rotateVendorToken_createServerFn_handler",
		importer: () => import("./forms-Dev-spWV.mjs")
	},
	"ee8154a883c00eda0f221665e583ee39f89127b03e94162dc769f8584786a5da": {
		functionName: "listEventRequests_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"f0ede3ccff518cf0688e1fa604f556f3c334854b3dfb506411a857e254518129": {
		functionName: "getUsage_createServerFn_handler",
		importer: () => import("./governance-WUzBmkB-.mjs")
	},
	"f1390fed3e65288922e06213d87c831951d9483e3f7823dfdeea302c8a1055d6": {
		functionName: "listSandbox_createServerFn_handler",
		importer: () => import("./governance-WUzBmkB-.mjs")
	},
	"f13c903674b00137bf6282a506ba7d856b0ff836e29f69dc0d1daf5d1edde83b": {
		functionName: "getEnvelopePublic_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"f36cf2753d3df4dfcf5bc9a64c00344014ff16f6d06b4ea0d6b058e35f062a25": {
		functionName: "archiveForm_createServerFn_handler",
		importer: () => import("./forms-Dev-spWV.mjs")
	},
	"f45670b8c15ffef987e5305067ce8ff1373b63ee2e52915c9bdf648ec106d5d1": {
		functionName: "mutateTask_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"f48f224b11a7f56547055ddd9ffe8c12c7f0dc23874b3a9db0e8e8c7f3ae1247": {
		functionName: "getOpsHome_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"f4fb5ebe4529d2a0ae5448376a411d579f23bc2376c7b5d07b983a4ab37e6775": {
		functionName: "moveTask_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"f592c9696ffa665245c923cce3daf1e244d9d9fc1dab1e911ad3cb6caea447f5": {
		functionName: "saveAiProfile_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"f5ad60a0b3c2546d5f325f456572020a1b3f4b7a8c7033bba54ced97951cd35a": {
		functionName: "switchTenant_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"f9424817590b6162718b94086864dc52c1526e6708077e8e5bdc1cc79b44b7e2": {
		functionName: "getAiDesk_createServerFn_handler",
		importer: () => import("./ops-DGVmDT2A.mjs")
	},
	"fa0a3f7f35a3f597c77e93ac2ca4caca79fe4941ad532a53990a03f140e803c2": {
		functionName: "updateStage_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"fa7d03d6a5cd4497cf2165b8c9a2eb864092721886b2f543fe0fc6aa25122746": {
		functionName: "listApprovals_createServerFn_handler",
		importer: () => import("./server-DIrj-NOf.mjs")
	},
	"fb4532836f67eafefd7d3b339b271a36aae1778fe87671a78804b0c0ade573b7": {
		functionName: "lockSession_createServerFn_handler",
		importer: () => import("./governance-WUzBmkB-.mjs")
	},
	"fc7db517c0f90eaef7d3e7205101df84e313305563ff12ae2c5fdf21f50df3c7": {
		functionName: "toggleConnection_createServerFn_handler",
		importer: () => import("./schedule-Cx0LJKVc.mjs")
	},
	"fcb882bfefe2490559cc1cdb8b3dc88bfbc52f8255e0b149cd9512b2deffe166": {
		functionName: "listProjects_createServerFn_handler",
		importer: () => import("./server-DJUE0g_r.mjs")
	},
	"ff2e035efdb2f33559f0c450ff7c3878eaf2bfb01f0614964b7620e5b00248f3": {
		functionName: "getAdmin_createServerFn_handler",
		importer: () => import("./ultimate-DQjLMLvX.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
var TSS_FORMDATA_CONTEXT = "__TSS_CONTEXT";
var TSS_SERVER_FUNCTION = Symbol.for("TSS_SERVER_FUNCTION");
var TSS_SERVER_FUNCTION_FACTORY = Symbol.for("TSS_SERVER_FUNCTION_FACTORY");
var X_TSS_SERIALIZED = "x-tss-serialized";
var X_TSS_RAW_RESPONSE = "x-tss-raw";
/** Content-Type for multiplexed framed responses (RawStream support) */
var TSS_CONTENT_TYPE_FRAMED = "application/x-tss-framed";
/**
* Frame types for binary multiplexing protocol.
*/
var FrameType = {
	/** Seroval JSON chunk (NDJSON line) */
	JSON: 0,
	/** Raw stream data chunk */
	CHUNK: 1,
	/** Raw stream end (EOF) */
	END: 2,
	/** Raw stream error */
	ERROR: 3
};
/** Full Content-Type header value with version parameter */
var TSS_CONTENT_TYPE_FRAMED_VERSIONED = `${TSS_CONTENT_TYPE_FRAMED}; v=1`;
function isSafeKey(key) {
	return key !== "__proto__" && key !== "constructor" && key !== "prototype";
}
/**
* Merge target and source into a new null-proto object, filtering dangerous keys.
*/
function safeObjectMerge(target, source) {
	const result = Object.create(null);
	if (target) {
		for (const key of Object.keys(target)) if (isSafeKey(key)) result[key] = target[key];
	}
	if (source && typeof source === "object") {
		for (const key of Object.keys(source)) if (isSafeKey(key)) result[key] = source[key];
	}
	return result;
}
/**
* Create a null-prototype object, optionally copying from source.
*/
function createNullProtoObject(source) {
	if (!source) return Object.create(null);
	const obj = Object.create(null);
	for (const key of Object.keys(source)) if (isSafeKey(key)) obj[key] = source[key];
	return obj;
}
var GLOBAL_STORAGE_KEY = Symbol.for("tanstack-start:start-storage-context");
var globalObj = globalThis;
if (!globalObj[GLOBAL_STORAGE_KEY]) globalObj[GLOBAL_STORAGE_KEY] = new AsyncLocalStorage();
var startStorage = globalObj[GLOBAL_STORAGE_KEY];
async function runWithStartContext(context, fn) {
	return startStorage.run(context, fn);
}
function getStartContext(opts) {
	const context = startStorage.getStore();
	if (!context && opts?.throwIfNotFound !== false) throw new Error(`No Start context found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`);
	return context;
}
var getStartOptions = () => getStartContext().startOptions;
var getStartContextServerOnly = getStartContext;
var createServerFn = (options, __opts) => {
	const resolvedOptions = __opts || options || {};
	if (typeof resolvedOptions.method === "undefined") resolvedOptions.method = "GET";
	const setValidator = (validator) => {
		return createServerFn(void 0, {
			...resolvedOptions,
			validator,
			inputValidator: validator
		});
	};
	const res = {
		options: resolvedOptions,
		middleware: (middleware) => {
			const newMiddleware = [...resolvedOptions.middleware || []];
			middleware.map((m) => {
				if (TSS_SERVER_FUNCTION_FACTORY in m) {
					if (m.options.middleware) newMiddleware.push(...m.options.middleware);
				} else newMiddleware.push(m);
			});
			const res = createServerFn(void 0, {
				...resolvedOptions,
				middleware: newMiddleware
			});
			res[TSS_SERVER_FUNCTION_FACTORY] = true;
			return res;
		},
		validator: setValidator,
		inputValidator: setValidator,
		handler: (...args) => {
			const [extractedFn, serverFn] = args;
			const newOptions = {
				...resolvedOptions,
				extractedFn,
				serverFn
			};
			const resolvedMiddleware = [...newOptions.middleware || [], serverFnBaseToMiddleware(newOptions)];
			extractedFn.method = resolvedOptions.method;
			return Object.assign(async (opts) => {
				const result = await executeMiddleware$1(resolvedMiddleware, "client", {
					...extractedFn,
					...newOptions,
					data: opts?.data,
					headers: opts?.headers,
					signal: opts?.signal,
					fetch: opts?.fetch,
					context: createNullProtoObject()
				});
				const redirect = parseRedirect(result.error);
				if (redirect) throw redirect;
				if (result.error) throw result.error;
				return result.result;
			}, {
				...extractedFn,
				method: resolvedOptions.method,
				__executeServer: async (opts) => {
					const startContext = getStartContextServerOnly();
					const serverContextAfterGlobalMiddlewares = startContext.contextAfterGlobalMiddlewares;
					return await executeMiddleware$1(resolvedMiddleware, "server", {
						...extractedFn,
						...opts,
						serverFnMeta: extractedFn.serverFnMeta,
						context: safeObjectMerge(opts.context, serverContextAfterGlobalMiddlewares),
						request: startContext.request
					}).then((d) => ({
						result: d.result,
						error: d.error,
						context: d.sendContext
					}));
				}
			});
		}
	};
	const fun = (options) => {
		return createServerFn(void 0, {
			...resolvedOptions,
			...options
		});
	};
	return Object.assign(fun, res);
};
async function executeMiddleware$1(middlewares, env, opts) {
	let flattenedMiddlewares = flattenMiddlewares([...getStartOptions()?.functionMiddleware || [], ...middlewares]);
	if (env === "server") {
		const startContext = getStartContextServerOnly({ throwIfNotFound: false });
		if (startContext?.executedRequestMiddlewares) flattenedMiddlewares = flattenedMiddlewares.filter((m) => !startContext.executedRequestMiddlewares.has(m));
	}
	const callNextMiddleware = async (ctx) => {
		const nextMiddleware = flattenedMiddlewares.shift();
		if (!nextMiddleware) return ctx;
		try {
			let validator = "validator" in nextMiddleware.options ? nextMiddleware.options.validator : void 0;
			if (!validator && "inputValidator" in nextMiddleware.options) validator = nextMiddleware.options.inputValidator;
			if (validator && env === "server") ctx.data = await execValidator(validator, ctx.data);
			let middlewareFn = void 0;
			if (env === "client") {
				if ("client" in nextMiddleware.options) middlewareFn = nextMiddleware.options.client;
			} else if ("server" in nextMiddleware.options) middlewareFn = nextMiddleware.options.server;
			if (middlewareFn) {
				const userNext = async (userCtx = {}) => {
					const result = await callNextMiddleware({
						...ctx,
						...userCtx,
						context: safeObjectMerge(ctx.context, userCtx.context),
						sendContext: safeObjectMerge(ctx.sendContext, userCtx.sendContext),
						headers: mergeHeaders(ctx.headers, userCtx.headers),
						_callSiteFetch: ctx._callSiteFetch,
						fetch: ctx._callSiteFetch ?? userCtx.fetch ?? ctx.fetch,
						result: userCtx.result !== void 0 ? userCtx.result : userCtx instanceof Response ? userCtx : ctx.result,
						error: userCtx.error ?? ctx.error
					});
					if (result.error) throw result.error;
					return result;
				};
				const result = await middlewareFn({
					...ctx,
					next: userNext
				});
				if (isRedirect(result)) return {
					...ctx,
					error: result
				};
				if (result instanceof Response) return {
					...ctx,
					result
				};
				if (!result) throw new Error("User middleware returned undefined. You must call next() or return a result in your middlewares.");
				return result;
			}
			return callNextMiddleware(ctx);
		} catch (error) {
			return {
				...ctx,
				error
			};
		}
	};
	return callNextMiddleware({
		...opts,
		headers: opts.headers || {},
		sendContext: opts.sendContext || {},
		context: opts.context || createNullProtoObject(),
		_callSiteFetch: opts.fetch
	});
}
function flattenMiddlewares(middlewares, maxDepth = 100) {
	const seen = /* @__PURE__ */ new Set();
	const flattened = [];
	const recurse = (middleware, depth) => {
		if (depth > maxDepth) throw new Error(`Middleware nesting depth exceeded maximum of ${maxDepth}. Check for circular references.`);
		middleware.forEach((m) => {
			if (m.options.middleware) recurse(m.options.middleware, depth + 1);
			if (!seen.has(m)) {
				seen.add(m);
				flattened.push(m);
			}
		});
	};
	recurse(middlewares, 0);
	return flattened;
}
async function execValidator(validator, input) {
	if (validator == null) return {};
	if ("~standard" in validator) {
		const result = await validator["~standard"].validate(input);
		if (result.issues) throw new Error(JSON.stringify(result.issues, void 0, 2));
		return result.value;
	}
	if ("parse" in validator) return validator.parse(input);
	if (typeof validator === "function") return validator(input);
	throw new Error("Invalid validator type!");
}
function serverFnBaseToMiddleware(options) {
	return {
		"~types": void 0,
		options: {
			inputValidator: options.validator ?? options.inputValidator,
			client: async ({ next, sendContext, fetch, ...ctx }) => {
				const payload = {
					...ctx,
					context: sendContext,
					fetch
				};
				return next(await options.extractedFn?.(payload));
			},
			server: async ({ next, ...ctx }) => {
				const result = await options.serverFn?.(ctx);
				return next({
					...ctx,
					result
				});
			}
		}
	};
}
var createMiddleware = (options, __opts) => {
	const resolvedOptions = {
		type: "request",
		...__opts || options
	};
	const setValidator = (validator) => {
		return createMiddleware({}, Object.assign(resolvedOptions, {
			validator,
			inputValidator: validator
		}));
	};
	return {
		options: resolvedOptions,
		middleware: (middleware) => {
			return createMiddleware({}, Object.assign(resolvedOptions, { middleware }));
		},
		validator: setValidator,
		inputValidator: setValidator,
		client: (client) => {
			return createMiddleware({}, Object.assign(resolvedOptions, { client }));
		},
		server: (server) => {
			return createMiddleware({}, Object.assign(resolvedOptions, { server }));
		}
	};
};
var innerCreateCsrfMiddleware = (opts = {}) => {
	return createMiddleware().server(async (ctx) => {
		const csrfCtx = ctx;
		if (opts.filter && !await opts.filter(csrfCtx)) return ctx.next();
		if (await isCsrfRequestAllowed(opts, csrfCtx)) return ctx.next();
		return getFailureResponse(opts, csrfCtx);
	});
};
var createCsrfMiddleware = innerCreateCsrfMiddleware;
async function isCsrfRequestAllowed(opts, ctx) {
	const result = await getCsrfRequestValidationResult(opts, ctx);
	return result === true || result === void 0 && opts.allowRequestsWithoutOriginCheck === true;
}
async function getCsrfRequestValidationResult(opts, ctx) {
	const fetchSite = ctx.request.headers.get("Sec-Fetch-Site");
	if (fetchSite !== null) return matchValue(opts.secFetchSite ?? "same-origin", fetchSite, ctx);
	const origin = ctx.request.headers.get("Origin");
	if (origin !== null) {
		if (opts.origin) return matchValue(opts.origin, origin, ctx);
		return origin === new URL(ctx.request.url).origin;
	}
	const referer = ctx.request.headers.get("Referer");
	if (referer === null || opts.referer === false) return;
	if (typeof opts.referer === "function") return opts.referer(referer, ctx);
	if (opts.origin) {
		const refererOrigin = getOriginFromUrl(referer);
		return refererOrigin !== void 0 && matchValue(opts.origin, refererOrigin, ctx);
	}
	return isRefererSameOrigin(referer, new URL(ctx.request.url).origin);
}
async function matchValue(matcher, value, ctx) {
	if (typeof matcher === "function") return matcher(value, ctx);
	if (Array.isArray(matcher)) return matcher.includes(value);
	return value === matcher;
}
function getOriginFromUrl(url) {
	try {
		return new URL(url).origin;
	} catch {
		return;
	}
}
function isRefererSameOrigin(referer, requestOrigin) {
	if (referer === requestOrigin) return true;
	if (!referer.startsWith(requestOrigin)) return false;
	if (referer.length === requestOrigin.length) return true;
	const code = referer.charCodeAt(requestOrigin.length);
	return code === 47 || code === 63 || code === 35;
}
async function getFailureResponse(opts, ctx) {
	if (typeof opts.failureResponse === "function") return opts.failureResponse(ctx);
	return opts.failureResponse?.clone() ?? new Response("Forbidden", { status: 403 });
}
function getDefaultSerovalPlugins() {
	return [...(getStartOptions()?.serializationAdapters)?.map(makeSerovalPlugin) ?? [], ...defaultSerovalPlugins];
}
/**
* Binary frame protocol for multiplexing JSON and raw streams over HTTP.
*
* Frame format: [type:1][streamId:4][length:4][payload:length]
* - type: 1 byte - frame type (JSON, CHUNK, END, ERROR)
* - streamId: 4 bytes big-endian uint32 - stream identifier
* - length: 4 bytes big-endian uint32 - payload length
* - payload: variable length bytes
*/
/** Cached TextEncoder for frame encoding */
var textEncoder = new TextEncoder();
/** Shared empty payload for END frames - avoids allocation per call */
var EMPTY_PAYLOAD = /* @__PURE__ */ new Uint8Array(0);
/**
* Encodes a single frame with header and payload.
*/
function encodeFrame(type, streamId, payload) {
	const frame = new Uint8Array(9 + payload.length);
	frame[0] = type;
	frame[1] = streamId >>> 24 & 255;
	frame[2] = streamId >>> 16 & 255;
	frame[3] = streamId >>> 8 & 255;
	frame[4] = streamId & 255;
	frame[5] = payload.length >>> 24 & 255;
	frame[6] = payload.length >>> 16 & 255;
	frame[7] = payload.length >>> 8 & 255;
	frame[8] = payload.length & 255;
	frame.set(payload, 9);
	return frame;
}
/**
* Encodes a JSON frame (type 0, streamId 0).
*/
function encodeJSONFrame(json) {
	return encodeFrame(FrameType.JSON, 0, textEncoder.encode(json));
}
/**
* Encodes a raw stream chunk frame.
*/
function encodeChunkFrame(streamId, chunk) {
	return encodeFrame(FrameType.CHUNK, streamId, chunk);
}
/**
* Encodes a raw stream end frame.
*/
function encodeEndFrame(streamId) {
	return encodeFrame(FrameType.END, streamId, EMPTY_PAYLOAD);
}
/**
* Encodes a raw stream error frame.
*/
function encodeErrorFrame(streamId, error) {
	const message = error instanceof Error ? error.message : String(error ?? "Unknown error");
	return encodeFrame(FrameType.ERROR, streamId, textEncoder.encode(message));
}
/**
* Creates a multiplexed ReadableStream from JSON stream and raw streams.
*
* The JSON stream emits NDJSON lines (from seroval's toCrossJSONStream).
* Raw streams are pumped concurrently, interleaved with JSON frames.
*
* Supports late stream registration for RawStreams discovered after initial
* serialization (e.g., from resolved Promises).
*
* @param jsonStream Stream of JSON strings (each string is one NDJSON line)
* @param rawStreams Map of stream IDs to raw binary streams (known at start)
* @param lateStreamSource Optional stream of late registrations for streams discovered later
*/
function createMultiplexedStream(jsonStream, rawStreams, lateStreamSource) {
	let controller;
	let cancelled = false;
	const readers = [];
	const enqueue = (frame) => {
		if (cancelled) return false;
		try {
			controller.enqueue(frame);
			return true;
		} catch {
			return false;
		}
	};
	const errorOutput = (error) => {
		if (cancelled) return;
		cancelled = true;
		try {
			controller.error(error);
		} catch {}
		for (const reader of readers) reader.cancel().catch(() => {});
	};
	async function pumpRawStream(streamId, stream) {
		const reader = stream.getReader();
		readers.push(reader);
		try {
			while (!cancelled) {
				const { done, value } = await reader.read();
				if (done) {
					enqueue(encodeEndFrame(streamId));
					return;
				}
				if (!enqueue(encodeChunkFrame(streamId, value))) return;
			}
		} catch (error) {
			enqueue(encodeErrorFrame(streamId, error));
		} finally {
			reader.releaseLock();
		}
	}
	async function pumpJSON() {
		const reader = jsonStream.getReader();
		readers.push(reader);
		try {
			while (!cancelled) {
				const { done, value } = await reader.read();
				if (done) return;
				if (!enqueue(encodeJSONFrame(value))) return;
			}
		} catch (error) {
			errorOutput(error);
			throw error;
		} finally {
			reader.releaseLock();
		}
	}
	async function pumpLateStreams() {
		if (!lateStreamSource) return [];
		const lateStreamPumps = [];
		const reader = lateStreamSource.getReader();
		readers.push(reader);
		try {
			while (!cancelled) {
				const { done, value } = await reader.read();
				if (done) break;
				lateStreamPumps.push(pumpRawStream(value.id, value.stream));
			}
		} finally {
			reader.releaseLock();
		}
		return lateStreamPumps;
	}
	return new ReadableStream({
		async start(ctrl) {
			controller = ctrl;
			const pumps = [pumpJSON()];
			for (const [streamId, stream] of rawStreams) pumps.push(pumpRawStream(streamId, stream));
			if (lateStreamSource) pumps.push(pumpLateStreams());
			try {
				const latePumps = (await Promise.all(pumps)).find(Array.isArray);
				if (latePumps && latePumps.length > 0) await Promise.all(latePumps);
				if (!cancelled) try {
					controller.close();
				} catch {}
			} catch {}
		},
		cancel() {
			cancelled = true;
			for (const reader of readers) reader.cancel().catch(() => {});
			readers.length = 0;
		}
	});
}
var serovalPlugins = void 0;
var FORM_DATA_CONTENT_TYPES = ["multipart/form-data", "application/x-www-form-urlencoded"];
var MAX_PAYLOAD_SIZE = 1e6;
var handleServerAction = async ({ request, context, serverFnId }) => {
	const methodUpper = request.method.toUpperCase();
	const url = new URL(request.url);
	const action = await getServerFnById(serverFnId, { origin: "client" });
	if (action.method && methodUpper !== action.method) return new Response(`expected ${action.method} method. Got ${methodUpper}`, {
		status: 405,
		headers: { Allow: action.method }
	});
	const isServerFn = request.headers.get("x-tsr-serverFn") === "true";
	if (!serovalPlugins) serovalPlugins = getDefaultSerovalPlugins();
	const contentType = request.headers.get("Content-Type");
	function parsePayload(payload) {
		return fromJSON(payload, { plugins: serovalPlugins });
	}
	return await (async () => {
		try {
			let res = await (async () => {
				if (FORM_DATA_CONTENT_TYPES.some((type) => contentType && contentType.includes(type))) {
					if (methodUpper === "GET") invariant();
					const formData = await request.formData();
					const serializedContext = formData.get(TSS_FORMDATA_CONTEXT);
					formData.delete(TSS_FORMDATA_CONTEXT);
					const params = {
						context,
						data: formData,
						method: methodUpper
					};
					if (typeof serializedContext === "string") try {
						const deserializedContext = fromJSON(JSON.parse(serializedContext), { plugins: serovalPlugins });
						if (typeof deserializedContext === "object" && deserializedContext) params.context = safeObjectMerge(deserializedContext, context);
					} catch (e) {}
					return await action(params);
				}
				if (methodUpper === "GET") {
					const payloadParam = url.searchParams.get("payload");
					if (payloadParam && payloadParam.length > MAX_PAYLOAD_SIZE) throw new Error("Payload too large");
					const payload = payloadParam ? parsePayload(JSON.parse(payloadParam)) : {};
					payload.context = safeObjectMerge(payload.context, context);
					payload.method = methodUpper;
					return await action(payload);
				}
				let jsonPayload;
				if (contentType?.includes("application/json")) jsonPayload = await request.json();
				const payload = jsonPayload ? parsePayload(jsonPayload) : {};
				payload.context = safeObjectMerge(payload.context, context);
				payload.method = methodUpper;
				return await action(payload);
			})();
			const unwrapped = res.result || res.error;
			if (isNotFound(res)) res = isNotFoundResponse(res);
			if (!isServerFn) return unwrapped;
			if (unwrapped instanceof Response) {
				if (isRedirect(unwrapped)) return unwrapped;
				unwrapped.headers.set(X_TSS_RAW_RESPONSE, "true");
				return unwrapped;
			}
			return serializeResult(res);
			function serializeResult(res) {
				let nonStreamingBody = void 0;
				const alsResponse = getResponse();
				if (res !== void 0) {
					const rawStreams = /* @__PURE__ */ new Map();
					let initialPhase = true;
					let lateStreamWriter;
					let lateStreamReadable = void 0;
					const pendingLateStreams = [];
					const plugins = [createRawStreamRPCPlugin((id, stream) => {
						if (initialPhase) {
							rawStreams.set(id, stream);
							return;
						}
						if (lateStreamWriter) {
							lateStreamWriter.write({
								id,
								stream
							}).catch(() => {});
							return;
						}
						pendingLateStreams.push({
							id,
							stream
						});
					}), ...serovalPlugins || []];
					let done = false;
					const callbacks = {
						onParse: (value) => {
							nonStreamingBody = value;
						},
						onDone: () => {
							done = true;
						},
						onError: (error) => {
							throw error;
						}
					};
					toCrossJSONStream(res, {
						refs: /* @__PURE__ */ new Map(),
						plugins,
						onParse(value) {
							callbacks.onParse(value);
						},
						onDone() {
							callbacks.onDone();
						},
						onError: (error) => {
							callbacks.onError(error);
						}
					});
					initialPhase = false;
					if (done && rawStreams.size === 0) return new Response(nonStreamingBody ? JSON.stringify(nonStreamingBody) : void 0, {
						status: alsResponse.status,
						statusText: alsResponse.statusText,
						headers: {
							"Content-Type": "application/json",
							[X_TSS_SERIALIZED]: "true"
						}
					});
					const { readable, writable } = new TransformStream();
					lateStreamReadable = readable;
					lateStreamWriter = writable.getWriter();
					for (const registration of pendingLateStreams) lateStreamWriter.write(registration).catch(() => {});
					pendingLateStreams.length = 0;
					const multiplexedStream = createMultiplexedStream(new ReadableStream({
						start(controller) {
							callbacks.onParse = (value) => {
								controller.enqueue(JSON.stringify(value) + "\n");
							};
							callbacks.onDone = () => {
								try {
									controller.close();
								} catch {}
								lateStreamWriter?.close().catch(() => {}).finally(() => {
									lateStreamWriter = void 0;
								});
							};
							callbacks.onError = (error) => {
								controller.error(error);
								lateStreamWriter?.abort(error).catch(() => {}).finally(() => {
									lateStreamWriter = void 0;
								});
							};
							if (nonStreamingBody !== void 0) callbacks.onParse(nonStreamingBody);
							if (done) callbacks.onDone();
						},
						cancel() {
							lateStreamWriter?.abort().catch(() => {});
							lateStreamWriter = void 0;
						}
					}), rawStreams, lateStreamReadable);
					return new Response(multiplexedStream, {
						status: alsResponse.status,
						statusText: alsResponse.statusText,
						headers: {
							"Content-Type": TSS_CONTENT_TYPE_FRAMED_VERSIONED,
							[X_TSS_SERIALIZED]: "true"
						}
					});
				}
				return new Response(void 0, {
					status: alsResponse.status,
					statusText: alsResponse.statusText
				});
			}
		} catch (error) {
			if (error instanceof Response) return error;
			if (isNotFound(error)) return isNotFoundResponse(error);
			console.info();
			console.info("Server Fn Error!");
			console.info();
			console.error(error);
			console.info();
			const serializedError = JSON.stringify(await Promise.resolve(toCrossJSONAsync(error, {
				refs: /* @__PURE__ */ new Map(),
				plugins: serovalPlugins
			})));
			const response = getResponse();
			return new Response(serializedError, {
				status: response.status ?? 500,
				statusText: response.statusText,
				headers: {
					"Content-Type": "application/json",
					[X_TSS_SERIALIZED]: "true"
				}
			});
		}
	})();
};
function isNotFoundResponse(error) {
	const { headers, ...rest } = error;
	return new Response(JSON.stringify(rest), {
		status: 404,
		headers: {
			"Content-Type": "application/json",
			...headers || {}
		}
	});
}
var LINK_PARAM_TOKEN_RE = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
var PRELOAD_AS_VALUES = /* @__PURE__ */ new Set([
	"fetch",
	"font",
	"image",
	"script",
	"style",
	"track"
]);
function buildLinkParam(name, value) {
	if (value === void 0) return name;
	if (LINK_PARAM_TOKEN_RE.test(value)) return `${name}=${value}`;
	return `${name}=${JSON.stringify(value)}`;
}
function serializeEarlyHint(hint) {
	const parts = [`<${hint.href}>`, buildLinkParam("rel", hint.rel)];
	if (hint.as) parts.push(buildLinkParam("as", hint.as));
	if (hint.crossOrigin !== void 0) parts.push(buildLinkParam("crossorigin", hint.crossOrigin || void 0));
	if (hint.type) parts.push(buildLinkParam("type", hint.type));
	if (hint.integrity) parts.push(buildLinkParam("integrity", hint.integrity));
	if (hint.referrerPolicy) parts.push(buildLinkParam("referrerpolicy", hint.referrerPolicy));
	if (hint.fetchPriority) parts.push(buildLinkParam("fetchpriority", hint.fetchPriority));
	return parts.join("; ");
}
function getStringAttr(attrs, name, fallbackName) {
	const value = attrs?.[name] ?? (fallbackName ? attrs?.[fallbackName] : void 0);
	return typeof value === "string" ? value : void 0;
}
function getPreloadAs(attrs) {
	const as = getStringAttr(attrs, "as");
	return as && PRELOAD_AS_VALUES.has(as) ? as : void 0;
}
function addEarlyHintFetchAttrs(hint, attrs) {
	const crossOrigin = getStringAttr(attrs, "crossOrigin", "crossorigin");
	const type = getStringAttr(attrs, "type");
	const integrity = getStringAttr(attrs, "integrity");
	const referrerPolicy = getStringAttr(attrs, "referrerPolicy", "referrerpolicy");
	const fetchPriority = getStringAttr(attrs, "fetchPriority", "fetchpriority");
	if (crossOrigin !== void 0) hint.crossOrigin = crossOrigin;
	if (type) hint.type = type;
	if (integrity) hint.integrity = integrity;
	if (referrerPolicy) hint.referrerPolicy = referrerPolicy;
	if (fetchPriority) hint.fetchPriority = fetchPriority;
}
function linkAttrsToEarlyHint(attrs) {
	const href = getStringAttr(attrs, "href");
	const rel = getStringAttr(attrs, "rel");
	if (!href || !rel) return void 0;
	const relTokens = rel.split(/\s+/);
	let hintRel;
	let hintAs;
	if (relTokens.includes("modulepreload")) {
		hintRel = "modulepreload";
		hintAs = "script";
	} else if (relTokens.includes("stylesheet")) {
		hintRel = "preload";
		hintAs = "style";
	} else if (relTokens.includes("preload")) {
		hintAs = getPreloadAs(attrs);
		if (!hintAs) return void 0;
		hintRel = "preload";
	} else if (relTokens.includes("preconnect")) {
		hintRel = "preconnect";
		hintAs = void 0;
	} else if (relTokens.includes("dns-prefetch")) {
		hintRel = "dns-prefetch";
		hintAs = void 0;
	}
	if (!hintRel) return void 0;
	const hint = {
		href,
		rel: hintRel
	};
	if (hintAs) hint.as = hintAs;
	addEarlyHintFetchAttrs(hint, attrs);
	return hint;
}
function collectStaticHintsFromManifest(manifest, matchedRoutes) {
	const hints = [];
	for (const route of matchedRoutes) {
		const routeManifest = manifest.routes[route.id];
		if (!routeManifest) continue;
		for (const link of routeManifest.preloads ?? []) {
			const attrs = getScriptPreloadAttrs(manifest, link);
			const hint = {
				href: attrs.href,
				rel: attrs.rel,
				as: "script"
			};
			if (attrs.crossOrigin !== void 0) hint.crossOrigin = attrs.crossOrigin;
			hints.push(hint);
		}
		for (const link of routeManifest.css ?? []) {
			const stylesheetHref = getStylesheetHref(link);
			if (manifest.inlineCss?.styles[stylesheetHref] !== void 0) continue;
			const resolvedLink = resolveManifestCssLink(link);
			const hint = {
				href: stylesheetHref,
				rel: "preload",
				as: "style"
			};
			if (resolvedLink.crossOrigin !== void 0) hint.crossOrigin = resolvedLink.crossOrigin;
			hints.push(hint);
		}
	}
	return hints;
}
function collectDynamicHintsFromMatches(matches) {
	const hints = [];
	for (const match of matches) {
		const links = match.links;
		if (!Array.isArray(links)) continue;
		for (const link of links) {
			const hint = linkAttrsToEarlyHint(link);
			if (hint) hints.push(hint);
		}
	}
	return hints;
}
function createEarlyHintsEvent(opts) {
	const nextHints = [];
	const nextLinks = [];
	for (const hint of opts.hints) {
		const link = serializeEarlyHint(hint);
		if (opts.sentLinks.has(link)) continue;
		opts.sentLinks.add(link);
		opts.sentHints.push(hint);
		nextHints.push(hint);
		nextLinks.push(link);
	}
	if (!nextHints.length && opts.phase !== "dynamic") return void 0;
	return {
		phase: opts.phase,
		hints: nextHints,
		links: nextLinks,
		allHints: opts.sentHints.slice(),
		allLinks: Array.from(opts.sentLinks)
	};
}
function createResponseLinkHeaderEntries(opts) {
	for (const hint of opts.hints) {
		const link = serializeEarlyHint(hint);
		if (opts.sentLinks.has(link)) continue;
		opts.sentLinks.add(link);
		opts.entries.push({
			phase: opts.phase,
			hint,
			link
		});
	}
}
function getResponseLinkHeaderEntries(opts) {
	if (!opts.filter) return opts.entries.map((entry) => entry.link);
	try {
		const links = [];
		for (const entry of opts.entries) if (opts.filter(entry)) links.push(entry.link);
		return links;
	} catch (err) {
		console.error("Error filtering response Link headers:", err);
		return [];
	}
}
function notifyEarlyHints(phase, event, onEarlyHints) {
	try {
		const result = onEarlyHints(event);
		if (result) Promise.resolve(result).catch((err) => {
			console.error(`Error sending ${phase} early hints:`, err);
		});
	} catch (err) {
		console.error(`Error sending ${phase} early hints:`, err);
	}
}
function getResponseLinkHeaderFilter(responseLinkHeader) {
	if (typeof responseLinkHeader !== "object") return;
	return responseLinkHeader.filter;
}
function appendResponseLinkHeaders(opts) {
	for (const link of getResponseLinkHeaderEntries(opts)) opts.responseHeaders.append("Link", link);
}
function collectResponseLinkHeaderEntries(opts) {
	for (let index = 0; index < opts.event.hints.length; index++) opts.entries.push({
		phase: opts.phase,
		hint: opts.event.hints[index],
		link: opts.event.links[index]
	});
}
function collectEarlyHintsPhase(opts) {
	const event = opts.onEarlyHints ? createEarlyHintsEvent({
		phase: opts.phase,
		hints: opts.hints,
		sentLinks: opts.sentLinks,
		sentHints: opts.sentHints
	}) : void 0;
	if (event) notifyEarlyHints(opts.phase, event, opts.onEarlyHints);
	if (!opts.responseLinkHeaderEntries) return;
	if (event) {
		collectResponseLinkHeaderEntries({
			phase: opts.phase,
			event,
			entries: opts.responseLinkHeaderEntries
		});
		return;
	}
	createResponseLinkHeaderEntries({
		phase: opts.phase,
		hints: opts.hints,
		sentLinks: opts.sentLinks,
		entries: opts.responseLinkHeaderEntries
	});
}
function createEarlyHintsCollector(opts) {
	if (!opts?.onEarlyHints && !opts?.responseLinkHeader) return;
	const sentLinks = /* @__PURE__ */ new Set();
	const sentHints = opts.onEarlyHints ? new Array() : void 0;
	const responseLinkHeaderEntries = opts.responseLinkHeader ? new Array() : void 0;
	const responseLinkHeaderFilter = getResponseLinkHeaderFilter(opts.responseLinkHeader);
	return {
		collectStatic: ({ manifest, matchedRoutes }) => {
			if (!matchedRoutes?.length) return;
			collectEarlyHintsPhase({
				phase: "static",
				hints: collectStaticHintsFromManifest(manifest, matchedRoutes),
				sentLinks,
				sentHints,
				onEarlyHints: opts.onEarlyHints,
				responseLinkHeaderEntries
			});
		},
		collectDynamic: (matches) => {
			collectEarlyHintsPhase({
				phase: "dynamic",
				hints: collectDynamicHintsFromMatches(matches),
				sentLinks,
				sentHints,
				onEarlyHints: opts.onEarlyHints,
				responseLinkHeaderEntries
			});
		},
		appendResponseHeaders: (headers) => {
			if (!responseLinkHeaderEntries?.length) return;
			appendResponseLinkHeaders({
				responseHeaders: headers,
				entries: responseLinkHeaderEntries,
				filter: responseLinkHeaderFilter
			});
		}
	};
}
function normalizeTransformAssetResult(result) {
	if (typeof result === "string") return { href: result };
	return result;
}
function escapeCssString(value) {
	return value.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\n/g, "\\a ").replace(/\r/g, "\\d ").replace(/\f/g, "\\c ");
}
async function transformInlineCssTemplate(options) {
	const { strings, urls } = options.template;
	if (strings.length !== urls.length + 1) throw new Error(`TanStack Start inlineCss template for ${options.stylesheetHref} is invalid`);
	let css = strings[0];
	for (let index = 0; index < urls.length; index++) {
		const transformed = normalizeTransformAssetResult(await options.transformFn({
			kind: "css-url",
			url: urls[index],
			stylesheetHref: options.stylesheetHref
		}));
		css += escapeCssString(transformed.href) + strings[index + 1];
	}
	return css;
}
async function transformInlineCssStyles(inlineCss, transformFn) {
	const transformedStyles = {};
	const transformedEntries = await Promise.all(Object.entries(inlineCss.styles).map(async ([stylesheetHref, css]) => {
		const template = inlineCss.templates?.[stylesheetHref];
		return [stylesheetHref, template ? await transformInlineCssTemplate({
			stylesheetHref,
			template,
			transformFn
		}) : css];
	}));
	for (const [stylesheetHref, css] of transformedEntries) transformedStyles[stylesheetHref] = css;
	return {
		styles: transformedStyles,
		...inlineCss.templates ? { templates: inlineCss.templates } : {}
	};
}
function resolveTransformAssetsCrossOrigin(config, kind) {
	if (!config) return void 0;
	if (typeof config === "string") return config;
	return config[kind];
}
function isObjectShorthand(transform) {
	return "prefix" in transform;
}
function resolveTransformAssetsConfig(transform) {
	if (typeof transform === "string") {
		const prefix = transform;
		return {
			type: "transform",
			transformFn: ({ url }) => ({ href: `${prefix}${url}` }),
			cache: true
		};
	}
	if (typeof transform === "function") return {
		type: "transform",
		transformFn: transform,
		cache: true
	};
	if (isObjectShorthand(transform)) {
		const { prefix, crossOrigin } = transform;
		return {
			type: "transform",
			transformFn: ({ url, kind }) => {
				const href = `${prefix}${url}`;
				if (kind === "css-url") return { href };
				const co = resolveTransformAssetsCrossOrigin(crossOrigin, kind);
				return co ? {
					href,
					crossOrigin: co
				} : { href };
			},
			cache: true
		};
	}
	if ("createTransform" in transform && transform.createTransform) return {
		type: "createTransform",
		createTransform: transform.createTransform,
		cache: transform.cache !== false
	};
	return {
		type: "transform",
		transformFn: typeof transform.transform === "string" ? (({ url }) => ({ href: `${transform.transform}${url}` })) : transform.transform,
		cache: transform.cache !== false
	};
}
function assignManifestLink(link, next) {
	if (typeof link === "string") return next.crossOrigin ? next : next.href;
	const nextLink = {
		...link,
		href: next.href
	};
	if (next.crossOrigin) nextLink.crossOrigin = next.crossOrigin;
	else delete nextLink.crossOrigin;
	return nextLink;
}
async function transformManifestAssets(source, transformFn, _opts) {
	const manifest = structuredClone(source);
	const inlineCssEnabled = _opts?.inlineCss !== false;
	const scriptTransforms = /* @__PURE__ */ new Map();
	const transformScript = (url) => {
		const cached = scriptTransforms.get(url);
		if (cached) return cached;
		const transformed = Promise.resolve(transformFn({
			url,
			kind: "script"
		})).then(normalizeTransformAssetResult);
		scriptTransforms.set(url, transformed);
		return transformed;
	};
	if (!inlineCssEnabled) delete manifest.inlineCss;
	else if (manifest.inlineCss) manifest.inlineCss = await transformInlineCssStyles(manifest.inlineCss, transformFn);
	for (const route of Object.values(manifest.routes)) {
		if (route.preloads?.length) route.preloads = await Promise.all(route.preloads.map(async (link) => {
			const result = await transformScript(resolveManifestAssetLink(link).href);
			return assignManifestLink(link, {
				href: result.href,
				crossOrigin: result.crossOrigin
			});
		}));
		if (route.css?.length && !manifest.inlineCss) route.css = await Promise.all(route.css.map(async (link) => {
			const result = normalizeTransformAssetResult(await transformFn({
				url: resolveManifestCssLink(link).href,
				kind: "stylesheet"
			}));
			return assignManifestLink(link, {
				href: result.href,
				crossOrigin: result.crossOrigin
			});
		}));
		if (route.scripts?.length) for (const script of route.scripts) {
			const src = script.attrs?.src;
			if (typeof src !== "string") continue;
			const result = await transformScript(src);
			script.attrs = {
				...script.attrs,
				src: result.href
			};
			if (result.crossOrigin) script.attrs.crossOrigin = result.crossOrigin;
			else delete script.attrs.crossOrigin;
		}
	}
	return manifest;
}
/**
* Builds a final ServerManifest without URL transforms. Used when no
* transformAssets option is provided.
*
* Returns a new manifest object so the cached base manifest is never mutated.
*/
function buildManifest(source, opts) {
	return {
		...source.scriptFormat ? { scriptFormat: source.scriptFormat } : {},
		...opts?.inlineCss !== false && source.inlineCss ? { inlineCss: structuredClone(source.inlineCss) } : {},
		routes: { ...source.routes }
	};
}
function getStaticHandlerInlineCssDefault(handlerInlineCss) {
	if (typeof handlerInlineCss === "function") return;
	return handlerInlineCss ?? true;
}
async function resolveInlineCssForRequest(opts) {
	if (opts.requestInlineCss !== void 0) return opts.requestInlineCss;
	if (typeof opts.handlerInlineCss === "function") return await opts.handlerInlineCss({ request: opts.request });
	return opts.handlerInlineCss ?? true;
}
function createCachedBaseManifestLoader(loadBaseManifest) {
	let baseManifestPromise;
	return () => {
		if (!baseManifestPromise) baseManifestPromise = loadBaseManifest().catch((error) => {
			baseManifestPromise = void 0;
			throw error;
		});
		return baseManifestPromise;
	};
}
function createFinalManifestTransformResolver(transformAssets, opts) {
	const transformConfig = transformAssets !== void 0 ? resolveTransformAssetsConfig(transformAssets) : void 0;
	const cache = transformConfig ? transformConfig.cache : true;
	const warmup = !!transformAssets && typeof transformAssets === "object" && "warmup" in transformAssets && transformAssets.warmup === true;
	let cachedCreateTransformPromise;
	const clearCachedCreateTransform = () => {
		cachedCreateTransformPromise = void 0;
	};
	return {
		cache,
		warmup,
		clearCachedCreateTransform,
		getTransformFn: async (ctx) => {
			if (!transformConfig) return void 0;
			if (transformConfig.type !== "createTransform") return transformConfig.transformFn;
			if (!cache || !opts.cacheCreateTransform) return transformConfig.createTransform(ctx);
			if (!cachedCreateTransformPromise) cachedCreateTransformPromise = Promise.resolve(transformConfig.createTransform(ctx)).catch((error) => {
				clearCachedCreateTransform();
				throw error;
			});
			return cachedCreateTransformPromise;
		}
	};
}
function createFinalManifestResolver(opts) {
	const finalManifestCache = /* @__PURE__ */ new Map();
	const transformResolver = createFinalManifestTransformResolver(opts.transformAssets, { cacheCreateTransform: opts.cacheCreateTransform });
	const handlerDefaultInlineCss = getStaticHandlerInlineCssDefault(opts.inlineCss);
	const getRequestManifestOptions = async (requestOpts) => {
		const transformFn = await transformResolver.getTransformFn({
			warmup: false,
			request: requestOpts.request
		});
		const inlineCss = await resolveInlineCssForRequest({
			request: requestOpts.request,
			handlerInlineCss: opts.inlineCss,
			requestInlineCss: requestOpts.requestInlineCss
		});
		return {
			getBaseManifest: requestOpts.getBaseManifest,
			transformFn,
			cache: transformResolver.cache,
			inlineCss
		};
	};
	const resolveRequest = async (requestOpts, cache) => {
		return resolveFinalManifest({
			...await getRequestManifestOptions(requestOpts),
			finalManifestCache: cache
		});
	};
	return {
		warmup: ({ getBaseManifest }) => warmupFinalManifest({
			enabled: transformResolver.warmup,
			handlerDefaultInlineCss,
			cache: transformResolver.cache,
			finalManifestCache,
			getBaseManifest,
			getTransformFn: () => transformResolver.getTransformFn({ warmup: true }),
			onError: transformResolver.clearCachedCreateTransform
		}),
		resolveCached: (requestOpts) => resolveRequest(requestOpts, finalManifestCache),
		resolveUncached: (requestOpts) => resolveRequest(requestOpts, void 0)
	};
}
function getFinalManifestCacheKey(inlineCss) {
	return inlineCss ? "inline-css" : "linked-css";
}
function cacheFinalManifestPromise(cachedFinalManifestPromises, cacheKey, promise) {
	const cachedFinalManifestPromise = promise.catch((error) => {
		if (cachedFinalManifestPromises.get(cacheKey) === cachedFinalManifestPromise) cachedFinalManifestPromises.delete(cacheKey);
		throw error;
	});
	cachedFinalManifestPromises.set(cacheKey, cachedFinalManifestPromise);
	return cachedFinalManifestPromise;
}
function getOrCreateCachedFinalManifestPromise(cachedFinalManifestPromises, cacheKey, computeFinalManifest) {
	const cachedFinalManifestPromise = cachedFinalManifestPromises.get(cacheKey);
	if (cachedFinalManifestPromise) return cachedFinalManifestPromise;
	return cacheFinalManifestPromise(cachedFinalManifestPromises, cacheKey, Promise.resolve().then(computeFinalManifest));
}
async function buildFinalManifest(opts) {
	return opts.transformFn ? await transformManifestAssets(opts.base, opts.transformFn, { inlineCss: opts.inlineCss }) : buildManifest(opts.base, { inlineCss: opts.inlineCss });
}
async function resolveFinalManifest(opts) {
	const computeFinalManifest = async () => {
		return buildFinalManifest({
			base: await opts.getBaseManifest(),
			transformFn: opts.transformFn,
			inlineCss: opts.inlineCss
		});
	};
	if (opts.finalManifestCache && (!opts.transformFn || opts.cache)) return getOrCreateCachedFinalManifestPromise(opts.finalManifestCache, getFinalManifestCacheKey(opts.inlineCss), computeFinalManifest);
	return computeFinalManifest();
}
function warmupFinalManifest(opts) {
	if (!opts.enabled || opts.handlerDefaultInlineCss === void 0 || !opts.cache) return;
	const inlineCss = opts.handlerDefaultInlineCss;
	const warmupPromise = getOrCreateCachedFinalManifestPromise(opts.finalManifestCache, getFinalManifestCacheKey(inlineCss), async () => {
		const [base, transformFn] = await Promise.all([opts.getBaseManifest(), opts.getTransformFn()]);
		return buildFinalManifest({
			base,
			transformFn,
			inlineCss
		});
	});
	if (opts.onError) warmupPromise.catch(opts.onError);
	return warmupPromise;
}
var ServerFunctionSerializationAdapter = createSerializationAdapter({
	key: "$TSS/serverfn",
	test: (v) => {
		if (typeof v !== "function") return false;
		if (!(TSS_SERVER_FUNCTION in v)) return false;
		return !!v[TSS_SERVER_FUNCTION];
	},
	toSerializable: ({ serverFnMeta }) => ({ functionId: serverFnMeta.id }),
	fromSerializable: ({ functionId }) => {
		const fn = async (opts, signal) => {
			return (await (await getServerFnById(functionId, { origin: "client" }))(opts ?? {}, signal)).result;
		};
		return fn;
	}
});
function getStartResponseHeaders(opts) {
	return mergeHeaders({ "Content-Type": "text/html; charset=utf-8" }, ..._getRenderedMatches(opts.router.stores.matches.get()).map((match) => {
		return match.headers;
	}));
}
var entriesPromise;
var defaultCsrfMiddleware = createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === "serverFn" });
var getCachedBaseManifest = createCachedBaseManifestLoader(() => getStartManifest());
var getProdBaseManifest = () => getCachedBaseManifest();
var getBaseManifest = getProdBaseManifest;
var createEarlyHintsForRequest = createEarlyHintsCollector;
async function loadEntries() {
	const [routerEntry, startEntry, pluginAdapters] = await Promise.all([
		import("./router-Bkw81Fhc.mjs").then((n) => n.t),
		import("./start-5Z2QO8AU.mjs"),
		import("./empty-plugin-adapters-D9UWiqvJ.mjs")
	]);
	return {
		routerEntry,
		startEntry,
		pluginAdapters
	};
}
function getEntries() {
	if (!entriesPromise) entriesPromise = loadEntries();
	return entriesPromise;
}
var ROUTER_BASEPATH = "/";
var SERVER_FN_BASE = "/_serverFn/";
var IS_PRERENDERING = process.env.TSS_PRERENDERING === "true";
var IS_SHELL_ENV = process.env.TSS_SHELL === "true";
var IS_DEV = false;
var ERR_NO_RESPONSE = IS_DEV ? `It looks like you forgot to return a response from your server route handler. If you want to defer to the app router, make sure to have a component set in this route.` : "Internal Server Error";
var ERR_NO_DEFER = IS_DEV ? `You cannot defer to the app router if there is no component defined on this route.` : "Internal Server Error";
function throwRouteHandlerError() {
	throw new Error(ERR_NO_RESPONSE);
}
function throwIfMayNotDefer() {
	throw new Error(ERR_NO_DEFER);
}
/**
* Check if a value is a special response (Response or Redirect)
*/
function isSpecialResponse(value) {
	return value instanceof Response || isRedirect(value);
}
/**
* Normalize middleware result to context shape
*/
function handleCtxResult(result) {
	if (isSsrResponse(result) || isSpecialResponse(result)) return { response: result };
	return result;
}
function disposeLateResponse(result, signal) {
	const response = handleCtxResult(result)?.response;
	if (isSsrResponse(response) || isSpecialResponse(response)) disposeSsrResponseDetached(response, signal.reason);
}
function isSignalAborted(signal) {
	return signal.aborted;
}
/**
* Execute a middleware chain
*/
async function executeMiddleware(middlewares, ctx, signal) {
	let index = -1;
	let streamResponse;
	let retiredStreamIdentities;
	const isResponseAlias = (candidate, response) => candidate === response || candidate instanceof Response && response.body !== null && candidate.body === response.body;
	const setResponse = (response) => {
		if (isSsrResponse(response)) {
			if (response.serverSsrCleanup === "stream") streamResponse = response;
			ctx.response = response.response;
			return;
		}
		ctx.response = response;
	};
	const disposeStreamResponse = async (reason) => {
		const response = streamResponse;
		if (!response) return;
		streamResponse = void 0;
		retiredStreamIdentities ??= /* @__PURE__ */ new WeakSet();
		retiredStreamIdentities.add(response.response);
		if (response.response.body) retiredStreamIdentities.add(response.response.body);
		const currentResponse = ctx.response;
		if (isResponseAlias(currentResponse, response.response)) ctx.response = void 0;
		await response.dispose(reason);
	};
	const disposeAbandonedResult = (result) => {
		const exposed = handleCtxResult(result)?.response;
		const response = isSsrResponse(exposed) ? exposed.response : exposed;
		if (streamResponse && isResponseAlias(response, streamResponse.response)) {
			disposeStreamResponse(signal.reason).catch(console.error);
			return;
		}
		if (response instanceof Response && retiredStreamIdentities && (retiredStreamIdentities.has(response) || response.body !== null && retiredStreamIdentities.has(response.body))) return;
		disposeLateResponse(result, signal);
	};
	const getFinalResponse = async () => {
		const response = ctx.response;
		if (!response) throwRouteHandlerError();
		if (!streamResponse) return response;
		if (response === streamResponse.response) return streamResponse;
		if (streamResponse.response.body !== null && response.body === streamResponse.response.body) return {
			...streamResponse,
			response
		};
		await disposeStreamResponse("middleware response replaced");
		return response;
	};
	let nextPromise;
	function next(nextCtx) {
		const result = runNext(nextCtx);
		nextPromise = result;
		return result;
	}
	async function runNext(nextCtx) {
		if (signal.aborted) throw signal.reason;
		if (nextCtx) {
			if (nextCtx.context) ctx.context = safeObjectMerge(ctx.context, nextCtx.context);
			for (const key of Object.keys(nextCtx)) if (key === "response") setResponse(nextCtx.response);
			else if (key !== "context") ctx[key] = nextCtx[key];
		}
		index++;
		const middleware = middlewares[index];
		if (!middleware) return ctx;
		let result;
		try {
			const pending = middleware({
				...ctx,
				next
			});
			if (pending === nextPromise) {
				nextPromise = void 0;
				result = await pending;
				if (isSignalAborted(signal)) {
					disposeAbandonedResult(result);
					throw signal.reason;
				}
			} else result = await waitForRequest(pending, signal, disposeAbandonedResult);
		} catch (err) {
			if (isSignalAborted(signal)) throw signal.reason;
			if (isSpecialResponse(err)) {
				setResponse(err);
				return ctx;
			}
			throw err;
		}
		const normalized = handleCtxResult(result);
		if (normalized) {
			if (normalized.response !== void 0) setResponse(normalized.response);
			if (normalized.context) ctx.context = safeObjectMerge(ctx.context, normalized.context);
		}
		return ctx;
	}
	try {
		await runNext();
		const response = await waitForRequest(getFinalResponse(), signal, disposeAbandonedResult);
		if (signal.aborted) {
			disposeAbandonedResult(response);
			throw signal.reason;
		}
		return {
			ctx,
			response
		};
	} catch (err) {
		const disposal = disposeStreamResponse(signal.aborted ? signal.reason : err);
		if (signal.aborted) disposal.catch(console.error);
		else await disposal;
		throw err;
	}
}
/**
* Wrap a route handler as middleware
*/
function handlerToMiddleware(handler, mayDefer = false) {
	if (mayDefer) return handler;
	return async (ctx) => {
		const response = await handler({
			...ctx,
			next: throwIfMayNotDefer
		});
		if (!response) throwRouteHandlerError();
		return response;
	};
}
/**
* Creates the TanStack Start request handler.
*
* @example Backwards-compatible usage (handler callback only):
* ```ts
* export default createStartHandler(defaultStreamHandler)
* ```
*
* @example With CDN URL rewriting:
* ```ts
* export default createStartHandler({
*   handler: defaultStreamHandler,
*   transformAssets: 'https://cdn.example.com',
* })
* ```
*
* @example With per-request URL rewriting:
* ```ts
* export default createStartHandler({
*   handler: defaultStreamHandler,
*   transformAssets: {
*     transform: ({ url }) => {
*       const cdnBase = getRequest().headers.get('x-cdn-base') || ''
*       return { href: `${cdnBase}${url}` }
*     },
*     cache: false,
*   },
* })
* ```
*/
function createStartHandler(cbOrOptions) {
	const handlerOptions = typeof cbOrOptions === "function" ? {} : cbOrOptions;
	const cb = typeof cbOrOptions === "function" ? cbOrOptions : cbOrOptions.handler;
	const finalManifestResolver = createFinalManifestResolver({
		...handlerOptions,
		cacheCreateTransform: true
	});
	const resolveManifestForRequest = finalManifestResolver.resolveCached;
	finalManifestResolver.warmup({ getBaseManifest: () => getBaseManifest(void 0) });
	const startRequestResolver = async (request, requestOpts) => {
		let router = null;
		let responseOwnsCleanup = false;
		try {
			request.signal.throwIfAborted();
			const { url, handledProtocolRelativeURL } = getNormalizedURL(request.url);
			const href = url.pathname + url.search + url.hash;
			const origin = getOrigin(request);
			if (handledProtocolRelativeURL) return Response.redirect(url, 308);
			const entries = await waitForRequest(getEntries(), request.signal);
			const hasStartInstance = !!entries.startEntry.startInstance;
			const startOptions = await waitForRequest(entries.startEntry.startInstance?.getOptions(), request.signal) || {};
			const { hasPluginAdapters, pluginSerializationAdapters } = entries.pluginAdapters;
			const serializationAdapters = [
				...startOptions.serializationAdapters || [],
				...hasPluginAdapters ? pluginSerializationAdapters : [],
				ServerFunctionSerializationAdapter
			];
			const requestStartOptions = {
				...startOptions,
				requestMiddleware: hasStartInstance ? startOptions.requestMiddleware : [defaultCsrfMiddleware],
				serializationAdapters
			};
			const flattenedRequestMiddlewares = requestStartOptions.requestMiddleware ? flattenMiddlewares(requestStartOptions.requestMiddleware) : [];
			const executedRequestMiddlewares = new Set(flattenedRequestMiddlewares);
			const getRouter = async () => {
				if (router) return router;
				router = await waitForRequest(entries.routerEntry.getRouter(), request.signal);
				let isShell = IS_SHELL_ENV;
				if (IS_PRERENDERING && !isShell) isShell = request.headers.get(HEADERS.TSS_SHELL) === "true";
				const history = createMemoryHistory({ initialEntries: [href] });
				router.update({
					history,
					isShell,
					isPrerendering: IS_PRERENDERING,
					origin: router.options.origin ?? origin,
					defaultSsr: requestStartOptions.defaultSsr,
					serializationAdapters: [...requestStartOptions.serializationAdapters, ...router.options.serializationAdapters || []],
					basepath: ROUTER_BASEPATH
				});
				return router;
			};
			if (SERVER_FN_BASE && url.pathname.startsWith(SERVER_FN_BASE)) {
				const serverFnId = url.pathname.slice(SERVER_FN_BASE.length).split("/")[0];
				if (!serverFnId) throw new Error("Invalid server action param for serverFnId");
				const serverFnHandler = async ({ context }) => {
					return runWithStartContext({
						getRouter,
						startOptions: requestStartOptions,
						contextAfterGlobalMiddlewares: context,
						request,
						executedRequestMiddlewares,
						handlerType: "serverFn"
					}, () => handleServerAction({
						request,
						context: requestOpts?.context,
						serverFnId
					}));
				};
				const { response: middlewareResponse } = await executeMiddleware([...flattenedRequestMiddlewares.map((d) => d.options.server), serverFnHandler], {
					request,
					pathname: url.pathname,
					handlerType: "serverFn",
					context: createNullProtoObject(requestOpts?.context)
				}, request.signal);
				const result = await handleRedirectResponse(middlewareResponse, request, getRouter, request.signal);
				bindSsrResponseToRequest(router ?? void 0, result, request.signal);
				request.signal.throwIfAborted();
				responseOwnsCleanup = result.serverSsrCleanup === "stream";
				return result.response;
			}
			const executeRouter = async (serverContext, matchedRoutes) => {
				const acceptParts = (request.headers.get("Accept") || "*/*").split(",");
				if (!["*/*", "text/html"].some((mimeType) => acceptParts.some((part) => part.trim().startsWith(mimeType)))) return normalizeSsrResponse(Response.json({ error: "Only HTML requests are supported here" }, { status: 500 }));
				const manifest = await waitForRequest(resolveManifestForRequest({
					request,
					requestInlineCss: requestOpts?.inlineCss,
					getBaseManifest: () => getBaseManifest(matchedRoutes)
				}), request.signal);
				const earlyHints = createEarlyHintsForRequest({
					onEarlyHints: requestOpts?.onEarlyHints,
					responseLinkHeader: requestOpts?.responseLinkHeader
				});
				earlyHints?.collectStatic({
					manifest,
					matchedRoutes
				});
				const routerInstance = await getRouter();
				attachRouterServerSsrUtils({
					router: routerInstance,
					manifest,
					getRequestAssets: () => getStartContext({ throwIfNotFound: false })?.requestAssets
				});
				routerInstance.options.additionalContext = { serverContext };
				await routerInstance.load({ _signal: request.signal });
				request.signal.throwIfAborted();
				if (routerInstance._serverResult?.type === "redirect") return normalizeSsrResponse(routerInstance._serverResult.redirect);
				earlyHints?.collectDynamic(_getRenderedMatches(routerInstance.stores.matches.get()));
				const ctx = getStartContext({ throwIfNotFound: false });
				await waitForRequest(routerInstance.serverSsr.dehydrate({ requestAssets: ctx?.requestAssets }), request.signal);
				request.signal.throwIfAborted();
				const responseHeaders = getStartResponseHeaders({ router: routerInstance });
				earlyHints?.appendResponseHeaders(responseHeaders);
				request.signal.throwIfAborted();
				return normalizeSsrResponse(await waitForRequest(cb({
					request,
					router: routerInstance,
					responseHeaders
				}), request.signal, (late) => disposeLateResponse(late, request.signal)));
			};
			const requestHandlerMiddleware = async ({ context }) => {
				return runWithStartContext({
					getRouter,
					startOptions: requestStartOptions,
					contextAfterGlobalMiddlewares: context,
					request,
					executedRequestMiddlewares,
					handlerType: "router"
				}, async () => {
					try {
						return await handleServerRoutes({
							getRouter,
							request,
							url,
							executeRouter,
							context,
							executedRequestMiddlewares
						});
					} catch (err) {
						if (err instanceof Response) return err;
						throw err;
					}
				});
			};
			const { response: middlewareResponse } = await executeMiddleware([...flattenedRequestMiddlewares.map((d) => d.options.server), requestHandlerMiddleware], {
				request,
				pathname: url.pathname,
				handlerType: "router",
				context: createNullProtoObject(requestOpts?.context)
			}, request.signal);
			const response = await handleRedirectResponse(middlewareResponse, request, getRouter, request.signal);
			bindSsrResponseToRequest(router ?? void 0, response, request.signal);
			request.signal.throwIfAborted();
			responseOwnsCleanup = response.serverSsrCleanup === "stream";
			return response.response;
		} finally {
			if (router?.serverSsr && !responseOwnsCleanup) router.serverSsr.cleanup();
			router = null;
		}
	};
	return requestHandler(startRequestResolver);
}
async function handleRedirectResponse(response, request, getRouter, signal) {
	signal.throwIfAborted();
	const ssrResponse = normalizeSsrResponse(response);
	if (!isRedirect(ssrResponse.response)) return ssrResponse;
	if (isResolvedRedirect(ssrResponse.response)) {
		if (request.headers.get("x-tsr-serverFn") === "true") return waitForRequest(replaceSsrResponse(ssrResponse, Response.json({
			...ssrResponse.response.options,
			isSerializedRedirect: true
		}, { headers: ssrResponse.response.headers }), "redirect response replaced"), signal);
		return ssrResponse;
	}
	const opts = ssrResponse.response.options;
	if (opts.to && typeof opts.to === "string" && !opts.to.startsWith("/")) throw new Error(`Server side redirects must use absolute paths via the 'href' or 'to' options. The redirect() method's "to" property accepts an internal path only. Use the "href" property to provide an external URL. Received: ${JSON.stringify(opts)}`);
	if ([
		"params",
		"search",
		"hash"
	].some((d) => typeof opts[d] === "function")) throw new Error(`Server side redirects must use static search, params, and hash values and do not support functional values. Received functional values for: ${Object.keys(opts).filter((d) => typeof opts[d] === "function").map((d) => `"${d}"`).join(", ")}`);
	signal.throwIfAborted();
	const router = await waitForRequest(getRouter(), signal);
	signal.throwIfAborted();
	const redirect = router.resolveRedirect(ssrResponse.response);
	if (request.headers.get("x-tsr-serverFn") === "true") return waitForRequest(replaceSsrResponse(ssrResponse, Response.json({
		...ssrResponse.response.options,
		isSerializedRedirect: true
	}, { headers: ssrResponse.response.headers }), "redirect response replaced"), signal);
	return waitForRequest(replaceSsrResponse(ssrResponse, redirect, "redirect response replaced"), signal);
}
async function handleServerRoutes({ getRouter, request, url, executeRouter, context, executedRequestMiddlewares }) {
	const router = await getRouter();
	const pathname = executeRewriteInput(router.rewrite, url).pathname;
	const [matchedRoutes, rawParams, foundRoute] = router.getMatchedRoutes(pathname);
	const isExactMatch = foundRoute && rawParams["**"] === void 0;
	const routeMiddlewares = [];
	for (const route of matchedRoutes) {
		const serverMiddleware = route.options.server?.middleware;
		if (serverMiddleware) {
			const flattened = flattenMiddlewares(serverMiddleware);
			for (const m of flattened) if (!executedRequestMiddlewares.has(m)) routeMiddlewares.push(m.options.server);
		}
	}
	const server = foundRoute?.options.server;
	let isHeadFallback = false;
	if (server?.handlers && isExactMatch) {
		const handlers = typeof server.handlers === "function" ? server.handlers({ createHandlers: (d) => d }) : server.handlers;
		const requestMethod = request.method.toUpperCase();
		const handler = requestMethod === "HEAD" ? handlers["HEAD"] ?? handlers["GET"] ?? handlers["ANY"] : handlers[requestMethod] ?? handlers["ANY"];
		isHeadFallback = requestMethod === "HEAD" && handler !== void 0 && !handlers["HEAD"];
		if (handler) {
			const mayDefer = !!foundRoute.options.component;
			if (typeof handler === "function") routeMiddlewares.push(handlerToMiddleware(handler, mayDefer));
			else {
				if (handler.middleware?.length) {
					const handlerMiddlewares = flattenMiddlewares(handler.middleware);
					for (const m of handlerMiddlewares) routeMiddlewares.push(m.options.server);
				}
				if (handler.handler) routeMiddlewares.push(handlerToMiddleware(handler.handler, mayDefer));
			}
		}
	}
	routeMiddlewares.push(((ctx) => executeRouter(ctx.context, matchedRoutes)));
	const { ctx, response } = await executeMiddleware(routeMiddlewares, {
		request,
		context,
		params: rawParams,
		pathname,
		handlerType: "router"
	}, request.signal);
	if (isHeadFallback) {
		if (!ctx.response) throwRouteHandlerError();
		return waitForRequest(stripSsrResponseBody(await handleRedirectResponse(response, request, getRouter, request.signal), "HEAD body stripped"), request.signal);
	}
	return normalizeSsrResponse(response);
}
var server_exports = /* @__PURE__ */ __exportAll({ setCookie: () => setCookie$1 });
var fetch = createStartHandler(defaultStreamHandler);
function createServerEntry(entry) {
	return { async fetch(...args) {
		return await entry.fetch(...args);
	} };
}
var server_default = createServerEntry({ fetch });
//#endregion
export { getServerFnById as a, ssr_exports as c, createServerEntry, server_default as default, TSS_SERVER_FUNCTION as i, createMiddleware as n, getRequest as o, createServerFn as r, __exportAll as s, server_exports as t };
