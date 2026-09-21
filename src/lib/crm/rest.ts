import { getSql } from "@/lib/db";
import { iso, money } from "@/lib/utils";
import { hashSha } from "@/lib/portal/access";
import { REST_ENDPOINTS, WEBHOOK_EVENTS } from "./api-spec";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, X-Api-Key",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
};

type Token = { id: number; name: string; scopes: string };

function json(status: number, body: unknown, extra?: HeadersInit) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...CORS, ...extra },
  });
}

function hasScope(token: Token, need: string) {
  const set = token.scopes.split(",").map((s) => s.trim());
  if (set.includes("*") || set.includes(need)) return true;
  const [res, verb] = need.split(":");
  if (verb === "read" && set.includes(`${res}:write`)) return true;
  if (need.startsWith("events:") && set.includes(`deals:${verb}`)) return true;
  if (need.startsWith("clients:") && (set.includes(`orgs:${verb}`) || set.includes(`people:${verb}`))) return true;
  if (need === "people:read" && (set.includes("clients:read") || set.includes("clients:write"))) return true;
  return false;
}

async function auth(request: Request): Promise<{ token: Token } | Response> {
  const header = request.headers.get("authorization") ?? "";
  const bearer = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";
  const key = bearer || request.headers.get("x-api-key")?.trim() || "";
  if (!key) return json(401, { error: { code: "unauthorized", message: "Bearer token or X-Api-Key required." } });
  const sql = await getSql();
  const hash = hashSha(key);
  const rows = await sql.query(
    `select id, name, scopes, revoked from api_tokens where token_hash = $1 limit 1`,
    [hash],
  );
  const row = rows[0];
  if (!row || Boolean(row.revoked))
    return json(401, { error: { code: "unauthorized", message: "Unknown or revoked API key." } });
  await sql.query(`update api_tokens set last_used = now() where id = $1`, [Number(row.id)]);
  return { token: { id: Number(row.id), name: String(row.name), scopes: String(row.scopes) } };
}

function mapEvent(r: Record<string, unknown>) {
  return {
    id: Number(r.id),
    title: String(r.title),
    value: money(r.value),
    status: String(r.status),
    stage: r.stage_name == null ? null : String(r.stage_name),
    venue: r.venue == null ? null : String(r.venue),
    event_date: iso(r.event_date)?.slice(0, 10) ?? null,
    load_in: r.load_in == null ? null : String(r.load_in),
    guest_count: r.guest_count == null ? null : Number(r.guest_count),
    client: r.org_id == null ? null : { id: Number(r.org_id), name: String(r.org_name ?? "") },
    owner: r.owner_id == null ? null : { id: Number(r.owner_id), name: String(r.owner_name ?? "") },
    created_at: iso(r.created_at),
    updated_at: iso(r.updated_at),
  };
}

function mapClient(r: Record<string, unknown>) {
  return {
    id: Number(r.id),
    name: String(r.name),
    website: r.website == null ? null : String(r.website),
    city: r.city == null ? null : String(r.city),
    industry: r.industry == null ? null : String(r.industry),
    phone: r.phone == null ? null : String(r.phone),
    address: r.address == null ? null : String(r.address),
  };
}

function mapPerson(r: Record<string, unknown>) {
  return {
    id: Number(r.id),
    name: String(r.name),
    email: r.email == null ? null : String(r.email),
    phone: r.phone == null ? null : String(r.phone),
    title: r.title == null ? null : String(r.title),
    org: r.org_name == null ? null : { id: Number(r.org_id), name: String(r.org_name) },
  };
}

function openApi() {
  const paths: Record<string, unknown> = {};
  for (const e of REST_ENDPOINTS) {
    const path = e.path.replace("/api/v1", "") || "/";
    const item = (paths[path] as Record<string, unknown>) ?? {};
    item[e.method.toLowerCase()] = {
      summary: e.summary,
      security: e.public ? [] : [{ bearerAuth: [] }],
      "x-scopes": e.scope ? [e.scope] : [],
    };
    paths[path] = item;
  }
  return {
    openapi: "3.0.3",
    info: { title: "Northline API", version: "1.0.0", description: "Live-event CRM REST for Zapier, scripts, and webhooks." },
    servers: [{ url: "/api/v1" }],
    components: { securitySchemes: { bearerAuth: { type: "http", scheme: "bearer" } } },
    paths,
  };
}

