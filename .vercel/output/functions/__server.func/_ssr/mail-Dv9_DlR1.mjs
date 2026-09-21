import { o as __toESM } from "../_runtime.mjs";
import { a as formatDateTime } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { _ as sendBroadcast, d as listBroadcasts } from "./governance-Bb-_vds7.mjs";
import { t as runAi } from "./ai-_z0d7FCh.mjs";
import { v as Sparkles } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as TabsList, J as PageHeader, Kn as listTemplates, Pn as listEmails, Z as Tabs, Zn as sendEmail, ct as Input, et as TabsTrigger, fr as useUi, lt as Button, ot as Textarea, wn as getBootstrap } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { o as getActiveSender } from "./domain-DTp-hrMr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mail-Dv9_DlR1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MailPage() {
	const [folder, setFolder] = (0, import_react.useState)("inbox");
	const emails = useQuery({
		queryKey: ["emails", folder],
		queryFn: () => listEmails({ data: { folder } })
	});
	const broadcasts = useQuery({
		queryKey: ["broadcasts"],
		queryFn: () => listBroadcasts()
	});
	const templates = useQuery({
		queryKey: ["templates"],
		queryFn: () => listTemplates()
	});
	const boot = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	const { memberId } = useUi();
	const me = boot.data?.members.find((m) => m.id === memberId);
	const sender = useQuery({
		queryKey: [
			"active-sender",
			memberId,
			me?.email
		],
		queryFn: () => getActiveSender({ data: {
			purpose: "compose",
			memberId,
			hintAddr: me?.email,
			fallbackName: me?.name
		} }),
		enabled: Boolean(me)
	});
	const qc = useQueryClient();
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const selected = emails.data?.find((e) => e.id === openId) ?? emails.data?.[0];
	const [to, setTo] = (0, import_react.useState)("");
	const [subject, setSubject] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const [audience, setAudience] = (0, import_react.useState)("open-deals");
	async function draft() {
		const res = await runAi({ data: {
			kind: "email",
			prompt: `Write a Northline sales email. Subject hint: ${subject || "follow up on a live event"}. To: ${to || "a producer in NYC"}.`
		} });
		if (res.ok) setBody(res.text);
		else toast.error(res.error);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-[calc(100dvh-3.5rem)] flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Mail",
			subtitle: "Two-way sync, templates, tracking, and group email — from your authenticated domain, not a platform address."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-0 flex-1 flex-col border-t border-border lg:flex-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "w-full shrink-0 border-b border-border lg:w-80 lg:border-r lg:border-b-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
						value: folder,
						onValueChange: setFolder,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList, { children: [
							"inbox",
							"sent",
							"drafts",
							"shared",
							"broadcast"
						].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: f,
							className: "capitalize",
							children: f
						}, f)) })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "max-h-64 overflow-y-auto lg:max-h-none lg:h-[calc(100%-3.5rem)]",
					children: folder === "broadcast" ? (broadcasts.data ?? []).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "border-t border-border px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm",
							children: b.subject
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								b.audience,
								" · ",
								b.sentCount,
								" sent · ",
								b.opened,
								" opened"
							]
						})]
					}, b.id)) : (emails.data ?? []).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "w-full border-t border-border px-4 py-3 text-left hover:bg-accent/40",
						onClick: () => setOpenId(e.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate text-sm",
								children: e.subject
							}), e.opened && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: "opened"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate text-xs text-muted-foreground",
							children: [
								e.fromName,
								" · ",
								formatDateTime(e.sentAt ?? e.createdAt),
								e.authenticated ? " · aligned" : ""
							]
						})]
					}) }, e.id))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "min-w-0 flex-1 overflow-y-auto p-4 sm:p-6",
				children: [selected && folder !== "drafts" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "mb-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-semibold",
							children: selected.subject
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [
								`${selected.fromName} <${selected.fromAddr}> → ${selected.toAddr}`,
								selected.authenticated ? " · authenticated" : "",
								selected.clicked ? " · clicked" : selected.opened ? " · opened" : ""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm leading-relaxed",
							children: selected.body
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-medium",
								children: folder === "broadcast" ? "Group email" : "Compose"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: draft,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), "AI write"]
							})]
						}),
						folder === "broadcast" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1",
							children: [
								["open-deals", "Open deals"],
								["rotting", "Rotting"],
								["leads", "Leads"]
							].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: audience === id ? "secondary" : "ghost",
								onClick: () => setAudience(id),
								children: label
							}, id))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: to,
							onChange: (e) => setTo(e.target.value),
							placeholder: "To"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: subject,
							onChange: (e) => setSubject(e.target.value),
							placeholder: "Subject"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1",
							children: (templates.data ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => {
									setSubject(t.subject);
									setBody(t.body);
								},
								children: t.name
							}, t.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 6,
							value: body,
							onChange: (e) => setBody(e.target.value)
						}),
						sender.data?.authenticated && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"Sending as ",
								sender.data.fromName,
								" · ",
								sender.data.fromAddr,
								" · SPF / DKIM / DMARC aligned"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								onClick: () => {
									if (!me) return;
									sendEmail({ data: {
										fromName: me.name,
										fromAddr: me.email,
										toAddr: to || "client@example.com",
										subject: subject || "(no subject)",
										body,
										folder: "drafts",
										memberId: me.id
									} }).then((r) => {
										toast.success(r.authenticated ? `Draft as ${r.fromAddr}` : "Saved draft");
										qc.invalidateQueries({ queryKey: ["emails"] });
									});
								},
								children: "Save draft"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => {
									if (!me) return;
									if (folder === "broadcast") {
										sendBroadcast({ data: {
											name: subject || "Broadcast",
											subject: subject || "(no subject)",
											body,
											audience,
											fromName: me.name,
											fromAddr: me.email
										} }).then((r) => {
											if (!r.ok) toast.error(r.error ?? "Blocked");
											else {
												toast.success(`Sent to ${r.sent} · ${r.suppressed ?? 0} suppressed · CAN-SPAM footer attached`);
												setBody("");
												qc.invalidateQueries({ queryKey: ["broadcasts"] });
												qc.invalidateQueries({ queryKey: ["emails"] });
												qc.invalidateQueries({ queryKey: ["security"] });
											}
										});
										return;
									}
									sendEmail({ data: {
										fromName: me.name,
										fromAddr: me.email,
										toAddr: to || "client@example.com",
										subject: subject || "(no subject)",
										body,
										memberId: me.id
									} }).then((r) => {
										toast.success(r.authenticated ? `Sent from ${r.fromAddr}` : "Sent · tracking on");
										setBody("");
										qc.invalidateQueries({ queryKey: ["emails"] });
									});
								},
								disabled: !body,
								children: folder === "broadcast" ? "Send group" : "Send"
							})]
						})
					]
				})]
			})]
		})]
	});
}
//#endregion
export { MailPage as component };
