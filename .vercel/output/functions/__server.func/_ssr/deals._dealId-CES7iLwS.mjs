import { o as __toESM } from "../_runtime.mjs";
import { a as formatDateTime, i as formatDate, s as formatUsdFull } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { H as MapPin, M as Pin, Ot as ArrowLeft, P as Paperclip, U as Mail, at as FileText, bt as Calendar, dt as Clock, o as Users, st as Ellipsis, v as Sparkles } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $n as toggleActivity, H as updateEventNote, Jn as moveDeal, M as listEventNotes, P as pinNote, Qn as setDealStatus, Tn as getDeal, Zn as sendEmail, _n as createActivity, _t as createEnvelope, at as SelectValue, ct as Input, dn as addFileMeta, fr as useUi, g as addEventNote, ht as convertDealToProject, ir as updateDeal, it as SelectTrigger, ln as addComment, lt as Button, m as Route$15, nt as SelectContent, ot as Textarea, rt as SelectItem, st as Label, tt as Select, un as addDealProduct, vt as createProposal, wn as getBootstrap, y as draftFromDeal } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { t as cloneDeal } from "./ultimate-DAnhRr51.mjs";
import { a as sanitizeNoteHtml, i as notePlain, n as NoteHtml, r as RichTextEditor, t as NOTE_CATEGORIES } from "./rich-text-niZEnXuQ.mjs";
import { n as DealStageStrip } from "./lifecycle-CJHg_KQl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/deals._dealId-CES7iLwS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DealWorkspace({ dealId }) {
	const qc = useQueryClient();
	const { memberId } = useUi();
	const deal = useQuery({
		queryKey: ["deal", dealId],
		queryFn: () => getDeal({ data: { id: dealId } })
	});
	const boot = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	const d = deal.data;
	if (!d) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "px-6 py-10 text-sm text-muted-foreground",
		children: deal.isLoading ? "Loading show…" : "Deal not found."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DealBody, {
		d,
		memberId,
		members: boot.data?.members ?? [],
		products: boot.data?.products ?? [],
		lostReasons: boot.data?.lostReasons ?? [],
		eventTypes: boot.data?.eventTypes ?? [],
		stages: (boot.data?.pipelines.find((p) => p.id === d.pipelineId) ?? boot.data?.pipelines[0])?.stages ?? [],
		onRefresh: () => {
			qc.invalidateQueries({ queryKey: ["deal", dealId] });
			qc.invalidateQueries({ queryKey: ["deals"] });
			qc.invalidateQueries({ queryKey: ["insights"] });
			qc.invalidateQueries({ queryKey: ["lifecycle"] });
		}
	});
}
function DealBody({ d, memberId, members, products, lostReasons, eventTypes, stages, onRefresh }) {
	const navigate = useNavigate();
	const [comment, setComment] = (0, import_react.useState)("");
	const [ai, setAi] = (0, import_react.useState)(null);
	const [aiBusy, setAiBusy] = (0, import_react.useState)(false);
	const [productId, setProductId] = (0, import_react.useState)("");
	const [qty, setQty] = (0, import_react.useState)("1");
	const [loseOpen, setLoseOpen] = (0, import_react.useState)(null);
	const [lostReason, setLostReason] = (0, import_react.useState)("Budget");
	const [pane, setPane] = (0, import_react.useState)("activity");
	const [hist, setHist] = (0, import_react.useState)("all");
	const [more, setMore] = (0, import_react.useState)(false);
	const [actSubject, setActSubject] = (0, import_react.useState)("");
	const [actType, setActType] = (0, import_react.useState)("task");
	const [focusOpen, setFocusOpen] = (0, import_react.useState)(true);
	const [histOpen, setHistOpen] = (0, import_react.useState)(true);
	const statusMut = useMutation({
		mutationFn: (payload) => setDealStatus({ data: {
			id: d.id,
			status: payload.status,
			lostReason: payload.lostReason
		} }),
		onSuccess: () => {
			toast.success("Deal updated");
			setLoseOpen(null);
			onRefresh();
		}
	});
	async function saveComment() {
		if (!comment.trim()) return;
		await addComment({ data: {
			entityType: "deal",
			entityId: d.id,
			authorId: memberId,
			body: comment.trim()
		} });
		setComment("");
		onRefresh();
	}
	const lineTotal = d.products.reduce((s, p) => s + p.qty * p.price * (1 - p.discount / 100), 0);
	const stageName = stages.find((s) => s.id === d.stageId)?.name ?? "Pipeline";
	const missing = [];
	if (!d.personName) missing.push({
		label: "Client facing — project name",
		hint: "Portal"
	});
	if (!d.venue) missing.push({
		label: "Venue",
		hint: "Required for load-in"
	});
	if (!d.eventDate) missing.push({
		label: "Event date",
		hint: "On the calendar"
	});
	if (!d.expectedClose) missing.push({
		label: "Expected close",
		hint: "Set expected close date"
	});
	if (d.value === 0) missing.push({
		label: "Value",
		hint: "$0 on the book"
	});
	const feed = (0, import_react.useMemo)(() => {
		const items = [];
		for (const a of d.activities) items.push({
			id: `a${a.id}`,
			kind: "activity",
			at: a.dueAt ?? a.createdAt ?? "",
			title: a.subject,
			detail: a.notes ?? a.type,
			meta: `${a.type} · ${a.ownerName ?? ""}${a.done ? " · done" : ""}`
		});
		for (const c of d.comments) items.push({
			id: `c${c.id}`,
			kind: "note",
			at: c.createdAt,
			title: c.authorName ?? "Note",
			detail: c.body,
			meta: "note"
		});
		for (const e of d.emails) items.push({
			id: `e${e.id}`,
			kind: "email",
			at: e.sentAt ?? e.createdAt,
			title: e.subject,
			detail: e.body,
			meta: `${e.fromName} → ${e.toAddr}${e.opened ? " · opened" : ""}`
		});
		for (const f of d.files) items.push({
			id: `f${f.id}`,
			kind: "file",
			at: f.createdAt ?? d.updatedAt,
			title: f.name,
			detail: `${f.sizeKb} kb`,
			meta: "file"
		});
		for (const doc of d.documents) items.push({
			id: `d${doc.id}`,
			kind: "invoice",
			at: d.updatedAt,
			title: doc.name,
			detail: doc.status,
			meta: "document"
		});
		for (const h of d.history ?? []) items.push({
			id: `h${h.id}`,
			kind: "log",
			at: h.createdAt,
			title: `${h.actor} ${h.action}`,
			detail: h.detail ?? "",
			meta: "changelog"
		});
		items.sort((a, b) => a.at < b.at ? 1 : -1);
		return hist === "all" ? items : items.filter((i) => i.kind === hist);
	}, [d, hist]);
	const upcoming = d.activities.filter((a) => !a.done);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-[calc(100dvh-3.5rem)] min-h-0 flex-col bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "shrink-0 border-b border-border bg-card px-4 pt-3 pb-0 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-3.5" }), "Deals"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 truncate text-2xl font-semibold tracking-tight",
							children: d.title
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: String(d.ownerId ?? ""),
								onValueChange: (v) => updateDeal({ data: {
									id: d.id,
									ownerId: Number(v)
								} }).then(onRefresh),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-9 w-48",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Owner" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: String(m.id),
									children: m.name
								}, m.id)) })]
							}),
							d.status === "open" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								className: "bg-success text-primary-foreground hover:bg-success/90",
								onClick: () => statusMut.mutate({ status: "won" }),
								children: "Won"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
								onClick: () => {
									setLoseOpen((v) => v === "lost" ? null : "lost");
									setLostReason(lostReasons.find((r) => r.kind !== "cancelled")?.name ?? "Budget");
								},
								children: "Lost"
							})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: d.status === "won" ? "success" : d.status === "lost" ? "danger" : "warn",
								children: d.status
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => setMore((v) => !v),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" })
							})
						]
					})]
				}),
				more && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex flex-wrap gap-1 pb-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/ai",
								children: "AI draft"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => cloneDeal({ data: { id: d.id } }).then((r) => {
								if (r.id) {
									toast.success("Deal duplicated");
									navigate({
										to: "/deals/$dealId",
										params: { dealId: String(r.id) }
									});
								}
								onRefresh();
							}),
							children: "Duplicate"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => convertDealToProject({ data: { dealId: d.id } }).then((r) => {
								if (r.ok) {
									toast.success("Project opened");
									navigate({
										to: "/projects/$projectId",
										params: { projectId: String(r.id) }
									});
								}
							}),
							children: "Create project"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => createEnvelope({ data: {
								dealId: d.id,
								mode: "sequential",
								authMethod: "email",
								recipients: [{
									name: d.personName ?? "Client",
									email: d.personEmail ?? "client@example.com",
									role: "signer"
								}, {
									name: "Dana Okonkwo",
									email: "dana@northline.av",
									role: "countersigner"
								}]
							} }).then((r) => {
								toast.success("Signature request sent");
								if (r.id) navigate({
									to: "/esign/$envelopeId",
									params: { envelopeId: String(r.id) }
								});
							}),
							children: "Launch e-sign"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => createProposal({ data: {
								dealId: d.id,
								title: d.title,
								body: d.notes ?? "Production proposal."
							} }).then((r) => toast.success(`Proposal /p/${r.token}`)),
							children: "Proposal"
						}),
						d.status === "open" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => {
								setLoseOpen((v) => v === "cancelled" ? null : "cancelled");
								setLostReason(lostReasons.find((r) => r.kind === "cancelled")?.name ?? "Event cancelled");
							},
							children: "Event cancelled"
						}),
						(d.status === "lost" || d.status === "cancelled") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "secondary",
							onClick: () => statusMut.mutate({ status: "open" }),
							children: "Reopen"
						})
					]
				}),
				loseOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-2 flex flex-wrap items-center gap-2 pb-2",
					onSubmit: (e) => {
						e.preventDefault();
						statusMut.mutate({
							status: loseOpen,
							lostReason
						});
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: lostReason,
						onValueChange: setLostReason,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-9 w-56",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (lostReasons.length ? lostReasons : [{
							id: 0,
							name: "Budget",
							kind: "lost"
						}]).filter((r) => loseOpen === "cancelled" ? r.kind === "cancelled" : r.kind !== "cancelled").map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: r.name,
							children: r.name
						}, r.id || r.name)) })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						type: "submit",
						children: loseOpen === "cancelled" ? "Confirm cancelled" : "Confirm lost"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 -mx-4 sm:-mx-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DealStageStrip, {
						stages,
						stageId: d.stageId,
						status: d.status,
						daysInStage: d.daysInStage,
						onStage: (id) => moveDeal({ data: {
							id: d.id,
							stageId: id
						} }).then(() => {
							toast.success("Stage updated");
							onRefresh();
						}),
						onWon: () => statusMut.mutate({ status: "won" }),
						onLost: () => {
							setLoseOpen("lost");
							setLostReason(lostReasons.find((r) => r.kind !== "cancelled")?.name ?? "Budget");
						}
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "py-2 text-xs text-muted-foreground",
					children: [
						"Pipeline → ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground",
							children: stageName
						}),
						d.lostReason ? ` · ${d.lostReason}` : ""
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "hidden w-72 shrink-0 overflow-y-auto border-r border-border bg-card lg:block",
				children: [
					missing.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "border-l-2 border-destructive px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xs font-medium tracking-wide uppercase",
							children: "Please fill"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-2 text-sm",
							children: missing.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-destructive",
									children: "• "
								}),
								m.label,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block pl-3 text-xs text-muted-foreground",
									children: m.hint
								})
							] }, m.label))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "border-b border-border px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
							children: "Summary"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-3 space-y-2.5 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "mt-0.5 size-3.5 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: d.eventDate ? formatDate(d.eventDate) : "Set event date" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 size-3.5 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-primary",
										children: d.venue ?? "Add venue"
									})]
								}),
								d.eventType && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-0.5 size-3.5 shrink-0 text-center text-xs text-muted-foreground",
										children: "T"
									}), d.eventType]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "mt-0.5 size-3.5 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: d.expectedClose ? formatDate(d.expectedClose) : "Set expected close date" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [d.orgName ?? "Independent", d.personName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/contacts/$personId",
									params: { personId: String(d.personId) },
									className: "mt-0.5 block text-primary",
									children: d.personName
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 block text-muted-foreground",
									children: "+ Person"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex flex-wrap gap-1",
									children: [
										d.rotting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "danger",
											children: "Estimate expired"
										}),
										d.eventType && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "steel",
											children: d.eventType
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											children: formatUsdFull(d.value)
										})
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "border-b border-border px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
								children: "E-sign"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Contracts on this show."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "secondary",
								className: "mt-2",
								onClick: () => createEnvelope({ data: {
									dealId: d.id,
									mode: "sequential",
									authMethod: "email",
									recipients: [{
										name: d.personName ?? "Client",
										email: d.personEmail ?? "client@example.com",
										role: "signer"
									}]
								} }).then((r) => {
									toast.success("Signature request sent");
									if (r.id) navigate({
										to: "/esign/$envelopeId",
										params: { envelopeId: String(r.id) }
									});
								}),
								children: "Launch e-sign"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
								children: "Details"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "mt-3 space-y-3 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Value"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "font-mono tabular-nums",
										children: formatUsdFull(d.value)
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Load-in"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: d.loadIn ?? "—" })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Guests"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: d.guestCount ?? "—" })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Indoor"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: d.indoor == null ? "—" : d.indoor ? "Indoor" : "Outdoor" })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Probability"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [d.probability ?? 0, "%"] })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Source"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: d.source ?? "—" })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Days in stage"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [d.daysInStage, "d"] })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Description"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										className: "mt-1 min-h-20",
										defaultValue: d.notes ?? "",
										onBlur: (e) => {
											if (e.target.value !== (d.notes ?? "")) updateDeal({ data: {
												id: d.id,
												notes: e.target.value
											} }).then(onRefresh);
										}
									}) })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Event type"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: d.eventType ?? "",
											onValueChange: (v) => updateDeal({ data: {
												id: d.id,
												eventType: v
											} }).then(onRefresh),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Categorize" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (eventTypes.length ? eventTypes.map((t) => t.name) : [
												"Corporate gala",
												"Wedding",
												"Brand activation",
												"Dry hire"
											]).map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: name,
												children: name
											}, name)) })]
										})
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinnedEventNotes, { dealId: d.id })
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col overflow-hidden bg-muted/40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "shrink-0 border-b border-border bg-card px-4 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1",
							children: [
								["activity", "Activity"],
								["notes", "Notes"],
								["email", "Email"],
								["files", "Files"],
								["invoice", "Invoice"]
							].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: pane === id ? "secondary" : "ghost",
								onClick: () => setPane(id),
								children: [
									id === "activity" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5" }),
									id === "notes" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-3.5" }),
									id === "email" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-3.5" }),
									id === "files" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "size-3.5" }),
									label
								]
							}, id))
						}),
						pane === "activity" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "mt-2 flex flex-wrap gap-2",
							onSubmit: (e) => {
								e.preventDefault();
								if (!actSubject.trim()) return;
								createActivity({ data: {
									type: actType,
									subject: actSubject.trim(),
									ownerId: memberId,
									dealId: d.id,
									personId: d.personId,
									orgId: d.orgId
								} }).then(() => {
									setActSubject("");
									toast.success("Activity scheduled");
									onRefresh();
								});
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "h-9 rounded-md border border-input bg-background px-2 text-sm",
									value: actType,
									onChange: (e) => setActType(e.target.value),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "task",
											children: "Task"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "call",
											children: "Call"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "meeting",
											children: "Meeting"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "deadline",
											children: "Deadline"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: actSubject,
									onChange: (e) => setActSubject(e.target.value),
									placeholder: "Click here to add an activity…",
									className: "min-w-48 flex-1"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									size: "sm",
									disabled: !actSubject.trim(),
									children: "Schedule"
								})
							]
						}),
						pane === "notes" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventNotesPanel, {
								dealId: d.id,
								memberId
							})
						}),
						pane === "email" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compose, {
								deal: d,
								memberId,
								onSent: onRefresh
							})
						}),
						pane === "files" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 space-y-2",
							children: [
								d.files.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "size-4 text-muted-foreground" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex-1 truncate",
											children: f.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: [f.sizeKb, " kb"]
										})
									]
								}, f.id)),
								d.documents.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4 text-muted-foreground" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex-1 truncate",
											children: doc.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											children: doc.status
										})
									]
								}, doc.id)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "secondary",
									size: "sm",
									onClick: () => addFileMeta({ data: {
										entityType: "deal",
										entityId: d.id,
										name: `plot_v${d.files.length + 1}.pdf`,
										uploadedBy: memberId
									} }).then(onRefresh),
									children: "Attach plot PDF"
								})
							]
						}),
						pane === "invoice" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
									className: "w-full text-sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: d.products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-t border-border",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2",
												children: p.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "py-2 tabular-nums",
												children: [
													p.qty,
													" ",
													p.unit
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2 text-right font-mono",
												children: formatUsdFull(p.qty * p.price * (1 - p.discount / 100))
											})
										]
									}, p.id)) })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Catalog total"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono tabular-nums",
										children: formatUsdFull(lineTotal)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									className: "flex gap-2",
									onSubmit: (e) => {
										e.preventDefault();
										if (!productId) return;
										addDealProduct({ data: {
											dealId: d.id,
											productId: Number(productId),
											qty: Number(qty || 1)
										} }).then(onRefresh);
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: productId,
											onValueChange: setProductId,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "flex-1",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Add from catalog" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: String(p.id),
												children: p.name
											}, p.id)) })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: qty,
											onChange: (e) => setQty(e.target.value),
											type: "number",
											className: "w-20"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "submit",
											variant: "secondary",
											children: "Add"
										})
									]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "flex w-full items-center justify-between text-sm font-medium",
							onClick: () => setFocusOpen((v) => !v),
							children: ["Focus", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-normal text-muted-foreground",
								children: focusOpen ? "Collapse" : "Expand all items"
							})]
						}), focusOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 space-y-2",
							children: [upcoming.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "py-6 text-center text-sm text-muted-foreground",
								children: "No focus items yet. Scheduled activities and pinned notes appear here."
							}), upcoming.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3 rounded-xl bg-card p-3 shadow-[var(--shadow-border)]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "mt-0.5 size-4 text-muted-foreground" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm",
											children: a.subject
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-muted-foreground",
											children: [
												a.type,
												" · ",
												formatDateTime(a.dueAt),
												" · ",
												a.ownerName
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										onClick: () => toggleActivity({ data: {
											id: a.id,
											done: true
										} }).then(onRefresh),
										children: "Done"
									})
								]
							}, a.id))]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex w-full items-center justify-between text-sm font-medium",
						onClick: () => setHistOpen((v) => !v),
						children: ["History", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-normal text-muted-foreground",
							children: feed.length
						})]
					}), histOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-1",
							children: [
								["all", "All"],
								["activity", "Activities"],
								["note", "Notes"],
								["email", "Emails"],
								["file", "Files"],
								["invoice", "Documents"],
								["log", "Changelog"]
							].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: hist === id ? "secondary" : "ghost",
								onClick: () => setHist(id),
								children: label
							}, id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-3 space-y-2",
							children: [feed.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground",
									children: [
										item.kind === "email" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-3.5" }),
										item.kind === "activity" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5" }),
										item.kind === "note" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-3.5" }),
										item.kind === "file" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "size-3.5" }),
										item.kind === "invoice" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-3.5" }),
										item.kind === "log" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-3.5" })
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-medium",
											children: item.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-0.5 text-xs text-muted-foreground",
											children: [formatDateTime(item.at), item.meta ? ` · ${item.meta}` : ""]
										}),
										item.detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 line-clamp-3 text-sm text-muted-foreground",
											children: item.detail
										})
									]
								})]
							}, item.id)), feed.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "py-8 text-center text-sm text-muted-foreground",
								children: "Nothing in this filter."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "mt-4 flex gap-2",
							onSubmit: (e) => {
								e.preventDefault();
								saveComment();
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: comment,
								onChange: (e) => setComment(e.target.value),
								placeholder: "Comment, use @name to mention"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								variant: "secondary",
								children: "Post"
							})]
						})
					] })] })]
				})]
			})]
		})]
	});
}
function PinnedEventNotes({ dealId }) {
	const pinned = (useQuery({
		queryKey: ["event-notes", dealId],
		queryFn: () => listEventNotes({ data: { dealId } })
	}).data ?? []).filter((n) => n.pinned);
	if (!pinned.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
			children: "Pinned on this event"
		}), pinned.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-b border-border pb-2 last:border-0 last:pb-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "steel",
				children: n.category
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoteHtml, {
				html: n.body,
				className: "mt-1"
			})]
		}, n.id))]
	});
}
function EventNotesPanel({ dealId, memberId }) {
	const qc = useQueryClient();
	const notes = useQuery({
		queryKey: ["event-notes", dealId],
		queryFn: () => listEventNotes({ data: { dealId } })
	});
	const [body, setBody] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("production");
	const [pin, setPin] = (0, import_react.useState)(false);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [editorKey, setEditorKey] = (0, import_react.useState)(0);
	function refresh() {
		qc.invalidateQueries({ queryKey: ["event-notes", dealId] });
	}
	const rows = (notes.data ?? []).filter((n) => filter === "all" || n.category === filter);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "These notes live on the event record — pinned, categorized, not a side document."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
				onSubmit: (e) => {
					e.preventDefault();
					const html = sanitizeNoteHtml(body);
					if (!notePlain(html)) return;
					addEventNote({ data: {
						dealId,
						body: html,
						category,
						pinned: pin,
						authorId: memberId
					} }).then(() => {
						setBody("");
						setPin(false);
						setEditorKey((k) => k + 1);
						toast.success("Note on the event");
						refresh();
					});
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "h-9 rounded-md bg-secondary px-2 text-sm shadow-[var(--shadow-border)]",
							value: category,
							onChange: (e) => setCategory(e.target.value),
							children: NOTE_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c.id,
								children: c.label
							}, c.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: pin,
								onChange: (e) => setPin(e.target.checked)
							}), "Pin to event"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "sm",
							disabled: !notePlain(body),
							children: "Add note"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichTextEditor, {
					value: body,
					onChange: setBody,
					placeholder: "Load-in, power, talent, holds…"
				}, editorKey)]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: filter === "all" ? "secondary" : "ghost",
					onClick: () => setFilter("all"),
					children: "All"
				}), NOTE_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: filter === c.id ? "secondary" : "ghost",
					onClick: () => setFilter(c.id),
					children: c.label
				}, c.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "space-y-2",
				children: [rows.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: n.pinned ? "steel" : "outline",
								children: n.category
							}),
							n.pinned && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "size-3 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: "h-8 rounded-md bg-secondary px-2 text-xs shadow-[var(--shadow-border)]",
								value: n.category,
								onChange: (e) => updateEventNote({ data: {
									id: n.id,
									category: e.target.value
								} }).then(() => {
									toast.success("Category on the event");
									refresh();
								}),
								children: NOTE_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c.id,
									children: c.label
								}, c.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex-1 text-xs text-muted-foreground",
								children: [
									n.author,
									" · ",
									formatDateTime(n.createdAt)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => pinNote({ data: {
									id: n.id,
									pinned: !n.pinned
								} }).then(() => {
									toast.success(n.pinned ? "Unpinned" : "Pinned to event");
									refresh();
								}),
								children: n.pinned ? "Unpin" : "Pin"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => {
									setEditing(n.id);
									setDraft(n.body);
								},
								children: "Edit"
							})
						]
					}), editing === n.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-3 space-y-2",
						onSubmit: (e) => {
							e.preventDefault();
							updateEventNote({ data: {
								id: n.id,
								body: sanitizeNoteHtml(draft)
							} }).then(() => {
								setEditing(null);
								toast.success("Saved on the event");
								refresh();
							});
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichTextEditor, {
							value: draft,
							onChange: setDraft
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								size: "sm",
								children: "Save"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								variant: "ghost",
								onClick: () => setEditing(null),
								children: "Cancel"
							})]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoteHtml, {
						html: n.body,
						className: "mt-2"
					})]
				}, n.id)), rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No event notes in this category."
				})]
			})
		]
	});
}
function Compose({ deal, memberId, onSent }) {
	const me = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	}).data?.members.find((m) => m.id === memberId);
	const [subject, setSubject] = (0, import_react.useState)(`Following up — ${deal.title}`);
	const [body, setBody] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function draft() {
		setBusy(true);
		const res = await draftFromDeal({ data: {
			dealId: deal.id,
			prompt: subject || "Follow up on load-in and next steps."
		} });
		setBusy(false);
		if (res.ok) {
			setBody(res.body);
			toast.success("Draft ready — still yours to send");
		} else toast.error(res.error);
	}
	async function send() {
		if (!me) return;
		await sendEmail({ data: {
			fromName: me.name,
			fromAddr: me.email,
			toAddr: deal.personEmail ?? "client@example.com",
			subject,
			body,
			dealId: deal.id,
			memberId: me.id
		} });
		toast.success("Queued to sent (tracked) · your domain");
		setBody("");
		onSent();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2 rounded-lg border border-border p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Compose" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "ghost",
					onClick: draft,
					disabled: busy,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), busy ? "Drafting…" : "One-click AI draft"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: subject,
				onChange: (e) => setSubject(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				rows: 5,
				value: body,
				onChange: (e) => setBody(e.target.value),
				placeholder: "Message"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-3" }), "Open & click tracking on · merge tags filled · sending domain aligned"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					onClick: send,
					disabled: !body,
					children: "Send"
				})]
			})
		]
	});
}
function DealPage() {
	const { dealId } = Route$15.useParams();
	const id = Number(dealId);
	if (!Number.isFinite(id)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "px-6 py-10 text-sm text-muted-foreground",
		children: "Deal not found."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DealWorkspace, { dealId: id });
}
//#endregion
export { DealPage as component };
