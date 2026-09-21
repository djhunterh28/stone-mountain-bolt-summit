insert into tenants (id, org_id, name, slug, quota_gb, used_mb) values
  (1, 1, 'Citadel', 'citadel', 80, 1240),
  (2, 2, 'Brooklyn Museum', 'brooklyn-museum', 40, 310),
  (3, 3, 'Nike', 'nike', 100, 2860),
  (4, 4, '1 Hotel Brooklyn Bridge', '1-hotel', 25, 180),
  (5, 7, 'Barclays Center', 'barclays', 60, 940)
on conflict (id) do nothing;
select setval('tenants_id_seq', 5);

update projects set tenant_id = 4, stage_label = 'Signed/Invoiced', value = 28500, venue = '1 Hotel Brooklyn Bridge' where id = 3;
update projects set tenant_id = 5, stage_label = 'Estimate & Agreement Sent', value = 91000, venue = 'Atlantic Ave plaza' where id = 4;
update projects set tenant_id = 3, stage_label = 'On Hold', value = 248000, venue = '21 Bond St' where id = 5;
update projects set stage_label = 'Signed/Invoiced', value = 155000, venue = 'Josie Robertson Plaza' where id = 1;
update projects set stage_label = 'Signed/Invoiced', value = 72000, venue = 'Spotify NYC' where id = 2;

insert into portal_files (tenant_id, project_id, folder, name, mime, size_bytes, sha256, drive_id, uploaded_by) values
  (4, 3, 'files', '1Hotel_plot_v3.pdf', 'application/pdf', 2400000, 'a1b2c3d4e5f6', 'drv-1001', 'staff'),
  (4, 3, 'files', 'Call_sheet_Oct.pdf', 'application/pdf', 180000, 'b2c3d4e5f607', 'drv-1002', 'staff'),
  (4, 3, 'billing', 'Invoice_1842.pdf', 'application/pdf', 92000, 'c3d4e5f60718', 'drv-1003', 'staff'),
  (4, 3, 'digital', 'Rooftop_previz.mp4', 'video/mp4', 540000000, 'd4e5f6071829', 'drv-1004', 'staff'),
  (5, 4, 'files', 'Barclays_COI.pdf', 'application/pdf', 140000, 'e5f60718293a', 'drv-1005', 'staff'),
  (3, 5, 'files', 'Nike_Bond_CAD.dwg', 'application/acad', 8200000, 'f60718293a4b', 'drv-1006', 'staff'),
  (3, 5, 'digital', 'LED_ceiling_loop.mov', 'video/quicktime', 2100000000, '0718293a4b5c', 'drv-1007', 'staff'),
  (1, 2, 'files', 'Citadel_holiday_rider.pdf', 'application/pdf', 410000, '18293a4b5c6d', 'drv-1008', 'staff');

insert into approvals (tenant_id, project_id, title, body, status, requested_by) values
  (4, 3, 'Wind-load plot', 'Approve 12in truss on rooftop given 18kt forecast.', 'pending', 'Jules Rivera'),
  (5, 4, 'Brand village CAD', 'Three LED totems on Atlantic Ave plaza.', 'pending', 'Dana Okonkwo'),
  (3, 5, 'Overnight load-in', '22:00 load-in at 21 Bond St. Building security sign-off.', 'approved', 'Dana Okonkwo');

insert into task_lists (id, tenant_id, project_id, name) values
  (1, 4, 3, 'Show-ready'),
  (2, 5, 4, 'Pre-show'),
  (3, 3, 5, 'Bond Street');
select setval('task_lists_id_seq', 3);

insert into task_items (list_id, title, done) values
  (1, 'Submit names to security desk', false),
  (1, 'Confirm wind load on 12in truss', false),
  (1, 'Print call sheet', false),
  (2, 'COI on BSE template', true),
  (2, 'LED totem CAD', false),
  (3, 'Resolume timeline lock', false),
  (3, 'LED ceiling power drop', true);

