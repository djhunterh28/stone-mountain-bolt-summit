import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as createSandboxField, g as promoteSandboxField, h as promoteSandboxAutomation, i as createSandboxAutomation, p as listSandbox } from "./governance-rJzhZAi0.mjs";
import { J as FlaskConical } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { X as PageHeader, lt as Input, ut as Button } from "./router-Bkw81Fhc.mjs";
import { t as Badge } from "./badge-BQYjLRpy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sandbox-C2yIBbAW.js
var import_jsx_runtime = require_jsx_runtime();
function SandboxPage() {
	const data = useQuery({
		queryKey: ["sandbox"],
		queryFn: () => listSandbox()
	});
	const qc = useQueryClient();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Sandbox",
				subtitle: "Try custom fields and automations here. Promote only when they are ready for the live book."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-4 mb-6 flex items-start gap-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:mx-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlaskConical, { className: "mt-0.5 size-4 shrink-0 text-steel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Sandbox never touches live deals, mail, or production agreements. Promote copies the object into the workspace under Ultimate caps (500 fields, 500 automations)."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 px-4 sm:px-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-3 text-sm font-medium",
						children: "Custom fields"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mb-3 flex flex-wrap gap-2",
						onSubmit: (e) => {
							e.preventDefault();
							const fd = new FormData(e.currentTarget);
							createSandboxField({ data: {
								name: String(fd.get("name") || "Untitled field"),
								entity: String(fd.get("entity") || "deal"),
								fieldType: String(fd.get("type") || "text")
							} }).then(() => {
								toast.success("Field in sandbox");
								qc.invalidateQueries({ queryKey: ["sandbox"] });
								e.currentTarget.reset();
							});
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "name",
								placeholder: "Field name",
								className: "w-40"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "entity",
								defaultValue: "deal",
								className: "w-28"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "type",
								defaultValue: "text",
								className: "w-24"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								size: "sm",
								children: "Add"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
						children: (data.data?.fields ?? []).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3 px-4 py-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: f.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [
										f.entity,
										" · ",
										f.fieldType
									]
								})]
							}), f.promoted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "success",
								children: "live"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: () => promoteSandboxField({ data: { id: f.id } }).then((r) => {
									if (!r.ok) toast.error(r.error ?? "Blocked");
									else toast.success("Promoted to live fields");
									qc.invalidateQueries({ queryKey: ["sandbox"] });
									qc.invalidateQueries({ queryKey: ["fields"] });
									qc.invalidateQueries({ queryKey: ["usage"] });
								}),
								children: "Promote"
							})]
						}, f.id))
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-3 text-sm font-medium",
						children: "Automations"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mb-3 flex flex-wrap gap-2",
						onSubmit: (e) => {
							e.preventDefault();
							const fd = new FormData(e.currentTarget);
							createSandboxAutomation({ data: {
								name: String(fd.get("name") || "Untitled workflow"),
								triggerType: String(fd.get("trigger") || "deal.won"),
								actionType: String(fd.get("action") || "activity.create")
							} }).then(() => {
								toast.success("Workflow in sandbox");
								qc.invalidateQueries({ queryKey: ["sandbox"] });
								e.currentTarget.reset();
							});
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "name",
								placeholder: "Workflow name",
								className: "w-44"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "trigger",
								defaultValue: "deal.won",
								className: "w-32"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "action",
								defaultValue: "activity.create",
								className: "w-36"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								size: "sm",
								children: "Add"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
						children: (data.data?.automations ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3 px-4 py-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: a.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [
										a.triggerType,
										" → ",
										a.actionType
									]
								})]
							}), a.promoted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "success",
								children: "live"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: () => promoteSandboxAutomation({ data: { id: a.id } }).then((r) => {
									if (!r.ok) toast.error(r.error ?? "Blocked");
									else toast.success("Promoted to live automations");
									qc.invalidateQueries({ queryKey: ["sandbox"] });
									qc.invalidateQueries({ queryKey: ["automations"] });
									qc.invalidateQueries({ queryKey: ["usage"] });
								}),
								children: "Promote"
							})]
						}, a.id))
					})
				] })]
			})
		]
	});
}
//#endregion
export { SandboxPage as component };
