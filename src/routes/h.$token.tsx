import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PackBody } from "@/components/crm/handoff-pack";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getHandoffPublic, pingHandoff } from "@/lib/crm/handoff";

export const Route = createFileRoute("/h/$token")({ component: PublicPack });

function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="4" y="5" width="3.2" height="14" rx="0.6" fill="currentColor" opacity="0.95" />
      <rect x="9.4" y="8" width="3.2" height="11" rx="0.6" fill="currentColor" opacity="0.7" />
      <rect x="14.8" y="3" width="3.2" height="16" rx="0.6" fill="currentColor" />
    </svg>
  );
}

function PublicPack() {
  const { token } = Route.useParams();
  const q = useQuery({
    queryKey: ["handoff-public", token],
    queryFn: () => getHandoffPublic({ data: { token } }),
    retry: 1,
  });
  const [status, setStatus] = useState<string | null>(null);
  const data = q.data;

  useEffect(() => {
    if (!data || data.status === "recalled") return;
    void pingHandoff({ data: { token } }).then((r) => {
      if (r.ok) setStatus(r.status);
    });
  }, [token, data]);

  async function mark(next: "on_site" | "complete") {
    const r = await pingHandoff({ data: { token, status: next } });
    if (r.ok) setStatus(r.status);
  }

  const shown = status ?? data?.status ?? "sent";

  return (
    <main className="mx-auto min-h-dvh max-w-2xl px-5 py-12">
      <div className="flex items-center gap-2 text-primary">
        <Mark className="size-6" />
        <span className="text-sm font-semibold tracking-tight text-foreground">Northline</span>
      </div>
      <p className="mt-8 font-mono text-xs tracking-widest text-muted-foreground uppercase">Event hand-off pack</p>
      {q.isLoading && <p className="mt-4 text-sm text-muted-foreground">Loading the pack…</p>}
      {!q.isLoading && !data && <p className="mt-4 text-sm text-muted-foreground">This pack is not on file.</p>}
      {data?.status === "recalled" && (
        <div className="mt-4 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
          <h1 className="text-xl font-semibold tracking-tight">Pack recalled</h1>
          <p className="mt-2 text-sm text-muted-foreground">The house pulled this transfer. Production data is no longer shared.</p>
        </div>
      )}
      {data && data.status !== "recalled" && (
        <>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{data.pack.title}</h1>
            <Badge variant="outline">for {data.to}</Badge>
            <Badge variant={data.reason === "emergency" ? "danger" : "steel"}>{data.reason}</Badge>
          </div>
          {data.cover && <p className="mt-3 text-sm text-muted-foreground">{data.cover}</p>}
          <p className="mt-4 rounded-lg bg-muted/70 px-3 py-2 text-xs text-muted-foreground">
            Financials withheld. Invoices, day rates, and house value stay with Northline.
          </p>
          <article className="mt-6 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
            <PackBody pack={data.pack} />
          </article>
          {data.monitor && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <p className="mr-auto text-xs text-muted-foreground">House is monitoring · status {shown.replace("_", " ")}</p>
              <Button size="sm" variant="secondary" onClick={() => void mark("on_site")} disabled={shown === "complete"}>
                On site
              </Button>
              <Button size="sm" onClick={() => void mark("complete")} disabled={shown === "complete"}>
                Complete
              </Button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
