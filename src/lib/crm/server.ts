import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { iso, money } from "@/lib/utils";
import { assertCap, guardAction } from "./governance";
import {
  DEAL_SELECT,
  mapActivity,
  mapDeal,
  mapDealProduct,
  mapDoc,
  mapEmail,
  mapLead,
  mapMember,
  mapOrg,
  mapPerson,
  mapProduct,
  mapProject,
  mapTask,
} from "./map";
import { completeNewBooking } from "./schedule";
import { insertOutbound } from "./domain";
import type {
  AuditRow,
  Automation,
  Bootstrap,
  ChatThread,
  CustomField,
  CustomReport,
  DealDetail,
  Device,
  Insights,
  MarketplaceApp,
  Notification,
  Prospect,
  PulseItem,
  SchedulerLink,
  ScoreModel,
  SecurityAlert,
  SecurityRule,
  Sequence,
  Webhook,
} from "./types";

async function audit(actor: string, action: string, entity: string, detail?: string) {
  const sql = await getSql();
  await sql`insert into audit_log (actor, action, entity, detail, ip, device)
    values (${actor}, ${action}, ${entity}, ${detail ?? null}, ${"74.64.12.10"}, ${"Chrome · macOS"})`;
}

export const getBootstrap = createServerFn({ method: "GET" }).handler(async (): Promise<Bootstrap> => {
  const sql = await getSql();
  const members = (await sql`select m.*, t.name as team_name from members m left join teams t on t.id = m.team_id order by m.id`).map(mapMember);
  const pipes = await sql`select * from pipelines order by sort_order`;
  const stages = await sql`select * from stages order by sort_order`;
  const products = (await sql`select * from products order by category, name`).map(mapProduct);
  let lostReasons: Bootstrap["lostReasons"] = [];
  let activityTypes: Bootstrap["activityTypes"] = [];
  let eventTypes: Bootstrap["eventTypes"] = [];
  try {
    const lostRows = await sql`select * from lost_reasons where active = true order by sort_order`;
    const typeRows = await sql`select * from activity_types where active = true order by id`;
    lostReasons = lostRows.map((r) => ({
      id: Number(r.id),
      name: String(r.name),
      sortOrder: Number(r.sort_order),
      active: Boolean(r.active),
      kind: String(r.kind ?? "lost") === "cancelled" ? "cancelled" : "lost",
    }));
    activityTypes = typeRows.map((r) => ({
      id: Number(r.id),
      name: String(r.name),
      slug: String(r.slug),
      icon: String(r.icon),
      active: Boolean(r.active),
    }));
  } catch {
    /* 0004 not applied yet */
  }
  try {
    const typeCatalog = await sql`select * from event_types where active = true order by sort_order`;
    eventTypes = typeCatalog.map((r) => ({
      id: Number(r.id),
      name: String(r.name),
      slug: String(r.slug),
      sortOrder: Number(r.sort_order),
      active: Boolean(r.active),
    }));
  } catch {
    /* 0023 not applied yet */
  }
  const pipelines = pipes.map((p) => ({
    id: Number(p.id),
    name: String(p.name),
    sortOrder: Number(p.sort_order),
    stages: stages
      .filter((s) => Number(s.pipeline_id) === Number(p.id))
      .map((s) => ({
        id: Number(s.id),
        pipelineId: Number(s.pipeline_id),
        name: String(s.name),
        sortOrder: Number(s.sort_order),
        rottingDays: Number(s.rotting_days),
        probability: Number(s.probability),
      })),
  }));
  return {
    members,
    pipelines,
    products,
    lostReasons,
    activityTypes,
    eventTypes,
  };
});

export const listDeals = createServerFn({ method: "GET" })
  .validator((input: { pipelineId?: number; status?: string; ownerId?: number; q?: string } = {}) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const pipelineId = data.pipelineId ?? 1;
    const status = data.status ?? "open";
    const ownerId = data.ownerId;
    const q = data.q?.trim();
    const rows = await sql.query(
      `select ${DEAL_SELECT}
       from deals d
       left join organizations o on o.id = d.org_id
       left join people p on p.id = d.person_id
       left join members m on m.id = d.owner_id
       left join stages s on s.id = d.stage_id
       where d.pipeline_id = $1
         and ($2 = 'all' or d.status = $2)
         and ($3::int is null or d.owner_id = $3)
         and ($4::text is null or d.title ilike '%'||$4||'%' or coalesce(o.name,'') ilike '%'||$4||'%' or coalesce(d.venue,'') ilike '%'||$4||'%')
       order by d.value desc`,
      [pipelineId, status, ownerId ?? null, q || null],
    );
    return rows.map(mapDeal);
  });

