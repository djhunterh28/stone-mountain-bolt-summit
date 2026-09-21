import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { iso, money } from "@/lib/utils";
import { authMiddleware } from "@/lib/auth/middleware";
import { insertOutbound } from "./domain";
import { deliverSms } from "./sms";

export type InboxChannel = "email" | "sms" | "chat";

export type InboxMsg = {
  id: string;
  channel: InboxChannel;
  who: string;
  body: string;
  at: string;
  mine: boolean;
};

export type InboxActivity = {
  id: number;
  type: string;
  subject: string;
  notes: string | null;
  at: string;
  done: boolean;
};

export type InboxThread = {
  id: string;
  kind: "event" | "person" | "chat";
  channels: InboxChannel[];
  title: string;
  subtitle: string;
  preview: string;
  at: string;
  unread: boolean;
  dealId: number | null;
  dealTitle: string | null;
  dealStatus: string | null;
  stage: string | null;
  value: number | null;
  venue: string | null;
  loadIn: string | null;
  eventDate: string | null;
  personId: number | null;
  personName: string | null;
  personEmail: string | null;
  personPhone: string | null;
  orgName: string | null;
  smsOpted: boolean | null;
  toAddr: string | null;
  chatId: number | null;
  messages: InboxMsg[];
  activities: InboxActivity[];
};

function stripRe(subject: string) {
  return subject.replace(/^(re:\s*)+/i, "").trim();
}

