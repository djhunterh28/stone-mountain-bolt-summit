import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { iso, money } from "@/lib/utils";
import { authMiddleware } from "@/lib/auth/middleware";
import { runAi } from "./ai";
import { deliverSms } from "./sms";

function parseJson<T>(raw: unknown, fallback: T): T {
  if (typeof raw !== "string") return (raw as T) ?? fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export type Faq = { q: string; a: string };

export const getAiDesk = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const p = (await sql`select * from ai_profile where id = 1`)[0];
    const drafts = (await sql`select d.*, deals.title as deal_title from ai_drafts d left join deals on deals.id = d.deal_id order by d.id desc limit 12`).map(
      (r) => ({
        id: Number(r.id),
        dealId: r.deal_id == null ? null : Number(r.deal_id),
        dealTitle: r.deal_title == null ? null : String(r.deal_title),
        prompt: String(r.prompt),
        body: String(r.body),
        sent: Boolean(r.sent),
        createdAt: iso(r.created_at) ?? "",
      }),
    );
    const findings = (
      await sql`select f.*, deals.title as deal_title from prep_findings f left join deals on deals.id = f.deal_id where dismissed = false order by f.id`
    ).map((r) => ({
      id: Number(r.id),
      dealId: Number(r.deal_id),
      dealTitle: r.deal_title == null ? null : String(r.deal_title),
      kind: String(r.kind),
      severity: String(r.severity),
      detail: String(r.detail),
      source: String(r.source),
      verified: Boolean(r.verified),
    }));
    const chats = (await sql`select * from widget_chats order by id desc limit 8`).map((r) => ({
      id: Number(r.id),
      visitor: String(r.visitor),
      question: String(r.question),
      answer: String(r.answer),
      lead: Boolean(r.lead_captured),
    }));
    return {
      profile: {
        tone: String(p?.tone ?? "professional"),
        specialties: String(p?.specialties ?? ""),
        serviceArea: String(p?.service_area ?? ""),
        greeting: String(p?.greeting ?? ""),
        brandColor: String(p?.brand_color ?? "0D47A1"),
        packages: parseJson<string[]>(p?.packages, []),
        faqs: parseJson<Faq[]>(p?.faqs, []),
        widgetSlug: String(p?.widget_slug ?? "northline"),
        portalDomain: String(p?.portal_domain ?? "portal.hurricaneproductionsllc.com"),
        mailConnected: p?.mail_connected !== false,
        mailProvider: String(p?.mail_provider ?? "gmail"),
        vertical: String(p?.vertical ?? "live entertainment"),
        company: String(p?.company ?? "Hurricane Productions"),
      },
      drafts,
      findings,
      chats,
    };
  });

export const saveAiProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      tone: string;
      specialties: string;
      serviceArea: string;
      greeting: string;
      packages: string;
      faqsJson?: string;
      portalDomain?: string;
      mailConnected?: boolean;
      mailProvider?: string;
    }) => input,
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql.query(
      `update ai_profile set tone = $1, specialties = $2, service_area = $3, greeting = $4, packages = $5,
         portal_domain = coalesce($6, portal_domain), faqs = coalesce($7, faqs),
         mail_connected = coalesce($8, mail_connected), mail_provider = coalesce($9, mail_provider) where id = 1`,
      [
        data.tone,
        data.specialties,
        data.serviceArea,
        data.greeting,
        data.packages,
        data.portalDomain ?? null,
        data.faqsJson ?? null,
        data.mailConnected ?? null,
        data.mailProvider ?? null,
      ],
    );
    return { ok: true };
  });

function fillTags(template: string, ctx: Record<string, string>) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) => ctx[k] ?? "");
}

