import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { iso } from "@/lib/utils";
import {
  emailAllowed,
  effectiveTenantId,
  hashSha,
  isStaff,
  loadProfile,
  otpCode,
  provisionProfile,
  writeAudit,
} from "./access";

function toB64(text: string) {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

async function me(userId: string) {
  return provisionProfile(userId);
}

function mapFile(r: Record<string, unknown>) {
  return {
    id: Number(r.id),
    tenantId: r.tenant_id == null ? null : Number(r.tenant_id),
    projectId: r.project_id == null ? null : Number(r.project_id),
    projectName: r.project_name ? String(r.project_name) : null,
    dealId: r.deal_id == null ? null : Number(r.deal_id),
    dealTitle: r.deal_title ? String(r.deal_title) : null,
    taskItemId: r.task_item_id == null ? null : Number(r.task_item_id),
    taskTitle: r.task_title ? String(r.task_title) : null,
    folder: String(r.folder),
    name: String(r.name),
    mime: String(r.mime),
    sizeBytes: Number(r.size_bytes),
    sha256: r.sha256 ? String(r.sha256) : null,
    driveId: r.drive_id ? String(r.drive_id) : null,
    shared: Boolean(r.shared),
    createdAt: iso(r.created_at) ?? "",
  };
}

export const checkEmailGate = createServerFn({ method: "POST" })
  .validator((input: { email: string }) => input)
  .handler(async ({ data }) => emailAllowed(data.email));

export const issueOtp = createServerFn({ method: "POST" })
  .validator((input: { email: string; purpose: "register" | "reset" | "sign" | "lookup" }) => input)
  .handler(async ({ data }) => {
    const email = data.email.trim().toLowerCase();
    if (data.purpose === "register") {
      const gate = await emailAllowed(email);
      if (!gate.ok) return { ok: false as const, error: "This email is not in the Pipedrive contact book." };
    }
    const sql = await getSql();
    const code = otpCode();
    await sql.query(
      `insert into email_otps (email, code, purpose, expires_at) values ($1,$2,$3, now() + interval '15 minutes')`,
      [email, code, data.purpose],
    );
    return { ok: true as const, demoCode: code, email };
  });

export const verifyOtp = createServerFn({ method: "POST" })
  .validator((input: { email: string; code: string; purpose: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql.query(
      `select id from email_otps
       where lower(email) = $1 and code = $2 and purpose = $3 and used = false and expires_at > now()
       order by id desc limit 1`,
      [data.email.trim().toLowerCase(), data.code.trim(), data.purpose],
    );
    if (!rows[0]) return { ok: false as const, error: "Invalid or expired code." };
    await sql.query(`update email_otps set used = true where id = $1`, [Number(rows[0].id)]);
    return { ok: true as const };
  });

export const resetPasswordWithOtp = createServerFn({ method: "POST" })
  .validator((input: { email: string; code: string; password: string }) => input)
  .handler(async ({ data }) => {
    const check = await verifyOtp({ data: { email: data.email, code: data.code, purpose: "reset" } });
    if (!check.ok) return check;
    const sql = await getSql();
    const users = await sql.query(`select id from "user" where lower(email) = $1`, [data.email.trim().toLowerCase()]);
    if (!users[0]) return { ok: false as const, error: "No account for that email." };
    try {
      const { auth } = await import("@/lib/auth/server");
      const ctx = await auth.$context;
      const hash = await ctx.password.hash(data.password);
      const accounts = await sql.query(
        `select id from account where "userId" = $1 and "providerId" = 'credential'`,
        [String(users[0].id)],
      );
      if (accounts[0]) {
        await sql.query(`update account set password = $1 where id = $2`, [hash, String(accounts[0].id)]);
      } else {
        await sql.query(
          `insert into account (id, "accountId", "providerId", "userId", password)
           values ($1,$2,'credential',$3,$4)`,
          [`cred_${users[0].id}`, String(users[0].id), String(users[0].id), hash],
        );
      }
    } catch {
      return { ok: false as const, error: "Could not update password." };
    }
    return { ok: true as const };
  });

export const getPortalMe = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const p = await me(context.userId);
    const sql = await getSql();
    const onboard = await sql.query(`select * from onboarding_state where user_id = $1`, [p.userId]);
    const o = onboard[0];
    return {
      ...p,
      onboarding: {
        profile: Boolean(o?.profile_done),
        team: Boolean(o?.team_done),
        project: Boolean(o?.project_done),
        docs: Boolean(o?.docs_done),
        prefs: Boolean(o?.prefs_done),
      },
    };
  });

export const completeOnboardingStep = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { step: "profile" | "team" | "project" | "docs" | "prefs" }) => input)
  .handler(async ({ context, data }) => {
    const col = `${data.step}_done`;
    const sql = await getSql();
    await sql.query(`update onboarding_state set ${col} = true where user_id = $1`, [context.userId]);
    const rows = await sql.query(`select * from onboarding_state where user_id = $1`, [context.userId]);
    const o = rows[0];
    const done = Boolean(o?.profile_done && o?.team_done && o?.project_done && o?.docs_done && o?.prefs_done);
    if (done) await sql.query(`update portal_profiles set onboarded = true where user_id = $1`, [context.userId]);
    return { ok: true, onboarded: done };
  });

export const updatePortalProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      name?: string;
      theme?: string;
      compact?: boolean;
      highContrast?: boolean;
      screenReader?: boolean;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const p = await me(context.userId);
    await sql.query(
      `update portal_profiles set
        name = coalesce($2, name),
        theme = coalesce($3, theme),
        compact = coalesce($4, compact),
        high_contrast = coalesce($5, high_contrast),
        screen_reader = coalesce($6, screen_reader)
       where user_id = $1`,
      [context.userId, data.name ?? null, data.theme ?? null, data.compact ?? null, data.highContrast ?? null, data.screenReader ?? null],
    );
    await writeAudit(p, "profile.update", p.email);
    return { ok: true };
  });

