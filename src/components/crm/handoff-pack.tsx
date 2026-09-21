import { Badge } from "@/components/ui/badge";
import type { HandoffPack } from "@/lib/crm/handoff";
import { formatDate, formatDateTime } from "@/lib/utils";

export function PackBody({ pack }: { pack: HandoffPack }) {
  const gear = pack.gear ?? [];
  const findings = pack.findings ?? [];
  const guests = pack.guests ?? [];
  const marks = pack.floor?.marks ?? [];
  return (
    <div className="space-y-4 text-sm">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{pack.title}</h2>
        <p className="mt-1 text-muted-foreground">
          {[
            pack.venue,
            pack.eventDate ? formatDate(pack.eventDate) : null,
            pack.loadIn ? `load-in ${pack.loadIn}` : null,
            pack.indoor == null ? null : pack.indoor ? "indoor" : "outdoor",
            pack.guestCount != null ? `${pack.guestCount} pax` : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
      {pack.notes && <p className="rounded-lg bg-muted/70 px-3 py-2 text-muted-foreground">{pack.notes}</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        {pack.org && (
          <section>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Venue / org</p>
            <p className="mt-1 font-medium">{pack.org.name}</p>
            <p className="text-muted-foreground">{[pack.org.address, pack.org.city].filter(Boolean).join(", ")}</p>
            {pack.org.phone && <p className="text-muted-foreground">{pack.org.phone}</p>}
          </section>
        )}
        {pack.person && (
          <section>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Show contact</p>
            <p className="mt-1 font-medium">{pack.person.name}</p>
            <p className="text-muted-foreground">{[pack.person.title, pack.person.phone].filter(Boolean).join(" · ")}</p>
            {pack.person.email && <p className="text-muted-foreground">{pack.person.email}</p>}
          </section>
        )}
      </div>
      {pack.floor && (
        <section>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Floor plot</p>
          <p className="mt-1 font-medium">{pack.floor.name}</p>
          {pack.floor.notes && <p className="mt-1 text-muted-foreground">{pack.floor.notes}</p>}
          {marks.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {marks.map((m, i) => (
                <li key={`${m.label}-${i}`}>
                  <Badge variant={m.kind === "hold" ? "danger" : m.kind === "power" || m.kind === "egress" ? "warn" : "outline"}>
                    {m.label}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
      {pack.crew.length > 0 && (
        <section>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Crew · no rates</p>
          <ul className="mt-1 divide-y divide-border">
            {pack.crew.map((c, i) => (
              <li key={`${c.name}-${i}`} className="flex flex-wrap items-center gap-2 py-1.5">
                <span className="font-medium">{c.name}</span>
                <Badge variant="outline">{c.role}</Badge>
                <Badge variant="steel">{c.kind}</Badge>
                <span className="text-xs text-muted-foreground">
                  {c.startsAt ? formatDateTime(c.startsAt) : ""}
                  {c.endsAt ? ` – ${formatDateTime(c.endsAt)}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {gear.length > 0 && (
        <section>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Gear · no prices</p>
          <ul className="mt-1 divide-y divide-border">
            {gear.map((g, i) => (
              <li key={`${g.name}-${i}`} className="flex flex-wrap items-center gap-2 py-1.5">
                <span className="font-medium">
                  {g.qty}× {g.name}
                </span>
                <Badge variant="outline">{g.category}</Badge>
              </li>
            ))}
          </ul>
        </section>
      )}
      {guests.length > 0 && (
        <section>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Guests · no emails</p>
          <ul className="mt-1 divide-y divide-border">
            {guests.map((g, i) => (
              <li key={`${g.name}-${i}`} className="flex flex-wrap items-center gap-2 py-1.5">
                <span className="font-medium">{g.name}</span>
                <Badge variant="outline">party {g.party}</Badge>
                <Badge variant={g.rsvp === "yes" ? "success" : g.rsvp === "no" ? "danger" : "steel"}>{g.rsvp}</Badge>
                {g.meal && <span className="text-xs text-muted-foreground">{g.meal}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
      {pack.files.length > 0 && (
        <section>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Files</p>
          <ul className="mt-1 space-y-1">
            {pack.files.map((f) => (
              <li key={f.name} className="text-muted-foreground">
                {f.name} <span className="text-xs">({f.kind})</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {pack.notesList.length > 0 && (
        <section>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Production notes</p>
          <ul className="mt-1 space-y-2">
            {pack.notesList.map((n, i) => (
              <li key={i}>
                <Badge variant="outline">{n.category}</Badge>
                <p className="mt-1 text-muted-foreground">{n.body}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
      {findings.length > 0 && (
        <section>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Prep flags</p>
          <ul className="mt-1 space-y-2">
            {findings.map((f, i) => (
              <li key={i}>
                <Badge variant={f.severity === "risk" ? "danger" : "warn"}>{f.kind}</Badge>
                <p className="mt-1 text-muted-foreground">{f.detail}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