export const draftFromDeal = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { dealId: number; prompt: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const deal = (
      await sql.query(
        `select d.*, o.name as org_name, p.name as person_name, m.name as ae, m.email as ae_email
         from deals d left join organizations o on o.id = d.org_id left join people p on p.id = d.person_id
         left join members m on m.id = d.owner_id where d.id = $1`,
        [data.dealId],
      )
    )[0];
    if (!deal) return { ok: false as const, error: "Deal not found" };
    const profile = (await sql`select * from ai_profile where id = 1`)[0];
    const sig = (await sql`select body from mail_signatures where member_id = ${deal.owner_id ?? 1}`)[0];
    const ctx = {
      client: String(deal.person_name ?? deal.org_name ?? "there"),
      venue: String(deal.venue ?? "the venue"),
      event: String(deal.title),
      event_date: deal.event_date ? String(deal.event_date).slice(0, 10) : "TBD",
      ae: String(deal.ae ?? "Dana"),
      phone: "718-555-0140",
      load_in: String(deal.load_in ?? "TBD"),
      package: String(profile?.packages ?? "production"),
      signature: fillTags(String(sig?.body ?? "{{ae}}\nNorthline"), {
        ae: String(deal.ae ?? "Dana"),
        phone: "718-555-0140",
        event: String(deal.title),
        venue: String(deal.venue ?? ""),
      }),
    };
    const fallback = fillTags(
      `Hi {{client}},\n\n${data.prompt || "Following up on {{event}}."}\n\nWe're holding {{venue}} on {{event_date}} with load-in at {{load_in}}. Tone is ${String(profile?.tone ?? "professional")} — short, specific, no fluff.\n\n{{signature}}`,
      ctx,
    );
    let body = fallback;
    const ai = await runAi({
      data: {
        kind: "email",
        prompt: `Tone: ${profile?.tone}. ${data.prompt}. Client ${ctx.client}, event ${ctx.event} at ${ctx.venue} on ${ctx.event_date}. Sign as ${ctx.ae}.`,
      },
    });
    if (ai.ok && ai.text) body = fillTags(`${ai.text}\n\n{{signature}}`, ctx);
    await sql.query(`insert into ai_drafts (deal_id, prompt, body, tone) values ($1,$2,$3,$4)`, [
      data.dealId,
      data.prompt,
      body,
      String(profile?.tone ?? "professional"),
    ]);
    return { ok: true as const, body };
  });

export const sendAiDraft = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const row = (
      await sql.query(
        `select d.*, deals.person_id, deals.title as deal_title, p.email, p.name as person
         from ai_drafts d
         left join deals on deals.id = d.deal_id
         left join people p on p.id = deals.person_id
         where d.id = $1`,
        [data.id],
      )
    )[0];
    if (!row) return { ok: false as const, error: "Draft not found" };
    const to = row.email ? String(row.email) : null;
    if (!to) return { ok: false as const, error: "No client email on the event" };
    const { insertOutbound } = await import("./domain");
    await insertOutbound(sql, {
      purpose: "compose",
      mailKind: "compose",
      toAddr: to,
      subject: `Re: ${String(row.deal_title ?? "your event")}`,
      body: String(row.body),
      dealId: row.deal_id == null ? null : Number(row.deal_id),
      personId: row.person_id == null ? null : Number(row.person_id),
      fallbackName: "Hurricane Productions",
      hintAddr: "shows@hurricaneproductionsllc.com",
    });
    await sql.query(`update ai_drafts set sent = true where id = $1`, [data.id]);
    return { ok: true as const, error: null as string | null };
  });

export const runPrepInspector = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const profile = (await sql`select * from ai_profile where id = 1`)[0];
    const deals = await sql.query(
      `select d.*, p.name as person_name, p.email as person_email, o.name as org_name
       from deals d
       left join people p on p.id = d.person_id
       left join organizations o on o.id = d.org_id
       where d.status in ('open','won')`,
    );
    const emails = await sql.query(`select deal_id, subject, body from emails where deal_id is not null order by id desc limit 80`);
    const byPerson = new Map<number, { id: number; title: string; date: string }[]>();
    for (const d of deals) {
      const pid = d.person_id == null ? null : Number(d.person_id);
      const date = d.event_date ? String(d.event_date).slice(0, 10) : "";
      if (!pid || !date) continue;
      const list = byPerson.get(pid) ?? [];
      list.push({ id: Number(d.id), title: String(d.title), date });
      byPerson.set(pid, list);
    }
    let added = 0;
    for (const d of deals) {
      const id = Number(d.id);
      const gaps: { kind: string; severity: string; detail: string; source: string }[] = [];
      if (!d.load_in) gaps.push({ kind: "timed section", severity: "warn", detail: "Load-in is empty on the record.", source: "record" });
      if (!d.event_date) gaps.push({ kind: "timed section", severity: "warn", detail: "Event date is empty — cannot place it on the calendar.", source: "record" });
      if (!d.venue) gaps.push({ kind: "timed section", severity: "warn", detail: "Venue is blank — cannot lock a dock time.", source: "record" });
      if (money(d.value) === 0 && String(d.status) === "won") {
        gaps.push({ kind: "zero book", severity: "risk", detail: "Signed book sits at $0.", source: "record" });
      }
      const pid = d.person_id == null ? null : Number(d.person_id);
      const date = d.event_date ? String(d.event_date).slice(0, 10) : "";
      if (pid && date) {
        const clash = (byPerson.get(pid) ?? []).find((x) => x.id !== id && x.date === date);
        if (clash) {
          gaps.push({
            kind: "conflicting contact",
            severity: "risk",
            detail: `${d.person_name ?? "This client"} is also on ${clash.title} the same night.`,
            source: "record",
          });
        }
      }
      const mail = emails.filter((e) => Number(e.deal_id) === id);
      const blob = `${d.notes ?? ""} ${mail.map((e) => `${e.subject} ${e.body}`).join(" ")}`.toLowerCase();
      if (profile?.mail_connected) {
        if (/mashup|last dance|closer song|walk.?out/.test(blob) && !/on the plot|on plot/.test(blob)) {
          gaps.push({
            kind: "burn-risk closer",
            severity: "risk",
            detail: "Connected mail mentions a closer or mashup that is not on the plot.",
            source: "email",
          });
        }
        if (/two pm|conflicting|wrong contact|cc.?d the other/.test(blob)) {
          gaps.push({
            kind: "conflicting contact",
            severity: "warn",
            detail: "Mail names a second day-of contact that is not on the event record.",
            source: "email",
          });
        }
      }
      if (String(profile?.vertical ?? "").toLowerCase().includes("dj") && !/closer|last dance/.test(String(d.notes ?? "").toLowerCase())) {
        gaps.push({
          kind: "timed section",
          severity: "warn",
          detail: "DJ book — no closer / last-dance note on the record.",
          source: "record",
        });
      }
      for (const g of gaps) {
        const have = await sql.query(`select id from prep_findings where deal_id = $1 and kind = $2 and dismissed = false`, [id, g.kind]);
        if (have[0]) continue;
        await sql.query(`insert into prep_findings (deal_id, kind, severity, detail, source) values ($1,$2,$3,$4,$5)`, [
          id,
          g.kind,
          g.severity,
          g.detail,
          g.source,
        ]);
        added += 1;
      }
    }
    return { ok: true as const, added, vertical: String(profile?.vertical ?? "live entertainment") };
  });

