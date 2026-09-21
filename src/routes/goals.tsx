import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createGoal, listGoals } from "@/lib/crm/ultimate";
import { getBootstrap } from "@/lib/crm/server";
import { formatUsdFull } from "@/lib/utils";
import { useUi } from "@/lib/crm/store";

export const Route = createFileRoute("/goals")({ component: GoalsPage });

function GoalsPage() {
  const goals = useQuery({ queryKey: ["goals"], queryFn: () => listGoals() });
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const qc = useQueryClient();
  const { memberId } = useUi();
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState("revenue");

  return (
    <div className="pb-12">
      <PageHeader
        title="Goals"
        subtitle="Revenue, won shows, and activity targets — the same toolkit as Pipedrive Insights goals."
        actions={
          <Button size="sm" onClick={() => setOpen(!open)}>
            New goal
          </Button>
        }
      />
      {open && (
        <form
          className="mx-4 mb-6 grid gap-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:mx-6 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const start = String(fd.get("start") || new Date().toISOString().slice(0, 10));
            const end = String(fd.get("end") || start);
            void createGoal({
              data: {
                name: String(fd.get("name") || "Untitled goal"),
                kind,
                target: Number(fd.get("target") || 0),
                periodStart: start,
                periodEnd: end,
                ownerId: memberId,
                pipelineId: boot.data?.pipelines[0]?.id ?? 1,
              },
            }).then(() => {
              toast.success("Goal set");
              qc.invalidateQueries({ queryKey: ["goals"] });
              setOpen(false);
            });
          }}
        >
          <Input name="name" placeholder="Goal name" required />
          <Select value={kind} onValueChange={setKind}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">Won revenue</SelectItem>
              <SelectItem value="won_deals">Won deals</SelectItem>
              <SelectItem value="activities">Activities</SelectItem>
            </SelectContent>
          </Select>
          <Input name="target" type="number" placeholder="Target" required />
          <Input name="start" type="date" required />
          <Input name="end" type="date" required />
          <Button type="submit">Save</Button>
        </form>
      )}
      <div className="grid gap-3 px-4 sm:grid-cols-2 sm:px-6">
        {(goals.data ?? []).map((g) => {
          const pct = g.target > 0 ? Math.min(100, Math.round((g.current / g.target) * 100)) : 0;
          const money = g.kind === "revenue";
          return (
            <article key={g.id} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-sm font-medium">{g.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {g.ownerName ?? "Team"} · {g.pipelineName ?? "All pipelines"}
                  </p>
                </div>
                <Badge variant={pct >= 100 ? "success" : pct >= 60 ? "steel" : "outline"}>{pct}%</Badge>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-2 flex justify-between font-mono text-sm tabular-nums">
                <span>{money ? formatUsdFull(g.current) : g.current}</span>
                <span className="text-muted-foreground">{money ? formatUsdFull(g.target) : g.target}</span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
