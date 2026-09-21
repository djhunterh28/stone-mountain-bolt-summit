import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { o as formatDateTime } from "./utils-DLVA4J7b.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { Mn as listDeals, Nn as listDocuments, X as PageHeader, at as SelectTrigger, hn as advanceDocument, it as SelectItem, lt as Input, nt as Select, ot as SelectValue, rt as SelectContent, st as Textarea, ut as Button, yn as createDocument } from "./router-Bkw81Fhc.mjs";
import { t as Badge } from "./badge-BQYjLRpy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/documents-BdFuaTjF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var VARIANT = {
	draft: "outline",
	sent: "steel",
	viewed: "warn",
	signed: "success",
	declined: "danger"
};
function DocsPage() {
	const docs = useQuery({
		queryKey: ["documents"],
		queryFn: () => listDocuments()
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
		} })
	});
	const qc = useQueryClient();
	const [template, setTemplate] = (0, import_react.useState)("proposal");
	const [dealId, setDealId] = (0, import_react.useState)("none");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Smart Docs",
				subtitle: "Proposals, production agreements, and COIs — tracked and e-signed."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mx-4 mb-6 space-y-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:mx-6",
				onSubmit: (e) => {
					e.preventDefault();
					const fd = new FormData(e.currentTarget);
					createDocument({ data: {
						name: String(fd.get("name") || "Untitled document"),
						template,
						content: String(fd.get("content") || ""),
						dealId: dealId && dealId !== "none" ? Number(dealId) : null
					} }).then(() => {
						toast.success("Document created");
						qc.invalidateQueries({ queryKey: ["documents"] });
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "name",
								placeholder: "Document name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: template,
								onValueChange: setTemplate,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
									"proposal",
									"contract",
									"coi",
									"rider"
								].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: t,
									children: t
								}, t)) })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: dealId,
								onValueChange: setDealId,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Link a deal" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "none",
									children: "No deal"
								}), (deals.data ?? []).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: String(d.id),
									children: d.title
								}, d.id))] })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						name: "content",
						placeholder: "Body / terms",
						rows: 3
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "sm",
						children: "Create draft"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border border-t border-border",
				children: (docs.data ?? []).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium",
								children: d.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									d.template,
									" · ",
									d.dealTitle ?? "Unlinked",
									" · ",
									formatDateTime(d.createdAt)
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: VARIANT[d.status] ?? "outline",
							children: d.status
						}),
						d.status === "draft" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "secondary",
							onClick: () => act(d.id, "send"),
							children: "Send"
						}),
						d.status === "sent" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "secondary",
							onClick: () => act(d.id, "view"),
							children: "Mark viewed"
						}),
						(d.status === "sent" || d.status === "viewed") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								variant: "secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/sign/$docId",
									params: { docId: String(d.id) },
									children: "Open e-sign"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: () => act(d.id, "sign"),
								children: "E-sign"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => act(d.id, "decline"),
								children: "Decline"
							})
						] })
					]
				}, d.id))
			})
		]
	});
	function act(id, action) {
		advanceDocument({ data: {
			id,
			action
		} }).then(() => {
			toast.success(action === "sign" ? "Signed" : "Updated");
			qc.invalidateQueries({ queryKey: ["documents"] });
		});
	}
}
//#endregion
export { DocsPage as component };
