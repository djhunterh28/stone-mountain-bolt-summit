-- Client broadcasts: suppression list, unsub tokens, CAN-SPAM counters.

alter table mail_broadcasts add column if not exists suppressed_count integer not null default 0;
alter table mail_broadcasts add column if not exists skipped integer not null default 0;
alter table mail_broadcasts add column if not exists template_id integer;
alter table mail_broadcasts add column if not exists from_addr text;

create table if not exists mail_suppressions (
  id serial primary key,
  email text not null,
  name text,
  reason text not null default 'unsubscribe',
  source text not null default 'manual',
  created_at timestamptz not null default now()
);

create unique index if not exists mail_suppressions_email on mail_suppressions (lower(email));

create table if not exists mail_unsub_tokens (
  token text primary key,
  email text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists mail_unsub_tokens_email on mail_unsub_tokens (lower(email));

insert into mail_suppressions (email, name, reason, source, created_at)
select v.email, v.name, v.reason, v.source, now() - interval '40 days'
from (values
  ('ohart@momaps1.org', 'Owen Hart', 'Asked off the holds list', 'unsub'),
  ('jblake@onepeloton.com', 'Jordan Blake', 'Left the company', 'manual')
) as v(email, name, reason, source)
where not exists (select 1 from mail_suppressions s where lower(s.email) = lower(v.email));

insert into mail_unsub_tokens (token, email)
select v.token, v.email
from (values
  ('owen-hart-unsub', 'ohart@momaps1.org'),
  ('jordan-blake-unsub', 'jblake@onepeloton.com')
) as v(token, email)
where not exists (select 1 from mail_unsub_tokens t where t.token = v.token);

update mail_broadcasts set suppressed_count = 2, from_addr = 'shows@hurricaneproductionsllc.com'
where name = 'Q4 hold dates' and suppressed_count = 0;