export const switchTenant = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { tenantId: number | null; password?: string }) => input)
  .handler(async ({ context, data }) => {
    const p = await me(context.userId);
    if (!isStaff(p)) return { ok: false as const, error: "Staff only." };
    if (data.tenantId != null && data.password && data.password !== "northline") {
      return { ok: false as const, error: "Re-enter your password to switch accounts." };
    }
    const sql = await getSql();
    if (data.tenantId == null) {
      await sql.query(`delete from impersonation where user_id = $1`, [p.userId]);
    } else {
      await sql.query(
        `insert into impersonation (user_id, tenant_id) values ($1,$2)
         on conflict (user_id) do update set tenant_id = excluded.tenant_id, started_at = now()`,
        [p.userId, data.tenantId],
      );
    }
    await writeAudit(p, "impersonate", data.tenantId == null ? "clear" : `tenant:${data.tenantId}`);
    return { ok: true as const };
  });

export const listTenants = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const p = await me(context.userId);
    if (!isStaff(p)) return [];
    const sql = await getSql();
    const rows = await sql`select t.*, o.industry from tenants t left join organizations o on o.id = t.org_id order by t.name`;
    return rows.map((r) => ({
      id: Number(r.id),
      name: String(r.name),
      slug: String(r.slug),
      quotaGb: Number(r.quota_gb),
      usedMb: Number(r.used_mb),
      industry: r.industry ? String(r.industry) : null,
    }));
  });

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const p = await me(context.userId);
    const sql = await getSql();
    const tid = effectiveTenantId(p);
    const projects = tid
      ? await sql.query(`select count(*)::int as n from projects where tenant_id = $1`, [tid])
      : await sql.query(`select count(*)::int as n from projects`);
    const files = tid
      ? await sql.query(`select count(*)::int as n, coalesce(sum(size_bytes),0)::bigint as bytes from portal_files where tenant_id = $1`, [tid])
      : await sql.query(`select count(*)::int as n, coalesce(sum(size_bytes),0)::bigint as bytes from portal_files`);
    const tasks = tid
      ? await sql.query(
          `select count(*)::int as n, count(*) filter (where i.done)::int as done
           from task_items i join task_lists l on l.id = i.list_id where l.tenant_id = $1`,
          [tid],
        )
      : await sql.query(`select count(*)::int as n, count(*) filter (where done)::int as done from task_items`);
    const approvals = tid
      ? await sql.query(`select count(*)::int as n from approvals where tenant_id = $1 and status = 'pending'`, [tid])
      : await sql.query(`select count(*)::int as n from approvals where status = 'pending'`);
    const sigs = tid
      ? await sql.query(`select count(*)::int as n from esign_envelopes where tenant_id = $1 and status in ('sent','viewed')`, [tid])
      : await sql.query(`select count(*)::int as n from esign_envelopes where status in ('sent','viewed')`);
    const recent = tid
      ? await sql.query(`select name, folder, created_at from portal_files where tenant_id = $1 order by created_at desc limit 6`, [tid])
      : await sql.query(`select name, folder, created_at from portal_files order by created_at desc limit 6`);
    const quota = tid
      ? await sql.query(`select quota_gb, used_mb, name from tenants where id = $1`, [tid])
      : await sql.query(`select 500::numeric as quota_gb, coalesce(sum(used_mb),0) as used_mb, 'House' as name from tenants`);
    return {
      profile: p,
      projects: Number(projects[0]?.n ?? 0),
      files: Number(files[0]?.n ?? 0),
      fileBytes: Number(files[0]?.bytes ?? 0),
      tasks: Number(tasks[0]?.n ?? 0),
      tasksDone: Number(tasks[0]?.done ?? 0),
      approvals: Number(approvals[0]?.n ?? 0),
      signatures: Number(sigs[0]?.n ?? 0),
      recent: recent.map((r) => ({ name: String(r.name), folder: String(r.folder), at: iso(r.created_at) })),
      quotaGb: Number(quota[0]?.quota_gb ?? 50),
      usedMb: Number(quota[0]?.used_mb ?? 0),
      workspace: String(quota[0]?.name ?? "Northline"),
    };
  });

export const listPortalProjects = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const p = await me(context.userId);
    const sql = await getSql();
    const tid = effectiveTenantId(p);
    const rows = tid
      ? await sql.query(
          `select p.*, t.name as tenant_name,
                  (select count(*) from project_tasks x where x.project_id = p.id) as task_count,
                  (select count(*) from project_tasks x where x.project_id = p.id and x.column_name = 'Done') as done_count
           from projects p left join tenants t on t.id = p.tenant_id
           where p.tenant_id = $1
           order by p.start_date desc nulls last`,
          [tid],
        )
      : await sql.query(
          `select p.*, t.name as tenant_name,
                  (select count(*) from project_tasks x where x.project_id = p.id) as task_count,
                  (select count(*) from project_tasks x where x.project_id = p.id and x.column_name = 'Done') as done_count
           from projects p left join tenants t on t.id = p.tenant_id
           where p.stage_label in ('Estimate & Agreement Sent','On Hold','Signed/Invoiced') or p.tenant_id is not null
           order by p.start_date desc nulls last`,
        );
    return rows.map((r) => ({
      id: Number(r.id),
      name: String(r.name),
      status: String(r.status),
      stageLabel: r.stage_label ? String(r.stage_label) : "Signed/Invoiced",
      value: Number(r.value ?? 0),
      venue: r.venue ? String(r.venue) : null,
      tenantName: r.tenant_name ? String(r.tenant_name) : null,
      startDate: iso(r.start_date),
      endDate: iso(r.end_date),
      taskCount: Number(r.task_count),
      doneCount: Number(r.done_count),
    }));
  });

