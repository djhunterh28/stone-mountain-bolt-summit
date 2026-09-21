import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { iso } from "@/lib/utils";
import { authMiddleware } from "@/lib/auth/middleware";
import { insertOutbound } from "./domain";
import { portalOrigin } from "@/lib/portal/brand";

export const REVIEW_PLATFORMS = [
  { id: "google", label: "Google", href: "https://search.google.com/local/writereview?placeid=Hurricane+Productions" },
  { id: "yelp", label: "Yelp", href: "https://www.yelp.com/writeareview/biz/hurricane-productions-brooklyn" },
  { id: "facebook", label: "Facebook", href: "https://www.facebook.com/hurricaneproductions/reviews" },
  { id: "weddingwire", label: "WeddingWire", href: "https://www.weddingwire.com/reviews" },
  { id: "theknot", label: "The Knot", href: "https://www.theknot.com/marketplace/write-a-review" },
  { id: "zola", label: "Zola", href: "https://www.zola.com/wedding-vendors" },
] as const;

function token() {
  return `rvw_${Math.random().toString(36).slice(2, 10)}`;
}

function mapReview(r: Record<string, unknown>) {
  return {
    id: Number(r.id),
    dealId: r.deal_id == null ? null : Number(r.deal_id),
    deal: r.deal == null ? null : String(r.deal),
    personId: r.person_id == null ? null : Number(r.person_id),
    author: r.author == null ? null : String(r.author),
    email: r.email == null ? null : String(r.email),
    stars: Number(r.stars ?? 0),
    body: r.body == null ? null : String(r.body),
    platform: r.platform == null ? null : String(r.platform),
    status: String(r.status),
    token: r.token == null ? null : String(r.token),
    source: r.source == null ? null : String(r.source),
    channel: String(r.channel ?? "email"),
    requestedAt: iso(r.requested_at),
    dueAt: iso(r.due_at),
    submittedAt: iso(r.submitted_at),
    directoryAt: iso(r.directory_at),
    wpDraft: Boolean(r.wp_draft),
    venue: r.venue == null ? null : String(r.venue),
  };
}

export const getReviewsDesk = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const reviews = (
      await sql.query(
        `select r.*, d.title as deal, d.venue, p.email
         from reviews r
         left join deals d on d.id = r.deal_id
         left join people p on p.id = r.person_id
         order by r.id desc`,
      )
    ).map(mapReview);
    const clicks = (
      await sql.query(
        `select platform, count(*)::int as n from review_clicks group by platform order by n desc`,
      )
    ).map((c) => ({ platform: String(c.platform), n: Number(c.n) }));
    const drafts = (
      await sql.query(`select * from wp_drafts order by staged_at desc limit 8`)
    ).map((w) => ({
      id: Number(w.id),
      title: String(w.title),
      body: String(w.body),
      status: String(w.status),
      stagedAt: iso(w.staged_at) ?? "",
    }));
    const sched = (await sql.query(`select * from review_schedule where id = 1`))[0];
    const won = (
      await sql.query(
        `select d.id, d.title, d.event_date, p.name, p.email
         from deals d left join people p on p.id = d.person_id
         where d.status = 'won' order by d.event_date desc nulls last limit 8`,
      )
    ).map((d) => ({
      id: Number(d.id),
      title: String(d.title),
      eventDate: iso(d.event_date),
      person: d.name == null ? null : String(d.name),
      email: d.email == null ? null : String(d.email),
    }));
    return {
      reviews,
      clicks,
      drafts,
      won,
      schedule: {
        daysAfter: Number(sched?.days_after ?? 2),
        channel: String(sched?.channel ?? "email"),
        enabled: sched?.enabled !== false,
      },
      stats: {
        asked: reviews.filter((r) => r.status === "asked").length,
        received: reviews.filter((r) => r.status === "received" || r.status === "published").length,
        published: reviews.filter((r) => r.status === "published").length,
        directory: reviews.filter((r) => r.directoryAt).length,
        wp: drafts.length,
      },
    };
  });

export const saveReviewSchedule = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { daysAfter: number; channel: string; enabled: boolean }) => input)
  .handler(async ({ data }) => {
    const days = Math.max(0, Math.min(60, Math.round(data.daysAfter)));
    const channel = ["email", "sms", "portal"].includes(data.channel) ? data.channel : "email";
    await (await getSql()).query(
      `insert into review_schedule (id, days_after, channel, enabled) values (1,$1,$2,$3)
       on conflict (id) do update set days_after = excluded.days_after, channel = excluded.channel, enabled = excluded.enabled`,
      [days, channel, data.enabled],
    );
    return { ok: true as const, daysAfter: days, channel };
  });

export const requestReview = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { dealId: number; sendNow?: boolean }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const deal = (
      await sql.query(
        `select d.id, d.title, d.person_id, d.event_date, p.name, p.email
         from deals d left join people p on p.id = d.person_id where d.id = $1`,
        [data.dealId],
      )
    )[0];
    if (!deal) return { ok: false as const, error: "Unknown show", token: null as string | null };
    const sched = (await sql.query(`select * from review_schedule where id = 1`))[0];
    const days = Number(sched?.days_after ?? 2);
    const channel = String(sched?.channel ?? "email");
    const t = token();
    const due = data.sendNow
      ? new Date()
      : deal.event_date
        ? new Date(new Date(String(deal.event_date)).getTime() + days * 86400000)
        : new Date(Date.now() + days * 86400000);
    await sql.query(
      `insert into reviews (deal_id, person_id, author, stars, status, token, source, requested_at, due_at, channel)
       values ($1,$2,$3,0,'asked',$4,$5,now(),$6,$7)`,
      [data.dealId, deal.person_id, deal.name, t, channel, due.toISOString(), channel],
    );
    if (data.sendNow && deal.email) {
      await sendAsk(sql, {
        to: String(deal.email),
        name: String(deal.name ?? "there"),
        title: String(deal.title),
        token: t,
        dealId: data.dealId,
        personId: deal.person_id == null ? null : Number(deal.person_id),
      });
    }
    return { ok: true as const, error: null as string | null, token: t };
  });

