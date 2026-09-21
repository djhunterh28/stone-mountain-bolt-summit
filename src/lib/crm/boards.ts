import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { iso, money } from "@/lib/utils";
import { authMiddleware } from "@/lib/auth/middleware";

export type BoardKind = "warehouse" | "office";
export type BoardLane = "going_out" | "on_site" | "returning";

export type DisplayBoard = {
  id: number;
  name: string;
  location: string;
  kind: BoardKind;
  token: string;
  tokenHint: string;
  active: boolean;
  lastSeen: string | null;
  createdAt: string;
};

export type BoardJob = {
  id: number;
  title: string;
  orgName: string | null;
  venue: string | null;
  loadIn: string | null;
  eventDate: string;
  guestCount: number | null;
  indoor: boolean | null;
  status: string;
  stageName: string | null;
  ownerName: string | null;
  ownerInitials: string | null;
  crewNames: string[];
  value: number;
  notes: string | null;
  lane: BoardLane;
  dayLabel: "yesterday" | "today" | "tomorrow";
  gear: string[];
  crew: number;
  trucks: number;
  truckLabels: string[];
};

export type BoardView = {
  board: { name: string; location: string; kind: BoardKind };
  generatedAt: string;
  jobs: BoardJob[];
};

function hint(token: string) {
  if (token.length < 10) return token;
  return `${token.slice(0, 8)}…${token.slice(-3)}`;
}

function mintToken() {
  const a = Math.random().toString(36).slice(2, 10);
  const b = Math.random().toString(36).slice(2, 10);
  return `nlb_${a}${b}`.slice(0, 22);
}

function nyToday(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date());
}

function nyMinutes(): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return h * 60 + m;
}

function dateKey(v: unknown): string {
  const s = iso(v);
  if (!s) return "";
  return s.slice(0, 10);
}

function parseLoad(loadIn: string | null): number | null {
  if (!loadIn) return null;
  const match = /^(\d{1,2}):(\d{2})/.exec(loadIn.trim());
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

function shiftDay(key: string, days: number): string {
  const [y, mo, d] = key.split("-").map(Number);
  const dt = new Date(Date.UTC(y, mo - 1, d + days));
  return dt.toISOString().slice(0, 10);
}

function laneFor(eventDate: string, loadIn: string | null): { lane: BoardLane; dayLabel: BoardJob["dayLabel"] } {
  const today = nyToday();
  const yesterday = shiftDay(today, -1);
  const tomorrow = shiftDay(today, 1);
  let dayLabel: BoardJob["dayLabel"] = "today";
  if (eventDate <= yesterday) dayLabel = "yesterday";
  else if (eventDate >= tomorrow) dayLabel = "tomorrow";

  if (eventDate < today) return { lane: "returning", dayLabel };
  if (eventDate > today) return { lane: "going_out", dayLabel };

  const load = parseLoad(loadIn);
  const now = nyMinutes();
  if (load == null) return { lane: now < 12 * 60 ? "going_out" : "on_site", dayLabel };
  if (now < load - 20) return { lane: "going_out", dayLabel };
  if (now > load + 10 * 60) return { lane: "returning", dayLabel };
  return { lane: "on_site", dayLabel };
}

function mapBoard(r: Record<string, unknown>): DisplayBoard {
  const token = String(r.token);
  return {
    id: Number(r.id),
    name: String(r.name),
    location: String(r.location),
    kind: r.kind === "office" ? "office" : "warehouse",
    token,
    tokenHint: hint(token),
    active: Boolean(r.active),
    lastSeen: iso(r.last_seen),
    createdAt: iso(r.created_at) ?? "",
  };
}

export const listBoards = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async (): Promise<DisplayBoard[]> => {
    const sql = await getSql();
    const rows = await sql`select * from display_boards order by id`;
    return rows.map(mapBoard);
  });

export const createBoard = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { name: string; location: string; kind: BoardKind }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const token = mintToken();
    const name = data.name.trim() || "Shop board";
    const location = data.location.trim() || "Warehouse";
    const kind = data.kind === "office" ? "office" : "warehouse";
    const rows = await sql.query(
      `insert into display_boards (name, location, kind, token) values ($1, $2, $3, $4) returning *`,
      [name, location, kind, token],
    );
    return mapBoard(rows[0]);
  });

export const rotateBoard = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const token = mintToken();
    const rows = await sql.query(
      `update display_boards set token = $1, last_seen = null where id = $2 and active = true returning *`,
      [token, data.id],
    );
    if (!rows[0]) return null;
    return mapBoard(rows[0]);
  });

export const revokeBoard = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`update display_boards set active = false where id = ${data.id}`;
    return { ok: true };
  });