export const getUnifiedInbox = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const emails = await sql.query(
      `select e.*, d.title as deal_title, d.status as deal_status, d.value, d.venue, d.load_in, d.event_date,
              s.name as stage, p.id as pid, p.name as person_name, p.email as person_email, p.phone as person_phone,
              o.name as org_name
       from emails e
       left join deals d on d.id = e.deal_id
       left join stages s on s.id = d.stage_id
       left join people p on p.id = coalesce(e.person_id, d.person_id)
       left join organizations o on o.id = coalesce(p.org_id, d.org_id)
       order by coalesce(e.sent_at, e.created_at) desc limit 80`,
    );
    const sms = await sql.query(
      `select s.*, d.title as deal_title, d.status as deal_status, d.value, d.venue, d.load_in, d.event_date,
              st.name as stage, p.id as pid, p.name as person_name, p.email as person_email, p.phone as person_phone,
              o.name as org_name, opt.opted_in
       from sms_messages s
       left join deals d on d.id = s.deal_id
       left join stages st on st.id = d.stage_id
       left join people p on p.id = s.person_id
       left join organizations o on o.id = p.org_id
       left join sms_optins opt on opt.person_id = p.id
       order by s.id desc limit 80`,
    );
    const chats = await sql.query(`select * from chats order by updated_at desc limit 12`);
    const chatMsgs = await sql.query(`select * from chat_messages order by created_at`);
    const acts = await sql.query(
      `select * from activities order by coalesce(due_at, created_at) desc, id desc limit 80`,
    );

    type Bucket = {
      id: string;
      kind: InboxThread["kind"];
      dealId: number | null;
      personId: number | null;
      chatId: number | null;
      title: string;
      dealTitle: string | null;
      dealStatus: string | null;
      stage: string | null;
      value: number | null;
      venue: string | null;
      loadIn: string | null;
      eventDate: string | null;
      personName: string | null;
      personEmail: string | null;
      personPhone: string | null;
      orgName: string | null;
      smsOpted: boolean | null;
      toAddr: string | null;
      messages: InboxMsg[];
    };

    const buckets = new Map<string, Bucket>();

    function bucket(id: string, kind: Bucket["kind"], seed: Partial<Bucket> = {}): Bucket {
      const existing = buckets.get(id);
      if (existing) {
        if (!existing.dealTitle && seed.dealTitle) existing.dealTitle = seed.dealTitle;
        if (!existing.personName && seed.personName) existing.personName = seed.personName;
        if (!existing.personEmail && seed.personEmail) existing.personEmail = seed.personEmail;
        if (!existing.personPhone && seed.personPhone) existing.personPhone = seed.personPhone;
        if (!existing.orgName && seed.orgName) existing.orgName = seed.orgName;
        if (existing.smsOpted == null && seed.smsOpted != null) existing.smsOpted = seed.smsOpted;
        if (!existing.stage && seed.stage) existing.stage = seed.stage;
        if (existing.value == null && seed.value != null) existing.value = seed.value;
        if (!existing.venue && seed.venue) existing.venue = seed.venue;
        if (!existing.loadIn && seed.loadIn) existing.loadIn = seed.loadIn;
        if (!existing.eventDate && seed.eventDate) existing.eventDate = seed.eventDate;
        if (!existing.toAddr && seed.toAddr) existing.toAddr = seed.toAddr;
        if (!existing.dealStatus && seed.dealStatus) existing.dealStatus = seed.dealStatus;
        return existing;
      }
      const created: Bucket = {
        id,
        kind,
        dealId: seed.dealId ?? null,
        personId: seed.personId ?? null,
        chatId: seed.chatId ?? null,
        title: seed.title ?? "Thread",
        dealTitle: seed.dealTitle ?? null,
        dealStatus: seed.dealStatus ?? null,
        stage: seed.stage ?? null,
        value: seed.value ?? null,
        venue: seed.venue ?? null,
        loadIn: seed.loadIn ?? null,
        eventDate: seed.eventDate ?? null,
        personName: seed.personName ?? null,
        personEmail: seed.personEmail ?? null,
        personPhone: seed.personPhone ?? null,
        orgName: seed.orgName ?? null,
        smsOpted: seed.smsOpted ?? null,
        toAddr: seed.toAddr ?? null,
        messages: [],
      };
      buckets.set(id, created);
      return created;
    }

    function meta(row: Record<string, unknown>) {
      return {
        dealId: row.deal_id == null ? null : Number(row.deal_id),
        personId: row.pid == null ? (row.person_id == null ? null : Number(row.person_id)) : Number(row.pid),
        dealTitle: row.deal_title == null ? null : String(row.deal_title),
        dealStatus: row.deal_status == null ? null : String(row.deal_status),
        stage: row.stage == null ? null : String(row.stage),
        value: row.value == null ? null : money(row.value),
        venue: row.venue == null ? null : String(row.venue),
        loadIn: row.load_in == null ? null : String(row.load_in),
        eventDate: row.event_date ? String(iso(row.event_date)).slice(0, 10) : null,
        personName: row.person_name == null ? null : String(row.person_name),
        personEmail: row.person_email == null ? null : String(row.person_email),
        personPhone: row.person_phone == null ? null : String(row.person_phone),
        orgName: row.org_name == null ? null : String(row.org_name),
      };
    }

    for (const e of emails) {
      const m = meta(e);
      const id = m.dealId ? `event-${m.dealId}` : m.personId ? `person-${m.personId}` : `mail-${e.id}`;
      const b = bucket(id, m.dealId ? "event" : "person", {
        ...m,
        title: m.dealTitle ?? stripRe(String(e.subject ?? "Mail")),
        toAddr: e.to_addr == null ? m.personEmail : String(e.to_addr),
      });
      b.messages.push({
        id: `e${e.id}`,
        channel: "email",
        who: String(e.from_name ?? e.from_addr ?? "mail"),
        body: String(e.body ?? ""),
        at: iso(e.sent_at ?? e.created_at) ?? "",
        mine: String(e.folder) === "sent",
      });
    }

    for (const s of sms) {
      const m = meta(s);
      const opted = s.opted_in == null ? null : Boolean(s.opted_in);
      const id = m.dealId ? `event-${m.dealId}` : m.personId ? `person-${m.personId}` : `sms-${s.id}`;
      const b = bucket(id, m.dealId ? "event" : "person", {
        ...m,
        title: m.dealTitle ?? m.personName ?? "SMS",
        smsOpted: opted,
      });
      if (opted != null) b.smsOpted = opted;
      b.messages.push({
        id: `s${s.id}`,
        channel: "sms",
        who: String(s.direction) === "out" ? "Northline" : (m.personName ?? "them"),
        body: String(s.body),
        at: iso(s.created_at) ?? "",
        mine: String(s.direction) === "out",
      });
    }

    for (const c of chats) {
      const id = `chat-${c.id}`;
      const msgs = chatMsgs.filter((m) => Number(m.chat_id) === Number(c.id));
      const b = bucket(id, "chat", {
        chatId: Number(c.id),
        title: String(c.visitor_name),
        toAddr: c.visitor_email == null ? null : String(c.visitor_email),
        personEmail: c.visitor_email == null ? null : String(c.visitor_email),
        personName: String(c.visitor_name),
      });
      for (const m of msgs) {
        b.messages.push({
          id: `c${m.id}`,
          channel: "chat",
          who: String(m.sender),
          body: String(m.body),
          at: iso(m.created_at) ?? "",
          mine: String(m.sender) !== "visitor",
        });
      }
    }

    const threads: InboxThread[] = [];
    for (const b of buckets.values()) {
      b.messages.sort((a, c) => (a.at < c.at ? -1 : 1));
      const last = b.messages[b.messages.length - 1];
      const channels = [...new Set(b.messages.map((m) => m.channel))];
      const related = acts
        .filter((a) => {
          const did = a.deal_id == null ? null : Number(a.deal_id);
          const pid = a.person_id == null ? null : Number(a.person_id);
          return (b.dealId && did === b.dealId) || (b.personId && pid === b.personId);
        })
        .slice(0, 8)
        .map(
          (a): InboxActivity => ({
            id: Number(a.id),
            type: String(a.type),
            subject: String(a.subject),
            notes: a.notes == null ? null : String(a.notes),
            at: iso(a.due_at ?? a.created_at) ?? "",
            done: Boolean(a.done),
          }),
        );
      threads.push({
        id: b.id,
        kind: b.kind,
        channels,
        title: b.title,
        subtitle: [b.personName, b.orgName, b.stage].filter(Boolean).join(" · "),
        preview: last?.body.slice(0, 120) ?? "",
        at: last?.at ?? "",
        unread: Boolean(last && !last.mine),
        dealId: b.dealId,
        dealTitle: b.dealTitle,
        dealStatus: b.dealStatus,
        stage: b.stage,
        value: b.value,
        venue: b.venue,
        loadIn: b.loadIn,
        eventDate: b.eventDate,
        personId: b.personId,
        personName: b.personName,
        personEmail: b.personEmail,
        personPhone: b.personPhone,
        orgName: b.orgName,
        smsOpted: b.smsOpted,
        toAddr: b.toAddr ?? b.personEmail,
        chatId: b.chatId,
        messages: b.messages,
        activities: related,
      });
    }
    threads.sort((a, b) => (a.at < b.at ? 1 : -1));
    return {
      threads,
      stats: {
        open: threads.length,
        unread: threads.filter((t) => t.unread).length,
        events: threads.filter((t) => t.kind === "event").length,
        sms: threads.filter((t) => t.channels.includes("sms")).length,
      },
    };
  });