export const markFinding = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; verified?: boolean; dismissed?: boolean }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    if (data.verified != null) await sql.query(`update prep_findings set verified = $1 where id = $2`, [data.verified, data.id]);
    if (data.dismissed != null) await sql.query(`update prep_findings set dismissed = $1 where id = $2`, [data.dismissed, data.id]);
    return { ok: true };
  });

export const widgetAsk = createServerFn({ method: "POST" })
  .validator((input: { question: string; visitor?: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const p = (await sql`select * from ai_profile where id = 1`)[0];
    const faqs = parseJson<Faq[]>(p?.faqs, []);
    const q = data.question.toLowerCase();
    const pkgs = parseJson<string[]>(p?.packages, []);
    const held = (
      await sql`select event_date, venue, title from deals where event_date is not null and status in ('open','won') order by event_date limit 8`
    ).map((d) => ({
      date: String(d.event_date).slice(0, 10),
      venue: d.venue == null ? null : String(d.venue),
      title: String(d.title),
    }));
    let answer = String(p?.greeting ?? "Hurricane Productions — live event AV.");
    const hit = faqs.find((f) => q.includes(f.q.toLowerCase().slice(0, 12)) || f.q.toLowerCase().split(" ").some((w) => w.length > 4 && q.includes(w)));
    if (hit) answer = hit.a;
    else if (q.includes("price") || q.includes("cost") || q.includes("package"))
      answer = pkgs.length
        ? `Packages we surface: ${pkgs.join(", ")}. Town halls typically start around $28k. A 10% retainer holds crew and truck for 14 days.`
        : "Town halls typically start around $28k. A 10% retainer holds crew and truck for 14 days.";
    else if (q.includes("available") || q.includes("free") || q.includes("date") || q.includes("hold") || q.includes("october") || q.includes("book")) {
      const conflict = held.find((h) => q.includes(h.date.slice(5)) || (h.venue && q.includes(h.venue.toLowerCase().split(" ")[0]!)));
      answer = conflict
        ? `${conflict.venue ?? "That room"} is held for ${conflict.title} on ${conflict.date}. I can look at the next open Saturday.`
        : held.length
          ? `Live calendar: ${held.map((h) => `${h.date} · ${h.venue ?? h.title}`).join("; ")}. Tell me a date and I'll hold it.`
          : "The book is open that weekend. I can lock a 30-minute intro.";
    } else if (q.includes("area") || q.includes("brooklyn") || q.includes("nyc")) answer = String(p?.service_area ?? answer);
    const lead = /book|hold|date|october|available|package/.test(q);
    await sql.query(`insert into widget_chats (visitor, question, answer, lead_captured) values ($1,$2,$3,$4)`, [
      data.visitor ?? "web",
      data.question,
      answer,
      lead,
    ]);
    if (lead) {
      await sql.query(
        `insert into leads (title, source, status, notes) values ($1,'widget','new',$2)`,
        [`Widget: ${data.question.slice(0, 60)}`, data.question],
      ).catch(() => null);
    }
    return { answer, lead };
  });

export const getHealth = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const deals = await sql`select d.*, s.name as stage_name from deals d left join stages s on s.id = d.stage_id`;
    const invoices = await sql`select * from invoices`;
    const quotes = await sql`select * from quotes`;
    const envelopes = await sql`select deal_id, status from esign_envelopes`;
    const leads = await sql`select status from leads`;
    const won = deals.filter((d) => String(d.status) === "won");
    const lost = deals.filter((d) => String(d.status) === "lost");
    const open = deals.filter((d) => String(d.status) === "open");
    const booked = deals.filter((d) => String(d.status) === "won" || /sign|invoice/i.test(String(d.stage_name ?? "")));
    const flags = booked
      .map((d) => {
        const inv = invoices.filter((i) => Number(i.deal_id) === Number(d.id));
        const signed = envelopes.some((e) => Number(e.deal_id) === Number(d.id) && String(e.status) === "completed");
        const issues: string[] = [];
        if (!signed) issues.push("no signed contract");
        if (!inv.length) issues.push("no payment schedule");
        if (money(d.value) === 0 || inv.some((i) => money(i.amount) === 0)) issues.push("signed at $0");
        return { id: Number(d.id), title: String(d.title), issues };
      })
      .filter((f) => f.issues.length);
    const ghosted = open.filter((d) => {
      const entered = d.stage_entered_at ? new Date(String(d.stage_entered_at)).getTime() : Date.now();
      return Date.now() - entered > 14 * 86400000;
    });
    const abandoned = quotes.filter((q) => Boolean(q.abandoned)).length;
    const heat: { month: number; dow: number; n: number }[] = [];
    for (const d of deals) {
      const dt = d.created_at ? new Date(String(d.created_at)) : null;
      if (!dt) continue;
      const month = dt.getMonth();
      const dow = dt.getDay();
      const cur = heat.find((h) => h.month === month && h.dow === dow);
      if (cur) cur.n += 1;
      else heat.push({ month, dow, n: 1 });
    }
    const closed = won.length + lost.length;
    const leadN = leads.length;
    const leadConverted = leads.filter((l) => String(l.status) === "converted").length;
    return {
      flags,
      ghosted: ghosted.map((d) => ({ id: Number(d.id), title: String(d.title), days: Math.floor((Date.now() - new Date(String(d.stage_entered_at)).getTime()) / 86400000) })),
      winRate: closed ? Math.round((won.length / closed) * 100) : 0,
      won: won.length,
      lost: lost.length,
      abandoned,
      quotes: quotes.length,
      heat,
      conversion: leadN ? Math.round((leadConverted / leadN) * 100) : 0,
      leadN,
      leadConverted,
      kpis: {
        open: open.length,
        wonValue: won.reduce((s, d) => s + money(d.value), 0),
        openValue: open.reduce((s, d) => s + money(d.value), 0),
        invoiced: invoices.reduce((s, i) => s + money(i.amount), 0),
        collected: invoices.filter((i) => String(i.status) === "paid").reduce((s, i) => s + money(i.amount), 0),
      },
    };
  });