export const getDeal = createServerFn({ method: "GET" })
  .validator((input: { id: number }) => input)
  .handler(async ({ data }): Promise<DealDetail | null> => {
    const sql = await getSql();
    const rows = await sql.query(
      `select ${DEAL_SELECT} from deals d
       left join organizations o on o.id = d.org_id
       left join people p on p.id = d.person_id
       left join members m on m.id = d.owner_id
       left join stages s on s.id = d.stage_id
       where d.id = $1`,
      [data.id],
    );
    if (!rows[0]) return null;
    const deal = mapDeal(rows[0]);
    const products = (await sql`select dp.*, pr.name, pr.sku, pr.unit from deal_products dp join products pr on pr.id = dp.product_id where dp.deal_id = ${data.id}`).map(mapDealProduct);
    const activities = (
      await sql`select a.*, d.title as deal_title, p.name as person_name, o.name as org_name, m.name as owner_name, m.initials as owner_initials, m.tone as owner_tone
        from activities a
        left join deals d on d.id = a.deal_id
        left join people p on p.id = a.person_id
        left join organizations o on o.id = a.org_id
        left join members m on m.id = a.owner_id
        where a.deal_id = ${data.id} order by a.due_at nulls last`
    ).map(mapActivity);
    const comments = await sql`select c.*, m.name as author_name, m.initials as author_initials, m.tone as author_tone
      from comments c left join members m on m.id = c.author_id
      where c.entity_type = 'deal' and c.entity_id = ${data.id} order by c.created_at`;
    const files = await sql`select * from files where entity_type = 'deal' and entity_id = ${data.id} order by created_at desc`;
    const emails = (
      await sql`select e.*, d.title as deal_title from emails e left join deals d on d.id = e.deal_id where e.deal_id = ${data.id} order by coalesce(e.sent_at, e.created_at) desc`
    ).map(mapEmail);
    const documents = (
      await sql`select doc.*, d.title as deal_title from documents doc left join deals d on d.id = doc.deal_id where doc.deal_id = ${data.id} order by doc.created_at desc`
    ).map(mapDoc);
    let historyRows: Record<string, unknown>[] = [];
    try {
      historyRows = await sql`select * from deal_history where deal_id = ${data.id} order by created_at desc`;
    } catch {
      historyRows = [];
    }
    return {
      ...deal,
      personEmail: rows[0].person_email == null ? null : String(rows[0].person_email),
      personPhone: rows[0].person_phone == null ? null : String(rows[0].person_phone),
      orgAddress: rows[0].org_address == null ? null : String(rows[0].org_address),
      products,
      activities,
      comments: comments.map((c) => ({
        id: Number(c.id),
        entityType: "deal",
        entityId: data.id,
        authorId: c.author_id == null ? null : Number(c.author_id),
        authorName: c.author_name == null ? null : String(c.author_name),
        authorInitials: c.author_initials == null ? null : String(c.author_initials),
        authorTone: c.author_tone == null ? null : String(c.author_tone),
        body: String(c.body),
        createdAt: iso(c.created_at) ?? "",
      })),
      files: files.map((f) => ({
        id: Number(f.id),
        entityType: "deal",
        entityId: data.id,
        name: String(f.name),
        kind: String(f.kind),
        sizeKb: Number(f.size_kb),
        uploadedBy: f.uploaded_by == null ? null : Number(f.uploaded_by),
        createdAt: iso(f.created_at) ?? "",
      })),
      emails,
      documents,
      history: historyRows.map((h) => ({
        id: Number(h.id),
        dealId: data.id,
        actor: String(h.actor),
        action: String(h.action),
        detail: h.detail == null ? null : String(h.detail),
        createdAt: iso(h.created_at) ?? "",
      })),
    };
  });

export const createDeal = createServerFn({ method: "POST" })
  .validator(
    (input: {
      title: string;
      value: number;
      pipelineId: number;
      stageId: number;
      ownerId: number;
      orgId?: number | null;
      personId?: number | null;
      venue?: string;
      eventDate?: string | null;
      guestCount?: number | null;
      source?: string;
      eventType?: string | null;
    }) => input,
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql`insert into deals (title, value, pipeline_id, stage_id, owner_id, org_id, person_id, venue, event_date, guest_count, source, event_type)
      values (${data.title}, ${data.value}, ${data.pipelineId}, ${data.stageId}, ${data.ownerId}, ${data.orgId ?? null}, ${data.personId ?? null}, ${data.venue ?? null}, ${data.eventDate ?? null}, ${data.guestCount ?? null}, ${data.source ?? "Manual"}, ${data.eventType ?? null})
      returning id`;
    const id = Number(rows[0]!.id);
    await audit("Northline", "created", `deal:${id}`, data.title);
    return { id };
  });

