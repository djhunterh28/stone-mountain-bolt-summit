import { o as __toESM } from "../_runtime.mjs";
import { a as formatDateTime } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as getPortalDomainDesk, n as checkPortalDns, s as savePortalBrand, t as activatePortalDomain } from "./brand-BeQEY2zF.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { J as PageHeader, Y as HpMark, ct as Input, lt as Button, st as Label } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { t as Skeleton } from "./skeleton-BVFrMLkw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal-domain-BLM9Ja7d.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function copy(text) {
	navigator.clipboard.writeText(text).then(() => toast.success("Copied"));
}
function PortalDomainPage() {
	const desk = useQuery({
		queryKey: ["portal-domain-desk"],
		queryFn: () => getPortalDomainDesk()
	});
	const qc = useQueryClient();
	const d = desk.data;
	const [company, setCompany] = (0, import_react.useState)("");
	const [tagline, setTagline] = (0, import_react.useState)("");
	const [primary, setPrimary] = (0, import_react.useState)("");
	const [accent, setAccent] = (0, import_react.useState)("");
	const [host, setHost] = (0, import_react.useState)("");
	function refresh() {
		qc.invalidateQueries({ queryKey: ["portal-domain-desk"] });
		qc.invalidateQueries({ queryKey: ["portal-brand"] });
		qc.invalidateQueries({ queryKey: ["ai-desk"] });
	}
	const b = d?.brand;
	const live = d?.domains.filter((x) => x.live) ?? [];
	const pending = d?.domains.filter((x) => !x.live) ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Portal domain",
				subtitle: "Client-facing host, logo, and colors. Separate from the CRM. Clients never see a third-party address."
			}),
			desk.isLoading || !d || !b ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-xl" }, i))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Portal",
						value: b.portalHost.split(".")[0] ?? "portal",
						hint: b.portalHost
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "E-sign",
						value: "esign",
						hint: b.esignHost
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "CRM (staff)",
						value: "crm",
						hint: "Never in client chrome"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Hosts live",
						value: String(live.length),
						hint: b.hidePlatform ? "Platform name hidden" : "Visible"
					})
				]
			}),
			b && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "mx-4 mt-4 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:mx-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HpMark, {
								className: "size-10",
								color: `#${b.primaryHex}`
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-sm font-medium",
									children: b.company
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: b.tagline
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: [
										"Clients open https://",
										b.portalHost,
										" · envelopes on ",
										b.esignHost
									]
								})
							] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "success",
							children: "live"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-1 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "size-3 rounded-sm",
										style: { background: `#${b.primaryHex}` }
									}),
									"#",
									b.primaryHex
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-1 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "size-3 rounded-sm",
										style: { background: `#${b.accentHex}` }
									}),
									"#",
									b.accentHex
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								variant: "secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/portal?preview=1",
									children: "Preview as client"
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs text-muted-foreground",
						children: [
							b.footer,
							". Support ",
							b.supportEmail,
							". The staff CRM stays on ",
							b.crmHost,
							" and is never printed in client mail or the portal chrome."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 px-4 lg:grid-cols-2 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: "Brand on the portal"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Logo mark, company name, and colors follow every client page."
						}),
						b && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "mt-3 space-y-2",
							onSubmit: (e) => {
								e.preventDefault();
								savePortalBrand({ data: {
									company: company || b.company,
									tagline: tagline || b.tagline,
									primaryHex: primary || b.primaryHex,
									accentHex: accent || b.accentHex,
									portalHost: host || b.portalHost,
									hidePlatform: true
								} }).then((r) => {
									if (!r.ok) toast.error(r.error ?? "Blocked");
									else toast.success(`Portal host ${r.host}`);
									refresh();
								});
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "co",
									children: "Company"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "co",
									defaultValue: b.company,
									onChange: (e) => setCompany(e.target.value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "tg",
									children: "Tagline"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "tg",
									defaultValue: b.tagline,
									onChange: (e) => setTagline(e.target.value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "pr",
										children: "Primary"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "pr",
										defaultValue: b.primaryHex,
										onChange: (e) => setPrimary(e.target.value)
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "ac",
										children: "Accent"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "ac",
										defaultValue: b.accentHex,
										onChange: (e) => setAccent(e.target.value)
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "ph",
									children: "Portal host"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "ph",
									defaultValue: b.portalHost,
									onChange: (e) => setHost(e.target.value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									size: "sm",
									children: "Save brand"
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "DNS"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 divide-y divide-border",
						children: (d?.dns ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-wrap items-center gap-2 py-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: r.status === "pass" ? "success" : "warn",
									children: r.status
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs",
									children: r.type
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "min-w-0 flex-1 truncate font-mono text-xs",
									children: r.host
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => copy(r.value),
									children: "Copy"
								})
							]
						}, r.id))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 px-4 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Hosts"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
						children: live.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "success",
										children: h.purpose
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: h.host
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										children: h.ssl
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [h.notes, h.verifiedAt ? ` · live since ${formatDateTime(h.verifiedAt)}` : ""]
							})]
						}, h.id))
					}),
					pending.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
						children: pending.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-wrap items-center justify-between gap-2 px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm",
								children: h.host
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: h.notes
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "secondary",
									onClick: () => checkPortalDns({ data: { id: h.id } }).then((r) => {
										toast.success(`DNS ${r.records} records pass`);
										refresh();
									}),
									children: "Check DNS"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									onClick: () => activatePortalDomain({ data: { id: h.id } }).then((r) => {
										if (!r.ok) toast.error(r.error ?? "Blocked");
										else toast.success(`Live on ${r.host}`);
										refresh();
									}),
									children: "Activate"
								})]
							})]
						}, h.id))
					})
				]
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
				className: "mt-2 truncate font-mono text-xl tabular-nums",
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
export { PortalDomainPage as component };
