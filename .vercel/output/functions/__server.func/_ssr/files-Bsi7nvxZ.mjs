import { o as __toESM } from "../_runtime.mjs";
import { a as formatDateTime, f as saveBase64File, r as formatBytes } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { J as PageHeader, Lt as listPortalFiles, Zt as sharePortalFile, at as SelectValue, bt as downloadPortalFile, cn as zipPortalFiles, ct as Input, it as SelectTrigger, lt as Button, nt as SelectContent, on as uploadPortalFile, rt as SelectItem, tt as Select } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/files-Bsi7nvxZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FilesPage() {
	const qc = useQueryClient();
	const [q, setQ] = (0, import_react.useState)("");
	const [folder, setFolder] = (0, import_react.useState)("all");
	const [picked, setPicked] = (0, import_react.useState)([]);
	const [progress, setProgress] = (0, import_react.useState)(null);
	const files = useQuery({
		queryKey: [
			"portal-files",
			q,
			folder
		],
		queryFn: () => listPortalFiles({ data: {
			q: q || void 0,
			folder: folder === "all" ? void 0 : folder
		} })
	});
	const list = files.data ?? [];
	const total = (0, import_react.useMemo)(() => list.reduce((s, f) => s + f.sizeBytes, 0), [list]);
	async function onUpload(file) {
		setProgress(8);
		const tick = window.setInterval(() => setProgress((p) => Math.min(92, (p ?? 8) + 11)), 180);
		const buf = await file.arrayBuffer();
		const b64 = btoa(String.fromCharCode(...new Uint8Array(buf).slice(0, 240)));
		const res = await uploadPortalFile({ data: {
			name: file.name,
			sizeBytes: file.size,
			mime: file.type || "application/octet-stream",
			folder: folder === "all" ? "files" : folder,
			contentB64: b64
		} });
		window.clearInterval(tick);
		setProgress(100);
		window.setTimeout(() => setProgress(null), 600);
		if (!res.ok) toast.error("error" in res ? res.error : "Upload failed");
		else toast.success(`Stored on Drive as ${res.sha?.slice(0, 8)}`);
		qc.invalidateQueries({ queryKey: ["portal-files"] });
		qc.invalidateQueries({ queryKey: ["dashboard"] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Files",
				subtitle: "All project files, task attachments, and digital assets. Downloads are proxied — Drive URLs never leave the house.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "secondary",
					disabled: !picked.length,
					onClick: () => zipPortalFiles({ data: { ids: picked } }).then((r) => {
						if (r.ok) saveBase64File(r.filename, r.contentB64);
					}),
					children: ["ZIP ", picked.length || ""]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "inline-flex",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						className: "sr-only",
						onChange: (e) => {
							const f = e.target.files?.[0];
							if (f) onUpload(f);
							e.target.value = "";
						}
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Upload to Drive" })
					})]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2 px-4 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search files",
						className: "h-9 max-w-xs"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: folder,
						onValueChange: setFolder,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-9 w-40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "All folders"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "files",
								children: "Project files"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "billing",
								children: "Billing"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "digital",
								children: "Digital assets"
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "self-center text-xs text-muted-foreground",
						children: [formatBytes(total), " in view"]
					})
				]
			}),
			progress != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-4 mt-3 h-1.5 overflow-hidden rounded-full bg-muted sm:mx-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full bg-primary transition-[width]",
					style: { width: `${progress}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-left text-xs text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-2 sm:px-6" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-2",
								children: "Name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-2",
								children: "Folder"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-2",
								children: "Project"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-2 text-right",
								children: "Size"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2 sm:px-6",
								children: "Added"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: list.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2 sm:px-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: picked.includes(f.id),
									onChange: (e) => setPicked((p) => e.target.checked ? [...p, f.id] : p.filter((id) => id !== f.id))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-2 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "text-left hover:underline",
									onClick: () => downloadPortalFile({ data: { id: f.id } }).then((r) => {
										if (r.ok) saveBase64File(r.filename, r.contentB64, r.mime);
										else toast.error("Download blocked");
									}),
									children: f.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] text-muted-foreground",
									children: [
										"sha ",
										f.sha256?.slice(0, 10),
										" · ",
										f.driveId
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 py-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									children: f.folder
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 py-2 text-muted-foreground",
								children: f.projectName ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 py-2 text-right font-mono tabular-nums",
								children: formatBytes(f.sizeBytes)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-2 text-muted-foreground sm:px-6",
								children: [
									formatDateTime(f.createdAt),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "ml-2 text-xs underline",
										onClick: () => sharePortalFile({ data: {
											id: f.id,
											shared: !f.shared
										} }).then(() => files.refetch()),
										children: f.shared ? "Unshare" : "Share"
									})
								]
							})
						]
					}, f.id)) })]
				})
			})
		]
	});
}
//#endregion
export { FilesPage as component };
