import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { iso, money } from "@/lib/utils";
import { mapLead } from "./map";
import type { Lead } from "./types";

export const EVENT_TYPES = [
  "Corporate gala",
  "Conference / keynote",
  "Product launch",
  "Concert / live music",
  "Wedding",
  "Private / members",
  "Brand activation",
  "Festival / outdoor",
  "Dry hire",
  "Partnership",
] as const;

export const LEAD_STAGES: { id: Lead["status"]; label: string; hint: string }[] = [
  { id: "new", label: "New", hint: "Just landed" },
  { id: "contacted", label: "Contacted", hint: "AE has reached out" },
  { id: "qualified", label: "Qualified", hint: "Fit confirmed" },
  { id: "nurture", label: "Nurture", hint: "Not this season" },
  { id: "disqualified", label: "Disqualified", hint: "Not our work" },
];

export const DISQUALIFY_REASONS = [
  "Out of market",
  "Too small",
  "Not a fit",
  "Duplicate",
  "No response",
  "Already booked elsewhere",
];

export const LEAD_SOURCES = [
  "Web form",
  "Chatbot",
  "Live chat",
  "Prospector",
  "Referral",
  "Repeat",
  "Email",
  "Inbound",
  "Partner",
  "Import",
  "Manual",
  "Cold reply",
];

export type FunnelStep = {
  key: string;
  label: string;
  count: number;
  value: number;
  hint: string;
};

export type SourceRow = {
  name: string;
  leads: number;
  deals: number;
  won: number;
  lost: number;
  cancelled: number;
  leadValue: number;
  wonValue: number;
  convertRate: number;
  winRate: number;
};

export type TypeRow = {
  name: string;
  open: number;
  won: number;
  lost: number;
  cancelled: number;
  value: number;
  wonValue: number;
};

export type ClosedRow = {
  id: number;
  title: string;
  value: number;
  reason: string | null;
  at: string | null;
  source: string | null;
  eventType: string | null;
  orgName: string | null;
  venue: string | null;
  ownerName: string | null;
};

export type MoveRow = {
  id: string;
  kind: "deal" | "lead";
  entityId: number;
  title: string;
  action: string;
  detail: string | null;
  at: string;
};

export type LifecycleDesk = {
  kpis: {
    inquiries90: number;
    qualifyRate: number;
    convertRate: number;
    winRate: number;
    cancelRate: number;
    avgDaysToWon: number;
    openValue: number;
    lostValue: number;
    cancelledValue: number;
  };
  funnel: FunnelStep[];
  exits: FunnelStep[];
  pipeline: { name: string; count: number; value: number }[];
  types: TypeRow[];
  sources: SourceRow[];
  lost: ClosedRow[];
  cancelled: ClosedRow[];
  recent: MoveRow[];
  leads: Lead[];
};

function pct(n: number, d: number) {
  if (!d) return 0;
  return Math.round((n / d) * 100);
}

function closedRow(r: Record<string, unknown>): ClosedRow {
  return {
    id: Number(r.id),
    title: String(r.title),
    value: money(r.value),
    reason: r.lost_reason == null ? null : String(r.lost_reason),
    at: iso(r.lost_at) ?? iso(r.cancelled_at) ?? iso(r.updated_at),
    source: r.source == null ? null : String(r.source),
    eventType: r.event_type == null ? null : String(r.event_type),
    orgName: r.org_name == null ? null : String(r.org_name),
    venue: r.venue == null ? null : String(r.venue),
    ownerName: r.owner_name == null ? null : String(r.owner_name),
  };
}

