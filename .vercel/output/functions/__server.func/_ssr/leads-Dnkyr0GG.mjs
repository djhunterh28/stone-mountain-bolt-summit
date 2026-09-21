import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { In as listLeads, J as PageHeader, fr as useUi, lt as Button, wn as getBootstrap } from "./router-o_A6MRMh.mjs";
import { i as LeadKanban } from "./lifecycle-CJHg_KQl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leads-Dnkyr0GG.js
var import_jsx_runtime = require_jsx_runtime();
function LeadsPage() {
	const { setAddOpen } = useUi();
	const leads = useQuery({
		queryKey: ["leads"],
		queryFn: () => listLeads()
	});
	const pipe = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	}).data?.pipelines[0];
	const list = leads.data ?? [];
	const active = list.filter((l) => l.status !== "converted" && l.status !== "disqualified").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Leads inbox",
			subtitle: "Multi-stage: new → contacted → qualified → nurture or convert. Disqualify what is not our work.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-xs text-muted-foreground",
				children: [active, " in play"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				onClick: () => setAddOpen(true, "lead"),
				children: "New lead"
			})] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-4 sm:px-6",
			children: leads.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-12 text-sm text-muted-foreground",
				children: "Loading the inbox…"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeadKanban, {
				leads: list,
				pipeline: pipe
			})
		})]
	});
}
//#endregion
export { LeadsPage as component };
