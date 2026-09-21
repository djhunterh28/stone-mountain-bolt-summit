import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { E as getGuests, J as PageHeader } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/guests-CBEGUaqn.js
var import_jsx_runtime = require_jsx_runtime();
function GuestsPage() {
	const g = useQuery({
		queryKey: ["guests"],
		queryFn: () => getGuests({ data: {} })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Guest lists",
			subtitle: "RSVP, meals, plus-ones. Clients get a token link — no account."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mx-4 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)] sm:mx-6",
			children: (g.data ?? []).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex flex-wrap items-center gap-3 px-4 py-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: row.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								row.deal,
								" · party of ",
								row.party,
								row.meal ? ` · ${row.meal}` : ""
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: row.rsvp === "yes" ? "success" : row.rsvp === "no" ? "warn" : "outline",
						children: row.rsvp
					}),
					row.token && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/rsvp/$token",
						params: { token: row.token },
						className: "text-xs text-muted-foreground underline-offset-4 hover:underline",
						children: "Guest link"
					})
				]
			}, row.id))
		})]
	});
}
//#endregion
export { GuestsPage as component };
