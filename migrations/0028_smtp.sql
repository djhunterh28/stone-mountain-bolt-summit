-- SMTP transport for transactional mail: account, templates, workflows, delivery events.

alter table emails add column if not exists purpose text not null default 'compose';
alter table emails add column if not exists delivery_status text not null default 'delivered';
alter table emails add column if not exists smtp_message_id text;
alter table emails add column if not exists opened_at timestamptz;
alter table emails add column if not exists clicked_at timestamptz;
alter table emails add column if not exists bounced_at timestamptz;

alter table email_templates add column if not exists kind text not null default 'marketing';
alter table email_templates add column if not exists trigger_key text;

create table if not exists smtp_accounts (
  id integer primary key default 1,
  host text not null,
  port integer not null default 587,
  username text not null,
  from_addr text not null,
  tls text not null default 'starttls',
  status text not null default 'connected',
  last_ok timestamptz
);

create table if not exists smtp_events (
  id serial primary key,
  email_id integer references emails(id) on delete cascade,
  event text not null,
  detail text,
  at timestamptz not null default now()
);

create table if not exists smtp_workflows (
  id serial primary key,
  name text not null,
  trigger_key text not null,
  template_id integer references email_templates(id),
  detail text,
  active boolean not null default true,
  runs integer not null default 0,
  last_run timestamptz
);

insert into smtp_accounts (id, host, port, username, from_addr, tls, status, last_ok) values
  (1, 'mail.hurricaneproductionsllc.com', 587, 'shows@hurricaneproductionsllc.com', 'shows@hurricaneproductionsllc.com', 'starttls', 'connected', now() - interval '4 minutes')
on conflict (id) do nothing;

update email_templates set kind = 'transactional', trigger_key = 'booking.confirmed'
where name = 'Appointment confirmation' and (trigger_key is null or trigger_key = '');
update email_templates set kind = 'transactional', trigger_key = 'deal.won'
where name = 'COI request';
update email_templates set kind = 'transactional', trigger_key = 'event.callsheet'
where name = 'Crew call';

insert into email_templates (name, subject, body, kind, trigger_key)
select v.name, v.subject, v.body, v.kind, v.trigger_key
from (values
  ('Payment receipt', 'Receipt — {{deal}}', 'Hi {{first_name}} —

This is your receipt for {{deal}} ({{amount}}). Paid in full. A copy stays on the project.

— Hurricane Productions
247 3rd Street, Brooklyn, NY 11215', 'transactional', 'deal.won'),
  ('Invoice issued', 'Invoice — {{deal}}', 'Hi {{first_name}} —

Invoice for {{deal}} is attached in the portal. Net 15. Reply to this thread if AP needs a revision.

— Hurricane Productions', 'transactional', 'invoice.sent'),
  ('Call sheet', 'Call sheet — {{deal}}', 'Hi {{first_name}} —

Call time {{load_in}} at {{venue}} for {{deal}}. Parking and dock notes are in the packet. Text the shop if you are running late.

— Production, Hurricane Productions', 'transactional', 'event.callsheet'),
  ('Password reset', 'Reset your Northline sign-in', 'Hi {{first_name}} —

A reset was requested for this address. The link expires in 30 minutes. If you did not ask, ignore this mail.

— Northline', 'transactional', 'auth.reset')
) as v(name, subject, body, kind, trigger_key)
where not exists (select 1 from email_templates t where t.name = v.name);

insert into smtp_workflows (name, trigger_key, template_id, detail, active, last_run, runs)
select v.name, v.trigger_key, t.id, v.detail, v.active, v.last_run, v.runs
from (values
  ('Won → payment receipt', 'deal.won', 'Payment receipt', 'Transactional. Fires once per closed-won show.', true, now() - interval '18 days', 1),
  ('Booking confirmed', 'booking.confirmed', 'Appointment confirmation', 'Consult holds. Same mail the scheduler already sends.', true, now() - interval '2 hours', 4),
  ('T-1 call sheet', 'event.callsheet', 'Call sheet', 'Shows in the next 2 days with a day-of contact.', true, now() - interval '1 day', 2),
  ('Invoice issued', 'invoice.sent', 'Invoice issued', 'When finance marks an invoice sent.', true, now() - interval '6 days', 1),
  ('Password reset', 'auth.reset', 'Password reset', 'On request from the login page. Not marketing.', true, now() - interval '9 days', 3)
) as v(name, trigger_key, tpl, detail, active, last_run, runs)
join email_templates t on t.name = v.tpl
where not exists (select 1 from smtp_workflows w where w.name = v.name);

update emails set purpose = 'workflow', delivery_status = 'delivered'
where folder = 'sent' and purpose = 'compose' and from_addr ilike '%hurricaneproductionsllc.com%';

insert into emails (folder, from_name, from_addr, to_addr, subject, body, deal_id, person_id, opened, clicked, sent_at, purpose, delivery_status, smtp_message_id, opened_at, domain_id, authenticated)
select 'sent', 'Northline Shows', 'shows@hurricaneproductionsllc.com', 'smendes@lincolncenter.org',
  'Receipt — Lincoln Center plaza gala',
  'Hi Sofia — this is your receipt for Lincoln Center plaza gala (155k). Paid in full. A copy stays on the project. — Hurricane Productions',
  9, 9, true, false, now() - interval '18 days', 'transactional', 'delivered',
  'lc-receipt@mail.hurricaneproductionsllc.com', now() - interval '17 days',
  (select id from sending_domains where domain = 'hurricaneproductionsllc.com' limit 1), true
where not exists (select 1 from emails e where e.smtp_message_id = 'lc-receipt@mail.hurricaneproductionsllc.com');

insert into smtp_events (email_id, event, detail, at)
select e.id, 'queued', 'SMTP 250 queued', e.sent_at
from emails e
where e.smtp_message_id = 'lc-receipt@mail.hurricaneproductionsllc.com'
  and not exists (select 1 from smtp_events ev where ev.email_id = e.id and ev.event = 'queued');

insert into smtp_events (email_id, event, detail, at)
select e.id, 'accepted', 'mail.hurricaneproductionsllc.com accepted', e.sent_at + interval '1 second'
from emails e
where e.smtp_message_id = 'lc-receipt@mail.hurricaneproductionsllc.com'
  and not exists (select 1 from smtp_events ev where ev.email_id = e.id and ev.event = 'accepted');

insert into smtp_events (email_id, event, detail, at)
select e.id, 'delivered', '250 2.0.0 OK', e.sent_at + interval '4 seconds'
from emails e
where e.smtp_message_id = 'lc-receipt@mail.hurricaneproductionsllc.com'
  and not exists (select 1 from smtp_events ev where ev.email_id = e.id and ev.event = 'delivered');

insert into smtp_events (email_id, event, detail, at)
select e.id, 'opened', 'public /t receipt', e.opened_at
from emails e
where e.smtp_message_id = 'lc-receipt@mail.hurricaneproductionsllc.com'
  and not exists (select 1 from smtp_events ev where ev.email_id = e.id and ev.event = 'opened');
