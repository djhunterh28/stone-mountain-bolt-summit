import { createServerFn } from "@tanstack/react-start";
import { getSql, type Sql } from "@/lib/db";
import { iso } from "@/lib/utils";
import { authMiddleware } from "@/lib/auth/middleware";
import { insertOutbound } from "./domain";

export const CANSPAM_NAME = "Hurricane Productions";
export const CANSPAM_ADDRESS = "247 3rd Street, Brooklyn, NY 11215";

export type BroadcastAudience = "clients" | "open-deals" | "won" | "rotting" | "leads";

export type BroadcastRecipient = {
  personId: number | null;
  name: string;
  email: string;
  venue: string | null;
  deal: string | null;
};

export type SuppressionRow = {
  id: number;
  email: string;
  name: string | null;
  reason: string;
  source: string;
  createdAt: string;
};

export const AUDIENCES: { id: BroadcastAudience; label: string; hint: string }[] = [
  { id: "clients", label: "Whole client book", hint: "Every person with an email. Not cold lists." },
  { id: "open-deals", label: "Open deals", hint: "Live pipeline contacts" },
  { id: "won", label: "Won / past", hint: "Closed-won clients" },
  { id: "rotting", label: "Rotting", hint: "Open deals past rotting days" },
  { id: "leads", label: "Leads", hint: "Lead inbox with an email" },
];

export function canspamFooter(token: string) {
  return [
    "",
    "—",
    CANSPAM_NAME,
    CANSPAM_ADDRESS,
    "This is a commercial message from our client book.",
    `Unsubscribe: https://hurricaneproductionsllc.com/u/${token}`,
  ].join("\n");
}

