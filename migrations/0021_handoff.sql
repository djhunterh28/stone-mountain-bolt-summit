-- Event hand-off packs: tokenized production transfer, financials stay in the house.

alter table handoffs add column if not exists token text;
alter table handoffs add column if not exists reason text not null default 'subcontract';
alter table handoffs add column if not exists cover text;
alter table handoffs add column if not exists snapshot text not null default '{}';
alter table handoffs add column if not exists last_opened_at timestamptz;
alter table handoffs add column if not exists last_ping_at timestamptz;

create unique index if not exists handoffs_token_idx on handoffs (token) where token is not null;

update handoffs
set
  token = coalesce(token, 'nlh_atlantic7'),
  reason = 'subcontract',
  cover = 'Barclays plaza activation. Take the floor, totems, and RF. Invoices and house rates stay with Northline.',
  include_finance = false,
  monitor = true,
  status = 'sent'
where deal_id = 7 and to_company = 'Atlantic Labor Co-op';

insert into files (entity_type, entity_id, name, kind, size_kb, uploaded_by, created_at)
select 'deal', 7, 'Atlantic_plaza_rf.pdf', 'plot', 1800, 1, now() - interval '1 day'
where not exists (select 1 from files where entity_type = 'deal' and entity_id = 7 and name = 'Atlantic_plaza_rf.pdf');

insert into event_notes (deal_id, category, pinned, body, author_id)
select 7, 'production', true, 'Street load-in off Atlantic. Arena wall is a hard hold. Three LED totems, one RF pack, brand village on the plaza.', 1
where not exists (select 1 from event_notes where deal_id = 7);

insert into handoffs (deal_id, to_company, include_finance, monitor, status, token, reason, cover)
select 4, 'Harbor Video', false, true, 'sent', 'nlh_hotel4', 'emergency',
  'If the house goes dark, Harbor runs 1 Hotel rooftop. Wind hold 28 mph. Ceremony then dinner flip. Freight elevator only. No invoices in this pack.'
where not exists (select 1 from handoffs where token = 'nlh_hotel4');