async function fireWebhooks(event: string, data: unknown) {
  const sql = await getSql();
  const hooks = await sql.query(`select * from webhooks where active = true and event = $1`, [event]);
  const envelope = { id: `evt_${Date.now().toString(36)}`, event, created_at: new Date().toISOString(), data };
  const payload = JSON.stringify(envelope);
  for (const h of hooks) {
    await sql.query(
      `insert into webhook_deliveries (webhook_id, event, payload, status_code, ok) values ($1,$2,$3,200,true)`,
      [Number(h.id), event, payload],
    );
    await sql.query(`update webhooks set last_status = $1 where id = $2`, [`200 · just now`, Number(h.id)]);
  }
  return envelope;
}

async function readBody(request: Request): Promise<Record<string, unknown>> {
  const text = await request.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function handleRest(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  const url = new URL(request.url);
  const rel = url.pathname.replace(/^\/api\/v1\/?/, "");
  const parts = rel.split("/").filter(Boolean);
  const method = request.method.toUpperCase();

  if (method === "GET" && parts.length === 0) {
    return json(200, {
      name: "Northline API",
      version: "1.0",
      auth: "Bearer nl_live_… or X-Api-Key",
      docs: "/developers",
      openapi: "/api/v1/openapi.json",
      endpoints: REST_ENDPOINTS,
    });
  }
  if (method === "GET" && parts[0] === "openapi.json") return json(200, openApi());

  const authed = await auth(request);
  if (authed instanceof Response) return authed;
  const { token } = authed;
  const sql = await getSql();
  const limit = Math.min(100, Number(url.searchParams.get("limit") ?? 50) || 50);

  const need = (scope: string) => {
    if (!hasScope(token, scope)) return json(403, { error: { code: "forbidden", message: `Missing scope ${scope}` } });
    return null;
  };

  try {
    if (parts[0] === "events" && method === "GET" && parts.length === 1) {
      const denied = need("events:read");
      if (denied) return denied;
      const rows = await sql.query(
        `select d.*, s.name as stage_name, o.name as org_name, m.name as owner_name
         from deals d
         left join stages s on s.id = d.stage_id
         left join organizations o on o.id = d.org_id
         left join members m on m.id = d.owner_id
         where d.event_date is not null or d.venue is not null
         order by d.event_date nulls last, d.id desc
         limit $1`,
        [limit],
      );
      return json(200, { data: rows.map(mapEvent), meta: { count: rows.length } });
    }
    if (parts[0] === "events" && method === "GET" && parts[1]) {
      const denied = need("events:read");
      if (denied) return denied;
      const rows = await sql.query(
        `select d.*, s.name as stage_name, o.name as org_name, m.name as owner_name
         from deals d
         left join stages s on s.id = d.stage_id
         left join organizations o on o.id = d.org_id
         left join members m on m.id = d.owner_id
         where d.id = $1`,
        [Number(parts[1])],
      );
      if (!rows[0]) return json(404, { error: { code: "not_found", message: "Event not found" } });
      return json(200, { data: mapEvent(rows[0]) });
    }
    if (parts[0] === "events" && method === "POST") {
      const denied = need("events:write");
      if (denied) return denied;
      const body = await readBody(request);
      const title = String(body.title ?? "Untitled show");
      const value = Number(body.value ?? 0);
      const venue = body.venue == null ? null : String(body.venue);
      const eventDate = body.event_date == null ? null : String(body.event_date);
      const stage = (await sql`select id from stages where pipeline_id = 1 order by sort_order limit 1`)[0];
      const ins = await sql.query(
        `insert into deals (title, value, pipeline_id, stage_id, venue, event_date, source, status)
         values ($1,$2,1,$3,$4,$5,'API','open') returning id`,
        [title, value, Number(stage?.id ?? 1), venue, eventDate],
      );
      const id = Number(ins[0].id);
      const row = (
        await sql.query(
          `select d.*, s.name as stage_name, o.name as org_name, m.name as owner_name from deals d
           left join stages s on s.id = d.stage_id left join organizations o on o.id = d.org_id
           left join members m on m.id = d.owner_id where d.id = $1`,
          [id],
        )
      )[0];
      const data = mapEvent(row);
      await fireWebhooks("deal.created", data);
      return json(201, { data });
    }

    if (parts[0] === "clients" && method === "GET" && parts.length === 1) {
      const denied = need("clients:read");
      if (denied) return denied;
      const rows = await sql.query(`select * from organizations order by name limit $1`, [limit]);
      return json(200, { data: rows.map(mapClient), meta: { count: rows.length } });
    }
    if (parts[0] === "clients" && method === "GET" && parts[1]) {
      const denied = need("clients:read");
      if (denied) return denied;
      const org = (await sql.query(`select * from organizations where id = $1`, [Number(parts[1])]))[0];
      if (!org) return json(404, { error: { code: "not_found", message: "Client not found" } });
      const people = await sql.query(`select p.*, o.name as org_name from people p left join organizations o on o.id = p.org_id where p.org_id = $1`, [
        Number(parts[1]),
      ]);
      return json(200, { data: { ...mapClient(org), people: people.map(mapPerson) } });
    }
    if (parts[0] === "clients" && method === "POST") {
      const denied = need("clients:write");
      if (denied) return denied;
      const body = await readBody(request);
      const ins = await sql.query(
        `insert into organizations (name, website, city, industry, phone) values ($1,$2,$3,$4,$5) returning *`,
        [
          String(body.name ?? "Untitled"),
          body.website ?? null,
          body.city ?? null,
          body.industry ?? null,
          body.phone ?? null,
        ],
      );
      const data = mapClient(ins[0]);
      await fireWebhooks("client.created", data);
      return json(201, { data });
    }

    if (parts[0] === "people" && method === "GET") {
      const denied = need("people:read");
      if (denied) return denied;
      const rows = await sql.query(
        `select p.*, o.name as org_name from people p left join organizations o on o.id = p.org_id order by p.name limit $1`,
        [limit],
      );
      return json(200, { data: rows.map(mapPerson), meta: { count: rows.length } });
    }

    if (parts[0] === "deals" && method === "GET" && parts.length === 1) {
      const denied = need("deals:read");
      if (denied) return denied;
      const rows = await sql.query(
        `select d.*, s.name as stage_name, o.name as org_name, m.name as owner_name
         from deals d
         left join stages s on s.id = d.stage_id
         left join organizations o on o.id = d.org_id
         left join members m on m.id = d.owner_id
         order by d.updated_at desc limit $1`,
        [limit],
      );
      return json(200, { data: rows.map(mapEvent), meta: { count: rows.length } });
    }
    if (parts[0] === "deals" && method === "GET" && parts[1]) {
      const denied = need("deals:read");
      if (denied) return denied;
      const rows = await sql.query(
        `select d.*, s.name as stage_name, o.name as org_name, m.name as owner_name
         from deals d left join stages s on s.id = d.stage_id left join organizations o on o.id = d.org_id
         left join members m on m.id = d.owner_id where d.id = $1`,
        [Number(parts[1])],
      );
      if (!rows[0]) return json(404, { error: { code: "not_found", message: "Deal not found" } });
      return json(200, { data: mapEvent(rows[0]) });
    }
    if (parts[0] === "deals" && method === "POST") {
      const denied = need("deals:write");
      if (denied) return denied;
      const body = await readBody(request);
      const stage = (await sql`select id from stages where pipeline_id = 1 order by sort_order limit 1`)[0];
      const ins = await sql.query(
        `insert into deals (title, value, pipeline_id, stage_id, venue, source, status)
         values ($1,$2,1,$3,$4,'API','open') returning id`,
        [String(body.title ?? "Untitled"), Number(body.value ?? 0), Number(stage?.id ?? 1), body.venue ?? null],
      );
      const id = Number(ins[0].id);
      const row = (
        await sql.query(
          `select d.*, s.name as stage_name, o.name as org_name, m.name as owner_name from deals d
           left join stages s on s.id = d.stage_id left join organizations o on o.id = d.org_id
           left join members m on m.id = d.owner_id where d.id = $1`,
          [id],
        )
      )[0];
      const data = mapEvent(row);
      await fireWebhooks("deal.created", data);
      return json(201, { data });
    }
    if (parts[0] === "deals" && method === "PATCH" && parts[1]) {
      const denied = need("deals:write");
      if (denied) return denied;
      const body = await readBody(request);
      const id = Number(parts[1]);
      const cur = (await sql.query(`select * from deals where id = $1`, [id]))[0];
      if (!cur) return json(404, { error: { code: "not_found", message: "Deal not found" } });
      const title = body.title == null ? String(cur.title) : String(body.title);
      const value = body.value == null ? money(cur.value) : Number(body.value);
      const status = body.status == null ? String(cur.status) : String(body.status);
      const venue = body.venue == null ? cur.venue : String(body.venue);
      await sql.query(`update deals set title = $1, value = $2, status = $3, venue = $4, updated_at = now() where id = $5`, [
        title,
        value,
        status,
        venue,
        id,
      ]);
      const row = (
        await sql.query(
          `select d.*, s.name as stage_name, o.name as org_name, m.name as owner_name from deals d
           left join stages s on s.id = d.stage_id left join organizations o on o.id = d.org_id
           left join members m on m.id = d.owner_id where d.id = $1`,
          [id],
        )
      )[0];
      const data = mapEvent(row);
      await fireWebhooks("deal.updated", data);
      if (status === "won" && String(cur.status) !== "won") await fireWebhooks("deal.won", data);
      if (status === "lost" && String(cur.status) !== "lost") await fireWebhooks("deal.lost", data);
      return json(200, { data });
    }

    if (parts[0] === "activities" && method === "GET") {
      const denied = need("activities:read");
      if (denied) return denied;
      const rows = await sql.query(
        `select a.id, a.type, a.subject, a.due_at, a.done, a.duration_min, d.title as deal_title
         from activities a left join deals d on d.id = a.deal_id
         order by a.due_at nulls last limit $1`,
        [limit],
      );
      return json(200, {
        data: rows.map((r) => ({
          id: Number(r.id),
          type: String(r.type),
          subject: String(r.subject),
          due_at: iso(r.due_at),
          done: Boolean(r.done),
          duration_min: r.duration_min == null ? null : Number(r.duration_min),
          deal: r.deal_title == null ? null : String(r.deal_title),
        })),
        meta: { count: rows.length },
      });
    }

    if (parts[0] === "webhooks" && method === "GET" && parts.length === 1) {
      const denied = need("webhooks");
      if (denied) return denied;
      const rows = await sql`select * from webhooks order by id`;
      return json(200, {
        data: rows.map((w) => ({
          id: Number(w.id),
          url: String(w.url),
          event: String(w.event),
          active: Boolean(w.active),
          last_status: w.last_status == null ? null : String(w.last_status),
          secret: w.secret == null ? null : `${String(w.secret).slice(0, 10)}…`,
        })),
      });
    }
    if (parts[0] === "webhooks" && method === "POST" && parts.length === 1) {
      const denied = need("webhooks");
      if (denied) return denied;
      const body = await readBody(request);
      const secret = `whsec_nl_${Math.random().toString(36).slice(2, 10)}`;
      const ins = await sql.query(
        `insert into webhooks (url, event, active, secret, description, last_status) values ($1,$2,true,$3,$4,'waiting') returning *`,
        [String(body.url ?? ""), String(body.event ?? "deal.updated"), secret, body.description ?? null],
      );
      return json(201, { data: { id: Number(ins[0].id), url: String(ins[0].url), event: String(ins[0].event), secret } });
    }
    if (parts[0] === "webhooks" && parts[2] === "test" && method === "POST") {
      const denied = need("webhooks");
      if (denied) return denied;
      const hook = (await sql.query(`select * from webhooks where id = $1`, [Number(parts[1])]))[0];
      if (!hook) return json(404, { error: { code: "not_found", message: "Webhook not found" } });
      const sample = WEBHOOK_EVENTS.find((e) => e.event === String(hook.event)) ?? WEBHOOK_EVENTS[0];
      const envelope = await fireWebhooks(String(hook.event), sample.payload.data);
      return json(200, { data: { delivered: true, payload: envelope } });
    }
    if (parts[0] === "webhooks" && method === "DELETE" && parts[1]) {
      const denied = need("webhooks");
      if (denied) return denied;
      await sql.query(`update webhooks set active = false where id = $1`, [Number(parts[1])]);
      return json(200, { data: { revoked: true } });
    }

    return json(404, { error: { code: "not_found", message: `No route for ${method} /api/v1/${rel}` } });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return json(500, { error: { code: "server_error", message } });
  }
}
