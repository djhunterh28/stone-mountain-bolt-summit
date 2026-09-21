alter table api_tokens add column if not exists token_hash text;
alter table api_tokens add column if not exists member_id integer references members(id);

alter table webhooks add column if not exists secret text;
alter table webhooks add column if not exists description text;
alter table webhooks add column if not exists created_at timestamptz not null default now();

create table if not exists webhook_deliveries (
  id serial primary key,
  webhook_id integer references webhooks(id) on delete cascade,
  event text not null,
  payload text not null,
  status_code integer,
  ok boolean not null default false,
  created_at timestamptz not null default now()
);

-- House Zapier key: nl_live_docs_tryme99 (shown once in seed as hash only).
update api_tokens
   set token_hash = '041e84ea9d9a9c3614',
       token_hint = 'nl_live_docs…e99',
       scopes = 'events:read,events:write,clients:read,clients:write,deals:read,deals:write,people:read,activities:read,webhooks'
 where name = 'Zapier production' and token_hash is null;

update webhooks set secret = 'whsec_nl_' || lpad(id::text, 8, '0'),
  description = case event
    when 'deal.updated' then 'Board moves to the house webhook'
    when 'deal.won' then 'Won shows to billing'
    when 'activity.overdue' then 'Slack sales channel'
    else description
  end
where secret is null;

insert into webhook_deliveries (webhook_id, event, payload, status_code, ok, created_at)
select 1, 'deal.updated', '{"event":"deal.updated","data":{"id":1,"title":"Citadel holiday"}}', 200, true, now() - interval '2 minutes'
where not exists (select 1 from webhook_deliveries);
