import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { iso } from "@/lib/utils";
import { authMiddleware } from "@/lib/auth/middleware";
import { slugify } from "./form-logic";
import type { FormField, FormStep, WebForm } from "./types";

function parseJson<T>(raw: unknown, fallback: T): T {
  if (raw == null) return fallback;
  if (typeof raw !== "string") return (raw as T) ?? fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function mintVendorToken() {
  return `nlv_${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 6)}`;
}

export type FormVendor = {
  id: number;
  name: string;
  category: string;
  city: string | null;
  token: string;
};

export type CustomForm = WebForm & {
  description: string | null;
  thankYou: string | null;
  notifyEmail: string | null;
  allowEmbed: boolean;
  wizard: boolean;
  vendorLock: boolean;
  createsLead: boolean;
  steps: FormStep[];
  vendors: FormVendor[];
  updatedAt: string | null;
};

export type FormSubmission = {
  id: number;
  formId: number;
  formName: string;
  payload: Record<string, string>;
  source: string;
  vendorId: number | null;
  vendorName: string | null;
  createdAt: string;
  files: { id: number; fieldId: string; filename: string; mime: string | null; sizeBytes: number; truncated: boolean }[];
};

export type DirectoryVendor = {
  id: number;
  name: string;
  category: string;
  city: string | null;
};

function mapForm(r: Record<string, unknown>, vendors: FormVendor[] = []): CustomForm {
  return {
    id: Number(r.id),
    name: String(r.name),
    slug: String(r.slug),
    fields: parseJson<FormField[]>(r.fields, []),
    active: Boolean(r.active),
    submissions: Number(r.submissions ?? 0),
    description: r.description == null ? null : String(r.description),
    thankYou: r.thank_you == null ? null : String(r.thank_you),
    notifyEmail: r.notify_email == null ? null : String(r.notify_email),
    allowEmbed: r.allow_embed == null ? true : Boolean(r.allow_embed),
    wizard: Boolean(r.wizard),
    vendorLock: Boolean(r.vendor_lock),
    createsLead: r.creates_lead == null ? true : Boolean(r.creates_lead),
    steps: parseJson<FormStep[]>(r.steps, []),
    vendors,
    updatedAt: iso(r.updated_at),
  };
}

async function vendorsByForm(sql: Awaited<ReturnType<typeof getSql>>): Promise<Map<number, FormVendor[]>> {
  const rows = await sql.query(
    `select a.form_id, a.token, v.id, v.name, v.category, v.city
     from form_vendor_assign a
     join directory_vendors v on v.id = a.vendor_id
     order by v.name`,
  );
  const map = new Map<number, FormVendor[]>();
  for (const r of rows) {
    const id = Number(r.form_id);
    const list = map.get(id) ?? [];
    list.push({
      id: Number(r.id),
      name: String(r.name),
      category: String(r.category),
      city: r.city == null ? null : String(r.city),
      token: String(r.token),
    });
    map.set(id, list);
  }
  return map;
}

export const listForms = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql`select * from web_forms order by id`;
  const vmap = await vendorsByForm(sql).catch(() => new Map<number, FormVendor[]>());
  return rows.map((r) => mapForm(r, vmap.get(Number(r.id)) ?? []));
});

