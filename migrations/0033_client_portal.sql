-- Passwordless client portal: magic-link tokens, branded desk, pay + sign.

create table if not exists portal_links (
  id serial primary key,
  token text not null unique,
  person_id integer not null references people(id),
  expires_at timestamptz not null,
  last_seen timestamptz,
  revoked boolean not null default false,
  created_at timestamptz not null default now()
);

insert into portal_links (token, person_id, expires_at, last_seen)
select 'pt_1hotel', 4, now() + interval '45 days', now() - interval '2 hours'
where not exists (select 1 from portal_links where token = 'pt_1hotel');

insert into portal_links (token, person_id, expires_at)
select 'pt_citadel', 1, now() + interval '45 days'
where not exists (select 1 from portal_links where token = 'pt_citadel');

insert into invoices (deal_id, org_id, number, amount, status, processor, due_on, standalone, memo)
select 4, 4, 'NL-1044', 28500, 'open', 'stripe', current_date + 12, false, '1 Hotel rooftop — deposit + production'
where not exists (select 1 from invoices where number = 'NL-1044');

insert into invoices (deal_id, org_id, number, amount, status, processor, due_on, standalone, memo)
select 1, 1, 'NL-1045', 46600, 'open', 'stripe', current_date + 21, false, 'Citadel Holiday Party — 25% deposit'
where not exists (select 1 from invoices where number = 'NL-1045');

insert into proposals (deal_id, title, body, status, token)
select 1, 'Citadel Holiday Party — LED + audio',
  'Cipriani 42nd. 8x4 of 2.6mm, L-Acoustics FOH, 4-hour load-in. Deposit due with signature.',
  'sent', 'pr-citadel-gala'
where not exists (select 1 from proposals where token = 'pr-citadel-gala');
