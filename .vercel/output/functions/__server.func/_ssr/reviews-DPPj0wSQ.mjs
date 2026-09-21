import { l as getSql, u as iso } from "./utils-BjcRTCQS.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CZC9dlvp.mjs";
import { a as portalOrigin } from "./brand-BeQEY2zF.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { c as insertOutbound } from "./domain-DTp-hrMr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reviews-DPPj0wSQ.js
var REVIEW_PLATFORMS = [
	{
		id: "google",
		label: "Google",
		href: "https://search.google.com/local/writereview?placeid=Hurricane+Productions"
	},
	{
		id: "yelp",
		label: "Yelp",
		href: "https://www.yelp.com/writeareview/biz/hurricane-productions-brooklyn"
	},
	{
		id: "facebook",
		label: "Facebook",
		href: "https://www.facebook.com/hurricaneproductions/reviews"
	},
	{
		id: "weddingwire",
		label: "WeddingWire",
		href: "https://www.weddingwire.com/reviews"
	},
	{
		id: "theknot",
		label: "The Knot",
		href: "https://www.theknot.com/marketplace/write-a-review"
	},
	{
		id: "zola",
		label: "Zola",
		href: "https://www.zola.com/wedding-vendors"
	}
];
function token() {
	return `rvw_${Math.random().toString(36).slice(2, 10)}`;
}
function mapReview(r) {
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
		venue: r.venue == null ? null : String(r.venue)
	};
}
var getReviewsDesk_createServerFn_handler = createServerRpc({
	id: "b77d13c292d940ba431314ffff791dda1b062a8c906718b73a3f395ef64cf30f",
	name: "getReviewsDesk",
	filename: "src/lib/crm/reviews.ts"
}, (opts) => getReviewsDesk.__executeServer(opts));
var getReviewsDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getReviewsDesk_createServerFn_handler, async () => {
	const sql = await getSql();
	const reviews = (await sql.query(`select r.*, d.title as deal, d.venue, p.email
         from reviews r
         left join deals d on d.id = r.deal_id
         left join people p on p.id = r.person_id
         order by r.id desc`)).map(mapReview);
	const clicks = (await sql.query(`select platform, count(*)::int as n from review_clicks group by platform order by n desc`)).map((c) => ({
		platform: String(c.platform),
		n: Number(c.n)
	}));
	const drafts = (await sql.query(`select * from wp_drafts order by staged_at desc limit 8`)).map((w) => ({
		id: Number(w.id),
		title: String(w.title),
		body: String(w.body),
		status: String(w.status),
		stagedAt: iso(w.staged_at) ?? ""
	}));
	const sched = (await sql.query(`select * from review_schedule where id = 1`))[0];
	return {
		reviews,
		clicks,
		drafts,
		won: (await sql.query(`select d.id, d.title, d.event_date, p.name, p.email
         from deals d left join people p on p.id = d.person_id
         where d.status = 'won' order by d.event_date desc nulls last limit 8`)).map((d) => ({
			id: Number(d.id),
			title: String(d.title),
			eventDate: iso(d.event_date),
			person: d.name == null ? null : String(d.name),
			email: d.email == null ? null : String(d.email)
		})),
		schedule: {
			daysAfter: Number(sched?.days_after ?? 2),
			channel: String(sched?.channel ?? "email"),
			enabled: sched?.enabled !== false
		},
		stats: {
			asked: reviews.filter((r) => r.status === "asked").length,
			received: reviews.filter((r) => r.status === "received" || r.status === "published").length,
			published: reviews.filter((r) => r.status === "published").length,
			directory: reviews.filter((r) => r.directoryAt).length,
			wp: drafts.length
		}
	};
});
var saveReviewSchedule_createServerFn_handler = createServerRpc({
	id: "9c432fce86eef8141c7628c824c9f18f019fab894388a55a7fe96f21fc887a0d",
	name: "saveReviewSchedule",
	filename: "src/lib/crm/reviews.ts"
}, (opts) => saveReviewSchedule.__executeServer(opts));
var saveReviewSchedule = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveReviewSchedule_createServerFn_handler, async ({ data }) => {
	const days = Math.max(0, Math.min(60, Math.round(data.daysAfter)));
	const channel = [
		"email",
		"sms",
		"portal"
	].includes(data.channel) ? data.channel : "email";
	await (await getSql()).query(`insert into review_schedule (id, days_after, channel, enabled) values (1,$1,$2,$3)
       on conflict (id) do update set days_after = excluded.days_after, channel = excluded.channel, enabled = excluded.enabled`, [
		days,
		channel,
		data.enabled
	]);
	return {
		ok: true,
		daysAfter: days,
		channel
	};
});
var requestReview_createServerFn_handler = createServerRpc({
	id: "d4a50053643a2dc0f984e127996474bc9bb6f3ab6d393397b0c81a9ef985f36e",
	name: "requestReview",
	filename: "src/lib/crm/reviews.ts"
}, (opts) => requestReview.__executeServer(opts));
var requestReview = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(requestReview_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const deal = (await sql.query(`select d.id, d.title, d.person_id, d.event_date, p.name, p.email
         from deals d left join people p on p.id = d.person_id where d.id = $1`, [data.dealId]))[0];
	if (!deal) return {
		ok: false,
		error: "Unknown show",
		token: null
	};
	const sched = (await sql.query(`select * from review_schedule where id = 1`))[0];
	const days = Number(sched?.days_after ?? 2);
	const channel = String(sched?.channel ?? "email");
	const t = token();
	const due = data.sendNow ? /* @__PURE__ */ new Date() : deal.event_date ? new Date(new Date(String(deal.event_date)).getTime() + days * 864e5) : new Date(Date.now() + days * 864e5);
	await sql.query(`insert into reviews (deal_id, person_id, author, stars, status, token, source, requested_at, due_at, channel)
       values ($1,$2,$3,0,'asked',$4,$5,now(),$6,$7)`, [
		data.dealId,
		deal.person_id,
		deal.name,
		t,
		channel,
		due.toISOString(),
		channel
	]);
	if (data.sendNow && deal.email) await sendAsk(sql, {
		to: String(deal.email),
		name: String(deal.name ?? "there"),
		title: String(deal.title),
		token: t,
		dealId: data.dealId,
		personId: deal.person_id == null ? null : Number(deal.person_id)
	});
	return {
		ok: true,
		error: null,
		token: t
	};
});
async function sendAsk(sql, opts) {
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
		hintAddr: "shows@hurricaneproductionsllc.com"
	});
}
var runDueReviews_createServerFn_handler = createServerRpc({
	id: "779bf453d73212b0a60fc77eb6b07bb688ab37c7de8a69e212eb82182465e735",
	name: "runDueReviews",
	filename: "src/lib/crm/reviews.ts"
}, (opts) => runDueReviews.__executeServer(opts));
var runDueReviews = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(runDueReviews_createServerFn_handler, async () => {
	const sql = await getSql();
	const due = await sql.query(`select r.id, r.token, r.deal_id, r.person_id, d.title, p.name, p.email
       from reviews r
       left join deals d on d.id = r.deal_id
       left join people p on p.id = coalesce(r.person_id, d.person_id)
       where r.status = 'asked' and r.due_at <= now() and r.token is not null`);
	let sent = 0;
	for (const row of due) {
		if (!row.email) continue;
		await sendAsk(sql, {
			to: String(row.email),
			name: String(row.name ?? "there"),
			title: String(row.title ?? "the show"),
			token: String(row.token),
			dealId: Number(row.deal_id),
			personId: row.person_id == null ? null : Number(row.person_id)
		});
		await sql.query(`update reviews set source = 'email', requested_at = now() where id = $1`, [Number(row.id)]);
		sent += 1;
	}
	return {
		ok: true,
		sent,
		due: due.length
	};
});
var getReviewPublic_createServerFn_handler = createServerRpc({
	id: "f40ee66a0bce12efdc31dd9431ff8622519268ef1b9c1eb5144adf713677fc08",
	name: "getReviewPublic",
	filename: "src/lib/crm/reviews.ts"
}, (opts) => getReviewPublic.__executeServer(opts));
var getReviewPublic = createServerFn({ method: "GET" }).validator((input) => input).handler(getReviewPublic_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const row = (await sql.query(`select r.*, d.title as deal, d.venue, d.event_date
         from reviews r left join deals d on d.id = r.deal_id where r.token = $1`, [data.token]))[0];
	if (!row) return {
		ok: false,
		review: null
	};
	const clicks = (await sql.query(`select platform from review_clicks where review_id = $1`, [Number(row.id)])).map((c) => String(c.platform));
	return {
		ok: true,
		review: {
			...mapReview(row),
			eventDate: iso(row.event_date),
			clicks
		}
	};
});
var submitReview_createServerFn_handler = createServerRpc({
	id: "872ada1a3b888c756effb4aae6dcc43ce60df290eeb08760f6b1abc3ee93e426",
	name: "submitReview",
	filename: "src/lib/crm/reviews.ts"
}, (opts) => submitReview.__executeServer(opts));
var submitReview = createServerFn({ method: "POST" }).validator((input) => input).handler(submitReview_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const row = (await sql.query(`select * from reviews where token = $1`, [data.token]))[0];
	if (!row) return {
		ok: false,
		error: "Unknown link"
	};
	const stars = Math.max(1, Math.min(5, Math.round(data.stars)));
	const body = data.body.trim();
	if (!body) return {
		ok: false,
		error: "Say something about the show"
	};
	const title = `${row.author ?? "Client"} — ${stars} stars`;
	await sql.query(`update reviews set stars = $2, body = $3, status = 'received', submitted_at = now(),
              directory_at = coalesce(directory_at, now()), wp_draft = true, source = coalesce($4, source)
       where id = $1`, [
		Number(row.id),
		stars,
		body,
		data.source ?? "link"
	]);
	if (!(await sql.query(`select id from wp_drafts where review_id = $1`, [Number(row.id)]))[0]) await sql.query(`insert into wp_drafts (review_id, title, body, status) values ($1,$2,$3,'draft')`, [
		Number(row.id),
		title,
		body
	]);
	return {
		ok: true,
		error: null
	};
});
var clickReviewPlatform_createServerFn_handler = createServerRpc({
	id: "f51221b3bceb108c05cb5e24030f539e39b23a56a702b6bc05652b8d7490cb41",
	name: "clickReviewPlatform",
	filename: "src/lib/crm/reviews.ts"
}, (opts) => clickReviewPlatform.__executeServer(opts));
var clickReviewPlatform = createServerFn({ method: "POST" }).validator((input) => input).handler(clickReviewPlatform_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const row = (await sql.query(`select * from reviews where token = $1`, [data.token]))[0];
	if (!row) return {
		ok: false,
		href: null
	};
	const plat = REVIEW_PLATFORMS.find((p) => p.id === data.platform);
	if (!plat) return {
		ok: false,
		href: null
	};
	await sql.query(`insert into review_clicks (review_id, platform) values ($1,$2)`, [Number(row.id), plat.id]);
	await sql.query(`update reviews set platform = $2, status = 'published', published_at = coalesce(published_at, now()) where id = $1`, [Number(row.id), plat.id]);
	return {
		ok: true,
		href: plat.href
	};
});
var getDirectoryProfile_createServerFn_handler = createServerRpc({
	id: "707e5641948e0384511619753e2fed42e1997d5d034de63017a582b8684818c1",
	name: "getDirectoryProfile",
	filename: "src/lib/crm/reviews.ts"
}, (opts) => getDirectoryProfile.__executeServer(opts));
var getDirectoryProfile = createServerFn({ method: "GET" }).handler(getDirectoryProfile_createServerFn_handler, async () => {
	const reviews = (await (await getSql()).query(`select r.author, r.stars, r.body, r.submitted_at, d.title as deal, d.venue
       from reviews r left join deals d on d.id = r.deal_id
       where r.directory_at is not null and r.body is not null
       order by r.submitted_at desc nulls last`)).map((r) => ({
		author: String(r.author ?? "Client"),
		stars: Number(r.stars),
		body: String(r.body),
		deal: r.deal == null ? null : String(r.deal),
		venue: r.venue == null ? null : String(r.venue),
		at: iso(r.submitted_at)
	}));
	return {
		reviews,
		avg: reviews.length === 0 ? 0 : Math.round(reviews.reduce((s, r) => s + r.stars, 0) / reviews.length * 10) / 10,
		n: reviews.length
	};
});
//#endregion
export { clickReviewPlatform_createServerFn_handler, getDirectoryProfile_createServerFn_handler, getReviewPublic_createServerFn_handler, getReviewsDesk_createServerFn_handler, requestReview_createServerFn_handler, runDueReviews_createServerFn_handler, saveReviewSchedule_createServerFn_handler, submitReview_createServerFn_handler };
