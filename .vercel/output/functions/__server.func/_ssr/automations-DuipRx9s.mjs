import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { J as PageHeader, ct as Input, jn as listAutomations, lt as Button, tr as toggleAutomation, vn as createAutomation } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { t as Switch } from "./switch-BLKjtJkd.mjs";
import { g as runAutomation } from "./ultimate-DAnhRr51.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/automations-DuipRx9s.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AutomationsPage() {
	const list = useQuery({
		queryKey: ["automations"],
		queryFn: () => listAutomations()
	});
	const qc = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Automations",
				subtitle: "500 active workflows, delays, and if/else branches — Ultimate ceiling.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					onClick: () => setOpen(!open),
					children: "New workflow"
				})
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mx-4 mb-4 grid gap-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:mx-6 sm:grid-cols-2",
				onSubmit: (e) => {
					e.preventDefault();
					const fd = new FormData(e.currentTarget);
					createAutomation({ data: {
						name: String(fd.get("name") || "Untitled"),
						triggerType: String(fd.get("triggerType") || "deal.stage"),
						triggerDetail: String(fd.get("triggerDetail") || ""),
						actionType: String(fd.get("actionType") || "activity.create"),
						actionDetail: String(fd.get("actionDetail") || "")
					} }).then((r) => {
						if (r && "error" in r && r.error) toast.error(r.error);
						else toast.success("Automation live");
						qc.invalidateQueries({ queryKey: ["automations"] });
						qc.invalidateQueries({ queryKey: ["usage"] });
						setOpen(false);
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "name",
						placeholder: "Name"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "triggerType",
						placeholder: "Trigger (deal.won, deal.rotting…)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "triggerDetail",
						placeholder: "Trigger detail"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "actionType",
						placeholder: "Action (email.template, project.create…)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "actionDetail",
						placeholder: "Action detail",
						className: "sm:col-span-2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Save"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border border-t border-border",
				children: (list.data ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: a.active,
							onCheckedChange: (v) => toggleAutomation({ data: {
								id: a.id,
								active: v
							} }).then(() => qc.invalidateQueries({ queryKey: ["automations"] }))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium",
								children: a.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"When ",
									a.triggerType,
									" ",
									a.triggerDetail ? `· ${a.triggerDetail}` : "",
									" → ",
									a.actionType,
									a.conditions ? ` if ${a.conditions}` : ""
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							children: [a.runs, " runs"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => runAutomation({ data: { id: a.id } }).then((r) => {
								toast.success(r.ok ? `Ran ${r.action}` : "Could not run");
								qc.invalidateQueries({ queryKey: ["automations"] });
								qc.invalidateQueries({ queryKey: ["activities"] });
							}),
							children: "Run now"
						})
					]
				}, a.id))
			})
		]
	});
}
//#endregion
export { AutomationsPage as component };
