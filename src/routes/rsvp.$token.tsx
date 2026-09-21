import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { setRsvp } from "@/lib/crm/ops";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/rsvp/$token")({ component: RsvpPage });

function RsvpPage() {
  const { token } = Route.useParams();
  const [done, setDone] = useState<string | null>(null);
  if (done) {
    return (
      <main className="mx-auto max-w-md px-6 py-16">
        <h1 className="text-xl font-medium">Thanks, {done}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your RSVP is with the production desk.</p>
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">Northline guest list</p>
      <h1 className="mt-2 text-xl font-medium">Will you be there?</h1>
      <form
        className="mt-6 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          void setRsvp({ data: { token, rsvp: String(fd.get("rsvp")), meal: String(fd.get("meal") || "") || undefined } }).then((r) => {
            if (r.ok) setDone(r.name);
          });
        }}
      >
        <select name="rsvp" className="h-10 w-full rounded-md border border-input bg-background px-2" defaultValue="yes">
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="pending">Not sure</option>
        </select>
        <select name="meal" className="h-10 w-full rounded-md border border-input bg-background px-2">
          <option value="fish">Fish</option>
          <option value="veg">Vegetarian</option>
          <option value="meat">Meat</option>
        </select>
        <Button type="submit">Send RSVP</Button>
      </form>
    </main>
  );
}
