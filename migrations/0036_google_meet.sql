alter table scheduling_connections add column if not exists auto_meet boolean not null default true;

alter table bookings add column if not exists meet_code text;
alter table bookings add column if not exists meet_join_url text;

insert into scheduling_connections (member_id, provider, handle, token_hint, connected, auto_zoom, auto_meet, confirm_email, last_sync)
select 1, 'meet', 'dana@hurricaneproductionsllc.com', 'gmt_live_9f3…k', true, false, true, true, now() - interval '6 minutes'
where not exists (select 1 from scheduling_connections where member_id = 1 and provider = 'meet');

insert into scheduling_connections (member_id, provider, handle, token_hint, connected, auto_zoom, auto_meet, confirm_email, last_sync)
select 3, 'meet', 'priya@hurricaneproductionsllc.com', 'gmt_live_2c8…w', true, false, true, true, now() - interval '1 hour'
where not exists (select 1 from scheduling_connections where member_id = 3 and provider = 'meet');

insert into integration_status (provider, connected, detail, last_ok) values
  ('google_meet', true, 'Workspace Meet spaces mint on confirm', now() - interval '6 minutes')
on conflict (provider) do nothing;

insert into marketplace_apps (name, category, description, connected)
select 'Google Meet', 'Calendar', 'Workspace Meet links on consults and deals.', true
where not exists (select 1 from marketplace_apps where name = 'Google Meet');

update bookings set
  meet_code = coalesce(meet_code, 'hpw-dana-n1e'),
  meet_join_url = coalesce(meet_join_url, 'https://meet.google.com/hpw-dana-n1e')
where id = (select id from bookings order by starts_at limit 1);
