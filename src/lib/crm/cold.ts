import { createServerFn } from "@tanstack/react-start";
import { getSql, type Sql } from "@/lib/db";
import { iso } from "@/lib/utils";
import { authMiddleware } from "@/lib/auth/middleware";
import { insertOutbound } from "./domain";

export type ColdList = {
  id: number;
  name: string;
  tags: string[];
  source: string;
  notes: string | null;
  n: number;
  promoted: number;
  createdAt: string;
};

export type ColdProspect = {
  id: number;
  listId: number;
  listName: string;
  name: string;
  email: string;
  company: string | null;
  title: string | null;
  promoted: boolean;
  promotedLeadId: number | null;
  repliedAt: string | null;
  lastTouchedAt: string | null;
};

export type ColdCampaign = {
  id: number;
  name: string;
  subject: string;
  listIds: number[];
  tag: string | null;
  sent: number;
  skipped: number;
  createdAt: string;
};

function splitTags(raw: unknown): string[] {
  if (raw == null) return [];
  return String(raw)
    .split(/[,;]+/)
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
}

function parseIds(raw: unknown): number[] {
  if (raw == null || raw === "") return [];
  return String(raw)
    .split(/[,\s]+/)
    .map((n) => Number(n))
    .filter((n) => Number.isFinite(n) && n > 0);
}

