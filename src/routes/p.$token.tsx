import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { HpMark } from "@/components/portal/hp-mark";
import { getProposalPublic } from "@/lib/portal/server";
import { getPortalBrand } from "@/lib/portal/brand";

export const Route = createFileRoute("/p/$token")({ component: PublicProposal });

function PublicProposal() {
  const { token } = Route.useParams();
  const q = useQuery({ queryKey: ["proposal", token], queryFn: () => getProposalPublic({ data: { token } }) });
  const brand = useQuery({ queryKey: ["portal-brand"], queryFn: () => getPortalBrand() });
  const p = q.data;
  const b = brand.data;
  const primary = `#${b?.primaryHex ?? "0D47A1"}`;
  return (
    <main className="mx-auto min-h-dvh max-w-2xl px-5 py-12">
      <div className="flex items-center gap-2.5">
        <HpMark className="size-8" color={primary} />
        <div>
          <p className="text-sm font-semibold">{b?.company ?? "Hurricane Productions"}</p>
          <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">Proposal</p>
        </div>
      </div>
      {!p && <p className="mt-4 text-sm text-muted-foreground">{q.isLoading ? "Loading…" : "Not found."}</p>}
      {p && (
        <>
          <div className="mt-6 flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{p.title}</h1>
            <Badge variant="outline">{p.status}</Badge>
          </div>
          <article className="mt-6 whitespace-pre-wrap rounded-xl bg-card p-5 text-sm leading-relaxed shadow-[var(--shadow-border)]">{p.body}</article>
        </>
      )}
    </main>
  );
}