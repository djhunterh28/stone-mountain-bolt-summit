import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { Gt as mutateBookmark, Pt as listBookmarks, X as PageHeader, lt as Input, ut as Button } from "./router-Bkw81Fhc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bookmarks-BPqe9pTj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BookmarksPage() {
	const qc = useQueryClient();
	const marks = useQuery({
		queryKey: ["bookmarks"],
		queryFn: () => listBookmarks()
	});
	const [label, setLabel] = (0, import_react.useState)("");
	const [href, setHref] = (0, import_react.useState)("/home");
	const refresh = () => qc.invalidateQueries({ queryKey: ["bookmarks"] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Bookmarks",
				subtitle: "Pin shows, files, and signing envelopes."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mb-6 flex flex-wrap gap-2 px-4 sm:px-6",
				onSubmit: (e) => {
					e.preventDefault();
					mutateBookmark({ data: {
						op: "add",
						label,
						href
					} }).then(() => {
						setLabel("");
						refresh();
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: label,
						onChange: (e) => setLabel(e.target.value),
						placeholder: "Label",
						required: true,
						className: "max-w-xs"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: href,
						onChange: (e) => setHref(e.target.value),
						placeholder: "/projects/3",
						className: "max-w-xs"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						variant: "secondary",
						children: "Add"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border border-t border-border",
				children: (marks.data ?? []).map((b, i, arr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-3 px-4 py-3 sm:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: b.href,
							className: "flex-1 text-sm hover:underline",
							children: [b.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2 text-xs text-muted-foreground",
								children: b.href
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							disabled: i === 0,
							onClick: () => {
								const ids = arr.map((x) => x.id);
								[ids[i - 1], ids[i]] = [ids[i], ids[i - 1]];
								mutateBookmark({ data: {
									op: "reorder",
									ids
								} }).then(refresh);
							},
							children: "Up"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => mutateBookmark({ data: {
								op: "del",
								id: b.id
							} }).then(refresh),
							children: "Remove"
						})
					]
				}, b.id))
			})
		]
	});
}
//#endregion
export { BookmarksPage as component };
