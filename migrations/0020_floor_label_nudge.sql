-- Nudge Cipriani marks so house labels do not sit on top of zone titles.
update floor_plans
set marks = '[{"id":"p1","kind":"power","x":24,"y":20,"label":"House 200A"},{"id":"d1","kind":"distro","x":24,"y":50,"label":"400A distro"},{"id":"p2","kind":"power","x":86,"y":18,"label":"Lex wall"},{"id":"l1","kind":"loadin","x":11,"y":52,"label":"Dock 47th"},{"id":"i1","kind":"ingress","x":51,"y":57,"label":"42nd"},{"id":"e1","kind":"egress","x":94,"y":30,"label":"Lex"},{"id":"s1","kind":"stage","x":50,"y":9,"w":40,"h":10,"label":"LED wall"},{"id":"t1","kind":"seat","x":50,"y":32,"w":54,"h":22,"label":"Rounds"},{"id":"h1","kind":"hold","x":11,"y":16,"w":14,"h":12,"label":"Green hold"}]'
where venue = 'Cipriani 42nd Street' and template = true;
