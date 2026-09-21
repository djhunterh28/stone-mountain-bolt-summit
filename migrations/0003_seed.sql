insert into teams (id, name, description) values
  (1, 'New Business', 'Outbound and inbound live-event sales'),
  (2, 'Account Management', 'Repeat clients and seasonal retainers'),
  (3, 'Production', 'Show calling, labor, and shop');

insert into members (id, name, email, title, role, team_id, initials, tone) values
  (1, 'Dana Okonkwo', 'dana@northline.av', 'Founder / Principal AE', 'owner', 1, 'DO', 'steel'),
  (2, 'Marcus Hale', 'marcus@northline.av', 'Senior Account Executive', 'admin', 1, 'MH', 'mist'),
  (3, 'Priya Shah', 'priya@northline.av', 'Account Manager', 'manager', 2, 'PS', 'sage'),
  (4, 'Jules Rivera', 'jules@northline.av', 'Director of Production', 'manager', 3, 'JR', 'clay'),
  (5, 'Sam Chen', 'sam@northline.av', 'Estimator', 'rep', 1, 'SC', 'fog'),
  (6, 'Alex Kim', 'alex@northline.av', 'Operations Coordinator', 'rep', 3, 'AK', 'ink');

insert into pipelines (id, name, sort_order) values
  (1, 'Live Events', 0),
  (2, 'Dry Hire', 1),
  (3, 'Partnerships', 2);

insert into stages (id, pipeline_id, name, sort_order, rotting_days, probability) values
  (1, 1, 'Qualified', 0, 7, 10),
  (2, 1, 'Site Walk', 1, 10, 25),
  (3, 1, 'Proposal', 2, 12, 45),
  (4, 1, 'Negotiation', 3, 10, 65),
  (5, 1, 'Verbal', 4, 7, 80),
  (6, 1, 'Contracting', 5, 5, 95),
  (7, 2, 'Inquiry', 0, 5, 15),
  (8, 2, 'Check Stock', 1, 4, 40),
  (9, 2, 'Quote', 2, 7, 70),
  (10, 2, 'Confirmed', 3, 3, 95),
  (11, 3, 'Intro', 0, 14, 15),
  (12, 3, 'Discovery', 1, 21, 40),
  (13, 3, 'Pilot', 2, 30, 70),
  (14, 3, 'MSA', 3, 21, 90);

insert into organizations (id, name, website, address, city, industry, owner_id, lat, lng, phone, notes) values
  (1, 'Citadel', 'citadel.com', '731 Lexington Ave', 'Manhattan', 'Finance', 2, 40.7616, -73.9690, '212-555-0140', 'Holiday party + summer offsite.'),
  (2, 'Brooklyn Museum', 'brooklynmuseum.org', '200 Eastern Pkwy', 'Brooklyn', 'Culture', 3, 40.6712, -73.9636, '718-555-0192', 'Annual gala on the plaza.'),
  (3, 'Nike', 'nike.com', '21 Bond St', 'Manhattan', 'Retail', 1, 40.7265, -73.9936, '646-555-0118', 'Product drops and athlete events.'),
  (4, '1 Hotel Brooklyn Bridge', '1hotels.com', '60 Furman St', 'Brooklyn', 'Hospitality', 3, 40.7022, -73.9954, '718-555-0177', 'Rooftop weddings, 180 pax.'),
  (5, 'Pier 17', 'pier17ny.com', '89 South St', 'Manhattan', 'Venue', 2, 40.7056, -74.0016, '212-555-0166', 'Rooftop concerts and keynotes.'),
  (6, 'Soho House', 'sohohouse.com', '29-35 Ninth Ave', 'Manhattan', 'Hospitality', 5, 40.7407, -74.0056, '212-555-0133', 'Members events, quiet install.'),
  (7, 'Barclays Center', 'barclayscenter.com', '620 Atlantic Ave', 'Brooklyn', 'Arena', 1, 40.6826, -73.9754, '917-555-0101', 'Pre-show activations.'),
  (8, 'MoMA PS1', 'momaps1.org', '22-25 Jackson Ave', 'Queens', 'Culture', 4, 40.7455, -73.9470, '718-555-0120', 'Warm Up series.'),
  (9, 'Lincoln Center', 'lincolncenter.org', '10 Lincoln Center Plaza', 'Manhattan', 'Culture', 1, 40.7725, -73.9835, '212-555-0188', 'Gala on the plaza.'),
  (10, 'Spotify', 'spotify.com', '4 World Trade Center', 'Manhattan', 'Media', 2, 40.7105, -74.0120, '646-555-0199', 'Upfronts and listening parties.'),
  (11, 'Vice Media', 'vice.com', '49 S 2nd St', 'Brooklyn', 'Media', 5, 40.7132, -73.9656, '718-555-0144', 'Repeat dry hire.'),
  (12, 'The Standard High Line', 'standardhotels.com', '848 Washington St', 'Manhattan', 'Hospitality', 3, 40.7408, -74.0079, '212-555-0155', 'Boom Boom Room.'),
  (13, 'Brooklyn Steel', 'theneutral.com', '319 Frost St', 'Brooklyn', 'Venue', 4, 40.7168, -73.9362, '718-555-0160', 'Live music + brand takeovers.'),
  (14, 'The Met', 'metmuseum.org', '1000 Fifth Ave', 'Manhattan', 'Culture', 1, 40.7794, -73.9632, '212-555-0171', 'Costume Institute adjacent.'),
  (15, 'Peloton', 'onepeloton.com', '441 Ninth Ave', 'Manhattan', 'Fitness', 2, 40.7536, -73.9972, '646-555-0122', 'Instructor showcases.');

