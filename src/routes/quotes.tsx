import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getQuotes, submitQuote } from "@/lib/crm/ops";
import { formatUsdFull } from "@/lib/utils";

export const Route = createFileRoute("/quotes")({ component: QuotesPage });

function QuotesPage() {
  const rows = useQuery({ queryKey: ["quotes"], queryFn: () => getQuotes() });
  const [indoor, setIndoor] = useState(true);
  const [type, setType] = useState("Corporate town hall");
  const outdoor = type === "Rooftop concert" || !indoor;

  return (
    <div className="pb-12">
      <PageHeader title="Inquiries & quotes" subtitle="Conditional fields, instant pricing, automatic lead. Embed the wizard on any site." />
      <div className="grid gap-6 px-4 sm:px-6 lg:grid-cols-2">
        <form
          className="space-y-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            void submitQuote({
              data: {
                name: String(fd.get("name")),
                email: String(fd.get("email")),
                eventType: type,
                guests: Number(fd.get("guests") || 0),
                indoor,
                date: String(fd.get("date")),
              },
            }).then((r) => {
              toast.success(`Quote ${formatUsdFull(r.total)} · lead created`);
              rows.refetch();
            });
          }}
        >
          <h2 className="text-sm font-medium">Quote wizard</h2>
          <Input name="name" placeholder="Name" required />
          <Input name="email" type="email" placeholder="Email" required />
          <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm" value={type} onChange={(e) => setType(e.target.value)}>
            <option>Corporate town hall</option>
            <option>Gala / awards</option>
            <option>Rooftop concert</option>
          </select>
          <Input name="guests" type="number" placeholder="Headcount" required />
          <Input name="date" type="date" required />
          {type !== "Rooftop concert" && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={indoor} onChange={(e) => setIndoor(e.target.checked)} /> Indoor
            </label>
          )}
          {outdoor && <p className="text-xs text-muted-foreground">Outdoor / rooftop adds ballast and a weather hold.</p>}
          <Button type="submit" size="sm">Price it</Button>
          <pre className="text-[11px] text-muted-foreground">{`<iframe src="/quotes" title="Northline quote"></iframe>`}</pre>
        </form>
        <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
          {(rows.data ?? []).map((q) => (
            <li key={q.id} className="px-4 py-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span>{q.name}</span>
                <span className="font-mono tabular-nums">{formatUsdFull(q.total)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {q.eventType} · {q.guests} pax · {q.date}
              </p>
              <Badge variant={q.abandoned ? "warn" : "outline"}>{q.abandoned ? "abandoned" : q.status}</Badge>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
