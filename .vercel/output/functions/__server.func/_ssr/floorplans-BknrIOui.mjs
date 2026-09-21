import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as cn } from "./utils-DLVA4J7b.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as saveFloorPlan, X as PageHeader, ut as Button, x as getFloorPlans } from "./router-Bkw81Fhc.mjs";
import { t as Badge } from "./badge-BQYjLRpy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/floorplans-BknrIOui.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KINDS = [
	{
		id: "power",
		label: "Power"
	},
	{
		id: "loadin",
		label: "Load-in"
	},
	{
		id: "egress",
		label: "Egress"
	},
	{
		id: "stage",
		label: "Stage"
	},
	{
		id: "seat",
		label: "Seating"
	},
	{
		id: "hold",
		label: "Restricted"
	}
];
function FloorPage() {
	const plans = useQuery({
		queryKey: ["floors"],
		queryFn: () => getFloorPlans()
	});
	const qc = useQueryClient();
	const plan = plans.data?.[0];
	const [kind, setKind] = (0, import_react.useState)("power");
	const marks = plan?.marks ?? [];
	function addAt(e) {
		if (!plan) return;
		const r = e.currentTarget.getBoundingClientRect();
		const x = Math.round((e.clientX - r.left) / r.width * 100);
		const y = Math.round((e.clientY - r.top) / r.height * 100);
		const next = [...marks, {
			id: `m${Date.now()}`,
			kind,
			x,
			y,
			label: KINDS.find((k) => k.id === kind)?.label ?? kind
		}];
		saveFloorPlan({ data: {
			id: plan.id,
			marks: next
		} }).then(() => {
			toast.success("Mark saved");
			qc.invalidateQueries({ queryKey: ["floors"] });
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Floor plans",
				subtitle: "Store a venue once. Mark power, dock, egress, stage, seating, restricted."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2 px-4 sm:px-6",
				children: KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: kind === k.id ? "secondary" : "ghost",
					onClick: () => setKind(k.id),
					children: k.label
				}, k.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-4 mt-4 sm:mx-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mb-2 text-sm text-muted-foreground",
						children: [
							plan?.name,
							" · click to drop a ",
							kind,
							" mark"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						viewBox: "0 0 100 60",
						className: "w-full max-w-3xl cursor-crosshair rounded-xl bg-card shadow-[var(--shadow-border)]",
						onClick: addAt,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								x: "2",
								y: "2",
								width: "96",
								height: "56",
								fill: "none",
								stroke: "currentColor",
								opacity: "0.2"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								x: "38",
								y: "4",
								width: "24",
								height: "10",
								fill: "currentColor",
								opacity: "0.12"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								x: "50",
								y: "11",
								textAnchor: "middle",
								fontSize: "3",
								fill: "currentColor",
								opacity: "0.5",
								children: "STAGE"
							}),
							marks.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: m.x,
								cy: m.y * .6,
								r: "2.2",
								className: cn(m.kind === "hold" ? "fill-destructive" : "fill-primary")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								x: m.x,
								y: m.y * .6 + 5,
								textAnchor: "middle",
								fontSize: "2.4",
								fill: "currentColor",
								children: m.label
							})] }, m.id))
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 flex flex-wrap gap-2",
						children: marks.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							children: [
								m.kind,
								" · ",
								m.label
							]
						}, m.id))
					})
				]
			})
		]
	});
}
//#endregion
export { FloorPage as component };
