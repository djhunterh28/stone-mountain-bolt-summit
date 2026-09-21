import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { issueOtp, resetPasswordWithOtp } from "@/lib/portal/server";

export const Route = createFileRoute("/forgot")({ component: ForgotPage });

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"email" | "reset">("email");
  const [demo, setDemo] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onEmail(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const r = await issueOtp({ data: { email, purpose: "reset" } });
    setBusy(false);
    if (r.ok) {
      setDemo(r.demoCode);
      setStep("reset");
    } else setMsg("Could not send a code.");
  }

  async function onReset(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const r = await resetPasswordWithOtp({ data: { email, code, password } });
    setBusy(false);
    if (r.ok) setMsg("Password updated. You can sign in.");
    else setMsg("error" in r ? r.error : "Reset failed");
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-5">
      <h1 className="text-xl font-semibold tracking-tight">Reset password</h1>
      <p className="mt-1 text-sm text-muted-foreground">Email is the only username. We send a one-time code.</p>
      {step === "email" ? (
        <form className="mt-6 space-y-3" onSubmit={onEmail}>
          <div className="space-y-1.5">
            <Label htmlFor="email">Work email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            Send code
          </Button>
        </form>
      ) : (
        <form className="mt-6 space-y-3" onSubmit={onReset}>
          {demo && <p className="rounded-md bg-muted px-3 py-2 text-sm">Workspace code: {demo}</p>}
          <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="6-digit code" required />
          <Input type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" required />
          <Button type="submit" className="w-full" disabled={busy}>
            Update password
          </Button>
        </form>
      )}
      {msg && <p className="mt-3 text-sm">{msg}</p>}
      <Link to="/login" className="mt-6 text-sm text-muted-foreground hover:underline">
        Back to sign in
      </Link>
    </main>
  );
}