export const getPortalProject = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ context, data }) => {
    const p = await me(context.userId);
    const sql = await getSql();
    const tid = effectiveTenantId(p);
    const rows = await sql.query(`select p.*, t.name as tenant_name from projects p left join tenants t on t.id = p.tenant_id where p.id = $1`, [data.id]);
    const r = rows[0];
    if (!r) return null;
    if (tid && Number(r.tenant_id) !== tid && !isStaff(p)) return null;
    const files = await sql.query(`select * from portal_files where project_id = $1 order by folder, name`, [data.id]);
    const notes = await sql.query(`select * from project_notes where project_id = $1 order by created_at desc`, [data.id]);
    const reqs = await sql.query(`select * from project_requests where project_id = $1 order by created_at desc`, [data.id]);
    const lists = await sql.query(`select * from task_lists where project_id = $1`, [data.id]);
    const items = lists.length
      ? await sql.query(`select * from task_items where list_id = any($1::int[]) order by id`, [lists.map((l) => Number(l.id))])
      : [];
    await writeAudit(p, "project.view", String(r.name));
    return {
      project: {
        id: Number(r.id),
        name: String(r.name),
        status: String(r.status),
        stageLabel: r.stage_label ? String(r.stage_label) : "Signed/Invoiced",
        value: Number(r.value ?? 0),
        venue: r.venue ? String(r.venue) : null,
        tenantName: r.tenant_name ? String(r.tenant_name) : null,
        tenantId: r.tenant_id == null ? null : Number(r.tenant_id),
        startDate: iso(r.start_date),
        endDate: iso(r.end_date),
      },
      files: files.map(mapFile),
      notes: notes.map((n) => ({
        id: Number(n.id),
        body: String(n.body),
        visible: Boolean(n.visible),
        author: n.author ? String(n.author) : null,
        at: iso(n.created_at),
      })),
      requests: reqs.map((n) => ({
        id: Number(n.id),
        title: String(n.title),
        body: n.body ? String(n.body) : "",
        status: String(n.status),
        at: iso(n.created_at),
      })),
      lists: lists.map((l) => ({
        id: Number(l.id),
        name: String(l.name),
        items: items
          .filter((i) => Number(i.list_id) === Number(l.id))
          .map((i) => ({ id: Number(i.id), title: String(i.title), done: Boolean(i.done) })),
      })),
    };
  });

export const addProjectRequest = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { projectId: number; title: string; body?: string }) => input)
  .handler(async ({ context, data }) => {
    const p = await me(context.userId);
    const sql = await getSql();
    const tid = effectiveTenantId(p);
    await sql.query(
      `insert into project_requests (project_id, tenant_id, title, body, created_by) values ($1,$2,$3,$4,$5)`,
      [data.projectId, tid, data.title, data.body ?? "", p.name],
    );
    return { ok: true };
  });

export const toggleProjectNote = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; visible: boolean }) => input)
  .handler(async ({ context, data }) => {
    const p = await me(context.userId);
    if (!isStaff(p)) return { ok: false };
    const sql = await getSql();
    await sql.query(`update project_notes set visible = $2 where id = $1`, [data.id, data.visible]);
    return { ok: true };
  });

export const listPortalFiles = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { q?: string; folder?: string; projectId?: number; dealId?: number } = {}) => input)
  .handler(async ({ context, data }) => {
    const p = await me(context.userId);
    const sql = await getSql();
    const tid = effectiveTenantId(p);
    let rows: Record<string, unknown>[] = [];
    try {
      rows = await sql.query(
        `select f.*, pr.name as project_name, d.title as deal_title, ti.title as task_title
         from portal_files f
         left join projects pr on pr.id = f.project_id
         left join deals d on d.id = f.deal_id
         left join task_items ti on ti.id = f.task_item_id
         where ($1::int is null or f.tenant_id = $1)
           and ($2::text is null or f.folder = $2)
           and ($3::int is null or f.project_id = $3)
           and ($4::int is null or f.deal_id = $4)
           and (
             $5::text is null
             or f.name ilike '%' || $5 || '%'
             or coalesce(d.title, '') ilike '%' || $5 || '%'
             or coalesce(pr.name, '') ilike '%' || $5 || '%'
             or coalesce(ti.title, '') ilike '%' || $5 || '%'
           )
         order by f.created_at desc`,
        [tid, data.folder ?? null, data.projectId ?? null, data.dealId ?? null, data.q ?? null],
      );
    } catch {
      rows = await sql.query(
        `select f.*, pr.name as project_name
         from portal_files f left join projects pr on pr.id = f.project_id
         where ($1::int is null or f.tenant_id = $1)
           and ($2::text is null or f.folder = $2)
           and ($3::int is null or f.project_id = $3)
           and ($4::text is null or f.name ilike '%' || $4 || '%')
         order by f.created_at desc`,
        [tid, data.folder ?? null, data.projectId ?? null, data.q ?? null],
      );
    }
    const mapped = rows.map(mapFile);
    const seen = new Set(mapped.filter((m) => m.dealId).map((m) => `${m.dealId}::${m.name}`));
    const crm = await sql.query(
      `select f.id, f.entity_id, f.name, f.kind, f.size_kb, f.created_at, d.title as deal_title
       from files f
       join deals d on d.id = f.entity_id
       where f.entity_type = 'deal'`,
    );
    for (const f of crm) {
      const dealId = Number(f.entity_id);
      const name = String(f.name);
      if (seen.has(`${dealId}::${name}`)) continue;
      if (data.dealId && data.dealId !== dealId) continue;
      if (data.folder && data.folder !== "deals" && data.folder !== "all") continue;
      if (data.q && !`${name} ${f.deal_title}`.toLowerCase().includes(data.q.toLowerCase())) continue;
      mapped.push({
        id: -Number(f.id),
        tenantId: null,
        projectId: null,
        projectName: null,
        dealId,
        dealTitle: String(f.deal_title),
        taskItemId: null,
        taskTitle: null,
        folder: "deals",
        name,
        mime: "application/octet-stream",
        sizeBytes: Math.max(1, Number(f.size_kb)) * 1024,
        sha256: null,
        driveId: null,
        shared: true,
        createdAt: iso(f.created_at) ?? "",
      });
    }
    mapped.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return mapped;
  });

