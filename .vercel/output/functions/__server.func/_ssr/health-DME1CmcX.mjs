import { s as formatUsdFull } from "./utils-BjcRTCQS.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { D as getHealth, J as PageHeader } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { n as InquiryHeat, s as getUniqueViews } from "./unique-views-CjDsHG91.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/health-DME1CmcX.js
var import_jsx_runtime = require_jsx_runtime();
function HealthPage() {
	const h = useQuery({
		queryKey: ["health"],
		queryFn: () => getHealth()
	});
	const desk = useQuery({
		queryKey: ["unique-views"],
		queryFn: () => getUniqueViews()
	});
	const d = h.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Business health",
				subtitle: "Booked-event audit, ghosted leads, win/loss, quote abandonment, inquiry heatmap."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Win rate",
						value: `${d?.winRate ?? "—"}%`,
						hint: `${d?.won ?? 0} won / ${d?.lost ?? 0} lost`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Lead conversion",
						value: `${d?.conversion ?? "—"}%`,
						hint: `${d?.leadConverted ?? 0} of ${d?.leadN ?? 0}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Collected",
						value: d ? formatUsdFull(d.kpis.collected) : "—",
						hint: d ? `of ${formatUsdFull(d.kpis.invoiced)} invoiced` : ""
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Abandoned quotes",
						value: String(d?.abandoned ?? "—"),
						hint: `${d?.quotes ?? 0} quotes total`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-4 mt-6 sm:mx-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase",
					children: "Health check"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
					children: [(d?.flags ?? []).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center gap-3 px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/deals/$dealId",
							params: { dealId: String(f.id) },
							className: "flex-1 text-sm font-medium",
							children: f.title
						}), f.issues.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "warn",
							children: i
						}, i))]
					}, f.id)), d && d.flags.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "px-4 py-6 text-sm text-muted-foreground",
						children: "Every booked show has a contract, a schedule, and a dollar amount."
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-4 mt-6 sm:mx-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase",
					children: "Ghosted leads"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
					children: (d?.ghosted ?? []).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between px-4 py-2.5 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/deals/$dealId",
							params: { dealId: String(g.id) },
							children: g.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground",
							children: [g.days, "d silent"]
						})]
					}, g.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-4 mt-6 sm:mx-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-baseline justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: "Inquiry heatmap"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/views",
						className: "text-xs text-muted-foreground underline-offset-4 hover:underline",
						children: "Unique views"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InquiryHeat, { days: desk.data?.inquiry ?? [] })]
			})
		]
	});
}
function Stat({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs tracking-wide text-muted-foreground uppercase",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 font-mono text-2xl tabular-nums",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: hint
			})
		]
	});
}
//#endregion
export { HealthPage as component };
