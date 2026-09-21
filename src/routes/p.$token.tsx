import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProposalPublic } from "@/lib/portal/server";

export const Route = createFileRoute("/p/$token")({ component: PublicProposal });

function PublicProposal() {
  const { token } = Route.useParams();
  const q = useQuery({ queryKey: ["proposal", token], queryFn: () => getProposalPublic({ data: { token } }) });
  const p = q.data;
  return (
    <main className="mx-auto min-h-dvh max-w-2xl px-5 py-12">
      <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">Northline proposal</p>
      {!p && <p className="mt-4 text-sm text-muted-foreground">{q.isLoading ? "Loading…" : "Not found."}</p>}
      {p && (
        <>
          <div className="mt-3 flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{p.title}</h1>
            <Badge variant="outline">{p.status}</Badge>
          </div>
          <article className="mt-6 whitespace-pre-wrap rounded-xl bg-card p-5 text-sm leading-relaxed shadow-[var(--shadow-border)]">{p.body}</article>
          <Button asChild className="mt-6">
            <Link to="/contact">Request a signature</Link>
          </Button>
        </>
      )}
    </main>
  );
}
