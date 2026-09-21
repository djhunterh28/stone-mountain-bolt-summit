import { o as __toESM } from "../_runtime.mjs";
import { a as formatDateTime, o as formatUsd, t as cn } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CZC9dlvp.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { J as PageHeader, ct as Input, fr as useUi, lt as Button, ot as Textarea, wn as getBootstrap } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inbox-CQJ-L7gk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var getUnifiedInbox = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("3005c014cd87305a1e775f5f3bdc327a7b32c88577895b585c1495bcc55ee92f"));
var replyInbox = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("433c4380f67ab4e3ab77563e162924a0b107b1745f1d5bee42357b0ff2f56788"));
var logInboxNote = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("9ec1f8a946072e6537e7026ab782247d4a74019b7b6d745301a5fb03680ff06a"));
var FILTERS = [
	{
		id: "all",
		label: "All"
	},
	{
		id: "email",
		label: "Email"
	},
	{
		id: "sms",
		label: "SMS"
	},
	{
		id: "chat",
		label: "Chat"
	}
];
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
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [q, setQ] = (0, import_react.useState)("");
	const [text, setText] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [replyOn, setReplyOn] = (0, import_react.useState)(null);
	const [pane, setPane] = (0, import_react.useState)("list");
	const threads = (0, import_react.useMemo)(() => {
		return (box.data?.threads ?? []).filter((t) => {
			if (filter !== "all" && !t.channels.includes(filter)) return false;
			if (!q.trim()) return true;
			return `${t.title} ${t.subtitle} ${t.preview}`.toLowerCase().includes(q.trim().toLowerCase());
		});
	}, [
		box.data?.threads,
		filter,
		q
	]);
	const current = threads.find((t) => t.id === id) ?? threads[0];
	const channel = replyOn ?? current?.channels[0] ?? "email";
	const bubbles = filter === "all" || !current ? current?.messages ?? [] : current?.messages.filter((m) => m.channel === filter) ?? [];
	function refresh() {
		qc.invalidateQueries({ queryKey: ["unified-inbox"] });
	}
	async function reply() {
		const body = text.trim();
		if (!body || !current || !me) return;
		setText("");
		const r = await replyInbox({ data: {
			channel,
			body,
			dealId: current.dealId,
			personId: current.personId,
			toAddr: current.toAddr,
			chatId: current.chatId,
			memberId: me.id,
			fromName: me.name,
			fromAddr: me.email,
			subject: current.kind === "event" ? `Re: ${current.title}` : `Re: ${current.title}`
		} });
		if (!r.ok) return toast.error(r.error ?? "Not sent");
		toast.success(`${channel} logged`);
		refresh();
	}
	const stats = box.data?.stats;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-[calc(100dvh-3.5rem)] flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Unified inbox",
			subtitle: "Email and SMS in one chat. Threads follow the event. Client context and the activity log stay on the right.",
			actions: stats ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-xs text-muted-foreground",
				children: [
					stats.unread,
					" waiting · ",
					stats.events,
					" shows · ",
					stats.sms,
					" with SMS"
				]
			}) : null
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-0 flex-1 border-t border-border",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: cn("w-full shrink-0 flex-col overflow-hidden border-r border-border sm:flex sm:w-72", pane === "thread" ? "hidden sm:flex" : "flex"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 border-b border-border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Search a show or person"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1",
							children: FILTERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: filter === f.id ? "secondary" : "ghost",
								onClick: () => setFilter(f.id),
								children: f.label
							}, f.id))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-h-0 flex-1 overflow-y-auto",
						children: threads.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								setId(t.id);
								setReplyOn(t.channels.includes("sms") && filter === "sms" ? "sms" : t.channels[0] ?? "email");
								setPane("thread");
							},
							className: cn("w-full border-b border-border px-4 py-3 text-left hover:bg-accent/40", current?.id === t.id && "bg-accent"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate text-sm font-medium",
										children: t.title
									}), t.unread && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 shrink-0 rounded-full bg-primary" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs text-muted-foreground",
									children: t.subtitle || t.preview
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex flex-wrap gap-1",
									children: [t.channels.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										children: c
									}, c)), t.kind === "event" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "steel",
										children: "event"
									})]
								})
							]
						}, t.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: cn("min-w-0 flex-1 flex-col", pane === "list" ? "hidden sm:flex" : "flex"),
					children: current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2 border-b border-border px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "text-xs text-muted-foreground sm:hidden",
										onClick: () => setPane("list"),
										children: "Back to threads"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate text-sm font-medium",
										children: current.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "truncate text-xs text-muted-foreground",
										children: [
											current.personName,
											current.orgName ? ` · ${current.orgName}` : "",
											current.dealTitle ? ` · ${current.dealTitle}` : ""
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-1",
								children: current.channels.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: channel === c ? "secondary" : "ghost",
									onClick: () => setReplyOn(c),
									children: c
								}, c))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 space-y-3 overflow-y-auto p-4",
							children: bubbles.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cn("max-w-[80%] rounded-lg px-3 py-2 text-sm", m.mine ? "ml-auto bg-primary text-primary-foreground" : "bg-muted"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 text-[10px] opacity-70",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: m.who }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: m.channel }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDateTime(m.at) })
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 whitespace-pre-wrap",
									children: m.body
								})]
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
								placeholder: `Reply on ${channel}${current.smsOpted === false && channel === "sms" ? " · STOP on file" : ""}`
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: !text.trim(),
								children: "Send"
							})]
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "p-6 text-sm text-muted-foreground",
						children: "No threads yet."
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "hidden w-72 shrink-0 overflow-y-auto border-l border-border lg:block",
					children: current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 p-4 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
									children: "Client"
								}),
								current.personId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/contacts/$personId",
									params: { personId: String(current.personId) },
									className: "mt-1 block font-medium underline-offset-4 hover:underline",
									children: current.personName ?? "Open registry"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-medium",
									children: current.personName ?? "Visitor"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: current.orgName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: current.personEmail
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: current.personPhone
								}),
								current.smsOpted != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "mt-2",
									variant: current.smsOpted ? "success" : "warn",
									children: current.smsOpted ? "SMS opted in" : "SMS STOP"
								})
							] }),
							current.dealId != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
									children: "Event"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/deals/$dealId",
									params: { dealId: String(current.dealId) },
									className: "mt-1 block font-medium underline-offset-4 hover:underline",
									children: current.dealTitle
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										current.stage,
										current.dealStatus ? ` · ${current.dealStatus}` : "",
										current.value != null ? ` · ${formatUsd(current.value)}` : ""
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: [current.eventDate, current.loadIn ? ` · load-in ${current.loadIn}` : ""]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: current.venue
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-xs text-muted-foreground",
									children: [
										current.messages.filter((m) => m.channel === "email").length,
										" emails ·",
										" ",
										current.messages.filter((m) => m.channel === "sms").length,
										" SMS · history stays on this show"
									]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
									children: "Activity"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "mt-2 space-y-2",
									children: [current.activities.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
										className: "text-xs text-muted-foreground",
										children: "Replies log here automatically."
									}), current.activities.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												children: a.type
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate text-xs",
												children: a.subject
											})]
										}),
										a.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-0.5 line-clamp-2 text-xs text-muted-foreground",
											children: a.notes
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground",
											children: formatDateTime(a.at)
										})
									] }, a.id))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									className: "mt-3 space-y-2",
									onSubmit: (e) => {
										e.preventDefault();
										if (!me || !note.trim()) return;
										logInboxNote({ data: {
											dealId: current.dealId,
											personId: current.personId,
											memberId: me.id,
											body: note
										} }).then(() => {
											setNote("");
											toast.success("Note logged");
											refresh();
										});
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										rows: 3,
										value: note,
										onChange: (e) => setNote(e.target.value),
										placeholder: "Log a call or floor note"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										size: "sm",
										variant: "secondary",
										disabled: !note.trim(),
										children: "Log activity"
									})]
								})
							] })
						]
					}) : null
				})
			]
		})]
	});
}
//#endregion
export { InboxPage as component };
