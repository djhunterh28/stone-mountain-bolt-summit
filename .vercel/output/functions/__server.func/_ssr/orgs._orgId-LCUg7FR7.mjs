import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { c as formatUsdFull } from "./utils-DLVA4J7b.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { X as PageHeader, s as Route$8, ut as Button } from "./router-Bkw81Fhc.mjs";
import { t as Badge } from "./badge-BQYjLRpy.mjs";
import { c as getOrgDetail, i as enrichRecord } from "./ultimate-JaIPPjEW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orgs._orgId-LCUg7FR7.js
var import_jsx_runtime = require_jsx_runtime();
function OrgPage() {
	const { orgId } = Route$8.useParams();
	const id = Number(orgId);
	const detail = useQuery({
		queryKey: ["org", id],
		queryFn: () => getOrgDetail({ data: { id } })
	});
	const qc = useQueryClient();
	const d = detail.data;
	if (!d) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "px-6 py-10 text-sm text-muted-foreground",
		children: detail.isLoading ? "Loading…" : "Organization not found."
	});
	const o = d.org;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: o.name,
			subtitle: [
				o.industry,
				o.city,
				o.address
			].filter(Boolean).join(" · "),
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "secondary",
				onClick: () => enrichRecord({ data: {
					kind: "org",
					id: o.id
				} }).then((r) => {
					if (r.ok) toast.success("Firmographic enrichment applied");
					qc.invalidateQueries({ queryKey: ["org", id] });
					qc.invalidateQueries({ queryKey: ["orgs"] });
				}),
				children: "Enrich"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 px-4 sm:px-6 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "space-y-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Website",
							value: o.website
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Phone",
							value: o.phone
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Owner",
							value: o.ownerName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Employees",
							value: o.employees
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Revenue band",
							value: o.revenueBand
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Open pipeline",
							value: formatUsdFull(o.dealValue)
						})
					]
				}), o.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted-foreground",
					children: o.notes
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "lg:col-span-2 space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase",
					children: "People"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
					children: d.people.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/contacts/$personId",
						params: { personId: String(p.id) },
						className: "flex items-center justify-between px-4 py-3 text-sm hover:bg-accent/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [p.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground",
							children: [" · ", p.title ?? "—"]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: p.email
						})]
					}) }, p.id))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase",
					children: "Deals"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
					children: d.deals.map((deal) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/deals/$dealId",
						params: { dealId: String(deal.id) },
						className: "flex items-center justify-between gap-3 px-4 py-3 hover:bg-accent/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm",
							children: deal.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: deal.venue
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: deal.status === "open" ? "outline" : deal.status === "won" ? "success" : "danger",
								children: deal.status
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-sm tabular-nums",
								children: formatUsdFull(deal.value)
							})]
						})]
					}) }, deal.id))
				})] })]
			})]
		})]
	});
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-xs text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: value || "—" })] });
}
//#endregion
export { OrgPage as component };
