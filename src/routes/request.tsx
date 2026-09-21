import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitEventRequest } from "@/lib/portal/server";

export const Route = createFileRoute("/request")({ component: RequestPage });

function RequestPage() {
  const [done, setDone] = useState(false);
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await submitEventRequest({
      data: {
        name: String(fd.get("name")),
        email: String(fd.get("email")),
        eventDate: String(fd.get("date") || "") || undefined,
        venue: String(fd.get("venue") || "") || undefined,
        guests: Number(fd.get("guests") || 0) || undefined,
        notes: String(fd.get("notes") || "") || undefined,
      },
    });
    setDone(true);
  }
  return (
    <main className="mx-auto min-h-dvh max-w-md px-5 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Event request</h1>
      <p className="mt-2 text-sm text-muted-foreground">From the marketing site into the admin queue, then Pipedrive.</p>
      {done ? (
        <p className="mt-6 text-sm">Logged. Production will review the date hold.</p>
      ) : (
        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          <Input name="name" placeholder="Name" required />
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="date" type="date" />
          <Input name="venue" placeholder="Venue" />
          <Input name="guests" type="number" placeholder="Guests" />
          <Textarea name="notes" rows={4} placeholder="Notes" />
          <Button type="submit" className="w-full">
            Submit request
          </Button>
        </form>
      )}
    </main>
  );
}
