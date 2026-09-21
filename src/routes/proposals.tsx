import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createProposal, listProposals } from "@/lib/portal/server";
import { useUi } from "@/lib/crm/store";

export const Route = createFileRoute("/proposals")({ component: ProposalsPage });

function ProposalsPage() {
  const list = useQuery({ queryKey: ["proposals"], queryFn: () => listProposals() });
  const qc = useQueryClient();
  const setDirty = useUi((s) => s.setDirty);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  return (
    <div className="pb-12">
      <PageHeader title="Proposals" subtitle="Rich production proposals with shareable view tokens and e-sign handoff." />
      <form
        className="mx-4 mb-6 space-y-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:mx-6"
        onSubmit={(e) => {
          e.preventDefault();
          void createProposal({ data: { title, body } }).then((r) => {
            setDirty(false);
            setTitle("");
            setBody("");
            toast.success(`Public link /p/${r.token}`);
            qc.invalidateQueries({ queryKey: ["proposals"] });
          });
        }}
      >
        <Input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setDirty(true);
          }}
          placeholder="Proposal title"
          required
        />
        <Textarea
          rows={6}
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            setDirty(true);
          }}
          placeholder="Scope, labor, LED, audio, power…"
        />
        <Button type="submit">Save draft</Button>
      </form>
      <ul className="divide-y divide-border border-t border-border">
        {(list.data ?? []).map((p) => (
          <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6">
            <div>
              <div className="text-sm font-medium">{p.title}</div>
              <div className="text-xs text-muted-foreground">{p.dealTitle ?? "Unlinked"} · {p.body.slice(0, 80)}</div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={p.status === "viewed" ? "warn" : p.status === "signed" ? "success" : "outline"}>{p.status}</Badge>
              <Button asChild size="sm" variant="ghost">
                <Link to="/p/$token" params={{ token: p.token }}>
                  Open
                </Link>
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
