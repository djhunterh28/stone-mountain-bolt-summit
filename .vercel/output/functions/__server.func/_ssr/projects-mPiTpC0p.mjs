import { d as useRouterState, m as Outlet, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as formatDate, s as formatUsd } from "./utils-DLVA4J7b.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { X as PageHeader, zt as listPortalProjects } from "./router-Bkw81Fhc.mjs";
import { t as Badge } from "./badge-BQYjLRpy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projects-mPiTpC0p.js
var import_jsx_runtime = require_jsx_runtime();
function ProjectsLayout() {
	if (useRouterState({ select: (s) => s.location.pathname !== "/projects" && s.location.pathname.startsWith("/projects/") })) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectsPage, {});
}
function ProjectsPage() {
	const projects = useQuery({
		queryKey: ["portal-projects"],
		queryFn: () => listPortalProjects()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Projects",
		subtitle: "Synced from Pipedrive — Estimate & Agreement Sent, On Hold, and Signed/Invoiced."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-3 px-4 pb-10 sm:grid-cols-2 sm:px-6 xl:grid-cols-3",
		children: (projects.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/projects/$projectId",
			params: { projectId: String(p.id) },
			className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)] transition-shadow hover:shadow-[var(--shadow-border-hover)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: p.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: p.status === "done" ? "success" : "steel",
						children: p.stageLabel
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: [
						p.venue ?? "Shop",
						" · ",
						p.tenantName ?? "House",
						" · ",
						formatUsd(p.value)
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 h-1.5 overflow-hidden rounded-full bg-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-primary",
						style: { width: `${p.taskCount ? Math.round(p.doneCount / p.taskCount * 100) : 0}%` }
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-xs text-muted-foreground",
					children: [
						p.doneCount,
						"/",
						p.taskCount,
						" done · ",
						formatDate(p.endDate)
					]
				})
			]
		}, p.id))
	})] });
}
//#endregion
export { ProjectsLayout as component };
