import { o as __toESM } from "../_runtime.mjs";
import { i as formatDate } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { J as PageHeader, ct as Input, lt as Button } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { t as Skeleton } from "./skeleton-BVFrMLkw.mjs";
import { r as getRegistryDesk, t as geocodePerson } from "./registry-BK92YirK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/registry-BTK2ufkL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RegistryPage() {
	const desk = useQuery({
		queryKey: ["registry"],
		queryFn: () => getRegistryDesk()
	});
	const qc = useQueryClient();
	const [q, setQ] = (0, import_react.useState)("");
	const d = desk.data;
	const rows = (0, import_react.useMemo)(() => {
		const s = q.toLowerCase();
		return (d?.clients ?? []).filter((c) => `${c.name} ${c.email ?? ""} ${c.org ?? ""} ${c.city ?? ""} ${c.address ?? ""}`.toLowerCase().includes(s));
	}, [d, q]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Client registry",
				subtitle: "One record per client: contact, history, geocoded address, and how they want to be reached.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search the book",
					className: "h-9 w-48"
				})
			}),
			desk.isLoading || !d ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-xl" }, i))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Clients",
						value: String(d.stats.n),
						hint: "People in the book"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Geocoded",
						value: `${d.stats.geocoded}/${d.stats.n}`,
						hint: "Lat/lng on the record"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "With street",
						value: String(d.stats.withAddress),
						hint: "Address on file"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Prefs",
						value: `${d.stats.mailOff} mail off · ${d.stats.smsOff} SMS off`,
						hint: "Communication"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)] mx-4 sm:mx-6",
				children: rows.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-start justify-between gap-3 px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/contacts/$personId",
								params: { personId: String(c.id) },
								className: "text-sm font-medium hover:underline",
								children: c.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									c.title,
									c.org,
									c.email
								].filter(Boolean).join(" · ")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [c.address ? `${c.address}, ${c.city ?? ""}` : c.city ?? "No address", c.lat != null && c.lng != null ? ` · ${c.lat.toFixed(3)}, ${c.lng.toFixed(3)}` : ""]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1.5 flex flex-wrap gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: c.mail ? "success" : "outline",
										children: ["mail ", c.mail ? "on" : "off"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: c.sms ? "success" : "outline",
										children: ["SMS ", c.sms ? "on" : "off"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: c.postal ? "steel" : "outline",
										children: ["postal ", c.postal ? "on" : "off"]
									}),
									c.geocodedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "outline",
										children: ["geocoded ", formatDate(c.geocodedAt)]
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-end gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground",
							children: [c.shows, " shows"]
						}), c.lat == null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "secondary",
							onClick: () => geocodePerson({ data: { id: c.id } }).then((r) => {
								if (!r.ok) toast.error(r.error ?? "No pin");
								else toast.success(`Pinned ${r.label}`);
								qc.invalidateQueries({ queryKey: ["registry"] });
							}),
							children: "Geocode"
						})]
					})]
				}, c.id))
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
				className: "mt-1 text-xs text-muted-foreground",
				children: hint
			})
		]
	});
}
//#endregion
export { RegistryPage as component };
