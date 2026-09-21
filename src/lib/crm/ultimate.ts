import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { iso, money } from "@/lib/utils";
import { consumeCredit } from "./governance";
import { DEAL_SELECT, mapActivity, mapDeal, mapOrg, mapPerson } from "./map";
import { hashSha } from "@/lib/portal/access";
import { insertOutbound } from "./domain";
import type { ChatbotFlow, Goal, SequenceEnrollment } from "./types";

const NYC: Record<string, { lat: number; lng: number; employees: string; revenue: string }> = {
  Finance: { lat: 40.7616, lng: -73.969, employees: "5,000+", revenue: "$1B+" },
  Culture: { lat: 40.7794, lng: -73.9632, employees: "200-500", revenue: "Nonprofit" },
  Retail: { lat: 40.7265, lng: -73.9936, employees: "10,000+", revenue: "$1B+" },
  Hospitality: { lat: 40.7408, lng: -74.0079, employees: "500-1,000", revenue: "$100–250M" },
  Venue: { lat: 40.7056, lng: -74.0016, employees: "50-200", revenue: "$10–50M" },
  Arena: { lat: 40.6826, lng: -73.9754, employees: "500+", revenue: "$250M+" },
  Media: { lat: 40.7105, lng: -74.012, employees: "1,000-5,000", revenue: "$250M–1B" },
  Fitness: { lat: 40.7536, lng: -73.9972, employees: "1,000-5,000", revenue: "$1B+" },
};

export const listGoals = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async (): Promise<Goal[]> => {
    const sql = await getSql();
    let rows: Record<string, unknown>[] = [];
    try {
      rows = await sql`select g.*, m.name as owner_name, p.name as pipeline_name from goals g
      left join members m on m.id = g.owner_id
      left join pipelines p on p.id = g.pipeline_id
      order by g.id`;
    } catch {
      return [];
    }
    const out: Goal[] = [];
    for (const r of rows) {
      const kind = String(r.kind);
      const pipe = r.pipeline_id == null ? null : Number(r.pipeline_id);
      const owner = r.owner_id == null ? null : Number(r.owner_id);
      const start = iso(r.period_start);
      const end = iso(r.period_end);
      let current = 0;
      if (kind === "revenue") {
        const q = await sql.query(
          `select coalesce(sum(value),0) as v from deals
         where status = 'won' and won_at::date >= $1::date and won_at::date <= $2::date
           and ($3::int is null or pipeline_id = $3)`,
          [start, end, pipe],
        );
        current = money(q[0]?.v);
      } else if (kind === "won_deals") {
        const q = await sql.query(
          `select count(*) as c from deals
         where status = 'won' and won_at::date >= $1::date and won_at::date <= $2::date
           and ($3::int is null or pipeline_id = $3)`,
          [start, end, pipe],
        );
        current = Number(q[0]?.c ?? 0);
      } else {
        const q = await sql.query(
          `select count(*) as c from activities
         where due_at::date >= $1::date and due_at::date <= $2::date
           and ($3::int is null or owner_id = $3)`,
          [start, end, owner],
        );
        current = Number(q[0]?.c ?? 0);
      }
      out.push({
        id: Number(r.id),
        name: String(r.name),
        kind,
        target: money(r.target),
        current,
        periodStart: start ?? "",
        periodEnd: end ?? "",
        ownerId: owner,
        ownerName: r.owner_name == null ? null : String(r.owner_name),
        pipelineId: pipe,
        pipelineName: r.pipeline_name == null ? null : String(r.pipeline_name),
      });
    }
    return out;
  });

export const createGoal = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      name: string;
      kind: string;
      target: number;
      periodStart: string;
      periodEnd: string;
      ownerId?: number | null;
      pipelineId?: number | null;
    }) => input,
  )
  .handler(async ({ data }) => {
    const rows = await (
      await getSql()
    )`insert into goals (name, kind, target, period_start, period_end, owner_id, pipeline_id)
      values (${data.name}, ${data.kind}, ${data.target}, ${data.periodStart}, ${data.periodEnd}, ${data.ownerId ?? null}, ${data.pipelineId ?? null})
      returning id`;
    return { id: Number(rows[0]!.id) };
  });