export const getFormBySlug = createServerFn({ method: "GET" })
  .validator((input: { slug: string; vendor?: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const f = (await sql`select * from web_forms where slug = ${data.slug}`)[0];
    if (!f) return { ok: false as const, reason: "missing" };
    const vmap = await vendorsByForm(sql).catch(() => new Map<number, FormVendor[]>());
    const form = mapForm(f, vmap.get(Number(f.id)) ?? []);
    if (!form.active) return { ok: false as const, reason: "inactive" };
    const token = data.vendor?.trim();
    let vendor: FormVendor | null = null;
    if (token) vendor = form.vendors.find((v) => v.token === token) ?? null;
    if (form.vendorLock && !vendor) return { ok: false as const, reason: "vendor", form: { name: form.name, slug: form.slug } };
    return {
      ok: true as const,
      form: {
        ...form,
        vendors: vendor ? [{ ...vendor, token: "" }] : form.vendorLock ? [] : form.vendors.map((v) => ({ ...v, token: "" })),
      },
      vendor: vendor ? { id: vendor.id, name: vendor.name, category: vendor.category } : null,
    };
  });

export const submitForm = createServerFn({ method: "POST" })
  .validator(
    (input: {
      slug: string;
      payload: Record<string, string>;
      vendorToken?: string;
      source?: string;
      files?: { fieldId: string; filename: string; mime: string; sizeBytes: number; dataB64: string; truncated?: boolean }[];
    }) => input,
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const f = (await sql`select * from web_forms where slug = ${data.slug}`)[0];
    if (!f) return { ok: false as const, error: "Form not found" };
    const form = mapForm(f);
    const token = data.vendorToken?.trim();
    let vendorId: number | null = null;
    if (token) {
      const row = (
        await sql.query(`select vendor_id from form_vendor_assign where form_id = $1 and token = $2`, [form.id, token])
      )[0];
      vendorId = row ? Number(row.vendor_id) : null;
    }
    if (form.vendorLock && vendorId == null) return { ok: false as const, error: "This form is assigned to a vendor. Use the link they were sent." };

    const ins = await sql.query(
      `insert into form_submissions (form_id, payload, source, vendor_id) values ($1,$2::jsonb,$3,$4) returning id`,
      [form.id, JSON.stringify(data.payload), data.source ?? "public", vendorId],
    );
    const submissionId = Number(ins[0]?.id);
    await sql`update web_forms set submissions = submissions + 1, updated_at = now() where id = ${form.id}`;

    for (const file of data.files ?? []) {
      const b64 = file.dataB64.slice(0, 80_000);
      await sql.query(
        `insert into form_uploads (submission_id, form_id, field_id, filename, mime, size_bytes, data_b64, truncated)
         values ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          submissionId,
          form.id,
          file.fieldId,
          file.filename.slice(0, 180),
          file.mime || "application/octet-stream",
          file.sizeBytes,
          b64,
          Boolean(file.truncated) || file.dataB64.length > 80_000,
        ],
      );
    }

    if (form.createsLead) {
      const title = `${data.payload.name ?? data.payload.company ?? "Website"} — ${data.payload.venue ?? data.payload.title ?? data.payload.gear ?? "inquiry"}`;
      const route = (await sql`select owner_id from lead_routes where source = ${"Web form"} and active = true limit 1`)[0];
      const ownerId = route?.owner_id == null ? 5 : Number(route.owner_id);
      await sql`insert into leads (title, source, owner_id, notes, score) values (${title}, ${"Web form"}, ${ownerId}, ${JSON.stringify(data.payload)}, ${45})`;
      await sql`update automations set runs = runs + 1 where trigger_type = 'form.submit'`;
    }
    return { ok: true as const, id: submissionId };
  });

export const getFormsDesk = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const vmap = await vendorsByForm(sql);
    const forms = (await sql`select * from web_forms order by id`).map((r) => mapForm(r, vmap.get(Number(r.id)) ?? []));
    const vendors: DirectoryVendor[] = (
      await sql`select id, name, category, city from directory_vendors order by name`
    ).map((v) => ({
      id: Number(v.id),
      name: String(v.name),
      category: String(v.category),
      city: v.city == null ? null : String(v.city),
    }));
    const uploads = await sql.query(
      `select id, submission_id, field_id, filename, mime, size_bytes, truncated from form_uploads order by id`,
    );
    const bySub = new Map<number, FormSubmission["files"]>();
    for (const u of uploads) {
      const sid = Number(u.submission_id);
      const list = bySub.get(sid) ?? [];
      list.push({
        id: Number(u.id),
        fieldId: String(u.field_id),
        filename: String(u.filename),
        mime: u.mime == null ? null : String(u.mime),
        sizeBytes: Number(u.size_bytes),
        truncated: Boolean(u.truncated),
      });
      bySub.set(sid, list);
    }
    const submissions: FormSubmission[] = (
      await sql.query(
        `select s.*, f.name as form_name, v.name as vendor_name
         from form_submissions s
         join web_forms f on f.id = s.form_id
         left join directory_vendors v on v.id = s.vendor_id
         order by s.id desc
         limit 80`,
      )
    ).map((s) => ({
      id: Number(s.id),
      formId: Number(s.form_id),
      formName: String(s.form_name),
      payload: parseJson<Record<string, string>>(s.payload, {}),
      source: String(s.source ?? "public"),
      vendorId: s.vendor_id == null ? null : Number(s.vendor_id),
      vendorName: s.vendor_name == null ? null : String(s.vendor_name),
      createdAt: iso(s.created_at) ?? "",
      files: bySub.get(Number(s.id)) ?? [],
    }));
    return { forms, vendors, submissions };
  });

export const createForm = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { name: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    let slug = slugify(data.name);
    const clash = (await sql`select id from web_forms where slug = ${slug}`)[0];
    if (clash) slug = `${slug}-${Math.random().toString(36).slice(2, 5)}`;
    const fields: FormField[] = [
      { id: "name", label: "Name", type: "text", required: true, step: 0 },
      { id: "email", label: "Email", type: "email", required: true, step: 0 },
      { id: "message", label: "Message", type: "textarea", required: false, step: 0 },
    ];
    const rows = await sql.query(
      `insert into web_forms (name, slug, fields, active, description, thank_you, wizard, steps, allow_embed, creates_lead)
       values ($1,$2,$3::jsonb,true,$4,$5,false,'[]'::jsonb,true,true) returning *`,
      [
        data.name.trim() || "Untitled form",
        slug,
        JSON.stringify(fields),
        "Public intake. Submissions land in the inbox.",
        "Received. The shop will follow up.",
      ],
    );
    return mapForm(rows[0], []);
  });

export const saveForm = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      id: number;
      name: string;
      slug: string;
      description?: string;
      thankYou?: string;
      notifyEmail?: string;
      allowEmbed: boolean;
      wizard: boolean;
      vendorLock: boolean;
      createsLead: boolean;
      active: boolean;
      fields: FormField[];
      steps: FormStep[];
      vendorIds: number[];
    }) => input,
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    let slug = slugify(data.slug || data.name);
    const clash = (await sql`select id from web_forms where slug = ${slug} and id <> ${data.id}`)[0];
    if (clash) slug = `${slug}-${data.id}`;
    await sql.query(
      `update web_forms set
         name = $1, slug = $2, description = $3, thank_you = $4, notify_email = $5,
         allow_embed = $6, wizard = $7, vendor_lock = $8, creates_lead = $9, active = $10,
         fields = $11::jsonb, steps = $12::jsonb, updated_at = now()
       where id = $13`,
      [
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
        data.id,
      ],
    );
    const existing = await sql.query(`select vendor_id, token from form_vendor_assign where form_id = $1`, [data.id]);
    const keep = new Set(data.vendorIds);
    for (const row of existing) {
      if (!keep.has(Number(row.vendor_id))) {
        await sql.query(`delete from form_vendor_assign where form_id = $1 and vendor_id = $2`, [data.id, Number(row.vendor_id)]);
      }
    }
    const have = new Set(existing.map((r) => Number(r.vendor_id)));
    for (const vid of data.vendorIds) {
      if (have.has(vid)) continue;
      await sql.query(`insert into form_vendor_assign (form_id, vendor_id, token) values ($1,$2,$3)`, [
        data.id,
        vid,
        mintVendorToken(),
      ]);
    }
    return { ok: true as const, slug };
  });

export const archiveForm = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; active: boolean }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`update web_forms set active = ${data.active}, updated_at = now() where id = ${data.id}`;
    return { ok: true as const };
  });

export const rotateVendorToken = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { formId: number; vendorId: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const token = mintVendorToken();
    await sql.query(
      `update form_vendor_assign set token = $1 where form_id = $2 and vendor_id = $3`,
      [token, data.formId, data.vendorId],
    );
    return { ok: true as const, token };
  });

export const downloadFormUpload = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const row = (await sql.query(`select * from form_uploads where id = $1`, [data.id]))[0];
    if (!row) return { ok: false as const };
    return {
      ok: true as const,
      filename: String(row.filename),
      mime: row.mime == null ? "application/octet-stream" : String(row.mime),
      contentB64: String(row.data_b64 ?? ""),
    };
  });
