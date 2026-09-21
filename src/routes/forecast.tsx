import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { addMonths, format, startOfMonth } from "date-fns";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { getBootstrap, listDeals } from "@/lib/crm/server";
import { formatUsdFull } from "@/lib/utils";

export const Route = createFileRoute("/forecast")({ component: ForecastPage });

function ForecastPage() {
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const deals = useQuery({
    queryKey: ["deals", 1, "open"],
    queryFn: () => listDeals({ data: { pipelineId: 1, status: "open" } }),
  });
  const months = Array.from({ length: 6 }, (_, i) => startOfMonth(addMonths(new Date(), i)));
  const open = deals.data ?? [];
  const rows = months.map((m) => {
    const inMonth = open.filter((d) => {
      const dt = d.expectedClose ? new Date(d.expectedClose) : d.eventDate ? new Date(d.eventDate) : null;
      return dt && dt.getMonth() === m.getMonth() && dt.getFullYear() === m.getFullYear();
    });
    const best = inMonth.reduce((s, d) => s + d.value, 0);
    const commit = inMonth.filter((d) => (d.probability ?? 0) >= 80).reduce((s, d) => s + d.value, 0);
    const weighted = inMonth.reduce((s, d) => s + d.value * ((d.probability ?? 0) / 100), 0);
    return { m, inMonth, best, commit, weighted };
  });
  return (
    <div className="pb-12">
      <PageHeader
        title="Forecast"
        subtitle="Commit, best case, and weighted by expected close — Live Events book."
      />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-2 font-medium sm:px-6">Month</th>
              <th className="px-2 py-2 text-right font-medium">Commit ≥80%</th>
              <th className="px-2 py-2 text-right font-medium">Weighted</th>
              <th className="px-4 py-2 text-right font-medium sm:px-6">Best case</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.m.toISOString()} className="border-t border-border align-top">
                <td className="px-4 py-3 sm:px-6">
                  <div className="font-medium">{format(r.m, "MMMM yyyy")}</div>
                  <ul className="mt-2 space-y-1">
                    {r.inMonth.map((d) => (
                      <li key={d.id} className="text-xs text-muted-foreground">
                        {d.title} · {formatUsdFull(d.value)}{" "}
                        <Badge variant="outline">{d.probability}%</Badge>
                      </li>
                    ))}
                    {r.inMonth.length === 0 && <li className="text-xs text-muted-foreground">No closes dated here.</li>}
                  </ul>
                </td>
                <td className="px-2 py-3 text-right font-mono tabular-nums">{formatUsdFull(r.commit)}</td>
                <td className="px-2 py-3 text-right font-mono tabular-nums">{formatUsdFull(r.weighted)}</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums sm:px-6">{formatUsdFull(r.best)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {boot.data && (
        <p className="px-4 pt-4 text-xs text-muted-foreground sm:px-6">
          Dry Hire and Partnerships sit on their own pipelines — switch them from the board.
        </p>
      )}
    </div>
  );
}
