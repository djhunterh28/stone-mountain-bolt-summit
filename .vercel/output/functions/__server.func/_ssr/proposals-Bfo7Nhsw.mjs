import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { Bt as listProposals, X as PageHeader, lt as Input, st as Textarea, ur as useUi, ut as Button, yt as createProposal } from "./router-Bkw81Fhc.mjs";
import { t as Badge } from "./badge-BQYjLRpy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/proposals-Bfo7Nhsw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProposalsPage() {
	const list = useQuery({
		queryKey: ["proposals"],
		queryFn: () => listProposals()
	});
	const qc = useQueryClient();
	const setDirty = useUi((s) => s.setDirty);
	const [title, setTitle] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Proposals",
				subtitle: "Rich production proposals with shareable view tokens and e-sign handoff."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mx-4 mb-6 space-y-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:mx-6",
				onSubmit: (e) => {
					e.preventDefault();
					createProposal({ data: {
						title,
						body
					} }).then((r) => {
						setDirty(false);
						setTitle("");
						setBody("");
						toast.success(`Public link /p/${r.token}`);
						qc.invalidateQueries({ queryKey: ["proposals"] });
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: title,
						onChange: (e) => {
							setTitle(e.target.value);
							setDirty(true);
						},
						placeholder: "Proposal title",
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						rows: 6,
						value: body,
						onChange: (e) => {
							setBody(e.target.value);
							setDirty(true);
						},
						placeholder: "Scope, labor, LED, audio, power…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Save draft"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border border-t border-border",
				children: (list.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium",
						children: p.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground",
						children: [
							p.dealTitle ?? "Unlinked",
							" · ",
							p.body.slice(0, 80)
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: p.status === "viewed" ? "warn" : p.status === "signed" ? "success" : "outline",
							children: p.status
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							variant: "ghost",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/p/$token",
								params: { token: p.token },
								children: "Open"
							})
						})]
					})]
				}, p.id))
			})
		]
	});
}
//#endregion
export { ProposalsPage as component };
