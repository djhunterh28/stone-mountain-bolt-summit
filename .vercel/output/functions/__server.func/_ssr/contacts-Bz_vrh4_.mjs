import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { d as useRouterState, m as Outlet, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { s as formatUsd } from "./utils-DLVA4J7b.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { Q as Tabs, Rn as listOrgs, X as PageHeader, et as TabsList, lt as Input, qn as mergePeople, tt as TabsTrigger, ur as useUi, ut as Button, zn as listPeople } from "./router-Bkw81Fhc.mjs";
import { t as Badge } from "./badge-BQYjLRpy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contacts-Bz_vrh4_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ContactsLayout() {
	if (useRouterState({ select: (s) => s.location.pathname !== "/contacts" && s.location.pathname.startsWith("/contacts/") })) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactsPage, {});
}
function ContactsPage() {
	const [tab, setTab] = (0, import_react.useState)("people");
	const [q, setQ] = (0, import_react.useState)("");
	const [keep, setKeep] = (0, import_react.useState)(null);
	const { setAddOpen } = useUi();
	const qc = useQueryClient();
	const people = useQuery({
		queryKey: ["people"],
		queryFn: () => listPeople()
	});
	const orgs = useQuery({
		queryKey: ["orgs"],
		queryFn: () => listOrgs()
	});
	const merge = useMutation({
		mutationFn: (dropId) => mergePeople({ data: {
			keepId: keep,
			dropId
		} }),
		onSuccess: () => {
			toast.success("Merged duplicate");
			setKeep(null);
			qc.invalidateQueries({ queryKey: ["people"] });
		}
	});
	const pq = q.toLowerCase();
	const peopleList = (people.data ?? []).filter((p) => `${p.name} ${p.email ?? ""} ${p.orgName ?? ""}`.toLowerCase().includes(pq));
	const orgList = (orgs.data ?? []).filter((o) => `${o.name} ${o.city ?? ""} ${o.industry ?? ""}`.toLowerCase().includes(pq));
	const pins = (0, import_react.useMemo)(() => [...people.data ?? [], ...orgs.data ?? []].filter((x) => x.lat != null && x.lng != null).map((x) => ({
		id: `${"email" in x ? "p" : "o"}-${x.id}`,
		name: x.name,
		city: x.city,
		lat: x.lat,
		lng: x.lng
	})), [people.data, orgs.data]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Contacts",
			subtitle: "People, organizations, and a map of the five boroughs.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: q,
				onChange: (e) => setQ(e.target.value),
				placeholder: "Search",
				className: "h-9 w-44"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "secondary",
				onClick: () => setAddOpen(true, tab === "orgs" ? "org" : "person"),
				children: "Add"
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-4 sm:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
				value: tab,
				onValueChange: setTab,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "people",
						children: "People"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "orgs",
						children: "Organizations"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "map",
						children: "Map"
					})
				] })
			})
		}),
		tab === "people" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 overflow-x-auto",
			children: [keep && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "px-4 pb-2 text-xs text-muted-foreground sm:px-6",
				children: [
					"Merge mode: click another person to fold them into the keeper.",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "underline",
						onClick: () => setKeep(null),
						children: "Cancel"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "text-left text-xs text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 font-medium sm:px-6",
							children: "Name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-2 font-medium",
							children: "Org"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-2 font-medium",
							children: "Email"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-2 text-right font-medium",
							children: "Open"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-2 sm:px-6" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: peopleList.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-2.5 sm:px-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/contacts/$personId",
								params: { personId: String(p.id) },
								className: "hover:underline",
								children: p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: p.title
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-2.5 text-muted-foreground",
							children: p.orgId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/orgs/$orgId",
								params: { orgId: String(p.orgId) },
								className: "hover:underline",
								children: p.orgName
							}) : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-2.5 text-muted-foreground",
							children: p.email ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-2.5 text-right font-mono tabular-nums",
							children: formatUsd(p.dealValue)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2.5 sm:px-6",
							children: keep === p.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "steel",
								children: "Keeper"
							}) : keep ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => merge.mutate(p.id),
								children: "Merge into keeper"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => setKeep(p.id),
								children: "Merge"
							})
						})
					]
				}, p.id)) })]
			})]
		}),
		tab === "orgs" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "text-left text-xs text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 font-medium sm:px-6",
							children: "Organization"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-2 font-medium",
							children: "City"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-2 font-medium",
							children: "Industry"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-2 text-right font-medium",
							children: "People"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-right font-medium sm:px-6",
							children: "Pipeline"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: orgList.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-2.5 sm:px-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/orgs/$orgId",
								params: { orgId: String(o.id) },
								className: "hover:underline",
								children: o.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: o.address
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-2.5",
							children: o.city
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-2.5 text-muted-foreground",
							children: o.industry
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-2.5 text-right tabular-nums",
							children: o.peopleCount
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2.5 text-right font-mono tabular-nums sm:px-6",
							children: formatUsd(o.dealValue)
						})
					]
				}, o.id)) })]
			})
		}),
		tab === "map" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NycMap, { pins })
	] });
}
function NycMap({ pins }) {
	const maxLat = 40.92;
	const minLng = -74.08;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mx-4 my-4 h-[28rem] overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)] sm:mx-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 800 520",
			className: "h-full w-full",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					width: "800",
					height: "520",
					fill: "var(--color-muted)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M120 80 L260 70 L280 180 L220 260 L140 240 Z",
					fill: "var(--color-accent)",
					stroke: "var(--color-border)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "170",
					y: "150",
					fill: "var(--color-muted-foreground)",
					fontSize: "11",
					children: "Manhattan"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M280 200 L480 190 L520 360 L300 400 L250 280 Z",
					fill: "var(--color-accent)",
					stroke: "var(--color-border)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "360",
					y: "300",
					fill: "var(--color-muted-foreground)",
					fontSize: "11",
					children: "Brooklyn"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M480 120 L720 140 L700 280 L500 260 Z",
					fill: "var(--color-accent)",
					stroke: "var(--color-border)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "560",
					y: "200",
					fill: "var(--color-muted-foreground)",
					fontSize: "11",
					children: "Queens"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M80 280 L220 270 L240 430 L60 440 Z",
					fill: "var(--color-accent)",
					stroke: "var(--color-border)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "110",
					y: "360",
					fill: "var(--color-muted-foreground)",
					fontSize: "11",
					children: "Staten"
				}),
				pins.map((p) => {
					const x = (p.lng - minLng) / .37999999999999545 * 800;
					const y = (maxLat - p.lat) / .35999999999999943 * 520;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: x,
						cy: y,
						r: "5",
						fill: "var(--color-primary)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { children: `${p.name} · ${p.city}` })] }, p.id);
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute bottom-3 left-3 max-h-40 overflow-auto rounded-md bg-background/90 p-2 text-xs shadow-[var(--shadow-border)]",
			children: pins.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-0.5",
				children: [p.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-muted-foreground",
					children: [" · ", p.city]
				})]
			}, p.id))
		})]
	});
}
//#endregion
export { ContactsLayout as component };
