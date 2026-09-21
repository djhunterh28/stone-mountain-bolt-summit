import { o as __toESM } from "../_runtime.mjs";
import { a as formatDateTime, i as formatDate, s as formatUsdFull } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { J as PageHeader, ct as Input, h as Route$16, k as getPersonPrefs, lt as Button, st as Label, ut as MemberAvatar, z as setCommPref } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { i as enrichRecord, l as getPersonDetail } from "./ultimate-DAnhRr51.mjs";
import { i as savePerson, n as getClientHistory, t as geocodePerson } from "./registry-BK92YirK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contacts._personId-D69n_QkI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PersonPage() {
	const { personId } = Route$16.useParams();
	const id = Number(personId);
	const detail = useQuery({
		queryKey: ["person", id],
		queryFn: () => getPersonDetail({ data: { id } })
	});
	const prefs = useQuery({
		queryKey: ["person-prefs", id],
		queryFn: () => getPersonPrefs({ data: { id } })
	});
	const history = useQuery({
		queryKey: ["person-history", id],
		queryFn: () => getClientHistory({ data: { id } })
	});
	const qc = useQueryClient();
	const d = detail.data;
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [title, setTitle] = (0, import_react.useState)("");
	const [city, setCity] = (0, import_react.useState)("");
	const [address, setAddress] = (0, import_react.useState)("");
	if (!d) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "px-6 py-10 text-sm text-muted-foreground",
		children: detail.isLoading ? "Loading…" : "Person not found."
	});
	const p = d.person;
	function refresh() {
		qc.invalidateQueries({ queryKey: ["person", id] });
		qc.invalidateQueries({ queryKey: ["person-prefs", id] });
		qc.invalidateQueries({ queryKey: ["person-history", id] });
		qc.invalidateQueries({ queryKey: ["people"] });
		qc.invalidateQueries({ queryKey: ["registry"] });
	}
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
					asChild: true,
					size: "sm",
					variant: "secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/registry",
						children: "Registry"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "ghost",
					onClick: () => enrichRecord({ data: {
						kind: "person",
						id: p.id
					} }).then((r) => {
						if (r.ok) toast.success(`Enriched · ${r.remaining ?? "?"} credits left`);
						else toast.error(r.error ?? "Enrichment failed");
						refresh();
					}),
					children: "Enrich"
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
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: "Contact"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-3 space-y-2",
						onSubmit: (e) => {
							e.preventDefault();
							savePerson({ data: {
								id: p.id,
								name: name || p.name,
								email: email || p.email,
								phone: phone || p.phone,
								title: title || p.title,
								city: city || p.city,
								address: address || p.address
							} }).then(() => {
								toast.success("Registry updated");
								refresh();
							});
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "nm",
								children: "Name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "nm",
								defaultValue: p.name,
								onChange: (e) => setName(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "em",
								children: "Email"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "em",
								defaultValue: p.email ?? "",
								onChange: (e) => setEmail(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "ph",
								children: "Phone"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "ph",
								defaultValue: p.phone ?? "",
								onChange: (e) => setPhone(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "ti",
								children: "Title"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "ti",
								defaultValue: p.title ?? "",
								onChange: (e) => setTitle(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "ad",
								children: "Street"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "ad",
								defaultValue: p.address ?? "",
								onChange: (e) => setAddress(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "ct",
								children: "City"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "ct",
								defaultValue: p.city ?? "",
								onChange: (e) => setCity(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									size: "sm",
									children: "Save contact"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									size: "sm",
									variant: "secondary",
									onClick: () => geocodePerson({ data: {
										id: p.id,
										q: address || p.address || p.city || void 0
									} }).then((r) => {
										if (!r.ok) toast.error(r.error ?? "No pin");
										else toast.success(`${r.lat?.toFixed(4)}, ${r.lng?.toFixed(4)}`);
										refresh();
									}),
									children: "Geocode address"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-4 space-y-2 border-t border-border pt-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Mobile",
								value: p.mobile
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Direct dial",
								value: p.directDial
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Pin",
								value: p.lat != null && p.lng != null ? `${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}` : "Not geocoded"
							})
						]
					}),
					prefs.data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
									} }).then(() => {
										toast.success(e.target.checked ? "Mail on" : "Mail off");
										refresh();
									})
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
									} }).then(() => {
										toast.success(e.target.checked ? "SMS on" : "SMS off");
										refresh();
									})
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
									} }).then(() => {
										toast.success(e.target.checked ? "Postal on" : "Postal off");
										refresh();
									})
								})]
							}),
							prefs.data.smsSource && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-muted-foreground",
								children: ["SMS source · ", prefs.data.smsSource]
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "lg:col-span-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: "History"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
						children: [(history.data ?? []).map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										children: h.kind
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm",
										children: h.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-auto text-xs text-muted-foreground",
										children: formatDateTime(h.at)
									})
								]
							}), h.detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: h.detail
							})]
						}, `${h.kind}-${h.at}-${i}`)), (history.data ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "px-4 py-6 text-sm text-muted-foreground",
							children: "No history on this client yet."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-6 mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: "Shows"
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
									variant: deal.status === "won" ? "success" : deal.status === "lost" ? "danger" : deal.status === "cancelled" ? "warn" : "outline",
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
