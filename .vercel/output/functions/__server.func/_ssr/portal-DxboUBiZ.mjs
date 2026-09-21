import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as getPortalBrand } from "./brand-BeQEY2zF.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { X as useCurrentUserState, Y as HpMark, ct as Input, lt as Button } from "./router-o_A6MRMh.mjs";
import { a as requestPortalLink } from "./session-CKySr3B6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal-DxboUBiZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PortalLanding() {
	const brand = useQuery({
		queryKey: ["portal-brand"],
		queryFn: () => getPortalBrand()
	});
	const { user } = useCurrentUserState();
	const navigate = useNavigate();
	const preview = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("preview") === "1";
	const b = brand.data;
	const primary = `#${b?.primaryHex ?? "0D47A1"}`;
	const paper = `#${b?.paperHex ?? "F5F3EE"}`;
	const ink = `#${b?.inkHex ?? "0B1220"}`;
	const [email, setEmail] = (0, import_react.useState)("");
	const [err, setErr] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (user && !preview) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/home" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-dvh",
		style: {
			background: paper,
			color: ink
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex min-h-dvh max-w-lg flex-col px-6 py-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HpMark, {
					className: "size-9",
					color: primary
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-semibold tracking-tight",
					children: b?.company ?? "Hurricane Productions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] tracking-wide text-black/50 uppercase",
					children: b?.portalHost ?? "portal.hurricaneproductionsllc.com"
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-auto pb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium tracking-[0.18em] uppercase",
						style: { color: primary },
						children: "Passwordless client portal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 text-4xl font-semibold tracking-tight text-balance",
						children: b?.tagline ?? "Stop Quoting. Start Partnering."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-sm text-sm leading-relaxed text-black/60",
						children: "Proposal, contract, and payment — on our domain. We email a one-time link. No password."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-8 space-y-2",
						onSubmit: (e) => {
							e.preventDefault();
							setBusy(true);
							setErr(null);
							requestPortalLink({ data: { email } }).then((r) => {
								setBusy(false);
								if (!r.ok || !r.token) {
									setErr(r.error ?? "We couldn't send a link.");
									return;
								}
								navigate({
									to: "/c/$token",
									params: { token: r.token }
								});
							});
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								required: true,
								value: email,
								onChange: (e) => setEmail(e.target.value),
								placeholder: "The email on your proposal",
								className: "bg-white"
							}),
							err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-red-800",
								children: err
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "h-11 text-white",
								style: { background: primary },
								disabled: busy,
								children: busy ? "Sending…" : "Email me a link"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-xs text-black/45",
						children: "Already have a link from your producer? It looks like /c/… — open it, no sign-in."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-8 text-xs text-black/45",
						children: b?.footer
					})
				]
			})]
		})
	});
}
//#endregion
export { PortalLanding as component };
