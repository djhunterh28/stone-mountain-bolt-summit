import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPortalLinkDesk, mintPortalLink, revokePortalLink } from "@/lib/portal/session";
import { formatDateTime } from "@/lib/utils";

export const Route = createFileRoute("/client-portal")({ component: ClientPortalDesk });

function copy(text: string) {
  void navigator.clipboard.writeText(text).then(() => toast.success("Link copied"));
}

function ClientPortalDesk() {
  const desk = useQuery({ queryKey: ["portal-links"], queryFn: () => getPortalLinkDesk() });
  const qc = useQueryClient();
  const d = desk.data;

  function refresh() {
    void qc.invalidateQueries({ queryKey: ["portal-links"] });
  }

  return (
    <div className="pb-12">
      <PageHeader
        title="Client portal"
        subtitle="Passwordless magic links. Clients open proposal, sign the contract, and pay — branded as Hurricane, never a vendor host."
      />
      <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:px-6">
        <article className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
          <div className="text-xs tracking-wide text-muted-foreground uppercase">Live links</div>
          <div className="mt-2 font-mono text-2xl tabular-nums">{d?.live ?? "—"}</div>
        </article>
        <article className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
          <div className="text-xs tracking-wide text-muted-foreground uppercase">Host</div>
          <div className="mt-2 truncate text-sm">{d?.portalHost ?? "portal.hurricaneproductionsllc.com"}</div>
        </article>
        <article className="col-span-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:col-span-1">
          <div className="text-xs tracking-wide text-muted-foreground uppercase">Access</div>
          <p className="mt-2 text-sm text-muted-foreground">Token in the URL. No password.</p>
        </article>
      </div>

      <section className="mt-6 px-4 sm:px-6">
        <h2 className="text-sm font-medium">Mint a link</h2>
        <ul className="mt-3 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
          {(d?.people ?? []).slice(0, 8).map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">
              <div>
                <div className="text-sm">{p.name}</div>
                <p className="text-xs text-muted-foreground">{p.email}</p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  mintPortalLink({ data: { personId: p.id } }).then((r) => {
                    if (!r.ok) toast.error(r.error ?? "Blocked");
                    else {
                      toast.success("Link mailed");
                      copy(`${window.location.origin}/c/${r.token}`);
                    }
                    refresh();
                  })
                }
              >
                Send link
              </Button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 px-4 sm:px-6">
        <h2 className="text-sm font-medium">Issued</h2>
        <ul className="mt-3 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
          {(d?.links ?? []).map((l) => (
            <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <div>
                <div className="text-sm">
                  {l.person} <span className="text-muted-foreground">· {l.org}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  /c/{l.token}
                  {l.lastSeen ? ` · last in ${formatDateTime(l.lastSeen)}` : " · unused"}
                  {l.expiresAt ? ` · exp ${formatDateTime(l.expiresAt)}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant={l.revoked ? "outline" : "success"}>{l.revoked ? "revoked" : "live"}</Badge>
                {!l.revoked && (
                  <>
                    <Button size="sm" variant="ghost" onClick={() => copy(`${window.location.origin}/c/${l.token}`)}>
                      Copy
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => revokePortalLink({ data: { id: l.id } }).then(refresh)}>
                      Revoke
                    </Button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
