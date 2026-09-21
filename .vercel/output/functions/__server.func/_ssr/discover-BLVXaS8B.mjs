import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { X as PageHeader, ut as Button, y as getDirectory } from "./router-Bkw81Fhc.mjs";
import { t as Badge } from "./badge-BQYjLRpy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/discover-BLVXaS8B.js
var import_jsx_runtime = require_jsx_runtime();
function DiscoverPage() {
	const v = useQuery({
		queryKey: ["directory"],
		queryFn: () => getDirectory()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Directory",
			subtitle: "Fair rotation of event vendors. Availability from their calendar. Inquire without creating an account."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
		})]
	});
}
//#endregion
export { DiscoverPage as component };
