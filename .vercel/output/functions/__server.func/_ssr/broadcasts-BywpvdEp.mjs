import { o as __toESM } from "../_runtime.mjs";
import { a as formatDateTime } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { _ as sendBroadcast } from "./governance-Bb-_vds7.mjs";
import { t as runAi } from "./ai-_z0d7FCh.mjs";
import { v as Sparkles } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as TabsList, J as PageHeader, Q as TabsContent, Z as Tabs, ct as Input, et as TabsTrigger, fr as useUi, lt as Button, st as Label, wn as getBootstrap, x as getBroadcastDesk } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { t as Skeleton } from "./skeleton-BVFrMLkw.mjs";
import { o as getActiveSender } from "./domain-DTp-hrMr.mjs";
import { a as removeSuppression, o as saveBroadcastTemplate, r as getBroadcastComposer, t as addSuppression } from "./broadcast-5aPrn3E_.mjs";
import { r as RichTextEditor } from "./rich-text-niZEnXuQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/broadcasts-BywpvdEp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BroadcastsPage() {
	const desk = useQuery({
		queryKey: ["bcast-desk"],
		queryFn: () => getBroadcastDesk()
	});
	useQueryClient();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Broadcasts",
			subtitle: "The same composer as one-to-one mail, aimed at the client book. CAN-SPAM footer on every send. Suppression honored everywhere."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-4 sm:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "mail",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "flex h-auto flex-wrap",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "mail",
								children: "Client mail"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "sms",
								children: "SMS / QUO"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "cold",
								children: "Cold lists"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "domain",
								children: "Domain & signatures"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "mail",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientMailDesk, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "sms",
						className: "mt-4 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Event reminders, payment confirmations, status updates, and custom texts go out through QUO. STOP is honored on every send."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							variant: "secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/sms",
								children: "Open SMS desk"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "cold",
						className: "mt-4 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Expo scans and bought lists never enter pipeline metrics. Import, tag campaigns, and reply-to-lead live on the cold desk."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
								children: (desk.data?.lists ?? []).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex justify-between px-4 py-2.5 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: l.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-muted-foreground",
										children: [l.n, " names"]
									})]
								}, l.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								variant: "secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/cold",
									children: "Open cold lists"
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "domain",
						className: "mt-4 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Broadcasts leave from the live sending domain. DNS, identities, and apply-toggles live on the sending domain desk."
							}),
							(desk.data?.domains ?? []).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-start justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-sm font-medium",
										children: d.domain
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: d.active ? "success" : "outline",
										children: d.active ? "live" : "idle"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: [
										"SPF ",
										d.spf ? "pass" : "fail",
										" · DKIM ",
										d.dkim ? "pass" : "fail",
										" · DMARC ",
										d.dmarc ? "pass" : "fail"
									]
								})]
							}, d.id)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								variant: "secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/domain",
									children: "Open sending domain"
								})
							}),
							(desk.data?.signatures ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("pre", {
								className: "rounded-xl bg-card p-4 font-mono text-xs shadow-[var(--shadow-border)]",
								children: [
									s.member,
									"\n",
									s.body
								]
							}, s.id))
						]
					})
				]
			})
		})]
	});
}
function ClientMailDesk() {
	const book = useQuery({
		queryKey: ["bcast-composer"],
		queryFn: () => getBroadcastComposer()
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
			me?.email,
			"workflow"
		],
		queryFn: () => getActiveSender({ data: {
			purpose: "workflow",
			memberId,
			hintAddr: "shows@hurricaneproductionsllc.com",
			fallbackName: "Northline Shows"
		} }),
		enabled: Boolean(me)
	});
	const qc = useQueryClient();
	const [audience, setAudience] = (0, import_react.useState)("clients");
	const [name, setName] = (0, import_react.useState)("Season hold note");
	const [subject, setSubject] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const [templateId, setTemplateId] = (0, import_react.useState)(null);
	function refresh() {
		qc.invalidateQueries({ queryKey: ["bcast-composer"] });
		qc.invalidateQueries({ queryKey: ["broadcasts"] });
		qc.invalidateQueries({ queryKey: ["emails"] });
	}
	const d = book.data;
	const picked = d?.audiences.find((a) => a.id === audience);
	const signature = d?.signatures[0]?.body ?? "";
	async function draft() {
		const res = await runAi({ data: {
			kind: "email",
			prompt: `Write a Northline client broadcast. Subject hint: ${subject || "season holds still open"}. Audience: ${picked?.label ?? "the client book"}. Keep merge tags {{first_name}} where a greeting belongs.`
		} });
		if (res.ok) setBody(res.text);
		else toast.error(res.error);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			book.isLoading || !d ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-xl" }, i))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Client book",
						value: String(d.stats.book),
						hint: "People with an email"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Ready",
						value: String(picked?.ready ?? d.stats.ready),
						hint: picked?.label ?? "Whole book"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Suppressed",
						value: String(d.stats.held),
						hint: "Honored on every send"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Sent",
						value: String(d.stats.sent),
						hint: "Historical client mail"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium",
								children: "Composer"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => void draft(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), "AI write"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Same editor as one-to-one mail. Templates fill subject and body. Signature and CAN-SPAM footer attach on send — they are not optional."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "bcast-name",
							children: "Internal name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "bcast-name",
							value: name,
							onChange: (e) => setName(e.target.value),
							className: "mt-1"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Start from a template" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 flex flex-wrap gap-1",
							children: (d?.templates ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: templateId === t.id ? "secondary" : "ghost",
								onClick: () => {
									setTemplateId(t.id);
									setSubject(t.subject);
									setBody(t.body);
									setName(t.name);
								},
								children: t.name
							}, t.id))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "bcast-subject",
							children: "Subject"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "bcast-subject",
							value: subject,
							onChange: (e) => setSubject(e.target.value),
							placeholder: "Hold dates still open",
							className: "mt-1"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Body" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichTextEditor, {
									value: body,
									onChange: setBody,
									placeholder: "Hi {{first_name}} —"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Full editor. Merge tags: first_name, name, venue, deal. Resolved per recipient."
							})
						] }),
						signature && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
							className: "rounded-lg bg-secondary p-3 font-mono text-xs text-muted-foreground",
							children: signature
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg bg-secondary p-3 text-xs leading-relaxed text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium text-foreground",
								children: "CAN-SPAM footer — attached on every send"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1",
								children: [
									d?.company ?? "Hurricane Productions",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									d?.address ?? "247 3rd Street, Brooklyn, NY 11215",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"This is a commercial message from our client book.",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"Unsubscribe: unique link per recipient"
								]
							})]
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
							className: "flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: picked ? `${picked.ready} will receive · ${picked.suppressed} held on the suppression list` : "Pick an audience"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "secondary",
									disabled: !subject.trim() || !body.trim(),
									onClick: () => saveBroadcastTemplate({ data: {
										name,
										subject,
										body
									} }).then((r) => {
										if (!r.ok) toast.error(r.error ?? "Not saved");
										else {
											toast.success("Saved as a template");
											setTemplateId(r.id);
											refresh();
										}
									}),
									children: "Save as template"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									disabled: !subject.trim() || !body.trim() || !picked?.ready || !me,
									onClick: () => {
										if (!me) return;
										sendBroadcast({ data: {
											name,
											subject,
											body,
											audience,
											fromName: sender.data?.fromName ?? me.name,
											fromAddr: sender.data?.fromAddr ?? me.email,
											memberId: me.id,
											templateId
										} }).then((r) => {
											if (!r.ok) toast.error(r.error ?? "Blocked");
											else {
												toast.success(`Queued ${r.sent} · ${r.suppressed} suppressed · CAN-SPAM footer attached`);
												refresh();
											}
										});
									},
									children: ["Send to ", picked?.label ?? "client book"]
								})]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium",
								children: "Audience"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Cold lists are not in this book."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex flex-wrap gap-1",
								children: (d?.audiences ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: audience === a.id ? "secondary" : "ghost",
									onClick: () => setAudience(a.id),
									children: a.label
								}, a.id))
							}),
							picked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 text-xs text-muted-foreground",
								children: [
									picked.hint,
									" · ",
									picked.total,
									" unique · ",
									picked.suppressed,
									" suppressed"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 divide-y divide-border rounded-lg bg-secondary",
								children: picked.preview.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "px-3 py-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate",
										children: p.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-xs text-muted-foreground",
										children: p.email
									})]
								}, p.email))
							})] })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium",
								children: "Suppression list"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Honored on client mail, group mail, and every future send."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 divide-y divide-border",
								children: (d?.suppressed ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start justify-between gap-2 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "truncate text-sm",
											children: s.name ?? s.email
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "truncate text-xs text-muted-foreground",
											children: [
												s.email,
												" · ",
												s.reason
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										onClick: () => removeSuppression({ data: { id: s.id } }).then(refresh),
										children: "Restore"
									})]
								}, s.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "mt-3 grid gap-2",
								onSubmit: (e) => {
									e.preventDefault();
									const fd = new FormData(e.currentTarget);
									addSuppression({ data: {
										email: String(fd.get("email") || ""),
										name: String(fd.get("name") || "") || void 0,
										reason: String(fd.get("reason") || "") || void 0
									} }).then((r) => {
										if (!r.ok) toast.error(r.error ?? "Could not add");
										else {
											toast.success("On the suppression list — next send will skip them");
											e.currentTarget.reset();
											refresh();
										}
									});
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									name: "email",
									placeholder: "email",
									required: true
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											name: "name",
											placeholder: "Name",
											className: "w-32"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											name: "reason",
											placeholder: "Reason",
											className: "w-36"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "submit",
											size: "sm",
											variant: "secondary",
											children: "Suppress"
										})
									]
								})]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium",
				children: "Sent"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-3 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
				children: [(d?.broadcasts ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "px-4 py-3 text-sm text-muted-foreground",
					children: "No client broadcasts yet."
				}), (d?.broadcasts ?? []).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-start gap-2 px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-sm",
								children: b.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "truncate text-xs text-muted-foreground",
								children: [
									b.subject,
									" · ",
									b.audience
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground",
							children: [
								b.sentCount,
								" sent · ",
								b.suppressedCount,
								" suppressed · ",
								b.opened,
								" opened"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: formatDateTime(b.createdAt)
						})
					]
				}, b.id))]
			})] })
		]
	});
}
function Stat({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs tracking-wide text-muted-foreground uppercase",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 font-mono text-2xl tabular-nums",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 truncate text-xs text-muted-foreground",
				children: hint
			})
		]
	});
}
//#endregion
export { BroadcastsPage as component };
