-- Custom sending domain: SPF / DKIM / DMARC, from-identities, apply to compose + workflow.

alter table sending_domains add column if not exists display_name text;
alter table sending_domains add column if not exists mail_host text;
alter table sending_domains add column if not exists status text not null default 'pending';
alter table sending_domains add column if not exists apply_compose boolean not null default true;
alter table sending_domains add column if not exists apply_workflow boolean not null default true;
alter table sending_domains add column if not exists verified_at timestamptz;
alter table sending_domains add column if not exists dkim_selector text not null default 'nl';
alter table sending_domains add column if not exists tracking_host text;
alter table sending_domains add column if not exists return_path text;

create unique index if not exists sending_domains_domain_idx on sending_domains (lower(domain));

alter table emails add column if not exists domain_id integer references sending_domains(id);
alter table emails add column if not exists authenticated boolean not null default false;

create table if not exists sending_dns (
  id serial primary key,
  domain_id integer not null references sending_domains(id) on delete cascade,
  kind text not null,
  host text not null,
  type text not null,
  value text not null,
  purpose text not null,
  status text not null default 'missing'
);

create table if not exists sending_identities (
  id serial primary key,
  domain_id integer not null references sending_domains(id) on delete cascade,
  member_id integer references members(id),
  local_part text not null,
  display_name text not null,
  purpose text not null default 'compose',
  is_default boolean not null default false
);

create unique index if not exists sending_identities_addr on sending_identities (domain_id, lower(local_part));

-- Retire the platform mail host. Client mail should not leave as @mail.northline.av.
update sending_domains set
  display_name = 'Northline mail (platform)',
  mail_host = 'mail.northline.av',
  status = 'authenticated',
  active = false,
  apply_compose = false,
  apply_workflow = false,
  verified_at = now() - interval '80 days',
  dkim_selector = 'nl',
  tracking_host = 'track.mail.northline.av',
  return_path = 'bounce.mail.northline.av'
where domain = 'mail.northline.av';

insert into sending_domains (
  domain, display_name, mail_host, spf, dkim, dmarc, active, status,
  apply_compose, apply_workflow, verified_at, dkim_selector, tracking_host, return_path
)
select
  'hurricaneproductionsllc.com',
  'Hurricane Productions',
  'mail.hurricaneproductionsllc.com',
  true, true, true, true, 'authenticated',
  true, true,
  now() - interval '12 days',
  'nl',
  'track.hurricaneproductionsllc.com',
  'bounce.hurricaneproductionsllc.com'
where not exists (select 1 from sending_domains where domain = 'hurricaneproductionsllc.com');

insert into sending_domains (
  domain, display_name, mail_host, spf, dkim, dmarc, active, status,
  apply_compose, apply_workflow, dkim_selector, tracking_host, return_path
)
select
  'northline.av',
  'Northline root',
  'mail.northline.av',
  false, false, false, false, 'pending',
  true, true, 'nl', 'track.northline.av', 'bounce.northline.av'
where not exists (select 1 from sending_domains where domain = 'northline.av');

-- DNS for the live company domain.
insert into sending_dns (domain_id, kind, host, type, value, purpose, status)
select d.id, v.kind, v.host, v.type, v.value, v.purpose, v.status
from sending_domains d
join (values
  ('spf', '@', 'TXT', 'v=spf1 include:spf.northline.av -all', 'Authorize Northline to send', 'pass'),
  ('dkim', 'nl._domainkey', 'TXT', 'v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2nLineHpSendKey7QvR4kM0wF8cHurr1c4n3Av', 'Sign every outbound message', 'pass'),
  ('dmarc', '_dmarc', 'TXT', 'v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc@hurricaneproductionsllc.com', 'Quarantine spoofed mail', 'pass'),
  ('cname', 'track', 'CNAME', 'track.northline.send.net', 'Open and click tracking', 'pass'),
  ('mx', 'bounce', 'CNAME', 'bounce.northline.send.net', 'Return-path / bounce handling', 'pass')
) as v(kind, host, type, value, purpose, status) on true
where d.domain = 'hurricaneproductionsllc.com'
  and not exists (select 1 from sending_dns x where x.domain_id = d.id);

