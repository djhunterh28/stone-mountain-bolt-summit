import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listMarketplace, toggleApp } from "@/lib/crm/server";

export const Route = createFileRoute("/marketplace")({ component: MarketplacePage });

function MarketplacePage() {
  const apps = useQuery({ queryKey: ["marketplace"], queryFn: () => listMarketplace() });
  const qc = useQueryClient();
  const cats = [...new Set((apps.data ?? []).map((a) => a.category))];
  return (
    <div className="pb-12">
      <PageHeader title="Marketplace" subtitle="Accounting, chat, calendar, plots — connect what the shop already runs." />
      {cats.map((cat) => (
        <section key={cat} className="mb-6">
          <h2 className="px-4 text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-6">{cat}</h2>
          <div className="mt-2 grid gap-3 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
            {(apps.data ?? [])
              .filter((a) => a.category === cat)
              .map((a) => (
                <article key={a.id} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-medium">{a.name}</h3>
                    {a.connected && <Badge variant="success">On</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
                  <Button
                    size="sm"
                    className="mt-3"
                    variant={a.connected ? "secondary" : "default"}
                    onClick={() =>
                      toggleApp({ data: { id: a.id, connected: !a.connected } }).then(() =>
                        qc.invalidateQueries({ queryKey: ["marketplace"] }),
                      )
                    }
                  >
                    {a.connected ? "Disconnect" : "Connect"}
                  </Button>
                </article>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
