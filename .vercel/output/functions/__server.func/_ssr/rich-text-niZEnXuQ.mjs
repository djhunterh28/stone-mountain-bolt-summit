import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { lt as Button } from "./router-o_A6MRMh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rich-text-niZEnXuQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NOTE_CATEGORIES = [
	{
		id: "production",
		label: "Production"
	},
	{
		id: "client",
		label: "Client"
	},
	{
		id: "site",
		label: "Site"
	},
	{
		id: "power",
		label: "Power"
	},
	{
		id: "talent",
		label: "Talent"
	},
	{
		id: "labor",
		label: "Labor"
	},
	{
		id: "holds",
		label: "Holds"
	},
	{
		id: "safety",
		label: "Safety"
	}
];
function sanitizeNoteHtml(html) {
	return html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "").replace(/\son\w+="[^"]*"/gi, "").replace(/\son\w+='[^']*'/gi, "").replace(/javascript:/gi, "").replace(/<\/?(?!\/?(p|br|strong|b|em|i|ul|ol|li|h3|a|div)\b)[^>]*>/gi, "").replace(/<a\s+[^>]*href=["'](?!https?:)[^"']*["'][^>]*>/gi, "<a>").trim();
}
function notePlain(html) {
	return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function RichTextEditor({ value, onChange, placeholder }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		if (el.innerHTML !== value) el.innerHTML = value || "";
	}, [value]);
	function cmd(command, arg) {
		ref.current?.focus();
		document.execCommand(command, false, arg);
		onChange(sanitizeNoteHtml(ref.current?.innerHTML ?? ""));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-secondary shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-0.5 border-b border-border p-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tool, {
					onClick: () => cmd("bold"),
					label: "Bold",
					children: "B"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tool, {
					onClick: () => cmd("italic"),
					label: "Italic",
					children: "I"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tool, {
					onClick: () => cmd("insertUnorderedList"),
					label: "List",
					children: "List"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tool, {
					onClick: () => cmd("formatBlock", "h3"),
					label: "Heading",
					children: "H"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tool, {
					onClick: () => {
						const href = window.prompt("Link URL");
						if (href && /^https?:\/\//i.test(href)) cmd("createLink", href);
					},
					label: "Link",
					children: "Link"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [!notePlain(value) && placeholder && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pointer-events-none absolute px-3 py-2 text-sm text-muted-foreground",
				children: placeholder
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref,
				contentEditable: true,
				role: "textbox",
				"aria-label": placeholder ?? "Note",
				className: "min-h-28 px-3 py-2 text-sm leading-relaxed outline-none [&_a]:underline [&_h3]:text-sm [&_h3]:font-medium [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5",
				onInput: () => onChange(sanitizeNoteHtml(ref.current?.innerHTML ?? ""))
			})]
		})]
	});
}
function Tool({ onClick, label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		type: "button",
		size: "sm",
		variant: "ghost",
		className: cn("h-7 px-2", children === "B" && "font-bold", children === "I" && "italic"),
		onClick,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: label
		}), children]
	});
}
function NoteHtml({ html, className }) {
	const safe = sanitizeNoteHtml(html);
	if (!notePlain(safe)) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("text-sm leading-relaxed [&_a]:underline [&_h3]:text-sm [&_h3]:font-medium [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5", className),
		dangerouslySetInnerHTML: { __html: safe }
	});
}
//#endregion
export { sanitizeNoteHtml as a, notePlain as i, NoteHtml as n, RichTextEditor as r, NOTE_CATEGORIES as t };
