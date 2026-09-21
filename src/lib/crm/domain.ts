import { createServerFn } from "@tanstack/react-start";
import { getSql, type Sql } from "@/lib/db";
import { iso } from "@/lib/utils";
import { authMiddleware } from "@/lib/auth/middleware";

export type SenderPurpose = "compose" | "workflow";

export type Sender = {
  fromName: string;
  fromAddr: string;
  domainId: number | null;
  domain: string | null;
  authenticated: boolean;
  displayName: string | null;
  emailId: number;
};

export type DnsRow = {
  id: number;
  domainId: number;
  kind: string;
  host: string;
  type: string;
  value: string;
  purpose: string;
  status: string;
};

export type IdentityRow = {
  id: number;
  domainId: number;
  memberId: number | null;
  localPart: string;
  displayName: string;
  purpose: string;
  isDefault: boolean;
  address: string;
};

export type DomainRow = {
  id: number;
  domain: string;
  displayName: string;
  mailHost: string | null;
  status: string;
  spf: boolean;
  dkim: boolean;
  dmarc: boolean;
  active: boolean;
  applyCompose: boolean;
  applyWorkflow: boolean;
  verifiedAt: string | null;
  dkimSelector: string;
  trackingHost: string | null;
  returnPath: string | null;
  records: DnsRow[];
  identities: IdentityRow[];
};

export type OutboundRow = {
  id: number;
  fromName: string;
  fromAddr: string;
  toAddr: string;
  subject: string;
  folder: string;
  authenticated: boolean;
  sentAt: string | null;
};

function mapDomain(r: Record<string, unknown>, records: DnsRow[], identities: IdentityRow[]): DomainRow {
  return {
    id: Number(r.id),
    domain: String(r.domain),
    displayName: String(r.display_name ?? r.domain),
    mailHost: r.mail_host == null ? null : String(r.mail_host),
    status: String(r.status ?? "pending"),
    spf: Boolean(r.spf),
    dkim: Boolean(r.dkim),
    dmarc: Boolean(r.dmarc),
    active: Boolean(r.active),
    applyCompose: r.apply_compose == null ? true : Boolean(r.apply_compose),
    applyWorkflow: r.apply_workflow == null ? true : Boolean(r.apply_workflow),
    verifiedAt: iso(r.verified_at),
    dkimSelector: String(r.dkim_selector ?? "nl"),
    trackingHost: r.tracking_host == null ? null : String(r.tracking_host),
    returnPath: r.return_path == null ? null : String(r.return_path),
    records,
    identities,
  };
}

function mapDns(r: Record<string, unknown>): DnsRow {
  return {
    id: Number(r.id),
    domainId: Number(r.domain_id),
    kind: String(r.kind),
    host: String(r.host),
    type: String(r.type),
    value: String(r.value),
    purpose: String(r.purpose),
    status: String(r.status),
  };
}

function mapIdent(r: Record<string, unknown>, domain: string): IdentityRow {
  return {
    id: Number(r.id),
    domainId: Number(r.domain_id),
    memberId: r.member_id == null ? null : Number(r.member_id),
    localPart: String(r.local_part),
    displayName: String(r.display_name),
    purpose: String(r.purpose),
    isDefault: Boolean(r.is_default),
    address: `${r.local_part}@${domain}`,
  };
}

function localPart(addr: string | undefined | null) {
  if (!addr) return "";
  const at = addr.indexOf("@");
  return at === -1 ? addr.trim().toLowerCase() : addr.slice(0, at).trim().toLowerCase();
}

function recordsFor(domain: string, selector: string) {
  return [
    {
      kind: "spf",
      host: "@",
      type: "TXT",
      value: "v=spf1 include:spf.northline.av -all",
      purpose: "Authorize Northline to send",
    },
    {
      kind: "dkim",
      host: `${selector}._domainkey`,
      type: "TXT",
      value: "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2nLineHpSendKey7QvR4kM0wF8cHurr1c4n3Av",
      purpose: "Sign every outbound message",
    },
    {
      kind: "dmarc",
      host: "_dmarc",
      type: "TXT",
      value: `v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc@${domain}`,
      purpose: "Quarantine spoofed mail",
    },
    {
      kind: "cname",
      host: "track",
      type: "CNAME",
      value: "track.northline.send.net",
      purpose: "Open and click tracking",
    },
    {
      kind: "mx",
      host: "bounce",
      type: "CNAME",
      value: "bounce.northline.send.net",
      purpose: "Return-path / bounce handling",
    },
  ];
}

