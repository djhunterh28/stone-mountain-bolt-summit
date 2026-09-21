import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { iso, money } from "@/lib/utils";
import { authMiddleware } from "@/lib/auth/middleware";

function parseHour(raw: unknown): number {
  const s = raw == null ? "" : String(raw);
  const isoMatch = /T(\d{2}):(\d{2})/.exec(s);
  if (isoMatch) return Number(isoMatch[1]) + Number(isoMatch[2]) / 60;
  const clock = /(\d{1,2}):(\d{2})/.exec(s);
  if (clock) return Number(clock[1]) + Number(clock[2]) / 60;
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return d.getHours() + d.getMinutes() / 60;
  return 8;
}

function dayKey(raw: unknown): string {
  const s = iso(raw) ?? String(raw ?? "");
  return s.slice(0, 10);
}

export type ViewShow = {
  id: number;
  title: string;
  venue: string | null;
  eventDate: string;
  loadHour: number;
  endHour: number;
  status: string;
  ownerName: string | null;
  indoor: boolean | null;
  guestCount: number | null;
  value: number;
};

export type ViewShift = {
  id: number;
  dealId: number;
  deal: string;
  venue: string | null;
  member: string;
  role: string;
  kind: string;
  day: string;
  startHour: number;
  endHour: number;
};

export type InquiryDay = {
  day: string;
  n: number;
  leads: number;
  deals: number;
  forms: number;
};

export const getUniqueViews = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const dealRows = await sql.query(
      `select d.id, d.title, d.venue, d.event_date, d.load_in, d.status, d.indoor, d.guest_count, d.value, m.name as owner_name
       from deals d left join members m on m.id = d.owner_id
       where d.event_date is not null
         and d.status not in ('lost', 'cancelled')
       order by d.event_date`,
    );
    const shows: ViewShow[] = dealRows.map((d) => {
      const loadHour = parseHour(d.load_in);
      const indoor = d.indoor == null ? null : Boolean(d.indoor);
      const guests = d.guest_count == null ? null : Number(d.guest_count);
      const span = indoor === false || (guests ?? 0) > 500 ? 14 : 12;
      return {
        id: Number(d.id),
        title: String(d.title),
        venue: d.venue == null ? null : String(d.venue),
        eventDate: dayKey(d.event_date),
        loadHour,
        endHour: Math.min(24, loadHour + span),
        status: String(d.status),
        ownerName: d.owner_name == null ? null : String(d.owner_name),
        indoor,
        guestCount: guests,
        value: money(d.value),
      };
    });

    const shiftRows = await sql.query(
      `select s.*, m.name as member, d.title as deal, d.venue
       from crew_shifts s
       left join members m on m.id = s.member_id
       left join deals d on d.id = s.deal_id
       order by s.starts_at`,
    );
    const shifts: ViewShift[] = shiftRows.map((s) => ({
      id: Number(s.id),
      dealId: Number(s.deal_id),
      deal: String(s.deal ?? ""),
      venue: s.venue == null ? null : String(s.venue),
      member: String(s.member ?? ""),
      role: String(s.role),
      kind: String(s.kind),
      day: dayKey(s.starts_at),
      startHour: parseHour(s.starts_at),
      endHour: Math.max(parseHour(s.starts_at) + 0.5, parseHour(s.ends_at)),
    }));

    const log = await sql.query(`select * from inquiry_log order by day`).catch(() => []);
    const inquiry: InquiryDay[] = log.map((r) => ({
      day: dayKey(r.day),
      leads: Number(r.leads ?? 0),
      deals: Number(r.deals ?? 0),
      forms: Number(r.forms ?? 0),
      n: Number(r.leads ?? 0) + Number(r.deals ?? 0) + Number(r.forms ?? 0),
    }));

    if (inquiry.length === 0) {
      const created = await sql.query(
        `select created_at::date as day, count(*)::int as n from deals group by 1
         union all
         select created_at::date, count(*)::int from leads group by 1`,
      );
      const map = new Map<string, InquiryDay>();
      for (const r of created) {
        const day = dayKey(r.day);
        const cur = map.get(day) ?? { day, n: 0, leads: 0, deals: 0, forms: 0 };
        cur.deals += Number(r.n);
        cur.n += Number(r.n);
        map.set(day, cur);
      }
      inquiry.push(...map.values());
    }

    return { shows, shifts, inquiry };
  });
