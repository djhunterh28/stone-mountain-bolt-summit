alter table calendly_event_types add column if not exists source text not null default 'calendly';

create table if not exists places (
  id serial primary key,
  place_id text not null unique,
  name text not null,
  address text,
  city text,
  lat double precision,
  lng double precision,
  types text not null default '["event_venue"]',
  rating numeric,
  ratings_count integer,
  phone text,
  website text,
  hours text,
  maps_url text
);

create table if not exists show_tracks (
  id serial primary key,
  deal_id integer references deals(id) on delete cascade,
  deezer_id text not null,
  title text not null,
  artist text not null,
  album text,
  duration_sec integer,
  preview_url text,
  cover_url text,
  link text,
  role text not null default 'walk-in',
  created_at timestamptz not null default now()
);

create table if not exists integration_status (
  provider text primary key,
  connected boolean not null default true,
  detail text,
  last_ok timestamptz
);

insert into scheduling_connections (member_id, provider, handle, token_hint, connected, auto_zoom, confirm_email, last_sync)
select 4, 'tidycal', 'jules-rivera', 'td_live_3k…p', true, true, true, now() - interval '25 minutes'
where not exists (select 1 from scheduling_connections where member_id = 4 and provider = 'tidycal');

insert into scheduling_connections (member_id, provider, handle, token_hint, connected, auto_zoom, confirm_email, last_sync)
select 5, 'acuity', 'sam-chen', 'aq_live_9m…w', true, false, true, now() - interval '2 hours'
where not exists (select 1 from scheduling_connections where member_id = 5 and provider = 'acuity');

insert into scheduling_connections (member_id, provider, handle, token_hint, connected, auto_zoom, confirm_email, last_sync)
select 6, 'tidycal', 'alex-kim', 'td_live_1c…n', true, false, true, now() - interval '6 hours'
where not exists (select 1 from scheduling_connections where member_id = 6 and provider = 'tidycal');

insert into scheduler_links (member_id, name, duration_min, slug, source, calendly_url, location_kind)
select 4, 'Jules — load-in hold', 45, 'jules-loadin', 'tidycal', 'https://tidycal.com/jules-rivera/load-in', 'zoom'
where not exists (select 1 from scheduler_links where slug = 'jules-loadin');

insert into scheduler_links (member_id, name, duration_min, slug, source, calendly_url, location_kind)
select 5, 'Sam — 45m estimate', 45, 'sam-acuity-estimate', 'acuity', 'https://sam-chen.acuityscheduling.com/schedule.php?appointmentType=estimate', 'zoom'
where not exists (select 1 from scheduler_links where slug = 'sam-acuity-estimate');

insert into calendly_event_types (member_id, connection_id, name, slug, duration_min, calendly_url, source)
select 4, c.id, 'Jules — load-in hold', 'load-in', 45, 'https://tidycal.com/jules-rivera/load-in', 'tidycal'
from scheduling_connections c
where c.member_id = 4 and c.provider = 'tidycal'
  and not exists (select 1 from calendly_event_types where slug = 'load-in' and member_id = 4);

insert into calendly_event_types (member_id, connection_id, name, slug, duration_min, calendly_url, source)
select 5, c.id, 'Sam — 45m estimate', 'estimate', 45, 'https://sam-chen.acuityscheduling.com/schedule.php?appointmentType=estimate', 'acuity'
from scheduling_connections c
where c.member_id = 5 and c.provider = 'acuity'
  and not exists (select 1 from calendly_event_types where slug = 'estimate' and member_id = 5);

