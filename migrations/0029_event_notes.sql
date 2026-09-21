-- Event notes: rich HTML bodies, updated_at, extra categories on the deal.

alter table event_notes add column if not exists updated_at timestamptz not null default now();

update event_notes
set body = '<p>Cipriani dock is <strong>47th</strong>. Wall is 8×4 of 2.6mm.</p><ul><li>FOH on the balcony rail, not the floor.</li><li>No riser under the CEO mark.</li></ul>',
    updated_at = now()
where deal_id = 1 and category = 'production' and pinned = true
  and body not like '%<p>%';

update event_notes
set body = '<p>Elena wants a <em>90-second</em> walk-on sting. <strong>No vocal bed</strong> under the CEO.</p>',
    updated_at = now()
where deal_id = 1 and category = 'client'
  and body not like '%<p>%';

update event_notes
set body = '<p>Rooftop <strong>wind hold at 28 mph</strong>.</p><ul><li>Ballast plan is in the plot PDF.</li><li>Load-in via the service elevator, not the guest core.</li></ul>',
    category = 'power',
    updated_at = now()
where deal_id = 4 and category = 'site'
  and body not like '%<p>%';

insert into event_notes (deal_id, category, pinned, body, author_id)
select 4, 'site', true, '<p>Ingress on Furman. Egress is the same dock after 23:00.</p><p>Banquet will not share the freight with catering after 16:00.</p>', 3
where not exists (select 1 from event_notes where deal_id = 4 and category = 'site' and body like '%Furman%');

insert into event_notes (deal_id, category, pinned, body, author_id)
select 7, 'talent', false, '<p>Pre-show talent hold is <strong>45 minutes</strong> in the plaza tent.</p><ul><li>No pyro.</li><li>Walk-on from stage left.</li></ul>', 4
where not exists (select 1 from event_notes where deal_id = 7);
