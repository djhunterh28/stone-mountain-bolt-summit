import { o as __toESM } from "../_runtime.mjs";
import { a as formatDateTime, t as cn } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CZC9dlvp.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { J as PageHeader, ct as Input, lt as Button, ot as Textarea, st as Label } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { t as Skeleton } from "./skeleton-BVFrMLkw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cold-eFNwKkgN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function parsePaste(raw) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const line of raw.split(/\r?\n/)) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		if (/^name\s*[,;\t]/i.test(trimmed) || /^email\s*[,;\t]/i.test(trimmed)) continue;
		const angle = trimmed.match(/^(.*?)[<\s]+([^\s<>]+@[^\s<>]+)>\s*(?:[,;\t]\s*(.*))?$/);
		let name = "";
		let email = "";
		let company;
		if (angle) {
			name = angle[1].replace(/^["']|["']$/g, "").trim();
			email = angle[2].trim().toLowerCase();
			company = angle[3]?.replace(/^["']|["']$/g, "").trim() || void 0;
		} else {
			const parts = trimmed.split(/[,;\t]/).map((s) => s.replace(/^["']|["']$/g, "").trim()).filter(Boolean);
			const emailPart = parts.find((p) => p.includes("@"));
			if (!emailPart) continue;
			email = emailPart.toLowerCase();
			name = parts.find((p) => p !== emailPart && !p.includes("@")) ?? "";
			company = parts.find((p) => p !== emailPart && p !== name && !p.includes("@")) || void 0;
		}
		if (!email.includes("@")) continue;
		if (seen.has(email)) continue;
		seen.add(email);
		if (!name) name = email.split("@")[0] ?? email;
		out.push({
			name,
			email,
			company
		});
	}
	return out;
}
var getColdDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("ccfc7061f2a2fffae133291c06403d1741cdc0c6019592ec9e5828b43e14ff93"));
var createColdList = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("928fc6c269a7673856f6584235f91d5943c819318f37971f2ba2b22f25a0218f"));
var bulkImportCold = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("a97fc7ffe4b8a9d893454d786b7186d054f5ef3d0ac197b10a80bb366f7124b8"));
var recordColdReply = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("4d7823fb6008e9ddfa6e21df4afedbc1352b9ab07a43c73e326b7ea72b048771"));
var campaignCold = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("66b5258ab5d1c2037a2ca8d0d5848290f978fe9dd5305817b98c4ad2f36e1f98"));
function ColdPage() {
	const desk = useQuery({
		queryKey: ["cold-desk"],
		queryFn: () => getColdDesk()
	});
	const qc = useQueryClient();
	const [picked, setPicked] = (0, import_react.useState)([1, 3]);
	const [tag, setTag] = (0, import_react.useState)("expo");
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [listFilter, setListFilter] = (0, import_react.useState)("all");
	function refresh() {
		qc.invalidateQueries({ queryKey: ["cold-desk"] });
		qc.invalidateQueries({ queryKey: ["leads"] });
		qc.invalidateQueries({ queryKey: ["lifecycle"] });
		qc.invalidateQueries({ queryKey: ["emails"] });
	}
	const d = desk.data;
	const lists = d?.lists ?? [];
	const prospects = d?.prospects ?? [];
	const audience = (0, import_react.useMemo)(() => uniqueAudience(prospects, lists, picked, tag), [
		prospects,
		lists,
		picked,
		tag
	]);
	const visible = prospects.filter((p) => {
		if (filter === "cold" && p.promoted) return false;
		if (filter === "lead" && !p.promoted) return false;
		if (listFilter !== "all" && p.listId !== listFilter) return false;
		return true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Cold lists",
				subtitle: "Badge scans and bought files live here. They are not leads. A reply dates a real lead from the moment they wrote back — never from the import."
			}),
			desk.isLoading || !d ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-xl" }, i))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Lists",
						value: String(d.stats.lists),
						hint: "Expo, bought, manual"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Cold names",
						value: String(d.stats.uniqueCold),
						hint: `${d.stats.records} rows across lists`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Promoted",
						value: String(d.stats.uniquePromoted),
						hint: "Only after a reply"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "In funnel",
						value: String(d.stats.leaked),
						hint: d.stats.leaked === 0 ? "Zero cold rows in pipeline" : "Leak — check isolation"
					})
				]
			}),
			d && d.scanned > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 px-4 text-xs text-muted-foreground sm:px-6",
				children: [
					d.scanned,
					" inbound ",
					d.scanned === 1 ? "reply" : "replies",
					" dated a lead from the moment they wrote, not from the scan."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 px-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium",
								children: "Lists"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Select one or several for a campaign. The same email on two lists still gets one send."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 space-y-2",
								children: lists.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListCard, {
									list: l,
									selected: picked.includes(l.id),
									onToggle: () => setPicked((cur) => cur.includes(l.id) ? cur.filter((id) => id !== l.id) : [...cur, l.id])
								}, l.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewListForm, { onChange: refresh })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BulkImport, {
						lists,
						onChange: refresh
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampaignCard, {
						lists,
						tags: d?.tags ?? [],
						tag,
						onTag: setTag,
						picked,
						audience,
						onChange: refresh
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IsolationNote, {
						promoted: d?.stats.uniquePromoted ?? 0,
						inFunnelLeads: d?.stats.inFunnel ?? 0,
						leaked: d?.stats.leaked ?? 0
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 px-4 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Prospects"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "A separate record. Not a label on a lead."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-1",
						children: [[
							"all",
							"cold",
							"lead"
						].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: filter === k ? "secondary" : "ghost",
							onClick: () => setFilter(k),
							children: k === "all" ? "All" : k === "cold" ? "Still cold" : "Promoted"
						}, k)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-8 rounded-md bg-secondary px-2 text-xs shadow-[var(--shadow-border)]",
							value: listFilter === "all" ? "all" : String(listFilter),
							onChange: (e) => setListFilter(e.target.value === "all" ? "all" : Number(e.target.value)),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "Every list"
							}), lists.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: l.id,
								children: l.name
							}, l.id))]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
					children: [visible.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "px-4 py-3 text-sm text-muted-foreground",
						children: "Nothing in this filter."
					}), visible.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProspectRow, {
						row: p,
						onChange: refresh
					}, p.id))]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 px-4 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "Campaigns"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
					children: [(d?.campaigns ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "px-4 py-3 text-sm text-muted-foreground",
						children: "No cold campaigns yet."
					}), (d?.campaigns ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-start gap-2 px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-sm",
									children: c.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "truncate text-xs text-muted-foreground",
									children: [c.subject, c.tag ? ` · tag ${c.tag}` : ""]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: [
									c.sent,
									" sent · ",
									c.skipped,
									" skipped"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: formatDateTime(c.createdAt)
							})
						]
					}, c.id))]
				})]
			})
		]
	});
}
function uniqueAudience(prospects, lists, picked, tag) {
	const tagged = new Set(lists.filter((l) => tag && l.tags.includes(tag)).map((l) => l.id));
	const ids = /* @__PURE__ */ new Set([...picked, ...tagged]);
	const map = /* @__PURE__ */ new Map();
	let dupes = 0;
	let already = 0;
	for (const p of prospects) {
		if (!ids.has(p.listId)) continue;
		const key = p.email.toLowerCase();
		if (map.has(key)) {
			dupes += 1;
			continue;
		}
		if (p.promoted) {
			already += 1;
			continue;
		}
		map.set(key, p);
	}
	return {
		count: map.size,
		dupes,
		already,
		emails: [...map.values()]
	};
}
function ListCard({ list, selected, onToggle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: onToggle,
		className: cn("w-full rounded-lg px-3 py-2.5 text-left shadow-[var(--shadow-border)]", selected ? "bg-accent" : "bg-secondary"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "truncate text-sm",
					children: list.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						list.source,
						" · ",
						list.n,
						" names · ",
						list.promoted,
						" promoted"
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: selected ? "steel" : "outline",
				children: selected ? "in campaign" : "idle"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 flex flex-wrap gap-1",
			children: list.tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "outline",
				children: t
			}, t))
		})]
	});
}
function NewListForm({ onChange }) {
	const [name, setName] = (0, import_react.useState)("");
	const [tags, setTags] = (0, import_react.useState)("");
	const [source, setSource] = (0, import_react.useState)("expo");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "mt-4 grid gap-2",
		onSubmit: (e) => {
			e.preventDefault();
			createColdList({ data: {
				name,
				tags,
				source
			} }).then((r) => {
				if (!r.ok) toast.error(r.error ?? "Could not create");
				else {
					toast.success("List is cold — not in the funnel");
					setName("");
					onChange();
				}
			});
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "list-name",
				children: "New list"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "list-name",
				value: name,
				onChange: (e) => setName(e.target.value),
				placeholder: "NAB hall B scans"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: tags,
						onChange: (e) => setTags(e.target.value),
						placeholder: "expo,nab",
						className: "w-36"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-10 rounded-md bg-secondary px-2 text-sm shadow-[var(--shadow-border)]",
						value: source,
						onChange: (e) => setSource(e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "expo",
								children: "Expo scan"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "bought",
								children: "Bought file"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "manual",
								children: "Manual"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "sm",
						disabled: !name.trim(),
						children: "Create"
					})
				]
			})
		]
	});
}
function BulkImport({ lists, onChange }) {
	const [listId, setListId] = (0, import_react.useState)("");
	const [newName, setNewName] = (0, import_react.useState)("");
	const [paste, setPaste] = (0, import_react.useState)("");
	const preview = parsePaste(paste);
	const selected = listId || (lists[0] ? String(lists[0].id) : "new");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium",
				children: "Bulk import"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: "Paste CSV, tabs, or a name and email per line. No broker, no Zapier. Dupes on a list are skipped."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-3 space-y-2",
				onSubmit: (e) => {
					e.preventDefault();
					bulkImportCold({ data: {
						listId: selected === "new" ? void 0 : Number(selected),
						newName: newName || void 0,
						paste
					} }).then((r) => {
						if (!r.ok) toast.error(r.error ?? "Nothing imported");
						else {
							toast.success(`Imported ${r.imported} · skipped ${r.skipped}`);
							setPaste("");
							onChange();
						}
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "cold-paste",
						children: "Paste"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "cold-paste",
						rows: 5,
						value: paste,
						onChange: (e) => setPaste(e.target.value),
						placeholder: "name,email,company\nCasey Reed,casey@reed.events,Reed Events"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "h-10 rounded-md bg-secondary px-2 text-sm shadow-[var(--shadow-border)]",
								value: selected,
								onChange: (e) => setListId(e.target.value),
								children: [lists.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: l.id,
									children: l.name
								}, l.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "new",
									children: "New list…"
								})]
							}),
							selected === "new" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: newName,
								onChange: (e) => setNewName(e.target.value),
								placeholder: "List name",
								className: "w-44"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								size: "sm",
								disabled: !preview.length,
								children: ["Import ", preview.length ? preview.length : ""]
							})
						]
					}),
					preview.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [preview.length, " unique emails in the paste"]
					})
				]
			})
		]
	});
}
function CampaignCard({ lists, tags, tag, onTag, picked, audience, onChange }) {
	const [subject, setSubject] = (0, import_react.useState)("Dates in play — Northline");
	const [body, setBody] = (0, import_react.useState)("Hi {{first}} —\n\nIf a date is in play in NYC this year, reply to this thread. We will send the one-pager.\n\n— Northline Shows");
	const tagLists = lists.filter((l) => tag && l.tags.includes(tag)).map((l) => l.name);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium",
				children: "Campaign"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: "Several lists at once. Deduped to one email. Promoted names are skipped — they already left this room."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: tag === "" ? "secondary" : "ghost",
					onClick: () => onTag(""),
					children: "No tag"
				}), tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: tag === t ? "secondary" : "ghost",
					onClick: () => onTag(t),
					children: t
				}, t))]
			}),
			tag && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: [
					"Tag ",
					tag,
					" pulls ",
					tagLists.join(", ") || "no lists"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-3 space-y-2",
				onSubmit: (e) => {
					e.preventDefault();
					campaignCold({ data: {
						subject,
						body,
						listIds: picked,
						tag: tag || void 0
					} }).then((r) => {
						if (!r.ok) toast.error(r.error ?? "Could not send");
						else toast.success(`Sent ${r.sent} · skipped ${r.skipped} (dupes and replies)`);
						onChange();
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: subject,
						onChange: (e) => setSubject(e.target.value),
						placeholder: "Subject"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						rows: 5,
						value: body,
						onChange: (e) => setBody(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							audience.count,
							" unique cold names · ",
							audience.dupes,
							" already on another selected list · ",
							audience.already,
							" already leads"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "sm",
						disabled: !audience.count || !subject.trim(),
						children: "Send campaign"
					})
				]
			})
		]
	});
}
function IsolationNote({ promoted, inFunnelLeads, leaked }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium",
				children: "Kept out of the funnel"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: [
					"Pipeline, lifecycle, win rate, and source conversion never see a cold row. ",
					promoted,
					" ",
					promoted === 1 ? "person" : "people",
					" ",
					"crossed over as ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground",
						children: "Cold reply"
					}),
					" leads",
					inFunnelLeads ? ` (${inFunnelLeads} on the lead board)` : "",
					". ",
					leaked === 0 ? "No cold email sits on an open deal." : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/lifecycle",
						className: "underline underline-offset-2",
						children: "Open lifecycle"
					}),
					" · ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/leads",
						className: "underline underline-offset-2",
						children: "Open leads"
					})
				]
			})
		]
	});
}
function ProspectRow({ row, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex flex-wrap items-center gap-2 px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "truncate text-sm",
				children: row.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "truncate text-xs text-muted-foreground",
				children: [
					row.email,
					" · ",
					row.company ?? "—",
					" · ",
					row.listName
				]
			})]
		}), row.promoted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
			variant: "success",
			children: ["lead", row.repliedAt ? ` · ${formatDateTime(row.repliedAt)}` : ""]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			size: "sm",
			variant: "secondary",
			onClick: () => recordColdReply({ data: { id: row.id } }).then((r) => {
				if (!r.ok) toast.error(r.error ?? "Could not promote");
				else toast.success("Lead dated from this reply");
				onChange();
			}),
			children: "They replied"
		})]
	});
}
function Stat({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs tracking-wide text-muted-foreground uppercase",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 font-mono text-2xl tabular-nums",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 truncate text-xs text-muted-foreground",
				children: hint
			})
		]
	});
}
//#endregion
export { ColdPage as component };
