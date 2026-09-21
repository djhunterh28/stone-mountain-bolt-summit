import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { iso, money } from "@/lib/utils";
import { authMiddleware } from "@/lib/auth/middleware";
import { insertOutbound } from "@/lib/crm/domain";
import { readPortalBrand, portalOrigin } from "./brand";

function mintToken() {
  return `pt_${Math.random().toString(36).slice(2, 10)}`;
}

async function loadLink(token: string) {
  const sql = await getSql();
  const row = (
    await sql.query(
      `select l.*, p.name, p.email, p.org_id, o.name as org
       from portal_links l
       join people p on p.id = l.person_id
       left join organizations o on o.id = p.org_id
       where l.token = $1 and l.revoked = false and l.expires_at > now()`,
      [token],
    )
  )[0];
  if (!row) return null;
  await sql.query(`update portal_links set last_seen = now() where id = $1`, [Number(row.id)]);
  return {
    id: Number(row.id),
    personId: Number(row.person_id),
    name: String(row.name),
    email: row.email == null ? null : String(row.email),
    orgId: row.org_id == null ? null : Number(row.org_id),
    org: row.org == null ? null : String(row.org),
    expiresAt: iso(row.expires_at),
  };
}

export const getClientPortal = createServerFn({ method: "GET" })
  .validator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    const link = await loadLink(data.token);
    const brand = await readPortalBrand();
    if (!link) return { ok: false as const, session: null, proposals: [] as never[], contracts: [] as never[], invoices: [] as never[], brand };
    const sql = await getSql();
    const proposals = (
      await sql.query(
        `select p.* from proposals p
         join deals d on d.id = p.deal_id
         where d.person_id = $1
         order by p.id desc`,
        [link.personId],
      )
    ).map((p) => ({
      id: Number(p.id),
      title: String(p.title),
      body: String(p.body ?? ""),
      status: String(p.status),
      token: String(p.token),
      viewedAt: iso(p.viewed_at),
    }));
    const contracts = (
      await sql.query(
        `select e.id, e.status, e.mode, coalesce(deal.title, d.name) as title, d.content, r.id as recipient_id, r.status as rec_status
         from esign_envelopes e
         join esign_recipients r on r.envelope_id = e.id
         left join documents d on d.id = e.document_id
         left join deals deal on deal.id = e.deal_id
         where lower(r.email) = lower($1) and e.status in ('sent','partial')
         order by e.id desc`,
        [link.email ?? ""],
      )
    ).map((e) => ({
      id: Number(e.id),
      title: String(e.title ?? "Production agreement"),
      content: String(e.content ?? "Production agreement for live event audiovisual services."),
      status: String(e.status),
      mode: String(e.mode),
      recipientId: Number(e.recipient_id),
      recStatus: String(e.rec_status),
    }));
    const invoices = (
      await sql.query(
        `select i.*, d.title as deal
         from invoices i
         left join deals d on d.id = i.deal_id
         where d.person_id = $1 or i.org_id = $2
         order by i.id desc`,
        [link.personId, link.orgId],
      )
    ).map((i) => ({
      id: Number(i.id),
      number: String(i.number),
      amount: money(i.amount),
      status: String(i.status),
      dueOn: iso(i.due_on),
      paidAt: iso(i.paid_at),
      memo: i.memo == null ? null : String(i.memo),
      deal: i.deal == null ? null : String(i.deal),
      processor: i.processor == null ? "stripe" : String(i.processor),
    }));
    return { ok: true as const, session: link, proposals, contracts, invoices, brand };
  });

export const payPortalInvoice = createServerFn({ method: "POST" })
  .validator((input: { token: string; invoiceId: number }) => input)
  .handler(async ({ data }) => {
    const link = await loadLink(data.token);
    if (!link) return { ok: false as const, error: "Link expired" };
    const sql = await getSql();
    const inv = (
      await sql.query(
        `select i.* from invoices i left join deals d on d.id = i.deal_id
         where i.id = $1 and (d.person_id = $2 or i.org_id = $3)`,
        [data.invoiceId, link.personId, link.orgId],
      )
    )[0];
    if (!inv) return { ok: false as const, error: "Invoice not on this portal" };
    if (String(inv.status) === "paid") return { ok: true as const, error: null as string | null };
    await sql.query(
      `update invoices set status = 'paid', paid_at = now(), processor = 'stripe' where id = $1`,
      [data.invoiceId],
    );
    await sql.query(`insert into payments (invoice_id, amount, processor, kind) values ($1,$2,'stripe','charge')`, [
      data.invoiceId,
      inv.amount,
    ]);
    return { ok: true as const, error: null as string | null };
  });

