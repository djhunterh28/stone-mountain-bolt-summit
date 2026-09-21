import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { iso } from "@/lib/utils";
import { authMiddleware } from "@/lib/auth/middleware";

function parseJson<T>(raw: unknown, fallback: T): T {
  if (raw == null) return fallback;
  if (typeof raw !== "string") return (raw as T) ?? fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export type FloorShape = { x: number; y: number; w: number; h: number; label?: string };

export type FloorLayout = {
  w: number;
  h: number;
  shell: FloorShape;
  rooms: FloorShape[];
  stage?: FloorShape;
  docks: FloorShape[];
  doors: { x: number; y: number; w: number; h: number; kind: "ingress" | "egress"; label: string }[];
};

export type FloorKind = "power" | "distro" | "loadin" | "ingress" | "egress" | "stage" | "seat" | "hold";

export type FloorMark = {
  id: string;
  kind: FloorKind;
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
  note?: string;
};

export type FloorPlan = {
  id: number;
  dealId: number | null;
  name: string;
  venue: string | null;
  notes: string | null;
  template: boolean;
  layout: FloorLayout;
  marks: FloorMark[];
  updatedAt: string | null;
};

export const CANVAS = { w: 100, h: 62 };

export const EMPTY_LAYOUT: FloorLayout = {
  w: 100,
  h: 62,
  shell: { x: 4, y: 4, w: 92, h: 54 },
  rooms: [],
  stage: { x: 30, y: 6, w: 40, h: 12, label: "Stage" },
  docks: [{ x: 4, y: 46, w: 16, h: 12, label: "Dock" }],
  doors: [
    { x: 4, y: 24, w: 4, h: 12, kind: "ingress", label: "In" },
    { x: 92, y: 24, w: 4, h: 12, kind: "egress", label: "Out" },
  ],
};

export const KINDS: { id: FloorKind; label: string; zone: boolean; hint: string }[] = [
  { id: "power", label: "Outlet", zone: false, hint: "House or wall outlet" },
  { id: "distro", label: "Distro", zone: false, hint: "Company switch / distro" },
  { id: "loadin", label: "Load-in", zone: false, hint: "Dock, freight, street" },
  { id: "ingress", label: "Ingress", zone: false, hint: "Public or talent in" },
  { id: "egress", label: "Egress", zone: false, hint: "Fire stair, house out" },
  { id: "stage", label: "Staging", zone: true, hint: "Stage, IMAG, LED" },
  { id: "seat", label: "Seating", zone: true, hint: "Rounds, theatre, village" },
  { id: "hold", label: "Restricted", zone: true, hint: "Green, FOH, hard hold" },
];

export const ZONE_SIZE: Record<string, { w: number; h: number }> = {
  stage: { w: 22, h: 10 },
  seat: { w: 28, h: 14 },
  hold: { w: 14, h: 10 },
};

function mapPlan(p: Record<string, unknown>): FloorPlan {
  const layout = parseJson<FloorLayout>(p.layout, EMPTY_LAYOUT);
  return {
    id: Number(p.id),
    dealId: p.deal_id == null ? null : Number(p.deal_id),
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
      doors: layout.doors ?? [],
    },
    marks: parseJson<FloorMark[]>(p.marks, []),
    updatedAt: iso(p.updated_at),
  };
}

export const getFloorPlans = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { dealId?: number } = {}) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = data.dealId
      ? await sql.query(
          `select * from floor_plans
           where archived is not true
             and (deal_id = $1 or (template is true and deal_id is null))
           order by template desc, id`,
          [data.dealId],
        )
      : await sql.query(`select * from floor_plans where archived is not true order by template desc, id`);
    return rows.map(mapPlan);
  });

export const saveFloorPlan = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      id: number;
      marks?: FloorMark[];
      layout?: FloorLayout;
      name?: string;
      venue?: string | null;
      notes?: string | null;
    }) => input,
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const cur = (await sql.query(`select * from floor_plans where id = $1`, [data.id]))[0];
    if (!cur) return { ok: false as const };
    await sql.query(
      `update floor_plans set
        marks = $1, layout = $2, name = $3, venue = $4, notes = $5, updated_at = now()
       where id = $6`,
      [
        JSON.stringify(data.marks ?? parseJson(cur.marks, [])),
        JSON.stringify(data.layout ?? parseJson(cur.layout, EMPTY_LAYOUT)),
        data.name ?? String(cur.name),
        data.venue === undefined ? (cur.venue == null ? null : String(cur.venue)) : data.venue,
        data.notes === undefined ? (cur.notes == null ? null : String(cur.notes)) : data.notes,
        data.id,
      ],
    );
    return { ok: true as const };
  });

export const createFloorPlan = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { name: string; venue?: string; dealId?: number; template?: boolean }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const isTemplate = data.template === true && data.dealId == null;
    const rows = await sql.query(
      `insert into floor_plans (name, venue, template, deal_id, layout, marks, notes)
       values ($1, $2, $3, $4, $5, '[]', null) returning *`,
      [
        data.name.trim() || (isTemplate ? "New venue" : "Show plot"),
        data.venue?.trim() || null,
        isTemplate,
        data.dealId ?? null,
        JSON.stringify(EMPTY_LAYOUT),
      ],
    );
    return mapPlan(rows[0]);
  });

export const duplicateFloorPlan = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; dealId: number; name?: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const cur = (await sql.query(`select * from floor_plans where id = $1`, [data.id]))[0];
    if (!cur) return { ok: false as const };
    const deal = (await sql.query(`select id, title, venue from deals where id = $1`, [data.dealId]))[0];
    if (!deal) return { ok: false as const };
    const name = data.name?.trim() || `${String(deal.title)} — ${String(cur.name)}`;
    const rows = await sql.query(
      `insert into floor_plans (name, venue, template, deal_id, notes, layout, marks)
       values ($1, $2, false, $3, $4, $5, $6) returning *`,
      [name, deal.venue ?? cur.venue, data.dealId, cur.notes, cur.layout, cur.marks],
    );
    return { ok: true as const, plan: mapPlan(rows[0]) };
  });

export const archiveFloorPlan = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    await (await getSql()).query(`update floor_plans set archived = true, updated_at = now() where id = $1`, [data.id]);
    return { ok: true as const };
  });