insert into people (id, name, email, phone, title, org_id, owner_id, city, lat, lng) values
  (1, 'Elena Voss', 'elena.voss@citadel.com', '917-555-2001', 'Head of Events', 1, 2, 'Manhattan', 40.7616, -73.9690),
  (2, 'David Park', 'dpark@brooklynmuseum.org', '347-555-2002', 'Director of Special Events', 2, 3, 'Brooklyn', 40.6712, -73.9636),
  (3, 'Amina Cole', 'amina.cole@nike.com', '646-555-2003', 'Experience Producer', 3, 1, 'Manhattan', 40.7265, -73.9936),
  (4, 'Theo Marsh', 'tmarsh@1hotels.com', '718-555-2004', 'Catering Sales', 4, 3, 'Brooklyn', 40.7022, -73.9954),
  (5, 'Nora Ellis', 'nellis@pier17ny.com', '212-555-2005', 'Booking Manager', 5, 2, 'Manhattan', 40.7056, -74.0016),
  (6, 'Chris Lang', 'clang@sohohouse.com', '917-555-2006', 'Programming', 6, 5, 'Manhattan', 40.7407, -74.0056),
  (7, 'Imani Brooks', 'ibrooks@barclayscenter.com', '347-555-2007', 'Partnerships', 7, 1, 'Brooklyn', 40.6826, -73.9754),
  (8, 'Owen Hart', 'ohart@momaps1.org', '718-555-2008', 'Production Manager', 8, 4, 'Queens', 40.7455, -73.9470),
  (9, 'Sofia Mendes', 'smendes@lincolncenter.org', '212-555-2009', 'Gala Producer', 9, 1, 'Manhattan', 40.7725, -73.9835),
  (10, 'Ben Adler', 'ben.adler@spotify.com', '646-555-2010', 'Events Lead', 10, 2, 'Manhattan', 40.7105, -74.0120),
  (11, 'Riley Cho', 'rcho@vice.com', '347-555-2011', 'Studio Ops', 11, 5, 'Brooklyn', 40.7132, -73.9656),
  (12, 'Maya Quint', 'mquint@standardhotels.com', '212-555-2012', 'Private Events', 12, 3, 'Manhattan', 40.7408, -74.0079),
  (13, 'Luis Ortega', 'lortega@theneutral.com', '718-555-2013', 'Technical Director', 13, 4, 'Brooklyn', 40.7168, -73.9362),
  (14, 'Helen Cho', 'hcho@metmuseum.org', '212-555-2014', 'Special Events', 14, 1, 'Manhattan', 40.7794, -73.9632),
  (15, 'Jordan Blake', 'jblake@onepeloton.com', '646-555-2015', 'Brand Studio', 15, 2, 'Manhattan', 40.7536, -73.9972),
  (16, 'Patrice Ng', 'png@independents.nyc', '917-555-2016', 'Independent Producer', null, 2, 'Brooklyn', 40.6782, -73.9442),
  (17, 'Sasha Reed', 'sasha@reedevents.co', '347-555-2017', 'Wedding Planner', null, 3, 'Manhattan', 40.7359, -74.0036);

