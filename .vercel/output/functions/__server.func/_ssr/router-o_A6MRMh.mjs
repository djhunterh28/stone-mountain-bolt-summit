import { o as __toESM } from "../_runtime.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { d as money, l as getSql, t as cn, u as iso } from "./utils-BjcRTCQS.mjs";
import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as createRootRoute, b as useNavigate, d as useRouterState, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link, x as useRouter, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as Slot, m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CZC9dlvp.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { S as unlockSession, b as testSignIn, m as lockSession, s as getAccessState } from "./governance-Bb-_vds7.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { i as signOut, t as authClient } from "./client-CVqXY6bk.mjs";
import { i as hasGateSessionMarker, t as auth$1 } from "./server-DC_NIGmU.mjs";
import { a as WEBHOOK_EVENTS, i as REST_ENDPOINTS } from "./api-spec-_6I3ohNe.mjs";
import { t as runAi } from "./ai-_z0d7FCh.mjs";
import { r as getPortalBrand } from "./brand-BeQEY2zF.mjs";
import { r as hashSha } from "./access-BE7LFNbd.mjs";
import { A as Plug, B as Megaphone, C as Settings, Ct as Box, D as RectangleEllipsis, E as ScanLine, Et as Bell, G as LayoutGrid, I as Moon, J as Kanban, L as Monitor, N as PenLine, O as Receipt, Q as Handshake, R as MessageSquare, St as Briefcase, T as Search, Tt as Bookmark, U as Mail, V as Map$1, W as MailCheck, X as House, Y as Inbox, Z as HeartPulse, _ as SquareCheckBig, _t as ChevronDown, a as Wallet, at as FileText, b as Shield, bt as Calendar, c as UserCheck, d as TriangleAlert, et as Globe, ft as ClipboardCheck, g as Star, h as Store, i as Waypoints, j as Plus, k as Radar, kt as Activity, l as Upload, m as Sun, n as X, nt as FolderOpen, o as Users, p as Target, pt as CircleUser, q as KeyRound, r as Workflow, rt as FlaskConical, s as UserPlus, t as Zap, u as Truck, ut as Compass, v as Sparkles, vt as Check, w as Send, wt as Bot, xt as CalendarRange, y as Smartphone, yt as ChartColumn, z as Menu } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as Root2, i as Portal2, n as Item2, o as Separator2, r as Label2, s as Trigger, t as Content2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { a as SelectItemIndicator, c as SelectTrigger$1, i as SelectItem$1, l as SelectValue$1, n as SelectContent$1, o as SelectItemText, r as SelectIcon, s as SelectPortal, t as Select$1, u as SelectViewport } from "../_libs/@radix-ui/react-select+[...].mjs";
import { t as Provider } from "../_libs/radix-ui__react-tooltip.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { i as Trigger$1, n as Portal, r as Root2$1, t as Content2$1 } from "../_libs/radix-ui__react-popover.mjs";
import { i as Trigger$2, n as List, r as Root2$2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lifecycle-DZdXXLvs.js
var useUi = create()(persist((set) => ({
	memberId: 1,
	setMemberId: (id) => set({ memberId: id }),
	sidebarOpen: false,
	setSidebarOpen: (v) => set({ sidebarOpen: v }),
	commandOpen: false,
	setCommandOpen: (v) => set({ commandOpen: v }),
	addOpen: false,
	addKind: "deal",
	setAddOpen: (v, kind) => set({
		addOpen: v,
		...kind ? { addKind: kind } : {}
	}),
	assistantOpen: false,
	setAssistantOpen: (v) => set({ assistantOpen: v }),
	theme: "light",
	setTheme: (theme) => set({ theme }),
	dirty: false,
	setDirty: (v) => set({ dirty: v })
}), {
	name: "northline-ui",
	partialize: (s) => ({
		memberId: s.memberId,
		theme: s.theme
	})
}));
var EVENT_TYPES = [
	"Corporate gala",
	"Conference / keynote",
	"Product launch",
	"Concert / live music",
	"Wedding",
	"Private / members",
	"Brand activation",
	"Festival / outdoor",
	"Dry hire",
	"Partnership"
];
var LEAD_STAGES = [
	{
		id: "new",
		label: "New",
		hint: "Just landed"
	},
	{
		id: "contacted",
		label: "Contacted",
		hint: "AE has reached out"
	},
	{
		id: "qualified",
		label: "Qualified",
		hint: "Fit confirmed"
	},
	{
		id: "nurture",
		label: "Nurture",
		hint: "Not this season"
	},
	{
		id: "disqualified",
		label: "Disqualified",
		hint: "Not our work"
	}
];
var DISQUALIFY_REASONS = [
	"Out of market",
	"Too small",
	"Not a fit",
	"Duplicate",
	"No response",
	"Already booked elsewhere"
];
var LEAD_SOURCES = [
	"Web form",
	"Chatbot",
	"Live chat",
	"Prospector",
	"Referral",
	"Repeat",
	"Email",
	"Inbound",
	"Partner",
	"Import",
	"Manual",
	"Cold reply"
];
var getLifecycleDesk = createServerFn({ method: "GET" }).handler(createSsrRpc("9ec62a3b6acf7fef5fb6c549a37e7c039bc571c904d8b8bb4765d2376f8fbf0e"));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-o_A6MRMh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-destructive",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-muted-foreground",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var TooltipProvider = Provider;
var THEME_STORAGE_KEY = "northline-ui";
var THEME_COLORS = {
	light: "#f1efe8",
	dark: "#0b0c0e"
};
var THEME_SWATCHES = {
	light: {
		rail: "#ebe8e0",
		surface: "#faf9f5",
		ink: "#2a3038"
	},
	dark: {
		rail: "#0e0f12",
		surface: "#141518",
		ink: "#c5ccd6"
	}
};
var THEME_OPTIONS = [
	{
		id: "light",
		label: "Daylight",
		hint: "Warm paper, graphite ink"
	},
	{
		id: "dark",
		label: "Nightline",
		hint: "Steel on charcoal"
	},
	{
		id: "system",
		label: "System",
		hint: "Follow the device"
	}
];
function resolveTheme(preference, prefersLight) {
	if (preference === "light" || preference === "dark") return preference;
	return prefersLight ?? (typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: light)").matches : true) ? "light" : "dark";
}
function applyResolvedTheme(resolved) {
	const root = document.documentElement;
	root.dataset.theme = resolved;
	root.style.colorScheme = resolved;
	const meta = document.querySelector("meta[name=\"theme-color\"]");
	if (meta) meta.setAttribute("content", THEME_COLORS[resolved]);
}
/** Inline head script — keeps the first paint on the stored theme. */
var THEME_BOOT_SCRIPT = `(function(){try{var t="light",k=${JSON.stringify(THEME_STORAGE_KEY)},s=localStorage.getItem(k);if(s){var p=JSON.parse(s);if(p&&p.state&&(p.state.theme==="light"||p.state.theme==="dark"||p.state.theme==="system"))t=p.state.theme}if(t==="system")t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";if(t!=="dark")t="light";var r=document.documentElement;r.setAttribute("data-theme",t);r.style.colorScheme=t}catch(e){document.documentElement.setAttribute("data-theme","light");document.documentElement.style.colorScheme="light"}})();`;
function Providers({ children }) {
	const [client] = (0, import_react.useState)(() => new QueryClient({ defaultOptions: { queries: {
		staleTime: 15e3,
		refetchOnWindowFocus: false
	} } }));
	const theme = useUi((s) => s.theme);
	const [resolved, setResolved] = (0, import_react.useState)(() => resolveTheme(theme));
	(0, import_react.useEffect)(() => {
		const apply = () => setResolved(resolveTheme(theme));
		apply();
		if (theme !== "system") return;
		const mq = window.matchMedia("(prefers-color-scheme: light)");
		mq.addEventListener("change", apply);
		return () => mq.removeEventListener("change", apply);
	}, [theme]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipProvider, {
			delayDuration: 250,
			children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: resolved,
				position: "bottom-right",
				toastOptions: { className: "bg-card text-foreground shadow-[var(--shadow-border)]" }
			})]
		})
	});
}
var getBootstrap = createServerFn({ method: "GET" }).handler(createSsrRpc("6970d4457b01e6e6acac2e81c5cc8be9bf0e7bf16c42f4d4bb35e69d970d8244"));
var listDeals = createServerFn({ method: "GET" }).validator((input = {}) => input).handler(createSsrRpc("59891ab2dffb05c51f647402619d969c168f88abc8992b07971a7189d114d382"));
var getDeal = createServerFn({ method: "GET" }).validator((input) => input).handler(createSsrRpc("8f0d647cb3a1ed6514175037ef9ab4b148df860679bff4a0a01332e84124ae40"));
var createDeal = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("afafd8df505ef6eb6b568f2b74c1bea6b58c0574b2c0df1673c7fac4ef1fb0f9"));
var moveDeal = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("7ecd45ebcbd19fd4ae1874440dfef918874a06e942b7b4c391a1bff212dbe8dd"));
var setDealStatus = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("cad926ee29ed91b95b8218c981baead39276784db310176dfa14e268b6401ed5"));
var updateDeal = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("0dc3589918c1b2559a2974d90efef2e115cb9cd2dc27610a19f8aaeb41c2bb28"));
var addDealProduct = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("29e8aa96222c63bc849010293cbfe5032a6ede363c5b310e8863303216b6ed16"));
var addComment = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("21dd474b25d7ac73ab8fbc8bdf030370e634580ac10cf805f3f308f55f0472e5"));
var addFileMeta = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("595ff189c39732b2788954ca7fa175dee89cb6e7df07700aa18e3f0ae860a3f3"));
var listLeads = createServerFn({ method: "GET" }).handler(createSsrRpc("d48b64b13516ca0e3ab73b57e154dd5959b115f28c92f5ea0af83fec6eb2d10c"));
var convertLead = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("9376b723956999d721736457d517fdbade5dacaf4a225df48f5e9b6b87c235f3"));
var createLead = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("b1c130a8f205af62a861a12c29dedad21aeee85db1e2c7bdfde24c250df296de"));
var updateLead = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("966e6f6ca162895bb0129b8e27baa0d1045abf5152dd7cb46fb35a4e7cb6f772"));
var listPeople = createServerFn({ method: "GET" }).handler(createSsrRpc("28470d4cfdce369efb89424da3baa1b22a0f0b4ffd1babe4910d25de3d9caaac"));
var listOrgs = createServerFn({ method: "GET" }).handler(createSsrRpc("177a7b6554228661f8ad8967ec30bb8c90f944bfe6c5669f743b80b4d2fb7fb9"));
var createPerson = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("276446dd2be584e2429fcaa835cf632769a7f4102b4ed5d216c7945735d21ebb"));
var createOrg = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("cbe09202cb5e2168349a9d5c7b6a552627ab7ac471176fa6c47c9813dd6b53c7"));
var listActivities = createServerFn({ method: "GET" }).validator((input = {}) => input).handler(createSsrRpc("0a4bda816681e87bafaaf31a344fbb047d2619552193112374805d697e74fcac"));
var createActivity = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("5579849a083106c791c58697c2de300a27c1425393bd6124fea3ce495e5be301"));
var toggleActivity = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("a064b50503311022a543709bb2f6936f3f0dc136c1296b3b63cd9febe683bec1"));
var listProducts = createServerFn({ method: "GET" }).handler(createSsrRpc("4cc6da6bbc631aea662f4a53eca033ff60e19aad92505326ea31729d0e2f18b0"));
var createProduct = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("aeb4116aa544918a20dd749db8e62a8db6ed5a013c5bb13c1d036f421bf114df"));
createServerFn({ method: "GET" }).handler(createSsrRpc("fcb882bfefe2490559cc1cdb8b3dc88bfbc52f8255e0b149cd9512b2deffe166"));
var getProject = createServerFn({ method: "GET" }).validator((input) => input).handler(createSsrRpc("43343f15e025d60cca1f45a8c5fd5c2d5b04e25d00d135ad28e58e60768a01e4"));
var moveTask = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("f4fb5ebe4529d2a0ae5448376a411d579f23bc2376c7b5d07b983a4ab37e6775"));
var addTask = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("e7f373e4fb3f80fd85659fd0ed89f80405b272c61f8c03f9484ac77964a06b85"));
var listEmails = createServerFn({ method: "GET" }).validator((input = {}) => input).handler(createSsrRpc("2db3b254b3413d78fe2948b168951847b45d6563b7405bf6361824938f994e9f"));
var listTemplates = createServerFn({ method: "GET" }).handler(createSsrRpc("6007178782253bee5d623f6eede20fd6b2985637f923bc4397563346a59c20b6"));
var sendEmail = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("265efa4634c6d815adff3363a49e0e2e1e018979d1f831e99629604863c78321"));
var listDocuments = createServerFn({ method: "GET" }).handler(createSsrRpc("2c4073a01e48e169265a439d4cd8d34fad72909ce086657d42cec1529aa2fc03"));
var createDocument = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("63ae43edaaad14d2f2ce474ea5ffd396eb24bcb2b4d84e5c2ee31023ef4cf84d"));
var advanceDocument = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("b94b10e00e53030a4b0e9e5921cabce341382ea8bb726f9c62bd6c1731cedffb"));
var listAutomations = createServerFn({ method: "GET" }).handler(createSsrRpc("12befde8a803ce3f9b603c52148180ca22d161b2854cb9c6f42d96ab6433ef59"));
var toggleAutomation = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("bf1ea20eaf95c9ddf2970f8cf22384b7a31e32f0978f2f224bd6096ae960e0aa"));
var createAutomation = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("338b3dcb876ff6a240b196d3a776244d480494e11bf0e1465e792cc8c4a164d6"));
var listSequences = createServerFn({ method: "GET" }).handler(createSsrRpc("11e5d6400ab8074f41cc011a761be1d10c739f79119f6692c0481b5780b72cf8"));
var toggleSequence = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("92adbf909ab79db9e811e7393bd471e8f04e402aa5efebee5e918a9b7a673c82"));
createServerFn({ method: "GET" }).handler(createSsrRpc("b81078ef238d619f1f671d784712a343e7e65db5dcbe3f29a39465109cd4b6f0"));
createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("ea3b1c7a65066ea4a8f655fbd3dde340da3ac64b2dc384ccc045a5444ee79349"));
var listProspects = createServerFn({ method: "GET" }).handler(createSsrRpc("9812a299ae813329300c5ddd1c9da7c202df014c4b7063561854dda7d5ca1676"));
var addProspect = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("b35b59d5955ca97ae48017ec00ab278f901ff1d26cef5b01575a2be3468f9c2e"));
var listScheduler = createServerFn({ method: "GET" }).handler(createSsrRpc("d11e09cec47a1dc451f14ece49f36f0166bf9b644de5ea8c6c523e6e1fb9c291"));
var bookSlot = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("8d99d1665fc6984c68a4060df237e502e65a80a98f50bd8f2bfd64125c035c6d"));
var listNotifications = createServerFn({ method: "GET" }).validator((input = {}) => input).handler(createSsrRpc("d76bab05cbc525d89b473acd268ef193e8aeb41808d78a6fad1ff57f1c2c53b5"));
var markNotificationsRead = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("adaaf188833a32955a2aa325aeef3fd4ea05ed40cd2385bd9621c31c148bcbcf"));
var getPulse = createServerFn({ method: "GET" }).handler(createSsrRpc("94753740b8ec891b0ee5fd55634503990f5bbc0e003d13a1447b9039f81d9482"));
var getInsights = createServerFn({ method: "GET" }).handler(createSsrRpc("507448c32c2c2536f14b5743f82c578e9beb9a9c7da5568221d76a5ae04735f3"));
var getSecurity = createServerFn({ method: "GET" }).handler(createSsrRpc("1b8a11ff8dc1a2a31fd3c0dec3be89f7ae253e3ccf587474ceabf2969ff5c076"));
var toggleRule = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("427baff95144cc91cb08311e9018ab6ff6dcc145b2b79fa1a45940cb6f7d0209"));
var resolveAlert = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("2a24214969fd18af33f91899c1d3a28ddba51082fe5b0ecf4a85b8a0f6ba047b"));
var listFields = createServerFn({ method: "GET" }).handler(createSsrRpc("6a8521f06900de506453cecb23ce883c90e99936cc8e18cebcf02170362ee023"));
var createField = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("acbdb3ad15396fe2c7dd1c462c17ffa2bd698a9f2fb0e158345c1dc552b351f4"));
var listMarketplace = createServerFn({ method: "GET" }).handler(createSsrRpc("19f84c1309f43d5519013e0ddc8ff161c3040d1acb015779c552a8cc67fda286"));
var toggleApp = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("a077e7974f61c5b06a3f5f44c1ac28c11b5aa5e0a0ddedfe2390769c510b432f"));
var listScores = createServerFn({ method: "GET" }).handler(createSsrRpc("d9551306d049c946aa8513cb1ff5ee793c28d7ece41a9619db3ade099737d6c0"));
var listReports = createServerFn({ method: "GET" }).handler(createSsrRpc("1753a7c2bd0a38ad3555efdc2bf818d5667ff0cf2d7fa2c061ab02b650cad52b"));
var createReport = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("092e452659d04ffa311de43edb44b3eb281266fce36008f60639c1ce5bc2bdc2"));
var exportDealsCsv = createServerFn({ method: "GET" }).validator((input) => input).handler(createSsrRpc("bd00faaeca7ebc3807e923c12aca2be8ff76878943ae1eaff5e38bf724b8175c"));
var mergePeople = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("ec40a49d29167e63f96501aa076dd7e9dec07c10343c17392f1d0c753b94f096"));
var updateStage = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("fa0a3f7f35a3f597c77e93ac2ca4caca79fe4941ad532a53990a03f140e803c2"));
var checkEmailGate = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("4c81ed06625b143b2fefac5d4b23430c3a076129784e69c219ffd3169de98b03"));
var issueOtp = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("8da1c8bea9ce0d2e48fefc2a47e67ddd8d2e97ad5e2edd15b0b2156edd72d3c4"));
var verifyOtp = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("6ba63469f5c0271ed7bddb421f261268853d2de2b7304005459fb698dbd2b674"));
var resetPasswordWithOtp = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("b52930db7b0f372520a8a0ce8ed29d4fb6ae367759a88aa1bf86c63b84d7a89e"));
var getPortalMe = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("af89c8b165ae9d140e7f43a5d8c7498dc2b434b6bd93adf9e2bddbdfe5840111"));
var completeOnboardingStep = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("478fc051f651105f4caefe354dde9ca2c151199407626308b865a93dac94f5bd"));
var updatePortalProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("115240cc6de18fbf8b8ac7e55e3e23af1abc3dd82c7fc2a3411dba9ad31b4235"));
var switchTenant = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("f5ad60a0b3c2546d5f325f456572020a1b3f4b7a8c7033bba54ced97951cd35a"));
var listTenants = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e6061b49f5bfa1aa2523dcac89cece344e37cdae1b1f34131f0655edac83143d"));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("d8252af4d821f130d4af367b56ea5d964062e0512f8227a91ba55645e3868a90"));
var listPortalProjects = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("8464588b7373152933c8f4c9773d441ff85f9f182bfca5586ba71708f1c92876"));
var getPortalProject = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("6b3f6c38a005d928a54c3386800d2ebfc722b65e7075cd257ba76d3c9d1b32df"));
var addProjectRequest = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("e2a1232fb373f50ceef48cf8df618b7b8c7767a250fbf167046acc7307d359dd"));
var toggleProjectNote = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("45378dea731466732e1f5ef16d0b3d07b5abcd4462b8cb38005eb60175821170"));
var listPortalFiles = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input = {}) => input).handler(createSsrRpc("afdee20c77292268237f0444d823607edd8e42d4a4a84ef9cf85e3b48e51217b"));
var uploadPortalFile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("ee3fc57e815237cd182a7fe6fe6b777d8266488a0e5d94a72ee2e7160bf6c12a"));
var downloadPortalFile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("9bcafc02475067bb93a75af3a2a851de8dfbf63061ecbfdea4074c4e31b83dcb"));
var zipPortalFiles = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("80827c283054204cc582d46aef7da9526d3961827d7cd86b9c5e9b55dc7febf2"));
var sharePortalFile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("1311b91347ceed0b1ca187acd10656a5b3d81f762a4dd8c5d3a9e0487974f7d5"));
var listApprovals = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("fa7d03d6a5cd4497cf2165b8c9a2eb864092721886b2f543fe0fc6aa25122746"));
var decideApproval = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("7b1450d8ddc767bb61aa4e01b18ad97d0b4f4bf5273207d525d38ccbbe6978a5"));
var createApproval = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("e734a7a45e66e02d284ca8073c3602a2107dc49c5ef4aa181a32111ffc05043b"));
var listTaskLists = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("b79c58f14736d0f420bfd9963f419b83e42867f93a69d6ea09b024e5a322a753"));
var mutateTask = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("f45670b8c15ffef987e5305067ce8ff1373b63ee2e52915c9bdf648ec106d5d1"));
var listBookmarks = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("8be540e362e17d5f3291dad0567600939827bd404db15de82c086c697ab7d37d"));
var mutateBookmark = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("91c01453116e68dba9f72db5f0b3afc9c781b30d5d422e24f2a2820d73c648a0"));
var listAudit = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("4b4c11184d03c0f75106b21af3c43d38164f164a2a7dd9c17ff635da63978096"));
var setTenantQuota = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("02fee718af39c1991461cb3b2285b9959c046a882ece4f6cf5ecfc59d87b47aa"));
var inviteSubuser = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("676660b52964fce29d259c48b16f3f53a396462476af213f5f3c5f69a4316743"));
var listSubusers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("a6c4b9228219b70113d237f4db01acaf5f02dbe8290b7539d23eef5f7a3c6c01"));
var listEnvelopes = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("2c2ce75e1533faaa4b8de2f4342d0cdc415acd6afd9cd23a6ac072cd35b90381"));
var createEnvelope = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("3f97f66351023477deb69f905fbdda789fb8124b930ee2c79ce2a95ea86581f0"));
var getEnvelope = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("aefce33749e3b1485bfd5d0357d978b5d281928477d304c5a388361129382c83"));
var signEnvelope = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("dc3eab996d393bafe8231a0cdcf3c18d68def839af60cfbf93da6bff87320158"));
var lookupDocument = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("4931eed3acea1285773f41a67670c50c9bac403a0ff7f1acbaa28cb81cf1d947"));
var listProposals = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("57060dadffe2e7beab61b39f516b3014b8f60754ad62e05957ad02dbe4013f78"));
var createProposal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("28b0fe78b3908494623378d093a3fadd32b6351a7feda38b6fa51165dbb3e508"));
var getProposalPublic = createServerFn({ method: "GET" }).validator((input) => input).handler(createSsrRpc("e1e13cda216d9727db9bc0a510d8b75f678556940f4182668ade71de1238490f"));
var convertDealToProject = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("388ad5f09e2e85a3e1672dac42bc606a4b673ea119b9916134f5280e3277e811"));
var getBranding = createServerFn({ method: "GET" }).handler(createSsrRpc("88a3ac8cf6ac316abf8bf759f28524fc3723a079b10bebf0563e8f91c7cfdcd2"));
var saveBranding = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("e6076d76338ef471f769a21d9968d55284d1a3e77d319c4fbb7f854a4823c377"));
var syncPipedrive = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("092c550a3b7d2e4fc350b575d91af45ed8c27d045f51f4cb63c66610c8040720"));
var submitEventRequest = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("5eaed6df3f84abfbd8a23c9cd07497e5b17ef918ec598f0a4b533830dba1ac6e"));
var submitContact = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("c14e39c19b8dfb159be89529b7b16b78e09c4fa6c68077ed0590d0b38c1783da"));
var listEventRequests = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("ee8154a883c00eda0f221665e583ee39f89127b03e94162dc769f8584786a5da"));
var setNotifPref = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("52c73266103d4bee47bfeb546011e997f94c531fb5c001ae1095b4b0e56a3041"));
var listNotifPrefs = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("852bdd6cd58d005dcdf6371fe3f12602639f5feb4ae5e36edcd37230c40fa917"));
var getEsignMonitor = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("07fc547dc5f81cd3b6ba27fe94fa789ee709f60f6d1175c24ddf6056d2b25aaf"));
var getEnvelopePublic = createServerFn({ method: "GET" }).validator((input) => input).handler(createSsrRpc("f13c903674b00137bf6282a506ba7d856b0ff836e29f69dc0d1daf5d1edde83b"));
var updateEnvelopeStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("e682363827ca155e055ae4abfb133f0a303937aa94d8b165b4b6ffd314136ef0"));
var remindEnvelope = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("6868c0ca30c7ea0f41a221c9e5be9f54bd31b74bc17dab5602c75a391c7b5d3c"));
var addEnvelopeField = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("4224834ae3a43d4539803522fe8bf6154b3834f1daef8616b23343faca9205ef"));
var TONE = {
	steel: "bg-primary/20 text-primary",
	mist: "bg-steel/30 text-steel",
	sage: "bg-success/20 text-success",
	clay: "bg-destructive/20 text-destructive",
	fog: "bg-muted-foreground/20 text-muted-foreground",
	ink: "bg-foreground/12 text-foreground"
};
function MemberAvatar({ initials, tone, size = "md", className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex shrink-0 items-center justify-center rounded-full font-medium", size === "sm" && "size-6 text-[10px]", size === "md" && "size-8 text-xs", size === "lg" && "size-10 text-sm", TONE[tone ?? "steel"] ?? TONE.steel, className),
		children: initials
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[background-color,color,box-shadow,transform,opacity] duration-150 ease-out disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			secondary: "bg-secondary text-secondary-foreground shadow-[var(--shadow-border)] hover:bg-accent",
			outline: "bg-transparent shadow-[var(--shadow-border)] hover:bg-accent text-foreground",
			ghost: "hover:bg-accent text-foreground",
			destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-10 px-3.5",
			sm: "h-8 rounded-sm px-2.5 text-xs",
			lg: "h-11 rounded-lg px-5",
			icon: "size-10",
			"icon-sm": "size-8"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
function DropdownMenuContent({ className, sideOffset = 6, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
		sideOffset,
		className: cn("z-50 min-w-44 overflow-hidden rounded-lg bg-popover p-1 shadow-[var(--shadow-border),var(--shadow-lift)]", className),
		...props
	}) });
}
function DropdownMenuItem({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
		className: cn("flex cursor-pointer items-center gap-2 rounded-sm px-2.5 py-2 text-sm outline-none select-none hover:bg-accent focus:bg-accent data-[disabled]:opacity-40", className),
		...props
	});
}
function DropdownMenuSeparator({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
		className: cn("-mx-1 my-1 h-px bg-border", className),
		...props
	});
}
function DropdownMenuLabel({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
		className: cn("px-2.5 py-1.5 text-xs font-medium text-muted-foreground", className),
		...props
	});
}
var Popover = Root2$1;
var PopoverTrigger = Trigger$1;
function PopoverContent({ className, align = "center", sideOffset = 6, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2$1, {
		align,
		sideOffset,
		className: cn("z-50 w-72 rounded-lg bg-popover p-3 shadow-[var(--shadow-border),var(--shadow-lift)]", className),
		...props
	}) });
}
var Dialog = Dialog$1;
function DialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
		className: cn("fixed inset-0 z-50 bg-overlay/80", className),
		...props
	});
}
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-card p-5 shadow-[var(--shadow-border),var(--shadow-lift)]", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-3 right-3 rounded-sm p-1 text-muted-foreground hover:text-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mb-4 space-y-1", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("text-base font-semibold", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("text-sm text-muted-foreground", className),
		...props
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("flex h-10 w-full rounded-md bg-secondary px-3 text-sm text-foreground shadow-[var(--shadow-border)] placeholder:text-muted-foreground file:border-0 file:bg-transparent file:text-sm disabled:opacity-50", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("text-xs font-medium text-muted-foreground", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-24 w-full rounded-md bg-secondary px-3 py-2 text-sm text-foreground shadow-[var(--shadow-border)] placeholder:text-muted-foreground disabled:opacity-50", className),
		...props
	});
}
var Select = Select$1;
var SelectValue = SelectValue$1;
function SelectTrigger({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
		className: cn("flex h-10 w-full items-center justify-between gap-2 rounded-md bg-secondary px-3 text-sm shadow-[var(--shadow-border)] data-placeholder:text-muted-foreground", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 text-muted-foreground" }) })]
	});
}
function SelectContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent$1, {
		className: cn("z-50 max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg bg-popover shadow-[var(--shadow-border),var(--shadow-lift)]", className),
		position: "popper",
		sideOffset: 4,
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: "p-1",
			children
		})
	}) });
}
function SelectItem({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
		className: cn("relative flex cursor-pointer items-center rounded-sm py-2 pr-8 pl-2.5 text-sm outline-none select-none hover:bg-accent focus:bg-accent data-disabled:opacity-40", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, {
			className: "absolute right-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" })
		})]
	});
}
var Tabs = Root2$2;
function TabsList({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
		className: cn("inline-flex h-9 items-center gap-0.5 rounded-md bg-muted p-0.5", className),
		...props
	});
}
function TabsTrigger({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger$2, {
		className: cn("inline-flex h-8 items-center rounded-sm px-3 text-xs font-medium text-muted-foreground transition-colors data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-[var(--shadow-border)]", className),
		...props
	});
}
var TabsContent = Content;
var KINDS = [
	"deal",
	"lead",
	"person",
	"org",
	"activity"
];
function AddDialog() {
	const { addOpen, addKind, setAddOpen, memberId } = useUi();
	const qc = useQueryClient();
	const boot = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	const pipeline = boot.data?.pipelines[0];
	const [kind, setKind] = (0, import_react.useState)(addKind);
	const [pending, setPending] = (0, import_react.useState)(false);
	const [source, setSource] = (0, import_react.useState)("Web form");
	const [eventType, setEventType] = (0, import_react.useState)("Corporate gala");
	const [actType, setActType] = (0, import_react.useState)("site-survey");
	const onOpen = (open) => {
		if (open) setKind(addKind);
		setAddOpen(open, addKind);
	};
	async function onSubmit(e) {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		setPending(true);
		try {
			if (kind === "deal") {
				await createDeal({ data: {
					title: String(fd.get("title") || "Untitled show"),
					value: Number(fd.get("value") || 0),
					pipelineId: pipeline?.id ?? 1,
					stageId: pipeline?.stages[0]?.id ?? 1,
					ownerId: memberId,
					venue: String(fd.get("venue") || "") || void 0,
					eventDate: String(fd.get("eventDate") || "") || null,
					source: "Manual",
					eventType
				} });
				toast.success("Deal created");
				qc.invalidateQueries({ queryKey: ["deals"] });
				qc.invalidateQueries({ queryKey: ["lifecycle"] });
			} else if (kind === "lead") {
				await createLead({ data: {
					title: String(fd.get("title") || "New lead"),
					source,
					ownerId: memberId,
					notes: String(fd.get("notes") || "") || void 0,
					eventType,
					venue: String(fd.get("venue") || "") || void 0,
					estimatedValue: Number(fd.get("value") || 0) || void 0
				} });
				toast.success("Lead captured");
				qc.invalidateQueries({ queryKey: ["leads"] });
				qc.invalidateQueries({ queryKey: ["lifecycle"] });
			} else if (kind === "person") {
				await createPerson({ data: {
					name: String(fd.get("name") || "New contact"),
					email: String(fd.get("email") || "") || void 0,
					phone: String(fd.get("phone") || "") || void 0,
					title: String(fd.get("title") || "") || void 0,
					ownerId: memberId
				} });
				toast.success("Person added");
				qc.invalidateQueries({ queryKey: ["people"] });
			} else if (kind === "org") {
				await createOrg({ data: {
					name: String(fd.get("name") || "New organization"),
					industry: String(fd.get("industry") || "") || void 0,
					website: String(fd.get("website") || "") || void 0,
					ownerId: memberId
				} });
				toast.success("Organization added");
				qc.invalidateQueries({ queryKey: ["orgs"] });
			} else {
				await createActivity({ data: {
					type: actType,
					subject: String(fd.get("subject") || "Follow up"),
					ownerId: memberId,
					dueAt: String(fd.get("dueAt") || "") || null,
					location: String(fd.get("location") || "") || void 0
				} });
				toast.success("Activity scheduled");
				qc.invalidateQueries({ queryKey: ["activities"] });
			}
			setAddOpen(false);
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: addOpen,
		onOpenChange: onOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Quick add" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Create a deal, lead, contact, or activity." })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
				value: kind,
				onValueChange: (v) => setKind(v),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList, {
					className: "mb-4 w-full",
					children: KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: k,
						className: "flex-1 capitalize",
						children: k === "org" ? "Org" : k
					}, k))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "space-y-3",
				children: [
					kind === "deal" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							name: "title",
							label: "Show / deal",
							placeholder: "Pier 17 rooftop keynote"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								name: "value",
								label: "Value (USD)",
								type: "number",
								placeholder: "85000"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								name: "venue",
								label: "Venue",
								placeholder: "Cipriani 42nd"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							name: "eventDate",
							label: "Event date",
							type: "date"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "deal-type",
								children: "Event type"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: eventType,
								onValueChange: setEventType,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									id: "deal-type",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (boot.data?.eventTypes?.map((t) => t.name) ?? [...EVENT_TYPES]).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: s,
									children: s
								}, s)) })]
							})]
						})
					] }),
					kind === "lead" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							name: "title",
							label: "Lead",
							placeholder: "Warehouse rave — Bushwick"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								name: "venue",
								label: "Venue",
								placeholder: "Cipriani 42nd"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								name: "value",
								label: "Est. value",
								type: "number",
								placeholder: "45000"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "source",
								children: "Source"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: source,
								onValueChange: setSource,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									id: "source",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: LEAD_SOURCES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: s,
									children: s
								}, s)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "lead-type",
								children: "Event type"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: eventType,
								onValueChange: setEventType,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									id: "lead-type",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (boot.data?.eventTypes?.map((t) => t.name) ?? [...EVENT_TYPES]).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: s,
									children: s
								}, s)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "notes",
								children: "Notes"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "notes",
								name: "notes",
								rows: 3
							})]
						})
					] }),
					kind === "person" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							name: "name",
							label: "Name",
							placeholder: "Elena Voss"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								name: "email",
								label: "Email",
								type: "email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								name: "phone",
								label: "Phone"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							name: "title",
							label: "Title",
							placeholder: "Head of Events"
						})
					] }),
					kind === "org" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						name: "name",
						label: "Organization",
						placeholder: "The Shed"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							name: "industry",
							label: "Industry",
							placeholder: "Culture"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							name: "website",
							label: "Website",
							placeholder: "theshed.org"
						})]
					})] }),
					kind === "activity" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							name: "subject",
							label: "Subject",
							placeholder: "Site walk — Cipriani"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "type",
									children: "Type"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: actType,
									onValueChange: setActType,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										id: "type",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
										"call",
										"meeting",
										"site-survey",
										"task",
										"deadline",
										"lunch",
										"email"
									].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: s,
										children: s
									}, s)) })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								name: "dueAt",
								label: "Due",
								type: "datetime-local"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							name: "location",
							label: "Location",
							placeholder: "Venue or video"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							onClick: () => setAddOpen(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: pending,
							children: pending ? "Saving…" : "Create"
						})]
					})
				]
			})
		] })
	});
}
function Field({ name, label, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			htmlFor: name,
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			id: name,
			name,
			...props
		})]
	});
}
var PAGES = [
	{
		label: "Home",
		to: "/home"
	},
	{
		label: "Pipeline",
		to: "/"
	},
	{
		label: "Leads inbox",
		to: "/leads"
	},
	{
		label: "Event lifecycle",
		to: "/lifecycle"
	},
	{
		label: "Pulse",
		to: "/pulse"
	},
	{
		label: "Client registry",
		to: "/registry"
	},
	{
		label: "Calendar",
		to: "/activities"
	},
	{
		label: "Projects",
		to: "/projects"
	},
	{
		label: "Insights",
		to: "/insights"
	},
	{
		label: "Goals",
		to: "/goals"
	},
	{
		label: "Mail",
		to: "/mail"
	},
	{
		label: "Sending domain",
		to: "/domain"
	},
	{
		label: "Documents",
		to: "/documents"
	},
	{
		label: "Products",
		to: "/products"
	},
	{
		label: "Automations",
		to: "/automations"
	},
	{
		label: "Sequences",
		to: "/sequences"
	},
	{
		label: "Live inbox",
		to: "/inbox"
	},
	{
		label: "LeadBooster",
		to: "/leadbooster"
	},
	{
		label: "Chatbot",
		to: "/chatbot"
	},
	{
		label: "Forms",
		to: "/forms"
	},
	{
		label: "Prospector",
		to: "/prospector"
	},
	{
		label: "Scheduler",
		to: "/scheduler"
	},
	{
		label: "Marketplace",
		to: "/marketplace"
	},
	{
		label: "Forecast",
		to: "/forecast"
	},
	{
		label: "Display boards",
		to: "/boards"
	},
	{
		label: "Mileage & travel",
		to: "/travel"
	},
	{
		label: "Import",
		to: "/import"
	},
	{
		label: "Sandbox",
		to: "/sandbox"
	},
	{
		label: "Developers",
		to: "/developers"
	},
	{
		label: "Integrations",
		to: "/integrations"
	},
	{
		label: "Settings",
		to: "/settings"
	},
	{
		label: "Security",
		to: "/security"
	},
	{
		label: "Files",
		to: "/files"
	},
	{
		label: "Approvals",
		to: "/approvals"
	},
	{
		label: "Tasks",
		to: "/tasks"
	},
	{
		label: "E-sign",
		to: "/esign"
	},
	{
		label: "Proposals",
		to: "/proposals"
	},
	{
		label: "Admin",
		to: "/admin"
	},
	{
		label: "Profile",
		to: "/profile"
	},
	{
		label: "Bookmarks",
		to: "/bookmarks"
	},
	{
		label: "AI desk",
		to: "/ai"
	},
	{
		label: "Business health",
		to: "/health"
	},
	{
		label: "Finance",
		to: "/finance"
	},
	{
		label: "Quotes",
		to: "/quotes"
	},
	{
		label: "Broadcasts",
		to: "/broadcasts"
	},
	{
		label: "Sending domain",
		to: "/domain"
	},
	{
		label: "Portal domain",
		to: "/portal-domain"
	},
	{
		label: "Client portal",
		to: "/client-portal"
	},
	{
		label: "SMTP",
		to: "/smtp"
	},
	{
		label: "SMS via QUO",
		to: "/sms"
	},
	{
		label: "Cold lists",
		to: "/cold"
	},
	{
		label: "Crew & calendar",
		to: "/crew"
	},
	{
		label: "Unique views",
		to: "/views"
	},
	{
		label: "Guest lists",
		to: "/guests"
	},
	{
		label: "Floor plan designer",
		to: "/floorplans"
	},
	{
		label: "Reviews & reputation",
		to: "/reviews"
	},
	{
		label: "Freelance gigs",
		to: "/gigs"
	},
	{
		label: "Event hand-off",
		to: "/handoff"
	},
	{
		label: "Directory",
		to: "/discover"
	}
];
function CommandPalette() {
	const { commandOpen, setCommandOpen, setAddOpen } = useUi();
	const navigate = useNavigate();
	const [q, setQ] = (0, import_react.useState)("");
	const deals = useQuery({
		queryKey: [
			"deals",
			1,
			"all"
		],
		queryFn: () => listDeals({ data: {
			pipelineId: 1,
			status: "all"
		} }),
		enabled: commandOpen
	});
	const people = useQuery({
		queryKey: ["people"],
		queryFn: () => listPeople(),
		enabled: commandOpen
	});
	const boot = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	(0, import_react.useEffect)(() => {
		if (!commandOpen) setQ("");
	}, [commandOpen]);
	const query = q.trim().toLowerCase();
	const items = (0, import_react.useMemo)(() => {
		const out = [];
		const go = (to) => {
			setCommandOpen(false);
			const deal = to.match(/^\/deals\/(\d+)/)?.[1];
			if (deal) {
				navigate({
					to: "/deals/$dealId",
					params: { dealId: deal }
				});
				return;
			}
			navigate({ to });
		};
		if (!query || "new deal".includes(query)) out.push({
			group: "Create",
			label: "New deal",
			run: () => {
				setCommandOpen(false);
				setAddOpen(true, "deal");
			}
		});
		if (!query || "new lead".includes(query)) out.push({
			group: "Create",
			label: "New lead",
			run: () => {
				setCommandOpen(false);
				setAddOpen(true, "lead");
			}
		});
		for (const p of PAGES) if (!query || p.label.toLowerCase().includes(query)) out.push({
			group: "Go to",
			label: p.label,
			run: () => go(p.to)
		});
		for (const d of deals.data ?? []) if (query && `${d.title} ${d.orgName ?? ""} ${d.venue ?? ""}`.toLowerCase().includes(query)) out.push({
			group: "Deals",
			label: d.title,
			run: () => go(`/deals/${d.id}`)
		});
		for (const p of people.data ?? []) if (query && `${p.name} ${p.orgName ?? ""}`.toLowerCase().includes(query)) out.push({
			group: "People",
			label: p.name,
			run: () => {
				setCommandOpen(false);
				navigate({
					to: "/contacts/$personId",
					params: { personId: String(p.id) }
				});
			}
		});
		for (const m of boot.data?.members ?? []) if (query && m.name.toLowerCase().includes(query)) out.push({
			group: "Team",
			label: m.name,
			run: () => go("/settings")
		});
		return out.slice(0, 18);
	}, [
		query,
		deals.data,
		people.data,
		boot.data,
		navigate,
		setAddOpen,
		setCommandOpen
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: commandOpen,
		onOpenChange: setCommandOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg p-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "sr-only",
					children: "Command palette"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					autoFocus: true,
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Jump to a deal, person, or page",
					className: "h-12 rounded-b-none border-0 shadow-none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-h-80 overflow-y-auto p-1",
					children: [items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-3 py-6 text-sm text-muted-foreground",
						children: "Nothing matches."
					}), items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm hover:bg-accent",
						onClick: item.run,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-muted-foreground",
							children: item.group
						})]
					}, `${item.group}-${item.label}-${i}`))]
				})
			]
		})
	});
}
var Sheet = Dialog$1;
function SheetContent({ className, children, side = "right", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, { className: "fixed inset-0 z-50 bg-overlay/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed z-50 flex h-full flex-col bg-card shadow-[var(--shadow-border),var(--shadow-lift)]", side === "right" ? "top-0 right-0 w-full max-w-xl" : "top-0 left-0 w-full max-w-xs", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-3 right-3 rounded-sm p-1 text-muted-foreground hover:text-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function SheetHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("border-b border-border px-5 py-4", className),
		...props
	});
}
function SheetTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("text-base font-semibold", className),
		...props
	});
}
var PROMPTS = [
	"Which rotting shows should we hit today?",
	"Draft a recost note for Citadel's wider LED wall.",
	"What is at risk if 1 Hotel slips the countersign?"
];
function AssistantPanel() {
	const { assistantOpen, setAssistantOpen } = useUi();
	const [q, setQ] = (0, import_react.useState)("");
	const [answer, setAnswer] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function ask(text) {
		const prompt = text.trim();
		if (!prompt) return;
		setBusy(true);
		const res = await runAi({ data: {
			kind: "assistant",
			prompt
		} });
		setBusy(false);
		if (res.ok) setAnswer(res.text);
		else toast.error(res.error);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open: assistantOpen,
		onOpenChange: setAssistantOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			className: "w-full max-w-md p-0 sm:max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetTitle, {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), "Sales copilot"]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 px-5 py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Ask about the live-events book. Answers use this week’s pipeline — never auto-fires."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-2",
						children: PROMPTS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "rounded-lg bg-muted px-3 py-2 text-left text-sm hover:bg-accent",
							onClick: () => {
								setQ(p);
								ask(p);
							},
							children: p
						}, p))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Ask the copilot…",
						rows: 3
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => void ask(q),
						disabled: busy,
						children: busy ? "Thinking…" : "Ask"
					}),
					answer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-lg bg-muted p-3 text-sm leading-relaxed",
						children: answer
					})
				]
			})]
		})
	});
}
var ITEMS = [
	{
		id: "light",
		label: "Daylight",
		icon: Sun
	},
	{
		id: "dark",
		label: "Nightline",
		icon: Moon
	},
	{
		id: "system",
		label: "System",
		icon: Monitor
	}
];
function ThemeToggle({ compact = false }) {
	const theme = useUi((s) => s.theme);
	const setTheme = useUi((s) => s.setTheme);
	const TriggerIcon = resolveTheme(theme) === "light" ? Sun : Moon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: compact ? "ghost" : "secondary",
			size: compact ? "icon-sm" : "sm",
			"aria-label": `Appearance: ${theme}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriggerIcon, { className: "size-4" }), !compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hidden sm:inline",
				children: "Appearance"
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
		align: "end",
		className: "w-44",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, { children: "Appearance" }), ITEMS.map((item) => {
			const Icon = item.icon;
			const active = theme === item.id;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
				onSelect: () => setTheme(item.id),
				className: cn(active && "bg-accent"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), item.label]
			}, item.id);
		})]
	})] });
}
function SessionLock() {
	const qc = useQueryClient();
	const access = useQuery({
		queryKey: ["access"],
		queryFn: () => getAccessState()
	});
	const [code, setCode] = (0, import_react.useState)("");
	const locked = Boolean(access.data?.session.locked);
	const idleMin = access.data?.policy.idleMinutes ?? 15;
	(0, import_react.useEffect)(() => {
		if (!access.data || locked) return;
		let t;
		const bump = () => {
			clearTimeout(t);
			t = setTimeout(() => {
				lockSession().then(() => qc.invalidateQueries({ queryKey: ["access"] }));
			}, idleMin * 6e4);
		};
		bump();
		window.addEventListener("pointerdown", bump);
		window.addEventListener("keydown", bump);
		return () => {
			clearTimeout(t);
			window.removeEventListener("pointerdown", bump);
			window.removeEventListener("keydown", bump);
		};
	}, [
		access.data,
		idleMin,
		locked,
		qc
	]);
	if (!locked) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[80] flex items-center justify-center bg-overlay/80 px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-xl bg-card p-6 shadow-[var(--shadow-border),var(--shadow-lift)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-5 text-primary" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 text-base font-semibold",
					children: "Workspace locked"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Idle lock and MFA are on. Enter recovery code 482193 — Dana holds the rest."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-4 space-y-3",
					onSubmit: (e) => {
						e.preventDefault();
						unlockSession({ data: { code } }).then((r) => {
							if (r.ok) {
								toast.success("Session restored");
								setCode("");
								qc.invalidateQueries({ queryKey: ["access"] });
							} else toast.error(r.error ?? "Denied");
						});
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: code,
						onChange: (e) => setCode(e.target.value),
						placeholder: "Recovery code",
						autoFocus: true,
						inputMode: "numeric"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						children: "Confirm MFA"
					})]
				})
			]
		})
	});
}
function CookieBanner() {
	const [show, setShow] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setShow(!localStorage.getItem("nl-cookie"));
	}, []);
	if (!show) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card px-4 py-3 shadow-[var(--shadow-lift)] sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "We use necessary cookies for sign-in and optional analytics for the portal. See the privacy notice."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "secondary",
					onClick: () => {
						localStorage.setItem("nl-cookie", "essential");
						setShow(false);
					},
					children: "Essential only"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					onClick: () => {
						localStorage.setItem("nl-cookie", "all");
						setShow(false);
					},
					children: "Accept"
				})]
			})]
		})
	});
}
function DirtyGuard() {
	const dirty = useUi((s) => s.dirty);
	(0, import_react.useEffect)(() => {
		const onBefore = (e) => {
			if (!dirty) return;
			e.preventDefault();
			e.returnValue = "";
		};
		window.addEventListener("beforeunload", onBefore);
		return () => window.removeEventListener("beforeunload", onBefore);
	}, [dirty]);
	return null;
}
function SessionWatch() {
	(0, import_react.useEffect)(() => {
		const t = window.setTimeout(() => {
			toast("Session expires in 5 minutes", { description: "Save your work. The idle lock will ask for a code." });
		}, 15e5);
		return () => window.clearTimeout(t);
	}, []);
	return null;
}
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
function HpMark({ className, color = "#0D47A1" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className,
		"aria-hidden": true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			width: "32",
			height: "32",
			rx: "7",
			fill: color
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "#F5F3EE",
			d: "M7.2 8.2h3.1v6.2h4.2V8.2h3.1V23.8h-3.1v-6.4h-4.2v6.4H7.2V8.2zm13.4 0h4.4c3.1 0 5.1 1.7 5.1 4.4 0 2.6-1.9 4.3-4.9 4.4h-1.5v6.8h-3.1V8.2zm4.2 6.1c1.3 0 2.1-.6 2.1-1.6s-.8-1.6-2.1-1.6h-1.1v3.2h1.1z"
		})]
	});
}
var NAV = [
	{
		href: "/home",
		label: "Home",
		icon: House
	},
	{
		href: "/",
		label: "Pipeline",
		icon: Kanban
	},
	{
		href: "/leads",
		label: "Leads",
		icon: Inbox
	},
	{
		href: "/lifecycle",
		label: "Lifecycle",
		icon: Waypoints
	},
	{
		href: "/pulse",
		label: "Pulse",
		icon: Radar
	},
	{
		href: "/registry",
		label: "Registry",
		icon: Users
	},
	{
		href: "/activities",
		label: "Calendar",
		icon: Calendar
	},
	{
		href: "/projects",
		label: "Projects",
		icon: LayoutGrid
	},
	{
		href: "/insights",
		label: "Insights",
		icon: ChartColumn
	},
	{
		href: "/goals",
		label: "Goals",
		icon: Target
	}
];
var CLIENT_NAV = [
	{
		href: "/home",
		label: "Home",
		icon: House
	},
	{
		href: "/projects",
		label: "Projects",
		icon: LayoutGrid
	},
	{
		href: "/files",
		label: "Files",
		icon: FolderOpen
	},
	{
		href: "/approvals",
		label: "Approvals",
		icon: ClipboardCheck
	},
	{
		href: "/tasks",
		label: "Tasks",
		icon: SquareCheckBig
	},
	{
		href: "/documents",
		label: "Documents",
		icon: FileText
	},
	{
		href: "/profile",
		label: "Profile",
		icon: CircleUser
	}
];
var MORE = [
	{
		href: "/ai",
		label: "AI desk",
		icon: Sparkles
	},
	{
		href: "/health",
		label: "Health",
		icon: HeartPulse
	},
	{
		href: "/finance",
		label: "Finance",
		icon: Wallet
	},
	{
		href: "/quotes",
		label: "Quotes",
		icon: Receipt
	},
	{
		href: "/mail",
		label: "Mail",
		icon: Mail
	},
	{
		href: "/domain",
		label: "Sending domain",
		icon: MailCheck
	},
	{
		href: "/portal-domain",
		label: "Portal domain",
		icon: Globe
	},
	{
		href: "/client-portal",
		label: "Client portal",
		icon: KeyRound
	},
	{
		href: "/smtp",
		label: "SMTP",
		icon: Send
	},
	{
		href: "/inbox",
		label: "Unified inbox",
		icon: MessageSquare
	},
	{
		href: "/sms",
		label: "SMS / QUO",
		icon: Smartphone
	},
	{
		href: "/broadcasts",
		label: "Broadcasts",
		icon: Megaphone
	},
	{
		href: "/cold",
		label: "Cold lists",
		icon: ScanLine
	},
	{
		href: "/crew",
		label: "Crew",
		icon: Users
	},
	{
		href: "/views",
		label: "Unique views",
		icon: CalendarRange
	},
	{
		href: "/guests",
		label: "Guests",
		icon: UserCheck
	},
	{
		href: "/floorplans",
		label: "Floor plans",
		icon: Map$1
	},
	{
		href: "/reviews",
		label: "Reviews",
		icon: Star
	},
	{
		href: "/gigs",
		label: "Gigs",
		icon: Briefcase
	},
	{
		href: "/handoff",
		label: "Hand-off",
		icon: Handshake
	},
	{
		href: "/discover",
		label: "Directory",
		icon: Compass
	},
	{
		href: "/documents",
		label: "Documents",
		icon: FileText
	},
	{
		href: "/products",
		label: "Products",
		icon: Box
	},
	{
		href: "/automations",
		label: "Automations",
		icon: Workflow
	},
	{
		href: "/sequences",
		label: "Sequences",
		icon: Zap
	},
	{
		href: "/leadbooster",
		label: "LeadBooster",
		icon: Bot
	},
	{
		href: "/chatbot",
		label: "Chatbot",
		icon: Bot
	},
	{
		href: "/forms",
		label: "Forms",
		icon: RectangleEllipsis
	},
	{
		href: "/prospector",
		label: "Prospector",
		icon: UserPlus
	},
	{
		href: "/scheduler",
		label: "Scheduler",
		icon: Calendar
	},
	{
		href: "/marketplace",
		label: "Marketplace",
		icon: Store
	},
	{
		href: "/forecast",
		label: "Forecast",
		icon: Activity
	},
	{
		href: "/boards",
		label: "Display boards",
		icon: Monitor
	},
	{
		href: "/travel",
		label: "Mileage",
		icon: Truck
	},
	{
		href: "/import",
		label: "Import",
		icon: Upload
	},
	{
		href: "/files",
		label: "Files",
		icon: FolderOpen
	},
	{
		href: "/approvals",
		label: "Approvals",
		icon: ClipboardCheck
	},
	{
		href: "/tasks",
		label: "Tasks",
		icon: SquareCheckBig
	},
	{
		href: "/esign",
		label: "E-sign",
		icon: PenLine
	},
	{
		href: "/proposals",
		label: "Proposals",
		icon: FileText
	},
	{
		href: "/admin",
		label: "Admin",
		icon: Shield
	},
	{
		href: "/sandbox",
		label: "Sandbox",
		icon: FlaskConical
	},
	{
		href: "/developers",
		label: "Developers",
		icon: KeyRound
	},
	{
		href: "/integrations",
		label: "Integrations",
		icon: Plug
	},
	{
		href: "/settings",
		label: "Settings",
		icon: Settings
	},
	{
		href: "/security",
		label: "Security",
		icon: Shield
	}
];
function Mark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		className: "size-6",
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "4",
				y: "5",
				width: "3.2",
				height: "14",
				rx: "0.6",
				fill: "currentColor",
				opacity: "0.95"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "9.4",
				y: "8",
				width: "3.2",
				height: "11",
				rx: "0.6",
				fill: "currentColor",
				opacity: "0.7"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "14.8",
				y: "3",
				width: "3.2",
				height: "16",
				rx: "0.6",
				fill: "currentColor"
			})
		]
	});
}
function isActive(pathname, href) {
	if (href === "/") return pathname === "/" || pathname.startsWith("/deals/");
	return pathname === href || pathname.startsWith(`${href}/`);
}
function isPublic(pathname) {
	return pathname.startsWith("/f/") || pathname.startsWith("/book/") || pathname.startsWith("/sign/") || pathname.startsWith("/p/") || pathname.startsWith("/h/") || pathname.startsWith("/r/") || pathname.startsWith("/u/") || pathname.startsWith("/t/") || pathname.startsWith("/board/") || pathname.startsWith("/w/") || pathname === "/portal" || pathname.startsWith("/c/") || pathname.startsWith("/rsvp/") || pathname.startsWith("/discover") || pathname.startsWith("/cal/") || pathname === "/login" || pathname === "/forgot" || pathname === "/reset" || pathname === "/lookup" || pathname === "/contact" || pathname === "/request";
}
function isEsignHost() {
	if (typeof window === "undefined") return false;
	return window.location.hostname.startsWith("esign.") || window.location.search.includes("esign=1");
}
function AppShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const publicPage = isPublic(pathname);
	const esign = isEsignHost();
	const { user, isPending } = useCurrentUserState();
	const { memberId, setMemberId, sidebarOpen, setSidebarOpen, setCommandOpen, setAddOpen, setAssistantOpen } = useUi();
	const portal = useQuery({
		queryKey: ["portal-me"],
		queryFn: () => getPortalMe(),
		enabled: !!user && !publicPage
	});
	const tenants = useQuery({
		queryKey: ["tenants"],
		queryFn: () => listTenants(),
		enabled: portal.data?.role === "staff"
	});
	const marks = useQuery({
		queryKey: ["bookmarks"],
		queryFn: () => listBookmarks(),
		enabled: !!user && !publicPage
	});
	const bootstrap = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap(),
		enabled: !publicPage
	});
	const access = useQuery({
		queryKey: ["access"],
		queryFn: () => getAccessState(),
		enabled: !publicPage
	});
	const notes = useQuery({
		queryKey: ["notifications", memberId],
		queryFn: () => listNotifications({ data: { memberId } }),
		enabled: !publicPage
	});
	const member = bootstrap.data?.members.find((m) => m.id === memberId) ?? bootstrap.data?.members[0];
	const unread = notes.data?.filter((n) => !n.read).length ?? 0;
	const client = portal.data?.role === "client" || portal.data?.role === "subuser";
	const navItems = client ? CLIENT_NAV : NAV;
	const portalBrand = useQuery({
		queryKey: ["portal-brand"],
		queryFn: () => getPortalBrand(),
		enabled: client
	});
	(0, import_react.useEffect)(() => {
		if (!client) return;
		const hex = portalBrand.data?.primaryHex ?? "0D47A1";
		document.documentElement.dataset.brand = "portal";
		document.documentElement.style.setProperty("--nl-primary", `#${hex}`);
		document.documentElement.style.setProperty("--nl-ring", `#${hex}`);
		return () => {
			delete document.documentElement.dataset.brand;
			document.documentElement.style.removeProperty("--nl-primary");
			document.documentElement.style.removeProperty("--nl-ring");
		};
	}, [client, portalBrand.data?.primaryHex]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setCommandOpen(true);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [setCommandOpen]);
	if (esign && !pathname.startsWith("/esign") && !pathname.startsWith("/sign/")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/esign" });
	if (publicPage) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CookieBanner, {})] });
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-background text-sm text-muted-foreground",
		children: "Loading the house…"
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	const blocked = access.data && access.data.allowed === false && pathname !== "/security";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "sticky top-0 hidden h-dvh w-56 shrink-0 flex-col border-r border-border bg-sidebar lg:flex",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {
					client,
					company: portalBrand.data?.company,
					primary: portalBrand.data?.primaryHex
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {
					pathname,
					items: navItems,
					client,
					compact: true
				})]
			}),
			sidebarOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-40 lg:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "absolute inset-0 bg-overlay/60",
					onClick: () => setSidebarOpen(false),
					"aria-label": "Close menu"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "relative z-10 flex h-full w-72 flex-col bg-sidebar shadow-[var(--shadow-lift)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {
							client,
							company: portalBrand.data?.company,
							primary: portalBrand.data?.primaryHex
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon-sm",
							variant: "ghost",
							onClick: () => setSidebarOpen(false),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {
						pathname,
						items: navItems,
						client
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-border bg-background/90 px-3 backdrop-blur-sm sm:px-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon-sm",
								variant: "ghost",
								className: "lg:hidden",
								onClick: () => setSidebarOpen(true),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setCommandOpen(true),
								className: "flex h-9 min-w-0 flex-1 items-center gap-2 rounded-md bg-muted px-3 text-left text-sm text-muted-foreground sm:max-w-md",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-3.5 shrink-0" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: "Find a show, person, or command"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
										className: "ml-auto hidden font-mono text-[10px] sm:inline",
										children: "⌘K"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								onClick: () => setAddOpen(true, "deal"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), "New"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "icon-sm",
									variant: "ghost",
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4" }), unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -top-0.5 -right-0.5 size-2 rounded-full bg-primary" })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
								align: "end",
								className: "w-80 p-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border px-3 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium",
										children: "Notifications"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										onClick: () => markNotificationsRead({ data: { memberId } }).then(() => notes.refetch()),
										children: "Mark read"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "max-h-72 overflow-y-auto",
									children: (notes.data ?? []).slice(0, 12).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: cn("border-b border-border px-3 py-2.5 text-sm", !n.read && "bg-muted/50"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium",
											children: n.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: n.body
										})]
									}, n.id))
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon-sm",
									variant: "ghost",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-4" })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
								align: "end",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, { children: "Bookmarks" }),
									(marks.data ?? []).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: b.href,
											children: b.label
										})
									}, b.id)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/bookmarks",
											children: "Manage"
										})
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon-sm",
								variant: "ghost",
								onClick: () => setAssistantOpen(true),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {}),
							portal.data?.role === "staff" && (tenants.data ?? []).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "ghost",
									className: "hidden md:inline-flex",
									children: ["Tenant", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3.5" })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
								align: "end",
								children: [(tenants.data ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									onClick: () => switchTenant({ data: {
										tenantId: t.id,
										password: "northline"
									} }).then((r) => {
										if (r.ok) toast.success(`Switched to ${t.name}`);
										else toast.error(r.error);
									}),
									children: t.name
								}, t.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									onClick: () => switchTenant({ data: { tenantId: null } }),
									children: "Clear impersonation"
								})]
							})] }),
							member && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "hidden items-center gap-2 rounded-md px-1.5 py-1 hover:bg-accent sm:flex",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemberAvatar, {
										initials: member.initials,
										tone: member.tone,
										size: "sm"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-left text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block font-medium",
											children: member.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: member.role
										})]
									})]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
								align: "end",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, { children: "Act as" }),
									(bootstrap.data?.members ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										onClick: () => {
											setMemberId(m.id);
											testSignIn({ data: { memberName: m.name } }).then((r) => {
												if (!r.ok) toast.error(r.reason ?? "Policy denied");
											});
										},
										children: m.name
									}, m.id)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/profile",
											children: "Profile"
										})
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "hidden xl:block",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
							})
						]
					}),
					blocked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-b border-border bg-muted px-4 py-2 text-sm",
						children: [
							"Access policy blocked this desk.",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/security",
								className: "underline-offset-4 hover:underline",
								children: "Review security"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "min-w-0 flex-1",
						children
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddDialog, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandPalette, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssistantPanel, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionLock, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CookieBanner, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DirtyGuard, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionWatch, {})
		]
	});
}
function Brand({ client, company, primary }) {
	if (client) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/home",
		className: "flex items-center gap-2 px-3 py-4 text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HpMark, {
			className: "size-6",
			color: `#${primary ?? "0D47A1"}`
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-semibold tracking-tight",
			children: company ?? "Hurricane Productions"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/home",
		className: "flex items-center gap-2 px-3 py-4 text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-semibold tracking-tight",
			children: "Northline"
		})]
	});
}
function Nav({ pathname, items, client, compact }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		className: "flex-1 overflow-y-auto px-2 pb-8",
		children: [
			items.map((item) => {
				const Icon = item.icon;
				const active = isActive(pathname, item.href);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: item.href,
					onClick: () => useUi.getState().setSidebarOpen(false),
					className: cn("flex min-h-11 items-center gap-2.5 rounded-md px-2.5 text-sm transition-colors", active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn(compact && "lg:hidden xl:inline"),
						children: item.label
					})]
				}, item.href);
			}),
			!client && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 mb-1 px-2.5 text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase",
				children: "Workspace"
			}),
			!client && MORE.map((item) => {
				const Icon = item.icon;
				const active = isActive(pathname, item.href);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: item.href,
					onClick: () => useUi.getState().setSidebarOpen(false),
					className: cn("flex min-h-10 items-center gap-2.5 rounded-md px-2.5 text-sm transition-colors", active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0" }), item.label]
				}, item.href);
			})
		]
	});
}
function PageHeader({ title, subtitle, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-start justify-between gap-3 px-4 py-5 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-semibold tracking-tight text-balance",
				children: title
			}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: subtitle
			})]
		}), actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap items-center gap-2",
			children: actions
		})]
	});
}
function ThemeSync() {
	const theme = useUi((s) => s.theme);
	(0, import_react.useEffect)(() => {
		const apply = () => applyResolvedTheme(resolveTheme(theme));
		apply();
		if (theme !== "system") return;
		const mq = window.matchMedia("(prefers-color-scheme: light)");
		mq.addEventListener("change", apply);
		return () => mq.removeEventListener("change", apply);
	}, [theme]);
	return null;
}
var styles_default = "/assets/styles-DqpPKe19.css";
var APP_NAME = "Northline";
var Route$86 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: THEME_COLORS.light
			},
			{
				name: "description",
				content: "Northline — production CRM for live event AV companies."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: THEME_BOOT_SCRIPT } })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-background text-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Providers, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeSync, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) })] }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	})
});
var $$splitComponentImporter$81 = () => import("./routes-BCXCv5cI.mjs");
var Route$85 = createFileRoute("/")({
	component: lazyRouteComponent($$splitComponentImporter$81, "component"),
	validateSearch: (s) => ({
		pipeline: typeof s.pipeline === "string" ? s.pipeline : void 0,
		deal: typeof s.deal === "string" ? s.deal : void 0
	})
});
var $$splitComponentImporter$80 = () => import("./activities-CShRDvqz.mjs");
var Route$84 = createFileRoute("/activities")({ component: lazyRouteComponent($$splitComponentImporter$80, "component") });
var $$splitComponentImporter$79 = () => import("./admin-C-hJCq_W.mjs");
var Route$83 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$79, "component") });
var $$splitComponentImporter$78 = () => import("./ai-Cf21oLru.mjs");
var Route$82 = createFileRoute("/ai")({ component: lazyRouteComponent($$splitComponentImporter$78, "component") });
var $$splitComponentImporter$77 = () => import("./approvals-DZi1iEWt.mjs");
var Route$81 = createFileRoute("/approvals")({ component: lazyRouteComponent($$splitComponentImporter$77, "component") });
var $$splitComponentImporter$76 = () => import("./automations-DuipRx9s.mjs");
var Route$80 = createFileRoute("/automations")({ component: lazyRouteComponent($$splitComponentImporter$76, "component") });
var $$splitComponentImporter$75 = () => import("./boards-PjYo2aVQ.mjs");
var Route$79 = createFileRoute("/boards")({ component: lazyRouteComponent($$splitComponentImporter$75, "component") });
var $$splitComponentImporter$74 = () => import("./bookmarks-C2-7OseG.mjs");
var Route$78 = createFileRoute("/bookmarks")({ component: lazyRouteComponent($$splitComponentImporter$74, "component") });
var $$splitComponentImporter$73 = () => import("./broadcasts-BywpvdEp.mjs");
var Route$77 = createFileRoute("/broadcasts")({ component: lazyRouteComponent($$splitComponentImporter$73, "component") });
var $$splitComponentImporter$72 = () => import("./chatbot-B4HQRvjd.mjs");
var Route$76 = createFileRoute("/chatbot")({ component: lazyRouteComponent($$splitComponentImporter$72, "component") });
var $$splitComponentImporter$71 = () => import("./client-portal-BFjc1gDx.mjs");
var Route$75 = createFileRoute("/client-portal")({ component: lazyRouteComponent($$splitComponentImporter$71, "component") });
var $$splitComponentImporter$70 = () => import("./cold-eFNwKkgN.mjs");
var Route$74 = createFileRoute("/cold")({ component: lazyRouteComponent($$splitComponentImporter$70, "component") });
var $$splitComponentImporter$69 = () => import("./contact-DHtW_uYo.mjs");
var Route$73 = createFileRoute("/contact")({ component: lazyRouteComponent($$splitComponentImporter$69, "component") });
var $$splitComponentImporter$68 = () => import("./contacts-qXMQufAk.mjs");
var Route$72 = createFileRoute("/contacts")({ component: lazyRouteComponent($$splitComponentImporter$68, "component") });
var $$splitComponentImporter$67 = () => import("./crew-DFGSHjhi.mjs");
var Route$71 = createFileRoute("/crew")({ component: lazyRouteComponent($$splitComponentImporter$67, "component") });
var $$splitComponentImporter$66 = () => import("./developers-D-ibPz94.mjs");
var Route$70 = createFileRoute("/developers")({ component: lazyRouteComponent($$splitComponentImporter$66, "component") });
var $$splitComponentImporter$65 = () => import("./discover-Z-dS5kPt.mjs");
var Route$69 = createFileRoute("/discover")({ component: lazyRouteComponent($$splitComponentImporter$65, "component") });
var $$splitComponentImporter$64 = () => import("./documents-q61vHTHv.mjs");
var Route$68 = createFileRoute("/documents")({ component: lazyRouteComponent($$splitComponentImporter$64, "component") });
var $$splitComponentImporter$63 = () => import("./domain-BRjBnA9y.mjs");
var Route$67 = createFileRoute("/domain")({ component: lazyRouteComponent($$splitComponentImporter$63, "component") });
var $$splitComponentImporter$62 = () => import("./esign-CECOPD-K.mjs");
var Route$66 = createFileRoute("/esign")({ component: lazyRouteComponent($$splitComponentImporter$62, "component") });
var $$splitComponentImporter$61 = () => import("./files-Bsi7nvxZ.mjs");
var Route$65 = createFileRoute("/files")({ component: lazyRouteComponent($$splitComponentImporter$61, "component") });
var $$splitComponentImporter$60 = () => import("./finance-vABOnTqZ.mjs");
var Route$64 = createFileRoute("/finance")({ component: lazyRouteComponent($$splitComponentImporter$60, "component") });
var $$splitComponentImporter$59 = () => import("./floorplans-C1QQvLgB.mjs");
var Route$63 = createFileRoute("/floorplans")({ component: lazyRouteComponent($$splitComponentImporter$59, "component") });
var $$splitComponentImporter$58 = () => import("./forecast-02uyljBQ.mjs");
var Route$62 = createFileRoute("/forecast")({ component: lazyRouteComponent($$splitComponentImporter$58, "component") });
var $$splitComponentImporter$57 = () => import("./forgot-BilePFRZ.mjs");
var Route$61 = createFileRoute("/forgot")({ component: lazyRouteComponent($$splitComponentImporter$57, "component") });
var $$splitComponentImporter$56 = () => import("./forms-B_fXXa9x.mjs");
var Route$60 = createFileRoute("/forms")({ component: lazyRouteComponent($$splitComponentImporter$56, "component") });
var $$splitComponentImporter$55 = () => import("./gigs-4UyxAoUR.mjs");
var Route$59 = createFileRoute("/gigs")({ component: lazyRouteComponent($$splitComponentImporter$55, "component") });
var $$splitComponentImporter$54 = () => import("./goals-DTaeq2sn.mjs");
var Route$58 = createFileRoute("/goals")({ component: lazyRouteComponent($$splitComponentImporter$54, "component") });
var $$splitComponentImporter$53 = () => import("./guests-CBEGUaqn.mjs");
var Route$57 = createFileRoute("/guests")({ component: lazyRouteComponent($$splitComponentImporter$53, "component") });
var $$splitComponentImporter$52 = () => import("./handoff-C8vZNJ6V.mjs");
var Route$56 = createFileRoute("/handoff")({ component: lazyRouteComponent($$splitComponentImporter$52, "component") });
var $$splitComponentImporter$51 = () => import("./health-DME1CmcX.mjs");
var Route$55 = createFileRoute("/health")({ component: lazyRouteComponent($$splitComponentImporter$51, "component") });
var $$splitComponentImporter$50 = () => import("./home-BTyKrVBr.mjs");
var Route$54 = createFileRoute("/home")({ component: lazyRouteComponent($$splitComponentImporter$50, "component") });
var $$splitComponentImporter$49 = () => import("./import-BnTYgGCo.mjs");
var Route$53 = createFileRoute("/import")({ component: lazyRouteComponent($$splitComponentImporter$49, "component") });
var $$splitComponentImporter$48 = () => import("./inbox-CQJ-L7gk.mjs");
var Route$52 = createFileRoute("/inbox")({ component: lazyRouteComponent($$splitComponentImporter$48, "component") });
var $$splitComponentImporter$47 = () => import("./insights-DxSmHSbb.mjs");
var Route$51 = createFileRoute("/insights")({ component: lazyRouteComponent($$splitComponentImporter$47, "component") });
var $$splitComponentImporter$46 = () => import("./integrations-BQsR8q70.mjs");
var Route$50 = createFileRoute("/integrations")({ component: lazyRouteComponent($$splitComponentImporter$46, "component") });
var $$splitComponentImporter$45 = () => import("./leadbooster-CQbtv8Ly.mjs");
var Route$49 = createFileRoute("/leadbooster")({ component: lazyRouteComponent($$splitComponentImporter$45, "component") });
var $$splitComponentImporter$44 = () => import("./leads-Dnkyr0GG.mjs");
var Route$48 = createFileRoute("/leads")({ component: lazyRouteComponent($$splitComponentImporter$44, "component") });
var $$splitComponentImporter$43 = () => import("./lifecycle-B_PI1RVs.mjs");
var Route$47 = createFileRoute("/lifecycle")({ component: lazyRouteComponent($$splitComponentImporter$43, "component") });
var $$splitComponentImporter$42 = () => import("./login-Dr3mXqIF.mjs");
var Route$46 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$42, "component") });
var $$splitComponentImporter$41 = () => import("./lookup-C7fzDQ5R.mjs");
var Route$45 = createFileRoute("/lookup")({ component: lazyRouteComponent($$splitComponentImporter$41, "component") });
var $$splitComponentImporter$40 = () => import("./mail-Dv9_DlR1.mjs");
var Route$44 = createFileRoute("/mail")({ component: lazyRouteComponent($$splitComponentImporter$40, "component") });
var $$splitComponentImporter$39 = () => import("./marketplace-C76BhkD6.mjs");
var Route$43 = createFileRoute("/marketplace")({ component: lazyRouteComponent($$splitComponentImporter$39, "component") });
var $$splitComponentImporter$38 = () => import("./portal-DxboUBiZ.mjs");
var Route$42 = createFileRoute("/portal")({ component: lazyRouteComponent($$splitComponentImporter$38, "component") });
var $$splitComponentImporter$37 = () => import("./portal-domain-BLM9Ja7d.mjs");
var Route$41 = createFileRoute("/portal-domain")({ component: lazyRouteComponent($$splitComponentImporter$37, "component") });
var $$splitComponentImporter$36 = () => import("./products-DVWUG_02.mjs");
var Route$40 = createFileRoute("/products")({ component: lazyRouteComponent($$splitComponentImporter$36, "component") });
var $$splitComponentImporter$35 = () => import("./profile-D8tPonBJ.mjs");
var Route$39 = createFileRoute("/profile")({ component: lazyRouteComponent($$splitComponentImporter$35, "component") });
var $$splitComponentImporter$34 = () => import("./projects-CP2JltNg.mjs");
var Route$38 = createFileRoute("/projects")({ component: lazyRouteComponent($$splitComponentImporter$34, "component") });
var $$splitComponentImporter$33 = () => import("./proposals-tWjp5vwI.mjs");
var Route$37 = createFileRoute("/proposals")({ component: lazyRouteComponent($$splitComponentImporter$33, "component") });
var $$splitComponentImporter$32 = () => import("./prospector-B7lIrnvN.mjs");
var Route$36 = createFileRoute("/prospector")({ component: lazyRouteComponent($$splitComponentImporter$32, "component") });
var $$splitComponentImporter$31 = () => import("./pulse-Bf5-kz-c.mjs");
var Route$35 = createFileRoute("/pulse")({ component: lazyRouteComponent($$splitComponentImporter$31, "component") });
var $$splitComponentImporter$30 = () => import("./quotes-DHIlJA_R.mjs");
var Route$34 = createFileRoute("/quotes")({ component: lazyRouteComponent($$splitComponentImporter$30, "component") });
var $$splitComponentImporter$29 = () => import("./registry-BTK2ufkL.mjs");
var Route$33 = createFileRoute("/registry")({ component: lazyRouteComponent($$splitComponentImporter$29, "component") });
var $$splitComponentImporter$28 = () => import("./request-DK0ZbMLk.mjs");
var Route$32 = createFileRoute("/request")({ component: lazyRouteComponent($$splitComponentImporter$28, "component") });
var $$splitComponentImporter$27 = () => import("./reviews-BCMqE21j.mjs");
var Route$31 = createFileRoute("/reviews")({ component: lazyRouteComponent($$splitComponentImporter$27, "component") });
var $$splitComponentImporter$26 = () => import("./sandbox-DaLX4hMx.mjs");
var Route$30 = createFileRoute("/sandbox")({ component: lazyRouteComponent($$splitComponentImporter$26, "component") });
var $$splitComponentImporter$25 = () => import("./scheduler-DKsRbG_4.mjs");
var Route$29 = createFileRoute("/scheduler")({ component: lazyRouteComponent($$splitComponentImporter$25, "component") });
var $$splitComponentImporter$24 = () => import("./security-DLjPY9zL.mjs");
var Route$28 = createFileRoute("/security")({ component: lazyRouteComponent($$splitComponentImporter$24, "component") });
var $$splitComponentImporter$23 = () => import("./sequences-B9tmLc0r.mjs");
var Route$27 = createFileRoute("/sequences")({ component: lazyRouteComponent($$splitComponentImporter$23, "component") });
var $$splitComponentImporter$22 = () => import("./settings-BxrriONd.mjs");
var Route$26 = createFileRoute("/settings")({ component: lazyRouteComponent($$splitComponentImporter$22, "component") });
var $$splitComponentImporter$21 = () => import("./sms-Bh2Elytu.mjs");
var Route$25 = createFileRoute("/sms")({ component: lazyRouteComponent($$splitComponentImporter$21, "component") });
var $$splitComponentImporter$20 = () => import("./smtp-B8JOXm4c.mjs");
var Route$24 = createFileRoute("/smtp")({ component: lazyRouteComponent($$splitComponentImporter$20, "component") });
var $$splitComponentImporter$19 = () => import("./tasks-zYp7qUFK.mjs");
var Route$23 = createFileRoute("/tasks")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
var $$splitComponentImporter$18 = () => import("./travel-DUDv8YlR.mjs");
var Route$22 = createFileRoute("/travel")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./views-7mBNoRFz.mjs");
var Route$21 = createFileRoute("/views")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./board._token-Nd8hb4jT.mjs");
var Route$20 = createFileRoute("/board/$token")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./book._slug-ClLhj2_m.mjs");
var Route$19 = createFileRoute("/book/$slug")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./c._token-DpDIl5_j.mjs");
var Route$18 = createFileRoute("/c/$token")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var getAiDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f9424817590b6162718b94086864dc52c1526e6708077e8e5bdc1cc79b44b7e2"));
var saveAiProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("f592c9696ffa665245c923cce3daf1e244d9d9fc1dab1e911ad3cb6caea447f5"));
var draftFromDeal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("2fef8db125ebaa4230d127bf2b540ae65167222dbd41ee619e98c903c307e360"));
var sendAiDraft = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("cb51b50486f229a82d04f22edd0ee0a8f819b35ab3e88acb1d062e983cc022f3"));
var runPrepInspector = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("c43a7411e2d3953d82b271249b65a65ffa1cd975b22ace9ced79d472cf37ff86"));
var markFinding = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("bf32439614af746a2e6afcaa92c6dcb52d839d9c4d1c4fe77e30451160eef6fa"));
var widgetAsk = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("e0338cca616598bedafa268a935a92839c70e6b437137f8fae5a86d6f14bc51d"));
var getHealth = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("24b579679a7e5500f1d0d8970c5ca115b27102056fc947eead28e482e4c95d3b"));
var getOpsHome = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f48f224b11a7f56547055ddd9ffe8c12c7f0dc23874b3a9db0e8e8c7f3ae1247"));
var listEventNotes = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("15bb83266e4c061985a40b5cd81055d2f8f56e258b3571456aee5274569b15da"));
var addEventNote = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("708faafe4ad45540cfcde51e56ff04ac37fcf41f6c37bc85f7753cc87ce34a1c"));
var updateEventNote = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("a186eb80185edfade2bc7381bb0688162866691b4ce5a0e19c1e0a1541b4567c"));
var pinNote = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("5425135e17295aa2deb74c401d8e7b9ad8c7a6b7c0f58f2b2246c4644ebc927e"));
var getFinance = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("8c989f1b7cd97de7b88fdf4264a67c06849113e03d9b11b578267eced64f2e3a"));
var createStandaloneInvoice = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("b1f2be161ed8c7ab13324e0970fb0c342131e416ec2b85f7a8bbf0df19156f13"));
var recordPayment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("9d0fce2f12afdac60f70ec1b4f51cb1b4bf1477d3b0f170a8a2b93ef62aa2f9d"));
var getGuests = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input = {}) => input).handler(createSsrRpc("387b6eac553fe59cf7337821d4db1b0b2f715a7e70f8ce5bf169b7803f67156d"));
var setRsvp = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("30ce6010c9246e152fd6f6ba48c520b3ecf456db09a4e8bfc0e12f0de3cf0a0f"));
var getCrew = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("a4bc6143211dd8362b1165b092006e513c34fefc35fa62ff5fe9516d74da63a2"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("7459998e01678afda80b4b84e573f67634474012251460cbf2036f72155a877c"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("aa519d1adba77860c00b704c0bef182ecddf9c19345a4a65dcce980794182c42"));
var getGigs = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("10517c01ebf6ab1f40cdd2b831d641a56a513b85074754476e9e9f9893f0e59d"));
var awardGig = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("6f25ebce14453b450a5a81bffb6156b042419d1113b25af15963af97fde8e492"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("caad77a72c5411e6b26d1b7650c855d558b29c9bf0ca57b3ffeaad9b9d3961aa"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("d7a62694e87bed27ad2b03ecd0b170f3ade626f0f5f8e8229b7ccfa32dc2e38b"));
var getDirectory = createServerFn({ method: "GET" }).handler(createSsrRpc("78fc873733c5f6659ebe51d2fb947c12f07358065686168ba0972f115e4697ed"));
var getBroadcastDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("56c74dced4b12f95a1b594b8ac50abe84441db4f1e62b87b0800bfee7b3df1f5"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("4fef50a5c319285f231e2eee427b1c76880432fb221adc4071394296c554f776"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("517d6a6b5d9c36eb5d59474c96b7064b1710b7ba13060070778ca16c11eeebe5"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("48ac317c961498652af996df99eb88873d68ab0b7c57ec8863f49ef558c29383"));
var getQuotes = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e5a5d8f3d6f1bcab4a2d337185c745bb49021ea474cc47706f1b07462eac7d02"));
var submitQuote = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("6b967c773e91478fc3e26494695a1e18e9638e2680b9b0aa3210835c796771f6"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("bd186e3b3090f29f7d0437aeafa55cb7f2b23ebe495d71beb0592f6060252f13"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("aa93d49b55388ce31e25a544feb93d0b60200395a863ec7eeac31304cd74adb3"));
var webcalBody = async (token) => {
	const sql = await getSql();
	if (token !== "northline" && token !== "nlcal") return null;
	const deals = await sql`select title, venue, event_date from deals where event_date is not null order by event_date`;
	const lines = [
		"BEGIN:VCALENDAR",
		"VERSION:2.0",
		"PRODID:-//Northline//Calendar//EN",
		"X-WR-CALNAME:Northline shows"
	];
	for (const d of deals) {
		const day = String(d.event_date).slice(0, 10).replace(/-/g, "");
		lines.push("BEGIN:VEVENT", `SUMMARY:${String(d.title).replace(/,/g, "\\,")}`, `DTSTART;VALUE=DATE:${day}`, `LOCATION:${String(d.venue ?? "")}`, "END:VEVENT");
	}
	lines.push("END:VCALENDAR");
	return lines.join("\r\n");
};
var getPersonPrefs = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("3478ebbb4a72eaffc6bf80ef949d8ee2f2f494d96822d5389d4128c6383b25f0"));
var setCommPref = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("3096117bd40b954725dca50ef1cc1e8f30f5cb774b124036d62ddaaffecdcecc"));
var getPublicWidget = createServerFn({ method: "GET" }).validator((input = {}) => input).handler(createSsrRpc("9885f8e7bb637a4fac18c569fa8a14b97585be7498d76fa586533d5642c739e4"));
var Route$17 = createFileRoute("/cal/$token")({ server: { handlers: { GET: async ({ params }) => {
	const body = await webcalBody(params.token);
	if (!body) return new Response("Not found", { status: 404 });
	return new Response(body, { headers: {
		"Content-Type": "text/calendar; charset=utf-8",
		"Content-Disposition": "attachment; filename=\"northline.ics\""
	} });
} } } });
var $$splitComponentImporter$13 = () => import("./contacts._personId-D69n_QkI.mjs");
var Route$16 = createFileRoute("/contacts/$personId")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./deals._dealId-CES7iLwS.mjs");
var Route$15 = createFileRoute("/deals/$dealId")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./esign._envelopeId-kMt6uIbS.mjs");
var Route$14 = createFileRoute("/esign/$envelopeId")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./f._slug-dBsGcuI0.mjs");
var Route$13 = createFileRoute("/f/$slug")({
	validateSearch: (s) => ({
		embed: s.embed === "1" || s.embed === true ? true : void 0,
		vendor: typeof s.vendor === "string" ? s.vendor : void 0
	}),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./h._token-B3kXTk3o.mjs");
var Route$12 = createFileRoute("/h/$token")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./orgs._orgId-BA33-c63.mjs");
var Route$11 = createFileRoute("/orgs/$orgId")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./p._token-DUhD4DJ1.mjs");
var Route$10 = createFileRoute("/p/$token")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./projects._projectId-CJkO6h2b.mjs");
var Route$9 = createFileRoute("/projects/$projectId")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./r._token-Do6TDmX1.mjs");
var Route$8 = createFileRoute("/r/$token")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./rsvp._token-CkVFQKEG.mjs");
var Route$7 = createFileRoute("/rsvp/$token")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./sign._docId-wS-8VjTA.mjs");
var Route$6 = createFileRoute("/sign/$docId")({
	component: lazyRouteComponent($$splitComponentImporter$3, "component"),
	validateSearch: (s) => ({ envelope: typeof s.envelope === "string" ? s.envelope : void 0 })
});
var $$splitComponentImporter$2 = () => import("./t._id-4ONezL4L.mjs");
var Route$5 = createFileRoute("/t/$id")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./u._token-DJq3PpWg.mjs");
var Route$4 = createFileRoute("/u/$token")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./w._slug-543eAYyN.mjs");
var Route$3 = createFileRoute("/w/$slug")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route$2 = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth$1.handler(request),
	POST: ({ request }) => auth$1.handler(request)
} } });
var CORS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers": "Authorization, Content-Type, X-Api-Key",
	"Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS"
};
function json(status, body, extra) {
	return new Response(JSON.stringify(body, null, 2), {
		status,
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			...CORS,
			...extra
		}
	});
}
function hasScope(token, need) {
	const set = token.scopes.split(",").map((s) => s.trim());
	if (set.includes("*") || set.includes(need)) return true;
	const [res, verb] = need.split(":");
	if (verb === "read" && set.includes(`${res}:write`)) return true;
	if (need.startsWith("events:") && set.includes(`deals:${verb}`)) return true;
	if (need.startsWith("clients:") && (set.includes(`orgs:${verb}`) || set.includes(`people:${verb}`))) return true;
	if (need === "people:read" && (set.includes("clients:read") || set.includes("clients:write"))) return true;
	return false;
}
async function auth(request) {
	const header = request.headers.get("authorization") ?? "";
	const key = (header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "") || request.headers.get("x-api-key")?.trim() || "";
	if (!key) return json(401, { error: {
		code: "unauthorized",
		message: "Bearer token or X-Api-Key required."
	} });
	const sql = await getSql();
	const hash = hashSha(key);
	const row = (await sql.query(`select id, name, scopes, revoked from api_tokens where token_hash = $1 limit 1`, [hash]))[0];
	if (!row || Boolean(row.revoked)) return json(401, { error: {
		code: "unauthorized",
		message: "Unknown or revoked API key."
	} });
	await sql.query(`update api_tokens set last_used = now() where id = $1`, [Number(row.id)]);
	return { token: {
		id: Number(row.id),
		name: String(row.name),
		scopes: String(row.scopes)
	} };
}
function mapEvent(r) {
	return {
		id: Number(r.id),
		title: String(r.title),
		value: money(r.value),
		status: String(r.status),
		stage: r.stage_name == null ? null : String(r.stage_name),
		venue: r.venue == null ? null : String(r.venue),
		event_date: iso(r.event_date)?.slice(0, 10) ?? null,
		event_type: r.event_type == null ? null : String(r.event_type),
		source: r.source == null ? null : String(r.source),
		lost_reason: r.lost_reason == null ? null : String(r.lost_reason),
		load_in: r.load_in == null ? null : String(r.load_in),
		guest_count: r.guest_count == null ? null : Number(r.guest_count),
		client: r.org_id == null ? null : {
			id: Number(r.org_id),
			name: String(r.org_name ?? "")
		},
		owner: r.owner_id == null ? null : {
			id: Number(r.owner_id),
			name: String(r.owner_name ?? "")
		},
		created_at: iso(r.created_at),
		updated_at: iso(r.updated_at)
	};
}
function mapClient(r) {
	return {
		id: Number(r.id),
		name: String(r.name),
		website: r.website == null ? null : String(r.website),
		city: r.city == null ? null : String(r.city),
		industry: r.industry == null ? null : String(r.industry),
		phone: r.phone == null ? null : String(r.phone),
		address: r.address == null ? null : String(r.address)
	};
}
function mapPerson(r) {
	return {
		id: Number(r.id),
		name: String(r.name),
		email: r.email == null ? null : String(r.email),
		phone: r.phone == null ? null : String(r.phone),
		title: r.title == null ? null : String(r.title),
		org: r.org_name == null ? null : {
			id: Number(r.org_id),
			name: String(r.org_name)
		}
	};
}
function openApi() {
	const paths = {};
	for (const e of REST_ENDPOINTS) {
		const path = e.path.replace("/api/v1", "") || "/";
		const item = paths[path] ?? {};
		item[e.method.toLowerCase()] = {
			summary: e.summary,
			security: e.public ? [] : [{ bearerAuth: [] }],
			"x-scopes": e.scope ? [e.scope] : []
		};
		paths[path] = item;
	}
	return {
		openapi: "3.0.3",
		info: {
			title: "Northline API",
			version: "1.0.0",
			description: "Live-event CRM REST for Zapier, scripts, and webhooks."
		},
		servers: [{ url: "/api/v1" }],
		components: { securitySchemes: { bearerAuth: {
			type: "http",
			scheme: "bearer"
		} } },
		paths
	};
}
async function fireWebhooks(event, data) {
	const sql = await getSql();
	const hooks = await sql.query(`select * from webhooks where active = true and event = $1`, [event]);
	const envelope = {
		id: `evt_${Date.now().toString(36)}`,
		event,
		created_at: (/* @__PURE__ */ new Date()).toISOString(),
		data
	};
	const payload = JSON.stringify(envelope);
	for (const h of hooks) {
		await sql.query(`insert into webhook_deliveries (webhook_id, event, payload, status_code, ok) values ($1,$2,$3,200,true)`, [
			Number(h.id),
			event,
			payload
		]);
		await sql.query(`update webhooks set last_status = $1 where id = $2`, [`200 · just now`, Number(h.id)]);
	}
	return envelope;
}
async function readBody(request) {
	const text = await request.text();
	if (!text) return {};
	try {
		return JSON.parse(text);
	} catch {
		return {};
	}
}
async function handleRest(request) {
	if (request.method === "OPTIONS") return new Response(null, {
		status: 204,
		headers: CORS
	});
	const url = new URL(request.url);
	const rel = url.pathname.replace(/^\/api\/v1\/?/, "");
	const parts = rel.split("/").filter(Boolean);
	const method = request.method.toUpperCase();
	if (method === "GET" && parts.length === 0) return json(200, {
		name: "Northline API",
		version: "1.0",
		auth: "Bearer nl_live_… or X-Api-Key",
		docs: "/developers",
		openapi: "/api/v1/openapi.json",
		endpoints: REST_ENDPOINTS
	});
	if (method === "GET" && parts[0] === "openapi.json") return json(200, openApi());
	const authed = await auth(request);
	if (authed instanceof Response) return authed;
	const { token } = authed;
	const sql = await getSql();
	const limit = Math.min(100, Number(url.searchParams.get("limit") ?? 50) || 50);
	const need = (scope) => {
		if (!hasScope(token, scope)) return json(403, { error: {
			code: "forbidden",
			message: `Missing scope ${scope}`
		} });
		return null;
	};
	try {
		if (parts[0] === "events" && method === "GET" && parts.length === 1) {
			const denied = need("events:read");
			if (denied) return denied;
			const rows = await sql.query(`select d.*, s.name as stage_name, o.name as org_name, m.name as owner_name
         from deals d
         left join stages s on s.id = d.stage_id
         left join organizations o on o.id = d.org_id
         left join members m on m.id = d.owner_id
         where d.event_date is not null or d.venue is not null
         order by d.event_date nulls last, d.id desc
         limit $1`, [limit]);
			return json(200, {
				data: rows.map(mapEvent),
				meta: { count: rows.length }
			});
		}
		if (parts[0] === "events" && method === "GET" && parts[1]) {
			const denied = need("events:read");
			if (denied) return denied;
			const rows = await sql.query(`select d.*, s.name as stage_name, o.name as org_name, m.name as owner_name
         from deals d
         left join stages s on s.id = d.stage_id
         left join organizations o on o.id = d.org_id
         left join members m on m.id = d.owner_id
         where d.id = $1`, [Number(parts[1])]);
			if (!rows[0]) return json(404, { error: {
				code: "not_found",
				message: "Event not found"
			} });
			return json(200, { data: mapEvent(rows[0]) });
		}
		if (parts[0] === "events" && method === "POST") {
			const denied = need("events:write");
			if (denied) return denied;
			const body = await readBody(request);
			const title = String(body.title ?? "Untitled show");
			const value = Number(body.value ?? 0);
			const venue = body.venue == null ? null : String(body.venue);
			const eventDate = body.event_date == null ? null : String(body.event_date);
			const stage = (await sql`select id from stages where pipeline_id = 1 order by sort_order limit 1`)[0];
			const ins = await sql.query(`insert into deals (title, value, pipeline_id, stage_id, venue, event_date, source, status)
         values ($1,$2,1,$3,$4,$5,'API','open') returning id`, [
				title,
				value,
				Number(stage?.id ?? 1),
				venue,
				eventDate
			]);
			const id = Number(ins[0].id);
			const row = (await sql.query(`select d.*, s.name as stage_name, o.name as org_name, m.name as owner_name from deals d
           left join stages s on s.id = d.stage_id left join organizations o on o.id = d.org_id
           left join members m on m.id = d.owner_id where d.id = $1`, [id]))[0];
			const data = mapEvent(row);
			await fireWebhooks("deal.created", data);
			return json(201, { data });
		}
		if (parts[0] === "clients" && method === "GET" && parts.length === 1) {
			const denied = need("clients:read");
			if (denied) return denied;
			const rows = await sql.query(`select * from organizations order by name limit $1`, [limit]);
			return json(200, {
				data: rows.map(mapClient),
				meta: { count: rows.length }
			});
		}
		if (parts[0] === "clients" && method === "GET" && parts[1]) {
			const denied = need("clients:read");
			if (denied) return denied;
			const org = (await sql.query(`select * from organizations where id = $1`, [Number(parts[1])]))[0];
			if (!org) return json(404, { error: {
				code: "not_found",
				message: "Client not found"
			} });
			const people = await sql.query(`select p.*, o.name as org_name from people p left join organizations o on o.id = p.org_id where p.org_id = $1`, [Number(parts[1])]);
			return json(200, { data: {
				...mapClient(org),
				people: people.map(mapPerson)
			} });
		}
		if (parts[0] === "clients" && method === "POST") {
			const denied = need("clients:write");
			if (denied) return denied;
			const body = await readBody(request);
			const data = mapClient((await sql.query(`insert into organizations (name, website, city, industry, phone) values ($1,$2,$3,$4,$5) returning *`, [
				String(body.name ?? "Untitled"),
				body.website ?? null,
				body.city ?? null,
				body.industry ?? null,
				body.phone ?? null
			]))[0]);
			await fireWebhooks("client.created", data);
			return json(201, { data });
		}
		if (parts[0] === "people" && method === "GET") {
			const denied = need("people:read");
			if (denied) return denied;
			const rows = await sql.query(`select p.*, o.name as org_name from people p left join organizations o on o.id = p.org_id order by p.name limit $1`, [limit]);
			return json(200, {
				data: rows.map(mapPerson),
				meta: { count: rows.length }
			});
		}
		if (parts[0] === "deals" && method === "GET" && parts.length === 1) {
			const denied = need("deals:read");
			if (denied) return denied;
			const rows = await sql.query(`select d.*, s.name as stage_name, o.name as org_name, m.name as owner_name
         from deals d
         left join stages s on s.id = d.stage_id
         left join organizations o on o.id = d.org_id
         left join members m on m.id = d.owner_id
         order by d.updated_at desc limit $1`, [limit]);
			return json(200, {
				data: rows.map(mapEvent),
				meta: { count: rows.length }
			});
		}
		if (parts[0] === "deals" && method === "GET" && parts[1]) {
			const denied = need("deals:read");
			if (denied) return denied;
			const rows = await sql.query(`select d.*, s.name as stage_name, o.name as org_name, m.name as owner_name
         from deals d left join stages s on s.id = d.stage_id left join organizations o on o.id = d.org_id
         left join members m on m.id = d.owner_id where d.id = $1`, [Number(parts[1])]);
			if (!rows[0]) return json(404, { error: {
				code: "not_found",
				message: "Deal not found"
			} });
			return json(200, { data: mapEvent(rows[0]) });
		}
		if (parts[0] === "deals" && method === "POST") {
			const denied = need("deals:write");
			if (denied) return denied;
			const body = await readBody(request);
			const stage = (await sql`select id from stages where pipeline_id = 1 order by sort_order limit 1`)[0];
			const ins = await sql.query(`insert into deals (title, value, pipeline_id, stage_id, venue, source, status)
         values ($1,$2,1,$3,$4,'API','open') returning id`, [
				String(body.title ?? "Untitled"),
				Number(body.value ?? 0),
				Number(stage?.id ?? 1),
				body.venue ?? null
			]);
			const id = Number(ins[0].id);
			const row = (await sql.query(`select d.*, s.name as stage_name, o.name as org_name, m.name as owner_name from deals d
           left join stages s on s.id = d.stage_id left join organizations o on o.id = d.org_id
           left join members m on m.id = d.owner_id where d.id = $1`, [id]))[0];
			const data = mapEvent(row);
			await fireWebhooks("deal.created", data);
			return json(201, { data });
		}
		if (parts[0] === "deals" && method === "PATCH" && parts[1]) {
			const denied = need("deals:write");
			if (denied) return denied;
			const body = await readBody(request);
			const id = Number(parts[1]);
			const cur = (await sql.query(`select * from deals where id = $1`, [id]))[0];
			if (!cur) return json(404, { error: {
				code: "not_found",
				message: "Deal not found"
			} });
			const title = body.title == null ? String(cur.title) : String(body.title);
			const value = body.value == null ? money(cur.value) : Number(body.value);
			const status = body.status == null ? String(cur.status) : String(body.status);
			const venue = body.venue == null ? cur.venue : String(body.venue);
			await sql.query(`update deals set title = $1, value = $2, status = $3, venue = $4, updated_at = now() where id = $5`, [
				title,
				value,
				status,
				venue,
				id
			]);
			const row = (await sql.query(`select d.*, s.name as stage_name, o.name as org_name, m.name as owner_name from deals d
           left join stages s on s.id = d.stage_id left join organizations o on o.id = d.org_id
           left join members m on m.id = d.owner_id where d.id = $1`, [id]))[0];
			const data = mapEvent(row);
			await fireWebhooks("deal.updated", data);
			if (status === "won" && String(cur.status) !== "won") await fireWebhooks("deal.won", data);
			if (status === "lost" && String(cur.status) !== "lost") await fireWebhooks("deal.lost", data);
			if (status === "cancelled" && String(cur.status) !== "cancelled") await fireWebhooks("deal.cancelled", data);
			return json(200, { data });
		}
		if (parts[0] === "activities" && method === "GET") {
			const denied = need("activities:read");
			if (denied) return denied;
			const rows = await sql.query(`select a.id, a.type, a.subject, a.due_at, a.done, a.duration_min, d.title as deal_title
         from activities a left join deals d on d.id = a.deal_id
         order by a.due_at nulls last limit $1`, [limit]);
			return json(200, {
				data: rows.map((r) => ({
					id: Number(r.id),
					type: String(r.type),
					subject: String(r.subject),
					due_at: iso(r.due_at),
					done: Boolean(r.done),
					duration_min: r.duration_min == null ? null : Number(r.duration_min),
					deal: r.deal_title == null ? null : String(r.deal_title)
				})),
				meta: { count: rows.length }
			});
		}
		if (parts[0] === "webhooks" && method === "GET" && parts.length === 1) {
			const denied = need("webhooks");
			if (denied) return denied;
			return json(200, { data: (await sql`select * from webhooks order by id`).map((w) => ({
				id: Number(w.id),
				url: String(w.url),
				event: String(w.event),
				active: Boolean(w.active),
				last_status: w.last_status == null ? null : String(w.last_status),
				secret: w.secret == null ? null : `${String(w.secret).slice(0, 10)}…`
			})) });
		}
		if (parts[0] === "webhooks" && method === "POST" && parts.length === 1) {
			const denied = need("webhooks");
			if (denied) return denied;
			const body = await readBody(request);
			const secret = `whsec_nl_${Math.random().toString(36).slice(2, 10)}`;
			const ins = await sql.query(`insert into webhooks (url, event, active, secret, description, last_status) values ($1,$2,true,$3,$4,'waiting') returning *`, [
				String(body.url ?? ""),
				String(body.event ?? "deal.updated"),
				secret,
				body.description ?? null
			]);
			return json(201, { data: {
				id: Number(ins[0].id),
				url: String(ins[0].url),
				event: String(ins[0].event),
				secret
			} });
		}
		if (parts[0] === "webhooks" && parts[2] === "test" && method === "POST") {
			const denied = need("webhooks");
			if (denied) return denied;
			const hook = (await sql.query(`select * from webhooks where id = $1`, [Number(parts[1])]))[0];
			if (!hook) return json(404, { error: {
				code: "not_found",
				message: "Webhook not found"
			} });
			const sample = WEBHOOK_EVENTS.find((e) => e.event === String(hook.event)) ?? WEBHOOK_EVENTS[0];
			return json(200, { data: {
				delivered: true,
				payload: await fireWebhooks(String(hook.event), sample.payload.data)
			} });
		}
		if (parts[0] === "webhooks" && method === "DELETE" && parts[1]) {
			const denied = need("webhooks");
			if (denied) return denied;
			await sql.query(`update webhooks set active = false where id = $1`, [Number(parts[1])]);
			return json(200, { data: { revoked: true } });
		}
		return json(404, { error: {
			code: "not_found",
			message: `No route for ${method} /api/v1/${rel}`
		} });
	} catch (err) {
		return json(500, { error: {
			code: "server_error",
			message: err instanceof Error ? err.message : "Server error"
		} });
	}
}
var Route$1 = createFileRoute("/api/v1/")({ server: { handlers: {
	GET: ({ request }) => handleRest(request),
	POST: ({ request }) => handleRest(request),
	PATCH: ({ request }) => handleRest(request),
	DELETE: ({ request }) => handleRest(request),
	OPTIONS: ({ request }) => handleRest(request)
} } });
var Route = createFileRoute("/api/v1/$")({ server: { handlers: {
	GET: ({ request }) => handleRest(request),
	POST: ({ request }) => handleRest(request),
	PATCH: ({ request }) => handleRest(request),
	DELETE: ({ request }) => handleRest(request),
	OPTIONS: ({ request }) => handleRest(request)
} } });
var IndexRoute = Route$85.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$86
});
var ActivitiesRoute = Route$84.update({
	id: "/activities",
	path: "/activities",
	getParentRoute: () => Route$86
});
var AdminRoute = Route$83.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$86
});
var AiRoute = Route$82.update({
	id: "/ai",
	path: "/ai",
	getParentRoute: () => Route$86
});
var ApprovalsRoute = Route$81.update({
	id: "/approvals",
	path: "/approvals",
	getParentRoute: () => Route$86
});
var AutomationsRoute = Route$80.update({
	id: "/automations",
	path: "/automations",
	getParentRoute: () => Route$86
});
var BoardsRoute = Route$79.update({
	id: "/boards",
	path: "/boards",
	getParentRoute: () => Route$86
});
var BookmarksRoute = Route$78.update({
	id: "/bookmarks",
	path: "/bookmarks",
	getParentRoute: () => Route$86
});
var BroadcastsRoute = Route$77.update({
	id: "/broadcasts",
	path: "/broadcasts",
	getParentRoute: () => Route$86
});
var ChatbotRoute = Route$76.update({
	id: "/chatbot",
	path: "/chatbot",
	getParentRoute: () => Route$86
});
var ClientPortalRoute = Route$75.update({
	id: "/client-portal",
	path: "/client-portal",
	getParentRoute: () => Route$86
});
var ColdRoute = Route$74.update({
	id: "/cold",
	path: "/cold",
	getParentRoute: () => Route$86
});
var ContactRoute = Route$73.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$86
});
var ContactsRoute = Route$72.update({
	id: "/contacts",
	path: "/contacts",
	getParentRoute: () => Route$86
});
var CrewRoute = Route$71.update({
	id: "/crew",
	path: "/crew",
	getParentRoute: () => Route$86
});
var DevelopersRoute = Route$70.update({
	id: "/developers",
	path: "/developers",
	getParentRoute: () => Route$86
});
var DiscoverRoute = Route$69.update({
	id: "/discover",
	path: "/discover",
	getParentRoute: () => Route$86
});
var DocumentsRoute = Route$68.update({
	id: "/documents",
	path: "/documents",
	getParentRoute: () => Route$86
});
var DomainRoute = Route$67.update({
	id: "/domain",
	path: "/domain",
	getParentRoute: () => Route$86
});
var EsignRoute = Route$66.update({
	id: "/esign",
	path: "/esign",
	getParentRoute: () => Route$86
});
var FilesRoute = Route$65.update({
	id: "/files",
	path: "/files",
	getParentRoute: () => Route$86
});
var FinanceRoute = Route$64.update({
	id: "/finance",
	path: "/finance",
	getParentRoute: () => Route$86
});
var FloorplansRoute = Route$63.update({
	id: "/floorplans",
	path: "/floorplans",
	getParentRoute: () => Route$86
});
var ForecastRoute = Route$62.update({
	id: "/forecast",
	path: "/forecast",
	getParentRoute: () => Route$86
});
var ForgotRoute = Route$61.update({
	id: "/forgot",
	path: "/forgot",
	getParentRoute: () => Route$86
});
var FormsRoute = Route$60.update({
	id: "/forms",
	path: "/forms",
	getParentRoute: () => Route$86
});
var GigsRoute = Route$59.update({
	id: "/gigs",
	path: "/gigs",
	getParentRoute: () => Route$86
});
var GoalsRoute = Route$58.update({
	id: "/goals",
	path: "/goals",
	getParentRoute: () => Route$86
});
var GuestsRoute = Route$57.update({
	id: "/guests",
	path: "/guests",
	getParentRoute: () => Route$86
});
var HandoffRoute = Route$56.update({
	id: "/handoff",
	path: "/handoff",
	getParentRoute: () => Route$86
});
var HealthRoute = Route$55.update({
	id: "/health",
	path: "/health",
	getParentRoute: () => Route$86
});
var HomeRoute = Route$54.update({
	id: "/home",
	path: "/home",
	getParentRoute: () => Route$86
});
var ImportRoute = Route$53.update({
	id: "/import",
	path: "/import",
	getParentRoute: () => Route$86
});
var InboxRoute = Route$52.update({
	id: "/inbox",
	path: "/inbox",
	getParentRoute: () => Route$86
});
var InsightsRoute = Route$51.update({
	id: "/insights",
	path: "/insights",
	getParentRoute: () => Route$86
});
var IntegrationsRoute = Route$50.update({
	id: "/integrations",
	path: "/integrations",
	getParentRoute: () => Route$86
});
var LeadboosterRoute = Route$49.update({
	id: "/leadbooster",
	path: "/leadbooster",
	getParentRoute: () => Route$86
});
var LeadsRoute = Route$48.update({
	id: "/leads",
	path: "/leads",
	getParentRoute: () => Route$86
});
var LifecycleRoute = Route$47.update({
	id: "/lifecycle",
	path: "/lifecycle",
	getParentRoute: () => Route$86
});
var LoginRoute = Route$46.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$86
});
var LookupRoute = Route$45.update({
	id: "/lookup",
	path: "/lookup",
	getParentRoute: () => Route$86
});
var MailRoute = Route$44.update({
	id: "/mail",
	path: "/mail",
	getParentRoute: () => Route$86
});
var MarketplaceRoute = Route$43.update({
	id: "/marketplace",
	path: "/marketplace",
	getParentRoute: () => Route$86
});
var PortalRoute = Route$42.update({
	id: "/portal",
	path: "/portal",
	getParentRoute: () => Route$86
});
var PortalDomainRoute = Route$41.update({
	id: "/portal-domain",
	path: "/portal-domain",
	getParentRoute: () => Route$86
});
var ProductsRoute = Route$40.update({
	id: "/products",
	path: "/products",
	getParentRoute: () => Route$86
});
var ProfileRoute = Route$39.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => Route$86
});
var ProjectsRoute = Route$38.update({
	id: "/projects",
	path: "/projects",
	getParentRoute: () => Route$86
});
var ProposalsRoute = Route$37.update({
	id: "/proposals",
	path: "/proposals",
	getParentRoute: () => Route$86
});
var ProspectorRoute = Route$36.update({
	id: "/prospector",
	path: "/prospector",
	getParentRoute: () => Route$86
});
var PulseRoute = Route$35.update({
	id: "/pulse",
	path: "/pulse",
	getParentRoute: () => Route$86
});
var QuotesRoute = Route$34.update({
	id: "/quotes",
	path: "/quotes",
	getParentRoute: () => Route$86
});
var RegistryRoute = Route$33.update({
	id: "/registry",
	path: "/registry",
	getParentRoute: () => Route$86
});
var RequestRoute = Route$32.update({
	id: "/request",
	path: "/request",
	getParentRoute: () => Route$86
});
var ReviewsRoute = Route$31.update({
	id: "/reviews",
	path: "/reviews",
	getParentRoute: () => Route$86
});
var SandboxRoute = Route$30.update({
	id: "/sandbox",
	path: "/sandbox",
	getParentRoute: () => Route$86
});
var SchedulerRoute = Route$29.update({
	id: "/scheduler",
	path: "/scheduler",
	getParentRoute: () => Route$86
});
var SecurityRoute = Route$28.update({
	id: "/security",
	path: "/security",
	getParentRoute: () => Route$86
});
var SequencesRoute = Route$27.update({
	id: "/sequences",
	path: "/sequences",
	getParentRoute: () => Route$86
});
var SettingsRoute = Route$26.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => Route$86
});
var SmsRoute = Route$25.update({
	id: "/sms",
	path: "/sms",
	getParentRoute: () => Route$86
});
var SmtpRoute = Route$24.update({
	id: "/smtp",
	path: "/smtp",
	getParentRoute: () => Route$86
});
var TasksRoute = Route$23.update({
	id: "/tasks",
	path: "/tasks",
	getParentRoute: () => Route$86
});
var TravelRoute = Route$22.update({
	id: "/travel",
	path: "/travel",
	getParentRoute: () => Route$86
});
var ViewsRoute = Route$21.update({
	id: "/views",
	path: "/views",
	getParentRoute: () => Route$86
});
var BoardTokenRoute = Route$20.update({
	id: "/board/$token",
	path: "/board/$token",
	getParentRoute: () => Route$86
});
var BookSlugRoute = Route$19.update({
	id: "/book/$slug",
	path: "/book/$slug",
	getParentRoute: () => Route$86
});
var CTokenRoute = Route$18.update({
	id: "/c/$token",
	path: "/c/$token",
	getParentRoute: () => Route$86
});
var CalTokenRoute = Route$17.update({
	id: "/cal/$token",
	path: "/cal/$token",
	getParentRoute: () => Route$86
});
var ContactsPersonIdRoute = Route$16.update({
	id: "/$personId",
	path: "/$personId",
	getParentRoute: () => ContactsRoute
});
var DealsDealIdRoute = Route$15.update({
	id: "/deals/$dealId",
	path: "/deals/$dealId",
	getParentRoute: () => Route$86
});
var EsignEnvelopeIdRoute = Route$14.update({
	id: "/$envelopeId",
	path: "/$envelopeId",
	getParentRoute: () => EsignRoute
});
var FSlugRoute = Route$13.update({
	id: "/f/$slug",
	path: "/f/$slug",
	getParentRoute: () => Route$86
});
var HTokenRoute = Route$12.update({
	id: "/h/$token",
	path: "/h/$token",
	getParentRoute: () => Route$86
});
var OrgsOrgIdRoute = Route$11.update({
	id: "/orgs/$orgId",
	path: "/orgs/$orgId",
	getParentRoute: () => Route$86
});
var PTokenRoute = Route$10.update({
	id: "/p/$token",
	path: "/p/$token",
	getParentRoute: () => Route$86
});
var ProjectsProjectIdRoute = Route$9.update({
	id: "/$projectId",
	path: "/$projectId",
	getParentRoute: () => ProjectsRoute
});
var RTokenRoute = Route$8.update({
	id: "/r/$token",
	path: "/r/$token",
	getParentRoute: () => Route$86
});
var RsvpTokenRoute = Route$7.update({
	id: "/rsvp/$token",
	path: "/rsvp/$token",
	getParentRoute: () => Route$86
});
var SignDocIdRoute = Route$6.update({
	id: "/sign/$docId",
	path: "/sign/$docId",
	getParentRoute: () => Route$86
});
var TIdRoute = Route$5.update({
	id: "/t/$id",
	path: "/t/$id",
	getParentRoute: () => Route$86
});
var UTokenRoute = Route$4.update({
	id: "/u/$token",
	path: "/u/$token",
	getParentRoute: () => Route$86
});
var WSlugRoute = Route$3.update({
	id: "/w/$slug",
	path: "/w/$slug",
	getParentRoute: () => Route$86
});
var ApiAuthSplatRoute = Route$2.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$86
});
var ApiV1IndexRoute = Route$1.update({
	id: "/api/v1/",
	path: "/api/v1/",
	getParentRoute: () => Route$86
});
var ApiV1SplatRoute = Route.update({
	id: "/api/v1/$",
	path: "/api/v1/$",
	getParentRoute: () => Route$86
});
var ContactsRouteChildren = { ContactsPersonIdRoute };
var ContactsRouteWithChildren = ContactsRoute._addFileChildren(ContactsRouteChildren);
var EsignRouteChildren = { EsignEnvelopeIdRoute };
var EsignRouteWithChildren = EsignRoute._addFileChildren(EsignRouteChildren);
var ProjectsRouteChildren = { ProjectsProjectIdRoute };
var rootRouteChildren = {
	IndexRoute,
	ActivitiesRoute,
	AdminRoute,
	AiRoute,
	ApprovalsRoute,
	AutomationsRoute,
	BoardsRoute,
	BookmarksRoute,
	BroadcastsRoute,
	ChatbotRoute,
	ClientPortalRoute,
	ColdRoute,
	ContactRoute,
	ContactsRoute: ContactsRouteWithChildren,
	CrewRoute,
	DevelopersRoute,
	DiscoverRoute,
	DocumentsRoute,
	DomainRoute,
	EsignRoute: EsignRouteWithChildren,
	FilesRoute,
	FinanceRoute,
	FloorplansRoute,
	ForecastRoute,
	ForgotRoute,
	FormsRoute,
	GigsRoute,
	GoalsRoute,
	GuestsRoute,
	HandoffRoute,
	HealthRoute,
	HomeRoute,
	ImportRoute,
	InboxRoute,
	InsightsRoute,
	IntegrationsRoute,
	LeadboosterRoute,
	LeadsRoute,
	LifecycleRoute,
	LoginRoute,
	LookupRoute,
	MailRoute,
	MarketplaceRoute,
	PortalRoute,
	PortalDomainRoute,
	ProductsRoute,
	ProfileRoute,
	ProjectsRoute: ProjectsRoute._addFileChildren(ProjectsRouteChildren),
	ProposalsRoute,
	ProspectorRoute,
	PulseRoute,
	QuotesRoute,
	RegistryRoute,
	RequestRoute,
	ReviewsRoute,
	SandboxRoute,
	SchedulerRoute,
	SecurityRoute,
	SequencesRoute,
	SettingsRoute,
	SmsRoute,
	SmtpRoute,
	TasksRoute,
	TravelRoute,
	ViewsRoute,
	BoardTokenRoute,
	BookSlugRoute,
	CTokenRoute,
	CalTokenRoute,
	DealsDealIdRoute,
	FSlugRoute,
	HTokenRoute,
	OrgsOrgIdRoute,
	PTokenRoute,
	RTokenRoute,
	RsvpTokenRoute,
	SignDocIdRoute,
	TIdRoute,
	UTokenRoute,
	WSlugRoute,
	ApiAuthSplatRoute,
	ApiV1SplatRoute,
	ApiV1IndexRoute
};
var routeTree = Route$86._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { TabsList as $, toggleActivity as $n, submitContact as $t, getPublicWidget as A, listActivities as An, issueOtp as At, setRsvp as B, listProducts as Bn, listSubusers as Bt, getDirectory as C, exportDealsCsv as Cn, getEnvelope as Ct, getHealth as D, getProject as Dn, getPortalProject as Dt, getGuests as E, getInsights as En, getPortalMe as Et, recordPayment as F, listFields as Fn, listEventRequests as Ft, Route$19 as G, listSequences as Gn, mutateTask as Gt, updateEventNote as H, listReports as Hn, listTenants as Ht, runPrepInspector as I, listLeads as In, listNotifPrefs as It, PageHeader as J, moveDeal as Jn, saveBranding as Jt, Route$20 as K, listTemplates as Kn, remindEnvelope as Kt, saveAiProfile as L, listMarketplace as Ln, listPortalFiles as Lt, listEventNotes as M, listDeals as Mn, listAudit as Mt, markFinding as N, listDocuments as Nn, listBookmarks as Nt, getOpsHome as O, getPulse as On, getProposalPublic as Ot, pinNote as P, listEmails as Pn, listEnvelopes as Pt, TabsContent as Q, setDealStatus as Qn, signEnvelope as Qt, sendAiDraft as R, listOrgs as Rn, listPortalProjects as Rt, getCrew as S, createReport as Sn, getDashboard as St, getGigs as T, getDeal as Tn, getEsignMonitor as Tt, widgetAsk as U, listScheduler as Un, lookupDocument as Ut, submitQuote as V, listProspects as Vn, listTaskLists as Vt, Route$18 as W, listScores as Wn, mutateBookmark as Wt, useCurrentUserState as X, resolveAlert as Xn, setTenantQuota as Xt, HpMark as Y, moveTask as Yn, setNotifPref as Yt, Tabs as Z, sendEmail as Zn, sharePortalFile as Zt, awardGig as _, createActivity as _n, createEnvelope as _t, Route$6 as a, updatePortalProfile as an, updateLead as ar, SelectValue as at, getAiDesk as b, createField as bn, downloadPortalFile as bt, Route$9 as c, zipPortalFiles as cn, THEME_SWATCHES as cr, Input as ct, Route$12 as d, addFileMeta as dn, getLifecycleDesk as dr, addEnvelopeField as dt, submitEventRequest as en, toggleApp as er, TabsTrigger as et, Route$13 as f, addProspect as fn, useUi as fr, addProjectRequest as ft, addEventNote as g, convertLead as gn, createApproval as gt, Route$16 as h, bookSlot as hn, convertDealToProject as ht, Route$5 as i, updateEnvelopeStatus as in, updateDeal as ir, SelectTrigger as it, getQuotes as j, listAutomations as jn, listApprovals as jt, getPersonPrefs as k, getSecurity as kn, inviteSubuser as kt, Route$10 as l, addComment as ln, DISQUALIFY_REASONS as lr, Button as lt, Route$15 as m, advanceDocument as mn, completeOnboardingStep as mt, Route$3 as n, syncPipedrive as nn, toggleRule as nr, SelectContent as nt, Route$7 as o, uploadPortalFile as on, updateStage as or, Textarea as ot, Route$14 as p, addTask as pn, checkEmailGate as pt, Route$85 as q, mergePeople as qn, resetPasswordWithOtp as qt, Route$4 as r, toggleProjectNote as rn, toggleSequence as rr, SelectItem as rt, Route$8 as s, verifyOtp as sn, THEME_OPTIONS as sr, Label as st, router_exports as t, switchTenant as tn, toggleAutomation as tr, Select as tt, Route$11 as u, addDealProduct as un, LEAD_STAGES as ur, MemberAvatar as ut, createStandaloneInvoice as v, createAutomation as vn, createProposal as vt, getFinance as w, getBootstrap as wn, getEnvelopePublic as wt, getBroadcastDesk as x, createProduct as xn, getBranding as xt, draftFromDeal as y, createDocument as yn, decideApproval as yt, setCommPref as z, listPeople as zn, listProposals as zt };
