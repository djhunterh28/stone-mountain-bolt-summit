insert into goals (name, kind, target, period_start, period_end, owner_id, pipeline_id) values
  ('Q4 Live Events revenue', 'revenue', 1200000, CURRENT_DATE - 80, CURRENT_DATE + 10, 1, 1),
  ('Won shows this quarter', 'won_deals', 8, CURRENT_DATE - 80, CURRENT_DATE + 10, 2, 1),
  ('Site walks this month', 'activities', 20, CURRENT_DATE - 20, CURRENT_DATE + 10, 4, 1),
  ('Dry hire bookings', 'revenue', 80000, CURRENT_DATE - 80, CURRENT_DATE + 10, 5, 2);

insert into visibility_groups (name, detail, member_ids) values
  ('Entire company', 'Default. Every seat sees the book.', '[1,2,3,4,5,6]'::jsonb),
  ('New Business', 'Inbound + outbound AEs. Hide production-only notes.', '[1,2,5]'::jsonb),
  ('Production', 'Load-in, labor, and shop. Hide early-stage pricing.', '[4,6]'::jsonb),
  ('Account managers', 'Repeat clients and retainers.', '[3]'::jsonb);

insert into permission_sets (name, detail, can_export, can_delete, can_admin) values
  ('Owner', 'Full workspace, billing, security rules.', true, true, true),
  ('Admin', 'Pipelines, fields, automations. No billing.', true, true, true),
  ('Manager', 'Team deals, export, no field edits.', true, false, false),
  ('Rep', 'Own deals and activities only.', false, false, false);

insert into api_tokens (name, token_hint, scopes, last_used, revoked) values
  ('Shop display board', 'nl_live_7f3a…c91', 'deals:read,activities:read', now() - interval '12 minutes', false),
  ('Zapier production', 'nl_live_b220…e04', 'deals:write,webhooks', now() - interval '2 hours', false),
  ('Retired staging', 'nl_test_11aa…00', 'deals:read', now() - interval '80 days', true);

insert into activity_types (name, slug, icon, active) values
  ('Site survey', 'site-survey', 'map-pin', true),
  ('Meeting', 'meeting', 'users', true),
  ('Call', 'call', 'phone', true),
  ('Task', 'task', 'check', true),
  ('Deadline', 'deadline', 'flag', true),
  ('Lunch', 'lunch', 'utensils', true),
  ('Email', 'email', 'mail', true),
  ('Load-in', 'load-in', 'truck', true);

insert into lost_reasons (name, sort_order, active) values
  ('Budget', 0, true),
  ('Timing / date moved', 1, true),
  ('In-house AV', 2, true),
  ('Competitor (PRG / PSAV)', 3, true),
  ('No decision', 4, true),
  ('Venue change', 5, true),
  ('Event cancelled', 6, true);

insert into lead_routes (source, owner_id, team_id, active) values
  ('Web form', 5, 1, true),
  ('Chatbot', 2, 1, true),
  ('Live chat', 5, 1, true),
  ('Prospector', 1, 1, true),
  ('Referral', 1, 1, true),
  ('Repeat', 3, 2, true);

insert into email_accounts (member_id, address, kind, synced, last_sync) values
  (1, 'dana@northline.av', 'personal', true, now() - interval '4 minutes'),
  (2, 'marcus@northline.av', 'personal', true, now() - interval '9 minutes'),
  (3, 'priya@northline.av', 'personal', true, now() - interval '21 minutes'),
  (5, 'sam@northline.av', 'personal', true, now() - interval '1 hour'),
  (null, 'sales@northline.av', 'shared', true, now() - interval '6 minutes');

insert into chatbot_flows (name, active, steps, conversations) values
  ('Website qualifier', true, '[{"id":"welcome","prompt":"Northline here — live event AV in New York. What is the date?"},{"id":"venue","prompt":"Which venue, or still looking?"},{"id":"headcount","prompt":"Rough headcount?"},{"id":"package","prompt":"LED, audio, lighting, or a full production?"},{"id":"hand-off","prompt":"An AE will pick this up. Want a site walk?"}]'::jsonb, 128),
  ('Dry hire bot', true, '[{"id":"gear","prompt":"What are you taking out of the shop?"},{"id":"dates","prompt":"Pickup and return dates?"},{"id":"delivery","prompt":"Will you pull from Gowanus or need a truck?"}]'::jsonb, 41);

insert into sequence_enrollments (sequence_id, person_id, step_index, status) values
  (1, 16, 1, 'active'),
  (1, 5, 0, 'active'),
  (2, 9, 0, 'active'),
  (3, 17, 2, 'active');

insert into deal_history (deal_id, actor, action, detail, created_at) values
  (1, 'Marcus Hale', 'created', 'Inbound referral from Elena', now() - interval '34 days'),
  (1, 'Marcus Hale', 'moved', 'Qualified → Site Walk', now() - interval '28 days'),
  (1, 'Sam Chen', 'updated', 'Added 32× 2.6mm LED + K2 hang', now() - interval '22 days'),
  (1, 'Marcus Hale', 'moved', 'Site Walk → Proposal', now() - interval '20 days'),
  (1, 'Marcus Hale', 'moved', 'Proposal → Negotiation', now() - interval '16 days'),
  (1, 'Sam Chen', 'updated', 'Recost +8 tiles, +$3,040', now() - interval '3 hours'),
  (4, 'Priya Shah', 'moved', 'Verbal → Contracting', now() - interval '3 days'),
  (4, 'Priya Shah', 'document', 'Sent production agreement', now() - interval '2 days'),
  (7, 'Dana Okonkwo', 'moved', 'Negotiation → Verbal', now() - interval '2 days'),
  (9, 'Dana Okonkwo', 'won', 'Closed $155,000', now() - interval '18 days');

update people set linkedin = 'linkedin.com/in/elena-voss', enriched_at = now() - interval '12 days' where id = 1;
update people set linkedin = 'linkedin.com/in/amina-cole', enriched_at = now() - interval '4 days' where id = 3;
update organizations set employees = '10,000+', revenue_band = '$1B+', enriched_at = now() - interval '12 days' where id = 1;
update organizations set employees = '500-1,000', revenue_band = '$50–100M', enriched_at = now() - interval '4 days' where id = 3;
update organizations set employees = '200-500', revenue_band = 'Nonprofit', enriched_at = now() - interval '20 days' where id = 2;