insert into deals (id, title, value, pipeline_id, stage_id, org_id, person_id, owner_id, status, lost_reason, expected_close, probability, source, event_date, venue, guest_count, indoor, load_in, notes, stage_entered_at, created_at, updated_at, won_at, lost_at) values
  (1, 'Citadel Holiday Party — LED + audio', 186400, 1, 4, 1, 1, 2, 'open', null, CURRENT_DATE + 18, 65, 'Referral', CURRENT_DATE + 82, 'Cipriani 42nd Street', 700, true, '06:00', 'Wall 8x4 of 2.6mm, L-Acoustics FOH, 4-hour load-in.', now() - interval '16 days', now() - interval '34 days', now() - interval '1 day', null, null),
  (2, 'Brooklyn Museum Gala', 64200, 1, 3, 2, 2, 3, 'open', null, CURRENT_DATE + 12, 45, 'Repeat', CURRENT_DATE + 61, 'Brooklyn Museum Plaza', 450, false, '05:00', 'Outdoor weather plot required. Generator on Eastern Pkwy.', now() - interval '6 days', now() - interval '21 days', now() - interval '2 days', null, null),
  (3, 'Nike Bond Street drop', 248000, 1, 2, 3, 3, 1, 'open', null, CURRENT_DATE + 24, 25, 'Inbound', CURRENT_DATE + 39, '21 Bond St', 220, true, '22:00', 'Overnight load-in. Resolume + LED ceiling.', now() - interval '4 days', now() - interval '11 days', now() - interval '1 day', null, null),
  (4, '1 Hotel rooftop wedding', 28500, 1, 6, 4, 4, 3, 'open', null, CURRENT_DATE + 4, 95, 'Web form', CURRENT_DATE + 28, '1 Hotel Brooklyn Bridge', 180, false, '08:00', 'Wind load on truss. Ceremony + dinner flip.', now() - interval '3 days', now() - interval '40 days', now(), null, null),
  (5, 'Pier 17 tech keynote', 112000, 1, 1, 5, 5, 2, 'open', null, CURRENT_DATE + 30, 10, 'Prospector', CURRENT_DATE + 94, 'Pier 17 Rooftop', 900, false, '04:00', 'Needs IMAG and delay towers.', now() - interval '2 days', now() - interval '2 days', now() - interval '2 days', null, null),
  (6, 'Soho House members night', 19800, 1, 3, 6, 6, 5, 'open', null, CURRENT_DATE + 9, 45, 'Repeat', CURRENT_DATE + 22, 'Soho House Meatpacking', 140, true, '10:00', 'Quiet install before noon. No street noise.', now() - interval '14 days', now() - interval '19 days', now() - interval '3 days', null, null),
  (7, 'Barclays pre-show activation', 91000, 1, 5, 7, 7, 1, 'open', null, CURRENT_DATE + 6, 80, 'Referral', CURRENT_DATE + 17, 'Atlantic Ave plaza', 500, false, '07:00', 'Brand village, 3 LED totems, RF pack.', now() - interval '2 days', now() - interval '27 days', now(), null, null),
  (8, 'MoMA PS1 Warm Up', 44000, 1, 2, 8, 8, 4, 'open', null, CURRENT_DATE + 20, 25, 'Inbound', CURRENT_DATE + 73, 'MoMA PS1 courtyard', 1200, false, '06:00', 'Dance floor PA, IP65 fixtures.', now() - interval '12 days', now() - interval '16 days', now() - interval '1 day', null, null),
  (9, 'Lincoln Center plaza gala', 155000, 1, 6, 9, 9, 1, 'won', null, CURRENT_DATE - 40, 100, 'Repeat', CURRENT_DATE - 18, 'Josie Robertson Plaza', 800, false, '05:00', 'Closed-won. Crew of 22.', now() - interval '50 days', now() - interval '90 days', now() - interval '18 days', now() - interval '18 days', null),
  (10, 'Spotify Upfront', 203000, 1, 6, 10, 10, 2, 'won', null, CURRENT_DATE - 70, 100, 'Inbound', CURRENT_DATE - 48, '4 WTC', 400, true, '20:00', 'Won. Playback + IMAG.', now() - interval '80 days', now() - interval '120 days', now() - interval '48 days', now() - interval '48 days', null),
  (11, 'WeWork Summit', 72000, 1, 3, null, 16, 2, 'lost', 'Budget', CURRENT_DATE - 12, 0, 'Web form', CURRENT_DATE + 8, 'WeWork 110 Wall', 300, true, '07:00', 'Lost to in-house AV.', now() - interval '20 days', now() - interval '45 days', now() - interval '12 days', null, now() - interval '12 days'),
  (12, 'Vice holiday party dry hire', 12400, 2, 9, 11, 11, 5, 'open', null, CURRENT_DATE + 5, 70, 'Repeat', CURRENT_DATE + 71, 'Vice Williamsburg', 200, true, '12:00', 'Speakers, consoles, no labor.', now() - interval '3 days', now() - interval '8 days', now(), null, null),
  (13, 'Brooklyn Steel takeover', 67000, 1, 4, 13, 13, 4, 'open', null, CURRENT_DATE + 15, 65, 'Referral', CURRENT_DATE + 50, 'Brooklyn Steel', 1800, true, '08:00', 'Supplement house system, extra delay.', now() - interval '9 days', now() - interval '22 days', now() - interval '1 day', null, null),
  (14, 'Met Costume cocktail', 88000, 1, 1, 14, 14, 1, 'open', null, CURRENT_DATE + 40, 10, 'Prospector', CURRENT_DATE + 120, 'The Met', 250, true, '21:00', 'Museum rules, union labor.', now() - interval '1 day', now() - interval '1 day', now() - interval '1 day', null, null),
  (15, 'Peloton instructor showcase', 54000, 1, 5, 15, 15, 2, 'open', null, CURRENT_DATE + 8, 80, 'Inbound', CURRENT_DATE + 33, 'Peloton Studios', 180, true, '06:00', 'IMAG + LED cyc. Tight turn.', now() - interval '1 day', now() - interval '18 days', now(), null, null),
  (16, 'Standard High Line dinner', 31200, 1, 3, 12, 12, 3, 'open', null, CURRENT_DATE + 11, 45, 'Web form', CURRENT_DATE + 44, 'Boom Boom Room', 90, true, '09:00', 'Low ceiling, no truss. Ground support.', now() - interval '5 days', now() - interval '14 days', now() - interval '2 days', null, null),
  (17, 'd&b stock share with PRG', 0, 3, 12, null, null, 1, 'open', null, CURRENT_DATE + 60, 40, 'Partner', null, 'Shop — Gowanus', null, true, null, 'Cross-hire SL-Series when both dark.', now() - interval '8 days', now() - interval '30 days', now() - interval '4 days', null, null),
  (18, 'Reed wedding — private loft', 22100, 1, 2, null, 17, 3, 'open', null, CURRENT_DATE + 16, 25, 'Chatbot', CURRENT_DATE + 55, 'Tribeca loft', 110, true, '10:00', 'Ceremony PA + uplights + DJ booth.', now() - interval '3 days', now() - interval '7 days', now(), null, null),
  (19, 'Citadel summer offsite', 97000, 1, 1, 1, 1, 2, 'open', null, CURRENT_DATE + 50, 10, 'Repeat', CURRENT_DATE + 160, 'Gotham Hall', 400, true, '06:00', 'Next year hold. Early discovery.', now() - interval '9 days', now() - interval '9 days', now() - interval '9 days', null, null),
  (20, 'MA3 console dry hire', 2400, 2, 10, 11, 11, 5, 'open', null, CURRENT_DATE + 2, 95, 'Repeat', CURRENT_DATE + 9, 'Vice Williamsburg', null, true, '09:00', 'Weekend rental, pickup at shop.', now() - interval '1 day', now() - interval '4 days', now(), null, null);

select setval('deals_id_seq', 20);
select setval('people_id_seq', 17);
select setval('organizations_id_seq', 15);
select setval('members_id_seq', 6);
select setval('teams_id_seq', 3);
select setval('pipelines_id_seq', 3);
select setval('stages_id_seq', 14);