export const getLifecycleDesk = createServerFn({ method: "GET" })
  .handler(async (): Promise<LifecycleDesk> => {
    const sql = await getSql();
    const deals = await sql`
      select d.*, o.name as org_name, m.name as owner_name, s.name as stage_name, s.sort_order as stage_sort
      from deals d
      left join organizations o on o.id = d.org_id
      left join members m on m.id = d.owner_id
      left join stages s on s.id = d.stage_id`;
    const leadRows = await sql`
      select l.*, p.name as person_name, p.email as person_email, o.name as org_name,
        m.name as owner_name, m.initials as owner_initials, m.tone as owner_tone,
        extract(epoch from (now() - coalesce(l.stage_entered_at, l.created_at))) / 86400.0 as days_in_stage
      from leads l
      left join people p on p.id = l.person_id
      left join organizations o on o.id = l.org_id
      left join members m on m.id = l.owner_id
      where l.status <> 'archived'
      order by l.score desc, l.created_at desc`;
    const leads = leadRows.map(mapLead);

    let inquiries90 = 0;
    try {
      const inq = await sql`select coalesce(sum(leads + deals + forms), 0) as n from inquiry_log where day >= current_date - 90`;
      inquiries90 = Number(inq[0]?.n ?? 0);
    } catch {
      inquiries90 = leads.length;
    }

    const open = deals.filter((d) => String(d.status) === "open");
    const won = deals.filter((d) => String(d.status) === "won");
    const lost = deals.filter((d) => String(d.status) === "lost");
    const cancelled = deals.filter((d) => String(d.status) === "cancelled");
    const complete = won.filter((d) => {
      const day = iso(d.event_date)?.slice(0, 10);
      return day ? day < new Date().toISOString().slice(0, 10) : false;
    });

    const byStatus = (s: Lead["status"]) => leads.filter((l) => l.status === s);
    const newLeads = byStatus("new");
    const contacted = byStatus("contacted");
    const qualified = byStatus("qualified");
    const nurture = byStatus("nurture");
    const converted = byStatus("converted");
    const disqualified = byStatus("disqualified");

    const leadValue = (list: Lead[]) => list.reduce((s, l) => s + l.estimatedValue, 0);
    const dealValue = (list: typeof deals) => list.reduce((s, d) => s + money(d.value), 0);

    const worked = leads.filter((l) => l.status !== "new").length;
    const qualifyPool = qualified.length + converted.length + disqualified.length;
    const convertPool = converted.length + qualified.length + disqualified.length;
    const closedComp = won.length + lost.length;
    const closedAll = won.length + lost.length + cancelled.length;

    const daysToWon = won
      .map((d) => {
        const a = d.created_at ? new Date(String(d.created_at)).getTime() : NaN;
        const b = d.won_at ? new Date(String(d.won_at)).getTime() : NaN;
        if (Number.isNaN(a) || Number.isNaN(b)) return null;
        return Math.max(0, Math.round((b - a) / 86400000));
      })
      .filter((n): n is number => n != null);
    const avgDaysToWon = daysToWon.length
      ? Math.round(daysToWon.reduce((s, n) => s + n, 0) / daysToWon.length)
      : 0;

    const funnel: FunnelStep[] = [
      { key: "inquiry", label: "Inquiry", count: inquiries90, value: 0, hint: "90-day inbound" },
      { key: "new", label: "New", count: newLeads.length, value: leadValue(newLeads), hint: "Unworked" },
      { key: "contacted", label: "Contacted", count: contacted.length, value: leadValue(contacted), hint: "AE in motion" },
      { key: "qualified", label: "Qualified", count: qualified.length, value: leadValue(qualified), hint: "Ready to convert" },
      { key: "pipeline", label: "Pipeline", count: open.length, value: dealValue(open), hint: "Live events book" },
      { key: "won", label: "Won", count: won.length, value: dealValue(won), hint: "Signed" },
      { key: "complete", label: "Complete", count: complete.length, value: dealValue(complete), hint: "Event date passed" },
    ];

    const exits: FunnelStep[] = [
      { key: "nurture", label: "Nurture", count: nurture.length, value: leadValue(nurture), hint: "Next season" },
      { key: "disqualified", label: "Disqualified", count: disqualified.length, value: leadValue(disqualified), hint: "Not our work" },
      { key: "lost", label: "Lost", count: lost.length, value: dealValue(lost), hint: "Competitive" },
      { key: "cancelled", label: "Cancelled", count: cancelled.length, value: dealValue(cancelled), hint: "Event died" },
    ];

    const pipeMap = new Map<string, { count: number; value: number; sort: number }>();
    for (const d of open) {
      const name = String(d.stage_name ?? "—");
      const cur = pipeMap.get(name) ?? { count: 0, value: 0, sort: Number(d.stage_sort ?? 99) };
      cur.count += 1;
      cur.value += money(d.value);
      pipeMap.set(name, cur);
    }
    const pipeline = [...pipeMap.entries()]
      .sort((a, b) => a[1].sort - b[1].sort)
      .map(([name, v]) => ({ name, count: v.count, value: v.value }));

    const typeNames = new Set<string>(EVENT_TYPES);
    for (const d of deals) if (d.event_type) typeNames.add(String(d.event_type));
    for (const l of leads) if (l.eventType) typeNames.add(l.eventType);
    const types: TypeRow[] = [...typeNames].map((name) => {
      const of = deals.filter((d) => String(d.event_type ?? "") === name);
      return {
        name,
        open: of.filter((d) => String(d.status) === "open").length,
        won: of.filter((d) => String(d.status) === "won").length,
        lost: of.filter((d) => String(d.status) === "lost").length,
        cancelled: of.filter((d) => String(d.status) === "cancelled").length,
        value: dealValue(of.filter((d) => String(d.status) === "open")),
        wonValue: dealValue(of.filter((d) => String(d.status) === "won")),
      };
    }).filter((t) => t.open + t.won + t.lost + t.cancelled > 0);

    const sourceNames = new Set<string>();
    for (const d of deals) sourceNames.add(String(d.source ?? "Unknown"));
    for (const l of leads) sourceNames.add(l.source || "Unknown");
    const sources: SourceRow[] = [...sourceNames]
      .map((name) => {
        const ld = leads.filter((l) => l.source === name);
        const of = deals.filter((d) => String(d.source ?? "Unknown") === name);
        const wonN = of.filter((d) => String(d.status) === "won").length;
        const lostN = of.filter((d) => String(d.status) === "lost").length;
        return {
          name,
          leads: ld.length,
          deals: of.length,
          won: wonN,
          lost: lostN,
          cancelled: of.filter((d) => String(d.status) === "cancelled").length,
          leadValue: leadValue(ld),
          wonValue: dealValue(of.filter((d) => String(d.status) === "won")),
          convertRate: pct(of.length, ld.length + of.length || 1),
          winRate: pct(wonN, wonN + lostN),
        };
      })
      .filter((s) => s.leads + s.deals > 0)
      .sort((a, b) => b.wonValue + b.leadValue - (a.wonValue + a.leadValue));

    const lostRows = lost
      .map(closedRow)
      .sort((a, b) => (b.at ?? "").localeCompare(a.at ?? ""));
    const cancelledRows = cancelled
      .map(closedRow)
      .sort((a, b) => (b.at ?? "").localeCompare(a.at ?? ""));

    const recent: MoveRow[] = [];
    try {
      const hist = await sql`
        select 'deal'::text as kind, h.deal_id as entity_id, d.title, h.action, h.detail, h.created_at
        from deal_history h join deals d on d.id = h.deal_id
        union all
        select 'lead'::text, h.lead_id, l.title, h.action, h.detail, h.created_at
        from lead_history h join leads l on l.id = h.lead_id
        order by created_at desc
        limit 16`;
      for (const r of hist) {
        recent.push({
          id: `${r.kind}-${r.entity_id}-${r.created_at}`,
          kind: String(r.kind) === "lead" ? "lead" : "deal",
          entityId: Number(r.entity_id),
          title: String(r.title),
          action: String(r.action),
          detail: r.detail == null ? null : String(r.detail),
          at: iso(r.created_at) ?? "",
        });
      }
    } catch {
      /* history optional */
    }

    return {
      kpis: {
        inquiries90,
        qualifyRate: pct(qualified.length + converted.length, qualifyPool || worked || 1),
        convertRate: pct(converted.length, convertPool || 1),
        winRate: pct(won.length, closedComp),
        cancelRate: pct(cancelled.length, closedAll),
        avgDaysToWon,
        openValue: dealValue(open),
        lostValue: dealValue(lost),
        cancelledValue: dealValue(cancelled),
      },
      funnel,
      exits,
      pipeline,
      types: types.sort((a, b) => b.value + b.wonValue - (a.value + a.wonValue)),
      sources,
      lost: lostRows,
      cancelled: cancelledRows,
      recent,
      leads,
    };
  });