export const getOpsHome = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const upcoming = (
      await sql`select id, title, venue, event_date, value, status from deals where event_date is not null order by event_date limit 6`
    ).map((d) => ({
      id: Number(d.id),
      title: String(d.title),
      venue: d.venue == null ? null : String(d.venue),
      eventDate: iso(d.event_date),
      value: money(d.value),
      status: String(d.status),
    }));
    const feed = (
      await sql`select a.subject, a.due_at, a.done, m.name as owner from activities a left join members m on m.id = a.owner_id order by a.due_at desc nulls last limit 8`
    ).map((a) => ({
      subject: String(a.subject),
      dueAt: iso(a.due_at),
      done: Boolean(a.done),
      owner: a.owner == null ? null : String(a.owner),
    }));
    const stages = await sql`select s.name, count(d.id)::int as n, coalesce(sum(d.value),0) as v
      from stages s left join deals d on d.stage_id = s.id and d.status = 'open' and d.pipeline_id = 1
      where s.pipeline_id = 1 group by s.id, s.name, s.sort_order order by s.sort_order`;
    return {
      upcoming,
      feed,
      pipeline: stages.map((s) => ({ name: String(s.name), count: Number(s.n), value: money(s.v) })),
    };
  });

export const listEventNotes = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { dealId: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    return (
      await sql.query(
        `select n.*, m.name as author from event_notes n left join members m on m.id = n.author_id where n.deal_id = $1 order by n.pinned desc, n.id desc`,
        [data.dealId],
      )
    ).map((r) => ({
      id: Number(r.id),
      category: String(r.category),
      pinned: Boolean(r.pinned),
      body: String(r.body),
      author: r.author == null ? null : String(r.author),
      createdAt: iso(r.created_at) ?? "",
    }));
  });

