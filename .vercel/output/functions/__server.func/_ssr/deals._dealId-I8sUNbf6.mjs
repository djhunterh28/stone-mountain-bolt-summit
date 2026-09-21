import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as formatDate, c as formatUsdFull, o as formatDateTime } from "./utils-DLVA4J7b.mjs";
import { t as runAi } from "./ai-Ceoa2a3r.mjs";
import { E as Pin, F as MapPin, O as Paperclip, X as FileText, _ as Sparkles, _t as ArrowLeft, a as Users, tt as Clock, ut as Calendar } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as TabsContent, $n as setDealStatus, F as pinNote, N as listEventNotes, Q as Tabs, Qn as sendEmail, Tn as getDeal, ar as updateDeal, at as SelectTrigger, ct as Label, dn as addDealProduct, dt as MemberAvatar, et as TabsList, f as addEventNote, fn as addFileMeta, gt as convertDealToProject, h as draftFromDeal, it as SelectItem, lt as Input, nt as Select, ot as SelectValue, rt as SelectContent, st as Textarea, tt as TabsTrigger, u as Route$11, un as addComment, ur as useUi, ut as Button, vt as createEnvelope, wn as getBootstrap, yt as createProposal } from "./router-Bkw81Fhc.mjs";
import { t as Badge } from "./badge-BQYjLRpy.mjs";
import { t as cloneDeal } from "./ultimate-JaIPPjEW.mjs";
import { t as Separator } from "./separator-BU1uFMXP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/deals._dealId-I8sUNbf6.js
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
		onRefresh: () => {
			qc.invalidateQueries({ queryKey: ["deal", dealId] });
			qc.invalidateQueries({ queryKey: ["deals"] });
			qc.invalidateQueries({ queryKey: ["insights"] });
		}
	});
}
function DealBody({ d, memberId, members, products, lostReasons, onRefresh }) {
	const navigate = useNavigate();
	const [comment, setComment] = (0, import_react.useState)("");
	const [ai, setAi] = (0, import_react.useState)(null);
	const [aiBusy, setAiBusy] = (0, import_react.useState)(false);
	const [productId, setProductId] = (0, import_react.useState)("");
	const [qty, setQty] = (0, import_react.useState)("1");
	const [loseOpen, setLoseOpen] = (0, import_react.useState)(false);
	const [lostReason, setLostReason] = (0, import_react.useState)("Budget");
	const statusMut = useMutation({
		mutationFn: (payload) => setDealStatus({ data: {
			id: d.id,
			status: payload.status,
			lostReason: payload.lostReason
		} }),
		onSuccess: () => {
			toast.success("Deal updated");
			setLoseOpen(false);
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
	async function summarize() {
		setAiBusy(true);
		const res = await runAi({ data: {
			kind: "summary",
			prompt: `Deal: ${d.title}. Value ${d.value}. Venue ${d.venue}. Event ${d.eventDate}. Stage days ${d.daysInStage}. Notes: ${d.notes}. Next activity: ${d.nextActivity}. Rotting: ${d.rotting}.`
		} });
		setAiBusy(false);
		setAi(res.ok ? res.text : res.error);
	}
	const lineTotal = d.products.reduce((s, p) => s + p.qty * p.price * (1 - p.discount / 100), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-[calc(100dvh-3.5rem)] min-h-0 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "shrink-0 border-b border-border px-4 py-4 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "mb-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-3.5" }), "Pipeline"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-xl font-semibold tracking-tight text-balance",
							children: d.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: [
								d.orgName ?? "Independent",
								" ",
								d.personName ? `· ${d.personName}` : ""
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-2xl tabular-nums",
						children: formatUsdFull(d.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: d.status === "won" ? "success" : d.status === "lost" ? "danger" : "steel",
							children: d.status
						}),
						d.rotting && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "warn",
							children: [
								"Rotting · ",
								d.daysInStage,
								"d"
							]
						}),
						d.venue && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3" }), d.venue]
						}),
						d.eventDate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3" }), formatDate(d.eventDate)]
						})
					]
				}),
				d.status === "open" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => statusMut.mutate({ status: "won" }),
							children: "Mark won"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "secondary",
							onClick: () => setLoseOpen((v) => !v),
							children: "Mark lost"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							variant: "ghost",
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
							children: "Convert to project"
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
						})
					]
				}),
				loseOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-3 flex flex-wrap items-center gap-2",
					onSubmit: (e) => {
						e.preventDefault();
						statusMut.mutate({
							status: "lost",
							lostReason
						});
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: lostReason,
						onValueChange: setLostReason,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-9 w-52",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Lost reason" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (lostReasons.length ? lostReasons : [{
							id: 0,
							name: "Budget"
						}]).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: r.name,
							children: r.name
						}, r.id || r.name)) })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						type: "submit",
						children: "Confirm lost"
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "overview",
			className: "flex min-h-0 flex-1 flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "shrink-0 border-b border-border px-4 sm:px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "my-2 flex h-auto flex-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "overview",
							children: "Overview"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "products",
							children: "Products"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "activity",
							children: "Activity"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "files",
							children: "Files"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "mail",
							children: "Mail"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "notes",
							children: "Notes"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "history",
							children: "History"
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto w-full max-w-5xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "overview",
							className: "mt-0 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
									className: "grid grid-cols-2 gap-3 text-sm md:grid-cols-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
											label: "Owner",
											value: d.ownerName ?? "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
											label: "Source",
											value: d.source ?? "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
											label: "Expected close",
											value: formatDate(d.expectedClose)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
											label: "Probability",
											value: `${d.probability ?? 0}%`
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
											label: "Guests",
											value: d.guestCount ? String(d.guestCount) : "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
											label: "Load-in",
											value: d.loadIn ?? "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
											label: "Indoor",
											value: d.indoor == null ? "—" : d.indoor ? "Indoor" : "Outdoor"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
											label: "Days in stage",
											value: String(d.daysInStage)
										})
									]
								}),
								d.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: d.notes
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex gap-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "secondary",
										onClick: summarize,
										disabled: aiBusy,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), aiBusy ? "Summarizing…" : "AI summary"]
									})
								}),
								ai && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "rounded-lg bg-muted p-3 text-sm leading-relaxed",
									children: ai
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 md:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Owner" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											defaultValue: String(d.ownerId ?? ""),
											onValueChange: (v) => updateDeal({ data: {
												id: d.id,
												ownerId: Number(v)
											} }).then(onRefresh),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Assign" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: String(m.id),
												children: m.name
											}, m.id)) })]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 md:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Notes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											defaultValue: d.notes ?? "",
											onBlur: (e) => {
												if (e.target.value !== (d.notes ?? "")) updateDeal({ data: {
													id: d.id,
													notes: e.target.value
												} }).then(onRefresh);
											}
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
									children: "Comments"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-3",
									children: d.comments.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemberAvatar, {
											initials: c.authorInitials ?? "?",
											tone: c.authorTone,
											size: "sm"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-muted-foreground",
											children: [
												c.authorName,
												" · ",
												formatDateTime(c.createdAt)
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm",
											children: c.body
										})] })]
									}, c.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: comment,
										onChange: (e) => setComment(e.target.value),
										placeholder: "Comment, use @name to mention",
										onKeyDown: (e) => e.key === "Enter" && void saveComment()
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: saveComment,
										variant: "secondary",
										children: "Post"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "products",
							className: "mt-0 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "text-left text-xs text-muted-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "pb-2 font-medium",
												children: "Item"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "pb-2 font-medium",
												children: "Qty"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "pb-2 text-right font-medium",
												children: "Line"
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: d.products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-t border-border",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "py-2",
												children: [p.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs text-muted-foreground",
													children: p.sku
												})]
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
												className: "py-2 text-right font-mono tabular-nums",
												children: formatUsdFull(p.qty * p.price * (1 - p.discount / 100))
											})
										]
									}, p.id)) })]
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
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "activity",
							className: "mt-0 space-y-3",
							children: [d.activities.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "No activities yet."
							}), d.activities.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-3 rounded-lg bg-muted p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "mt-0.5 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-sm",
										children: [a.subject, a.done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "success",
											className: "ml-2",
											children: "Done"
										})]
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
								})]
							}, a.id))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "files",
							className: "mt-0 space-y-3",
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "mail",
							className: "mt-0 space-y-3",
							children: [d.emails.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg bg-muted p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: e.subject
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											children: formatDateTime(e.sentAt ?? e.createdAt)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: [
											e.fromName,
											" → ",
											e.toAddr,
											e.opened ? " · opened" : "",
											e.clicked ? " · clicked" : ""
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm",
										children: e.body
									})
								]
							}, e.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compose, {
								deal: d,
								memberId,
								onSent: onRefresh
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "notes",
							className: "mt-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventNotesPanel, { dealId: d.id })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "history",
							className: "mt-0 space-y-3",
							children: [
								(d.history ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "No history yet — moves and status changes land here."
								}),
								(d.history ?? []).map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-3 border-b border-border pb-3 last:border-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-sm",
											children: [
												h.actor,
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: h.action
												})
											]
										}), h.detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: h.detail
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: formatDateTime(h.createdAt)
									})]
								}, h.id)),
								d.lostReason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm",
									children: ["Lost reason: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: d.lostReason
									})]
								})
							]
						})
					]
				})
			})]
		})]
	});
}
function EventNotesPanel({ dealId }) {
	const qc = useQueryClient();
	const notes = useQuery({
		queryKey: ["event-notes", dealId],
		queryFn: () => listEventNotes({ data: { dealId } })
	});
	const [body, setBody] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("production");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Pinned, categorized notes live on the event — not a side document."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-2 rounded-lg border border-border p-3",
				onSubmit: (e) => {
					e.preventDefault();
					if (!body.trim()) return;
					addEventNote({ data: {
						dealId,
						body: body.trim(),
						category
					} }).then(() => {
						setBody("");
						toast.success("Note on the event");
						qc.invalidateQueries({ queryKey: ["event-notes", dealId] });
					});
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-9 rounded-md border border-input bg-background px-2 text-sm",
						value: category,
						onChange: (e) => setCategory(e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "production",
								children: "Production"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "client",
								children: "Client"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "labor",
								children: "Labor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "site",
								children: "Site"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "sm",
						children: "Add note"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: body,
					onChange: (e) => setBody(e.target.value),
					placeholder: "Load-in, power, talent, holds…",
					rows: 4
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "space-y-2",
				children: [(notes.data ?? []).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-lg bg-muted p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: n.pinned ? "steel" : "outline",
								children: n.category
							}),
							n.pinned && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "size-3 text-muted-foreground" }),
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
								} }).then(() => qc.invalidateQueries({ queryKey: ["event-notes", dealId] })),
								children: n.pinned ? "Unpin" : "Pin"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 whitespace-pre-wrap text-sm",
						children: n.body
					})]
				}, n.id)), (notes.data ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No event notes yet."
				})]
			})
		]
	});
}
function Info({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-xs text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: value })] });
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
			dealId: deal.id
		} });
		toast.success("Queued to sent (tracked)");
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-3" }), "Open & click tracking on · merge tags filled"]
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
	const { dealId } = Route$11.useParams();
	const id = Number(dealId);
	if (!Number.isFinite(id)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "px-6 py-10 text-sm text-muted-foreground",
		children: "Deal not found."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DealWorkspace, { dealId: id });
}
//#endregion
export { DealPage as component };
