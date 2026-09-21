import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { d as Route$12, lt as Button } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { i as pingHandoff, r as getHandoffPublic, t as PackBody } from "./handoff-7CfvnPDX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/h._token-B3kXTk3o.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Mark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		className,
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "4",
				y: "5",
				width: "3.2",
				height: "14",
				rx: "0.6",
				fill: "currentColor",
				opacity: "0.95"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "9.4",
				y: "8",
				width: "3.2",
				height: "11",
				rx: "0.6",
				fill: "currentColor",
				opacity: "0.7"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "14.8",
				y: "3",
				width: "3.2",
				height: "16",
				rx: "0.6",
				fill: "currentColor"
			})
		]
	});
}
function PublicPack() {
	const { token } = Route$12.useParams();
	const q = useQuery({
		queryKey: ["handoff-public", token],
		queryFn: () => getHandoffPublic({ data: { token } }),
		retry: 1
	});
	const [status, setStatus] = (0, import_react.useState)(null);
	const data = q.data;
	(0, import_react.useEffect)(() => {
		if (!data || data.status === "recalled") return;
		pingHandoff({ data: { token } }).then((r) => {
			if (r.ok) setStatus(r.status);
		});
	}, [token, data]);
	async function mark(next) {
		const r = await pingHandoff({ data: {
			token,
			status: next
		} });
		if (r.ok) setStatus(r.status);
	}
	const shown = status ?? data?.status ?? "sent";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto min-h-dvh max-w-2xl px-5 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-primary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "size-6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-semibold tracking-tight text-foreground",
					children: "Northline"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 font-mono text-xs tracking-widest text-muted-foreground uppercase",
				children: "Event hand-off pack"
			}),
			q.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: "Loading the pack…"
			}),
			!q.isLoading && !data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: "This pack is not on file."
			}),
			data?.status === "recalled" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight",
					children: "Pack recalled"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The house pulled this transfer. Production data is no longer shared."
				})]
			}),
			data && data.status !== "recalled" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-semibold tracking-tight",
							children: data.pack.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							children: ["for ", data.to]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: data.reason === "emergency" ? "danger" : "steel",
							children: data.reason
						})
					]
				}),
				data.cover && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: data.cover
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 rounded-lg bg-muted/70 px-3 py-2 text-xs text-muted-foreground",
					children: "Financials withheld. Invoices, day rates, and house value stay with Northline."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
					className: "mt-6 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackBody, { pack: data.pack })
				}),
				data.monitor && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mr-auto text-xs text-muted-foreground",
							children: ["House is monitoring · status ", shown.replace("_", " ")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "secondary",
							onClick: () => void mark("on_site"),
							disabled: shown === "complete",
							children: "On site"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => void mark("complete"),
							disabled: shown === "complete",
							children: "Complete"
						})
					]
				})
			] })
		]
	});
}
//#endregion
export { PublicPack as component };
