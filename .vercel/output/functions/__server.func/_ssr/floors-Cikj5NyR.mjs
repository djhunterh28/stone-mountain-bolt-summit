import { l as getSql, u as iso } from "./utils-BjcRTCQS.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CZC9dlvp.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/floors-Cikj5NyR.js
function parseJson(raw, fallback) {
	if (raw == null) return fallback;
	if (typeof raw !== "string") return raw ?? fallback;
	try {
		return JSON.parse(raw);
	} catch {
		return fallback;
	}
}
var EMPTY_LAYOUT = {
	w: 100,
	h: 62,
	shell: {
		x: 4,
		y: 4,
		w: 92,
		h: 54
	},
	rooms: [],
	stage: {
		x: 30,
		y: 6,
		w: 40,
		h: 12,
		label: "Stage"
	},
	docks: [{
		x: 4,
		y: 46,
		w: 16,
		h: 12,
		label: "Dock"
	}],
	doors: [{
		x: 4,
		y: 24,
		w: 4,
		h: 12,
		kind: "ingress",
		label: "In"
	}, {
		x: 92,
		y: 24,
		w: 4,
		h: 12,
		kind: "egress",
		label: "Out"
	}]
};
function mapPlan(p) {
	const layout = parseJson(p.layout, EMPTY_LAYOUT);
	return {
		id: Number(p.id),
		name: String(p.name),
		venue: p.venue == null ? null : String(p.venue),
		notes: p.notes == null ? null : String(p.notes),
		template: Boolean(p.template ?? true),
		layout: {
			w: layout.w || 100,
			h: layout.h || 62,
			shell: layout.shell ?? EMPTY_LAYOUT.shell,
			rooms: layout.rooms ?? [],
			stage: layout.stage,
			docks: layout.docks ?? [],
			doors: layout.doors ?? []
		},
		marks: parseJson(p.marks, []),
		updatedAt: iso(p.updated_at)
	};
}
var getFloorPlans_createServerFn_handler = createServerRpc({
	id: "01e6486d4d0e3e255b0c5739a7fcf88620da32cca4516344cc017871e4d1d387",
	name: "getFloorPlans",
	filename: "src/lib/crm/floors.ts"
}, (opts) => getFloorPlans.__executeServer(opts));
var getFloorPlans = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getFloorPlans_createServerFn_handler, async () => {
	return (await (await getSql())`select * from floor_plans where archived is not true order by template desc, id`).map(mapPlan);
});
var saveFloorPlan_createServerFn_handler = createServerRpc({
	id: "d5be177c71521fe4a0f19553f714ed3036c3b5d884c731faf189f77ddd8579cf",
	name: "saveFloorPlan",
	filename: "src/lib/crm/floors.ts"
}, (opts) => saveFloorPlan.__executeServer(opts));
var saveFloorPlan = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveFloorPlan_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const cur = (await sql.query(`select * from floor_plans where id = $1`, [data.id]))[0];
	if (!cur) return { ok: false };
	await sql.query(`update floor_plans set
        marks = $1, layout = $2, name = $3, venue = $4, notes = $5, updated_at = now()
       where id = $6`, [
		JSON.stringify(data.marks ?? parseJson(cur.marks, [])),
		JSON.stringify(data.layout ?? parseJson(cur.layout, EMPTY_LAYOUT)),
		data.name ?? String(cur.name),
		data.venue === void 0 ? cur.venue == null ? null : String(cur.venue) : data.venue,
		data.notes === void 0 ? cur.notes == null ? null : String(cur.notes) : data.notes,
		data.id
	]);
	return { ok: true };
});
var createFloorPlan_createServerFn_handler = createServerRpc({
	id: "db1a1e747d9371ed83f4fbe92d8de962ea760ad62049d52f4d7e40ed31c42dc5",
	name: "createFloorPlan",
	filename: "src/lib/crm/floors.ts"
}, (opts) => createFloorPlan.__executeServer(opts));
var createFloorPlan = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createFloorPlan_createServerFn_handler, async ({ data }) => {
	return mapPlan((await (await getSql()).query(`insert into floor_plans (name, venue, template, layout, marks, notes)
       values ($1, $2, true, $3, '[]', null) returning *`, [
		data.name.trim() || "New venue",
		data.venue?.trim() || null,
		JSON.stringify(EMPTY_LAYOUT)
	]))[0]);
});
var duplicateFloorPlan_createServerFn_handler = createServerRpc({
	id: "50ab6b071cfd4845b0e5c9d78150061b2b23d137705472192ef8d02e3186a545",
	name: "duplicateFloorPlan",
	filename: "src/lib/crm/floors.ts"
}, (opts) => duplicateFloorPlan.__executeServer(opts));
var duplicateFloorPlan = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(duplicateFloorPlan_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const cur = (await sql.query(`select * from floor_plans where id = $1`, [data.id]))[0];
	if (!cur) return { ok: false };
	const name = data.name?.trim() || `Show plot — ${String(cur.name)}`;
	return {
		ok: true,
		plan: mapPlan((await sql.query(`insert into floor_plans (name, venue, template, notes, layout, marks)
       values ($1, $2, false, $3, $4, $5) returning *`, [
			name,
			cur.venue,
			cur.notes,
			cur.layout,
			cur.marks
		]))[0])
	};
});
var archiveFloorPlan_createServerFn_handler = createServerRpc({
	id: "e0aa20b72d4118eb379ebd0d3fe4887e3d86124fe4c3b561b97a5243db64b7f4",
	name: "archiveFloorPlan",
	filename: "src/lib/crm/floors.ts"
}, (opts) => archiveFloorPlan.__executeServer(opts));
var archiveFloorPlan = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(archiveFloorPlan_createServerFn_handler, async ({ data }) => {
	await (await getSql()).query(`update floor_plans set archived = true, updated_at = now() where id = $1`, [data.id]);
	return { ok: true };
});
//#endregion
export { archiveFloorPlan_createServerFn_handler, createFloorPlan_createServerFn_handler, duplicateFloorPlan_createServerFn_handler, getFloorPlans_createServerFn_handler, saveFloorPlan_createServerFn_handler };
