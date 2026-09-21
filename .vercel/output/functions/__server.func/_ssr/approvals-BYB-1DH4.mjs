import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { Mt as listApprovals, X as PageHeader, _t as createApproval, bt as decideApproval, lt as Input, st as Textarea, ut as Button } from "./router-Bkw81Fhc.mjs";
import { t as Badge } from "./badge-BQYjLRpy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/approvals-BYB-1DH4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ApprovalsPage() {
	const qc = useQueryClient();
	const list = useQuery({
		queryKey: ["approvals"],
		queryFn: () => listApprovals()
	});
	const [title, setTitle] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)({});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Approvals",
				subtitle: "Plots, load-in windows, and brand CAD — decide in the card."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mx-4 mb-6 space-y-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:mx-6",
				onSubmit: (e) => {
					e.preventDefault();
					createApproval({ data: {
						title,
						body
					} }).then(() => {
						setTitle("");
						setBody("");
						qc.invalidateQueries({ queryKey: ["approvals"] });
						toast.success("Request sent");
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: title,
						onChange: (e) => setTitle(e.target.value),
						placeholder: "Approval title",
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: body,
						onChange: (e) => setBody(e.target.value),
						placeholder: "What needs a sign-off?",
						rows: 3
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "sm",
						children: "Create request"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 px-4 sm:grid-cols-2 sm:px-6 xl:grid-cols-3",
				children: (list.data ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium",
								children: a.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: a.status === "approved" ? "success" : a.status === "rejected" ? "danger" : "warn",
								children: a.status
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: a.body
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-xs text-muted-foreground",
							children: [
								a.projectName ?? "House",
								" · ",
								a.requestedBy
							]
						}),
						a.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: note[a.id] ?? "",
								onChange: (e) => setNote((n) => ({
									...n,
									[a.id]: e.target.value
								})),
								placeholder: "Decision note"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									onClick: () => decideApproval({ data: {
										id: a.id,
										status: "approved",
										note: note[a.id]
									} }).then(() => qc.invalidateQueries({ queryKey: ["approvals"] })),
									children: "Approve"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "secondary",
									onClick: () => decideApproval({ data: {
										id: a.id,
										status: "rejected",
										note: note[a.id]
									} }).then(() => qc.invalidateQueries({ queryKey: ["approvals"] })),
									children: "Reject"
								})]
							})]
						})
					]
				}, a.id))
			})
		]
	});
}
//#endregion
export { ApprovalsPage as component };
