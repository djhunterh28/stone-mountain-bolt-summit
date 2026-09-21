import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware, u as getSql } from "./utils-DLVA4J7b.mjs";
import { t as ULTIMATE_LIMITS } from "./limits-DbP6y05c.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/governance-rJzhZAi0.js
var ACCESS_LOCATIONS = [
	{
		label: "Gowanus shop",
		ip: "74.64.12.4"
	},
	{
		label: "Fort Greene (home)",
		ip: "74.64.18.22"
	},
	{
		label: "Park Slope",
		ip: "74.64.22.9"
	},
	{
		label: "Unknown — São Paulo",
		ip: "189.45.12.88"
	}
];
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
var getAccessState = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("1126647434684a5525c3c90b77f4afac09efa14ff1c54b42a8fa8818a99ac3cd"));
var updateAccessPolicy = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("dfee2e6a778e0b2567114bb8eec7733d95b6712a6a72b8d0e0878935440b6716"));
var setSessionContext = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("107660959cecf6ce2cfdc97ad712ddd82619514fc764e705d2e382991fa851fa"));
var testSignIn = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("a0e69447efe3deffbd69bc685a561447b5177e78edc1c81958f94ec200f87808"));
var unlockSession = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("a7ddf5a4ff9e9a42f30ccf7a817e17f00ffd3716d107c803f2c0d9a71ccd0bdc"));
var lockSession = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("fb4532836f67eafefd7d3b339b271a36aae1778fe87671a78804b0c0ade573b7"));
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
var getUsage = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f0ede3ccff518cf0688e1fa604f556f3c334854b3dfb506411a857e254518129"));
async function assertCap(kind) {
	const n = (await usageNow())[kind];
	const cap = kind === "teamInboxes" ? ULTIMATE_LIMITS.teamInboxes : ULTIMATE_LIMITS[kind];
	if (n >= cap) return `Ultimate cap reached (${cap} ${kind}).`;
	return null;
}
async function consumeCredit() {
	const sql = await getSql();
	try {
		const row = (await sql`select remaining, used from enrichment_credits where id = 1`)[0];
		const remaining = Number(row?.remaining ?? 0);
		if (remaining <= 0) return {
			ok: false,
			remaining: 0,
			error: "Enrichment credits exhausted (500 / cycle)."
		};
		await sql`update enrichment_credits set remaining = remaining - 1, used = used + 1 where id = 1`;
		return {
			ok: true,
			remaining: remaining - 1
		};
	} catch {
		return {
			ok: true,
			remaining: ULTIMATE_LIMITS.enrichmentCredits
		};
	}
}
var listCalendarAccounts = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("399003620615d5554ce324c6942b9d3fc67f195aacbfb1b3695db01b9fe40427"));
var toggleCalendar = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("c5e815999659ccd3aaa97d27ee9f85412d8491a267e148422bcd9aeeb8241989"));
var syncCalendars = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("cdbe2b2b14cb14316c93e7e8607b4ee37e84e3d14303d4300a2102efbd5bb5f9"));
var listSandbox = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f1390fed3e65288922e06213d87c831951d9483e3f7823dfdeea302c8a1055d6"));
var createSandboxField = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("806bf28a4e55309eb3a67956f4ac4cab7337aee8d20e06aa18c9794718f1fe07"));
var createSandboxAutomation = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("d3b9bc0887bb532887ec6de69043b7d483b09ce8e3498ce482255034d00c6b0c"));
var promoteSandboxField = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("aafc6cedf2a1d8ef4858368fa89a427641cae13c0b0a5fc5f047629157fd28ba"));
var promoteSandboxAutomation = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("6ed92127644641cc1ab2b415b3850fa50fdf50c2e88280f6c2767dd2ae3ef53e"));
var getLeadBooster = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("93ad2ac0b6aeba1d2ac163ddb012a6d000641696fc4822c9431cd7fa27e506bb"));
var listBroadcasts = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e3d686244eb679141e17e7129921ac231c720cc763e5d62836dd48bab1a10f9d"));
var sendBroadcast = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("81d4a196ae64f73aaa553042ac7137a6c461b9038149924da9c6b68e3ff8d70d"));
var createTeamInbox = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("d2d7724ec7aaae622dea40d476f8e979d82ffb2e5c8afba645de14dd35601133"));
//#endregion
export { updateAccessPolicy as C, unlockSession as S, sendBroadcast as _, createSandboxField as a, testSignIn as b, getLeadBooster as c, listBroadcasts as d, listCalendarAccounts as f, promoteSandboxField as g, promoteSandboxAutomation as h, createSandboxAutomation as i, getUsage as l, lockSession as m, assertCap as n, createTeamInbox as o, listSandbox as p, consumeCredit as r, getAccessState as s, ACCESS_LOCATIONS as t, guardAction as u, setSessionContext as v, toggleCalendar as x, syncCalendars as y };
