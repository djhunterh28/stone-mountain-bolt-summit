create table if not exists teams (
  id serial primary key,
  name text not null,
  description text not null default ''
);

create table if not exists members (
  id serial primary key,
  name text not null,
  email text not null,
  title text not null,
  role text not null,
  team_id integer references teams(id),
  initials text not null,
  tone text not null default 'steel'
);

create table if not exists pipelines (
  id serial primary key,
  name text not null,
  sort_order integer not null default 0
);

create table if not exists stages (
  id serial primary key,
  pipeline_id integer not null references pipelines(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  rotting_days integer not null default 14,
  probability integer not null default 0
);

create table if not exists organizations (
  id serial primary key,
  name text not null,
  website text,
  address text,
  city text,
  industry text,
  owner_id integer references members(id),
  lat double precision,
  lng double precision,
  phone text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists people (
  id serial primary key,
  name text not null,
  email text,
  phone text,
  title text,
  org_id integer references organizations(id),
  owner_id integer references members(id),
  city text,
  lat double precision,
  lng double precision,
  created_at timestamptz not null default now()
);

create table if not exists deals (
  id serial primary key,
  title text not null,
  value numeric not null default 0,
  pipeline_id integer not null references pipelines(id),
  stage_id integer not null references stages(id),
  org_id integer references organizations(id),
  person_id integer references people(id),
  owner_id integer references members(id),
  status text not null default 'open',
  lost_reason text,
  expected_close date,
  probability integer,
  source text,
  event_date date,
  venue text,
  guest_count integer,
  indoor boolean,
  load_in text,
  notes text,
  stage_entered_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  won_at timestamptz,
  lost_at timestamptz
);

create table if not exists leads (
  id serial primary key,
  title text not null,
  person_id integer references people(id),
  org_id integer references organizations(id),
  owner_id integer references members(id),
  source text not null default 'web form',
  score integer not null default 0,
  status text not null default 'new',
  labels text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id serial primary key,
  name text not null,
  sku text,
  category text not null,
  unit_price numeric not null,
  unit text not null default 'day',
  billing text not null default 'one-time',
  description text,
  active boolean not null default true
);

create table if not exists deal_products (
  id serial primary key,
  deal_id integer not null references deals(id) on delete cascade,
  product_id integer not null references products(id),
  qty numeric not null default 1,
  discount numeric not null default 0,
  price numeric not null
);

create table if not exists activities (
  id serial primary key,
  type text not null,
  subject text not null,
  deal_id integer references deals(id) on delete set null,
  lead_id integer references leads(id) on delete set null,
  person_id integer references people(id),
  org_id integer references organizations(id),
  owner_id integer references members(id),
  due_at timestamptz,
  done boolean not null default false,
  duration_min integer not null default 30,
  location text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists comments (
  id serial primary key,
  entity_type text not null,
  entity_id integer not null,
  author_id integer references members(id),
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists files (
  id serial primary key,
  entity_type text not null,
  entity_id integer not null,
  name text not null,
  kind text not null default 'file',
  size_kb integer not null default 0,
  uploaded_by integer references members(id),
  created_at timestamptz not null default now()
);

create table if not exists emails (
  id serial primary key,
  folder text not null default 'inbox',
  from_name text not null,
  from_addr text not null,
  to_addr text not null,
  subject text not null,
  body text not null,
  deal_id integer references deals(id),
  person_id integer references people(id),
  opened boolean not null default false,
  clicked boolean not null default false,
  scheduled_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists email_templates (
  id serial primary key,
  name text not null,
  subject text not null,
  body text not null
);

create table if not exists documents (
  id serial primary key,
  name text not null,
  deal_id integer references deals(id),
  template text not null default 'proposal',
  status text not null default 'draft',
  content text,
  sent_at timestamptz,
  viewed_at timestamptz,
  signed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists projects (
  id serial primary key,
  name text not null,
  deal_id integer references deals(id),
  status text not null default 'open',
  start_date date,
  end_date date,
  owner_id integer references members(id),
  created_at timestamptz not null default now()
);

create table if not exists project_tasks (
  id serial primary key,
  project_id integer not null references projects(id) on delete cascade,
  title text not null,
  column_name text not null default 'To do',
  assignee_id integer references members(id),
  due_at date,
  sort_order integer not null default 0
);

create table if not exists automations (
  id serial primary key,
  name text not null,
  active boolean not null default true,
  trigger_type text not null,
  trigger_detail text,
  action_type text not null,
  action_detail text,
  conditions text,
  runs integer not null default 0
);

create table if not exists sequences (
  id serial primary key,
  name text not null,
  active boolean not null default true,
  steps jsonb not null default '[]',
  enrolled integer not null default 0
);

create table if not exists web_forms (
  id serial primary key,
  name text not null,
  slug text not null,
  fields jsonb not null default '[]',
  active boolean not null default true,
  submissions integer not null default 0
);

create table if not exists form_submissions (
  id serial primary key,
  form_id integer not null references web_forms(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists chats (
  id serial primary key,
  visitor_name text not null,
  visitor_email text,
  status text not null default 'open',
  assignee_id integer references members(id),
  source text not null default 'live-chat',
  last_message text,
  updated_at timestamptz not null default now()
);

create table if not exists chat_messages (
  id serial primary key,
  chat_id integer not null references chats(id) on delete cascade,
  sender text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists prospect_companies (
  id serial primary key,
  name text not null,
  industry text,
  city text,
  employees text,
  website text,
  email text,
  phone text,
  added boolean not null default false
);

create table if not exists scheduler_links (
  id serial primary key,
  member_id integer references members(id),
  name text not null,
  duration_min integer not null default 30,
  slug text not null,
  bookings integer not null default 0
);

create table if not exists bookings (
  id serial primary key,
  link_id integer references scheduler_links(id),
  guest_name text not null,
  guest_email text not null,
  starts_at timestamptz not null,
  notes text
);

create table if not exists notifications (
  id serial primary key,
  member_id integer references members(id),
  kind text not null,
  title text not null,
  body text not null,
  href text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists audit_log (
  id serial primary key,
  actor text not null,
  action text not null,
  entity text not null,
  detail text,
  ip text,
  device text,
  created_at timestamptz not null default now()
);

create table if not exists security_alerts (
  id serial primary key,
  severity text not null,
  title text not null,
  detail text not null,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists security_rules (
  id serial primary key,
  name text not null,
  detail text not null,
  active boolean not null default true
);

create table if not exists devices (
  id serial primary key,
  member_name text not null,
  device text not null,
  location text not null,
  last_active timestamptz not null default now(),
  current boolean not null default false
);

create table if not exists webhooks (
  id serial primary key,
  url text not null,
  event text not null,
  active boolean not null default true,
  last_status text
);

create table if not exists custom_fields (
  id serial primary key,
  entity text not null,
  name text not null,
  field_type text not null,
  options text,
  required boolean not null default false,
  pipeline_id integer references pipelines(id)
);

create table if not exists score_models (
  id serial primary key,
  name text not null,
  entity text not null default 'lead',
  rules jsonb not null default '[]',
  active boolean not null default true
);

create table if not exists marketplace_apps (
  id serial primary key,
  name text not null,
  category text not null,
  description text not null,
  connected boolean not null default false
);

create table if not exists custom_reports (
  id serial primary key,
  name text not null,
  kind text not null,
  config jsonb not null default '{}'
);

create index if not exists deals_stage_idx on deals (stage_id);
create index if not exists deals_owner_idx on deals (owner_id);
create index if not exists deals_status_idx on deals (status);
create index if not exists activities_due_idx on activities (due_at);
create index if not exists people_org_idx on people (org_id);