insert into products (id, name, sku, category, unit_price, unit, billing, description) values
  (1, 'ROE Visual 2.6mm LED tile', 'LED-26', 'Video', 95, 'tile/day', 'one-time', 'Indoor 500x500mm, 2.6mm pixel pitch.'),
  (2, 'L-Acoustics K2 hang', 'K2-HANG', 'Audio', 4800, 'day', 'one-time', '12-box hang with Kara fills.'),
  (3, 'd&b SL-Series', 'DB-SL', 'Audio', 5200, 'day', 'one-time', 'GSL + KSL package.'),
  (4, 'GrandMA3 full size', 'MA3-FS', 'Lighting', 850, 'day', 'one-time', 'Full size with NPU.'),
  (5, 'Robe MegaPointe', 'RB-MP', 'Lighting', 95, 'fixture/day', 'one-time', 'Spot/beam hybrid.'),
  (6, 'GLP JDC1', 'GLP-JDC', 'Lighting', 75, 'fixture/day', 'one-time', 'Strobe / wash hybrid.'),
  (7, 'A1 Engineer', 'LAB-A1', 'Labor', 950, 'day', 'one-time', 'Lead audio, 10-hour day.'),
  (8, 'A2', 'LAB-A2', 'Labor', 620, 'day', 'one-time', 'Audio assist.'),
  (9, 'L1 Programmer', 'LAB-L1', 'Labor', 980, 'day', 'one-time', 'Lighting programmer.'),
  (10, 'Video engineer', 'LAB-VE', 'Labor', 900, 'day', 'one-time', 'LED / IMAG.'),
  (11, 'Stagehand', 'LAB-SH', 'Labor', 520, 'day', 'one-time', 'IATSE or indie.'),
  (12, '26ft box truck', 'TR-26', 'Transport', 450, 'day', 'one-time', 'Shop to venue.'),
  (13, '53ft trailer', 'TR-53', 'Transport', 1100, 'day', 'one-time', 'Long haul.'),
  (14, 'Camco 400A distro', 'PWR-400', 'Power', 380, 'day', 'one-time', 'Cam-lok distro.'),
  (15, '4x8 stage deck', 'STG-48', 'Staging', 28, 'deck/day', 'one-time', 'Steel frame, black.'),
  (16, '12in box truss 10ft', 'TRS-12', 'Rigging', 42, 'stick/day', 'one-time', 'Tomcat compatible.'),
  (17, '200kW generator', 'GEN-200', 'Power', 1600, 'day', 'one-time', 'Quiet canopy, outdoor.'),
  (18, 'Shure Axient RF pack', 'RF-AX', 'Audio', 1200, 'day', 'one-time', '8-channel HH + beltpack.'),
  (19, 'Resolume Arena', 'VID-RES', 'Video', 400, 'day', 'one-time', 'Media server + operator add.'),
  (20, 'CAD / light plot', 'PRE-CAD', 'Prep', 1800, 'show', 'one-time', 'Vectorworks plot + render.');

select setval('products_id_seq', 20);

insert into deal_products (deal_id, product_id, qty, discount, price) values
  (1, 1, 32, 0, 95), (1, 2, 1, 0, 4800), (1, 7, 2, 0, 950), (1, 8, 2, 0, 620), (1, 10, 1, 0, 900), (1, 12, 2, 0, 450), (1, 20, 1, 0, 1800),
  (2, 5, 24, 10, 95), (2, 6, 12, 0, 75), (2, 4, 1, 0, 850), (2, 17, 1, 0, 1600), (2, 9, 1, 0, 980), (2, 11, 6, 0, 520),
  (3, 1, 48, 5, 95), (3, 19, 1, 0, 400), (3, 10, 2, 0, 900), (3, 7, 1, 0, 950),
  (4, 18, 1, 0, 1200), (4, 5, 8, 0, 95), (4, 7, 1, 0, 950), (4, 11, 4, 0, 520),
  (7, 1, 12, 0, 95), (7, 18, 1, 0, 1200), (7, 11, 8, 0, 520),
  (9, 2, 1, 0, 4800), (9, 5, 36, 0, 95), (9, 7, 2, 0, 950),
  (10, 1, 40, 0, 95), (10, 19, 1, 0, 400), (10, 10, 2, 0, 900);

insert into activities (type, subject, deal_id, person_id, org_id, owner_id, due_at, done, duration_min, location, notes) values
  ('site-survey', 'Site walk — Cipriani 42nd', 1, 1, 1, 2, now() + interval '2 days', false, 90, 'Cipriani 42nd Street', 'Measure for LED wall and FOH.'),
  ('meeting', 'Proposal review with Elena', 1, 1, 1, 2, now() + interval '5 days', false, 45, 'Video', null),
  ('call', 'Follow up weather plot', 2, 2, 2, 3, now() - interval '1 day', false, 20, null, 'Overdue — plaza wind.'),
  ('task', 'Send Vectorworks PDF', 3, 3, 3, 1, now() + interval '1 day', false, 60, 'Shop', null),
  ('deadline', 'Contract countersign', 4, 4, 4, 3, now() + interval '3 days', false, 15, null, null),
  ('meeting', 'Discovery call — Pier 17', 5, 5, 5, 2, now() + interval '4 days', false, 30, 'Video', null),
  ('call', 'Quiet hours with Soho House', 6, 6, 6, 5, now() - interval '2 days', false, 15, null, 'Rotting deal, overdue call.'),
  ('site-survey', 'Atlantic Ave plaza measure', 7, 7, 7, 1, now() + interval '1 day', false, 75, 'Barclays Center', null),
  ('task', 'IP65 fixture list', 8, 8, 8, 4, now() + interval '6 days', false, 90, 'Shop', null),
  ('lunch', 'Thank-you lunch — Lincoln Center', 9, 9, 9, 1, now() + interval '10 days', false, 90, 'Lincoln Ristorante', 'Post-show.'),
  ('email', 'Send dry-hire quote', 12, 11, 11, 5, now() + interval '1 day', false, 20, null, null),
  ('call', 'Stock check MA3', 20, 11, 11, 5, now() - interval '3 hours', true, 10, 'Shop', 'Confirmed available.'),
  ('meeting', 'Peloton run-of-show', 15, 15, 15, 2, now() + interval '3 days', false, 60, 'Peloton Studios', null),
  ('site-survey', 'Tribeca loft walkthrough', 18, 17, null, 3, now() + interval '7 days', false, 60, 'Tribeca', null),
  ('task', 'Crew call sheet — Barclays', 7, 7, 7, 6, now() + interval '8 days', false, 45, null, null),
  ('deadline', 'Insurance cert to Nike', 3, 3, 3, 6, now() + interval '2 days', false, 15, null, null),
  ('call', 'PRG cross-hire intro', 17, null, null, 1, now() + interval '9 days', false, 30, null, null),
  ('meeting', 'Q4 pipeline review', null, null, null, 1, now() + interval '1 day', false, 60, 'Gowanus shop', 'Internal.');

