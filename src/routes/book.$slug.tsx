import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSchedulerBySlug } from "@/lib/crm/ultimate";
import { bookSlot } from "@/lib/crm/server";

export const Route = createFileRoute("/book/$slug")({ component: PublicBook });

function PublicBook() {
  const { slug } = Route.useParams();
  const link = useQuery({ queryKey: ["book", slug], queryFn: () => getSchedulerBySlug({ data: { slug } }) });
  const [done, setDone] = useState<{
    zoomJoinUrl?: string | null;
    zoomPasscode?: string | null;
    hostName?: string;
    startsAt?: string;
    confirmationSent?: boolean;
  } | null>(null);
  const l = link.data;

  return (
    <div className="mx-auto min-h-dvh max-w-lg px-5 py-12">
      <div className="mb-8 flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="size-6 text-primary" aria-hidden>
          <rect x="4" y="5" width="3.2" height="14" rx="0.6" fill="currentColor" />
          <rect x="9.4" y="8" width="3.2" height="11" rx="0.6" fill="currentColor" opacity="0.7" />
          <rect x="14.8" y="3" width="3.2" height="16" rx="0.6" fill="currentColor" />
        </svg>
        <span className="text-sm font-semibold">Northline</span>
      </div>
      {!l && <p className="text-sm text-muted-foreground">{link.isLoading ? "Loading…" : "Link not found."}</p>}
      {l && !done && (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            void bookSlot({
              data: {
                linkId: l.id,
                guestName: String(fd.get("guestName") || "Guest"),
                guestEmail: String(fd.get("guestEmail") || "guest@example.com"),
                startsAt: new Date(String(fd.get("startsAt"))).toISOString(),
                notes: String(fd.get("notes") || "") || undefined,
              },
            }).then((r) => {
              setDone(r);
              toast.success("Booked");
            });
          }}
        >
          <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
            {l.source === "calendly" ? "Calendly · Northline" : "Northline scheduler"}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">{l.name}</h1>
          <p className="text-sm text-muted-foreground">
            {l.memberName} · {l.durationMin} minutes. A Zoom link and confirmation land in your inbox.
          </p>
          <div className="space-y-1">
            <Label htmlFor="guestName">Your name</Label>
            <Input id="guestName" name="guestName" required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="guestEmail">Email</Label>
            <Input id="guestEmail" name="guestEmail" type="email" required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="startsAt">When</Label>
            <Input id="startsAt" name="startsAt" type="datetime-local" required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="notes">Venue / notes</Label>
            <Input id="notes" name="notes" />
          </div>
          <Button type="submit">Confirm booking</Button>
          {l.calendlyUrl && (
            <p className="text-xs text-muted-foreground">
              Prefer Calendly?{" "}
              <a className="underline-offset-4 hover:underline" href={l.calendlyUrl} target="_blank" rel="noreferrer">
                Open {l.memberName}'s Calendly
              </a>
            </p>
          )}
        </form>
      )}
      {done && (
        <div>
          <h1 className="text-2xl font-semibold">You are on the calendar.</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {done.confirmationSent
              ? "A confirmation is in your inbox, including the Zoom join link."
              : "Your host will send the call details."}{" "}
            If load-in is this week, call the Gowanus shop.
          </p>
          {done.zoomJoinUrl && (
            <p className="mt-4 text-sm">
              Zoom:{" "}
              <a className="underline-offset-4 hover:underline" href={done.zoomJoinUrl} target="_blank" rel="noreferrer">
                Join meeting
              </a>
              {done.zoomPasscode ? ` · passcode ${done.zoomPasscode}` : ""}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
