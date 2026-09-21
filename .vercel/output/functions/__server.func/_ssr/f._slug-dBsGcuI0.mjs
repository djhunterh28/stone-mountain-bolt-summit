import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { f as Route$13, lt as Button } from "./router-o_A6MRMh.mjs";
import { a as getFormBySlug, l as submitForm, t as FormFill, u as useEmbedHeight } from "./form-fill-CVvvHBD9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/f._slug-dBsGcuI0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PublicForm() {
	const { slug } = Route$13.useParams();
	const search = Route$13.useSearch();
	const embed = Boolean(search.embed);
	const vendor = search.vendor;
	const q = useQuery({
		queryKey: [
			"form",
			slug,
			vendor ?? ""
		],
		queryFn: () => getFormBySlug({ data: {
			slug,
			vendor
		} })
	});
	const [sent, setSent] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	useEmbedHeight(embed);
	const data = q.data;
	const form = data && data.ok ? data.form : null;
	const vendorName = data && data.ok ? data.vendor?.name : null;
	const chrome = (0, import_react.useMemo)(() => !embed, [embed]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("mx-auto min-h-dvh max-w-lg", embed ? "px-3 py-4" : "px-5 py-12"),
		children: [
			chrome && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 24 24",
					className: "size-6 text-primary",
					"aria-hidden": true,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: "4",
							y: "5",
							width: "3.2",
							height: "14",
							rx: "0.6",
							fill: "currentColor"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: "9.4",
							y: "8",
							width: "3.2",
							height: "11",
							rx: "0.6",
							fill: "currentColor",
							opacity: "0.7"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: "14.8",
							y: "3",
							width: "3.2",
							height: "16",
							rx: "0.6",
							fill: "currentColor"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-semibold",
					children: "Northline"
				})]
			}),
			q.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Loading form…"
			}),
			data && !data.ok && data.reason === "vendor" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight",
					children: data.form?.name ?? "Assigned form"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "This packet is vendor-specific. Open the link Accounts sent — the token in the URL is the key, no login."
				})]
			}),
			data && !data.ok && data.reason !== "vendor" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Form not found or no longer active."
			}),
			form && !sent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormFill, {
				name: form.name,
				description: form.description,
				thankYou: form.thankYou,
				fields: form.fields,
				steps: form.steps,
				wizard: form.wizard,
				vendorName,
				submitting: busy,
				onSubmit: (payload, files) => {
					setBusy(true);
					submitForm({ data: {
						slug,
						payload,
						vendorToken: vendor,
						source: embed ? "embed" : vendor ? "vendor" : "public",
						files
					} }).then((r) => {
						setBusy(false);
						if (r.ok) {
							setSent(true);
							toast.success("Received");
							if (embed) window.parent?.postMessage({
								type: "nl-form-submitted",
								slug
							}, "*");
						} else toast.error("error" in r ? r.error : "Could not submit");
					});
				}
			}),
			form && sent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight",
					children: "Got it."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: form.thankYou || "An account executive will be in touch. If this is load-in this week, call the shop."
				}),
				chrome && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-6",
					variant: "secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/leads",
						children: "Back to workspace"
					})
				})
			] })
		]
	});
}
//#endregion
export { PublicForm as component };