insert into leads (title, person_id, org_id, owner_id, source, score, status, labels, notes) values
  ('Independent producer — warehouse rave', 16, null, 2, 'Chatbot', 62, 'new', 'audio,overnight', 'Needs 2am load-out, Bushwick.'),
  ('Reed Events loft wedding', 17, null, 3, 'Web form', 71, 'contacted', 'wedding,lighting', 'Converted a sister inquiry to deal 18. Keep warm.'),
  ('Unknown — Google form, Pier 57', null, null, 5, 'Web form', 38, 'new', 'inquiry', 'No phone. Company field blank.'),
  ('The Met after-hours', 14, 14, 1, 'Prospector', 84, 'qualified', 'museum,union', 'Ready to convert.'),
  ('Soho Works conference', null, 6, 5, 'Live chat', 55, 'contacted', 'corporate', 'Asked about repeating projectors.'),
  ('Barclays holiday village', 7, 7, 1, 'Referral', 77, 'qualified', 'arena,led', 'Waiting on brand deck.'),
  ('Spotify listening room', 10, 10, 2, 'Email', 48, 'new', 'audio', 'Small room, 40 pax.'),
  ('Brooklyn Navy Yard open studios', null, null, 4, 'Prospector', 33, 'new', 'outdoor', 'City permit unknown.');

insert into comments (entity_type, entity_id, author_id, body, created_at) values
  ('deal', 1, 2, 'Elena wants the wall one bay wider. Recosting 40 tiles. @Sam Chen can you run numbers?', now() - interval '6 hours'),
  ('deal', 1, 5, 'Updated bid: +$3,040 on LED, trucking still two 26fts.', now() - interval '3 hours'),
  ('deal', 2, 3, 'Weather hold — they will not approve generator placement until Parks replies.', now() - interval '1 day'),
  ('deal', 4, 3, '@Jules Rivera load-in is 08:00 sharp. Security desk needs names by Friday.', now() - interval '2 days'),
  ('deal', 7, 1, 'Verbal from Imani. Legal wants COI on their template.', now() - interval '8 hours'),
  ('lead', 4, 1, 'Helen asked for union labor language in the first proposal.', now() - interval '5 hours');

insert into files (entity_type, entity_id, name, kind, size_kb, uploaded_by, created_at) values
  ('deal', 1, 'Cipriani_plot_v3.pdf', 'plot', 2400, 5, now() - interval '2 days'),
  ('deal', 1, 'Citadel_holiday_riders.pdf', 'rider', 880, 2, now() - interval '10 days'),
  ('deal', 3, 'Bond_St_ceiling_scan.zip', 'scan', 18400, 4, now() - interval '3 days'),
  ('deal', 2, 'BKM_gala_site_photos.pdf', 'photos', 6200, 3, now() - interval '5 days'),
  ('deal', 4, '1Hotel_wind_study.pdf', 'report', 1100, 4, now() - interval '8 days'),
  ('person', 1, 'Elena_Voss_card.vcf', 'contact', 12, 2, now() - interval '30 days');

insert into emails (folder, from_name, from_addr, to_addr, subject, body, deal_id, person_id, opened, clicked, sent_at, created_at) values
  ('sent', 'Marcus Hale', 'marcus@northline.av', 'elena.voss@citadel.com', 'Revised LED count — Cipriani', 'Elena — Sam recosted the wider wall. Attached v3 plot and a $3,040 delta. Happy to walk it Thursday.', 1, 1, true, true, now() - interval '3 hours', now() - interval '3 hours'),
  ('inbox', 'Elena Voss', 'elena.voss@citadel.com', 'marcus@northline.av', 'Re: Revised LED count — Cipriani', 'Thanks Marcus. Can you hold pricing through the 15th? Legal is slow this week.', 1, 1, true, false, now() - interval '1 hour', now() - interval '1 hour'),
  ('sent', 'Priya Shah', 'priya@northline.av', 'tmarsh@1hotels.com', 'Contract + COI — rooftop wedding', 'Theo — agreement is in Documents. E-sign whenever you are ready. COI attached.', 4, 4, true, true, now() - interval '1 day', now() - interval '1 day'),
  ('inbox', 'Amina Cole', 'amina.cole@nike.com', 'dana@northline.av', 'Overnight load-in window', 'Dana, security will badge the crew at 21:30. Need names 48h prior.', 3, 3, false, false, now() - interval '5 hours', now() - interval '5 hours'),
  ('shared', 'Imani Brooks', 'ibrooks@barclayscenter.com', 'sales@northline.av', 'Verbal — plaza activation', 'You are our vendor. Sending brand guidelines tomorrow.', 7, 7, true, false, now() - interval '10 hours', now() - interval '10 hours'),
  ('drafts', 'Dana Okonkwo', 'dana@northline.av', 'hcho@metmuseum.org', 'After-hours lighting conversation', 'Helen — following the prospector note. We can work union and museum rules.', 14, 14, false, false, null, now() - interval '2 hours'),
  ('sent', 'Sam Chen', 'sam@northline.av', 'rcho@vice.com', 'MA3 weekend dry hire', 'Riley — console is on the shelf. Pickup Friday 09:00 from Gowanus.', 20, 11, true, false, now() - interval '6 hours', now() - interval '6 hours');

