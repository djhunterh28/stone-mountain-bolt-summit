import { o as __toESM } from "../_runtime.mjs";
import { a as formatDateTime } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CZC9dlvp.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as TabsList, J as PageHeader, Mn as listDeals, Q as TabsContent, Z as Tabs, ct as Input, et as TabsTrigger, lt as Button } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/integrations-BQsR8q70.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var listIntegrationStatus = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("bdca3df12a79a77c25c5a7aefe62c84a1a2bb707d24d0a4e6aa077a5c5ec2bc1"));
var searchPlaces = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("084cac8da7a1ed0fd166b05f774764751144bd93d04bfb0b1d6082076d065d1a"));
var pinPlaceToDeal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("e3e8c21c0891ef5969580037e1936c38029f1cc30b47319e6372d5d28b8b837a"));
var searchDeezer = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("366c57187fbc4ad92697c1b2e7718b912796bb54b2dd2adaa428930715e1b10b"));
var pinTrack = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("a6aec907146359a93d29875d957b1aeb2713877b07e15c4cd77e24270b8152e8"));
var listShowTracks = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("35e88dcf75a282c33b8c8f8ca7903c13907766db8c4bd2d89af307f1e1bafeba"));
var createDealZoom = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("79a53b5e765b82ee27873159cd5dd8b1fe374bc7b18f3956fd9ab4446ae9ee08"));
var LABELS = {
	calendly: "Calendly",
	tidycal: "TidyCal",
	acuity: "Acuity",
	zoom: "Zoom",
	deezer: "Deezer",
	google_places: "Google Places"
};
function IntegrationsPage() {
	const status = useQuery({
		queryKey: ["integration-status"],
		queryFn: () => listIntegrationStatus()
	});
	const deals = useQuery({
		queryKey: [
			"deals",
			1,
			"open"
		],
		queryFn: () => listDeals({ data: {
			pipelineId: 1,
			status: "open"
		} })
	});
	const tracks = useQuery({
		queryKey: ["show-tracks"],
		queryFn: () => listShowTracks()
	});
	const [dealId, setDealId] = (0, import_react.useState)(1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Integrations",
				subtitle: "Calendly, TidyCal, Acuity, Zoom, Deezer, and Google Places on the same desk."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 px-4 sm:grid-cols-3 sm:px-6",
				children: (status.data?.rows ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium",
								children: LABELS[r.provider] ?? r.provider
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: r.connected ? "success" : "outline",
								children: r.connected ? "live" : "off"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: r.detail
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-[11px] text-muted-foreground",
							children: ["Last ok ", r.lastOk ? formatDateTime(r.lastOk) : "—"]
						})
					]
				}, r.provider))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 px-4 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mb-3 flex items-center gap-2 text-sm",
					children: ["Pin to deal", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "h-9 max-w-xs rounded-md border border-input bg-background px-2 text-sm",
						value: dealId,
						onChange: (e) => setDealId(Number(e.target.value)),
						children: (deals.data ?? []).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: d.id,
							children: d.title
						}, d.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					defaultValue: "schedule",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
							className: "flex h-auto flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "schedule",
									children: "Scheduling"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "places",
									children: "Google Places"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "music",
									children: "Deezer"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "zoom",
									children: "Zoom"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "schedule",
							className: "mt-4 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Per-user Calendly, TidyCal, and Acuity connections live on Scheduler. Confirmed holds mint Zoom and send mail."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								variant: "secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/scheduler",
									children: "Open scheduler connections"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "places",
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlacesPanel, { dealId })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "music",
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MusicPanel, {
								dealId,
								saved: tracks.data ?? [],
								onSaved: () => tracks.refetch()
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "zoom",
							className: "mt-4 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Create a Zoom meeting from the selected event. Join URL lands on a calendar activity."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: () => createDealZoom({ data: { dealId } }).then((r) => {
									if (!r.ok) toast.error(r.error);
									else toast.success(`Zoom ${r.join} · pass ${r.pass}`);
								}),
								children: "Create Zoom for this deal"
							})]
						})
					]
				})]
			})
		]
	});
}
function PlacesPanel({ dealId }) {
	const [q, setQ] = (0, import_react.useState)("cipriani");
	const [hits, setHits] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function run(term = q) {
		setBusy(true);
		const res = await searchPlaces({ data: { q: term } });
		setHits(res);
		setBusy(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Google Places–shaped venue lookup: rating, types, maps pin, load-in address. NYC production rooms are indexed."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex flex-wrap gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					run();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Venue, neighborhood, type",
					className: "max-w-sm"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					size: "sm",
					disabled: busy,
					children: busy ? "Looking up…" : "Search Places"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
				children: [(hits ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-start gap-3 px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium",
									children: p.name
								}), p.rating != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "steel",
									children: p.rating.toFixed(1)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									p.address,
									p.city ? `, ${p.city}` : "",
									" · ",
									p.types.join(", "),
									p.hours ? ` · ${p.hours}` : ""
								]
							})]
						}),
						p.mapsUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: p.mapsUrl,
								target: "_blank",
								rel: "noreferrer",
								children: "Map"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "secondary",
							onClick: () => pinPlaceToDeal({ data: {
								dealId,
								placeId: p.placeId
							} }).then((r) => {
								if (r.ok) toast.success(`Venue set to ${r.venue}`);
								else toast.error(r.error);
							}),
							children: "Pin to deal"
						})
					]
				}, p.placeId)), hits && hits.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "px-4 py-6 text-sm text-muted-foreground",
					children: "No venues matched."
				})]
			})
		]
	});
}
function MusicPanel({ dealId, saved, onSaved }) {
	const [q, setQ] = (0, import_react.useState)("daft punk");
	const [hits, setHits] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [role, setRole] = (0, import_react.useState)("walk-in");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Deezer track search for walk-in, dinner, and bump music. Preview plays from Deezer; pin it to the show."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex flex-wrap gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					setBusy(true);
					searchDeezer({ data: { q } }).then((r) => {
						setHits(r);
						setBusy(false);
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Artist, track, playlist mood",
						className: "max-w-sm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-9 rounded-md border border-input bg-background px-2 text-sm",
						value: role,
						onChange: (e) => setRole(e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "walk-in",
								children: "Walk-in"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "dinner",
								children: "Dinner"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "bump",
								children: "Bump"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "brand",
								children: "Brand"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "sm",
						disabled: busy,
						children: busy ? "Searching…" : "Search Deezer"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
				children: hits.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-center gap-3 px-4 py-3",
					children: [
						t.coverUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: t.coverUrl,
							alt: "",
							className: "size-10 rounded object-cover"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: t.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										t.artist,
										t.album ? ` · ${t.album}` : "",
										" · ",
										Math.floor(t.durationSec / 60),
										":",
										String(t.durationSec % 60).padStart(2, "0")
									]
								}),
								t.previewUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
									className: "mt-2 h-8 w-full max-w-xs",
									controls: true,
									src: t.previewUrl,
									preload: "none"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "secondary",
							onClick: () => pinTrack({ data: {
								dealId,
								track: t,
								role
							} }).then(() => {
								toast.success("Pinned to the show");
								onSaved();
							}),
							children: "Pin"
						})
					]
				}, t.deezerId))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase",
				children: "On the books"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
				children: saved.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between px-4 py-2.5 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [t.title, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-2 text-xs text-muted-foreground",
						children: [
							t.artist,
							" · ",
							t.role,
							" · ",
							t.dealTitle
						]
					})] }), t.link && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "text-xs text-muted-foreground underline-offset-4 hover:underline",
						href: t.link,
						target: "_blank",
						rel: "noreferrer",
						children: "Deezer"
					})]
				}, t.id))
			})] })
		]
	});
}
//#endregion
export { IntegrationsPage as component };
