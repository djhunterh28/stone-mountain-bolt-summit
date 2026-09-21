import { o as __toESM } from "../_runtime.mjs";
import { i as formatDate, o as formatUsd, t as cn } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { $ as GripVertical } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { ar as updateLead, gn as convertLead, lr as DISQUALIFY_REASONS, lt as Button, ur as LEAD_STAGES, ut as MemberAvatar } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lifecycle-CJHg_KQl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FunnelStrip({ steps, exits, active, onPick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-2 overflow-x-auto pb-1 scrollbar-thin",
			children: steps.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-stretch gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onPick?.(s.key),
					className: cn("min-w-28 rounded-xl bg-card px-3 py-3 text-left shadow-[var(--shadow-border)] transition-shadow", active === s.key && "ring-1 ring-primary/50"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] tracking-wide text-muted-foreground uppercase",
							children: s.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 font-mono text-xl tabular-nums",
							children: s.count
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 truncate text-[11px] text-muted-foreground",
							children: s.value ? formatUsd(s.value) : s.hint
						})
					]
				}), i < steps.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden w-3 shrink-0 self-center border-t border-border sm:block",
					"aria-hidden": true
				})]
			}, s.key))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children: exits.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onPick?.(s.key),
				className: cn("rounded-lg px-3 py-2 text-left shadow-[var(--shadow-border)]", s.key === "lost" || s.key === "disqualified" ? "bg-destructive/10" : "bg-card", active === s.key && "ring-1 ring-primary/50"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] tracking-wide text-muted-foreground uppercase",
					children: s.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-0.5 flex items-baseline gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-sm tabular-nums",
						children: s.count
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] text-muted-foreground",
						children: s.value ? formatUsd(s.value) : s.hint
					})]
				})]
			}, s.key))
		})]
	});
}
function DealStageStrip({ stages, stageId, status, daysInStage = 0, onStage, onWon, onLost }) {
	const idx = stages.findIndex((s) => s.id === stageId);
	const won = status === "won";
	const lost = status === "lost" || status === "cancelled";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "nl-stage-row",
		role: "list",
		children: [
			stages.map((s, i) => {
				const current = !won && !lost && i === idx;
				const done = !won && !lost && i <= idx;
				const days = current ? daysInStage : done ? 0 : null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					role: "listitem",
					disabled: !onStage || won || lost,
					onClick: () => onStage?.(s.id),
					className: cn("nl-stage", done && "is-done", current && "is-current"),
					title: s.name,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "truncate",
						children: [days != null ? `${days}d · ` : "", s.name]
					})
				}, s.id);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				role: "listitem",
				disabled: !onWon,
				onClick: () => onWon?.(),
				className: cn("nl-stage", won && "is-won"),
				children: "Won"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				role: "listitem",
				disabled: !onLost,
				onClick: () => onLost?.(),
				className: cn("nl-stage", lost && "is-lost"),
				children: status === "cancelled" ? "Cancelled" : "Lost"
			})
		]
	});
}
function LeadKanban({ leads, pipeline }) {
	const qc = useQueryClient();
	const navigate = useNavigate();
	const [dragging, setDragging] = (0, import_react.useState)(null);
	const [over, setOver] = (0, import_react.useState)(null);
	const [dq, setDq] = (0, import_react.useState)(null);
	const grouped = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const s of LEAD_STAGES) map.set(s.id, []);
		for (const l of leads) {
			if (l.status === "converted" || l.status === "archived") continue;
			const list = map.get(l.status) ?? [];
			list.push(l);
			map.set(l.status, list);
		}
		return map;
	}, [leads]);
	const move = useMutation({
		mutationFn: (payload) => updateLead({ data: payload }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["leads"] });
			qc.invalidateQueries({ queryKey: ["lifecycle"] });
		}
	});
	const convert = useMutation({
		mutationFn: (id) => convertLead({ data: {
			id,
			pipelineId: pipeline?.id ?? 1,
			stageId: pipeline?.stages[0]?.id ?? 1
		} }),
		onSuccess: (r) => {
			toast.success("Converted to the book");
			qc.invalidateQueries({ queryKey: ["leads"] });
			qc.invalidateQueries({ queryKey: ["deals"] });
			qc.invalidateQueries({ queryKey: ["lifecycle"] });
			if (r.id) navigate({
				to: "/deals/$dealId",
				params: { dealId: String(r.id) }
			});
		}
	});
	function dropOn(status, id) {
		if (status === "disqualified") {
			setDq(id);
			return;
		}
		move.mutate({
			id,
			status
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex gap-3 overflow-x-auto pb-4 scrollbar-thin",
		children: LEAD_STAGES.map((stage) => {
			const cards = grouped.get(stage.id) ?? [];
			const total = cards.reduce((s, l) => s + l.estimatedValue, 0);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: cn("flex w-64 shrink-0 flex-col rounded-xl bg-card p-2 shadow-[var(--shadow-border)]", over === stage.id && "ring-1 ring-primary/50"),
				onDragOver: (e) => {
					e.preventDefault();
					setOver(stage.id);
				},
				onDragLeave: () => setOver((v) => v === stage.id ? null : v),
				onDrop: (e) => {
					e.preventDefault();
					const id = Number(e.dataTransfer.getData("text/lead-id") || dragging);
					if (id) dropOn(stage.id, id);
					setDragging(null);
					setOver(null);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-baseline justify-between gap-2 px-2 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: stage.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] text-muted-foreground",
						children: [
							cards.length,
							" · ",
							stage.hint
						]
					})] }), total > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-xs tabular-nums text-muted-foreground",
						children: formatUsd(total)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex min-h-24 flex-1 flex-col gap-2",
					children: cards.map((lead) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeadCard, {
						lead,
						dragging: dragging === lead.id,
						onDragStart: () => setDragging(lead.id),
						onDragEnd: () => {
							setDragging(null);
							setOver(null);
						},
						onConvert: () => convert.mutate(lead.id),
						converting: convert.isPending,
						onContact: () => move.mutate({
							id: lead.id,
							status: "contacted"
						})
					}, lead.id))
				})]
			}, stage.id);
		})
	}), dq != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-card px-3 py-2 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm",
				children: "Disqualify reason"
			}),
			DISQUALIFY_REASONS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "secondary",
				onClick: () => {
					move.mutate({
						id: dq,
						status: "disqualified",
						disqualifyReason: r
					});
					setDq(null);
				},
				children: r
			}, r)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "ghost",
				onClick: () => setDq(null),
				children: "Cancel"
			})
		]
	})] });
}
function LeadCard({ lead, dragging, onDragStart, onDragEnd, onConvert, converting, onContact }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
		draggable: true,
		onDragStart: (e) => {
			e.dataTransfer.setData("text/lead-id", String(lead.id));
			e.dataTransfer.effectAllowed = "move";
			onDragStart();
		},
		onDragEnd,
		className: cn("rounded-lg bg-background p-3 shadow-[var(--shadow-border)] transition-opacity", dragging && "opacity-40"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "mt-0.5 size-3.5 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm leading-snug font-medium",
							children: lead.title
						}), lead.estimatedValue > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 font-mono text-xs tabular-nums",
							children: formatUsd(lead.estimatedValue)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 truncate text-xs text-muted-foreground",
						children: [lead.personName ?? lead.orgName ?? "Unknown", lead.venue ? ` · ${lead.venue}` : ""]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex flex-wrap items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: lead.source
							}),
							lead.eventType && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "steel",
								children: lead.eventType
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: lead.score >= 70 ? "success" : lead.score >= 50 ? "steel" : "outline",
								children: lead.score
							}),
							lead.status === "disqualified" && lead.disqualifyReason && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "danger",
								children: lead.disqualifyReason
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [lead.ownerInitials && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemberAvatar, {
								initials: lead.ownerInitials,
								tone: lead.ownerTone,
								size: "sm"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-muted-foreground",
								children: formatDate(lead.createdAt)
							})]
						}), lead.status === "qualified" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: onConvert,
							disabled: converting,
							children: "Convert"
						}) : lead.status === "new" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: onContact,
							children: "Contacted"
						}) : lead.status === "disqualified" ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: onConvert,
							disabled: converting,
							children: "Convert"
						})]
					})
				]
			})]
		})
	});
}
function ClosedTable({ rows, empty }) {
	if (rows.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "px-1 py-8 text-sm text-muted-foreground",
		children: empty
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
		children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/deals/$dealId",
			params: { dealId: String(r.id) },
			className: "flex flex-wrap items-center gap-3 px-4 py-3 hover:bg-accent/40",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium",
						children: r.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-0.5 text-xs text-muted-foreground",
						children: [
							r.orgName ?? "Independent",
							r.venue ? ` · ${r.venue}` : "",
							r.source ? ` · ${r.source}` : ""
						]
					})]
				}),
				r.eventType && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "steel",
					children: r.eventType
				}),
				r.reason && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					children: r.reason
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-sm tabular-nums",
						children: formatUsd(r.value)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] text-muted-foreground",
						children: formatDate(r.at)
					})]
				})
			]
		}) }, r.id))
	});
}
function LifecycleSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 animate-pulse rounded-xl bg-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-48 animate-pulse rounded-xl bg-muted" })]
	});
}
//#endregion
export { LifecycleSkeleton as a, LeadKanban as i, DealStageStrip as n, FunnelStrip as r, ClosedTable as t };
