import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { Vn as listProspects, X as PageHeader, lt as Input, pn as addProspect, ur as useUi, ut as Button } from "./router-Bkw81Fhc.mjs";
import { t as Badge } from "./badge-BQYjLRpy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/prospector-CBQC7JeZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProspectorPage() {
	const list = useQuery({
		queryKey: ["prospects"],
		queryFn: () => listProspects()
	});
	const qc = useQueryClient();
	const { memberId } = useUi();
	const [q, setQ] = (0, import_react.useState)("");
	const rows = (list.data ?? []).filter((p) => `${p.name} ${p.industry ?? ""} ${p.city ?? ""}`.toLowerCase().includes(q.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Prospector",
			subtitle: "NYC venues and brands with contact enrichment. 500 credits on Ultimate.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: q,
				onChange: (e) => setQ(e.target.value),
				placeholder: "Search the graph",
				className: "h-9 w-52"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y divide-border border-t border-border",
			children: rows.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium",
						children: p.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							p.industry,
							" · ",
							p.city,
							" · ",
							p.employees,
							" · ",
							p.email
						]
					})]
				}), p.added ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "success",
					children: "In CRM"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "secondary",
					onClick: () => addProspect({ data: {
						id: p.id,
						ownerId: memberId
					} }).then(() => {
						toast.success("Added as lead");
						qc.invalidateQueries({ queryKey: ["prospects"] });
						qc.invalidateQueries({ queryKey: ["leads"] });
						qc.invalidateQueries({ queryKey: ["orgs"] });
					}),
					children: "Add + enrich"
				})]
			}, p.id))
		})]
	});
}
//#endregion
export { ProspectorPage as component };
