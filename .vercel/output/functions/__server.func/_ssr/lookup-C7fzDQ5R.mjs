import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { At as issueOtp, Ut as lookupDocument, ct as Input, lt as Button, st as Label } from "./router-o_A6MRMh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lookup-C7fzDQ5R.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LookupPage() {
	const [mode, setMode] = (0, import_react.useState)("id");
	const [lookupId, setLookupId] = (0, import_react.useState)("NL-1");
	const [password, setPassword] = (0, import_react.useState)("sign1");
	const [email, setEmail] = (0, import_react.useState)("");
	const [otp, setOtp] = (0, import_react.useState)("");
	const [demo, setDemo] = (0, import_react.useState)(null);
	const [result, setResult] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	async function onSubmit(e) {
		e.preventDefault();
		setError(null);
		const r = await lookupDocument({ data: {
			lookupId,
			password,
			email: mode === "email" ? email : void 0,
			otp: mode === "email" ? otp : void 0
		} });
		if (!r.ok) setError(r.error);
		else setResult(`${r.name} · ${r.status} · id ${r.id}`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase",
				children: "esign lookup"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-xl font-semibold tracking-tight",
				children: "Find a document"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Document ID + password, or email + OTP + password."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: mode === "id" ? "secondary" : "ghost",
					onClick: () => setMode("id"),
					children: "Document ID"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: mode === "email" ? "secondary" : "ghost",
					onClick: () => setMode("email"),
					children: "Email + OTP"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-4 space-y-3",
				onSubmit,
				children: [
					mode === "email" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							placeholder: "Email",
							required: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: otp,
								onChange: (e) => setOtp(e.target.value),
								placeholder: "OTP"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "secondary",
								onClick: () => issueOtp({ data: {
									email,
									purpose: "lookup"
								} }).then((r) => {
									if (r.ok) setDemo(r.demoCode);
								}),
								children: "Send"
							})]
						}),
						demo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: ["Workspace code ", demo]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Document ID" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: lookupId,
							onChange: (e) => setLookupId(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: password,
							onChange: (e) => setPassword(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						children: "Lookup"
					})
				]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-destructive",
				children: error
			}),
			result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm",
				children: [
					result,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/sign/$docId",
						params: { docId: result.split("id ")[1] ?? "1" },
						className: "underline",
						children: "Open"
					})
				]
			})
		]
	});
}
//#endregion
export { LookupPage as component };
