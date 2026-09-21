import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as cn, o as formatDateTime } from "./utils-DLVA4J7b.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { H as sendSms, Qn as sendEmail, X as PageHeader, Zn as sendChat, j as getUnifiedInbox, lt as Input, ur as useUi, ut as Button, wn as getBootstrap } from "./router-Bkw81Fhc.mjs";
import { t as Badge } from "./badge-BQYjLRpy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inbox-DqprPMcd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InboxPage() {
	const box = useQuery({
		queryKey: ["unified-inbox"],
		queryFn: () => getUnifiedInbox()
	});
	const boot = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	const qc = useQueryClient();
	const { memberId } = useUi();
	const me = boot.data?.members.find((m) => m.id === memberId);
	const [id, setId] = (0, import_react.useState)(null);
	const [text, setText] = (0, import_react.useState)("");
	const threads = box.data?.threads ?? [];
	const current = threads.find((t) => t.id === id) ?? threads[0];
	async function reply() {
		const body = text.trim();
		if (!body || !current) return;
		setText("");
		if (current.channel === "sms") {
			if (!current.personId) return toast.error("No person on this thread");
			const r = await sendSms({ data: {
				personId: current.personId,
				body,
				dealId: current.dealId ?? void 0
			} });
			if (!r.ok) return toast.error(r.error);
		} else if (current.channel === "email") {
			if (!me) return;
			await sendEmail({ data: {
				fromName: me.name,
				fromAddr: me.email,
				toAddr: current.toAddr ?? "client@example.com",
				subject: `Re: ${current.title}`,
				body,
				dealId: current.dealId
			} });
		} else {
			const chatId = Number(current.id.replace("chat-", ""));
			await sendChat({ data: {
				chatId,
				sender: "agent",
				body
			} });
		}
		toast.success("Sent");
		qc.invalidateQueries({ queryKey: ["unified-inbox"] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-[calc(100dvh-3.5rem)] flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Unified inbox",
			subtitle: "Email, SMS via QUO, and site chat in one three-column desk. Event context stays in view."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-0 flex-1 border-t border-border",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "hidden w-72 shrink-0 overflow-y-auto border-r border-border sm:block",
					children: threads.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setId(t.id),
						className: cn("w-full border-b border-border px-4 py-3 text-left hover:bg-accent/40", current?.id === t.id && "bg-accent"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate text-sm font-medium",
								children: t.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: t.channel
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs text-muted-foreground",
							children: t.preview
						})]
					}, t.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "flex min-w-0 flex-1 flex-col",
					children: current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-b border-border px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium",
								children: current.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [current.subtitle, current.dealTitle ? ` · ${current.dealTitle}` : ""]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 space-y-3 overflow-y-auto p-4",
							children: current.messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cn("max-w-[80%] rounded-lg px-3 py-2 text-sm", m.mine ? "ml-auto bg-primary text-primary-foreground" : "bg-muted"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[10px] opacity-70",
									children: [
										m.who,
										" · ",
										formatDateTime(m.at)
									]
								}), m.body]
							}, m.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "flex gap-2 border-t border-border p-3",
							onSubmit: (e) => {
								e.preventDefault();
								reply();
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: text,
								onChange: (e) => setText(e.target.value),
								placeholder: `Reply on ${current.channel}`
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								children: "Send"
							})]
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "p-6 text-sm text-muted-foreground",
						children: "No threads yet."
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "hidden w-64 shrink-0 overflow-y-auto border-l border-border xl:block",
					children: current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 p-4 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
								children: "Context"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Channel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 block",
								children: current.channel
							})] }),
							current.dealId != null && current.dealTitle && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Event"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/deals/$dealId",
								params: { dealId: String(current.dealId) },
								className: "mt-0.5 block underline-offset-4 hover:underline",
								children: current.dealTitle
							})] }),
							current.personId != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Person"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/contacts/$personId",
								params: { personId: String(current.personId) },
								className: "mt-0.5 block underline-offset-4 hover:underline",
								children: "Open registry"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "SMS honors opt-in. Email tracking stays on. Chat is the site widget."
							})
						]
					}) : null
				})
			]
		})]
	});
}
//#endregion
export { InboxPage as component };
