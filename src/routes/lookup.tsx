import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { issueOtp, lookupDocument } from "@/lib/portal/server";

export const Route = createFileRoute("/lookup")({ component: LookupPage });

function LookupPage() {
  const [mode, setMode] = useState<"id" | "email">("id");
  const [lookupId, setLookupId] = useState("NL-1");
  const [password, setPassword] = useState("sign1");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [demo, setDemo] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const r = await lookupDocument({
      data: {
        lookupId,
        password,
        email: mode === "email" ? email : undefined,
        otp: mode === "email" ? otp : undefined,
      },
    });
    if (!r.ok) setError(r.error);
    else setResult(`${r.name} · ${r.status} · id ${r.id}`);
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5">
      <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">esign lookup</p>
      <h1 className="mt-2 text-xl font-semibold tracking-tight">Find a document</h1>
      <p className="mt-1 text-sm text-muted-foreground">Document ID + password, or email + OTP + password.</p>
      <div className="mt-4 flex gap-2">
        <Button size="sm" variant={mode === "id" ? "secondary" : "ghost"} onClick={() => setMode("id")}>
          Document ID
        </Button>
        <Button size="sm" variant={mode === "email" ? "secondary" : "ghost"} onClick={() => setMode("email")}>
          Email + OTP
        </Button>
      </div>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        {mode === "email" && (
          <>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <div className="flex gap-2">
              <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="OTP" />
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  issueOtp({ data: { email, purpose: "lookup" } }).then((r) => {
                    if (r.ok) setDemo(r.demoCode);
                  })
                }
              >
                Send
              </Button>
            </div>
            {demo && <p className="text-sm text-muted-foreground">Workspace code {demo}</p>}
          </>
        )}
        <div className="space-y-1.5">
          <Label>Document ID</Label>
          <Input value={lookupId} onChange={(e) => setLookupId(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Password</Label>
          <Input value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" className="w-full">
          Lookup
        </Button>
      </form>
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      {result && (
        <p className="mt-3 text-sm">
          {result}{" "}
          <Link to="/sign/$docId" params={{ docId: result.split("id ")[1] ?? "1" }} className="underline">
            Open
          </Link>
        </p>
      )}
    </main>
  );
}