export async function resolveSender(
  sql: Sql,
  opts?: {
    purpose?: SenderPurpose;
    memberId?: number | null;
    fallbackName?: string;
    hintAddr?: string;
  },
): Promise<Sender> {
  const purpose: SenderPurpose = opts?.purpose ?? "compose";
  const rows = await sql.query(`select * from sending_domains where active = true and status = 'authenticated' order by id`);
  const domain = rows.find((d) => (purpose === "compose" ? d.apply_compose !== false : d.apply_workflow !== false));
  if (!domain) {
    return {
      fromName: opts?.fallbackName ?? "Northline",
      fromAddr: opts?.hintAddr ?? "hello@northline.av",
      domainId: null,
      domain: null,
      authenticated: false,
      displayName: null,
      emailId: 0,
    };
  }
  const host = String(domain.domain);
  const idents = await sql.query(`select * from sending_identities where domain_id = $1 order by id`, [Number(domain.id)]);
  const hint = localPart(opts?.hintAddr);
  const byMember = opts?.memberId ? idents.find((i) => Number(i.member_id) === opts.memberId) : undefined;
  const byHint = hint ? idents.find((i) => String(i.local_part).toLowerCase() === hint) : undefined;
  const byName = opts?.fallbackName
    ? idents.find((i) => String(i.display_name).toLowerCase() === opts.fallbackName!.toLowerCase())
    : undefined;
  const byPurposeDefault = idents.find((i) => Boolean(i.is_default) && String(i.purpose) === purpose);
  const byPurpose = idents.find((i) => String(i.purpose) === purpose);
  const byDefault = idents.find((i) => Boolean(i.is_default));
  const pick = byMember ?? byHint ?? byName ?? byPurposeDefault ?? byPurpose ?? byDefault ?? idents[0];
  const fromName = pick ? String(pick.display_name) : (opts?.fallbackName ?? String(domain.display_name ?? host));
  const fromAddr = pick ? `${pick.local_part}@${host}` : `hello@${host}`;
  return {
    fromName,
    fromAddr,
    domainId: Number(domain.id),
    domain: host,
    authenticated: true,
    displayName: String(domain.display_name ?? host),
    emailId: 0,
  };
}

export async function insertOutbound(
  sql: Sql,
  opts: {
    purpose?: SenderPurpose;
    mailKind?: "compose" | "workflow" | "broadcast" | "transactional";
    toAddr: string;
    subject: string;
    body: string;
    dealId?: number | null;
    personId?: number | null;
    folder?: string;
    memberId?: number | null;
    fallbackName?: string;
    hintAddr?: string;
  },
): Promise<Sender> {
  const sender = await resolveSender(sql, {
    purpose: opts.purpose,
    memberId: opts.memberId,
    fallbackName: opts.fallbackName,
    hintAddr: opts.hintAddr,
  });
  const folder = opts.folder ?? "sent";
  const mailKind = opts.mailKind ?? (opts.purpose === "workflow" ? "workflow" : "compose");
  const smtpId =
    folder === "drafts" ? null : `<${Date.now().toString(36)}.${Math.random().toString(36).slice(2, 8)}@mail.hurricaneproductionsllc.com>`;
  const inserted = await sql.query(
    `insert into emails (folder, from_name, from_addr, to_addr, subject, body, deal_id, person_id, opened, clicked, sent_at, domain_id, authenticated, purpose, delivery_status, smtp_message_id)
     values ($1,$2,$3,$4,$5,$6,$7,$8,false,false, case when $1 = 'drafts' then null else now() end, $9, $10, $11, $12, $13)
     returning id`,
    [
      folder,
      sender.fromName,
      sender.fromAddr,
      opts.toAddr,
      opts.subject,
      opts.body,
      opts.dealId ?? null,
      opts.personId ?? null,
      sender.domainId,
      sender.authenticated,
      mailKind,
      folder === "drafts" ? "queued" : "delivered",
      smtpId,
    ],
  );
  const emailId = Number(inserted[0]?.id ?? 0);
  if (folder !== "drafts" && emailId) {
    const sentAt = new Date();
    await sql.query(
      `insert into smtp_events (email_id, event, detail, at) values
        ($1, 'queued', 'SMTP queued', $2),
        ($1, 'accepted', 'mail.hurricaneproductionsllc.com accepted', $3),
        ($1, 'delivered', '250 2.0.0 OK', $4)`,
      [emailId, sentAt, new Date(sentAt.getTime() + 900), new Date(sentAt.getTime() + 3200)],
    ).catch(() => null);
  }
  return { ...sender, emailId };
}

