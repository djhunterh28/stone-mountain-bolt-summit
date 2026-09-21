import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { J as PageHeader, lt as Button } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { t as Switch } from "./switch-BLKjtJkd.mjs";
import { _ as toggleChatbot, f as listChatbots } from "./ultimate-DAnhRr51.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chatbot-B4HQRvjd.js
var import_jsx_runtime = require_jsx_runtime();
function ChatbotPage() {
	const flows = useQuery({
		queryKey: ["chatbots"],
		queryFn: () => listChatbots()
	});
	const qc = useQueryClient();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Chatbot",
				subtitle: "LeadBooster qualifier. Asks date, venue, headcount, then hands to New Business.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							variant: "secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/inbox",
								children: "Open live inbox"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							variant: "ghost",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/w/$slug",
								params: { slug: "northline" },
								children: "Site widget"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							variant: "ghost",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/ai",
								children: "Company AI profile"
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 px-4 sm:px-6 lg:grid-cols-2",
				children: (flows.data ?? []).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: f.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [f.conversations, " conversations"]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: f.active,
							onCheckedChange: (v) => toggleChatbot({ data: {
								id: f.id,
								active: v
							} }).then(() => qc.invalidateQueries({ queryKey: ["chatbots"] }))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-4 space-y-2",
						children: f.steps.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: i + 1
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.prompt })]
						}, s.id))
					})]
				}, f.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "mx-4 mt-6 overflow-x-auto rounded-xl bg-card p-4 font-mono text-xs shadow-[var(--shadow-border)] sm:mx-6",
				children: `<script src="https://northline.av/w/northline" async><\/script>`
			})
		]
	});
}
//#endregion
export { ChatbotPage as component };
