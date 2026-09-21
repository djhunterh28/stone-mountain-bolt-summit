import { o as __toESM } from "../_runtime.mjs";
import { a as formatDateTime } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { J as PageHeader, ct as Input, lt as Button } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { a as rotateBoard, i as revokeBoard, r as listBoards, t as createBoard } from "./boards-BIBkAW1b.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/boards-PjYo2aVQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function boardUrl(token) {
	if (typeof window === "undefined") return `/board/${token}`;
	return `${window.location.origin}/board/${token}`;
}
async function copy(text) {
	try {
		await navigator.clipboard.writeText(text);
		toast.success("Kiosk URL copied");
	} catch {
		toast.message(text);
	}
}
function BoardsPage() {
	const qc = useQueryClient();
	const boards = useQuery({
		queryKey: ["display-boards"],
		queryFn: () => listBoards()
	});
	const [name, setName] = (0, import_react.useState)("Shop wall");
	const [location, setLocation] = (0, import_react.useState)("Warehouse floor");
	const [kind, setKind] = (0, import_react.useState)("warehouse");
	const [fresh, setFresh] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Display boards",
			subtitle: "Read-only kiosk screens for the warehouse and the office. Token in the URL — no login."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6 px-4 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "flex flex-wrap items-end gap-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
					onSubmit: (e) => {
						e.preventDefault();
						createBoard({ data: {
							name,
							location,
							kind
						} }).then((b) => {
							setFresh(b);
							toast.success("Board minted");
							qc.invalidateQueries({ queryKey: ["display-boards"] });
						});
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs text-muted-foreground",
							children: ["Name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: name,
								onChange: (e) => setName(e.target.value),
								className: "mt-1 w-44"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs text-muted-foreground",
							children: ["Location", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: location,
								onChange: (e) => setLocation(e.target.value),
								className: "mt-1 w-48"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs text-muted-foreground",
							children: ["Kind", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: kind,
								onChange: (e) => setKind(e.target.value),
								className: "mt-1 h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "warehouse",
									children: "Warehouse — gear & trucks"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "office",
									children: "Office — day at a glance"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "sm",
							children: "Mint kiosk link"
						})
					]
				}),
				fresh && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "New board URL — load this on the wall screen"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 break-all font-mono text-sm",
							children: boardUrl(fresh.token)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: () => copy(boardUrl(fresh.token)),
								children: "Copy URL"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "secondary",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: boardUrl(fresh.token),
									target: "_blank",
									rel: "noreferrer",
									children: "Open board"
								})
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
					children: (boards.data ?? []).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center gap-3 px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium",
										children: b.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										children: b.kind
									}),
									!b.active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "warn",
										children: "revoked"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									b.location,
									" · ",
									b.tokenHint,
									b.lastSeen ? ` · last seen ${formatDateTime(b.lastSeen)}` : " · never opened"
								]
							})]
						}), b.active && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "secondary",
									onClick: () => copy(boardUrl(b.token)),
									children: "Copy URL"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/board/$token",
										params: { token: b.token },
										children: "Preview"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => rotateBoard({ data: { id: b.id } }).then((next) => {
										if (next) {
											setFresh(next);
											toast.success("Token rotated — old screens go dark");
										}
										qc.invalidateQueries({ queryKey: ["display-boards"] });
									}),
									children: "Rotate"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => revokeBoard({ data: { id: b.id } }).then(() => {
										toast.success("Board revoked");
										qc.invalidateQueries({ queryKey: ["display-boards"] });
									}),
									children: "Revoke"
								})
							]
						})]
					}, b.id))
				})
			]
		})]
	});
}
//#endregion
export { BoardsPage as component };
