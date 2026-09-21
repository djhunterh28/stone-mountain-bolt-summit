import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { advanceDocument, createDocument, listDeals, listDocuments } from "@/lib/crm/server";
import { formatDateTime } from "@/lib/utils";

export const Route = createFileRoute("/documents")({ component: DocsPage });

const VARIANT: Record<string, "outline" | "steel" | "success" | "warn" | "danger"> = {
  draft: "outline",
  sent: "steel",
  viewed: "warn",
  signed: "success",
  declined: "danger",
};

function DocsPage() {
  const docs = useQuery({ queryKey: ["documents"], queryFn: () => listDocuments() });
  const deals = useQuery({
    queryKey: ["deals", 1, "all"],
    queryFn: () => listDeals({ data: { pipelineId: 1, status: "all" } }),
  });
  const qc = useQueryClient();
  const [template, setTemplate] = useState("proposal");
  const [dealId, setDealId] = useState<string>("none");

  return (
    <div className="pb-12">
      <PageHeader
        title="Smart Docs"
        subtitle="Proposals, production agreements, and COIs — tracked and e-signed."
      />
      <form
        className="mx-4 mb-6 space-y-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:mx-6"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          void createDocument({
            data: {
              name: String(fd.get("name") || "Untitled document"),
              template,
              content: String(fd.get("content") || ""),
              dealId: dealId && dealId !== "none" ? Number(dealId) : null,
            },
          }).then(() => {
            toast.success("Document created");
            qc.invalidateQueries({ queryKey: ["documents"] });
          });
        }}
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <Input name="name" placeholder="Document name" />
          <Select value={template} onValueChange={setTemplate}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["proposal", "contract", "coi", "rider"].map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={dealId} onValueChange={setDealId}>
            <SelectTrigger>
              <SelectValue placeholder="Link a deal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No deal</SelectItem>
              {(deals.data ?? []).map((d) => (
                <SelectItem key={d.id} value={String(d.id)}>
                  {d.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Textarea name="content" placeholder="Body / terms" rows={3} />
        <Button type="submit" size="sm">
          Create draft
        </Button>
      </form>
      <ul className="divide-y divide-border border-t border-border">
        {(docs.data ?? []).map((d) => (
          <li key={d.id} className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium">{d.name}</div>
              <div className="text-xs text-muted-foreground">
                {d.template} · {d.dealTitle ?? "Unlinked"} · {formatDateTime(d.createdAt)}
              </div>
            </div>
            <Badge variant={VARIANT[d.status] ?? "outline"}>{d.status}</Badge>
            {d.status === "draft" && (
              <Button size="sm" variant="secondary" onClick={() => act(d.id, "send")}>
                Send
              </Button>
            )}
            {d.status === "sent" && (
              <Button size="sm" variant="secondary" onClick={() => act(d.id, "view")}>
                Mark viewed
              </Button>
            )}
            {(d.status === "sent" || d.status === "viewed") && (
              <>
                <Button asChild size="sm" variant="secondary">
                  <Link to="/sign/$docId" params={{ docId: String(d.id) }}>
                    Open e-sign
                  </Link>
                </Button>
                <Button size="sm" onClick={() => act(d.id, "sign")}>
                  E-sign
                </Button>
                <Button size="sm" variant="ghost" onClick={() => act(d.id, "decline")}>
                  Decline
                </Button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  function act(id: number, action: "send" | "view" | "sign" | "decline") {
    void advanceDocument({ data: { id, action } }).then(() => {
      toast.success(action === "sign" ? "Signed" : "Updated");
      qc.invalidateQueries({ queryKey: ["documents"] });
    });
  }
}
