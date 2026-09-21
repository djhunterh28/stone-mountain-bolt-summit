import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitContact } from "@/lib/portal/server";

export const Route = createFileRoute("/contact")({ component: ContactPage });

function ContactPage() {
  const [done, setDone] = useState(false);
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await submitContact({
      data: {
        name: String(fd.get("name")),
        email: String(fd.get("email")),
        message: String(fd.get("message")),
      },
    });
    setDone(true);
  }
  return (
    <main className="mx-auto min-h-dvh max-w-md px-5 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Contact the shop</h1>
      <p className="mt-2 text-sm text-muted-foreground">Entries sync into the CRM contact book.</p>
      {done ? (
        <p className="mt-6 text-sm">Received. An AE will reply from the house mailbox.</p>
      ) : (
        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          <Input name="name" placeholder="Name" required />
          <Input name="email" type="email" placeholder="Email" required />
          <Textarea name="message" rows={5} placeholder="Message" required />
          <Button type="submit" className="w-full">
            Send
          </Button>
        </form>
      )}
    </main>
  );
}
