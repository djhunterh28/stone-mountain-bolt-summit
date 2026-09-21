create table if not exists member_prefs (
  member_id int not null references members(id) on delete cascade,
  key text not null,
  value text not null default '{}',
  updated_at timestamptz not null default now(),
  primary key (member_id, key)
);

insert into member_prefs (member_id, key, value)
select 1, 'pipeline.cols.1', '{"4":320,"5":260}'
where not exists (select 1 from member_prefs where member_id = 1 and key = 'pipeline.cols.1');
