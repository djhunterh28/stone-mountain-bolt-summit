import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as getPortalBrand } from "./brand-BeQEY2zF.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { Ot as getProposalPublic, Y as HpMark, l as Route$10 } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/p._token-DUhD4DJ1.js
var import_jsx_runtime = require_jsx_runtime();
function PublicProposal() {
	const { token } = Route$10.useParams();
	const q = useQuery({
		queryKey: ["proposal", token],
		queryFn: () => getProposalPublic({ data: { token } })
	});
	const brand = useQuery({
		queryKey: ["portal-brand"],
		queryFn: () => getPortalBrand()
	});
	const p = q.data;
	const b = brand.data;
	const primary = `#${b?.primaryHex ?? "0D47A1"}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto min-h-dvh max-w-2xl px-5 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HpMark, {
					className: "size-8",
					color: primary
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold",
					children: b?.company ?? "Hurricane Productions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase",
					children: "Proposal"
				})] })]
			}),
			!p && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: q.isLoading ? "Loading…" : "Not found."
			}),
			p && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight",
					children: p.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					children: p.status
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
				className: "mt-6 whitespace-pre-wrap rounded-xl bg-card p-5 text-sm leading-relaxed shadow-[var(--shadow-border)]",
				children: p.body
			})] })
		]
	});
}
//#endregion
export { PublicProposal as component };
