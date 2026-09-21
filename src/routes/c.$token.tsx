import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HpMark } from "@/components/portal/hp-mark";
import { getClientPortal, payPortalInvoice, signPortalContract } from "@/lib/portal/session";
import { formatDate, formatUsdFull } from "@/lib/utils";

export const Route = createFileRoute("/c/$token")({ component: ClientPortal });

function ClientPortal() {
  const { token } = Route.useParams();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["client-portal", token],
    queryFn: () => getClientPortal({ data: { token } }),
  });
  const [sig, setSig] = useState("");
  const [tab, setTab] = useState<"home" | "proposal" | "sign" | "pay">("home");
  const d = q.data;
  const b = d?.brand;
  const primary = `#${b?.primaryHex ?? "0D47A1"}`;
  const paper = `#${b?.paperHex ?? "F5F3EE"}`;
  const ink = `#${b?.inkHex ?? "0B1220"}`;

  function refresh() {
    void qc.invalidateQueries({ queryKey: ["client-portal", token] });
  }

  if (!d || q.isLoading) {
    return (
      <main className="grid min-h-dvh place-items-center" style={{ background: paper, color: ink }}>
        <p className="text-sm text-black/50">Opening your portal…</p>
      </main>
    );
  }

  if (!d.ok || !d.session) {
    return (
      <main className="min-h-dvh px-6 py-16" style={{ background: paper, color: ink }}>
        <div className="mx-auto max-w-md">
          <HpMark className="size-9" color={primary} />
          <h1 className="mt-6 text-2xl font-semibold">This link is no longer live</h1>
          <p className="mt-2 text-sm text-black/55">Ask your producer for a new portal link. No password is ever required.</p>
        </div>
      </main>
    );
  }

  const openInv = d.invoices.filter((i) => i.status !== "paid");
  const pendingSign = d.contracts.filter((c) => c.recStatus !== "signed");

  return (
    <main className="min-h-dvh" style={{ background: paper, color: ink }}>
      <header className="border-b border-black/8 px-5 py-4">
        <div className="mx-auto flex max-w-3xl items-center gap-2.5">
          <HpMark className="size-8" color={primary} />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold tracking-tight">{b?.company ?? "Hurricane Productions"}</div>
            <p className="truncate text-[11px] text-black/45">
              {d.session.name} · {d.session.org} · {b?.portalHost}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-8">
        <p className="text-[11px] font-medium tracking-[0.16em] uppercase" style={{ color: primary }}>
          Passwordless portal
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Your show with us</h1>
        <p className="mt-2 text-sm text-black/55">Proposal, contract, and payment. This link is the key — no account, no password.</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {(["home", "proposal", "sign", "pay"] as const).map((t) => (
            <Button
              key={t}
              size="sm"
              variant={tab === t ? "default" : "secondary"}
              className={tab === t ? "text-white" : ""}
              style={tab === t ? { background: primary } : undefined}
              onClick={() => setTab(t)}
            >
              {t === "home" ? "Overview" : t === "proposal" ? "Proposal" : t === "sign" ? "Contract" : "Pay"}
            </Button>
          ))}
        </div>

        {tab === "home" && (
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <article className="rounded-xl bg-white p-4 shadow-[0_0_0_1px_rgb(11_18_32/0.08)]">
              <div className="text-xs tracking-wide text-black/45 uppercase">Proposals</div>
              <div className="mt-2 font-mono text-2xl">{d.proposals.length}</div>
              <p className="mt-1 text-xs text-black/45">{d.proposals[0]?.title ?? "None yet"}</p>
            </article>
            <article className="rounded-xl bg-white p-4 shadow-[0_0_0_1px_rgb(11_18_32/0.08)]">
              <div className="text-xs tracking-wide text-black/45 uppercase">To sign</div>
              <div className="mt-2 font-mono text-2xl">{pendingSign.length}</div>
              <p className="mt-1 text-xs text-black/45">{pendingSign[0]?.title ?? "All signed"}</p>
            </article>
            <article className="rounded-xl bg-white p-4 shadow-[0_0_0_1px_rgb(11_18_32/0.08)]">
              <div className="text-xs tracking-wide text-black/45 uppercase">Open invoices</div>
              <div className="mt-2 font-mono text-2xl">{openInv.length}</div>
              <p className="mt-1 text-xs text-black/45">
                {openInv[0] ? formatUsdFull(openInv[0].amount) : "Nothing due"}
              </p>
            </article>
          </div>
        )}

        {tab === "proposal" && (
          <ul className="mt-6 space-y-3">
            {d.proposals.map((p) => (
              <li key={p.id} className="rounded-xl bg-white p-5 shadow-[0_0_0_1px_rgb(11_18_32/0.08)]">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-medium">{p.title}</h2>
                  <Badge variant="outline">{p.status}</Badge>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-black/70">{p.body}</p>
              </li>
            ))}
            {d.proposals.length === 0 && <p className="text-sm text-black/50">No proposal on this link yet.</p>}
          </ul>
        )}

        {tab === "sign" && (
          <ul className="mt-6 space-y-3">
            {d.contracts.map((c) => (
              <li key={c.id} className="rounded-xl bg-white p-5 shadow-[0_0_0_1px_rgb(11_18_32/0.08)]">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-medium">{c.title}</h2>
                  <Badge variant={c.recStatus === "signed" ? "success" : "outline"}>{c.recStatus}</Badge>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-black/70">{c.content}</p>
                {c.recStatus !== "signed" && (
                  <form
                    className="mt-4 flex flex-wrap gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      void signPortalContract({
                        data: { token, envelopeId: c.id, recipientId: c.recipientId, signature: sig || d.session!.name },
                      }).then((r) => {
                        if (!r.ok) return;
                        setSig("");
                        refresh();
                      });
                    }}
                  >
                    <Input
                      value={sig}
                      onChange={(e) => setSig(e.target.value)}
                      placeholder="Type your name to sign"
                      className="max-w-xs bg-white"
                    />
                    <Button type="submit" className="text-white" style={{ background: primary }}>
                      Sign contract
                    </Button>
                  </form>
                )}
              </li>
            ))}
            {d.contracts.length === 0 && <p className="text-sm text-black/50">No contract waiting.</p>}
          </ul>
        )}

        {tab === "pay" && (
          <ul className="mt-6 space-y-3">
            {d.invoices.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-5 shadow-[0_0_0_1px_rgb(11_18_32/0.08)]">
                <div>
                  <div className="text-sm font-medium">
                    {i.number} · {formatUsdFull(i.amount)}
                  </div>
                  <p className="text-xs text-black/50">
                    {i.memo ?? i.deal}
                    {i.dueOn ? ` · due ${formatDate(i.dueOn)}` : ""}
                  </p>
                </div>
                {i.status === "paid" ? (
                  <Badge variant="success">paid {i.paidAt ? formatDate(i.paidAt) : ""}</Badge>
                ) : (
                  <Button
                    className="text-white"
                    style={{ background: primary }}
                    onClick={() =>
                      payPortalInvoice({ data: { token, invoiceId: i.id } }).then((r) => {
                        if (r.ok) refresh();
                      })
                    }
                  >
                    Pay with card
                  </Button>
                )}
              </li>
            ))}
            {d.invoices.length === 0 && <p className="text-sm text-black/50">No invoices on this portal.</p>}
          </ul>
        )}

        <p className="mt-10 text-xs text-black/40">{b?.footer}. Token access — nothing to remember.</p>
      </div>
    </main>
  );
}
