import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { $ as TabsList, J as PageHeader, Q as TabsContent, S as getCrew, Z as Tabs, et as TabsTrigger } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { i as format } from "../_libs/date-fns.mjs";
import { i as StaffDayGantt, o as WeekendYear, s as getUniqueViews, t as EventCrewGantt } from "./unique-views-CjDsHG91.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crew-DFGSHjhi.js
var import_jsx_runtime = require_jsx_runtime();
function CrewPage() {
	const crew = useQuery({
		queryKey: ["crew"],
		queryFn: () => getCrew()
	});
	const desk = useQuery({
		queryKey: ["unique-views"],
		queryFn: () => getUniqueViews()
	});
	const shifts = crew.data?.shifts ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Crew & calendar",
			subtitle: "Staff Gantt, year scan, travel/setup/strike, webcal for Apple and Google.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/views",
					className: "text-xs text-muted-foreground underline-offset-4 hover:underline",
					children: "Unique views"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "text-xs text-muted-foreground underline-offset-4 hover:underline",
					href: "/cal/northline",
					children: "Subscribe webcal"
				})]
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
								value: "event",
								children: "Per event"
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
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaffDayGantt, {
							shows: desk.data?.shows ?? [],
							shifts: desk.data?.shifts ?? []
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "event",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventCrewGantt, {
							shows: desk.data?.shows ?? [],
							shifts: desk.data?.shifts ?? []
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "year",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeekendYear, {
							shows: desk.data?.shows ?? [],
							year: (/* @__PURE__ */ new Date()).getFullYear()
						})
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
//#endregion
export { CrewPage as component };