export const replyInbox = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      channel: InboxChannel;
      body: string;
      dealId?: number | null;
      personId?: number | null;
      toAddr?: string | null;
      chatId?: number | null;
      memberId: number;
      fromName: string;
      fromAddr: string;
      subject?: string;
    }) => input,
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const body = data.body.trim();
    if (!body) return { ok: false as const, error: "Empty reply" };
    if (data.channel === "sms") {
      if (!data.personId) return { ok: false as const, error: "No person on this thread" };
      const r = await deliverSms(sql, { personId: data.personId, dealId: data.dealId, body, kind: "custom" });
      if (!r.ok) return { ok: false as const, error: r.error ?? "SMS blocked" };
    } else if (data.channel === "email") {
      const to = data.toAddr;
      if (!to) return { ok: false as const, error: "No email on this thread" };
      await insertOutbound(sql, {
        purpose: "compose",
        mailKind: "compose",
        toAddr: to,
        subject: data.subject?.trim() || "Re: conversation",
        body,
        dealId: data.dealId ?? null,
        personId: data.personId ?? null,
        memberId: data.memberId,
        fallbackName: data.fromName,
        hintAddr: data.fromAddr,
      });
    } else {
      if (!data.chatId) return { ok: false as const, error: "No chat" };
      await sql.query(`insert into chat_messages (chat_id, sender, body) values ($1,'agent',$2)`, [data.chatId, body]);
      await sql.query(`update chats set last_message = $1, updated_at = now() where id = $2`, [body, data.chatId]);
    }
    await sql.query(
      `insert into activities (type, subject, deal_id, person_id, owner_id, done, notes, due_at)
       values ($1,$2,$3,$4,$5,true,$6,now())`,
      [
        data.channel,
        `Inbox · ${data.channel} reply`,
        data.dealId ?? null,
        data.personId ?? null,
        data.memberId,
        body.slice(0, 280),
      ],
    );
    return { ok: true as const, error: null as string | null };
  });

export const logInboxNote = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { dealId?: number | null; personId?: number | null; memberId: number; body: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const body = data.body.trim();
    if (!body) return { ok: false as const };
    await sql.query(
      `insert into activities (type, subject, deal_id, person_id, owner_id, done, notes, due_at)
       values ('note','Inbox note',$1,$2,$3,true,$4,now())`,
      [data.dealId ?? null, data.personId ?? null, data.memberId, body],
    );
    return { ok: true as const };
  });
