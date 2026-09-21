import { o as __toESM } from "../_runtime.mjs";
import { i as formatDate, s as formatUsdFull } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { W as Route$18, Y as HpMark, ct as Input, lt as Button } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { i as payPortalInvoice, s as signPortalContract, t as getClientPortal } from "./session-CKySr3B6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/c._token-DpDIl5_j.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ClientPortal() {
	const { token } = Route$18.useParams();
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["client-portal", token],
		queryFn: () => getClientPortal({ data: { token } })
	});
	const [sig, setSig] = (0, import_react.useState)("");
	const [tab, setTab] = (0, import_react.useState)("home");
	const d = q.data;
	const b = d?.brand;
	const primary = `#${b?.primaryHex ?? "0D47A1"}`;
	const paper = `#${b?.paperHex ?? "F5F3EE"}`;
	const ink = `#${b?.inkHex ?? "0B1220"}`;
	function refresh() {
		qc.invalidateQueries({ queryKey: ["client-portal", token] });
	}
	if (!d || q.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center",
		style: {
			background: paper,
			color: ink
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-black/50",
			children: "Opening your portal…"
		})
	});
	if (!d.ok || !d.session) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-dvh px-6 py-16",
		style: {
			background: paper,
			color: ink
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HpMark, {
					className: "size-9",
					color: primary
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-6 text-2xl font-semibold",
					children: "This link is no longer live"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-black/55",
					children: "Ask your producer for a new portal link. No password is ever required."
				})
			]
		})
	});
	const openInv = d.invoices.filter((i) => i.status !== "paid");
	const pendingSign = d.contracts.filter((c) => c.recStatus !== "signed");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-dvh",
		style: {
			background: paper,
			color: ink
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-black/8 px-5 py-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-3xl items-center gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HpMark, {
					className: "size-8",
					color: primary
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold tracking-tight",
						children: b?.company ?? "Hurricane Productions"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "truncate text-[11px] text-black/45",
						children: [
							d.session.name,
							" · ",
							d.session.org,
							" · ",
							b?.portalHost
						]
					})]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl px-5 py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium tracking-[0.16em] uppercase",
					style: { color: primary },
					children: "Passwordless portal"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-3xl font-semibold tracking-tight",
					children: "Your show with us"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-black/55",
					children: "Proposal, contract, and payment. This link is the key — no account, no password."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 flex flex-wrap gap-2",
					children: [
						"home",
						"proposal",
						"sign",
						"pay"
					].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: tab === t ? "default" : "secondary",
						className: tab === t ? "text-white" : "",
						style: tab === t ? { background: primary } : void 0,
						onClick: () => setTab(t),
						children: t === "home" ? "Overview" : t === "proposal" ? "Proposal" : t === "sign" ? "Contract" : "Pay"
					}, t))
				}),
				tab === "home" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-3 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "rounded-xl bg-white p-4 shadow-[0_0_0_1px_rgb(11_18_32/0.08)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs tracking-wide text-black/45 uppercase",
									children: "Proposals"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 font-mono text-2xl",
									children: d.proposals.length
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-black/45",
									children: d.proposals[0]?.title ?? "None yet"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "rounded-xl bg-white p-4 shadow-[0_0_0_1px_rgb(11_18_32/0.08)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs tracking-wide text-black/45 uppercase",
									children: "To sign"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 font-mono text-2xl",
									children: pendingSign.length
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-black/45",
									children: pendingSign[0]?.title ?? "All signed"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "rounded-xl bg-white p-4 shadow-[0_0_0_1px_rgb(11_18_32/0.08)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs tracking-wide text-black/45 uppercase",
									children: "Open invoices"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 font-mono text-2xl",
									children: openInv.length
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-black/45",
									children: openInv[0] ? formatUsdFull(openInv[0].amount) : "Nothing due"
								})
							]
						})
					]
				}),
				tab === "proposal" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-6 space-y-3",
					children: [d.proposals.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl bg-white p-5 shadow-[0_0_0_1px_rgb(11_18_32/0.08)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium",
								children: p.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: p.status
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 whitespace-pre-wrap text-sm leading-relaxed text-black/70",
							children: p.body
						})]
					}, p.id)), d.proposals.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-black/50",
						children: "No proposal on this link yet."
					})]
				}),
				tab === "sign" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-6 space-y-3",
					children: [d.contracts.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl bg-white p-5 shadow-[0_0_0_1px_rgb(11_18_32/0.08)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-sm font-medium",
									children: c.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: c.recStatus === "signed" ? "success" : "outline",
									children: c.recStatus
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm leading-relaxed text-black/70",
								children: c.content
							}),
							c.recStatus !== "signed" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "mt-4 flex flex-wrap gap-2",
								onSubmit: (e) => {
									e.preventDefault();
									signPortalContract({ data: {
										token,
										envelopeId: c.id,
										recipientId: c.recipientId,
										signature: sig || d.session.name
									} }).then((r) => {
										if (!r.ok) return;
										setSig("");
										refresh();
									});
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: sig,
									onChange: (e) => setSig(e.target.value),
									placeholder: "Type your name to sign",
									className: "max-w-xs bg-white"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "text-white",
									style: { background: primary },
									children: "Sign contract"
								})]
							})
						]
					}, c.id)), d.contracts.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-black/50",
						children: "No contract waiting."
					})]
				}),
				tab === "pay" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-6 space-y-3",
					children: [d.invoices.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-5 shadow-[0_0_0_1px_rgb(11_18_32/0.08)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm font-medium",
							children: [
								i.number,
								" · ",
								formatUsdFull(i.amount)
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-black/50",
							children: [i.memo ?? i.deal, i.dueOn ? ` · due ${formatDate(i.dueOn)}` : ""]
						})] }), i.status === "paid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "success",
							children: ["paid ", i.paidAt ? formatDate(i.paidAt) : ""]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "text-white",
							style: { background: primary },
							onClick: () => payPortalInvoice({ data: {
								token,
								invoiceId: i.id
							} }).then((r) => {
								if (r.ok) refresh();
							}),
							children: "Pay with card"
						})]
					}, i.id)), d.invoices.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-black/50",
						children: "No invoices on this portal."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-10 text-xs text-black/40",
					children: [b?.footer, ". Token access — nothing to remember."]
				})
			]
		})]
	});
}
//#endregion
export { ClientPortal as component };
