import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDirectory } from "@/lib/crm/ops";
import { toast } from "sonner";

export const Route = createFileRoute("/discover")({ component: DiscoverPage });

function DiscoverPage() {
  const v = useQuery({ queryKey: ["directory"], queryFn: () => getDirectory() });
  return (
    <div className="pb-16">
      <PageHeader title="Directory" subtitle="Fair rotation of event vendors. Availability from their calendar. Inquire without creating an account." />
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