export const getPersonDetail = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql`select p.*, o.name as org_name, m.name as owner_name,
      (select count(*) from deals d where d.person_id = p.id and d.status = 'open') as open_deals,
      (select coalesce(sum(d.value),0) from deals d where d.person_id = p.id and d.status = 'open') as deal_value
      from people p
      left join organizations o on o.id = p.org_id
      left join members m on m.id = p.owner_id
      where p.id = ${data.id}`;
    if (!rows[0]) return null;
    return {
      person: mapPerson(rows[0]),
      deals: (
        await sql.query(
          `select ${DEAL_SELECT} from deals d
         left join organizations o on o.id = d.org_id
         left join people p on p.id = d.person_id
         left join members m on m.id = d.owner_id
         left join stages s on s.id = d.stage_id
         where d.person_id = $1 order by d.updated_at desc`,
          [data.id],
        )
      ).map(mapDeal),
      activities: (
        await sql`select a.*, d.title as deal_title, p.name as person_name, o.name as org_name, m.name as owner_name, m.initials as owner_initials, m.tone as owner_tone
        from activities a
        left join deals d on d.id = a.deal_id
        left join people p on p.id = a.person_id
        left join organizations o on o.id = a.org_id
        left join members m on m.id = a.owner_id
        where a.person_id = ${data.id} order by a.due_at desc nulls last`
      ).map(mapActivity),
    };
  });

export const getOrgDetail = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql`select o.*, m.name as owner_name,
      (select count(*) from people p where p.org_id = o.id) as people_count,
      (select count(*) from deals d where d.org_id = o.id and d.status = 'open') as open_deals,
      (select coalesce(sum(d.value),0) from deals d where d.org_id = o.id and d.status = 'open') as deal_value
      from organizations o
      left join members m on m.id = o.owner_id
      where o.id = ${data.id}`;
    if (!rows[0]) return null;
    return {
      org: mapOrg(rows[0]),
      people: (
        await sql`select p.*, o.name as org_name, m.name as owner_name,
        (select count(*) from deals d where d.person_id = p.id and d.status = 'open') as open_deals,
        (select coalesce(sum(d.value),0) from deals d where d.person_id = p.id and d.status = 'open') as deal_value
        from people p
        left join organizations o on o.id = p.org_id
        left join members m on m.id = p.owner_id
        where p.org_id = ${data.id} order by p.name`
      ).map(mapPerson),
      deals: (
        await sql.query(
          `select ${DEAL_SELECT} from deals d
         left join organizations o on o.id = d.org_id
         left join people p on p.id = d.person_id
         left join members m on m.id = d.owner_id
         left join stages s on s.id = d.stage_id
         where d.org_id = $1 order by d.updated_at desc`,
          [data.id],
        )
      ).map(mapDeal),
    };
  });