export const moveDeal = createServerFn({ method: "POST" })
  .validator((input: { id: number; stageId: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const stage = (await sql`select probability, name from stages where id = ${data.stageId}`)[0];
    await sql`update deals set stage_id = ${data.stageId}, probability = ${Number(stage?.probability ?? 0)}, stage_entered_at = now(), updated_at = now() where id = ${data.id} and status = 'open'`;
    await sql`insert into deal_history (deal_id, actor, action, detail) values (${data.id}, ${"Northline"}, ${"moved"}, ${`Moved to ${String(stage?.name ?? data.stageId)}`})`;
    await audit("Northline", "updated", `deal:${data.id}`, `Moved to ${String(stage?.name ?? data.stageId)}`);
    return { ok: true };
  });

export const setDealStatus = createServerFn({ method: "POST" })
  .validator((input: { id: number; status: "open" | "won" | "lost" | "cancelled"; lostReason?: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    if (data.status === "won") {
      await sql`update deals set status = 'won', won_at = now(), cancelled_at = null, probability = 100, updated_at = now() where id = ${data.id}`;
      const deal = (await sql`select title, owner_id from deals where id = ${data.id}`)[0];
      if (deal) {
        await sql`insert into projects (name, deal_id, status, start_date, end_date, owner_id)
          values (${String(deal.title)}, ${data.id}, ${"open"}, CURRENT_DATE, CURRENT_DATE + 7, ${4})`;
        await sql`update automations set runs = runs + 1 where trigger_type = 'deal.won'`;
        await sql`insert into deal_history (deal_id, actor, action, detail) values (${data.id}, ${"Northline"}, ${"won"}, ${String(deal.title)})`;
      }
    } else if (data.status === "lost") {
      await sql`update deals set status = 'lost', lost_reason = ${data.lostReason ?? "Unspecified"}, lost_at = now(), cancelled_at = null, probability = 0, updated_at = now() where id = ${data.id}`;
      await sql`insert into deal_history (deal_id, actor, action, detail) values (${data.id}, ${"Northline"}, ${"lost"}, ${data.lostReason ?? "Unspecified"})`;
    } else if (data.status === "cancelled") {
      await sql`update deals set status = 'cancelled', lost_reason = ${data.lostReason ?? "Event cancelled"}, lost_at = now(), cancelled_at = now(), probability = 0, updated_at = now() where id = ${data.id}`;
      await sql`insert into deal_history (deal_id, actor, action, detail) values (${data.id}, ${"Northline"}, ${"cancelled"}, ${data.lostReason ?? "Event cancelled"})`;
    } else {
      await sql`update deals set status = 'open', lost_reason = null, won_at = null, lost_at = null, cancelled_at = null, updated_at = now() where id = ${data.id}`;
    }
    await audit("Northline", "updated", `deal:${data.id}`, `Status ${data.status}`);
    return { ok: true };
  });

export const updateDeal = createServerFn({ method: "POST" })
  .validator(
    (input: {
      id: number;
      title?: string;
      value?: number;
      ownerId?: number;
      venue?: string | null;
      eventDate?: string | null;
      guestCount?: number | null;
      indoor?: boolean | null;
      loadIn?: string | null;
      notes?: string | null;
      expectedClose?: string | null;
      eventType?: string | null;
    }) => input,
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const cur = (await sql`select * from deals where id = ${data.id}`)[0];
    if (!cur) return { ok: false };
    await sql`update deals set
      title = ${data.title ?? String(cur.title)},
      value = ${data.value ?? money(cur.value)},
      owner_id = ${data.ownerId ?? (cur.owner_id == null ? null : Number(cur.owner_id))},
      venue = ${data.venue === undefined ? (cur.venue as string | null) : data.venue},
      event_date = ${data.eventDate === undefined ? (cur.event_date as string | null) : data.eventDate},
      guest_count = ${data.guestCount === undefined ? (cur.guest_count as number | null) : data.guestCount},
      indoor = ${data.indoor === undefined ? (cur.indoor as boolean | null) : data.indoor},
      load_in = ${data.loadIn === undefined ? (cur.load_in as string | null) : data.loadIn},
      notes = ${data.notes === undefined ? (cur.notes as string | null) : data.notes},
      expected_close = ${data.expectedClose === undefined ? (cur.expected_close as string | null) : data.expectedClose},
      event_type = ${data.eventType === undefined ? (cur.event_type as string | null) : data.eventType},
      updated_at = now()
      where id = ${data.id}`;
    return { ok: true };
  });

export const addDealProduct = createServerFn({ method: "POST" })
  .validator((input: { dealId: number; productId: number; qty: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const p = (await sql`select unit_price from products where id = ${data.productId}`)[0];
    if (!p) return { ok: false };
    await sql`insert into deal_products (deal_id, product_id, qty, discount, price) values (${data.dealId}, ${data.productId}, ${data.qty}, 0, ${money(p.unit_price)})`;
    const sum = (await sql`select coalesce(sum(qty * price * (1 - discount/100.0)),0) as v from deal_products where deal_id = ${data.dealId}`)[0];
    await sql`update deals set value = ${money(sum?.v)}, updated_at = now() where id = ${data.dealId}`;
    return { ok: true };
  });

export const addComment = createServerFn({ method: "POST" })
  .validator((input: { entityType: string; entityId: number; authorId: number; body: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`insert into comments (entity_type, entity_id, author_id, body) values (${data.entityType}, ${data.entityId}, ${data.authorId}, ${data.body})`;
    return { ok: true };
  });

export const addFileMeta = createServerFn({ method: "POST" })
  .validator((input: { entityType: string; entityId: number; name: string; uploadedBy: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`insert into files (entity_type, entity_id, name, kind, size_kb, uploaded_by)
      values (${data.entityType}, ${data.entityId}, ${data.name}, ${"file"}, ${Math.round(40 + Math.random() * 800)}, ${data.uploadedBy})`;
    return { ok: true };
  });

export const listLeads = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql`select l.*, p.name as person_name, p.email as person_email, o.name as org_name,
    m.name as owner_name, m.initials as owner_initials, m.tone as owner_tone,
    extract(epoch from (now() - coalesce(l.stage_entered_at, l.created_at))) / 86400.0 as days_in_stage
    from leads l
    left join people p on p.id = l.person_id
    left join organizations o on o.id = l.org_id
    left join members m on m.id = l.owner_id
    where l.status <> 'archived'
    order by l.score desc, l.created_at desc`;
  return rows.map(mapLead);
});

export const convertLead = createServerFn({ method: "POST" })
  .validator((input: { id: number; pipelineId: number; stageId: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const lead = (await sql`select * from leads where id = ${data.id}`)[0];
    if (!lead) return { id: null as number | null };
    const value = money(lead.estimated_value);
    const rows = await sql`insert into deals (title, value, pipeline_id, stage_id, owner_id, org_id, person_id, source, event_type, venue, event_date)
      values (${String(lead.title)}, ${value}, ${data.pipelineId}, ${data.stageId}, ${lead.owner_id == null ? null : Number(lead.owner_id)}, ${lead.org_id == null ? null : Number(lead.org_id)}, ${lead.person_id == null ? null : Number(lead.person_id)}, ${String(lead.source)}, ${lead.event_type == null ? null : String(lead.event_type)}, ${lead.venue == null ? null : String(lead.venue)}, ${lead.event_date == null ? null : String(lead.event_date)})
      returning id`;
    const dealId = Number(rows[0]!.id);
    await sql`update leads set status = 'converted', deal_id = ${dealId}, stage_entered_at = now() where id = ${data.id}`;
    try {
      await sql`insert into lead_history (lead_id, actor, action, detail) values (${data.id}, ${"Northline"}, ${"converted"}, ${`Deal ${dealId}`})`;
    } catch {
      /* 0023 */
    }
    return { id: dealId };
  });

export const createLead = createServerFn({ method: "POST" })
  .validator(
    (input: {
      title: string;
      source: string;
      ownerId: number;
      notes?: string;
      labels?: string;
      eventType?: string | null;
      eventDate?: string | null;
      venue?: string | null;
      estimatedValue?: number;
    }) => input,
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const score = data.source === "Referral" ? 70 : data.source === "Repeat" ? 65 : data.source === "Prospector" ? 55 : 40;
    const rows = await sql`insert into leads (title, source, owner_id, notes, labels, score, event_type, event_date, venue, estimated_value)
      values (${data.title}, ${data.source}, ${data.ownerId}, ${data.notes ?? null}, ${data.labels ?? null}, ${score}, ${data.eventType ?? null}, ${data.eventDate ?? null}, ${data.venue ?? null}, ${data.estimatedValue ?? 0}) returning id`;
    const id = Number(rows[0]!.id);
    try {
      await sql`insert into lead_history (lead_id, actor, action, detail) values (${id}, ${"Northline"}, ${"new"}, ${data.source})`;
    } catch {
      /* 0023 */
    }
    return { id };
  });

export const updateLead = createServerFn({ method: "POST" })
  .validator(
    (input: {
      id: number;
      status?: string;
      ownerId?: number;
      score?: number;
      eventType?: string | null;
      disqualifyReason?: string | null;
    }) => input,
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const cur = (await sql`select * from leads where id = ${data.id}`)[0];
    if (!cur) return { ok: false };
    const nextStatus = data.status ?? String(cur.status);
    const statusChanged = nextStatus !== String(cur.status);
    await sql`update leads set
      status = ${nextStatus},
      owner_id = ${data.ownerId ?? (cur.owner_id as number | null)},
      score = ${data.score ?? Number(cur.score)},
      event_type = ${data.eventType === undefined ? (cur.event_type as string | null) : data.eventType},
      disqualify_reason = ${data.disqualifyReason === undefined ? (cur.disqualify_reason as string | null) : data.disqualifyReason},
      stage_entered_at = ${statusChanged ? new Date().toISOString() : (cur.stage_entered_at as string)}
      where id = ${data.id}`;
    if (statusChanged) {
      try {
        await sql`insert into lead_history (lead_id, actor, action, detail) values (${data.id}, ${"Northline"}, ${nextStatus}, ${data.disqualifyReason ?? nextStatus})`;
      } catch {
        /* 0023 */
      }
    }
    return { ok: true };
  });

export const listPeople = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql`select p.*, o.name as org_name, m.name as owner_name,
    (select count(*) from deals d where d.person_id = p.id and d.status = 'open') as open_deals,
    (select coalesce(sum(d.value),0) from deals d where d.person_id = p.id and d.status = 'open') as deal_value
    from people p
    left join organizations o on o.id = p.org_id
    left join members m on m.id = p.owner_id
    order by p.name`;
  return rows.map(mapPerson);
});

