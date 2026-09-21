import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createEnvelope,
  getEsignMonitor,
  listEnvelopes,
  remindEnvelope,
  updateEnvelopeStatus,
} from "@/lib/portal/server";
import { listDocuments } from "@/lib/crm/server";

export const Route = createFileRoute("/esign")({ component: EsignPage });

function EsignPage() {
  const qc = useQueryClient();
  const envs = useQuery({ queryKey: ["envelopes"], queryFn: () => listEnvelopes() });
  const mon = useQuery({ queryKey: ["esign-monitor"], queryFn: () => getEsignMonitor() });
  const docs = useQuery({ queryKey: ["documents"], queryFn: () => listDocuments() });
  const [mode, setMode] = useState<"sequential" | "parallel">("sequential");
  const [auth, setAuth] = useState("email");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [docId, setDocId] = useState("none");
  const [q, setQ] = useState("");
  const filtered = (envs.data ?? []).filter((e) => e.name.toLowerCase().includes(q.toLowerCase()) || e.status.includes(q.toLowerCase()));

  return (
    <div className="pb-12">
      <PageHeader title="E-sign" subtitle="Envelopes, routing, watermarks, and the monitor. Signing lives on the esign host." />
      <div className="px-4 sm:px-6">
        <Tabs defaultValue="board">
          <TabsList className="flex h-auto flex-wrap">
            <TabsTrigger value="board">Dashboard</TabsTrigger>
            <TabsTrigger value="new">New request</TabsTrigger>
            <TabsTrigger value="monitor">Monitor</TabsTrigger>
          </TabsList>
          <TabsContent value="board" className="mt-4">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search envelopes" className="mb-3 max-w-xs" />
            <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
              {filtered.map((e) => (
                <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                  <div>
                    <Link to="/esign/$envelopeId" params={{ envelopeId: String(e.id) }} className="text-sm font-medium hover:underline">
                      {e.name}
                    </Link>
                    <div className="text-xs text-muted-foreground">
                      {e.mode} · {e.authMethod} · sha {e.originalSha.slice(0, 10)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={e.status === "completed" ? "success" : "steel"}>{e.status}</Badge>
                    <Button size="sm" variant="ghost" onClick={() => remindEnvelope({ data: { id: e.id } }).then(() => toast.success("Reminder queued"))}>
                      Remind
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => updateEnvelopeStatus({ data: { id: e.id, status: "void" } }).then(() => qc.invalidateQueries({ queryKey: ["envelopes"] }))}>
                      Void
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="new" className="mt-4 max-w-lg space-y-3">
            <div className="space-y-1.5">
              <Label>Document</Label>
              <Select value={docId} onValueChange={setDocId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Blank agreement</SelectItem>
                  {(docs.data ?? []).map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Routing</Label>
                <Select value={mode} onValueChange={(v) => setMode(v as "sequential" | "parallel")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sequential">Sequential</SelectItem>
                    <SelectItem value="parallel">Parallel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Authentication</Label>
                <Select value={auth} onValueChange={setAuth}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="access_code">Access code</SelectItem>
                    <SelectItem value="email_otp">Email code (2FA)</SelectItem>
                    <SelectItem value="kba">KBA</SelectItem>
                    <SelectItem value="id">ID verification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Signer name" />
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Signer email" />
            <Button
              onClick={() =>
                createEnvelope({
                  data: {
                    documentId: docId === "none" ? undefined : Number(docId),
                    mode,
                    authMethod: auth,
                    recipients: [
                      { name: name || "Signer", email: email || "client@example.com", role: "signer" },
                      { name: "Dana Okonkwo", email: "dana@northline.av", role: "countersigner" },
                    ],
                  },
                }).then((r) => {
                  toast.success("Envelope sent");
                  qc.invalidateQueries({ queryKey: ["envelopes"] });
                  if (r.id) toast.message(`Public link /sign/${docId === "none" ? r.id : docId}?envelope=${r.id}`);
                })
              }
            >
              Send for signature
            </Button>
          </TabsContent>
          <TabsContent value="monitor" className="mt-4 space-y-3">
            {(mon.data?.flags ?? []).map((f) => (
              <div key={f.id} className="rounded-xl bg-card px-4 py-3 text-sm shadow-[var(--shadow-border)]">
                <Badge variant={f.severity === "warn" ? "warn" : "outline"}>{f.severity}</Badge>
                <span className="ml-2">{f.label}</span>
              </div>
            ))}
            <ul className="divide-y divide-border rounded-xl bg-card text-sm shadow-[var(--shadow-border)]">
              {(mon.data?.envelopes ?? []).map((e) => (
                <li key={e.id} className="flex justify-between px-4 py-2.5">
                  <span>{e.name}</span>
                  <span className="text-muted-foreground">
                    {e.status} · {e.auth}
                  </span>
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