-- Platform domain records (retired, still valid).
insert into sending_dns (domain_id, kind, host, type, value, purpose, status)
select d.id, v.kind, v.host, v.type, v.value, v.purpose, 'pass'
from sending_domains d
join (values
  ('spf', '@', 'TXT', 'v=spf1 include:spf.northline.av -all', 'Platform SPF'),
  ('dkim', 'nl._domainkey', 'TXT', 'v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2nLinePlatFormKey', 'Platform DKIM'),
  ('dmarc', '_dmarc', 'TXT', 'v=DMARC1; p=none; rua=mailto:dmarc@mail.northline.av', 'Platform DMARC')
) as v(kind, host, type, value, purpose) on true
where d.domain = 'mail.northline.av'
  and not exists (select 1 from sending_dns x where x.domain_id = d.id);

-- Pending root domain — records published, not yet seen by the checker.
insert into sending_dns (domain_id, kind, host, type, value, purpose, status)
select d.id, v.kind, v.host, v.type, v.value, v.purpose, 'missing'
from sending_domains d
join (values
  ('spf', '@', 'TXT', 'v=spf1 include:spf.northline.av -all', 'Authorize Northline to send'),
  ('dkim', 'nl._domainkey', 'TXT', 'v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2nLineRootKey', 'Sign every outbound message'),
  ('dmarc', '_dmarc', 'TXT', 'v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc@northline.av', 'Quarantine spoofed mail'),
  ('cname', 'track', 'CNAME', 'track.northline.send.net', 'Open and click tracking'),
  ('mx', 'bounce', 'CNAME', 'bounce.northline.send.net', 'Return-path / bounce handling')
) as v(kind, host, type, value, purpose) on true
where d.domain = 'northline.av'
  and not exists (select 1 from sending_dns x where x.domain_id = d.id);

-- One address per AE, plus house and workflow mailboxes on the live domain.
insert into sending_identities (domain_id, member_id, local_part, display_name, purpose, is_default)
select d.id, m.id, split_part(m.email, '@', 1), m.name, 'compose', (m.id = 1)
from sending_domains d
join members m on true
where d.domain = 'hurricaneproductionsllc.com'
  and not exists (
    select 1 from sending_identities i
    where i.domain_id = d.id and lower(i.local_part) = split_part(m.email, '@', 1)
  );

insert into sending_identities (domain_id, member_id, local_part, display_name, purpose, is_default)
select d.id, null, 'hello', 'Hurricane Productions', 'house', false
from sending_domains d
where d.domain = 'hurricaneproductionsllc.com'
  and not exists (select 1 from sending_identities i where i.domain_id = d.id and lower(i.local_part) = 'hello');

insert into sending_identities (domain_id, member_id, local_part, display_name, purpose, is_default)
select d.id, null, 'shows', 'Northline Shows', 'workflow', true
from sending_domains d
where d.domain = 'hurricaneproductionsllc.com'
  and not exists (select 1 from sending_identities i where i.domain_id = d.id and lower(i.local_part) = 'shows');

-- Existing outbound already looks like it left the company domain.
update emails set
  from_addr = regexp_replace(from_addr, '@northline\.av$', '@hurricaneproductionsllc.com'),
  authenticated = true,
  domain_id = (select id from sending_domains where domain = 'hurricaneproductionsllc.com' limit 1)
where folder in ('sent', 'drafts')
  and from_addr like '%@northline.av';

update emails set
  to_addr = regexp_replace(to_addr, '@northline\.av$', '@hurricaneproductionsllc.com')
where folder = 'inbox'
  and to_addr like '%@northline.av';

update emails set to_addr = 'hello@hurricaneproductionsllc.com'
where to_addr = 'sales@northline.av';