export const enrichRecord = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { kind: "org" | "person"; id: number; lookup?: "all" | "email" | "phone" }) => input)
  .handler(async ({ data }) => {
    const credit = await consumeCredit();
    if (!credit.ok) return { ok: false as const, error: credit.error ?? "No credits", remaining: 0 };
    const sql = await getSql();
    const lookup = data.lookup ?? "all";
    if (data.kind === "org") {
      const org = (await sql`select * from organizations where id = ${data.id}`)[0];
      if (!org) return { ok: false as const, remaining: credit.remaining };
      const pack = NYC[String(org.industry ?? "Venue")] ?? NYC.Venue!;
      const phone = org.phone ? String(org.phone) : `+1 212 555 ${String(1000 + (data.id % 8000)).padStart(4, "0")}`;
      await sql`update organizations set employees = ${pack.employees}, revenue_band = ${pack.revenue},
        lat = coalesce(lat, ${pack.lat}), lng = coalesce(lng, ${pack.lng}), phone = coalesce(phone, ${phone}),
        enriched_at = now() where id = ${data.id}`;
      return { ok: true as const, remaining: credit.remaining, employees: pack.employees, revenueBand: pack.revenue, phone };
    }
    const person = (
      await sql`select p.*, o.industry, o.id as oid, o.website, o.name as oname from people p left join organizations o on o.id = p.org_id where p.id = ${data.id}`
    )[0];
    if (!person) return { ok: false as const, remaining: credit.remaining };
    const slug = String(person.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const first = String(person.name).split(" ")[0]?.toLowerCase() ?? "desk";
    const last = String(person.name).split(" ").slice(-1)[0]?.toLowerCase() ?? "producer";
    const domain = person.website
      ? String(person.website)
          .replace(/^https?:\/\//, "")
          .replace(/\/.*$/, "")
      : `${String(person.oname ?? "northline")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "")}.com`;
    const email = person.email ? String(person.email) : `${first}.${last}@${domain}`;
    const mobile = `+1 917 555 ${String(1400 + (data.id % 7000)).padStart(4, "0")}`;
    const direct = `+1 212 555 ${String(1800 + (data.id % 7000)).padStart(4, "0")}`;
    const linkedin = `linkedin.com/in/${slug}`;
    if (lookup === "email") {
      await sql`update people set email = coalesce(email, ${email}), enriched_at = now() where id = ${data.id}`;
      return { ok: true as const, remaining: credit.remaining, email };
    }
    if (lookup === "phone") {
      await sql`update people set phone = coalesce(phone, ${direct}), mobile = ${mobile}, direct_dial = ${direct}, enriched_at = now() where id = ${data.id}`;
      return { ok: true as const, remaining: credit.remaining, phone: direct, mobile };
    }
    await sql`update people set linkedin = ${linkedin}, email = coalesce(email, ${email}),
      phone = coalesce(phone, ${direct}), mobile = ${mobile}, direct_dial = ${direct}, enriched_at = now() where id = ${data.id}`;
    if (person.oid != null) {
      const pack = NYC[String(person.industry ?? "Venue")] ?? NYC.Venue!;
      await sql`update organizations set employees = coalesce(employees, ${pack.employees}), revenue_band = coalesce(revenue_band, ${pack.revenue}), enriched_at = now() where id = ${Number(person.oid)}`;
    }
    return { ok: true as const, remaining: credit.remaining, linkedin, email, mobile, phone: direct };
  });

export const cloneDeal = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const d = (await sql`select * from deals where id = ${data.id}`)[0];
    if (!d) return { id: null as number | null };
    const rows = await sql`insert into deals (title, value, pipeline_id, stage_id, org_id, person_id, owner_id, status, expected_close, probability, source, event_date, venue, guest_count, indoor, load_in, notes, event_type)
      values (${`Copy of ${String(d.title)}`}, ${money(d.value)}, ${Number(d.pipeline_id)}, ${Number(d.stage_id)}, ${d.org_id == null ? null : Number(d.org_id)}, ${d.person_id == null ? null : Number(d.person_id)}, ${d.owner_id == null ? null : Number(d.owner_id)}, ${"open"}, ${d.expected_close == null ? null : String(d.expected_close)}, ${Number(d.probability ?? 0)}, ${d.source == null ? null : String(d.source)}, ${d.event_date == null ? null : String(d.event_date)}, ${d.venue == null ? null : String(d.venue)}, ${d.guest_count == null ? null : Number(d.guest_count)}, ${d.indoor}, ${d.load_in == null ? null : String(d.load_in)}, ${d.notes == null ? null : String(d.notes)}, ${d.event_type == null ? null : String(d.event_type)})
      returning id`;
    const id = Number(rows[0]!.id);
    const products = await sql`select * from deal_products where deal_id = ${data.id}`;
    for (const p of products) {
      await sql`insert into deal_products (deal_id, product_id, qty, discount, price)
        values (${id}, ${Number(p.product_id)}, ${Number(p.qty)}, ${Number(p.discount)}, ${money(p.price)})`;
    }
    await sql`insert into deal_history (deal_id, actor, action, detail) values (${id}, ${"Northline"}, ${"created"}, ${"Cloned from deal " + data.id})`;
    return { id };
  });

export const importDeals = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      rows: { title: string; value: number; orgName?: string; venue?: string; source?: string }[];
      ownerId: number;
      pipelineId: number;
      stageId: number;
    }) => input,
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    let created = 0;
    for (const row of data.rows.slice(0, 50)) {
      let orgId: number | null = null;
      if (row.orgName) {
        const existing = (await sql`select id from organizations where lower(name) = ${row.orgName.toLowerCase()} limit 1`)[0];
        if (existing) orgId = Number(existing.id);
        else {
          const ins = await sql`insert into organizations (name, owner_id, city) values (${row.orgName}, ${data.ownerId}, ${"New York"}) returning id`;
          orgId = Number(ins[0]!.id);
        }
      }
      await sql`insert into deals (title, value, pipeline_id, stage_id, org_id, owner_id, venue, source)
        values (${row.title}, ${row.value}, ${data.pipelineId}, ${data.stageId}, ${orgId}, ${data.ownerId}, ${row.venue ?? null}, ${row.source ?? "Import"})`;
      created += 1;
    }
    return { created };
  });

