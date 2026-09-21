import { l as getSql, u as iso } from "./utils-BjcRTCQS.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CZC9dlvp.mjs";
import { a as otpCode, i as isStaff, n as emailAllowed, o as provisionProfile, r as hashSha, s as writeAudit, t as effectiveTenantId } from "./access-BE7LFNbd.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-DzrQDxuD.js
function toB64(text) {
	const bytes = new TextEncoder().encode(text);
	let bin = "";
	for (const b of bytes) bin += String.fromCharCode(b);
	return btoa(bin);
}
async function me(userId) {
	return provisionProfile(userId);
}
function mapFile(r) {
	return {
		id: Number(r.id),
		tenantId: r.tenant_id == null ? null : Number(r.tenant_id),
		projectId: r.project_id == null ? null : Number(r.project_id),
		projectName: r.project_name ? String(r.project_name) : null,
		folder: String(r.folder),
		name: String(r.name),
		mime: String(r.mime),
		sizeBytes: Number(r.size_bytes),
		sha256: r.sha256 ? String(r.sha256) : null,
		driveId: r.drive_id ? String(r.drive_id) : null,
		shared: Boolean(r.shared),
		createdAt: iso(r.created_at) ?? ""
	};
}
var checkEmailGate_createServerFn_handler = createServerRpc({
	id: "4c81ed06625b143b2fefac5d4b23430c3a076129784e69c219ffd3169de98b03",
	name: "checkEmailGate",
	filename: "src/lib/portal/server.ts"
}, (opts) => checkEmailGate.__executeServer(opts));
var checkEmailGate = createServerFn({ method: "POST" }).validator((input) => input).handler(checkEmailGate_createServerFn_handler, async ({ data }) => emailAllowed(data.email));
var issueOtp_createServerFn_handler = createServerRpc({
	id: "8da1c8bea9ce0d2e48fefc2a47e67ddd8d2e97ad5e2edd15b0b2156edd72d3c4",
	name: "issueOtp",
	filename: "src/lib/portal/server.ts"
}, (opts) => issueOtp.__executeServer(opts));
var issueOtp = createServerFn({ method: "POST" }).validator((input) => input).handler(issueOtp_createServerFn_handler, async ({ data }) => {
	const email = data.email.trim().toLowerCase();
	if (data.purpose === "register") {
		if (!(await emailAllowed(email)).ok) return {
			ok: false,
			error: "This email is not in the Pipedrive contact book."
		};
	}
	const sql = await getSql();
	const code = otpCode();
	await sql.query(`insert into email_otps (email, code, purpose, expires_at) values ($1,$2,$3, now() + interval '15 minutes')`, [
		email,
		code,
		data.purpose
	]);
	return {
		ok: true,
		demoCode: code,
		email
	};
});
var verifyOtp_createServerFn_handler = createServerRpc({
	id: "6ba63469f5c0271ed7bddb421f261268853d2de2b7304005459fb698dbd2b674",
	name: "verifyOtp",
	filename: "src/lib/portal/server.ts"
}, (opts) => verifyOtp.__executeServer(opts));
var verifyOtp = createServerFn({ method: "POST" }).validator((input) => input).handler(verifyOtp_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const rows = await sql.query(`select id from email_otps
       where lower(email) = $1 and code = $2 and purpose = $3 and used = false and expires_at > now()
       order by id desc limit 1`, [
		data.email.trim().toLowerCase(),
		data.code.trim(),
		data.purpose
	]);
	if (!rows[0]) return {
		ok: false,
		error: "Invalid or expired code."
	};
	await sql.query(`update email_otps set used = true where id = $1`, [Number(rows[0].id)]);
	return { ok: true };
});
var resetPasswordWithOtp_createServerFn_handler = createServerRpc({
	id: "b52930db7b0f372520a8a0ce8ed29d4fb6ae367759a88aa1bf86c63b84d7a89e",
	name: "resetPasswordWithOtp",
	filename: "src/lib/portal/server.ts"
}, (opts) => resetPasswordWithOtp.__executeServer(opts));
var resetPasswordWithOtp = createServerFn({ method: "POST" }).validator((input) => input).handler(resetPasswordWithOtp_createServerFn_handler, async ({ data }) => {
	const check = await verifyOtp({ data: {
		email: data.email,
		code: data.code,
		purpose: "reset"
	} });
	if (!check.ok) return check;
	const sql = await getSql();
	const users = await sql.query(`select id from "user" where lower(email) = $1`, [data.email.trim().toLowerCase()]);
	if (!users[0]) return {
		ok: false,
		error: "No account for that email."
	};
	try {
		const { auth } = await import("./server-DC_NIGmU.mjs").then((n) => n.r);
		const hash = await (await auth.$context).password.hash(data.password);
		const accounts = await sql.query(`select id from account where "userId" = $1 and "providerId" = 'credential'`, [String(users[0].id)]);
		if (accounts[0]) await sql.query(`update account set password = $1 where id = $2`, [hash, String(accounts[0].id)]);
		else await sql.query(`insert into account (id, "accountId", "providerId", "userId", password)
           values ($1,$2,'credential',$3,$4)`, [
			`cred_${users[0].id}`,
			String(users[0].id),
			String(users[0].id),
			hash
		]);
	} catch {
		return {
			ok: false,
			error: "Could not update password."
		};
	}
	return { ok: true };
});
var getPortalMe_createServerFn_handler = createServerRpc({
	id: "af89c8b165ae9d140e7f43a5d8c7498dc2b434b6bd93adf9e2bddbdfe5840111",
	name: "getPortalMe",
	filename: "src/lib/portal/server.ts"
}, (opts) => getPortalMe.__executeServer(opts));
var getPortalMe = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getPortalMe_createServerFn_handler, async ({ context }) => {
	const p = await me(context.userId);
	const o = (await (await getSql()).query(`select * from onboarding_state where user_id = $1`, [p.userId]))[0];
	return {
		...p,
		onboarding: {
			profile: Boolean(o?.profile_done),
			team: Boolean(o?.team_done),
			project: Boolean(o?.project_done),
			docs: Boolean(o?.docs_done),
			prefs: Boolean(o?.prefs_done)
		}
	};
});
var completeOnboardingStep_createServerFn_handler = createServerRpc({
	id: "478fc051f651105f4caefe354dde9ca2c151199407626308b865a93dac94f5bd",
	name: "completeOnboardingStep",
	filename: "src/lib/portal/server.ts"
}, (opts) => completeOnboardingStep.__executeServer(opts));
var completeOnboardingStep = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(completeOnboardingStep_createServerFn_handler, async ({ context, data }) => {
	const col = `${data.step}_done`;
	const sql = await getSql();
	await sql.query(`update onboarding_state set ${col} = true where user_id = $1`, [context.userId]);
	const o = (await sql.query(`select * from onboarding_state where user_id = $1`, [context.userId]))[0];
	const done = Boolean(o?.profile_done && o?.team_done && o?.project_done && o?.docs_done && o?.prefs_done);
	if (done) await sql.query(`update portal_profiles set onboarded = true where user_id = $1`, [context.userId]);
	return {
		ok: true,
		onboarded: done
	};
});
var updatePortalProfile_createServerFn_handler = createServerRpc({
	id: "115240cc6de18fbf8b8ac7e55e3e23af1abc3dd82c7fc2a3411dba9ad31b4235",
	name: "updatePortalProfile",
	filename: "src/lib/portal/server.ts"
}, (opts) => updatePortalProfile.__executeServer(opts));
var updatePortalProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(updatePortalProfile_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const p = await me(context.userId);
	await sql.query(`update portal_profiles set
        name = coalesce($2, name),
        theme = coalesce($3, theme),
        compact = coalesce($4, compact),
        high_contrast = coalesce($5, high_contrast),
        screen_reader = coalesce($6, screen_reader)
       where user_id = $1`, [
		context.userId,
		data.name ?? null,
		data.theme ?? null,
		data.compact ?? null,
		data.highContrast ?? null,
		data.screenReader ?? null
	]);
	await writeAudit(p, "profile.update", p.email);
	return { ok: true };
});
var switchTenant_createServerFn_handler = createServerRpc({
	id: "f5ad60a0b3c2546d5f325f456572020a1b3f4b7a8c7033bba54ced97951cd35a",
	name: "switchTenant",
	filename: "src/lib/portal/server.ts"
}, (opts) => switchTenant.__executeServer(opts));
var switchTenant = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(switchTenant_createServerFn_handler, async ({ context, data }) => {
	const p = await me(context.userId);
	if (!isStaff(p)) return {
		ok: false,
		error: "Staff only."
	};
	if (data.tenantId != null && data.password && data.password !== "northline") return {
		ok: false,
		error: "Re-enter your password to switch accounts."
	};
	const sql = await getSql();
	if (data.tenantId == null) await sql.query(`delete from impersonation where user_id = $1`, [p.userId]);
	else await sql.query(`insert into impersonation (user_id, tenant_id) values ($1,$2)
         on conflict (user_id) do update set tenant_id = excluded.tenant_id, started_at = now()`, [p.userId, data.tenantId]);
	await writeAudit(p, "impersonate", data.tenantId == null ? "clear" : `tenant:${data.tenantId}`);
	return { ok: true };
});
var listTenants_createServerFn_handler = createServerRpc({
	id: "e6061b49f5bfa1aa2523dcac89cece344e37cdae1b1f34131f0655edac83143d",
	name: "listTenants",
	filename: "src/lib/portal/server.ts"
}, (opts) => listTenants.__executeServer(opts));
var listTenants = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listTenants_createServerFn_handler, async ({ context }) => {
	const p = await me(context.userId);
	if (!isStaff(p)) return [];
	return (await (await getSql())`select t.*, o.industry from tenants t left join organizations o on o.id = t.org_id order by t.name`).map((r) => ({
		id: Number(r.id),
		name: String(r.name),
		slug: String(r.slug),
		quotaGb: Number(r.quota_gb),
		usedMb: Number(r.used_mb),
		industry: r.industry ? String(r.industry) : null
	}));
});
var getDashboard_createServerFn_handler = createServerRpc({
	id: "d8252af4d821f130d4af367b56ea5d964062e0512f8227a91ba55645e3868a90",
	name: "getDashboard",
	filename: "src/lib/portal/server.ts"
}, (opts) => getDashboard.__executeServer(opts));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getDashboard_createServerFn_handler, async ({ context }) => {
	const p = await me(context.userId);
	const sql = await getSql();
	const tid = effectiveTenantId(p);
	const projects = tid ? await sql.query(`select count(*)::int as n from projects where tenant_id = $1`, [tid]) : await sql.query(`select count(*)::int as n from projects`);
	const files = tid ? await sql.query(`select count(*)::int as n, coalesce(sum(size_bytes),0)::bigint as bytes from portal_files where tenant_id = $1`, [tid]) : await sql.query(`select count(*)::int as n, coalesce(sum(size_bytes),0)::bigint as bytes from portal_files`);
	const tasks = tid ? await sql.query(`select count(*)::int as n, count(*) filter (where i.done)::int as done
           from task_items i join task_lists l on l.id = i.list_id where l.tenant_id = $1`, [tid]) : await sql.query(`select count(*)::int as n, count(*) filter (where done)::int as done from task_items`);
	const approvals = tid ? await sql.query(`select count(*)::int as n from approvals where tenant_id = $1 and status = 'pending'`, [tid]) : await sql.query(`select count(*)::int as n from approvals where status = 'pending'`);
	const sigs = tid ? await sql.query(`select count(*)::int as n from esign_envelopes where tenant_id = $1 and status in ('sent','viewed')`, [tid]) : await sql.query(`select count(*)::int as n from esign_envelopes where status in ('sent','viewed')`);
	const recent = tid ? await sql.query(`select name, folder, created_at from portal_files where tenant_id = $1 order by created_at desc limit 6`, [tid]) : await sql.query(`select name, folder, created_at from portal_files order by created_at desc limit 6`);
	const quota = tid ? await sql.query(`select quota_gb, used_mb, name from tenants where id = $1`, [tid]) : await sql.query(`select 500::numeric as quota_gb, coalesce(sum(used_mb),0) as used_mb, 'House' as name from tenants`);
	return {
		profile: p,
		projects: Number(projects[0]?.n ?? 0),
		files: Number(files[0]?.n ?? 0),
		fileBytes: Number(files[0]?.bytes ?? 0),
		tasks: Number(tasks[0]?.n ?? 0),
		tasksDone: Number(tasks[0]?.done ?? 0),
		approvals: Number(approvals[0]?.n ?? 0),
		signatures: Number(sigs[0]?.n ?? 0),
		recent: recent.map((r) => ({
			name: String(r.name),
			folder: String(r.folder),
			at: iso(r.created_at)
		})),
		quotaGb: Number(quota[0]?.quota_gb ?? 50),
		usedMb: Number(quota[0]?.used_mb ?? 0),
		workspace: String(quota[0]?.name ?? "Northline")
	};
});
var listPortalProjects_createServerFn_handler = createServerRpc({
	id: "8464588b7373152933c8f4c9773d441ff85f9f182bfca5586ba71708f1c92876",
	name: "listPortalProjects",
	filename: "src/lib/portal/server.ts"
}, (opts) => listPortalProjects.__executeServer(opts));
var listPortalProjects = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listPortalProjects_createServerFn_handler, async ({ context }) => {
	const p = await me(context.userId);
	const sql = await getSql();
	const tid = effectiveTenantId(p);
	return (tid ? await sql.query(`select p.*, t.name as tenant_name,
                  (select count(*) from project_tasks x where x.project_id = p.id) as task_count,
                  (select count(*) from project_tasks x where x.project_id = p.id and x.column_name = 'Done') as done_count
           from projects p left join tenants t on t.id = p.tenant_id
           where p.tenant_id = $1
           order by p.start_date desc nulls last`, [tid]) : await sql.query(`select p.*, t.name as tenant_name,
                  (select count(*) from project_tasks x where x.project_id = p.id) as task_count,
                  (select count(*) from project_tasks x where x.project_id = p.id and x.column_name = 'Done') as done_count
           from projects p left join tenants t on t.id = p.tenant_id
           where p.stage_label in ('Estimate & Agreement Sent','On Hold','Signed/Invoiced') or p.tenant_id is not null
           order by p.start_date desc nulls last`)).map((r) => ({
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
		doneCount: Number(r.done_count)
	}));
});
var getPortalProject_createServerFn_handler = createServerRpc({
	id: "6b3f6c38a005d928a54c3386800d2ebfc722b65e7075cd257ba76d3c9d1b32df",
	name: "getPortalProject",
	filename: "src/lib/portal/server.ts"
}, (opts) => getPortalProject.__executeServer(opts));
var getPortalProject = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(getPortalProject_createServerFn_handler, async ({ context, data }) => {
	const p = await me(context.userId);
	const sql = await getSql();
	const tid = effectiveTenantId(p);
	const r = (await sql.query(`select p.*, t.name as tenant_name from projects p left join tenants t on t.id = p.tenant_id where p.id = $1`, [data.id]))[0];
	if (!r) return null;
	if (tid && Number(r.tenant_id) !== tid && !isStaff(p)) return null;
	const files = await sql.query(`select * from portal_files where project_id = $1 order by folder, name`, [data.id]);
	const notes = await sql.query(`select * from project_notes where project_id = $1 order by created_at desc`, [data.id]);
	const reqs = await sql.query(`select * from project_requests where project_id = $1 order by created_at desc`, [data.id]);
	const lists = await sql.query(`select * from task_lists where project_id = $1`, [data.id]);
	const items = lists.length ? await sql.query(`select * from task_items where list_id = any($1::int[]) order by id`, [lists.map((l) => Number(l.id))]) : [];
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
			endDate: iso(r.end_date)
		},
		files: files.map(mapFile),
		notes: notes.map((n) => ({
			id: Number(n.id),
			body: String(n.body),
			visible: Boolean(n.visible),
			author: n.author ? String(n.author) : null,
			at: iso(n.created_at)
		})),
		requests: reqs.map((n) => ({
			id: Number(n.id),
			title: String(n.title),
			body: n.body ? String(n.body) : "",
			status: String(n.status),
			at: iso(n.created_at)
		})),
		lists: lists.map((l) => ({
			id: Number(l.id),
			name: String(l.name),
			items: items.filter((i) => Number(i.list_id) === Number(l.id)).map((i) => ({
				id: Number(i.id),
				title: String(i.title),
				done: Boolean(i.done)
			}))
		}))
	};
});
var addProjectRequest_createServerFn_handler = createServerRpc({
	id: "e2a1232fb373f50ceef48cf8df618b7b8c7767a250fbf167046acc7307d359dd",
	name: "addProjectRequest",
	filename: "src/lib/portal/server.ts"
}, (opts) => addProjectRequest.__executeServer(opts));
var addProjectRequest = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(addProjectRequest_createServerFn_handler, async ({ context, data }) => {
	const p = await me(context.userId);
	const sql = await getSql();
	const tid = effectiveTenantId(p);
	await sql.query(`insert into project_requests (project_id, tenant_id, title, body, created_by) values ($1,$2,$3,$4,$5)`, [
		data.projectId,
		tid,
		data.title,
		data.body ?? "",
		p.name
	]);
	return { ok: true };
});
var toggleProjectNote_createServerFn_handler = createServerRpc({
	id: "45378dea731466732e1f5ef16d0b3d07b5abcd4462b8cb38005eb60175821170",
	name: "toggleProjectNote",
	filename: "src/lib/portal/server.ts"
}, (opts) => toggleProjectNote.__executeServer(opts));
var toggleProjectNote = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(toggleProjectNote_createServerFn_handler, async ({ context, data }) => {
	const p = await me(context.userId);
	if (!isStaff(p)) return { ok: false };
	await (await getSql()).query(`update project_notes set visible = $2 where id = $1`, [data.id, data.visible]);
	return { ok: true };
});
var listPortalFiles_createServerFn_handler = createServerRpc({
	id: "afdee20c77292268237f0444d823607edd8e42d4a4a84ef9cf85e3b48e51217b",
	name: "listPortalFiles",
	filename: "src/lib/portal/server.ts"
}, (opts) => listPortalFiles.__executeServer(opts));
var listPortalFiles = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input = {}) => input).handler(listPortalFiles_createServerFn_handler, async ({ context, data }) => {
	const p = await me(context.userId);
	const sql = await getSql();
	const tid = effectiveTenantId(p);
	return (await sql.query(`select f.*, pr.name as project_name
       from portal_files f left join projects pr on pr.id = f.project_id
       where ($1::int is null or f.tenant_id = $1)
         and ($2::text is null or f.folder = $2)
         and ($3::int is null or f.project_id = $3)
         and ($4::text is null or f.name ilike '%' || $4 || '%')
       order by f.created_at desc`, [
		tid,
		data.folder ?? null,
		data.projectId ?? null,
		data.q ?? null
	])).map(mapFile);
});
var uploadPortalFile_createServerFn_handler = createServerRpc({
	id: "ee3fc57e815237cd182a7fe6fe6b777d8266488a0e5d94a72ee2e7160bf6c12a",
	name: "uploadPortalFile",
	filename: "src/lib/portal/server.ts"
}, (opts) => uploadPortalFile.__executeServer(opts));
var uploadPortalFile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(uploadPortalFile_createServerFn_handler, async ({ context, data }) => {
	const p = await me(context.userId);
	const sql = await getSql();
	const tid = effectiveTenantId(p);
	if (!tid && !isStaff(p)) return {
		ok: false,
		error: "No tenant."
	};
	const quota = tid ? await sql.query(`select quota_gb, used_mb from tenants where id = $1`, [tid]) : [{
		quota_gb: 500,
		used_mb: 0
	}];
	if (Number(quota[0]?.used_mb ?? 0) + data.sizeBytes / 1e6 > Number(quota[0]?.quota_gb ?? 50) * 1e3) return {
		ok: false,
		error: "Storage quota exceeded."
	};
	const sha = hashSha(`${data.name}:${data.sizeBytes}:${Date.now()}`);
	const ins = await sql.query(`insert into portal_files (tenant_id, project_id, folder, name, mime, size_bytes, sha256, drive_id, uploaded_by)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning id`, [
		tid,
		data.projectId ?? null,
		data.folder ?? "files",
		data.name,
		data.mime ?? "application/octet-stream",
		data.sizeBytes,
		sha,
		`drv-${sha.slice(0, 8)}`,
		p.email
	]);
	if (tid) await sql.query(`update tenants set used_mb = used_mb + $2 where id = $1`, [tid, data.sizeBytes / 1e6]);
	await writeAudit(p, "file.upload", data.name);
	return {
		ok: true,
		id: Number(ins[0].id),
		sha
	};
});
var downloadPortalFile_createServerFn_handler = createServerRpc({
	id: "9bcafc02475067bb93a75af3a2a851de8dfbf63061ecbfdea4074c4e31b83dcb",
	name: "downloadPortalFile",
	filename: "src/lib/portal/server.ts"
}, (opts) => downloadPortalFile.__executeServer(opts));
var downloadPortalFile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(downloadPortalFile_createServerFn_handler, async ({ context, data }) => {
	const p = await me(context.userId);
	const f = (await (await getSql()).query(`select * from portal_files where id = $1`, [data.id]))[0];
	if (!f) return {
		ok: false,
		error: "Not found"
	};
	const tid = effectiveTenantId(p);
	if (tid && Number(f.tenant_id) !== tid && !isStaff(p)) return {
		ok: false,
		error: "Forbidden"
	};
	await writeAudit(p, "file.download", String(f.name));
	const body = `NORTHLINE FILE PROXY\n${f.name}\nsha256 ${f.sha256}\nGoogle Drive id ${f.drive_id}\nDisposition: attachment\n`;
	return {
		ok: true,
		filename: String(f.name),
		mime: "application/octet-stream",
		contentB64: toB64(body)
	};
});
var zipPortalFiles_createServerFn_handler = createServerRpc({
	id: "80827c283054204cc582d46aef7da9526d3961827d7cd86b9c5e9b55dc7febf2",
	name: "zipPortalFiles",
	filename: "src/lib/portal/server.ts"
}, (opts) => zipPortalFiles.__executeServer(opts));
var zipPortalFiles = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(zipPortalFiles_createServerFn_handler, async ({ context, data }) => {
	const p = await me(context.userId);
	const rows = await (await getSql()).query(`select name from portal_files where id = any($1::int[])`, [data.ids]);
	await writeAudit(p, "file.zip", data.ids.join(","));
	return {
		ok: true,
		filename: "northline-files.zip",
		contentB64: toB64(`ZIP (proxied)\n${rows.map((r) => String(r.name)).join("\n")}`)
	};
});
var sharePortalFile_createServerFn_handler = createServerRpc({
	id: "1311b91347ceed0b1ca187acd10656a5b3d81f762a4dd8c5d3a9e0487974f7d5",
	name: "sharePortalFile",
	filename: "src/lib/portal/server.ts"
}, (opts) => sharePortalFile.__executeServer(opts));
var sharePortalFile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(sharePortalFile_createServerFn_handler, async ({ context, data }) => {
	const p = await me(context.userId);
	if (!isStaff(p)) return { ok: false };
	await (await getSql()).query(`update portal_files set shared = $2 where id = $1`, [data.id, data.shared]);
	await writeAudit(p, "file.share", String(data.id));
	return { ok: true };
});
var listApprovals_createServerFn_handler = createServerRpc({
	id: "fa7d03d6a5cd4497cf2165b8c9a2eb864092721886b2f543fe0fc6aa25122746",
	name: "listApprovals",
	filename: "src/lib/portal/server.ts"
}, (opts) => listApprovals.__executeServer(opts));
var listApprovals = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listApprovals_createServerFn_handler, async ({ context }) => {
	const p = await me(context.userId);
	const sql = await getSql();
	const tid = effectiveTenantId(p);
	return (tid ? await sql.query(`select a.*, pr.name as project_name from approvals a left join projects pr on pr.id = a.project_id where a.tenant_id = $1 order by a.created_at desc`, [tid]) : await sql.query(`select a.*, pr.name as project_name from approvals a left join projects pr on pr.id = a.project_id order by a.created_at desc`)).map((r) => ({
		id: Number(r.id),
		title: String(r.title),
		body: r.body ? String(r.body) : "",
		status: String(r.status),
		projectName: r.project_name ? String(r.project_name) : null,
		requestedBy: r.requested_by ? String(r.requested_by) : null,
		at: iso(r.created_at)
	}));
});
var decideApproval_createServerFn_handler = createServerRpc({
	id: "7b1450d8ddc767bb61aa4e01b18ad97d0b4f4bf5273207d525d38ccbbe6978a5",
	name: "decideApproval",
	filename: "src/lib/portal/server.ts"
}, (opts) => decideApproval.__executeServer(opts));
var decideApproval = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(decideApproval_createServerFn_handler, async ({ context, data }) => {
	const p = await me(context.userId);
	await (await getSql()).query(`update approvals set status = $2, decided_by = $3, decision_note = $4, decided_at = now() where id = $1`, [
		data.id,
		data.status,
		p.name,
		data.note ?? null
	]);
	await writeAudit(p, "approval." + data.status, String(data.id));
	return { ok: true };
});
var createApproval_createServerFn_handler = createServerRpc({
	id: "e734a7a45e66e02d284ca8073c3602a2107dc49c5ef4aa181a32111ffc05043b",
	name: "createApproval",
	filename: "src/lib/portal/server.ts"
}, (opts) => createApproval.__executeServer(opts));
var createApproval = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createApproval_createServerFn_handler, async ({ context, data }) => {
	const p = await me(context.userId);
	await (await getSql()).query(`insert into approvals (tenant_id, project_id, title, body, requested_by) values ($1,$2,$3,$4,$5)`, [
		effectiveTenantId(p),
		data.projectId ?? null,
		data.title,
		data.body ?? "",
		p.name
	]);
	return { ok: true };
});
var listTaskLists_createServerFn_handler = createServerRpc({
	id: "b79c58f14736d0f420bfd9963f419b83e42867f93a69d6ea09b024e5a322a753",
	name: "listTaskLists",
	filename: "src/lib/portal/server.ts"
}, (opts) => listTaskLists.__executeServer(opts));
var listTaskLists = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listTaskLists_createServerFn_handler, async ({ context }) => {
	const p = await me(context.userId);
	const sql = await getSql();
	const tid = effectiveTenantId(p);
	const lists = tid ? await sql.query(`select * from task_lists where tenant_id = $1 order by id`, [tid]) : await sql.query(`select * from task_lists order by id`);
	const items = await sql.query(`select * from task_items order by id`);
	return lists.map((l) => ({
		id: Number(l.id),
		name: String(l.name),
		projectId: l.project_id == null ? null : Number(l.project_id),
		items: items.filter((i) => Number(i.list_id) === Number(l.id)).map((i) => ({
			id: Number(i.id),
			title: String(i.title),
			done: Boolean(i.done)
		}))
	}));
});
var mutateTask_createServerFn_handler = createServerRpc({
	id: "f45670b8c15ffef987e5305067ce8ff1373b63ee2e52915c9bdf648ec106d5d1",
	name: "mutateTask",
	filename: "src/lib/portal/server.ts"
}, (opts) => mutateTask.__executeServer(opts));
var mutateTask = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(mutateTask_createServerFn_handler, async ({ context, data }) => {
	const p = await me(context.userId);
	const sql = await getSql();
	const tid = effectiveTenantId(p);
	if (data.op === "addList") await sql.query(`insert into task_lists (tenant_id, name) values ($1,$2)`, [tid, data.name ?? "Checklist"]);
	else if (data.op === "delList" && data.id) await sql.query(`delete from task_lists where id = $1`, [data.id]);
	else if (data.op === "addItem" && data.listId) await sql.query(`insert into task_items (list_id, title) values ($1,$2)`, [data.listId, data.title ?? "Task"]);
	else if (data.op === "toggle" && data.id) await sql.query(`update task_items set done = not done where id = $1`, [data.id]);
	else if (data.op === "delItem" && data.id) await sql.query(`delete from task_items where id = $1`, [data.id]);
	return { ok: true };
});
var listBookmarks_createServerFn_handler = createServerRpc({
	id: "8be540e362e17d5f3291dad0567600939827bd404db15de82c086c697ab7d37d",
	name: "listBookmarks",
	filename: "src/lib/portal/server.ts"
}, (opts) => listBookmarks.__executeServer(opts));
var listBookmarks = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listBookmarks_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const rows = await sql.query(`select * from bookmarks where user_id = $1 order by sort_order, id`, [context.userId]);
	const seed = await sql.query(`select * from bookmarks where user_id = 'staff-seed' order by sort_order`);
	return (rows.length ? rows : seed).map((r) => ({
		id: Number(r.id),
		label: String(r.label),
		href: String(r.href)
	}));
});
var mutateBookmark_createServerFn_handler = createServerRpc({
	id: "91c01453116e68dba9f72db5f0b3afc9c781b30d5d422e24f2a2820d73c648a0",
	name: "mutateBookmark",
	filename: "src/lib/portal/server.ts"
}, (opts) => mutateBookmark.__executeServer(opts));
var mutateBookmark = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(mutateBookmark_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if (data.op === "add") await sql.query(`insert into bookmarks (user_id, label, href) values ($1,$2,$3)`, [
		context.userId,
		data.label ?? "Bookmark",
		data.href ?? "/"
	]);
	else if (data.op === "del" && data.id) await sql.query(`delete from bookmarks where id = $1 and user_id = $2`, [data.id, context.userId]);
	else if (data.op === "reorder" && data.ids) for (let i = 0; i < data.ids.length; i++) await sql.query(`update bookmarks set sort_order = $2 where id = $1 and user_id = $3`, [
		data.ids[i],
		i,
		context.userId
	]);
	return { ok: true };
});
var listAudit_createServerFn_handler = createServerRpc({
	id: "4b4c11184d03c0f75106b21af3c43d38164f164a2a7dd9c17ff635da63978096",
	name: "listAudit",
	filename: "src/lib/portal/server.ts"
}, (opts) => listAudit.__executeServer(opts));
var listAudit = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listAudit_createServerFn_handler, async ({ context }) => {
	const p = await me(context.userId);
	if (!isStaff(p)) return [];
	return (await (await getSql())`select * from audit_events order by created_at desc limit 80`).map((r) => ({
		id: Number(r.id),
		email: r.email ? String(r.email) : "",
		action: String(r.action),
		entity: r.entity ? String(r.entity) : "",
		ip: r.ip ? String(r.ip) : "",
		at: iso(r.created_at)
	}));
});
var setTenantQuota_createServerFn_handler = createServerRpc({
	id: "02fee718af39c1991461cb3b2285b9959c046a882ece4f6cf5ecfc59d87b47aa",
	name: "setTenantQuota",
	filename: "src/lib/portal/server.ts"
}, (opts) => setTenantQuota.__executeServer(opts));
var setTenantQuota = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(setTenantQuota_createServerFn_handler, async ({ context, data }) => {
	const p = await me(context.userId);
	if (!isStaff(p)) return { ok: false };
	await (await getSql()).query(`update tenants set quota_gb = $2 where id = $1`, [data.tenantId, data.quotaGb]);
	return { ok: true };
});
var inviteSubuser_createServerFn_handler = createServerRpc({
	id: "676660b52964fce29d259c48b16f3f53a396462476af213f5f3c5f69a4316743",
	name: "inviteSubuser",
	filename: "src/lib/portal/server.ts"
}, (opts) => inviteSubuser.__executeServer(opts));
var inviteSubuser = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(inviteSubuser_createServerFn_handler, async ({ context, data }) => {
	const p = await me(context.userId);
	if (p.role === "subuser") return {
		ok: false,
		error: "Only the primary client can invite."
	};
	const sql = await getSql();
	const fakeId = `sub-${hashSha(data.email).slice(0, 12)}`;
	await sql.query(`insert into portal_profiles (user_id, email, name, role, tenant_id, parent_user_id, verified, permissions)
       values ($1,$2,$3,'subuser',$4,$5,true,$6::jsonb)
       on conflict (email) do update set permissions = excluded.permissions`, [
		fakeId,
		data.email.toLowerCase(),
		data.name,
		p.tenantId,
		p.userId,
		JSON.stringify(data.permissions ?? {})
	]);
	return { ok: true };
});
var listSubusers_createServerFn_handler = createServerRpc({
	id: "a6c4b9228219b70113d237f4db01acaf5f02dbe8290b7539d23eef5f7a3c6c01",
	name: "listSubusers",
	filename: "src/lib/portal/server.ts"
}, (opts) => listSubusers.__executeServer(opts));
var listSubusers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listSubusers_createServerFn_handler, async ({ context }) => {
	const p = await me(context.userId);
	return (await (await getSql()).query(`select user_id, email, name, permissions from portal_profiles where parent_user_id = $1 or (tenant_id = $2 and role = 'subuser')`, [p.userId, p.tenantId])).map((r) => ({
		userId: String(r.user_id),
		email: String(r.email),
		name: String(r.name),
		permissions: String(typeof r.permissions === "string" ? r.permissions : JSON.stringify(r.permissions ?? {}))
	}));
});
var listEnvelopes_createServerFn_handler = createServerRpc({
	id: "2c2ce75e1533faaa4b8de2f4342d0cdc415acd6afd9cd23a6ac072cd35b90381",
	name: "listEnvelopes",
	filename: "src/lib/portal/server.ts"
}, (opts) => listEnvelopes.__executeServer(opts));
var listEnvelopes = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listEnvelopes_createServerFn_handler, async ({ context }) => {
	const p = await me(context.userId);
	const sql = await getSql();
	const tid = effectiveTenantId(p);
	return (tid ? await sql.query(`select e.*, d.name as doc_name from esign_envelopes e left join documents d on d.id = e.document_id where e.tenant_id = $1 order by e.id desc`, [tid]) : await sql.query(`select e.*, d.name as doc_name from esign_envelopes e left join documents d on d.id = e.document_id order by e.id desc`)).map((r) => ({
		id: Number(r.id),
		documentId: r.document_id == null ? null : Number(r.document_id),
		name: String(r.doc_name ?? `Envelope ${r.id}`),
		status: String(r.status),
		mode: String(r.mode),
		authMethod: String(r.auth_method),
		tags: r.tags ? String(r.tags) : "",
		originalSha: r.original_sha ? String(r.original_sha) : "",
		signedSha: r.signed_sha ? String(r.signed_sha) : "",
		createdAt: iso(r.created_at)
	}));
});
var createEnvelope_createServerFn_handler = createServerRpc({
	id: "3f97f66351023477deb69f905fbdda789fb8124b930ee2c79ce2a95ea86581f0",
	name: "createEnvelope",
	filename: "src/lib/portal/server.ts"
}, (opts) => createEnvelope.__executeServer(opts));
var createEnvelope = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createEnvelope_createServerFn_handler, async ({ context, data }) => {
	const p = await me(context.userId);
	const sql = await getSql();
	const sha = hashSha(`env:${Date.now()}`);
	const ins = await sql.query(`insert into esign_envelopes (document_id, tenant_id, deal_id, mode, status, auth_method, access_code, original_sha, tags)
       values ($1,$2,$3,$4,'sent',$5,$6,$7,$8) returning id`, [
		data.documentId ?? null,
		effectiveTenantId(p),
		data.dealId ?? null,
		data.mode,
		data.authMethod,
		data.accessCode ?? null,
		sha,
		data.tags ?? null
	]);
	const id = Number(ins[0].id);
	let order = 1;
	for (const rec of data.recipients) await sql.query(`insert into esign_recipients (envelope_id, name, email, role, routing_order) values ($1,$2,$3,$4,$5)`, [
		id,
		rec.name,
		rec.email,
		rec.role,
		order++
	]);
	await writeAudit(p, "esign.send", String(id));
	return {
		ok: true,
		id
	};
});
var getEnvelope_createServerFn_handler = createServerRpc({
	id: "aefce33749e3b1485bfd5d0357d978b5d281928477d304c5a388361129382c83",
	name: "getEnvelope",
	filename: "src/lib/portal/server.ts"
}, (opts) => getEnvelope.__executeServer(opts));
var getEnvelope = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(getEnvelope_createServerFn_handler, async ({ context, data }) => {
	await me(context.userId);
	const sql = await getSql();
	const env = await sql.query(`select e.*, d.name as doc_name, d.content from esign_envelopes e left join documents d on d.id = e.document_id where e.id = $1`, [data.id]);
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
			routingOrder: Number(r.routing_order)
		})),
		fields: fields.map((f) => ({
			id: Number(f.id),
			kind: String(f.kind),
			page: Number(f.page),
			x: Number(f.x_pct),
			y: Number(f.y_pct),
			recipientId: f.recipient_id == null ? null : Number(f.recipient_id)
		}))
	};
});
var signEnvelope_createServerFn_handler = createServerRpc({
	id: "dc3eab996d393bafe8231a0cdcf3c18d68def839af60cfbf93da6bff87320158",
	name: "signEnvelope",
	filename: "src/lib/portal/server.ts"
}, (opts) => signEnvelope.__executeServer(opts));
var signEnvelope = createServerFn({ method: "POST" }).validator((input) => input).handler(signEnvelope_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const env = await sql.query(`select * from esign_envelopes where id = $1`, [data.id]);
	if (!env[0]) return {
		ok: false,
		error: "Not found"
	};
	if (env[0].auth_method === "access_code" && env[0].access_code && env[0].access_code !== data.accessCode) return {
		ok: false,
		error: "Access code rejected."
	};
	await sql.query(`update esign_recipients set status = 'signed', signed_at = now(), signature_data = $2 where id = $1`, [data.recipientId, data.signature]);
	const pending = await sql.query(`select count(*)::int as n from esign_recipients where envelope_id = $1 and status <> 'signed'`, [data.id]);
	if (Number(pending[0]?.n ?? 0) === 0) {
		const sha = hashSha(`signed:${data.id}:${data.signature}`);
		await sql.query(`update esign_envelopes set status = 'completed', signed_sha = $2 where id = $1`, [data.id, sha]);
	} else await sql.query(`update esign_envelopes set status = 'partial' where id = $1`, [data.id]);
	return { ok: true };
});
var lookupDocument_createServerFn_handler = createServerRpc({
	id: "4931eed3acea1285773f41a67670c50c9bac403a0ff7f1acbaa28cb81cf1d947",
	name: "lookupDocument",
	filename: "src/lib/portal/server.ts"
}, (opts) => lookupDocument.__executeServer(opts));
var lookupDocument = createServerFn({ method: "POST" }).validator((input) => input).handler(lookupDocument_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	if (data.email && data.otp) {
		const v = await verifyOtp({ data: {
			email: data.email,
			code: data.otp,
			purpose: "lookup"
		} });
		if (!v.ok) return {
			ok: false,
			error: v.error
		};
	}
	const rows = await sql.query(`select id, name, status, lookup_id from documents where lookup_id = $1 and lookup_password = $2`, [data.lookupId ?? "", data.password ?? ""]);
	if (!rows[0]) return {
		ok: false,
		error: "No document matches that ID and password."
	};
	return {
		ok: true,
		id: Number(rows[0].id),
		name: String(rows[0].name),
		status: String(rows[0].status)
	};
});
var listProposals_createServerFn_handler = createServerRpc({
	id: "57060dadffe2e7beab61b39f516b3014b8f60754ad62e05957ad02dbe4013f78",
	name: "listProposals",
	filename: "src/lib/portal/server.ts"
}, (opts) => listProposals.__executeServer(opts));
var listProposals = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listProposals_createServerFn_handler, async () => {
	return (await (await getSql())`select p.*, d.title as deal_title from proposals p left join deals d on d.id = p.deal_id order by p.id desc`).map((r) => ({
		id: Number(r.id),
		title: String(r.title),
		body: r.body ? String(r.body) : "",
		status: String(r.status),
		token: String(r.token),
		dealTitle: r.deal_title ? String(r.deal_title) : null
	}));
});
var createProposal_createServerFn_handler = createServerRpc({
	id: "28b0fe78b3908494623378d093a3fadd32b6351a7feda38b6fa51165dbb3e508",
	name: "createProposal",
	filename: "src/lib/portal/server.ts"
}, (opts) => createProposal.__executeServer(opts));
var createProposal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createProposal_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const token = `pr-${hashSha(data.title + Date.now()).slice(0, 10)}`;
	await sql.query(`insert into proposals (deal_id, title, body, token) values ($1,$2,$3,$4)`, [
		data.dealId ?? null,
		data.title,
		data.body,
		token
	]);
	await writeAudit(await me(context.userId), "proposal.create", data.title);
	return {
		ok: true,
		token
	};
});
var getProposalPublic_createServerFn_handler = createServerRpc({
	id: "e1e13cda216d9727db9bc0a510d8b75f678556940f4182668ade71de1238490f",
	name: "getProposalPublic",
	filename: "src/lib/portal/server.ts"
}, (opts) => getProposalPublic.__executeServer(opts));
var getProposalPublic = createServerFn({ method: "GET" }).validator((input) => input).handler(getProposalPublic_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const rows = await sql.query(`select * from proposals where token = $1`, [data.token]);
	if (!rows[0]) return null;
	await sql.query(`update proposals set viewed_at = now(), status = case when status = 'sent' then 'viewed' else status end where token = $1`, [data.token]);
	return {
		title: String(rows[0].title),
		body: String(rows[0].body ?? ""),
		status: String(rows[0].status)
	};
});
var convertDealToProject_createServerFn_handler = createServerRpc({
	id: "388ad5f09e2e85a3e1672dac42bc606a4b673ea119b9916134f5280e3277e811",
	name: "convertDealToProject",
	filename: "src/lib/portal/server.ts"
}, (opts) => convertDealToProject.__executeServer(opts));
var convertDealToProject = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(convertDealToProject_createServerFn_handler, async ({ context, data }) => {
	const p = await me(context.userId);
	if (!isStaff(p)) return {
		ok: false,
		error: "Staff only."
	};
	const sql = await getSql();
	const d = await sql.query(`select * from deals where id = $1`, [data.dealId]);
	if (!d[0]) return {
		ok: false,
		error: "Deal not found"
	};
	const tenant = d[0].org_id ? await sql.query(`select id from tenants where org_id = $1`, [Number(d[0].org_id)]) : [];
	const ins = await sql.query(`insert into projects (name, deal_id, status, owner_id, tenant_id, stage_label, value, venue, start_date, end_date)
       values ($1,$2,'open',$3,$4,'Signed/Invoiced',$5,$6, current_date, current_date + 14) returning id`, [
		String(d[0].title),
		data.dealId,
		Number(d[0].owner_id ?? 1),
		tenant[0] ? Number(tenant[0].id) : null,
		Number(d[0].value),
		d[0].venue ? String(d[0].venue) : null
	]);
	return {
		ok: true,
		id: Number(ins[0].id)
	};
});
var getBranding_createServerFn_handler = createServerRpc({
	id: "88a3ac8cf6ac316abf8bf759f28524fc3723a079b10bebf0563e8f91c7cfdcd2",
	name: "getBranding",
	filename: "src/lib/portal/server.ts"
}, (opts) => getBranding.__executeServer(opts));
var getBranding = createServerFn({ method: "GET" }).handler(getBranding_createServerFn_handler, async () => {
	const r = (await (await getSql())`select * from branding where id = 1`)[0] ?? {};
	return {
		logoText: String(r.logo_text ?? "Northline"),
		primaryColor: String(r.primary_color ?? "2A3038"),
		senderName: String(r.sender_name ?? "Northline Documents"),
		reminderTemplate: String(r.reminder_template ?? ""),
		watermarkText: String(r.watermark_text ?? "CONFIDENTIAL"),
		watermarkOpacity: Number(r.watermark_opacity ?? .12),
		pipedriveToken: r.pipedrive_token ? "••••••••" : "",
		pipedriveSyncedAt: iso(r.pipedrive_synced_at),
		driveConnected: Boolean(r.drive_connected ?? true),
		zohoOrg: r.zoho_org ? String(r.zoho_org) : ""
	};
});
var saveBranding_createServerFn_handler = createServerRpc({
	id: "e6076d76338ef471f769a21d9968d55284d1a3e77d319c4fbb7f854a4823c377",
	name: "saveBranding",
	filename: "src/lib/portal/server.ts"
}, (opts) => saveBranding.__executeServer(opts));
var saveBranding = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveBranding_createServerFn_handler, async ({ data }) => {
	await (await getSql()).query(`update branding set
        logo_text = coalesce($1, logo_text),
        primary_color = coalesce($2, primary_color),
        sender_name = coalesce($3, sender_name),
        reminder_template = coalesce($4, reminder_template),
        watermark_text = coalesce($5, watermark_text),
        pipedrive_token = coalesce($6, pipedrive_token),
        zoho_org = coalesce($7, zoho_org)
       where id = 1`, [
		data.logoText ?? null,
		data.primaryColor ?? null,
		data.senderName ?? null,
		data.reminderTemplate ?? null,
		data.watermarkText ?? null,
		data.pipedriveToken ?? null,
		data.zohoOrg ?? null
	]);
	return { ok: true };
});
var syncPipedrive_createServerFn_handler = createServerRpc({
	id: "092c550a3b7d2e4fc350b575d91af45ed8c27d045f51f4cb63c66610c8040720",
	name: "syncPipedrive",
	filename: "src/lib/portal/server.ts"
}, (opts) => syncPipedrive.__executeServer(opts));
var syncPipedrive = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(syncPipedrive_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await sql.query(`update branding set pipedrive_synced_at = now() where id = 1`);
	await writeAudit(await me(context.userId), "pipedrive.sync", "all");
	const people = await sql`select count(*)::int as n from people`;
	const deals = await sql`select count(*)::int as n from deals`;
	return {
		ok: true,
		people: Number(people[0].n),
		deals: Number(deals[0].n),
		at: (/* @__PURE__ */ new Date()).toISOString()
	};
});
var submitEventRequest_createServerFn_handler = createServerRpc({
	id: "5eaed6df3f84abfbd8a23c9cd07497e5b17ef918ec598f0a4b533830dba1ac6e",
	name: "submitEventRequest",
	filename: "src/lib/portal/server.ts"
}, (opts) => submitEventRequest.__executeServer(opts));
var submitEventRequest = createServerFn({ method: "POST" }).validator((input) => input).handler(submitEventRequest_createServerFn_handler, async ({ data }) => {
	await (await getSql()).query(`insert into event_requests (name, email, event_date, venue, guests, notes) values ($1,$2,$3,$4,$5,$6)`, [
		data.name,
		data.email,
		data.eventDate ?? null,
		data.venue ?? null,
		data.guests ?? null,
		data.notes ?? null
	]);
	return { ok: true };
});
var submitContact_createServerFn_handler = createServerRpc({
	id: "c14e39c19b8dfb159be89529b7b16b78e09c4fa6c68077ed0590d0b38c1783da",
	name: "submitContact",
	filename: "src/lib/portal/server.ts"
}, (opts) => submitContact.__executeServer(opts));
var submitContact = createServerFn({ method: "POST" }).validator((input) => input).handler(submitContact_createServerFn_handler, async ({ data }) => {
	await (await getSql()).query(`insert into contact_entries (name, email, message) values ($1,$2,$3)`, [
		data.name,
		data.email,
		data.message
	]);
	return { ok: true };
});
var listEventRequests_createServerFn_handler = createServerRpc({
	id: "ee8154a883c00eda0f221665e583ee39f89127b03e94162dc769f8584786a5da",
	name: "listEventRequests",
	filename: "src/lib/portal/server.ts"
}, (opts) => listEventRequests.__executeServer(opts));
var listEventRequests = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listEventRequests_createServerFn_handler, async ({ context }) => {
	const p = await me(context.userId);
	if (!isStaff(p)) return [];
	return (await (await getSql())`select * from event_requests order by created_at desc`).map((r) => ({
		id: Number(r.id),
		name: String(r.name),
		email: String(r.email),
		eventDate: iso(r.event_date),
		venue: r.venue ? String(r.venue) : "",
		guests: r.guests == null ? null : Number(r.guests),
		notes: r.notes ? String(r.notes) : "",
		status: String(r.status)
	}));
});
var setNotifPref_createServerFn_handler = createServerRpc({
	id: "52c73266103d4bee47bfeb546011e997f94c531fb5c001ae1095b4b0e56a3041",
	name: "setNotifPref",
	filename: "src/lib/portal/server.ts"
}, (opts) => setNotifPref.__executeServer(opts));
var setNotifPref = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(setNotifPref_createServerFn_handler, async ({ context, data }) => {
	const p = await me(context.userId);
	const tid = data.tenantId ?? p.tenantId;
	if (!tid) return { ok: false };
	await (await getSql()).query(`insert into notification_prefs (tenant_id, kind, enabled) values ($1,$2,$3)
       on conflict (tenant_id, kind) do update set enabled = excluded.enabled`, [
		tid,
		data.kind,
		data.enabled
	]);
	return { ok: true };
});
var listNotifPrefs_createServerFn_handler = createServerRpc({
	id: "852bdd6cd58d005dcdf6371fe3f12602639f5feb4ae5e36edcd37230c40fa917",
	name: "listNotifPrefs",
	filename: "src/lib/portal/server.ts"
}, (opts) => listNotifPrefs.__executeServer(opts));
var listNotifPrefs = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listNotifPrefs_createServerFn_handler, async ({ context }) => {
	const p = await me(context.userId);
	const sql = await getSql();
	const tid = effectiveTenantId(p);
	return (tid ? await sql.query(`select * from notification_prefs where tenant_id = $1`, [tid]) : await sql.query(`select * from notification_prefs`)).map((r) => ({
		tenantId: Number(r.tenant_id),
		kind: String(r.kind),
		enabled: Boolean(r.enabled)
	}));
});
var getEsignMonitor_createServerFn_handler = createServerRpc({
	id: "07fc547dc5f81cd3b6ba27fe94fa789ee709f60f6d1175c24ddf6056d2b25aaf",
	name: "getEsignMonitor",
	filename: "src/lib/portal/server.ts"
}, (opts) => getEsignMonitor.__executeServer(opts));
var getEsignMonitor = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getEsignMonitor_createServerFn_handler, async ({ context }) => {
	const p = await me(context.userId);
	if (!isStaff(p)) return {
		flags: [],
		envelopes: []
	};
	return {
		flags: [{
			id: "geo",
			label: "Signer IP outside expected country",
			severity: "warn"
		}, {
			id: "kba",
			label: "KBA not used on high-value envelope #2",
			severity: "info"
		}],
		envelopes: (await (await getSql())`select e.*, d.name as doc_name from esign_envelopes e left join documents d on d.id = e.document_id`).map((e) => ({
			id: Number(e.id),
			name: String(e.doc_name ?? e.id),
			status: String(e.status),
			auth: String(e.auth_method)
		}))
	};
});
var getEnvelopePublic_createServerFn_handler = createServerRpc({
	id: "f13c903674b00137bf6282a506ba7d856b0ff836e29f69dc0d1daf5d1edde83b",
	name: "getEnvelopePublic",
	filename: "src/lib/portal/server.ts"
}, (opts) => getEnvelopePublic.__executeServer(opts));
var getEnvelopePublic = createServerFn({ method: "GET" }).validator((input) => input).handler(getEnvelopePublic_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const env = await sql.query(`select e.*, d.name as doc_name, d.content from esign_envelopes e left join documents d on d.id = e.document_id where e.id = $1`, [data.id]);
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
			routingOrder: Number(r.routing_order)
		})),
		fields: fields.map((f) => ({
			id: Number(f.id),
			kind: String(f.kind),
			page: Number(f.page),
			x: Number(f.x_pct),
			y: Number(f.y_pct),
			recipientId: f.recipient_id == null ? null : Number(f.recipient_id),
			value: f.value ? String(f.value) : ""
		}))
	};
});
var updateEnvelopeStatus_createServerFn_handler = createServerRpc({
	id: "e682363827ca155e055ae4abfb133f0a303937aa94d8b165b4b6ffd314136ef0",
	name: "updateEnvelopeStatus",
	filename: "src/lib/portal/server.ts"
}, (opts) => updateEnvelopeStatus.__executeServer(opts));
var updateEnvelopeStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(updateEnvelopeStatus_createServerFn_handler, async ({ context, data }) => {
	const p = await me(context.userId);
	if (!isStaff(p)) return { ok: false };
	await (await getSql()).query(`update esign_envelopes set status = $2 where id = $1`, [data.id, data.status]);
	await writeAudit(p, "esign.status", `${data.id}:${data.status}`);
	return { ok: true };
});
var remindEnvelope_createServerFn_handler = createServerRpc({
	id: "6868c0ca30c7ea0f41a221c9e5be9f54bd31b74bc17dab5602c75a391c7b5d3c",
	name: "remindEnvelope",
	filename: "src/lib/portal/server.ts"
}, (opts) => remindEnvelope.__executeServer(opts));
var remindEnvelope = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(remindEnvelope_createServerFn_handler, async ({ context, data }) => {
	const p = await me(context.userId);
	const b = await (await getSql()).query(`select reminder_template from branding where id = 1`);
	await writeAudit(p, "esign.remind", String(data.id), String(b[0]?.reminder_template ?? "Reminder"));
	return { ok: true };
});
var addEnvelopeField_createServerFn_handler = createServerRpc({
	id: "4224834ae3a43d4539803522fe8bf6154b3834f1daef8616b23343faca9205ef",
	name: "addEnvelopeField",
	filename: "src/lib/portal/server.ts"
}, (opts) => addEnvelopeField.__executeServer(opts));
var addEnvelopeField = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(addEnvelopeField_createServerFn_handler, async ({ data }) => {
	await (await getSql()).query(`insert into esign_fields (envelope_id, recipient_id, kind, page, x_pct, y_pct) values ($1,$2,$3,1,$4,$5)`, [
		data.envelopeId,
		data.recipientId ?? null,
		data.kind,
		data.x,
		data.y
	]);
	return { ok: true };
});
//#endregion
export { addEnvelopeField_createServerFn_handler, addProjectRequest_createServerFn_handler, checkEmailGate_createServerFn_handler, completeOnboardingStep_createServerFn_handler, convertDealToProject_createServerFn_handler, createApproval_createServerFn_handler, createEnvelope_createServerFn_handler, createProposal_createServerFn_handler, decideApproval_createServerFn_handler, downloadPortalFile_createServerFn_handler, getBranding_createServerFn_handler, getDashboard_createServerFn_handler, getEnvelopePublic_createServerFn_handler, getEnvelope_createServerFn_handler, getEsignMonitor_createServerFn_handler, getPortalMe_createServerFn_handler, getPortalProject_createServerFn_handler, getProposalPublic_createServerFn_handler, inviteSubuser_createServerFn_handler, issueOtp_createServerFn_handler, listApprovals_createServerFn_handler, listAudit_createServerFn_handler, listBookmarks_createServerFn_handler, listEnvelopes_createServerFn_handler, listEventRequests_createServerFn_handler, listNotifPrefs_createServerFn_handler, listPortalFiles_createServerFn_handler, listPortalProjects_createServerFn_handler, listProposals_createServerFn_handler, listSubusers_createServerFn_handler, listTaskLists_createServerFn_handler, listTenants_createServerFn_handler, lookupDocument_createServerFn_handler, mutateBookmark_createServerFn_handler, mutateTask_createServerFn_handler, remindEnvelope_createServerFn_handler, resetPasswordWithOtp_createServerFn_handler, saveBranding_createServerFn_handler, setNotifPref_createServerFn_handler, setTenantQuota_createServerFn_handler, sharePortalFile_createServerFn_handler, signEnvelope_createServerFn_handler, submitContact_createServerFn_handler, submitEventRequest_createServerFn_handler, switchTenant_createServerFn_handler, syncPipedrive_createServerFn_handler, toggleProjectNote_createServerFn_handler, updateEnvelopeStatus_createServerFn_handler, updatePortalProfile_createServerFn_handler, uploadPortalFile_createServerFn_handler, verifyOtp_createServerFn_handler, zipPortalFiles_createServerFn_handler };
