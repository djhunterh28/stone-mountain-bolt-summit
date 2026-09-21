import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { _ as sendBroadcast, d as listBroadcasts } from "./governance-rJzhZAi0.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as TabsContent, H as sendSms, I as promoteProspect, Kn as listTemplates, M as importCold, Q as Tabs, X as PageHeader, _ as getBroadcastDesk, et as TabsList, lt as Input, st as Textarea, tt as TabsTrigger, ut as Button } from "./router-Bkw81Fhc.mjs";
import { t as Badge } from "./badge-BQYjLRpy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/broadcasts-BwlUf2L-.js
var import_jsx_runtime = require_jsx_runtime();
function BroadcastsPage() {
	const desk = useQuery({
		queryKey: ["bcast-desk"],
		queryFn: () => getBroadcastDesk()
	});
	const mail = useQuery({
		queryKey: ["broadcasts"],
		queryFn: () => listBroadcasts()
	});
	const templates = useQuery({
		queryKey: ["templates"],
		queryFn: () => listTemplates()
	});
	const qc = useQueryClient();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Broadcasts",
			subtitle: "Client mail with CAN-SPAM, SMS via QUO, cold lists kept off the pipeline, sending domain, signatures."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-4 sm:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "mail",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "flex h-auto flex-wrap",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "mail",
								children: "Client mail"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "sms",
								children: "SMS / QUO"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "cold",
								children: "Cold lists"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "domain",
								children: "Domain & signatures"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "mail",
						className: "mt-4 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Full editor. Suppression honored. Start from a saved template."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "space-y-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
								onSubmit: (e) => {
									e.preventDefault();
									const fd = new FormData(e.currentTarget);
									sendBroadcast({ data: {
										name: String(fd.get("name") || "Broadcast"),
										audience: "open-deals",
										subject: String(fd.get("subject") || "From Northline"),
										body: String(fd.get("body") || ""),
										fromName: "Northline",
										fromAddr: "hello@mail.northline.av"
									} }).then((r) => {
										if (!r.ok) toast.error(r.error ?? "Blocked");
										else toast.success(`Queued ${r.sent} · CAN-SPAM footer attached`);
										qc.invalidateQueries({ queryKey: ["broadcasts"] });
									});
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										name: "name",
										placeholder: "Internal name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										name: "tpl",
										className: "h-9 w-full rounded-md border border-input bg-background px-2 text-sm",
										children: (templates.data ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: t.name }, t.id))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										name: "subject",
										placeholder: "Subject"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										name: "body",
										placeholder: "Body — the same composer as one-to-one mail"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										size: "sm",
										children: "Send to client book"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "text-sm text-muted-foreground",
								children: (mail.data ?? []).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									b.name,
									" · ",
									b.sentCount,
									" sent"
								] }, b.id))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "sms",
						className: "mt-4 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "flex flex-wrap gap-2",
							onSubmit: (e) => {
								e.preventDefault();
								const fd = new FormData(e.currentTarget);
								sendSms({ data: {
									personId: 1,
									body: String(fd.get("body") || "")
								} }).then((r) => {
									if (!r.ok) toast.error(r.error);
									else toast.success("QUO delivered");
									qc.invalidateQueries({ queryKey: ["bcast-desk"] });
								});
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "body",
								placeholder: "Reminder, payment, or custom",
								className: "max-w-md"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								size: "sm",
								children: "Text Elena (opted in)"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 lg:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
								children: (desk.data?.sms ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "px-4 py-2.5 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-muted-foreground",
										children: [
											s.direction,
											" · ",
											s.person
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: s.body })]
								}, s.id))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
								children: (desk.data?.optins ?? []).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex justify-between px-4 py-2.5 text-sm",
									children: [o.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: o.optedIn ? "success" : "warn",
										children: o.optedIn ? "opted in" : "suppressed"
									})]
								}, o.name))
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "cold",
						className: "mt-4 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Expo scans and bought lists never enter pipeline metrics. A reply promotes them to a dated lead. Deduped on email."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "flex flex-wrap gap-2",
								onSubmit: (e) => {
									e.preventDefault();
									const fd = new FormData(e.currentTarget);
									importCold({ data: {
										listId: Number(fd.get("listId") || 1),
										name: String(fd.get("name")),
										email: String(fd.get("email")),
										company: String(fd.get("company") || "") || void 0
									} }).then((r) => {
										toast.success(r.deduped ? "Already on a list — skipped" : "Imported");
										qc.invalidateQueries({ queryKey: ["bcast-desk"] });
									});
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										name: "listId",
										className: "h-9 rounded-md border border-input bg-background px-2 text-sm",
										children: (desk.data?.lists ?? []).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: l.id,
											children: l.name
										}, l.id))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										name: "name",
										placeholder: "Name",
										className: "w-36"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										name: "email",
										placeholder: "Email",
										className: "w-44"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										name: "company",
										placeholder: "Company",
										className: "w-36"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										size: "sm",
										children: "Import"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
								children: (desk.data?.prospects ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-3 px-4 py-2.5 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1",
										children: [
											p.name,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs text-muted-foreground",
												children: [
													p.email,
													" · ",
													p.company
												]
											})
										]
									}), p.promoted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "success",
										children: "lead"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "secondary",
										onClick: () => promoteProspect({ data: { id: p.id } }).then(() => {
											toast.success("Promoted from the reply");
											qc.invalidateQueries({ queryKey: ["bcast-desk"] });
										}),
										children: "Treat reply as lead"
									})]
								}, p.id))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "domain",
						className: "mt-4 space-y-3",
						children: [(desk.data?.domains ?? []).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium",
								children: d.domain
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									"SPF ",
									d.spf ? "pass" : "fail",
									" · DKIM ",
									d.dkim ? "pass" : "fail",
									" · DMARC ",
									d.dmarc ? "pass" : "fail",
									" · applies to composed and workflow mail"
								]
							})]
						}, d.id)), (desk.data?.signatures ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("pre", {
							className: "rounded-xl bg-card p-4 font-mono text-xs shadow-[var(--shadow-border)]",
							children: [
								s.member,
								"\n",
								s.body
							]
						}, s.id))]
					})
				]
			})
		})]
	});
}
//#endregion
export { BroadcastsPage as component };
