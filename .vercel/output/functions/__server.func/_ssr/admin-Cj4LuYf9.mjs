import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as formatBytes } from "./utils-DLVA4J7b.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as TabsContent, Ct as getDashboard, It as listEventRequests, Lt as listNotifPrefs, Nt as listAudit, Q as Tabs, Ut as listTenants, Vt as listSubusers, X as PageHeader, Xt as setNotifPref, Zt as setTenantQuota, et as TabsList, lt as Input, nn as switchTenant, tt as TabsTrigger, ut as Button } from "./router-Bkw81Fhc.mjs";
import { t as Badge } from "./badge-BQYjLRpy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-Cj4LuYf9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPage() {
	const qc = useQueryClient();
	const tenants = useQuery({
		queryKey: ["tenants"],
		queryFn: () => listTenants()
	});
	const audit = useQuery({
		queryKey: ["audit"],
		queryFn: () => listAudit()
	});
	const events = useQuery({
		queryKey: ["event-requests"],
		queryFn: () => listEventRequests()
	});
	const prefs = useQuery({
		queryKey: ["notif-prefs"],
		queryFn: () => listNotifPrefs()
	});
	const team = useQuery({
		queryKey: ["subusers"],
		queryFn: () => listSubusers()
	});
	const dash = useQuery({
		queryKey: ["dashboard"],
		queryFn: () => getDashboard()
	});
	const [password, setPassword] = (0, import_react.useState)("");
	const [quota, setQuota] = (0, import_react.useState)({});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Admin",
				subtitle: "Hurricane staff controls — clients, storage, audit, and event requests from the marketing site."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 px-4 sm:grid-cols-3 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground uppercase",
							children: "Tenants"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 font-mono text-2xl",
							children: tenants.data?.length ?? "—"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground uppercase",
							children: "Open signatures"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 font-mono text-2xl",
							children: dash.data?.signatures ?? "—"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground uppercase",
							children: "Event requests"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 font-mono text-2xl",
							children: events.data?.length ?? "—"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 px-4 sm:px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					defaultValue: "clients",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
							className: "flex h-auto flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "clients",
									children: "Clients"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "team",
									children: "Team"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "audit",
									children: "Audit"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "storage",
									children: "Storage"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "switch",
									children: "Switcher"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "events",
									children: "Event requests"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "notes",
									children: "Notifications"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "clients",
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
								children: (tenants.data ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex flex-wrap items-center justify-between gap-2 px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-medium",
										children: t.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: [
											t.industry,
											" · ",
											t.slug
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "outline",
										children: [
											Math.round(t.usedMb),
											" MB / ",
											t.quotaGb,
											" GB"
										]
									})]
								}, t.id))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "team",
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "divide-y divide-border rounded-xl bg-card text-sm shadow-[var(--shadow-border)]",
								children: [(team.data ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "px-4 py-3",
									children: [
										s.name,
										" · ",
										s.email
									]
								}, s.userId)), (team.data ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "px-4 py-6 text-muted-foreground",
									children: "Invite from Profile."
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "audit",
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "max-h-[28rem] overflow-auto divide-y divide-border rounded-xl bg-card text-sm shadow-[var(--shadow-border)]",
								children: (audit.data ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "px-4 py-2.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: a.action
										}),
										" ",
										a.entity,
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-muted-foreground",
											children: [
												a.email,
												" · ",
												a.ip,
												" · ",
												a.at
											]
										})
									]
								}, a.id))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "storage",
							className: "mt-4 space-y-3",
							children: (tenants.data ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-3 rounded-xl bg-card px-4 py-3 shadow-[var(--shadow-border)]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-40 flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm",
												children: t.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-1 h-1.5 overflow-hidden rounded-full bg-muted",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "h-full bg-primary",
													style: { width: `${Math.min(100, t.usedMb / (t.quotaGb * 1e3) * 100)}%` }
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-1 text-xs text-muted-foreground",
												children: [
													formatBytes(t.usedMb * 1e6),
													" of ",
													t.quotaGb,
													" GB"
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "w-24",
										type: "number",
										value: quota[t.id] ?? String(t.quotaGb),
										onChange: (e) => setQuota((s) => ({
											...s,
											[t.id]: e.target.value
										}))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "secondary",
										onClick: () => setTenantQuota({ data: {
											tenantId: t.id,
											quotaGb: Number(quota[t.id] ?? t.quotaGb)
										} }).then(() => {
											toast.success("Quota saved");
											qc.invalidateQueries({ queryKey: ["tenants"] });
										}),
										children: "Set"
									})
								]
							}, t.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "switch",
							className: "mt-4 max-w-md space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "Re-enter staff password to impersonate a client tenant."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "password",
									value: password,
									onChange: (e) => setPassword(e.target.value),
									placeholder: "Staff password"
								}),
								(tenants.data ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "secondary",
									className: "w-full justify-between",
									onClick: () => switchTenant({ data: {
										tenantId: t.id,
										password
									} }).then((r) => {
										if (!r.ok) toast.error("error" in r ? r.error : "Blocked");
										else {
											toast.success(`Now viewing ${t.name}`);
											qc.invalidateQueries({ queryKey: ["portal-me"] });
											qc.invalidateQueries({ queryKey: ["dashboard"] });
										}
									}),
									children: [t.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "impersonate"
									})]
								}, t.id)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: () => switchTenant({ data: { tenantId: null } }).then(() => qc.invalidateQueries({ queryKey: ["portal-me"] })),
									children: "Exit impersonation"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "events",
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
								children: (events.data ?? []).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "px-4 py-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm font-medium",
												children: e.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												children: e.status
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: [
												e.email,
												" · ",
												e.venue,
												" · ",
												e.guests ?? "?",
												" pax"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-sm",
											children: e.notes
										})
									]
								}, e.id))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "notes",
							className: "mt-4 space-y-2",
							children: (prefs.data ?? []).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center justify-between rounded-lg bg-card px-4 py-3 text-sm shadow-[var(--shadow-border)]",
								children: [
									"Tenant ",
									n.tenantId,
									" · ",
									n.kind,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: n.enabled,
										onChange: (e) => setNotifPref({ data: {
											tenantId: n.tenantId,
											kind: n.kind,
											enabled: e.target.checked
										} }).then(() => qc.invalidateQueries({ queryKey: ["notif-prefs"] }))
									})
								]
							}, `${n.tenantId}-${n.kind}`))
						})
					]
				})
			})
		]
	});
}
//#endregion
export { AdminPage as component };