export const uploadPortalFile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      name: string;
      sizeBytes: number;
      mime?: string;
      folder?: string;
      projectId?: number;
      dealId?: number;
      taskItemId?: number;
      contentB64?: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const p = await me(context.userId);
    const sql = await getSql();
    const tid = effectiveTenantId(p);
    if (!tid && !isStaff(p)) return { ok: false as const, error: "No tenant." };
    const quota = tid
      ? await sql.query(`select quota_gb, used_mb from tenants where id = $1`, [tid])
      : [{ quota_gb: 500, used_mb: 0 }];
    const used = Number(quota[0]?.used_mb ?? 0) + data.sizeBytes / 1_000_000;
    if (used > Number(quota[0]?.quota_gb ?? 50) * 1000) {
      return { ok: false as const, error: "Storage quota exceeded." };
    }
    const sha = hashSha(`${data.name}:${data.sizeBytes}:${Date.now()}`);
    const ins = await sql.query(
      `insert into portal_files (tenant_id, project_id, deal_id, task_item_id, folder, name, mime, size_bytes, sha256, drive_id, uploaded_by)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) returning id`,
      [
        tid,
        data.projectId ?? null,
        data.dealId ?? null,
        data.taskItemId ?? null,
        data.folder ?? (data.dealId ? "deals" : data.taskItemId ? "tasks" : "files"),
        data.name,
        data.mime ?? "application/octet-stream",
        data.sizeBytes,
        sha,
        `drv-${sha.slice(0, 8)}`,
        p.email,
      ],
    );
    if (data.dealId) {
      await sql.query(
        `insert into files (entity_type, entity_id, name, kind, size_kb, uploaded_by)
         values ('deal', $1, $2, 'file', $3, (select id from members where email = $4 limit 1))`,
        [data.dealId, data.name, Math.max(1, Math.round(data.sizeBytes / 1024)), p.email],
      );
    }
    if (tid) await sql.query(`update tenants set used_mb = used_mb + $2 where id = $1`, [tid, data.sizeBytes / 1_000_000]);
    await writeAudit(p, "file.upload", data.name);
    return { ok: true as const, id: Number(ins[0].id), sha };
  });

export const downloadPortalFile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ context, data }) => {
    const p = await me(context.userId);
    const sql = await getSql();
    const rows = await sql.query(`select * from portal_files where id = $1`, [data.id]);
    let f = rows[0];
    if (!f && data.id < 0) {
      const crm = await sql.query(`select * from files where id = $1`, [-data.id]);
      const c = crm[0];
      if (c) {
        await writeAudit(p, "file.download", String(c.name));
        const body = `NORTHLINE FILE PROXY\n${c.name}\nDeal ${c.entity_id}\nDisposition: attachment\n`;
        return { ok: true as const, filename: String(c.name), mime: "application/octet-stream", contentB64: toB64(body) };
      }
    }
    if (!f) return { ok: false as const, error: "Not found" };
    const tid = effectiveTenantId(p);
    if (tid && Number(f.tenant_id) !== tid && !isStaff(p)) return { ok: false as const, error: "Forbidden" };
    await writeAudit(p, "file.download", String(f.name));
    const body = `NORTHLINE FILE PROXY\n${f.name}\nsha256 ${f.sha256}\nGoogle Drive id ${f.drive_id}\nDisposition: attachment\n`;
    return { ok: true as const, filename: String(f.name), mime: "application/octet-stream", contentB64: toB64(body) };
  });

export const zipPortalFiles = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { ids: number[] }) => input)
  .handler(async ({ context, data }) => {
    const p = await me(context.userId);
    const sql = await getSql();
    const rows = await sql.query(`select name from portal_files where id = any($1::int[])`, [data.ids]);
    await writeAudit(p, "file.zip", data.ids.join(","));
    const listing = rows.map((r) => String(r.name)).join("\n");
    return { ok: true as const, filename: "northline-files.zip", contentB64: toB64(`ZIP (proxied)\n${listing}`) };
  });

export const sharePortalFile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; shared: boolean }) => input)
  .handler(async ({ context, data }) => {
    const p = await me(context.userId);
    if (!isStaff(p)) return { ok: false };
    const sql = await getSql();
    await sql.query(`update portal_files set shared = $2 where id = $1`, [data.id, data.shared]);
    await writeAudit(p, "file.share", String(data.id));
    return { ok: true };
  });

export const listApprovals = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const p = await me(context.userId);
    const sql = await getSql();
    const tid = effectiveTenantId(p);
    const rows = tid
      ? await sql.query(
          `select a.*, pr.name as project_name from approvals a left join projects pr on pr.id = a.project_id where a.tenant_id = $1 order by a.created_at desc`,
          [tid],
        )
      : await sql.query(`select a.*, pr.name as project_name from approvals a left join projects pr on pr.id = a.project_id order by a.created_at desc`);
    return rows.map((r) => ({
      id: Number(r.id),
      title: String(r.title),
      body: r.body ? String(r.body) : "",
      status: String(r.status),
      projectName: r.project_name ? String(r.project_name) : null,
      requestedBy: r.requested_by ? String(r.requested_by) : null,
      at: iso(r.created_at),
    }));
  });

export const decideApproval = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; status: "approved" | "rejected"; note?: string }) => input)
  .handler(async ({ context, data }) => {
    const p = await me(context.userId);
    const sql = await getSql();
    await sql.query(
      `update approvals set status = $2, decided_by = $3, decision_note = $4, decided_at = now() where id = $1`,
      [data.id, data.status, p.name, data.note ?? null],
    );
    await writeAudit(p, "approval." + data.status, String(data.id));
    return { ok: true };
  });

export const createApproval = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { title: string; body?: string; projectId?: number }) => input)
  .handler(async ({ context, data }) => {
    const p = await me(context.userId);
    const sql = await getSql();
    await sql.query(`insert into approvals (tenant_id, project_id, title, body, requested_by) values ($1,$2,$3,$4,$5)`, [
      effectiveTenantId(p),
      data.projectId ?? null,
      data.title,
      data.body ?? "",
      p.name,
    ]);
    return { ok: true };
  });

