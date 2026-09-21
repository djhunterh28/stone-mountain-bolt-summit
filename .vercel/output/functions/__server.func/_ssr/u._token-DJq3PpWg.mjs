import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { lt as Button, r as Route$4 } from "./router-o_A6MRMh.mjs";
import { i as getUnsubPage, n as confirmUnsub } from "./broadcast-5aPrn3E_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/u._token-DJq3PpWg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function UnsubPage() {
	const { token } = Route$4.useParams();
	const q = useQuery({
		queryKey: ["unsub", token],
		queryFn: () => getUnsubPage({ data: { token } })
	});
	const [done, setDone] = (0, import_react.useState)(false);
	const data = q.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md px-4 py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-wide text-muted-foreground uppercase",
				children: "Hurricane Productions"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-xl font-semibold",
				children: "Unsubscribe"
			}),
			!data || q.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: "Checking this link…"
			}) : !data.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: "This link is not valid. If you still receive mail, forward it to the shop and we will take you off by hand."
			}) : data.already || done ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm leading-relaxed",
				children: [data.email, " is off the client list. We will not send commercial mail to this address again. Transactional show mail (call sheets, invoices) may still arrive."]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm leading-relaxed",
				children: [
					"Stop commercial mail to ",
					data.email,
					". One click. We keep a physical record of the request."
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-6",
				onClick: () => confirmUnsub({ data: { token } }).then((r) => {
					if (r.ok) setDone(true);
				}),
				children: "Take me off the list"
			})] })
		]
	});
}
//#endregion
export { UnsubPage as component };
