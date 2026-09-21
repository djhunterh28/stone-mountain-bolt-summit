import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { c as getLeadBooster } from "./governance-Bb-_vds7.mjs";
import { D as RectangleEllipsis, R as MessageSquare, wt as Bot } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { J as PageHeader, lt as Button } from "./router-o_A6MRMh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leadbooster-CQbtv8Ly.js
var import_jsx_runtime = require_jsx_runtime();
function LeadBoosterPage() {
	const v = useQuery({
		queryKey: ["leadbooster"],
		queryFn: () => getLeadBooster()
	}).data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "LeadBooster",
			subtitle: "Chatbots, live chat, and web forms — included on Ultimate. Round-robin to New Business."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 px-4 sm:px-6 lg:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					icon: Bot,
					title: "Chatbots",
					stat: `${v?.botCount ?? 0} live`,
					body: `${v?.botConvos ?? 0} conversations. Qualifies date, venue, and headcount before the AE picks up.`,
					href: "/chatbot",
					action: "Open flows"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					icon: MessageSquare,
					title: "Live chat",
					stat: `${v?.chats ?? 0} threads`,
					body: "Website widget, round-robin to New Business. Copilot can draft the first reply.",
					href: "/inbox",
					action: "Open inbox"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					icon: RectangleEllipsis,
					title: "Web forms",
					stat: `${v?.formCount ?? 0} forms`,
					body: `${v?.forms ?? 0} submissions. Conditional logic, wizard steps, vendor assignment, file uploads, two-line embed.`,
					href: "/forms",
					action: "Open forms"
				})
			]
		})]
	});
}
function Card({ icon: Icon, title, stat, body, href, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "flex flex-col rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 text-steel" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-4 text-sm font-medium",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-mono text-2xl tabular-nums",
				children: stat
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 flex-1 text-sm text-muted-foreground",
				children: body
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				size: "sm",
				variant: "secondary",
				className: "mt-5 w-fit",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: href,
					children: action
				})
			})
		]
	});
}
//#endregion
export { LeadBoosterPage as component };
