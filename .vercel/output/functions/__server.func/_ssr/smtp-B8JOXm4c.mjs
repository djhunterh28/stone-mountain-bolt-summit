import { o as __toESM } from "../_runtime.mjs";
import { a as formatDateTime } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { J as PageHeader, lt as Button, st as Label } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { t as Skeleton } from "./skeleton-BVFrMLkw.mjs";
import { a as toggleSmtpWorkflow, i as testSmtp, n as runSmtpWorkflows, r as sendSmtpTemplate, t as getSmtpDesk } from "./smtp-CmmXK4E5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/smtp-B8JOXm4c.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function statusVariant(status) {
	if (status === "delivered") return "success";
	if (status === "bounced") return "danger";
	if (status === "opened" || status === "clicked") return "steel";
	return "outline";
}
function SmtpPage() {
	const desk = useQuery({
		queryKey: ["smtp-desk"],
		queryFn: () => getSmtpDesk()
	});
	const qc = useQueryClient();
	const [templateId, setTemplateId] = (0, import_react.useState)(null);
	const [personId, setPersonId] = (0, import_react.useState)(1);
	function refresh() {
		qc.invalidateQueries({ queryKey: ["smtp-desk"] });
		qc.invalidateQueries({ queryKey: ["emails"] });
	}
	const d = desk.data;
	const tpl = d?.templates.find((t) => t.id === templateId) ?? d?.templates[0];
	const person = d?.people.find((p) => p.personId === personId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "SMTP",
				subtitle: "Transactional mail through your own mail host. Receipts, call sheets, invoices, resets. Not the client broadcast."
			}),
			desk.isLoading || !d ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-xl" }, i))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Sent 7d",
						value: String(d.stats.sent7d),
						hint: "Transactional only"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Delivered",
						value: String(d.stats.delivered),
						hint: "250 OK from the host"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Opened",
						value: String(d.stats.opened),
						hint: "Public tracking link"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Bounced",
						value: String(d.stats.bounced),
						hint: "Never marketing"
					})
				]
			}),
			d && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "mx-4 mt-4 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:mx-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: "SMTP account"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [
								d.account.host,
								":",
								d.account.port,
								" · ",
								d.account.tls,
								" · ",
								d.account.username
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [
								"From ",
								d.account.fromAddr,
								d.account.lastOk ? ` · last ok ${formatDateTime(d.account.lastOk)}` : ""
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: d.account.status === "connected" ? "success" : "warn",
						children: d.account.status
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "secondary",
							onClick: () => testSmtp().then((r) => {
								if (!r.ok) toast.error(r.error ?? "Failed");
								else toast.success(`Test delivered from ${r.fromAddr}`);
								refresh();
							}),
							children: "Send test"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => runSmtpWorkflows({ data: {} }).then((r) => {
								toast.success(`Workflows sent ${r.sent} · skipped ${r.skipped}`);
								refresh();
							}),
							children: "Run due workflows"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							variant: "ghost",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/domain",
								children: "Sending domain"
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 px-4 lg:grid-cols-2 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: "Transactional templates"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Receipts, call sheets, invoices, resets. Merge tags resolve per send."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-1",
							children: (d?.templates ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: tpl?.id === t.id ? "secondary" : "ghost",
								onClick: () => setTemplateId(t.id),
								children: t.name
							}, t.id))
						}),
						tpl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 rounded-lg bg-secondary p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium",
								children: tpl.subject
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
								className: "mt-2 whitespace-pre-wrap font-sans text-xs leading-relaxed text-muted-foreground",
								children: tpl.body
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "mt-3 space-y-2",
							onSubmit: (e) => {
								e.preventDefault();
								if (!tpl) return;
								sendSmtpTemplate({ data: {
									templateId: tpl.id,
									personId,
									dealId: person?.dealId ?? null
								} }).then((r) => {
									if (!r.ok) toast.error(r.error ?? "Blocked");
									else toast.success(`Delivered · ${r.fromAddr}`);
									refresh();
								});
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "smtp-to",
									children: "Send to"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									id: "smtp-to",
									className: "h-10 w-full rounded-md bg-secondary px-2 text-sm shadow-[var(--shadow-border)]",
									value: personId,
									onChange: (e) => setPersonId(Number(e.target.value)),
									children: (d?.people ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: p.personId,
										children: [
											p.name,
											" · ",
											p.email
										]
									}, p.personId))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									size: "sm",
									disabled: !tpl,
									children: "Send via SMTP"
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: "Automated sending"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: d ? `${d.stats.dueWon} won shows still need a receipt.` : "Workflows fire once per record."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 divide-y divide-border",
							children: (d?.workflows ?? []).map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex flex-wrap items-start justify-between gap-2 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm",
										children: w.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											w.templateName,
											" · ",
											w.triggerKey,
											w.lastRun ? ` · last ${formatDateTime(w.lastRun)}` : "",
											" · ",
											w.runs,
											" runs"
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: w.active ? "secondary" : "ghost",
										onClick: () => toggleSmtpWorkflow({ data: {
											id: w.id,
											active: !w.active
										} }).then(() => {
											toast.success(w.active ? "Paused" : "Armed");
											refresh();
										}),
										children: w.active ? "On" : "Off"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										onClick: () => runSmtpWorkflows({ data: { id: w.id } }).then((r) => {
											toast.success(`Sent ${r.sent} · skipped ${r.skipped}`);
											refresh();
										}),
										children: "Run"
									})]
								})]
							}, w.id))
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 px-4 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "Delivery log"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
					children: (d?.messages ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: statusVariant(m.opened ? "opened" : m.status),
									children: m.opened ? "opened" : m.status
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "min-w-0 flex-1 truncate text-sm",
									children: m.subject
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "text-xs text-muted-foreground underline-offset-2 hover:underline",
									href: `/t/${m.id}`,
									children: "Open track"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: formatDateTime(m.at)
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [
								m.person ?? m.toAddr,
								m.deal ? ` · ${m.deal}` : "",
								" · ",
								m.fromAddr
							]
						})]
					}, m.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 px-4 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "SMTP events"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
					children: (d?.events ?? []).map((ev) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center gap-2 px-4 py-2.5 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: ev.event
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-0 flex-1 truncate",
								children: ev.subject
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: ev.detail
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: formatDateTime(ev.at)
							})
						]
					}, ev.id))
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
export { SmtpPage as component };
