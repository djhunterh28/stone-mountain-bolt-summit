import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { B as setRsvp, lt as Button, o as Route$7 } from "./router-o_A6MRMh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rsvp._token-CkVFQKEG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RsvpPage() {
	const { token } = Route$7.useParams();
	const [done, setDone] = (0, import_react.useState)(null);
	if (done) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-md px-6 py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
			className: "text-xl font-medium",
			children: ["Thanks, ", done]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted-foreground",
			children: "Your RSVP is with the production desk."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-md px-6 py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-wide text-muted-foreground uppercase",
				children: "Northline guest list"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-xl font-medium",
				children: "Will you be there?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					const fd = new FormData(e.currentTarget);
					setRsvp({ data: {
						token,
						rsvp: String(fd.get("rsvp")),
						meal: String(fd.get("meal") || "") || void 0
					} }).then((r) => {
						if (r.ok) setDone(r.name);
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						name: "rsvp",
						className: "h-10 w-full rounded-md border border-input bg-background px-2",
						defaultValue: "yes",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "yes",
								children: "Yes"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "no",
								children: "No"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "pending",
								children: "Not sure"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						name: "meal",
						className: "h-10 w-full rounded-md border border-input bg-background px-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "fish",
								children: "Fish"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "veg",
								children: "Vegetarian"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "meat",
								children: "Meat"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Send RSVP"
					})
				]
			})
		]
	});
}
//#endregion
export { RsvpPage as component };
