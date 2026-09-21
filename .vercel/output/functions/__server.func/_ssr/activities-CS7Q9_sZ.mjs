import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as cn, o as formatDateTime } from "./utils-DLVA4J7b.mjs";
import { f as listCalendarAccounts, x as toggleCalendar, y as syncCalendars } from "./governance-rJzhZAi0.mjs";
import { at as ChevronRight, ot as ChevronLeft } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { An as listActivities, Mn as listDeals, Q as Tabs, X as PageHeader, er as toggleActivity, et as TabsList, tt as TabsTrigger, ur as useUi, ut as Button } from "./router-Bkw81Fhc.mjs";
import { t as Checkbox } from "./checkbox-70uQ6DSL.mjs";
import { t as Badge } from "./badge-BQYjLRpy.mjs";
import { t as Switch } from "./switch-AWJU8D6h.mjs";
import { a as startOfYear, c as startOfWeek, i as format, l as addMonths, n as setMonth, o as startOfMonth, r as getDay, s as isSameDay, t as subMonths, u as addDays } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/activities-CS7Q9_sZ.js
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
						to: "/crew",
						className: "underline-offset-4 hover:underline",
						children: "Staff Gantt lives with crew"
					}),
					"."
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YearScan, { deals: (deals.data ?? []).filter((d) => d.eventDate) })]
		}),
		view === "gantt" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayGantt, {
			deals: deals.data ?? [],
			activities: list
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
function YearScan({ deals }) {
	const year = 2026;
	const months = (0, import_react.useMemo)(() => {
		return Array.from({ length: 12 }, (_, m) => {
			const first = setMonth(startOfYear(new Date(year, 0, 1)), m);
			const pad = getDay(first);
			const days = Array.from({ length: pad }, () => null);
			let d = first;
			while (d.getMonth() === m) {
				days.push(d);
				d = addDays(d, 1);
			}
			return {
				name: format(first, "MMM"),
				days
			};
		});
	}, [year]);
	function count(day) {
		const key = format(day, "yyyy-MM-dd");
		return deals.filter((x) => (x.eventDate ?? "").slice(0, 10) === key).length;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
		children: months.map((mo) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "rounded-xl bg-card p-3 shadow-[var(--shadow-border)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-2 text-xs font-medium",
				children: mo.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-7 gap-0.5 text-center text-[10px] text-muted-foreground",
				children: ["SMTWTFS".split("").map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c }, i)), mo.days.map((day, i) => {
					if (!day) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}, i);
					const n = count(day);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("rounded-sm py-0.5", n === 1 && "bg-primary/40", n > 1 && "bg-primary text-primary-foreground"),
						children: day.getDate()
					}, i);
				})]
			})]
		}, mo.name))
	});
}
function DayGantt({ deals, activities }) {
	const rows = deals.filter((d) => d.eventDate).slice(0, 10);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-x-auto px-4 pb-10 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-2 text-sm text-muted-foreground",
			children: "Gantt day — simultaneous shows and the activities sitting on them."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-w-[40rem] rounded-xl bg-card p-3 shadow-[var(--shadow-border)]",
			children: rows.map((d) => {
				const hits = activities.filter((a) => a.subject.toLowerCase().includes(d.title.slice(0, 8).toLowerCase()) || a.ownerName === d.ownerName);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[12rem_1fr] items-center gap-2 border-b border-border py-2 last:border-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/deals/$dealId",
						params: { dealId: String(d.id) },
						className: "truncate text-xs",
						children: d.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative h-7 rounded-sm bg-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute inset-y-0 left-[20%] w-[55%] rounded-sm bg-primary/70",
							title: d.venue ?? ""
						}), hits.slice(0, 2).map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute top-0 h-2 w-8 rounded-sm bg-foreground/40",
							style: { left: `${30 + i * 18}%` }
						}, a.id))]
					})]
				}, d.id);
			})
		})]
	});
}
//#endregion
export { ActivitiesPage as component };
