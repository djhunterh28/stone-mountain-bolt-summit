-- Event lifecycle: types, cancelled vs lost, multi-stage leads, source tracking.

create table if not exists event_types (
  id serial primary key,
  name text not null unique,
  slug text not null unique,
  sort_order integer not null default 0,
  active boolean not null default true
);

insert into event_types (name, slug, sort_order) values
  ('Corporate gala', 'gala', 0),
  ('Conference / keynote', 'conference', 1),
  ('Product launch', 'launch', 2),
  ('Concert / live music', 'concert', 3),
  ('Wedding', 'wedding', 4),
  ('Private / members', 'private', 5),
  ('Brand activation', 'activation', 6),
  ('Festival / outdoor', 'festival', 7),
  ('Dry hire', 'dry-hire', 8),
  ('Partnership', 'partnership', 9)
on conflict (name) do nothing;

alter table deals add column if not exists event_type text;
alter table deals add column if not exists cancelled_at timestamptz;

alter table lost_reasons add column if not exists kind text not null default 'lost';
update lost_reasons set kind = 'cancelled' where name = 'Event cancelled';

insert into lost_reasons (name, sort_order, active, kind)
select v.name, v.sort_order, true, v.kind
from (values
  ('Date pulled', 7, 'cancelled'),
  ('Budget freeze', 8, 'cancelled'),
  ('Force majeure / weather', 9, 'cancelled'),
  ('Client no longer producing', 10, 'cancelled')
) as v(name, sort_order, kind)
where not exists (select 1 from lost_reasons r where r.name = v.name);

alter table leads add column if not exists event_type text;
alter table leads add column if not exists event_date date;
alter table leads add column if not exists venue text;
alter table leads add column if not exists estimated_value numeric not null default 0;
alter table leads add column if not exists disqualify_reason text;
alter table leads add column if not exists deal_id integer references deals(id);
alter table leads add column if not exists stage_entered_at timestamptz not null default now();

update leads set stage_entered_at = created_at
where created_at is not null
  and stage_entered_at > now() - interval '2 minutes';

create table if not exists lead_history (
  id serial primary key,
  lead_id integer not null references leads(id) on delete cascade,
  actor text not null default 'Northline',
  action text not null,
  detail text,
  created_at timestamptz not null default now()
);

update deals set event_type = v.type
from (values
  (1, 'Corporate gala'),
  (2, 'Corporate gala'),
  (3, 'Product launch'),
  (4, 'Wedding'),
  (5, 'Conference / keynote'),
  (6, 'Private / members'),
  (7, 'Brand activation'),
  (8, 'Festival / outdoor'),
  (9, 'Corporate gala'),
  (10, 'Conference / keynote'),
  (11, 'Conference / keynote'),
  (12, 'Dry hire'),
  (13, 'Concert / live music'),
  (14, 'Corporate gala'),
  (15, 'Brand activation'),
  (16, 'Private / members'),
  (17, 'Partnership'),
  (18, 'Wedding'),
  (19, 'Corporate gala'),
  (20, 'Dry hire')
) as v(id, type)
where deals.id = v.id and deals.event_type is null;

update leads set
  event_type = v.type,
  venue = v.venue,
  event_date = current_date + v.days,
  estimated_value = v.value
from (values
  ('Independent producer — warehouse rave', 'Concert / live music', 'Bushwick warehouse', 40, 18000),
  ('Reed Events loft wedding', 'Wedding', 'Tribeca loft', 55, 22000),
  ('Unknown — Google form, Pier 57', 'Conference / keynote', 'Pier 57', 90, 64000),
  ('The Met after-hours', 'Corporate gala', 'The Met', 120, 88000),
  ('Soho Works conference', 'Conference / keynote', 'Soho Works', 48, 31000),
  ('Barclays holiday village', 'Brand activation', 'Atlantic Ave plaza', 70, 91000),
  ('Spotify listening room', 'Private / members', 'Spotify 4 WTC', 28, 24000),
  ('Brooklyn Navy Yard open studios', 'Festival / outdoor', 'Brooklyn Navy Yard', 85, 42000)
) as v(title, type, venue, days, value)
where leads.title = v.title and leads.event_type is null;

-- Extra lost + cancelled shows so the exits desk is a real book, not one row.
insert into deals (
  title, value, pipeline_id, stage_id, org_id, person_id, owner_id, status, lost_reason,
  expected_close, probability, source, event_type, event_date, venue, guest_count, indoor, load_in, notes,
  stage_entered_at, created_at, updated_at, won_at, lost_at, cancelled_at
)
select
  v.title, v.value, 1, v.stage_id, v.org_id, v.person_id, v.owner_id, v.status, v.lost_reason,
  current_date + v.close_off, v.probability, v.source, v.event_type, current_date + v.event_off, v.venue,
  v.guests, v.indoor, v.load_in, v.notes,
  now() - v.entered, now() - v.created, now() - v.updated, null,
  now() - v.closed, case when v.status = 'cancelled' then now() - v.closed else null end
