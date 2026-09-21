import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { iso } from "@/lib/utils";
import { ULTIMATE_LIMITS } from "./limits";
import type {
  AccessPolicy,
  AccessState,
  CalendarAccount,
  MailBroadcast,
  SandboxAutomation,
  SandboxField,
  SessionContext,
  UsageSnapshot,
} from "./types";

export const ACCESS_LOCATIONS = [
  { label: "Gowanus shop", ip: "74.64.12.4" },
  { label: "Fort Greene (home)", ip: "74.64.18.22" },
  { label: "Park Slope", ip: "74.64.22.9" },
  { label: "Unknown — São Paulo", ip: "189.45.12.88" },
] as const;

const DEFAULT_POLICY: AccessPolicy = {
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
  exportApproval: true,
};

const DEFAULT_SESSION: SessionContext = {
  locationLabel: "Gowanus shop",
  ip: "74.64.12.4",
  clockMode: "live",
  locked: false,
  failedAttempts: 0,
};

function parseList(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === "string") {
    try {
      const p = JSON.parse(v);
      return Array.isArray(p) ? p.map(String) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function ipAllowed(ip: string, list: string[]): boolean {
  return list.some((rule) => {
    const trimmed = rule.trim();
    if (!trimmed) return false;
    if (trimmed.includes("/")) {
      const base = trimmed.split("/")[0] ?? "";
      const prefix = base.split(".").slice(0, 2).join(".");
      return prefix.length > 0 && ip.startsWith(`${prefix}.`);
    }
    return ip === trimmed;
  });
}

function nyHour(clockMode: SessionContext["clockMode"]): { hour: number; label: string } {
  if (clockMode === "offhours") return { hour: 2, label: "02:30 America/New_York (simulated)" };
  const hour = Number(
    new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", hour: "numeric", hour12: false }).format(
      new Date(),
    ),
  );
  const minute = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    minute: "2-digit",
  }).format(new Date());
  return { hour, label: `${String(hour).padStart(2, "0")}:${minute} America/New_York` };
}

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

function evaluate(policy: AccessPolicy, session: SessionContext) {
  const { hour, label } = nyHour(session.clockMode);
  if (session.locked) {
    return { allowed: false, reason: "Session locked. Confirm MFA to continue.", hourLabel: label };
  }
  if (policy.ipEnforced && !ipAllowed(session.ip, policy.ipAllowlist)) {
    return { allowed: false, reason: `IP ${session.ip} is outside the allow list.`, hourLabel: label };
  }
  if (policy.hoursEnforced) {
    const mins = hour * 60 + (session.clockMode === "offhours" ? 30 : 0);
    const start = toMinutes(policy.officeStart);
    const end = toMinutes(policy.officeEnd);
    if (mins < start || mins > end) {
      return {
        allowed: false,
        reason: `Outside office hours (${policy.officeStart}–${policy.officeEnd} ${policy.timezone}).`,
        hourLabel: label,
      };
    }
  }
  return { allowed: true, reason: null as string | null, hourLabel: label };
}

async function loadPolicy() {
  const sql = await getSql();
  try {
    const p = (await sql`select * from access_policy where id = 1`)[0];
    const s = (await sql`select * from session_context where id = 1`)[0];
    return {
      policy: p
        ? {
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
            exportApproval: Boolean(p.export_approval),
          }
        : DEFAULT_POLICY,
      session: s
        ? {
            locationLabel: String(s.location_label),
            ip: String(s.ip),
            clockMode: (String(s.clock_mode) === "offhours" ? "offhours" : "live") as SessionContext["clockMode"],
            locked: Boolean(s.locked),
            failedAttempts: Number(s.failed_attempts ?? 0),
          }
        : DEFAULT_SESSION,
    };
  } catch {
    return { policy: DEFAULT_POLICY, session: DEFAULT_SESSION };
  }
}

async function raiseAlert(severity: string, title: string, detail: string) {
  const sql = await getSql();
  await sql`insert into security_alerts (severity, title, detail, resolved) values (${severity}, ${title}, ${detail}, false)`;
  await sql`insert into notifications (member_id, kind, title, body, href, read)
    values (${1}, ${"mention"}, ${title}, ${detail}, ${"/security"}, false)`;
}

