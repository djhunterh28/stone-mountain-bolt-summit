import { o as __toESM } from "../_runtime.mjs";
import { i as formatDate } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { Y as HpMark, lt as Button, ot as Textarea, s as Route$8 } from "./router-o_A6MRMh.mjs";
import { i as getReviewPublic, l as submitReview, n as clickReviewPlatform, t as REVIEW_PLATFORMS } from "./reviews-CPfUIDme.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/r._token-Do6TDmX1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PublicReview() {
	const { token } = Route$8.useParams();
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["review-public", token],
		queryFn: () => getReviewPublic({ data: { token } })
	});
	const [stars, setStars] = (0, import_react.useState)(5);
	const [body, setBody] = (0, import_react.useState)("");
	const [err, setErr] = (0, import_react.useState)(null);
	const r = q.data?.review;
	const done = Boolean(r?.submittedAt && r.body);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-dvh bg-[#F5F3EE] text-[#0B1220]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-lg px-6 py-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HpMark, { className: "size-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-semibold tracking-tight",
					children: "Hurricane Productions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] tracking-wide text-black/45 uppercase",
					children: "How was the show"
				})] })]
			}), !q.data?.ok || !r ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-10 text-sm text-black/55",
				children: "This review link is not valid."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-10 text-3xl font-semibold tracking-tight text-balance",
					children: r.deal ?? "Your event"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-black/55",
					children: [r.venue, r.eventDate ? ` · ${formatDate(r.eventDate)}` : ""]
				}),
				!done ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-8 space-y-4",
					onSubmit: (e) => {
						e.preventDefault();
						submitReview({ data: {
							token,
							stars,
							body,
							source: "link"
						} }).then((res) => {
							if (!res.ok) setErr(res.error ?? "Could not save");
							else {
								setErr(null);
								qc.invalidateQueries({ queryKey: ["review-public", token] });
							}
						});
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-1",
							children: [
								1,
								2,
								3,
								4,
								5
							].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-10 w-10 rounded-md text-lg",
								style: {
									background: n <= stars ? "#0D47A1" : "#e6e2d8",
									color: n <= stars ? "#F5F3EE" : "#0B1220"
								},
								onClick: () => setStars(n),
								children: n
							}, n))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: body,
							onChange: (e) => setBody(e.target.value),
							rows: 5,
							placeholder: "What should the next producer know?"
						}),
						err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-red-800",
							children: err
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "bg-[#0D47A1] text-[#F5F3EE] hover:bg-[#0D47A1]/90",
							children: "Submit review"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-medium",
								children: [r.stars, "★"]
							}), " — thank you. It is on our directory and staged as a WordPress draft."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", {
							className: "mt-3 border-l-2 border-[#0D47A1] pl-3 text-sm text-black/70",
							children: r.body
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-8 text-sm font-medium",
							children: "Post it where it counts"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-black/50",
							children: "We record which platform you open. Google, Yelp, Facebook, WeddingWire, The Knot, or Zola."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 grid grid-cols-2 gap-2",
							children: REVIEW_PLATFORMS.map((p) => {
								const used = r.clicks.includes(p.id) || r.platform === p.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: "w-full",
									variant: used ? "secondary" : "default",
									onClick: () => clickReviewPlatform({ data: {
										token,
										platform: p.id
									} }).then((res) => {
										qc.invalidateQueries({ queryKey: ["review-public", token] });
										if (res.href) window.open(res.href, "_blank", "noopener");
									}),
									children: used ? `Posted on ${p.label}` : p.label
								}) }, p.id);
							})
						})
					]
				})
			] })]
		})
	});
}
//#endregion
export { PublicReview as component };