export const listOrgs = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql`select o.*, m.name as owner_name,
    (select count(*) from people p where p.org_id = o.id) as people_count,
    (select count(*) from deals d where d.org_id = o.id and d.status = 'open') as open_deals,
    (select coalesce(sum(d.value),0) from deals d where d.org_id = o.id and d.status = 'open') as deal_value
    from organizations o
    left join members m on m.id = o.owner_id
    order by o.name`;
  return rows.map(mapOrg);
});

export const createPerson = createServerFn({ method: "POST" })
  .validator((input: { name: string; email?: string; phone?: string; title?: string; orgId?: number | null; ownerId: number; city?: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql`insert into people (name, email, phone, title, org_id, owner_id, city)
      values (${data.name}, ${data.email ?? null}, ${data.phone ?? null}, ${data.title ?? null}, ${data.orgId ?? null}, ${data.ownerId}, ${data.city ?? "New York"})
      returning id`;
    return { id: Number(rows[0]!.id) };
  });

export const createOrg = createServerFn({ method: "POST" })
  .validator((input: { name: string; city?: string; industry?: string; website?: string; ownerId: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql`insert into organizations (name, city, industry, website, owner_id)
      values (${data.name}, ${data.city ?? "New York"}, ${data.industry ?? "Events"}, ${data.website ?? null}, ${data.ownerId})
      returning id`;
    return { id: Number(rows[0]!.id) };
  });

export const listActivities = createServerFn({ method: "GET" })
  .validator((input: { ownerId?: number } = {}) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql.query(
      `select a.*, d.title as deal_title, p.name as person_name, o.name as org_name,
              m.name as owner_name, m.initials as owner_initials, m.tone as owner_tone
       from activities a
       left join deals d on d.id = a.deal_id
       left join people p on p.id = a.person_id
       left join organizations o on o.id = a.org_id
       left join members m on m.id = a.owner_id
       where ($1::int is null or a.owner_id = $1)
       order by a.due_at nulls last`,
      [data.ownerId ?? null],
    );
    return rows.map(mapActivity);
  });

export const createActivity = createServerFn({ method: "POST" })
  .validator(
    (input: {
      type: string;
      subject: string;
      ownerId: number;
      dueAt?: string | null;
      dealId?: number | null;
      personId?: number | null;
      orgId?: number | null;
      location?: string;
      durationMin?: number;
    }) => input,
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`insert into activities (type, subject, owner_id, due_at, deal_id, person_id, org_id, location, duration_min)
      values (${data.type}, ${data.subject}, ${data.ownerId}, ${data.dueAt ?? null}, ${data.dealId ?? null}, ${data.personId ?? null}, ${data.orgId ?? null}, ${data.location ?? null}, ${data.durationMin ?? 30})`;
    return { ok: true };
  });

export const toggleActivity = createServerFn({ method: "POST" })
  .validator((input: { id: number; done: boolean }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`update activities set done = ${data.done} where id = ${data.id}`;
    return { ok: true };
  });

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  return (await sql`select * from products order by category, name`).map(mapProduct);
});

export const createProduct = createServerFn({ method: "POST" })
  .validator((input: { name: string; category: string; unitPrice: number; unit: string; sku?: string; billing?: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`insert into products (name, category, unit_price, unit, sku, billing)
      values (${data.name}, ${data.category}, ${data.unitPrice}, ${data.unit}, ${data.sku ?? null}, ${data.billing ?? "one-time"})`;
    return { ok: true };
  });

export const listProjects = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql`select pr.*, d.title as deal_title, d.venue, m.name as owner_name,
    (select count(*) from project_tasks t where t.project_id = pr.id) as task_count,
    (select count(*) from project_tasks t where t.project_id = pr.id and t.column_name = 'Done') as done_count
    from projects pr
    left join deals d on d.id = pr.deal_id
    left join members m on m.id = pr.owner_id
    order by pr.status, pr.end_date nulls last`;
  return rows.map(mapProject);
});

export const getProject = createServerFn({ method: "GET" })
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql`select pr.*, d.title as deal_title, d.venue, m.name as owner_name,
      (select count(*) from project_tasks t where t.project_id = pr.id) as task_count,
      (select count(*) from project_tasks t where t.project_id = pr.id and t.column_name = 'Done') as done_count
      from projects pr
      left join deals d on d.id = pr.deal_id
      left join members m on m.id = pr.owner_id
      where pr.id = ${data.id}`;
    if (!rows[0]) return null;
    const tasks = (
      await sql`select t.*, m.name as assignee_name from project_tasks t left join members m on m.id = t.assignee_id where t.project_id = ${data.id} order by t.sort_order`
    ).map(mapTask);
    return { project: mapProject(rows[0]), tasks };
  });

