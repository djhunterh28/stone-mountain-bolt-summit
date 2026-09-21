import { o as __toESM } from "../_runtime.mjs";
import { o as formatUsd, t as cn } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CZC9dlvp.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { gt as ChevronLeft, ht as ChevronRight } from "../_libs/lucide-react.mjs";
import { lt as Button } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { t as Skeleton } from "./skeleton-BVFrMLkw.mjs";
import { a as startOfYear, c as startOfWeek, i as format, n as setMonth, o as startOfMonth, r as getDay, u as addDays } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/unique-views-CjDsHG91.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var getUniqueViews = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("bbd1d40f5faa477aeae0887b2b2a05637d0b7d4524a21966cdd6eec476c90735"));
var HOURS = Array.from({ length: 20 }, (_, i) => i + 4);
var WEEKDAYS = [
	"Sa",
	"Su",
	"Mo",
	"Tu",
	"We",
	"Th",
	"Fr"
];
function pct(hour) {
	return (Math.min(24, Math.max(4, hour)) - 4) / 20 * 100;
}
function formatHour(h) {
	const hh = Math.floor(h);
	const mm = Math.round((h - hh) * 60) % 60;
	return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}
function kindClass(kind) {
	if (kind === "setup") return "bg-warn/80";
	if (kind === "strike") return "bg-muted-foreground/45";
	if (kind === "travel") return "bg-steel/70";
	return "bg-primary/85";
}
function ymd(d) {
	return format(d, "yyyy-MM-dd");
}
function overlapDays(shows) {
	const map = /* @__PURE__ */ new Map();
	for (const s of shows) {
		const list = map.get(s.eventDate) ?? [];
		list.push(s);
		map.set(s.eventDate, list);
	}
	return [...map.entries()].filter(([, list]) => list.length > 1).sort(([a], [b]) => a.localeCompare(b));
}
function defaultBusyDay(shows, fallbackDays = []) {
	const today = ymd(/* @__PURE__ */ new Date());
	const doubles = overlapDays(shows);
	const upcoming = doubles.filter(([d]) => d >= today);
	return upcoming.filter(([d]) => {
		const dow = (/* @__PURE__ */ new Date(`${d}T12:00:00`)).getDay();
		return dow === 0 || dow === 6;
	})[0]?.[0] ?? upcoming[0]?.[0] ?? doubles[0]?.[0] ?? shows.slice().sort((a, b) => a.eventDate.localeCompare(b.eventDate)).find((s) => s.eventDate >= today)?.eventDate ?? fallbackDays.slice().sort()[0] ?? today;
}
function ClockHead({ labelWidth }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("mb-1 grid text-[10px] text-muted-foreground", labelWidth),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative h-4",
			children: HOURS.filter((h) => h % 2 === 0).map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute -translate-x-1/2 tabular-nums",
				style: { left: `${pct(h)}%` },
				children: String(h).padStart(2, "0")
			}, h))
		})]
	});
}
function KindLegend() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-2 flex flex-wrap gap-3 text-[11px] text-muted-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "size-2 rounded-sm bg-steel/70" }), " Travel"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "size-2 rounded-sm bg-warn/80" }), " Setup"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "size-2 rounded-sm bg-primary/85" }), " Show"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "size-2 rounded-sm bg-muted-foreground/45" }), " Strike"]
			})
		]
	});
}
function ViewsSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
		children: Array.from({ length: 8 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 rounded-xl" }, i))
	});
}
function WeekendYear({ shows, year: yearProp, onOpenDay }) {
	const [year, setYear] = (0, import_react.useState)(yearProp ?? (/* @__PURE__ */ new Date()).getFullYear());
	const [picked, setPicked] = (0, import_react.useState)(null);
	const months = (0, import_react.useMemo)(() => {
		return Array.from({ length: 12 }, (_, m) => {
			const first = setMonth(startOfYear(new Date(year, 0, 1)), m);
			const gridStart = startOfWeek(startOfMonth(first), { weekStartsOn: 6 });
			const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
			return {
				name: format(first, "MMM"),
				month: m,
				days
			};
		});
	}, [year]);
	const byDay = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const s of shows) {
			const list = map.get(s.eventDate) ?? [];
			list.push(s);
			map.set(s.eventDate, list);
		}
		return map;
	}, [shows]);
	const doubles = (0, import_react.useMemo)(() => overlapDays(shows).filter(([d]) => d.startsWith(String(year))), [shows, year]);
	const selected = picked ? byDay.get(picked) ?? [] : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex flex-wrap items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon-sm",
					variant: "ghost",
					onClick: () => setYear((y) => y - 1),
					"aria-label": "Previous year",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium tabular-nums",
					children: year
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon-sm",
					variant: "ghost",
					onClick: () => setYear((y) => y + 1),
					"aria-label": "Next year",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Weeks start Saturday so Friday load-ins sit against the weekend they serve. Darker cells hold more than one show."
				})
			]
		}),
		doubles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-3 flex flex-wrap gap-1.5",
			children: doubles.map(([day, list]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: picked === day ? "secondary" : "ghost",
				onClick: () => setPicked(day),
				children: [
					format(/* @__PURE__ */ new Date(`${day}T12:00:00`), "EEE MMM d"),
					" · ",
					list.length,
					" shows"
				]
			}, day))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
			children: months.map((mo) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-xl bg-card p-3 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-2 text-xs font-medium",
					children: mo.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-7 gap-0.5 text-center text-[10px]",
					children: [WEEKDAYS.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("py-0.5", i < 2 ? "font-medium text-steel" : "text-muted-foreground"),
						children: d
					}, d)), mo.days.map((day, i) => {
						const key = ymd(day);
						const inMonth = day.getMonth() === mo.month;
						const n = byDay.get(key)?.length ?? 0;
						const weekend = getDay(day) === 0 || getDay(day) === 6;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: !inMonth,
							onClick: () => setPicked(n ? key : null),
							title: n ? `${n} show${n > 1 ? "s" : ""}` : void 0,
							className: cn("rounded-sm py-0.5 tabular-nums", !inMonth && "text-transparent", inMonth && weekend && n === 0 && "bg-muted/60 text-muted-foreground", inMonth && n === 1 && "bg-primary/40 text-foreground", inMonth && n > 1 && "bg-primary text-primary-foreground", picked === key && "ring-1 ring-ring"),
							children: inMonth ? day.getDate() : ""
						}, `${key}-${i}`);
					})]
				})]
			}, mo.name))
		}),
		picked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "mt-4 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between gap-2 px-4 py-2 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: format(/* @__PURE__ */ new Date(`${picked}T12:00:00`), "EEEE, MMM d") }), onOpenDay && selected.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: () => onOpenDay(picked),
						children: "Open day Gantt"
					})]
				}),
				selected.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-center gap-2 px-4 py-2.5 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/deals/$dealId",
							params: { dealId: String(s.id) },
							className: "min-w-0 flex-1 truncate font-medium",
							children: s.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: s.venue
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							children: [formatHour(s.loadHour), " load-in"]
						})
					]
				}, s.id)),
				selected.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "px-4 py-3 text-sm text-muted-foreground",
					children: "Dark day."
				})
			]
		})
	] });
}
function OpsDayGantt({ shows, shifts, activities = [], day: controlled, onDayChange }) {
	const doubles = (0, import_react.useMemo)(() => overlapDays(shows), [shows]);
	const busy = defaultBusyDay(shows);
	const [local, setLocal] = (0, import_react.useState)(null);
	const day = controlled ?? local ?? busy;
	function setDay(next) {
		setLocal(next);
		onDayChange?.(next);
	}
	const rows = shows.filter((s) => s.eventDate === day);
	const dayShifts = shifts.filter((s) => s.day === day);
	const ticks = activities.filter((a) => a.dueAt && a.dueAt.slice(0, 10) === day);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex flex-wrap items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon-sm",
					variant: "ghost",
					"aria-label": "Previous day",
					onClick: () => setDay(ymd(addDays(/* @__PURE__ */ new Date(`${day}T12:00:00`), -1))),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: format(/* @__PURE__ */ new Date(`${day}T12:00:00`), "EEEE, MMM d")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon-sm",
					variant: "ghost",
					"aria-label": "Next day",
					onClick: () => setDay(ymd(addDays(/* @__PURE__ */ new Date(`${day}T12:00:00`), 1))),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-muted-foreground",
					children: [
						rows.length,
						" show",
						rows.length === 1 ? "" : "s",
						" on the floor"
					]
				})
			]
		}),
		doubles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-3 flex flex-wrap gap-1.5",
			children: doubles.map(([d, list]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: d === day ? "secondary" : "ghost",
				onClick: () => setDay(d),
				children: [
					format(/* @__PURE__ */ new Date(`${d}T12:00:00`), "EEE MMM d"),
					" · ",
					list.length
				]
			}, d))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-3 text-sm text-muted-foreground",
			children: "One row per event. Bars run load-in to wrap. Crew ticks sit on the same clock — travel, setup, show, strike."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindLegend, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-xl bg-card p-3 shadow-[var(--shadow-border)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-[44rem]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClockHead, { labelWidth: "grid-cols-[11rem_1fr]" }),
					rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-1 py-6 text-sm text-muted-foreground",
						children: "No shows this day. Step to a darker cell on the year scan."
					}),
					rows.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-[11rem_1fr] items-center gap-2 border-t border-border py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/deals/$dealId",
							params: { dealId: String(s.id) },
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-xs font-medium",
								children: s.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-[10px] text-muted-foreground",
								children: s.venue
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative h-8 rounded-sm bg-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute inset-y-1 rounded-sm bg-primary/80",
									style: {
										left: `${pct(s.loadHour)}%`,
										width: `${Math.max(3, pct(s.endHour) - pct(s.loadHour))}%`
									},
									title: `${s.title} · ${formatHour(s.loadHour)}–${formatHour(s.endHour)}`
								}),
								dayShifts.filter((sh) => sh.dealId === s.id).map((sh) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("absolute top-0 h-1.5 rounded-full", kindClass(sh.kind)),
									style: {
										left: `${pct(sh.startHour)}%`,
										width: `${Math.max(2, pct(sh.endHour) - pct(sh.startHour))}%`
									},
									title: `${sh.member} · ${sh.kind} · ${formatHour(sh.startHour)}`
								}, sh.id)),
								ticks.filter((a) => a.ownerName === s.ownerName).slice(0, 3).map((a) => {
									const h = a.dueAt ? new Date(a.dueAt).getHours() + new Date(a.dueAt).getMinutes() / 60 : 12;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute top-2 size-1.5 rounded-full bg-foreground",
										style: { left: `${pct(h)}%` },
										title: a.subject
									}, a.id);
								})
							]
						})]
					}, s.id))
				]
			})
		})
	] });
}
function EventCrewGantt({ shows, shifts }) {
	const withCrew = shows.filter((s) => shifts.some((sh) => sh.dealId === s.id));
	const preferred = (0, import_react.useMemo)(() => {
		const overlapIds = new Set(overlapDays(shows).flatMap(([, list]) => list.map((s) => s.id)));
		return (overlapIds.size ? withCrew.filter((s) => overlapIds.has(s.id)) : withCrew).slice().sort((a, b) => shifts.filter((sh) => sh.dealId === b.id).length - shifts.filter((sh) => sh.dealId === a.id).length)[0];
	}, [
		shows,
		shifts,
		withCrew
	]);
	const [dealId, setDealId] = (0, import_react.useState)(null);
	const show = shows.find((s) => s.id === dealId) ?? preferred ?? withCrew[0] ?? shows[0];
	const rows = show ? shifts.filter((s) => s.dealId === show.id) : [];
	const members = [...new Set(rows.map((r) => r.member))];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex flex-wrap items-end gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "space-y-1 text-xs text-muted-foreground",
				children: ["Event", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					size: 1,
					value: show?.id ?? "",
					onChange: (e) => setDealId(Number(e.target.value)),
					className: "mt-1 flex h-10 min-w-[16rem] rounded-md bg-secondary px-3 text-sm text-foreground shadow-[var(--shadow-border)]",
					children: (withCrew.length ? withCrew : shows).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: s.id,
						children: s.title
					}, s.id))
				})]
			}), show && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "pb-2 text-xs text-muted-foreground",
				children: [
					show.venue,
					" · ",
					format(/* @__PURE__ */ new Date(`${show.eventDate}T12:00:00`), "MMM d"),
					" · ",
					formatUsd(show.value)
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-3 text-sm text-muted-foreground",
			children: "Who is on the floor, and when. Travel, setup, show, strike on one clock — not a spreadsheet."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindLegend, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-xl bg-card p-3 shadow-[var(--shadow-border)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-[44rem]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClockHead, { labelWidth: "grid-cols-[9rem_1fr]" }),
					members.map((m) => {
						const blocks = rows.filter((r) => r.member === m);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-[9rem_1fr] items-center gap-2 border-t border-border py-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-xs",
									children: m
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-[10px] text-muted-foreground",
									children: blocks[0]?.role
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative h-7 rounded-sm bg-muted",
								children: blocks.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("absolute inset-y-1 rounded-sm", kindClass(b.kind)),
									style: {
										left: `${pct(b.startHour)}%`,
										width: `${Math.max(3, pct(b.endHour) - pct(b.startHour))}%`
									},
									title: `${b.role} · ${b.kind} · ${formatHour(b.startHour)}–${formatHour(b.endHour)}`
								}, b.id))
							})]
						}, m);
					}),
					members.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-6 text-sm text-muted-foreground",
						children: "No crew plotted on this show yet."
					})
				]
			})
		})
	] });
}
function StaffDayGantt({ shows, shifts }) {
	const doubles = (0, import_react.useMemo)(() => overlapDays(shows), [shows]);
	const busy = defaultBusyDay(shows, shifts.map((s) => s.day));
	const [local, setLocal] = (0, import_react.useState)(null);
	const day = local ?? busy;
	const dayShifts = shifts.filter((s) => s.day === day);
	const members = [...new Set(dayShifts.map((s) => s.member))];
	const dayShows = shows.filter((s) => s.eventDate === day);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex flex-wrap items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon-sm",
					variant: "ghost",
					"aria-label": "Previous day",
					onClick: () => setLocal(ymd(addDays(/* @__PURE__ */ new Date(`${day}T12:00:00`), -1))),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: format(/* @__PURE__ */ new Date(`${day}T12:00:00`), "EEEE, MMM d")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon-sm",
					variant: "ghost",
					"aria-label": "Next day",
					onClick: () => setLocal(ymd(addDays(/* @__PURE__ */ new Date(`${day}T12:00:00`), 1))),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-muted-foreground",
					children: [
						members.length,
						" on the floor · ",
						dayShows.length,
						" show",
						dayShows.length === 1 ? "" : "s"
					]
				})
			]
		}),
		doubles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-3 flex flex-wrap gap-1.5",
			children: doubles.map(([d, list]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: d === day ? "secondary" : "ghost",
				onClick: () => setLocal(d),
				children: [
					format(/* @__PURE__ */ new Date(`${d}T12:00:00`), "EEE MMM d"),
					" · ",
					list.length
				]
			}, d))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindLegend, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-xl bg-card p-3 shadow-[var(--shadow-border)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-[44rem]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClockHead, { labelWidth: "grid-cols-[9rem_1fr]" }),
					members.map((m) => {
						const blocks = dayShifts.filter((r) => r.member === m);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-[9rem_1fr] items-center gap-2 border-t border-border py-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-xs",
									children: m
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-[10px] text-muted-foreground",
									children: blocks.map((b) => b.deal).join(" · ")
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative h-7 rounded-sm bg-muted",
								children: blocks.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("absolute inset-y-1 rounded-sm", kindClass(b.kind)),
									style: {
										left: `${pct(b.startHour)}%`,
										width: `${Math.max(3, pct(b.endHour) - pct(b.startHour))}%`
									},
									title: `${b.deal} · ${b.role} · ${b.kind}`
								}, b.id))
							})]
						}, m);
					}),
					members.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-6 text-sm text-muted-foreground",
						children: "No crew plotted this day. Jump a double-header chip."
					})
				]
			})
		})
	] });
}
function InquiryHeat({ days }) {
	const byDay = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const d of days) map.set(d.day, d);
		return map;
	}, [days]);
	const end = /* @__PURE__ */ new Date();
	const start = addDays(end, -371);
	const gridStart = startOfWeek(start, { weekStartsOn: 6 });
	const weeks = 53;
	const cells = (0, import_react.useMemo)(() => {
		return Array.from({ length: weeks }, (_, w) => Array.from({ length: 7 }, (_, dow) => {
			const day = addDays(gridStart, w * 7 + dow);
			const key = ymd(day);
			return {
				day,
				key,
				cell: byDay.get(key),
				future: day > end
			};
		}));
	}, [
		byDay,
		gridStart,
		end
	]);
	const max = Math.max(1, ...days.map((d) => d.n));
	const total = days.reduce((s, d) => s + d.n, 0);
	const [picked, setPicked] = (0, import_react.useState)(null);
	const selected = picked ? byDay.get(picked) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-3 text-sm text-muted-foreground",
			children: [total, " inbound touches across 18 months. Galas stack Sep–Dec. Outdoor holds light up May–June. Weekends run hotter than Tuesdays."]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "overflow-x-auto rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex w-6 shrink-0 flex-col justify-between py-5 text-[9px] text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sa" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mo" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "We" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Fr" })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative mb-1 h-3",
					children: cells.map((week, wi) => {
						if (week[0].day.getMonth() === (wi === 0 ? -1 : cells[wi - 1][0].day.getMonth())) return null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute text-[9px] text-muted-foreground",
							style: { left: `${wi * 13}px` },
							children: format(week[0].day, "MMM")
						}, wi);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-px",
					children: cells.map((week, wi) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-px",
						children: week.map((c) => {
							const n = c.cell?.n ?? 0;
							const op = n === 0 ? .12 : .25 + n / max * .75;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: c.future,
								onClick: () => setPicked(c.future ? null : c.key),
								title: c.future ? "" : `${c.key} · ${n} inquiries`,
								className: cn("block size-3 rounded-sm", c.future ? "bg-transparent" : "bg-primary", picked === c.key && "ring-1 ring-ring"),
								style: { opacity: c.future ? 0 : op }
							}, c.key);
						})
					}, wi))
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center gap-2 text-[10px] text-muted-foreground",
				children: [
					"Less",
					[
						.12,
						.35,
						.55,
						.8,
						1
					].map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "size-3 rounded-sm bg-primary",
						style: { opacity: o }
					}, o)),
					"More"
				]
			})]
		}),
		selected && picked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 rounded-xl bg-card px-4 py-3 text-sm shadow-[var(--shadow-border)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground",
				children: format(/* @__PURE__ */ new Date(`${picked}T12:00:00`), "EEEE, MMM d yyyy")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 flex flex-wrap gap-4 tabular-nums",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [selected.n, " total"] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground",
						children: [selected.leads, " leads"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground",
						children: [selected.deals, " deals"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground",
						children: [selected.forms, " forms"]
					})
				]
			})]
		})
	] });
}
//#endregion
export { ViewsSkeleton as a, overlapDays as c, StaffDayGantt as i, InquiryHeat as n, WeekendYear as o, OpsDayGantt as r, getUniqueViews as s, EventCrewGantt as t };
