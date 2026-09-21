-- Reviews & reputation: scheduled asks, public tokens, platform clicks, directory + WP drafts.

alter table reviews add column if not exists token text;
alter table reviews add column if not exists person_id integer references people(id);
alter table reviews add column if not exists source text;
alter table reviews add column if not exists requested_at timestamptz;
alter table reviews add column if not exists due_at timestamptz;
alter table reviews add column if not exists submitted_at timestamptz;
alter table reviews add column if not exists directory_at timestamptz;
alter table reviews add column if not exists wp_draft boolean not null default false;
alter table reviews add column if not exists channel text not null default 'email';

create unique index if not exists reviews_token_uidx on reviews (token) where token is not null;

create table if not exists review_schedule (
  id integer primary key default 1,
  days_after integer not null default 2,
  channel text not null default 'email',
  enabled boolean not null default true
);

create table if not exists review_clicks (
  id serial primary key,
  review_id integer not null references reviews(id) on delete cascade,
  platform text not null,
  at timestamptz not null default now()
);

create table if not exists wp_drafts (
  id serial primary key,
  review_id integer references reviews(id) on delete set null,
  title text not null,
  body text not null,
  status text not null default 'draft',
  staged_at timestamptz not null default now()
);

insert into review_schedule (id, days_after, channel, enabled)
values (1, 2, 'email', true)
on conflict (id) do nothing;

update reviews
set token = 'rvw_lincoln',
    person_id = 9,
    source = 'email',
    requested_at = now() - interval '16 days',
    due_at = now() - interval '16 days',
    submitted_at = now() - interval '15 days',
    directory_at = now() - interval '15 days',
    wp_draft = true,
    channel = 'email',
    status = 'received'
where deal_id = 9 and token is null;

update reviews
set token = 'rvw_spotify',
    person_id = 10,
    source = 'link',
    requested_at = now() - interval '46 days',
    due_at = now() - interval '46 days',
    submitted_at = now() - interval '45 days',
    directory_at = now() - interval '45 days',
    wp_draft = true,
    channel = 'email',
    platform = 'google',
    status = 'published'
where deal_id = 10 and token is null;

insert into reviews (deal_id, person_id, author, stars, body, status, token, source, requested_at, due_at, channel)
select 1, 1, 'Elena Voss', 0, null, 'asked', 'rvw_citadel', 'email', now() - interval '1 day', now() - interval '4 hours', 'email'
where not exists (select 1 from reviews where token = 'rvw_citadel');

insert into review_clicks (review_id, platform, at)
select id, 'google', now() - interval '44 days' from reviews where token = 'rvw_spotify'
and not exists (select 1 from review_clicks where review_id = reviews.id);

insert into wp_drafts (review_id, title, body, status, staged_at)
select id, 'Spotify Upfront — 5 stars', 'Playback and IMAG just worked. Asking them back for next upfront.', 'draft', now() - interval '45 days'
from reviews where token = 'rvw_spotify'
and not exists (select 1 from wp_drafts where review_id = reviews.id);

insert into wp_drafts (review_id, title, body, status, staged_at)
select id, 'Lincoln Center plaza gala — 5 stars', 'Quiet, on time, and the plaza never felt like a load-in.', 'draft', now() - interval '15 days'
from reviews where token = 'rvw_lincoln'
and not exists (select 1 from wp_drafts w where w.review_id = reviews.id);
