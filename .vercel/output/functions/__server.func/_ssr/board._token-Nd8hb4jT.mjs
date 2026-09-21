import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { K as Route$20 } from "./router-o_A6MRMh.mjs";
import { n as getBoardPublic } from "./boards-BIBkAW1b.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/board._token-Nd8hb4jT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LANES = [
	{
		id: "going_out",
		label: "Going out",
		hint: "Shop pull · trucks · pickups"
	},
	{
		id: "on_site",
		label: "On site",
		hint: "Load-in passed · live"
	},
	{
		id: "returning",
		label: "Returning",
		hint: "Strike · inbound"
	}
];
function useClock() {
	const [now, setNow] = (0, import_react.useState)(() => /* @__PURE__ */ new Date());
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
		return () => window.clearInterval(id);
	}, []);
	const tz = "America/New_York";
	return {
		time: now.toLocaleTimeString("en-GB", {
			timeZone: tz,
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false
		}),
		date: now.toLocaleDateString("en-US", {
			timeZone: tz,
			weekday: "short",
			month: "short",
			day: "numeric",
			year: "numeric"
		}).toUpperCase()
	};
}
function KioskBoard() {
	const { token } = Route$20.useParams();
	const { time, date } = useClock();
	const q = useQuery({
		queryKey: ["board", token],
		queryFn: () => getBoardPublic({ data: { token } }),
		refetchInterval: 2e4,
		retry: 1
	});
	(0, import_react.useEffect)(() => {
		document.documentElement.classList.add("nl-kiosk-root");
		let lock;
		navigator.wakeLock?.request("screen").then((s) => {
			lock = s;
		}).catch(() => void 0);
		return () => {
			document.documentElement.classList.remove("nl-kiosk-root");
			lock?.release();
		};
	}, []);
	const view = q.data;
	const jobs = view?.jobs ?? [];
	const grouped = (0, import_react.useMemo)(() => {
		const map = {
			going_out: [],
			on_site: [],
			returning: []
		};
		for (const job of jobs) map[job.lane].push(job);
		return map;
	}, [jobs]);
	const nextPull = (0, import_react.useMemo)(() => {
		return jobs.filter((j) => j.lane === "going_out" || j.lane === "on_site" && j.dayLabel === "today").slice().sort((a, b) => (a.loadIn ?? "99").localeCompare(b.loadIn ?? "99"))[0] ?? null;
	}, [jobs]);
	const kind = view?.board.kind ?? "warehouse";
	if (q.isLoading && !view) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "nl-kiosk grid min-h-dvh place-items-center px-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-sm tracking-[0.18em] text-muted-foreground uppercase",
			children: "Opening the board"
		})
	});
	if (q.isFetched && !view) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "nl-kiosk grid min-h-dvh place-items-center px-8 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase",
				children: "Northline board"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 text-3xl font-semibold tracking-tight",
				children: "This board is offline"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Token not recognized. Ask operations for a new kiosk link."
			})
		] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "nl-kiosk flex min-h-dvh cursor-none flex-col select-none",
		onDoubleClick: () => {
			if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
			else document.exitFullscreen?.();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex shrink-0 items-end justify-between gap-6 px-[4vw] pt-[3vh] pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						viewBox: "0 0 24 24",
						className: "size-9 text-primary",
						"aria-hidden": true,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								x: "4",
								y: "5",
								width: "3.2",
								height: "14",
								rx: "0.6",
								fill: "currentColor",
								opacity: "0.95"
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
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase",
							children: "Northline · display"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-semibold tracking-tight sm:text-3xl",
							children: view?.board.name ?? "Board"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: view?.board.location
						})
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-5xl font-medium tabular-nums tracking-tight sm:text-6xl md:text-7xl",
						children: time
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-mono text-sm tracking-[0.16em] text-muted-foreground",
						children: date
					})]
				})]
			}),
			kind === "office" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfficeStrip, { jobs }),
			kind === "warehouse" && nextPull && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 px-[4vw]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-baseline gap-4 rounded-2xl bg-card px-5 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase",
							children: "Next pull"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-3xl tabular-nums",
							children: nextPull.loadIn ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg font-medium",
							children: nextPull.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								nextPull.venue,
								nextPull.trucks ? `${Math.round(nextPull.trucks)} truck` : null,
								nextPull.crew ? `${Math.round(nextPull.crew)} crew` : null
							].filter(Boolean).join(" · ")
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "grid min-h-0 flex-1 grid-cols-1 gap-4 px-[4vw] pb-4 lg:grid-cols-3",
				children: LANES.map((lane) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "flex min-h-0 flex-col rounded-2xl bg-card px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-baseline justify-between gap-3 border-b border-border pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-semibold tracking-tight",
							children: lane.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] tracking-[0.12em] text-muted-foreground uppercase",
							children: lane.hint
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-2xl tabular-nums text-primary",
							children: grouped[lane.id].length
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "flex-1 space-y-3 overflow-y-auto scrollbar-thin",
						children: [grouped[lane.id].length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "py-10 text-center text-sm text-muted-foreground",
							children: "Quiet."
						}), grouped[lane.id].map((job) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobRow, {
							job,
							kind
						}, job.id))]
					})]
				}, lane.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "flex shrink-0 items-center justify-between px-[4vw] pb-[2.4vh] font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Read-only · no account" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [jobs.length, " jobs in the window"] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Refreshes every 20s · double-tap fullscreen" })
				]
			})
		]
	});
}
function JobRow({ job, kind }) {
	const meta = [];
	if (job.venue) meta.push(job.venue);
	if (job.orgName && job.orgName !== job.venue) meta.push(job.orgName);
	if (kind === "warehouse") {
		if (job.trucks) meta.push(job.trucks === 1 ? "1 truck" : `${Math.round(job.trucks)} trucks`);
		if (job.crew) meta.push(`${Math.round(job.crew)} crew`);
		if (job.indoor === false) meta.push("outdoor");
	} else {
		if (job.ownerName) meta.push(job.ownerName);
		if (job.stageName) meta.push(job.stageName);
		if (job.guestCount) meta.push(`${job.guestCount} pax`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
		className: "rounded-xl bg-muted px-4 py-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-16 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-mono text-2xl font-medium tabular-nums",
					children: job.loadIn ?? "—"
				}), job.dayLabel !== "today" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 font-mono text-[10px] tracking-[0.14em] text-warn uppercase",
					children: job.dayLabel
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "truncate text-lg font-medium leading-tight",
						children: job.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 truncate text-sm text-muted-foreground",
						children: meta.join(" · ") || "No venue"
					}),
					kind === "warehouse" && job.gear.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 truncate font-mono text-[11px] tracking-wide text-primary",
						children: job.gear.join("  ·  ")
					}),
					kind === "warehouse" && job.crewNames.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 truncate text-xs text-muted-foreground",
						children: job.crewNames.join(" · ")
					}),
					kind === "office" && job.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 line-clamp-1 text-sm text-muted-foreground",
						children: job.notes
					})
				]
			})]
		})
	});
}
function OfficeStrip({ jobs }) {
	const hours = [
		6,
		7,
		8,
		9,
		10,
		11,
		12,
		13,
		14,
		15,
		16,
		17,
		18
	];
	const nowH = Number(new Intl.DateTimeFormat("en-GB", {
		timeZone: "America/New_York",
		hour: "2-digit",
		hour12: false
	}).format(/* @__PURE__ */ new Date()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-3 px-[4vw]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-[repeat(13,minmax(0,1fr))] gap-1",
			children: hours.map((h) => {
				const count = jobs.filter((j) => {
					if (!j.loadIn) return false;
					return Number(j.loadIn.split(":")[0]) === h && j.dayLabel === "today";
				}).length;
				const current = h === nowH;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("rounded-md px-1 py-2 text-center", current ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-[11px] tabular-nums",
						children: String(h).padStart(2, "0")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("mt-1 font-mono text-sm tabular-nums", count && !current && "text-foreground"),
						children: count || "·"
					})]
				}, h);
			})
		})
	});
}
//#endregion
export { KioskBoard as component };
