alter table portal_files add column if not exists deal_id integer references deals(id);
create index if not exists portal_files_deal_idx on portal_files (deal_id);

insert into portal_files (tenant_id, deal_id, folder, name, mime, size_bytes, sha256, drive_id, uploaded_by, created_at)
select
  null,
  f.entity_id,
  'deals',
  f.name,
  'application/octet-stream',
  greatest(f.size_kb, 1) * 1024,
  'deal-' || f.id,
  'drv-deal-' || f.id,
  coalesce((select email from members where id = f.uploaded_by), 'staff'),
  f.created_at
from files f
where f.entity_type = 'deal'
  and not exists (
    select 1 from portal_files pf
    where pf.deal_id = f.entity_id and pf.name = f.name
  );
