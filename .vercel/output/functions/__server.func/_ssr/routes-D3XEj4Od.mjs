import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as formatDate, c as formatUsdFull, n as cn, s as formatUsd } from "./utils-DLVA4J7b.mjs";
import { F as MapPin, G as GripVertical, K as Funnel, Q as Download, R as LayoutList, Y as Flame, tt as Clock } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { Cn as exportDealsCsv, Jn as moveDeal, Mn as listDeals, Q as Tabs, Y as Route$70, at as SelectTrigger, dt as MemberAvatar, et as TabsList, it as SelectItem, lt as Input, nt as Select, ot as SelectValue, rt as SelectContent, tt as TabsTrigger, ut as Button, wn as getBootstrap } from "./router-Bkw81Fhc.mjs";
import { t as Badge } from "./badge-BQYjLRpy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D3XEj4Od.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Kanban$1({ stages, deals, onMove, onOpen }) {
	const [dragging, setDragging] = (0, import_react.useState)(null);
	const [over, setOver] = (0, import_react.useState)(null);
	const grouped = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const s of stages) map.set(s.id, []);
		for (const d of deals) {
			const list = map.get(d.stageId) ?? [];
			list.push(d);
			map.set(d.stageId, list);
		}
		return map;
	}, [stages, deals]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-full gap-3 overflow-x-auto px-4 pb-6 sm:px-6 scrollbar-thin",
		children: stages.map((stage) => {
			const cards = grouped.get(stage.id) ?? [];
			const total = cards.reduce((s, d) => s + d.value, 0);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: cn("kanban-col flex max-h-full flex-col rounded-xl bg-card p-2 shadow-[var(--shadow-border)]", over === stage.id && "ring-1 ring-primary/50"),
				onDragOver: (e) => {
					e.preventDefault();
					setOver(stage.id);
				},
				onDragLeave: () => setOver((v) => v === stage.id ? null : v),
				onDrop: (e) => {
					e.preventDefault();
					const id = Number(e.dataTransfer.getData("text/deal-id") || dragging);
					if (id) onMove(id, stage.id);
					setDragging(null);
					setOver(null);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-baseline justify-between gap-2 px-2 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: stage.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] text-muted-foreground",
						children: [
							cards.length,
							" · ",
							stage.probability,
							"%"
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-sm tabular-nums text-muted-foreground",
						children: formatUsd(total)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex min-h-24 flex-1 flex-col gap-2 overflow-y-auto rounded-lg p-0.5",
					children: cards.map((deal) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DealCardView, {
						deal,
						dragging: dragging === deal.id,
						onDragStart: () => setDragging(deal.id),
						onDragEnd: () => {
							setDragging(null);
							setOver(null);
						},
						onOpen: () => onOpen(deal.id)
					}, deal.id))
				})]
			}, stage.id);
		})
	});
}
function DealCardView({ deal, dragging, onDragStart, onDragEnd, onOpen }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
		draggable: true,
		onDragStart: (e) => {
			e.dataTransfer.setData("text/deal-id", String(deal.id));
			e.dataTransfer.effectAllowed = "move";
			onDragStart();
		},
		onDragEnd,
		onClick: onOpen,
		className: cn("cursor-pointer rounded-lg bg-background p-3 text-left shadow-[var(--shadow-border)] transition-[box-shadow,transform,opacity] duration-150 ease-out hover:shadow-[var(--shadow-border-hover)]", dragging && "opacity-40", deal.rotting && "ring-1 ring-warn/40"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "mt-0.5 size-3.5 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm leading-snug font-medium",
							children: deal.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 font-mono text-xs tabular-nums",
							children: formatUsd(deal.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 truncate text-xs text-muted-foreground",
						children: deal.orgName ?? "Independent"
					}),
					deal.venue && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 flex items-center gap-1 truncate text-[11px] text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3" }),
							deal.venue,
							deal.eventDate ? ` · ${formatDate(deal.eventDate)}` : ""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [deal.ownerInitials && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemberAvatar, {
								initials: deal.ownerInitials,
								tone: deal.ownerTone,
								size: "sm"
							}), deal.nextActivity && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex max-w-28 items-center gap-1 truncate text-[11px] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3" }), deal.nextActivity]
							})]
						}), deal.rotting && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "warn",
							className: "gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-3" }),
								deal.daysInStage,
								"d"
							]
						})]
					})
				]
			})]
		})
	});
}
function PipelinePage() {
	const { pipeline: pipelineParam, deal: dealParam } = Route$70.useSearch();
	const navigate = useNavigate({ from: "/" });
	const qc = useQueryClient();
	const [status, setStatus] = (0, import_react.useState)("open");
	const [owner, setOwner] = (0, import_react.useState)("all");
	const [q, setQ] = (0, import_react.useState)("");
	const [view, setView] = (0, import_react.useState)("board");
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	(0, import_react.useEffect)(() => {
		if (dealParam) navigate({
			to: "/deals/$dealId",
			params: { dealId: dealParam },
			replace: true
		});
	}, [dealParam, navigate]);
	const boot = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	const pipelineId = Number(pipelineParam ?? boot.data?.pipelines[0]?.id ?? 1);
	const pipeline = boot.data?.pipelines.find((p) => p.id === pipelineId) ?? boot.data?.pipelines[0];
	const deals = useQuery({
		queryKey: [
			"deals",
			pipelineId,
			status,
			owner,
			q
		],
		queryFn: () => listDeals({ data: {
			pipelineId,
			status,
			ownerId: owner === "all" ? void 0 : Number(owner),
			q: q || void 0
		} }),
		enabled: !!pipeline
	});
	const moveMut = useMutation({
		mutationFn: ({ id, stageId }) => moveDeal({ data: {
			id,
			stageId
		} }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["deals"] })
	});
	const list = deals.data ?? [];
	const stats = (0, import_react.useMemo)(() => {
		const open = list.filter((d) => d.status === "open");
		return {
			value: open.reduce((s, d) => s + d.value, 0),
			weighted: open.reduce((s, d) => s + d.value * ((d.probability ?? 0) / 100), 0),
			rotting: open.filter((d) => d.rotting).length,
			count: open.length
		};
	}, [list]);
	async function onExport() {
		const res = await exportDealsCsv({ data: { pipelineId } });
		if (res.error) {
			toast.error(res.error);
			return;
		}
		const blob = new Blob([res.csv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "northline-deals.csv";
		a.click();
		URL.revokeObjectURL(url);
		toast.success("Exported deals CSV");
	}
	function openDeal(id) {
		navigate({
			to: "/deals/$dealId",
			params: { dealId: String(id) }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-[calc(100dvh-3.5rem)] flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 border-b border-border px-4 py-3 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: String(pipelineId),
						onValueChange: (v) => navigate({ search: (s) => ({
							...s,
							pipeline: v
						}) }),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-9 w-40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (boot.data?.pipelines ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: String(p.id),
							children: p.name
						}, p.id)) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
						value: status,
						onValueChange: setStatus,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "open",
								children: "Open"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "won",
								children: "Won"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "lost",
								children: "Lost"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "all",
								children: "All"
							})
						] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: owner,
						onValueChange: setOwner,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger, {
							className: "h-9 w-40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Owner" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All owners"
						}), (boot.data?.members ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: String(m.id),
							children: m.name
						}, m.id))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Filter shows…",
						className: "h-9 max-w-xs"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex flex-wrap items-center gap-3 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Open ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-foreground tabular-nums",
								children: formatUsd(stats.value)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "hidden sm:inline",
								children: ["Weighted ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-foreground tabular-nums",
									children: formatUsd(stats.weighted)
								})]
							}),
							stats.rotting > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "warn",
								children: [stats.rotting, " rotting"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => setView(view === "board" ? "list" : "board"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutList, { className: "size-3.5" }), view === "board" ? "List" : "Board"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: onExport,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), "Export"]
							})
						]
					})
				]
			}),
			boot.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-6 py-8 text-sm text-muted-foreground",
				children: "Could not load the book. Refresh and try again."
			}),
			view === "board" ? mounted && pipeline ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 pt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kanban$1, {
					stages: pipeline.stages,
					deals: list.filter((d) => status === "all" || d.status === status),
					onMove: (id, stageId) => moveMut.mutate({
						id,
						stageId
					}),
					onOpen: openDeal
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-6 py-8 text-sm text-muted-foreground",
				children: boot.isError ? "Could not load the book." : "Loading the book…"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 overflow-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "sticky top-0 bg-background text-left text-xs text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2 font-medium sm:px-6",
								children: "Deal"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-2 font-medium",
								children: "Org"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-2 font-medium",
								children: "Stage"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-2 text-right font-medium",
								children: "Value"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-2 font-medium",
								children: "Owner"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2 font-medium sm:px-6",
								children: "Event"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: list.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "cursor-pointer border-t border-border hover:bg-accent/50",
						onClick: () => openDeal(d.id),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-2.5 sm:px-6",
								children: [d.title, d.rotting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "warn",
									className: "ml-2",
									children: "rotting"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 py-2.5 text-muted-foreground",
								children: d.orgName ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 py-2.5",
								children: pipeline?.stages.find((s) => s.id === d.stageId)?.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 py-2.5 text-right font-mono tabular-nums",
								children: formatUsdFull(d.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 py-2.5",
								children: d.ownerInitials && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemberAvatar, {
									initials: d.ownerInitials,
									tone: d.ownerTone,
									size: "sm"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2.5 text-muted-foreground sm:px-6",
								children: d.venue ?? "—"
							})
						]
					}, d.id)) })]
				})
			})
		]
	});
}
//#endregion
export { PipelinePage as component };