export const moveTask = createServerFn({ method: "POST" })
  .validator((input: { id: number; columnName: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`update project_tasks set column_name = ${data.columnName} where id = ${data.id}`;
    return { ok: true };
  });

export const addTask = createServerFn({ method: "POST" })
  .validator((input: { projectId: number; title: string; assigneeId?: number | null }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`insert into project_tasks (project_id, title, column_name, assignee_id) values (${data.projectId}, ${data.title}, ${"To do"}, ${data.assigneeId ?? null})`;
    return { ok: true };
  });

export const listEmails = createServerFn({ method: "GET" })
  .validator((input: { folder?: string } = {}) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const folder = data.folder ?? "inbox";
    const rows = await sql.query(
      `select e.*, d.title as deal_title from emails e left join deals d on d.id = e.deal_id
       where ($1 = 'all' or e.folder = $1)
       order by coalesce(e.sent_at, e.created_at) desc`,
      [folder],
    );
    return rows.map(mapEmail);
  });

export const listTemplates = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  return (await sql`select * from email_templates order by id`).map((t) => ({
    id: Number(t.id),
    name: String(t.name),
    subject: String(t.subject),
    body: String(t.body),
  }));
});

export const sendEmail = createServerFn({ method: "POST" })
  .validator(
    (input: {
      fromName: string;
      fromAddr: string;
      toAddr: string;
      subject: string;
      body: string;
      dealId?: number | null;
      folder?: string;
      memberId?: number | null;
    }) => input,
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const sender = await insertOutbound(sql, {
      purpose: "compose",
      toAddr: data.toAddr,
      subject: data.subject,
      body: data.body,
      dealId: data.dealId ?? null,
      folder: data.folder ?? "sent",
      memberId: data.memberId,
      fallbackName: data.fromName,
      hintAddr: data.fromAddr,
    });
    return { ok: true as const, fromName: sender.fromName, fromAddr: sender.fromAddr, authenticated: sender.authenticated };
  });

export const listDocuments = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  return (
    await sql`select doc.*, d.title as deal_title from documents doc left join deals d on d.id = doc.deal_id order by doc.created_at desc`
  ).map(mapDoc);
});

export const createDocument = createServerFn({ method: "POST" })
  .validator((input: { name: string; dealId?: number | null; template: string; content: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`insert into documents (name, deal_id, template, status, content) values (${data.name}, ${data.dealId ?? null}, ${data.template}, ${"draft"}, ${data.content})`;
    return { ok: true };
  });

export const advanceDocument = createServerFn({ method: "POST" })
  .validator((input: { id: number; action: "send" | "view" | "sign" | "decline" }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    if (data.action === "send") await sql`update documents set status = 'sent', sent_at = now() where id = ${data.id}`;
    if (data.action === "view") await sql`update documents set status = 'viewed', viewed_at = now() where id = ${data.id}`;
    if (data.action === "sign") await sql`update documents set status = 'signed', signed_at = now() where id = ${data.id}`;
    if (data.action === "decline") await sql`update documents set status = 'declined' where id = ${data.id}`;
    return { ok: true };
  });

export const listAutomations = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  return (await sql`select * from automations order by id`).map(
    (a): Automation => ({
      id: Number(a.id),
      name: String(a.name),
      active: Boolean(a.active),
      triggerType: String(a.trigger_type),
      triggerDetail: a.trigger_detail == null ? null : String(a.trigger_detail),
      actionType: String(a.action_type),
      actionDetail: a.action_detail == null ? null : String(a.action_detail),
      conditions: a.conditions == null ? null : String(a.conditions),
      runs: Number(a.runs),
    }),
  );
});

export const toggleAutomation = createServerFn({ method: "POST" })
  .validator((input: { id: number; active: boolean }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`update automations set active = ${data.active} where id = ${data.id}`;
    return { ok: true };
  });

export const createAutomation = createServerFn({ method: "POST" })
  .validator((input: { name: string; triggerType: string; triggerDetail: string; actionType: string; actionDetail: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const cap = await assertCap("automations");
    if (cap) return { ok: false, error: cap };
    await sql`insert into automations (name, trigger_type, trigger_detail, action_type, action_detail, active)
      values (${data.name}, ${data.triggerType}, ${data.triggerDetail}, ${data.actionType}, ${data.actionDetail}, true)`;
    return { ok: true, error: null as string | null };
  });

export const listSequences = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  return (await sql`select * from sequences order by id`).map((s): Sequence => {
    const steps = typeof s.steps === "string" ? JSON.parse(s.steps) : s.steps;
    return {
      id: Number(s.id),
      name: String(s.name),
      active: Boolean(s.active),
      steps: (steps ?? []) as Sequence["steps"],
      enrolled: Number(s.enrolled),
    };
  });
});

export const toggleSequence = createServerFn({ method: "POST" })
  .validator((input: { id: number; active: boolean }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`update sequences set active = ${data.active} where id = ${data.id}`;
    return { ok: true };
  });

export { listForms, getFormBySlug, submitForm } from "./forms";

export const listChats = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const chats = await sql`select c.*, m.name as assignee_name from chats c left join members m on m.id = c.assignee_id order by c.updated_at desc`;
  const messages = await sql`select * from chat_messages order by created_at`;
  return chats.map(
    (c): ChatThread => ({
      id: Number(c.id),
      visitorName: String(c.visitor_name),
      visitorEmail: c.visitor_email == null ? null : String(c.visitor_email),
      status: String(c.status),
      assigneeId: c.assignee_id == null ? null : Number(c.assignee_id),
      assigneeName: c.assignee_name == null ? null : String(c.assignee_name),
      source: String(c.source),
      lastMessage: c.last_message == null ? null : String(c.last_message),
      updatedAt: iso(c.updated_at) ?? "",
      messages: messages
        .filter((m) => Number(m.chat_id) === Number(c.id))
        .map((m) => ({
          id: Number(m.id),
          chatId: Number(m.chat_id),
          sender: String(m.sender),
          body: String(m.body),
          createdAt: iso(m.created_at) ?? "",
        })),
    }),
  );
});