export function htmlToMail(html: string) {
  return html
    .replace(/<\/(p|div|h3|li)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<li>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function applyMerge(
  text: string,
  ctx: { first: string; name: string; venue: string; deal: string },
) {
  return text
    .replaceAll("{{first_name}}", ctx.first)
    .replaceAll("{{first}}", ctx.first)
    .replaceAll("{{name}}", ctx.name)
    .replaceAll("{{venue}}", ctx.venue)
    .replaceAll("{{deal}}", ctx.deal)
    .replaceAll("{{date}}", "")
    .replaceAll("{{load_in}}", "")
    .replace(/\{\{[^}]+\}\}/g, "")
    .trim();
}

async function loadSignature(sql: Sql, memberId?: number | null) {
  const rows = memberId
    ? await sql.query(`select body from mail_signatures where member_id = $1 limit 1`, [memberId])
    : await sql.query(`select body from mail_signatures order by id limit 1`);
  return rows[0] ? String(rows[0].body) : "";
}

async function ensureToken(sql: Sql, email: string) {
  const addr = email.toLowerCase();
  const existing = await sql.query(`select token from mail_unsub_tokens where lower(email) = $1`, [addr]);
  if (existing[0]) return String(existing[0].token);
  const token = `${addr.replace(/[^a-z0-9]+/g, "").slice(0, 16)}-${Math.random().toString(36).slice(2, 8)}`;
  await sql.query(`insert into mail_unsub_tokens (token, email) values ($1,$2)`, [token, addr]);
  return token;
}

function mapRecipient(r: Record<string, unknown>): BroadcastRecipient {
  return {
    personId: r.id == null ? null : Number(r.id),
    name: String(r.name ?? ""),
    email: String(r.email),
    venue: r.venue == null ? null : String(r.venue),
    deal: r.deal == null ? null : String(r.deal),
  };
}

async function audienceRows(sql: Sql, audience: string): Promise<BroadcastRecipient[]> {
  if (audience === "leads")
    return (
      await sql.query(
        `select p.id, coalesce(p.name, l.title) as name, p.email, l.venue, l.title as deal
         from leads l left join people p on p.id = l.person_id
         where l.status <> 'archived' and p.email is not null and p.email <> ''`,
      )
    ).map(mapRecipient);
  if (audience === "rotting")
    return (
      await sql.query(
        `select p.id, coalesce(p.name, d.title) as name, p.email, d.venue, d.title as deal
         from deals d left join people p on p.id = d.person_id
         join stages s on s.id = d.stage_id
         where d.status = 'open' and p.email is not null and p.email <> ''
           and extract(day from now() - d.stage_entered_at) >= s.rotting_days`,
      )
    ).map(mapRecipient);
  if (audience === "won")
    return (
      await sql.query(
        `select p.id, coalesce(p.name, d.title) as name, p.email, d.venue, d.title as deal
         from deals d left join people p on p.id = d.person_id
         where d.status = 'won' and p.email is not null and p.email <> ''`,
      )
    ).map(mapRecipient);
  if (audience === "open-deals")
    return (
      await sql.query(
        `select p.id, coalesce(p.name, d.title) as name, p.email, d.venue, d.title as deal
         from deals d left join people p on p.id = d.person_id
         where d.status = 'open' and p.email is not null and p.email <> ''`,
      )
    ).map(mapRecipient);
  return (
    await sql.query(
      `select p.id, p.name, p.email, null as venue, null as deal
       from people p
       where p.email is not null and p.email <> ''
       order by p.name`,
    )
  ).map(mapRecipient);
}

function uniquePeople(rows: BroadcastRecipient[]) {
  const map = new Map<string, BroadcastRecipient>();
  let dupes = 0;
  for (const r of rows) {
    const key = r.email.toLowerCase();
    if (map.has(key)) {
      dupes += 1;
      continue;
    }
    map.set(key, r);
  }
  return { unique: [...map.values()], dupes };
}

export async function sendClientBroadcast(
  sql: Sql,
  data: {
    name?: string;
    subject: string;
    body: string;
    audience: string;
    fromName: string;
    fromAddr: string;
    memberId?: number | null;
    templateId?: number | null;
  },
) {
  const subject = data.subject.trim();
  const rawBody = htmlToMail(data.body);
  if (!subject || !rawBody) {
    return { ok: false as const, sent: 0, suppressed: 0, skipped: 0, error: "Subject and body are required" };
  }
  const people = uniquePeople(await audienceRows(sql, data.audience));
  const suppressedRows = await sql.query(`select lower(email) as e from mail_suppressions`);
  const held = new Set(suppressedRows.map((r) => String(r.e)));
  const signature = await loadSignature(sql, data.memberId);
  let sent = 0;
  let suppressed = 0;
  let skipped = people.dupes;
  for (const r of people.unique) {
    const email = r.email.toLowerCase();
    if (held.has(email)) {
      suppressed += 1;
      continue;
    }
    const token = await ensureToken(sql, email);
    const first = r.name.split(" ")[0] ?? r.name;
    const ctx = { first, name: r.name, venue: r.venue ?? "", deal: r.deal ?? "" };
    const body = [applyMerge(rawBody, ctx), signature ? `\n\n${signature}` : "", canspamFooter(token)].filter(Boolean).join("\n");
    await insertOutbound(sql, {
      purpose: "workflow",
      mailKind: "broadcast",
      toAddr: r.email,
      subject: applyMerge(subject, ctx),
      body,
      personId: r.personId,
      fallbackName: data.fromName,
      hintAddr: data.fromAddr,
      memberId: data.memberId ?? null,
    });
    sent += 1;
  }
  await sql.query(
    `insert into mail_broadcasts (name, subject, body, audience, sent_count, opened, suppressed_count, skipped, template_id, from_addr)
     values ($1,$2,$3,$4,$5,0,$6,$7,$8,$9)`,
    [
      data.name?.trim() || subject,
      subject,
      rawBody,
      data.audience,
      sent,
      suppressed,
      skipped,
      data.templateId ?? null,
      data.fromAddr,
    ],
  );
  return { ok: true as const, sent, suppressed, skipped, error: null as string | null };
}

export const getBroadcastComposer = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const suppressed = (await sql.query(`select * from mail_suppressions order by created_at desc`)).map(
      (s): SuppressionRow => ({
        id: Number(s.id),
        email: String(s.email),
        name: s.name == null ? null : String(s.name),
        reason: String(s.reason),
        source: String(s.source),
        createdAt: iso(s.created_at) ?? "",
      }),
    );
    const held = new Set(suppressed.map((s) => s.email.toLowerCase()));
    const audiences = [];
    for (const a of AUDIENCES) {
      const people = uniquePeople(await audienceRows(sql, a.id));
      const ready = people.unique.filter((p) => !held.has(p.email.toLowerCase()));
      audiences.push({
        id: a.id,
        label: a.label,
        hint: a.hint,
        total: people.unique.length,
        ready: ready.length,
        suppressed: people.unique.length - ready.length,
        preview: ready.slice(0, 6).map((p) => ({ name: p.name, email: p.email })),
      });
    }
    const templates = (await sql.query(`select * from email_templates order by id`)).map((t) => ({
      id: Number(t.id),
      name: String(t.name),
      subject: String(t.subject),
      body: String(t.body),
    }));
    const broadcasts = (await sql.query(`select * from mail_broadcasts order by created_at desc`)).map((b) => ({
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
      createdAt: iso(b.created_at) ?? "",
    }));
    const signatures = (
      await sql.query(`select s.*, m.name from mail_signatures s left join members m on m.id = s.member_id`)
    ).map((s) => ({
      member: s.name == null ? null : String(s.name),
      body: String(s.body),
    }));
    const book = audiences.find((a) => a.id === "clients");
    return {
      audiences,
      suppressed,
      templates,
      broadcasts,
      signatures,
      address: CANSPAM_ADDRESS,
      company: CANSPAM_NAME,
      stats: {
        book: book?.total ?? 0,
        ready: book?.ready ?? 0,
        held: suppressed.length,
        sent: broadcasts.reduce((n, b) => n + b.sentCount, 0),
      },
    };
  });

