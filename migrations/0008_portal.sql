-- Client portal, tenants, e-sign, files, approvals, tasks, audit

create table if not exists tenants (
  id serial primary key,
  org_id integer references organizations(id),
  name text not null,
  slug text not null unique,
  quota_gb numeric not null default 50,
  used_mb numeric not null default 420,
  notes_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists portal_profiles (
  user_id text primary key,
  email text not null unique,
  name text not null,
  role text not null default 'client',
  tenant_id integer references tenants(id),
  person_id integer references people(id),
  member_id integer references members(id),
  parent_user_id text,
  verified boolean not null default false,
  onboarded boolean not null default false,
  theme text not null default 'paper',
  compact boolean not null default false,
  high_contrast boolean not null default false,
  screen_reader boolean not null default false,
  permissions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists email_otps (
  id serial primary key,
  email text not null,
  code text not null,
  purpose text not null,
  expires_at timestamptz not null,
  used boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists impersonation (
  user_id text primary key,
  tenant_id integer references tenants(id),
  started_at timestamptz not null default now()
);

create table if not exists portal_files (
  id serial primary key,
  tenant_id integer references tenants(id),
  project_id integer references projects(id),
  task_item_id integer,
  folder text not null default 'files',
  name text not null,
  mime text not null default 'application/octet-stream',
  size_bytes bigint not null default 0,
  sha256 text,
  drive_id text,
  shared boolean not null default true,
  uploaded_by text,
  created_at timestamptz not null default now()
);

create table if not exists approvals (
  id serial primary key,
  tenant_id integer references tenants(id),
  project_id integer references projects(id),
  title text not null,
  body text,
  status text not null default 'pending',
  requested_by text,
  decided_by text,
  decision_note text,
  decided_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists task_lists (
  id serial primary key,
  tenant_id integer references tenants(id),
  project_id integer references projects(id),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists task_items (
  id serial primary key,
  list_id integer not null references task_lists(id) on delete cascade,
  title text not null,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists bookmarks (
  id serial primary key,
  user_id text not null,
  label text not null,
  href text not null,
  sort_order integer not null default 0
);

create table if not exists project_notes (
  id serial primary key,
  project_id integer references projects(id) on delete cascade,
  body text not null,
  visible boolean not null default true,
  author text,
  created_at timestamptz not null default now()
);

create table if not exists project_requests (
  id serial primary key,
  project_id integer references projects(id),
  tenant_id integer references tenants(id),
  title text not null,
  body text,
  status text not null default 'open',
  created_by text,
  created_at timestamptz not null default now()
);

create table if not exists event_requests (
  id serial primary key,
  name text not null,
  email text not null,
  event_date date,
  venue text,
  guests integer,
  notes text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists contact_entries (
  id serial primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists notification_prefs (
  tenant_id integer not null references tenants(id),
  kind text not null,
  enabled boolean not null default true,
  primary key (tenant_id, kind)
);

create table if not exists esign_envelopes (
  id serial primary key,
  document_id integer references documents(id),
  tenant_id integer references tenants(id),
  deal_id integer references deals(id),
  mode text not null default 'sequential',
  status text not null default 'draft',
  auth_method text not null default 'email',
  access_code text,
  expires_at timestamptz,
  scheduled_at timestamptz,
  watermark_text text default 'CONFIDENTIAL',
  tags text,
  original_sha text,
  signed_sha text,
  created_at timestamptz not null default now()
);

create table if not exists esign_recipients (
  id serial primary key,
  envelope_id integer not null references esign_envelopes(id) on delete cascade,
  name text not null,
  email text not null,
  role text not null default 'signer',
  routing_order integer not null default 1,
  status text not null default 'pending',
  signed_at timestamptz,
  signature_data text
);

create table if not exists esign_fields (
  id serial primary key,
  envelope_id integer not null references esign_envelopes(id) on delete cascade,
  recipient_id integer references esign_recipients(id),
  kind text not null default 'signature',
  page integer not null default 1,
  x_pct numeric not null default 12,
  y_pct numeric not null default 78,
  value text
);

create table if not exists proposals (
  id serial primary key,
  deal_id integer references deals(id),
  title text not null,
  body text,
  status text not null default 'draft',
  token text not null unique,
  viewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists audit_events (
  id serial primary key,
  user_id text,
  email text,
  action text not null,
  entity text,
  ip text,
  user_agent text,
  meta text,
  created_at timestamptz not null default now()
);

create table if not exists branding (
  id integer primary key default 1,
  logo_text text not null default 'Northline',
  primary_color text not null default '2A3038',
  sender_name text not null default 'Northline Documents',
  reminder_template text not null default 'Reminder: a document is waiting for your signature.',
  watermark_text text not null default 'CONFIDENTIAL',
  watermark_opacity numeric not null default 0.12,
  pipedrive_token text,
  pipedrive_synced_at timestamptz,
  drive_connected boolean not null default true,
  zoho_org text
);

create table if not exists onboarding_state (
  user_id text primary key,
  profile_done boolean not null default false,
  team_done boolean not null default false,
  project_done boolean not null default false,
  docs_done boolean not null default false,
  prefs_done boolean not null default false
);

alter table projects add column if not exists tenant_id integer references tenants(id);
alter table projects add column if not exists stage_label text;
alter table projects add column if not exists value numeric not null default 0;
alter table projects add column if not exists venue text;
alter table documents add column if not exists lookup_id text;
alter table documents add column if not exists lookup_password text;
