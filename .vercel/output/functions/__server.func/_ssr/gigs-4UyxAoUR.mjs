import { o as formatUsd } from "./utils-BjcRTCQS.mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { J as PageHeader, T as getGigs, _ as awardGig, lt as Button } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gigs-4UyxAoUR.js
var import_jsx_runtime = require_jsx_runtime();
function GigsPage() {
	const data = useQuery({
		queryKey: ["gigs"],
		queryFn: () => getGigs()
	});
	const qc = useQueryClient();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Freelance gigs",
			subtitle: "Open calls hide dates that conflict. Award from bio and stars. No financials leave the house."
		}), (data.data?.gigs ?? []).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-4 mb-6 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:mx-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: g.role
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							children: g.deal
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: g.status === "open" ? "success" : "steel",
							children: g.status
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground",
							children: [formatUsd(g.dayRate), " / day"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: g.notes
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 divide-y divide-border",
					children: (data.data?.apps ?? []).filter((a) => a.gigId === g.id).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center gap-3 py-2.5 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: a.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-2 text-xs text-muted-foreground",
									children: [
										a.stars,
										" ★ · ",
										a.bio
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: a.status
							}),
							a.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: () => awardGig({ data: {
									appId: a.id,
									accept: true
								} }).then(() => {
									toast.success("Onboarded");
									qc.invalidateQueries({ queryKey: ["gigs"] });
								}),
								children: "Award"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => awardGig({ data: {
									appId: a.id,
									accept: false
								} }).then(() => qc.invalidateQueries({ queryKey: ["gigs"] })),
								children: "Decline"
							})] })
						]
					}, a.id))
				})
			]
		}, g.id))]
	});
}
//#endregion
export { GigsPage as component };
