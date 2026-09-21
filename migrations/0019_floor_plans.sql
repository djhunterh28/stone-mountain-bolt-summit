-- Venue shells + extra mark metadata for the floor-plan designer.

alter table floor_plans add column if not exists layout text not null default '{}';
alter table floor_plans add column if not exists notes text;
alter table floor_plans add column if not exists template boolean not null default true;
alter table floor_plans add column if not exists archived boolean not null default false;

-- Cipriani: real ballroom shell, rescale marks onto the 100×62 plot.
update floor_plans
set
  layout = '{"w":100,"h":62,"shell":{"x":3,"y":3,"w":94,"h":56},"rooms":[{"x":3,"y":6,"w":16,"h":20,"label":"Green"},{"x":38,"y":48,"w":24,"h":10,"label":"FOH"}],"stage":{"x":28,"y":3,"w":44,"h":12,"label":"Stage"},"docks":[{"x":3,"y":46,"w":16,"h":12,"label":"Dock 47th"}],"doors":[{"x":93,"y":24,"w":4,"h":12,"kind":"egress","label":"Lex"},{"x":44,"y":56,"w":14,"h":3,"kind":"ingress","label":"42nd"}]}',
  notes = 'Wall 8×4 of 2.6mm. House power on the Lex wall is 200A — we bring a 400A distro to Dock 47th.',
  marks = '[{"id":"p1","kind":"power","x":24,"y":20,"label":"House 200A"},{"id":"d1","kind":"distro","x":24,"y":50,"label":"400A distro"},{"id":"p2","kind":"power","x":86,"y":18,"label":"Lex wall"},{"id":"l1","kind":"loadin","x":11,"y":52,"label":"Dock 47th"},{"id":"i1","kind":"ingress","x":51,"y":57,"label":"42nd"},{"id":"e1","kind":"egress","x":94,"y":30,"label":"Lex"},{"id":"s1","kind":"stage","x":50,"y":9,"w":40,"h":10,"label":"LED wall"},{"id":"t1","kind":"seat","x":50,"y":32,"w":54,"h":22,"label":"Rounds"},{"id":"h1","kind":"hold","x":11,"y":16,"w":14,"h":12,"label":"Green hold"}]'
where venue = 'Cipriani 42nd Street';

insert into floor_plans (name, venue, template, notes, layout, marks)
select * from (values
(
  '1 Hotel rooftop — terrace',
  '1 Hotel Brooklyn Bridge',
  true,
  'Wind on the river edge. Ceremony then dinner flip. Freight elevator is the only load-in.',
  '{"w":100,"h":62,"shell":{"x":8,"y":6,"w":84,"h":50},"rooms":[{"x":8,"y":40,"w":22,"h":16,"label":"Lounge"},{"x":72,"y":8,"w":20,"h":14,"label":"Bar"}],"stage":{"x":30,"y":8,"w":28,"h":10,"label":"Ceremony"},"docks":[{"x":8,"y":48,"w":14,"h":8,"label":"Freight"}],"doors":[{"x":8,"y":28,"w":4,"h":10,"kind":"ingress","label":"Elevator"},{"x":90,"y":28,"w":2,"h":16,"kind":"egress","label":"Fire stair"}]}',
  '[{"id":"p1","kind":"power","x":18,"y":18,"label":"House 100A"},{"id":"d1","kind":"distro","x":16,"y":50,"label":"200A distro"},{"id":"l1","kind":"loadin","x":15,"y":52,"label":"Freight"},{"id":"i1","kind":"ingress","x":10,"y":33,"label":"Elevator"},{"id":"e1","kind":"egress","x":90,"y":36,"label":"Fire stair"},{"id":"s1","kind":"stage","x":44,"y":13,"w":26,"h":10,"label":"Ceremony"},{"id":"t1","kind":"seat","x":48,"y":34,"w":40,"h":18,"label":"Dinner"},{"id":"h1","kind":"hold","x":82,"y":14,"w":16,"h":10,"label":"Bar hold"}]'
),
(
  'Pier 17 rooftop',
  'Pier 17 Rooftop',
  true,
  'IMAG and delay towers. Freight on the south. Generator sits on the east apron if house is dark.',
  '{"w":100,"h":62,"shell":{"x":4,"y":8,"w":92,"h":46},"rooms":[{"x":4,"y":8,"w":18,"h":14,"label":"Green"},{"x":78,"y":40,"w":18,"h":14,"label":"Delay"}],"stage":{"x":22,"y":10,"w":36,"h":12,"label":"Keynote"},"docks":[{"x":40,"y":48,"w":20,"h":6,"label":"Freight south"}],"doors":[{"x":4,"y":28,"w":4,"h":12,"kind":"ingress","label":"West stair"},{"x":92,"y":22,"w":4,"h":14,"kind":"egress","label":"East"}]}',
  '[{"id":"p1","kind":"power","x":10,"y":18,"label":"House 400A"},{"id":"d1","kind":"distro","x":28,"y":48,"label":"FOH distro"},{"id":"d2","kind":"distro","x":86,"y":46,"label":"Delay distro"},{"id":"l1","kind":"loadin","x":50,"y":51,"label":"Freight south"},{"id":"i1","kind":"ingress","x":6,"y":34,"label":"West stair"},{"id":"e1","kind":"egress","x":94,"y":29,"label":"East"},{"id":"s1","kind":"stage","x":40,"y":16,"w":34,"h":12,"label":"Keynote"},{"id":"t1","kind":"seat","x":50,"y":34,"w":48,"h":16,"label":"Theatre"},{"id":"h1","kind":"hold","x":12,"y":14,"w":14,"h":10,"label":"Green"}]'
),
(
  'Atlantic Ave plaza',
  'Atlantic Ave plaza',
  true,
  'Brand village, three LED totems, RF pack. Street load-in off Atlantic. Arena wall is a hard hold.',
  '{"w":100,"h":62,"shell":{"x":6,"y":6,"w":88,"h":50},"rooms":[{"x":70,"y":6,"w":24,"h":50,"label":"Arena wall"}],"stage":{"x":18,"y":16,"w":22,"h":14,"label":"Activation"},"docks":[{"x":6,"y":44,"w":16,"h":12,"label":"Street"}],"doors":[{"x":6,"y":18,"w":4,"h":14,"kind":"ingress","label":"Atlantic"},{"x":48,"y":54,"w":16,"h":2,"kind":"egress","label":"Flatbush"}]}',
  '[{"id":"p1","kind":"power","x":14,"y":24,"label":"Pedestal 200A"},{"id":"d1","kind":"distro","x":16,"y":48,"label":"Street distro"},{"id":"l1","kind":"loadin","x":14,"y":50,"label":"Street"},{"id":"i1","kind":"ingress","x":8,"y":25,"label":"Atlantic"},{"id":"e1","kind":"egress","x":56,"y":54,"label":"Flatbush"},{"id":"s1","kind":"stage","x":29,"y":23,"w":20,"h":12,"label":"Activation"},{"id":"t1","kind":"seat","x":42,"y":36,"w":28,"h":16,"label":"Village"},{"id":"h1","kind":"hold","x":82,"y":30,"w":20,"h":36,"label":"Arena wall"}]'
)
) as v(name, venue, template, notes, layout, marks)
where not exists (select 1 from floor_plans f where f.venue = v.venue and f.name = v.name);