insert into email_templates (name, subject, body) values
  ('Site walk confirm', 'Site walk confirmed — {{venue}}', 'Hi {{first_name}}, locking {{date}} for a walkthrough at {{venue}}. We will bring a laser, a tape, and a camera. 45–90 minutes.'),
  ('Proposal send', 'Proposal — {{deal}}', 'Hi {{first_name}}, sharing the Northline proposal for {{deal}}. Gear, labor, and trucking are itemized. Happy to jump on a call.'),
  ('COI request', 'Insurance certificate for {{venue}}', 'Please find our COI for {{venue}}. Additional insured as requested. Let us know if legal needs a revision.'),
  ('Crew call', 'Crew call — {{deal}}', 'Call time {{load_in}} at {{venue}}. Parking notes in the call sheet. Text the shop if you are running late.');

insert into documents (name, deal_id, template, status, content, sent_at, viewed_at, signed_at) values
  ('Northline proposal — Citadel holiday', 1, 'proposal', 'viewed', 'LED wall, K2 hang, labor, trucking. Total $186,400. Valid 15 days.', now() - interval '4 days', now() - interval '3 days', null),
  ('Production agreement — 1 Hotel wedding', 4, 'contract', 'sent', 'Outdoor rooftop, wind clause, $28,500. 50% deposit.', now() - interval '2 days', null, null),
  ('COI — Barclays plaza', 7, 'coi', 'draft', 'Additional insured: BSE Global. $5M umbrella.', null, null, null),
  ('Lincoln Center gala — signed agreement', 9, 'contract', 'signed', 'Closed. $155,000. Paid in full.', now() - interval '40 days', now() - interval '39 days', now() - interval '38 days'),
  ('Spotify Upfront — signed', 10, 'contract', 'signed', 'Closed. $203,000.', now() - interval '70 days', now() - interval '69 days', now() - interval '68 days');

insert into projects (id, name, deal_id, status, start_date, end_date, owner_id) values
  (1, 'Lincoln Center plaza gala', 9, 'done', CURRENT_DATE - 22, CURRENT_DATE - 18, 4),
  (2, 'Spotify Upfront', 10, 'done', CURRENT_DATE - 52, CURRENT_DATE - 48, 4),
  (3, '1 Hotel rooftop wedding', 4, 'open', CURRENT_DATE + 24, CURRENT_DATE + 28, 4),
  (4, 'Barclays pre-show', 7, 'open', CURRENT_DATE + 14, CURRENT_DATE + 17, 6),
  (5, 'Nike Bond Street drop', 3, 'open', CURRENT_DATE + 36, CURRENT_DATE + 39, 4);

select setval('projects_id_seq', 5);

insert into project_tasks (project_id, title, column_name, assignee_id, due_at, sort_order) values
  (3, 'Submit names to security desk', 'To do', 6, CURRENT_DATE + 10, 0),
  (3, 'Confirm wind load on 12in truss', 'In progress', 4, CURRENT_DATE + 8, 1),
  (3, 'Print call sheet', 'To do', 6, CURRENT_DATE + 22, 2),
  (3, 'Pull RF pack from cage', 'To do', 4, CURRENT_DATE + 23, 3),
  (4, 'COI on BSE template', 'In progress', 1, CURRENT_DATE + 4, 0),
  (4, 'LED totem CAD', 'To do', 5, CURRENT_DATE + 7, 1),
  (4, 'Labor call — 8 stagehands', 'To do', 6, CURRENT_DATE + 10, 2),
  (5, 'Overnight parking permit', 'To do', 6, CURRENT_DATE + 20, 0),
  (5, 'Ceiling scan review', 'In progress', 4, CURRENT_DATE + 5, 1),
  (5, 'Resolume timeline', 'To do', 4, CURRENT_DATE + 30, 2),
  (1, 'Strike complete', 'Done', 4, CURRENT_DATE - 18, 0),
  (1, 'Invoice sent', 'Done', 3, CURRENT_DATE - 17, 1),
  (2, 'Archive show files', 'Done', 4, CURRENT_DATE - 47, 0);

insert into automations (name, active, trigger_type, trigger_detail, action_type, action_detail, conditions, runs) values
  ('Rotting deal nudge', true, 'deal.rotting', 'Any Live Events stage', 'activity.create', 'Task: follow up rotting deal, due tomorrow, assigned to owner', 'status = open', 42),
  ('Won → create production project', true, 'deal.won', 'Live Events', 'project.create', 'Project named after deal, owner = Jules Rivera', null, 11),
  ('Web form → lead + round-robin', true, 'form.submit', 'site-survey form', 'lead.create', 'Assign round-robin across New Business', null, 86),
  ('Contracting → request COI', true, 'deal.stage', 'Moved to Contracting', 'email.template', 'Send COI request to person', null, 19),
  ('No activity 5 days', false, 'deal.idle', '5 days', 'notification', 'Notify owner and manager', 'value > 20000', 0),
  ('Lead score ≥ 80', true, 'lead.score', 'score >= 80', 'deal.convert_prompt', 'Notify owner to convert', null, 7);

insert into sequences (name, active, steps, enrolled) values
  ('New inquiry nurture', true, '[{"day":0,"channel":"email","title":"Thanks — here is a one-pager"},{"day":2,"channel":"email","title":"Site walk offer"},{"day":5,"channel":"call","title":"AE check-in"},{"day":9,"channel":"email","title":"Recent shows in your neighborhood"}]'::jsonb, 14),
  ('Post-show thank you', true, '[{"day":1,"channel":"email","title":"Show photos + invoice"},{"day":7,"channel":"email","title":"Ask for a referral"},{"day":30,"channel":"email","title":"Next season hold"}]'::jsonb, 6),
  ('Wedding planner drip', true, '[{"day":0,"channel":"email","title":"Rooftop / loft packages"},{"day":4,"channel":"email","title":"Wind and generator FAQ"},{"day":12,"channel":"call","title":"Calendar check"}]'::jsonb, 9);

