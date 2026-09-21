import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as Route$5 } from "./router-o_A6MRMh.mjs";
import { o as trackSmtp } from "./smtp-CmmXK4E5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/t._id-4ONezL4L.js
var import_jsx_runtime = require_jsx_runtime();
function TrackPage() {
	const { id } = Route$5.useParams();
	const click = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("c") === "1";
	const q = useQuery({
		queryKey: [
			"smtp-track",
			id,
			click
		],
		queryFn: () => trackSmtp({ data: {
			id: Number(id),
			click
		} })
	});
	const d = q.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md px-4 py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-wide text-muted-foreground uppercase",
				children: "Hurricane Productions"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-xl font-semibold",
				children: d?.clicked ? "Link recorded" : "Receipt opened"
			}),
			!d || q.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: "Recording delivery…"
			}) : !d.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: "This tracking link is not valid."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm leading-relaxed",
				children: [
					d.subject,
					" was marked ",
					d.clicked ? "clicked" : "opened",
					" for ",
					d.toAddr,
					". This is a transactional receipt, not marketing mail."
				]
			})
		]
	});
}
//#endregion
export { TrackPage as component };