export const getAdmin = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const empty = { groups: [], permissions: [], tokens: [], routes: [], accounts: [] };
    try {
      return {
        groups: (await sql`select * from visibility_groups order by id`).map((g) => ({
          id: Number(g.id),
          name: String(g.name),
          detail: String(g.detail ?? ""),
          memberIds: Array.isArray(g.member_ids)
            ? g.member_ids.map(Number)
            : typeof g.member_ids === "string"
              ? (JSON.parse(String(g.member_ids)) as number[])
              : [],
        })),
        permissions: (await sql`select * from permission_sets order by id`).map((p) => ({
          id: Number(p.id),
          name: String(p.name),
          detail: String(p.detail ?? ""),
          canExport: Boolean(p.can_export),
          canDelete: Boolean(p.can_delete),
          canAdmin: Boolean(p.can_admin),
        })),
        tokens: (await sql`select * from api_tokens order by id`).map((t) => ({
          id: Number(t.id),
          name: String(t.name),
          tokenHint: String(t.token_hint),
          scopes: String(t.scopes),
          lastUsed: iso(t.last_used),
          createdAt: iso(t.created_at) ?? "",
          revoked: Boolean(t.revoked),
        })),
        routes: (
          await sql`select r.*, m.name as owner_name from lead_routes r left join members m on m.id = r.owner_id order by r.id`
        ).map((r) => ({
          id: Number(r.id),
          source: String(r.source),
          ownerId: r.owner_id == null ? null : Number(r.owner_id),
          ownerName: r.owner_name == null ? null : String(r.owner_name),
          teamId: r.team_id == null ? null : Number(r.team_id),
          active: Boolean(r.active),
        })),
        accounts: (
          await sql`select a.*, m.name as member_name from email_accounts a left join members m on m.id = a.member_id order by a.id`
        ).map((a) => ({
          id: Number(a.id),
          memberId: a.member_id == null ? null : Number(a.member_id),
          memberName: a.member_name == null ? null : String(a.member_name),
          address: String(a.address),
          kind: String(a.kind),
          synced: Boolean(a.synced),
          lastSync: iso(a.last_sync),
        })),
      };
    } catch {
      return empty;
    }
  });

export const createApiToken = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { name: string; scopes: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const raw = `nl_live_${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 8)}`;
    const hint = `${raw.slice(0, 12)}…${raw.slice(-3)}`;
    const scopes = data.scopes.trim() || "events:read";
    await sql`insert into api_tokens (name, token_hint, token_hash, scopes)
      values (${data.name.trim() || "Token"}, ${hint}, ${hashSha(raw)}, ${scopes})`;
    return { token: raw, hint, scopes };
  });

export const revokeToken = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    await (await getSql())`update api_tokens set revoked = true where id = ${data.id}`;
    return { ok: true };
  });

export const listChatbots = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async (): Promise<ChatbotFlow[]> => {
    return (await (await getSql())`select * from chatbot_flows order by id`).map((r) => {
      const steps = typeof r.steps === "string" ? JSON.parse(String(r.steps)) : r.steps;
      return {
        id: Number(r.id),
        name: String(r.name),
        active: Boolean(r.active),
        steps: (steps ?? []) as ChatbotFlow["steps"],
        conversations: Number(r.conversations),
      };
    });
  });

export const toggleChatbot = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; active: boolean }) => input)
  .handler(async ({ data }) => {
    await (await getSql())`update chatbot_flows set active = ${data.active} where id = ${data.id}`;
    return { ok: true };
  });

export const getSchedulerBySlug = createServerFn({ method: "GET" })
  .validator((input: { slug: string }) => input)
  .handler(async ({ data }) => {
    const row = (
      await (await getSql())`select l.*, m.name as member_name from scheduler_links l left join members m on m.id = l.member_id where l.slug = ${data.slug}`
    )[0];
    if (!row) return null;
    return {
      id: Number(row.id),
      memberId: row.member_id == null ? null : Number(row.member_id),
      memberName: row.member_name == null ? null : String(row.member_name),
      name: String(row.name),
      durationMin: Number(row.duration_min),
      slug: String(row.slug),
      bookings: Number(row.bookings),
      source: row.source == null ? "northline" : String(row.source),
      calendlyUrl: row.calendly_url == null ? null : String(row.calendly_url),
      locationKind: row.location_kind == null ? "zoom" : String(row.location_kind),
    };
  });