insert into web_forms (name, slug, fields, active, submissions) values
  ('Site survey request', 'site-survey', '[{"id":"name","label":"Your name","type":"text","required":true},{"id":"email","label":"Email","type":"email","required":true},{"id":"org","label":"Company","type":"text","required":false},{"id":"venue","label":"Venue","type":"text","required":true},{"id":"date","label":"Event date","type":"date","required":true},{"id":"notes","label":"What are you staging?","type":"textarea","required":false}]'::jsonb, true, 18),
  ('Dry hire inquiry', 'dry-hire', '[{"id":"name","label":"Name","type":"text","required":true},{"id":"email","label":"Email","type":"email","required":true},{"id":"gear","label":"Gear list","type":"textarea","required":true},{"id":"dates","label":"Dates","type":"text","required":true}]'::jsonb, true, 7);

insert into form_submissions (form_id, payload, created_at) values
  (1, '{"name":"Patrice Ng","email":"png@independents.nyc","org":"","venue":"Bushwick warehouse","date":"2026-11-02","notes":"Warehouse rave, 400 pax"}'::jsonb, now() - interval '2 days'),
  (1, '{"name":"Sasha Reed","email":"sasha@reedevents.co","org":"Reed Events","venue":"Tribeca loft","date":"2026-11-15","notes":"Ceremony + dinner"}'::jsonb, now() - interval '7 days');

insert into chats (id, visitor_name, visitor_email, status, assignee_id, source, last_message, updated_at) values
  (1, 'Patrice Ng', 'png@independents.nyc', 'open', 2, 'chatbot', 'Do you do overnight warehouse shows?', now() - interval '20 minutes'),
  (2, 'Visitor 8f2a', null, 'open', null, 'live-chat', 'Can I see a lighting package for 150 pax?', now() - interval '8 minutes'),
  (3, 'Chris Lang', 'clang@sohohouse.com', 'closed', 5, 'live-chat', 'Thanks — we will send the plot.', now() - interval '2 days');

select setval('chats_id_seq', 3);

insert into chat_messages (chat_id, sender, body, created_at) values
  (1, 'visitor', 'Hi — looking for a PA and some moving lights for a warehouse in Bushwick.', now() - interval '40 minutes'),
  (1, 'bot', 'Northline can do overnight warehouse shows. What is the date and headcount?', now() - interval '39 minutes'),
  (1, 'visitor', 'Nov 2, about 400. Do you do overnight warehouse shows?', now() - interval '20 minutes'),
  (2, 'visitor', 'Can I see a lighting package for 150 pax?', now() - interval '8 minutes'),
  (3, 'visitor', 'Need a quiet install before noon.', now() - interval '2 days'),
  (3, 'agent', 'We can. Sending a plot this afternoon.', now() - interval '2 days'),
  (3, 'visitor', 'Thanks — we will send the plot.', now() - interval '2 days');

insert into prospect_companies (name, industry, city, employees, website, email, phone, added) values
  ( 'The Shed', 'Culture', 'Manhattan', '200-500', 'theshed.org', 'events@theshed.org', '646-555-3100', false),
  ( 'Brookfield Place', 'Venue', 'Manhattan', '500+', 'brookfieldplaceny.com', 'events@brookfieldplaceny.com', '212-555-3101', false),
  ( 'Industry City', 'Venue', 'Brooklyn', '200-500', 'industrycity.com', 'events@industrycity.com', '718-555-3102', false),
  ( 'Knockdown Center', 'Venue', 'Queens', '50-200', 'knockdown.center', 'hello@knockdown.center', '718-555-3103', false),
  ( 'Public Hotels', 'Hospitality', 'Manhattan', '500+', 'publichotels.com', 'events@publichotels.com', '212-555-3104', false),
  ( 'A24', 'Media', 'Manhattan', '200-500', 'a24films.com', 'events@a24films.com', '646-555-3105', false),
  ( 'Warby Parker', 'Retail', 'Manhattan', '500+', 'warbyparker.com', 'events@warbyparker.com', '646-555-3106', false),
  ( 'The Brooklyn Navy Yard', 'Venue', 'Brooklyn', '500+', 'brooklynnavyyard.org', 'events@bnydc.org', '718-555-3107', false),
  ( 'Chelsea Piers', 'Venue', 'Manhattan', '500+', 'chelseapiers.com', 'events@chelseapiers.com', '212-555-3108', false),
  ( 'Guggenheim', 'Culture', 'Manhattan', '200-500', 'guggenheim.org', 'specialevents@guggenheim.org', '212-555-3109', false);

insert into scheduler_links (member_id, name, duration_min, slug, bookings) values
  (1, 'Dana — 30m intro', 30, 'dana-intro', 11),
  (2, 'Marcus — site walk hold', 90, 'marcus-sitewalk', 4),
  (3, 'Priya — account check-in', 30, 'priya-checkin', 7),
  (5, 'Sam — estimate review', 45, 'sam-estimate', 6);

insert into bookings (link_id, guest_name, guest_email, starts_at, notes) values
  (2, 'Elena Voss', 'elena.voss@citadel.com', now() + interval '2 days' + interval '10 hours', 'Cipriani walk'),
  (1, 'Helen Cho', 'hcho@metmuseum.org', now() + interval '6 days' + interval '14 hours', 'After-hours intro'),
  (3, 'Theo Marsh', 'tmarsh@1hotels.com', now() + interval '1 day' + interval '15 hours', 'Contract questions');

insert into notifications (member_id, kind, title, body, href, read, created_at) values
  (2, 'rot', 'Citadel holiday is rotting', '16 days in Negotiation — rotting threshold is 10.', '/?deal=1', false, now() - interval '2 hours'),
  (3, 'overdue', 'Overdue: Follow up weather plot', 'Brooklyn Museum Gala — call was due yesterday.', '/activities', false, now() - interval '4 hours'),
  (1, 'mention', 'Priya mentioned you', 'Load-in is 08:00 sharp on the 1 Hotel deal.', '/?deal=4', false, now() - interval '2 days'),
  (5, 'mention', 'Marcus mentioned you', 'Recost the wider LED wall on Citadel.', '/?deal=1', true, now() - interval '6 hours'),
  (1, 'won', 'Nothing here — sample', 'Keep pipeline moving.', '/', true, now() - interval '3 days'),
  (2, 'lead', 'New chatbot lead', 'Patrice Ng — warehouse rave.', '/leads', false, now() - interval '20 minutes');

