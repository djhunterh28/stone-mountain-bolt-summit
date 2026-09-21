import { o as __toESM } from "../_runtime.mjs";
import { i as formatDate, o as formatUsd, s as formatUsdFull } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { $ as TabsList, J as PageHeader, Q as TabsContent, Z as Tabs, dr as getLifecycleDesk, et as TabsTrigger, fr as useUi, lt as Button, wn as getBootstrap } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { a as LifecycleSkeleton, i as LeadKanban, r as FunnelStrip, t as ClosedTable } from "./lifecycle-CJHg_KQl.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, n as BarChart, s as CartesianGrid } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lifecycle-B_PI1RVs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var GRID = "var(--color-border)";
var FG = "var(--color-muted-foreground)";
var PR = "var(--color-primary)";
function LifecyclePage() {
	const desk = useQuery({
		queryKey: ["lifecycle"],
		queryFn: () => getLifecycleDesk()
	});
	const boot = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	const { setAddOpen } = useUi();
	const [tab, setTab] = (0, import_react.useState)("funnel");
	const d = desk.data;
	const pipe = boot.data?.pipelines[0];
	const typeChart = (0, import_react.useMemo)(() => (d?.types ?? []).map((t) => ({
		name: t.name.replace(" / ", " "),
		open: t.value,
		won: t.wonValue
	})), [d]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Event lifecycle",
			subtitle: "Inquiry to load-out. Every show typed, sourced, and accounted for — including the ones that died.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				onClick: () => setAddOpen(true, "lead"),
				children: "New inquiry"
			})
		}), desk.isLoading || !d ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-4 sm:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LifecycleSkeleton, {})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 lg:grid-cols-6 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Inquiries",
						value: String(d.kpis.inquiries90),
						hint: "Last 90 days"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Qualify",
						value: `${d.kpis.qualifyRate}%`,
						hint: "Fit vs worked"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Win rate",
						value: `${d.kpis.winRate}%`,
						hint: "Won / (won + lost)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Cancel rate",
						value: `${d.kpis.cancelRate}%`,
						hint: "Event died"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Days to won",
						value: String(d.kpis.avgDaysToWon),
						hint: "Inquiry → signed"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Open book",
						value: formatUsd(d.kpis.openValue),
						hint: `${formatUsd(d.kpis.lostValue)} lost`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 px-4 sm:px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FunnelStrip, {
					steps: d.funnel,
					exits: d.exits,
					onPick: (key) => {
						if (key === "new" || key === "contacted" || key === "qualified" || key === "nurture" || key === "disqualified") setTab("leads");
						else if (key === "lost" || key === "cancelled") setTab("closed");
						else if (key === "pipeline" || key === "won" || key === "complete") setTab("funnel");
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 px-4 sm:px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					value: tab,
					onValueChange: setTab,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
							className: "flex h-auto flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "funnel",
									children: "Pipeline"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "leads",
									children: "Lead stages"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "types",
									children: "Event types"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "sources",
									children: "Sources"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "closed",
									children: "Lost & cancelled"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "funnel",
							className: "mt-4 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
										children: "Open stages"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-3 divide-y divide-border",
										children: d.pipeline.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-center justify-between py-2 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono tabular-nums text-muted-foreground",
												children: [
													s.count,
													" · ",
													formatUsd(s.value)
												]
											})]
										}, s.name))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/",
										className: "mt-3 inline-block text-sm text-primary",
										children: "Open the board →"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase",
								children: "Recent moves"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
								children: [d.recent.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex flex-wrap items-center gap-3 px-4 py-2.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: m.kind === "lead" ? "outline" : "steel",
											children: m.kind
										}),
										m.kind === "deal" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/deals/$dealId",
											params: { dealId: String(m.entityId) },
											className: "flex-1 text-sm font-medium",
											children: m.title
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/leads",
											className: "flex-1 text-sm font-medium",
											children: m.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: [m.action, m.detail ? ` · ${m.detail}` : ""]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-muted-foreground",
											children: formatDate(m.at)
										})
									]
								}, m.id)), d.recent.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "px-4 py-6 text-sm text-muted-foreground",
									children: "No stage history yet."
								})]
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "leads",
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeadKanban, {
								leads: d.leads,
								pipeline: pipe
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "types",
							className: "mt-4 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase",
									children: "Open vs won by type"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
									width: "100%",
									height: 320,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
										data: typeChart,
										layout: "vertical",
										margin: {
											left: 8,
											right: 12
										},
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
												width: 128,
												tickLine: false
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
												contentStyle: tip,
												formatter: (v) => formatUsdFull(Number(v))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
												dataKey: "open",
												fill: PR,
												radius: [
													0,
													4,
													4,
													0
												],
												name: "Open",
												barSize: 10
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
												dataKey: "won",
												fill: "var(--color-steel)",
												radius: [
													0,
													4,
													4,
													0
												],
												name: "Won",
												barSize: 10
											})
										]
									})
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
								children: d.types.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex flex-wrap items-center gap-3 px-4 py-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "min-w-0 flex-1 text-sm font-medium",
											children: t.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: [t.open, " open"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: [t.won, " won"]
										}),
										t.lost > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "danger",
											children: [t.lost, " lost"]
										}),
										t.cancelled > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "warn",
											children: [t.cancelled, " cancelled"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-sm tabular-nums",
											children: formatUsd(t.value + t.wonValue)
										})
									]
								}, t.name))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "sources",
							className: "mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto rounded-xl bg-card shadow-[var(--shadow-border)]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full min-w-[640px] text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "text-left text-xs text-muted-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-2 font-medium",
												children: "Source"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-2 py-2 font-medium",
												children: "Leads"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-2 py-2 font-medium",
												children: "Deals"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-2 py-2 font-medium",
												children: "Won"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-2 py-2 font-medium",
												children: "Lost"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-2 py-2 font-medium",
												children: "Cancelled"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-2 py-2 font-medium",
												children: "Win"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-2 text-right font-medium",
												children: "Won book"
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: d.sources.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-t border-border",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-2.5 font-medium",
												children: s.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-2 py-2.5 tabular-nums",
												children: s.leads
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-2 py-2.5 tabular-nums",
												children: s.deals
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-2 py-2.5 tabular-nums",
												children: s.won
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-2 py-2.5 tabular-nums",
												children: s.lost
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-2 py-2.5 tabular-nums",
												children: s.cancelled
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "px-2 py-2.5 tabular-nums",
												children: [s.winRate, "%"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-2.5 text-right font-mono tabular-nums",
												children: formatUsd(s.wonValue)
											})
										]
									}, s.name)) })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-xs text-muted-foreground",
								children: "Win rate ignores cancelled shows — those events died, they were not lost to a competitor."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "closed",
							className: "mt-4 space-y-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex items-baseline justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
									children: "Lost"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-sm tabular-nums",
									children: formatUsdFull(d.kpis.lostValue)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClosedTable, {
								rows: d.lost,
								empty: "No competitive losses on the book."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex items-baseline justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
									children: "Cancelled"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-sm tabular-nums",
									children: formatUsdFull(d.kpis.cancelledValue)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClosedTable, {
								rows: d.cancelled,
								empty: "No cancelled events."
							})] })]
						})
					]
				})
			})
		] })]
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
var tip = {
	background: "var(--color-popover)",
	border: "1px solid var(--color-border)",
	borderRadius: 8,
	color: "var(--color-foreground)",
	fontSize: 12
};
//#endregion
export { LifecyclePage as component };
