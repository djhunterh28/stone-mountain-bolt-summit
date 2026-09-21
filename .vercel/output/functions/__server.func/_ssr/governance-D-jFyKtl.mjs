import { l as getSql, u as iso } from "./utils-BjcRTCQS.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CZC9dlvp.mjs";
import { t as ULTIMATE_LIMITS } from "./limits-DbP6y05c.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { s as sendClientBroadcast } from "./broadcast-5aPrn3E_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/governance-D-jFyKtl.js
var DEFAULT_POLICY = {
	hoursEnforced: true,
	officeStart: "07:00",
	officeEnd: "22:00",
	timezone: "America/New_York",
	ipEnforced: true,
	ipAllowlist: ["74.64.0.0/16"],
	mfaRequired: true,
	idleMinutes: 15,
	maxFailed: 3,
	adminApproval: true,
	encryptionAtRest: true,
	exportApproval: true
};
var DEFAULT_SESSION = {
	locationLabel: "Gowanus shop",
	ip: "74.64.12.4",
	clockMode: "live",
	locked: false,
	failedAttempts: 0
};
function parseList(v) {
	if (Array.isArray(v)) return v.map(String);
	if (typeof v === "string") try {
		const p = JSON.parse(v);
		return Array.isArray(p) ? p.map(String) : [];
	} catch {
		return [];
	}
	return [];
}
function ipAllowed(ip, list) {
	return list.some((rule) => {
		const trimmed = rule.trim();
		if (!trimmed) return false;
		if (trimmed.includes("/")) {
			const prefix = (trimmed.split("/")[0] ?? "").split(".").slice(0, 2).join(".");
			return prefix.length > 0 && ip.startsWith(`${prefix}.`);
		}
		return ip === trimmed;
	});
}
function nyHour(clockMode) {
	if (clockMode === "offhours") return {
		hour: 2,
		label: "02:30 America/New_York (simulated)"
	};
	const hour = Number(new Intl.DateTimeFormat("en-US", {
		timeZone: "America/New_York",
		hour: "numeric",
		hour12: false
	}).format(/* @__PURE__ */ new Date()));
	const minute = new Intl.DateTimeFormat("en-US", {
		timeZone: "America/New_York",
		minute: "2-digit"
	}).format(/* @__PURE__ */ new Date());
	return {
		hour,
		label: `${String(hour).padStart(2, "0")}:${minute} America/New_York`
	};
}
function toMinutes(hhmm) {
	const [h, m] = hhmm.split(":").map(Number);
	return (h || 0) * 60 + (m || 0);
}
function evaluate(policy, session) {
	const { hour, label } = nyHour(session.clockMode);
	if (session.locked) return {
		allowed: false,
		reason: "Session locked. Confirm MFA to continue.",
		hourLabel: label
	};
	if (policy.ipEnforced && !ipAllowed(session.ip, policy.ipAllowlist)) return {
		allowed: false,
		reason: `IP ${session.ip} is outside the allow list.`,
		hourLabel: label
	};
	if (policy.hoursEnforced) {
		const mins = hour * 60 + (session.clockMode === "offhours" ? 30 : 0);
		const start = toMinutes(policy.officeStart);
		const end = toMinutes(policy.officeEnd);
		if (mins < start || mins > end) return {
			allowed: false,
			reason: `Outside office hours (${policy.officeStart}–${policy.officeEnd} ${policy.timezone}).`,
			hourLabel: label
		};
	}
	return {
		allowed: true,
		reason: null,
		hourLabel: label
	};
}
async function loadPolicy() {
	const sql = await getSql();
	try {
		const p = (await sql`select * from access_policy where id = 1`)[0];
		const s = (await sql`select * from session_context where id = 1`)[0];
		return {
			policy: p ? {
				hoursEnforced: Boolean(p.hours_enforced),
				officeStart: String(p.office_start),
				officeEnd: String(p.office_end),
				timezone: String(p.timezone),
				ipEnforced: Boolean(p.ip_enforced),
				ipAllowlist: parseList(p.ip_allowlist),
				mfaRequired: Boolean(p.mfa_required),
				idleMinutes: Number(p.idle_minutes),
				maxFailed: Number(p.max_failed),
				adminApproval: Boolean(p.admin_approval),
				encryptionAtRest: Boolean(p.encryption_at_rest),
				exportApproval: Boolean(p.export_approval)
			} : DEFAULT_POLICY,
			session: s ? {
				locationLabel: String(s.location_label),
				ip: String(s.ip),
				clockMode: String(s.clock_mode) === "offhours" ? "offhours" : "live",
				locked: Boolean(s.locked),
				failedAttempts: Number(s.failed_attempts ?? 0)
			} : DEFAULT_SESSION
		};
	} catch {
		return {
			policy: DEFAULT_POLICY,
			session: DEFAULT_SESSION
		};
	}
}
async function raiseAlert(severity, title, detail) {
	const sql = await getSql();
	await sql`insert into security_alerts (severity, title, detail, resolved) values (${severity}, ${title}, ${detail}, false)`;
	await sql`insert into notifications (member_id, kind, title, body, href, read)
    values (${1}, ${"mention"}, ${title}, ${detail}, ${"/security"}, false)`;
}
async function guardAction(kind) {
	const { policy, session } = await loadPolicy();
	const ev = evaluate(policy, session);
	if (!ev.allowed) {
		await raiseAlert(kind === "export" ? "medium" : "high", kind === "export" ? "Blocked export" : kind === "mail" ? "Blocked bulk mail" : "Blocked sign-in", ev.reason ?? "Access policy");
		return {
			ok: false,
			reason: ev.reason
		};
	}
	if (kind === "export" && policy.exportApproval) await raiseAlert("low", "CSV export", `Deals CSV left the workspace from ${session.locationLabel} (${session.ip}).`);
	return {
		ok: true,
		reason: null
	};
}
var getAccessState_createServerFn_handler = createServerRpc({
	id: "1126647434684a5525c3c90b77f4afac09efa14ff1c54b42a8fa8818a99ac3cd",
	name: "getAccessState",
	filename: "src/lib/crm/governance.ts"
}, (opts) => getAccessState.__executeServer(opts));
var getAccessState = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAccessState_createServerFn_handler, async () => {
	const { policy, session } = await loadPolicy();
	const ev = evaluate(policy, session);
	return {
		policy,
		session,
		allowed: ev.allowed,
		reason: ev.reason,
		hourLabel: ev.hourLabel
	};
});
var updateAccessPolicy_createServerFn_handler = createServerRpc({
	id: "dfee2e6a778e0b2567114bb8eec7733d95b6712a6a72b8d0e0878935440b6716",
	name: "updateAccessPolicy",
	filename: "src/lib/crm/governance.ts"
}, (opts) => updateAccessPolicy.__executeServer(opts));
var updateAccessPolicy = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(updateAccessPolicy_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const { policy } = await loadPolicy();
	const hoursEnforced = data.hoursEnforced ?? policy.hoursEnforced;
	const officeStart = data.officeStart ?? policy.officeStart;
	const officeEnd = data.officeEnd ?? policy.officeEnd;
	const ipEnforced = data.ipEnforced ?? policy.ipEnforced;
	const ipAllowlist = data.ipAllowlist ? data.ipAllowlist.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean) : policy.ipAllowlist;
	const mfaRequired = data.mfaRequired ?? policy.mfaRequired;
	const idleMinutes = data.idleMinutes ?? policy.idleMinutes;
	const exportApproval = data.exportApproval ?? policy.exportApproval;
	const encryptionAtRest = data.encryptionAtRest ?? policy.encryptionAtRest;
	const adminApproval = data.adminApproval ?? policy.adminApproval;
	await sql`update access_policy set
      hours_enforced = ${hoursEnforced},
      office_start = ${officeStart},
      office_end = ${officeEnd},
      ip_enforced = ${ipEnforced},
      ip_allowlist = ${JSON.stringify(ipAllowlist)}::jsonb,
      mfa_required = ${mfaRequired},
      idle_minutes = ${idleMinutes},
      export_approval = ${exportApproval},
      encryption_at_rest = ${encryptionAtRest},
      admin_approval = ${adminApproval}
      where id = 1`;
	return { ok: true };
});
var setSessionContext_createServerFn_handler = createServerRpc({
	id: "107660959cecf6ce2cfdc97ad712ddd82619514fc764e705d2e382991fa851fa",
	name: "setSessionContext",
	filename: "src/lib/crm/governance.ts"
}, (opts) => setSessionContext.__executeServer(opts));
var setSessionContext = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(setSessionContext_createServerFn_handler, async ({ data }) => {
	await (await getSql())`update session_context set location_label = ${data.locationLabel}, ip = ${data.ip}, clock_mode = ${data.clockMode} where id = 1`;
	const { policy, session } = await loadPolicy();
	const ev = evaluate(policy, {
		...session,
		locationLabel: data.locationLabel,
		ip: data.ip,
		clockMode: data.clockMode
	});
	if (!ev.allowed) await raiseAlert("high", "Suspicious sign-in blocked", `${data.locationLabel} · ${data.ip} · ${ev.reason}`);
	return {
		ok: ev.allowed,
		reason: ev.reason
	};
});
var testSignIn_createServerFn_handler = createServerRpc({
	id: "a0e69447efe3deffbd69bc685a561447b5177e78edc1c81958f94ec200f87808",
	name: "testSignIn",
	filename: "src/lib/crm/governance.ts"
}, (opts) => testSignIn.__executeServer(opts));
var testSignIn = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(testSignIn_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const { policy, session } = await loadPolicy();
	const ev = evaluate(policy, session);
	if (!ev.allowed) {
		const fails = session.failedAttempts + 1;
		await sql`update session_context set failed_attempts = ${fails}, locked = ${fails >= policy.maxFailed} where id = 1`;
		await raiseAlert("high", `Failed sign-in · ${data.memberName}`, ev.reason ?? "Policy denied");
		return {
			ok: false,
			locked: fails >= policy.maxFailed,
			reason: ev.reason,
			attempts: fails
		};
	}
	await sql`update session_context set failed_attempts = 0, locked = false where id = 1`;
	await sql`insert into audit_log (actor, action, entity, detail, ip, device)
      values (${data.memberName}, ${"login"}, ${"session"}, ${session.locationLabel}, ${session.ip}, ${"Chrome · macOS"})`;
	return {
		ok: true,
		locked: false,
		reason: null,
		attempts: 0
	};
});
var unlockSession_createServerFn_handler = createServerRpc({
	id: "a7ddf5a4ff9e9a42f30ccf7a817e17f00ffd3716d107c803f2c0d9a71ccd0bdc",
	name: "unlockSession",
	filename: "src/lib/crm/governance.ts"
}, (opts) => unlockSession.__executeServer(opts));
var unlockSession = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(unlockSession_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	if (data.code.trim() !== "482193") return {
		ok: false,
		error: "Invalid recovery code."
	};
	await sql`update session_context set locked = false, failed_attempts = 0 where id = 1`;
	return {
		ok: true,
		error: null
	};
});
var lockSession_createServerFn_handler = createServerRpc({
	id: "fb4532836f67eafefd7d3b339b271a36aae1778fe87671a78804b0c0ade573b7",
	name: "lockSession",
	filename: "src/lib/crm/governance.ts"
}, (opts) => lockSession.__executeServer(opts));
var lockSession = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(lockSession_createServerFn_handler, async () => {
	await (await getSql())`update session_context set locked = true where id = 1`;
	return { ok: true };
});
async function usageNow() {
	const sql = await getSql();
	const empty = {
		reports: 0,
		fields: 0,
		automations: 0,
		teamInboxes: 0,
		enrichmentRemaining: ULTIMATE_LIMITS.enrichmentCredits,
		enrichmentUsed: 0
	};
	try {
		const reports = Number((await sql`select count(*) as c from custom_reports`)[0]?.c ?? 0);
		const fields = Number((await sql`select count(*) as c from custom_fields`)[0]?.c ?? 0);
		const automations = Number((await sql`select count(*) as c from automations`)[0]?.c ?? 0);
		const teamInboxes = Number((await sql`select count(*) as c from email_accounts where kind = 'shared'`)[0]?.c ?? 0);
		const credits = (await sql`select * from enrichment_credits where id = 1`)[0];
		return {
			reports,
			fields,
			automations,
			teamInboxes,
			enrichmentRemaining: credits ? Number(credits.remaining) : ULTIMATE_LIMITS.enrichmentCredits,
			enrichmentUsed: credits ? Number(credits.used) : 0
		};
	} catch {
		return empty;
	}
}
var getUsage_createServerFn_handler = createServerRpc({
	id: "f0ede3ccff518cf0688e1fa604f556f3c334854b3dfb506411a857e254518129",
	name: "getUsage",
	filename: "src/lib/crm/governance.ts"
}, (opts) => getUsage.__executeServer(opts));
var getUsage = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getUsage_createServerFn_handler, async () => usageNow());
async function assertCap(kind) {
	const n = (await usageNow())[kind];
	const cap = kind === "teamInboxes" ? ULTIMATE_LIMITS.teamInboxes : ULTIMATE_LIMITS[kind];
	if (n >= cap) return `Ultimate cap reached (${cap} ${kind}).`;
	return null;
}
var listCalendarAccounts_createServerFn_handler = createServerRpc({
	id: "399003620615d5554ce324c6942b9d3fc67f195aacbfb1b3695db01b9fe40427",
	name: "listCalendarAccounts",
	filename: "src/lib/crm/governance.ts"
}, (opts) => listCalendarAccounts.__executeServer(opts));
var listCalendarAccounts = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listCalendarAccounts_createServerFn_handler, async () => {
	const sql = await getSql();
	try {
		return (await sql`select c.*, m.name as member_name from calendar_accounts c left join members m on m.id = c.member_id order by c.id`).map((r) => ({
			id: Number(r.id),
			memberId: r.member_id == null ? null : Number(r.member_id),
			memberName: r.member_name == null ? null : String(r.member_name),
			provider: String(r.provider),
			address: String(r.address),
			synced: Boolean(r.synced),
			twoWay: Boolean(r.two_way),
			lastSync: iso(r.last_sync)
		}));
	} catch {
		return [];
	}
});
var toggleCalendar_createServerFn_handler = createServerRpc({
	id: "c5e815999659ccd3aaa97d27ee9f85412d8491a267e148422bcd9aeeb8241989",
	name: "toggleCalendar",
	filename: "src/lib/crm/governance.ts"
}, (opts) => toggleCalendar.__executeServer(opts));
var toggleCalendar = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(toggleCalendar_createServerFn_handler, async ({ data }) => {
	await (await getSql())`update calendar_accounts set synced = ${data.synced} where id = ${data.id}`;
	return { ok: true };
});
var syncCalendars_createServerFn_handler = createServerRpc({
	id: "cdbe2b2b14cb14316c93e7e8607b4ee37e84e3d14303d4300a2102efbd5bb5f9",
	name: "syncCalendars",
	filename: "src/lib/crm/governance.ts"
}, (opts) => syncCalendars.__executeServer(opts));
var syncCalendars = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(syncCalendars_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	await sql`update calendar_accounts set last_sync = now() where synced = true`;
	const pulled = [
		{
			subject: "Google · Cipriani walk (synced)",
			type: "site-survey",
			hours: 26
		},
		{
			subject: "Outlook · Recost call with Elena",
			type: "call",
			hours: 6
		},
		{
			subject: "Google · Load-in hold — Brooklyn Steel",
			type: "load-in",
			hours: 50
		}
	];
	for (const ev of pulled) {
		const due = new Date(Date.now() + ev.hours * 36e5).toISOString();
		await sql`insert into activities (type, subject, owner_id, due_at, done, duration_min, notes)
        values (${ev.type}, ${ev.subject}, ${data.memberId}, ${due}, false, 45, ${"Pulled from connected calendar"})`;
	}
	return {
		ok: true,
		pulled: pulled.length
	};
});
var listSandbox_createServerFn_handler = createServerRpc({
	id: "f1390fed3e65288922e06213d87c831951d9483e3f7823dfdeea302c8a1055d6",
	name: "listSandbox",
	filename: "src/lib/crm/governance.ts"
}, (opts) => listSandbox.__executeServer(opts));
var listSandbox = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listSandbox_createServerFn_handler, async () => {
	const sql = await getSql();
	try {
		return {
			fields: (await sql`select * from sandbox_fields order by id`).map((f) => ({
				id: Number(f.id),
				entity: String(f.entity),
				name: String(f.name),
				fieldType: String(f.field_type),
				required: Boolean(f.required),
				promoted: Boolean(f.promoted)
			})),
			automations: (await sql`select * from sandbox_automations order by id`).map((a) => ({
				id: Number(a.id),
				name: String(a.name),
				triggerType: String(a.trigger_type),
				triggerDetail: a.trigger_detail == null ? null : String(a.trigger_detail),
				actionType: String(a.action_type),
				actionDetail: a.action_detail == null ? null : String(a.action_detail),
				active: Boolean(a.active),
				promoted: Boolean(a.promoted)
			}))
		};
	} catch {
		return {
			fields: [],
			automations: []
		};
	}
});
var createSandboxField_createServerFn_handler = createServerRpc({
	id: "806bf28a4e55309eb3a67956f4ac4cab7337aee8d20e06aa18c9794718f1fe07",
	name: "createSandboxField",
	filename: "src/lib/crm/governance.ts"
}, (opts) => createSandboxField.__executeServer(opts));
var createSandboxField = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSandboxField_createServerFn_handler, async ({ data }) => {
	await (await getSql())`insert into sandbox_fields (entity, name, field_type) values (${data.entity}, ${data.name}, ${data.fieldType})`;
	return { ok: true };
});
var createSandboxAutomation_createServerFn_handler = createServerRpc({
	id: "d3b9bc0887bb532887ec6de69043b7d483b09ce8e3498ce482255034d00c6b0c",
	name: "createSandboxAutomation",
	filename: "src/lib/crm/governance.ts"
}, (opts) => createSandboxAutomation.__executeServer(opts));
var createSandboxAutomation = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSandboxAutomation_createServerFn_handler, async ({ data }) => {
	await (await getSql())`insert into sandbox_automations (name, trigger_type, action_type) values (${data.name}, ${data.triggerType}, ${data.actionType})`;
	return { ok: true };
});
var promoteSandboxField_createServerFn_handler = createServerRpc({
	id: "aafc6cedf2a1d8ef4858368fa89a427641cae13c0b0a5fc5f047629157fd28ba",
	name: "promoteSandboxField",
	filename: "src/lib/crm/governance.ts"
}, (opts) => promoteSandboxField.__executeServer(opts));
var promoteSandboxField = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(promoteSandboxField_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const cap = await assertCap("fields");
	if (cap) return {
		ok: false,
		error: cap
	};
	const row = (await sql`select * from sandbox_fields where id = ${data.id}`)[0];
	if (!row) return {
		ok: false,
		error: "Missing field"
	};
	await sql`insert into custom_fields (entity, name, field_type, required)
      values (${String(row.entity)}, ${String(row.name)}, ${String(row.field_type)}, ${Boolean(row.required)})`;
	await sql`update sandbox_fields set promoted = true where id = ${data.id}`;
	return {
		ok: true,
		error: null
	};
});
var promoteSandboxAutomation_createServerFn_handler = createServerRpc({
	id: "6ed92127644641cc1ab2b415b3850fa50fdf50c2e88280f6c2767dd2ae3ef53e",
	name: "promoteSandboxAutomation",
	filename: "src/lib/crm/governance.ts"
}, (opts) => promoteSandboxAutomation.__executeServer(opts));
var promoteSandboxAutomation = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(promoteSandboxAutomation_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const cap = await assertCap("automations");
	if (cap) return {
		ok: false,
		error: cap
	};
	const row = (await sql`select * from sandbox_automations where id = ${data.id}`)[0];
	if (!row) return {
		ok: false,
		error: "Missing workflow"
	};
	await sql`insert into automations (name, trigger_type, trigger_detail, action_type, action_detail, active)
      values (${String(row.name)}, ${String(row.trigger_type)}, ${row.trigger_detail == null ? null : String(row.trigger_detail)}, ${String(row.action_type)}, ${row.action_detail == null ? null : String(row.action_detail)}, true)`;
	await sql`update sandbox_automations set promoted = true where id = ${data.id}`;
	return {
		ok: true,
		error: null
	};
});
var getLeadBooster_createServerFn_handler = createServerRpc({
	id: "93ad2ac0b6aeba1d2ac163ddb012a6d000641696fc4822c9431cd7fa27e506bb",
	name: "getLeadBooster",
	filename: "src/lib/crm/governance.ts"
}, (opts) => getLeadBooster.__executeServer(opts));
var getLeadBooster = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getLeadBooster_createServerFn_handler, async () => {
	const sql = await getSql();
	try {
		return {
			forms: Number((await sql`select coalesce(sum(submissions),0) as c from web_forms`)[0]?.c ?? 0),
			chats: Number((await sql`select count(*) as c from chats`)[0]?.c ?? 0),
			botConvos: Number((await sql`select coalesce(sum(conversations),0) as c from chatbot_flows`)[0]?.c ?? 0),
			formCount: Number((await sql`select count(*) as c from web_forms`)[0]?.c ?? 0),
			botCount: Number((await sql`select count(*) as c from chatbot_flows where active = true`)[0]?.c ?? 0)
		};
	} catch {
		return {
			forms: 0,
			chats: 0,
			botConvos: 0,
			formCount: 0,
			botCount: 0
		};
	}
});
var listBroadcasts_createServerFn_handler = createServerRpc({
	id: "e3d686244eb679141e17e7129921ac231c720cc763e5d62836dd48bab1a10f9d",
	name: "listBroadcasts",
	filename: "src/lib/crm/governance.ts"
}, (opts) => listBroadcasts.__executeServer(opts));
var listBroadcasts = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listBroadcasts_createServerFn_handler, async () => {
	const sql = await getSql();
	try {
		return (await sql`select * from mail_broadcasts order by created_at desc`).map((b) => ({
			id: Number(b.id),
			name: String(b.name),
			subject: String(b.subject),
			body: String(b.body),
			audience: String(b.audience),
			sentCount: Number(b.sent_count),
			opened: Number(b.opened),
			suppressedCount: Number(b.suppressed_count ?? 0),
			skipped: Number(b.skipped ?? 0),
			fromAddr: b.from_addr == null ? null : String(b.from_addr),
			createdAt: iso(b.created_at) ?? ""
		}));
	} catch {
		return [];
	}
});
var sendBroadcast_createServerFn_handler = createServerRpc({
	id: "81d4a196ae64f73aaa553042ac7137a6c461b9038149924da9c6b68e3ff8d70d",
	name: "sendBroadcast",
	filename: "src/lib/crm/governance.ts"
}, (opts) => sendBroadcast.__executeServer(opts));
var sendBroadcast = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(sendBroadcast_createServerFn_handler, async ({ data }) => {
	const blocked = await guardAction("mail");
	if (!blocked.ok) return {
		ok: false,
		sent: 0,
		suppressed: 0,
		skipped: 0,
		error: blocked.reason
	};
	const sql = await getSql();
	return sendClientBroadcast(sql, data);
});
var createTeamInbox_createServerFn_handler = createServerRpc({
	id: "d2d7724ec7aaae622dea40d476f8e979d82ffb2e5c8afba645de14dd35601133",
	name: "createTeamInbox",
	filename: "src/lib/crm/governance.ts"
}, (opts) => createTeamInbox.__executeServer(opts));
var createTeamInbox = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createTeamInbox_createServerFn_handler, async ({ data }) => {
	const cap = await assertCap("teamInboxes");
	if (cap) return {
		ok: false,
		error: cap
	};
	const sql = await getSql();
	const addr = data.address.trim().toLowerCase();
	if (!addr.includes("@")) return {
		ok: false,
		error: "Use a full address."
	};
	if ((await sql`select id from email_accounts where address = ${addr}`)[0]) return {
		ok: false,
		error: "That inbox already exists."
	};
	await sql`insert into email_accounts (member_id, address, kind, synced, last_sync)
      values (${null}, ${addr}, ${"shared"}, true, now())`;
	return {
		ok: true,
		error: null
	};
});
//#endregion
export { createSandboxAutomation_createServerFn_handler, createSandboxField_createServerFn_handler, createTeamInbox_createServerFn_handler, getAccessState_createServerFn_handler, getLeadBooster_createServerFn_handler, getUsage_createServerFn_handler, listBroadcasts_createServerFn_handler, listCalendarAccounts_createServerFn_handler, listSandbox_createServerFn_handler, lockSession_createServerFn_handler, promoteSandboxAutomation_createServerFn_handler, promoteSandboxField_createServerFn_handler, sendBroadcast_createServerFn_handler, setSessionContext_createServerFn_handler, syncCalendars_createServerFn_handler, testSignIn_createServerFn_handler, toggleCalendar_createServerFn_handler, unlockSession_createServerFn_handler, updateAccessPolicy_createServerFn_handler };
