import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as formatDate, c as formatUsdFull } from "./utils-DLVA4J7b.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as getPersonPrefs, U as setCommPref, X as PageHeader, d as Route$12, dt as MemberAvatar, ut as Button } from "./router-Bkw81Fhc.mjs";
import { t as Badge } from "./badge-BQYjLRpy.mjs";
import { i as enrichRecord, l as getPersonDetail } from "./ultimate-JaIPPjEW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contacts._personId-DILVlwBm.js
var import_jsx_runtime = require_jsx_runtime();
function PersonPage() {
	const { personId } = Route$12.useParams();
	const id = Number(personId);
	const detail = useQuery({
		queryKey: ["person", id],
		queryFn: () => getPersonDetail({ data: { id } })
	});
	const prefs = useQuery({
		queryKey: ["person-prefs", id],
		queryFn: () => getPersonPrefs({ data: { id } })
	});
	const qc = useQueryClient();
	const d = detail.data;
	if (!d) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "px-6 py-10 text-sm text-muted-foreground",
		children: detail.isLoading ? "Loading…" : "Person not found."
	});
	const p = d.person;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: p.name,
			subtitle: [
				p.title,
				p.orgName,
				p.city
			].filter(Boolean).join(" · "),
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "secondary",
					onClick: () => enrichRecord({ data: {
						kind: "person",
						id: p.id
					} }).then((r) => {
						if (r.ok) toast.success(`Enriched · ${r.remaining ?? "?"} credits left`);
						else toast.error(r.error ?? "Enrichment failed");
						qc.invalidateQueries({ queryKey: ["person", id] });
						qc.invalidateQueries({ queryKey: ["people"] });
						qc.invalidateQueries({ queryKey: ["usage"] });
					}),
					children: "Enrich"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "ghost",
					onClick: () => enrichRecord({ data: {
						kind: "person",
						id: p.id,
						lookup: "email"
					} }).then((r) => {
						if (r.ok) toast.success(r.email ? `Email ${r.email}` : "Email lookup done");
						else toast.error(r.error ?? "Lookup failed");
						qc.invalidateQueries({ queryKey: ["person", id] });
						qc.invalidateQueries({ queryKey: ["usage"] });
					}),
					children: "Lookup email"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "ghost",
					onClick: () => enrichRecord({ data: {
						kind: "person",
						id: p.id,
						lookup: "phone"
					} }).then((r) => {
						if (r.ok) toast.success(r.phone ? `Direct ${r.phone}` : "Phone lookup done");
						else toast.error(r.error ?? "Lookup failed");
						qc.invalidateQueries({ queryKey: ["person", id] });
						qc.invalidateQueries({ queryKey: ["usage"] });
					}),
					children: "Lookup phone"
				}),
				p.orgId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "sm",
					variant: "ghost",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/orgs/$orgId",
						params: { orgId: String(p.orgId) },
						children: "Organization"
					})
				})
			] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 px-4 sm:px-6 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)] lg:col-span-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "space-y-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Email",
							value: p.email
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Phone",
							value: p.phone
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Mobile",
							value: p.mobile
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Direct dial",
							value: p.directDial
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Owner",
							value: p.ownerName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "LinkedIn",
							value: p.linkedin
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Open pipeline",
							value: formatUsdFull(p.dealValue)
						}),
						p.enrichedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Enriched",
							value: formatDate(p.enrichedAt)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Geocoded",
							value: prefs.data?.lat != null && prefs.data?.lng != null ? `${prefs.data.city ?? p.city ?? "—"} · ${prefs.data.lat.toFixed(4)}, ${prefs.data.lng.toFixed(4)}` : p.city
						})
					]
				}), prefs.data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-2 border-t border-border pt-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
							children: "Communication"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center justify-between text-sm",
							children: ["Email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: prefs.data.mail,
								onChange: (e) => setCommPref({ data: {
									personId: p.id,
									mail: e.target.checked
								} }).then(() => qc.invalidateQueries({ queryKey: ["person-prefs", id] }))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center justify-between text-sm",
							children: ["SMS (QUO)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: prefs.data.sms,
								onChange: (e) => setCommPref({ data: {
									personId: p.id,
									sms: e.target.checked
								} }).then(() => qc.invalidateQueries({ queryKey: ["person-prefs", id] }))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center justify-between text-sm",
							children: ["Postal", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: prefs.data.postal,
								onChange: (e) => setCommPref({ data: {
									personId: p.id,
									postal: e.target.checked
								} }).then(() => qc.invalidateQueries({ queryKey: ["person-prefs", id] }))
							})]
						}),
						prefs.data.smsSource && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] text-muted-foreground",
							children: ["SMS source · ", prefs.data.smsSource]
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "lg:col-span-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: "Deals"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
						children: [d.deals.map((deal) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/deals/$dealId",
							params: { dealId: String(deal.id) },
							className: "flex items-center justify-between gap-3 px-4 py-3 hover:bg-accent/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm",
								children: deal.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: deal.venue ?? deal.orgName
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: deal.status === "won" ? "success" : deal.status === "lost" ? "danger" : "outline",
									children: deal.status
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-sm tabular-nums",
									children: formatUsdFull(deal.value)
								})]
							})]
						}) }, deal.id)), d.deals.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "px-4 py-6 text-sm text-muted-foreground",
							children: "No deals yet."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-6 mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: "Activities"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
						children: [d.activities.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3 px-4 py-3 text-sm",
							children: [a.ownerInitials && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemberAvatar, {
								initials: a.ownerInitials,
								tone: a.ownerTone,
								size: "sm"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: a.subject }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [
										a.type,
										" · ",
										formatDate(a.dueAt)
									]
								})]
							})]
						}, a.id)), d.activities.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "px-4 py-6 text-sm text-muted-foreground",
							children: "No activities."
						})]
					})
				]
			})]
		})]
	});
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-xs text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: value || "—" })] });
}
//#endregion
export { PersonPage as component };