async function sendAsk(
  sql: Awaited<ReturnType<typeof getSql>>,
  opts: { to: string; name: string; title: string; token: string; dealId: number; personId: number | null },
) {
  const link = `${await portalOrigin()}/r/${opts.token}`;
  await insertOutbound(sql, {
    purpose: "workflow",
    mailKind: "workflow",
    toAddr: opts.to,
    subject: `How was ${opts.title}?`,
    body: `Hi ${opts.name.split(" ")[0]},\n\nIf you have two minutes, tell us how ${opts.title} went. One link — then we will point you at Google, Yelp, or the directory that matters to you.\n\n${link}\n\nThank you,\nHurricane Productions`,
    dealId: opts.dealId,
    personId: opts.personId,
    fallbackName: "Hurricane Productions",
    hintAddr: "shows@hurricaneproductionsllc.com",
  });
}

export const runDueReviews = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const due = await sql.query(
      `select r.id, r.token, r.deal_id, r.person_id, d.title, p.name, p.email
       from reviews r
       left join deals d on d.id = r.deal_id
       left join people p on p.id = coalesce(r.person_id, d.person_id)
       where r.status = 'asked' and r.due_at <= now() and r.token is not null`,
    );
    let sent = 0;
    for (const row of due) {
      if (!row.email) continue;
      await sendAsk(sql, {
        to: String(row.email),
        name: String(row.name ?? "there"),
        title: String(row.title ?? "the show"),
        token: String(row.token),
        dealId: Number(row.deal_id),
        personId: row.person_id == null ? null : Number(row.person_id),
      });
      await sql.query(`update reviews set source = 'email', requested_at = now() where id = $1`, [Number(row.id)]);
      sent += 1;
    }
    return { ok: true as const, sent, due: due.length };
  });

export const getReviewPublic = createServerFn({ method: "GET" })
  .validator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const row = (
      await sql.query(
        `select r.*, d.title as deal, d.venue, d.event_date
         from reviews r left join deals d on d.id = r.deal_id where r.token = $1`,
        [data.token],
      )
    )[0];
    if (!row) return { ok: false as const, review: null };
    const clicks = (
      await sql.query(`select platform from review_clicks where review_id = $1`, [Number(row.id)])
    ).map((c) => String(c.platform));
    return {
      ok: true as const,
      review: {
        ...mapReview(row),
        eventDate: iso(row.event_date),
        clicks,
      },
    };
  });

export const submitReview = createServerFn({ method: "POST" })
  .validator((input: { token: string; stars: number; body: string; source?: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const row = (await sql.query(`select * from reviews where token = $1`, [data.token]))[0];
    if (!row) return { ok: false as const, error: "Unknown link" };
    const stars = Math.max(1, Math.min(5, Math.round(data.stars)));
    const body = data.body.trim();
    if (!body) return { ok: false as const, error: "Say something about the show" };
    const title = `${row.author ?? "Client"} — ${stars} stars`;
    await sql.query(
      `update reviews set stars = $2, body = $3, status = 'received', submitted_at = now(),
              directory_at = coalesce(directory_at, now()), wp_draft = true, source = coalesce($4, source)
       where id = $1`,
      [Number(row.id), stars, body, data.source ?? "link"],
    );
    const existing = await sql.query(`select id from wp_drafts where review_id = $1`, [Number(row.id)]);
    if (!existing[0]) {
      await sql.query(`insert into wp_drafts (review_id, title, body, status) values ($1,$2,$3,'draft')`, [
        Number(row.id),
        title,
        body,
      ]);
    }
    return { ok: true as const, error: null as string | null };
  });

export const clickReviewPlatform = createServerFn({ method: "POST" })
  .validator((input: { token: string; platform: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const row = (await sql.query(`select * from reviews where token = $1`, [data.token]))[0];
    if (!row) return { ok: false as const, href: null as string | null };
    const plat = REVIEW_PLATFORMS.find((p) => p.id === data.platform);
    if (!plat) return { ok: false as const, href: null as string | null };
    await sql.query(`insert into review_clicks (review_id, platform) values ($1,$2)`, [Number(row.id), plat.id]);
    await sql.query(
      `update reviews set platform = $2, status = 'published', published_at = coalesce(published_at, now()) where id = $1`,
      [Number(row.id), plat.id],
    );
    return { ok: true as const, href: plat.href };
  });

export const getDirectoryProfile = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const reviews = (
    await sql.query(
      `select r.author, r.stars, r.body, r.submitted_at, d.title as deal, d.venue
       from reviews r left join deals d on d.id = r.deal_id
       where r.directory_at is not null and r.body is not null
       order by r.submitted_at desc nulls last`,
    )
  ).map((r) => ({
    author: String(r.author ?? "Client"),
    stars: Number(r.stars),
    body: String(r.body),
    deal: r.deal == null ? null : String(r.deal),
    venue: r.venue == null ? null : String(r.venue),
    at: iso(r.submitted_at),
  }));
  const avg =
    reviews.length === 0 ? 0 : Math.round((reviews.reduce((s, r) => s + r.stars, 0) / reviews.length) * 10) / 10;
  return { reviews, avg, n: reviews.length };
});
