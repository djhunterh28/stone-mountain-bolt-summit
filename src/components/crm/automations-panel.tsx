import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { createAutomation, listAutomations, toggleAutomation } from "@/lib/crm/server";
import { runAutomation } from "@/lib/crm/ultimate";

export function AutomationsPanel() {
  const list = useQuery({ queryKey: ["automations"], queryFn: () => listAutomations() });
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          500 active workflows, delays, and if/else branches — Ultimate ceiling.
        </p>
        <Button size="sm" onClick={() => setOpen(!open)}>
          New workflow
        </Button>
      </div>
      {open && (
        <form
          className="grid gap-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            void createAutomation({
              data: {
                name: String(fd.get("name") || "Untitled"),
                triggerType: String(fd.get("triggerType") || "deal.stage"),
                triggerDetail: String(fd.get("triggerDetail") || ""),
                actionType: String(fd.get("actionType") || "activity.create"),
                actionDetail: String(fd.get("actionDetail") || ""),
              },
            }).then((r) => {
              if (r && "error" in r && r.error) toast.error(r.error);
              else toast.success("Automation live");
              qc.invalidateQueries({ queryKey: ["automations"] });
              qc.invalidateQueries({ queryKey: ["usage"] });
              setOpen(false);
            });
          }}
        >
          <Input name="name" placeholder="Name" />
          <Input name="triggerType" placeholder="Trigger (deal.won, deal.rotting…)" />
          <Input name="triggerDetail" placeholder="Trigger detail" />
          <Input name="actionType" placeholder="Action (email.template, project.create…)" />
          <Input name="actionDetail" placeholder="Action detail" className="sm:col-span-2" />
          <Button type="submit">Save</Button>
        </form>
      )}
      <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
        {(list.data ?? []).map((a) => (
          <li key={a.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
            <Switch
              checked={a.active}
              onCheckedChange={(v) =>
                toggleAutomation({ data: { id: a.id, active: v } }).then(() =>
                  qc.invalidateQueries({ queryKey: ["automations"] }),
                )
              }
            />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium">{a.name}</div>
              <p className="text-xs text-muted-foreground">
                When {a.triggerType} {a.triggerDetail ? `· ${a.triggerDetail}` : ""} → {a.actionType}
                {a.conditions ? ` if ${a.conditions}` : ""}
              </p>
            </div>
            <Badge variant="outline">{a.runs} runs</Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                runAutomation({ data: { id: a.id } }).then((r) => {
                  toast.success(r.ok ? `Ran ${r.action}` : "Could not run");
                  qc.invalidateQueries({ queryKey: ["automations"] });
                  qc.invalidateQueries({ queryKey: ["activities"] });
                })
              }
            >
              Run now
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
