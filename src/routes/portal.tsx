import { useState } from "react";
import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { HpMark } from "@/components/portal/hp-mark";
import { getPortalBrand } from "@/lib/portal/brand";
import { requestPortalLink } from "@/lib/portal/session";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/portal")({ component: PortalLanding });

function PortalLanding() {
  const brand = useQuery({ queryKey: ["portal-brand"], queryFn: () => getPortalBrand() });
  const { user } = useCurrentUserState();
  const navigate = useNavigate();
  const preview =
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("preview") === "1";
  const b = brand.data;
  const primary = `#${b?.primaryHex ?? "0D47A1"}`;
  const paper = `#${b?.paperHex ?? "F5F3EE"}`;
  const ink = `#${b?.inkHex ?? "0B1220"}`;
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (user && !preview) return <Navigate to="/home" />;

  return (
    <main className="min-h-dvh" style={{ background: paper, color: ink }}>
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-6 py-10">
        <div className="flex items-center gap-2.5">
          <HpMark className="size-9" color={primary} />
          <div>
            <div className="text-sm font-semibold tracking-tight">{b?.company ?? "Hurricane Productions"}</div>
            <p className="text-[11px] tracking-wide text-black/50 uppercase">{b?.portalHost ?? "portal.hurricaneproductionsllc.com"}</p>
          </div>
        </div>
        <div className="mt-auto pb-8">
          <p className="text-[11px] font-medium tracking-[0.18em] uppercase" style={{ color: primary }}>
            Passwordless client portal
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance">
            {b?.tagline ?? "Stop Quoting. Start Partnering."}
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-black/60">
            Proposal, contract, and payment — on our domain. We email a one-time link. No password.
          </p>
          <form
            className="mt-8 space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              setBusy(true);
              setErr(null);
              void requestPortalLink({ data: { email } }).then((r) => {
                setBusy(false);
                if (!r.ok || !r.token) {
                  setErr(r.error ?? "We couldn't send a link.");
                  return;
                }
                void navigate({ to: "/c/$token", params: { token: r.token } });
              });
            }}
          >
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="The email on your proposal"
              className="bg-white"
            />
            {err && <p className="text-sm text-red-800">{err}</p>}
            <Button type="submit" className="h-11 text-white" style={{ background: primary }} disabled={busy}>
              {busy ? "Sending…" : "Email me a link"}
            </Button>
          </form>
          <p className="mt-4 text-xs text-black/45">
            Already have a link from your producer? It looks like /c/… — open it, no sign-in.
          </p>
          <p className="mt-8 text-xs text-black/45">{b?.footer}</p>
        </div>
      </div>
    </main>
  );
}