import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { n as cn, t as authMiddleware } from "./utils-DLVA4J7b.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { ct as Label, lt as Input, st as Textarea, ut as Button } from "./router-Bkw81Fhc.mjs";
import { a as inputType, c as visibleStepIndexes, i as fieldVisible } from "./form-logic-B_LD3eqk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/form-fill-Vy630ZUR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
createServerFn({ method: "GET" }).handler(createSsrRpc("1f24c9c7c915f9627053f9b1ed17f334f2e77905972ae9efa5bc36caa2caa45a"));
var getFormBySlug = createServerFn({ method: "GET" }).validator((input) => input).handler(createSsrRpc("38a22361b3d9dc8e5301a2060125570dbb0a1d71384ad6ae128eacc4a5680129"));
var submitForm = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("bfb2bac394c9f53cd80ff0f837e382ab3efe9ac60b28517a578a0cdf738c5ce6"));
var getFormsDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("52a5338b996fc7cc6eb49070551e9ba5b0b1b8e504bd7aa3c33eaf41b416c9c2"));
var createForm = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("ea5a95b754af30a6e2ad0ddfa0f71aa688f9286295de1f860b7726ddf3f9c0e9"));
var saveForm = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("725a28d6aaf612ceca278a7fcc35ce034958a7a62c5d2837bbb28dacb797c38e"));
var archiveForm = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("f36cf2753d3df4dfcf5bc9a64c00344014ff16f6d06b4ea0d6b058e35f062a25"));
var rotateVendorToken = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("ee63be7678ad3ffd52351582befc96272a1b17bcd628d2fbc850525b134105f9"));
var downloadFormUpload = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("afdd5fffcb56b9ad09a8e2ac1317d78bd1a5f581bc40a501359bbbf6642b9989"));
var FILE_CAP = 45e3;
async function readFile(file) {
	const buf = await file.arrayBuffer();
	const bytes = new Uint8Array(buf);
	const truncated = bytes.byteLength > FILE_CAP;
	const slice = truncated ? bytes.slice(0, FILE_CAP) : bytes;
	let s = "";
	for (let i = 0; i < slice.length; i += 32768) s += String.fromCharCode(...slice.subarray(i, i + 32768));
	return {
		filename: file.name,
		mime: file.type || "application/octet-stream",
		sizeBytes: file.size,
		dataB64: btoa(s),
		truncated
	};
}
function FormFill({ name, description, thankYou, fields, steps, wizard, vendorName, submitting, preview, onSubmit }) {
	const [values, setValues] = (0, import_react.useState)({});
	const [files, setFiles] = (0, import_react.useState)({});
	const [step, setStep] = (0, import_react.useState)(0);
	const [done, setDone] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)(null);
	const indexes = (0, import_react.useMemo)(() => wizard ? visibleStepIndexes(steps.length ? steps : [{
		id: "s0",
		title: "Details"
	}], fields, values) : [0], [
		wizard,
		steps,
		fields,
		values
	]);
	const cursor = indexes.includes(step) ? step : indexes[0] ?? 0;
	const last = indexes[indexes.length - 1] ?? 0;
	const isLast = cursor === last || !wizard;
	const visible = fields.filter((f) => (!wizard || (f.step ?? 0) === cursor) && fieldVisible(f, values));
	function setVal(id, v) {
		setValues((prev) => ({
			...prev,
			[id]: v
		}));
	}
	function toggleMulti(id, option) {
		const cur = (values[id] ?? "").split(",").map((s) => s.trim()).filter(Boolean);
		setVal(id, (cur.includes(option) ? cur.filter((x) => x !== option) : [...cur, option]).join(","));
	}
	function validate() {
		for (const f of visible) {
			if (f.type === "heading") continue;
			if (!f.required) continue;
			if (f.type === "file") {
				if (!files[f.id]) return `${f.label} is required`;
				continue;
			}
			if (!(values[f.id] ?? "").trim()) return `${f.label} is required`;
		}
		return null;
	}
	function goNext() {
		const v = validate();
		if (v) {
			setErr(v);
			return;
		}
		setErr(null);
		if (!isLast) {
			const idx = indexes.indexOf(cursor);
			setStep(indexes[idx + 1] ?? last);
			return;
		}
		const payload = { ...values };
		for (const f of Object.values(files)) payload[f.fieldId] = f.filename;
		if (preview) {
			setDone(true);
			return;
		}
		onSubmit?.(payload, Object.values(files));
	}
	if (done) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-semibold tracking-tight",
				children: "Got it."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: thankYou || "Received. The shop will follow up."
			}),
			preview && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				size: "sm",
				variant: "secondary",
				onClick: () => {
					setDone(false);
					setStep(indexes[0] ?? 0);
				},
				children: "Reset preview"
			})
		]
	});
	const stepMeta = wizard ? steps[cursor] : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-4",
		onSubmit: (e) => {
			e.preventDefault();
			goNext();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight",
					children: name
				}),
				vendorName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs font-medium tracking-wide text-steel uppercase",
					children: vendorName
				}),
				description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: description
				})
			] }),
			wizard && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "flex flex-wrap gap-2",
				children: (steps.length ? steps : [{
					id: "s0",
					title: "Details"
				}]).map((s, i) => {
					if (!indexes.includes(i)) return null;
					const on = i === cursor;
					const past = indexes.indexOf(i) < indexes.indexOf(cursor);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: cn("text-xs", on ? "font-medium text-foreground" : "text-muted-foreground"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("mr-1.5 font-mono tabular-nums", past || on ? "text-steel" : ""),
								children: String(indexes.indexOf(i) + 1).padStart(2, "0")
							}),
							" ",
							s.title
						]
					}, s.id);
				})
			}),
			stepMeta?.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: stepMeta.description
			}),
			visible.map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				field,
				value: values[field.id] ?? "",
				file: files[field.id],
				onChange: (v) => setVal(field.id, v),
				onMulti: (o) => toggleMulti(field.id, o),
				onFile: async (file) => {
					if (!file) {
						setFiles((prev) => {
							const next = { ...prev };
							delete next[field.id];
							return next;
						});
						return;
					}
					const read = await readFile(file);
					setFiles((prev) => ({
						...prev,
						[field.id]: {
							...read,
							fieldId: field.id
						}
					}));
					setVal(field.id, file.name);
				}
			}, field.id)),
			err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-destructive",
				children: err
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [wizard && cursor !== indexes[0] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "secondary",
					onClick: () => {
						const idx = indexes.indexOf(cursor);
						setStep(indexes[Math.max(0, idx - 1)] ?? 0);
						setErr(null);
					},
					children: "Back"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: submitting,
					children: submitting ? "Sending…" : isLast ? preview ? "Test submit" : "Submit" : "Continue"
				})]
			})
		]
	});
}
function Field({ field, value, file, onChange, onMulti, onFile }) {
	if (field.type === "heading") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pt-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-sm font-medium",
			children: field.label
		}), field.help && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs text-muted-foreground",
			children: field.help
		})]
	});
	const selected = value.split(",").map((s) => s.trim()).filter(Boolean);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
				htmlFor: field.id,
				className: "text-foreground",
				children: [field.label, field.required ? " *" : ""]
			}),
			field.help && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: field.help
			}),
			field.type === "textarea" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				id: field.id,
				name: field.id,
				value,
				placeholder: field.placeholder,
				onChange: (e) => onChange(e.target.value),
				rows: 4
			}) : field.type === "select" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				id: field.id,
				name: field.id,
				size: 1,
				value,
				onChange: (e) => onChange(e.target.value),
				className: "flex h-10 w-full rounded-md bg-secondary px-3 text-sm shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "Select"
				}), (field.options ?? []).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: o,
					children: o
				}, o))]
			}) : field.type === "radio" || field.type === "yesno" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: (field.type === "yesno" ? ["Yes", "No"] : field.options ?? []).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onChange(o),
					className: cn("h-9 rounded-md px-3 text-sm shadow-[var(--shadow-border)]", value === o ? "bg-primary text-primary-foreground" : "bg-secondary"),
					children: o
				}, o))
			}) : field.type === "multicheck" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-1.5",
				children: (field.options ?? []).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						className: "size-4 accent-current",
						checked: selected.includes(o),
						onChange: () => onMulti(o)
					}), o]
				}, o))
			}) : field.type === "file" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex h-10 cursor-pointer items-center gap-2 rounded-md bg-secondary px-3 text-sm shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: field.id,
					type: "file",
					accept: field.accept,
					className: "sr-only",
					onChange: (e) => onFile(e.target.files?.[0] ?? null)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate text-muted-foreground",
					children: file ? file.filename : "Choose file"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: field.id,
				name: field.id,
				type: inputType(field.type),
				value,
				placeholder: field.placeholder,
				onChange: (e) => onChange(e.target.value)
			})
		]
	});
}
function useEmbedHeight(active) {
	(0, import_react.useEffect)(() => {
		if (!active || typeof window === "undefined") return;
		const send = () => {
			const h = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
			window.parent?.postMessage({
				type: "nl-form-height",
				height: h
			}, "*");
		};
		send();
		const ro = new ResizeObserver(send);
		ro.observe(document.body);
		return () => ro.disconnect();
	}, [active]);
}
//#endregion
export { getFormBySlug as a, saveForm as c, downloadFormUpload as i, submitForm as l, archiveForm as n, getFormsDesk as o, createForm as r, rotateVendorToken as s, FormFill as t, useEmbedHeight as u };
