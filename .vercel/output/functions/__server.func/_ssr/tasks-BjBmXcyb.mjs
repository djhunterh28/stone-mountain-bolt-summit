import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { Ht as listTaskLists, Kt as mutateTask, X as PageHeader, lt as Input, ut as Button } from "./router-Bkw81Fhc.mjs";
import { t as Checkbox } from "./checkbox-70uQ6DSL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tasks-BjBmXcyb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TasksPage() {
	const qc = useQueryClient();
	const lists = useQuery({
		queryKey: ["task-lists"],
		queryFn: () => listTaskLists()
	});
	const [listName, setListName] = (0, import_react.useState)("");
	const [item, setItem] = (0, import_react.useState)({});
	const refresh = () => qc.invalidateQueries({ queryKey: ["task-lists"] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Task lists",
				subtitle: "Show-ready checklists. Attachments live on the project files tab."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mb-6 flex gap-2 px-4 sm:px-6",
				onSubmit: (e) => {
					e.preventDefault();
					mutateTask({ data: {
						op: "addList",
						name: listName || "Checklist"
					} }).then(() => {
						setListName("");
						refresh();
					});
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: listName,
					onChange: (e) => setListName(e.target.value),
					placeholder: "New list",
					className: "max-w-xs"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					variant: "secondary",
					children: "Add list"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 px-4 sm:grid-cols-2 sm:px-6 xl:grid-cols-3",
				children: (lists.data ?? []).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium",
								children: l.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "text-xs text-muted-foreground hover:text-foreground",
								onClick: () => mutateTask({ data: {
									op: "delList",
									id: l.id
								} }).then(refresh),
								children: "Delete"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-2",
							children: l.items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
										checked: i.done,
										onCheckedChange: () => mutateTask({ data: {
											op: "toggle",
											id: i.id
										} }).then(refresh)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: i.done ? "flex-1 text-sm text-muted-foreground line-through" : "flex-1 text-sm",
										children: i.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "text-xs text-muted-foreground",
										onClick: () => mutateTask({ data: {
											op: "delItem",
											id: i.id
										} }).then(refresh),
										children: "×"
									})
								]
							}, i.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "mt-3 flex gap-2",
							onSubmit: (e) => {
								e.preventDefault();
								mutateTask({ data: {
									op: "addItem",
									listId: l.id,
									title: item[l.id] || "Task"
								} }).then(() => {
									setItem((s) => ({
										...s,
										[l.id]: ""
									}));
									refresh();
								});
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: item[l.id] ?? "",
								onChange: (e) => setItem((s) => ({
									...s,
									[l.id]: e.target.value
								})),
								placeholder: "Add item"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								size: "sm",
								variant: "secondary",
								children: "Add"
							})]
						})
					]
				}, l.id))
			})
		]
	});
}
//#endregion
export { TasksPage as component };
