-- SMS notifications via QUO: kinds, templates, automations, shop number.

alter table sms_messages add column if not exists kind text not null default 'custom';
alter table sms_messages add column if not exists quo_id text;
alter table sms_messages add column if not exists to_number text;

create table if not exists sms_templates (
  id serial primary key,
  kind text not null,
  name text not null,
  body text not null
);

create table if not exists sms_automations (
  id serial primary key,
  kind text not null,
  name text not null,
  detail text,
  active boolean not null default true,
  last_run timestamptz
);

create table if not exists quo_account (
  id integer primary key default 1,
  from_number text not null,
  status text not null default 'connected',
  label text not null default 'Northline shop'
);

insert into quo_account (id, from_number, status, label) values
  (1, '+1 917 555 0199', 'connected', 'Northline shop')
on conflict (id) do nothing;

insert into sms_templates (kind, name, body)
select v.kind, v.name, v.body
from (values
  ('reminder', 'T-7 load-in', '{{first}} — {{deal}} is {{date}} at {{venue}}. Load-in {{load_in}}. Reply YES to confirm.'),
  ('reminder', 'T-1 call time', '{{first}} — call time tomorrow {{load_in}} at {{venue}}. Dock notes are in the packet.'),
  ('payment', 'Deposit received', '{{first}} — we have the {{amount}} for {{deal}}. Receipt is in your inbox.'),
  ('payment', 'Balance received', '{{first}} — {{deal}} is paid in full ({{amount}}). Thank you — see you at {{venue}}.'),
  ('status', 'Stage move', '{{first}} — {{deal}} is now {{stage}}. We will text if anything on the plot changes.'),
  ('custom', 'Blank', '{{first}} —')
) as v(kind, name, body)
where not exists (select 1 from sms_templates t where t.name = v.name);

insert into sms_automations (kind, name, detail, active, last_run)
select v.kind, v.name, v.detail, v.active, v.last_run
from (values
  ('reminder', 'T-7 event reminder', 'Opted-in contacts, shows in the next 7 days, once per week.', true, now() - interval '2 days'),
  ('reminder', 'T-1 call time', 'Night-before load-in ping.', true, now() - interval '8 hours'),
  ('payment', 'Deposit recorded', 'Won / contracted shows without a payment text.', true, now() - interval '1 day'),
  ('status', 'Stage moved', 'Manual from the desk, or fire when a deal changes stage.', false, null)
) as v(kind, name, detail, active, last_run)
where not exists (select 1 from sms_automations a where a.name = v.name);

insert into sms_optins (person_id, opted_in, source) values
  (7, true, 'proposal'),
  (9, true, 'portal'),
  (10, true, 'proposal'),
  (13, true, 'web form'),
  (15, true, 'proposal')
on conflict (person_id) do nothing;

insert into sms_messages (person_id, deal_id, direction, body, status, kind, quo_id, to_number, created_at)
select v.person_id, v.deal_id, v.direction, v.body, v.status, v.kind, v.quo_id, v.to_number, v.at
from (values
  (9, 9, 'out', 'Sofia — we have the $155k for Lincoln Center plaza gala. Receipt is in your inbox.', 'delivered', 'payment', 'quo_lc_pay', '+1 212 555 2009', now() - interval '18 days'),
  (7, 7, 'out', 'Imani — Barclays pre-show is now Verbal. We will text if anything on the plot changes.', 'delivered', 'status', 'quo_bc_st', '+1 347 555 2007', now() - interval '1 day'),
  (3, 3, 'out', 'Amina — Nike Bond Street drop is 18 days out at 21 Bond St. Load-in 22:00. Reply YES to confirm.', 'delivered', 'reminder', 'quo_nk_t7', '+1 646 555 2003', now() - interval '6 hours'),
  (11, 12, 'in', 'STOP', 'delivered', 'custom', null, '+1 347 555 2011', now() - interval '12 days')
) as v(person_id, deal_id, direction, body, status, kind, quo_id, to_number, at)
where not exists (select 1 from sms_messages m where m.quo_id is not distinct from v.quo_id and v.quo_id is not null);