export const listTaskLists = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const p = await me(context.userId);
    const sql = await getSql();
    const tid = effectiveTenantId(p);
    let lists: Record<string, unknown>[] = [];
    try {
      lists = tid
        ? await sql.query(`select * from task_lists where tenant_id = $1 order by archived_at nulls first, id`, [tid])
        : await sql.query(`select * from task_lists order by archived_at nulls first, id`);
    } catch {
      lists = tid
        ? await sql.query(`select * from task_lists where tenant_id = $1 order by id`, [tid])
        : await sql.query(`select * from task_lists order by id`);
    }
    const items = await sql.query(`select * from task_items order by id`);
    let files: Record<string, unknown>[] = [];
    try {
      files = await sql.query(
        `select id, task_item_id, name, size_bytes, mime from portal_files where task_item_id is not null order by id`,
      );
    } catch {
      files = [];
    }
    return lists.map((l) => ({
      id: Number(l.id),
      name: String(l.name),
      projectId: l.project_id == null ? null : Number(l.project_id),
      archivedAt: l.archived_at ? iso(l.archived_at) : null,
      items: items
        .filter((i) => Number(i.list_id) === Number(l.id))
        .map((i) => ({
          id: Number(i.id),
          title: String(i.title),
          done: Boolean(i.done),
          files: files
            .filter((f) => Number(f.task_item_id) === Number(i.id))
            .map((f) => ({
              id: Number(f.id),
              name: String(f.name),
              sizeBytes: Number(f.size_bytes),
              mime: String(f.mime ?? "application/octet-stream"),
            })),
        })),
    }));
  });

export const mutateTask = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      op: "addList" | "archiveList" | "restoreList" | "delList" | "addItem" | "toggle" | "delItem";
      id?: number;
      name?: string;
      title?: string;
      listId?: number;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const p = await me(context.userId);
    const sql = await getSql();
    const tid = effectiveTenantId(p);
    if (data.op === "addList") {
      await sql.query(`insert into task_lists (tenant_id, name) values ($1,$2)`, [tid, data.name ?? "Checklist"]);
    } else if (data.op === "archiveList" && data.id) {
      await sql.query(`update task_lists set archived_at = now() where id = $1`, [data.id]);
    } else if (data.op === "restoreList" && data.id) {
      await sql.query(`update task_lists set archived_at = null where id = $1`, [data.id]);
    } else if (data.op === "delList" && data.id) {
      await sql.query(`delete from task_lists where id = $1`, [data.id]);
    } else if (data.op === "addItem" && data.listId) {
      await sql.query(`insert into task_items (list_id, title) values ($1,$2)`, [data.listId, data.title ?? "Task"]);
    } else if (data.op === "toggle" && data.id) {
      await sql.query(`update task_items set done = not done where id = $1`, [data.id]);
    } else if (data.op === "delItem" && data.id) {
      await sql.query(`delete from task_items where id = $1`, [data.id]);
    }
    return { ok: true };
  });

export const attachTaskFiles = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      itemId: number;
      files: { name: string; sizeBytes: number; mime?: string; contentB64?: string }[];
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const p = await me(context.userId);
    const files = (data.files ?? []).slice(0, 12);
    if (!files.length) return { ok: false as const, error: "No files" };
    const sql = await getSql();
    const item = await sql.query(
      `select i.id, l.tenant_id, l.project_id from task_items i join task_lists l on l.id = i.list_id where i.id = $1`,
      [data.itemId],
    );
    const row = item[0];
    if (!row) return { ok: false as const, error: "Task not found" };
    const tid = row.tenant_id == null ? effectiveTenantId(p) : Number(row.tenant_id);
    const projectId = row.project_id == null ? null : Number(row.project_id);
    for (const file of files) {
      const sha = hashSha(`task-${data.itemId}:${file.name}:${file.sizeBytes}:${Date.now()}`);
      await sql.query(
        `insert into portal_files (tenant_id, project_id, task_item_id, folder, name, mime, size_bytes, sha256, drive_id, uploaded_by)
         values ($1,$2,$3,'tasks',$4,$5,$6,$7,$8,$9)`,
        [
          tid,
          projectId,
          data.itemId,
          file.name,
          file.mime ?? "application/octet-stream",
          file.sizeBytes,
          sha,
          `drv-${sha.slice(0, 8)}`,
          p.email,
        ],
      );
    }
    await writeAudit(p, "file.upload", `${files.length} on task ${data.itemId}`);
    return { ok: true as const, attached: files.length };
  });

export const listBookmarks = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql.query(`select * from bookmarks where user_id = $1 order by sort_order, id`, [context.userId]);
    const seed = await sql.query(`select * from bookmarks where user_id = 'staff-seed' order by sort_order`);
    const list = rows.length ? rows : seed;
    return list.map((r) => ({ id: Number(r.id), label: String(r.label), href: String(r.href) }));
  });

export const mutateBookmark = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { op: "add" | "del" | "reorder"; id?: number; label?: string; href?: string; ids?: number[] }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    if (data.op === "add") {
      await sql.query(`insert into bookmarks (user_id, label, href) values ($1,$2,$3)`, [
        context.userId,
        data.label ?? "Bookmark",
        data.href ?? "/",
      ]);
    } else if (data.op === "del" && data.id) {
      await sql.query(`delete from bookmarks where id = $1 and user_id = $2`, [data.id, context.userId]);
    } else if (data.op === "reorder" && data.ids) {
      for (let i = 0; i < data.ids.length; i++) {
        await sql.query(`update bookmarks set sort_order = $2 where id = $1 and user_id = $3`, [data.ids[i], i, context.userId]);
      }
    }
    return { ok: true };
  });

export const listAudit = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const p = await me(context.userId);
    if (!isStaff(p)) return [];
    const sql = await getSql();
    const rows = await sql`select * from audit_events order by created_at desc limit 80`;
    return rows.map((r) => ({
      id: Number(r.id),
      email: r.email ? String(r.email) : "",
      action: String(r.action),
      entity: r.entity ? String(r.entity) : "",
      ip: r.ip ? String(r.ip) : "",
      at: iso(r.created_at),
    }));
  });

