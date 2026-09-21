import { r as createServerFn } from "./ssr.mjs";
import { d as iso, t as authMiddleware, u as getSql } from "./utils-DLVA4J7b.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { s as slugify } from "./form-logic-B_LD3eqk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forms-Dev-spWV.js
function parseJson(raw, fallback) {
	if (raw == null) return fallback;
	if (typeof raw !== "string") return raw ?? fallback;
	try {
		return JSON.parse(raw);
	} catch {
		return fallback;
	}
}
function mintVendorToken() {
	return `nlv_${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 6)}`;
}
function mapForm(r, vendors = []) {
	return {
		id: Number(r.id),
		name: String(r.name),
		slug: String(r.slug),
		fields: parseJson(r.fields, []),
		active: Boolean(r.active),
		submissions: Number(r.submissions ?? 0),
		description: r.description == null ? null : String(r.description),
		thankYou: r.thank_you == null ? null : String(r.thank_you),
		notifyEmail: r.notify_email == null ? null : String(r.notify_email),
		allowEmbed: r.allow_embed == null ? true : Boolean(r.allow_embed),
		wizard: Boolean(r.wizard),
		vendorLock: Boolean(r.vendor_lock),
		createsLead: r.creates_lead == null ? true : Boolean(r.creates_lead),
		steps: parseJson(r.steps, []),
		vendors,
		updatedAt: iso(r.updated_at)
	};
}
async function vendorsByForm(sql) {
	const rows = await sql.query(`select a.form_id, a.token, v.id, v.name, v.category, v.city
     from form_vendor_assign a
     join directory_vendors v on v.id = a.vendor_id
     order by v.name`);
	const map = /* @__PURE__ */ new Map();
	for (const r of rows) {
		const id = Number(r.form_id);
		const list = map.get(id) ?? [];
		list.push({
			id: Number(r.id),
			name: String(r.name),
			category: String(r.category),
			city: r.city == null ? null : String(r.city),
			token: String(r.token)
		});
		map.set(id, list);
	}
	return map;
}
var listForms_createServerFn_handler = createServerRpc({
	id: "1f24c9c7c915f9627053f9b1ed17f334f2e77905972ae9efa5bc36caa2caa45a",
	name: "listForms",
	filename: "src/lib/crm/forms.ts"
}, (opts) => listForms.__executeServer(opts));
var listForms = createServerFn({ method: "GET" }).handler(listForms_createServerFn_handler, async () => {
	const sql = await getSql();
	const rows = await sql`select * from web_forms order by id`;
	const vmap = await vendorsByForm(sql).catch(() => /* @__PURE__ */ new Map());
	return rows.map((r) => mapForm(r, vmap.get(Number(r.id)) ?? []));
});
var getFormBySlug_createServerFn_handler = createServerRpc({
	id: "38a22361b3d9dc8e5301a2060125570dbb0a1d71384ad6ae128eacc4a5680129",
	name: "getFormBySlug",
	filename: "src/lib/crm/forms.ts"
}, (opts) => getFormBySlug.__executeServer(opts));
var getFormBySlug = createServerFn({ method: "GET" }).validator((input) => input).handler(getFormBySlug_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const f = (await sql`select * from web_forms where slug = ${data.slug}`)[0];
	if (!f) return {
		ok: false,
		reason: "missing"
	};
	const form = mapForm(f, (await vendorsByForm(sql).catch(() => /* @__PURE__ */ new Map())).get(Number(f.id)) ?? []);
	if (!form.active) return {
		ok: false,
		reason: "inactive"
	};
	const token = data.vendor?.trim();
	let vendor = null;
	if (token) vendor = form.vendors.find((v) => v.token === token) ?? null;
	if (form.vendorLock && !vendor) return {
		ok: false,
		reason: "vendor",
		form: {
			name: form.name,
			slug: form.slug
		}
	};
	return {
		ok: true,
		form: {
			...form,
			vendors: vendor ? [{
				...vendor,
				token: ""
			}] : form.vendorLock ? [] : form.vendors.map((v) => ({
				...v,
				token: ""
			}))
		},
		vendor: vendor ? {
			id: vendor.id,
			name: vendor.name,
			category: vendor.category
		} : null
	};
});
var submitForm_createServerFn_handler = createServerRpc({
	id: "bfb2bac394c9f53cd80ff0f837e382ab3efe9ac60b28517a578a0cdf738c5ce6",
	name: "submitForm",
	filename: "src/lib/crm/forms.ts"
}, (opts) => submitForm.__executeServer(opts));
var submitForm = createServerFn({ method: "POST" }).validator((input) => input).handler(submitForm_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const f = (await sql`select * from web_forms where slug = ${data.slug}`)[0];
	if (!f) return {
		ok: false,
		error: "Form not found"
	};
	const form = mapForm(f);
	const token = data.vendorToken?.trim();
	let vendorId = null;
	if (token) {
		const row = (await sql.query(`select vendor_id from form_vendor_assign where form_id = $1 and token = $2`, [form.id, token]))[0];
		vendorId = row ? Number(row.vendor_id) : null;
	}
	if (form.vendorLock && vendorId == null) return {
		ok: false,
		error: "This form is assigned to a vendor. Use the link they were sent."
	};
	const ins = await sql.query(`insert into form_submissions (form_id, payload, source, vendor_id) values ($1,$2::jsonb,$3,$4) returning id`, [
		form.id,
		JSON.stringify(data.payload),
		data.source ?? "public",
		vendorId
	]);
	const submissionId = Number(ins[0]?.id);
	await sql`update web_forms set submissions = submissions + 1, updated_at = now() where id = ${form.id}`;
	for (const file of data.files ?? []) {
		const b64 = file.dataB64.slice(0, 8e4);
		await sql.query(`insert into form_uploads (submission_id, form_id, field_id, filename, mime, size_bytes, data_b64, truncated)
         values ($1,$2,$3,$4,$5,$6,$7,$8)`, [
			submissionId,
			form.id,
			file.fieldId,
			file.filename.slice(0, 180),
			file.mime || "application/octet-stream",
			file.sizeBytes,
			b64,
			Boolean(file.truncated) || file.dataB64.length > 8e4
		]);
	}
	if (form.createsLead) {
		const title = `${data.payload.name ?? data.payload.company ?? "Website"} — ${data.payload.venue ?? data.payload.title ?? data.payload.gear ?? "inquiry"}`;
		const route = (await sql`select owner_id from lead_routes where source = ${"Web form"} and active = true limit 1`)[0];
		await sql`insert into leads (title, source, owner_id, notes, score) values (${title}, ${"Web form"}, ${route?.owner_id == null ? 5 : Number(route.owner_id)}, ${JSON.stringify(data.payload)}, ${45})`;
		await sql`update automations set runs = runs + 1 where trigger_type = 'form.submit'`;
	}
	return {
		ok: true,
		id: submissionId
	};
});
var getFormsDesk_createServerFn_handler = createServerRpc({
	id: "52a5338b996fc7cc6eb49070551e9ba5b0b1b8e504bd7aa3c33eaf41b416c9c2",
	name: "getFormsDesk",
	filename: "src/lib/crm/forms.ts"
}, (opts) => getFormsDesk.__executeServer(opts));
var getFormsDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getFormsDesk_createServerFn_handler, async () => {
	const sql = await getSql();
	const vmap = await vendorsByForm(sql);
	const forms = (await sql`select * from web_forms order by id`).map((r) => mapForm(r, vmap.get(Number(r.id)) ?? []));
	const vendors = (await sql`select id, name, category, city from directory_vendors order by name`).map((v) => ({
		id: Number(v.id),
		name: String(v.name),
		category: String(v.category),
		city: v.city == null ? null : String(v.city)
	}));
	const uploads = await sql.query(`select id, submission_id, field_id, filename, mime, size_bytes, truncated from form_uploads order by id`);
	const bySub = /* @__PURE__ */ new Map();
	for (const u of uploads) {
		const sid = Number(u.submission_id);
		const list = bySub.get(sid) ?? [];
		list.push({
			id: Number(u.id),
			fieldId: String(u.field_id),
			filename: String(u.filename),
			mime: u.mime == null ? null : String(u.mime),
			sizeBytes: Number(u.size_bytes),
			truncated: Boolean(u.truncated)
		});
		bySub.set(sid, list);
	}
	return {
		forms,
		vendors,
		submissions: (await sql.query(`select s.*, f.name as form_name, v.name as vendor_name
         from form_submissions s
         join web_forms f on f.id = s.form_id
         left join directory_vendors v on v.id = s.vendor_id
         order by s.id desc
         limit 80`)).map((s) => ({
			id: Number(s.id),
			formId: Number(s.form_id),
			formName: String(s.form_name),
			payload: parseJson(s.payload, {}),
			source: String(s.source ?? "public"),
			vendorId: s.vendor_id == null ? null : Number(s.vendor_id),
			vendorName: s.vendor_name == null ? null : String(s.vendor_name),
			createdAt: iso(s.created_at) ?? "",
			files: bySub.get(Number(s.id)) ?? []
		}))
	};
});
var createForm_createServerFn_handler = createServerRpc({
	id: "ea5a95b754af30a6e2ad0ddfa0f71aa688f9286295de1f860b7726ddf3f9c0e9",
	name: "createForm",
	filename: "src/lib/crm/forms.ts"
}, (opts) => createForm.__executeServer(opts));
var createForm = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createForm_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	let slug = slugify(data.name);
	if ((await sql`select id from web_forms where slug = ${slug}`)[0]) slug = `${slug}-${Math.random().toString(36).slice(2, 5)}`;
	return mapForm((await sql.query(`insert into web_forms (name, slug, fields, active, description, thank_you, wizard, steps, allow_embed, creates_lead)
       values ($1,$2,$3::jsonb,true,$4,$5,false,'[]'::jsonb,true,true) returning *`, [
		data.name.trim() || "Untitled form",
		slug,
		JSON.stringify([
			{
				id: "name",
				label: "Name",
				type: "text",
				required: true,
				step: 0
			},
			{
				id: "email",
				label: "Email",
				type: "email",
				required: true,
				step: 0
			},
			{
				id: "message",
				label: "Message",
				type: "textarea",
				required: false,
				step: 0
			}
		]),
		"Public intake. Submissions land in the inbox.",
		"Received. The shop will follow up."
	]))[0], []);
});
var saveForm_createServerFn_handler = createServerRpc({
	id: "725a28d6aaf612ceca278a7fcc35ce034958a7a62c5d2837bbb28dacb797c38e",
	name: "saveForm",
	filename: "src/lib/crm/forms.ts"
}, (opts) => saveForm.__executeServer(opts));
var saveForm = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveForm_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	let slug = slugify(data.slug || data.name);
	if ((await sql`select id from web_forms where slug = ${slug} and id <> ${data.id}`)[0]) slug = `${slug}-${data.id}`;
	await sql.query(`update web_forms set
         name = $1, slug = $2, description = $3, thank_you = $4, notify_email = $5,
         allow_embed = $6, wizard = $7, vendor_lock = $8, creates_lead = $9, active = $10,
         fields = $11::jsonb, steps = $12::jsonb, updated_at = now()
       where id = $13`, [
		data.name.trim() || "Untitled form",
		slug,
		data.description ?? null,
		data.thankYou ?? null,
		data.notifyEmail ?? null,
		data.allowEmbed,
		data.wizard,
		data.vendorLock,
		data.createsLead,
		data.active,
		JSON.stringify(data.fields),
		JSON.stringify(data.steps),
		data.id
	]);
	const existing = await sql.query(`select vendor_id, token from form_vendor_assign where form_id = $1`, [data.id]);
	const keep = new Set(data.vendorIds);
	for (const row of existing) if (!keep.has(Number(row.vendor_id))) await sql.query(`delete from form_vendor_assign where form_id = $1 and vendor_id = $2`, [data.id, Number(row.vendor_id)]);
	const have = new Set(existing.map((r) => Number(r.vendor_id)));
	for (const vid of data.vendorIds) {
		if (have.has(vid)) continue;
		await sql.query(`insert into form_vendor_assign (form_id, vendor_id, token) values ($1,$2,$3)`, [
			data.id,
			vid,
			mintVendorToken()
		]);
	}
	return {
		ok: true,
		slug
	};
});
var archiveForm_createServerFn_handler = createServerRpc({
	id: "f36cf2753d3df4dfcf5bc9a64c00344014ff16f6d06b4ea0d6b058e35f062a25",
	name: "archiveForm",
	filename: "src/lib/crm/forms.ts"
}, (opts) => archiveForm.__executeServer(opts));
var archiveForm = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(archiveForm_createServerFn_handler, async ({ data }) => {
	await (await getSql())`update web_forms set active = ${data.active}, updated_at = now() where id = ${data.id}`;
	return { ok: true };
});
var rotateVendorToken_createServerFn_handler = createServerRpc({
	id: "ee63be7678ad3ffd52351582befc96272a1b17bcd628d2fbc850525b134105f9",
	name: "rotateVendorToken",
	filename: "src/lib/crm/forms.ts"
}, (opts) => rotateVendorToken.__executeServer(opts));
var rotateVendorToken = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(rotateVendorToken_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const token = mintVendorToken();
	await sql.query(`update form_vendor_assign set token = $1 where form_id = $2 and vendor_id = $3`, [
		token,
		data.formId,
		data.vendorId
	]);
	return {
		ok: true,
		token
	};
});
var downloadFormUpload_createServerFn_handler = createServerRpc({
	id: "afdd5fffcb56b9ad09a8e2ac1317d78bd1a5f581bc40a501359bbbf6642b9989",
	name: "downloadFormUpload",
	filename: "src/lib/crm/forms.ts"
}, (opts) => downloadFormUpload.__executeServer(opts));
var downloadFormUpload = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(downloadFormUpload_createServerFn_handler, async ({ data }) => {
	const row = (await (await getSql()).query(`select * from form_uploads where id = $1`, [data.id]))[0];
	if (!row) return { ok: false };
	return {
		ok: true,
		filename: String(row.filename),
		mime: row.mime == null ? "application/octet-stream" : String(row.mime),
		contentB64: String(row.data_b64 ?? "")
	};
});
//#endregion
export { archiveForm_createServerFn_handler, createForm_createServerFn_handler, downloadFormUpload_createServerFn_handler, getFormBySlug_createServerFn_handler, getFormsDesk_createServerFn_handler, listForms_createServerFn_handler, rotateVendorToken_createServerFn_handler, saveForm_createServerFn_handler, submitForm_createServerFn_handler };
