import { createServerFn } from "@tanstack/react-start";
import { getSql, type Sql } from "@/lib/db";
import { iso } from "@/lib/utils";
import { authMiddleware } from "@/lib/auth/middleware";
import { insertOutbound } from "./domain";

export type ScheduleProvider = "calendly" | "tidycal" | "acuity" | "zoom" | "meet";

export type ScheduleConnection = {
  id: number;
  memberId: number;
  memberName: string | null;
  provider: ScheduleProvider;
  handle: string;
  tokenHint: string | null;
  connected: boolean;
  autoZoom: boolean;
  autoMeet: boolean;
  confirmEmail: boolean;
  lastSync: string | null;
};

export type CalendlyType = {
  id: number;
  memberId: number | null;
  name: string;
  slug: string;
  durationMin: number;
  calendlyUrl: string;
  active: boolean;
  linkId: number | null;
  source: string;
};

export type ScheduleBooking = {
  id: number;
  linkId: number | null;
  linkName: string | null;
  source: string;
  calendlyUrl: string | null;
  hostId: number | null;
  hostName: string | null;
  hostEmail: string | null;
  guestName: string;
  guestEmail: string;
  startsAt: string;
  notes: string | null;
  status: string;
  durationMin: number;
  zoomMeetingId: string | null;
  zoomJoinUrl: string | null;
  zoomPasscode: string | null;
  meetCode: string | null;
  meetJoinUrl: string | null;
  confirmationSentAt: string | null;
  calendlyEventUri: string | null;
};

function asProvider(v: unknown): ScheduleProvider {
  const p = String(v);
  if (p === "tidycal" || p === "acuity" || p === "zoom" || p === "calendly" || p === "meet") return p;
  return "calendly";
}

function eventUrl(provider: ScheduleProvider, handle: string, slug: string) {
  if (provider === "tidycal") return `https://tidycal.com/${handle}/${slug}`;
  if (provider === "acuity") return `https://${handle}.acuityscheduling.com/schedule.php?appointmentType=${slug}`;
  return `https://calendly.com/${handle}/${slug}`;
}

function tokenPrefix(provider: ScheduleProvider) {
  if (provider === "zoom") return "zm";
  if (provider === "meet") return "gmt";
  if (provider === "tidycal") return "td";
  if (provider === "acuity") return "aq";
  return "cal";
}

export function mintMeet(seed: string) {
  let n = 0;
  for (let i = 0; i < seed.length; i++) n = (n * 33 + seed.charCodeAt(i)) >>> 0;
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const chunk = (len: number, salt: number) => {
    let s = "";
    let x = n + salt;
    for (let i = 0; i < len; i++) {
      s += letters[x % 26];
      x = Math.imul(x, 17) >>> 0;
    }
    return s;
  };
  const code = `${chunk(3, 3)}-${chunk(4, 11)}-${chunk(3, 29)}`;
  return { code, join: `https://meet.google.com/${code}` };
}

function mintZoom(seed: string) {
  let n = 0;
  for (let i = 0; i < seed.length; i++) n = (n * 33 + seed.charCodeAt(i)) >>> 0;
  const id = String(800_0000_0000 + (n % 199_9999_9999));
  const pass = (n.toString(36) + "nlzoom").slice(0, 6).toUpperCase();
  return {
    id,
    pass,
    join: `https://northline.zoom.us/j/${id}?pwd=${pass.toLowerCase()}`,
  };
}

