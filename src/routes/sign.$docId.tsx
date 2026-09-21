import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getDocumentPublic } from "@/lib/crm/ultimate";
import { advanceDocument } from "@/lib/crm/server";
import { getEnvelopePublic, signEnvelope } from "@/lib/portal/server";

type Search = { envelope?: string };

export const Route = createFileRoute("/sign/$docId")({
  component: PublicSign,
  validateSearch: (s: Record<string, unknown>): Search => ({
    envelope: typeof s.envelope === "string" ? s.envelope : undefined,
  }),
});

function PublicSign() {
  const { docId } = Route.useParams();
  const { envelope } = Route.useSearch();
  const id = Number(docId);
  const envId = envelope ? Number(envelope) : id;
  const doc = useQuery({ queryKey: ["pubdoc", id], queryFn: () => getDocumentPublic({ data: { id } }) });
  const env = useQuery({
    queryKey: ["pubenv", envId],
    queryFn: () => getEnvelopePublic({ data: { id: envId } }),
    enabled: Number.isFinite(envId),
  });
  const [step, setStep] = useState<"review" | "consent" | "fields" | "sign" | "done">("review");
  const [name, setName] = useState("");
  const [draw, setDraw] = useState("");
  const [code, setCode] = useState("");
  const d = doc.data;
  const e = env.data;
  const title = e?.name ?? d?.name ?? "Document";

  async function finish() {
    if (e) {
      const rec = e.recipients.find((r) => r.status !== "signed") ?? e.recipients[0];
      if (!rec) return;
      const r = await signEnvelope({
        data: { id: e.id, recipientId: rec.id, signature: draw || name, accessCode: code || undefined },
      });
      if (!r.ok) {
        toast.error(r.error);
        return;
      }
    } else if (d) {
      await advanceDocument({ data: { id: d.id, action: "sign" } });
    }
    setStep("done");
    toast.success("Signed. Countersignature may still be required.");
  }

  return (
    <div className="mx-auto min-h-dvh max-w-lg px-5 py-12">
      <div className="mb-8 flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="size-6 text-primary" aria-hidden>
          <rect x="4" y="5" width="3.2" height="14" rx="0.6" fill="currentColor" />
          <rect x="9.4" y="8" width="3.2" height="11" rx="0.6" fill="currentColor" opacity="0.7" />
          <rect x="14.8" y="3" width="3.2" height="16" rx="0.6" fill="currentColor" />
        </svg>
        <span className="text-sm font-semibold">Northline · E-sign</span>
      </div>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <Badge variant={step === "done" ? "success" : "outline"}>{step === "done" ? "signed" : e?.status ?? d?.status}</Badge>
      </div>
      {e && (
        <p className="mt-1 text-xs text-muted-foreground">
          {e.mode} · {e.authMethod} · watermark {e.watermark} · sha {e.originalSha.slice(0, 10)}
        </p>
      )}

      {step === "review" && (
        <div className="mt-6 space-y-4">
          <div className="relative overflow-hidden rounded-xl bg-card p-5 text-sm leading-relaxed shadow-[var(--shadow-border)]">
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-3xl font-semibold tracking-[0.25em] text-foreground/10 uppercase" style={{ transform: "rotate(-16deg)" }}>
              {e?.watermark ?? "CONFIDENTIAL"}
            </div>
            <p className="relative">{e?.content ?? d?.content ?? "Production agreement terms."}</p>
          </div>
          {e?.authMethod === "access_code" && (
            <div className="space-y-1">
              <Label>Access code</Label>
              <Input value={code} onChange={(ev) => setCode(ev.target.value)} />
            </div>
          )}
          <Button onClick={() => setStep("consent")}>Continue</Button>
        </div>
      )}

      {step === "consent" && (
        <div className="mt-6 space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            By continuing you consent to use electronic records and signatures under the ESIGN Act, receive consumer
            disclosures electronically, and agree this envelope is tamper-evident via SHA-256.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => setStep("fields")}>I consent</Button>
            <Button variant="ghost" onClick={() => setStep("review")}>
              Back
            </Button>
          </div>
        </div>
      )}

      {step === "fields" && (
        <div className="mt-6 space-y-3">
          {(e?.fields ?? [{ id: 0, kind: "name" }]).map((f) => (
            <div key={f.id} className="space-y-1">
              <Label className="capitalize">{f.kind}</Label>
              <Input placeholder={f.kind} onChange={(ev) => f.kind === "name" && setName(ev.target.value)} />
            </div>
          ))}
          <Button onClick={() => setStep("sign")}>Continue to signature</Button>
        </div>
      )}

      {step === "sign" && (
        <form
          className="mt-6 space-y-3"
          onSubmit={(ev) => {
            ev.preventDefault();
            void finish();
          }}
        >
          <div className="space-y-1">
            <Label>Type your name</Label>
            <Input value={name} onChange={(ev) => setName(ev.target.value)} required />
          </div>
          <div className="space-y-1">
            <Label>Or draw initials</Label>
            <Input value={draw} onChange={(ev) => setDraw(ev.target.value)} placeholder="Draw / type a mark" />
          </div>
          <p className="text-xs text-muted-foreground">
            After you sign, authorized Hurricane staff must countersign before completion.
          </p>
          <Button type="submit" disabled={name.trim().length < 2}>
            Sign and confirm
          </Button>
        </form>
      )}

      {step === "done" && (
        <p className="mt-6 text-sm text-muted-foreground">
          Executed. An audit certificate with original and signed hashes is on file. Lookup with Document ID + password on the esign host.
        </p>
      )}
    </div>
  );
}
