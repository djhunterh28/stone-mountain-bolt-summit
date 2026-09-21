import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { o as formatDateTime, t as authMiddleware } from "./utils-DLVA4J7b.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { a as WEBHOOK_EVENTS, i as REST_ENDPOINTS, n as AUTH_EXAMPLE, r as CURL_EXAMPLE, t as API_SCOPES } from "./api-spec-BdrGwzd_.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as TabsContent, Q as Tabs, X as PageHeader, et as TabsList, lt as Input, tt as TabsTrigger, ut as Button } from "./router-Bkw81Fhc.mjs";
import { t as Badge } from "./badge-BQYjLRpy.mjs";
import { h as revokeToken, n as createApiToken } from "./ultimate-JaIPPjEW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/developers-HR_7UWPp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var getDeveloperDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("bf71faea7b22fd1989ef68035586e21d5a7e64af3a0da5cd9b8f41fcf1624d8d"));
var createWebhook = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("516b3e12944a59fcd0bb5965639542f1c1f63a67d3cc03f4ddb0bc7d44025e4b"));
var testWebhook = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("4c8474eb0f11dfd2131b316c8a9bb1c4699a2c72042448daeca649b900c9d707"));
var revokeWebhook = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("ed22bebc16a47e654ff8b3ba50d24347b01240dd7a0affcb5545859ab82760ae"));
function DevelopersPage() {
	const desk = useQuery({
		queryKey: ["developer"],
		queryFn: () => getDeveloperDesk()
	});
	const qc = useQueryClient();
	const [fresh, setFresh] = (0, import_react.useState)(null);
	const [token, setToken] = (0, import_react.useState)("");
	const [path, setPath] = (0, import_react.useState)("/api/v1/events");
	const [method, setMethod] = (0, import_react.useState)("GET");
	const [body, setBody] = (0, import_react.useState)("{\n  \"title\": \"Pier 17 rooftop\",\n  \"value\": 48000,\n  \"venue\": \"Pier 17\",\n  \"event_date\": \"2026-10-22\"\n}");
	const [result, setResult] = (0, import_react.useState)("");
	const [picked, setPicked] = (0, import_react.useState)([
		"events:read",
		"events:write",
		"clients:read",
		"webhooks"
	]);
	function refresh() {
		qc.invalidateQueries({ queryKey: ["developer"] });
		qc.invalidateQueries({ queryKey: ["admin"] });
	}
	async function tryIt() {
		setResult("…");
		const res = await fetch(path, {
			method,
			headers: {
				"Content-Type": "application/json",
				...token ? { Authorization: `Bearer ${token}` } : {}
			},
			body: method === "GET" || method === "DELETE" ? void 0 : body
		});
		const text = await res.text();
		setResult(`${res.status} ${res.statusText}\n${text}`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Developers",
			subtitle: "Scoped API keys, a live REST surface, and webhook payloads for Zapier and custom scripts."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-4 sm:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "keys",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "flex h-auto flex-wrap",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "keys",
								children: "API keys"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "rest",
								children: "REST"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "webhooks",
								children: "Webhooks"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "try",
								children: "Try it"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "keys",
						className: "mt-4 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "space-y-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
								onSubmit: (e) => {
									e.preventDefault();
									const fd = new FormData(e.currentTarget);
									createApiToken({ data: {
										name: String(fd.get("name") || "Token"),
										scopes: picked.join(",") || "events:read"
									} }).then((r) => {
										setFresh(r.token);
										setToken(r.token);
										toast.success("Copy the key now — it will not be shown again");
										refresh();
									});
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										name: "name",
										placeholder: "Zapier production",
										className: "w-56"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										size: "sm",
										children: "Mint key"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-3",
									children: API_SCOPES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex min-h-9 items-start gap-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											className: "mt-1",
											checked: picked.includes(s.id),
											onChange: () => setPicked((cur) => cur.includes(s.id) ? cur.filter((id) => id !== s.id) : [...cur, s.id])
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: s.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-xs text-muted-foreground",
											children: s.hint
										})] })]
									}) }, s.id))
								})]
							}),
							fresh && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "rounded-xl bg-card px-4 py-3 font-mono text-sm shadow-[var(--shadow-border)]",
								children: [fresh, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-xs text-muted-foreground",
									children: "shown once"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
								children: (desk.data?.tokens ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex flex-wrap items-center gap-3 px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-sm font-medium",
													children: t.name
												}),
												t.revoked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "warn",
													children: "revoked"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "success",
													children: "live"
												}),
												!t.hashed && !t.revoked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													children: "legacy hint only"
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: [
												t.tokenHint,
												" · ",
												t.scopes,
												" · last used ",
												t.lastUsed ? formatDateTime(t.lastUsed) : "never"
											]
										})]
									}), !t.revoked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										onClick: () => revokeToken({ data: { id: t.id } }).then(() => {
											toast.success("Revoked");
											refresh();
										}),
										children: "Revoke"
									})]
								}, t.id))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "rest",
						className: "mt-4 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-sm font-medium",
									children: "Authentication"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
									className: "mt-2 overflow-x-auto font-mono text-xs text-muted-foreground",
									children: AUTH_EXAMPLE
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
									className: "mt-3 overflow-x-auto font-mono text-xs text-muted-foreground",
									children: CURL_EXAMPLE
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 text-xs text-muted-foreground",
									children: [
										"OpenAPI lives at ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "/api/v1/openapi.json" }),
										". Public catalog at ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "/api/v1" }),
										". Rate limit 210,000 requests per seat."
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
							children: REST_ENDPOINTS.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex flex-wrap items-start gap-3 px-4 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: e.method === "GET" ? "steel" : e.method === "DELETE" ? "warn" : "success",
										children: e.method
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
											className: "text-sm",
											children: e.path
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: e.summary
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[11px] text-muted-foreground",
										children: e.scope ?? "public"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										onClick: () => {
											setPath(e.path.includes(":") ? e.path.replace(":id", "1") : e.path);
											setMethod(e.method);
										},
										children: "Try"
									})
								]
							}, `${e.method}${e.path}`))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "webhooks",
						className: "mt-4 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "grid gap-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:grid-cols-4",
								onSubmit: (e) => {
									e.preventDefault();
									const fd = new FormData(e.currentTarget);
									createWebhook({ data: {
										url: String(fd.get("url") || ""),
										event: String(fd.get("event") || "deal.created"),
										description: String(fd.get("description") || "") || void 0
									} }).then((r) => {
										toast.success(`Secret ${r.secret} — copy it now`);
										refresh();
									});
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										name: "url",
										placeholder: "https://hooks.zapier.com/…",
										className: "sm:col-span-2",
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										name: "event",
										className: "h-9 rounded-md border border-input bg-background px-2 text-sm",
										children: WEBHOOK_EVENTS.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: e.event,
											children: e.event
										}, e.event))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										size: "sm",
										children: "Subscribe"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
								children: (desk.data?.webhooks ?? []).map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex flex-wrap items-center gap-3 px-4 py-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
														className: "text-xs",
														children: w.url
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: "outline",
														children: w.event
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: w.active ? "success" : "warn",
														children: w.active ? "live" : "off"
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted-foreground",
												children: [
													w.secretHint,
													" · ",
													w.lastStatus ?? "never fired"
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "secondary",
											onClick: () => testWebhook({ data: { id: w.id } }).then(() => {
												toast.success("Sample delivered");
												refresh();
											}),
											children: "Send sample"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "ghost",
											onClick: () => revokeWebhook({ data: {
												id: w.id,
												active: !w.active
											} }).then(refresh),
											children: w.active ? "Pause" : "Resume"
										})
									]
								}, w.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase",
								children: "Payloads"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-3 lg:grid-cols-2",
								children: WEBHOOK_EVENTS.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
									className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-center justify-between gap-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
												className: "text-sm",
												children: e.event
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-muted-foreground",
											children: e.summary
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
											className: "mt-3 overflow-x-auto font-mono text-[11px] leading-relaxed text-muted-foreground",
											children: JSON.stringify(e.payload, null, 2)
										})
									]
								}, e.event))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase",
								children: "Recent deliveries"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
								children: (desk.data?.deliveries ?? []).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "px-4 py-2.5 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs",
										children: d.event
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "ml-2 text-xs text-muted-foreground",
										children: [
											d.statusCode,
											" · ",
											formatDateTime(d.createdAt),
											" · ",
											d.url
										]
									})]
								}, d.id))
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "try",
						className: "mt-4 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Paste a live key from API keys. GET /api/v1 is public."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2 sm:grid-cols-[6rem_1fr]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "h-9 rounded-md border border-input bg-background px-2 text-sm",
									value: method,
									onChange: (e) => setMethod(e.target.value),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "GET" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "POST" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "PATCH" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "DELETE" })
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: path,
									onChange: (e) => setPath(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: token,
								onChange: (e) => setToken(e.target.value),
								placeholder: "nl_live_…"
							}),
							method !== "GET" && method !== "DELETE" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								className: "min-h-28 w-full rounded-md border border-input bg-background p-3 font-mono text-xs",
								value: body,
								onChange: (e) => setBody(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: () => void tryIt(),
								children: "Send"
							}),
							result && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
								className: "max-h-80 overflow-auto rounded-xl bg-card p-4 font-mono text-xs shadow-[var(--shadow-border)]",
								children: result
							})
						]
					})
				]
			})
		})]
	});
}
//#endregion
export { DevelopersPage as component };
