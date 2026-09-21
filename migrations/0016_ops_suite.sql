create table if not exists ai_profile (
  id integer primary key default 1,
  tone text not null default 'professional',
  specialties text not null default 'LED walls, line arrays, corporate town halls',
  service_area text not null default 'NYC metro — Manhattan, Brooklyn, Queens, Jersey City',
  greeting text not null default 'Northline here — LED, audio, and labor for live events.',
  brand_color text not null default 'b7c0cc',
  packages text not null default '["Corporate town hall","Gala / awards","Rooftop concert"]',
  faqs text not null default '[]',
  widget_slug text not null default 'northline',
  portal_domain text not null default 'portal.northline.av'
);

create table if not exists ai_drafts (
  id serial primary key,
  deal_id integer references deals(id),
  prompt text not null,
  body text not null,
  tone text,
  sent boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists prep_findings (
  id serial primary key,
  deal_id integer references deals(id),
  kind text not null,
  severity text not null default 'warn',
  detail text not null,
  source text not null default 'record',
  verified boolean not null default false,
  dismissed boolean not null default false
);

create table if not exists event_notes (
  id serial primary key,
  deal_id integer not null references deals(id) on delete cascade,
  category text not null default 'production',
  pinned boolean not null default false,
  body text not null,
  author_id integer references members(id),
  created_at timestamptz not null default now()
);

create table if not exists sms_messages (
  id serial primary key,
  person_id integer references people(id),
  deal_id integer references deals(id),
  direction text not null default 'out',
  body text not null,
  status text not null default 'delivered',
  created_at timestamptz not null default now()
);

create table if not exists sms_optins (
  person_id integer primary key references people(id),
  opted_in boolean not null default true,
  source text,
  at timestamptz not null default now()
);

create table if not exists cold_lists (
  id serial primary key,
  name text not null,
  tags text,
  created_at timestamptz not null default now()
);

create table if not exists cold_prospects (
  id serial primary key,
  list_id integer references cold_lists(id) on delete cascade,
  name text not null,
  email text not null,
  company text,
  promoted_lead_id integer,
  created_at timestamptz not null default now()
);

create table if not exists sending_domains (
  id serial primary key,
  domain text not null,
  spf boolean not null default true,
  dkim boolean not null default true,
  dmarc boolean not null default true,
  active boolean not null default true
);

create table if not exists mail_signatures (
  id serial primary key,
  member_id integer references members(id),
  body text not null
);

create table if not exists quotes (
  id serial primary key,
  deal_id integer references deals(id),
  person_name text,
  email text,
  event_type text,
  guest_count integer,
  indoor boolean,
  date text,
  total numeric not null default 0,
  status text not null default 'draft',
  abandoned boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists handoffs (
  id serial primary key,
  deal_id integer references deals(id),
  to_company text not null,
  include_finance boolean not null default false,
  monitor boolean not null default true,
  status text not null default 'sent',
  created_at timestamptz not null default now()
);

create table if not exists floor_plans (
  id serial primary key,
  name text not null,
  venue text,
  marks text not null default '[]',
  updated_at timestamptz not null default now()
);

create table if not exists guests (
  id serial primary key,
  deal_id integer references deals(id),
  name text not null,
  email text,
  party integer not null default 1,
  rsvp text not null default 'pending',
  meal text,
  notes text,
  token text
);

create table if not exists crew_shifts (
  id serial primary key,
  deal_id integer references deals(id),
  member_id integer references members(id),
  role text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  kind text not null default 'show'
);

create table if not exists invoices (
  id serial primary key,
  deal_id integer references deals(id),
  org_id integer references organizations(id),
  number text not null,
  amount numeric not null,
  status text not null default 'open',
  processor text,
  due_on date,
  paid_at timestamptz,
  standalone boolean not null default false,
  memo text
);

create table if not exists payments (
  id serial primary key,
  invoice_id integer references invoices(id),
  amount numeric not null,
  processor text not null,
  kind text not null default 'charge',
  created_at timestamptz not null default now()
);

create table if not exists gl_accounts (
  id serial primary key,
  code text not null,
  name text not null,
  kind text not null
);

create table if not exists gl_entries (
  id serial primary key,
  account_id integer references gl_accounts(id),
  amount numeric not null,
  memo text,
  posted_on date not null default current_date,
  recurring boolean not null default false
);

create table if not exists gigs (
  id serial primary key,
  deal_id integer references deals(id),
  role text not null,
  day_rate numeric,
  status text not null default 'open',
  notes text
);

create table if not exists gig_apps (
  id serial primary key,
  gig_id integer references gigs(id) on delete cascade,
  name text not null,
  stars numeric not null default 4.8,
  bio text,
  status text not null default 'pending'
);

create table if not exists reviews (
  id serial primary key,
  deal_id integer references deals(id),
  author text,
  stars integer not null default 5,
  body text,
  platform text,
  status text not null default 'asked',
  published_at timestamptz
);

create table if not exists directory_vendors (
  id serial primary key,
  name text not null,
  city text,
  category text not null,
  blurb text,
  available boolean not null default true
);

create table if not exists widget_chats (
  id serial primary key,
  visitor text not null default 'web',
  question text not null,
  answer text not null,
  lead_captured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists comm_prefs (
  person_id integer primary key references people(id),
  mail boolean not null default true,
  sms boolean not null default true,
  postal boolean not null default false
);

insert into ai_profile (id, tone, specialties, service_area, greeting, brand_color, packages, faqs, widget_slug, portal_domain)
values (
  1,
  'professional',
  'LED walls, line arrays, corporate town halls, galas',
  'NYC metro — Manhattan, Brooklyn, Queens, Jersey City',
  'Northline here — LED, audio, and labor for live events in New York. What date are you holding?',
  'b7c0cc',
  '["Corporate town hall","Gala / awards","Rooftop concert"]',
  '[{"q":"What does a town hall cost?","a":"Town halls typically start around $28k. A 10% retainer holds crew and truck for 14 days."},{"q":"Do you cover Brooklyn?","a":"Yes — Manhattan, Brooklyn, Queens, and Jersey City are in the house coverage area."}]',
  'northline',
  'portal.northline.av'
)
on conflict (id) do nothing;

insert into prep_findings (deal_id, kind, severity, detail, source) values
  (1, 'timed section', 'warn', 'Citadel load-in is 06:00 but strike is empty on the record.', 'record'),
  (1, 'burn-risk closer', 'risk', 'Playlist closer is a mashup still clearing — burn risk if legal has not signed.', 'email'),
  (4, 'conflicting contacts', 'warn', 'Theo Marsh and the 1 Hotel banquet desk both marked as day-of contact.', 'record'),
  (5, 'timed section', 'warn', 'Pier 17 has no strike window against the city noise curfew.', 'email')
on conflict do nothing;

insert into event_notes (deal_id, category, pinned, body, author_id) values
  (1, 'production', true, 'Cipriani dock is 47th. Wall is 8x4 of 2.6mm. FOH on the balcony rail, not the floor.', 1),
  (1, 'client', false, 'Elena wants a 90-second walk-on sting, no vocal bed under the CEO.', 2),
  (4, 'site', true, 'Rooftop wind hold at 28 mph. Ballast plan is in the plot PDF.', 3);

insert into sms_optins (person_id, opted_in, source) values
  (1, true, 'proposal'),
  (3, true, 'web form'),
  (4, true, 'portal'),
  (11, false, 'STOP reply')
on conflict (person_id) do nothing;

insert into sms_messages (person_id, deal_id, direction, body, status, created_at) values
  (1, 1, 'out', 'Elena — dock is 47th, load-in 06:00. Reply YES to confirm.', 'delivered', now() - interval '2 hours'),
  (1, 1, 'in', 'YES — security has the crew list.', 'delivered', now() - interval '90 minutes'),
  (4, 4, 'out', 'Theo, ceremony flip is 45m. We will text when truss is in.', 'delivered', now() - interval '1 day');

insert into cold_lists (id, name, tags) values
  (1, 'NAB 2026 badge scan', 'expo,nab'),
  (2, 'Bought Brooklyn planners', 'bought,wedding')
on conflict (id) do nothing;

insert into cold_prospects (list_id, name, email, company) values
  (1, 'Priya Shah', 'priya.shah@eventful.co', 'Eventful'),
  (1, 'Marcus Hale', 'mhale@brightroom.tv', 'Bright Room'),
  (2, 'Ava Lind', 'ava@lindweddings.com', 'Lind Weddings');

insert into sending_domains (domain, spf, dkim, dmarc, active) values
  ('mail.northline.av', true, true, true, true);

insert into mail_signatures (member_id, body) values
  (1, '{{ae}}\nPrincipal, Northline\n{{phone}}\n{{event}} · {{venue}}');

insert into quotes (person_name, email, event_type, guest_count, indoor, date, total, status, abandoned) values
  ('Elena Voss', 'elena.voss@citadel.com', 'Gala / awards', 700, true, '2026-12-12', 266000, 'sent', false),
  ('Walk-in rooftop', 'hello@hold.co', 'Rooftop concert', 400, false, '2026-10-18', 92500, 'draft', true),
  ('Nora Ellis', 'nellis@pier17ny.com', 'Corporate town hall', 900, false, '2026-11-04', 148500, 'sent', false);

insert into handoffs (deal_id, to_company, include_finance, monitor, status) values
  (7, 'Atlantic Labor Co-op', false, true, 'sent');

insert into floor_plans (name, venue, marks) values
  (
    'Cipriani 42nd — ballroom',
    'Cipriani 42nd Street',
    '[{"id":"p1","kind":"power","x":12,"y":40,"label":"400A"},{"id":"l1","kind":"loadin","x":8,"y":88,"label":"Dock 47th"},{"id":"e1","kind":"egress","x":88,"y":50,"label":"Lex"},{"id":"s1","kind":"stage","x":50,"y":12,"label":"Stage"}]'
  );

insert into guests (deal_id, name, email, party, rsvp, meal, token) values
  (4, 'Maya Reed', 'maya.reed@example.com', 2, 'yes', 'fish', 'gst_maya4'),
  (4, 'Jonah Reed', 'jonah.reed@example.com', 1, 'pending', 'veg', 'gst_jonah4'),
  (4, 'Priya Shah', 'priya.shah@eventful.co', 2, 'no', null, 'gst_priya4'),
  (9, 'Board guest A', 'board.a@lincolncenter.org', 1, 'yes', 'meat', 'gst_lc9');

insert into crew_shifts (deal_id, member_id, role, starts_at, ends_at, kind) values
  (1, 1, 'A1', date_trunc('day', now()) + interval '6 hours', date_trunc('day', now()) + interval '18 hours', 'show'),
  (1, 2, 'LED TD', date_trunc('day', now()) + interval '5 hours', date_trunc('day', now()) + interval '16 hours', 'setup'),
  (1, 3, 'Stage', date_trunc('day', now()) + interval '18 hours', date_trunc('day', now()) + interval '22 hours', 'strike'),
  (4, 3, 'A2', date_trunc('day', now()) + interval '8 hours', date_trunc('day', now()) + interval '14 hours', 'travel'),
  (5, 2, 'Systems', date_trunc('day', now()) + interval '4 hours', date_trunc('day', now()) + interval '12 hours', 'setup'),
  (7, 1, 'PM', date_trunc('day', now()) + interval '7 hours', date_trunc('day', now()) + interval '20 hours', 'show');

insert into invoices (deal_id, org_id, number, amount, status, processor, due_on, paid_at, standalone, memo) values
  (9, 9, 'NL-1041', 155000, 'paid', 'stripe', current_date - 10, now() - interval '8 days', false, 'Lincoln Center plaza gala'),
  (10, 10, 'NL-1042', 0, 'open', 'square', current_date + 7, null, false, 'Spotify Upfront — amount missing'),
  (null, 11, 'NL-9001', 4200, 'open', 'paypal', current_date + 14, null, true, 'MA3 console sale — no event');

insert into payments (invoice_id, amount, processor, kind, created_at)
select id, amount, 'stripe', 'charge', now() - interval '8 days' from invoices where number = 'NL-1041';

insert into gl_accounts (code, name, kind) values
  ('4000', 'Production revenue', 'income'),
  ('4100', 'Dry hire revenue', 'income'),
  ('5000', 'Crew COGS', 'cogs'),
  ('5100', 'Gear COGS', 'cogs'),
  ('6000', 'Shop rent', 'opex'),
  ('6100', 'Insurance', 'opex')
on conflict do nothing;

insert into gl_entries (account_id, amount, memo, posted_on, recurring)
select id, 155000, 'Lincoln Center gala', current_date - 18, false from gl_accounts where code = '4000';
insert into gl_entries (account_id, amount, memo, posted_on, recurring)
select id, 203000, 'Spotify Upfront', current_date - 48, false from gl_accounts where code = '4000';
insert into gl_entries (account_id, amount, memo, posted_on, recurring)
select id, 41000, 'Citadel labor', current_date - 2, false from gl_accounts where code = '5000';
insert into gl_entries (account_id, amount, memo, posted_on, recurring)
select id, 18000, 'LED cross-hire', current_date - 5, false from gl_accounts where code = '5100';
insert into gl_entries (account_id, amount, memo, posted_on, recurring)
select id, 9200, 'Gowanus shop', current_date - 3, true from gl_accounts where code = '6000';
insert into gl_entries (account_id, amount, memo, posted_on, recurring)
select id, 3100, 'Liability', current_date - 3, true from gl_accounts where code = '6100';

insert into gigs (deal_id, role, day_rate, status, notes) values
  (5, 'A2 / RF tech', 725, 'open', 'Pier 17 rooftop. Hide if already booked that Saturday.'),
  (8, 'FOH engineer', 850, 'open', 'MoMA PS1 Warm Up. IP65, dance-floor PA.');

insert into gig_apps (gig_id, name, stars, bio, status) values
  (1, 'Chris Lang (freelance)', 4.9, 'House A2 at Soho House. Free the Pier 17 Saturday.', 'pending'),
  (1, 'Owen Hart', 4.7, 'PS1 staff — conflicts with Warm Up load-in.', 'pending'),
  (2, 'Luis Ortega', 4.8, 'Brooklyn Steel TD. Available after 14:00.', 'pending');

insert into reviews (deal_id, author, stars, body, platform, status) values
  (9, 'Sofia Mendes', 5, 'Quiet, on time, and the plaza never felt like a load-in.', null, 'received'),
  (10, 'Ben Adler', 5, 'Playback and IMAG just worked. Asking them back for next upfront.', 'google', 'published');

insert into directory_vendors (name, city, category, blurb, available) values
  ('Northline', 'Brooklyn', 'Full production', 'LED, audio, and labor for live events in New York.', true),
  ('Atlantic Labor Co-op', 'Brooklyn', 'Labor', 'IATSE-friendly overhire. Fair rotation on the directory.', true),
  ('Bright Room', 'Manhattan', 'Lighting', 'Theatrical and corporate. Open October Saturdays.', false),
  ('Harbor Video', 'Queens', 'IMAG / LED', 'Walls and cameras. Inquire without an account.', true);

insert into widget_chats (visitor, question, answer, lead_captured) values
  ('embed', 'Are you free October 18 at Pier 17?', 'Pier 17 is open that Saturday. Cipriani 42nd is held. I can book a 30m intro on Dana''s Calendly.', true);

insert into comm_prefs (person_id, mail, sms, postal)
select id, true, true, false from people
on conflict (person_id) do nothing;

insert into comm_prefs (person_id, mail, sms, postal) values (11, true, false, false)
on conflict (person_id) do update set sms = excluded.sms;

insert into ai_drafts (deal_id, prompt, body, tone) values
  (1, 'Confirm load-in and ask if the dock is still 47th.', 'Hi Elena,\n\nConfirming Cipriani load-in at 06:00. Is the dock still 47th?\n\nDana Okonkwo\nNorthline', 'professional');
