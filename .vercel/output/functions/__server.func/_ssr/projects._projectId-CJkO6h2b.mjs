import { o as __toESM } from "../_runtime.mjs";
import { f as saveBase64File, i as formatDate, r as formatBytes, t as cn } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { Ot as ArrowLeft } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as TabsList, Dn as getProject, Dt as getPortalProject, Q as TabsContent, Yn as moveTask, Z as Tabs, bt as downloadPortalFile, c as Route$9, ct as Input, et as TabsTrigger, ft as addProjectRequest, lt as Button, ot as Textarea, pn as addTask, rn as toggleProjectNote } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projects._projectId-CJkO6h2b.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLS = [
	"To do",
	"In progress",
	"Done"
];
function ProjectBoard() {
	const { projectId } = Route$9.useParams();
	const id = Number(projectId);
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["project", id],
		queryFn: () => getProject({ data: { id } })
	});
	const portal = useQuery({
		queryKey: ["portal-project", id],
		queryFn: () => getPortalProject({ data: { id } })
	});
	const [title, setTitle] = (0, import_react.useState)("");
	const [reqTitle, setReqTitle] = (0, import_react.useState)("");
	const [reqBody, setReqBody] = (0, import_react.useState)("");
	if (!q.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "p-6 text-sm text-muted-foreground",
		children: "Loading…"
	});
	const { project, tasks } = q.data;
	const portalP = portal.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-[calc(100dvh-3.5rem)] flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 border-b border-border px-4 py-3 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "icon-sm",
					variant: "ghost",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/projects",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "truncate text-base font-semibold",
						children: project.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							project.venue,
							" · ",
							formatDate(project.startDate),
							" – ",
							formatDate(project.endDate),
							portalP ? ` · ${portalP.project.stageLabel}` : ""
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: project.status === "done" ? "success" : "steel",
					children: portalP?.project.stageLabel ?? project.status
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "board",
			className: "flex min-h-0 flex-1 flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-b border-border px-4 sm:px-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "my-2 flex h-auto flex-wrap",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "board",
								children: "Board"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "files",
								children: "Files"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "billing",
								children: "Billing"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "digital",
								children: "Digital"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "notes",
								children: "Notes"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "requests",
								children: "Requests"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "board",
					className: "mt-0 flex min-h-0 flex-1 flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "flex gap-2 px-4 py-3 sm:px-6",
						onSubmit: (e) => {
							e.preventDefault();
							if (!title.trim()) return;
							addTask({ data: {
								projectId: id,
								title: title.trim()
							} }).then(() => {
								setTitle("");
								qc.invalidateQueries({ queryKey: ["project", id] });
							});
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: title,
							onChange: (e) => setTitle(e.target.value),
							placeholder: "Add a production task"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							variant: "secondary",
							children: "Add"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex min-h-0 flex-1 gap-3 overflow-x-auto px-4 pb-6 sm:px-6",
						children: COLS.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "kanban-col flex flex-col rounded-xl bg-card p-2 shadow-[var(--shadow-border)]",
							onDragOver: (e) => e.preventDefault(),
							onDrop: (e) => {
								const taskId = Number(e.dataTransfer.getData("text/task-id"));
								if (taskId) moveTask({ data: {
									id: taskId,
									columnName: col
								} }).then(() => qc.invalidateQueries({ queryKey: ["project", id] }));
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "px-2 py-2 text-sm font-medium",
								children: col
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-col gap-2",
								children: tasks.filter((t) => t.columnName === col).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
									draggable: true,
									onDragStart: (e) => e.dataTransfer.setData("text/task-id", String(t.id)),
									className: cn("rounded-lg bg-background p-3 text-sm shadow-[var(--shadow-border)]"),
									children: [t.title, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 text-[11px] text-muted-foreground",
										children: t.assigneeName
									})]
								}, t.id))
							})]
						}, col))
					})]
				}),
				[
					"files",
					"billing",
					"digital"
				].map((folder) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: folder,
					className: "mt-0 overflow-auto px-4 py-4 sm:px-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
						children: [(portalP?.files ?? []).filter((f) => f.folder === folder).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "flex items-center justify-between gap-2 px-4 py-3 text-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "text-left hover:underline",
								onClick: () => downloadPortalFile({ data: { id: f.id } }).then((r) => {
									if (r.ok) saveBase64File(r.filename, r.contentB64, r.mime);
								}),
								children: [f.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-xs text-muted-foreground",
									children: formatBytes(f.sizeBytes)
								})]
							})
						}, f.id)), (portalP?.files ?? []).filter((f) => f.folder === folder).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "px-4 py-6 text-sm text-muted-foreground",
							children: "Nothing in this folder."
						})]
					})
				}, folder)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "notes",
					className: "mt-0 overflow-auto px-4 py-4 sm:px-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-3",
						children: (portalP?.notes ?? []).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-xl bg-card p-4 text-sm shadow-[var(--shadow-border)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: n.body }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center justify-between text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: n.author }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "underline",
									onClick: () => toggleProjectNote({ data: {
										id: n.id,
										visible: !n.visible
									} }).then(() => qc.invalidateQueries({ queryKey: ["portal-project", id] })),
									children: n.visible ? "Hide" : "Show"
								})]
							})]
						}, n.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "requests",
					className: "mt-0 overflow-auto px-4 py-4 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mb-4 space-y-2",
						onSubmit: (e) => {
							e.preventDefault();
							addProjectRequest({ data: {
								projectId: id,
								title: reqTitle,
								body: reqBody
							} }).then(() => {
								setReqTitle("");
								setReqBody("");
								toast.success("Request filed");
								qc.invalidateQueries({ queryKey: ["portal-project", id] });
							});
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: reqTitle,
								onChange: (e) => setReqTitle(e.target.value),
								placeholder: "Request",
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: reqBody,
								onChange: (e) => setReqBody(e.target.value),
								placeholder: "Details"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								size: "sm",
								children: "Submit request"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: (portalP?.requests ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-xl bg-card p-4 text-sm shadow-[var(--shadow-border)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: r.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground",
									children: r.body
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "mt-2",
									children: r.status
								})
							]
						}, r.id))
					})]
				})
			]
		})]
	});
}
//#endregion
export { ProjectBoard as component };
