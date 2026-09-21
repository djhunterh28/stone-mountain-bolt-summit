alter table web_forms add column if not exists description text;
alter table web_forms add column if not exists thank_you text;
alter table web_forms add column if not exists notify_email text;
alter table web_forms add column if not exists allow_embed boolean not null default true;
alter table web_forms add column if not exists wizard boolean not null default false;
alter table web_forms add column if not exists vendor_lock boolean not null default false;
alter table web_forms add column if not exists creates_lead boolean not null default true;
alter table web_forms add column if not exists steps jsonb not null default '[]';
alter table web_forms add column if not exists updated_at timestamptz not null default now();

alter table form_submissions add column if not exists vendor_id integer references directory_vendors(id);
alter table form_submissions add column if not exists source text not null default 'public';

create unique index if not exists web_forms_slug_idx on web_forms (slug);

create table if not exists form_vendor_assign (
  form_id integer not null references web_forms(id) on delete cascade,
  vendor_id integer not null references directory_vendors(id) on delete cascade,
  token text not null,
  primary key (form_id, vendor_id)
);

create unique index if not exists form_vendor_assign_token_idx on form_vendor_assign (token);

create table if not exists form_uploads (
  id serial primary key,
  submission_id integer references form_submissions(id) on delete cascade,
  form_id integer not null references web_forms(id) on delete cascade,
  field_id text not null,
  filename text not null,
  mime text,
  size_bytes integer not null default 0,
  data_b64 text not null default '',
  truncated boolean not null default false,
  created_at timestamptz not null default now()
);

update web_forms set
  description = 'Hold a walk at the venue. New Business picks this up the same day.',
  thank_you = 'Received. An AE will confirm the walk from the Gowanus shop.',
  wizard = true,
  allow_embed = true,
  creates_lead = true,
  notify_email = 'sales@northline.av',
  steps = '[
    {"id":"contact","title":"Who is asking","description":"We route this to New Business."},
    {"id":"event","title":"Date and room","description":"Outdoor dates pull generator and weather fields."},
    {"id":"prod","title":"What you are staging"}
  ]'::jsonb,
  fields = '[
    {"id":"name","label":"Your name","type":"text","required":true,"step":0,"placeholder":"Elena Voss"},
    {"id":"email","label":"Email","type":"email","required":true,"step":0,"placeholder":"you@company.com"},
    {"id":"org","label":"Company","type":"text","required":false,"step":0},
    {"id":"phone","label":"Phone","type":"tel","required":false,"step":0},
    {"id":"venue","label":"Venue","type":"text","required":true,"step":1,"placeholder":"Cipriani 42nd"},
    {"id":"date","label":"Event date","type":"date","required":true,"step":1},
    {"id":"indoor","label":"Indoor or outdoor","type":"radio","required":true,"step":1,"options":["Indoor","Outdoor"]},
    {"id":"generator","label":"Need a generator","type":"yesno","required":false,"step":1,"condition":{"fieldId":"indoor","op":"eq","value":"Outdoor"}},
    {"id":"weather","label":"Weather backup","type":"textarea","required":false,"step":1,"placeholder":"Tent, delay, or indoor hold","condition":{"fieldId":"indoor","op":"eq","value":"Outdoor"}},
    {"id":"guests","label":"Headcount","type":"number","required":false,"step":1},
    {"id":"notes","label":"What are you staging","type":"textarea","required":false,"step":2},
    {"id":"plot","label":"Plot or deck","type":"file","required":false,"step":2,"accept":"application/pdf,image/*","help":"PDF or image, used by the shop to prep the walk."}
  ]'::jsonb
where slug = 'site-survey';

update web_forms set
  description = 'PA, lights, and LED without crew. Shop confirms availability.',
  thank_you = 'Logged. Dry hire desk will confirm the hold.',
  wizard = false,
  allow_embed = true,
  creates_lead = true,
  notify_email = 'shop@northline.av',
  steps = '[]'::jsonb,
  fields = '[
    {"id":"name","label":"Name","type":"text","required":true},
    {"id":"email","label":"Email","type":"email","required":true},
    {"id":"gear","label":"Gear list","type":"textarea","required":true,"placeholder":"2x d&b Y10P, 1x YS18, 12x MAC Aura"},
    {"id":"dates","label":"Dates","type":"text","required":true},
    {"id":"delivery","label":"Need delivery","type":"yesno","required":false},
    {"id":"address","label":"Delivery address","type":"text","required":false,"condition":{"fieldId":"delivery","op":"eq","value":"Yes"}}
  ]'::jsonb
where slug = 'dry-hire';

