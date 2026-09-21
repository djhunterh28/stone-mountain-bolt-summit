import { i as formatDate } from "./utils-BjcRTCQS.mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as getDirectory, J as PageHeader, lt as Button } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { r as getDirectoryProfile } from "./reviews-CPfUIDme.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/discover-Z-dS5kPt.js
var import_jsx_runtime = require_jsx_runtime();
function DiscoverPage() {
	const v = useQuery({
		queryKey: ["directory"],
		queryFn: () => getDirectory()
	});
	const p = useQuery({
		queryKey: ["directory-profile"],
		queryFn: () => getDirectoryProfile()
	}).data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Directory",
				subtitle: "Zenvents profile plus a fair rotation of event vendors. Reviews land here automatically."
			}),
			p && p.n > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "mx-4 mb-6 rounded-xl bg-card p-5 shadow-[var(--shadow-border)] sm:mx-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-baseline gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium",
								children: "Hurricane Productions"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "steel",
								children: [
									p.avg,
									"★ · ",
									p.n,
									" reviews"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: "Zenvents"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Brooklyn · Full production. Reviews publish here the moment the client submits."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 divide-y divide-border",
						children: p.reviews.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: r.author
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-2 text-xs text-muted-foreground",
									children: [
										r.stars,
										"★ · ",
										r.deal,
										r.at ? ` · ${formatDate(r.at)}` : ""
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: r.body
							})]
						}, `${r.author}-${i}`))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3",
				children: (v.data ?? []).map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium",
								children: x.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: x.available ? "success" : "outline",
								children: x.available ? "open" : "held"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [
								x.category,
								" · ",
								x.city
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: x.blurb
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							className: "mt-3",
							variant: "secondary",
							onClick: () => toast.success(`Inquiry logged for ${x.name}`),
							children: "Inquire"
						})
					]
				}, x.id))
			})
		]
	});
}
//#endregion
export { DiscoverPage as component };
