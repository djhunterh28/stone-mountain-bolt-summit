import { createServerFn } from "@tanstack/react-start";
import { getSql, type Sql } from "@/lib/db";
import { iso, money } from "@/lib/utils";
import { authMiddleware } from "@/lib/auth/middleware";

function parseJson<T>(raw: unknown, fallback: T): T {
  if (raw == null) return fallback;
  if (typeof raw !== "string") return (raw as T) ?? fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function mintToken() {
  return `nlh_${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 6)}`;
}

export type HandoffReason = "subcontract" | "emergency" | "overflow";

export type PackCrew = { name: string; role: string; kind: string; startsAt: string | null; endsAt: string | null };
export type PackFile = { name: string; kind: string };
export type PackNote = { category: string; body: string };
export type PackGear = { name: string; qty: number; category: string };
export type PackFinding = { kind: string; severity: string; detail: string };
export type PackGuest = { name: string; party: number; rsvp: string; meal: string | null };
export type PackFloorMark = { kind: string; label: string };

export type HandoffPack = {
  title: string;
  venue: string | null;
  eventDate: string | null;
  loadIn: string | null;
  indoor: boolean | null;
  guestCount: number | null;
  notes: string | null;
  org: { name: string; address: string | null; city: string | null; phone: string | null } | null;
  person: { name: string; title: string | null; phone: string | null; email: string | null } | null;
  crew: PackCrew[];
  files: PackFile[];
  notesList: PackNote[];
  gear: PackGear[];
  findings: PackFinding[];
  guests: PackGuest[];
  floor: { name: string; venue: string | null; notes: string | null; marks: PackFloorMark[] } | null;
};

export type Withheld = { value: number; invoices: number; invoiceTotal: number };

export type HandoffRow = {
  id: number;
  dealId: number | null;
  deal: string | null;
  venue: string | null;
  eventDate: string | null;
  value: number;
  to: string;
  reason: HandoffReason;
  cover: string | null;
  token: string | null;
  finance: boolean;
  monitor: boolean;
  status: string;
  createdAt: string | null;
  lastOpenedAt: string | null;
  lastPingAt: string | null;
  pack: HandoffPack | null;
};

export type HandoffVendor = { name: string; category: string; city: string | null; available: boolean };
export type HandoffDeal = {
  id: number;
  title: string;
  venue: string | null;
  eventDate: string | null;
  value: number;
  status: string;
  loadIn: string | null;
};

function emptyPack(): HandoffPack {
  return {
    title: "Recalled",
    venue: null,
    eventDate: null,
    loadIn: null,
    indoor: null,
    guestCount: null,
    notes: null,
    org: null,
    person: null,
    crew: [],
    files: [],
    notesList: [],
    gear: [],
    findings: [],
    guests: [],
    floor: null,
  };
}

function asPack(raw: unknown): HandoffPack | null {
  if (!raw || typeof raw !== "object") return null;
  const snap = raw as Partial<HandoffPack>;
  if (!snap.title) return null;
  return {
    title: String(snap.title),
    venue: snap.venue == null ? null : String(snap.venue),
    eventDate: snap.eventDate == null ? null : String(snap.eventDate),
    loadIn: snap.loadIn == null ? null : String(snap.loadIn),
    indoor: snap.indoor == null ? null : Boolean(snap.indoor),
    guestCount: snap.guestCount == null ? null : Number(snap.guestCount),
    notes: snap.notes == null ? null : String(snap.notes),
    org: snap.org ?? null,
    person: snap.person ?? null,
    crew: Array.isArray(snap.crew) ? snap.crew : [],
    files: Array.isArray(snap.files) ? snap.files : [],
    notesList: Array.isArray(snap.notesList) ? snap.notesList : [],
    gear: Array.isArray(snap.gear) ? snap.gear : [],
    findings: Array.isArray(snap.findings) ? snap.findings : [],
    guests: Array.isArray(snap.guests) ? snap.guests : [],
    floor: snap.floor ?? null,
  };
}

async function packDeal(sql: Sql, dealId: number): Promise<{ pack: HandoffPack; withheld: Withheld } | null> {
  const d = (
    await sql.query(
      `select d.title, d.venue, d.event_date, d.load_in, d.indoor, d.guest_count, d.notes, d.value,
              o.name as org, o.address, o.city, o.phone as org_phone,
              p.name as person, p.title as person_title, p.phone as person_phone, p.email as person_email
         from deals d
         left join organizations o on o.id = d.org_id
         left join people p on p.id = d.person_id
        where d.id = $1`,
      [dealId],
    )
  )[0];
  if (!d) return null;
  const crew = await sql.query(
    `select m.name, s.role, s.kind, s.starts_at, s.ends_at
       from crew_shifts s join members m on m.id = s.member_id
      where s.deal_id = $1 order by s.starts_at`,
    [dealId],
  );
  const files = await sql.query(`select name, kind from files where entity_type = 'deal' and entity_id = $1 order by id`, [dealId]);
  const notes = await sql.query(`select category, body from event_notes where deal_id = $1 order by pinned desc, id`, [dealId]);
  const gear = await sql.query(
    `select p.name, p.category, dp.qty
       from deal_products dp join products p on p.id = dp.product_id
      where dp.deal_id = $1
      order by p.category, p.name`,
    [dealId],
  );
  const findings = await sql.query(
    `select kind, severity, detail from prep_findings
      where deal_id = $1 and coalesce(dismissed, false) is not true order by id`,
    [dealId],
  );
  const guests = await sql.query(`select name, party, rsvp, meal from guests where deal_id = $1 order by id`, [dealId]);
  const floorRow = d.venue
    ? (
        await sql.query(
          `select name, venue, notes, marks from floor_plans
            where venue = $1 and coalesce(archived, false) is not true order by id limit 1`,
          [String(d.venue)],
        )
      )[0]
    : undefined;
  const inv = (
    await sql.query(`select count(*) as n, coalesce(sum(amount), 0) as total from invoices where deal_id = $1`, [dealId])
  )[0];
  const floorMarks = parseJson<{ kind?: string; label?: string }[]>(floorRow?.marks, []);
  const pack: HandoffPack = {
    title: String(d.title),
    venue: d.venue == null ? null : String(d.venue),
    eventDate: iso(d.event_date)?.slice(0, 10) ?? null,
    loadIn: d.load_in == null ? null : String(d.load_in),
    indoor: d.indoor == null ? null : Boolean(d.indoor),
    guestCount: d.guest_count == null ? null : Number(d.guest_count),
    notes: d.notes == null ? null : String(d.notes),
    org: d.org
      ? {
          name: String(d.org),
          address: d.address == null ? null : String(d.address),
          city: d.city == null ? null : String(d.city),
          phone: d.org_phone == null ? null : String(d.org_phone),
        }
      : null,
    person: d.person
      ? {
          name: String(d.person),
          title: d.person_title == null ? null : String(d.person_title),
          phone: d.person_phone == null ? null : String(d.person_phone),
          email: d.person_email == null ? null : String(d.person_email),
        }
      : null,
    crew: crew.map((c) => ({
      name: String(c.name),
      role: String(c.role),
      kind: String(c.kind),
      startsAt: iso(c.starts_at),
      endsAt: iso(c.ends_at),
    })),
    files: files.map((f) => ({ name: String(f.name), kind: String(f.kind) })),
    notesList: notes.map((n) => ({ category: String(n.category), body: String(n.body) })),
    gear: gear.map((g) => ({ name: String(g.name), qty: Number(g.qty), category: String(g.category) })),
    findings: findings.map((f) => ({
      kind: String(f.kind),
      severity: String(f.severity),
      detail: String(f.detail),
    })),
    guests: guests.map((g) => ({
      name: String(g.name),
      party: Number(g.party ?? 1),
      rsvp: String(g.rsvp ?? "pending"),
      meal: g.meal == null ? null : String(g.meal),
    })),
    floor: floorRow
      ? {
          name: String(floorRow.name),
          venue: floorRow.venue == null ? null : String(floorRow.venue),
          notes: floorRow.notes == null ? null : String(floorRow.notes),
          marks: floorMarks
            .filter((m) => m.label)
            .map((m) => ({ kind: String(m.kind ?? "power"), label: String(m.label) })),
        }
      : null,
  };
  return {
    pack,
    withheld: {
      value: money(d.value),
      invoices: Number(inv?.n ?? 0),
      invoiceTotal: money(inv?.total),
    },
  };
}

function mapRow(h: Record<string, unknown>, pack: HandoffPack | null): HandoffRow {
  const reason = String(h.reason ?? "subcontract");
  return {
    id: Number(h.id),
    dealId: h.deal_id == null ? null : Number(h.deal_id),
    deal: h.deal == null ? null : String(h.deal),
    venue: h.venue == null ? null : String(h.venue),
    eventDate: iso(h.event_date)?.slice(0, 10) ?? null,
    value: money(h.value),
    to: String(h.to_company),
    reason: reason === "emergency" || reason === "overflow" ? reason : "subcontract",
    cover: h.cover == null ? null : String(h.cover),
    token: h.token == null ? null : String(h.token),
    finance: false,
    monitor: Boolean(h.monitor),
    status: String(h.status),
    createdAt: iso(h.created_at),
    lastOpenedAt: iso(h.last_opened_at),
    lastPingAt: iso(h.last_ping_at),
    pack,
  };
}

async function loadDesk(sql: Sql) {
  const rows = await sql`select h.*, d.title as deal, d.venue, d.event_date, d.value
    from handoffs h left join deals d on d.id = h.deal_id
    order by h.id desc`;
  const packs: HandoffRow[] = [];
  for (const h of rows) {
    const packed = asPack(parseJson(h.snapshot, {}));
    const live = !packed && h.deal_id != null ? await packDeal(sql, Number(h.deal_id)) : null;
    if (!packed && live && h.id != null) {
      await sql.query(`update handoffs set snapshot = $1, include_finance = false where id = $2 and (snapshot is null or snapshot = '{}')`, [
        JSON.stringify(live.pack),
        Number(h.id),
      ]);
    }
    packs.push(mapRow(h, packed ?? live?.pack ?? null));
  }
  const vendors = (
    await sql`select name, category, city, available from directory_vendors where name <> 'Northline' order by name`
  ).map((v) => ({
    name: String(v.name),
    category: String(v.category),
    city: v.city == null ? null : String(v.city),
    available: Boolean(v.available),
  }));
  const deals = (
    await sql`select id, title, venue, event_date, value, status, load_in from deals
      where status in ('open','won') and event_date is not null
      order by (event_date < current_date)::int, event_date`
  ).map((d) => ({
    id: Number(d.id),
    title: String(d.title),
    venue: d.venue == null ? null : String(d.venue),
    eventDate: iso(d.event_date)?.slice(0, 10) ?? null,
    value: money(d.value),
    status: String(d.status),
    loadIn: d.load_in == null ? null : String(d.load_in),
  }));
  return { packs, vendors, deals };
}

export const getHandoffDesk = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => loadDesk(await getSql()));

