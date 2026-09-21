import { o as __toESM } from "../_runtime.mjs";
import { s as formatUsdFull } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { J as PageHeader, at as SelectValue, ct as Input, fr as useUi, it as SelectTrigger, lt as Button, nt as SelectContent, rt as SelectItem, tt as Select, wn as getBootstrap } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { m as listGoals, r as createGoal } from "./ultimate-DAnhRr51.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/goals-DTaeq2sn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GoalsPage() {
	const goals = useQuery({
		queryKey: ["goals"],
		queryFn: () => listGoals()
	});
	const boot = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	const qc = useQueryClient();
	const { memberId } = useUi();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [kind, setKind] = (0, import_react.useState)("revenue");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Goals",
				subtitle: "Revenue, won shows, and activity targets — the same toolkit as Pipedrive Insights goals.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					onClick: () => setOpen(!open),
					children: "New goal"
				})
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mx-4 mb-6 grid gap-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:mx-6 sm:grid-cols-2",
				onSubmit: (e) => {
					e.preventDefault();
					const fd = new FormData(e.currentTarget);
					const start = String(fd.get("start") || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
					const end = String(fd.get("end") || start);
					createGoal({ data: {
						name: String(fd.get("name") || "Untitled goal"),
						kind,
						target: Number(fd.get("target") || 0),
						periodStart: start,
						periodEnd: end,
						ownerId: memberId,
						pipelineId: boot.data?.pipelines[0]?.id ?? 1
					} }).then(() => {
						toast.success("Goal set");
						qc.invalidateQueries({ queryKey: ["goals"] });
						setOpen(false);
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "name",
						placeholder: "Goal name",
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: kind,
						onValueChange: setKind,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "revenue",
								children: "Won revenue"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "won_deals",
								children: "Won deals"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "activities",
								children: "Activities"
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "target",
						type: "number",
						placeholder: "Target",
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "start",
						type: "date",
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "end",
						type: "date",
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Save"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 px-4 sm:grid-cols-2 sm:px-6",
				children: (goals.data ?? []).map((g) => {
					const pct = g.target > 0 ? Math.min(100, Math.round(g.current / g.target * 100)) : 0;
					const money = g.kind === "revenue";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-sm font-medium",
									children: g.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										g.ownerName ?? "Team",
										" · ",
										g.pipelineName ?? "All pipelines"
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: pct >= 100 ? "success" : pct >= 60 ? "steel" : "outline",
									children: [pct, "%"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 h-1.5 overflow-hidden rounded-full bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full bg-primary",
									style: { width: `${pct}%` }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex justify-between font-mono text-sm tabular-nums",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money ? formatUsdFull(g.current) : g.current }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: money ? formatUsdFull(g.target) : g.target
								})]
							})
						]
					}, g.id);
				})
			})
		]
	});
}
//#endregion
export { GoalsPage as component };
