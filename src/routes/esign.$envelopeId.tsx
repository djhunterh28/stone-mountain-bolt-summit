import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { addEnvelopeField, getEnvelope, remindEnvelope, updateEnvelopeStatus } from "@/lib/portal/server";

export const Route = createFileRoute("/esign/$envelopeId")({ component: EnvelopePage });

function EnvelopePage() {
  const { envelopeId } = Route.useParams();
  const id = Number(envelopeId);
  const qc = useQueryClient();
  const env = useQuery({ queryKey: ["envelope", id], queryFn: () => getEnvelope({ data: { id } }) });
  const e = env.data;
  if (!e) return <p className="p-6 text-sm text-muted-foreground">{env.isLoading ? "Loading…" : "Not found."}</p>;

  return (
    <div className="pb-12">
      <div className="flex items-center gap-3 border-b border-border px-4 py-4 sm:px-6">
        <Button asChild size="icon-sm" variant="ghost">
          <Link to="/esign">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold">{e.name}</h1>
          <p className="text-xs text-muted-foreground">
            {e.mode} · {e.authMethod} · original {e.originalSha.slice(0, 12)}
            {e.signedSha ? ` · signed ${e.signedSha.slice(0, 12)}` : ""}
          </p>
        </div>
        <Badge variant={e.status === "completed" ? "success" : "steel"}>{e.status}</Badge>
      </div>
      <div className="grid gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative min-h-96 overflow-hidden rounded-xl bg-card p-8 shadow-[var(--shadow-border)]">
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-4xl font-semibold tracking-[0.3em] text-foreground/10 uppercase" style={{ transform: "rotate(-18deg)" }}>
            {e.watermark}
          </div>
          <p className="relative text-sm leading-relaxed">{e.content}</p>
          {e.fields.map((f) => (
            <div
              key={f.id}
              className="absolute rounded-sm border border-dashed border-primary/50 bg-background/80 px-2 py-1 text-[10px]"
              style={{ left: `${f.x}%`, top: `${f.y}%` }}
            >
              {f.kind}
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Recipients</h2>
          <ul className="space-y-2 text-sm">
            {e.recipients.map((r) => (
              <li key={r.id} className="flex justify-between rounded-lg bg-card px-3 py-2 shadow-[var(--shadow-border)]">
                <span>
                  {r.routingOrder}. {r.name}
                  <span className="block text-xs text-muted-foreground">
                    {r.role} · {r.email}
                  </span>
                </span>
                <Badge variant={r.status === "signed" ? "success" : "outline"}>{r.status}</Badge>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => remindEnvelope({ data: { id } }).then(() => toast.success("Reminder sent"))}>
              Resend reminder
            </Button>
            <Button size="sm" variant="ghost" onClick={() => updateEnvelopeStatus({ data: { id, status: "void" } }).then(() => qc.invalidateQueries({ queryKey: ["envelope", id] }))}>
              Void
            </Button>
            <Button asChild size="sm">
              <Link to="/sign/$docId" params={{ docId: String(e.documentId ?? id) }} search={{ envelope: String(id) } as never}>
                Open signing page
              </Link>
            </Button>
          </div>
          <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Place field</h2>
          <div className="flex flex-wrap gap-2">
            {["signature", "initial", "date", "name", "company", "title", "email", "checkbox", "note"].map((kind) => (
              <Button
                key={kind}
                size="sm"
                variant="ghost"
                onClick={() =>
                  addEnvelopeField({
                    data: { envelopeId: id, kind, x: 18 + Math.random() * 40, y: 70 + Math.random() * 15, recipientId: e.recipients[0]?.id },
                  }).then(() => qc.invalidateQueries({ queryKey: ["envelope", id] }))
                }
              >
                {kind}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            ESIGN Act consent, consumer disclosures, and the audit certificate freeze at send. Tamper evidence is SHA-256 of original and signed bytes.
          </p>
        </div>
      </div>
    </div>
  );
}
