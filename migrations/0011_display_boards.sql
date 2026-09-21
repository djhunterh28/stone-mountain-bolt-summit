create table if not exists display_boards (
  id serial primary key,
  name text not null,
  location text not null,
  kind text not null default 'warehouse',
  token text not null unique,
  active boolean not null default true,
  last_seen timestamptz,
  created_at timestamptz not null default now()
);

insert into display_boards (name, location, kind, token)
select 'Gowanus shop', 'Warehouse floor', 'warehouse', 'nlb_gowanus8k2m'
where not exists (select 1 from display_boards where token = 'nlb_gowanus8k2m');

insert into display_boards (name, location, kind, token)
select 'Front office', 'Account floor', 'office', 'nlb_office4p9q'
where not exists (select 1 from display_boards where token = 'nlb_office4p9q');

-- Land a handful of live jobs on today / tomorrow / yesterday so the kiosk
-- always has a day to show. Pipeline stages stay as they are.
update deals set event_date = current_date, load_in = '06:00' where id = 15;
update deals set event_date = current_date, load_in = '07:00' where id = 7;
update deals set event_date = current_date, load_in = '08:00' where id = 4;
update deals set event_date = current_date, load_in = '09:00' where id = 20;
update deals set event_date = current_date, load_in = '12:00' where id = 12;
update deals set event_date = current_date + 1, load_in = '10:00' where id = 6;
update deals set event_date = current_date - 1, load_in = '05:00' where id = 9;

insert into deal_products (deal_id, product_id, qty, discount, price)
select 20, 4, 1, 0, 850
where not exists (select 1 from deal_products where deal_id = 20 and product_id = 4);

insert into deal_products (deal_id, product_id, qty, discount, price)
select 12, 12, 1, 0, 450
where not exists (select 1 from deal_products where deal_id = 12 and product_id = 12);

insert into deal_products (deal_id, product_id, qty, discount, price)
select 6, 5, 12, 0, 95
where not exists (select 1 from deal_products where deal_id = 6 and product_id = 5);

insert into deal_products (deal_id, product_id, qty, discount, price)
select 6, 11, 3, 0, 520
where not exists (select 1 from deal_products where deal_id = 6 and product_id = 11);

insert into deal_products (deal_id, product_id, qty, discount, price)
select 15, 12, 2, 0, 450
where not exists (select 1 from deal_products where deal_id = 15 and product_id = 12);

insert into deal_products (deal_id, product_id, qty, discount, price)
select 4, 12, 1, 0, 450
where not exists (select 1 from deal_products where deal_id = 4 and product_id = 12);
