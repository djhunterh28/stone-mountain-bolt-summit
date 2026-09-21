import { o as __toESM } from "../_runtime.mjs";
import { a as formatDateTime, t as cn } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { f as listCalendarAccounts, x as toggleCalendar, y as syncCalendars } from "./governance-Bb-_vds7.mjs";
import { gt as ChevronLeft, ht as ChevronRight } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as TabsList, $n as toggleActivity, An as listActivities, J as PageHeader, Z as Tabs, et as TabsTrigger, fr as useUi, lt as Button } from "./router-o_A6MRMh.mjs";
import { t as Checkbox } from "./checkbox-L7phDqs_.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { c as startOfWeek, i as format, l as addMonths, o as startOfMonth, s as isSameDay, t as subMonths, u as addDays } from "../_libs/date-fns.mjs";
import { o as WeekendYear, r as OpsDayGantt, s as getUniqueViews } from "./unique-views-CjDsHG91.mjs";
import { t as Switch } from "./switch-BLKjtJkd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/activities-CShRDvqz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ActivitiesPage() {
	const qc = useQueryClient();
	const { setAddOpen, memberId } = useUi();
	const [mine, setMine] = (0, import_react.useState)(false);
	const [view, setView] = (0, import_react.useState)("list");
	const [cursor, setCursor] = (0, import_react.useState)(() => /* @__PURE__ */ new Date());
	const acts = useQuery({
		queryKey: ["activities", mine ? memberId : "all"],
		queryFn: () => listActivities({ data: { ownerId: mine ? memberId : void 0 } })
	});
	const cals = useQuery({
		queryKey: ["calendars"],
		queryFn: () => listCalendarAccounts()
	});
	const desk = useQuery({
		queryKey: ["unique-views"],
		queryFn: () => getUniqueViews(),
		enabled: view === "year" || view === "gantt"
	});
	const list = acts.data ?? [];
	const overdue = list.filter((a) => !a.done && a.dueAt && new Date(a.dueAt) < /* @__PURE__ */ new Date()).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Calendar",
			subtitle: `${overdue} overdue · month, week, year, Gantt, and a webcal feed for Apple and Google.`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
					value: view,
					onValueChange: setView,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "flex h-auto flex-wrap",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "list",
								children: "List"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "week",
								children: "Week"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "month",
								children: "Month"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "year",
								children: "Year"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "gantt",
								children: "Gantt"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: mine ? "secondary" : "ghost",
					onClick: () => setMine(!mine),
					children: "Mine"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					onClick: () => setAddOpen(true, "activity"),
					children: "Schedule"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "sm",
					variant: "ghost",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/cal/northline",
						children: "Webcal"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "secondary",
					onClick: () => syncCalendars({ data: { memberId } }).then((r) => {
						toast.success(`Pulled ${r.pulled} events from Google / Outlook`);
						qc.invalidateQueries({ queryKey: ["activities"] });
						qc.invalidateQueries({ queryKey: ["calendars"] });
					}),
					children: "Sync calendars"
				})
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-4 mb-4 overflow-x-auto rounded-xl bg-card p-3 shadow-[var(--shadow-border)] sm:mx-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase",
				children: "Connected calendars"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex min-w-max gap-3",
				children: (cals.data ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: c.synced,
							onCheckedChange: (v) => toggleCalendar({ data: {
								id: c.id,
								synced: v
							} }).then(() => qc.invalidateQueries({ queryKey: ["calendars"] }))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							c.provider,
							" · ",
							c.address,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[11px] text-muted-foreground",
								children: c.twoWay ? "two-way" : "pull only"
							})
						] }),
						c.synced && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "success",
							children: "sync"
						})
					]
				}, c.id))
			})]
		}),
		view === "list" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y divide-border border-t border-border",
			children: list.map((a) => {
				const late = !a.done && a.dueAt && new Date(a.dueAt) < /* @__PURE__ */ new Date();
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start gap-3 px-4 py-3 sm:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
							checked: a.done,
							onCheckedChange: (v) => toggleActivity({ data: {
								id: a.id,
								done: Boolean(v)
							} }).then(() => qc.invalidateQueries({ queryKey: ["activities"] })),
							className: "mt-1"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("text-sm", a.done && "text-muted-foreground line-through"),
								children: a.subject
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									a.type,
									" · ",
									a.ownerName,
									" · ",
									a.dealTitle ?? a.orgName ?? a.personName ?? "Unlinked",
									a.location ? ` · ${a.location}` : ""
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("text-xs tabular-nums", late ? "text-destructive" : "text-muted-foreground"),
							children: formatDateTime(a.dueAt)
						})
					]
				}, a.id);
			})
		}),
		view === "month" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthGrid, {
			cursor,
			onPrev: () => setCursor((d) => subMonths(d, 1)),
			onNext: () => setCursor((d) => addMonths(d, 1)),
			activities: list
		}),
		view === "week" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeekGrid, {
			activities: list,
			cursor
		}),
		view === "year" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-4 pb-10 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-3 text-sm text-muted-foreground",
				children: [
					"Weekend-aligned year. Multi-event days fill darker.",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/views",
						className: "underline-offset-4 hover:underline",
						children: "Unique views desk"
					}),
					"."
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeekendYear, {
				shows: desk.data?.shows ?? [],
				year: (/* @__PURE__ */ new Date()).getFullYear()
			})]
		}),
		view === "gantt" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-4 pb-10 sm:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpsDayGantt, {
				shows: desk.data?.shows ?? [],
				shifts: desk.data?.shifts ?? [],
				activities: list
			})
		})
	] });
}
function MonthGrid({ cursor, onPrev, onNext, activities }) {
	const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 0 });
	const days = (0, import_react.useMemo)(() => Array.from({ length: 42 }, (_, i) => addDays(start, i)), [start]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 pb-8 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: format(cursor, "MMMM yyyy")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon-sm",
						variant: "ghost",
						onClick: onPrev,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon-sm",
						variant: "ghost",
						onClick: onNext,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-7 text-[11px] text-muted-foreground",
				children: [
					"Sun",
					"Mon",
					"Tue",
					"Wed",
					"Thu",
					"Fri",
					"Sat"
				].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-1 py-1",
					children: d
				}, d))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-7 rounded-xl border border-border",
				children: days.map((day) => {
					const items = activities.filter((a) => a.dueAt && isSameDay(new Date(a.dueAt), day));
					const inMonth = day.getMonth() === cursor.getMonth();
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("min-h-24 border-r border-b border-border p-1 last:border-r-0", !inMonth && "bg-muted/40 text-muted-foreground"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-1 text-[11px] tabular-nums",
							children: format(day, "d")
						}), items.slice(0, 3).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("mt-0.5 truncate rounded-sm px-1 text-[10px]", a.done ? "text-muted-foreground" : "bg-primary/10 text-foreground"),
							children: a.subject
						}, a.id))]
					}, day.toISOString());
				})
			})
		]
	});
}
function WeekGrid({ activities, cursor }) {
	const start = startOfWeek(cursor, { weekStartsOn: 0 });
	const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-2 px-4 pb-10 sm:grid-cols-7 sm:px-6",
		children: days.map((day) => {
			const items = activities.filter((a) => a.dueAt && isSameDay(new Date(a.dueAt), day));
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-xl bg-card p-3 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-xs font-medium",
					children: format(day, "EEE d")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-2 space-y-1",
					children: [items.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: cn("text-xs", a.done && "text-muted-foreground line-through"),
						children: a.subject
					}, a.id)), items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-xs text-muted-foreground",
						children: "Clear"
					})]
				})]
			}, day.toISOString());
		})
	});
}
//#endregion
export { ActivitiesPage as component };
