import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as ULTIMATE_LIMITS } from "./limits-DbP6y05c.mjs";
import { l as getUsage, o as createTeamInbox } from "./governance-Bb-_vds7.mjs";
import { I as Moon, L as Monitor, m as Sun } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as TabsList, Fn as listFields, J as PageHeader, Jt as saveBranding, Q as TabsContent, Wn as listScores, Z as Tabs, b as getAiDesk, bn as createField, cr as THEME_SWATCHES, ct as Input, et as TabsTrigger, fr as useUi, lt as Button, nn as syncPipedrive, or as updateStage, ot as Textarea, sr as THEME_OPTIONS, ut as MemberAvatar, wn as getBootstrap, xt as getBranding } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { t as Switch } from "./switch-BLKjtJkd.mjs";
import { h as revokeToken, n as createApiToken, o as getAdmin } from "./ultimate-DAnhRr51.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-BxrriONd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var THEME_ICONS = {
	light: Sun,
	dark: Moon,
	system: Monitor
};
function AppearancePanel() {
	const theme = useUi((s) => s.theme);
	const setTheme = useUi((s) => s.setTheme);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Daylight is warm paper and graphite. Nightline is the original steel desk. System follows the device."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-3",
			children: THEME_OPTIONS.map((opt) => {
				const Icon = THEME_ICONS[opt.id];
				const active = theme === opt.id;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setTheme(opt.id),
					className: cn("rounded-xl p-4 text-left shadow-[var(--shadow-border)] transition-[box-shadow,background-color] duration-150 ease-out", active ? "bg-card ring-1 ring-ring" : "bg-card hover:shadow-[var(--shadow-border-hover)]"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 text-muted-foreground" }), active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "steel",
								children: "on"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 text-sm font-medium",
							children: opt.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-muted-foreground",
							children: opt.hint
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-4 flex h-10 overflow-hidden rounded-md shadow-[var(--shadow-border)]",
							"aria-hidden": true,
							children: opt.id === "system" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-1/2",
								style: { background: THEME_SWATCHES.light.surface }
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-1/2",
								style: { background: THEME_SWATCHES.dark.surface }
							})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-1/3",
									style: { background: THEME_SWATCHES[opt.id].rail }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1",
									style: { background: THEME_SWATCHES[opt.id].surface }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-8",
									style: { background: THEME_SWATCHES[opt.id].ink }
								})
							] })
						})
					]
				}, opt.id);
			})
		})]
	});
}
function IntegrationsPanel() {
	const brand = useQuery({
		queryKey: ["branding"],
		queryFn: () => getBranding()
	});
	const qc = useQueryClient();
	const b = brand.data;
	if (!b) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Loading connectors…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-medium",
						children: "Pipedrive"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: [
							"Last sync ",
							b.pipedriveSyncedAt ?? "never",
							" · bidirectional upsert"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							defaultValue: b.pipedriveToken,
							placeholder: "API token"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => syncPipedrive().then((r) => {
								toast.success(`Synced ${r.people} people · ${r.deals} deals`);
								qc.invalidateQueries({ queryKey: ["branding"] });
							}),
							children: "Sync now"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-medium",
					children: "Google Drive"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: b.driveConnected ? "Connected · chunked uploads to 10 GB" : "Disconnected"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-medium",
						children: "Calendly, TidyCal, Acuity & Zoom"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Per-user scheduling plus Deezer and Google Places live on Integrations."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							variant: "secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/scheduler",
								children: "Scheduler"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							variant: "secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/integrations",
								children: "All integrations"
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-medium",
					children: "Zoho Books"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					defaultValue: b.zohoOrg,
					placeholder: "Org id",
					onBlur: (e) => saveBranding({ data: { zohoOrg: e.target.value } })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "space-y-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-medium",
						children: "E-sign branding"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						defaultValue: b.logoText,
						onBlur: (e) => saveBranding({ data: { logoText: e.target.value } })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						defaultValue: b.senderName,
						onBlur: (e) => saveBranding({ data: { senderName: e.target.value } })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						defaultValue: b.watermarkText,
						onBlur: (e) => saveBranding({ data: { watermarkText: e.target.value } })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						defaultValue: b.reminderTemplate,
						onBlur: (e) => saveBranding({ data: { reminderTemplate: e.target.value } })
					})
				]
			})
		]
	});
}
function SettingsPage() {
	const boot = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	const fields = useQuery({
		queryKey: ["fields"],
		queryFn: () => listFields()
	});
	const scores = useQuery({
		queryKey: ["scores"],
		queryFn: () => listScores()
	});
	const admin = useQuery({
		queryKey: ["admin"],
		queryFn: () => getAdmin()
	});
	const usage = useQuery({
		queryKey: ["usage"],
		queryFn: () => getUsage()
	});
	const qc = useQueryClient();
	const [pipeId, setPipeId] = (0, import_react.useState)(1);
	const pipe = boot.data?.pipelines.find((p) => p.id === pipeId) ?? boot.data?.pipelines[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Settings",
			subtitle: "Appearance, pipelines, fields, capacity, connectors, and team inboxes."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-4 sm:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "appearance",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "flex h-auto flex-wrap",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "appearance",
								children: "Appearance"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "pipelines",
								children: "Pipelines"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "fields",
								children: "Fields"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "team",
								children: "Team"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "visibility",
								children: "Visibility"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "routing",
								children: "Lead routing"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "mailboxes",
								children: "Mailboxes"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "capacity",
								children: "Capacity"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "api",
								children: "API"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "scores",
								children: "Scores"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "integrations",
								children: "Integrations"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "portal",
								children: "White-label"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "appearance",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppearancePanel, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "pipelines",
						className: "mt-4 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: (boot.data?.pipelines ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: pipeId === p.id ? "secondary" : "ghost",
								onClick: () => setPipeId(p.id),
								children: p.name
							}, p.id))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
							children: pipe?.stages.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex flex-wrap items-center gap-3 px-4 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-6 text-xs text-muted-foreground",
										children: i + 1
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										defaultValue: s.name,
										className: "h-9 max-w-48",
										onBlur: (e) => {
											if (e.target.value !== s.name) updateStage({ data: {
												id: s.id,
												name: e.target.value
											} }).then(() => {
												toast.success("Stage renamed");
												qc.invalidateQueries({ queryKey: ["bootstrap"] });
											});
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 text-xs text-muted-foreground",
										children: [
											"Rotting",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												defaultValue: s.rottingDays,
												className: "h-9 w-16",
												onBlur: (e) => updateStage({ data: {
													id: s.id,
													rottingDays: Number(e.target.value)
												} }).then(() => qc.invalidateQueries({ queryKey: ["bootstrap"] }))
											}),
											"d"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 text-xs text-muted-foreground",
										children: [
											"Win",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												defaultValue: s.probability,
												className: "h-9 w-16",
												onBlur: (e) => updateStage({ data: {
													id: s.id,
													probability: Number(e.target.value)
												} }).then(() => qc.invalidateQueries({ queryKey: ["bootstrap"] }))
											}),
											"%"
										]
									})
								]
							}, s.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "fields",
						className: "mt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-3 text-sm text-muted-foreground",
								children: "Required and pipeline-specific fields. Ultimate allows 500 custom fields."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "mb-4 flex flex-wrap gap-2",
								onSubmit: (e) => {
									e.preventDefault();
									const form = e.currentTarget;
									const fd = new FormData(form);
									createField({ data: {
										entity: String(fd.get("entity") || "deal"),
										name: String(fd.get("name") || "New field"),
										fieldType: String(fd.get("fieldType") || "text"),
										required: fd.get("required") === "on",
										pipelineId: pipeId
									} }).then((r) => {
										if (r && "error" in r && r.error) toast.error(r.error);
										else {
											toast.success("Field added");
											form.reset();
										}
										qc.invalidateQueries({ queryKey: ["fields"] });
										qc.invalidateQueries({ queryKey: ["usage"] });
									});
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										name: "name",
										placeholder: "Field name",
										className: "w-40"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										name: "entity",
										placeholder: "deal / person / org",
										className: "w-36",
										defaultValue: "deal"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										name: "fieldType",
										placeholder: "type",
										className: "w-28",
										defaultValue: "text"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											name: "required"
										}), " Required"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										size: "sm",
										children: "Add field"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
								children: (fields.data ?? []).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-3 px-4 py-2.5 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex-1",
											children: f.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: f.entity
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											children: f.fieldType
										}),
										f.required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "warn",
											children: "required"
										})
									]
								}, f.id))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "team",
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-3 text-sm text-muted-foreground",
							children: "25 teams, 25 visibility groups, 25 permission sets on Ultimate."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
							children: (boot.data?.members ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-3 px-4 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemberAvatar, {
										initials: m.initials,
										tone: m.tone
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm",
											children: m.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-muted-foreground",
											children: [
												m.title,
												" · ",
												m.teamName,
												" · ",
												m.email
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										children: m.role
									})
								]
							}, m.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "visibility",
						className: "mt-4 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "25 visibility groups and 25 permission sets on Ultimate."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
								children: (admin.data?.groups ?? []).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "px-4 py-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-medium",
											children: g.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: g.detail
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 text-xs text-muted-foreground",
											children: [g.memberIds.length, " seats"]
										})
									]
								}, g.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
								children: (admin.data?.permissions ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-3 px-4 py-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm font-medium",
												children: p.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-muted-foreground",
												children: p.detail
											})]
										}),
										p.canAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "steel",
											children: "admin"
										}),
										p.canExport && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											children: "export"
										}),
										p.canDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "warn",
											children: "delete"
										})
									]
								}, p.id))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "routing",
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-3 text-sm text-muted-foreground",
							children: "Source rules. Web forms already land on the mapped AE."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
							children: (admin.data?.routes ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-3 px-4 py-3 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex-1",
										children: r.source
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: r.ownerName ?? "Unassigned"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: r.active ? "success" : "outline",
										children: r.active ? "on" : "off"
									})
								]
							}, r.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "mailboxes",
						className: "mt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mb-3 text-sm text-muted-foreground",
								children: [
									"5 synced accounts per user, plus ",
									ULTIMATE_LIMITS.teamInboxes,
									" shared team inboxes. Outbound still leaves from the",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/domain",
										className: "underline underline-offset-2",
										children: "authenticated sending domain"
									}),
									"."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "mb-4 flex flex-wrap gap-2",
								onSubmit: (e) => {
									e.preventDefault();
									const form = e.currentTarget;
									const fd = new FormData(form);
									createTeamInbox({ data: { address: String(fd.get("address") || "") } }).then((r) => {
										if (!r.ok) toast.error(r.error ?? "Could not add inbox");
										else {
											toast.success("Shared inbox live");
											form.reset();
										}
										qc.invalidateQueries({ queryKey: ["admin"] });
										qc.invalidateQueries({ queryKey: ["usage"] });
									});
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									name: "address",
									placeholder: "ops@northline.av",
									className: "w-56"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									size: "sm",
									children: "Add team inbox"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
								children: (admin.data?.accounts ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-3 px-4 py-3 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: a.address }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-muted-foreground",
											children: [
												a.kind,
												" · ",
												a.memberName ?? "shared"
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: a.synced ? "success" : "outline",
										children: a.synced ? "synced" : "paused"
									})]
								}, a.id))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "capacity",
						className: "mt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-3 text-sm text-muted-foreground",
								children: "Ultimate ceilings: 500 reports, 500 fields, 500 automations, 10 team inboxes, 500 enrichment credits."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "space-y-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
										label: "Custom reports",
										used: usage.data?.reports ?? 0,
										cap: ULTIMATE_LIMITS.reports
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
										label: "Custom fields",
										used: usage.data?.fields ?? 0,
										cap: ULTIMATE_LIMITS.fields
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
										label: "Automations",
										used: usage.data?.automations ?? 0,
										cap: ULTIMATE_LIMITS.automations
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
										label: "Team inboxes",
										used: usage.data?.teamInboxes ?? 0,
										cap: ULTIMATE_LIMITS.teamInboxes
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
										label: "Enrichment credits used",
										used: usage.data?.enrichmentUsed ?? 0,
										cap: ULTIMATE_LIMITS.enrichmentCredits
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-xs text-muted-foreground",
								children: usage.data ? `${usage.data.enrichmentRemaining} enrichment lookups remaining this cycle.` : "Loading usage…"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "api",
						className: "mt-4 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Token-based REST. Ultimate rate limit is 210,000 × seats. Full catalog, Try-it, and webhook payloads live on Developers."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								variant: "secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/developers",
									children: "Open developer console"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "flex flex-wrap gap-2",
								onSubmit: (e) => {
									e.preventDefault();
									const fd = new FormData(e.currentTarget);
									createApiToken({ data: {
										name: String(fd.get("name") || "Token"),
										scopes: String(fd.get("scopes") || "events:read,clients:read")
									} }).then((r) => {
										toast.success(`Token ${r.token} — copy it now`);
										qc.invalidateQueries({ queryKey: ["admin"] });
										qc.invalidateQueries({ queryKey: ["developer"] });
									});
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										name: "name",
										placeholder: "Token name",
										className: "w-40"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										name: "scopes",
										placeholder: "events:read,clients:read",
										className: "w-56"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										size: "sm",
										children: "Mint key"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
								children: (admin.data?.tokens ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center justify-between gap-3 px-4 py-3 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [t.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "ml-2 text-xs text-muted-foreground",
										children: [
											t.scopes,
											" · ",
											t.revoked ? "revoked" : t.tokenHint
										]
									})] }), !t.revoked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										onClick: () => revokeToken({ data: { id: t.id } }).then(() => qc.invalidateQueries({ queryKey: ["admin"] })),
										children: "Revoke"
									})]
								}, t.id))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "scores",
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-3 text-sm text-muted-foreground",
							children: "Custom scoring models — 10 on Ultimate."
						}), (scores.data ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "mb-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-medium",
									children: s.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, { checked: s.active })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 space-y-1 text-sm text-muted-foreground",
								children: s.rules.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									r.field,
									" ",
									r.op,
									" ",
									r.value,
									" → +",
									r.points
								] }, i))
							})]
						}, s.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "integrations",
						className: "mt-4 max-w-lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IntegrationsPanel, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "portal",
						className: "mt-4 max-w-lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalDomainPanel, {})
					})
				]
			})
		})]
	});
}
function PortalDomainPanel() {
	const p = useQuery({
		queryKey: ["ai-desk"],
		queryFn: () => getAiDesk()
	}).data?.profile;
	if (!p) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Loading portal domain…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "space-y-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-medium",
				children: "White-label portal domain"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Clients hit your domain. Logo and colors follow the company profile. They never see a third-party address."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				size: "sm",
				variant: "secondary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/portal-domain",
					children: "Open portal domain desk"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground",
				children: [
					"Live as https://",
					p.portalDomain,
					" · brand #",
					p.brandColor
				]
			})
		]
	});
}
function Meter({ label, used, cap }) {
	const pct = Math.min(100, Math.round(used / Math.max(cap, 1) * 100));
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
export { SettingsPage as component };
