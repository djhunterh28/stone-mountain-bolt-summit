import { a as formatDateTime, t as cn } from "./utils-BjcRTCQS.mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as ULTIMATE_LIMITS } from "./limits-DbP6y05c.mjs";
import { C as updateAccessPolicy, b as testSignIn, l as getUsage, m as lockSession, s as getAccessState, t as ACCESS_LOCATIONS, v as setSessionContext } from "./governance-Bb-_vds7.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as TabsList, J as PageHeader, Q as TabsContent, Xn as resolveAlert, Z as Tabs, ct as Input, et as TabsTrigger, fr as useUi, kn as getSecurity, lt as Button, nr as toggleRule, ot as Textarea } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { t as Switch } from "./switch-BLKjtJkd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/security-DLjPY9zL.js
var import_jsx_runtime = require_jsx_runtime();
function SecurityPage() {
	const data = useQuery({
		queryKey: ["security"],
		queryFn: () => getSecurity()
	});
	const access = useQuery({
		queryKey: ["access"],
		queryFn: () => getAccessState()
	});
	const usage = useQuery({
		queryKey: ["usage"],
		queryFn: () => getUsage()
	});
	const qc = useQueryClient();
	const d = data.data;
	const a = access.data;
	const { memberId } = useUi();
	const bootName = "current seat";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Security",
			subtitle: "Login policy, IP and hours, suspicious activity, encryption — Ultimate governance."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-4 sm:px-6",
			children: [a && !a.allowed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive",
				children: ["Access currently denied: ", a.reason]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "policy",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "flex h-auto flex-wrap",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "policy",
								children: "Login policy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "access",
								children: "IP & hours"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "alerts",
								children: "Alerts"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "fortify",
								children: "Fortified"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "rules",
								children: "Rules"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "devices",
								children: "Devices"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "audit",
								children: "Audit log"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "webhooks",
								children: "Webhooks"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "policy",
						className: "mt-4 space-y-4",
						children: a && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolicyRow, {
									label: "MFA required",
									hint: "Every seat. Recovery codes held by Dana.",
									checked: a.policy.mfaRequired,
									onChange: (v) => updateAccessPolicy({ data: { mfaRequired: v } }).then(() => qc.invalidateQueries({ queryKey: ["access"] }))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolicyRow, {
									label: "Admin approval for new devices",
									hint: "Owners confirm first login from an unknown machine.",
									checked: a.policy.adminApproval,
									onChange: (v) => updateAccessPolicy({ data: { adminApproval: v } }).then(() => qc.invalidateQueries({ queryKey: ["access"] }))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolicyRow, {
									label: "Notify on export",
									hint: "CSV and bulk mail raise a real-time alert.",
									checked: a.policy.exportApproval,
									onChange: (v) => updateAccessPolicy({ data: { exportApproval: v } }).then(() => qc.invalidateQueries({ queryKey: ["access"] }))
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs text-muted-foreground",
									children: "Idle lock (minutes)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex flex-wrap gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											defaultValue: a.policy.idleMinutes,
											className: "h-9 w-24",
											onBlur: (e) => updateAccessPolicy({ data: { idleMinutes: Number(e.target.value) || 15 } }).then(() => qc.invalidateQueries({ queryKey: ["access"] }))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "secondary",
											onClick: () => lockSession().then(() => {
												qc.invalidateQueries({ queryKey: ["access"] });
												toast.message("Workspace locked");
											}),
											children: "Lock now"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											onClick: () => {
												testSignIn({ data: { memberName: bootName } }).then((r) => {
													qc.invalidateQueries({ queryKey: ["access"] });
													qc.invalidateQueries({ queryKey: ["security"] });
													if (r.ok) toast.success("Sign-in allowed");
													else toast.error(r.reason ?? "Denied");
												});
											},
											children: "Test sign-in"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-xs text-muted-foreground",
									children: [
										"Failed attempts ",
										a.session.failedAttempts,
										" / ",
										a.policy.maxFailed,
										". Seat id ",
										memberId,
										"."
									]
								})
							]
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "access",
						className: "mt-4 space-y-4",
						children: a && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: [
									"Clock ",
									a.hourLabel,
									". Simulate a location or off-hours to see the policy fire."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-2 sm:grid-cols-2",
								children: ACCESS_LOCATIONS.map((loc) => {
									const active = a.session.ip === loc.ip;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setSessionContext({ data: {
											locationLabel: loc.label,
											ip: loc.ip,
											clockMode: a.session.clockMode
										} }).then((r) => {
											qc.invalidateQueries({ queryKey: ["access"] });
											qc.invalidateQueries({ queryKey: ["security"] });
											if (!r.ok) toast.error(r.reason ?? "Denied");
											else toast.success(`Session from ${loc.label}`);
										}),
										className: cn("rounded-xl p-4 text-left shadow-[var(--shadow-border)]", active ? "bg-card ring-1 ring-ring" : "bg-card hover:shadow-[var(--shadow-border-hover)]"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-medium",
											children: loc.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-mono text-xs text-muted-foreground",
											children: loc.ip
										})]
									}, loc.ip);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolicyRow, {
										label: "IP allow list",
										hint: "Shop + home ranges. Anything else is blocked and alerted.",
										checked: a.policy.ipEnforced,
										onChange: (v) => updateAccessPolicy({ data: { ipEnforced: v } }).then(() => qc.invalidateQueries({ queryKey: ["access"] }))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolicyRow, {
										label: "Office hours only",
										hint: `${a.policy.officeStart}–${a.policy.officeEnd} ${a.policy.timezone}`,
										checked: a.policy.hoursEnforced,
										onChange: (v) => updateAccessPolicy({ data: { hoursEnforced: v } }).then(() => qc.invalidateQueries({ queryKey: ["access"] }))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolicyRow, {
										label: "Pretend it is 02:30 ET",
										hint: "Forces the off-hours rule without waiting for midnight.",
										checked: a.session.clockMode === "offhours",
										onChange: (v) => setSessionContext({ data: {
											locationLabel: a.session.locationLabel,
											ip: a.session.ip,
											clockMode: v ? "offhours" : "live"
										} }).then((r) => {
											qc.invalidateQueries({ queryKey: ["access"] });
											qc.invalidateQueries({ queryKey: ["security"] });
											if (!r.ok) toast.error(r.reason ?? "Denied");
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs text-muted-foreground",
										children: "Allow list (CIDR or IP, one per line)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										className: "mt-2",
										rows: 3,
										defaultValue: a.policy.ipAllowlist.join("\n"),
										onBlur: (e) => updateAccessPolicy({ data: { ipAllowlist: e.target.value } }).then(() => qc.invalidateQueries({ queryKey: ["access"] }))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex flex-wrap gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												defaultValue: a.policy.officeStart,
												className: "h-9 w-24",
												onBlur: (e) => updateAccessPolicy({ data: { officeStart: e.target.value } }).then(() => qc.invalidateQueries({ queryKey: ["access"] }))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "self-center text-xs text-muted-foreground",
												children: "to"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												defaultValue: a.policy.officeEnd,
												className: "h-9 w-24",
												onBlur: (e) => updateAccessPolicy({ data: { officeEnd: e.target.value } }).then(() => qc.invalidateQueries({ queryKey: ["access"] }))
											})
										]
									})
								]
							})
						] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "alerts",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
							children: (d?.alerts ?? []).map((al) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex flex-wrap items-center gap-3 px-4 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: al.severity === "high" ? "danger" : al.severity === "medium" ? "warn" : "outline",
										children: al.severity
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm",
											children: al.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: al.detail
										})]
									}),
									al.resolved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "success",
										children: "resolved"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "secondary",
										onClick: () => resolveAlert({ data: { id: al.id } }).then(() => qc.invalidateQueries({ queryKey: ["security"] })),
										children: "Resolve"
									})
								]
							}, al.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "fortify",
						className: "mt-4 space-y-4",
						children: a && usage.data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-3 px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: a.policy.encryptionAtRest,
										onCheckedChange: (v) => updateAccessPolicy({ data: { encryptionAtRest: v } }).then(() => qc.invalidateQueries({ queryKey: ["access"] })),
										className: "mt-1"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-medium",
										children: "Encryption at rest"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "Postgres volume encrypted. Field-level wrap on payment cards and signed documents."
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "px-4 py-3 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium",
										children: "Transport"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground",
										children: "TLS 1.3. Session tokens rotate every 12 hours."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "px-4 py-3 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium",
										children: "SSO"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground",
										children: "SAML / OIDC ready. Northline currently uses seat MFA."
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-medium",
								children: "Ultimate capacity"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-3 space-y-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
										label: "Custom reports",
										used: usage.data.reports,
										cap: ULTIMATE_LIMITS.reports
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
										label: "Custom fields",
										used: usage.data.fields,
										cap: ULTIMATE_LIMITS.fields
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
										label: "Automations",
										used: usage.data.automations,
										cap: ULTIMATE_LIMITS.automations
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
										label: "Team inboxes",
										used: usage.data.teamInboxes,
										cap: ULTIMATE_LIMITS.teamInboxes
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
										label: "Enrichment credits",
										used: usage.data.enrichmentUsed,
										cap: ULTIMATE_LIMITS.enrichmentCredits
									})
								]
							})]
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "rules",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
							children: (d?.rules ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-3 px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: r.active,
									onCheckedChange: (v) => toggleRule({ data: {
										id: r.id,
										active: v
									} }).then(() => qc.invalidateQueries({ queryKey: ["security"] })),
									className: "mt-1"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: r.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: r.detail
								})] })]
							}, r.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "devices",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
							children: (d?.devices ?? []).map((dev) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-3 px-4 py-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										dev.memberName,
										" · ",
										dev.device
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: [
											dev.location,
											" · ",
											formatDateTime(dev.lastActive)
										]
									})]
								}), dev.current && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "steel",
									children: "current"
								})]
							}, dev.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "audit",
						className: "mt-4 overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "text-left text-xs text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2 font-medium",
										children: "When"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2 font-medium",
										children: "Actor"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2 font-medium",
										children: "Action"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2 font-medium",
										children: "Detail"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (d?.auditLog ?? []).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 text-xs text-muted-foreground",
										children: formatDateTime(row.createdAt)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2",
										children: row.actor
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-3 py-2",
										children: [
											row.action,
											" ",
											row.entity
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-3 py-2 text-muted-foreground",
										children: [
											row.detail,
											" · ",
											row.ip,
											" · ",
											row.device
										]
									})
								]
							}, row.id)) })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "webhooks",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
							children: (d?.webhooks ?? []).map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
										className: "text-xs",
										children: w.url
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: w.active ? "success" : "outline",
										children: w.event
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: w.lastStatus
								})]
							}, w.id))
						})
					})
				]
			})]
		})]
	});
}
function PolicyRow({ label, hint, checked, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex items-start gap-3 px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
			checked,
			onCheckedChange: onChange,
			className: "mt-1"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm font-medium",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: hint
		})] })]
	});
}
function Meter({ label, used, cap }) {
	const pct = Math.min(100, Math.round(used / cap * 100));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "font-mono tabular-nums text-muted-foreground",
			children: [
				used,
				" / ",
				cap
			]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-1 h-1.5 overflow-hidden rounded-full bg-muted",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full bg-primary",
			style: { width: `${pct}%` }
		})
	})] });
}
//#endregion
export { SecurityPage as component };
