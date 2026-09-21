import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { G as Route$19, ct as Input, hn as bookSlot, lt as Button, st as Label } from "./router-o_A6MRMh.mjs";
import { u as getSchedulerBySlug } from "./ultimate-DAnhRr51.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/book._slug-ClLhj2_m.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PublicBook() {
	const { slug } = Route$19.useParams();
	const link = useQuery({
		queryKey: ["book", slug],
		queryFn: () => getSchedulerBySlug({ data: { slug } })
	});
	const [done, setDone] = (0, import_react.useState)(null);
	const l = link.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto min-h-dvh max-w-lg px-5 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 24 24",
					className: "size-6 text-primary",
					"aria-hidden": true,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: "4",
							y: "5",
							width: "3.2",
							height: "14",
							rx: "0.6",
							fill: "currentColor"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: "9.4",
							y: "8",
							width: "3.2",
							height: "11",
							rx: "0.6",
							fill: "currentColor",
							opacity: "0.7"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: "14.8",
							y: "3",
							width: "3.2",
							height: "16",
							rx: "0.6",
							fill: "currentColor"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-semibold",
					children: "Northline"
				})]
			}),
			!l && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: link.isLoading ? "Loading…" : "Link not found."
			}),
			l && !done && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-4",
				onSubmit: (e) => {
					e.preventDefault();
					const fd = new FormData(e.currentTarget);
					bookSlot({ data: {
						linkId: l.id,
						guestName: String(fd.get("guestName") || "Guest"),
						guestEmail: String(fd.get("guestEmail") || "guest@example.com"),
						startsAt: new Date(String(fd.get("startsAt"))).toISOString(),
						notes: String(fd.get("notes") || "") || void 0
					} }).then((r) => {
						setDone(r);
						toast.success("Booked");
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase",
						children: l.source === "calendly" ? "Calendly · Northline" : "Northline scheduler"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-semibold tracking-tight",
						children: l.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [
							l.memberName,
							" · ",
							l.durationMin,
							" minutes. A Zoom link and confirmation land in your inbox."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "guestName",
							children: "Your name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "guestName",
							name: "guestName",
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "guestEmail",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "guestEmail",
							name: "guestEmail",
							type: "email",
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "startsAt",
							children: "When"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "startsAt",
							name: "startsAt",
							type: "datetime-local",
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "notes",
							children: "Venue / notes"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "notes",
							name: "notes"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Confirm booking"
					}),
					l.calendlyUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"Prefer Calendly?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								className: "underline-offset-4 hover:underline",
								href: l.calendlyUrl,
								target: "_blank",
								rel: "noreferrer",
								children: [
									"Open ",
									l.memberName,
									"'s Calendly"
								]
							})
						]
					})
				]
			}),
			done && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold",
					children: "You are on the calendar."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: [
						done.confirmationSent ? "A confirmation is in your inbox, including the Zoom join link." : "Your host will send the call details.",
						" ",
						"If load-in is this week, call the Gowanus shop."
					]
				}),
				done.zoomJoinUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-sm",
					children: [
						"Zoom:",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "underline-offset-4 hover:underline",
							href: done.zoomJoinUrl,
							target: "_blank",
							rel: "noreferrer",
							children: "Join meeting"
						}),
						done.zoomPasscode ? ` · passcode ${done.zoomPasscode}` : ""
					]
				})
			] })
		]
	});
}
//#endregion
export { PublicBook as component };