export const addEventNote = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { dealId: number; body: string; category: string; pinned?: boolean; authorId?: number }) => input)
  .handler(async ({ data }) => {
    const body = data.body.trim();
    if (!body) return { ok: false as const };
    await (await getSql()).query(
      `insert into event_notes (deal_id, body, category, pinned, author_id) values ($1,$2,$3,$4,$5)`,
      [data.dealId, body, data.category, Boolean(data.pinned), data.authorId ?? 1],
    );
    return { ok: true as const };
  });

export const updateEventNote = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; body?: string; category?: string; pinned?: boolean }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    if (data.body != null) {
      await sql.query(`update event_notes set body = $2, updated_at = now() where id = $1`, [data.id, data.body]);
    }
    if (data.category != null) {
      await sql.query(`update event_notes set category = $2, updated_at = now() where id = $1`, [data.id, data.category]);
    }
    if (data.pinned != null) {
      await sql.query(`update event_notes set pinned = $2, updated_at = now() where id = $1`, [data.id, data.pinned]);
    }
    return { ok: true as const };
  });

export const pinNote = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; pinned: boolean }) => input)
  .handler(async ({ data }) => {
    await (await getSql()).query(`update event_notes set pinned = $1, updated_at = now() where id = $2`, [data.pinned, data.id]);
    return { ok: true };
  });

export const getFinance = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const invoices = (
      await sql`select i.*, o.name as org, d.title as deal from invoices i left join organizations o on o.id = i.org_id left join deals d on d.id = i.deal_id order by i.id desc`
    ).map((i) => ({
      id: Number(i.id),
      number: String(i.number),
      amount: money(i.amount),
      status: String(i.status),
      processor: i.processor == null ? null : String(i.processor),
      dueOn: iso(i.due_on),
      standalone: Boolean(i.standalone),
      memo: i.memo == null ? null : String(i.memo),
      org: i.org == null ? null : String(i.org),
      deal: i.deal == null ? null : String(i.deal),
      dealId: i.deal_id == null ? null : Number(i.deal_id),
    }));
    const payments = (await sql`select * from payments order by id desc`).map((p) => ({
      id: Number(p.id),
      invoiceId: Number(p.invoice_id),
      amount: money(p.amount),
      processor: String(p.processor),
      kind: String(p.kind),
      at: iso(p.created_at) ?? "",
    }));
    const accounts = (await sql`select * from gl_accounts order by code`).map((a) => ({
      id: Number(a.id),
      code: String(a.code),
      name: String(a.name),
      kind: String(a.kind),
    }));
    const entries = (
      await sql`select e.*, a.name as account, a.kind from gl_entries e join gl_accounts a on a.id = e.account_id order by e.posted_on desc`
    ).map((e) => ({
      id: Number(e.id),
      account: String(e.account),
      kind: String(e.kind),
      amount: money(e.amount),
      memo: e.memo == null ? null : String(e.memo),
      postedOn: iso(e.posted_on),
      recurring: Boolean(e.recurring),
    }));
    const income = entries.filter((e) => e.kind === "income").reduce((s, e) => s + e.amount, 0);
    const cogs = entries.filter((e) => e.kind === "cogs").reduce((s, e) => s + e.amount, 0);
    const opex = entries.filter((e) => e.kind === "opex").reduce((s, e) => s + e.amount, 0);
    return { invoices, payments, accounts, entries, pnl: { income, cogs, gross: income - cogs, opex, net: income - cogs - opex } };
  });

export const createStandaloneInvoice = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { orgId: number; amount: number; memo: string; processor: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const n = `NL-9${String(1000 + Math.floor(Math.random() * 800))}`;
    await sql.query(
      `insert into invoices (org_id, number, amount, status, processor, due_on, standalone, memo) values ($1,$2,$3,'open',$4, current_date + 14, true, $5)`,
      [data.orgId, n, data.amount, data.processor, data.memo],
    );
    return { ok: true, number: n };
  });

export const recordPayment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { invoiceId: number; amount: number; processor: string; kind: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql.query(`insert into payments (invoice_id, amount, processor, kind) values ($1,$2,$3,$4)`, [
      data.invoiceId,
      data.amount,
      data.processor,
      data.kind,
    ]);
    const inv = (await sql.query(`select amount from invoices where id = $1`, [data.invoiceId]))[0];
    const paid = money((await sql.query(`select coalesce(sum(amount),0) as s from payments where invoice_id = $1 and kind = 'charge'`, [data.invoiceId]))[0]?.s);
    const refunded = money((await sql.query(`select coalesce(sum(amount),0) as s from payments where invoice_id = $1 and kind = 'refund'`, [data.invoiceId]))[0]?.s);
    const net = paid - refunded;
    const status = net <= 0 ? "open" : net >= money(inv?.amount) ? "paid" : "partial";
    await sql.query(`update invoices set status = $1, paid_at = case when $1 = 'paid' then now() else paid_at end where id = $2`, [
      status,
      data.invoiceId,
    ]);
    return { ok: true, status };
  });

