alter table portal_files add column if not exists note_id integer references event_notes(id) on delete set null;
create index if not exists portal_files_note_idx on portal_files (note_id);
