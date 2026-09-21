import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDirectory } from "@/lib/crm/ops";
import { getDirectoryProfile } from "@/lib/crm/reviews";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

export const Route = createFileRoute("/discover")({ component: DiscoverPage });

function DiscoverPage() {
  const v = useQuery({ queryKey: ["directory"], queryFn: () => getDirectory() });
  const profile = useQuery({ queryKey: ["directory-profile"], queryFn: () => getDirectoryProfile() });
  const p = profile.data;
  return (
    <div className="pb-16">
      <PageHeader title="Directory" subtitle="Zenvents profile plus a fair rotation of event vendors. Reviews land here automatically." />
      {p && p.n > 0 && (
        <article className="mx-4 mb-6 rounded-xl bg-card p-5 shadow-[var(--shadow-border)] sm:mx-6">
          <div className="flex flex-wrap items-baseline gap-2">
            <h2 className="text-sm font-medium">Hurricane Productions</h2>
            <Badge variant="steel">{p.avg}★ · {p.n} reviews</Badge>
            <Badge variant="outline">Zenvents</Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Brooklyn · Full production. Reviews publish here the moment the client submits.</p>
          <ul className="mt-4 divide-y divide-border">
            {p.reviews.map((r, i) => (
              <li key={`${r.author}-${i}`} className="py-3">
                <div className="text-sm">
                  <span className="font-medium">{r.author}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {r.stars}★ · {r.deal}
                    {r.at ? ` · ${formatDate(r.at)}` : ""}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
              </li>
            ))}
          </ul>
        </article>
      )}
      <div className="grid gap-3 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {(v.data ?? []).map((x) => (
          <article key={x.id} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-sm font-medium">{x.name}</h2>
              <Badge variant={x.available ? "success" : "outline"}>{x.available ? "open" : "held"}</Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{x.category} · {x.city}</p>
            <p className="mt-2 text-sm text-muted-foreground">{x.blurb}</p>
            <Button
              size="sm"
              className="mt-3"
              variant="secondary"
              onClick={() => toast.success(`Inquiry logged for ${x.name}`)}
            >
              Inquire
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}