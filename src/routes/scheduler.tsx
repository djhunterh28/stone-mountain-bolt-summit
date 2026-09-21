import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { bookSlot, getBootstrap, listScheduler } from "@/lib/crm/server";
import {
  connectScheduler,
  createZoomMeeting,
  getSchedulingDesk,
  resendConfirmation,
  syncCalendly,
  syncScheduler,
  toggleConnection,
  type ScheduleProvider,
} from "@/lib/crm/schedule";
import { listCalendarAccounts } from "@/lib/crm/governance";
import { formatDateTime } from "@/lib/utils";
import { useUi } from "@/lib/crm/store";

export const Route = createFileRoute("/scheduler")({ component: SchedulerPage });

function SchedulerPage() {
  const data = useQuery({ queryKey: ["scheduler"], queryFn: () => listScheduler() });
  const desk = useQuery({ queryKey: ["scheduling-desk"], queryFn: () => getSchedulingDesk() });
  const cals = useQuery({ queryKey: ["calendar-accounts"], queryFn: () => listCalendarAccounts() });
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const qc = useQueryClient();
  const memberId = useUi((s) => s.memberId);
  const [linkId, setLinkId] = useState<number | null>(null);

  function refresh() {
    qc.invalidateQueries({ queryKey: ["scheduler"] });
    qc.invalidateQueries({ queryKey: ["scheduling-desk"] });
    qc.invalidateQueries({ queryKey: ["activities"] });
    qc.invalidateQueries({ queryKey: ["emails"] });
    qc.invalidateQueries({ queryKey: ["notifications"] });
  }

  const bookings = desk.data?.bookings ?? [];
  const connections = desk.data?.connections ?? [];
  const types = desk.data?.types ?? [];
  const members = boot.data?.members ?? [];

  return (
    <div className="pb-12">
      <PageHeader
        title="Scheduler"
        subtitle="Calendly, Zoom, and confirmation mail on the same consults that land in the pipeline."
      />
      <div className="px-4 sm:px-6">
        <Tabs defaultValue="bookings">
          <TabsList className="flex h-auto flex-wrap">
            <TabsTrigger value="bookings">Upcoming</TabsTrigger>
            <TabsTrigger value="links">Booking links</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="mt-4 space-y-4">
            {linkId && (
              <BookForm
                linkId={linkId}
                onCancel={() => setLinkId(null)}
                onSaved={() => {
                  setLinkId(null);
                  refresh();
                }}
              />
            )}
            <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
              {bookings.length === 0 && <li className="px-4 py-6 text-sm text-muted-foreground">No consults on the books.</li>}
              {bookings.map((b) => (
                <li key={b.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">{b.guestName}</span>
                      {b.source === "calendly" && <Badge variant="steel">Calendly</Badge>}
                      {b.confirmationSentAt && <Badge variant="success">emailed</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {b.linkName} · {b.hostName} · {formatDateTime(b.startsAt)} · {b.durationMin} min
                    </p>
                    <p className="text-xs text-muted-foreground">{b.guestEmail}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {b.zoomJoinUrl ? (
                      <Button size="sm" variant="secondary" asChild>
                        <a href={b.zoomJoinUrl} target="_blank" rel="noreferrer">
                          Zoom
                        </a>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          createZoomMeeting({ data: { id: b.id } }).then((r) => {
                            if (r.ok) toast.success("Zoom meeting created");
                            refresh();
                          })
                        }
                      >
                        Create Zoom
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        resendConfirmation({ data: { id: b.id } }).then((r) => {
                          toast.success(r.confirmationSent ? "Confirmation resent" : "Logged");
                          refresh();
                        })
                      }
                    >
                      Resend
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="links" className="mt-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {(data.data?.links ?? []).map((l) => (
                <article key={l.id} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-sm font-medium">{l.name}</h2>
                    <Badge variant="outline">{l.source === "calendly" ? "Calendly" : l.source === "tidycal" ? "TidyCal" : l.source === "acuity" ? "Acuity" : "Northline"}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {l.memberName} · {l.durationMin} min · {l.bookings} bookings · Zoom
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setLinkId(l.id)}>
                      Book a slot
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <Link to="/book/$slug" params={{ slug: l.slug }}>
                        Public link
                      </Link>
                    </Button>
                    {l.calendlyUrl && (
                      <Button size="sm" variant="ghost" asChild>
                        <a href={l.calendlyUrl} target="_blank" rel="noreferrer">
                          Open {l.source === "tidycal" ? "TidyCal" : l.source === "acuity" ? "Acuity" : "Calendly"}
                        </a>
                      </Button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="connections" className="mt-4 space-y-6">
            <p className="text-sm text-muted-foreground">
              Each AE connects Calendly, TidyCal, Acuity, or Zoom. Bookings inherit the host's Zoom room and send confirmation mail from their address.
            </p>
            <ConnectForm members={members} defaultMemberId={memberId} onSaved={refresh} />
            <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
              {connections.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">{c.memberName}</span>
                      <Badge variant={c.provider === "calendly" ? "steel" : "outline"}>{c.provider}</Badge>
                      <Badge variant={c.connected ? "success" : "warn"}>{c.connected ? "live" : "off"}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {c.handle} {c.tokenHint ? `· ${c.tokenHint}` : ""} · last sync {c.lastSync ? formatDateTime(c.lastSync) : "never"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {c.provider !== "zoom" && c.connected && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          (c.provider === "calendly"
                            ? syncCalendly({ data: { memberId: c.memberId } })
                            : syncScheduler({ data: { memberId: c.memberId, provider: c.provider } })
                          ).then((r) => {
                            if (!r.ok) toast.error(r.error);
                            else toast.success(r.pulled ? `Pulled ${r.pulled} booking` : "Event types in sync");
                            refresh();
                          })
                        }
                      >
                        Sync
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleConnection({ data: { id: c.id, autoZoom: !c.autoZoom } }).then(refresh)}
                    >
                      {c.autoZoom ? "Zoom on" : "Zoom off"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleConnection({ data: { id: c.id, confirmEmail: !c.confirmEmail } }).then(refresh)}
                    >
                      {c.confirmEmail ? "Email on" : "Email off"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleConnection({ data: { id: c.id, connected: !c.connected } }).then(refresh)}
                    >
                      {c.connected ? "Disconnect" : "Reconnect"}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            {types.length > 0 && (
              <section>
                <h2 className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">Booking event types</h2>
                <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
                  {types.map((t) => (
                    <li key={t.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                      <span>
                        {t.name}
                        <span className="ml-2 text-xs text-muted-foreground">{t.durationMin} min</span>
                      </span>
                      <a className="text-xs text-muted-foreground underline-offset-4 hover:underline" href={t.calendlyUrl} target="_blank" rel="noreferrer">
                        {t.calendlyUrl.replace("https://", "")}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <section>
              <h2 className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">Synced calendars</h2>
              <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
                {(cals.data ?? []).map((a) => (
                  <li key={a.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                    <span>
                      {a.memberName}
                      <span className="ml-2 text-xs text-muted-foreground">
                        {a.provider} · {a.address}
                      </span>
                    </span>
                    <Badge variant={a.synced ? "success" : "outline"}>{a.twoWay ? "two-way" : "pull"}</Badge>
                  </li>
                ))}
              </ul>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function BookForm({ linkId, onCancel, onSaved }: { linkId: number; onCancel: () => void; onSaved: () => void }) {
  return (
    <form
      className="space-y-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:max-w-md"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        void bookSlot({
          data: {
            linkId,
            guestName: String(fd.get("guestName") || "Guest"),
            guestEmail: String(fd.get("guestEmail") || "guest@example.com"),
            startsAt: new Date(String(fd.get("startsAt"))).toISOString(),
            notes: String(fd.get("notes") || "") || undefined,
          },
        }).then((r) => {
          toast.success(r.zoomJoinUrl ? "Booked · Zoom + confirmation sent" : "Booked · confirmation sent");
          onSaved();
        });
      }}
    >
      <h3 className="text-sm font-medium">New booking</h3>
      <Input name="guestName" placeholder="Guest name" required />
      <Input name="guestEmail" type="email" placeholder="Email" required />
      <Input name="startsAt" type="datetime-local" required />
      <Input name="notes" placeholder="Notes" />
      <div className="flex gap-2">
        <Button type="submit">Confirm</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function ConnectForm({
  members,
  defaultMemberId,
  onSaved,
}: {
  members: { id: number; name: string }[];
  defaultMemberId: number;
  onSaved: () => void;
}) {
  const [provider, setProvider] = useState<ScheduleProvider>("calendly");
  const placeholder =
    provider === "zoom"
      ? "you@northline.av"
      : provider === "tidycal"
        ? "tidycal.com/you"
        : provider === "acuity"
          ? "you.acuityscheduling.com"
          : "calendly.com/you";
  return (
    <form
      className="grid gap-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:grid-cols-4"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        void connectScheduler({
          data: {
            memberId: Number(fd.get("memberId") || defaultMemberId),
            provider,
            handle: String(fd.get("handle") || ""),
          },
        }).then((r) => {
          if (!r.ok) toast.error(r.error);
          else toast.success(`${provider} connected`);
          onSaved();
        });
      }}
    >
      <select name="memberId" className="h-9 rounded-md border border-input bg-background px-2 text-sm" defaultValue={defaultMemberId}>
        {members.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
      <select
        className="h-9 rounded-md border border-input bg-background px-2 text-sm"
        value={provider}
        onChange={(e) => setProvider(e.target.value as ScheduleProvider)}
      >
        <option value="calendly">Calendly</option>
        <option value="tidycal">TidyCal</option>
        <option value="acuity">Acuity</option>
        <option value="zoom">Zoom</option>
      </select>
      <Input name="handle" placeholder={placeholder} required />
      <Button type="submit" size="sm">
        Connect
      </Button>
    </form>
  );
}
