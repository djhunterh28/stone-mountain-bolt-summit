import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CZC9dlvp.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { F as MousePointer2, f as Trash2, j as Plus, lt as Copy } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { J as PageHeader, ct as Input, lt as Button, ot as Textarea, st as Label } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { t as Skeleton } from "./skeleton-BVFrMLkw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/floorplans-C1QQvLgB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CANVAS = {
	w: 100,
	h: 62
};
var KINDS = [
	{
		id: "power",
		label: "Outlet",
		zone: false,
		hint: "House or wall outlet"
	},
	{
		id: "distro",
		label: "Distro",
		zone: false,
		hint: "Company switch / distro"
	},
	{
		id: "loadin",
		label: "Load-in",
		zone: false,
		hint: "Dock, freight, street"
	},
	{
		id: "ingress",
		label: "Ingress",
		zone: false,
		hint: "Public or talent in"
	},
	{
		id: "egress",
		label: "Egress",
		zone: false,
		hint: "Fire stair, house out"
	},
	{
		id: "stage",
		label: "Staging",
		zone: true,
		hint: "Stage, IMAG, LED"
	},
	{
		id: "seat",
		label: "Seating",
		zone: true,
		hint: "Rounds, theatre, village"
	},
	{
		id: "hold",
		label: "Restricted",
		zone: true,
		hint: "Green, FOH, hard hold"
	}
];
var ZONE_SIZE = {
	stage: {
		w: 22,
		h: 10
	},
	seat: {
		w: 28,
		h: 14
	},
	hold: {
		w: 14,
		h: 10
	}
};
var getFloorPlans = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("01e6486d4d0e3e255b0c5739a7fcf88620da32cca4516344cc017871e4d1d387"));
var saveFloorPlan = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("d5be177c71521fe4a0f19553f714ed3036c3b5d884c731faf189f77ddd8579cf"));
var createFloorPlan = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("db1a1e747d9371ed83f4fbe92d8de962ea760ad62049d52f4d7e40ed31c42dc5"));
var duplicateFloorPlan = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("50ab6b071cfd4845b0e5c9d78150061b2b23d137705472192ef8d02e3186a545"));
var archiveFloorPlan = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("e0aa20b72d4118eb379ebd0d3fe4887e3d86124fe4c3b561b97a5243db64b7f4"));
function clamp(n, a, b) {
	return Math.min(b, Math.max(a, n));
}
function svgPoint(svg, clientX, clientY) {
	const pt = svg.createSVGPoint();
	pt.x = clientX;
	pt.y = clientY;
	const ctm = svg.getScreenCTM();
	if (!ctm) return {
		x: 0,
		y: 0
	};
	const p = pt.matrixTransform(ctm.inverse());
	return {
		x: clamp(p.x, 0, CANVAS.w),
		y: clamp(p.y, 0, CANVAS.h)
	};
}
function isZone(kind) {
	return kind === "stage" || kind === "seat" || kind === "hold";
}
function zoneBox(m) {
	const w = m.w ?? 16;
	const h = m.h ?? 10;
	return {
		w,
		h,
		x: m.x - w / 2,
		y: m.y - h / 2
	};
}
function hitMark(m, x, y) {
	if (isZone(m.kind)) {
		const b = zoneBox(m);
		return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
	}
	return Math.hypot(m.x - x, m.y - y) < 3.6;
}
function hitResize(m, x, y) {
	if (!isZone(m.kind)) return false;
	const b = zoneBox(m);
	return Math.hypot(x - (b.x + b.w), y - (b.y + b.h)) < 3.2;
}
function FloorPage() {
	const desk = useQuery({
		queryKey: ["floors"],
		queryFn: () => getFloorPlans()
	});
	const qc = useQueryClient();
	const plans = desk.data ?? [];
	const [planId, setPlanId] = (0, import_react.useState)(null);
	const [tool, setTool] = (0, import_react.useState)("select");
	const [selectedId, setSelectedId] = (0, import_react.useState)(null);
	const [localMarks, setLocalMarks] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [venue, setVenue] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const drag = (0, import_react.useRef)(null);
	const marksRef = (0, import_react.useRef)([]);
	const plan = plans.find((p) => p.id === planId) ?? (planId == null ? plans[0] ?? null : null);
	const marks = localMarks ?? plan?.marks ?? [];
	marksRef.current = marks;
	const selected = marks.find((m) => m.id === selectedId) ?? null;
	const library = plans.filter((p) => p.template);
	const plots = plans.filter((p) => !p.template);
	(0, import_react.useEffect)(() => {
		if (plan && planId == null) setPlanId(plan.id);
	}, [plan, planId]);
	(0, import_react.useEffect)(() => {
		if (!plan) return;
		setLocalMarks(null);
		setSelectedId(null);
		setName(plan.name);
		setVenue(plan.venue ?? "");
		setNotes(plan.notes ?? "");
	}, [plan?.id]);
	(0, import_react.useEffect)(() => {
		function onKey(e) {
			if ((e.key === "Backspace" || e.key === "Delete") && selectedId && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
				e.preventDefault();
				removeMark(selectedId);
			}
			if (e.key === "Escape") {
				setSelectedId(null);
				setTool("select");
			}
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [selectedId, plan?.id]);
	function writeCache(next) {
		qc.setQueryData(["floors"], next);
	}
	function refresh() {
		qc.invalidateQueries({ queryKey: ["floors"] });
	}
	async function persist(next, extra) {
		if (!plan) return;
		setLocalMarks(next);
		if (!(await saveFloorPlan({ data: {
			id: plan.id,
			marks: next,
			name: extra?.name ?? name,
			venue: extra?.venue ?? venue,
			notes: extra?.notes ?? notes
		} })).ok) toast.error("Could not save the plot");
		refresh();
	}
	function place(x, y) {
		if (!plan || tool === "select") return;
		const kind = tool;
		const meta = KINDS.find((k) => k.id === kind);
		const zone = isZone(kind);
		const size = ZONE_SIZE[kind];
		const mark = {
			id: `m${Date.now()}`,
			kind,
			x: Math.round(x * 10) / 10,
			y: Math.round(y * 10) / 10,
			label: meta?.label ?? kind,
			...zone && size ? {
				w: size.w,
				h: size.h
			} : {}
		};
		setSelectedId(mark.id);
		persist([...marksRef.current, mark]);
		toast.success(`${meta?.label ?? kind} dropped`);
	}
	function moveMark(id, x, y) {
		const next = marksRef.current.map((m) => m.id === id ? {
			...m,
			x: Math.round(x * 10) / 10,
			y: Math.round(y * 10) / 10
		} : m);
		setLocalMarks(next);
	}
	function resizeMark(id, x, y) {
		const next = marksRef.current.map((m) => {
			if (m.id !== id || !isZone(m.kind)) return m;
			const b = zoneBox(m);
			const w = clamp(Math.round((x - b.x) * 10) / 10, 8, 80);
			const h = clamp(Math.round((y - b.y) * 10) / 10, 6, 48);
			return {
				...m,
				w,
				h,
				x: Math.round((b.x + w / 2) * 10) / 10,
				y: Math.round((b.y + h / 2) * 10) / 10
			};
		});
		setLocalMarks(next);
	}
	function patchMark(id, patch) {
		persist(marksRef.current.map((m) => m.id === id ? {
			...m,
			...patch
		} : m));
	}
	function removeMark(id) {
		setSelectedId(null);
		persist(marksRef.current.filter((m) => m.id !== id));
	}
	function onPointerDown(e) {
		if (!plan) return;
		const svg = e.currentTarget;
		const p = svgPoint(svg, e.clientX, e.clientY);
		if (selected && hitResize(selected, p.x, p.y)) {
			drag.current = {
				id: selected.id,
				dx: 0,
				dy: 0,
				moved: false,
				mode: "resize"
			};
			svg.setPointerCapture(e.pointerId);
			return;
		}
		const hit = [...marks].reverse().find((m) => hitMark(m, p.x, p.y));
		if (hit) {
			setSelectedId(hit.id);
			drag.current = {
				id: hit.id,
				dx: p.x - hit.x,
				dy: p.y - hit.y,
				moved: false,
				mode: "move"
			};
			svg.setPointerCapture(e.pointerId);
			return;
		}
		drag.current = null;
		setSelectedId(null);
		if (tool !== "select") place(p.x, p.y);
	}
	function onPointerMove(e) {
		if (!drag.current) return;
		const p = svgPoint(e.currentTarget, e.clientX, e.clientY);
		drag.current.moved = true;
		if (drag.current.mode === "resize") resizeMark(drag.current.id, p.x, p.y);
		else moveMark(drag.current.id, p.x - drag.current.dx, p.y - drag.current.dy);
	}
	function onPointerUp() {
		if (drag.current?.moved) persist(marksRef.current);
		drag.current = null;
	}
	async function onDuplicate() {
		if (!plan) return;
		const res = await duplicateFloorPlan({ data: { id: plan.id } });
		if (res.ok && res.plan) {
			writeCache([res.plan, ...plans.filter((p) => p.id !== res.plan.id)]);
			setPlanId(res.plan.id);
			toast.success("Show plot copied from this venue");
			refresh();
		}
	}
	async function onCreate() {
		const made = await createFloorPlan({ data: {
			name: "New venue shell",
			venue: ""
		} });
		writeCache([made, ...plans.filter((p) => p.id !== made.id)]);
		setPlanId(made.id);
		toast.success("Blank shell ready");
		refresh();
	}
	async function onArchive() {
		if (!plan) return;
		await archiveFloorPlan({ data: { id: plan.id } });
		writeCache(plans.filter((p) => p.id !== plan.id));
		toast.success("Venue archived");
		setPlanId(null);
		refresh();
	}
	const counts = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const m of marks) map.set(m.kind, (map.get(m.kind) ?? 0) + 1);
		return map;
	}, [marks]);
	const powerN = (counts.get("power") ?? 0) + (counts.get("distro") ?? 0);
	const zoneN = (counts.get("stage") ?? 0) + (counts.get("seat") ?? 0) + (counts.get("hold") ?? 0);
	const doorN = (counts.get("loadin") ?? 0) + (counts.get("ingress") ?? 0) + (counts.get("egress") ?? 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Floor plans",
				subtitle: "Store a venue once. Plot power, docks, ingress, and holds — then copy the shell onto the next show.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "secondary",
					onClick: () => void onCreate(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), "New venue"]
				}), plan && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: () => void onDuplicate(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), "Plot for a show"]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Library",
						value: String(library.length),
						hint: "Reusable venue shells"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Show plots",
						value: String(plots.length),
						hint: "Copied onto a hold"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Power",
						value: String(powerN),
						hint: "Outlets and distros on this plot"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Zones",
						value: String(zoneN),
						hint: "Staging, seating, restricted"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 px-4 lg:grid-cols-[16rem_minmax(0,1fr)_16rem] sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
						className: "space-y-4",
						children: desk.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 w-full rounded-xl" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 w-full rounded-xl" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 w-full rounded-xl" })
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanGroup, {
							title: "Library",
							items: library,
							activeId: plan?.id,
							onPick: setPlanId
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanGroup, {
							title: "Show plots",
							items: plots,
							activeId: plan?.id,
							onPick: setPlanId,
							empty: "Copy a library shell with Plot for a show."
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex flex-wrap gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: tool === "select" ? "secondary" : "ghost",
								onClick: () => setTool("select"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MousePointer2, { className: "size-3.5" }), "Select"]
							}), KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								className: "shrink-0",
								variant: tool === k.id ? "secondary" : "ghost",
								onClick: () => setTool(k.id),
								title: k.hint,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindDot, { kind: k.id }), k.label]
							}, k.id))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 text-sm text-muted-foreground",
							children: plan ? tool === "select" ? `${plan.name} · drag to move · pull the corner to size a zone` : `${plan.name} · click to drop ${KINDS.find((k) => k.id === tool)?.label.toLowerCase()}` : "Pick a venue"
						}),
						desk.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "aspect-[100/62] w-full rounded-xl" }) : plan ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							viewBox: `0 0 ${CANVAS.w} ${CANVAS.h}`,
							className: cn("aspect-[100/62] w-full touch-none rounded-xl bg-card shadow-[var(--shadow-border)]", tool === "select" ? "cursor-default" : "cursor-crosshair"),
							onPointerDown,
							onPointerMove,
							onPointerUp,
							onPointerCancel: onPointerUp,
							role: "img",
							"aria-label": `${plan.name} floor plan`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VenueShell, { layout: plan.layout }), marks.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarkShape, {
								mark: m,
								selected: m.id === selectedId
							}, m.id))]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl bg-card px-4 py-16 text-center text-sm text-muted-foreground shadow-[var(--shadow-border)]",
							children: "No venues yet. Save a room once and reuse it on the next hold."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-3 flex flex-wrap gap-1.5",
							children: [KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: k.id === "hold" ? "danger" : k.id === "power" || k.id === "egress" ? "warn" : k.id === "distro" || k.id === "stage" ? "steel" : "outline",
								children: [
									k.label,
									" ",
									counts.get(k.id) ?? 0
								]
							}) }, k.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								children: ["Doors ", doorN]
							}) })]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "space-y-4",
						children: [
							plan && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 rounded-xl bg-card p-3 shadow-[var(--shadow-border)]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
										children: "Venue"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "fp-name",
										children: "Name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "fp-name",
										value: name,
										onChange: (e) => setName(e.target.value),
										onBlur: () => void persist(marks, { name })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "fp-venue",
										children: "Building"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "fp-venue",
										value: venue,
										onChange: (e) => setVenue(e.target.value),
										onBlur: () => void persist(marks, { venue })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "fp-notes",
										children: "Crew notes"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										id: "fp-notes",
										value: notes,
										onChange: (e) => setNotes(e.target.value),
										onBlur: () => void persist(marks, { notes }),
										className: "min-h-20"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										className: "w-full",
										onClick: () => void onArchive(),
										children: "Archive venue"
									})
								]
							}),
							selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 rounded-xl bg-card p-3 shadow-[var(--shadow-border)]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
										children: "Mark"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: KINDS.find((k) => k.id === selected.kind)?.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "mk-label",
										children: "Label"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "mk-label",
										defaultValue: selected.label,
										onBlur: (e) => patchMark(selected.id, { label: e.target.value })
									}, selected.id),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "ghost",
										className: "w-full",
										onClick: () => removeMark(selected.id),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), "Remove"]
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Outlets and distros are points. Staging, seating, and restricted are zones — drop them, then drag or pull a corner."
							}),
							marks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
									children: "On this plot"
								}), marks.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setSelectedId(m.id),
									className: cn("flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm", m.id === selectedId ? "bg-card shadow-[var(--shadow-border)]" : "hover:bg-muted/70"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindDot, { kind: m.kind }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "min-w-0 truncate",
										children: m.label
									})]
								}) }, m.id))]
							})
						]
					})
				]
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
function PlanGroup({ title, items, activeId, onPick, empty }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
			children: title
		}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: empty ?? "None yet."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex gap-2 overflow-x-auto lg:block lg:space-y-2 lg:overflow-visible",
			children: items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "min-w-[12rem] lg:min-w-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onPick(p.id),
					className: cn("w-full rounded-xl px-3 py-2.5 text-left shadow-[var(--shadow-border)]", p.id === activeId ? "bg-card" : "bg-muted/60 hover:bg-card"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-sm font-medium",
							children: p.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-xs text-muted-foreground",
							children: p.venue ?? "Unnamed room"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex flex-wrap gap-1",
							children: [p.template ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "steel",
								children: "library"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: "show plot"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: [p.marks.length, " marks"]
							})]
						})
					]
				})
			}, p.id))
		})]
	});
}
function KindDot({ kind }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("inline-block size-2 shrink-0", kind === "distro" || kind === "loadin" ? "rounded-sm" : "rounded-full", kind === "hold" && "bg-destructive", (kind === "power" || kind === "egress") && "bg-warn", (kind === "distro" || kind === "stage") && "bg-primary", (kind === "loadin" || kind === "ingress" || kind === "seat") && "bg-steel") });
}
function VenueShell({ layout }) {
	const shell = layout.shell;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
			id: "nl-grid",
			width: "10",
			height: "10",
			patternUnits: "userSpaceOnUse",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M 10 0 L 0 0 0 10",
				fill: "none",
				className: "stroke-border",
				strokeWidth: "0.18"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
			id: "nl-hold",
			width: "2.4",
			height: "2.4",
			patternUnits: "userSpaceOnUse",
			patternTransform: "rotate(45)",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "0",
				y1: "0",
				x2: "0",
				y2: "2.4",
				className: "stroke-destructive/45",
				strokeWidth: "0.4"
			})
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: "0",
			y: "0",
			width: CANVAS.w,
			height: CANVAS.h,
			className: "fill-muted"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: shell.x,
			y: shell.y,
			width: shell.w,
			height: shell.h,
			className: "fill-card stroke-foreground/25",
			strokeWidth: "0.6"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: shell.x,
			y: shell.y,
			width: shell.w,
			height: shell.h,
			fill: "url(#nl-grid)"
		}),
		layout.rooms.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shape, {
			s: r,
			className: "fill-muted/80 stroke-border"
		}, `r${i}`)),
		layout.stage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shape, {
			s: layout.stage,
			className: "fill-primary/15 stroke-primary/40"
		}),
		layout.docks.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shape, {
			s: d,
			className: "fill-steel/20 stroke-steel"
		}, `d${i}`)),
		layout.doors.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: d.x,
			y: d.y,
			width: d.w,
			height: d.h,
			className: d.kind === "ingress" ? "fill-primary/35" : "fill-warn/35"
		}) }, `door${i}`)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
			x: "4",
			y: "60",
			fontSize: "2.2",
			className: "fill-muted-foreground pointer-events-none",
			children: [
				"Plot · ",
				CANVAS.w,
				" × ",
				CANVAS.h
			]
		})
	] });
}
function Shape({ s, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
		x: s.x,
		y: s.y,
		width: s.w,
		height: s.h,
		className,
		strokeWidth: "0.4"
	});
}
function MarkShape({ mark, selected }) {
	if (isZone(mark.kind)) {
		const b = zoneBox(mark);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: b.x,
				y: b.y,
				width: b.w,
				height: b.h,
				rx: "1.2",
				fill: mark.kind === "hold" ? "url(#nl-hold)" : void 0,
				className: cn(mark.kind === "hold" ? "stroke-destructive" : mark.kind === "seat" ? "fill-steel/20 stroke-steel" : "fill-primary/20 stroke-primary", selected && "stroke-foreground"),
				strokeWidth: selected ? .7 : .4,
				strokeDasharray: mark.kind === "seat" ? "1.2 0.8" : void 0
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: mark.x,
				y: mark.y + 1,
				textAnchor: "middle",
				fontSize: "2.3",
				className: "fill-foreground pointer-events-none",
				children: mark.label
			}),
			selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: b.x + b.w - 1.6,
				y: b.y + b.h - 1.6,
				width: "3.2",
				height: "3.2",
				className: "fill-foreground stroke-background",
				strokeWidth: "0.3"
			})
		] });
	}
	const r = selected ? 2.6 : 2.1;
	const fill = mark.kind === "power" || mark.kind === "egress" ? "fill-warn" : mark.kind === "distro" ? "fill-primary" : "fill-steel";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
		mark.kind === "distro" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: mark.x - r,
			y: mark.y - r,
			width: r * 2,
			height: r * 2,
			className: fill
		}) : mark.kind === "loadin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
			points: `${mark.x},${mark.y - 2.6} ${mark.x + 2.4},${mark.y} ${mark.x},${mark.y + 2.6} ${mark.x - 2.4},${mark.y}`,
			className: fill
		}) : mark.kind === "ingress" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
			points: `${mark.x},${mark.y - 2.5} ${mark.x + 2.2},${mark.y + 2} ${mark.x - 2.2},${mark.y + 2}`,
			className: fill
		}) : mark.kind === "egress" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
			points: `${mark.x - 2.2},${mark.y - 2} ${mark.x + 2.2},${mark.y - 2} ${mark.x},${mark.y + 2.5}`,
			className: fill
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: mark.x,
			cy: mark.y,
			r,
			className: fill
		}),
		selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: mark.x,
			cy: mark.y,
			r: r + 1.4,
			className: "fill-none stroke-foreground",
			strokeWidth: "0.4"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: mark.x,
			y: mark.y + 5.2,
			textAnchor: "middle",
			fontSize: "2.3",
			className: "fill-foreground pointer-events-none",
			children: mark.label
		})
	] });
}
//#endregion
export { FloorPage as component };