function nyStamp(isoStr: string) {
  const d = new Date(isoStr);
  return d.toLocaleString("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

async function fulfillBooking(sql: Sql, bookingId: number) {
  const rows = await sql.query(
    `select b.*, l.name as link_name, l.duration_min as link_duration, l.member_id, l.source,
            m.name as host_name, m.email as host_email
     from bookings b
     left join scheduler_links l on l.id = b.link_id
     left join members m on m.id = l.member_id
     where b.id = $1`,
    [bookingId],
  );
  const b = rows[0];
  if (!b) return null;
  const memberId = b.member_id == null ? null : Number(b.member_id);
  const connections =
    memberId == null
      ? []
      : await sql.query(`select * from scheduling_connections where member_id = $1 and connected = true`, [memberId]);
  const zoomConn = connections.find((c) => String(c.provider) === "zoom");
  const meetConn = connections.find((c) => String(c.provider) === "meet");
  const calConn = connections.find((c) => String(c.provider) === "calendly");
  const confirm = connections.length === 0 || connections.some((c) => Boolean(c.confirm_email));
  const autoZoom = Boolean(zoomConn) && (zoomConn ? Boolean(zoomConn.auto_zoom) : true);
  const autoMeet = Boolean(meetConn) && (meetConn ? Boolean(meetConn.auto_meet ?? true) : true);
  const duration = Number(b.duration_min ?? b.link_duration ?? 30);
  const title = String(b.link_name ?? "Northline consult");
  const hostName = b.host_name == null ? "Northline" : String(b.host_name);
  const hostEmail = b.host_email == null ? "ops@northline.av" : String(b.host_email);
  const guest = String(b.guest_name);
  const guestEmail = String(b.guest_email);
  const starts = iso(b.starts_at) ?? new Date().toISOString();

  let zoomId = b.zoom_meeting_id == null ? null : String(b.zoom_meeting_id);
  let zoomJoin = b.zoom_join_url == null ? null : String(b.zoom_join_url);
  let zoomPass = b.zoom_passcode == null ? null : String(b.zoom_passcode);

  if (autoZoom && !zoomJoin) {
    const z = mintZoom(`${bookingId}:${starts}:${guestEmail}`);
    zoomId = z.id;
    zoomJoin = z.join;
    zoomPass = z.pass;
    await sql.query(
      `update bookings set zoom_meeting_id = $1, zoom_join_url = $2, zoom_passcode = $3, duration_min = $4, status = 'confirmed' where id = $5`,
      [zoomId, zoomJoin, zoomPass, duration, bookingId],
    );
  } else {
    await sql.query(`update bookings set duration_min = $1, status = 'confirmed' where id = $2`, [duration, bookingId]);
  }

  if (confirm) {
    const when = nyStamp(starts);
    const first = guest.split(" ")[0] ?? guest;
    const zoomLine = zoomJoin ? `Zoom: ${zoomJoin}  (passcode ${zoomPass})` : "We will send a venue call sheet separately.";
    const body = `Hi ${first} —\n\nYou are confirmed with ${hostName} for ${title} on ${when} ET (${duration} min).\n\n${zoomLine}\n\nReply to this thread if the hold moves. The Gowanus shop is on 718-555-0140.\n\n— ${hostName}\nHurricane Productions`;
    await insertOutbound(sql, {
      purpose: "workflow",
      mailKind: "transactional",
      toAddr: guestEmail,
      subject: `Confirmed: ${title} — ${when}`,
      body,
      fallbackName: hostName,
      hintAddr: hostEmail,
    });
    await sql.query(`update bookings set confirmation_sent_at = now() where id = $1`, [bookingId]);
  }

  await sql.query(
    `insert into notifications (member_id, kind, title, body, href, read)
     values ($1, 'booking', $2, $3, '/scheduler', false)`,
    [
      memberId ?? 1,
      `${guest} booked ${title}`,
      `${nyStamp(starts)} · ${guestEmail}${zoomJoin ? " · Zoom created" : ""}`,
    ],
  );

  if (calConn) {
    await sql.query(`update scheduling_connections set last_sync = now() where id = $1`, [Number(calConn.id)]);
  }

  return {
    zoomJoinUrl: zoomJoin,
    zoomPasscode: zoomPass,
    hostName,
    startsAt: starts,
    durationMin: duration,
    title,
    confirmationSent: confirm,
  };
}

function mapConnection(r: Record<string, unknown>): ScheduleConnection {
  return {
    id: Number(r.id),
    memberId: Number(r.member_id),
    memberName: r.member_name == null ? null : String(r.member_name),
    provider: asProvider(r.provider),
    handle: String(r.handle),
    tokenHint: r.token_hint == null ? null : String(r.token_hint),
    connected: Boolean(r.connected),
    autoZoom: Boolean(r.auto_zoom),
    confirmEmail: Boolean(r.confirm_email),
    lastSync: iso(r.last_sync),
  };
}

function mapBooking(r: Record<string, unknown>): ScheduleBooking {
  return {
    id: Number(r.id),
    linkId: r.link_id == null ? null : Number(r.link_id),
    linkName: r.link_name == null ? null : String(r.link_name),
    source: String(r.source ?? "northline"),
    calendlyUrl: r.calendly_url == null ? null : String(r.calendly_url),
    hostId: r.member_id == null ? null : Number(r.member_id),
    hostName: r.host_name == null ? null : String(r.host_name),
    hostEmail: r.host_email == null ? null : String(r.host_email),
    guestName: String(r.guest_name),
    guestEmail: String(r.guest_email),
    startsAt: iso(r.starts_at) ?? "",
    notes: r.notes == null ? null : String(r.notes),
    status: String(r.status ?? "confirmed"),
    durationMin: Number(r.link_duration ?? r.duration_min ?? 30),
    zoomMeetingId: r.zoom_meeting_id == null ? null : String(r.zoom_meeting_id),
    zoomJoinUrl: r.zoom_join_url == null ? null : String(r.zoom_join_url),
    zoomPasscode: r.zoom_passcode == null ? null : String(r.zoom_passcode),
    confirmationSentAt: iso(r.confirmation_sent_at),
    calendlyEventUri: r.calendly_event_uri == null ? null : String(r.calendly_event_uri),
  };
}

export async function completeNewBooking(sql: Sql, bookingId: number) {
  return fulfillBooking(sql, bookingId);
}

export const getSchedulingDesk = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const connections = (
      await sql`select c.*, m.name as member_name from scheduling_connections c
        left join members m on m.id = c.member_id order by c.member_id, c.provider`
    ).map(mapConnection);
    const types = (
      await sql`select * from calendly_event_types order by member_id, duration_min`
    ).map(
      (r): CalendlyType => ({
        id: Number(r.id),
        memberId: r.member_id == null ? null : Number(r.member_id),
        name: String(r.name),
        slug: String(r.slug),
        durationMin: Number(r.duration_min),
        calendlyUrl: String(r.calendly_url),
        active: Boolean(r.active),
        linkId: r.link_id == null ? null : Number(r.link_id),
        source: r.source == null ? "calendly" : String(r.source),
      }),
    );
    const bookings = (
      await sql.query(
        `select b.*, l.name as link_name, l.duration_min as link_duration, l.member_id, l.source, l.calendly_url,
                m.name as host_name, m.email as host_email
         from bookings b
         left join scheduler_links l on l.id = b.link_id
         left join members m on m.id = l.member_id
         order by b.starts_at`,
      )
    ).map(mapBooking);
    return { connections, types, bookings };
  });