export async function guardAction(kind: "export" | "mail" | "login") {
  const { policy, session } = await loadPolicy();
  const ev = evaluate(policy, session);
  if (!ev.allowed) {
    await raiseAlert(
      kind === "export" ? "medium" : "high",
      kind === "export" ? "Blocked export" : kind === "mail" ? "Blocked bulk mail" : "Blocked sign-in",
      ev.reason ?? "Access policy",
    );
    return { ok: false, reason: ev.reason };
  }
  if (kind === "export" && policy.exportApproval) {
    await raiseAlert("low", "CSV export", `Deals CSV left the workspace from ${session.locationLabel} (${session.ip}).`);
  }
  return { ok: true, reason: null as string | null };
}

export const getAccessState = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async (): Promise<AccessState> => {
    const { policy, session } = await loadPolicy();
    const ev = evaluate(policy, session);
    return { policy, session, allowed: ev.allowed, reason: ev.reason, hourLabel: ev.hourLabel };
  });

export const updateAccessPolicy = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      hoursEnforced?: boolean;
      officeStart?: string;
      officeEnd?: string;
      ipEnforced?: boolean;
      ipAllowlist?: string;
      mfaRequired?: boolean;
      idleMinutes?: number;
      exportApproval?: boolean;
      encryptionAtRest?: boolean;
      adminApproval?: boolean;
    }) => input,
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const { policy } = await loadPolicy();
    const hoursEnforced = data.hoursEnforced ?? policy.hoursEnforced;
    const officeStart = data.officeStart ?? policy.officeStart;
    const officeEnd = data.officeEnd ?? policy.officeEnd;
    const ipEnforced = data.ipEnforced ?? policy.ipEnforced;
    const ipAllowlist = data.ipAllowlist
      ? data.ipAllowlist
          .split(/[\n,]+/)
          .map((s) => s.trim())
          .filter(Boolean)
      : policy.ipAllowlist;
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

export const setSessionContext = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { locationLabel: string; ip: string; clockMode: SessionContext["clockMode"] }) => input)
  .handler(async ({ data }) => {
    await (await getSql())`update session_context set location_label = ${data.locationLabel}, ip = ${data.ip}, clock_mode = ${data.clockMode} where id = 1`;
    const { policy, session } = await loadPolicy();
    const ev = evaluate(policy, {
      ...session,
      locationLabel: data.locationLabel,
      ip: data.ip,
      clockMode: data.clockMode,
    });
    if (!ev.allowed) await raiseAlert("high", "Suspicious sign-in blocked", `${data.locationLabel} · ${data.ip} · ${ev.reason}`);
    return { ok: ev.allowed, reason: ev.reason };
  });

export const testSignIn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { memberName: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const { policy, session } = await loadPolicy();
    const ev = evaluate(policy, session);
    if (!ev.allowed) {
      const fails = session.failedAttempts + 1;
      await sql`update session_context set failed_attempts = ${fails}, locked = ${fails >= policy.maxFailed} where id = 1`;
      await raiseAlert("high", `Failed sign-in · ${data.memberName}`, ev.reason ?? "Policy denied");
      return { ok: false, locked: fails >= policy.maxFailed, reason: ev.reason, attempts: fails };
    }
    await sql`update session_context set failed_attempts = 0, locked = false where id = 1`;
    await sql`insert into audit_log (actor, action, entity, detail, ip, device)
      values (${data.memberName}, ${"login"}, ${"session"}, ${session.locationLabel}, ${session.ip}, ${"Chrome · macOS"})`;
    return { ok: true, locked: false, reason: null as string | null, attempts: 0 };
  });

export const unlockSession = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { code: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    if (data.code.trim() !== "482193") return { ok: false, error: "Invalid recovery code." };
    await sql`update session_context set locked = false, failed_attempts = 0 where id = 1`;
    return { ok: true, error: null as string | null };
  });

export const lockSession = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async () => {
    await (await getSql())`update session_context set locked = true where id = 1`;
    return { ok: true };
  });

async function usageNow(): Promise<UsageSnapshot> {
  const sql = await getSql();
  const empty: UsageSnapshot = {
    reports: 0,
    fields: 0,
    automations: 0,
    teamInboxes: 0,
    enrichmentRemaining: ULTIMATE_LIMITS.enrichmentCredits,
    enrichmentUsed: 0,
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
      enrichmentUsed: credits ? Number(credits.used) : 0,
    };
  } catch {
    return empty;
  }
}

export const getUsage = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async (): Promise<UsageSnapshot> => usageNow());

export async function assertCap(kind: "reports" | "fields" | "automations" | "teamInboxes") {
  const n = (await usageNow())[kind];
  const cap = kind === "teamInboxes" ? ULTIMATE_LIMITS.teamInboxes : ULTIMATE_LIMITS[kind];
  if (n >= cap) return `Ultimate cap reached (${cap} ${kind}).`;
  return null;
}

