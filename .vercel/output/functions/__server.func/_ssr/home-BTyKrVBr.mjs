import { a as formatDateTime, i as formatDate, o as formatUsd, r as formatBytes } from "./utils-BjcRTCQS.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { G as LayoutGrid, N as PenLine, ft as ClipboardCheck, nt as FolderOpen, vt as Check } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { D as getHealth, Et as getPortalMe, J as PageHeader, O as getOpsHome, St as getDashboard, lt as Button, mt as completeOnboardingStep } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/home-BTyKrVBr.js
var import_jsx_runtime = require_jsx_runtime();
var STEPS = [
	{
		id: "profile",
		label: "Complete profile",
		to: "/profile"
	},
	{
		id: "team",
		label: "Invite a teammate",
		to: "/profile"
	},
	{
		id: "project",
		label: "Open your first project",
		to: "/projects"
	},
	{
		id: "docs",
		label: "Review a document",
		to: "/documents"
	},
	{
		id: "prefs",
		label: "Set notification preferences",
		to: "/profile"
	}
];
function HomePage() {
	const dash = useQuery({
		queryKey: ["dashboard"],
		queryFn: () => getDashboard()
	});
	const me = useQuery({
		queryKey: ["portal-me"],
		queryFn: () => getPortalMe()
	});
	const ops = useQuery({
		queryKey: ["ops-home"],
		queryFn: () => getOpsHome()
	});
	const health = useQuery({
		queryKey: ["health"],
		queryFn: () => getHealth()
	});
	const qc = useQueryClient();
	const d = dash.data;
	const onboard = me.data?.onboarding;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: d ? `Good morning, ${d.profile.name.split(" ")[0]}` : "Home",
				subtitle: d ? `${d.workspace} · ${d.profile.role}` : "Loading the house…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 px-4 sm:grid-cols-2 sm:px-6 xl:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						to: "/projects",
						label: "Projects",
						value: d?.projects ?? "—",
						icon: LayoutGrid
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						to: "/files",
						label: "Files",
						value: d?.files ?? "—",
						icon: FolderOpen
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						to: "/tasks",
						label: "Tasks",
						value: d ? `${d.tasksDone}/${d.tasks}` : "—",
						icon: Check
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						to: "/approvals",
						label: "Approvals",
						value: d?.approvals ?? "—",
						icon: ClipboardCheck
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						to: "/esign",
						label: "Signatures",
						value: d?.signatures ?? "—",
						icon: PenLine
					})
				]
			}),
			onboard && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-4 mt-6 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:mx-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Onboarding"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Five steps to a working client desk."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 divide-y divide-border",
						children: STEPS.map((s) => {
							const done = Boolean(onboard[s.id]);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between gap-3 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: done ? "text-sm text-muted-foreground line-through" : "text-sm",
									children: s.label
								}), done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "success",
									children: "done"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "secondary",
									onClick: () => completeOnboardingStep({ data: { step: s.id } }).then(() => {
										qc.invalidateQueries({ queryKey: ["portal-me"] });
									}),
									children: "Mark done"
								})]
							}, s.id);
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap gap-2 px-4 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							children: "New deal"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						variant: "secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/quotes",
							children: "Quote wizard"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						variant: "secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/ai",
							children: "AI draft"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						variant: "secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/finance",
							children: "Invoice"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						variant: "ghost",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/guests",
							children: "Guests"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 px-4 sm:px-6 lg:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: "Upcoming events"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-2",
							children: (ops.data?.upcoming ?? []).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex justify-between gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/deals/$dealId",
									params: { dealId: String(e.id) },
									className: "truncate",
									children: e.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: formatDate(e.eventDate)
								})]
							}, e.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: "Activity feed"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-2",
							children: (ops.data?.feed ?? []).map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: a.done ? "text-muted-foreground line-through" : "",
									children: a.subject
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-xs text-muted-foreground",
									children: a.owner
								})]
							}, i))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: "Health flags"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-2 space-y-2",
							children: [(health.data?.flags ?? []).slice(0, 5).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/deals/$dealId",
									params: { dealId: String(f.id) },
									className: "hover:underline",
									children: f.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-xs text-muted-foreground",
									children: f.issues[0]
								})]
							}, f.id)), (health.data?.flags ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-sm text-muted-foreground",
								children: "Booked shows are clean."
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: "Pipeline"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-2",
							children: (ops.data?.pipeline ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground",
									children: [
										s.count,
										" · ",
										formatUsd(s.value)
									]
								})]
							}, s.name))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 px-4 sm:px-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: "Storage"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [d ? `${Math.round(d.usedMb)} MB of ${d.quotaGb} GB` : "—", " · Google Drive connected"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 h-1.5 overflow-hidden rounded-full bg-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-primary",
								style: { width: `${Math.min(100, (d?.usedMb ?? 0) / ((d?.quotaGb ?? 1) * 1e3) * 100)}%` }
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Recent files"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-2 space-y-2",
						children: [(d?.recent ?? []).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: f.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: formatDateTime(f.at)
							})]
						}, f.name)), (d?.recent ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "No files yet."
						})]
					})]
				})]
			}),
			d && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 px-4 text-xs text-muted-foreground sm:px-6",
				children: [formatBytes(d.fileBytes), " across the tenant · concierge is the spark in the header."]
			})
		]
	});
}
function Stat({ to, label, value, icon: Icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs tracking-wide uppercase",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 font-mono text-2xl tabular-nums",
			children: value
		})]
	});
}
//#endregion
export { HomePage as component };
