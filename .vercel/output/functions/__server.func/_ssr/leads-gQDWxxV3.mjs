import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as formatDate } from "./utils-DLVA4J7b.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { In as listLeads, X as PageHeader, _n as convertLead, dt as MemberAvatar, or as updateLead, ur as useUi, ut as Button, wn as getBootstrap } from "./router-Bkw81Fhc.mjs";
import { t as Badge } from "./badge-BQYjLRpy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leads-gQDWxxV3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LeadsPage() {
	const qc = useQueryClient();
	const navigate = useNavigate();
	const { setAddOpen } = useUi();
	const leads = useQuery({
		queryKey: ["leads"],
		queryFn: () => listLeads()
	});
	const boot = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	const [filter, setFilter] = (0, import_react.useState)("all");
	const pipe = boot.data?.pipelines[0];
	const convert = useMutation({
		mutationFn: (id) => convertLead({ data: {
			id,
			pipelineId: pipe?.id ?? 1,
			stageId: pipe?.stages[0]?.id ?? 1
		} }),
		onSuccess: (r) => {
			toast.success("Converted to deal");
			qc.invalidateQueries({ queryKey: ["leads"] });
			qc.invalidateQueries({ queryKey: ["deals"] });
			if (r.id) navigate({
				to: "/deals/$dealId",
				params: { dealId: String(r.id) }
			});
		}
	});
	const list = (leads.data ?? []).filter((l) => filter === "all" || l.status === filter);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Leads inbox",
		subtitle: "Qualify inbound from forms, chat, prospector, and referrals.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-1",
			children: [
				"all",
				"new",
				"contacted",
				"qualified"
			].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: filter === s ? "secondary" : "ghost",
				onClick: () => setFilter(s),
				children: s
			}, s))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			size: "sm",
			onClick: () => setAddOpen(true, "lead"),
			children: "New lead"
		})] })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "divide-y divide-border border-t border-border",
		children: [list.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium",
								children: l.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: l.score >= 70 ? "success" : l.score >= 50 ? "steel" : "outline",
								children: ["Score ", l.score]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: l.source
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-0.5 text-xs text-muted-foreground",
						children: [
							l.personName ?? "Unknown person",
							l.orgName ? ` · ${l.orgName}` : "",
							l.labels ? ` · ${l.labels}` : "",
							"· ",
							formatDate(l.createdAt)
						]
					}),
					l.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 line-clamp-2 text-sm text-muted-foreground",
						children: l.notes
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					l.ownerInitials && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemberAvatar, {
						initials: l.ownerInitials,
						tone: l.ownerTone,
						size: "sm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: () => updateLead({ data: {
							id: l.id,
							status: "contacted"
						} }).then(() => qc.invalidateQueries({ queryKey: ["leads"] })),
						children: "Contacted"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "secondary",
						onClick: () => convert.mutate(l.id),
						children: "Convert"
					})
				]
			})]
		}, l.id)), list.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "px-6 py-12 text-sm text-muted-foreground",
			children: "Inbox is clear."
		})]
	})] });
}
//#endregion
export { LeadsPage as component };
