import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { Ot as ArrowLeft } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { Ct as getEnvelope, Kt as remindEnvelope, dt as addEnvelopeField, in as updateEnvelopeStatus, lt as Button, p as Route$14 } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/esign._envelopeId-kMt6uIbS.js
var import_jsx_runtime = require_jsx_runtime();
function EnvelopePage() {
	const { envelopeId } = Route$14.useParams();
	const id = Number(envelopeId);
	const qc = useQueryClient();
	const env = useQuery({
		queryKey: ["envelope", id],
		queryFn: () => getEnvelope({ data: { id } })
	});
	const e = env.data;
	if (!e) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "p-6 text-sm text-muted-foreground",
		children: env.isLoading ? "Loading…" : "Not found."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 border-b border-border px-4 py-4 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "icon-sm",
					variant: "ghost",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/esign",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "truncate text-lg font-semibold",
						children: e.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							e.mode,
							" · ",
							e.authMethod,
							" · original ",
							e.originalSha.slice(0, 12),
							e.signedSha ? ` · signed ${e.signedSha.slice(0, 12)}` : ""
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: e.status === "completed" ? "success" : "steel",
					children: e.status
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1.2fr_0.8fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative min-h-96 overflow-hidden rounded-xl bg-card p-8 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-none absolute inset-0 grid place-items-center text-4xl font-semibold tracking-[0.3em] text-foreground/10 uppercase",
						style: { transform: "rotate(-18deg)" },
						children: e.watermark
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "relative text-sm leading-relaxed",
						children: e.content
					}),
					e.fields.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute rounded-sm border border-dashed border-primary/50 bg-background/80 px-2 py-1 text-[10px]",
						style: {
							left: `${f.x}%`,
							top: `${f.y}%`
						},
						children: f.kind
					}, f.id))
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: "Recipients"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2 text-sm",
						children: e.recipients.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between rounded-lg bg-card px-3 py-2 shadow-[var(--shadow-border)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								r.routingOrder,
								". ",
								r.name,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block text-xs text-muted-foreground",
									children: [
										r.role,
										" · ",
										r.email
									]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: r.status === "signed" ? "success" : "outline",
								children: r.status
							})]
						}, r.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: () => remindEnvelope({ data: { id } }).then(() => toast.success("Reminder sent")),
								children: "Resend reminder"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => updateEnvelopeStatus({ data: {
									id,
									status: "void"
								} }).then(() => qc.invalidateQueries({ queryKey: ["envelope", id] })),
								children: "Void"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/sign/$docId",
									params: { docId: String(e.documentId ?? id) },
									search: { envelope: String(id) },
									children: "Open signing page"
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: "Place field"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							"signature",
							"initial",
							"date",
							"name",
							"company",
							"title",
							"email",
							"checkbox",
							"note"
						].map((kind) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => addEnvelopeField({ data: {
								envelopeId: id,
								kind,
								x: 18 + Math.random() * 40,
								y: 70 + Math.random() * 15,
								recipientId: e.recipients[0]?.id
							} }).then(() => qc.invalidateQueries({ queryKey: ["envelope", id] })),
							children: kind
						}, kind))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "ESIGN Act consent, consumer disclosures, and the audit certificate freeze at send. Tamper evidence is SHA-256 of original and signed bytes."
					})
				]
			})]
		})]
	});
}
//#endregion
export { EnvelopePage as component };
