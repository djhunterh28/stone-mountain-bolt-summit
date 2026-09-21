import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { iso } from "@/lib/utils";
import { authMiddleware } from "@/lib/auth/middleware";

const BORO: Record<string, [number, number]> = {
  Manhattan: [40.758, -73.9855],
  Brooklyn: [40.6782, -73.9442],
  Queens: [40.7282, -73.7949],
  Bronx: [40.8448, -73.8648],
  "Jersey City": [40.7178, -74.0431],
  "New York": [40.7128, -74.006],
};

function mapClient(r: Record<string, unknown>) {
  return {
    id: Number(r.id),
    name: String(r.name),
    email: r.email == null ? null : String(r.email),
    phone: r.phone == null ? null : String(r.phone),
    mobile: r.mobile == null ? null : String(r.mobile),
    title: r.title == null ? null : String(r.title),
    org: r.org_name == null ? null : String(r.org_name),
    orgId: r.org_id == null ? null : Number(r.org_id),
    city: r.city == null ? null : String(r.city),
    address: r.address == null ? null : String(r.address),
    lat: r.lat == null ? null : Number(r.lat),
    lng: r.lng == null ? null : Number(r.lng),
    geocodedAt: iso(r.geocoded_at),
    mail: r.mail == null ? true : Boolean(r.mail),
    sms: r.sms == null ? true : Boolean(r.sms),
    postal: r.postal == null ? false : Boolean(r.postal),
    shows: Number(r.shows ?? 0),
    lastTouch: iso(r.last_touch),
  };
}

export const getRegistryDesk = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const clients = (
      await sql.query(
        `select p.*, o.name as org_name, c.mail, c.sms, c.postal,
                (select count(*)::int from deals d where d.person_id = p.id) as shows,
                (select max(d.updated_at) from deals d where d.person_id = p.id) as last_touch
         from people p
         left join organizations o on o.id = p.org_id
         left join comm_prefs c on c.person_id = p.id
         order by p.name`,
      )
    ).map(mapClient);
    const geocoded = clients.filter((c) => c.lat != null && c.lng != null).length;
    const mailOff = clients.filter((c) => !c.mail).length;
    const smsOff = clients.filter((c) => !c.sms).length;
    return {
      clients,
      stats: {
        n: clients.length,
        geocoded,
        mailOff,
        smsOff,
        withAddress: clients.filter((c) => c.address).length,
      },
    };
  });

export const savePerson = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      id: number;
      name?: string;
      email?: string | null;
      phone?: string | null;
      mobile?: string | null;
      title?: string | null;
      city?: string | null;
      address?: string | null;
    }) => input,
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const cur = (await sql.query(`select * from people where id = $1`, [data.id]))[0];
    if (!cur) return { ok: false as const };
    await sql.query(
      `update people set name = $2, email = $3, phone = $4, mobile = $5, title = $6, city = $7, address = $8 where id = $1`,
      [
        data.id,
        data.name?.trim() || String(cur.name),
        data.email === undefined ? cur.email : data.email,
        data.phone === undefined ? cur.phone : data.phone,
        data.mobile === undefined ? cur.mobile : data.mobile,
        data.title === undefined ? cur.title : data.title,
        data.city === undefined ? cur.city : data.city,
        data.address === undefined ? cur.address : data.address,
      ],
    );
    return { ok: true as const };
  });

export const geocodePerson = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; q?: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const p = (await sql.query(`select * from people where id = $1`, [data.id]))[0];
    if (!p) return { ok: false as const, error: "Unknown client", lat: null as number | null, lng: null as number | null, label: null as string | null };
    const q = (data.q ?? [p.address, p.city, p.name].filter(Boolean).join(" ")).trim();
    const hit = (
      await sql.query(
        `select * from places
         where name ilike $1 or address ilike $1 or city ilike $1
         order by rating desc nulls last limit 1`,
        [`%${q.split(" ")[0] ?? q}%`],
      )
    )[0];
    let lat = hit?.lat == null ? null : Number(hit.lat);
    let lng = hit?.lng == null ? null : Number(hit.lng);
    let label = hit ? String(hit.address ?? hit.name) : null;
    if (lat == null || lng == null) {
      const city = String(p.city ?? "New York");
      const pin = BORO[city] ?? BORO["New York"]!;
      lat = pin[0];
      lng = pin[1];
      label = p.address ? `${p.address}, ${city}` : city;
    }
    await sql.query(`update people set lat = $2, lng = $3, geocoded_at = now(), address = coalesce(address, $4) where id = $1`, [
      data.id,
      lat,
      lng,
      label,
    ]);
    return { ok: true as const, error: null as string | null, lat, lng, label };
  });

export const getClientHistory = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql.query(
      `select kind, title, detail, at from (
         select 'deal' as kind, title as title, coalesce(status,'') || coalesce(' · ' || venue, '') as detail, updated_at as at
           from deals where person_id = $1
         union all
         select 'activity', subject, type, coalesce(due_at, created_at)
           from activities where person_id = $1
         union all
         select 'email', subject, folder, coalesce(sent_at, created_at)
           from emails where person_id = $1
         union all
         select 'sms', left(body, 90), coalesce(direction, 'out'), created_at
           from sms_messages where person_id = $1
         union all
         select 'review', coalesce(left(body, 90), 'Review request'), status, coalesce(submitted_at, requested_at, published_at)
           from reviews where person_id = $1
       ) x
       where at is not null
       order by at desc
       limit 40`,
      [data.id],
    );
    return rows.map((r) => ({
      kind: String(r.kind),
      title: String(r.title),
      detail: r.detail == null ? null : String(r.detail),
      at: iso(r.at) ?? "",
    }));
  });
