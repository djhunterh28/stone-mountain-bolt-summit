import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { K as widgetAsk, O as getPublicWidget, lt as Input, n as Route$3, ut as Button } from "./router-Bkw81Fhc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/w._slug-DYcXMsAp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Widget() {
	const { slug } = Route$3.useParams();
	const greeting = useQuery({
		queryKey: ["public-widget", slug],
		queryFn: () => getPublicWidget({ data: { slug } })
	}).data?.greeting ?? "Northline here — LED, audio, and labor for live events in New York. What date are you holding?";
	const [open, setOpen] = (0, import_react.useState)(true);
	const [q, setQ] = (0, import_react.useState)("");
	const [log, setLog] = (0, import_react.useState)(null);
	const messages = log ?? [{
		role: "nl",
		text: greeting
	}];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-4 text-xs text-muted-foreground",
			children: ["Embed preview · /w/", slug]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed right-4 bottom-4 z-20 w-[min(22rem,calc(100vw-2rem))]",
			children: [open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-b border-border px-3 py-2 text-sm font-medium",
						children: "Northline"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "max-h-72 space-y-2 overflow-y-auto p-3 text-sm",
						children: messages.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: m.role === "you" ? "text-right" : "",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-block max-w-[90%] rounded-lg bg-muted px-2 py-1.5 text-left",
								children: m.text
							})
						}, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "flex gap-2 border-t border-border p-2",
						onSubmit: (e) => {
							e.preventDefault();
							const question = q.trim();
							if (!question) return;
							setLog((l) => [...l ?? messages, {
								role: "you",
								text: question
							}]);
							setQ("");
							widgetAsk({ data: {
								question,
								visitor: "embed"
							} }).then((r) => {
								setLog((prev) => [...prev ?? [], {
									role: "nl",
									text: r.lead ? `${r.answer} I logged this as a lead.` : r.answer
								}]);
							});
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Ask about dates or packages"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "sm",
							children: "Send"
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setOpen(!open),
				className: "ml-auto flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-border)]",
				children: open ? "×" : "AI"
			})]
		})]
	});
}
//#endregion
export { Widget as component };
