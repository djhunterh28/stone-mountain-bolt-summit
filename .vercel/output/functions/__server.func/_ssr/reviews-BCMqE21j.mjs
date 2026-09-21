import { o as __toESM } from "../_runtime.mjs";
import { a as formatDateTime, i as formatDate } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { J as PageHeader, ct as Input, lt as Button, st as Label } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { t as Skeleton } from "./skeleton-BVFrMLkw.mjs";
import { a as getReviewsDesk, c as saveReviewSchedule, o as requestReview, s as runDueReviews } from "./reviews-CPfUIDme.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reviews-BCMqE21j.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function copy(text) {
	navigator.clipboard.writeText(text).then(() => toast.success("Link copied"));
}
function ReviewsPage() {
	const desk = useQuery({
		queryKey: ["reviews-desk"],
		queryFn: () => getReviewsDesk()
	});
	const qc = useQueryClient();
	const d = desk.data;
	const [days, setDays] = (0, import_react.useState)("");
	const [channel, setChannel] = (0, import_react.useState)("");
	function refresh() {
		qc.invalidateQueries({ queryKey: ["reviews-desk"] });
		qc.invalidateQueries({ queryKey: ["directory-profile"] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Reviews",
				subtitle: "Ask after the show on a schedule. Client replies here, then we point them at Google, Yelp, Facebook, WeddingWire, The Knot, or Zola. Directory and WordPress drafts follow."
			}),
			desk.isLoading || !d ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 px-4 sm:grid-cols-5 sm:px-6",
				children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-xl" }, i))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 px-4 sm:grid-cols-5 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Asked",
						value: String(d.stats.asked),
						hint: "Waiting on the client"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Received",
						value: String(d.stats.received),
						hint: "In the house"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Posted out",
						value: String(d.stats.published),
						hint: "Google / Yelp / etc."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Directory",
						value: String(d.stats.directory),
						hint: "Zenvents profile"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "WP drafts",
						value: String(d.stats.wp),
						hint: "Staged, not live"
					})
				]
			}),
			d && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 px-4 lg:grid-cols-2 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: "Schedule"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [
								"Requests fire ",
								d.schedule.daysAfter,
								" days after the event via ",
								d.schedule.channel,
								".",
								" ",
								d.schedule.enabled ? "On." : "Paused."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "mt-3 flex flex-wrap items-end gap-2",
							onSubmit: (e) => {
								e.preventDefault();
								saveReviewSchedule({ data: {
									daysAfter: typeof days === "number" ? days : d.schedule.daysAfter,
									channel: channel || d.schedule.channel,
									enabled: true
								} }).then((r) => {
									toast.success(`Ask ${r.daysAfter} days after via ${r.channel}`);
									refresh();
								});
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "days",
									children: "Days after"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "days",
									type: "number",
									min: 0,
									max: 60,
									className: "w-24",
									defaultValue: d.schedule.daysAfter,
									onChange: (e) => setDays(Number(e.target.value))
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "ch",
									children: "Channel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									id: "ch",
									className: "h-9 rounded-md bg-secondary px-2 text-sm shadow-[var(--shadow-border)]",
									defaultValue: d.schedule.channel,
									onChange: (e) => setChannel(e.target.value),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "email",
											children: "Email"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "sms",
											children: "SMS"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "portal",
											children: "Portal"
										})
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									size: "sm",
									children: "Save schedule"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									size: "sm",
									variant: "secondary",
									onClick: () => runDueReviews().then((r) => {
										toast.success(`${r.sent} of ${r.due} due requests sent`);
										refresh();
									}),
									children: "Run due now"
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Ask a won show"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 divide-y divide-border",
						children: d.won.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-wrap items-center justify-between gap-2 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm",
								children: w.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									w.person,
									" · ",
									formatDate(w.eventDate)
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: () => requestReview({ data: {
									dealId: w.id,
									sendNow: true
								} }).then((r) => {
									if (!r.ok) toast.error(r.error ?? "Blocked");
									else toast.success("Request sent");
									refresh();
								}),
								children: "Send now"
							})]
						}, w.id))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 px-4 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "Requests"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
					children: (d?.reviews ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "space-y-1.5 px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium",
										children: r.author ?? "Client"
									}),
									r.stars > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-muted-foreground",
										children: [r.stars, "★"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: r.deal
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: r.status === "published" ? "success" : r.status === "received" ? "steel" : "outline",
										children: r.status
									}),
									r.platform && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										children: r.platform
									}),
									r.directoryAt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "success",
										children: "directory"
									}),
									r.wpDraft && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										children: "WP draft"
									})
								]
							}),
							r.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: r.body
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [r.source ?? r.channel, r.dueAt ? ` · due ${formatDateTime(r.dueAt)}` : ""] }), r.token && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => copy(`${window.location.origin}/r/${r.token}`),
									children: "Copy link"
								})]
							})
						]
					}, r.id))
				})]
			}),
			d && d.drafts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 px-4 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "WordPress drafts"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
					children: d.drafts.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium",
									children: w.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									children: w.status
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: w.body
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: ["Staged ", formatDateTime(w.stagedAt)]
							})
						]
					}, w.id))
				})]
			}),
			d && d.clicks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 px-4 text-xs text-muted-foreground sm:px-6",
				children: ["Platforms used: ", d.clicks.map((c) => `${c.platform} ×${c.n}`).join(" · ")]
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
//#endregion
export { ReviewsPage as component };
