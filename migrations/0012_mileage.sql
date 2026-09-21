create table if not exists vehicles (
  id serial primary key,
  name text not null,
  kind text not null default 'box-26',
  plate text,
  mpg numeric,
  rate_per_mile numeric not null default 0.70,
  fuel text not null default 'diesel',
  reimburse boolean not null default false,
  active boolean not null default true,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists travel_places (
  id serial primary key,
  name text not null,
  kind text not null default 'venue',
  org_id integer references organizations(id),
  address text,
  city text,
  lat double precision not null,
  lng double precision not null
);

create table if not exists mileage_trips (
  id serial primary key,
  traveled_on date not null default current_date,
  vehicle_id integer references vehicles(id),
  driver_id integer references members(id),
  deal_id integer references deals(id),
  origin_id integer not null references travel_places(id),
  dest_id integer not null references travel_places(id),
  miles numeric not null,
  purpose text,
  tolls numeric not null default 0,
  parking numeric not null default 0,
  status text not null default 'logged',
  notes text,
  created_at timestamptz not null default now()
);

insert into vehicles (name, kind, plate, mpg, rate_per_mile, fuel, reimburse, notes) values
  ('26ft #41', 'box-26', 'NY 2481-NL', 8.5, 2.15, 'diesel', false, 'LED and audio. Shop door A.'),
  ('26ft #42', 'box-26', 'NY 2482-NL', 8.2, 2.15, 'diesel', false, 'Lighting and staging. Shop door B.'),
  ('53ft #7', 'trailer-53', 'NY 9104-NL', 6.1, 3.40, 'diesel', false, 'Long haul / arena.'),
  ('Cargo van', 'van', 'NY 551-VAN', 18.0, 0.92, 'gas', false, 'Consoles, RF, small dry hire.'),
  ('Dana personal', 'personal', 'NY 441-DO', 28.0, 0.70, 'gas', true, 'IRS standard mileage.');

insert into travel_places (name, kind, org_id, address, city, lat, lng)
select 'Gowanus shop', 'shop', null, '223 3rd St', 'Brooklyn', 40.6734, -73.9910
where not exists (select 1 from travel_places where kind = 'shop');

insert into travel_places (name, kind, org_id, address, city, lat, lng)
select name, 'venue', id, address, city, lat, lng from organizations
where lat is not null and lng is not null
  and not exists (select 1 from travel_places p where p.org_id = organizations.id);

insert into travel_places (name, kind, address, city, lat, lng)
select 'Cipriani 42nd Street', 'venue', '110 E 42nd St', 'Manhattan', 40.7512, -73.9772
where not exists (select 1 from travel_places where name = 'Cipriani 42nd Street');

insert into travel_places (name, kind, address, city, lat, lng)
select 'Tribeca loft', 'venue', 'Greenwich St', 'Manhattan', 40.7195, -74.0094
where not exists (select 1 from travel_places where name = 'Tribeca loft');

-- Today's pulls + a strike return, so the log matches the warehouse board.
insert into mileage_trips (traveled_on, vehicle_id, driver_id, deal_id, origin_id, dest_id, miles, purpose, tolls, parking, status)
select current_date, 1, 4, 15,
  (select id from travel_places where kind = 'shop' limit 1),
  (select id from travel_places where org_id = 15 limit 1),
  7.1, 'Peloton load-in', 0, 28, 'logged'
where not exists (select 1 from mileage_trips where deal_id = 15 and purpose = 'Peloton load-in');

insert into mileage_trips (traveled_on, vehicle_id, driver_id, deal_id, origin_id, dest_id, miles, purpose, tolls, parking, status)
select current_date, 2, 6, 7,
  (select id from travel_places where kind = 'shop' limit 1),
  (select id from travel_places where org_id = 7 limit 1),
  1.5, 'Barclays plaza pull', 0, 0, 'logged'
where not exists (select 1 from mileage_trips where deal_id = 7);

insert into mileage_trips (traveled_on, vehicle_id, driver_id, deal_id, origin_id, dest_id, miles, purpose, tolls, parking, status)
select current_date, 4, 3, 4,
  (select id from travel_places where kind = 'shop' limit 1),
  (select id from travel_places where org_id = 4 limit 1),
  2.6, '1 Hotel rooftop', 0, 18, 'submitted'
where not exists (select 1 from mileage_trips where deal_id = 4);

insert into mileage_trips (traveled_on, vehicle_id, driver_id, deal_id, origin_id, dest_id, miles, purpose, tolls, parking, status)
select current_date, 4, 5, 20,
  (select id from travel_places where kind = 'shop' limit 1),
  (select id from travel_places where org_id = 11 limit 1),
  4.1, 'MA3 pickup — Vice', 0, 0, 'logged'
where not exists (select 1 from mileage_trips where deal_id = 20);

insert into mileage_trips (traveled_on, vehicle_id, driver_id, deal_id, origin_id, dest_id, miles, purpose, tolls, parking, status)
select current_date - 1, 3, 4, 9,
  (select id from travel_places where org_id = 9 limit 1),
  (select id from travel_places where kind = 'shop' limit 1),
  8.9, 'Lincoln Center strike', 6.75, 0, 'reimbursed'
where not exists (select 1 from mileage_trips where deal_id = 9);

insert into mileage_trips (traveled_on, vehicle_id, driver_id, deal_id, origin_id, dest_id, miles, purpose, tolls, parking, status)
select current_date - 3, 5, 1, 3,
  (select id from travel_places where kind = 'shop' limit 1),
  (select id from travel_places where org_id = 3 limit 1),
  4.8, 'Nike Bond St site walk', 0, 16, 'reimbursed'
where not exists (select 1 from mileage_trips where deal_id = 3 and purpose like 'Nike%');