export const signPortalContract = createServerFn({ method: "POST" })
  .validator((input: { token: string; envelopeId: number; recipientId: number; signature: string }) => input)
  .handler(async ({ data }) => {
    const link = await loadLink(data.token);
    if (!link) return { ok: false as const, error: "Link expired" };
    const sql = await getSql();
    const rec = (
      await sql.query(
        `select r.* from esign_recipients r
         where r.id = $1 and r.envelope_id = $2 and lower(r.email) = lower($3)`,
        [data.recipientId, data.envelopeId, link.email ?? ""],
      )
    )[0];
    if (!rec) return { ok: false as const, error: "Not your envelope" };
    const mark = data.signature.trim();
    if (!mark) return { ok: false as const, error: "Sign your name" };
    await sql.query(
      `update esign_recipients set status = 'signed', signed_at = now(), signature_data = $2 where id = $1`,
      [data.recipientId, mark],
    );
    const pending = await sql.query(
      `select count(*)::int as n from esign_recipients where envelope_id = $1 and status <> 'signed'`,
      [data.envelopeId],
    );
    if (Number(pending[0]?.n ?? 0) === 0) {
      await sql.query(`update esign_envelopes set status = 'completed' where id = $1`, [data.envelopeId]);
    } else {
      await sql.query(`update esign_envelopes set status = 'partial' where id = $1`, [data.envelopeId]);
    }
    return { ok: true as const, error: null as string | null };
  });

export const requestPortalLink = createServerFn({ method: "POST" })
  .validator((input: { email: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const email = data.email.trim().toLowerCase();
    const person = (await sql.query(`select * from people where lower(email) = $1`, [email]))[0];
    if (!person) return { ok: false as const, error: "We don't have that email in the client book.", token: null as string | null };
    const token = mintToken();
    await sql.query(
      `insert into portal_links (token, person_id, expires_at) values ($1,$2, now() + interval '14 days')`,
      [token, Number(person.id)],
    );
    const origin = await portalOrigin();
    await insertOutbound(sql, {
      purpose: "workflow",
      mailKind: "transactional",
      toAddr: email,
      subject: "Your Hurricane Productions portal",
      body: `Hi ${String(person.name).split(" ")[0]},\n\nPasswordless access to your proposal, contract, and invoice:\n${origin}/c/${token}\n\nThe link expires in 14 days. No password.`,
      personId: Number(person.id),
      fallbackName: "Hurricane Productions",
      hintAddr: "shows@hurricaneproductionsllc.com",
    }).catch(() => null);
    return { ok: true as const, error: null as string | null, token };
  });

export const getPortalLinkDesk = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const links = (
      await sql.query(
        `select l.*, p.name, p.email, o.name as org
         from portal_links l
         join people p on p.id = l.person_id
         left join organizations o on o.id = p.org_id
         order by l.id desc`,
      )
    ).map((l) => ({
      id: Number(l.id),
      token: String(l.token),
      person: String(l.name),
      email: l.email == null ? null : String(l.email),
      org: l.org == null ? null : String(l.org),
      expiresAt: iso(l.expires_at),
      lastSeen: iso(l.last_seen),
      revoked: Boolean(l.revoked),
    }));
    const people = (
      await sql.query(`select id, name, email from people where email is not null order by name`)
    ).map((p) => ({ id: Number(p.id), name: String(p.name), email: String(p.email) }));
    return { links, people, live: links.filter((l) => !l.revoked).length, portalHost: (await readPortalBrand()).portalHost };
  });

export const mintPortalLink = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { personId: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const p = (await sql.query(`select * from people where id = $1`, [data.personId]))[0];
    if (!p) return { ok: false as const, error: "Unknown client", token: null as string | null };
    const token = mintToken();
    await sql.query(
      `insert into portal_links (token, person_id, expires_at) values ($1,$2, now() + interval '30 days')`,
      [token, data.personId],
    );
    if (p.email) {
      const origin = await portalOrigin();
      await insertOutbound(sql, {
        purpose: "workflow",
        mailKind: "transactional",
        toAddr: String(p.email),
        subject: "Your Hurricane Productions portal",
        body: `Hi ${String(p.name).split(" ")[0]},\n\nOpen your show files, proposal, contract, and invoice (no password):\n${origin}/c/${token}\n`,
        personId: data.personId,
        fallbackName: "Hurricane Productions",
        hintAddr: "shows@hurricaneproductionsllc.com",
      }).catch(() => null);
    }
    return { ok: true as const, error: null as string | null, token };
  });

export const revokePortalLink = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    await (await getSql()).query(`update portal_links set revoked = true where id = $1`, [data.id]);
    return { ok: true as const };
  });