export const connectScheduler = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { memberId: number; provider: ScheduleProvider; handle: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    let handle = data.handle.trim().replace(/^https?:\/\//i, "").replace(/\/$/, "");
    handle = handle
      .replace(/^(calendly\.com|tidycal\.com)\//i, "")
      .replace(/\.acuityscheduling\.com.*$/i, "");
    if (!handle) return { ok: false as const, error: "Handle required" };
    const hint = `${tokenPrefix(data.provider)}_live_${Math.random().toString(36).slice(2, 6)}…`;
    const existing = await sql.query(
      `select id from scheduling_connections where member_id = $1 and provider = $2`,
      [data.memberId, data.provider],
    );
    if (existing[0]) {
      await sql.query(
        `update scheduling_connections set handle = $1, token_hint = $2, connected = true, last_sync = now() where id = $3`,
        [handle, hint, Number(existing[0].id)],
      );
    } else {
      await sql.query(
        `insert into scheduling_connections (member_id, provider, handle, token_hint, connected, last_sync)
         values ($1,$2,$3,$4,true,now())`,
        [data.memberId, data.provider, handle, hint],
      );
    }
    if (data.provider !== "zoom") await importEventTypes(sql, data.memberId, handle, data.provider);
    return { ok: true as const };
  });

async function importEventTypes(sql: Sql, memberId: number, handle: string, provider: ScheduleProvider) {
  const member = (await sql`select name from members where id = ${memberId}`)[0];
  const first = String(member?.name ?? "AE").split(" ")[0];
  const conn = (
    await sql.query(`select id from scheduling_connections where member_id = $1 and provider = $2`, [memberId, provider])
  )[0];
  const presets =
    provider === "acuity"
      ? [{ name: `${first} — 45m estimate`, slug: "estimate", duration: 45 }]
      : provider === "tidycal"
        ? [
            { name: `${first} — load-in hold`, slug: "load-in", duration: 45 },
            { name: `${first} — 20m check`, slug: "check", duration: 20 },
          ]
        : [
            { name: `${first} — 30m intro`, slug: "30m-intro", duration: 30 },
            { name: `${first} — 15m follow-up`, slug: "15m-followup", duration: 15 },
          ];
  for (const p of presets) {
    const url = eventUrl(provider, handle, p.slug);
    const have = await sql.query(`select id from calendly_event_types where member_id = $1 and slug = $2 and source = $3`, [
      memberId,
      p.slug,
      provider,
    ]);
    if (have[0]) continue;
    const linkSlug = `${handle}-${p.slug}`.replace(/[^a-z0-9-]/g, "-");
    const link = await sql.query(
      `insert into scheduler_links (member_id, name, duration_min, slug, source, calendly_url, location_kind)
       values ($1,$2,$3,$4,$5,$6,'zoom') returning id`,
      [memberId, p.name, p.duration, linkSlug, provider, url],
    );
    await sql.query(
      `insert into calendly_event_types (member_id, connection_id, name, slug, duration_min, calendly_url, link_id, source)
       values ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [memberId, conn ? Number(conn.id) : null, p.name, p.slug, p.duration, url, Number(link[0].id), provider],
    );
  }
}

export const syncCalendly = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { memberId: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const conn = (
      await sql.query(
        `select * from scheduling_connections where member_id = $1 and provider = 'calendly' and connected = true`,
        [data.memberId],
      )
    )[0];
    if (!conn) return { ok: false as const, error: "Calendly is not connected", pulled: 0 };
    await importEventTypes(sql, data.memberId, String(conn.handle), "calendly");
    const links = await sql.query(`select id, name, duration_min from scheduler_links where member_id = $1 order by id`, [
      data.memberId,
    ]);
    const link = links[0];
    let pulled = 0;
    if (link) {
      const recent = await sql.query(
        `select id from bookings where link_id = $1 and calendly_event_uri is not null and starts_at > now() - interval '2 days'`,
        [Number(link.id)],
      );
      if (!recent[0]) {
        const guest = data.memberId === 1 ? ["Amina Cole", "amina.cole@nike.com"] : ["Patrice Ng", "png@independents.nyc"];
        const starts = new Date(Date.now() + 36 * 36e5).toISOString();
        const ins = await sql.query(
          `insert into bookings (link_id, guest_name, guest_email, starts_at, notes, calendly_event_uri, status)
           values ($1,$2,$3,$4,'Pulled from Calendly', $5, 'confirmed') returning id`,
          [Number(link.id), guest[0], guest[1], starts, `https://calendly.com/events/${Date.now()}`],
        );
        await sql.query(`update scheduler_links set bookings = bookings + 1 where id = $1`, [Number(link.id)]);
        await fulfillBooking(sql, Number(ins[0].id));
        pulled = 1;
      }
    }
    await sql.query(`update scheduling_connections set last_sync = now() where id = $1`, [Number(conn.id)]);
    return { ok: true as const, pulled };
  });

