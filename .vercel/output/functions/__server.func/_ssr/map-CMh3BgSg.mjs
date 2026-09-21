import { d as money, u as iso } from "./utils-BjcRTCQS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/map-CMh3BgSg.js
function mapMember(r) {
	return {
		id: Number(r.id),
		name: String(r.name),
		email: String(r.email),
		title: String(r.title),
		role: String(r.role),
		teamId: r.team_id == null ? null : Number(r.team_id),
		teamName: r.team_name == null ? null : String(r.team_name),
		initials: String(r.initials),
		tone: String(r.tone ?? "steel")
	};
}
function mapDeal(r) {
	const days = Number(r.days_in_stage ?? 0);
	const rottingDays = Number(r.rotting_days ?? 14);
	const status = r.status ?? "open";
	return {
		id: Number(r.id),
		title: String(r.title),
		value: money(r.value),
		pipelineId: Number(r.pipeline_id),
		stageId: Number(r.stage_id),
		orgId: r.org_id == null ? null : Number(r.org_id),
		orgName: r.org_name == null ? null : String(r.org_name),
		personId: r.person_id == null ? null : Number(r.person_id),
		personName: r.person_name == null ? null : String(r.person_name),
		ownerId: r.owner_id == null ? null : Number(r.owner_id),
		ownerName: r.owner_name == null ? null : String(r.owner_name),
		ownerInitials: r.owner_initials == null ? null : String(r.owner_initials),
		ownerTone: r.owner_tone == null ? null : String(r.owner_tone),
		status,
		lostReason: r.lost_reason == null ? null : String(r.lost_reason),
		expectedClose: iso(r.expected_close),
		eventDate: iso(r.event_date),
		venue: r.venue == null ? null : String(r.venue),
		guestCount: r.guest_count == null ? null : Number(r.guest_count),
		indoor: r.indoor == null ? null : Boolean(r.indoor),
		loadIn: r.load_in == null ? null : String(r.load_in),
		source: r.source == null ? null : String(r.source),
		eventType: r.event_type == null ? null : String(r.event_type),
		notes: r.notes == null ? null : String(r.notes),
		probability: r.probability == null ? Number(r.stage_probability ?? 0) : Number(r.probability),
		stageEnteredAt: iso(r.stage_entered_at),
		createdAt: iso(r.created_at) ?? "",
		updatedAt: iso(r.updated_at) ?? "",
		daysInStage: Math.max(0, Math.floor(days)),
		rotting: status === "open" && days > rottingDays,
		nextActivity: r.next_activity == null ? null : String(r.next_activity),
		nextActivityAt: iso(r.next_activity_at),
		productCount: Number(r.product_count ?? 0)
	};
}
function mapLead(r) {
	return {
		id: Number(r.id),
		title: String(r.title),
		personId: r.person_id == null ? null : Number(r.person_id),
		personName: r.person_name == null ? null : String(r.person_name),
		personEmail: r.person_email == null ? null : String(r.person_email),
		orgId: r.org_id == null ? null : Number(r.org_id),
		orgName: r.org_name == null ? null : String(r.org_name),
		ownerId: r.owner_id == null ? null : Number(r.owner_id),
		ownerName: r.owner_name == null ? null : String(r.owner_name),
		ownerInitials: r.owner_initials == null ? null : String(r.owner_initials),
		ownerTone: r.owner_tone == null ? null : String(r.owner_tone),
		source: String(r.source),
		eventType: r.event_type == null ? null : String(r.event_type),
		eventDate: iso(r.event_date),
		venue: r.venue == null ? null : String(r.venue),
		estimatedValue: money(r.estimated_value),
		disqualifyReason: r.disqualify_reason == null ? null : String(r.disqualify_reason),
		dealId: r.deal_id == null ? null : Number(r.deal_id),
		score: Number(r.score ?? 0),
		status: r.status ?? "new",
		labels: r.labels == null ? null : String(r.labels),
		notes: r.notes == null ? null : String(r.notes),
		createdAt: iso(r.created_at) ?? "",
		stageEnteredAt: iso(r.stage_entered_at),
		daysInStage: Math.max(0, Math.floor(Number(r.days_in_stage ?? 0)))
	};
}
function mapPerson(r) {
	return {
		id: Number(r.id),
		name: String(r.name),
		email: r.email == null ? null : String(r.email),
		phone: r.phone == null ? null : String(r.phone),
		title: r.title == null ? null : String(r.title),
		orgId: r.org_id == null ? null : Number(r.org_id),
		orgName: r.org_name == null ? null : String(r.org_name),
		ownerId: r.owner_id == null ? null : Number(r.owner_id),
		ownerName: r.owner_name == null ? null : String(r.owner_name),
		city: r.city == null ? null : String(r.city),
		address: r.address == null ? null : String(r.address),
		lat: r.lat == null ? null : Number(r.lat),
		lng: r.lng == null ? null : Number(r.lng),
		createdAt: iso(r.created_at) ?? "",
		openDeals: Number(r.open_deals ?? 0),
		dealValue: money(r.deal_value),
		linkedin: r.linkedin == null ? null : String(r.linkedin),
		enrichedAt: iso(r.enriched_at),
		mobile: r.mobile == null ? null : String(r.mobile),
		directDial: r.direct_dial == null ? null : String(r.direct_dial)
	};
}
function mapOrg(r) {
	return {
		id: Number(r.id),
		name: String(r.name),
		website: r.website == null ? null : String(r.website),
		address: r.address == null ? null : String(r.address),
		city: r.city == null ? null : String(r.city),
		industry: r.industry == null ? null : String(r.industry),
		ownerId: r.owner_id == null ? null : Number(r.owner_id),
		ownerName: r.owner_name == null ? null : String(r.owner_name),
		lat: r.lat == null ? null : Number(r.lat),
		lng: r.lng == null ? null : Number(r.lng),
		phone: r.phone == null ? null : String(r.phone),
		notes: r.notes == null ? null : String(r.notes),
		createdAt: iso(r.created_at) ?? "",
		peopleCount: Number(r.people_count ?? 0),
		openDeals: Number(r.open_deals ?? 0),
		dealValue: money(r.deal_value),
		employees: r.employees == null ? null : String(r.employees),
		revenueBand: r.revenue_band == null ? null : String(r.revenue_band),
		enrichedAt: iso(r.enriched_at)
	};
}
function mapActivity(r) {
	return {
		id: Number(r.id),
		type: String(r.type),
		subject: String(r.subject),
		dealId: r.deal_id == null ? null : Number(r.deal_id),
		dealTitle: r.deal_title == null ? null : String(r.deal_title),
		leadId: r.lead_id == null ? null : Number(r.lead_id),
		personId: r.person_id == null ? null : Number(r.person_id),
		personName: r.person_name == null ? null : String(r.person_name),
		orgId: r.org_id == null ? null : Number(r.org_id),
		orgName: r.org_name == null ? null : String(r.org_name),
		ownerId: r.owner_id == null ? null : Number(r.owner_id),
		ownerName: r.owner_name == null ? null : String(r.owner_name),
		ownerInitials: r.owner_initials == null ? null : String(r.owner_initials),
		ownerTone: r.owner_tone == null ? null : String(r.owner_tone),
		dueAt: iso(r.due_at),
		done: Boolean(r.done),
		durationMin: Number(r.duration_min ?? 30),
		location: r.location == null ? null : String(r.location),
		notes: r.notes == null ? null : String(r.notes),
		createdAt: iso(r.created_at) ?? ""
	};
}
function mapProduct(r) {
	return {
		id: Number(r.id),
		name: String(r.name),
		sku: r.sku == null ? null : String(r.sku),
		category: String(r.category),
		unitPrice: money(r.unit_price),
		unit: String(r.unit),
		billing: String(r.billing),
		description: r.description == null ? null : String(r.description),
		active: Boolean(r.active)
	};
}
function mapDealProduct(r) {
	return {
		id: Number(r.id),
		productId: Number(r.product_id),
		name: String(r.name),
		sku: r.sku == null ? null : String(r.sku),
		qty: money(r.qty),
		discount: money(r.discount),
		price: money(r.price),
		unit: String(r.unit ?? "day")
	};
}
function mapProject(r) {
	return {
		id: Number(r.id),
		name: String(r.name),
		dealId: r.deal_id == null ? null : Number(r.deal_id),
		dealTitle: r.deal_title == null ? null : String(r.deal_title),
		status: String(r.status),
		startDate: iso(r.start_date),
		endDate: iso(r.end_date),
		ownerId: r.owner_id == null ? null : Number(r.owner_id),
		ownerName: r.owner_name == null ? null : String(r.owner_name),
		taskCount: Number(r.task_count ?? 0),
		doneCount: Number(r.done_count ?? 0),
		venue: r.venue == null ? null : String(r.venue)
	};
}
function mapTask(r) {
	return {
		id: Number(r.id),
		projectId: Number(r.project_id),
		title: String(r.title),
		columnName: String(r.column_name),
		assigneeId: r.assignee_id == null ? null : Number(r.assignee_id),
		assigneeName: r.assignee_name == null ? null : String(r.assignee_name),
		dueAt: iso(r.due_at),
		sortOrder: Number(r.sort_order ?? 0)
	};
}
function mapEmail(r) {
	return {
		id: Number(r.id),
		folder: String(r.folder),
		fromName: String(r.from_name),
		fromAddr: String(r.from_addr),
		toAddr: String(r.to_addr),
		subject: String(r.subject),
		body: String(r.body),
		dealId: r.deal_id == null ? null : Number(r.deal_id),
		dealTitle: r.deal_title == null ? null : String(r.deal_title),
		personId: r.person_id == null ? null : Number(r.person_id),
		opened: Boolean(r.opened),
		clicked: Boolean(r.clicked),
		scheduledAt: iso(r.scheduled_at),
		sentAt: iso(r.sent_at),
		createdAt: iso(r.created_at) ?? "",
		authenticated: Boolean(r.authenticated),
		domainId: r.domain_id == null ? null : Number(r.domain_id)
	};
}
function mapDoc(r) {
	return {
		id: Number(r.id),
		name: String(r.name),
		dealId: r.deal_id == null ? null : Number(r.deal_id),
		dealTitle: r.deal_title == null ? null : String(r.deal_title),
		template: String(r.template),
		status: String(r.status),
		content: r.content == null ? null : String(r.content),
		sentAt: iso(r.sent_at),
		viewedAt: iso(r.viewed_at),
		signedAt: iso(r.signed_at),
		createdAt: iso(r.created_at) ?? ""
	};
}
var DEAL_SELECT = `
  d.id, d.title, d.value, d.pipeline_id, d.stage_id, d.org_id, d.person_id, d.owner_id,
  d.status, d.lost_reason, d.expected_close, d.probability, d.source, d.event_type, d.event_date,
  d.venue, d.guest_count, d.indoor, d.load_in, d.notes, d.stage_entered_at,
  d.created_at, d.updated_at, d.won_at, d.lost_at, d.cancelled_at,
  o.name as org_name, p.name as person_name, p.email as person_email, p.phone as person_phone,
  o.address as org_address,
  m.name as owner_name, m.initials as owner_initials, m.tone as owner_tone,
  s.name as stage_name, s.rotting_days, s.probability as stage_probability,
  extract(epoch from (now() - d.stage_entered_at)) / 86400.0 as days_in_stage,
  (select count(*) from deal_products dp where dp.deal_id = d.id) as product_count,
  (select a.subject from activities a where a.deal_id = d.id and a.done = false order by a.due_at nulls last limit 1) as next_activity,
  (select a.due_at from activities a where a.deal_id = d.id and a.done = false order by a.due_at nulls last limit 1) as next_activity_at
`;
//#endregion
export { mapDoc as a, mapMember as c, mapProduct as d, mapProject as f, mapDealProduct as i, mapOrg as l, mapActivity as n, mapEmail as o, mapTask as p, mapDeal as r, mapLead as s, DEAL_SELECT as t, mapPerson as u };