insert into project_notes (project_id, body, visible, author) values
  (3, 'Client prefers warm tungsten on dinner flip. No strobes during ceremony.', true, 'Priya Shah'),
  (4, 'Union call is 07:00. IATSE steward is Luis.', true, 'Jules Rivera'),
  (5, 'Hold: Nike legal reviewing overnight load-in against Bond St house rules.', true, 'Dana Okonkwo');

insert into project_requests (project_id, tenant_id, title, body, status, created_by) values
  (3, 4, 'Extra uplight on terrace', 'Can we add 8x RGBA pars on the north rail?', 'open', 'Theo Marsh');

insert into event_requests (name, email, event_date, venue, guests, notes, status) values
  ( 'Maya Quint', 'mquint@standardhotels.com', CURRENT_DATE + 40, 'Boom Boom Room', 90, 'Private dinner, quiet install.', 'new'),
  ( 'Patrice Ng', 'png@independents.nyc', CURRENT_DATE + 70, 'TBD Brooklyn loft', 120, 'Looking for LED wall + audio.', 'review');

insert into notification_prefs (tenant_id, kind, enabled) values
  (4, 'files', true), (4, 'signatures', true), (4, 'approvals', true), (4, 'projects', true),
  (3, 'files', true), (3, 'signatures', true), (3, 'approvals', false), (3, 'projects', true);

insert into esign_envelopes (id, document_id, tenant_id, deal_id, mode, status, auth_method, original_sha, watermark_text, tags) values
  (1, 1, 4, 4, 'sequential', 'sent', 'email', '9f86d081884c7d659a2feaa0c55ad015', 'NORTHLINE CONFIDENTIAL', 'wedding'),
  (2, 2, 5, 7, 'parallel', 'draft', 'access_code', '9f86d081884c7d659a2feaa0c55ad016', 'NORTHLINE CONFIDENTIAL', 'arena');
select setval('esign_envelopes_id_seq', 2);

insert into esign_recipients (envelope_id, name, email, role, routing_order, status) values
  (1, 'Theo Marsh', 'tmarsh@1hotels.com', 'signer', 1, 'pending'),
  (1, 'Dana Okonkwo', 'dana@northline.av', 'countersigner', 2, 'pending'),
  (2, 'Imani Brooks', 'ibrooks@barclayscenter.com', 'signer', 1, 'pending');

insert into esign_fields (envelope_id, recipient_id, kind, page, x_pct, y_pct) values
  (1, 1, 'signature', 1, 18, 78),
  (1, 1, 'date', 1, 62, 78),
  (1, 1, 'name', 1, 18, 86),
  (1, 2, 'signature', 1, 18, 90);

insert into proposals (deal_id, title, body, status, token) values
  (4, '1 Hotel rooftop — production proposal', 'Wind-rated truss, warm tungsten dinner flip, 180 pax.', 'sent', 'pr-1hotel-roof'),
  (3, 'Nike Bond Street drop', 'Overnight load-in, Resolume + LED ceiling.', 'draft', 'pr-nike-bond');

insert into branding (id, pipedrive_synced_at, zoho_org) values
  (1, now() - interval '2 hours', 'hurricane-productions')
on conflict (id) do nothing;

insert into audit_events (user_id, email, action, entity, ip, user_agent) values
  ('system', 'dana@northline.av', 'login', 'session', '74.64.12.10', 'Chrome · macOS'),
  ('system', 'tmarsh@1hotels.com', 'file.view', '1Hotel_plot_v3.pdf', '98.12.44.9', 'Safari · iOS'),
  ('system', 'dana@northline.av', 'export', 'deals.csv', '74.64.12.10', 'Chrome · macOS');

update documents set lookup_id = 'NL-' || id::text, lookup_password = 'sign' || id::text where lookup_id is null;

insert into bookmarks (user_id, label, href, sort_order) values
  ('staff-seed', 'Pipeline', '/', 0),
  ('staff-seed', '1 Hotel project', '/projects/3', 1),
  ('staff-seed', 'E-sign', '/esign', 2);