async function loadDesk(sql: Sql) {
  const domains = await sql.query(`select * from sending_domains order by active desc, id`);
  const dns = await sql.query(`select * from sending_dns order by id`);
  const idents = await sql.query(`select * from sending_identities order by is_default desc, id`);
  const mapped = domains.map((d) => {
    const host = String(d.domain);
    const recs = dns.filter((r) => Number(r.domain_id) === Number(d.id)).map(mapDns);
    const people = idents.filter((r) => Number(r.domain_id) === Number(d.id)).map((r) => mapIdent(r, host));
    return mapDomain(d, recs, people);
  });
  const recent = (
    await sql.query(
      `select id, from_name, from_addr, to_addr, subject, folder, authenticated, sent_at
       from emails
       where authenticated = true or domain_id is not null
       order by coalesce(sent_at, created_at) desc
       limit 10`,
    )
  ).map(
    (r): OutboundRow => ({
      id: Number(r.id),
      fromName: String(r.from_name),
      fromAddr: String(r.from_addr),
      toAddr: String(r.to_addr),
      subject: String(r.subject),
      folder: String(r.folder),
      authenticated: Boolean(r.authenticated),
      sentAt: iso(r.sent_at),
    }),
  );
  const sent7d = Number(
    (
      await sql.query(
        `select count(*) as c from emails
         where authenticated = true and folder = 'sent'
           and coalesce(sent_at, created_at) >= now() - interval '7 days'`,
      )
    )[0]?.c ?? 0,
  );
  const live = mapped.find((d) => d.active && d.status === "authenticated") ?? null;
  const sender = await resolveSender(sql, { purpose: "compose" });
  const workflow = await resolveSender(sql, { purpose: "workflow" });
  return {
    domains: mapped,
    live,
    recent,
    sender,
    workflow,
    stats: {
      authenticated: mapped.filter((d) => d.status === "authenticated").length,
      pending: mapped.filter((d) => d.status === "pending" || d.status === "verifying").length,
      sent7d,
      recordsPass: live ? live.records.filter((r) => r.status === "pass").length : 0,
      recordsTotal: live ? live.records.length : 0,
    },
  };
}

export const getSendingDesk = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    return loadDesk(sql);
  });

export const getActiveSender = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { purpose?: SenderPurpose; memberId?: number | null; hintAddr?: string; fallbackName?: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    return resolveSender(sql, data);
  });

export const addSendingDomain = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { domain: string; displayName?: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const domain = data.domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    if (!domain.includes(".") || domain.includes(" ")) return { ok: false as const, error: "Use a real domain, like hurricaneproductionsllc.com" };
    if ((await sql.query(`select id from sending_domains where lower(domain) = $1`, [domain]))[0]) {
      return { ok: false as const, error: "That domain is already on the desk" };
    }
    const selector = "nl";
    const inserted = await sql.query(
      `insert into sending_domains (domain, display_name, mail_host, spf, dkim, dmarc, active, status, apply_compose, apply_workflow, dkim_selector, tracking_host, return_path)
       values ($1,$2,$3,false,false,false,false,'pending',true,true,$4,$5,$6) returning id`,
      [domain, data.displayName?.trim() || domain, `mail.${domain}`, selector, `track.${domain}`, `bounce.${domain}`],
    );
    const id = Number(inserted[0].id);
    for (const rec of recordsFor(domain, selector)) {
      await sql.query(
        `insert into sending_dns (domain_id, kind, host, type, value, purpose, status) values ($1,$2,$3,$4,$5,$6,'missing')`,
        [id, rec.kind, rec.host, rec.type, rec.value, rec.purpose],
      );
    }
    return { ok: true as const, error: null as string | null };
  });

