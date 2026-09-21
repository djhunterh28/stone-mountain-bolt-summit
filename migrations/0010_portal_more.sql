insert into stages (id, pipeline_id, name, sort_order, rotting_days, probability)
select 15, 1, 'Estimate & Agreement Sent', 6, 14, 98
where not exists (select 1 from stages where id = 15);
insert into stages (id, pipeline_id, name, sort_order, rotting_days, probability)
select 16, 1, 'On Hold', 7, 21, 50
where not exists (select 1 from stages where id = 16);
insert into stages (id, pipeline_id, name, sort_order, rotting_days, probability)
select 17, 1, 'Signed/Invoiced', 8, 30, 100
where not exists (select 1 from stages where id = 17);
select setval('stages_id_seq', (select max(id) from stages));
