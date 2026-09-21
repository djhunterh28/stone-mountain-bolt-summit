import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUi } from "@/lib/crm/store";
import { runAi } from "@/lib/crm/ai";
import { toast } from "sonner";

const PROMPTS = [
  "Which rotting shows should we hit today?",
  "Draft a recost note for Citadel's wider LED wall.",
  "What is at risk if 1 Hotel slips the countersign?",
];

export function AssistantPanel() {
  const { assistantOpen, setAssistantOpen } = useUi();
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function ask(text: string) {
    const prompt = text.trim();
    if (!prompt) return;
    setBusy(true);
    const res = await runAi({ data: { kind: "assistant", prompt } });
    setBusy(false);
    if (res.ok) setAnswer(res.text);
    else toast.error(res.error);
  }

  return (
    <Sheet open={assistantOpen} onOpenChange={setAssistantOpen}>
      <SheetContent className="w-full max-w-md p-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="size-4" />
            Sales copilot
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-4 px-5 py-4">
          <p className="text-sm text-muted-foreground">
            Ask about the live-events book. Answers use this week’s pipeline — never auto-fires.
          </p>
          <div className="flex flex-col gap-2">
            {PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                className="rounded-lg bg-muted px-3 py-2 text-left text-sm hover:bg-accent"
                onClick={() => {
                  setQ(p);
                  void ask(p);
                }}
              >
                {p}
              </button>
            ))}
          </div>
          <Textarea
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ask the copilot…"
            rows={3}
          />
          <Button onClick={() => void ask(q)} disabled={busy}>
            {busy ? "Thinking…" : "Ask"}
          </Button>
          {answer && <p className="rounded-lg bg-muted p-3 text-sm leading-relaxed">{answer}</p>}
        </div>
      </SheetContent>
    </Sheet>
  );
}
