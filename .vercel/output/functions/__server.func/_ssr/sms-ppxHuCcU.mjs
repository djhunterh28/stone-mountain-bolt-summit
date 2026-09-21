import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CZC9dlvp.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sms-ppxHuCcU.js
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
var getSmsDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("769c4cf247fe6fe0ebf3d18909d7090e103b214a22cddbc1b08370529289a881"));
var sendEventReminders = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("f3a2c6e0a12f0f04ba862d2adbea365a42ae65756d2180dc979f525a46b6bf8c"));
var sendPaymentNotices = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("4ebfff67d352b544668d83f7ea9fb753dfcef176a82a2cc9a45a2530e0e8a665"));
var sendStatusUpdate = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("bae714ec7a0f6c5ddfd81a9a829097f8c79f4c8fd3075cacba4b4cd24326dc9a"));
var sendCustomSms = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("ff45a4bae65a267ae027dbd4121f376d0030a2f1f8bed925816a8aa39e328004"));
var runDueSms = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("c2f7c8f565f10686475ceac14077db414ce400d79b837967a8d5306db3d5b6c4"));
var toggleSmsAutomation = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("8deedad667464e6a2d6aea1f142fed4c5b08e556aa56a28555ad5e620a2b78f2"));
var setSmsOpt = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("bcaabe73d08ea93c55e966e05ad4219736f89358d0634179341afed02cc06f65"));
//#endregion
export { sendEventReminders as a, setSmsOpt as c, sendCustomSms as i, toggleSmsAutomation as l, getSmsDesk as n, sendPaymentNotices as o, runDueSms as r, sendStatusUpdate as s, deliverSms as t };
