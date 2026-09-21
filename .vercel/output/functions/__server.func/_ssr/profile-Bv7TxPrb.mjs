import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as TabsContent, At as inviteSubuser, Dt as getPortalMe, Lt as listNotifPrefs, Nt as listAudit, Q as Tabs, Vt as listSubusers, X as PageHeader, Xt as setNotifPref, ct as Label, et as TabsList, lt as Input, on as updatePortalProfile, tt as TabsTrigger, ur as useUi, ut as Button } from "./router-Bkw81Fhc.mjs";
import { t as Badge } from "./badge-BQYjLRpy.mjs";
import { t as Switch } from "./switch-AWJU8D6h.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-Bv7TxPrb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var THEMES = [
	"paper",
	"graphite",
	"stage",
	"dawn"
];
function ProfilePage() {
	const me = useQuery({
		queryKey: ["portal-me"],
		queryFn: () => getPortalMe()
	});
	const subs = useQuery({
		queryKey: ["subusers"],
		queryFn: () => listSubusers()
	});
	const prefs = useQuery({
		queryKey: ["notif-prefs"],
		queryFn: () => listNotifPrefs()
	});
	const audit = useQuery({
		queryKey: ["audit-me"],
		queryFn: () => listAudit()
	});
	const qc = useQueryClient();
	const setDirty = useUi((s) => s.setDirty);
	const p = me.data;
	const [name, setName] = (0, import_react.useState)("");
	const [invite, setInvite] = (0, import_react.useState)({
		name: "",
		email: ""
	});
	if (!p) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "p-6 text-sm text-muted-foreground",
		children: "Loading profile…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: p.name,
			subtitle: `${p.email} · ${p.role} · ${p.tenantName ?? "House"}`
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-4 sm:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "info",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "flex h-auto flex-wrap",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "info",
								children: "Contact"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "team",
								children: "Team"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "access",
								children: "Accessibility"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "notes",
								children: "Notifications"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "audit",
								children: "Audit"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "info",
						className: "mt-4 max-w-lg space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									defaultValue: p.name,
									onChange: (e) => {
										setName(e.target.value);
										setDirty(true);
									}
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Email is the username and cannot be changed here. Updates append to Pipedrive."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => updatePortalProfile({ data: { name: name || p.name } }).then(() => {
									setDirty(false);
									toast.success("Profile saved · Pipedrive append");
									qc.invalidateQueries({ queryKey: ["portal-me"] });
								}),
								children: "Save"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "team",
						className: "mt-4 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "flex flex-wrap gap-2",
							onSubmit: (e) => {
								e.preventDefault();
								inviteSubuser({ data: {
									...invite,
									permissions: {
										files: true,
										projects: true,
										billing: false,
										approvals: true
									}
								} }).then((r) => {
									if (!r.ok) toast.error("error" in r ? r.error : "Invite failed");
									else toast.success("Invited");
									qc.invalidateQueries({ queryKey: ["subusers"] });
								});
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Name",
									value: invite.name,
									onChange: (e) => setInvite({
										...invite,
										name: e.target.value
									}),
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "email",
									placeholder: "Email",
									value: invite.email,
									onChange: (e) => setInvite({
										...invite,
										email: e.target.value
									}),
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									variant: "secondary",
									children: "Invite sub-user"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
							children: [(subs.data ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between px-4 py-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [s.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs text-muted-foreground",
									children: s.email
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									children: "granular"
								})]
							}, s.userId)), (subs.data ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "px-4 py-6 text-sm text-muted-foreground",
								children: "No teammates yet."
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "access",
						className: "mt-4 max-w-lg space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Portal theme" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-2",
									children: THEMES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: p.theme === t ? "secondary" : "ghost",
										onClick: () => updatePortalProfile({ data: { theme: t } }).then(() => qc.invalidateQueries({ queryKey: ["portal-me"] })),
										children: t
									}, t))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center justify-between gap-3 text-sm",
								children: ["Compact mode", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: p.compact,
									onCheckedChange: (v) => updatePortalProfile({ data: { compact: v } }).then(() => qc.invalidateQueries({ queryKey: ["portal-me"] }))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center justify-between gap-3 text-sm",
								children: ["High contrast", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: p.highContrast,
									onCheckedChange: (v) => updatePortalProfile({ data: { highContrast: v } }).then(() => qc.invalidateQueries({ queryKey: ["portal-me"] }))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center justify-between gap-3 text-sm",
								children: ["Screen-reader optimization", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: p.screenReader,
									onCheckedChange: (v) => updatePortalProfile({ data: { screenReader: v } }).then(() => qc.invalidateQueries({ queryKey: ["portal-me"] }))
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "notes",
						className: "mt-4 space-y-2",
						children: (prefs.data ?? []).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center justify-between rounded-lg bg-card px-4 py-3 text-sm shadow-[var(--shadow-border)]",
							children: [n.kind, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: n.enabled,
								onCheckedChange: (v) => setNotifPref({ data: {
									tenantId: n.tenantId,
									kind: n.kind,
									enabled: v
								} }).then(() => qc.invalidateQueries({ queryKey: ["notif-prefs"] }))
							})]
						}, `${n.tenantId}-${n.kind}`))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "audit",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-border rounded-xl bg-card text-sm shadow-[var(--shadow-border)]",
							children: (audit.data ?? []).slice(0, 20).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "px-4 py-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: a.action
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: a.entity
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: [
											a.email,
											" · ",
											a.ip
										]
									})
								]
							}, a.id))
						})
					})
				]
			})
		})]
	});
}
//#endregion
export { ProfilePage as component };
