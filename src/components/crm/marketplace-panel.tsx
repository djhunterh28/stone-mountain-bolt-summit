import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listMarketplace, toggleApp } from "@/lib/crm/server";

export function MarketplacePanel() {
  const apps = useQuery({ queryKey: ["marketplace"], queryFn: () => listMarketplace() });
  const qc = useQueryClient();
  const cats = [...new Set((apps.data ?? []).map((a) => a.category))];
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Accounting, chat, calendar, plots — connect what the shop already runs.
      </p>
      {cats.map((cat) => (
        <section key={cat}>
          <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{cat}</h2>
          <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
