alter table scheduler_links add column if not exists source text not null default 'northline';
alter table scheduler_links add column if not exists calendly_url text;
alter table scheduler_links add column if not exists location_kind text not null default 'zoom';

alter table bookings add column if not exists status text not null default 'confirmed';
alter table bookings add column if not exists duration_min integer;
alter table bookings add column if not exists zoom_meeting_id text;
alter table bookings add column if not exists zoom_join_url text;
alter table bookings add column if not exists zoom_passcode text;
alter table bookings add column if not exists confirmation_sent_at timestamptz;
alter table bookings add column if not exists calendly_event_uri text;

create table if not exists scheduling_connections (
  id serial primary key,
  member_id integer not null references members(id),
  provider text not null,
  handle text not null,
  token_hint text,
  connected boolean not null default true,
  auto_zoom boolean not null default true,
  confirm_email boolean not null default true,
  last_sync timestamptz,
  created_at timestamptz not null default now(),
  unique (member_id, provider)
);

create table if not exists calendly_event_types (
  id serial primary key,
  member_id integer references members(id),
  connection_id integer references scheduling_connections(id) on delete cascade,
  name text not null,
  slug text not null,
  duration_min integer not null default 30,
  calendly_url text not null,
  active boolean not null default true,
  link_id integer references scheduler_links(id)
);

insert into scheduling_connections (member_id, provider, handle, token_hint, connected, auto_zoom, confirm_email, last_sync)
select 1, 'calendly', 'dana-northline', 'cal_live_8k2…m', true, true, true, now() - interval '12 minutes'
where not exists (select 1 from scheduling_connections where member_id = 1 and provider = 'calendly');

insert into scheduling_connections (member_id, provider, handle, token_hint, connected, auto_zoom, confirm_email, last_sync)
select 2, 'calendly', 'marcus-hale', 'cal_live_4p9…q', true, true, true, now() - interval '40 minutes'
where not exists (select 1 from scheduling_connections where member_id = 2 and provider = 'calendly');

insert into scheduling_connections (member_id, provider, handle, token_hint, connected, auto_zoom, confirm_email, last_sync)
select 3, 'calendly', 'priya-shah', 'cal_live_1n7…c', true, true, true, now() - interval '3 hours'
where not exists (select 1 from scheduling_connections where member_id = 3 and provider = 'calendly');

insert into scheduling_connections (member_id, provider, handle, token_hint, connected, auto_zoom, confirm_email, last_sync)
select 5, 'calendly', 'sam-chen', 'cal_live_0w3…t', true, false, true, now() - interval '1 day'
where not exists (select 1 from scheduling_connections where member_id = 5 and provider = 'calendly');

insert into scheduling_connections (member_id, provider, handle, token_hint, connected, auto_zoom, confirm_email, last_sync)
select 1, 'zoom', 'dana@northline.av', 'zm_pat_7h…k', true, true, true, now() - interval '8 minutes'
where not exists (select 1 from scheduling_connections where member_id = 1 and provider = 'zoom');

insert into scheduling_connections (member_id, provider, handle, token_hint, connected, auto_zoom, confirm_email, last_sync)
select 2, 'zoom', 'marcus@northline.av', 'zm_pat_2c…n', true, true, true, now() - interval '18 minutes'
where not exists (select 1 from scheduling_connections where member_id = 2 and provider = 'zoom');

insert into scheduling_connections (member_id, provider, handle, token_hint, connected, auto_zoom, confirm_email, last_sync)
select 4, 'zoom', 'jules@northline.av', 'zm_pat_9r…b', true, true, true, now() - interval '2 hours'
where not exists (select 1 from scheduling_connections where member_id = 4 and provider = 'zoom');

update scheduler_links set source = 'calendly', location_kind = 'zoom',
  calendly_url = 'https://calendly.com/dana-northline/30m-intro'
  where slug = 'dana-intro';
update scheduler_links set source = 'calendly', location_kind = 'zoom',
  calendly_url = 'https://calendly.com/marcus-hale/site-walk'
  where slug = 'marcus-sitewalk';
update scheduler_links set source = 'calendly', location_kind = 'zoom',
  calendly_url = 'https://calendly.com/priya-shah/check-in'
  where slug = 'priya-checkin';
update scheduler_links set source = 'northline', location_kind = 'zoom',
  calendly_url = null
  where slug = 'sam-estimate';

insert into calendly_event_types (member_id, connection_id, name, slug, duration_min, calendly_url, link_id)
select 1, c.id, 'Dana — 30m intro', '30m-intro', 30, 'https://calendly.com/dana-northline/30m-intro', 1
from scheduling_connections c
where c.member_id = 1 and c.provider = 'calendly'
  and not exists (select 1 from calendly_event_types where slug = '30m-intro' and member_id = 1);

insert into calendly_event_types (member_id, connection_id, name, slug, duration_min, calendly_url, link_id)
select 2, c.id, 'Marcus — site walk hold', 'site-walk', 90, 'https://calendly.com/marcus-hale/site-walk', 2
from scheduling_connections c
where c.member_id = 2 and c.provider = 'calendly'
  and not exists (select 1 from calendly_event_types where slug = 'site-walk' and member_id = 2);

insert into calendly_event_types (member_id, connection_id, name, slug, duration_min, calendly_url, link_id)
select 3, c.id, 'Priya — account check-in', 'check-in', 30, 'https://calendly.com/priya-shah/check-in', 3
from scheduling_connections c
where c.member_id = 3 and c.provider = 'calendly'
  and not exists (select 1 from calendly_event_types where slug = 'check-in' and member_id = 3);

-- Stamp Zoom + confirmation on the seeded bookings so the desk is not empty.
update bookings set
  duration_min = coalesce(duration_min, 30),
  zoom_meeting_id = coalesce(zoom_meeting_id, '818' || lpad(id::text, 8, '0')),
  zoom_passcode = coalesce(zoom_passcode, 'NL' || lpad(id::text, 4, '0')),
  zoom_join_url = coalesce(zoom_join_url, 'https://northline.zoom.us/j/818' || lpad(id::text, 8, '0')),
  confirmation_sent_at = coalesce(confirmation_sent_at, now() - interval '20 minutes'),
  status = 'confirmed',
  calendly_event_uri = case when id in (1,2) then 'https://calendly.com/events/' || id else calendly_event_uri end;

insert into email_templates (name, subject, body)
select 'Appointment confirmation',
  'Confirmed: {{title}} — {{date}}',
  'Hi {{first_name}}, you are on the calendar with {{host}} for {{title}} on {{date}}. Zoom: {{zoom}}. If the hold moves, reply to this thread.'
where not exists (select 1 from email_templates where name = 'Appointment confirmation');

insert into emails (folder, from_name, from_addr, to_addr, subject, body, opened, clicked, sent_at)
select 'sent', 'Marcus Hale', 'marcus@northline.av', 'elena.voss@citadel.com',
  'Confirmed: Marcus — site walk hold — Cipriani',
  'Elena — you are on Marcus''s calendar for a 90-minute site walk. Zoom join is in this thread. Bring the latest plot.',
  true, false, now() - interval '20 minutes'
where not exists (select 1 from emails where subject like 'Confirmed: Marcus — site walk%');
