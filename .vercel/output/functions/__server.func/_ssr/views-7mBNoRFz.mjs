import { o as __toESM } from "../_runtime.mjs";
import { o as formatUsd } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { $ as TabsList, An as listActivities, J as PageHeader, Q as TabsContent, Z as Tabs, et as TabsTrigger } from "./router-o_A6MRMh.mjs";
import { a as ViewsSkeleton, c as overlapDays, n as InquiryHeat, o as WeekendYear, r as OpsDayGantt, s as getUniqueViews, t as EventCrewGantt } from "./unique-views-CjDsHG91.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/views-7mBNoRFz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ViewsPage() {
	const desk = useQuery({
		queryKey: ["unique-views"],
		queryFn: () => getUniqueViews()
	});
	const acts = useQuery({
		queryKey: ["activities", "all"],
		queryFn: () => listActivities({ data: {} })
	});
	const shows = desk.data?.shows ?? [];
	const shifts = desk.data?.shifts ?? [];
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	const [tab, setTab] = (0, import_react.useState)("year");
	const [focusDay, setFocusDay] = (0, import_react.useState)();
	const doubles = (0, import_react.useMemo)(() => overlapDays(shows), [shows]);
	const inquiryN = (desk.data?.inquiry ?? []).reduce((s, d) => s + d.n, 0);
	const crewShows = new Set(shifts.map((s) => s.dealId)).size;
	const book = shows.filter((s) => s.status === "won" || s.status === "open").reduce((s, d) => s + d.value, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Unique views",
				subtitle: "Weekend-aligned year, multi-op day Gantt, per-event crew, and an 18-month inquiry heat — the way a shop actually looks at time."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Double days",
						value: String(doubles.length),
						hint: "Simultaneous shows"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Crew plots",
						value: String(crewShows),
						hint: "Events with a floor sheet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Inquiries",
						value: inquiryN.toLocaleString(),
						hint: "18-month inbound"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Dated book",
						value: formatUsd(book),
						hint: "Shows with an event date"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 px-4 sm:px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					value: tab,
					onValueChange: setTab,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "flex h-auto flex-wrap",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "year",
								children: "Year"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "day",
								children: "Day Gantt"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "crew",
								children: "Event crew"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "heat",
								children: "Inquiry heat"
							})
						]
					}), desk.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ViewsSkeleton, {})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "year",
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeekendYear, {
								shows,
								year,
								onOpenDay: (d) => {
									setFocusDay(d);
									setTab("day");
								}
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "day",
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpsDayGantt, {
								shows,
								shifts,
								activities: acts.data ?? [],
								day: focusDay,
								onDayChange: setFocusDay
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "crew",
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventCrewGantt, {
								shows,
								shifts
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "heat",
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InquiryHeat, { days: desk.data?.inquiry ?? [] })
						})
					] })]
				})
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
export { ViewsPage as component };