export const getGuests = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { dealId?: number } = {}) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = data.dealId
      ? await sql.query(
          `select g.*, d.title as deal from guests g left join deals d on d.id = g.deal_id where g.deal_id = $1 order by g.id`,
          [data.dealId],
        )
      : await sql`select g.*, d.title as deal from guests g left join deals d on d.id = g.deal_id order by g.id`;
    return rows.map((g) => ({
      id: Number(g.id),
      dealId: Number(g.deal_id),
      deal: g.deal == null ? null : String(g.deal),
      name: String(g.name),
      email: g.email == null ? null : String(g.email),
      party: Number(g.party),
      rsvp: String(g.rsvp),
      meal: g.meal == null ? null : String(g.meal),
      token: g.token == null ? null : String(g.token),
    }));
  });

export const setRsvp = createServerFn({ method: "POST" })
  .validator((input: { token: string; rsvp: string; meal?: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const row = (await sql.query(`select * from guests where token = $1`, [data.token]))[0];
    if (!row) return { ok: false as const };
    await sql.query(`update guests set rsvp = $1, meal = coalesce($2, meal) where token = $3`, [data.rsvp, data.meal ?? null, data.token]);
    return { ok: true as const, name: String(row.name) };
  });

export const getCrew = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const shifts = (
      await sql`select s.*, m.name as member, d.title as deal, d.venue from crew_shifts s
        left join members m on m.id = s.member_id left join deals d on d.id = s.deal_id order by s.starts_at`
    ).map((s) => ({
      id: Number(s.id),
      dealId: Number(s.deal_id),
      memberId: Number(s.member_id),
      member: String(s.member ?? ""),
      deal: String(s.deal ?? ""),
      venue: s.venue == null ? null : String(s.venue),
      role: String(s.role),
      startsAt: iso(s.starts_at) ?? "",
      endsAt: iso(s.ends_at) ?? "",
      kind: String(s.kind),
    }));
    return { shifts };
  });

export const getFloorPlans = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    return (await sql`select * from floor_plans order by id`).map((p) => ({
      id: Number(p.id),
      name: String(p.name),
      venue: p.venue == null ? null : String(p.venue),
      marks: parseJson<{ id: string; kind: string; x: number; y: number; label: string }[]>(p.marks, []),
    }));
  });

export const saveFloorPlan = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; marks: { id: string; kind: string; x: number; y: number; label: string }[] }) => input)
  .handler(async ({ data }) => {
    await (await getSql()).query(`update floor_plans set marks = $1, updated_at = now() where id = $2`, [
      JSON.stringify(data.marks),
      data.id,
    ]);
    return { ok: true };
  });

export const getGigs = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const gigs = (await sql`select g.*, d.title as deal from gigs g left join deals d on d.id = g.deal_id`).map((g) => ({
      id: Number(g.id),
      deal: g.deal == null ? null : String(g.deal),
      role: String(g.role),
      dayRate: money(g.day_rate),
      status: String(g.status),
      notes: g.notes == null ? null : String(g.notes),
    }));
    const apps = (await sql`select * from gig_apps`).map((a) => ({
      id: Number(a.id),
      gigId: Number(a.gig_id),
      name: String(a.name),
      stars: money(a.stars),
      bio: a.bio == null ? null : String(a.bio),
      status: String(a.status),
    }));
    return { gigs, apps };
  });

export const awardGig = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { appId: number; accept: boolean }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql.query(`update gig_apps set status = $1 where id = $2`, [data.accept ? "awarded" : "declined", data.appId]);
    if (data.accept) {
      const app = (await sql.query(`select gig_id from gig_apps where id = $1`, [data.appId]))[0];
      if (app) await sql.query(`update gigs set status = 'awarded' where id = $1`, [Number(app.gig_id)]);
    }
    return { ok: true };
  });

export const getReviews = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    return (
      await sql`select r.*, d.title as deal from reviews r left join deals d on d.id = r.deal_id order by r.id desc`
    ).map((r) => ({
      id: Number(r.id),
      dealId: r.deal_id == null ? null : Number(r.deal_id),
      deal: r.deal == null ? null : String(r.deal),
      author: r.author == null ? null : String(r.author),
      stars: Number(r.stars),
      body: r.body == null ? null : String(r.body),
      platform: r.platform == null ? null : String(r.platform),
      status: String(r.status),
    }));
  });

