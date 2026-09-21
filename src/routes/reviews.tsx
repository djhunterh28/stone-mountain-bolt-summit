import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getReviews, routeReview } from "@/lib/crm/ops";

export const Route = createFileRoute("/reviews")({ component: ReviewsPage });

const PLATFORMS = ["google", "yelp", "facebook", "weddingwire", "theknot", "zola", "wordpress-draft"] as const;

function ReviewsPage() {
  const rows = useQuery({ queryKey: ["reviews"], queryFn: () => getReviews() });
  const qc = useQueryClient();
  return (
    <div className="pb-12">
      <PageHeader title="Reviews" subtitle="Ask after the show. Client replies here, then we point them at the platform that counts. Directory profile updates itself." />
      <ul className="mx-4 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)] sm:mx-6">
        {(rows.data ?? []).map((r) => (
          <li key={r.id} className="space-y-2 px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">{r.author}</span>
              <span className="text-xs text-muted-foreground">{r.stars}★ · {r.deal}</span>
              <Badge variant={r.status === "published" ? "success" : "outline"}>{r.status}</Badge>
              {r.platform && <Badge variant="steel">{r.platform}</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">{r.body}</p>
            {r.status !== "published" && (
              <div className="flex flex-wrap gap-1">
                {PLATFORMS.map((p) => (
                  <Button
                    key={p}
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      routeReview({ data: { id: r.id, platform: p } }).then(() => {
                        toast.success(p === "wordpress-draft" ? "Staged as a WordPress draft" : `Recorded ${p}`);
                        qc.invalidateQueries({ queryKey: ["reviews"] });
                      })
                    }
                  >
                    {p}
                  </Button>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