insert into places (place_id, name, address, city, lat, lng, types, rating, ratings_count, phone, website, hours, maps_url) values
  ('ChIJ_nl_cipriani42', 'Cipriani 42nd Street', '110 E 42nd St', 'Manhattan', 40.7512, -73.9772, '["event_venue","banquet_hall"]', 4.6, 842, '212-499-0599', 'https://www.cipriani.com', 'By event', 'https://maps.google.com/?q=Cipriani+42nd+Street'),
  ('ChIJ_nl_ciprianiws', 'Cipriani Wall Street', '55 Wall St', 'Manhattan', 40.7060, -74.0092, '["event_venue","banquet_hall"]', 4.5, 611, '212-699-4099', 'https://www.cipriani.com', 'By event', 'https://maps.google.com/?q=Cipriani+Wall+Street'),
  ('ChIJ_nl_plaza', 'The Plaza', '768 5th Ave', 'Manhattan', 40.7646, -73.9744, '["lodging","event_venue"]', 4.6, 4200, '212-759-3000', 'https://www.theplazany.com', '24 hours', 'https://maps.google.com/?q=The+Plaza+New+York'),
  ('ChIJ_nl_rainbow', 'Rainbow Room', '30 Rockefeller Plaza', 'Manhattan', 40.7590, -73.9795, '["event_venue","restaurant"]', 4.4, 980, '212-632-5000', 'https://www.rainbowroom.com', 'Evenings', 'https://maps.google.com/?q=Rainbow+Room'),
  ('ChIJ_nl_gotham', 'Gotham Hall', '1356 Broadway', 'Manhattan', 40.7516, -73.9874, '["event_venue"]', 4.5, 540, '212-967-3518', 'https://www.gothamhallevents.com', 'By event', 'https://maps.google.com/?q=Gotham+Hall'),
  ('ChIJ_nl_glasshouse', 'The Glasshouse', '43 W 13th St', 'Manhattan', 40.7368, -73.9972, '["event_venue"]', 4.7, 210, null, 'https://www.theglasshouseny.com', 'By event', 'https://maps.google.com/?q=The+Glasshouse+NYC'),
  ('ChIJ_nl_pier17', 'Pier 17', '89 South St', 'Manhattan', 40.7056, -74.0016, '["event_venue","rooftop"]', 4.5, 3100, '212-555-0166', 'https://pier17ny.com', '10:00–23:00', 'https://maps.google.com/?q=Pier+17'),
  ('ChIJ_nl_barclays', 'Barclays Center', '620 Atlantic Ave', 'Brooklyn', 40.6826, -73.9754, '["stadium","arena"]', 4.5, 18000, '917-555-0101', 'https://www.barclayscenter.com', 'Event days', 'https://maps.google.com/?q=Barclays+Center'),
  ('ChIJ_nl_msg', 'Madison Square Garden', '4 Pennsylvania Plaza', 'Manhattan', 40.7505, -73.9934, '["stadium","arena"]', 4.6, 42000, '212-465-6741', 'https://www.msg.com', 'Event days', 'https://maps.google.com/?q=Madison+Square+Garden'),
  ('ChIJ_nl_brooklynsteel', 'Brooklyn Steel', '319 Frost St', 'Brooklyn', 40.7168, -73.9362, '["night_club","event_venue"]', 4.5, 890, '718-555-0160', 'https://www.theneutral.com', 'Evenings', 'https://maps.google.com/?q=Brooklyn+Steel'),
  ('ChIJ_nl_1hotel', '1 Hotel Brooklyn Bridge', '60 Furman St', 'Brooklyn', 40.7022, -73.9954, '["lodging","rooftop"]', 4.6, 2100, '718-555-0177', 'https://www.1hotels.com', '24 hours', 'https://maps.google.com/?q=1+Hotel+Brooklyn+Bridge'),
  ('ChIJ_nl_lincoln', 'Lincoln Center Plaza', '10 Lincoln Center Plaza', 'Manhattan', 40.7725, -73.9835, '["performing_arts_theater","event_venue"]', 4.7, 9800, '212-555-0188', 'https://www.lincolncenter.org', 'Campus hours', 'https://maps.google.com/?q=Lincoln+Center'),
  ('ChIJ_nl_met', 'The Metropolitan Museum of Art', '1000 5th Ave', 'Manhattan', 40.7794, -73.9632, '["museum","event_venue"]', 4.8, 92000, '212-555-0171', 'https://www.metmuseum.org', '10:00–17:00', 'https://maps.google.com/?q=The+Met'),
  ('ChIJ_nl_brooklynmuseum', 'Brooklyn Museum', '200 Eastern Pkwy', 'Brooklyn', 40.6712, -73.9636, '["museum","event_venue"]', 4.6, 14000, '718-555-0192', 'https://www.brooklynmuseum.org', '11:00–18:00', 'https://maps.google.com/?q=Brooklyn+Museum'),
  ('ChIJ_nl_sohohouse', 'Soho House New York', '29-35 9th Ave', 'Manhattan', 40.7407, -74.0056, '["lodging","event_venue"]', 4.3, 760, '212-555-0133', 'https://www.sohohouse.com', 'Members', 'https://maps.google.com/?q=Soho+House+New+York'),
  ('ChIJ_nl_standard', 'The Standard High Line', '848 Washington St', 'Manhattan', 40.7408, -74.0079, '["lodging","night_club"]', 4.2, 3400, '212-555-0155', 'https://www.standardhotels.com', '24 hours', 'https://maps.google.com/?q=The+Standard+High+Line'),
  ('ChIJ_nl_timescenter', 'The Times Center', '242 W 41st St', 'Manhattan', 40.7555, -73.9887, '["event_venue"]', 4.4, 320, '212-556-4300', 'https://www.thetimescenter.com', 'By event', 'https://maps.google.com/?q=The+Times+Center'),
  ('ChIJ_nl_chelsea', 'Chelsea Piers', '62 Chelsea Piers', 'Manhattan', 40.7465, -74.0094, '["stadium","event_venue"]', 4.5, 2100, '212-336-6666', 'https://www.chelseapiers.com', '06:00–23:00', 'https://maps.google.com/?q=Chelsea+Piers'),
  ('ChIJ_nl_shed', 'The Shed', '545 W 30th St', 'Manhattan', 40.7530, -74.0022, '["performing_arts_theater"]', 4.5, 1800, '646-455-3494', 'https://theshed.org', 'By event', 'https://maps.google.com/?q=The+Shed+Hudson+Yards'),
  ('ChIJ_nl_gowanus', 'Northline Gowanus shop', '223 3rd St', 'Brooklyn', 40.6734, -73.9910, '["storage","point_of_interest"]', 5.0, 12, '718-555-0140', 'https://northline.av', '07:00–19:00', 'https://maps.google.com/?q=223+3rd+St+Brooklyn')
on conflict (place_id) do nothing;

insert into integration_status (provider, connected, detail, last_ok) values
  ('calendly', true, 'Per-user event types', now() - interval '12 minutes'),
  ('tidycal', true, 'Production load-in holds', now() - interval '25 minutes'),
  ('acuity', true, 'Estimate reviews', now() - interval '2 hours'),
  ('zoom', true, 'Meetings mint on confirm', now() - interval '8 minutes'),
  ('deezer', true, 'Public track search', now() - interval '1 minute'),
  ('google_places', true, 'NYC venue index, Places-shaped', now() - interval '4 minutes')
on conflict (provider) do nothing;

insert into show_tracks (deal_id, deezer_id, title, artist, album, duration_sec, role, link)
select 1, '3135556', 'Get Lucky', 'Daft Punk', 'Random Access Memories', 369, 'walk-in', 'https://www.deezer.com/track/3135556'
where not exists (select 1 from show_tracks where deal_id = 1);