export const sendChat = createServerFn({ method: "POST" })
  .validator((input: { chatId: number; sender: string; body: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`insert into chat_messages (chat_id, sender, body) values (${data.chatId}, ${data.sender}, ${data.body})`;
    await sql`update chats set last_message = ${data.body}, updated_at = now() where id = ${data.chatId}`;
    return { ok: true };
  });

export const listProspects = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  return (await sql`select * from prospect_companies order by name`).map(
    (p): Prospect => ({
      id: Number(p.id),
      name: String(p.name),
      industry: p.industry == null ? null : String(p.industry),
      city: p.city == null ? null : String(p.city),
      employees: p.employees == null ? null : String(p.employees),
      website: p.website == null ? null : String(p.website),
      email: p.email == null ? null : String(p.email),
      phone: p.phone == null ? null : String(p.phone),
      added: Boolean(p.added),
    }),
  );
});

export const addProspect = createServerFn({ method: "POST" })
  .validator((input: { id: number; ownerId: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const p = (await sql`select * from prospect_companies where id = ${data.id}`)[0];
    if (!p) return { ok: false };
    await sql`update prospect_companies set added = true where id = ${data.id}`;
    const org = await sql`insert into organizations (name, website, city, industry, owner_id, phone)
      values (${String(p.name)}, ${p.website == null ? null : String(p.website)}, ${p.city == null ? null : String(p.city)}, ${p.industry == null ? null : String(p.industry)}, ${data.ownerId}, ${p.phone == null ? null : String(p.phone)})
      returning id`;
    await sql`insert into leads (title, org_id, owner_id, source, score, notes)
      values (${`${String(p.name)} — outbound`}, ${Number(org[0]!.id)}, ${data.ownerId}, ${"Prospector"}, ${55}, ${p.email == null ? null : String(p.email)})`;
    return { ok: true };
  });

export const listScheduler = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const links = (await sql`select s.*, m.name as member_name from scheduler_links s left join members m on m.id = s.member_id`).map(
    (s): SchedulerLink => ({
      id: Number(s.id),
      memberId: s.member_id == null ? null : Number(s.member_id),
      memberName: s.member_name == null ? null : String(s.member_name),
      name: String(s.name),
      durationMin: Number(s.duration_min),
      slug: String(s.slug),
      bookings: Number(s.bookings),
      source: s.source == null ? "northline" : String(s.source),
      calendlyUrl: s.calendly_url == null ? null : String(s.calendly_url),
      locationKind: s.location_kind == null ? "zoom" : String(s.location_kind),
    }),
  );
  const bookings = (await sql`select * from bookings order by starts_at`).map((b) => ({
    id: Number(b.id),
    linkId: b.link_id == null ? null : Number(b.link_id),
    guestName: String(b.guest_name),
    guestEmail: String(b.guest_email),
    startsAt: iso(b.starts_at) ?? "",
    notes: b.notes == null ? null : String(b.notes),
    status: b.status == null ? "confirmed" : String(b.status),
    durationMin: b.duration_min == null ? undefined : Number(b.duration_min),
    zoomJoinUrl: b.zoom_join_url == null ? null : String(b.zoom_join_url),
    zoomPasscode: b.zoom_passcode == null ? null : String(b.zoom_passcode),
    confirmationSentAt: iso(b.confirmation_sent_at),
    calendlyEventUri: b.calendly_event_uri == null ? null : String(b.calendly_event_uri),
  }));
  return { links, bookings };
});

export const bookSlot = createServerFn({ method: "POST" })
  .validator((input: { linkId: number; guestName: string; guestEmail: string; startsAt: string; notes?: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const inserted = await sql.query(
      `insert into bookings (link_id, guest_name, guest_email, starts_at, notes, status)
       values ($1,$2,$3,$4,$5,'confirmed') returning id`,
      [data.linkId, data.guestName, data.guestEmail, data.startsAt, data.notes ?? null],
    );
    await sql`update scheduler_links set bookings = bookings + 1 where id = ${data.linkId}`;
    const link = (await sql`select member_id, name, duration_min from scheduler_links where id = ${data.linkId}`)[0];
    const duration = Number(link?.duration_min ?? 30);
    await sql`insert into activities (type, subject, owner_id, due_at, duration_min)
      values (${"meeting"}, ${`${data.guestName} — ${String(link?.name ?? "Meeting")}`}, ${link?.member_id == null ? 1 : Number(link.member_id)}, ${data.startsAt}, ${duration})`;
    const bookingId = Number(inserted[0].id);
    const extra = await completeNewBooking(sql, bookingId);
    return { ok: true as const, ...(extra ?? {}) };
  });

export const listNotifications = createServerFn({ method: "GET" })
  .validator((input: { memberId?: number } = {}) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql.query(
      `select * from notifications where ($1::int is null or member_id = $1) order by created_at desc limit 30`,
      [data.memberId ?? null],
    );
    return rows.map(
      (n): Notification => ({
        id: Number(n.id),
        memberId: n.member_id == null ? null : Number(n.member_id),
        kind: String(n.kind),
        title: String(n.title),
        body: String(n.body),
        href: n.href == null ? null : String(n.href),
        read: Boolean(n.read),
        createdAt: iso(n.created_at) ?? "",
      }),
    );
  });

