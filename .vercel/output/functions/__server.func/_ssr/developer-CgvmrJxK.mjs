import { r as createServerFn } from "./ssr.mjs";
import { d as iso, t as authMiddleware, u as getSql } from "./utils-DLVA4J7b.mjs";
import { a as WEBHOOK_EVENTS } from "./api-spec-BdrGwzd_.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/developer-CgvmrJxK.js
var getDeveloperDesk_createServerFn_handler = createServerRpc({
	id: "bf71faea7b22fd1989ef68035586e21d5a7e64af3a0da5cd9b8f41fcf1624d8d",
	name: "getDeveloperDesk",
	filename: "src/lib/crm/developer.ts"
}, (opts) => getDeveloperDesk.__executeServer(opts));
var getDeveloperDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getDeveloperDesk_createServerFn_handler, async () => {
	const sql = await getSql();
	return {
		tokens: (await sql`select * from api_tokens order by id desc`).map((t) => ({
			id: Number(t.id),
			name: String(t.name),
			tokenHint: String(t.token_hint),
			scopes: String(t.scopes),
			lastUsed: iso(t.last_used),
			createdAt: iso(t.created_at) ?? "",
			revoked: Boolean(t.revoked),
			hashed: Boolean(t.token_hash)
		})),
		webhooks: (await sql`select * from webhooks order by id`).map((w) => ({
			id: Number(w.id),
			url: String(w.url),
			event: String(w.event),
			active: Boolean(w.active),
			lastStatus: w.last_status == null ? null : String(w.last_status),
			secretHint: w.secret == null ? null : `${String(w.secret).slice(0, 12)}…`,
			description: w.description == null ? null : String(w.description)
		})),
		deliveries: (await sql`select d.*, w.url from webhook_deliveries d left join webhooks w on w.id = d.webhook_id order by d.id desc limit 20`).map((d) => ({
			id: Number(d.id),
			webhookId: d.webhook_id == null ? null : Number(d.webhook_id),
			url: d.url == null ? null : String(d.url),
			event: String(d.event),
			payload: String(d.payload),
			statusCode: d.status_code == null ? null : Number(d.status_code),
			ok: Boolean(d.ok),
			createdAt: iso(d.created_at) ?? ""
		}))
	};
});
var createWebhook_createServerFn_handler = createServerRpc({
	id: "516b3e12944a59fcd0bb5965639542f1c1f63a67d3cc03f4ddb0bc7d44025e4b",
	name: "createWebhook",
	filename: "src/lib/crm/developer.ts"
}, (opts) => createWebhook.__executeServer(opts));
var createWebhook = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createWebhook_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const secret = `whsec_nl_${Math.random().toString(36).slice(2, 10)}`;
	await sql.query(`insert into webhooks (url, event, active, secret, description, last_status) values ($1,$2,true,$3,$4,'waiting')`, [
		data.url.trim(),
		data.event,
		secret,
		data.description ?? null
	]);
	return {
		ok: true,
		secret
	};
});
var testWebhook_createServerFn_handler = createServerRpc({
	id: "4c8474eb0f11dfd2131b316c8a9bb1c4699a2c72042448daeca649b900c9d707",
	name: "testWebhook",
	filename: "src/lib/crm/developer.ts"
}, (opts) => testWebhook.__executeServer(opts));
var testWebhook = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(testWebhook_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const hook = (await sql.query(`select * from webhooks where id = $1`, [data.id]))[0];
	if (!hook) return { ok: false };
	const sample = WEBHOOK_EVENTS.find((e) => e.event === String(hook.event)) ?? WEBHOOK_EVENTS[0];
	const envelope = {
		id: `evt_${Date.now().toString(36)}`,
		event: String(hook.event),
		created_at: (/* @__PURE__ */ new Date()).toISOString(),
		data: sample.payload.data
	};
	await sql.query(`insert into webhook_deliveries (webhook_id, event, payload, status_code, ok) values ($1,$2,$3,200,true)`, [
		data.id,
		String(hook.event),
		JSON.stringify(envelope)
	]);
	await sql.query(`update webhooks set last_status = '200 · test' where id = $1`, [data.id]);
	return { ok: true };
});
var revokeWebhook_createServerFn_handler = createServerRpc({
	id: "ed22bebc16a47e654ff8b3ba50d24347b01240dd7a0affcb5545859ab82760ae",
	name: "revokeWebhook",
	filename: "src/lib/crm/developer.ts"
}, (opts) => revokeWebhook.__executeServer(opts));
var revokeWebhook = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(revokeWebhook_createServerFn_handler, async ({ data }) => {
	await (await getSql()).query(`update webhooks set active = $1 where id = $2`, [data.active, data.id]);
	return { ok: true };
});
//#endregion
export { createWebhook_createServerFn_handler, getDeveloperDesk_createServerFn_handler, revokeWebhook_createServerFn_handler, testWebhook_createServerFn_handler };
