import { l as getSql, o as formatUsd, u as iso } from "./utils-BjcRTCQS.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CZC9dlvp.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { c as insertOutbound } from "./domain-DTp-hrMr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/smtp-C_E9fSY9.js
function applyMerge(text, ctx) {
	return text.replaceAll("{{first_name}}", ctx.first).replaceAll("{{first}}", ctx.first).replaceAll("{{deal}}", ctx.deal).replaceAll("{{venue}}", ctx.venue).replaceAll("{{load_in}}", ctx.loadIn).replaceAll("{{amount}}", ctx.amount).replaceAll("{{date}}", ctx.date).replace(/\{\{[^}]+\}\}/g, "").trim();
}
async function dealCtx(sql, dealId, personId, email) {
	const person = personId ? (await sql.query(`select id, name, email from people where id = $1`, [personId]))[0] : email ? (await sql.query(`select id, name, email from people where lower(email) = lower($1) limit 1`, [email]))[0] : null;
	const deal = dealId ? (await sql.query(`select title, venue, load_in, value, event_date from deals where id = $1`, [dealId]))[0] : null;
	const name = person ? String(person.name) : "";
	return {
		first: name.split(" ")[0] ?? name,
		deal: deal ? String(deal.title) : "",
		venue: deal?.venue == null ? "" : String(deal.venue),
		loadIn: deal?.load_in == null ? "" : String(deal.load_in),
		amount: deal ? formatUsd(Number(deal.value ?? 0)) : "",
		date: deal?.event_date ? String(iso(deal.event_date)).slice(0, 10) : "",
		email: person?.email == null ? email ?? "" : String(person.email),
		name,
		personId: person ? Number(person.id) : null
	};
}
async function sendTransactional(sql, opts) {
	let subject = opts.subject ?? "";
	let body = opts.body ?? "";
	if (opts.templateId) {
		const tpl = (await sql.query(`select * from email_templates where id = $1`, [opts.templateId]))[0];
		if (!tpl) return {
			ok: false,
			error: "No template",
			emailId: 0
		};
		subject = String(tpl.subject);
		body = String(tpl.body);
	}
	if (!subject.trim() || !body.trim()) return {
		ok: false,
		error: "Subject and body required",
		emailId: 0
	};
	const ctx = await dealCtx(sql, opts.dealId ?? null, opts.personId ?? null, opts.toAddr);
	if (!ctx.email.includes("@")) return {
		ok: false,
		error: "No email on file",
		emailId: 0
	};
	const sender = await insertOutbound(sql, {
		purpose: "workflow",
		mailKind: "transactional",
		toAddr: ctx.email,
		subject: applyMerge(subject, ctx),
		body: applyMerge(body, ctx),
		dealId: opts.dealId ?? null,
		personId: ctx.personId,
		fallbackName: "Northline Shows",
		hintAddr: "shows@hurricaneproductionsllc.com"
	});
	if (sender.emailId) await sql.query(`update emails set body = body || $2 where id = $1 and body not like '%' || $2 || '%'`, [sender.emailId, `\n\nOpen receipt: https://hurricaneproductionsllc.com/t/${sender.emailId}`]);
	return {
		ok: true,
		error: null,
		emailId: sender.emailId,
		fromAddr: sender.fromAddr
	};
}
var getSmtpDesk_createServerFn_handler = createServerRpc({
	id: "4ff6727966562d05e00920cc6a782645374cf1a133ea543cdbd67952fe546320",
	name: "getSmtpDesk",
	filename: "src/lib/crm/smtp.ts"
}, (opts) => getSmtpDesk.__executeServer(opts));
var getSmtpDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getSmtpDesk_createServerFn_handler, async () => {
	const sql = await getSql();
	const account = (await sql.query(`select * from smtp_accounts where id = 1`))[0];
	const templates = (await sql.query(`select * from email_templates where kind = 'transactional' order by id`)).map((t) => ({
		id: Number(t.id),
		name: String(t.name),
		subject: String(t.subject),
		body: String(t.body),
		triggerKey: t.trigger_key == null ? null : String(t.trigger_key)
	}));
	const workflows = (await sql.query(`select w.*, t.name as template_name from smtp_workflows w
         left join email_templates t on t.id = w.template_id order by w.id`)).map((w) => ({
		id: Number(w.id),
		name: String(w.name),
		triggerKey: String(w.trigger_key),
		templateId: w.template_id == null ? null : Number(w.template_id),
		templateName: w.template_name == null ? null : String(w.template_name),
		detail: w.detail == null ? null : String(w.detail),
		active: Boolean(w.active),
		runs: Number(w.runs),
		lastRun: iso(w.last_run)
	}));
	const messages = (await sql.query(`select e.*, p.name as person, d.title as deal
         from emails e
         left join people p on p.id = e.person_id
         left join deals d on d.id = e.deal_id
         where e.purpose = 'transactional'
         order by coalesce(e.sent_at, e.created_at) desc
         limit 40`)).map((e) => ({
		id: Number(e.id),
		toAddr: String(e.to_addr),
		subject: String(e.subject),
		body: String(e.body),
		person: e.person == null ? null : String(e.person),
		deal: e.deal == null ? null : String(e.deal),
		status: String(e.delivery_status ?? "delivered"),
		opened: Boolean(e.opened),
		clicked: Boolean(e.clicked),
		smtpId: e.smtp_message_id == null ? null : String(e.smtp_message_id),
		fromAddr: String(e.from_addr),
		at: iso(e.sent_at ?? e.created_at) ?? ""
	}));
	const events = (await sql.query(`select ev.*, e.subject from smtp_events ev
         join emails e on e.id = ev.email_id
         where e.purpose = 'transactional'
         order by ev.id desc limit 24`)).map((ev) => ({
		id: Number(ev.id),
		emailId: Number(ev.email_id),
		event: String(ev.event),
		detail: ev.detail == null ? null : String(ev.detail),
		subject: String(ev.subject),
		at: iso(ev.at) ?? ""
	}));
	const people = (await sql.query(`select p.id, p.name, p.email, d.id as deal_id, d.title as deal
         from people p
         left join deals d on d.person_id = p.id and d.status in ('open','won')
         where p.email is not null
         order by p.name`)).map((p) => ({
		personId: Number(p.id),
		name: String(p.name),
		email: String(p.email),
		dealId: p.deal_id == null ? null : Number(p.deal_id),
		deal: p.deal == null ? null : String(p.deal)
	}));
	const uniquePeople = [...new Map(people.map((p) => [p.personId, p])).values()];
	const sent7d = Number((await sql.query(`select count(*) as c from emails where purpose = 'transactional' and folder = 'sent'
             and coalesce(sent_at, created_at) >= now() - interval '7 days'`))[0]?.c ?? 0);
	const delivered = Number((await sql.query(`select count(*) as c from emails where purpose = 'transactional' and delivery_status = 'delivered'`))[0]?.c ?? 0);
	const opened = Number((await sql.query(`select count(*) as c from emails where purpose = 'transactional' and opened = true`))[0]?.c ?? 0);
	const bounced = Number((await sql.query(`select count(*) as c from emails where purpose = 'transactional' and delivery_status = 'bounced'`))[0]?.c ?? 0);
	const dueWon = Number((await sql.query(`select count(*) as c from deals d join people p on p.id = d.person_id
           where d.status = 'won' and p.email is not null
             and not exists (
               select 1 from emails e where e.deal_id = d.id and e.purpose = 'transactional' and e.subject ilike 'Receipt%'
             )`))[0]?.c ?? 0);
	return {
		account: account ? {
			host: String(account.host),
			port: Number(account.port),
			username: String(account.username),
			fromAddr: String(account.from_addr),
			tls: String(account.tls),
			status: String(account.status),
			lastOk: iso(account.last_ok)
		} : {
			host: "mail.hurricaneproductionsllc.com",
			port: 587,
			username: "shows@hurricaneproductionsllc.com",
			fromAddr: "shows@hurricaneproductionsllc.com",
			tls: "starttls",
			status: "connected",
			lastOk: null
		},
		templates,
		workflows,
		messages,
		events,
		people: uniquePeople,
		stats: {
			sent7d,
			delivered,
			opened,
			bounced,
			dueWon
		}
	};
});
var sendSmtpTemplate_createServerFn_handler = createServerRpc({
	id: "ba256cd1dc44feae38f5faab0fee5f0fefc881d7cc78d24e36e81bb6d4f6f776",
	name: "sendSmtpTemplate",
	filename: "src/lib/crm/smtp.ts"
}, (opts) => sendSmtpTemplate.__executeServer(opts));
var sendSmtpTemplate = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(sendSmtpTemplate_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const person = (await sql.query(`select id, email from people where id = $1`, [data.personId]))[0];
	if (!person?.email) return {
		ok: false,
		error: "No email on file"
	};
	const r = await sendTransactional(sql, {
		templateId: data.templateId,
		toAddr: String(person.email),
		personId: data.personId,
		dealId: data.dealId ?? null
	});
	await sql.query(`update smtp_accounts set last_ok = now() where id = 1`);
	return r;
});
var testSmtp_createServerFn_handler = createServerRpc({
	id: "f763442e2e59fe5ab669240ab3d5ae649d5429dd38dcc12200190ba113e7fd25",
	name: "testSmtp",
	filename: "src/lib/crm/smtp.ts"
}, (opts) => testSmtp.__executeServer(opts));
var testSmtp = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(testSmtp_createServerFn_handler, async () => {
	const sql = await getSql();
	const r = await sendTransactional(sql, {
		toAddr: "dana@hurricaneproductionsllc.com",
		personId: null,
		subject: "SMTP test — Hurricane Productions",
		body: "Hi Dana —\n\nThis is a transactional test through mail.hurricaneproductionsllc.com:587 STARTTLS. Delivery events are on the SMTP desk.\n\n— Northline"
	});
	await sql.query(`update smtp_accounts set last_ok = now(), status = 'connected' where id = 1`);
	return r;
});
var runSmtpWorkflows_createServerFn_handler = createServerRpc({
	id: "53d872dd62853c1eb7c46df4bfe2ffb706de8b07a61c98f261a2023295ebab68",
	name: "runSmtpWorkflows",
	filename: "src/lib/crm/smtp.ts"
}, (opts) => runSmtpWorkflows.__executeServer(opts));
var runSmtpWorkflows = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input ?? {}).handler(runSmtpWorkflows_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const workflows = await sql.query(data.id ? `select w.*, t.subject, t.body from smtp_workflows w join email_templates t on t.id = w.template_id where w.id = $1` : `select w.*, t.subject, t.body from smtp_workflows w join email_templates t on t.id = w.template_id where w.active = true`, data.id ? [data.id] : []);
	let sent = 0;
	let skipped = 0;
	for (const w of workflows) {
		const key = String(w.trigger_key);
		const templateId = Number(w.template_id);
		if (key === "deal.won") {
			const rows = await sql.query(`select d.id, p.id as person_id, p.email from deals d join people p on p.id = d.person_id
           where d.status = 'won' and p.email is not null
             and not exists (
               select 1 from emails e where e.deal_id = d.id and e.purpose = 'transactional' and e.subject ilike 'Receipt%'
             )`);
			for (const row of rows) if ((await sendTransactional(sql, {
				templateId,
				toAddr: String(row.email),
				personId: Number(row.person_id),
				dealId: Number(row.id)
			})).ok) sent += 1;
			else skipped += 1;
		} else if (key === "event.callsheet") {
			const rows = await sql.query(`select d.id, p.id as person_id, p.email from deals d join people p on p.id = d.person_id
           where d.event_date is not null and d.event_date >= current_date and d.event_date <= current_date + 2
             and d.status in ('open','won') and p.email is not null
             and not exists (
               select 1 from emails e where e.deal_id = d.id and e.purpose = 'transactional' and e.subject ilike 'Call sheet%'
                 and e.created_at > now() - interval '2 days'
             )`);
			for (const row of rows) if ((await sendTransactional(sql, {
				templateId,
				toAddr: String(row.email),
				personId: Number(row.person_id),
				dealId: Number(row.id)
			})).ok) sent += 1;
			else skipped += 1;
		} else if (key === "invoice.sent") {
			const rows = await sql.query(`select i.deal_id, p.id as person_id, p.email
           from invoices i
           join deals d on d.id = i.deal_id
           join people p on p.id = d.person_id
           where p.email is not null
             and not exists (
               select 1 from emails e
               where e.deal_id = i.deal_id and e.purpose = 'transactional' and e.subject ilike 'Invoice%'
             )
           limit 8`);
			for (const row of rows) if ((await sendTransactional(sql, {
				templateId,
				toAddr: String(row.email),
				personId: Number(row.person_id),
				dealId: row.deal_id == null ? null : Number(row.deal_id)
			})).ok) sent += 1;
			else skipped += 1;
		} else if (key === "booking.confirmed") {
			const rows = await sql.query(`select d.id, p.id as person_id, p.email from deals d join people p on p.id = d.person_id
           where d.status = 'won' and p.email is not null
             and not exists (
               select 1 from emails e
               where e.deal_id = d.id and e.purpose = 'transactional' and e.subject ilike '%confirm%'
             )
           limit 8`);
			for (const row of rows) if ((await sendTransactional(sql, {
				templateId,
				toAddr: String(row.email),
				personId: Number(row.person_id),
				dealId: Number(row.id)
			})).ok) sent += 1;
			else skipped += 1;
		} else if (key === "auth.reset") skipped += 1;
		await sql.query(`update smtp_workflows set last_run = now(), runs = runs + 1 where id = $1`, [Number(w.id)]);
	}
	await sql.query(`update smtp_accounts set last_ok = now() where id = 1`);
	return {
		ok: true,
		sent,
		skipped
	};
});
var toggleSmtpWorkflow_createServerFn_handler = createServerRpc({
	id: "fd65f0d7774f04314df9869a73f7ecc0ae5f16fcf602f0eb1f10a1d990671bf8",
	name: "toggleSmtpWorkflow",
	filename: "src/lib/crm/smtp.ts"
}, (opts) => toggleSmtpWorkflow.__executeServer(opts));
var toggleSmtpWorkflow = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(toggleSmtpWorkflow_createServerFn_handler, async ({ data }) => {
	await (await getSql()).query(`update smtp_workflows set active = $2 where id = $1`, [data.id, data.active]);
	return { ok: true };
});
var trackSmtp_createServerFn_handler = createServerRpc({
	id: "2be1a2654a8227d530241aff131e6749079033a2bb0fdc15022b304042fe0201",
	name: "trackSmtp",
	filename: "src/lib/crm/smtp.ts"
}, (opts) => trackSmtp.__executeServer(opts));
var trackSmtp = createServerFn({ method: "GET" }).validator((input) => input).handler(trackSmtp_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const e = (await sql.query(`select * from emails where id = $1`, [data.id]))[0];
	if (!e) return {
		ok: false,
		subject: null,
		toAddr: null
	};
	if (data.click) {
		await sql.query(`update emails set clicked = true, clicked_at = coalesce(clicked_at, now()), opened = true, opened_at = coalesce(opened_at, now()) where id = $1`, [data.id]);
		await sql.query(`insert into smtp_events (email_id, event, detail) values ($1, 'clicked', 'link')`, [data.id]);
	} else {
		await sql.query(`update emails set opened = true, opened_at = coalesce(opened_at, now()) where id = $1`, [data.id]);
		await sql.query(`insert into smtp_events (email_id, event, detail) values ($1, 'opened', 'public /t')`, [data.id]);
	}
	return {
		ok: true,
		subject: String(e.subject),
		toAddr: String(e.to_addr),
		clicked: Boolean(data.click)
	};
});
//#endregion
export { getSmtpDesk_createServerFn_handler, runSmtpWorkflows_createServerFn_handler, sendSmtpTemplate_createServerFn_handler, testSmtp_createServerFn_handler, toggleSmtpWorkflow_createServerFn_handler, trackSmtp_createServerFn_handler };
