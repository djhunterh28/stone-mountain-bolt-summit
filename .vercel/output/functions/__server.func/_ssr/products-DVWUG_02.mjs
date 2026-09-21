import { s as formatUsdFull } from "./utils-BjcRTCQS.mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { Bn as listProducts, J as PageHeader, ct as Input, lt as Button, xn as createProduct } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products-DVWUG_02.js
var import_jsx_runtime = require_jsx_runtime();
function ProductsPage() {
	const products = useQuery({
		queryKey: ["products"],
		queryFn: () => listProducts()
	});
	const qc = useQueryClient();
	const cats = [...new Set((products.data ?? []).map((p) => p.category))];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Products",
				subtitle: "LED, audio, lighting, labor, trucking — one-time and recurring dry hire."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mx-4 mb-6 grid gap-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:mx-6 sm:grid-cols-5",
				onSubmit: (e) => {
					e.preventDefault();
					const fd = new FormData(e.currentTarget);
					createProduct({ data: {
						name: String(fd.get("name") || "New item"),
						category: String(fd.get("category") || "Other"),
						unitPrice: Number(fd.get("unitPrice") || 0),
						unit: String(fd.get("unit") || "day"),
						sku: String(fd.get("sku") || "") || void 0
					} }).then(() => {
						toast.success("Added to catalog");
						qc.invalidateQueries({ queryKey: ["products"] });
						qc.invalidateQueries({ queryKey: ["bootstrap"] });
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "name",
						placeholder: "Name"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "sku",
						placeholder: "SKU"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "category",
						placeholder: "Category"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "unitPrice",
						type: "number",
						placeholder: "Rate"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Add"
					})
				]
			}),
			cats.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "px-4 text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-6",
					children: cat
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 divide-y divide-border border-y border-border",
					children: (products.data ?? []).filter((p) => p.category === cat).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 px-4 py-2.5 sm:px-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [
										p.sku,
										" · ",
										p.unit,
										" · ",
										p.billing
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-sm tabular-nums",
								children: formatUsdFull(p.unitPrice)
							}),
							p.billing === "recurring" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "steel",
								children: "recurring"
							})
						]
					}, p.id))
				})]
			}, cat))
		]
	});
}
//#endregion
export { ProductsPage as component };
