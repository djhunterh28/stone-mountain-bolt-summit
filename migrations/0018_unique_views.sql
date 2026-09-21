-- Weekend doubles + crew on the actual event date so Unique Views has real overlap.
-- Inquiry log is 18 months of season-shaped inbound (gala-heavy fall, outdoor May–June).

create table if not exists inquiry_log (
  day date primary key,
  leads integer not null default 0,
  deals integer not null default 0,
  forms integer not null default 0
);

insert into inquiry_log (day, leads, deals, forms)
select
  d::date,
  greatest(0, base + weekend + wobble),
  greatest(0, (base / 2) + (wobble / 2)),
  greatest(0, (base + weekend) / 3)
from (
  select
    d,
    case extract(month from d)::int
      when 1 then 0
      when 2 then 0
      when 3 then 1
      when 4 then 1
      when 5 then 2
      when 6 then 2
      when 7 then 1
      when 8 then 1
      when 9 then 2
      when 10 then 3
      when 11 then 3
      else 3
    end as base,
    case when extract(dow from d)::int in (0, 5, 6) then 1 else 0 end as weekend,
    (extract(epoch from d)::int / 86400) % 3 - 1 as wobble
  from generate_series(current_date - interval '540 days', current_date, interval '1 day') as d
) s
on conflict (day) do nothing;

-- Coming Saturday: plaza activation + members night (two ops, two boroughs).
update deals
set event_date = current_date + ((6 - extract(dow from current_date)::int + 7) % 7)
where id in (6, 7);

-- Same-day indoor pair twelve days out.
update deals
set event_date = current_date + 12
where id in (15, 16);

insert into crew_shifts (deal_id, member_id, role, starts_at, ends_at, kind)
select d.id, m.member_id, m.role,
  (d.event_date::timestamp + m.start_off),
  (d.event_date::timestamp + m.end_off),
  m.kind
from deals d
join (values
  (6, 5, 'A2', interval '10 hours', interval '16 hours', 'show'),
  (6, 4, 'Lead tech', interval '8 hours', interval '12 hours', 'setup'),
  (6, 6, 'Strike', interval '16 hours', interval '18 hours', 'strike'),
  (7, 1, 'PM', interval '6 hours', interval '20 hours', 'show'),
  (7, 2, 'LED TD', interval '5 hours', interval '14 hours', 'setup'),
  (7, 3, 'Stage', interval '18 hours', interval '22 hours', 'strike'),
  (7, 4, 'Driver', interval '4 hours', interval '7 hours', 'travel'),
  (15, 2, 'IMAG', interval '6 hours', interval '16 hours', 'show'),
  (15, 5, 'A1', interval '5 hours', interval '18 hours', 'show'),
  (16, 3, 'A2', interval '9 hours', interval '15 hours', 'show'),
  (16, 6, 'Runner', interval '7 hours', interval '10 hours', 'travel'),
  (4, 3, 'A2', interval '8 hours', interval '18 hours', 'show'),
  (4, 1, 'PM', interval '6 hours', interval '20 hours', 'show'),
  (1, 1, 'A1', interval '6 hours', interval '18 hours', 'show'),
  (1, 2, 'LED TD', interval '5 hours', interval '16 hours', 'setup'),
  (1, 3, 'Stage', interval '18 hours', interval '22 hours', 'strike')
) as m(deal_id, member_id, role, start_off, end_off, kind) on m.deal_id = d.id
where d.id in (1, 4, 6, 7, 15, 16);
