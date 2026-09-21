import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listSequences, toggleSequence, listPeople } from "@/lib/crm/server";
import { enrollSequence, listEnrollments } from "@/lib/crm/ultimate";

export const Route = createFileRoute("/sequences")({ component: SequencesPage });

function SequencesPage() {
  const list = useQuery({ queryKey: ["sequences"], queryFn: () => listSequences() });
  const people = useQuery({ queryKey: ["people"], queryFn: () => listPeople() });
  const enrolls = useQuery({ queryKey: ["enrollments"], queryFn: () => listEnrollments() });
  const qc = useQueryClient();
  const [seqId, setSeqId] = useState<string>("");
  const [personId, setPersonId] = useState<string>("");
  return (
    <div className="pb-12">
      <PageHeader
        title="Pulse sequences"
        subtitle="Multi-step cadences. Ultimate allows 50 sequences per company."
      />
      <form
        className="mx-4 mb-6 flex flex-wrap items-end gap-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:mx-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (!seqId || !personId) return;
          void enrollSequence({ data: { sequenceId: Number(seqId), personId: Number(personId) } }).then(() => {
            toast.success("Enrolled");
            qc.invalidateQueries({ queryKey: ["sequences"] });
            qc.invalidateQueries({ queryKey: ["enrollments"] });
          });
        }}
      >
        <Select value={seqId} onValueChange={setSeqId}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Sequence" />
          </SelectTrigger>
          <SelectContent>
            {(list.data ?? []).map((s) => (
              <SelectItem key={s.id} value={String(s.id)}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={personId} onValueChange={setPersonId}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Person" />
          </SelectTrigger>
          <SelectContent>
            {(people.data ?? []).map((p) => (
              <SelectItem key={p.id} value={String(p.id)}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" size="sm">
          Enroll
        </Button>
      </form>
      <div className="grid gap-3 px-4 sm:px-6 lg:grid-cols-2">
        {(list.data ?? []).map((s) => (
          <article key={s.id} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-medium">{s.name}</h2>
                <p className="text-xs text-muted-foreground">{s.enrolled} enrolled</p>
              </div>
              <Switch
                checked={s.active}
                onCheckedChange={(v) =>
                  toggleSequence({ data: { id: s.id, active: v } }).then(() =>
                    qc.invalidateQueries({ queryKey: ["sequences"] }),
                  )
                }
              />
            </div>
            <ol className="mt-4 space-y-2">
              {s.steps.map((step, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <Badge variant="outline">Day {step.day}</Badge>
                  <span className="text-muted-foreground">{step.channel}</span>
                  <span>{step.title}</span>
                </li>
              ))}
            </ol>
            <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
              {(enrolls.data ?? [])
                .filter((e) => e.sequenceId === s.id)
                .map((e) => (
                  <li key={e.id}>
                    {e.personName} · step {e.stepIndex + 1} · {e.status}
                  </li>
                ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
