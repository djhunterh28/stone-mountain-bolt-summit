import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { Gn as listSequences, J as PageHeader, at as SelectValue, it as SelectTrigger, lt as Button, nt as SelectContent, rr as toggleSequence, rt as SelectItem, tt as Select, zn as listPeople } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { t as Switch } from "./switch-BLKjtJkd.mjs";
import { a as enrollSequence, p as listEnrollments } from "./ultimate-DAnhRr51.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sequences-B9tmLc0r.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SequencesPage() {
	const list = useQuery({
		queryKey: ["sequences"],
		queryFn: () => listSequences()
	});
	const people = useQuery({
		queryKey: ["people"],
		queryFn: () => listPeople()
	});
	const enrolls = useQuery({
		queryKey: ["enrollments"],
		queryFn: () => listEnrollments()
	});
	const qc = useQueryClient();
	const [seqId, setSeqId] = (0, import_react.useState)("");
	const [personId, setPersonId] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Pulse sequences",
				subtitle: "Multi-step cadences. Ultimate allows 50 sequences per company."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mx-4 mb-6 flex flex-wrap items-end gap-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:mx-6",
				onSubmit: (e) => {
					e.preventDefault();
					if (!seqId || !personId) return;
					enrollSequence({ data: {
						sequenceId: Number(seqId),
						personId: Number(personId)
					} }).then(() => {
						toast.success("Enrolled");
						qc.invalidateQueries({ queryKey: ["sequences"] });
						qc.invalidateQueries({ queryKey: ["enrollments"] });
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: seqId,
						onValueChange: setSeqId,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-56",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Sequence" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (list.data ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: String(s.id),
							children: s.name
						}, s.id)) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: personId,
						onValueChange: setPersonId,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-56",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Person" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (people.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: String(p.id),
							children: p.name
						}, p.id)) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "sm",
						children: "Enroll"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 px-4 sm:px-6 lg:grid-cols-2",
				children: (list.data ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium",
								children: s.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [s.enrolled, " enrolled"]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: s.active,
								onCheckedChange: (v) => toggleSequence({ data: {
									id: s.id,
									active: v
								} }).then(() => qc.invalidateQueries({ queryKey: ["sequences"] }))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "mt-4 space-y-2",
							children: s.steps.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-3 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "outline",
										children: ["Day ", step.day]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: step.channel
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: step.title })
								]
							}, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-1 text-xs text-muted-foreground",
							children: (enrolls.data ?? []).filter((e) => e.sequenceId === s.id).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								e.personName,
								" · step ",
								e.stepIndex + 1,
								" · ",
								e.status
							] }, e.id))
						})
					]
				}, s.id))
			})
		]
	});
}
//#endregion
export { SequencesPage as component };
