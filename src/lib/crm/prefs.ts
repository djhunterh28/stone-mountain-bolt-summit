import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";

export const DEFAULT_COL_WIDTH = 280;
export const MIN_COL_WIDTH = 220;
export const MAX_COL_WIDTH = 520;

function colKey(pipelineId: number) {
  return `pipeline.cols.${pipelineId}`;
}

function parseWidths(raw: unknown): Record<number, number> {
  let obj: Record<string, unknown> = {};
  if (typeof raw === "string") {
    try {
      obj = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return {};
    }
  } else if (raw && typeof raw === "object") {
    obj = raw as Record<string, unknown>;
  }
  const out: Record<number, number> = {};
  for (const [k, v] of Object.entries(obj)) {
    const id = Number(k);
    const w = Number(v);
    if (Number.isInteger(id) && Number.isFinite(w)) {
      out[id] = Math.min(MAX_COL_WIDTH, Math.max(MIN_COL_WIDTH, Math.round(w)));
    }
  }
  return out;
}

export const getPipelineColWidths = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { memberId: number; pipelineId: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const row = (
      await sql.query(`select value from member_prefs where member_id = $1 and key = $2`, [
        data.memberId,
        colKey(data.pipelineId),
      ])
    )[0];
    return { widths: parseWidths(row?.value) };
  });

export const savePipelineColWidths = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { memberId: number; pipelineId: number; widths: Record<number, number> }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const member = (await sql.query(`select id from members where id = $1`, [data.memberId]))[0];
    if (!member) return { ok: false as const };
    const widths = parseWidths(data.widths);
    await sql.query(
      `insert into member_prefs (member_id, key, value, updated_at) values ($1,$2,$3,now())
       on conflict (member_id, key) do update set value = excluded.value, updated_at = now()`,
      [data.memberId, colKey(data.pipelineId), JSON.stringify(widths)],
    );
    return { ok: true as const, widths };
  });

const NAV_KEY = "nav.layout";

export type NavLayout = { pins: string[]; order: string[] };

function uniqueHrefs(list: unknown): string[] {
  const out: string[] = [];
  if (!Array.isArray(list)) return out;
  for (const item of list) {
    if (typeof item !== "string" || !item.startsWith("/") || out.includes(item)) continue;
    out.push(item);
  }
  return out;
}

export function parseNavLayout(raw: unknown): NavLayout {
  let obj: Record<string, unknown> = {};
  if (typeof raw === "string") {
    try {
      obj = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return { pins: [], order: [] };
    }
  } else if (raw && typeof raw === "object") {
    obj = raw as Record<string, unknown>;
  }
  return { pins: uniqueHrefs(obj.pins), order: uniqueHrefs(obj.order) };
}

export function mergeNavLayout(catalog: string[], saved: NavLayout): NavLayout {
  const known = new Set(catalog);
  const order = saved.order.filter((h) => known.has(h));
  for (const h of catalog) if (!order.includes(h)) order.push(h);
  const pins = saved.pins.filter((h) => known.has(h));
  return { pins, order };
}

export function insertBefore(list: string[], moving: string, before: string | null) {
  const next = list.filter((h) => h !== moving);
  if (!before) {
    next.push(moving);
    return next;
  }
  const i = next.indexOf(before);
  if (i < 0) next.push(moving);
  else next.splice(i, 0, moving);
  return next;
}

async function readPref(memberId: number, key: string) {
  const sql = await getSql();
  const row = (await sql.query(`select value from member_prefs where member_id = $1 and key = $2`, [memberId, key]))[0];
  return row?.value;
}

async function writePref(memberId: number, key: string, value: unknown) {
  const sql = await getSql();
  const member = (await sql.query(`select id from members where id = $1`, [memberId]))[0];
  if (!member) return false;
  await sql.query(
    `insert into member_prefs (member_id, key, value, updated_at) values ($1,$2,$3,now())
     on conflict (member_id, key) do update set value = excluded.value, updated_at = now()`,
    [memberId, key, JSON.stringify(value)],
  );
  return true;
}

export const getNavPrefs = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { memberId: number }) => input)
  .handler(async ({ data }) => parseNavLayout(await readPref(data.memberId, NAV_KEY)));

export const saveNavPrefs = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { memberId: number; pins: string[]; order: string[] }) => input)
  .handler(async ({ data }) => {
    const layout = { pins: uniqueHrefs(data.pins), order: uniqueHrefs(data.order) };
    const ok = await writePref(data.memberId, NAV_KEY, layout);
    if (!ok) return { ok: false as const };
    return { ok: true as const, ...layout };
  });
