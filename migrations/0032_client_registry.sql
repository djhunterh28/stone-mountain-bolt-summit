-- Client registry: street addresses, geocode stamps, comm-pref timestamps.

alter table people add column if not exists address text;
alter table people add column if not exists geocoded_at timestamptz;
alter table comm_prefs add column if not exists updated_at timestamptz not null default now();

update people set address = '601 Lexington Ave', geocoded_at = now() - interval '20 days' where id = 1 and address is null;
update people set address = '200 Eastern Parkway', geocoded_at = now() - interval '18 days' where id = 2 and address is null;
update people set address = '21 Bond Street', geocoded_at = now() - interval '12 days' where id = 3 and address is null;
update people set address = '60 Furman Street', geocoded_at = now() - interval '8 days' where id = 4 and address is null;
update people set address = '89 South Street', geocoded_at = now() - interval '6 days' where id = 5 and address is null;
update people set address = '29-35 Ninth Avenue', geocoded_at = now() - interval '14 days' where id = 6 and address is null;
update people set address = '620 Atlantic Avenue', geocoded_at = now() - interval '10 days' where id = 7 and address is null;
update people set address = '22-25 Jackson Avenue', geocoded_at = now() - interval '9 days' where id = 8 and address is null;
update people set address = '70 Lincoln Center Plaza', geocoded_at = now() - interval '40 days' where id = 9 and address is null;
update people set address = '4 World Trade Center', geocoded_at = now() - interval '50 days' where id = 10 and address is null;
update people set address = '55 Washington Street' where id = 11 and address is null;
update people set address = '848 Washington Street', geocoded_at = now() - interval '11 days' where id = 12 and address is null;
update people set address = '319 Frost Street', geocoded_at = now() - interval '7 days' where id = 13 and address is null;
update people set address = '1000 Fifth Avenue', geocoded_at = now() - interval '3 days' where id = 14 and address is null;
update people set address = '140 West 23rd Street', geocoded_at = now() - interval '5 days' where id = 15 and address is null;
update people set address = '110 Wall Street' where id = 16 and address is null;
update people set address = 'Tribeca loft, North Moore', geocoded_at = now() - interval '4 days' where id = 17 and address is null;

insert into comm_prefs (person_id, mail, sms, postal)
select id, true, true, false from people
on conflict (person_id) do nothing;
