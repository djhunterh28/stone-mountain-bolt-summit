import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as cn } from "./utils-DLVA4J7b.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { $ as TabsContent, Mn as listDeals, Q as Tabs, X as PageHeader, et as TabsList, tt as TabsTrigger, v as getCrew } from "./router-Bkw81Fhc.mjs";
import { t as Badge } from "./badge-BQYjLRpy.mjs";
import { a as startOfYear, i as format, n as setMonth, r as getDay, u as addDays } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crew-nWYUrP_-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function hour(isoStr) {
	return new Date(isoStr).getHours() + new Date(isoStr).getMinutes() / 60;
}
function CrewPage() {
	const crew = useQuery({
		queryKey: ["crew"],
		queryFn: () => getCrew()
	});
	const deals = useQuery({
		queryKey: ["deals-all"],
		queryFn: () => listDeals({ data: {
			pipelineId: 1,
			status: "all"
		} })
	});
	const shifts = crew.data?.shifts ?? [];
	const members = [...new Set(shifts.map((s) => s.member))];
	const hours = Array.from({ length: 18 }, (_, i) => i + 6);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Crew & calendar",
			subtitle: "Staff Gantt, year scan, travel/setup/strike, webcal for Apple and Google.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				className: "text-xs text-muted-foreground underline-offset-4 hover:underline",
				href: "/cal/northline",
				children: "Subscribe webcal"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-4 sm:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "gantt",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "flex h-auto flex-wrap",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "gantt",
								children: "Staff Gantt"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "year",
								children: "Year"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "adv",
								children: "Travel / setup / strike"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "gantt",
						className: "mt-4 overflow-x-auto rounded-xl bg-card p-3 shadow-[var(--shadow-border)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "min-w-[52rem]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-[8rem_repeat(18,minmax(2.2rem,1fr))] gap-px text-[10px] text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
									hours.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-center",
										children: h
									}, h)),
									members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate py-1 text-xs text-foreground",
										children: m
									}, `${m}-n`), hours.map((h) => {
										const hit = shifts.find((s) => s.member === m && hour(s.startsAt) <= h && hour(s.endsAt) > h);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("h-7 rounded-sm", hit ? "bg-primary/80" : "bg-muted"),
											title: hit ? `${hit.role} · ${hit.deal}` : ""
										}, `${m}-${h}`);
									})] }))
								]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "year",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YearGrid, { deals: (deals.data ?? []).filter((d) => d.eventDate) })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "adv",
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
							children: shifts.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex flex-wrap items-center gap-3 px-4 py-3 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										children: s.kind
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1",
										children: [
											s.member,
											" · ",
											s.role,
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted-foreground",
												children: [
													s.deal,
													" · ",
													s.venue
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-muted-foreground",
										children: [
											format(new Date(s.startsAt), "HH:mm"),
											"–",
											format(new Date(s.endsAt), "HH:mm")
										]
									})
								]
							}, s.id))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-muted-foreground",
							children: "Travel minutes come from Mileage. Setup and strike sit on the same Gantt as show time."
						})]
					})
				]
			})
		})]
	});
}
function YearGrid({ deals }) {
	const [year] = (0, import_react.useState)(2026);
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
//#endregion
export { CrewPage as component };