insert into web_forms (name, slug, description, thank_you, wizard, vendor_lock, creates_lead, allow_embed, notify_email, steps, fields, active, submissions)
select
  'Show intake',
  'show-intake',
  'Public event brief. LED fields only appear when the wall is needed.',
  'We have the brief. Production will reply with a hold.',
  true,
  false,
  true,
  true,
  'sales@northline.av',
  '[
    {"id":"who","title":"Contact"},
    {"id":"show","title":"The show"},
    {"id":"kit","title":"Kit"}
  ]'::jsonb,
  '[
    {"id":"name","label":"Name","type":"text","required":true,"step":0},
    {"id":"email","label":"Email","type":"email","required":true,"step":0},
    {"id":"org","label":"Company","type":"text","required":false,"step":0},
    {"id":"title","label":"Show name","type":"text","required":true,"step":1,"placeholder":"Q3 town hall"},
    {"id":"venue","label":"Venue","type":"text","required":true,"step":1},
    {"id":"date","label":"Date","type":"date","required":true,"step":1},
    {"id":"guests","label":"Headcount","type":"number","required":false,"step":1},
    {"id":"need_led","label":"Need an LED wall","type":"yesno","required":true,"step":2},
    {"id":"wall_size","label":"Wall size","type":"select","required":true,"step":2,"options":["8x8","12x8","16x9","custom"],"condition":{"fieldId":"need_led","op":"eq","value":"Yes"}},
    {"id":"pixel_pitch","label":"Pixel pitch","type":"radio","required":false,"step":2,"options":["1.5 mm","2.6 mm","3.9 mm"],"condition":{"fieldId":"need_led","op":"eq","value":"Yes"}},
    {"id":"playback","label":"Playback","type":"select","required":false,"step":2,"options":["Resolume","BrightSign","Client playback"],"condition":{"fieldId":"need_led","op":"eq","value":"Yes"}},
    {"id":"audio","label":"Audio","type":"multicheck","required":false,"step":2,"options":["Speech PA","Playback","IEM","Press mult"]},
    {"id":"notes","label":"Notes","type":"textarea","required":false,"step":2}
  ]'::jsonb,
  true,
  4
where not exists (select 1 from web_forms where slug = 'show-intake');

insert into web_forms (name, slug, description, thank_you, wizard, vendor_lock, creates_lead, allow_embed, notify_email, steps, fields, active, submissions)
select
  'Vendor COI packet',
  'vendor-coi',
  'Insurance and W-9 for assigned vendors only. Token in the URL — no Northline login.',
  'Packet received. Accounts will review before the next load-in.',
  false,
  true,
  false,
  true,
  'accounts@northline.av',
  '[]'::jsonb,
  '[
    {"id":"intro","label":"Current certificate","type":"heading","required":false,"help":"GL at $1M per occurrence. Additional insured: Northline LLC."},
    {"id":"company","label":"Legal name","type":"text","required":true},
    {"id":"email","label":"Accounts email","type":"email","required":true},
    {"id":"policy","label":"Policy number","type":"text","required":true},
    {"id":"expiry","label":"Expiry","type":"date","required":true},
    {"id":"gl_limit","label":"General liability","type":"select","required":true,"options":["$1M / $2M","$2M / $4M","$5M umbrella"]},
    {"id":"coi","label":"Certificate of insurance","type":"file","required":true,"accept":"application/pdf","help":"PDF only."},
    {"id":"w9","label":"W-9","type":"file","required":false,"accept":"application/pdf"}
  ]'::jsonb,
  true,
  2
where not exists (select 1 from web_forms where slug = 'vendor-coi');

insert into form_vendor_assign (form_id, vendor_id, token)
select f.id, v.id, t.token
from web_forms f
cross join (values
  ('Atlantic Labor Co-op', 'nlv_atlantic8k2'),
  ('Bright Room', 'nlv_brightroom4p'),
  ('Harbor Video', 'nlv_harborvid29q')
) as t(name, token)
join directory_vendors v on v.name = t.name
where f.slug = 'vendor-coi'
on conflict (form_id, vendor_id) do nothing;

insert into form_submissions (form_id, payload, source, vendor_id, created_at)
select f.id, '{"name":"Maya Chen","email":"maya@onedrop.nyc","org":"One Drop","title":"Fall gala","venue":"Cipriani 42nd","date":"2026-10-18","guests":"420","need_led":"Yes","wall_size":"16x9","pixel_pitch":"2.6 mm","playback":"Resolume","audio":"Speech PA,Playback","notes":"IMAG on two 9:16 portrait screens"}'::jsonb, 'embed', null, now() - interval '1 day'
from web_forms f where f.slug = 'show-intake'
and not exists (select 1 from form_submissions s where s.form_id = f.id);

insert into form_submissions (form_id, payload, source, vendor_id, created_at)
select f.id, '{"company":"Atlantic Labor Co-op","email":"risk@atlanticlabor.coop","policy":"GL-88421-NY","expiry":"2027-03-01","gl_limit":"$2M / $4M","coi":"atlantic-coi-2026.pdf"}'::jsonb, 'vendor', v.id, now() - interval '3 days'
from web_forms f
join directory_vendors v on v.name = 'Atlantic Labor Co-op'
where f.slug = 'vendor-coi'
and not exists (
  select 1 from form_submissions s where s.form_id = f.id and s.vendor_id = v.id
);
