alter table people add column if not exists linkedin text;
alter table people add column if not exists enriched_at timestamptz;
alter table organizations add column if not exists employees text;
alter table organizations add column if not exists revenue_band text;
alter table organizations add column if not exists enriched_at timestamptz;

create table if not exists goals (
  id serial primary key,
  name text not null,
  kind text not null,
  target numeric not null,
  period_start date not null,
  period_end date not null,
  owner_id integer references members(id),
  pipeline_id integer references pipelines(id),
  created_at timestamptz not null default now()
);

create table if not exists visibility_groups (
  id serial primary key,
  name text not null,
  detail text not null default '',
  member_ids jsonb not null default '[]'
);

create table if not exists permission_sets (
  id serial primary key,
  name text not null,
  detail text not null default '',
  can_export boolean not null default true,
  can_delete boolean not null default false,
  can_admin boolean not null default false
);

create table if not exists api_tokens (
  id serial primary key,
  name text not null,
  token_hint text not null,
  scopes text not null default 'deals:read',
  last_used timestamptz,
  created_at timestamptz not null default now(),
  revoked boolean not null default false
);

create table if not exists activity_types (
  id serial primary key,
  name text not null,
  slug text not null unique,
  icon text not null default 'activity',
  active boolean not null default true
);

create table if not exists lost_reasons (
  id serial primary key,
  name text not null,
  sort_order integer not null default 0,
  active boolean not null default true
);

create table if not exists lead_routes (
  id serial primary key,
  source text not null,
  owner_id integer references members(id),
  team_id integer references teams(id),
  active boolean not null default true
);

create table if not exists email_accounts (
  id serial primary key,
  member_id integer references members(id),
  address text not null,
  kind text not null default 'personal',
  synced boolean not null default true,
  last_sync timestamptz
);

create table if not exists sequence_enrollments (
  id serial primary key,
  sequence_id integer not null references sequences(id) on delete cascade,
  person_id integer not null references people(id) on delete cascade,
  step_index integer not null default 0,
  status text not null default 'active',
  enrolled_at timestamptz not null default now()
);

create table if not exists deal_history (
  id serial primary key,
  deal_id integer not null references deals(id) on delete cascade,
  actor text not null,
  action text not null,
  detail text,
  created_at timestamptz not null default now()
);

create table if not exists chatbot_flows (
  id serial primary key,
  name text not null,
  active boolean not null default true,
  steps jsonb not null default '[]',
  conversations integer not null default 0
);

create table if not exists field_values (
  id serial primary key,
  field_id integer not null references custom_fields(id) on delete cascade,
  entity_type text not null,
  entity_id integer not null,
  value text
);

create index if not exists deal_history_deal_idx on deal_history (deal_id);
create index if not exists enrollments_seq_idx on sequence_enrollments (sequence_id);
