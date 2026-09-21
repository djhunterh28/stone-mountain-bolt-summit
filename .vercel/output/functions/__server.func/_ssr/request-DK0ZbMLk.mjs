import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { ct as Input, en as submitEventRequest, lt as Button, ot as Textarea } from "./router-o_A6MRMh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/request-DK0ZbMLk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RequestPage() {
	const [done, setDone] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		await submitEventRequest({ data: {
			name: String(fd.get("name")),
			email: String(fd.get("email")),
			eventDate: String(fd.get("date") || "") || void 0,
			venue: String(fd.get("venue") || "") || void 0,
			guests: Number(fd.get("guests") || 0) || void 0,
			notes: String(fd.get("notes") || "") || void 0
		} });
		setDone(true);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto min-h-dvh max-w-md px-5 py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-tight",
				children: "Event request"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "From the marketing site into the admin queue, then Pipedrive."
			}),
			done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm",
				children: "Logged. Production will review the date hold."
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "date",
						type: "date"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "venue",
						placeholder: "Venue"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "guests",
						type: "number",
						placeholder: "Guests"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						name: "notes",
						rows: 4,
						placeholder: "Notes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						children: "Submit request"
					})
				]
			})
		]
	});
}
//#endregion
export { RequestPage as component };
