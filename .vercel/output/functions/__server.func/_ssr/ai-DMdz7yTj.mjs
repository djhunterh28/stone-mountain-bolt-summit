import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as TabsContent, Mn as listDeals, P as markFinding, Q as Tabs, X as PageHeader, et as TabsList, g as getAiDesk, h as draftFromDeal, lt as Input, st as Textarea, tt as TabsTrigger, ut as Button, z as saveAiProfile } from "./router-Bkw81Fhc.mjs";
import { t as Badge } from "./badge-BQYjLRpy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-DMdz7yTj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AiPage() {
	const desk = useQuery({
		queryKey: ["ai-desk"],
		queryFn: () => getAiDesk()
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
	const qc = useQueryClient();
	const p = desk.data?.profile;
	const [dealId, setDealId] = (0, import_react.useState)(1);
	const [prompt, setPrompt] = (0, import_react.useState)("Confirm load-in and ask if the dock is still 47th.");
	const [draft, setDraft] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "AI desk",
			subtitle: "Company profile, one-click drafts, prep inspector, and the site chat widget."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-4 sm:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "draft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "flex h-auto flex-wrap",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "draft",
								children: "Drafts"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "prep",
								children: "Prep inspector"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "profile",
								children: "Company profile"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "widget",
								children: "Chat widget"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "draft",
						className: "mt-4 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Tone-matched to the company profile. Merge tags fill client, venue, date, AE, and signature. Edit before send."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										className: "h-9 max-w-xs rounded-md border border-input bg-background px-2 text-sm",
										value: dealId,
										onChange: (e) => setDealId(Number(e.target.value)),
										children: (deals.data ?? []).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: d.id,
											children: d.title
										}, d.id))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: prompt,
										onChange: (e) => setPrompt(e.target.value),
										className: "max-w-md"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										onClick: () => draftFromDeal({ data: {
											dealId,
											prompt
										} }).then((r) => {
											if (r.ok) {
												setDraft(r.body);
												toast.success("Draft ready — still yours to send");
												qc.invalidateQueries({ queryKey: ["ai-desk"] });
											} else toast.error(r.error);
										}),
										children: "One-click draft"
									})
								]
							}),
							draft && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								className: "min-h-40 font-mono text-sm",
								value: draft,
								onChange: (e) => setDraft(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
								children: (desk.data?.drafts ?? []).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "px-4 py-3 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: d.dealTitle
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-2 text-xs text-muted-foreground",
										children: d.prompt
									})]
								}, d.id))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "prep",
						className: "mt-4 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Gaps on the record, plus read-only Gmail/Outlook comparisons. Findings stay marked until you verify. Nothing auto-applies."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
							children: (desk.data?.findings ?? []).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex flex-wrap items-start gap-3 px-4 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: f.severity === "risk" ? "warn" : "outline",
										children: f.kind
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/deals/$dealId",
												params: { dealId: String(f.dealId) },
												className: "text-sm font-medium",
												children: f.dealTitle
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-muted-foreground",
												children: f.detail
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-muted-foreground",
												children: f.source === "email" ? "from connected mail" : "from the event record"
											})
										]
									}),
									f.verified ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "success",
										children: "verified"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "secondary",
										onClick: () => markFinding({ data: {
											id: f.id,
											verified: true
										} }).then(() => qc.invalidateQueries({ queryKey: ["ai-desk"] })),
										children: "Verify"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										onClick: () => markFinding({ data: {
											id: f.id,
											dismissed: true
										} }).then(() => qc.invalidateQueries({ queryKey: ["ai-desk"] })),
										children: "Dismiss"
									})
								]
							}, f.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "profile",
						className: "mt-4",
						children: p && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "grid max-w-xl gap-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
							onSubmit: (e) => {
								e.preventDefault();
								const fd = new FormData(e.currentTarget);
								saveAiProfile({ data: {
									tone: String(fd.get("tone")),
									specialties: String(fd.get("specialties")),
									serviceArea: String(fd.get("serviceArea")),
									greeting: String(fd.get("greeting")),
									packages: String(fd.get("packages")),
									portalDomain: String(fd.get("portalDomain") || p.portalDomain)
								} }).then(() => {
									toast.success("Profile drives drafts and the widget");
									qc.invalidateQueries({ queryKey: ["ai-desk"] });
								});
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-sm",
									children: ["Tone", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										name: "tone",
										defaultValue: p.tone,
										className: "mt-1 h-9 w-full rounded-md border border-input bg-background px-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "professional",
												children: "Professional"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "casual",
												children: "Casual"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "warm",
												children: "Warm"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "direct",
												children: "Direct"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-sm",
									children: ["Specialties", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										name: "specialties",
										defaultValue: p.specialties,
										className: "mt-1"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-sm",
									children: ["Service area", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										name: "serviceArea",
										defaultValue: p.serviceArea,
										className: "mt-1"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-sm",
									children: ["Greeting", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										name: "greeting",
										defaultValue: p.greeting,
										className: "mt-1"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-sm",
									children: ["Packages the widget may name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										name: "packages",
										defaultValue: JSON.stringify(p.packages),
										className: "mt-1"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-sm",
									children: ["White-label portal domain", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										name: "portalDomain",
										defaultValue: p.portalDomain,
										className: "mt-1"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									size: "sm",
									children: "Save profile"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "text-sm text-muted-foreground",
									children: p.faqs.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground",
											children: f.q
										}),
										" — ",
										f.a
									] }, f.q))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: ["White-label portal: ", p.portalDomain]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "widget",
						className: "mt-4 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "One-line embed. Answers availability from the live calendar, captures a lead when they try to hold a date, branded with your greeting."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
								className: "overflow-x-auto rounded-xl bg-card p-4 font-mono text-xs shadow-[var(--shadow-border)]",
								children: `<script src="https://northline.av/w/${p?.widgetSlug ?? "northline"}" async><\/script>`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								variant: "secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/w/$slug",
									params: { slug: p?.widgetSlug ?? "northline" },
									children: "Open widget"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
								children: (desk.data?.chats ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "px-4 py-2.5 text-sm",
									children: [c.question, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-2 text-xs text-muted-foreground",
										children: c.lead ? "lead captured" : c.answer.slice(0, 80)
									})]
								}, c.id))
							})
						]
					})
				]
			})
		})]
	});
}
//#endregion
export { AiPage as component };
