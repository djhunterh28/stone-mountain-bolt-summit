import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { c as formatUsdFull, n as cn } from "./utils-DLVA4J7b.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { T as getHealth, X as PageHeader } from "./router-Bkw81Fhc.mjs";
import { t as Badge } from "./badge-BQYjLRpy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/health-7errbsCB.js
var import_jsx_runtime = require_jsx_runtime();
var DOW = [
	"S",
	"M",
	"T",
	"W",
	"T",
	"F",
	"S"
];
var MO = [
	"J",
	"F",
	"M",
	"A",
	"M",
	"J",
	"J",
	"A",
	"S",
	"O",
	"N",
	"D"
];
function HealthPage() {
	const d = useQuery({
		queryKey: ["health"],
		queryFn: () => getHealth()
	}).data;
	const max = Math.max(1, ...d?.heat.map((x) => x.n) ?? [1]);
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
						label: "Open",
						value: String(d?.kpis.open ?? "—"),
						hint: d ? formatUsdFull(d.kpis.openValue) : ""
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Won book",
						value: d ? formatUsdFull(d.kpis.wonValue) : "—",
						hint: "Signed shows"
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
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase",
					children: "Inquiry heatmap"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-[2rem_repeat(12,1.5rem)] gap-1 text-[10px] text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
							MO.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-center",
								children: m
							}, i)),
							DOW.map((day, dow) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: day }, `d${dow}`), MO.map((_, month) => {
								const n = d?.heat.find((x) => x.month === month && x.dow === dow)?.n ?? 0;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									title: `${n}`,
									className: cn("block h-6 rounded-sm", n === 0 ? "bg-muted" : "bg-primary"),
									style: { opacity: n === 0 ? 1 : .25 + n / max * .75 }
								}, `${dow}-${month}`);
							})] }))
						]
					})
				})]
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
