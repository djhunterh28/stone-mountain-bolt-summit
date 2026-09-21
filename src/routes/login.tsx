import { useState, type FormEvent } from "react";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { checkEmailGate, issueOtp, verifyOtp } from "@/lib/portal/server";
import { getPortalBrand } from "@/lib/portal/brand";
import { HurricaneLogo } from "@/components/portal/hp-mark";

export const Route = createFileRoute("/login")({ component: Login });

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="currentColor"
        d="M21.6 12.23c0-.74-.07-1.45-.19-2.13H12v4.04h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.98-4.33 2.98-7.43Z"
        opacity="0.9"
      />
      <path
        fill="currentColor"
        d="M12 22c2.7 0 4.96-.9 6.62-2.34l-3.24-2.5c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.58-4.12H3.07v2.58A10 10 0 0 0 12 22Z"
        opacity="0.7"
      />
      <path
        fill="currentColor"
        d="M6.42 13.99A6.01 6.01 0 0 1 6.1 12c0-.69.12-1.36.32-1.99V7.43H3.07A10 10 0 0 0 2 12c0 1.61.39 3.14 1.07 4.57l3.35-2.58Z"
        opacity="0.55"
      />
      <path
        fill="currentColor"
        d="M12 5.88c1.47 0 2.79.5 3.82 1.5l2.86-2.86C16.95 2.9 14.7 2 12 2A10 10 0 0 0 3.07 7.43l3.35 2.58C7.2 7.64 9.4 5.88 12 5.88Z"
        opacity="0.75"
      />
    </svg>
  );
}

function XMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="currentColor"
        d="M14.7 10.35 21.2 3h-1.54l-5.66 6.4L9.47 3H3.5l6.82 9.7L3.5 21h1.54l5.97-6.75L14.53 21h5.97l-5.8-10.65Zm-2.11 2.39-.7-1-5.5-7.86h2.37l4.45 6.36.69 1 5.78 8.26h-2.37l-4.72-6.76Z"
      />
    </svg>
  );
}

function Login() {
  const { user, isPending } = useCurrentUserState();
  const portalMode =
    typeof window !== "undefined" &&
    (new URLSearchParams(window.location.search).get("portal") === "1" ||
      window.location.hostname.startsWith("portal."));
  const brand = useQuery({ queryKey: ["portal-brand"], queryFn: () => getPortalBrand(), enabled: portalMode });
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

  async function onSocial(providerId: string) {
    if (!authEnabled) return;
    setError(null);
    setBusy(providerId);
    try {
      await signIn(providerId, { callbackURL: "/home", errorCallbackURL: "/login" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
      setBusy("idle");
    }
  }

  return (
    <main className="grid min-h-dvh bg-background lg:grid-cols-[1.05fr_0.95fr]">
      <aside className="relative hidden overflow-hidden border-r border-border bg-sidebar px-12 py-12 lg:flex lg:flex-col">
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
            {["Encrypted workspace session", "Google, X, or company email", "Idle lock still sits on top of sign-in"].map(
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
              ? "Email is the username. Google sign-in is one click. Forgot password lives below."
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

              <div className="my-6 flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">or</span>
                <Separator className="flex-1" />
              </div>

              <div className="space-y-2">
                {GROK_PROVIDERS.map((p) => (
                  <Button
                    key={p.providerId}
                    type="button"
                    variant="secondary"
                    className="h-11 w-full"
                    disabled={busy !== "idle"}
                    onClick={() => void onSocial(p.providerId)}
                  >
                    {p.label === "Google" ? <GoogleMark /> : <XMark />}
                    Continue with {p.label}
                  </Button>
                ))}
              </div>

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
