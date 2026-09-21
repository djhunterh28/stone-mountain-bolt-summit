import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { kt as getProposalPublic, o as Route$7, ut as Button } from "./router-Bkw81Fhc.mjs";
import { t as Badge } from "./badge-BQYjLRpy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/p._token-Be8d2eKA.js
var import_jsx_runtime = require_jsx_runtime();
function PublicProposal() {
	const { token } = Route$7.useParams();
	const q = useQuery({
		queryKey: ["proposal", token],
		queryFn: () => getProposalPublic({ data: { token } })
	});
	const p = q.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto min-h-dvh max-w-2xl px-5 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase",
				children: "Northline proposal"
			}),
			!p && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: q.isLoading ? "Loading…" : "Not found."
			}),
			p && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-semibold tracking-tight",
						children: p.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						children: p.status
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
					className: "mt-6 whitespace-pre-wrap rounded-xl bg-card p-5 text-sm leading-relaxed shadow-[var(--shadow-border)]",
					children: p.body
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/contact",
						children: "Request a signature"
					})
				})
			] })
		]
	});
}
//#endregion
export { PublicProposal as component };
