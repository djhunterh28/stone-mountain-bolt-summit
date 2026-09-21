import { a as formatDateTime, i as formatDate } from "./utils-BjcRTCQS.mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CZC9dlvp.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/handoff-7CfvnPDX.js
var import_jsx_runtime = require_jsx_runtime();
function PackBody({ pack }) {
	const gear = pack.gear ?? [];
	const findings = pack.findings ?? [];
	const guests = pack.guests ?? [];
	const marks = pack.floor?.marks ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold tracking-tight",
				children: pack.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-muted-foreground",
				children: [
					pack.venue,
					pack.eventDate ? formatDate(pack.eventDate) : null,
					pack.loadIn ? `load-in ${pack.loadIn}` : null,
					pack.indoor == null ? null : pack.indoor ? "indoor" : "outdoor",
					pack.guestCount != null ? `${pack.guestCount} pax` : null
				].filter(Boolean).join(" · ")
			})] }),
			pack.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-lg bg-muted/70 px-3 py-2 text-muted-foreground",
				children: pack.notes
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [pack.org && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: "Venue / org"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-medium",
						children: pack.org.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: [pack.org.address, pack.org.city].filter(Boolean).join(", ")
					}),
					pack.org.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: pack.org.phone
					})
				] }), pack.person && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: "Show contact"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-medium",
						children: pack.person.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: [pack.person.title, pack.person.phone].filter(Boolean).join(" · ")
					}),
					pack.person.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: pack.person.email
					})
				] })]
			}),
			pack.floor && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
					children: "Floor plot"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-medium",
					children: pack.floor.name
				}),
				pack.floor.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-muted-foreground",
					children: pack.floor.notes
				}),
				marks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 flex flex-wrap gap-1.5",
					children: marks.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: m.kind === "hold" ? "danger" : m.kind === "power" || m.kind === "egress" ? "warn" : "outline",
						children: m.label
					}) }, `${m.label}-${i}`))
				})
			] }),
			pack.crew.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
				children: "Crew · no rates"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-1 divide-y divide-border",
				children: pack.crew.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-center gap-2 py-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: c.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							children: c.role
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "steel",
							children: c.kind
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground",
							children: [c.startsAt ? formatDateTime(c.startsAt) : "", c.endsAt ? ` – ${formatDateTime(c.endsAt)}` : ""]
						})
					]
				}, `${c.name}-${i}`))
			})] }),
			gear.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
				children: "Gear · no prices"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-1 divide-y divide-border",
				children: gear.map((g, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-center gap-2 py-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-medium",
						children: [
							g.qty,
							"× ",
							g.name
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						children: g.category
					})]
				}, `${g.name}-${i}`))
			})] }),
			guests.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
				children: "Guests · no emails"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-1 divide-y divide-border",
				children: guests.map((g, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-center gap-2 py-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: g.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							children: ["party ", g.party]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: g.rsvp === "yes" ? "success" : g.rsvp === "no" ? "danger" : "steel",
							children: g.rsvp
						}),
						g.meal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: g.meal
						})
					]
				}, `${g.name}-${i}`))
			})] }),
			pack.files.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
				children: "Files"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-1 space-y-1",
				children: pack.files.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "text-muted-foreground",
					children: [
						f.name,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs",
							children: [
								"(",
								f.kind,
								")"
							]
						})
					]
				}, f.name))
			})] }),
			pack.notesList.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
				children: "Production notes"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-1 space-y-2",
				children: pack.notesList.map((n, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					children: n.category
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-muted-foreground",
					children: n.body
				})] }, i))
			})] }),
			findings.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
				children: "Prep flags"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-1 space-y-2",
				children: findings.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: f.severity === "risk" ? "danger" : "warn",
					children: f.kind
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-muted-foreground",
					children: f.detail
				})] }, i))
			})] })
		]
	});
}
var getHandoffDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("783eb0304d1257224dc34c47c610dbd56be077dadb21d32185ee09eb6f6b24cf"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("46f0bb6a40d8601b1347c1cdf848e270c51003c64eecb15ace1b59bd550724e1"));
var previewHandoff = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("d67e2c58fb2d8ddc84adab12f12af1fa5ac35b16bceba3f08a566d3ea2cba721"));
var sendHandoff = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("acdadea49f7bae8c06ae90eb9e69d5f22226500df7dc858063dad51eee25fcc1"));
var setHandoffMonitor = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("87203f7b187610b9764b9b1efd2e9efe4e477656e377a0a03ff846b68d52bfe9"));
var recallHandoff = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("d2df3b62541747376bf909394aeb52c510bd544a157e7772362a8235c001e83f"));
var getHandoffPublic = createServerFn({ method: "GET" }).validator((input) => input).handler(createSsrRpc("a3f792effcfba9efb7c36986fc084d8769d8da285096e4a71f02ab682ffb48f6"));
var pingHandoff = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("8bcc590994cd80a2601c81a9ed5fde28793f4366cb3d9d60aef3042d5ae461d3"));
//#endregion
export { previewHandoff as a, setHandoffMonitor as c, pingHandoff as i, getHandoffDesk as n, recallHandoff as o, getHandoffPublic as r, sendHandoff as s, PackBody as t };
