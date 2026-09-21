import { o as __toESM } from "../_runtime.mjs";
import { a as formatDateTime } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { lt as Copy, vt as Check, x as ShieldCheck } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { J as PageHeader, ct as Input, lt as Button, st as Label } from "./router-o_A6MRMh.mjs";
import { t as Badge } from "./badge-D81dvCVi.mjs";
import { t as Skeleton } from "./skeleton-BVFrMLkw.mjs";
import { t as Switch } from "./switch-BLKjtJkd.mjs";
import { d as testDomainSend, i as checkDomainDns, l as setDefaultIdentity, n as addIdentity, r as addSendingDomain, s as getSendingDesk, t as activateDomain, u as setDomainApply } from "./domain-DTp-hrMr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/domain-BRjBnA9y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function copy(text, label) {
	try {
		await navigator.clipboard.writeText(text);
		toast.success(`Copied ${label}`);
	} catch {
		toast.message(text);
	}
}
function statusVariant(status) {
	if (status === "authenticated" || status === "pass") return "success";
	if (status === "pending" || status === "verifying" || status === "missing") return "warn";
	if (status === "failed" || status === "mismatch") return "danger";
	return "outline";
}
function DomainPage() {
	const desk = useQuery({
		queryKey: ["sending-desk"],
		queryFn: () => getSendingDesk()
	});
	const qc = useQueryClient();
	const [copiedId, setCopiedId] = (0, import_react.useState)(null);
	function refresh() {
		qc.invalidateQueries({ queryKey: ["sending-desk"] });
		qc.invalidateQueries({ queryKey: ["emails"] });
		qc.invalidateQueries({ queryKey: ["active-sender"] });
	}
	const d = desk.data;
	const live = d?.live ?? null;
	const pending = (d?.domains ?? []).filter((x) => !x.active);
	const stats = d?.stats;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Sending domain",
				subtitle: "Client mail leaves as you. SPF, DKIM, and DMARC sit on composed mail and every workflow — not on a platform address."
			}),
			desk.isLoading || !d ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-xl" }, i))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Live domain",
						value: live ? "Live" : "—",
						hint: live?.domain ?? "None authenticated"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "DNS",
						value: live ? `${stats?.recordsPass}/${stats?.recordsTotal}` : "0/0",
						hint: "SPF · DKIM · DMARC · tracking"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Sent 7d",
						value: String(stats?.sent7d ?? 0),
						hint: "Authenticated outbound"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "From",
						value: d.sender.authenticated ? "You" : "Platform",
						hint: d.sender.fromAddr
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 px-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [live ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveCard, {
						domain: live,
						onChange: refresh
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
						className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: "No live sending domain. Authenticate DNS, then activate."
						})
					}), live && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DnsTable, {
						records: live.records,
						copiedId,
						onCopy: async (row) => {
							await copy(row.value, `${row.kind.toUpperCase()} record`);
							setCopiedId(row.id);
							setTimeout(() => setCopiedId((id) => id === row.id ? null : id), 1600);
						}
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [live && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdentityCard, {
						domain: live,
						onChange: refresh
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TestSend, {
						identities: live?.identities ?? [],
						onChange: refresh
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 px-4 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Other domains"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Platform mail stays on file. A pending root can be checked and cut over without touching the live house address."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-3",
						children: pending.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PendingRow, {
							row,
							onChange: refresh
						}, row.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddDomainForm, { onChange: refresh })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 px-4 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Recent authenticated mail"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/mail",
						className: "text-xs text-muted-foreground hover:text-foreground",
						children: "Open mail"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
					children: [(d?.recent ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "px-4 py-3 text-sm text-muted-foreground",
						children: "Nothing has left the domain yet."
					}), (d?.recent ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-start gap-2 px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-sm",
									children: m.subject
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "truncate text-xs text-muted-foreground",
									children: [
										m.fromName,
										" · ",
										m.fromAddr,
										" → ",
										m.toAddr
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: m.authenticated ? "success" : "outline",
								children: m.authenticated ? "aligned" : m.folder
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: m.sentAt ? formatDateTime(m.sentAt) : m.folder
							})
						]
					}, m.id))]
				})]
			})
		]
	});
}
function LiveCard({ domain, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: "Live sending domain"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 font-mono text-lg",
						children: domain.domain
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: [domain.displayName, domain.verifiedAt ? ` · authenticated ${formatDateTime(domain.verifiedAt)}` : ""]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					variant: "success",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mr-1 size-3" }), "Authenticated"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthChip, {
						ok: domain.spf,
						label: "SPF"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthChip, {
						ok: domain.dkim,
						label: "DKIM"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthChip, {
						ok: domain.dmarc,
						label: "DMARC"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApplySwitch, {
					id: "apply-compose",
					label: "Composed mail",
					hint: "One-to-one, inbox reply, deal follow-up",
					checked: domain.applyCompose,
					onCheckedChange: (v) => setDomainApply({ data: {
						id: domain.id,
						applyCompose: v
					} }).then(() => {
						toast.success(v ? "Compose uses this domain" : "Compose falls back to the mailbox");
						onChange();
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApplySwitch, {
					id: "apply-workflow",
					label: "Automated mail",
					hint: "Sequences, automations, broadcasts, confirms",
					checked: domain.applyWorkflow,
					onCheckedChange: (v) => setDomainApply({ data: {
						id: domain.id,
						applyWorkflow: v
					} }).then(() => {
						toast.success(v ? "Workflows use this domain" : "Workflows paused on this domain");
						onChange();
					})
				})]
			})
		]
	});
}
function AuthChip({ ok, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
		variant: ok ? "success" : "warn",
		children: [
			ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-1 size-3" }) : null,
			label,
			" ",
			ok ? "pass" : "fail"
		]
	});
}
function ApplySwitch({ id, label, hint, checked, onCheckedChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		htmlFor: id,
		className: "flex cursor-pointer items-start gap-3 rounded-lg bg-secondary px-3 py-2.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
			id,
			checked,
			onCheckedChange,
			className: "mt-0.5"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block text-sm",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block text-xs text-muted-foreground",
			children: hint
		})] })]
	});
}
function DnsTable({ records, copiedId, onCopy }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-b border-border px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium",
				children: "DNS records"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Publish these at your registrar. We check SPF, DKIM, DMARC, tracking, and bounce."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y divide-border",
			children: records.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex flex-wrap items-start gap-2 px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-16 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs",
							children: r.type
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: r.host
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "break-all font-mono text-xs",
							children: r.value
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-muted-foreground",
							children: r.purpose
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: statusVariant(r.status),
						children: r.status
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: () => onCopy(r),
						"aria-label": `Copy ${r.kind}`,
						children: copiedId === r.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" })
					})
				]
			}, r.id))
		})]
	});
}
function IdentityCard({ domain, onChange }) {
	const [local, setLocal] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [purpose, setPurpose] = (0, import_react.useState)("compose");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium",
				children: "From addresses"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: "Each AE keeps their own mailbox on the company domain. Workflows send as Shows."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: domain.identities.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdentityRowView, {
					row: i,
					onChange
				}, i.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-3 grid gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					addIdentity({ data: {
						domainId: domain.id,
						localPart: local,
						displayName: name,
						purpose
					} }).then((r) => {
						if (!r.ok) toast.error(r.error ?? "Could not add");
						else {
							toast.success(`${local}@${domain.domain} is live`);
							setLocal("");
							setName("");
							onChange();
						}
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "ident-local",
						children: "New address"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "ident-local",
							value: local,
							onChange: (e) => setLocal(e.target.value),
							placeholder: "ops",
							className: "w-28"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "self-center text-xs text-muted-foreground",
							children: ["@", domain.domain]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "Display name"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-10 rounded-md bg-secondary px-3 text-sm shadow-[var(--shadow-border)]",
						value: purpose,
						onChange: (e) => setPurpose(e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "compose",
								children: "Compose"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "workflow",
								children: "Workflow"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "house",
								children: "House"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "sm",
						disabled: !local.trim(),
						children: "Add address"
					})
				]
			})
		]
	});
}
function IdentityRowView({ row, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex flex-wrap items-center gap-2 rounded-lg bg-secondary px-3 py-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "truncate text-sm",
					children: row.displayName
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate font-mono text-xs text-muted-foreground",
					children: row.address
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "outline",
				children: row.purpose
			}),
			row.isDefault ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "steel",
				children: "default"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "ghost",
				onClick: () => setDefaultIdentity({ data: { id: row.id } }).then(() => {
					toast.success(`Default ${row.purpose} is now ${row.address}`);
					onChange();
				}),
				children: "Make default"
			})
		]
	});
}
function TestSend({ identities, onChange }) {
	const compose = identities.find((i) => i.purpose === "compose" && i.isDefault) ?? identities[0];
	const workflow = identities.find((i) => i.purpose === "workflow");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium",
				children: "Test send"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: "Drops a tracked message into Sent so you can see the aligned From before a client does."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					onClick: () => testDomainSend({ data: {
						identityId: compose?.id,
						purpose: "compose"
					} }).then((r) => {
						toast.success(`Sent to ${r.to} from ${r.sender.fromAddr}`);
						onChange();
					}),
					disabled: !compose,
					children: "Send as compose"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "secondary",
					onClick: () => testDomainSend({ data: {
						identityId: workflow?.id,
						purpose: "workflow"
					} }).then((r) => {
						toast.success(`Workflow mail from ${r.sender.fromAddr}`);
						onChange();
					}),
					disabled: !workflow,
					children: "Send as workflow"
				})]
			})
		]
	});
}
function PendingRow({ row, onChange }) {
	const platform = row.domain.includes("mail.northline");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-mono text-sm",
					children: row.domain
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [row.displayName, platform ? " · retired platform sender" : ""]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: statusVariant(row.status),
					children: row.status
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthChip, {
						ok: row.spf,
						label: "SPF"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthChip, {
						ok: row.dkim,
						label: "DKIM"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthChip, {
						ok: row.dmarc,
						label: "DMARC"
					})
				]
			}),
			!platform && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [row.status !== "authenticated" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "secondary",
					onClick: () => checkDomainDns({ data: { id: row.id } }).then((r) => {
						if (!r.ok) toast.error(r.error ?? "Check failed");
						else toast.success("SPF, DKIM, and DMARC all pass. Activate to send.");
						onChange();
					}),
					children: "Check DNS"
				}), row.status === "authenticated" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					onClick: () => activateDomain({ data: { id: row.id } }).then((r) => {
						if (!r.ok) toast.error(r.error ?? "Could not activate");
						else toast.success(`Client mail now leaves ${row.domain}`);
						onChange();
					}),
					children: "Activate"
				})]
			})
		]
	});
}
function AddDomainForm({ onChange }) {
	const [domain, setDomain] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "mt-4 flex flex-wrap items-end gap-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
		onSubmit: (e) => {
			e.preventDefault();
			addSendingDomain({ data: { domain } }).then((r) => {
				if (!r.ok) toast.error(r.error ?? "Could not add");
				else {
					toast.success("Domain added — publish the DNS records, then Check DNS");
					setDomain("");
					onChange();
				}
			});
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-48 flex-1 space-y-1.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "new-domain",
				children: "Add a domain"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "new-domain",
				value: domain,
				onChange: (e) => setDomain(e.target.value),
				placeholder: "events.hurricaneproductionsllc.com"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "submit",
			size: "sm",
			disabled: !domain.trim(),
			children: "Generate records"
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
				className: "mt-2 truncate font-mono text-2xl tabular-nums",
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
export { DomainPage as component };
