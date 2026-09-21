import { o as __toESM } from "../_runtime.mjs";
import { s as formatUsdFull } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { J as PageHeader, V as submitQuote, ct as Input, j as getQuotes, lt as Button } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quotes-DHIlJA_R.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function QuotesPage() {
	const rows = useQuery({
		queryKey: ["quotes"],
		queryFn: () => getQuotes()
	});
	const [indoor, setIndoor] = (0, import_react.useState)(true);
	const [type, setType] = (0, import_react.useState)("Corporate town hall");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Inquiries & quotes",
			subtitle: "Conditional fields, instant pricing, automatic lead. Embed the wizard on any site."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 px-4 sm:px-6 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
				onSubmit: (e) => {
					e.preventDefault();
					const fd = new FormData(e.currentTarget);
					submitQuote({ data: {
						name: String(fd.get("name")),
						email: String(fd.get("email")),
						eventType: type,
						guests: Number(fd.get("guests") || 0),
						indoor,
						date: String(fd.get("date"))
					} }).then((r) => {
						toast.success(`Quote ${formatUsdFull(r.total)} · lead created`);
						rows.refetch();
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Quote wizard"
					}),
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-9 w-full rounded-md border border-input bg-background px-2 text-sm",
						value: type,
						onChange: (e) => setType(e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Corporate town hall" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Gala / awards" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Rooftop concert" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "guests",
						type: "number",
						placeholder: "Headcount",
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "date",
						type: "date",
						required: true
					}),
					type !== "Rooftop concert" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: indoor,
							onChange: (e) => setIndoor(e.target.checked)
						}), " Indoor"]
					}),
					(type === "Rooftop concert" || !indoor) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Outdoor / rooftop adds ballast and a weather hold."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "sm",
						children: "Price it"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "text-[11px] text-muted-foreground",
						children: `<iframe src="/quotes" title="Northline quote"></iframe>`
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
				children: (rows.data ?? []).map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "px-4 py-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: q.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono tabular-nums",
								children: formatUsdFull(q.total)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								q.eventType,
								" · ",
								q.guests,
								" pax · ",
								q.date
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: q.abandoned ? "warn" : "outline",
							children: q.abandoned ? "abandoned" : q.status
						})
					]
				}, q.id))
			})]
		})]
	});
}
//#endregion
export { QuotesPage as component };
