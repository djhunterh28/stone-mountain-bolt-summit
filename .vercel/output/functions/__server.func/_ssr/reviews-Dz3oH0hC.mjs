import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as getReviews, R as routeReview, X as PageHeader, ut as Button } from "./router-Bkw81Fhc.mjs";
import { t as Badge } from "./badge-BQYjLRpy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reviews-Dz3oH0hC.js
var import_jsx_runtime = require_jsx_runtime();
var PLATFORMS = [
	"google",
	"yelp",
	"facebook",
	"weddingwire",
	"theknot",
	"zola",
	"wordpress-draft"
];
function ReviewsPage() {
	const rows = useQuery({
		queryKey: ["reviews"],
		queryFn: () => getReviews()
	});
	const qc = useQueryClient();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Reviews",
			subtitle: "Ask after the show. Client replies here, then we point them at the platform that counts. Directory profile updates itself."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mx-4 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)] sm:mx-6",
			children: (rows.data ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "space-y-2 px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium",
								children: r.author
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: [
									r.stars,
									"★ · ",
									r.deal
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: r.status === "published" ? "success" : "outline",
								children: r.status
							}),
							r.platform && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "steel",
								children: r.platform
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: r.body
					}),
					r.status !== "published" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1",
						children: PLATFORMS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => routeReview({ data: {
								id: r.id,
								platform: p
							} }).then(() => {
								toast.success(p === "wordpress-draft" ? "Staged as a WordPress draft" : `Recorded ${p}`);
								qc.invalidateQueries({ queryKey: ["reviews"] });
							}),
							children: p
						}, p))
					})
				]
			}, r.id))
		})]
	});
}
//#endregion
export { ReviewsPage as component };
