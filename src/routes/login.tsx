import { useState, type FormEvent } from "react";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { authClient, authEnabled } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { checkEmailGate, issueOtp, verifyOtp } from "@/lib/portal/server";
import { getPortalBrand } from "@/lib/portal/brand";
import { HurricaneLogo } from "@/components/portal/hp-mark";
import { DEMO_EMAIL, DEMO_PASSWORD, ensureDemoAccount } from "@/lib/crm/demo-account";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  const portalMode =
    typeof window !== "undefined" &&
    (new URLSearchParams(window.location.search).get("portal") === "1" ||
      window.location.hostname.startsWith("portal."));
  const brand = useQuery({ queryKey: ["portal-brand"], queryFn: () => getPortalBrand(), enabled: portalMode });
  const demo = useQuery({ queryKey: ["demo-account"], queryFn: () => ensureDemoAccount(), enabled: authEnabled });
  const b = brand.data;
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState<string | null>(null);
  const [busy, setBusy] = useState<"idle" | "email" | string>("idle");
  const [error, setError] = useState<string | null>(null);

  if (isPending) {
    return (
      <main className="grid min-h-dvh lg:grid-cols-[1.05fr_0.95fr]">
        <aside className="hidden bg-sidebar lg:block" />
        <section className="flex items-center justify-center px-6">
          <div className="w-full max-w-sm space-y-3">
            <div className="h-7 w-40 animate-pulse rounded-md bg-muted" />
            <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
            <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
            <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
          </div>
        </section>
      </main>
    );
  }

  if (user) return <Navigate to="/home" />;

  async function onEmailSubmit(e: FormEvent) {
    e.preventDefault();
    if (!authEnabled) return;
    setError(null);
    setBusy("email");
    try {
      if (mode === "up") {
        const gate = await checkEmailGate({ data: { email: email.trim() } });
        if (!gate.ok) throw new Error("This email is not in the Pipedrive contact book.");
        if (!otpSent) {
          const sent = await issueOtp({ data: { email: email.trim(), purpose: "register" } });
          if (!sent.ok) throw new Error("Could not send a verification code.");
          setOtpSent(sent.demoCode);
          setBusy("idle");
          return;
        }
        const v = await verifyOtp({ data: { email: email.trim(), code: otp, purpose: "register" } });
        if (!v.ok) throw new Error(v.error ?? "Invalid code.");
        const { error: err } = await authClient.signUp.email({
          name: name.trim() || email.split("@")[0] || "Northline",
          email: email.trim(),
          password,
          callbackURL: "/home",
        });
        if (err) throw new Error(err.message ?? "Could not create account");
      } else {
        const { error: err } = await authClient.signIn.email({
          email: email.trim(),
          password,
          callbackURL: "/home",
        });
        if (err) throw new Error(err.message ?? "Could not sign in");
      }
      await authClient.getSession().catch(() => undefined);
      window.location.assign("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
      setBusy("idle");
    }
  }

  return (
    <main className="grid min-h-dvh bg-background lg:grid-cols-[1.05fr_0.95fr]">
      <aside className="nl-brand-panel relative hidden overflow-hidden px-12 py-12 lg:flex lg:flex-col">
        <div className="flex items-center gap-2.5">
          {portalMode ? (
            <>
              <HurricaneLogo className="size-9" />
              <span className="text-sm font-semibold tracking-tight text-foreground">{b?.company ?? "Hurricane Productions"}</span>
            </>
          ) : (
            <>
              <HurricaneLogo className="size-9" />
              <span className="text-sm font-semibold tracking-tight text-foreground">Hurricane</span>
            </>
          )}
        </div>
        <div className="relative z-10 mt-auto max-w-md pb-8">
          <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            {portalMode ? "Client portal" : "Registered access"}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance">
            {portalMode ? (b?.tagline ?? "Stop Quoting. Start Partnering.") : "The house CRM for live event production."}
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {portalMode
              ? `Your files, approvals, and signatures on ${b?.portalHost ?? "portal.hurricaneproductionsllc.com"}. Not a vendor subdomain.`
              : "Pipeline, labor, and show files stay behind a signed-in session. Public booking, web forms, and e-sign links remain open for clients."}
          </p>
          <ul className="mt-8 grid gap-2 text-sm text-muted-foreground">
            {["Encrypted workspace session", "Company email and password", "Idle lock still sits on top of sign-in"].map(
              (line) => (
                <li key={line} className="flex items-center gap-2">
                  <span className="size-1 rounded-full bg-primary" />
                  {line}
                </li>
              ),
            )}
          </ul>
        </div>
        <HurricaneLogo className="pointer-events-none absolute -right-8 -bottom-8 size-72 opacity-10" alt="" />
      </aside>

      <section className="flex items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            {portalMode ? (
              <>
                <HurricaneLogo className="size-8" />
                <span className="text-sm font-semibold text-foreground">{b?.company ?? "Hurricane Productions"}</span>
              </>
            ) : (
              <>
                <HurricaneLogo className="size-8" />
                <span className="text-sm font-semibold text-foreground">Hurricane</span>
              </>
            )}
          </div>
          <h2 className="text-xl font-semibold tracking-tight">
            {mode === "in" ? "Sign in" : "Create account"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "in"
              ? "Email is the username. Forgot password lives below."
              : "Pipedrive contacts only. We email a one-time code, then you set a password."}
          </p>

          {!authEnabled ? (
            <p className="mt-6 text-sm text-muted-foreground">Sign-in is disabled.</p>
          ) : (
            <>
              <form className="mt-6 space-y-3" onSubmit={onEmailSubmit}>
                {mode === "up" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      name="name"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Dana Okonkwo"
                    />
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label htmlFor="email">Work email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@northline.av"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={mode === "in" ? "current-password" : "new-password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                  />
                </div>
                {mode === "up" && otpSent && (
                  <div className="space-y-1.5">
                    <Label htmlFor="otp">One-time code</Label>
                    <Input id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6 digits" required />
                    <p className="text-xs text-muted-foreground">Workspace verification code: {otpSent}</p>
                  </div>
                )}
                {mode === "in" && (
                  <p className="text-right text-xs">
                    <Link to="/forgot" className="text-muted-foreground hover:underline">
                      Forgot password
                    </Link>
                  </p>
                )}
                {error && (
                  <p className="text-sm text-destructive" role="alert">
                    {error}
                  </p>
                )}
                <Button type="submit" className="h-11 w-full" disabled={busy !== "idle"}>
                  {busy === "email"
                    ? mode === "in"
                      ? "Signing in…"
                      : "Creating account…"
                    : mode === "in"
                      ? "Sign in"
                      : otpSent
                        ? "Verify and create account"
                        : "Send verification code"}
                </Button>
              </form>

              {mode === "in" && (
                <div className="mt-4 rounded-xl bg-muted px-3 py-3 text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">Demo / testing</p>
                  <p className="mt-1 font-mono text-[12px] text-foreground">
                    {DEMO_EMAIL}
                    <br />
                    {DEMO_PASSWORD}
                  </p>
                  <p className="mt-1">{demo.isSuccess ? "Account is ready on this workspace." : "Provisioning demo seat…"}</p>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="mt-2"
                    disabled={busy !== "idle"}
                    onClick={() => {
                      setEmail(DEMO_EMAIL);
                      setPassword(DEMO_PASSWORD);
                    }}
                  >
                    Fill demo login
                  </Button>
                </div>
              )}

              <p className="mt-6 text-sm text-muted-foreground">
                {mode === "in" ? "New to the shop?" : "Already registered?"}{" "}
                <button
                  type="button"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                  onClick={() => {
                    setMode(mode === "in" ? "up" : "in");
                    setError(null);
                  }}
                >
                  {mode === "in" ? "Create an account" : "Sign in"}
                </button>
              </p>
            </>
          )}

          <p className="mt-10 text-xs leading-relaxed text-muted-foreground">
            Public RFPs stay on{" "}
            <Link to="/f/$slug" params={{ slug: "site-survey" }} className="underline-offset-4 hover:underline">
              web forms
            </Link>
            . A signed-in session is required for pipeline, contacts, and security.
          </p>
        </div>
      </section>
    </main>
  );
}