export async function consumeCredit() {
  const sql = await getSql();
  try {
    const row = (await sql`select remaining, used from enrichment_credits where id = 1`)[0];
    const remaining = Number(row?.remaining ?? 0);
    if (remaining <= 0) return { ok: false, remaining: 0, error: "Enrichment credits exhausted (500 / cycle)." };
    await sql`update enrichment_credits set remaining = remaining - 1, used = used + 1 where id = 1`;
    return { ok: true, remaining: remaining - 1 };
  } catch {
    return { ok: true, remaining: ULTIMATE_LIMITS.enrichmentCredits };
  }
}

export const listCalendarAccounts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async (): Promise<CalendarAccount[]> => {
    const sql = await getSql();
    try {
      return (await sql`select c.*, m.name as member_name from calendar_accounts c left join members m on m.id = c.member_id order by c.id`).map(
        (r) => ({
          id: Number(r.id),
          memberId: r.member_id == null ? null : Number(r.member_id),
          memberName: r.member_name == null ? null : String(r.member_name),
          provider: String(r.provider),
          address: String(r.address),
          synced: Boolean(r.synced),
          twoWay: Boolean(r.two_way),
          lastSync: iso(r.last_sync),
        }),
      );
    } catch {
      return [];
    }
  });

export const toggleCalendar = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; synced: boolean }) => input)
  .handler(async ({ data }) => {
    await (await getSql())`update calendar_accounts set synced = ${data.synced} where id = ${data.id}`;
    return { ok: true };
  });

export const syncCalendars = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { memberId: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`update calendar_accounts set last_sync = now() where synced = true`;
    const pulled = [
      { subject: "Google · Cipriani walk (synced)", type: "site-survey", hours: 26 },
      { subject: "Outlook · Recost call with Elena", type: "call", hours: 6 },
      { subject: "Google · Load-in hold — Brooklyn Steel", type: "load-in", hours: 50 },
    ];
    for (const ev of pulled) {
      const due = new Date(Date.now() + ev.hours * 36e5).toISOString();
      await sql`insert into activities (type, subject, owner_id, due_at, done, duration_min, notes)
        values (${ev.type}, ${ev.subject}, ${data.memberId}, ${due}, false, 45, ${"Pulled from connected calendar"})`;
    }
    return { ok: true, pulled: pulled.length };
  });

export const listSandbox = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    try {
      return {
        fields: (await sql`select * from sandbox_fields order by id`).map(
          (f): SandboxField => ({
            id: Number(f.id),
            entity: String(f.entity),
            name: String(f.name),
            fieldType: String(f.field_type),
            required: Boolean(f.required),
            promoted: Boolean(f.promoted),
          }),
        ),
        automations: (await sql`select * from sandbox_automations order by id`).map(
          (a): SandboxAutomation => ({
            id: Number(a.id),
            name: String(a.name),
            triggerType: String(a.trigger_type),
            triggerDetail: a.trigger_detail == null ? null : String(a.trigger_detail),
            actionType: String(a.action_type),
            actionDetail: a.action_detail == null ? null : String(a.action_detail),
            active: Boolean(a.active),
            promoted: Boolean(a.promoted),
          }),
        ),
      };
    } catch {
      return { fields: [] as SandboxField[], automations: [] as SandboxAutomation[] };
    }
  });

export const createSandboxField = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { entity: string; name: string; fieldType: string }) => input)
  .handler(async ({ data }) => {
    await (await getSql())`insert into sandbox_fields (entity, name, field_type) values (${data.entity}, ${data.name}, ${data.fieldType})`;
    return { ok: true };
  });

export const createSandboxAutomation = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { name: string; triggerType: string; actionType: string }) => input)
  .handler(async ({ data }) => {
    await (await getSql())`insert into sandbox_automations (name, trigger_type, action_type) values (${data.name}, ${data.triggerType}, ${data.actionType})`;
    return { ok: true };
  });

export const promoteSandboxField = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const cap = await assertCap("fields");
    if (cap) return { ok: false, error: cap };
    const row = (await sql`select * from sandbox_fields where id = ${data.id}`)[0];
    if (!row) return { ok: false, error: "Missing field" };
    await sql`insert into custom_fields (entity, name, field_type, required)
      values (${String(row.entity)}, ${String(row.name)}, ${String(row.field_type)}, ${Boolean(row.required)})`;
    await sql`update sandbox_fields set promoted = true where id = ${data.id}`;
    return { ok: true, error: null as string | null };
  });