export const setTenantQuota = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { tenantId: number; quotaGb: number }) => input)
  .handler(async ({ context, data }) => {
    const p = await me(context.userId);
    if (!isStaff(p)) return { ok: false };
    const sql = await getSql();
    await sql.query(`update tenants set quota_gb = $2 where id = $1`, [data.tenantId, data.quotaGb]);
    return { ok: true };
  });

export const inviteSubuser = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { email: string; name: string; permissions?: Record<string, boolean> }) => input)
  .handler(async ({ context, data }) => {
    const p = await me(context.userId);
    if (p.role === "subuser") return { ok: false as const, error: "Only the primary client can invite." };
    const sql = await getSql();
    const fakeId = `sub-${hashSha(data.email).slice(0, 12)}`;
    await sql.query(
      `insert into portal_profiles (user_id, email, name, role, tenant_id, parent_user_id, verified, permissions)
       values ($1,$2,$3,'subuser',$4,$5,true,$6::jsonb)
       on conflict (email) do update set permissions = excluded.permissions`,
      [fakeId, data.email.toLowerCase(), data.name, p.tenantId, p.userId, JSON.stringify(data.permissions ?? {})],
    );
    return { ok: true as const };
  });

export const listSubusers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const p = await me(context.userId);
    const sql = await getSql();
    const rows = await sql.query(
      `select user_id, email, name, permissions from portal_profiles where parent_user_id = $1 or (tenant_id = $2 and role = 'subuser')`,
      [p.userId, p.tenantId],
    );
    return rows.map((r) => ({
      userId: String(r.user_id),
      email: String(r.email),
      name: String(r.name),
      permissions: String(typeof r.permissions === "string" ? r.permissions : JSON.stringify(r.permissions ?? {})),
    }));
  });

export const listEnvelopes = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const p = await me(context.userId);
    const sql = await getSql();
    const tid = effectiveTenantId(p);
    const rows = tid
      ? await sql.query(
          `select e.*, d.name as doc_name from esign_envelopes e left join documents d on d.id = e.document_id where e.tenant_id = $1 order by e.id desc`,
          [tid],
        )
      : await sql.query(`select e.*, d.name as doc_name from esign_envelopes e left join documents d on d.id = e.document_id order by e.id desc`);
    return rows.map((r) => ({
      id: Number(r.id),
      documentId: r.document_id == null ? null : Number(r.document_id),
      name: String(r.doc_name ?? `Envelope ${r.id}`),
      status: String(r.status),
      mode: String(r.mode),
      authMethod: String(r.auth_method),
      tags: r.tags ? String(r.tags) : "",
      originalSha: r.original_sha ? String(r.original_sha) : "",
      signedSha: r.signed_sha ? String(r.signed_sha) : "",
      createdAt: iso(r.created_at),
    }));
  });

export const createEnvelope = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      documentId?: number;
      dealId?: number;
      mode: "sequential" | "parallel";
      authMethod: string;
      accessCode?: string;
      tags?: string;
      recipients: { name: string; email: string; role: string }[];
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const p = await me(context.userId);
    const sql = await getSql();
    const sha = hashSha(`env:${Date.now()}`);
    const ins = await sql.query(
      `insert into esign_envelopes (document_id, tenant_id, deal_id, mode, status, auth_method, access_code, original_sha, tags)
       values ($1,$2,$3,$4,'sent',$5,$6,$7,$8) returning id`,
      [data.documentId ?? null, effectiveTenantId(p), data.dealId ?? null, data.mode, data.authMethod, data.accessCode ?? null, sha, data.tags ?? null],
    );
    const id = Number(ins[0].id);
    let order = 1;
    for (const rec of data.recipients) {
      await sql.query(`insert into esign_recipients (envelope_id, name, email, role, routing_order) values ($1,$2,$3,$4,$5)`, [
        id,
        rec.name,
        rec.email,
        rec.role,
        order++,
      ]);
    }
    await writeAudit(p, "esign.send", String(id));
    return { ok: true, id };
  });

export const getEnvelope = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ context, data }) => {
    await me(context.userId);
    const sql = await getSql();
    const env = await sql.query(
      `select e.*, d.name as doc_name, d.content from esign_envelopes e left join documents d on d.id = e.document_id where e.id = $1`,
      [data.id],
    );
    if (!env[0]) return null;
    const recips = await sql.query(`select * from esign_recipients where envelope_id = $1 order by routing_order`, [data.id]);
    const fields = await sql.query(`select * from esign_fields where envelope_id = $1`, [data.id]);
    return {
      id: Number(env[0].id),
      name: String(env[0].doc_name ?? "Document"),
      content: env[0].content ? String(env[0].content) : "Production agreement.",
      status: String(env[0].status),
      mode: String(env[0].mode),
      authMethod: String(env[0].auth_method),
      accessCode: env[0].access_code ? String(env[0].access_code) : null,
      watermark: env[0].watermark_text ? String(env[0].watermark_text) : "CONFIDENTIAL",
      originalSha: String(env[0].original_sha ?? ""),
      signedSha: env[0].signed_sha ? String(env[0].signed_sha) : null,
      documentId: env[0].document_id == null ? null : Number(env[0].document_id),
      recipients: recips.map((r) => ({
        id: Number(r.id),
        name: String(r.name),
        email: String(r.email),
        role: String(r.role),
        status: String(r.status),
        routingOrder: Number(r.routing_order),
      })),
      fields: fields.map((f) => ({
        id: Number(f.id),
        kind: String(f.kind),
        page: Number(f.page),
        x: Number(f.x_pct),
        y: Number(f.y_pct),
        recipientId: f.recipient_id == null ? null : Number(f.recipient_id),
      })),
    };
  });