export const getDocumentPublic = createServerFn({ method: "GET" })
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    const row = (
      await (await getSql())`select doc.*, d.title as deal_title from documents doc left join deals d on d.id = doc.deal_id where doc.id = ${data.id}`
    )[0];
    if (!row) return null;
    return {
      id: Number(row.id),
      name: String(row.name),
      dealId: row.deal_id == null ? null : Number(row.deal_id),
      dealTitle: row.deal_title == null ? null : String(row.deal_title),
      template: String(row.template),
      status: String(row.status),
      content: row.content == null ? null : String(row.content),
      sentAt: iso(row.sent_at),
      viewedAt: iso(row.viewed_at),
      signedAt: iso(row.signed_at),
      createdAt: iso(row.created_at) ?? "",
    };
  });

export const listEnrollments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async (): Promise<SequenceEnrollment[]> => {
    return (
      await (await getSql())`select e.*, p.name as person_name from sequence_enrollments e
    left join people p on p.id = e.person_id order by e.enrolled_at desc`
    ).map((r) => ({
      id: Number(r.id),
      sequenceId: Number(r.sequence_id),
      personId: Number(r.person_id),
      personName: r.person_name == null ? null : String(r.person_name),
      stepIndex: Number(r.step_index),
      status: String(r.status),
      enrolledAt: iso(r.enrolled_at) ?? "",
    }));
  });

export const enrollSequence = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { sequenceId: number; personId: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`insert into sequence_enrollments (sequence_id, person_id) values (${data.sequenceId}, ${data.personId})`;
    await sql`update sequences set enrolled = enrolled + 1 where id = ${data.sequenceId}`;
    const seq = (await sql.query(`select * from sequences where id = $1`, [data.sequenceId]))[0];
    const person = (await sql.query(`select * from people where id = $1`, [data.personId]))[0];
    if (seq && person?.email) {
      let steps: { day?: number; channel?: string; title?: string }[] = [];
      try {
        steps = typeof seq.steps === "string" ? JSON.parse(String(seq.steps)) : ((seq.steps as typeof steps) ?? []);
      } catch {
        steps = [];
      }
      const first = steps.find((s) => s.channel === "email") ?? steps[0];
      if (first) {
        const firstName = String(person.name).split(" ")[0] ?? "there";
        await insertOutbound(sql, {
          purpose: "workflow",
          toAddr: String(person.email),
          subject: String(first.title ?? seq.name),
          body: `Hi ${firstName} —\n\n${first.title ?? "Following up from Northline."}\n\nThis cadence left hurricaneproductionsllc.com, not a platform address.\n\n— Northline Shows`,
          personId: data.personId,
          fallbackName: "Northline Shows",
          hintAddr: "shows@hurricaneproductionsllc.com",
        });
      }
    }
    return { ok: true };
  });

export const runAutomation = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const a = (await sql`select * from automations where id = ${data.id}`)[0];
    if (!a) return { ok: false };
    await sql`update automations set runs = runs + 1 where id = ${data.id}`;
    if (String(a.action_type) === "activity.create") {
      await sql`insert into activities (type, subject, owner_id, due_at, notes)
        values (${"task"}, ${String(a.action_detail ?? "Automation task")}, ${1}, now() + interval '1 day', ${"Fired from " + String(a.name)})`;
    }
    if (String(a.action_type) === "email.template") {
      const tpl = (
        await sql.query(
          `select * from email_templates where name ilike '%' || $1 || '%' or $1 ilike '%' || name || '%' order by id limit 1`,
          [String(a.action_detail ?? "COI")],
        )
      )[0] ?? (await sql.query(`select * from email_templates order by id limit 1`))[0];
      const person = (
        await sql.query(
          `select p.email, p.name, d.id as deal_id from deals d join people p on p.id = d.person_id
           where d.status = 'open' and p.email is not null order by d.id limit 1`,
        )
      )[0];
      if (tpl && person) {
        const first = String(person.name).split(" ")[0] ?? "there";
        const body = String(tpl.body)
          .replaceAll("{{first_name}}", first)
          .replaceAll("{{venue}}", "the venue")
          .replaceAll("{{deal}}", String(a.name));
        await insertOutbound(sql, {
          purpose: "workflow",
          mailKind: "transactional",
          toAddr: String(person.email),
          subject: String(tpl.subject).replaceAll("{{first_name}}", first).replaceAll("{{deal}}", String(a.name)).replaceAll("{{venue}}", "the venue"),
          body,
          dealId: Number(person.deal_id),
          fallbackName: "Northline Shows",
          hintAddr: "shows@hurricaneproductionsllc.com",
        });
      }
    }
    return { ok: true, action: String(a.action_type) };
  });
