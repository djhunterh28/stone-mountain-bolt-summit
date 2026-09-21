-- Extra production files for the 1 Hotel emergency pack. Snapshot freeze happens at first desk load.

insert into files (entity_type, entity_id, name, kind, size_kb, uploaded_by, created_at)
select 'deal', 4, '1Hotel_rooftop_plot.pdf', 'plot', 2400, 1, now() - interval '2 days'
where not exists (select 1 from files where entity_type = 'deal' and entity_id = 4 and name = '1Hotel_rooftop_plot.pdf');

insert into files (entity_type, entity_id, name, kind, size_kb, uploaded_by, created_at)
select 'deal', 4, '1Hotel_wind_hold.pdf', 'site', 420, 1, now() - interval '5 days'
where not exists (select 1 from files where entity_type = 'deal' and entity_id = 4 and name = '1Hotel_wind_hold.pdf');