export const getHandoffs = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => (await loadDesk(await getSql())).packs);

export const previewHandoff = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { dealId: number }) => input)
  .handler(async ({ data }) => {
    const built = await packDeal(await getSql(), data.dealId);
    return built ?? { pack: null as HandoffPack | null, withheld: { value: 0, invoices: 0, invoiceTotal: 0 } };
  });

export const sendHandoff = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { dealId: number; to: string; monitor: boolean; reason: HandoffReason; cover?: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const built = await packDeal(sql, data.dealId);
    if (!built) return { ok: false as const };
    const to = data.to.trim();
    if (!to) return { ok: false as const };
    const token = mintToken();
    const rows = await sql.query(
      `insert into handoffs (deal_id, to_company, include_finance, monitor, status, token, reason, cover, snapshot)
       values ($1,$2,false,$3,'sent',$4,$5,$6,$7) returning id, token`,
      [data.dealId, to, data.monitor, token, data.reason, data.cover?.trim() || null, JSON.stringify(built.pack)],
    );
    return { ok: true as const, id: Number(rows[0].id), token: String(rows[0].token) };
  });

export const setHandoffMonitor = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; monitor: boolean }) => input)
  .handler(async ({ data }) => {
    await (await getSql()).query(`update handoffs set monitor = $1 where id = $2`, [data.monitor, data.id]);
    return { ok: true as const };
  });