export const markNotificationsRead = createServerFn({ method: "POST" })
  .validator((input: { memberId: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`update notifications set read = true where member_id = ${data.memberId}`;
    return { ok: true };
  });

export const getPulse = createServerFn({ method: "GET" }).handler(async (): Promise<PulseItem[]> => {
  const sql = await getSql();
  const rotting = await sql.query(
    `select d.id, d.title, s.rotting_days,
            extract(epoch from (now() - d.stage_entered_at))/86400.0 as days
     from deals d join stages s on s.id = d.stage_id
     where d.status = 'open' and extract(epoch from (now() - d.stage_entered_at))/86400.0 > s.rotting_days`,
  );
  const overdue = await sql`select a.id, a.subject, a.due_at, d.title as deal_title
    from activities a left join deals d on d.id = a.deal_id
    where a.done = false and a.due_at < now()`;
  const mentions = await sql`select c.id, c.body, c.created_at, m.name from comments c left join members m on m.id = c.author_id
    where c.body like '%@%' order by c.created_at desc limit 8`;
  const items: PulseItem[] = [];
  for (const r of rotting) {
    items.push({
      id: `rot-${r.id}`,
      kind: "rot",
      title: String(r.title),
      body: `${Math.floor(Number(r.days))} days in stage · rotting after ${r.rotting_days}`,
      href: `/deals/${r.id}`,
      at: new Date().toISOString(),
    });
  }
  for (const r of overdue) {
    items.push({
      id: `ov-${r.id}`,
      kind: "overdue",
      title: String(r.subject),
      body: r.deal_title ? String(r.deal_title) : "Activity overdue",
      href: "/activities",
      at: iso(r.due_at) ?? "",
    });
  }
  for (const r of mentions) {
    items.push({
      id: `mn-${r.id}`,
      kind: "mention",
      title: `${r.name ?? "Teammate"} mentioned someone`,
      body: String(r.body),
      href: "/",
      at: iso(r.created_at) ?? "",
    });
  }
  return items.slice(0, 24);
});

export const getInsights = createServerFn({ method: "GET" }).handler(async (): Promise<Insights> => {
  const sql = await getSql();
  const deals = await sql`select d.*, s.name as stage_name, s.probability as stage_probability, m.name as owner_name
    from deals d left join stages s on s.id = d.stage_id left join members m on m.id = d.owner_id`;
  const activities = await sql`select done, due_at from activities`;
  const open = deals.filter((d) => d.status === "open");
  const won = deals.filter((d) => d.status === "won");
  const lost = deals.filter((d) => d.status === "lost");
  const openValue = open.reduce((s, d) => s + money(d.value), 0);
  const wonValue = won.reduce((s, d) => s + money(d.value), 0);
  const lostValue = lost.reduce((s, d) => s + money(d.value), 0);
  const weightedValue = open.reduce((s, d) => s + money(d.value) * (Number(d.probability ?? d.stage_probability ?? 0) / 100), 0);
  const closed = won.length + lost.length;
  const rottingCount = open.filter((d) => {
    const entered = d.stage_entered_at ? new Date(String(d.stage_entered_at)).getTime() : Date.now();
    return Date.now() - entered > 10 * 86400000;
  }).length;
  const byStageMap = new Map<string, { value: number; count: number }>();
  for (const d of open) {
    const name = String(d.stage_name ?? "—");
    const cur = byStageMap.get(name) ?? { value: 0, count: 0 };
    cur.value += money(d.value);
    cur.count += 1;
    byStageMap.set(name, cur);
  }
  const byOwnerMap = new Map<string, { value: number; won: number }>();
  for (const d of deals) {
    const name = String(d.owner_name ?? "Unassigned");
    const cur = byOwnerMap.get(name) ?? { value: 0, won: 0 };
    if (d.status === "open") cur.value += money(d.value);
    if (d.status === "won") cur.won += money(d.value);
    byOwnerMap.set(name, cur);
  }
  const bySourceMap = new Map<string, number>();
  for (const d of open) {
    const name = String(d.source ?? "Unknown");
    bySourceMap.set(name, (bySourceMap.get(name) ?? 0) + money(d.value));
  }
  const months: Insights["byMonth"] = [];
  for (let i = 5; i >= 0; i--) {
    const dt = new Date();
    dt.setDate(1);
    dt.setMonth(dt.getMonth() - i);
    const key = dt.toLocaleString("en-US", { month: "short" });
    const y = dt.getFullYear();
    const m = dt.getMonth();
    const wonM = won
      .filter((d) => {
        const t = d.won_at ? new Date(String(d.won_at)) : null;
        return t && t.getFullYear() === y && t.getMonth() === m;
      })
      .reduce((s, d) => s + money(d.value), 0);
    const openM = open.reduce((s, d) => s + money(d.value) / 6, 0);
    months.push({ month: key, won: wonM, open: Math.round(openM) });
  }
  const activityWeek: Insights["activityWeek"] = [];
  for (let i = 6; i >= 0; i--) {
    const dt = new Date();
    dt.setHours(0, 0, 0, 0);
    dt.setDate(dt.getDate() - i);
    const next = new Date(dt);
    next.setDate(dt.getDate() + 1);
    const dayActs = activities.filter((a) => {
      if (!a.due_at) return false;
      const t = new Date(String(a.due_at)).getTime();
      return t >= dt.getTime() && t < next.getTime();
    });
    activityWeek.push({
      day: dt.toLocaleString("en-US", { weekday: "short" }),
      done: dayActs.filter((a) => a.done).length,
      planned: dayActs.length,
    });
  }
  return {
    openValue,
    wonValue,
    lostValue,
    weightedValue,
    winRate: closed ? Math.round((won.length / closed) * 100) : 0,
    avgDeal: won.length ? Math.round(wonValue / won.length) : 0,
    openCount: open.length,
    wonCount: won.length,
    rottingCount,
    overdueActivities: activities.filter((a) => !a.done && a.due_at && new Date(String(a.due_at)) < new Date()).length,
    byStage: [...byStageMap.entries()].map(([name, v]) => ({ name, ...v })),
    byOwner: [...byOwnerMap.entries()].map(([name, v]) => ({ name, ...v })),
    byMonth: months,
    bySource: [...bySourceMap.entries()].map(([name, value]) => ({ name, value })),
    activityWeek,
  };
});

export const getSecurity = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const alerts = (await sql`select * from security_alerts order by created_at desc`).map(
    (a): SecurityAlert => ({
      id: Number(a.id),
      severity: String(a.severity),
      title: String(a.title),
      detail: String(a.detail),
      resolved: Boolean(a.resolved),
      createdAt: iso(a.created_at) ?? "",
    }),
  );
  const rules = (await sql`select * from security_rules order by id`).map(
    (r): SecurityRule => ({
      id: Number(r.id),
      name: String(r.name),
      detail: String(r.detail),
      active: Boolean(r.active),
    }),
  );
  const devices = (await sql`select * from devices order by last_active desc`).map(
    (d): Device => ({
      id: Number(d.id),
      memberName: String(d.member_name),
      device: String(d.device),
      location: String(d.location),
      lastActive: iso(d.last_active) ?? "",
      current: Boolean(d.current),
    }),
  );
  const auditLog = (await sql`select * from audit_log order by created_at desc limit 40`).map(
    (a): AuditRow => ({
      id: Number(a.id),
      actor: String(a.actor),
      action: String(a.action),
      entity: String(a.entity),
      detail: a.detail == null ? null : String(a.detail),
      ip: a.ip == null ? null : String(a.ip),
      device: a.device == null ? null : String(a.device),
      createdAt: iso(a.created_at) ?? "",
    }),
  );
  const webhooks = (await sql`select * from webhooks order by id`).map(
    (w): Webhook => ({
      id: Number(w.id),
      url: String(w.url),
      event: String(w.event),
      active: Boolean(w.active),
      lastStatus: w.last_status == null ? null : String(w.last_status),
    }),
  );
  return { alerts, rules, devices, auditLog, webhooks };
});

