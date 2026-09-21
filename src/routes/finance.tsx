import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createStandaloneInvoice, getFinance, recordPayment } from "@/lib/crm/ops";
import { formatUsdFull } from "@/lib/utils";

export const Route = createFileRoute("/finance")({ component: FinancePage });

function FinancePage() {
  const f = useQuery({ queryKey: ["finance"], queryFn: () => getFinance() });
  const qc = useQueryClient();
  const pnl = f.data?.pnl;
  const [pdf, setPdf] = useState<string | null>(null);

  function exportPnl() {
    const lines = [
      "NORTHLINE  P&L",
      `Revenue ${pnl?.income ?? 0}`,
      `COGS ${pnl?.cogs ?? 0}`,
      `Gross ${pnl?.gross ?? 0}`,
      `OpEx ${pnl?.opex ?? 0}`,
      `Net ${pnl?.net ?? 0}`,
    ].join("\n");
    setPdf(lines);
    toast.success("Landscape P&L staged");
  }

  return (
    <div className="pb-12">
      <PageHeader
        title="Finance"
        subtitle="Stripe, Square, PayPal, QuickBooks Payments. Ledger, P&L, standalone invoices."
        actions={<Button size="sm" variant="secondary" onClick={exportPnl}>Export P&L</Button>}
      />
      <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6">
        <Kpi label="Revenue" value={formatUsdFull(pnl?.income ?? 0)} />
        <Kpi label="Gross" value={formatUsdFull(pnl?.gross ?? 0)} />
        <Kpi label="OpEx" value={formatUsdFull(pnl?.opex ?? 0)} />
        <Kpi label="Net" value={formatUsdFull(pnl?.net ?? 0)} />
      </div>
      {pdf && <pre className="mx-4 mt-4 rounded-xl bg-card p-4 font-mono text-xs shadow-[var(--shadow-border)] sm:mx-6">{pdf}</pre>}
      <div className="mt-6 px-4 sm:px-6">
        <Tabs defaultValue="invoices">
          <TabsList className="flex h-auto flex-wrap">
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="ledger">Ledger</TabsTrigger>
            <TabsTrigger value="qb">QuickBooks</TabsTrigger>
          </TabsList>
          <TabsContent value="invoices" className="mt-4 space-y-3">
            <form
              className="flex flex-wrap gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                void createStandaloneInvoice({
                  data: {
                    orgId: 11,
                    amount: Number(fd.get("amount") || 0),
                    memo: String(fd.get("memo") || "Standalone"),
                    processor: String(fd.get("processor") || "stripe"),
                  },
                }).then((r) => {
                  toast.success(`Invoice ${r.number} — payment link mailed`);
                  qc.invalidateQueries({ queryKey: ["finance"] });
                });
              }}
            >
              <Input name="memo" placeholder="Equipment sale / booking fee" className="w-56" />
              <Input name="amount" type="number" placeholder="Amount" className="w-28" />
              <select name="processor" className="h-9 rounded-md border border-input bg-background px-2 text-sm">
                <option value="stripe">Stripe</option>
                <option value="square">Square</option>
                <option value="paypal">PayPal</option>
                <option value="qbo">QuickBooks Payments</option>
              </select>
              <Button type="submit" size="sm">Invoice without event</Button>
            </form>
            <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
              {(f.data?.invoices ?? []).map((i) => (
                <li key={i.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
                  <div className="min-w-0 flex-1">
                    <span className="font-mono text-xs">{i.number}</span>{" "}
                    {i.deal && i.dealId != null ? (
                      <Link to="/deals/$dealId" params={{ dealId: String(i.dealId) }}>{i.deal}</Link>
                    ) : (
                      <span>{i.org} · no event</span>
                    )}
                    <p className="text-xs text-muted-foreground">{i.memo} · {i.processor ?? "unassigned"}</p>
                  </div>
                  <span className="font-mono tabular-nums">{formatUsdFull(i.amount)}</span>
                  <Badge variant={i.status === "paid" ? "success" : i.status === "partial" ? "steel" : "outline"}>{i.status}</Badge>
                  {i.status !== "paid" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        recordPayment({ data: { invoiceId: i.id, amount: i.amount, processor: i.processor || "stripe", kind: "charge" } }).then(() => {
                          toast.success("Captured");
                          qc.invalidateQueries({ queryKey: ["finance"] });
                        })
                      }
                    >
                      Capture
                    </Button>
                  )}
                  {i.status === "paid" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        recordPayment({ data: { invoiceId: i.id, amount: i.amount, processor: i.processor || "stripe", kind: "refund" } }).then(() => {
                          toast.success("Refunded");
                          qc.invalidateQueries({ queryKey: ["finance"] });
                        })
                      }
                    >
                      Refund
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="ledger" className="mt-4 space-y-3">
            <ul className="mb-3 flex flex-wrap gap-2">
              {(f.data?.accounts ?? []).map((a) => (
                <Badge key={a.id} variant="outline">{a.code} {a.name}</Badge>
              ))}
            </ul>
            <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
              {(f.data?.entries ?? []).map((e) => (
                <li key={e.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <span>
                    {e.account}
                    <span className="ml-2 text-xs text-muted-foreground">
                      {e.memo} {e.recurring ? "· recurring" : ""}
                    </span>
                  </span>
                  <span className="font-mono tabular-nums">{formatUsdFull(e.amount)}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="qb" className="mt-4">
            <article className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
              <h2 className="text-sm font-medium">QuickBooks Online</h2>
              <p className="mt-1 text-sm text-muted-foreground">OAuth connected · invoices and expenses push nightly. Chart mapped 4000→Income, 5000→COGS, 6000→Expenses.</p>
              <Badge variant="success" className="mt-3">last push 2h ago</Badge>
            </article>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
      <div className="text-xs text-muted-foreground uppercase">{label}</div>
      <div className="mt-2 font-mono text-xl tabular-nums">{value}</div>
    </article>
  );
}