export const signEnvelope = createServerFn({ method: "POST" })
  .validator((input: { id: number; recipientId: number; signature: string; accessCode?: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const env = await sql.query(`select * from esign_envelopes where id = $1`, [data.id]);
    if (!env[0]) return { ok: false as const, error: "Not found" };
    if (env[0].auth_method === "access_code" && env[0].access_code && env[0].access_code !== data.accessCode) {
      return { ok: false as const, error: "Access code rejected." };
    }
    await sql.query(`update esign_recipients set status = 'signed', signed_at = now(), signature_data = $2 where id = $1`, [
      data.recipientId,
      data.signature,
    ]);
    const pending = await sql.query(`select count(*)::int as n from esign_recipients where envelope_id = $1 and status <> 'signed'`, [data.id]);
    if (Number(pending[0]?.n ?? 0) === 0) {
      const sha = hashSha(`signed:${data.id}:${data.signature}`);
      await sql.query(`update esign_envelopes set status = 'completed', signed_sha = $2 where id = $1`, [data.id, sha]);
    } else {
      await sql.query(`update esign_envelopes set status = 'partial' where id = $1`, [data.id]);
    }
    return { ok: true as const };
  });

export const lookupDocument = createServerFn({ method: "POST" })
  .validator((input: { lookupId?: string; password?: string; email?: string; otp?: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    if (data.email && data.otp) {
      const v = await verifyOtp({ data: { email: data.email, code: data.otp, purpose: "lookup" } });
      if (!v.ok) return { ok: false as const, error: v.error };
    }
    const rows = await sql.query(`select id, name, status, lookup_id from documents where lookup_id = $1 and lookup_password = $2`, [
      data.lookupId ?? "",
      data.password ?? "",
    ]);
    if (!rows[0]) return { ok: false as const, error: "No document matches that ID and password." };
    return { ok: true as const, id: Number(rows[0].id), name: String(rows[0].name), status: String(rows[0].status) };
  });

export const listProposals = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const rows = await sql`select p.*, d.title as deal_title from proposals p left join deals d on d.id = p.deal_id order by p.id desc`;
    return rows.map((r) => ({
      id: Number(r.id),
      title: String(r.title),
      body: r.body ? String(r.body) : "",
      status: String(r.status),
      token: String(r.token),
      dealTitle: r.deal_title ? String(r.deal_title) : null,
    }));
  });

export const createProposal = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { dealId?: number; title: string; body: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const token = `pr-${hashSha(data.title + Date.now()).slice(0, 10)}`;
    await sql.query(`insert into proposals (deal_id, title, body, token) values ($1,$2,$3,$4)`, [
      data.dealId ?? null,
      data.title,
      data.body,
      token,
    ]);
    await writeAudit(await me(context.userId), "proposal.create", data.title);
    return { ok: true, token };
  });

export const getProposalPublic = createServerFn({ method: "GET" })
  .validator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql.query(`select * from proposals where token = $1`, [data.token]);
    if (!rows[0]) return null;
    await sql.query(
      `update proposals set viewed_at = now(), status = case when status = 'sent' then 'viewed' else status end where token = $1`,
      [data.token],
    );
    return { title: String(rows[0].title), body: String(rows[0].body ?? ""), status: String(rows[0].status) };
  });

export const convertDealToProject = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { dealId: number }) => input)
  .handler(async ({ context, data }) => {
    const p = await me(context.userId);
    if (!isStaff(p)) return { ok: false as const, error: "Staff only." };
    const sql = await getSql();
    const d = await sql.query(`select * from deals where id = $1`, [data.dealId]);
    if (!d[0]) return { ok: false as const, error: "Deal not found" };
    const tenant = d[0].org_id ? await sql.query(`select id from tenants where org_id = $1`, [Number(d[0].org_id)]) : [];
    const ins = await sql.query(
      `insert into projects (name, deal_id, status, owner_id, tenant_id, stage_label, value, venue, start_date, end_date)
       values ($1,$2,'open',$3,$4,'Signed/Invoiced',$5,$6, current_date, current_date + 14) returning id`,
      [
        String(d[0].title),
        data.dealId,
        Number(d[0].owner_id ?? 1),
        tenant[0] ? Number(tenant[0].id) : null,
        Number(d[0].value),
        d[0].venue ? String(d[0].venue) : null,
      ],
    );
    return { ok: true as const, id: Number(ins[0].id) };
  });

export const getBranding = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql`select * from branding where id = 1`;
  const r = rows[0] ?? {};
  return {
    logoText: String(r.logo_text ?? "Northline"),
    primaryColor: String(r.primary_color ?? "2A3038"),
    senderName: String(r.sender_name ?? "Northline Documents"),
    reminderTemplate: String(r.reminder_template ?? ""),
    watermarkText: String(r.watermark_text ?? "CONFIDENTIAL"),
    watermarkOpacity: Number(r.watermark_opacity ?? 0.12),
    pipedriveToken: r.pipedrive_token ? "••••••••" : "",
    pipedriveSyncedAt: iso(r.pipedrive_synced_at),
    driveConnected: Boolean(r.drive_connected ?? true),
    zohoOrg: r.zoho_org ? String(r.zoho_org) : "",
  };
});

export const saveBranding = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      logoText?: string;
      primaryColor?: string;
      senderName?: string;
      reminderTemplate?: string;
      watermarkText?: string;
      pipedriveToken?: string;
      zohoOrg?: string;
    }) => input,
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql.query(
      `update branding set
        logo_text = coalesce($1, logo_text),
        primary_color = coalesce($2, primary_color),
        sender_name = coalesce($3, sender_name),
        reminder_template = coalesce($4, reminder_template),
        watermark_text = coalesce($5, watermark_text),
        pipedrive_token = coalesce($6, pipedrive_token),
        zoho_org = coalesce($7, zoho_org)
       where id = 1`,
      [
        data.logoText ?? null,
        data.primaryColor ?? null,
        data.senderName ?? null,
        data.reminderTemplate ?? null,
        data.watermarkText ?? null,
        data.pipedriveToken ?? null,
        data.zohoOrg ?? null,
      ],
    );
    return { ok: true };
  });

export const syncPipedrive = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await sql.query(`update branding set pipedrive_synced_at = now() where id = 1`);
    await writeAudit(await me(context.userId), "pipedrive.sync", "all");
    const people = await sql`select count(*)::int as n from people`;
    const deals = await sql`select count(*)::int as n from deals`;
    return { ok: true, people: Number(people[0].n), deals: Number(deals[0].n), at: new Date().toISOString() };
  });

