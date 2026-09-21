import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { J as PageHeader, Ln as listMarketplace, er as toggleApp, lt as Button } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/marketplace-C76BhkD6.js
var import_jsx_runtime = require_jsx_runtime();
function MarketplacePage() {
	const apps = useQuery({
		queryKey: ["marketplace"],
		queryFn: () => listMarketplace()
	});
	const qc = useQueryClient();
	const cats = [...new Set((apps.data ?? []).map((a) => a.category))];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Marketplace",
			subtitle: "Accounting, chat, calendar, plots — connect what the shop already runs."
		}), cats.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "px-4 text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-6",
				children: cat
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 grid gap-3 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3",
				children: (apps.data ?? []).filter((a) => a.category === cat).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-medium",
								children: a.name
							}), a.connected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "success",
								children: "On"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: a.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							className: "mt-3",
							variant: a.connected ? "secondary" : "default",
							onClick: () => toggleApp({ data: {
								id: a.id,
								connected: !a.connected
							} }).then(() => qc.invalidateQueries({ queryKey: ["marketplace"] })),
							children: a.connected ? "Disconnect" : "Connect"
						})
					]
				}, a.id))
			})]
		}, cat))]
	});
}
//#endregion
export { MarketplacePage as component };
