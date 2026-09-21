insert into access_policy (id) values (1)
  on conflict (id) do nothing;

insert into session_context (id) values (1)
  on conflict (id) do nothing;

insert into enrichment_credits (id) values (1)
  on conflict (id) do nothing;

insert into calendar_accounts (member_id, provider, address, synced, two_way, last_sync) values
  (1, 'google', 'dana@northline.av', true, true, now() - interval '6 minutes'),
  (2, 'google', 'marcus@northline.av', true, true, now() - interval '11 minutes'),
  (3, 'outlook', 'priya@northline.av', true, true, now() - interval '28 minutes'),
  (4, 'google', 'jules@northline.av', true, false, now() - interval '2 hours'),
  (5, 'outlook', 'sam@northline.av', false, true, now() - interval '1 day'),
  (6, 'apple', 'alex@northline.av', true, true, now() - interval '40 minutes');

insert into email_accounts (member_id, address, kind, synced, last_sync) values
  (null, 'newbusiness@northline.av', 'shared', true, now() - interval '8 minutes'),
  (null, 'production@northline.av', 'shared', true, now() - interval '14 minutes'),
  (null, 'dryhire@northline.av', 'shared', true, now() - interval '22 minutes'),
  (null, 'accounts@northline.av', 'shared', true, now() - interval '1 hour'),
  (null, 'partnerships@northline.av', 'shared', true, now() - interval '3 hours'),
  (null, 'loadin@northline.av', 'shared', false, now() - interval '2 days'),
  (null, 'quotes@northline.av', 'shared', true, now() - interval '9 minutes'),
  (null, 'support@northline.av', 'shared', true, now() - interval '31 minutes');

insert into sandbox_fields (entity, name, field_type, required, promoted) values
  ('deal', 'Union call time', 'text', false, false),
  ('deal', 'LED pixel pitch', 'select', false, false),
  ('person', 'Dietary', 'text', false, true);

insert into sandbox_automations (name, trigger_type, trigger_detail, action_type, action_detail, active, promoted) values
  ('Sandbox: rotting ping', 'deal.rotting', '10 days', 'email.template', 'Rotting nudge', true, false),
  ('Sandbox: won → COI request', 'deal.won', '', 'activity.create', 'Request COI from venue', true, false);

insert into mail_broadcasts (name, subject, body, audience, sent_count, opened, created_at) values
  ('Q4 hold dates', 'Hold dates still open at Gotham / Cipriani', 'We have crew on those weeks. Reply with a floor plan if you want a recost.', 'open-deals', 11, 7, now() - interval '5 days'),
  ('Site-walk reminder', 'Northline can walk the room this week', 'Two survey slots left Thursday. Bring power drawings if you have them.', 'leads', 8, 3, now() - interval '2 days');

insert into security_rules (name, detail, active) values
  ('Admin login policy', 'Owners and admins must MFA. Failed logins lock after 3 tries. Idle lock 15 minutes on shop machines.', true),
  ('Suspicious activity', 'Alert on unknown IP, off-hours access, CSV export, and mass mail.', true);

update people set mobile = '+1 917 555 0144', direct_dial = '+1 212 555 0190'
  where id = 1;
update people set phone = null where id = 8;
update people set email = null where id = 11;
