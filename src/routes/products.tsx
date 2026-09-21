import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProduct, listProducts } from "@/lib/crm/server";
import { formatUsdFull } from "@/lib/utils";

export const Route = createFileRoute("/products")({ component: ProductsPage });

function ProductsPage() {
  const products = useQuery({ queryKey: ["products"], queryFn: () => listProducts() });
  const qc = useQueryClient();
  const cats = [...new Set((products.data ?? []).map((p) => p.category))];
  return (
    <div className="pb-12">
      <PageHeader
        title="Products"
        subtitle="LED, audio, lighting, labor, trucking — one-time and recurring dry hire."
      />
      <form
        className="mx-4 mb-6 grid gap-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:mx-6 sm:grid-cols-5"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          void createProduct({
            data: {
              name: String(fd.get("name") || "New item"),
              category: String(fd.get("category") || "Other"),
              unitPrice: Number(fd.get("unitPrice") || 0),
              unit: String(fd.get("unit") || "day"),
              sku: String(fd.get("sku") || "") || undefined,
            },
          }).then(() => {
            toast.success("Added to catalog");
            qc.invalidateQueries({ queryKey: ["products"] });
            qc.invalidateQueries({ queryKey: ["bootstrap"] });
          });
        }}
      >
        <Input name="name" placeholder="Name" />
        <Input name="sku" placeholder="SKU" />
        <Input name="category" placeholder="Category" />
        <Input name="unitPrice" type="number" placeholder="Rate" />
        <Button type="submit">Add</Button>
      </form>
      {cats.map((cat) => (
        <section key={cat} className="mb-6">
          <h2 className="px-4 text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-6">{cat}</h2>
          <ul className="mt-2 divide-y divide-border border-y border-border">
            {(products.data ?? [])
              .filter((p) => p.category === cat)
              .map((p) => (
                <li key={p.id} className="flex items-center gap-3 px-4 py-2.5 sm:px-6">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm">{p.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {p.sku} · {p.unit} · {p.billing}
                    </div>
                  </div>
                  <span className="font-mono text-sm tabular-nums">{formatUsdFull(p.unitPrice)}</span>
                  {p.billing === "recurring" && <Badge variant="steel">recurring</Badge>}
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
