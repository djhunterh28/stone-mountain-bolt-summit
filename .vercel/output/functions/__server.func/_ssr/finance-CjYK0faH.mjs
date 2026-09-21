import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { c as formatUsdFull } from "./utils-DLVA4J7b.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as TabsContent, L as recordPayment, Q as Tabs, X as PageHeader, b as getFinance, et as TabsList, lt as Input, m as createStandaloneInvoice, tt as TabsTrigger, ut as Button } from "./router-Bkw81Fhc.mjs";
import { t as Badge } from "./badge-BQYjLRpy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/finance-CjYK0faH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FinancePage() {
	const f = useQuery({
		queryKey: ["finance"],
		queryFn: () => getFinance()
	});
	const qc = useQueryClient();
	const pnl = f.data?.pnl;
	const [pdf, setPdf] = (0, import_react.useState)(null);
	function exportPnl() {
		const lines = [
			"NORTHLINE  P&L",
			`Revenue ${pnl?.income ?? 0}`,
			`COGS ${pnl?.cogs ?? 0}`,
			`Gross ${pnl?.gross ?? 0}`,
			`OpEx ${pnl?.opex ?? 0}`,
			`Net ${pnl?.net ?? 0}`
		].join("\n");
		setPdf(lines);
		toast.success("Landscape P&L staged");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Finance",
				subtitle: "Stripe, Square, PayPal, QuickBooks Payments. Ledger, P&L, standalone invoices.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "secondary",
					onClick: exportPnl,
					children: "Export P&L"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Revenue",
						value: formatUsdFull(pnl?.income ?? 0)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Gross",
						value: formatUsdFull(pnl?.gross ?? 0)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "OpEx",
						value: formatUsdFull(pnl?.opex ?? 0)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Net",
						value: formatUsdFull(pnl?.net ?? 0)
					})
				]
			}),
			pdf && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "mx-4 mt-4 rounded-xl bg-card p-4 font-mono text-xs shadow-[var(--shadow-border)] sm:mx-6",
				children: pdf
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 px-4 sm:px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					defaultValue: "invoices",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
							className: "flex h-auto flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "invoices",
									children: "Invoices"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "ledger",
									children: "Ledger"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "qb",
									children: "QuickBooks"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "invoices",
							className: "mt-4 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "flex flex-wrap gap-2",
								onSubmit: (e) => {
									e.preventDefault();
									const fd = new FormData(e.currentTarget);
									createStandaloneInvoice({ data: {
										orgId: 11,
										amount: Number(fd.get("amount") || 0),
										memo: String(fd.get("memo") || "Standalone"),
										processor: String(fd.get("processor") || "stripe")
									} }).then((r) => {
										toast.success(`Invoice ${r.number} — payment link mailed`);
										qc.invalidateQueries({ queryKey: ["finance"] });
									});
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										name: "memo",
										placeholder: "Equipment sale / booking fee",
										className: "w-56"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										name: "amount",
										type: "number",
										placeholder: "Amount",
										className: "w-28"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										name: "processor",
										className: "h-9 rounded-md border border-input bg-background px-2 text-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "stripe",
												children: "Stripe"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "square",
												children: "Square"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "paypal",
												children: "PayPal"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "qbo",
												children: "QuickBooks Payments"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										size: "sm",
										children: "Invoice without event"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
								children: (f.data?.invoices ?? []).map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex flex-wrap items-center gap-3 px-4 py-3 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-xs",
													children: i.number
												}),
												" ",
												i.deal && i.dealId != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
													to: "/deals/$dealId",
													params: { dealId: String(i.dealId) },
													children: i.deal
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [i.org, " · no event"] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs text-muted-foreground",
													children: [
														i.memo,
														" · ",
														i.processor ?? "unassigned"
													]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono tabular-nums",
											children: formatUsdFull(i.amount)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: i.status === "paid" ? "success" : i.status === "partial" ? "steel" : "outline",
											children: i.status
										}),
										i.status !== "paid" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "secondary",
											onClick: () => recordPayment({ data: {
												invoiceId: i.id,
												amount: i.amount,
												processor: i.processor || "stripe",
												kind: "charge"
											} }).then(() => {
												toast.success("Captured");
												qc.invalidateQueries({ queryKey: ["finance"] });
											}),
											children: "Capture"
										}),
										i.status === "paid" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "ghost",
											onClick: () => recordPayment({ data: {
												invoiceId: i.id,
												amount: i.amount,
												processor: i.processor || "stripe",
												kind: "refund"
											} }).then(() => {
												toast.success("Refunded");
												qc.invalidateQueries({ queryKey: ["finance"] });
											}),
											children: "Refund"
										})
									]
								}, i.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "ledger",
							className: "mt-4 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mb-3 flex flex-wrap gap-2",
								children: (f.data?.accounts ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									children: [
										a.code,
										" ",
										a.name
									]
								}, a.id))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
								children: (f.data?.entries ?? []).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center justify-between px-4 py-2.5 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [e.account, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "ml-2 text-xs text-muted-foreground",
										children: [
											e.memo,
											" ",
											e.recurring ? "· recurring" : ""
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono tabular-nums",
										children: formatUsdFull(e.amount)
									})]
								}, e.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "qb",
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-sm font-medium",
										children: "QuickBooks Online"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-muted-foreground",
										children: "OAuth connected · invoices and expenses push nightly. Chart mapped 4000→Income, 5000→COGS, 6000→Expenses."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "success",
										className: "mt-3",
										children: "last push 2h ago"
									})
								]
							})
						})
					]
				})
			})
		]
	});
}
function Kpi({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs text-muted-foreground uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 font-mono text-xl tabular-nums",
			children: value
		})]
	});
}
//#endregion
export { FinancePage as component };
