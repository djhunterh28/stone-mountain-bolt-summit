import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createSandboxAutomation,
  createSandboxField,
  listSandbox,
  promoteSandboxAutomation,
  promoteSandboxField,
} from "@/lib/crm/governance";

export function SandboxPanel() {
  const data = useQuery({ queryKey: ["sandbox"], queryFn: () => listSandbox() });
  const qc = useQueryClient();
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
        <FlaskConical className="mt-0.5 size-4 shrink-0 text-steel" />
        <p className="text-sm text-muted-foreground">
          Try custom fields and automations here. Sandbox never touches live deals, mail, or production agreements.
          Promote copies the object into the workspace under Ultimate caps (500 fields, 500 automations).
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-sm font-medium">Custom fields</h2>
          <form
            className="mb-3 flex flex-wrap gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              void createSandboxField({
                data: {
                  name: String(fd.get("name") || "Untitled field"),
                  entity: String(fd.get("entity") || "deal"),
                  fieldType: String(fd.get("type") || "text"),
                },
              }).then(() => {
                toast.success("Field in sandbox");
                qc.invalidateQueries({ queryKey: ["sandbox"] });
                e.currentTarget.reset();
              });
            }}
          >
            <Input name="name" placeholder="Field name" className="w-40" />
            <Input name="entity" defaultValue="deal" className="w-28" />
            <Input name="type" defaultValue="text" className="w-24" />
            <Button type="submit" size="sm">
              Add
            </Button>
          </form>
          <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
            {(data.data?.fields ?? []).map((f) => (
              <li key={f.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                <div className="min-w-0 flex-1">
                  <div>{f.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {f.entity} · {f.fieldType}
                  </div>
                </div>
                {f.promoted ? (
                  <Badge variant="success">live</Badge>
                ) : (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      promoteSandboxField({ data: { id: f.id } }).then((r) => {
                        if (!r.ok) toast.error(r.error ?? "Blocked");
                        else toast.success("Promoted to live fields");
                        qc.invalidateQueries({ queryKey: ["sandbox"] });
                        qc.invalidateQueries({ queryKey: ["fields"] });
                        qc.invalidateQueries({ queryKey: ["usage"] });
                      })
                    }
                  >
                    Promote
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="mb-3 text-sm font-medium">Automations</h2>
          <form
            className="mb-3 flex flex-wrap gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              void createSandboxAutomation({
                data: {
                  name: String(fd.get("name") || "Untitled workflow"),
                  triggerType: String(fd.get("trigger") || "deal.won"),
                  actionType: String(fd.get("action") || "activity.create"),
                },
              }).then(() => {
                toast.success("Workflow in sandbox");
                qc.invalidateQueries({ queryKey: ["sandbox"] });
                e.currentTarget.reset();
              });
            }}
          >
            <Input name="name" placeholder="Workflow name" className="w-44" />
            <Input name="trigger" defaultValue="deal.won" className="w-32" />
            <Input name="action" defaultValue="activity.create" className="w-36" />
            <Button type="submit" size="sm">
              Add
            </Button>
          </form>
          <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
            {(data.data?.automations ?? []).map((a) => (
              <li key={a.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                <div className="min-w-0 flex-1">
                  <div>{a.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {a.triggerType} → {a.actionType}
                  </div>
                </div>
                {a.promoted ? (
                  <Badge variant="success">live</Badge>
                ) : (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      promoteSandboxAutomation({ data: { id: a.id } }).then((r) => {
                        if (!r.ok) toast.error(r.error ?? "Blocked");
                        else toast.success("Promoted to live automations");
                        qc.invalidateQueries({ queryKey: ["sandbox"] });
                        qc.invalidateQueries({ queryKey: ["automations"] });
                        qc.invalidateQueries({ queryKey: ["usage"] });
                      })
                    }
                  >
                    Promote
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
