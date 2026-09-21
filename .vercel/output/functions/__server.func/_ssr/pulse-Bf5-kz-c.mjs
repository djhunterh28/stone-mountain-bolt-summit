import { a as formatDateTime } from "./utils-BjcRTCQS.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { Dt as AtSign, d as TriangleAlert, dt as Clock, it as Flame } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { J as PageHeader, On as getPulse } from "./router-o_A6MRMh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pulse-Bf5-kz-c.js
var import_jsx_runtime = require_jsx_runtime();
var ICON = {
	rot: Flame,
	overdue: Clock,
	mention: AtSign,
	won: TriangleAlert,
	lead: TriangleAlert
};
function PulsePage() {
	const pulse = useQuery({
		queryKey: ["pulse"],
		queryFn: () => getPulse()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Pulse",
		subtitle: "Rotting shows, overdue site walks, and mentions — the toolkit that keeps the floor moving."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
		className: "divide-y divide-border border-t border-border",
		children: [(pulse.data ?? []).map((item) => {
			const Icon = ICON[item.kind];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.href.startsWith("/deals/") ? "/deals/$dealId" : item.href.split("?")[0],
				params: item.href.match(/\/deals\/(\d+)/) ? { dealId: item.href.match(/\/deals\/(\d+)/)[1] } : void 0,
				className: "flex gap-3 px-4 py-3 hover:bg-accent/40 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "mt-0.5 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium",
						children: item.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: item.body
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[11px] text-muted-foreground",
						children: formatDateTime(item.at)
					})
				] })]
			}) }, item.id);
		}), (pulse.data ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "px-6 py-12 text-sm text-muted-foreground",
			children: "Nothing rotting. Enjoy it while it lasts."
		})]
	})] });
}
//#endregion
export { PulsePage as component };
