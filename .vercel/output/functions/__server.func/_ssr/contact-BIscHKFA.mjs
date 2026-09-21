import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { en as submitContact, lt as Input, st as Textarea, ut as Button } from "./router-Bkw81Fhc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-BIscHKFA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ContactPage() {
	const [done, setDone] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		await submitContact({ data: {
			name: String(fd.get("name")),
			email: String(fd.get("email")),
			message: String(fd.get("message"))
		} });
		setDone(true);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto min-h-dvh max-w-md px-5 py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-tight",
				children: "Contact the shop"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Entries sync into the CRM contact book."
			}),
			done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm",
				children: "Received. An AE will reply from the house mailbox."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 space-y-3",
				onSubmit,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "name",
						placeholder: "Name",
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "email",
						type: "email",
						placeholder: "Email",
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						name: "message",
						rows: 5,
						placeholder: "Message",
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						children: "Send"
					})
				]
			})
		]
	});
}
//#endregion
export { ContactPage as component };
