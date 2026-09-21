import { o as __toESM } from "../_runtime.mjs";
import { i as formatDate, o as formatUsd } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { S as ShieldAlert, lt as Copy } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { J as PageHeader, ct as Input, lt as Button, ot as Textarea, st as Label } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { t as Skeleton } from "./skeleton-BVFrMLkw.mjs";
import { t as Switch } from "./switch-BLKjtJkd.mjs";
import { a as previewHandoff, c as setHandoffMonitor, n as getHandoffDesk, o as recallHandoff, s as sendHandoff, t as PackBody } from "./handoff-7CfvnPDX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/handoff-C8vZNJ6V.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var REASONS = [
	{
		id: "subcontract",
		label: "Sub-contract",
		hint: "Labor or specialty shop takes the floor"
	},
	{
		id: "emergency",
		label: "Emergency",
		hint: "If the house goes dark, they can run the night"
	},
	{
		id: "overflow",
		label: "Overflow",
		hint: "Same-night double, extra crew from outside"
	}
];
function origin() {
	if (typeof window === "undefined") return "";
	return window.location.origin;
}
function packUrl(token) {
	return `${origin()}/h/${token}`;
}
async function copy(text) {
	try {
		await navigator.clipboard.writeText(text);
		toast.success("Pack link copied");
	} catch {
		toast.message(text);
	}
}
function statusVariant(status) {
	if (status === "complete") return "success";
	if (status === "on_site" || status === "opened") return "steel";
	if (status === "recalled") return "danger";
	if (status === "sent") return "warn";
	return "outline";
}
function HandoffPage() {
	const desk = useQuery({
		queryKey: ["handoff-desk"],
		queryFn: () => getHandoffDesk(),
		refetchInterval: (q) => {
			return (q.state.data?.packs ?? []).some((p) => p.monitor && p.status !== "recalled" && p.status !== "complete") ? 12e3 : false;
		}
	});
	const qc = useQueryClient();
	const packs = desk.data?.packs ?? [];
	const vendors = desk.data?.vendors ?? [];
	const deals = desk.data?.deals ?? [];
	const [dealId, setDealId] = (0, import_react.useState)(null);
	const [to, setTo] = (0, import_react.useState)("");
	const [reason, setReason] = (0, import_react.useState)("subcontract");
	const [monitor, setMonitor] = (0, import_react.useState)(true);
	const [cover, setCover] = (0, import_react.useState)("");
	const selectedDeal = deals.find((d) => d.id === dealId) ?? deals[0] ?? null;
	const activeId = selectedDeal?.id ?? 0;
	const preview = useQuery({
		queryKey: ["handoff-preview", activeId],
		queryFn: () => previewHandoff({ data: { dealId: activeId } }),
		enabled: activeId > 0
	});
	function refresh() {
		qc.invalidateQueries({ queryKey: ["handoff-desk"] });
		qc.invalidateQueries({ queryKey: ["handoffs"] });
	}
	async function onSend() {
		if (!selectedDeal || !to.trim()) {
			toast.error("Pick a show and a receiving shop");
			return;
		}
		const res = await sendHandoff({ data: {
			dealId: selectedDeal.id,
			to: to.trim(),
			monitor,
			reason,
			cover: cover.trim() || void 0
		} });
		if (!res.ok) {
			toast.error("Could not pack the show");
			return;
		}
		toast.success("Packed without invoices or rates");
		if (res.token) copy(packUrl(res.token));
		setCover("");
		refresh();
	}
	const withheld = packs.reduce((s, p) => s + p.value, 0);
	const monitored = packs.filter((p) => p.monitor && p.status !== "recalled" && p.status !== "complete").length;
	const emergencies = packs.filter((p) => p.reason === "emergency" && p.status !== "recalled").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Event hand-off",
				subtitle: "Pack a show for a sub or an emergency shop. Production data goes. Invoices, rates, and house value never leave this desk."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Packs",
						value: String(packs.length),
						hint: "Sent to outside shops"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Monitored",
						value: String(monitored),
						hint: "House still watching"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Withheld",
						value: formatUsd(withheld),
						hint: "Value that did not travel"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Emergency",
						value: String(emergencies),
						hint: "Ready if we go dark"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 px-4 lg:grid-cols-[minmax(0,1fr)_20rem] sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
								children: "New pack"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 grid gap-3 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5 sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "ho-deal",
											children: "Show"
										}), desk.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-full" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											id: "ho-deal",
											className: "h-10 w-full rounded-md bg-secondary px-3 text-sm shadow-[var(--shadow-border)]",
											value: selectedDeal?.id ?? "",
											onChange: (e) => setDealId(Number(e.target.value)),
											children: deals.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
												value: d.id,
												children: [d.title, d.eventDate ? ` · ${formatDate(d.eventDate)}` : ""]
											}, d.id))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5 sm:col-span-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Receiving shop" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex flex-wrap gap-1.5",
												children: vendors.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													type: "button",
													size: "sm",
													variant: to === v.name ? "secondary" : "ghost",
													title: v.available ? v.category : `${v.category} · unavailable`,
													onClick: () => setTo(v.name),
													children: v.name
												}, v.name))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: to,
												onChange: (e) => setTo(e.target.value),
												placeholder: "Or type a company",
												className: "mt-1"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5 sm:col-span-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Why" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex flex-wrap gap-1.5",
												children: REASONS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													type: "button",
													size: "sm",
													variant: reason === r.id ? "secondary" : "ghost",
													title: r.hint,
													onClick: () => setReason(r.id),
													children: r.label
												}, r.id))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: REASONS.find((r) => r.id === reason)?.hint
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-3 rounded-lg bg-muted/60 px-3 py-2 sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-medium",
											children: "Monitor after send"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "See opens and on-site pings. Turn off for a clean hand-off."
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
											checked: monitor,
											onCheckedChange: setMonitor
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5 sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "ho-cover",
											children: "Cover note"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											id: "ho-cover",
											value: cover,
											onChange: (e) => setCover(e.target.value),
											className: "min-h-20",
											placeholder: "What they own on the floor. Never rates."
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: () => void onSend(),
									children: "Hand off"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Financials stay here — always."
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: "Sent packs"
					}), desk.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 w-full rounded-xl" }) : packs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No packs yet. Sub a floor or stage an emergency copy."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: packs.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackRow, {
							row: h,
							onChange: refresh
						}, h.id))
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "space-y-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
									children: "Pack preview"
								})]
							}),
							preview.data?.withheld && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: [
									"Withheld: ",
									formatUsd(preview.data.withheld.value),
									" house value",
									preview.data.withheld.invoices ? ` · ${preview.data.withheld.invoices} invoices` : "",
									" — not in the pack."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3",
								children: preview.data?.pack ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackBody, { pack: preview.data.pack }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "Pick a show."
								})
							})
						]
					})
				})]
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
				className: "mt-2 font-mono text-2xl tabular-nums",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: hint
			})
		]
	});
}
function PackRow({ row, onChange }) {
	const live = (0, import_react.useMemo)(() => {
		if (!row.monitor || !row.lastPingAt) return false;
		return Date.now() - new Date(row.lastPingAt).getTime() < 12e4;
	}, [row.monitor, row.lastPingAt]);
	const href = row.token ? `/h/${row.token}` : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "rounded-xl bg-card px-4 py-3 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: row.deal
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"to ",
								row.to,
								row.eventDate ? ` · ${formatDate(row.eventDate)}` : "",
								" · ",
								formatUsd(row.value),
								" withheld"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: row.reason === "emergency" ? "danger" : "outline",
						children: row.reason
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: statusVariant(row.status),
						children: row.status.replace("_", " ")
					}),
					row.monitor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: live ? "success" : "steel",
						children: live ? "live" : "monitoring"
					})
				]
			}),
			row.cover && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: row.cover
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap items-center gap-2",
				children: [row.token && href && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "secondary",
					onClick: () => void copy(packUrl(row.token)),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), "Copy link"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "ghost",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/h/$token",
						params: { token: row.token },
						children: "Open pack"
					})
				})] }), row.status !== "recalled" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "ml-auto flex min-h-11 items-center gap-2 text-xs text-muted-foreground",
					children: ["Monitor", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: row.monitor,
						onCheckedChange: (on) => {
							setHandoffMonitor({ data: {
								id: row.id,
								monitor: on
							} }).then(onChange);
						}
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "ghost",
					onClick: () => {
						recallHandoff({ data: { id: row.id } }).then(() => {
							toast.success("Pack recalled");
							onChange();
						});
					},
					children: "Recall"
				})] })]
			})
		]
	});
}
//#endregion
export { HandoffPage as component };
