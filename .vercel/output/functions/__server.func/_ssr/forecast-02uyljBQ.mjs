import { s as formatUsdFull } from "./utils-BjcRTCQS.mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { J as PageHeader, Mn as listDeals, wn as getBootstrap } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { i as format, l as addMonths, o as startOfMonth } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forecast-02uyljBQ.js
var import_jsx_runtime = require_jsx_runtime();
function ForecastPage() {
	const boot = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	const deals = useQuery({
		queryKey: [
			"deals",
			1,
			"open"
		],
		queryFn: () => listDeals({ data: {
			pipelineId: 1,
			status: "open"
		} })
	});
	const months = Array.from({ length: 6 }, (_, i) => startOfMonth(addMonths(/* @__PURE__ */ new Date(), i)));
	const open = deals.data ?? [];
	const rows = months.map((m) => {
		const inMonth = open.filter((d) => {
			const dt = d.expectedClose ? new Date(d.expectedClose) : d.eventDate ? new Date(d.eventDate) : null;
			return dt && dt.getMonth() === m.getMonth() && dt.getFullYear() === m.getFullYear();
		});
		return {
			m,
			inMonth,
			best: inMonth.reduce((s, d) => s + d.value, 0),
			commit: inMonth.filter((d) => (d.probability ?? 0) >= 80).reduce((s, d) => s + d.value, 0),
			weighted: inMonth.reduce((s, d) => s + d.value * ((d.probability ?? 0) / 100), 0)
		};
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Forecast",
				subtitle: "Commit, best case, and weighted by expected close — Live Events book."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-left text-xs text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2 font-medium sm:px-6",
								children: "Month"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-2 text-right font-medium",
								children: "Commit ≥80%"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-2 text-right font-medium",
								children: "Weighted"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2 text-right font-medium sm:px-6",
								children: "Best case"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border align-top",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3 sm:px-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: format(r.m, "MMMM yyyy")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "mt-2 space-y-1",
									children: [r.inMonth.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "text-xs text-muted-foreground",
										children: [
											d.title,
											" · ",
											formatUsdFull(d.value),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
												variant: "outline",
												children: [d.probability, "%"]
											})
										]
									}, d.id)), r.inMonth.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
										className: "text-xs text-muted-foreground",
										children: "No closes dated here."
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 py-3 text-right font-mono tabular-nums",
								children: formatUsdFull(r.commit)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 py-3 text-right font-mono tabular-nums",
								children: formatUsdFull(r.weighted)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-right font-mono tabular-nums sm:px-6",
								children: formatUsdFull(r.best)
							})
						]
					}, r.m.toISOString())) })]
				})
			}),
			boot.data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 pt-4 text-xs text-muted-foreground sm:px-6",
				children: "Dry Hire and Partnerships sit on their own pipelines — switch them from the board."
			})
		]
	});
}
//#endregion
export { ForecastPage as component };
