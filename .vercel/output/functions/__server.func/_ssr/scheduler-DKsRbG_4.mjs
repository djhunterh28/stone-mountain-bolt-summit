import { o as __toESM } from "../_runtime.mjs";
import { a as formatDateTime } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { f as listCalendarAccounts } from "./governance-Bb-_vds7.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as TabsList, J as PageHeader, Q as TabsContent, Un as listScheduler, Z as Tabs, ct as Input, et as TabsTrigger, fr as useUi, hn as bookSlot, lt as Button, wn as getBootstrap } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { a as resendConfirmation, c as toggleConnection, i as getSchedulingDesk, n as connectScheduler, o as syncCalendly, r as createZoomMeeting, s as syncScheduler } from "./schedule-DBuILO8w.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scheduler-DKsRbG_4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SchedulerPage() {
	const data = useQuery({
		queryKey: ["scheduler"],
		queryFn: () => listScheduler()
	});
	const desk = useQuery({
		queryKey: ["scheduling-desk"],
		queryFn: () => getSchedulingDesk()
	});
	const cals = useQuery({
		queryKey: ["calendar-accounts"],
		queryFn: () => listCalendarAccounts()
	});
	const boot = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	const qc = useQueryClient();
	const memberId = useUi((s) => s.memberId);
	const [linkId, setLinkId] = (0, import_react.useState)(null);
	function refresh() {
		qc.invalidateQueries({ queryKey: ["scheduler"] });
		qc.invalidateQueries({ queryKey: ["scheduling-desk"] });
		qc.invalidateQueries({ queryKey: ["activities"] });
		qc.invalidateQueries({ queryKey: ["emails"] });
		qc.invalidateQueries({ queryKey: ["notifications"] });
	}
	const bookings = desk.data?.bookings ?? [];
	const connections = desk.data?.connections ?? [];
	const types = desk.data?.types ?? [];
	const members = boot.data?.members ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Scheduler",
			subtitle: "Calendly, Zoom, and confirmation mail on the same consults that land in the pipeline."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-4 sm:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "bookings",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "flex h-auto flex-wrap",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "bookings",
								children: "Upcoming"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "links",
								children: "Booking links"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "connections",
								children: "Connections"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "bookings",
						className: "mt-4 space-y-4",
						children: [linkId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookForm, {
							linkId,
							onCancel: () => setLinkId(null),
							onSaved: () => {
								setLinkId(null);
								refresh();
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
							children: [bookings.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "px-4 py-6 text-sm text-muted-foreground",
								children: "No consults on the books."
							}), bookings.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex flex-wrap items-center gap-3 px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-sm font-medium",
													children: b.guestName
												}),
												b.source === "calendly" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "steel",
													children: "Calendly"
												}),
												b.confirmationSentAt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "success",
													children: "emailed"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: [
												b.linkName,
												" · ",
												b.hostName,
												" · ",
												formatDateTime(b.startsAt),
												" · ",
												b.durationMin,
												" min"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: b.guestEmail
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2",
									children: [b.zoomJoinUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "secondary",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: b.zoomJoinUrl,
											target: "_blank",
											rel: "noreferrer",
											children: "Zoom"
										})
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										onClick: () => createZoomMeeting({ data: { id: b.id } }).then((r) => {
											if (r.ok) toast.success("Zoom meeting created");
											refresh();
										}),
										children: "Create Zoom"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										onClick: () => resendConfirmation({ data: { id: b.id } }).then((r) => {
											toast.success(r.confirmationSent ? "Confirmation resent" : "Logged");
											refresh();
										}),
										children: "Resend"
									})]
								})]
							}, b.id))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "links",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: (data.data?.links ?? []).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "text-sm font-medium",
											children: l.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											children: l.source === "calendly" ? "Calendly" : l.source === "tidycal" ? "TidyCal" : l.source === "acuity" ? "Acuity" : "Northline"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: [
											l.memberName,
											" · ",
											l.durationMin,
											" min · ",
											l.bookings,
											" bookings · Zoom"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex flex-wrap gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "secondary",
												onClick: () => setLinkId(l.id),
												children: "Book a slot"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												asChild: true,
												size: "sm",
												variant: "ghost",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
													to: "/book/$slug",
													params: { slug: l.slug },
													children: "Public link"
												})
											}),
											l.calendlyUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "ghost",
												asChild: true,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
													href: l.calendlyUrl,
													target: "_blank",
													rel: "noreferrer",
													children: ["Open ", l.source === "tidycal" ? "TidyCal" : l.source === "acuity" ? "Acuity" : "Calendly"]
												})
											})
										]
									})
								]
							}, l.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "connections",
						className: "mt-4 space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Each AE connects Calendly, TidyCal, Acuity, or Zoom. Bookings inherit the host's Zoom room and send confirmation mail from their address."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConnectForm, {
								members,
								defaultMemberId: memberId,
								onSaved: refresh
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
								children: connections.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex flex-wrap items-center gap-3 px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-sm font-medium",
													children: c.memberName
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: c.provider === "calendly" ? "steel" : "outline",
													children: c.provider
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: c.connected ? "success" : "warn",
													children: c.connected ? "live" : "off"
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: [
												c.handle,
												" ",
												c.tokenHint ? `· ${c.tokenHint}` : "",
												" · last sync ",
												c.lastSync ? formatDateTime(c.lastSync) : "never"
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap gap-2",
										children: [
											c.provider !== "zoom" && c.connected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "secondary",
												onClick: () => (c.provider === "calendly" ? syncCalendly({ data: { memberId: c.memberId } }) : syncScheduler({ data: {
													memberId: c.memberId,
													provider: c.provider
												} })).then((r) => {
													if (!r.ok) toast.error(r.error);
													else toast.success(r.pulled ? `Pulled ${r.pulled} booking` : "Event types in sync");
													refresh();
												}),
												children: "Sync"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "ghost",
												onClick: () => toggleConnection({ data: {
													id: c.id,
													autoZoom: !c.autoZoom
												} }).then(refresh),
												children: c.autoZoom ? "Zoom on" : "Zoom off"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "ghost",
												onClick: () => toggleConnection({ data: {
													id: c.id,
													confirmEmail: !c.confirmEmail
												} }).then(refresh),
												children: c.confirmEmail ? "Email on" : "Email off"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "ghost",
												onClick: () => toggleConnection({ data: {
													id: c.id,
													connected: !c.connected
												} }).then(refresh),
												children: c.connected ? "Disconnect" : "Reconnect"
											})
										]
									})]
								}, c.id))
							}),
							types.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase",
								children: "Booking event types"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
								children: types.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center justify-between px-4 py-2.5 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [t.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "ml-2 text-xs text-muted-foreground",
										children: [t.durationMin, " min"]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										className: "text-xs text-muted-foreground underline-offset-4 hover:underline",
										href: t.calendlyUrl,
										target: "_blank",
										rel: "noreferrer",
										children: t.calendlyUrl.replace("https://", "")
									})]
								}, t.id))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase",
								children: "Synced calendars"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
								children: (cals.data ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center justify-between px-4 py-2.5 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [a.memberName, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "ml-2 text-xs text-muted-foreground",
										children: [
											a.provider,
											" · ",
											a.address
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: a.synced ? "success" : "outline",
										children: a.twoWay ? "two-way" : "pull"
									})]
								}, a.id))
							})] })
						]
					})
				]
			})
		})]
	});
}
function BookForm({ linkId, onCancel, onSaved }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:max-w-md",
		onSubmit: (e) => {
			e.preventDefault();
			const fd = new FormData(e.currentTarget);
			bookSlot({ data: {
				linkId,
				guestName: String(fd.get("guestName") || "Guest"),
				guestEmail: String(fd.get("guestEmail") || "guest@example.com"),
				startsAt: new Date(String(fd.get("startsAt"))).toISOString(),
				notes: String(fd.get("notes") || "") || void 0
			} }).then((r) => {
				toast.success(r.zoomJoinUrl ? "Booked · Zoom + confirmation sent" : "Booked · confirmation sent");
				onSaved();
			});
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-medium",
				children: "New booking"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				name: "guestName",
				placeholder: "Guest name",
				required: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				name: "guestEmail",
				type: "email",
				placeholder: "Email",
				required: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				name: "startsAt",
				type: "datetime-local",
				required: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				name: "notes",
				placeholder: "Notes"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Confirm"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					onClick: onCancel,
					children: "Cancel"
				})]
			})
		]
	});
}
function ConnectForm({ members, defaultMemberId, onSaved }) {
	const [provider, setProvider] = (0, import_react.useState)("calendly");
	const placeholder = provider === "zoom" ? "you@northline.av" : provider === "tidycal" ? "tidycal.com/you" : provider === "acuity" ? "you.acuityscheduling.com" : "calendly.com/you";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid gap-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:grid-cols-4",
		onSubmit: (e) => {
			e.preventDefault();
			const fd = new FormData(e.currentTarget);
			connectScheduler({ data: {
				memberId: Number(fd.get("memberId") || defaultMemberId),
				provider,
				handle: String(fd.get("handle") || "")
			} }).then((r) => {
				if (!r.ok) toast.error(r.error);
				else toast.success(`${provider} connected`);
				onSaved();
			});
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
				name: "memberId",
				className: "h-9 rounded-md border border-input bg-background px-2 text-sm",
				defaultValue: defaultMemberId,
				children: members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: m.id,
					children: m.name
				}, m.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: "h-9 rounded-md border border-input bg-background px-2 text-sm",
				value: provider,
				onChange: (e) => setProvider(e.target.value),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "calendly",
						children: "Calendly"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "tidycal",
						children: "TidyCal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "acuity",
						children: "Acuity"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "zoom",
						children: "Zoom"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				name: "handle",
				placeholder,
				required: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				size: "sm",
				children: "Connect"
			})
		]
	});
}
//#endregion
export { SchedulerPage as component };
