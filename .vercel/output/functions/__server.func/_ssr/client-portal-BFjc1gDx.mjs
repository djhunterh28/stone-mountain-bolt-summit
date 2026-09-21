import { a as formatDateTime } from "./utils-BjcRTCQS.mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { J as PageHeader, lt as Button } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { n as getPortalLinkDesk, o as revokePortalLink, r as mintPortalLink } from "./session-CKySr3B6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client-portal-BFjc1gDx.js
var import_jsx_runtime = require_jsx_runtime();
function copy(text) {
	navigator.clipboard.writeText(text).then(() => toast.success("Link copied"));
}
function ClientPortalDesk() {
	const desk = useQuery({
		queryKey: ["portal-links"],
		queryFn: () => getPortalLinkDesk()
	});
	const qc = useQueryClient();
	const d = desk.data;
	function refresh() {
		qc.invalidateQueries({ queryKey: ["portal-links"] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Client portal",
				subtitle: "Passwordless magic links. Clients open proposal, sign the contract, and pay — branded as Hurricane, never a vendor host."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs tracking-wide text-muted-foreground uppercase",
							children: "Live links"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 font-mono text-2xl tabular-nums",
							children: d?.live ?? "—"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs tracking-wide text-muted-foreground uppercase",
							children: "Host"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 truncate text-sm",
							children: d?.portalHost ?? "portal.hurricaneproductionsllc.com"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "col-span-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:col-span-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs tracking-wide text-muted-foreground uppercase",
							children: "Access"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "Token in the URL. No password."
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 px-4 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "Mint a link"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
					children: (d?.people ?? []).slice(0, 8).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center justify-between gap-2 px-4 py-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm",
							children: p.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: p.email
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "secondary",
							onClick: () => mintPortalLink({ data: { personId: p.id } }).then((r) => {
								if (!r.ok) toast.error(r.error ?? "Blocked");
								else {
									toast.success("Link mailed");
									copy(`${window.location.origin}/c/${r.token}`);
								}
								refresh();
							}),
							children: "Send link"
						})]
					}, p.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 px-4 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "Issued"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
					children: (d?.links ?? []).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center justify-between gap-2 px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm",
							children: [
								l.person,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: ["· ", l.org]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"/c/",
								l.token,
								l.lastSeen ? ` · last in ${formatDateTime(l.lastSeen)}` : " · unused",
								l.expiresAt ? ` · exp ${formatDateTime(l.expiresAt)}` : ""
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: l.revoked ? "outline" : "success",
								children: l.revoked ? "revoked" : "live"
							}), !l.revoked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => copy(`${window.location.origin}/c/${l.token}`),
								children: "Copy"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => revokePortalLink({ data: { id: l.id } }).then(refresh),
								children: "Revoke"
							})] })]
						})]
					}, l.id))
				})]
			})
		]
	});
}
//#endregion
export { ClientPortalDesk as component };