export const getBoardPublic = createServerFn({ method: "GET" })
  .validator((input: { token: string }) => input)
  .handler(async ({ data }): Promise<BoardView | null> => {
    const token = data.token.trim();
    if (!token) return null;
    const sql = await getSql();
    const boards = await sql.query(`select * from display_boards where token = $1 and active = true`, [token]);
    if (!boards[0]) return null;
    await sql.query(`update display_boards set last_seen = now() where id = $1`, [Number(boards[0].id)]);

    const today = nyToday();
    const from = shiftDay(today, -1);
    const to = shiftDay(today, 2);
    const dealRows = await sql.query(
      `select d.id, d.title, d.value, d.event_date, d.venue, d.load_in, d.guest_count, d.indoor,
              d.status, d.notes, o.name as org_name, m.name as owner_name, m.initials as owner_initials,
              s.name as stage_name
       from deals d
       left join organizations o on o.id = d.org_id
       left join members m on m.id = d.owner_id
       left join stages s on s.id = d.stage_id
       where d.status not in ('lost', 'cancelled')
         and d.event_date is not null
         and d.event_date::date between $1::date and $2::date
       order by d.load_in nulls last, d.event_date, d.id`,
      [from, to],
    );
    const ids = dealRows.map((r) => Number(r.id)).filter((n) => Number.isInteger(n));
    const products =
      ids.length === 0
        ? []
        : await sql.query(
            `select dp.deal_id, pr.name, pr.category, dp.qty
             from deal_products dp
             join products pr on pr.id = dp.product_id
             where dp.deal_id in (${ids.join(",")})`,
          );

    const byDeal = new Map<number, { name: string; category: string; qty: number }[]>();
    for (const p of products) {
      const id = Number(p.deal_id);
      const list = byDeal.get(id) ?? [];
      list.push({ name: String(p.name), category: String(p.category), qty: money(p.qty) });
      byDeal.set(id, list);
    }

    const crewRows =
      ids.length === 0
        ? []
        : await sql.query(
            `select cs.deal_id, m.name, cs.role
             from crew_shifts cs
             join members m on m.id = cs.member_id
             where cs.deal_id in (${ids.join(",")})
             order by cs.starts_at`,
          ).catch(() => [] as Record<string, unknown>[]);
    const crewByDeal = new Map<number, string[]>();
    for (const c of crewRows) {
      const id = Number(c.deal_id);
      const label = `${String(c.name).split(" ")[0]}${c.role ? ` (${c.role})` : ""}`;
      const list = crewByDeal.get(id) ?? [];
      if (!list.includes(label)) list.push(label);
      crewByDeal.set(id, list);
    }

    const jobs: BoardJob[] = dealRows.map((r) => {
      const id = Number(r.id);
      const eventDate = dateKey(r.event_date);
      const loadIn = r.load_in == null ? null : String(r.load_in);
      const { lane, dayLabel } = laneFor(eventDate, loadIn);
      const items = byDeal.get(id) ?? [];
      const labor = items.filter((i) => i.category === "Labor");
      const transport = items.filter((i) => i.category === "Transport");
      const gear = items
        .filter((i) => i.category !== "Labor" && i.category !== "Transport" && i.category !== "Prep")
        .map((i) => (i.qty > 1 ? `${i.name} ×${Math.round(i.qty)}` : i.name))
        .slice(0, 5);
      return {
        id,
        title: String(r.title),
        orgName: r.org_name == null ? null : String(r.org_name),
        venue: r.venue == null ? null : String(r.venue),
        loadIn,
        eventDate,
        guestCount: r.guest_count == null ? null : Number(r.guest_count),
        indoor: r.indoor == null ? null : Boolean(r.indoor),
        status: String(r.status),
        stageName: r.stage_name == null ? null : String(r.stage_name),
        ownerName: r.owner_name == null ? null : String(r.owner_name),
        ownerInitials: r.owner_initials == null ? null : String(r.owner_initials),
        crewNames: (crewByDeal.get(id) ?? []).slice(0, 4),
        value: money(r.value),
        notes: r.notes == null ? null : String(r.notes),
        lane,
        dayLabel,
        gear,
        crew: labor.reduce((n, i) => n + i.qty, 0),
        trucks: transport.reduce((n, i) => n + i.qty, 0),
        truckLabels: transport.map((i) => (i.qty > 1 ? `${Math.round(i.qty)}× ${i.name}` : i.name)),
      };
    });

    return {
      board: {
        name: String(boards[0].name),
        location: String(boards[0].location),
        kind: boards[0].kind === "office" ? "office" : "warehouse",
      },
      generatedAt: new Date().toISOString(),
      jobs,
    };
  });