export const recallHandoff = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    await (await getSql()).query(`update handoffs set status = 'recalled', monitor = false where id = $1`, [data.id]);
    return { ok: true as const };
  });

export type PublicHandoff = {
  to: string;
  reason: HandoffReason;
  cover: string | null;
  status: string;
  monitor: boolean;
  pack: HandoffPack;
  finance: false;
};

export const getHandoffPublic = createServerFn({ method: "GET" })
  .validator((input: { token: string }) => input)
  .handler(async ({ data }): Promise<PublicHandoff | null> => {
    const sql = await getSql();
    const h = (await sql.query(`select * from handoffs where token = $1`, [data.token.trim()]))[0];
    if (!h) return null;
    const reasonRaw = String(h.reason ?? "subcontract");
    const reason: HandoffReason = reasonRaw === "emergency" || reasonRaw === "overflow" ? reasonRaw : "subcontract";
    if (String(h.status) === "recalled") {
      return {
        to: String(h.to_company),
        reason,
        cover: null,
        status: "recalled",
        monitor: false,
        finance: false,
        pack: emptyPack(),
      };
    }
    let pack = asPack(parseJson(h.snapshot, {}));
    if (!pack && h.deal_id != null) {
      const live = await packDeal(sql, Number(h.deal_id));
      pack = live?.pack ?? null;
      if (pack) {
        await sql.query(`update handoffs set snapshot = $1, include_finance = false where id = $2`, [
          JSON.stringify(pack),
          Number(h.id),
        ]);
      }
    }
    if (!pack) return null;
    return {
      to: String(h.to_company),
      reason,
      cover: h.cover == null ? null : String(h.cover),
      status: String(h.status),
      monitor: Boolean(h.monitor),
      finance: false,
      pack,
    };
  });

export const pingHandoff = createServerFn({ method: "POST" })
  .validator((input: { token: string; status?: "on_site" | "complete" }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const h = (await sql.query(`select id, status, monitor from handoffs where token = $1`, [data.token.trim()]))[0];
    if (!h || String(h.status) === "recalled") return { ok: false as const };
    const next = data.status ?? (String(h.status) === "sent" ? "opened" : String(h.status));
    await sql.query(
      `update handoffs set last_opened_at = coalesce(last_opened_at, now()), last_ping_at = now(),
        status = case when status in ('recalled','complete') then status else $1 end
       where id = $2`,
      [next, Number(h.id)],
    );
    return { ok: true as const, status: next, monitor: Boolean(h.monitor) };
  });
