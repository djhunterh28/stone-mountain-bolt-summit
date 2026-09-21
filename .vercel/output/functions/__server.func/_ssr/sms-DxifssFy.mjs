import { l as getSql, o as formatUsd, u as iso } from "./utils-BjcRTCQS.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CZC9dlvp.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sms-DxifssFy.js
function applySmsMerge(text, ctx) {
	return text.replaceAll("{{first}}", ctx.first).replaceAll("{{first_name}}", ctx.first).replaceAll("{{deal}}", ctx.deal).replaceAll("{{venue}}", ctx.venue).replaceAll("{{load_in}}", ctx.loadIn).replaceAll("{{amount}}", ctx.amount).replaceAll("{{stage}}", ctx.stage).replaceAll("{{date}}", ctx.date).replace(/\{\{[^}]+\}\}/g, "").trim();
}
function firstName(name) {
	return name.split(" ")[0] ?? name;
}
function eventDay(raw) {
	const s = iso(raw);
	if (!s) return "";
	return s.slice(0, 10);
}
async function deliverSms(sql, opts) {
	const body = opts.body.trim();
	if (!body) return {
		ok: false,
		error: "Empty message",
		quoId: null
	};
	const opt = (await sql.query(`select opted_in from sms_optins where person_id = $1`, [opts.personId]))[0];
	if (!opt || !opt.opted_in) return {
		ok: false,
		error: "Suppressed — STOP on file",
		quoId: null
	};
	const person = (await sql.query(`select id, name, phone from people where id = $1`, [opts.personId]))[0];
	if (!person) return {
		ok: false,
		error: "No contact",
		quoId: null
	};
	const to = person.phone == null ? null : String(person.phone);
	if (!to) return {
		ok: false,
		error: "No mobile on file",
		quoId: null
	};
	const quoId = `quo_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
	await sql.query(`insert into sms_messages (person_id, deal_id, direction, body, status, kind, quo_id, to_number)
     values ($1,$2,'out',$3,'delivered',$4,$5,$6)`, [
		opts.personId,
		opts.dealId ?? null,
		body,
		opts.kind ?? "custom",
		quoId,
		to
	]);
	return {
		ok: true,
		error: null,
		quoId
	};
}
async function dealCtx(sql, dealId, personId) {
	const person = (await sql.query(`select name, phone from people where id = $1`, [personId]))[0];
	const deal = dealId ? (await sql.query(`select d.title, d.venue, d.load_in, d.value, d.event_date, s.name as stage
           from deals d left join stages s on s.id = d.stage_id where d.id = $1`, [dealId]))[0] : null;
	const name = person ? String(person.name) : "";
	return {
		first: firstName(name),
		deal: deal ? String(deal.title) : "",
		venue: deal?.venue == null ? "" : String(deal.venue),
		loadIn: deal?.load_in == null ? "" : String(deal.load_in),
		amount: deal ? formatUsd(Number(deal.value ?? 0)) : "",
		stage: deal?.stage == null ? "" : String(deal.stage),
		date: deal ? eventDay(deal.event_date) : "",
		phone: person?.phone == null ? null : String(person.phone),
		name
	};
}
async function templateBody(sql, kind) {
	const row = (await sql.query(`select body from sms_templates where kind = $1 order by id limit 1`, [kind]))[0];
	return row ? String(row.body) : "";
}
var getSmsDesk_createServerFn_handler = createServerRpc({
	id: "769c4cf247fe6fe0ebf3d18909d7090e103b214a22cddbc1b08370529289a881",
	name: "getSmsDesk",
	filename: "src/lib/crm/sms.ts"
}, (opts) => getSmsDesk.__executeServer(opts));
var getSmsDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getSmsDesk_createServerFn_handler, async () => {
	const sql = await getSql();
	const account = (await sql.query(`select * from quo_account where id = 1`))[0];
	const templates = (await sql.query(`select * from sms_templates order by id`)).map((t) => ({
		id: Number(t.id),
		kind: String(t.kind),
		name: String(t.name),
		body: String(t.body)
	}));
	const automations = (await sql.query(`select * from sms_automations order by id`)).map((a) => ({
		id: Number(a.id),
		kind: String(a.kind),
		name: String(a.name),
		detail: a.detail == null ? null : String(a.detail),
		active: Boolean(a.active),
		lastRun: iso(a.last_run)
	}));
	const messages = (await sql.query(`select s.*, p.name as person, d.title as deal
         from sms_messages s
         left join people p on p.id = s.person_id
         left join deals d on d.id = s.deal_id
         order by s.id desc limit 40`)).map((s) => ({
		id: Number(s.id),
		person: s.person == null ? null : String(s.person),
		deal: s.deal == null ? null : String(s.deal),
		direction: String(s.direction),
		body: String(s.body),
		status: String(s.status),
		kind: String(s.kind ?? "custom"),
		quoId: s.quo_id == null ? null : String(s.quo_id),
		toNumber: s.to_number == null ? null : String(s.to_number),
		at: iso(s.created_at) ?? ""
	}));
	const optins = (await sql.query(`select o.*, p.name, p.phone, p.email
         from sms_optins o join people p on p.id = o.person_id
         order by o.opted_in desc, p.name`)).map((o) => ({
		personId: Number(o.person_id),
		name: String(o.name),
		phone: o.phone == null ? null : String(o.phone),
		email: o.email == null ? null : String(o.email),
		optedIn: Boolean(o.opted_in),
		source: o.source == null ? null : String(o.source)
	}));
	const upcoming = (await sql.query(`select d.id, d.title, d.venue, d.load_in, d.event_date, d.value, d.status,
           p.id as person_id, p.name, p.phone, s.name as stage,
           coalesce(o.opted_in, false) as opted,
           exists (
             select 1 from sms_messages m
             where m.deal_id = d.id and m.kind = 'reminder' and m.created_at > now() - interval '7 days'
           ) as reminded
         from deals d
         join people p on p.id = d.person_id
         left join stages s on s.id = d.stage_id
         left join sms_optins o on o.person_id = p.id
         where d.event_date is not null
           and d.event_date >= current_date
           and d.event_date <= current_date + 21
           and d.status in ('open','won')
         order by d.event_date`)).map((d) => ({
		dealId: Number(d.id),
		title: String(d.title),
		venue: d.venue == null ? null : String(d.venue),
		loadIn: d.load_in == null ? null : String(d.load_in),
		eventDate: eventDay(d.event_date),
		personId: Number(d.person_id),
		name: String(d.name),
		phone: d.phone == null ? null : String(d.phone),
		stage: d.stage == null ? null : String(d.stage),
		opted: Boolean(d.opted),
		reminded: Boolean(d.reminded)
	}));
	const payments = (await sql.query(`select d.id, d.title, d.value, d.venue, p.id as person_id, p.name, p.phone,
           coalesce(o.opted_in, false) as opted
         from deals d
         join people p on p.id = d.person_id
         left join sms_optins o on o.person_id = p.id
         where d.status = 'won'
           and not exists (select 1 from sms_messages m where m.deal_id = d.id and m.kind = 'payment')
         order by d.won_at desc nulls last`)).map((d) => ({
		dealId: Number(d.id),
		title: String(d.title),
		amount: formatUsd(Number(d.value ?? 0)),
		personId: Number(d.person_id),
		name: String(d.name),
		phone: d.phone == null ? null : String(d.phone),
		opted: Boolean(d.opted)
	}));
	const statusQueue = (await sql.query(`select d.id, d.title, s.name as stage, p.id as person_id, p.name, p.phone,
           coalesce(o.opted_in, false) as opted
         from deals d
         join people p on p.id = d.person_id
         left join stages s on s.id = d.stage_id
         left join sms_optins o on o.person_id = p.id
         where d.status = 'open' and coalesce(o.opted_in, false) = true
         order by d.updated_at desc
         limit 12`)).map((d) => ({
		dealId: Number(d.id),
		title: String(d.title),
		stage: d.stage == null ? null : String(d.stage),
		personId: Number(d.person_id),
		name: String(d.name),
		phone: d.phone == null ? null : String(d.phone)
	}));
	const sent7d = Number((await sql.query(`select count(*) as c from sms_messages where direction = 'out' and created_at >= now() - interval '7 days'`))[0]?.c ?? 0);
	return {
		account: account ? {
			fromNumber: String(account.from_number),
			status: String(account.status),
			label: String(account.label)
		} : {
			fromNumber: "+1 917 555 0199",
			status: "connected",
			label: "Northline shop"
		},
		templates,
		automations,
		messages,
		optins,
		upcoming,
		payments,
		statusQueue,
		stats: {
			optedIn: optins.filter((o) => o.optedIn).length,
			suppressed: optins.filter((o) => !o.optedIn).length,
			sent7d,
			dueReminders: upcoming.filter((u) => u.opted && !u.reminded).length,
			duePayments: payments.filter((p) => p.opted).length
		}
	};
});
var sendEventReminders_createServerFn_handler = createServerRpc({
	id: "f3a2c6e0a12f0f04ba862d2adbea365a42ae65756d2180dc979f525a46b6bf8c",
	name: "sendEventReminders",
	filename: "src/lib/crm/sms.ts"
}, (opts) => sendEventReminders.__executeServer(opts));
var sendEventReminders = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(sendEventReminders_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const tpl = await templateBody(sql, "reminder");
	const desk = await upcomingDeals(sql);
	const pick = data.dealIds?.length ? desk.filter((d) => data.dealIds.includes(d.dealId)) : desk.filter((d) => d.opted && !d.reminded);
	let sent = 0;
	let skipped = 0;
	for (const d of pick) {
		const ctx = await dealCtx(sql, d.dealId, d.personId);
		if ((await deliverSms(sql, {
			personId: d.personId,
			dealId: d.dealId,
			kind: "reminder",
			body: applySmsMerge(tpl, ctx)
		})).ok) sent += 1;
		else skipped += 1;
	}
	await sql.query(`update sms_automations set last_run = now() where kind = 'reminder' and active = true`);
	return {
		ok: true,
		sent,
		skipped
	};
});
var sendPaymentNotices_createServerFn_handler = createServerRpc({
	id: "4ebfff67d352b544668d83f7ea9fb753dfcef176a82a2cc9a45a2530e0e8a665",
	name: "sendPaymentNotices",
	filename: "src/lib/crm/sms.ts"
}, (opts) => sendPaymentNotices.__executeServer(opts));
var sendPaymentNotices = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(sendPaymentNotices_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const tpl = await templateBody(sql, "payment");
	const rows = (await sql.query(`select d.id, p.id as person_id
         from deals d join people p on p.id = d.person_id
         left join sms_optins o on o.person_id = p.id
         where d.status = 'won' and coalesce(o.opted_in, false) = true
           and not exists (select 1 from sms_messages m where m.deal_id = d.id and m.kind = 'payment')`)).map((r) => ({
		dealId: Number(r.id),
		personId: Number(r.person_id)
	}));
	const pick = data.dealIds?.length ? rows.filter((r) => data.dealIds.includes(r.dealId)) : rows;
	let sent = 0;
	let skipped = 0;
	for (const d of pick) {
		const ctx = await dealCtx(sql, d.dealId, d.personId);
		if ((await deliverSms(sql, {
			personId: d.personId,
			dealId: d.dealId,
			kind: "payment",
			body: applySmsMerge(tpl, ctx)
		})).ok) sent += 1;
		else skipped += 1;
	}
	await sql.query(`update sms_automations set last_run = now() where kind = 'payment' and active = true`);
	return {
		ok: true,
		sent,
		skipped
	};
});
var sendStatusUpdate_createServerFn_handler = createServerRpc({
	id: "bae714ec7a0f6c5ddfd81a9a829097f8c79f4c8fd3075cacba4b4cd24326dc9a",
	name: "sendStatusUpdate",
	filename: "src/lib/crm/sms.ts"
}, (opts) => sendStatusUpdate.__executeServer(opts));
var sendStatusUpdate = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(sendStatusUpdate_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const deal = (await sql.query(`select d.id, p.id as person_id from deals d join people p on p.id = d.person_id where d.id = $1`, [data.dealId]))[0];
	if (!deal) return {
		ok: false,
		error: "No deal"
	};
	const tpl = await templateBody(sql, "status");
	const ctx = await dealCtx(sql, data.dealId, Number(deal.person_id));
	return await deliverSms(sql, {
		personId: Number(deal.person_id),
		dealId: data.dealId,
		kind: "status",
		body: applySmsMerge(tpl, ctx)
	});
});
var sendCustomSms_createServerFn_handler = createServerRpc({
	id: "ff45a4bae65a267ae027dbd4121f376d0030a2f1f8bed925816a8aa39e328004",
	name: "sendCustomSms",
	filename: "src/lib/crm/sms.ts"
}, (opts) => sendCustomSms.__executeServer(opts));
var sendCustomSms = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(sendCustomSms_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const ctx = await dealCtx(sql, data.dealId ?? null, data.personId);
	return deliverSms(sql, {
		personId: data.personId,
		dealId: data.dealId,
		kind: "custom",
		body: applySmsMerge(data.body, ctx)
	});
});
var runDueSms_createServerFn_handler = createServerRpc({
	id: "c2f7c8f565f10686475ceac14077db414ce400d79b837967a8d5306db3d5b6c4",
	name: "runDueSms",
	filename: "src/lib/crm/sms.ts"
}, (opts) => runDueSms.__executeServer(opts));
var runDueSms = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(runDueSms_createServerFn_handler, async () => {
	const sql = await getSql();
	const autos = await sql.query(`select kind, active from sms_automations`);
	let sent = 0;
	let skipped = 0;
	const reminderOn = autos.some((a) => String(a.kind) === "reminder" && Boolean(a.active));
	const paymentOn = autos.some((a) => String(a.kind) === "payment" && Boolean(a.active));
	const statusOn = autos.some((a) => String(a.kind) === "status" && Boolean(a.active));
	if (reminderOn) {
		const tpl = await templateBody(sql, "reminder");
		for (const d of (await upcomingDeals(sql)).filter((x) => x.opted && !x.reminded)) {
			const ctx = await dealCtx(sql, d.dealId, d.personId);
			if ((await deliverSms(sql, {
				personId: d.personId,
				dealId: d.dealId,
				kind: "reminder",
				body: applySmsMerge(tpl, ctx)
			})).ok) sent += 1;
			else skipped += 1;
		}
		await sql.query(`update sms_automations set last_run = now() where kind = 'reminder'`);
	}
	if (paymentOn) {
		const tpl = await templateBody(sql, "payment");
		const rows = await sql.query(`select d.id, p.id as person_id from deals d join people p on p.id = d.person_id
         left join sms_optins o on o.person_id = p.id
         where d.status = 'won' and coalesce(o.opted_in, false) = true
           and not exists (select 1 from sms_messages m where m.deal_id = d.id and m.kind = 'payment')`);
		for (const row of rows) {
			const ctx = await dealCtx(sql, Number(row.id), Number(row.person_id));
			if ((await deliverSms(sql, {
				personId: Number(row.person_id),
				dealId: Number(row.id),
				kind: "payment",
				body: applySmsMerge(tpl, ctx)
			})).ok) sent += 1;
			else skipped += 1;
		}
		await sql.query(`update sms_automations set last_run = now() where kind = 'payment'`);
	}
	if (statusOn) {
		const tpl = await templateBody(sql, "status");
		const rows = await sql.query(`select d.id, p.id as person_id from deals d join people p on p.id = d.person_id
         left join sms_optins o on o.person_id = p.id
         where d.status = 'open' and coalesce(o.opted_in, false) = true
           and not exists (
             select 1 from sms_messages m
             where m.deal_id = d.id and m.kind = 'status' and m.created_at >= now() - interval '7 days'
           )
         order by d.updated_at desc
         limit 8`);
		for (const row of rows) {
			const ctx = await dealCtx(sql, Number(row.id), Number(row.person_id));
			if ((await deliverSms(sql, {
				personId: Number(row.person_id),
				dealId: Number(row.id),
				kind: "status",
				body: applySmsMerge(tpl, ctx)
			})).ok) sent += 1;
			else skipped += 1;
		}
		await sql.query(`update sms_automations set last_run = now() where kind = 'status'`);
	}
	return {
		ok: true,
		sent,
		skipped
	};
});
var toggleSmsAutomation_createServerFn_handler = createServerRpc({
	id: "8deedad667464e6a2d6aea1f142fed4c5b08e556aa56a28555ad5e620a2b78f2",
	name: "toggleSmsAutomation",
	filename: "src/lib/crm/sms.ts"
}, (opts) => toggleSmsAutomation.__executeServer(opts));
var toggleSmsAutomation = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(toggleSmsAutomation_createServerFn_handler, async ({ data }) => {
	await (await getSql()).query(`update sms_automations set active = $2 where id = $1`, [data.id, data.active]);
	return { ok: true };
});
var setSmsOpt_createServerFn_handler = createServerRpc({
	id: "bcaabe73d08ea93c55e966e05ad4219736f89358d0634179341afed02cc06f65",
	name: "setSmsOpt",
	filename: "src/lib/crm/sms.ts"
}, (opts) => setSmsOpt.__executeServer(opts));
var setSmsOpt = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(setSmsOpt_createServerFn_handler, async ({ data }) => {
	await (await getSql()).query(`insert into sms_optins (person_id, opted_in, source) values ($1,$2,'desk')
       on conflict (person_id) do update set opted_in = $2, source = 'desk', at = now()`, [data.personId, data.optedIn]);
	return { ok: true };
});
async function upcomingDeals(sql) {
	return (await sql.query(`select d.id as deal_id, p.id as person_id, coalesce(o.opted_in, false) as opted,
         exists (
           select 1 from sms_messages m
           where m.deal_id = d.id and m.kind = 'reminder' and m.created_at > now() - interval '7 days'
         ) as reminded
       from deals d
       join people p on p.id = d.person_id
       left join sms_optins o on o.person_id = p.id
       where d.event_date is not null
         and d.event_date >= current_date
         and d.event_date <= current_date + 21
         and d.status in ('open','won')`)).map((d) => ({
		dealId: Number(d.deal_id),
		personId: Number(d.person_id),
		opted: Boolean(d.opted),
		reminded: Boolean(d.reminded)
	}));
}
//#endregion
export { getSmsDesk_createServerFn_handler, runDueSms_createServerFn_handler, sendCustomSms_createServerFn_handler, sendEventReminders_createServerFn_handler, sendPaymentNotices_createServerFn_handler, sendStatusUpdate_createServerFn_handler, setSmsOpt_createServerFn_handler, toggleSmsAutomation_createServerFn_handler };
