import { o as __toESM } from "../_runtime.mjs";
import { a as formatDateTime, f as saveBase64File, r as formatBytes } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { _t as ChevronDown, f as Trash2, j as Plus, lt as Copy, mt as ChevronUp, ot as ExternalLink } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as TabsList, J as PageHeader, Q as TabsContent, Z as Tabs, ct as Input, et as TabsTrigger, lt as Button, ot as Textarea, st as Label } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { t as Switch } from "./switch-BLKjtJkd.mjs";
import { n as FIELD_TYPES, o as newFieldId, r as conditionLabel, s as slugify, t as CHOICE_TYPES } from "./form-logic-B_LD3eqk.mjs";
import { c as saveForm, i as downloadFormUpload, n as archiveForm, o as getFormsDesk, r as createForm, s as rotateVendorToken, t as FormFill } from "./form-fill-CVvvHBD9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forms-B_fXXa9x.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function origin() {
	if (typeof window === "undefined") return "";
	return window.location.origin;
}
function snippet(slug, vendor) {
	return `<div data-nl-form="${slug}"${vendor ? ` data-nl-vendor="${vendor}"` : ""}></div>\n<script async src="${origin()}/embed.js"><\/script>`;
}
async function copy(text, ok = "Copied") {
	try {
		await navigator.clipboard.writeText(text);
		toast.success(ok);
	} catch {
		toast.message(text);
	}
}
function FormsPage() {
	const desk = useQuery({
		queryKey: ["forms-desk"],
		queryFn: () => getFormsDesk()
	});
	const qc = useQueryClient();
	const forms = desk.data?.forms ?? [];
	const vendors = desk.data?.vendors ?? [];
	const submissions = desk.data?.submissions ?? [];
	const [selectedId, setSelectedId] = (0, import_react.useState)(null);
	const [tab, setTab] = (0, import_react.useState)("library");
	function refresh() {
		qc.invalidateQueries({ queryKey: ["forms-desk"] });
		qc.invalidateQueries({ queryKey: ["forms"] });
	}
	const selected = forms.find((f) => f.id === selectedId) ?? forms[0] ?? null;
	(0, import_react.useEffect)(() => {
		if (selected && selectedId == null) setSelectedId(selected.id);
	}, [selected, selectedId]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Forms",
			subtitle: "Conditional logic, wizard steps, vendor assignment, file uploads — two-line embed for any site.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				onClick: () => createForm({ data: { name: "New inquiry" } }).then((f) => {
					toast.success("Form created");
					setSelectedId(f.id);
					setTab("builder");
					refresh();
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), "New form"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-4 sm:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				value: tab,
				onValueChange: setTab,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "flex h-auto flex-wrap",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "library",
								children: "Library"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "builder",
								children: "Builder"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "inbox",
								children: "Inbox"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "library",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-3 lg:grid-cols-2",
							children: forms.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
												className: "text-sm font-medium",
												children: f.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "font-mono text-xs text-muted-foreground",
												children: ["/", f.slug]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: f.active ? "success" : "outline",
											children: [f.submissions, " in"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-muted-foreground",
										children: f.description || "No description."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex flex-wrap gap-1.5",
										children: [
											f.wizard && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "steel",
												children: "wizard"
											}),
											f.fields.some((x) => x.condition) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "steel",
												children: "logic"
											}),
											f.fields.some((x) => x.type === "file") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "files" }),
											f.vendorLock && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "warn",
												children: "vendor lock"
											}),
											f.vendors.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												children: v.name
											}, v.id))
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 flex flex-wrap gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												onClick: () => {
													setSelectedId(f.id);
													setTab("builder");
												},
												children: "Edit"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "secondary",
												asChild: true,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
													to: "/f/$slug",
													params: { slug: f.slug },
													target: "_blank",
													children: ["Open", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" })]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "ghost",
												onClick: () => copy(snippet(f.slug), "Embed snippet copied"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), "Embed"]
											})
										]
									})
								]
							}, f.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "builder",
						className: "mt-4",
						children: selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Builder, {
							form: selected,
							vendors,
							onSaved: (id) => {
								setSelectedId(id);
								refresh();
							}
						}, selected.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Create a form to open the builder."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "inbox",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox$1, {
							submissions,
							forms
						})
					})
				]
			})
		})]
	});
}
function Builder({ form, vendors, onSaved }) {
	const [name, setName] = (0, import_react.useState)(form.name);
	const [slug, setSlug] = (0, import_react.useState)(form.slug);
	const [description, setDescription] = (0, import_react.useState)(form.description ?? "");
	const [thankYou, setThankYou] = (0, import_react.useState)(form.thankYou ?? "");
	const [notifyEmail, setNotifyEmail] = (0, import_react.useState)(form.notifyEmail ?? "");
	const [allowEmbed, setAllowEmbed] = (0, import_react.useState)(form.allowEmbed);
	const [wizard, setWizard] = (0, import_react.useState)(form.wizard);
	const [vendorLock, setVendorLock] = (0, import_react.useState)(form.vendorLock);
	const [createsLead, setCreatesLead] = (0, import_react.useState)(form.createsLead);
	const [active, setActive] = (0, import_react.useState)(form.active);
	const [fields, setFields] = (0, import_react.useState)(form.fields);
	const [steps, setSteps] = (0, import_react.useState)(form.steps.length ? form.steps : [{
		id: "s0",
		title: "Details"
	}]);
	const [vendorIds, setVendorIds] = (0, import_react.useState)(form.vendors.map((v) => v.id));
	const [picked, setPicked] = (0, import_react.useState)(form.fields[0]?.id ?? null);
	const [pane, setPane] = (0, import_react.useState)("fields");
	const field = fields.find((f) => f.id === picked) ?? null;
	const assigned = form.vendors.filter((v) => vendorIds.includes(v.id));
	function patchField(id, next) {
		setFields((list) => list.map((f) => f.id === id ? {
			...f,
			...next
		} : f));
	}
	function move(id, dir) {
		setFields((list) => {
			const i = list.findIndex((f) => f.id === id);
			const j = i + dir;
			if (i < 0 || j < 0 || j >= list.length) return list;
			const copy = [...list];
			const [row] = copy.splice(i, 1);
			copy.splice(j, 0, row);
			return copy;
		});
	}
	function addField(type) {
		const id = newFieldId();
		const row = {
			id,
			label: FIELD_TYPES.find((t) => t.id === type)?.label ?? "Field",
			type,
			required: type !== "heading" && type !== "file",
			step: wizard ? Math.max(0, steps.length - 1) : 0,
			options: CHOICE_TYPES.has(type) ? ["Option A", "Option B"] : void 0,
			accept: type === "file" ? "application/pdf,image/*" : void 0
		};
		setFields((list) => [...list, row]);
		setPicked(id);
	}
	function persist() {
		saveForm({ data: {
			id: form.id,
			name,
			slug,
			description,
			thankYou,
			notifyEmail,
			allowEmbed,
			wizard,
			vendorLock,
			createsLead,
			active,
			fields,
			steps: wizard ? steps : [],
			vendorIds
		} }).then((r) => {
			if (r.ok) {
				setSlug(r.slug);
				toast.success("Saved");
				onSaved(form.id);
			}
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid items-start gap-4 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1 sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: name,
								onChange: (e) => {
									setName(e.target.value);
									if (slug === form.slug) setSlug(slugify(e.target.value));
								}
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Slug" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: slug,
								onChange: (e) => setSlug(slugify(e.target.value)),
								className: "font-mono"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Notify" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: notifyEmail,
								onChange: (e) => setNotifyEmail(e.target.value),
								placeholder: "sales@northline.av"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1 sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: description,
								onChange: (e) => setDescription(e.target.value),
								rows: 2
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1 sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Thank-you" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: thankYou,
								onChange: (e) => setThankYou(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Active",
							checked: active,
							onChange: setActive
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Wizard steps",
							checked: wizard,
							onChange: setWizard
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Create lead",
							checked: createsLead,
							onChange: setCreatesLead
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Allow embed",
							checked: allowEmbed,
							onChange: setAllowEmbed
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Vendor lock",
							checked: vendorLock,
							onChange: setVendorLock
						})
					]
				}),
				wizard && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: "Steps"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "secondary",
							onClick: () => setSteps((s) => [...s, {
								id: newFieldId(),
								title: `Step ${s.length + 1}`
							}]),
							children: "Add step"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: steps.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-6 font-mono text-xs text-muted-foreground",
									children: String(i + 1).padStart(2, "0")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: s.title,
									onChange: (e) => setSteps((list) => list.map((x) => x.id === s.id ? {
										...x,
										title: e.target.value
									} : x))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Shown if…",
									value: s.description ?? "",
									onChange: (e) => setSteps((list) => list.map((x) => x.id === s.id ? {
										...x,
										description: e.target.value
									} : x))
								}),
								steps.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon-sm",
									variant: "ghost",
									onClick: () => setSteps((list) => list.filter((x) => x.id !== s.id)),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
								})
							]
						}, s.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-3 flex flex-wrap gap-1",
							children: [
								"fields",
								"logic",
								"vendors",
								"embed"
							].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: pane === p ? "default" : "ghost",
								onClick: () => setPane(p),
								children: p === "fields" ? "Fields" : p === "logic" ? "Logic" : p === "vendors" ? "Vendors" : "Embed"
							}, p))
						}),
						pane === "fields" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-1.5",
									children: FIELD_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "secondary",
										onClick: () => addField(t.id),
										children: t.label
									}, t.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "divide-y divide-border",
									children: fields.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center gap-2 py-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												className: `min-w-0 flex-1 text-left text-sm ${picked === f.id ? "font-medium" : "text-muted-foreground"}`,
												onClick: () => setPicked(f.id),
												children: [
													f.label,
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "ml-2 font-mono text-[11px] text-muted-foreground",
														children: f.type
													}),
													f.required ? " · required" : "",
													wizard ? ` · step ${(f.step ?? 0) + 1}` : ""
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "icon-sm",
												variant: "ghost",
												onClick: () => move(f.id, -1),
												disabled: i === 0,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-3.5" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "icon-sm",
												variant: "ghost",
												onClick: () => move(f.id, 1),
												disabled: i === fields.length - 1,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3.5" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "icon-sm",
												variant: "ghost",
												onClick: () => {
													setFields((list) => list.filter((x) => x.id !== f.id));
													if (picked === f.id) setPicked(null);
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
											})
										]
									}, f.id))
								}),
								field && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldInspector, {
									field,
									fields,
									steps,
									wizard,
									onChange: (next) => patchField(field.id, next)
								})
							]
						}),
						pane === "logic" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "space-y-2 text-sm",
							children: [fields.filter((f) => f.condition).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-muted-foreground",
								children: "No conditions yet. Open a field and set “Show when”."
							}), fields.filter((f) => f.condition).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-md bg-muted px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: f.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: [" — ", conditionLabel(f.condition, fields)]
								})]
							}, f.id))]
						}),
						pane === "vendors" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Assigned vendors get a tokenized URL. Vendor lock rejects anyone without that token."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-2",
								children: vendors.map((v) => {
									const on = vendorIds.includes(v.id);
									const token = assigned.find((a) => a.id === v.id)?.token;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex flex-wrap items-center gap-2 rounded-md bg-muted px-3 py-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex min-w-0 flex-1 items-center gap-2 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												className: "size-4 accent-current",
												checked: on,
												onChange: () => setVendorIds((ids) => on ? ids.filter((id) => id !== v.id) : [...ids, v.id])
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "truncate",
												children: [v.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-muted-foreground",
													children: [" · ", v.category]
												})]
											})]
										}), token && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "ghost",
												onClick: () => copy(snippet(slug, token), "Vendor embed copied"),
												children: "Embed"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "ghost",
												onClick: () => copy(`${origin()}/f/${slug}?vendor=${token}`, "Vendor URL copied"),
												children: "Link"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "ghost",
												onClick: () => rotateVendorToken({ data: {
													formId: form.id,
													vendorId: v.id
												} }).then((r) => {
													if (r.ok) {
														toast.success("Token rotated");
														onSaved(form.id);
													}
												}),
												children: "Rotate"
											})
										] })]
									}, v.id);
								})
							})]
						}),
						pane === "embed" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "Drop this on any marketing site. Two lines. Height resizes itself."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
									className: "overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs",
									children: snippet(slug)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										onClick: () => copy(snippet(slug), "Snippet copied"),
										children: "Copy snippet"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "secondary",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/f/$slug",
											params: { slug },
											search: { embed: true },
											children: "Embed preview"
										})
									})]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: persist,
						children: "Save form"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => archiveForm({ data: {
							id: form.id,
							active: !active
						} }).then(() => {
							setActive(!active);
							toast.success(active ? "Archived" : "Restored");
							onSaved(form.id);
						}),
						children: active ? "Archive" : "Restore"
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)] lg:sticky lg:top-16 lg:self-start",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase",
				children: "Live preview"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormFill, {
				name,
				description,
				thankYou,
				fields,
				steps,
				wizard,
				preview: true
			}, `${form.id}-${fields.length}-${wizard}`)]
		})]
	});
}
function Toggle({ label, checked, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex items-center justify-between gap-3 text-sm",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
			checked,
			onCheckedChange: onChange
		})]
	});
}
function FieldInspector({ field, fields, steps, wizard, onChange }) {
	const cond = field.condition ?? {
		fieldId: "",
		op: "eq",
		value: ""
	};
	const others = fields.filter((f) => f.id !== field.id && f.type !== "heading");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3 rounded-md bg-muted p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Label" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: field.label,
							onChange: (e) => onChange({ label: e.target.value })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							size: 1,
							value: field.type,
							onChange: (e) => onChange({
								type: e.target.value,
								options: CHOICE_TYPES.has(e.target.value) ? field.options ?? ["Option A", "Option B"] : field.options
							}),
							className: "flex h-10 w-full rounded-md bg-secondary px-3 text-sm shadow-[var(--shadow-border)]",
							children: FIELD_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: t.id,
								children: t.label
							}, t.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Placeholder" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: field.placeholder ?? "",
							onChange: (e) => onChange({ placeholder: e.target.value })
						})]
					}),
					wizard && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Step" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							size: 1,
							value: String(field.step ?? 0),
							onChange: (e) => onChange({ step: Number(e.target.value) }),
							className: "flex h-10 w-full rounded-md bg-secondary px-3 text-sm shadow-[var(--shadow-border)]",
							children: steps.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: i,
								children: [
									i + 1,
									". ",
									s.title
								]
							}, s.id))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					className: "size-4 accent-current",
					checked: field.required,
					onChange: (e) => onChange({ required: e.target.checked })
				}), "Required"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Help" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: field.help ?? "",
					onChange: (e) => onChange({ help: e.target.value })
				})]
			}),
			CHOICE_TYPES.has(field.type) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Options (one per line)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					rows: 3,
					value: (field.options ?? []).join("\n"),
					onChange: (e) => onChange({ options: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })
				})]
			}),
			field.type === "file" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Accepted types" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: field.accept ?? "",
					onChange: (e) => onChange({ accept: e.target.value }),
					placeholder: "application/pdf,image/*"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1 sm:col-span-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Show when" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							size: 1,
							value: cond.fieldId,
							onChange: (e) => onChange({ condition: e.target.value ? {
								...cond,
								fieldId: e.target.value
							} : null }),
							className: "flex h-10 w-full rounded-md bg-secondary px-3 text-sm shadow-[var(--shadow-border)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Always"
							}), others.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: f.id,
								children: f.label
							}, f.id))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Rule" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							size: 1,
							value: cond.op,
							onChange: (e) => onChange({ condition: {
								...cond,
								op: e.target.value
							} }),
							className: "flex h-10 w-full rounded-md bg-secondary px-3 text-sm shadow-[var(--shadow-border)]",
							disabled: !cond.fieldId,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "eq",
									children: "is"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "neq",
									children: "is not"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "contains",
									children: "contains"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "not_empty",
									children: "is filled"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "empty",
									children: "is empty"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Value" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: cond.value ?? "",
							onChange: (e) => onChange({ condition: {
								...cond,
								value: e.target.value
							} }),
							disabled: !cond.fieldId || cond.op === "not_empty" || cond.op === "empty"
						})]
					})
				]
			})
		]
	});
}
function Inbox$1({ submissions, forms }) {
	const [formId, setFormId] = (0, import_react.useState)("all");
	const [open, setOpen] = (0, import_react.useState)(null);
	const rows = (0, import_react.useMemo)(() => submissions.filter((s) => formId === "all" || String(s.formId) === formId), [submissions, formId]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
			size: 1,
			value: formId,
			onChange: (e) => setFormId(e.target.value),
			className: "flex h-10 max-w-sm rounded-md bg-secondary px-3 text-sm shadow-[var(--shadow-border)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: "all",
				children: "All forms"
			}), forms.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: f.id,
				children: f.name
			}, f.id))]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
			children: [rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "px-4 py-8 text-sm text-muted-foreground",
				children: "No submissions yet."
			}), rows.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "flex w-full flex-wrap items-center gap-2 px-4 py-3 text-left",
				onClick: () => setOpen(open === s.id ? null : s.id),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "min-w-0 flex-1 text-sm font-medium",
						children: s.payload.name || s.payload.company || s.payload.email || "Untitled"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: s.formName
					}),
					s.vendorName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "steel",
						children: s.vendorName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						children: s.source
					}),
					s.files.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [s.files.length, " file"] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: formatDateTime(s.createdAt)
					})
				]
			}), open === s.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 px-4 pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "grid gap-1 text-sm sm:grid-cols-2",
					children: Object.entries(s.payload).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs text-muted-foreground",
						children: k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: v || "—" })] }, k))
				}), s.files.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "secondary",
					onClick: () => downloadFormUpload({ data: { id: f.id } }).then((r) => {
						if (r.ok) saveBase64File(r.filename, r.contentB64, r.mime);
					}),
					children: [
						f.filename,
						" · ",
						formatBytes(f.sizeBytes),
						f.truncated ? " · preview" : ""
					]
				}, f.id))]
			})] }, s.id))]
		})]
	});
}
//#endregion
export { FormsPage as component };
