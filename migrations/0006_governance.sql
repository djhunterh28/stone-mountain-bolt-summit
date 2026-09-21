alter table people add column if not exists mobile text;
alter table people add column if not exists direct_dial text;

create table if not exists access_policy (
  id integer primary key default 1,
  hours_enforced boolean not null default true,
  office_start text not null default '07:00',
  office_end text not null default '22:00',
  timezone text not null default 'America/New_York',
  ip_enforced boolean not null default true,
  ip_allowlist jsonb not null default '["74.64.0.0/16"]',
  mfa_required boolean not null default true,
  idle_minutes integer not null default 15,
  max_failed integer not null default 3,
  admin_approval boolean not null default true,
  encryption_at_rest boolean not null default true,
  export_approval boolean not null default true
);

create table if not exists session_context (
  id integer primary key default 1,
  location_label text not null default 'Gowanus shop',
  ip text not null default '74.64.12.4',
  clock_mode text not null default 'live',
  locked boolean not null default false,
  failed_attempts integer not null default 0
);

create table if not exists enrichment_credits (
  id integer primary key default 1,
  remaining integer not null default 487,
  used integer not null default 13
);

create table if not exists calendar_accounts (
  id serial primary key,
  member_id integer references members(id),
  provider text not null,
  address text not null,
  synced boolean not null default true,
  two_way boolean not null default true,
  last_sync timestamptz
);

create table if not exists sandbox_fields (
  id serial primary key,
  entity text not null default 'deal',
  name text not null,
  field_type text not null default 'text',
  required boolean not null default false,
  promoted boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists sandbox_automations (
  id serial primary key,
  name text not null,
  trigger_type text not null,
  trigger_detail text,
  action_type text not null,
  action_detail text,
  active boolean not null default true,
  promoted boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists mail_broadcasts (
  id serial primary key,
  name text not null,
  subject text not null,
  body text not null,
  audience text not null,
  sent_count integer not null default 0,
  opened integer not null default 0,
  created_at timestamptz not null default now()
);
