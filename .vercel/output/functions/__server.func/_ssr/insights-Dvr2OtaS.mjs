import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { c as formatUsdFull, s as formatUsd } from "./utils-DLVA4J7b.mjs";
import { t as runAi } from "./ai-Ceoa2a3r.mjs";
import { _ as Sparkles } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { En as getInsights, Hn as listReports, Sn as createReport, T as getHealth, X as PageHeader, lt as Input, ut as Button } from "./router-Bkw81Fhc.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, l as Pie, n as BarChart, o as Line, p as Legend, r as LineChart, s as CartesianGrid, t as PieChart, u as Cell } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/insights-Dvr2OtaS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var GRID = "var(--color-border)";
var FG = "var(--color-muted-foreground)";
var PR = "var(--color-primary)";
var MUTED = "var(--color-steel)";
function InsightsPage() {
	const insights = useQuery({
		queryKey: ["insights"],
		queryFn: () => getInsights()
	});
	const reports = useQuery({
		queryKey: ["reports"],
		queryFn: () => listReports()
	});
	const health = useQuery({
		queryKey: ["health"],
		queryFn: () => getHealth()
	});
	const qc = useQueryClient();
	const [ai, setAi] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const d = insights.data;
	async function narrate() {
		if (!d) return;
		setBusy(true);
		const res = await runAi({ data: {
			kind: "report",
			prompt: `Open ${d.openValue} across ${d.openCount} deals, weighted ${d.weightedValue}, won ${d.wonValue}, win rate ${d.winRate}%, rotting ${d.rottingCount}, overdue ${d.overdueActivities}. Owners: ${d.byOwner.map((o) => `${o.name} open ${o.value} won ${o.won}`).join("; ")}.`
		} });
		setBusy(false);
		if (res.ok) setAi(res.text);
		else toast.error(res.error);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Insights",
			subtitle: "Revenue, velocity, and 500 custom reports on the live-events book.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "secondary",
				onClick: narrate,
				disabled: busy,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), busy ? "Writing…" : "AI report"]
			})
		}), d && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Open pipeline",
						value: formatUsdFull(d.openValue),
						hint: `${d.openCount} deals`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Weighted",
						value: formatUsdFull(d.weightedValue),
						hint: "By stage probability"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Won (booked)",
						value: formatUsdFull(d.wonValue),
						hint: `${d.winRate}% win rate`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Avg won deal",
						value: formatUsdFull(d.avgDeal),
						hint: `${d.rottingCount} rotting`
					})
				]
			}),
			ai && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-4 mt-4 rounded-xl bg-card p-4 text-sm leading-relaxed shadow-[var(--shadow-border)] sm:mx-6",
				children: ai
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-4 px-4 sm:px-6 lg:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Won vs pipeline by month",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: 220,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
								data: d.byMonth,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										stroke: GRID,
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "month",
										stroke: FG,
										fontSize: 11,
										tickLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										stroke: FG,
										fontSize: 11,
										tickFormatter: (v) => formatUsd(Number(v)),
										width: 48
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										contentStyle: tip,
										formatter: (v) => formatUsdFull(Number(v))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "won",
										stroke: PR,
										strokeWidth: 2,
										dot: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "open",
										stroke: MUTED,
										strokeWidth: 1.5,
										dot: false
									})
								]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Open value by stage",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: 220,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: d.byStage,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										stroke: GRID,
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "name",
										stroke: FG,
										fontSize: 11,
										tickLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										stroke: FG,
										fontSize: 11,
										tickFormatter: (v) => formatUsd(Number(v)),
										width: 48
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										contentStyle: tip,
										formatter: (v) => formatUsdFull(Number(v))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "value",
										fill: PR,
										radius: [
											4,
											4,
											0,
											0
										]
									})
								]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Owner book",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: 220,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: d.byOwner,
								layout: "vertical",
								margin: { left: 48 },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										stroke: GRID,
										horizontal: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										type: "number",
										stroke: FG,
										fontSize: 11,
										tickFormatter: (v) => formatUsd(Number(v))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										type: "category",
										dataKey: "name",
										stroke: FG,
										fontSize: 11,
										width: 80
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										contentStyle: tip,
										formatter: (v) => formatUsdFull(Number(v))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "value",
										name: "Open",
										fill: PR,
										radius: [
											0,
											4,
											4,
											0
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "won",
										name: "Won",
										fill: MUTED,
										radius: [
											0,
											4,
											4,
											0
										]
									})
								]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Source mix",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: 220,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
									data: d.bySource,
									dataKey: "value",
									nameKey: "name",
									innerRadius: 48,
									outerRadius: 80,
									paddingAngle: 2,
									children: d.bySource.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: i % 2 === 0 ? PR : MUTED }, i))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									contentStyle: tip,
									formatter: (v) => formatUsdFull(Number(v))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {})
							] })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Activity this week",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: 220,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: d.activityWeek,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										stroke: GRID,
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "day",
										stroke: FG,
										fontSize: 11
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										stroke: FG,
										fontSize: 11,
										allowDecimals: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tip }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "planned",
										fill: MUTED,
										radius: [
											4,
											4,
											0,
											0
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "done",
										fill: PR,
										radius: [
											4,
											4,
											0,
											0
										]
									})
								]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						title: "Saved reports",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2 text-sm",
							children: (reports.data ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex justify-between rounded-md bg-muted px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: r.kind
								})]
							}, r.id))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "mt-3 flex gap-2",
							onSubmit: (e) => {
								e.preventDefault();
								const fd = new FormData(e.currentTarget);
								const name = String(fd.get("name") || "New report");
								createReport({ data: {
									name,
									kind: "column"
								} }).then((r) => {
									if (r && "error" in r && r.error) toast.error(r.error);
									else toast.success("Report saved");
									qc.invalidateQueries({ queryKey: ["reports"] });
									qc.invalidateQueries({ queryKey: ["usage"] });
								});
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "name",
								placeholder: "Report name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								variant: "secondary",
								children: "Save"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						title: "Ghosted leads",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "space-y-2 text-sm",
							children: [(health.data?.ghosted ?? []).slice(0, 6).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/deals/$dealId",
									params: { dealId: String(g.id) },
									className: "truncate hover:underline",
									children: g.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground",
									children: [g.days, "d silent"]
								})]
							}, g.id)), (health.data?.ghosted ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-muted-foreground",
								children: "Nothing sitting silent past two weeks."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							variant: "ghost",
							className: "mt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/health",
								children: "Open health check"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						title: "Inquiry heatmap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mb-2 text-xs text-muted-foreground",
							children: [
								"Win rate ",
								health.data?.winRate ?? "—",
								"% · ",
								health.data?.abandoned ?? 0,
								" abandoned quotes"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-12 gap-1",
							children: Array.from({ length: 12 }, (_, month) => {
								const n = (health.data?.heat ?? []).filter((h) => h.month === month).reduce((s, h) => s + h.n, 0);
								const max = Math.max(1, ...(health.data?.heat ?? []).map((h) => h.n));
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									title: `${n}`,
									className: "h-8 rounded-sm bg-primary",
									style: { opacity: n === 0 ? .15 : .3 + n / max * .7 }
								}, month);
							})
						})]
					})
				]
			})
		] })]
	});
}
var tip = {
	background: "var(--color-popover)",
	border: "1px solid var(--color-border)",
	borderRadius: 8,
	fontSize: 12
};
function Stat({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 font-mono text-lg tabular-nums",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-[11px] text-muted-foreground",
				children: hint
			})
		]
	});
}
function Card({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-3 text-sm font-medium",
			children: title
		}), children]
	});
}
//#endregion
export { InsightsPage as component };