insert into audit_log (actor, action, entity, detail, ip, device, created_at) values
  ('Marcus Hale', 'updated', 'deal:1', 'Moved to Negotiation', '74.64.12.10', 'Chrome · macOS', now() - interval '16 days'),
  ('Priya Shah', 'created', 'document:2', 'Sent production agreement', '74.64.12.22', 'Chrome · macOS', now() - interval '2 days'),
  ('Dana Okonkwo', 'exported', 'deals', 'CSV export · Live Events', '74.64.12.4', 'Safari · iOS', now() - interval '1 day'),
  ('Sam Chen', 'updated', 'deal:1', 'Added 8 LED tiles', '74.64.12.18', 'Chrome · macOS', now() - interval '3 hours'),
  ('Alex Kim', 'login', 'session', 'New device from Brooklyn', '74.64.12.31', 'Chrome · Windows', now() - interval '5 hours'),
  ('Jules Rivera', 'updated', 'project:3', 'Moved wind-load task to In progress', '74.64.12.9', 'Chrome · macOS', now() - interval '6 hours');

insert into security_alerts (severity, title, detail, resolved, created_at) values
  ('medium', 'New device · Alex Kim', 'Chrome on Windows from Brooklyn, 5 hours ago.', false, now() - interval '5 hours'),
  ('low', 'CSV export', 'Dana exported deals yesterday from iOS.', true, now() - interval '1 day'),
  ('high', 'Failed password · unknown', '3 attempts against sales@northline.av from a non-office IP.', false, now() - interval '12 hours');

insert into security_rules (name, detail, active) values
  ('Office hours only', 'Block login outside 07:00–22:00 America/New_York unless on the allow list.', true),
  ('IP allow list', 'Production shop + Brooklyn home ranges. Alert on anything else.', true),
  ('2FA required', 'All roles. Recovery codes held by Dana.', true),
  ('Idle lock', '15 minutes on shared shop computers.', true),
  ('Export notify', 'Alert owners when a deals CSV leaves the workspace.', true);

insert into devices (member_name, device, location, last_active, current) values
  ('Dana Okonkwo', 'Safari · iPhone', 'Fort Greene', now() - interval '20 minutes', true),
  ('Dana Okonkwo', 'Chrome · MacBook', 'Gowanus shop', now() - interval '1 hour', false),
  ('Marcus Hale', 'Chrome · MacBook', 'Gowanus shop', now() - interval '15 minutes', true),
  ('Alex Kim', 'Chrome · Windows', 'Gowanus shop', now() - interval '5 hours', true),
  ('Priya Shah', 'Chrome · MacBook', 'Park Slope', now() - interval '40 minutes', true);

insert into webhooks (url, event, active, last_status) values
  ('https://hooks.northline.av/deals', 'deal.updated', true, '200 · 2m ago'),
  ('https://hooks.northline.av/won', 'deal.won', true, '200 · 18d ago'),
  ('https://slack.com/northline-sales', 'activity.overdue', true, '200 · 4h ago');

insert into custom_fields (entity, name, field_type, options, required, pipeline_id) values
  ('deal', 'Event date', 'date', null, true, 1),
  ('deal', 'Venue', 'text', null, true, 1),
  ('deal', 'Guest count', 'number', null, false, 1),
  ('deal', 'Indoor / outdoor', 'enum', 'Indoor,Outdoor,Both', true, 1),
  ('deal', 'Load-in time', 'text', null, false, 1),
  ('deal', 'Union labor', 'enum', 'Yes,No,Mixed', false, 1),
  ('deal', 'Power on site', 'enum', 'House,Generator,Unknown', false, 1),
  ('person', 'Dietary / access notes', 'text', null, false, null),
  ('organization', 'Loading dock', 'enum', 'Yes,No,Street only', false, null);

insert into score_models (name, entity, rules, active) values
  ('Live-event fit', 'lead', '[{"field":"source","op":"=","value":"Referral","points":25},{"field":"source","op":"=","value":"Repeat","points":20},{"field":"labels","op":"contains","value":"union","points":10},{"field":"title","op":"contains","value":"gala","points":15}]'::jsonb, true),
  ('Urgency', 'deal', '[{"field":"event_date","op":"<","value":"30d","points":20},{"field":"value","op":">","value":"50000","points":15}]'::jsonb, true);

insert into marketplace_apps (name, category, description, connected) values
  ('QuickBooks', 'Accounting', 'Push won invoices and retainers.', true),
  ('Google Calendar', 'Calendar', 'Two-way activity sync.', true),
  ('Slack', 'Chat', 'Rotting deals and mentions into #sales.', true),
  ('PandaDoc', 'Documents', 'Alternate e-sign if a client refuses ours.', false),
  ('CloudTalk', 'Phone', 'Click-to-call and recording.', false),
  ('Dropbox', 'Files', 'Show folders on the deal.', true),
  ('Xero', 'Accounting', 'AU/UK entities.', false),
  ('Mailchimp', 'Campaigns', 'Post-show nurture lists.', false),
  ('Zapier', 'Automation', 'Catch-all for shop tools.', true),
  ('Vectorworks', 'Production', 'Plot metadata onto products.', false),
  ('Spotify', 'Research', 'Artist event calendars.', false),
  ('DocuSign', 'Documents', 'Enterprise legal desks.', false);

insert into custom_reports (name, kind, config) values
  ('Won by month', 'column', '{"metric":"won_value"}'::jsonb),
  ('Pipeline by owner', 'bar', '{"metric":"open_value"}'::jsonb),
  ('Source mix', 'pie', '{"metric":"open_value"}'::jsonb);