export const saveBroadcastTemplate = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { name: string; subject: string; body: string }) => input)
  .handler(async ({ data }) => {
    const name = data.name.trim() || data.subject.trim();
    const subject = data.subject.trim();
    const body = htmlToMail(data.body);
    if (!name || !subject || !body) return { ok: false as const, error: "Need a name, subject, and body", id: 0 };
    const sql = await getSql();
    const row = (
      await sql.query(`insert into email_templates (name, subject, body) values ($1,$2,$3) returning id`, [
        name,
        subject,
        body,
      ])
    )[0];
    return { ok: true as const, error: null as string | null, id: Number(row?.id ?? 0) };
  });

export const addSuppression = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { email: string; name?: string; reason?: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const email = data.email.trim().toLowerCase();
    if (!email.includes("@")) return { ok: false as const, error: "Need a full email" };
    const dup = await sql.query(`select id from mail_suppressions where lower(email) = $1`, [email]);
    if (dup[0]) return { ok: true as const, error: null as string | null };
    await sql.query(`insert into mail_suppressions (email, name, reason, source) values ($1,$2,$3,'manual')`, [
      email,
      data.name?.trim() || null,
      data.reason?.trim() || "unsubscribe",
    ]);
    return { ok: true as const, error: null as string | null };
  });

export const removeSuppression = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    await (await getSql()).query(`delete from mail_suppressions where id = $1`, [data.id]);
    return { ok: true as const };
  });

export const getUnsubPage = createServerFn({ method: "GET" })
  .validator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const row = (await sql.query(`select * from mail_unsub_tokens where token = $1`, [data.token]))[0];
    if (!row) return { ok: false as const, email: null as string | null, already: false };
    const email = String(row.email);
    const held = (await sql.query(`select id from mail_suppressions where lower(email) = $1`, [email.toLowerCase()]))[0];
    return { ok: true as const, email, already: Boolean(held) };
  });

export const confirmUnsub = createServerFn({ method: "POST" })
  .validator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const row = (await sql.query(`select * from mail_unsub_tokens where token = $1`, [data.token]))[0];
    if (!row) return { ok: false as const, error: "Link is not valid" };
    const email = String(row.email).toLowerCase();
    const held = (await sql.query(`select id from mail_suppressions where lower(email) = $1`, [email]))[0];
    if (!held) {
      await sql.query(`insert into mail_suppressions (email, reason, source) values ($1,'unsubscribe','unsub')`, [email]);
    }
    return { ok: true as const, error: null as string | null };
  });
