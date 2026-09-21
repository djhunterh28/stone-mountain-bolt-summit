import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createApproval, decideApproval, listApprovals } from "@/lib/portal/server";

export const Route = createFileRoute("/approvals")({ component: ApprovalsPage });

function ApprovalsPage() {
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["approvals"], queryFn: () => listApprovals() });
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [note, setNote] = useState<Record<number, string>>({});

  return (
    <div className="pb-12">
      <PageHeader title="Approvals" subtitle="Plots, load-in windows, and brand CAD — decide in the card." />
      <form
        className="mx-4 mb-6 space-y-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:mx-6"
        onSubmit={(e) => {
          e.preventDefault();
          void createApproval({ data: { title, body } }).then(() => {
            setTitle("");
            setBody("");
            qc.invalidateQueries({ queryKey: ["approvals"] });
            toast.success("Request sent");
          });
        }}
      >
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Approval title" required />
        <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="What needs a sign-off?" rows={3} />
        <Button type="submit" size="sm">
          Create request
        </Button>
      </form>
      <div className="grid gap-3 px-4 sm:grid-cols-2 sm:px-6 xl:grid-cols-3">
        {(list.data ?? []).map((a) => (
          <article key={a.id} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-sm font-medium">{a.title}</h2>
              <Badge variant={a.status === "approved" ? "success" : a.status === "rejected" ? "danger" : "warn"}>
                {a.status}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{a.body}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              {a.projectName ?? "House"} · {a.requestedBy}
            </p>
            {a.status === "pending" && (
              <div className="mt-3 space-y-2">
                <Input
                  value={note[a.id] ?? ""}
                  onChange={(e) => setNote((n) => ({ ...n, [a.id]: e.target.value }))}
                  placeholder="Decision note"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      decideApproval({ data: { id: a.id, status: "approved", note: note[a.id] } }).then(() =>
                        qc.invalidateQueries({ queryKey: ["approvals"] }),
                      )
                    }
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      decideApproval({ data: { id: a.id, status: "rejected", note: note[a.id] } }).then(() =>
                        qc.invalidateQueries({ queryKey: ["approvals"] }),
                      )
                    }
                  >
                    Reject
                  </Button>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