export const toggleRule = createServerFn({ method: "POST" })
  .validator((input: { id: number; active: boolean }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`update security_rules set active = ${data.active} where id = ${data.id}`;
    return { ok: true };
  });

export const resolveAlert = createServerFn({ method: "POST" })
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`update security_alerts set resolved = true where id = ${data.id}`;
    return { ok: true };
  });

export const listFields = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  return (await sql`select * from custom_fields order by id`).map(
    (f): CustomField => ({
      id: Number(f.id),
      entity: String(f.entity),
      name: String(f.name),
      fieldType: String(f.field_type),
      options: f.options == null ? null : String(f.options),
      required: Boolean(f.required),
      pipelineId: f.pipeline_id == null ? null : Number(f.pipeline_id),
    }),
  );
});

export const createField = createServerFn({ method: "POST" })
  .validator((input: { entity: string; name: string; fieldType: string; required: boolean; pipelineId?: number | null }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const cap = await assertCap("fields");
    if (cap) return { ok: false, error: cap };
    await sql`insert into custom_fields (entity, name, field_type, required, pipeline_id)
      values (${data.entity}, ${data.name}, ${data.fieldType}, ${data.required}, ${data.pipelineId ?? null})`;
    return { ok: true, error: null as string | null };
  });

export const listMarketplace = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  return (await sql`select * from marketplace_apps order by category, name`).map(
    (a): MarketplaceApp => ({
      id: Number(a.id),
      name: String(a.name),
      category: String(a.category),
      description: String(a.description),
      connected: Boolean(a.connected),
    }),
  );
});

export const toggleApp = createServerFn({ method: "POST" })
  .validator((input: { id: number; connected: boolean }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`update marketplace_apps set connected = ${data.connected} where id = ${data.id}`;
    return { ok: true };
  });

export const listScores = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  return (await sql`select * from score_models`).map((s): ScoreModel => {
    const rules = typeof s.rules === "string" ? JSON.parse(String(s.rules)) : s.rules;
    return {
      id: Number(s.id),
      name: String(s.name),
      entity: String(s.entity),
      rules: (rules ?? []) as ScoreModel["rules"],
      active: Boolean(s.active),
    };
  });
});

export const listReports = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  return (await sql`select * from custom_reports`).map(
    (r): CustomReport => ({
      id: Number(r.id),
      name: String(r.name),
      kind: String(r.kind),
      config: (typeof r.config === "string" ? JSON.parse(String(r.config)) : r.config) as Record<
        string,
        string | number | boolean
      >,
    }),
  );
});

export const createReport = createServerFn({ method: "POST" })
  .validator((input: { name: string; kind: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const cap = await assertCap("reports");
    if (cap) return { ok: false, error: cap };
    await sql`insert into custom_reports (name, kind, config) values (${data.name}, ${data.kind}, '{}'::jsonb)`;
    return { ok: true, error: null as string | null };
  });

export const exportDealsCsv = createServerFn({ method: "GET" })
  .validator((input: { pipelineId: number }) => input)
  .handler(async ({ data }) => {
    const blocked = await guardAction("export");
    if (!blocked.ok) return { csv: "", error: blocked.reason ?? "Export blocked by access policy." };
    const sql = await getSql();
    const rows = await sql.query(
      `select d.title, d.value, d.status, d.venue, d.event_date, o.name as org, m.name as owner, s.name as stage
       from deals d
       left join organizations o on o.id = d.org_id
       left join members m on m.id = d.owner_id
       left join stages s on s.id = d.stage_id
       where d.pipeline_id = $1
       order by d.value desc`,
      [data.pipelineId],
    );
    const header = "title,value,status,venue,event_date,org,owner,stage";
    const body = rows
      .map((r) =>
        [r.title, r.value, r.status, r.venue, r.event_date, r.org, r.owner, r.stage]
          .map((v) => `"${String(v ?? "").replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");
    await audit("Northline", "exported", "deals", "CSV export");
    return { csv: `${header}\n${body}`, error: null as string | null };
  });

export const mergePeople = createServerFn({ method: "POST" })
  .validator((input: { keepId: number; dropId: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`update deals set person_id = ${data.keepId} where person_id = ${data.dropId}`;
    await sql`update activities set person_id = ${data.keepId} where person_id = ${data.dropId}`;
    await sql`update emails set person_id = ${data.keepId} where person_id = ${data.dropId}`;
    await sql`update leads set person_id = ${data.keepId} where person_id = ${data.dropId}`;
    await sql`delete from people where id = ${data.dropId}`;
    return { ok: true };
  });

export const updateStage = createServerFn({ method: "POST" })
  .validator((input: { id: number; name?: string; rottingDays?: number; probability?: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const cur = (await sql`select * from stages where id = ${data.id}`)[0];
    if (!cur) return { ok: false };
    await sql`update stages set name = ${data.name ?? String(cur.name)}, rotting_days = ${data.rottingDays ?? Number(cur.rotting_days)}, probability = ${data.probability ?? Number(cur.probability)} where id = ${data.id}`;
    return { ok: true };
  });
