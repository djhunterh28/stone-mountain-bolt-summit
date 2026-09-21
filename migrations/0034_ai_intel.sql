-- AI profile, prep-inspector mail connect, extra findings for live entertainment.

alter table ai_profile add column if not exists mail_connected boolean not null default true;
alter table ai_profile add column if not exists mail_provider text not null default 'gmail';
alter table ai_profile add column if not exists vertical text not null default 'live entertainment';
alter table ai_profile add column if not exists company text not null default 'Hurricane Productions';

update ai_profile set
  company = 'Hurricane Productions',
  greeting = coalesce(nullif(greeting, ''), 'Hurricane Productions — LED, audio, and labor for live events in New York. What date are you holding?'),
  brand_color = '0D47A1',
  portal_domain = 'portal.hurricaneproductionsllc.com',
  vertical = 'live entertainment',
  mail_connected = true,
  mail_provider = 'gmail'
where id = 1;

insert into prep_findings (deal_id, kind, severity, detail, source)
select 7, 'burn-risk closer', 'risk', 'Barclays walk-off is a mashup still clearing with the label — do not auto-apply to the plot.', 'email'
where not exists (select 1 from prep_findings where deal_id = 7 and kind = 'burn-risk closer');

insert into prep_findings (deal_id, kind, severity, detail, source)
select 9, 'timed section', 'warn', 'Lincoln Center plaza gala has no strike against the park curfew.', 'record'
where not exists (select 1 from prep_findings where deal_id = 9 and kind = 'timed section');
