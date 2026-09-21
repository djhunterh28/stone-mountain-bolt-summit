import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { s as formatUsd } from "./utils-DLVA4J7b.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { Mn as listDeals, V as sendHandoff, X as PageHeader, lt as Input, ut as Button, w as getHandoffs } from "./router-Bkw81Fhc.mjs";
import { t as Badge } from "./badge-BQYjLRpy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/handoff-BPs4XeLO.js
var import_jsx_runtime = require_jsx_runtime();
function HandoffPage() {
	const rows = useQuery({
		queryKey: ["handoffs"],
		queryFn: () => getHandoffs()
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
	const qc = useQueryClient();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Event hand-off",
				subtitle: "Sub-contract or emergency transfer. Production data only — financials stay here. Monitor stays on."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mx-4 mb-4 flex flex-wrap gap-2 sm:mx-6",
				onSubmit: (e) => {
					e.preventDefault();
					const fd = new FormData(e.currentTarget);
					sendHandoff({ data: {
						dealId: Number(fd.get("dealId")),
						to: String(fd.get("to")),
						monitor: true
					} }).then(() => {
						toast.success("Packed without invoices or rates");
						qc.invalidateQueries({ queryKey: ["handoffs"] });
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						name: "dealId",
						className: "h-9 rounded-md border border-input bg-background px-2 text-sm",
						children: (deals.data ?? []).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: d.id,
							children: d.title
						}, d.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "to",
						placeholder: "Receiving company",
						className: "w-56",
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "sm",
						children: "Hand off"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mx-4 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)] sm:mx-6",
				children: (rows.data ?? []).map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-center gap-3 px-4 py-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [h.deal, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"to ",
									h.to,
									" · house value ",
									formatUsd(h.value),
									" not sent"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							children: h.finance ? "includes $ " : "no financials"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: h.monitor ? "success" : "outline",
							children: h.monitor ? "monitoring" : h.status
						})
					]
				}, h.id))
			})
		]
	});
}
//#endregion
export { HandoffPage as component };
