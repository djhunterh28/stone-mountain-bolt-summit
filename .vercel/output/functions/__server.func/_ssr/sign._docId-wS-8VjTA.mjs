import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { Qt as signEnvelope, a as Route$6, ct as Input, lt as Button, mn as advanceDocument, st as Label, wt as getEnvelopePublic } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { s as getDocumentPublic } from "./ultimate-DAnhRr51.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sign._docId-wS-8VjTA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PublicSign() {
	const { docId } = Route$6.useParams();
	const { envelope } = Route$6.useSearch();
	const id = Number(docId);
	const envId = envelope ? Number(envelope) : id;
	const doc = useQuery({
		queryKey: ["pubdoc", id],
		queryFn: () => getDocumentPublic({ data: { id } })
	});
	const env = useQuery({
		queryKey: ["pubenv", envId],
		queryFn: () => getEnvelopePublic({ data: { id: envId } }),
		enabled: Number.isFinite(envId)
	});
	const [step, setStep] = (0, import_react.useState)("review");
	const [name, setName] = (0, import_react.useState)("");
	const [draw, setDraw] = (0, import_react.useState)("");
	const [code, setCode] = (0, import_react.useState)("");
	const d = doc.data;
	const e = env.data;
	const title = e?.name ?? d?.name ?? "Document";
	async function finish() {
		if (e) {
			const rec = e.recipients.find((r) => r.status !== "signed") ?? e.recipients[0];
			if (!rec) return;
			const r = await signEnvelope({ data: {
				id: e.id,
				recipientId: rec.id,
				signature: draw || name,
				accessCode: code || void 0
			} });
			if (!r.ok) {
				toast.error(r.error);
				return;
			}
		} else if (d) await advanceDocument({ data: {
			id: d.id,
			action: "sign"
		} });
		setStep("done");
		toast.success("Signed. Countersignature may still be required.");
	}
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
					children: "Northline · E-sign"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: step === "done" ? "success" : "outline",
					children: step === "done" ? "signed" : e?.status ?? d?.status
				})]
			}),
			e && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: [
					e.mode,
					" · ",
					e.authMethod,
					" · watermark ",
					e.watermark,
					" · sha ",
					e.originalSha.slice(0, 10)
				]
			}),
			step === "review" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative overflow-hidden rounded-xl bg-card p-5 text-sm leading-relaxed shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pointer-events-none absolute inset-0 grid place-items-center text-3xl font-semibold tracking-[0.25em] text-foreground/10 uppercase",
							style: { transform: "rotate(-16deg)" },
							children: e?.watermark ?? "CONFIDENTIAL"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "relative",
							children: e?.content ?? d?.content ?? "Production agreement terms."
						})]
					}),
					e?.authMethod === "access_code" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Access code" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: code,
							onChange: (ev) => setCode(ev.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => setStep("consent"),
						children: "Continue"
					})
				]
			}),
			step === "consent" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted-foreground",
					children: "By continuing you consent to use electronic records and signatures under the ESIGN Act, receive consumer disclosures electronically, and agree this envelope is tamper-evident via SHA-256."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => setStep("fields"),
						children: "I consent"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => setStep("review"),
						children: "Back"
					})]
				})]
			}),
			step === "fields" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-3",
				children: [(e?.fields ?? [{
					id: 0,
					kind: "name"
				}]).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "capitalize",
						children: f.kind
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: f.kind,
						onChange: (ev) => f.kind === "name" && setName(ev.target.value)
					})]
				}, f.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => setStep("sign"),
					children: "Continue to signature"
				})]
			}),
			step === "sign" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 space-y-3",
				onSubmit: (ev) => {
					ev.preventDefault();
					finish();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Type your name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: name,
							onChange: (ev) => setName(ev.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Or draw initials" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: draw,
							onChange: (ev) => setDraw(ev.target.value),
							placeholder: "Draw / type a mark"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "After you sign, authorized Hurricane staff must countersign before completion."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: name.trim().length < 2,
						children: "Sign and confirm"
					})
				]
			}),
			step === "done" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm text-muted-foreground",
				children: "Executed. An audit certificate with original and signed hashes is on file. Lookup with Document ID + password on the esign host."
			})
		]
	});
}
//#endregion
export { PublicSign as component };
