import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { Cn as exportDealsCsv, J as PageHeader, fr as useUi, lt as Button, ot as Textarea, wn as getBootstrap } from "./router-o_A6MRMh.mjs";
import { d as importDeals } from "./ultimate-DAnhRr51.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/import-BnTYgGCo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function parseCsv(text) {
	const lines = text.trim().split(/\r?\n/).filter(Boolean);
	if (lines.length < 2) return [];
	const header = split(lines[0]).map((h) => h.trim().toLowerCase());
	const idx = (name) => header.findIndex((h) => h === name || h.includes(name));
	const t = idx("title") >= 0 ? idx("title") : 0;
	const v = idx("value") >= 0 ? idx("value") : 1;
	const venue = idx("venue");
	const org = idx("org");
	const source = idx("source");
	return lines.slice(1).map((line) => {
		const cols = split(line);
		return {
			title: cols[t] || "Imported show",
			value: Number(String(cols[v] ?? "0").replace(/[^0-9.]/g, "")) || 0,
			venue: venue >= 0 ? cols[venue] : void 0,
			orgName: org >= 0 ? cols[org] : void 0,
			source: source >= 0 ? cols[source] : "Import"
		};
	});
}
function split(line) {
	const out = [];
	let cur = "";
	let q = false;
	for (const ch of line) if (ch === "\"") q = !q;
	else if (ch === "," && !q) {
		out.push(cur);
		cur = "";
	} else cur += ch;
	out.push(cur);
	return out.map((s) => s.trim());
}
function ImportPage() {
	const boot = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	const { memberId } = useUi();
	const qc = useQueryClient();
	const [text, setText] = (0, import_react.useState)("title,value,venue,org,source\nBrooklyn Navy Yard open studios,48000,Building 92,Brooklyn Navy Yard,Prospector");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const pipe = boot.data?.pipelines[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Import / export",
			subtitle: "CSV in and out. Map title, value, venue, org — same as Pipedrive data import.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "secondary",
				onClick: async () => {
					const res = await exportDealsCsv({ data: { pipelineId: pipe?.id ?? 1 } });
					if (res.error) {
						toast.error(res.error);
						return;
					}
					const blob = new Blob([res.csv], { type: "text/csv" });
					const url = URL.createObjectURL(blob);
					const a = document.createElement("a");
					a.href = url;
					a.download = "northline-deals.csv";
					a.click();
					URL.revokeObjectURL(url);
				},
				children: "Export current book"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-4 max-w-2xl space-y-3 sm:mx-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Header row required. Columns: title, value, venue, org, source. Up to 50 rows per run. New organizations are created when the name is new."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: text,
					onChange: (e) => setText(e.target.value),
					rows: 10,
					className: "font-mono text-sm"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: busy,
					onClick: () => {
						const rows = parseCsv(text);
						if (!rows.length) {
							toast.error("Need a header and at least one row");
							return;
						}
						setBusy(true);
						importDeals({ data: {
							rows,
							ownerId: memberId,
							pipelineId: pipe?.id ?? 1,
							stageId: pipe?.stages[0]?.id ?? 1
						} }).then((r) => {
							setBusy(false);
							toast.success(`Imported ${r.created} deals`);
							qc.invalidateQueries({ queryKey: ["deals"] });
							qc.invalidateQueries({ queryKey: ["orgs"] });
						});
					},
					children: busy ? "Importing…" : "Import into Live Events"
				})
			]
		})]
	});
}
//#endregion
export { ImportPage as component };