export const routeReview = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; platform: string }) => input)
  .handler(async ({ data }) => {
    await (await getSql()).query(`update reviews set platform = $1, status = 'published', published_at = now() where id = $2`, [
      data.platform,
      data.id,
    ]);
    return { ok: true };
  });

export const getDirectory = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  return (await sql`select * from directory_vendors order by random()`).map((v) => ({
    id: Number(v.id),
    name: String(v.name),
    city: v.city == null ? null : String(v.city),
    category: String(v.category),
    blurb: v.blurb == null ? null : String(v.blurb),
    available: Boolean(v.available),
  }));
});

export const getBroadcastDesk = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const lists = (await sql`select l.*, (select count(*) from cold_prospects c where c.list_id = l.id) as n from cold_lists l`).map(
      (l) => ({
        id: Number(l.id),
        name: String(l.name),
        tags: l.tags == null ? null : String(l.tags),
        n: Number(l.n),
      }),
    );
    const prospects = (await sql`select * from cold_prospects order by id`).map((p) => ({
      id: Number(p.id),
      listId: Number(p.list_id),
      name: String(p.name),
      email: String(p.email),
      company: p.company == null ? null : String(p.company),
      promoted: p.promoted_lead_id != null,
    }));
    const sms = (await sql`select s.*, p.name as person from sms_messages s left join people p on p.id = s.person_id order by s.id desc limit 20`).map(
      (s) => ({
        id: Number(s.id),
        person: s.person == null ? null : String(s.person),
        direction: String(s.direction),
        body: String(s.body),
        status: String(s.status),
        at: iso(s.created_at) ?? "",
      }),
    );
    const optins = (await sql`select o.*, p.name from sms_optins o join people p on p.id = o.person_id`).map((o) => ({
      name: String(o.name),
      optedIn: Boolean(o.opted_in),
      source: o.source == null ? null : String(o.source),
    }));
    const domains = (await sql`select * from sending_domains`).map((d) => ({
      id: Number(d.id),
      domain: String(d.domain),
      spf: Boolean(d.spf),
      dkim: Boolean(d.dkim),
      dmarc: Boolean(d.dmarc),
      active: Boolean(d.active),
    }));
    const signatures = (await sql`select s.*, m.name from mail_signatures s left join members m on m.id = s.member_id`).map((s) => ({
      id: Number(s.id),
      member: s.name == null ? null : String(s.name),
      body: String(s.body),
    }));
    return { lists, prospects, sms, optins, domains, signatures };
  });

export const importCold = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { listId: number; name: string; email: string; company?: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const dup = await sql.query(`select id from cold_prospects where lower(email) = $1`, [data.email.toLowerCase()]);
    if (dup[0]) return { ok: true as const, deduped: true };
    await sql.query(`insert into cold_prospects (list_id, name, email, company) values ($1,$2,$3,$4)`, [
      data.listId,
      data.name,
      data.email,
      data.company ?? null,
    ]);
    return { ok: true as const, deduped: false };
  });

export const promoteProspect = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const p = (await sql.query(`select * from cold_prospects where id = $1`, [data.id]))[0];
    if (!p) return { ok: false as const };
    const lead = await sql.query(
      `insert into leads (title, source, status, notes) values ($1,'cold-reply','new',$2) returning id`,
      [String(p.name), String(p.email)],
    );
    await sql.query(`update cold_prospects set promoted_lead_id = $1 where id = $2`, [Number(lead[0].id), data.id]);
    return { ok: true as const };
  });

export const sendSms = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { personId: number; body: string; dealId?: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    return deliverSms(sql, { personId: data.personId, dealId: data.dealId, body: data.body, kind: "custom" });
  });

export const getQuotes = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    return (await sql`select * from quotes order by id desc`).map((q) => ({
      id: Number(q.id),
      name: q.person_name == null ? null : String(q.person_name),
      email: q.email == null ? null : String(q.email),
      eventType: q.event_type == null ? null : String(q.event_type),
      guests: q.guest_count == null ? null : Number(q.guest_count),
      indoor: q.indoor == null ? null : Boolean(q.indoor),
      date: q.date == null ? null : String(q.date),
      total: money(q.total),
      status: String(q.status),
      abandoned: Boolean(q.abandoned),
    }));
  });

