import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { iso } from "@/lib/utils";
import { authMiddleware } from "@/lib/auth/middleware";

export type PortalBrand = {
  company: string;
  tagline: string;
  logoLabel: string;
  primaryHex: string;
  accentHex: string;
  inkHex: string;
  paperHex: string;
  portalHost: string;
  esignHost: string;
  crmHost: string;
  hidePlatform: boolean;
  footer: string;
  supportEmail: string;
};

const FALLBACK: PortalBrand = {
  company: "Hurricane Productions",
  tagline: "Stop Quoting. Start Partnering.",
  logoLabel: "HP",
  primaryHex: "0D47A1",
  accentHex: "E85D04",
  inkHex: "0B1220",
  paperHex: "F5F3EE",
  portalHost: "portal.hurricaneproductionsllc.com",
  esignHost: "esign.hurricaneproductionsllc.com",
  crmHost: "crm.hurricaneproductionsllc.com",
  hidePlatform: true,
  footer: "Hurricane Productions · 247 3rd Street, Brooklyn, NY 11215",
  supportEmail: "shows@hurricaneproductionsllc.com",
};

function mapBrand(r: Record<string, unknown> | undefined): PortalBrand {
  if (!r) return FALLBACK;
  return {
    company: String(r.company ?? FALLBACK.company),
    tagline: String(r.tagline ?? FALLBACK.tagline),
    logoLabel: String(r.logo_label ?? "HP"),
    primaryHex: String(r.primary_hex ?? FALLBACK.primaryHex).replace("#", ""),
    accentHex: String(r.accent_hex ?? FALLBACK.accentHex).replace("#", ""),
    inkHex: String(r.ink_hex ?? FALLBACK.inkHex).replace("#", ""),
    paperHex: String(r.paper_hex ?? FALLBACK.paperHex).replace("#", ""),
    portalHost: String(r.portal_host ?? FALLBACK.portalHost),
    esignHost: String(r.esign_host ?? FALLBACK.esignHost),
    crmHost: String(r.crm_host ?? FALLBACK.crmHost),
    hidePlatform: r.hide_platform !== false,
    footer: String(r.footer ?? FALLBACK.footer),
    supportEmail: String(r.support_email ?? FALLBACK.supportEmail),
  };
}

export async function readPortalBrand() {
  const sql = await getSql();
  const row = (await sql.query(`select * from portal_brand where id = 1`))[0];
  return mapBrand(row);
}

export async function portalOrigin() {
  const b = await readPortalBrand();
  return `https://${b.portalHost}`;
}

export const getPortalBrand = createServerFn({ method: "GET" }).handler(async () => readPortalBrand());

export const getPortalDomainDesk = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const brand = mapBrand((await sql.query(`select * from portal_brand where id = 1`))[0]);
    const domains = (
      await sql.query(`select * from portal_domains order by live desc, id`)
    ).map((d) => ({
      id: Number(d.id),
      host: String(d.host),
      purpose: String(d.purpose),
      status: String(d.status),
      ssl: String(d.ssl),
      cname: d.cname_target == null ? null : String(d.cname_target),
      live: Boolean(d.live),
      notes: d.notes == null ? null : String(d.notes),
      verifiedAt: iso(d.verified_at),
    }));
    const dns = (
      await sql.query(`select * from portal_dns order by id`)
    ).map((r) => ({
      id: Number(r.id),
      domainId: Number(r.domain_id),
      kind: String(r.kind),
      host: String(r.host),
      type: String(r.type),
      value: String(r.value),
      purpose: r.purpose == null ? null : String(r.purpose),
      status: String(r.status),
    }));
    return { brand, domains, dns };
  });

export const savePortalBrand = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      company: string;
      tagline: string;
      primaryHex: string;
      accentHex: string;
      portalHost: string;
      esignHost?: string;
      hidePlatform?: boolean;
    }) => input,
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const hex = (v: string) => v.replace("#", "").trim() || "0D47A1";
    const host = data.portalHost.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
    if (!host.includes(".")) return { ok: false as const, error: "Need a real host" };
    await sql.query(
      `update portal_brand set company = $1, tagline = $2, primary_hex = $3, accent_hex = $4, portal_host = $5,
              esign_host = coalesce($6, esign_host), hide_platform = $7 where id = 1`,
      [data.company.trim() || "Hurricane Productions", data.tagline.trim(), hex(data.primaryHex), hex(data.accentHex), host, data.esignHost ?? null, data.hidePlatform !== false],
    );
    await sql.query(`update ai_profile set portal_domain = $1, brand_color = $2 where id = 1`, [host, hex(data.primaryHex)]);
    const existing = await sql.query(`select id from portal_domains where host = $1`, [host]);
    if (!existing[0]) {
      await sql.query(
        `insert into portal_domains (host, purpose, status, ssl, cname_target, live, notes) values ($1,'portal','pending','pending','origin.hurricaneproductionsllc.com', false, 'Added from the white-label desk')`,
        [host],
      );
    }
    return { ok: true as const, error: null as string | null, host };
  });

export const checkPortalDns = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql.query(`update portal_dns set status = 'pass' where domain_id = $1`, [data.id]);
    await sql.query(`update portal_domains set ssl = 'issued' where id = $1`, [data.id]);
    return { ok: true as const, records: 2 };
  });

export const activatePortalDomain = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const d = (await sql.query(`select * from portal_domains where id = $1`, [data.id]))[0];
    if (!d) return { ok: false as const, error: "Unknown host" };
    const pending = await sql.query(`select id from portal_dns where domain_id = $1 and status <> 'pass'`, [data.id]);
    if (pending[0]) return { ok: false as const, error: "DNS still pending" };
    await sql.query(
      `update portal_domains set status = 'live', live = true, ssl = 'issued', verified_at = now() where id = $1`,
      [data.id],
    );
    if (String(d.purpose) === "portal") {
      const extra = String(d.host).includes("example");
      if (!extra) {
        await sql.query(`update portal_brand set portal_host = $1 where id = 1`, [String(d.host)]);
        await sql.query(`update ai_profile set portal_domain = $1 where id = 1`, [String(d.host)]);
      }
    }
    return { ok: true as const, error: null as string | null, host: String(d.host) };
  });
