import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { Jt as resetPasswordWithOtp, ct as Label, jt as issueOtp, lt as Input, ut as Button } from "./router-Bkw81Fhc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forgot-DLjw9gts.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ForgotPage() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [code, setCode] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [step, setStep] = (0, import_react.useState)("email");
	const [demo, setDemo] = (0, import_react.useState)(null);
	const [msg, setMsg] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onEmail(e) {
		e.preventDefault();
		setBusy(true);
		const r = await issueOtp({ data: {
			email,
			purpose: "reset"
		} });
		setBusy(false);
		if (r.ok) {
			setDemo(r.demoCode);
			setStep("reset");
		} else setMsg("Could not send a code.");
	}
	async function onReset(e) {
		e.preventDefault();
		setBusy(true);
		const r = await resetPasswordWithOtp({ data: {
			email,
			code,
			password
		} });
		setBusy(false);
		if (r.ok) setMsg("Password updated. You can sign in.");
		else setMsg("error" in r ? r.error : "Reset failed");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-semibold tracking-tight",
				children: "Reset password"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Email is the only username. We send a one-time code."
			}),
			step === "email" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 space-y-3",
				onSubmit: onEmail,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "email",
						children: "Work email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "email",
						type: "email",
						required: true,
						value: email,
						onChange: (e) => setEmail(e.target.value),
						autoComplete: "username"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					disabled: busy,
					children: "Send code"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 space-y-3",
				onSubmit: onReset,
				children: [
					demo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "rounded-md bg-muted px-3 py-2 text-sm",
						children: ["Workspace code: ", demo]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: code,
						onChange: (e) => setCode(e.target.value),
						placeholder: "6-digit code",
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "password",
						minLength: 8,
						value: password,
						onChange: (e) => setPassword(e.target.value),
						placeholder: "New password",
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						disabled: busy,
						children: "Update password"
					})
				]
			}),
			msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm",
				children: msg
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/login",
				className: "mt-6 text-sm text-muted-foreground hover:underline",
				children: "Back to sign in"
			})
		]
	});
}
//#endregion
export { ForgotPage as component };
