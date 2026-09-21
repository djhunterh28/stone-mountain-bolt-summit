import { o as __toESM } from "../_runtime.mjs";
import { a as formatDateTime } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { J as PageHeader, lt as Button, ot as Textarea, st as Label } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { t as Skeleton } from "./skeleton-BVFrMLkw.mjs";
import { a as sendEventReminders, c as setSmsOpt, i as sendCustomSms, l as toggleSmsAutomation, n as getSmsDesk, o as sendPaymentNotices, r as runDueSms, s as sendStatusUpdate } from "./sms-ppxHuCcU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sms-Bh2Elytu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SmsPage() {
	const desk = useQuery({
		queryKey: ["sms-desk"],
		queryFn: () => getSmsDesk()
	});
	const qc = useQueryClient();
	const [personId, setPersonId] = (0, import_react.useState)(1);
	const [custom, setCustom] = (0, import_react.useState)("{{first}} — ");
	function refresh() {
		qc.invalidateQueries({ queryKey: ["sms-desk"] });
		qc.invalidateQueries({ queryKey: ["unified-inbox"] });
		qc.invalidateQueries({ queryKey: ["bcast-desk"] });
	}
	const d = desk.data;
	const opted = (d?.optins ?? []).filter((o) => o.optedIn);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "SMS via QUO",
				subtitle: "Event reminders, payment confirmations, status updates, and custom texts. STOP is honored. Nothing goes out without an opt-in."
			}),
			desk.isLoading || !d ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-xl" }, i))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Opted in",
						value: String(d.stats.optedIn),
						hint: `${d.stats.suppressed} STOP on file`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Sent 7d",
						value: String(d.stats.sent7d),
						hint: `From ${d.account.fromNumber}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Due reminders",
						value: String(d.stats.dueReminders),
						hint: "Next 21 days, not yet pinged"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Due payments",
						value: String(d.stats.duePayments),
						hint: "Won, no confirmation text"
					})
				]
			}),
			d && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "mx-4 mt-4 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:mx-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "QUO"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: [
							d.account.label,
							" · ",
							d.account.fromNumber
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: d.account.status === "connected" ? "success" : "warn",
						children: d.account.status
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => runDueSms().then((r) => {
							toast.success(`Automations sent ${r.sent} · skipped ${r.skipped}`);
							refresh();
						}),
						children: "Run due automations"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 px-4 lg:grid-cols-2 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium",
								children: "Event reminders"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Shows in the next 21 days. One reminder per week per show."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 divide-y divide-border",
								children: (d?.upcoming ?? []).map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex flex-wrap items-center gap-2 py-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "truncate text-sm",
											children: u.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "truncate text-xs text-muted-foreground",
											children: [
												u.name,
												" · ",
												u.eventDate,
												" · ",
												u.loadIn ?? "no call",
												" · ",
												u.venue
											]
										})]
									}), !u.opted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "warn",
										children: "no opt-in"
									}) : u.reminded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										children: "sent"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "secondary",
										onClick: () => sendEventReminders({ data: { dealIds: [u.dealId] } }).then((r) => {
											toast.success(r.sent ? "Reminder via QUO" : "Skipped");
											refresh();
										}),
										children: "Send"
									})]
								}, u.dealId))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "mt-3",
								size: "sm",
								disabled: !d?.stats.dueReminders,
								onClick: () => sendEventReminders({ data: {} }).then((r) => {
									toast.success(`Reminded ${r.sent} · skipped ${r.skipped}`);
									refresh();
								}),
								children: "Send all due"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium",
								children: "Payment confirmations"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Won shows that have not had a payment text."
							}),
							(d?.payments ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-muted-foreground",
								children: "Every won show already has a confirmation, or no opt-in."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 divide-y divide-border",
								children: (d?.payments ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex flex-wrap items-center gap-2 py-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "truncate text-sm",
											children: p.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "truncate text-xs text-muted-foreground",
											children: [
												p.name,
												" · ",
												p.amount
											]
										})]
									}), p.opted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "secondary",
										onClick: () => sendPaymentNotices({ data: { dealIds: [p.dealId] } }).then((r) => {
											toast.success(r.sent ? "Payment text delivered" : "Skipped");
											refresh();
										}),
										children: "Confirm"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "warn",
										children: "no opt-in"
									})]
								}, p.dealId))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "mt-3",
								size: "sm",
								disabled: !d?.stats.duePayments,
								onClick: () => sendPaymentNotices({ data: {} }).then((r) => {
									toast.success(`Confirmed ${r.sent} · skipped ${r.skipped}`);
									refresh();
								}),
								children: "Confirm all due"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium",
								children: "Status updates"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Open shows with an opted-in day-of contact."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 divide-y divide-border",
								children: (d?.statusQueue ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex flex-wrap items-center gap-2 py-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "truncate text-sm",
											children: s.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "truncate text-xs text-muted-foreground",
											children: [
												s.name,
												" · ",
												s.stage
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "secondary",
										onClick: () => sendStatusUpdate({ data: { dealId: s.dealId } }).then((r) => {
											if (!r.ok) toast.error(r.error ?? "Blocked");
											else toast.success("Status text via QUO");
											refresh();
										}),
										children: "Ping"
									})]
								}, s.dealId))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium",
								children: "Custom message"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Same 160-character note you would type on a phone. Merge tags resolve."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "mt-3 space-y-2",
								onSubmit: (e) => {
									e.preventDefault();
									sendCustomSms({ data: {
										personId,
										body: custom
									} }).then((r) => {
										if (!r.ok) toast.error(r.error ?? "Blocked");
										else {
											toast.success("QUO delivered");
											refresh();
										}
									});
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "sms-who",
										children: "To"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										id: "sms-who",
										className: "h-10 w-full rounded-md bg-secondary px-2 text-sm shadow-[var(--shadow-border)]",
										value: personId,
										onChange: (e) => setPersonId(Number(e.target.value)),
										children: opted.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: o.personId,
											children: [o.name, o.phone ? ` · ${o.phone}` : ""]
										}, o.personId))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "sms-body",
										children: "Message"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										id: "sms-body",
										rows: 4,
										value: custom,
										onChange: (e) => setCustom(e.target.value)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [custom.length, " characters"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										size: "sm",
										disabled: !custom.trim(),
										children: "Send via QUO"
									})
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 px-4 lg:grid-cols-2 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Automations"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 divide-y divide-border",
						children: (d?.automations ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start justify-between gap-2 py-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm",
									children: a.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [a.detail, a.lastRun ? ` · last ${formatDateTime(a.lastRun)}` : ""]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: a.active ? "secondary" : "ghost",
								onClick: () => toggleSmsAutomation({ data: {
									id: a.id,
									active: !a.active
								} }).then(() => {
									toast.success(a.active ? "Paused" : "Armed");
									refresh();
								}),
								children: a.active ? "On" : "Off"
							})]
						}, a.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: "Opt-in registry"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "TCPA. A STOP reply takes them off. Restore only if they asked."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 divide-y divide-border",
							children: (d?.optins ?? []).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between gap-2 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate text-sm",
										children: o.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "truncate text-xs text-muted-foreground",
										children: [
											o.phone ?? "no mobile",
											" · ",
											o.source
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: o.optedIn ? "ghost" : "secondary",
									onClick: () => setSmsOpt({ data: {
										personId: o.personId,
										optedIn: !o.optedIn
									} }).then(refresh),
									children: o.optedIn ? "Opted in" : "STOP"
								})]
							}, o.personId))
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 px-4 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "Log"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
					children: (d?.messages ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									children: m.kind
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground",
									children: [
										m.direction,
										" · ",
										m.person,
										m.deal ? ` · ${m.deal}` : ""
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-auto text-xs text-muted-foreground",
									children: formatDateTime(m.at)
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm",
							children: m.body
						})]
					}, m.id))
				})]
			})
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
export { SmsPage as component };