export const checkDomainDns = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const d = (await sql.query(`select * from sending_domains where id = $1`, [data.id]))[0];
    if (!d) return { ok: false as const, error: "Domain not found" };
    await sql.query(`update sending_dns set status = 'pass' where domain_id = $1`, [data.id]);
    await sql.query(
      `update sending_domains set spf = true, dkim = true, dmarc = true, status = 'authenticated', verified_at = now() where id = $1`,
      [data.id],
    );
    return { ok: true as const, error: null as string | null };
  });

export const activateDomain = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const d = (await sql.query(`select * from sending_domains where id = $1`, [data.id]))[0];
    if (!d) return { ok: false as const, error: "Domain not found" };
    if (String(d.status) !== "authenticated") return { ok: false as const, error: "Authenticate DNS first" };
    await sql.query(`update sending_domains set active = false`);
    await sql.query(`update sending_domains set active = true, apply_compose = true, apply_workflow = true where id = $1`, [data.id]);
    return { ok: true as const, error: null as string | null };
  });

export const setDomainApply = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; applyCompose?: boolean; applyWorkflow?: boolean }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    if (data.applyCompose != null) {
      await sql.query(`update sending_domains set apply_compose = $1 where id = $2`, [data.applyCompose, data.id]);
    }
    if (data.applyWorkflow != null) {
      await sql.query(`update sending_domains set apply_workflow = $1 where id = $2`, [data.applyWorkflow, data.id]);
    }
    return { ok: true as const };
  });

export const addIdentity = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { domainId: number; localPart: string; displayName: string; purpose: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const local = data.localPart.trim().toLowerCase().replace(/[^a-z0-9._+-]/g, "");
    if (!local) return { ok: false as const, error: "Need a local-part (dana, hello, shows)" };
    const dup = await sql.query(`select id from sending_identities where domain_id = $1 and lower(local_part) = $2`, [
      data.domainId,
      local,
    ]);
    if (dup[0]) return { ok: false as const, error: "That address already exists" };
    await sql.query(
      `insert into sending_identities (domain_id, local_part, display_name, purpose, is_default) values ($1,$2,$3,$4,false)`,
      [data.domainId, local, data.displayName.trim() || local, data.purpose || "compose"],
    );
    return { ok: true as const, error: null as string | null };
  });

export const setDefaultIdentity = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const row = (await sql.query(`select * from sending_identities where id = $1`, [data.id]))[0];
    if (!row) return { ok: false as const };
    await sql.query(`update sending_identities set is_default = false where domain_id = $1 and purpose = $2`, [
      Number(row.domain_id),
      String(row.purpose),
    ]);
    await sql.query(`update sending_identities set is_default = true where id = $1`, [data.id]);
    return { ok: true as const };
  });

export const testDomainSend = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { identityId?: number; purpose?: SenderPurpose }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const purpose: SenderPurpose = data.purpose ?? "compose";
    let hint: string | undefined;
    let name: string | undefined;
    if (data.identityId) {
      const ident = (
        await sql.query(
          `select i.*, d.domain from sending_identities i join sending_domains d on d.id = i.domain_id where i.id = $1`,
          [data.identityId],
        )
      )[0];
      if (ident) {
        hint = `${ident.local_part}@${ident.domain}`;
        name = String(ident.display_name);
      }
    }
    const person = (
      await sql.query(
        `select p.email, p.name, d.id as deal_id from people p left join deals d on d.person_id = p.id
         where p.email is not null order by d.id nulls last limit 1`,
      )
    )[0];
    const to = person ? String(person.email) : "elena.voss@citadel.com";
    const sender = await insertOutbound(sql, {
      purpose,
      toAddr: to,
      subject: "Authenticated send from Hurricane Productions",
      body: `This left ${hint ?? "the live sending domain"} with SPF, DKIM, and DMARC aligned. Clients see us — not a platform.\n\n— ${name ?? "Northline"}`,
      dealId: person?.deal_id == null ? null : Number(person.deal_id),
      fallbackName: name,
      hintAddr: hint,
    });
    return { ok: true as const, sender, to };
  });
