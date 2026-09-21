import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as TabsContent, Et as getEsignMonitor, Ft as listEnvelopes, Nn as listDocuments, Q as Tabs, X as PageHeader, an as updateEnvelopeStatus, at as SelectTrigger, ct as Label, et as TabsList, it as SelectItem, lt as Input, nt as Select, ot as SelectValue, qt as remindEnvelope, rt as SelectContent, tt as TabsTrigger, ut as Button, vt as createEnvelope } from "./router-Bkw81Fhc.mjs";
import { t as Badge } from "./badge-BQYjLRpy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/esign-B5IEO2o-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EsignPage() {
	const qc = useQueryClient();
	const envs = useQuery({
		queryKey: ["envelopes"],
		queryFn: () => listEnvelopes()
	});
	const mon = useQuery({
		queryKey: ["esign-monitor"],
		queryFn: () => getEsignMonitor()
	});
	const docs = useQuery({
		queryKey: ["documents"],
		queryFn: () => listDocuments()
	});
	const [mode, setMode] = (0, import_react.useState)("sequential");
	const [auth, setAuth] = (0, import_react.useState)("email");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [docId, setDocId] = (0, import_react.useState)("none");
	const [q, setQ] = (0, import_react.useState)("");
	const filtered = (envs.data ?? []).filter((e) => e.name.toLowerCase().includes(q.toLowerCase()) || e.status.includes(q.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "E-sign",
			subtitle: "Envelopes, routing, watermarks, and the monitor. Signing lives on the esign host."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-4 sm:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "board",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "flex h-auto flex-wrap",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "board",
								children: "Dashboard"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "new",
								children: "New request"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "monitor",
								children: "Monitor"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "board",
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Search envelopes",
							className: "mb-3 max-w-xs"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
							children: filtered.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex flex-wrap items-center justify-between gap-2 px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/esign/$envelopeId",
									params: { envelopeId: String(e.id) },
									className: "text-sm font-medium hover:underline",
									children: e.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [
										e.mode,
										" · ",
										e.authMethod,
										" · sha ",
										e.originalSha.slice(0, 10)
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: e.status === "completed" ? "success" : "steel",
											children: e.status
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "ghost",
											onClick: () => remindEnvelope({ data: { id: e.id } }).then(() => toast.success("Reminder queued")),
											children: "Remind"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "ghost",
											onClick: () => updateEnvelopeStatus({ data: {
												id: e.id,
												status: "void"
											} }).then(() => qc.invalidateQueries({ queryKey: ["envelopes"] })),
											children: "Void"
										})
									]
								})]
							}, e.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "new",
						className: "mt-4 max-w-lg space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Document" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: docId,
									onValueChange: setDocId,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "none",
										children: "Blank agreement"
									}), (docs.data ?? []).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: String(d.id),
										children: d.name
									}, d.id))] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Routing" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: mode,
										onValueChange: (v) => setMode(v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "sequential",
											children: "Sequential"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "parallel",
											children: "Parallel"
										})] })]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Authentication" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: auth,
										onValueChange: setAuth,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "email",
												children: "Email"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "access_code",
												children: "Access code"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "email_otp",
												children: "Email code (2FA)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "kba",
												children: "KBA"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "id",
												children: "ID verification"
											})
										] })]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "Signer name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								placeholder: "Signer email"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => createEnvelope({ data: {
									documentId: docId === "none" ? void 0 : Number(docId),
									mode,
									authMethod: auth,
									recipients: [{
										name: name || "Signer",
										email: email || "client@example.com",
										role: "signer"
									}, {
										name: "Dana Okonkwo",
										email: "dana@northline.av",
										role: "countersigner"
									}]
								} }).then((r) => {
									toast.success("Envelope sent");
									qc.invalidateQueries({ queryKey: ["envelopes"] });
									if (r.id) toast.message(`Public link /sign/${docId === "none" ? r.id : docId}?envelope=${r.id}`);
								}),
								children: "Send for signature"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "monitor",
						className: "mt-4 space-y-3",
						children: [(mon.data?.flags ?? []).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-card px-4 py-3 text-sm shadow-[var(--shadow-border)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: f.severity === "warn" ? "warn" : "outline",
								children: f.severity
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2",
								children: f.label
							})]
						}, f.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-border rounded-xl bg-card text-sm shadow-[var(--shadow-border)]",
							children: (mon.data?.envelopes ?? []).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex justify-between px-4 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: e.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: [
										e.status,
										" · ",
										e.auth
									]
								})]
							}, e.id))
						})]
					})
				]
			})
		})]
	});
}
//#endregion
export { EsignPage as component };