export const submitEventRequest = createServerFn({ method: "POST" })
  .validator((input: { name: string; email: string; eventDate?: string; venue?: string; guests?: number; notes?: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql.query(`insert into event_requests (name, email, event_date, venue, guests, notes) values ($1,$2,$3,$4,$5,$6)`, [
      data.name,
      data.email,
      data.eventDate ?? null,
      data.venue ?? null,
      data.guests ?? null,
      data.notes ?? null,
    ]);
    return { ok: true };
  });

export const submitContact = createServerFn({ method: "POST" })
  .validator((input: { name: string; email: string; message: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql.query(`insert into contact_entries (name, email, message) values ($1,$2,$3)`, [data.name, data.email, data.message]);
    return { ok: true };
  });

export const listEventRequests = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const p = await me(context.userId);
    if (!isStaff(p)) return [];
    const sql = await getSql();
    const rows = await sql`select * from event_requests order by created_at desc`;
    return rows.map((r) => ({
      id: Number(r.id),
      name: String(r.name),
      email: String(r.email),
      eventDate: iso(r.event_date),
      venue: r.venue ? String(r.venue) : "",
      guests: r.guests == null ? null : Number(r.guests),
      notes: r.notes ? String(r.notes) : "",
      status: String(r.status),
    }));
  });

export const setNotifPref = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { tenantId?: number; kind: string; enabled: boolean }) => input)
  .handler(async ({ context, data }) => {
    const p = await me(context.userId);
    const tid = data.tenantId ?? p.tenantId;
    if (!tid) return { ok: false };
    const sql = await getSql();
    await sql.query(
      `insert into notification_prefs (tenant_id, kind, enabled) values ($1,$2,$3)
       on conflict (tenant_id, kind) do update set enabled = excluded.enabled`,
      [tid, data.kind, data.enabled],
    );
    return { ok: true };
  });

export const listNotifPrefs = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const p = await me(context.userId);
    const sql = await getSql();
    const tid = effectiveTenantId(p);
    const rows = tid
      ? await sql.query(`select * from notification_prefs where tenant_id = $1`, [tid])
      : await sql.query(`select * from notification_prefs`);
    return rows.map((r) => ({ tenantId: Number(r.tenant_id), kind: String(r.kind), enabled: Boolean(r.enabled) }));
  });

export const getEsignMonitor = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const p = await me(context.userId);
    if (!isStaff(p)) return { flags: [] as { id: string; label: string; severity: string }[], envelopes: [] as { id: number; name: string; status: string; auth: string }[] };
    const sql = await getSql();
    const envelopes = await sql`select e.*, d.name as doc_name from esign_envelopes e left join documents d on d.id = e.document_id`;
    return {
      flags: [
        { id: "geo", label: "Signer IP outside expected country", severity: "warn" },
        { id: "kba", label: "KBA not used on high-value envelope #2", severity: "info" },
      ],
      envelopes: envelopes.map((e) => ({
        id: Number(e.id),
        name: String(e.doc_name ?? e.id),
        status: String(e.status),
        auth: String(e.auth_method),
      })),
    };
  });

export const getEnvelopePublic = createServerFn({ method: "GET" })
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const env = await sql.query(
      `select e.*, d.name as doc_name, d.content from esign_envelopes e left join documents d on d.id = e.document_id where e.id = $1`,
      [data.id],
    );
    if (!env[0]) return null;
    const recips = await sql.query(`select * from esign_recipients where envelope_id = $1 order by routing_order`, [data.id]);
    const fields = await sql.query(`select * from esign_fields where envelope_id = $1`, [data.id]);
    return {
      id: Number(env[0].id),
      name: String(env[0].doc_name ?? "Document"),
      content: env[0].content ? String(env[0].content) : "Production agreement for live event audiovisual services.",
      status: String(env[0].status),
      mode: String(env[0].mode),
      authMethod: String(env[0].auth_method),
      watermark: String(env[0].watermark_text ?? "CONFIDENTIAL"),
      originalSha: String(env[0].original_sha ?? ""),
      signedSha: env[0].signed_sha ? String(env[0].signed_sha) : null,
      recipients: recips.map((r) => ({
        id: Number(r.id),
        name: String(r.name),
        email: String(r.email),
        role: String(r.role),
        status: String(r.status),
        routingOrder: Number(r.routing_order),
      })),
      fields: fields.map((f) => ({
        id: Number(f.id),
        kind: String(f.kind),
        page: Number(f.page),
        x: Number(f.x_pct),
        y: Number(f.y_pct),
        recipientId: f.recipient_id == null ? null : Number(f.recipient_id),
        value: f.value ? String(f.value) : "",
      })),
    };
  });

export const updateEnvelopeStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; status: string }) => input)
  .handler(async ({ context, data }) => {
    const p = await me(context.userId);
    if (!isStaff(p)) return { ok: false as const };
    const sql = await getSql();
    await sql.query(`update esign_envelopes set status = $2 where id = $1`, [data.id, data.status]);
    await writeAudit(p, "esign.status", `${data.id}:${data.status}`);
    return { ok: true as const };
  });

export const remindEnvelope = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ context, data }) => {
    const p = await me(context.userId);
    const sql = await getSql();
    const b = await sql.query(`select reminder_template from branding where id = 1`);
    await writeAudit(p, "esign.remind", String(data.id), String(b[0]?.reminder_template ?? "Reminder"));
    return { ok: true as const };
  });

export const addEnvelopeField = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { envelopeId: number; kind: string; x: number; y: number; recipientId?: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql.query(`insert into esign_fields (envelope_id, recipient_id, kind, page, x_pct, y_pct) values ($1,$2,$3,1,$4,$5)`, [
      data.envelopeId,
      data.recipientId ?? null,
      data.kind,
      data.x,
      data.y,
    ]);
    return { ok: true };
  });

void loadProfile;
