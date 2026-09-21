-- Cold prospect lists: separate record type, bulk import, tagged multi-list campaigns, reply → dated lead.

alter table cold_lists add column if not exists source text not null default 'manual';
alter table cold_lists add column if not exists notes text;

alter table cold_prospects add column if not exists title text;
alter table cold_prospects add column if not exists phone text;
alter table cold_prospects add column if not exists replied_at timestamptz;
alter table cold_prospects add column if not exists last_touched_at timestamptz;
alter table cold_prospects add column if not exists promoted_at timestamptz;

create unique index if not exists cold_prospects_list_email on cold_prospects (list_id, lower(email));

create table if not exists cold_campaigns (
  id serial primary key,
  name text not null,
  subject text not null,
  body text not null,
  list_ids text not null default '',
  tag text,
  sent_count integer not null default 0,
  skipped integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists cold_touches (
  id serial primary key,
  prospect_id integer references cold_prospects(id) on delete cascade,
  campaign_id integer references cold_campaigns(id) on delete set null,
  kind text not null,
  detail text,
  created_at timestamptz not null default now()
);

update cold_lists set source = 'expo', notes = 'Badge scans from the NAB floor. Not a bought file.'
where id = 1 and (source = 'manual' or source is null or source = 'manual');

update cold_lists set source = 'bought', notes = 'Purchased planner file. Never mixed into Live Events.'
where id = 2;

insert into cold_lists (id, name, tags, source, notes) values
  (3, 'InfoComm 2026 scans', 'expo,infocomm', 'expo', 'Vegas badge dump. Same rule as NAB — not leads.'),
  (4, 'Lumen corporate buy', 'bought,corporate', 'bought', 'List broker file, NYC brand producers.')
on conflict (id) do nothing;

select setval('cold_lists_id_seq', greatest((select coalesce(max(id), 1) from cold_lists), 4));

-- Extra names. Jordan Peck sits on two expo lists so a campaign can prove the dedupe.
insert into cold_prospects (list_id, name, email, company, title)
select v.list_id, v.name, v.email, v.company, v.title
from (values
  (1, 'Jordan Peck', 'jp@peckandco.nyc', 'Peck & Co', 'Producer'),
  (1, 'Devon Blake', 'devon@blakeproduces.com', 'Blake Produces', 'EP'),
  (1, 'Harper Quinn', 'harper@quinn.events', 'Quinn Events', 'Director'),
  (2, 'Samira Noor', 'samira@noor.events', 'Noor Events', 'Planner'),
  (2, 'Lee Ortiz', 'lee@ortizweddings.com', 'Ortiz Weddings', 'Planner'),
  (3, 'Jordan Peck', 'jp@peckandco.nyc', 'Peck & Co', 'Producer'),
  (3, 'Tom Ellis', 'tellis@gather.work', 'Gather', 'Studio lead'),
  (3, 'Harper Quinn', 'harper@quinn.events', 'Quinn Events', 'Director'),
  (4, 'Nina Park', 'nina@parkhouse.nyc', 'Park House', 'Brand producer'),
  (4, 'Chris Lang', 'clang.buy@sohohouse.com', 'Soho House', 'Events')
) as v(list_id, name, email, company, title)
where not exists (
  select 1 from cold_prospects c
  where c.list_id = v.list_id and lower(c.email) = lower(v.email)
);

-- Ava already wrote back last week. She is a lead now, dated from that reply — not from the buy date.
insert into leads (title, source, status, notes, created_at, stage_entered_at)
select 'Ava Lind', 'Cold reply', 'new', 'Promoted from Bought Brooklyn planners. ava@lindweddings.com',
  now() - interval '6 days', now() - interval '6 days'
where not exists (select 1 from leads where notes like '%ava@lindweddings.com%');

update cold_prospects p set
  promoted_lead_id = (select id from leads where notes like '%ava@lindweddings.com%' order by id desc limit 1),
  promoted_at = now() - interval '6 days',
  replied_at = now() - interval '6 days'
where lower(p.email) = 'ava@lindweddings.com'
  and p.promoted_lead_id is null;

insert into lead_history (lead_id, actor, action, detail)
select l.id, 'Northline', 'promoted', 'Reply on Bought Brooklyn planners'
from leads l
where l.notes like '%ava@lindweddings.com%'
  and not exists (select 1 from lead_history h where h.lead_id = l.id and h.action = 'promoted');

-- Devon replied this morning. Scan on the desk will date the lead from this inbound, not from the badge scan.
insert into emails (folder, from_name, from_addr, to_addr, subject, body, opened, clicked, sent_at, created_at)
select 'inbox', 'Devon Blake', 'devon@blakeproduces.com', 'dana@hurricaneproductionsllc.com',
  'Re: Dates in play — Northline',
  'We have a June hold at Pier 17. Can you send a one-pager?',
  true, false, now() - interval '3 hours', now() - interval '3 hours'
where not exists (
  select 1 from emails where lower(from_addr) = 'devon@blakeproduces.com' and folder = 'inbox'
);

insert into cold_campaigns (name, subject, body, list_ids, tag, sent_count, skipped, created_at)
select
  'Expo one-pager',
  'Dates in play — Northline',
  'Quick note from the floor. If a date is in play in NYC this year, reply and we will send the one-pager.',
  '1,3',
  'expo',
  5,
  2,
  now() - interval '2 days'
where not exists (select 1 from cold_campaigns where name = 'Expo one-pager');