export const submitQuote = createServerFn({ method: "POST" })
  .validator(
    (input: { name: string; email: string; eventType: string; guests: number; indoor: boolean; date: string }) => input,
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const base = data.eventType === "Gala / awards" ? 380 : data.eventType === "Rooftop concert" ? 220 : 160;
    const weather = data.indoor ? 0 : 4500;
    const total = Math.round(base * data.guests + weather);
    await sql.query(
      `insert into quotes (person_name, email, event_type, guest_count, indoor, date, total, status) values ($1,$2,$3,$4,$5,$6,$7,'sent')`,
      [data.name, data.email, data.eventType, data.guests, data.indoor, data.date, total],
    );
    await sql.query(`insert into leads (title, source, status, notes) values ($1,'quote-form','new',$2)`, [
      `${data.eventType} — ${data.name}`,
      data.email,
    ]).catch(() => null);
    return { ok: true as const, total };
  });

export const getHandoffs = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    return (
      await sql`select h.*, d.title as deal, d.value from handoffs h left join deals d on d.id = h.deal_id order by h.id desc`
    ).map((h) => ({
      id: Number(h.id),
      deal: h.deal == null ? null : String(h.deal),
      value: money(h.value),
      to: String(h.to_company),
      finance: Boolean(h.include_finance),
      monitor: Boolean(h.monitor),
      status: String(h.status),
    }));
  });

export const sendHandoff = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { dealId: number; to: string; monitor: boolean }) => input)
  .handler(async ({ data }) => {
    await (await getSql()).query(
      `insert into handoffs (deal_id, to_company, include_finance, monitor, status) values ($1,$2,false,$3,'sent')`,
      [data.dealId, data.to, data.monitor],
    );
    return { ok: true };
  });

export const webcalBody = async (token: string) => {
  const sql = await getSql();
  if (token !== "northline" && token !== "nlcal") return null;
  const deals = await sql`select title, venue, event_date from deals where event_date is not null order by event_date`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Northline//Calendar//EN",
    "X-WR-CALNAME:Northline shows",
  ];
  for (const d of deals) {
    const day = String(d.event_date).slice(0, 10).replace(/-/g, "");
    lines.push("BEGIN:VEVENT", `SUMMARY:${String(d.title).replace(/,/g, "\\,")}`, `DTSTART;VALUE=DATE:${day}`, `LOCATION:${String(d.venue ?? "")}`, "END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
};

export { getUnifiedInbox } from "./inbox";

export const getPersonPrefs = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const p = (await sql.query(`select id, name, city, lat, lng from people where id = $1`, [data.id]))[0];
    if (!p) return null;
    const sms = (await sql.query(`select opted_in, source from sms_optins where person_id = $1`, [data.id]))[0];
    const pref = (await sql.query(`select mail, sms, postal from comm_prefs where person_id = $1`, [data.id]))[0];
    return {
      id: Number(p.id),
      name: String(p.name),
      city: p.city == null ? null : String(p.city),
      lat: p.lat == null ? null : Number(p.lat),
      lng: p.lng == null ? null : Number(p.lng),
      mail: pref ? Boolean(pref.mail) : true,
      sms: sms ? Boolean(sms.opted_in) : pref ? Boolean(pref.sms) : true,
      postal: pref ? Boolean(pref.postal) : false,
      smsSource: sms?.source == null ? null : String(sms.source),
    };
  });

export const setCommPref = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { personId: number; mail?: boolean; sms?: boolean; postal?: boolean }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql.query(
      `insert into comm_prefs (person_id, mail, sms, postal) values ($1, coalesce($2, true), coalesce($3, true), coalesce($4, false))
       on conflict (person_id) do update set
         mail = coalesce($2, comm_prefs.mail),
         sms = coalesce($3, comm_prefs.sms),
         postal = coalesce($4, comm_prefs.postal)`,
      [data.personId, data.mail ?? null, data.sms ?? null, data.postal ?? null],
    );
    if (data.sms != null) {
      await sql.query(
        `insert into sms_optins (person_id, opted_in, source) values ($1, $2, 'registry')
         on conflict (person_id) do update set opted_in = $2, source = 'registry', at = now()`,
        [data.personId, data.sms],
      );
    }
    return { ok: true };
  });

export const getPublicWidget = createServerFn({ method: "GET" })
  .validator((input: { slug?: string } = {}) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const p = (await sql`select * from ai_profile where id = 1`)[0];
    if (data.slug && p && String(p.widget_slug) !== data.slug) {
      /* still serve Northline — one house widget */
    }
    const held = (
      await sql`select event_date, venue from deals where event_date is not null and status in ('open','won') order by event_date limit 6`
    ).map((d) => `${String(d.event_date).slice(0, 10)}${d.venue ? ` · ${d.venue}` : ""}`);
    return {
      greeting: String(p?.greeting ?? "Hurricane Productions — LED, audio, and labor for live events."),
      brandColor: String(p?.brand_color ?? "0D47A1"),
      packages: parseJson<string[]>(p?.packages, []),
      slug: String(p?.widget_slug ?? "northline"),
      company: String(p?.company ?? "Hurricane Productions"),
      held,
    };
  });
