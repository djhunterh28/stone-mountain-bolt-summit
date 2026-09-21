import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { listChatbots, toggleChatbot } from "@/lib/crm/ultimate";

export const Route = createFileRoute("/chatbot")({ component: ChatbotPage });

function ChatbotPage() {
  const flows = useQuery({ queryKey: ["chatbots"], queryFn: () => listChatbots() });
  const qc = useQueryClient();
  return (
    <div className="pb-12">
      <PageHeader
        title="Chatbot"
        subtitle="LeadBooster qualifier. Asks date, venue, headcount, then hands to New Business."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="secondary">
              <Link to="/inbox">Open live inbox</Link>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link to="/w/$slug" params={{ slug: "northline" }}>Site widget</Link>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link to="/ai">Company AI profile</Link>
            </Button>
          </div>
        }
      />
      <div className="grid gap-3 px-4 sm:px-6 lg:grid-cols-2">
        {(flows.data ?? []).map((f) => (
          <article key={f.id} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-medium">{f.name}</h2>
                <p className="text-xs text-muted-foreground">{f.conversations} conversations</p>
              </div>
              <Switch
                checked={f.active}
                onCheckedChange={(v) =>
                  toggleChatbot({ data: { id: f.id, active: v } }).then(() =>
                    qc.invalidateQueries({ queryKey: ["chatbots"] }),
                  )
                }
              />
            </div>
            <ol className="mt-4 space-y-2">
              {f.steps.map((s, i) => (
                <li key={s.id} className="flex gap-3 text-sm">
                  <Badge variant="outline">{i + 1}</Badge>
                  <span>{s.prompt}</span>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </div>
      <pre className="mx-4 mt-6 overflow-x-auto rounded-xl bg-card p-4 font-mono text-xs shadow-[var(--shadow-border)] sm:mx-6">{`<script src="https://northline.av/w/northline" async></script>`}</pre>
    </div>
  );
}