from (values
  ('Hudson Yards holiday — LED ceiling', 74000, 3, null, 16, 2, 'cancelled', 'Event cancelled', 0, -12, 'Inbound', 'Corporate gala', 18, 'Vessel plaza', 400, false, '05:00',
   'Client pulled the date after Related froze the budget.', interval '22 days', interval '50 days', interval '12 days', interval '12 days'),
  ('Equinox rooftop member night', 28600, 3, 12, 12, 3, 'lost', 'Competitor (PRG / PSAV)', 0, -8, 'Web form', 'Private / members', 14, 'Equinox Hudson Yards', 160, true, '09:00',
   'PRG had the house plot already. We were the second look.', interval '18 days', interval '36 days', interval '8 days', interval '8 days'),
  ('Ace Hotel listening room', 19200, 2, null, 16, 5, 'lost', 'Timing / date moved', 0, -20, 'Chatbot', 'Concert / live music', -4, 'Ace Hotel DTLA hold — NYC sister', 90, true, '14:00',
   'Date moved to a dark week we could not cover.', interval '24 days', interval '40 days', interval '20 days', interval '20 days'),
  ('The Shed members preview', 54000, 4, 8, 8, 4, 'lost', 'In-house AV', 0, -6, 'Prospector', 'Brand activation', 35, 'The Shed', 280, true, '07:00',
   'House system plus two of their staff. Would have been a supplement only.', interval '11 days', interval '28 days', interval '6 days', interval '6 days'),
  ('Rockefeller plaza tree lighting hold', 128000, 5, 5, 5, 1, 'cancelled', 'Date pulled', 0, -3, 'Referral', 'Brand activation', 75, 'Rockefeller Plaza', 2000, false, '02:00',
   'Network pulled the outdoor activation. Keep the plot.', interval '9 days', interval '44 days', interval '3 days', interval '3 days'),
  ('Brooklyn Botanic after-dark', 41000, 1, 2, 2, 3, 'lost', 'No decision', 0, -30, 'Repeat', 'Festival / outdoor', 55, 'Brooklyn Botanic Garden', 600, false, '16:00',
   'Committee went dark. Three follow-ups, no reply.', interval '32 days', interval '70 days', interval '30 days', interval '30 days')
) as v(title, value, stage_id, org_id, person_id, owner_id, status, lost_reason, probability, close_off, source, event_type, event_off, venue, guests, indoor, load_in, notes, entered, created, updated, closed)
where not exists (select 1 from deals d where d.title = v.title);

insert into deal_history (deal_id, actor, action, detail, created_at)
select d.id, 'Northline', d.status, d.lost_reason, coalesce(d.lost_at, d.updated_at)
from deals d
where d.title in (
  'Hudson Yards holiday — LED ceiling',
  'Equinox rooftop member night',
  'Ace Hotel listening room',
  'The Shed members preview',
  'Rockefeller plaza tree lighting hold',
  'Brooklyn Botanic after-dark'
)
and not exists (
  select 1 from deal_history h where h.deal_id = d.id and h.action = d.status
);

insert into leads (title, person_id, org_id, owner_id, source, score, status, labels, notes, event_type, event_date, venue, estimated_value, disqualify_reason, stage_entered_at, created_at)
select v.title, v.person_id, v.org_id, v.owner_id, v.source, v.score, v.status, v.labels, v.notes, v.event_type,
  current_date + v.days, v.venue, v.value, v.reason, now() - v.entered, now() - v.created
from (values
  ('Citadel 2027 summer offsite hold', 1, 1, 2, 'Repeat', 68, 'nurture', 'gala,hold', 'Too early to bid. Keep on the 2027 board.', 'Corporate gala', 280, 'Gotham Hall', 110000, null::text, interval '12 days', interval '20 days'),
  ('Lincoln Center 2027 plaza', 9, 9, 1, 'Repeat', 74, 'nurture', 'gala,union', 'They want the same plot as this year. Wait for budget.', 'Corporate gala', 340, 'Josie Robertson Plaza', 160000, null, interval '6 days', interval '14 days'),
  ('Stuyvesant senior prom', null, null, 5, 'Web form', 18, 'disqualified', 'too-small', 'School dance, 200 pax, no production budget.', 'Wedding', 50, 'Stuyvesant HS gym', 2400, 'Too small', interval '4 days', interval '9 days'),
  ('Apartment birthday DJ — LES loft', null, null, 2, 'Chatbot', 12, 'disqualified', 'not-fit', 'One speaker and a playlist. Not our work.', 'Private / members', 12, 'Lower East Side loft', 800, 'Not a fit', interval '2 days', interval '5 days'),
  ('Brooklyn Steel NYE', 13, 13, 4, 'Referral', 81, 'contacted', 'concert,overnight', 'House system plus our delay. Waiting on the promoter.', 'Concert / live music', 102, 'Brooklyn Steel', 67000, null, interval '1 day', interval '3 days'),
  ('Nike athlete dinner — Bond St', 3, 3, 1, 'Inbound', 79, 'qualified', 'launch,intimate', '40 pax, LED ceiling leftover from the drop. Ready to convert.', 'Product launch', 26, '21 Bond St', 18500, null, interval '2 days', interval '8 days')
) as v(title, person_id, org_id, owner_id, source, score, status, labels, notes, event_type, days, venue, value, reason, entered, created)
where not exists (select 1 from leads l where l.title = v.title);

insert into lead_history (lead_id, actor, action, detail, created_at)
select l.id, 'Northline', l.status,
  case
    when l.status = 'disqualified' then coalesce(l.disqualify_reason, 'Disqualified')
    else 'Stage ' || l.status
  end,
  l.stage_entered_at
from leads l
where not exists (select 1 from lead_history h where h.lead_id = l.id);

select setval('deals_id_seq', (select max(id) from deals));
select setval('leads_id_seq', (select max(id) from leads));
select setval('event_types_id_seq', (select max(id) from event_types));
select setval('lost_reasons_id_seq', (select max(id) from lost_reasons));
