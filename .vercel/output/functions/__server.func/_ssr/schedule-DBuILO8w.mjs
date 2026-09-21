import { u as iso } from "./utils-BjcRTCQS.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CZC9dlvp.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { c as insertOutbound } from "./domain-DTp-hrMr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/schedule-DBuILO8w.js
function mintZoom(seed) {
	let n = 0;
	for (let i = 0; i < seed.length; i++) n = n * 33 + seed.charCodeAt(i) >>> 0;
	const id = String(8e10 + n % 19999999999);
	const pass = (n.toString(36) + "nlzoom").slice(0, 6).toUpperCase();
	return {
		id,
		pass,
		join: `https://northline.zoom.us/j/${id}?pwd=${pass.toLowerCase()}`
	};
}
function nyStamp(isoStr) {
	return new Date(isoStr).toLocaleString("en-US", {
		timeZone: "America/New_York",
		weekday: "short",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit"
	});
}
async function fulfillBooking(sql, bookingId) {
	const b = (await sql.query(`select b.*, l.name as link_name, l.duration_min as link_duration, l.member_id, l.source,
            m.name as host_name, m.email as host_email
     from bookings b
     left join scheduler_links l on l.id = b.link_id
     left join members m on m.id = l.member_id
     where b.id = $1`, [bookingId]))[0];
	if (!b) return null;
	const memberId = b.member_id == null ? null : Number(b.member_id);
	const connections = memberId == null ? [] : await sql.query(`select * from scheduling_connections where member_id = $1 and connected = true`, [memberId]);
	const zoomConn = connections.find((c) => String(c.provider) === "zoom");
	const calConn = connections.find((c) => String(c.provider) === "calendly");
	const confirm = connections.length === 0 || connections.some((c) => Boolean(c.confirm_email));
	const autoZoom = Boolean(zoomConn) && (zoomConn ? Boolean(zoomConn.auto_zoom) : true);
	const duration = Number(b.duration_min ?? b.link_duration ?? 30);
	const title = String(b.link_name ?? "Northline consult");
	const hostName = b.host_name == null ? "Northline" : String(b.host_name);
	const hostEmail = b.host_email == null ? "ops@northline.av" : String(b.host_email);
	const guest = String(b.guest_name);
	const guestEmail = String(b.guest_email);
	const starts = iso(b.starts_at) ?? (/* @__PURE__ */ new Date()).toISOString();
	let zoomId = b.zoom_meeting_id == null ? null : String(b.zoom_meeting_id);
	let zoomJoin = b.zoom_join_url == null ? null : String(b.zoom_join_url);
	let zoomPass = b.zoom_passcode == null ? null : String(b.zoom_passcode);
	if (autoZoom && !zoomJoin) {
		const z = mintZoom(`${bookingId}:${starts}:${guestEmail}`);
		zoomId = z.id;
		zoomJoin = z.join;
		zoomPass = z.pass;
		await sql.query(`update bookings set zoom_meeting_id = $1, zoom_join_url = $2, zoom_passcode = $3, duration_min = $4, status = 'confirmed' where id = $5`, [
			zoomId,
			zoomJoin,
			zoomPass,
			duration,
			bookingId
		]);
	} else await sql.query(`update bookings set duration_min = $1, status = 'confirmed' where id = $2`, [duration, bookingId]);
	if (confirm) {
		const when = nyStamp(starts);
		const body = `Hi ${guest.split(" ")[0] ?? guest} —\n\nYou are confirmed with ${hostName} for ${title} on ${when} ET (${duration} min).\n\n${zoomJoin ? `Zoom: ${zoomJoin}  (passcode ${zoomPass})` : "We will send a venue call sheet separately."}\n\nReply to this thread if the hold moves. The Gowanus shop is on 718-555-0140.\n\n— ${hostName}\nHurricane Productions`;
		await insertOutbound(sql, {
			purpose: "workflow",
			mailKind: "transactional",
			toAddr: guestEmail,
			subject: `Confirmed: ${title} — ${when}`,
			body,
			fallbackName: hostName,
			hintAddr: hostEmail
		});
		await sql.query(`update bookings set confirmation_sent_at = now() where id = $1`, [bookingId]);
	}
	await sql.query(`insert into notifications (member_id, kind, title, body, href, read)
     values ($1, 'booking', $2, $3, '/scheduler', false)`, [
		memberId ?? 1,
		`${guest} booked ${title}`,
		`${nyStamp(starts)} · ${guestEmail}${zoomJoin ? " · Zoom created" : ""}`
	]);
	if (calConn) await sql.query(`update scheduling_connections set last_sync = now() where id = $1`, [Number(calConn.id)]);
	return {
		zoomJoinUrl: zoomJoin,
		zoomPasscode: zoomPass,
		hostName,
		startsAt: starts,
		durationMin: duration,
		title,
		confirmationSent: confirm
	};
}
async function completeNewBooking(sql, bookingId) {
	return fulfillBooking(sql, bookingId);
}
var getSchedulingDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("ba88ea3e35fb378d768980ed368e21ad74a3a54c219b06a4754db453aa1446a9"));
var connectScheduler = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("0f0f0fc177d8eff8f81b3a3b8980728644987a278af9a0433837bfa360cee6ac"));
var syncCalendly = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("250858188be72e897a7b57a42c4ff9a04290d82d7e4af845326fba3ebab46786"));
var syncScheduler = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("3e3c15c216d1c94fd37a34204ab1b75dc5f5f25cceb86beacfc9feb897a1961f"));
var toggleConnection = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("fc7db517c0f90eaef7d3e7205101df84e313305563ff12ae2c5fdf21f50df3c7"));
var resendConfirmation = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("d04dda16f20d220227317ce67988af68f1812877f71b34d02df09b558a51de51"));
var createZoomMeeting = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("78732908c9ce1faf9994cae19b93b76747f37b6c920666ae5d45cab7b4c73e85"));
//#endregion
export { resendConfirmation as a, toggleConnection as c, getSchedulingDesk as i, connectScheduler as n, syncCalendly as o, createZoomMeeting as r, syncScheduler as s, completeNewBooking as t };
