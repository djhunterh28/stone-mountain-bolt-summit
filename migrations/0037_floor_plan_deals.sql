alter table floor_plans add column if not exists deal_id integer references deals(id) on delete cascade;

create index if not exists floor_plans_deal_idx on floor_plans (deal_id);

update floor_plans f
set deal_id = d.id
from deals d
where f.deal_id is null
  and coalesce(f.template, false) is not true
  and d.venue is not null
  and f.venue is not null
  and f.venue = d.venue;

update floor_plans
set deal_id = 1
where deal_id is null
  and coalesce(template, false) is not true;