export const promoteSandboxAutomation = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const cap = await assertCap("automations");
    if (cap) return { ok: false, error: cap };
    const row = (await sql`select * from sandbox_automations where id = ${data.id}`)[0];
    if (!row) return { ok: false, error: "Missing workflow" };
    await sql`insert into automations (name, trigger_type, trigger_detail, action_type, action_detail, active)
      values (${String(row.name)}, ${String(row.trigger_type)}, ${row.trigger_detail == null ? null : String(row.trigger_detail)}, ${String(row.action_type)}, ${row.action_detail == null ? null : String(row.action_detail)}, true)`;
    await sql`update sandbox_automations set promoted = true where id = ${data.id}`;
    return { ok: true, error: null as string | null };
  });

export const getLeadBooster = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    try {
      return {
        forms: Number((await sql`select coalesce(sum(submissions),0) as c from web_forms`)[0]?.c ?? 0),
        chats: Number((await sql`select count(*) as c from chats`)[0]?.c ?? 0),
        botConvos: Number((await sql`select coalesce(sum(conversations),0) as c from chatbot_flows`)[0]?.c ?? 0),
        formCount: Number((await sql`select count(*) as c from web_forms`)[0]?.c ?? 0),
        botCount: Number((await sql`select count(*) as c from chatbot_flows where active = true`)[0]?.c ?? 0),
      };
    } catch {
      return { forms: 0, chats: 0, botConvos: 0, formCount: 0, botCount: 0 };
    }
  });

export const listBroadcasts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async (): Promise<MailBroadcast[]> => {
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
        createdAt: iso(b.created_at) ?? "",
      }));
    } catch {
      return [];
    }
  });

export const sendBroadcast = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: { name?: string; subject: string; body: string; audience: string; fromName: string; fromAddr: string }) =>
      input,
  )
  .handler(async ({ data }) => {
    const blocked = await guardAction("mail");
    if (!blocked.ok) return { ok: false, sent: 0, error: blocked.reason };
    const sql = await getSql();
    let recipients: { name: string; email: string }[] = [];
    if (data.audience === "leads") {
      recipients = (
        await sql`select coalesce(p.name, l.title) as name, p.email from leads l left join people p on p.id = l.person_id where l.status <> 'archived' and p.email is not null`
      ).map((r) => ({ name: String(r.name), email: String(r.email) }));
    } else if (data.audience === "rotting") {
      recipients = (
        await sql`select coalesce(p.name, d.title) as name, p.email from deals d left join people p on p.id = d.person_id
          join stages s on s.id = d.stage_id
          where d.status = 'open' and p.email is not null
            and extract(day from now() - d.stage_entered_at) >= s.rotting_days`
      ).map((r) => ({ name: String(r.name), email: String(r.email) }));
    } else {
      recipients = (
        await sql`select coalesce(p.name, d.title) as name, p.email from deals d left join people p on p.id = d.person_id
          where d.status = 'open' and p.email is not null`
      ).map((r) => ({ name: String(r.name), email: String(r.email) }));
    }
    const unique = [...new Map(recipients.map((r) => [r.email, r])).values()].slice(0, 40);
    for (const r of unique) {
      await sql`insert into emails (folder, from_name, from_addr, to_addr, subject, body, opened, clicked, sent_at)
        values (${"sent"}, ${data.fromName}, ${data.fromAddr}, ${r.email}, ${data.subject}, ${data.body}, false, false, now())`;
    }
    await sql`insert into mail_broadcasts (name, subject, body, audience, sent_count, opened)
      values (${data.name || data.subject}, ${data.subject}, ${data.body}, ${data.audience}, ${unique.length}, ${0})`;
    return { ok: true, sent: unique.length, error: null as string | null };
  });

export const createTeamInbox = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { address: string }) => input)
  .handler(async ({ data }) => {
    const cap = await assertCap("teamInboxes");
    if (cap) return { ok: false, error: cap };
    const sql = await getSql();
    const addr = data.address.trim().toLowerCase();
    if (!addr.includes("@")) return { ok: false, error: "Use a full address." };
    if ((await sql`select id from email_accounts where address = ${addr}`)[0]) {
      return { ok: false, error: "That inbox already exists." };
    }
    await sql`insert into email_accounts (member_id, address, kind, synced, last_sync)
      values (${null}, ${addr}, ${"shared"}, true, now())`;
    return { ok: true, error: null as string | null };
  });
