-- White-label client portal: own host, own brand, never a third-party address.

create table if not exists portal_domains (
  id serial primary key,
  host text not null unique,
  purpose text not null,
  status text not null default 'pending',
  ssl text not null default 'issued',
  cname_target text,
  live boolean not null default false,
  notes text,
  verified_at timestamptz
);

create table if not exists portal_dns (
  id serial primary key,
  domain_id integer not null references portal_domains(id) on delete cascade,
  kind text not null,
  host text not null,
  type text not null,
  value text not null,
  purpose text,
  status text not null default 'pass'
);

create table if not exists portal_brand (
  id integer primary key default 1,
  company text not null,
  tagline text not null,
  logo_label text not null default 'HP',
  primary_hex text not null,
  accent_hex text not null,
  ink_hex text not null,
  paper_hex text not null,
  portal_host text not null,
  esign_host text not null,
  crm_host text not null,
  hide_platform boolean not null default true,
  footer text not null,
  support_email text not null
);

insert into portal_domains (host, purpose, status, ssl, cname_target, live, notes, verified_at) values
  ('portal.hurricaneproductionsllc.com', 'portal', 'live', 'issued', 'origin.hurricaneproductionsllc.com', true, 'Client-facing. Never shown as a Northline or vendor host.', now() - interval '40 days'),
  ('esign.hurricaneproductionsllc.com', 'esign', 'live', 'issued', 'origin.hurricaneproductionsllc.com', true, 'Envelope links for clients.', now() - interval '40 days'),
  ('crm.hurricaneproductionsllc.com', 'crm', 'live', 'issued', 'origin.hurricaneproductionsllc.com', true, 'Staff CRM. Never used in client mail or the portal chrome.', now() - interval '40 days')
on conflict (host) do nothing;

insert into portal_domains (host, purpose, status, ssl, cname_target, live, notes)
select 'clients.example-hold.com', 'alias', 'pending', 'pending', 'origin.hurricaneproductionsllc.com', false, 'Example extra host. Activate after DNS.'
where not exists (select 1 from portal_domains where host = 'clients.example-hold.com');

insert into portal_dns (domain_id, kind, host, type, value, purpose, status)
select d.id, v.kind, v.host, v.type, v.value, v.purpose, v.status
from portal_domains d
join (values
  ('portal.hurricaneproductionsllc.com', 'cname', 'portal', 'CNAME', 'origin.hurricaneproductionsllc.com', 'Client portal host', 'pass'),
  ('portal.hurricaneproductionsllc.com', 'txt', '_portal-verify.portal', 'TXT', 'hp-portal=live', 'Ownership', 'pass'),
  ('esign.hurricaneproductionsllc.com', 'cname', 'esign', 'CNAME', 'origin.hurricaneproductionsllc.com', 'E-sign host', 'pass'),
  ('crm.hurricaneproductionsllc.com', 'cname', 'crm', 'CNAME', 'origin.hurricaneproductionsllc.com', 'Staff only', 'pass')
) as v(domain, kind, host, type, value, purpose, status) on d.host = v.domain
where not exists (select 1 from portal_dns x where x.domain_id = d.id and x.kind = v.kind);

insert into portal_brand (id, company, tagline, logo_label, primary_hex, accent_hex, ink_hex, paper_hex, portal_host, esign_host, crm_host, hide_platform, footer, support_email)
values (
  1,
  'Hurricane Productions',
  'Stop Quoting. Start Partnering.',
  'HP',
  '0D47A1',
  'E85D04',
  '0B1220',
  'F5F3EE',
  'portal.hurricaneproductionsllc.com',
  'esign.hurricaneproductionsllc.com',
  'crm.hurricaneproductionsllc.com',
  true,
  'Hurricane Productions · 247 3rd Street, Brooklyn, NY 11215',
  'shows@hurricaneproductionsllc.com'
)
on conflict (id) do update set
  company = excluded.company,
  tagline = excluded.tagline,
  portal_host = excluded.portal_host,
  esign_host = excluded.esign_host,
  crm_host = excluded.crm_host,
  hide_platform = true;

update ai_profile
set portal_domain = 'portal.hurricaneproductionsllc.com',
    brand_color = '0D47A1'
where id = 1;