export const syncScheduler = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { memberId: number; provider: ScheduleProvider }) => input)
  .handler(async ({ data }) => {
    if (data.provider === "zoom") return { ok: true as const, pulled: 0 };
    const sql = await getSql();
    const conn = (
      await sql.query(
        `select * from scheduling_connections where member_id = $1 and provider = $2 and connected = true`,
        [data.memberId, data.provider],
      )
    )[0];
    if (!conn) return { ok: false as const, error: `${data.provider} is not connected`, pulled: 0 };
    await importEventTypes(sql, data.memberId, String(conn.handle), data.provider);
    await sql.query(`update scheduling_connections set last_sync = now() where id = $1`, [Number(conn.id)]);
    return { ok: true as const, pulled: 0 };
  });

export const toggleConnection = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; connected?: boolean; autoZoom?: boolean; confirmEmail?: boolean }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    if (data.connected != null)
      await sql.query(`update scheduling_connections set connected = $1 where id = $2`, [data.connected, data.id]);
    if (data.autoZoom != null)
      await sql.query(`update scheduling_connections set auto_zoom = $1 where id = $2`, [data.autoZoom, data.id]);
    if (data.confirmEmail != null)
      await sql.query(`update scheduling_connections set confirm_email = $1 where id = $2`, [data.confirmEmail, data.id]);
    return { ok: true };
  });

export const resendConfirmation = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql.query(`update bookings set confirmation_sent_at = null where id = $1`, [data.id]);
    const result = await fulfillBooking(sql, data.id);
    return { ok: Boolean(result), confirmationSent: Boolean(result?.confirmationSent) };
  });

export const createZoomMeeting = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const b = (await sql`select * from bookings where id = ${data.id}`)[0];
    if (!b) return { ok: false as const, error: "Booking not found" };
    const z = mintZoom(`force:${data.id}:${iso(b.starts_at)}`);
    await sql.query(
      `update bookings set zoom_meeting_id = $1, zoom_join_url = $2, zoom_passcode = $3 where id = $4`,
      [z.id, z.join, z.pass, data.id],
    );
    return { ok: true as const, join: z.join, pass: z.pass };
  });