export function parsePaste(raw: string): { name: string; email: string; company?: string }[] {
  const seen = new Set<string>();
  const out: { name: string; email: string; company?: string }[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (/^name\s*[,;\t]/i.test(trimmed) || /^email\s*[,;\t]/i.test(trimmed)) continue;
    const angle = trimmed.match(/^(.*?)[<\s]+([^\s<>]+@[^\s<>]+)>\s*(?:[,;\t]\s*(.*))?$/);
    let name = "";
    let email = "";
    let company: string | undefined;
    if (angle) {
      name = angle[1].replace(/^["']|["']$/g, "").trim();
      email = angle[2].trim().toLowerCase();
      company = angle[3]?.replace(/^["']|["']$/g, "").trim() || undefined;
    } else {
      const parts = trimmed.split(/[,;\t]/).map((s) => s.replace(/^["']|["']$/g, "").trim()).filter(Boolean);
      const emailPart = parts.find((p) => p.includes("@"));
      if (!emailPart) continue;
      email = emailPart.toLowerCase();
      name = parts.find((p) => p !== emailPart && !p.includes("@")) ?? "";
      company = parts.find((p) => p !== emailPart && p !== name && !p.includes("@")) || undefined;
    }
    if (!email.includes("@")) continue;
    if (seen.has(email)) continue;
    seen.add(email);
    if (!name) name = email.split("@")[0] ?? email;
    out.push({ name, email, company });
  }
  return out;
}

async function promoteEmail(sql: Sql, email: string, repliedAt: string, detail: string) {
  const addr = email.trim().toLowerCase();
  const rows = await sql.query(`select * from cold_prospects where lower(email) = $1`, [addr]);
  if (!rows.length) return { ok: false as const, promoted: 0, leadId: null as number | null };
  const already = rows.find((r) => r.promoted_lead_id != null);
  if (already) {
    await sql.query(
      `update cold_prospects set replied_at = coalesce(replied_at, $1::timestamptz), promoted_at = coalesce(promoted_at, $1::timestamptz) where lower(email) = $2`,
      [repliedAt, addr],
    );
    return { ok: true as const, promoted: 0, leadId: Number(already.promoted_lead_id) };
  }
  const first = rows[0];
  const lead = await sql.query(
    `insert into leads (title, source, status, notes, created_at, stage_entered_at)
     values ($1, 'Cold reply', 'new', $2, $3::timestamptz, $3::timestamptz) returning id`,
    [String(first.name), `${addr}${first.company ? ` · ${first.company}` : ""}`, repliedAt],
  );
  const leadId = Number(lead[0].id);
  await sql.query(
    `update cold_prospects set promoted_lead_id = $1, promoted_at = $2::timestamptz, replied_at = $2::timestamptz where lower(email) = $3`,
    [leadId, repliedAt, addr],
  );
  try {
    await sql.query(`insert into lead_history (lead_id, actor, action, detail) values ($1,'Northline','promoted',$2)`, [
      leadId,
      detail,
    ]);
  } catch {
    /* optional */
  }
  return { ok: true as const, promoted: 1, leadId };
}

async function scanReplies(sql: Sql) {
  const pending = await sql.query(
    `select p.email, min(e.sent_at) as replied_at
     from cold_prospects p
     join emails e on lower(e.from_addr) = lower(p.email) and e.folder = 'inbox'
     where p.promoted_lead_id is null
     group by p.email`,
  );
  let n = 0;
  for (const row of pending) {
    const at = iso(row.replied_at) ?? new Date().toISOString();
    const r = await promoteEmail(sql, String(row.email), at, "Inbound reply — lead dated from the reply, not the list");
    n += r.promoted;
  }
  return n;
}

async function loadDesk(sql: Sql) {
  const scanned = await scanReplies(sql);
  const lists = (
    await sql.query(
      `select l.*,
        (select count(*) from cold_prospects c where c.list_id = l.id) as n,
        (select count(*) from cold_prospects c where c.list_id = l.id and c.promoted_lead_id is not null) as promoted
       from cold_lists l order by l.id`,
    )
  ).map(
    (l): ColdList => ({
      id: Number(l.id),
      name: String(l.name),
      tags: splitTags(l.tags),
      source: String(l.source ?? "manual"),
      notes: l.notes == null ? null : String(l.notes),
      n: Number(l.n),
      promoted: Number(l.promoted),
      createdAt: iso(l.created_at) ?? "",
    }),
  );
  const listName = new Map(lists.map((l) => [l.id, l.name]));
  const prospects = (await sql.query(`select * from cold_prospects order by id`)).map(
    (p): ColdProspect => ({
      id: Number(p.id),
      listId: Number(p.list_id),
      listName: listName.get(Number(p.list_id)) ?? "List",
      name: String(p.name),
      email: String(p.email),
      company: p.company == null ? null : String(p.company),
      title: p.title == null ? null : String(p.title),
      promoted: p.promoted_lead_id != null,
      promotedLeadId: p.promoted_lead_id == null ? null : Number(p.promoted_lead_id),
      repliedAt: iso(p.replied_at),
      lastTouchedAt: iso(p.last_touched_at),
    }),
  );
  const campaigns = (await sql.query(`select * from cold_campaigns order by id desc`)).map(
    (c): ColdCampaign => ({
      id: Number(c.id),
      name: String(c.name),
      subject: String(c.subject),
      listIds: parseIds(c.list_ids),
      tag: c.tag == null || c.tag === "" ? null : String(c.tag),
      sent: Number(c.sent_count),
      skipped: Number(c.skipped),
      createdAt: iso(c.created_at) ?? "",
    }),
  );
  const unique = new Map<string, ColdProspect[]>();
  for (const p of prospects) {
    const k = p.email.toLowerCase();
    const arr = unique.get(k) ?? [];
    arr.push(p);
    unique.set(k, arr);
  }
  const uniqueCold = [...unique.values()].filter((arr) => arr.every((p) => !p.promoted)).length;
  const uniquePromoted = [...unique.values()].filter((arr) => arr.some((p) => p.promoted)).length;
  const inFunnel = Number(
    (await sql.query(`select count(*) as c from leads where source in ('Cold reply','cold-reply')`))[0]?.c ?? 0,
  );
  const leaked = Number(
    (
      await sql.query(
        `select count(*) as c from deals d
         where exists (
           select 1 from cold_prospects p
           where p.promoted_lead_id is null
             and d.person_id is not null
             and exists (select 1 from people pe where pe.id = d.person_id and lower(pe.email) = lower(p.email))
         )`,
      )
    )[0]?.c ?? 0,
  );
  const tags = [...new Set(lists.flatMap((l) => l.tags))].sort();
  return {
    lists,
    prospects,
    campaigns,
    tags,
    scanned,
    stats: {
      lists: lists.length,
      records: prospects.length,
      uniqueCold,
      uniquePromoted,
      inFunnel,
      leaked,
    },
  };
}

export const getColdDesk = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    return loadDesk(sql);
  });

export const createColdList = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { name: string; tags?: string; source?: string; notes?: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const name = data.name.trim();
    if (!name) return { ok: false as const, error: "Name the list" };
    await sql.query(`insert into cold_lists (name, tags, source, notes) values ($1,$2,$3,$4)`, [
      name,
      data.tags?.trim() || null,
      data.source?.trim() || "manual",
      data.notes?.trim() || null,
    ]);
    return { ok: true as const, error: null as string | null };
  });

export const bulkImportCold = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { listId?: number; newName?: string; newTags?: string; paste: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = parsePaste(data.paste);
    if (!rows.length) return { ok: false as const, error: "No emails found in the paste", imported: 0, skipped: 0 };
    let listId = data.listId ?? 0;
    if (!listId) {
      const name = (data.newName ?? "").trim() || "Imported list";
      const created = await sql.query(`insert into cold_lists (name, tags, source) values ($1,$2,'manual') returning id`, [
        name,
        data.newTags?.trim() || null,
      ]);
      listId = Number(created[0].id);
    }
    let imported = 0;
    let skipped = 0;
    for (const row of rows) {
      const dup = await sql.query(`select id from cold_prospects where list_id = $1 and lower(email) = $2`, [
        listId,
        row.email,
      ]);
      if (dup[0]) {
        skipped += 1;
        continue;
      }
      await sql.query(`insert into cold_prospects (list_id, name, email, company) values ($1,$2,$3,$4)`, [
        listId,
        row.name,
        row.email,
        row.company ?? null,
      ]);
      imported += 1;
    }
    return { ok: true as const, error: null as string | null, imported, skipped, listId };
  });

export const recordColdReply = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const p = (await sql.query(`select * from cold_prospects where id = $1`, [data.id]))[0];
    if (!p) return { ok: false as const, error: "Not on a cold list" };
    const at = new Date().toISOString();
    const r = await promoteEmail(sql, String(p.email), at, "Marked as reply on the cold desk");
    return { ok: r.ok, leadId: r.leadId, error: r.ok ? null : "Could not promote" };
  });

export const campaignCold = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { name?: string; subject: string; body: string; listIds: number[]; tag?: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const lists = (await sql.query(`select * from cold_lists`)).map((l) => ({
      id: Number(l.id),
      tags: splitTags(l.tags),
    }));
    const tag = data.tag?.trim().toLowerCase() || "";
    const selected = new Set(data.listIds);
    for (const l of lists) {
      if (tag && l.tags.includes(tag)) selected.add(l.id);
    }
    if (!selected.size) return { ok: false as const, sent: 0, skipped: 0, error: "Pick a list or a tag" };
    const ids = [...selected];
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(",");
    const prospects = await sql.query(
      `select * from cold_prospects where list_id in (${placeholders}) order by id`,
      ids,
    );
    const seen = new Set<string>();
    let sent = 0;
    let skipped = 0;
    const campaign = await sql.query(
      `insert into cold_campaigns (name, subject, body, list_ids, tag, sent_count, skipped)
       values ($1,$2,$3,$4,$5,0,0) returning id`,
      [
        data.name?.trim() || data.subject,
        data.subject,
        data.body,
        ids.join(","),
        tag || null,
      ],
    );
    const campaignId = Number(campaign[0].id);
    for (const p of prospects) {
      const email = String(p.email).toLowerCase();
      if (seen.has(email)) {
        skipped += 1;
        continue;
      }
      seen.add(email);
      if (p.promoted_lead_id != null) {
        skipped += 1;
        continue;
      }
      const first = String(p.name).split(" ")[0] ?? "there";
      await insertOutbound(sql, {
        purpose: "workflow",
        toAddr: String(p.email),
        subject: data.subject,
        body: data.body.replaceAll("{{first}}", first).replaceAll("{{name}}", String(p.name)),
        fallbackName: "Northline Shows",
        hintAddr: "shows@hurricaneproductionsllc.com",
      });
      await sql.query(`update cold_prospects set last_touched_at = now() where id = $1`, [Number(p.id)]);
      await sql.query(`insert into cold_touches (prospect_id, campaign_id, kind, detail) values ($1,$2,'campaign',$3)`, [
        Number(p.id),
        campaignId,
        data.subject,
      ]);
      sent += 1;
    }
    await sql.query(`update cold_campaigns set sent_count = $1, skipped = $2 where id = $3`, [sent, skipped, campaignId]);
    return { ok: true as const, sent, skipped, error: null as string | null };
  });
