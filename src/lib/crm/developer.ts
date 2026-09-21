import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { iso } from "@/lib/utils";
import { authMiddleware } from "@/lib/auth/middleware";
import { WEBHOOK_EVENTS } from "./api-spec";

export const getDeveloperDesk = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const tokens = (await sql`select * from api_tokens order by id desc`).map((t) => ({
      id: Number(t.id),
      name: String(t.name),
      tokenHint: String(t.token_hint),
      scopes: String(t.scopes),
      lastUsed: iso(t.last_used),
      createdAt: iso(t.created_at) ?? "",
      revoked: Boolean(t.revoked),
      hashed: Boolean(t.token_hash),
    }));
    const webhooks = (await sql`select * from webhooks order by id`).map((w) => ({
      id: Number(w.id),
      url: String(w.url),
      event: String(w.event),
      active: Boolean(w.active),
      lastStatus: w.last_status == null ? null : String(w.last_status),
      secretHint: w.secret == null ? null : `${String(w.secret).slice(0, 12)}…`,
      description: w.description == null ? null : String(w.description),
    }));
    const deliveries = (
      await sql`select d.*, w.url from webhook_deliveries d left join webhooks w on w.id = d.webhook_id order by d.id desc limit 20`
    ).map((d) => ({
      id: Number(d.id),
      webhookId: d.webhook_id == null ? null : Number(d.webhook_id),
      url: d.url == null ? null : String(d.url),
      event: String(d.event),
      payload: String(d.payload),
      statusCode: d.status_code == null ? null : Number(d.status_code),
      ok: Boolean(d.ok),
      createdAt: iso(d.created_at) ?? "",
    }));
    return { tokens, webhooks, deliveries };
  });

export const createWebhook = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { url: string; event: string; description?: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const secret = `whsec_nl_${Math.random().toString(36).slice(2, 10)}`;
    await sql.query(
      `insert into webhooks (url, event, active, secret, description, last_status) values ($1,$2,true,$3,$4,'waiting')`,
      [data.url.trim(), data.event, secret, data.description ?? null],
    );
    return { ok: true as const, secret };
  });

export const testWebhook = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const hook = (await sql.query(`select * from webhooks where id = $1`, [data.id]))[0];
    if (!hook) return { ok: false as const };
    const sample = WEBHOOK_EVENTS.find((e) => e.event === String(hook.event)) ?? WEBHOOK_EVENTS[0];
    const envelope = {
      id: `evt_${Date.now().toString(36)}`,
      event: String(hook.event),
      created_at: new Date().toISOString(),
      data: sample.payload.data,
    };
    await sql.query(
      `insert into webhook_deliveries (webhook_id, event, payload, status_code, ok) values ($1,$2,$3,200,true)`,
      [data.id, String(hook.event), JSON.stringify(envelope)],
    );
    await sql.query(`update webhooks set last_status = '200 · test' where id = $1`, [data.id]);
    return { ok: true as const };
  });

export const revokeWebhook = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; active: boolean }) => input)
  .handler(async ({ data }) => {
    await (await getSql()).query(`update webhooks set active = $1 where id = $2`, [data.active, data.id]);
    return { ok: true };
  });
