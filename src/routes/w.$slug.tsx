import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getPublicWidget, widgetAsk } from "@/lib/crm/ops";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/w/$slug")({ component: Widget });

function Widget() {
  const { slug } = Route.useParams();
  const profile = useQuery({ queryKey: ["public-widget", slug], queryFn: () => getPublicWidget({ data: { slug } }) });
  const greeting = profile.data?.greeting ?? "Hurricane Productions — LED, audio, and labor for live events in New York. What date are you holding?";
  const company = profile.data?.company ?? "Hurricane Productions";
  const color = `#${profile.data?.brandColor ?? "0D47A1"}`;
  const [open, setOpen] = useState(true);
  const [q, setQ] = useState("");
  const [log, setLog] = useState<{ role: "you" | "nl"; text: string }[] | null>(null);
  const messages = log ?? [{ role: "nl" as const, text: greeting }];
  return (
    <div className="min-h-dvh bg-background p-6">
      <p className="mb-4 text-xs text-muted-foreground">Embed preview · /w/{slug}</p>
      {(profile.data?.held ?? []).length > 0 && (
        <p className="mb-4 max-w-sm text-xs text-muted-foreground">Live holds: {profile.data?.held.join(" · ")}</p>
      )}
      <div className="fixed right-4 bottom-4 z-20 w-[min(22rem,calc(100vw-2rem))]">
        {open && (
          <div className="mb-2 overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]">
            <div className="border-b border-border px-3 py-2 text-sm font-medium" style={{ color }}>{company}</div>
            <ul className="max-h-72 space-y-2 overflow-y-auto p-3 text-sm">
              {messages.map((m, i) => (
                <li key={i} className={m.role === "you" ? "text-right" : ""}>
                  <span className="inline-block max-w-[90%] rounded-lg bg-muted px-2 py-1.5 text-left">{m.text}</span>
                </li>
              ))}
            </ul>
            <form
              className="flex gap-2 border-t border-border p-2"
              onSubmit={(e) => {
                e.preventDefault();
                const question = q.trim();
                if (!question) return;
                setLog((l) => [...(l ?? messages), { role: "you", text: question }]);
                setQ("");
                void widgetAsk({ data: { question, visitor: "embed" } }).then((r) => {
                  setLog((prev) => [...(prev ?? []), { role: "nl", text: r.lead ? `${r.answer} I logged this as a lead.` : r.answer }]);
                });
              }}
            >
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask about dates or packages" />
              <Button type="submit" size="sm" className="text-white" style={{ background: color }}>Send</Button>
            </form>
          </div>
        )}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="ml-auto flex size-12 items-center justify-center rounded-full text-white shadow-[var(--shadow-border)]"
          style={{ background: color }}
        >
          {open ? "×" : "AI"}
        </button>
      </div>
    </div>
  );
}