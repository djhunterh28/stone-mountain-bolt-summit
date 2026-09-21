import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  MapPin,
  Paperclip,
  Pin,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MemberAvatar } from "@/components/crm/avatar";
import { addComment, addDealProduct, addFileMeta, getBootstrap, getDeal, sendEmail, setDealStatus, updateDeal } from "@/lib/crm/server";
import { addEventNote, draftFromDeal, listEventNotes, pinNote } from "@/lib/crm/ops";
import { cloneDeal } from "@/lib/crm/ultimate";
import { convertDealToProject, createEnvelope, createProposal } from "@/lib/portal/server";
import { runAi } from "@/lib/crm/ai";
import { useUi } from "@/lib/crm/store";
import { formatDate, formatDateTime, formatUsdFull } from "@/lib/utils";
import type { DealDetail } from "@/lib/crm/types";

export function DealWorkspace({ dealId }: { dealId: number }) {
  const qc = useQueryClient();
  const { memberId } = useUi();
  const deal = useQuery({
    queryKey: ["deal", dealId],
    queryFn: () => getDeal({ data: { id: dealId } }),
  });
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const d = deal.data;

  if (!d) {
    return (
      <div className="px-6 py-10 text-sm text-muted-foreground">
        {deal.isLoading ? "Loading show…" : "Deal not found."}
      </div>
    );
  }

  return (
    <DealBody
      d={d}
      memberId={memberId}
      members={boot.data?.members ?? []}
      products={boot.data?.products ?? []}
      lostReasons={boot.data?.lostReasons ?? []}
      onRefresh={() => {
        void qc.invalidateQueries({ queryKey: ["deal", dealId] });
        void qc.invalidateQueries({ queryKey: ["deals"] });
        void qc.invalidateQueries({ queryKey: ["insights"] });
      }}
    />
  );
}

function DealBody({
  d,
  memberId,
  members,
  products,
  lostReasons,
  onRefresh,
}: {
  d: DealDetail;
  memberId: number;
  members: { id: number; name: string }[];
  products: { id: number; name: string; unitPrice: number; unit: string }[];
  lostReasons: { id: number; name: string }[];
  onRefresh: () => void;
}) {
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [ai, setAi] = useState<string | null>(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [productId, setProductId] = useState<string>("");
  const [qty, setQty] = useState("1");
  const [loseOpen, setLoseOpen] = useState(false);
  const [lostReason, setLostReason] = useState("Budget");

  const statusMut = useMutation({
    mutationFn: (payload: { status: "won" | "lost" | "open"; lostReason?: string }) =>
      setDealStatus({ data: { id: d.id, status: payload.status, lostReason: payload.lostReason } }),
    onSuccess: () => {
      toast.success("Deal updated");
      setLoseOpen(false);
      onRefresh();
    },
  });

  async function saveComment() {
    if (!comment.trim()) return;
    await addComment({ data: { entityType: "deal", entityId: d.id, authorId: memberId, body: comment.trim() } });
    setComment("");
    onRefresh();
  }

  async function summarize() {
    setAiBusy(true);
    const res = await runAi({
      data: {
        kind: "summary",
        prompt: `Deal: ${d.title}. Value ${d.value}. Venue ${d.venue}. Event ${d.eventDate}. Stage days ${d.daysInStage}. Notes: ${d.notes}. Next activity: ${d.nextActivity}. Rotting: ${d.rotting}.`,
      },
    });
    setAiBusy(false);
    setAi(res.ok ? res.text : res.error);
  }

  const lineTotal = d.products.reduce((s, p) => s + p.qty * p.price * (1 - p.discount / 100), 0);

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] min-h-0 flex-col">
      <header className="shrink-0 border-b border-border px-4 py-4 sm:px-6">
        <Link
          to="/"
          className="mb-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Pipeline
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight text-balance">{d.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {d.orgName ?? "Independent"} {d.personName ? `· ${d.personName}` : ""}
            </p>
          </div>
          <div className="font-mono text-2xl tabular-nums">{formatUsdFull(d.value)}</div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant={d.status === "won" ? "success" : d.status === "lost" ? "danger" : "steel"}>
            {d.status}
          </Badge>
          {d.rotting && <Badge variant="warn">Rotting · {d.daysInStage}d</Badge>}
          {d.venue && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" />
              {d.venue}
            </span>
          )}
          {d.eventDate && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="size-3" />
              {formatDate(d.eventDate)}
            </span>
          )}
        </div>
        {d.status === "open" && (
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => statusMut.mutate({ status: "won" })}>
              Mark won
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setLoseOpen((v) => !v)}>
              Mark lost
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link to="/ai">AI draft</Link>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                cloneDeal({ data: { id: d.id } }).then((r) => {
                  if (r.id) {
                    toast.success("Deal duplicated");
                    void navigate({ to: "/deals/$dealId", params: { dealId: String(r.id) } });
                  }
                  onRefresh();
                })
              }
            >
              Duplicate
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                convertDealToProject({ data: { dealId: d.id } }).then((r) => {
                  if (r.ok) {
                    toast.success("Project opened");
                    void navigate({ to: "/projects/$projectId", params: { projectId: String(r.id) } });
                  }
                })
              }
            >
              Convert to project
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                createEnvelope({
                  data: {
                    dealId: d.id,
                    mode: "sequential",
                    authMethod: "email",
                    recipients: [
                      { name: d.personName ?? "Client", email: d.personEmail ?? "client@example.com", role: "signer" },
                      { name: "Dana Okonkwo", email: "dana@northline.av", role: "countersigner" },
                    ],
                  },
                }).then((r) => {
                  toast.success("Signature request sent");
                  if (r.id) void navigate({ to: "/esign/$envelopeId", params: { envelopeId: String(r.id) } });
                })
              }
            >
              Launch e-sign
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                createProposal({ data: { dealId: d.id, title: d.title, body: d.notes ?? "Production proposal." } }).then(
                  (r) => toast.success(`Proposal /p/${r.token}`),
                )
              }
            >
              Proposal
            </Button>
          </div>
        )}
        {loseOpen && (
          <form
            className="mt-3 flex flex-wrap items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              statusMut.mutate({ status: "lost", lostReason });
            }}
          >
            <Select value={lostReason} onValueChange={setLostReason}>
              <SelectTrigger className="h-9 w-52">
                <SelectValue placeholder="Lost reason" />
              </SelectTrigger>
              <SelectContent>
                {(lostReasons.length ? lostReasons : [{ id: 0, name: "Budget" }]).map((r) => (
                  <SelectItem key={r.id || r.name} value={r.name}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" type="submit">
              Confirm lost
            </Button>
          </form>
        )}
      </header>

      <Tabs defaultValue="overview" className="flex min-h-0 flex-1 flex-col">
        <div className="shrink-0 border-b border-border px-4 sm:px-6">
          <TabsList className="my-2 flex h-auto flex-wrap">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="mail">Mail</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          <div className="mx-auto w-full max-w-5xl">
          <TabsContent value="overview" className="mt-0 space-y-4">
            <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
              <Info label="Owner" value={d.ownerName ?? "—"} />
              <Info label="Source" value={d.source ?? "—"} />
              <Info label="Expected close" value={formatDate(d.expectedClose)} />
              <Info label="Probability" value={`${d.probability ?? 0}%`} />
              <Info label="Guests" value={d.guestCount ? String(d.guestCount) : "—"} />
              <Info label="Load-in" value={d.loadIn ?? "—"} />
              <Info label="Indoor" value={d.indoor == null ? "—" : d.indoor ? "Indoor" : "Outdoor"} />
              <Info label="Days in stage" value={String(d.daysInStage)} />
            </dl>
            {d.notes && <p className="text-sm text-muted-foreground">{d.notes}</p>}
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={summarize} disabled={aiBusy}>
                <Sparkles className="size-3.5" />
                {aiBusy ? "Summarizing…" : "AI summary"}
              </Button>
            </div>
            {ai && <p className="rounded-lg bg-muted p-3 text-sm leading-relaxed">{ai}</p>}
            <Separator />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Owner</Label>
                <Select
                  defaultValue={String(d.ownerId ?? "")}
                  onValueChange={(v) =>
                    updateDeal({ data: { id: d.id, ownerId: Number(v) } }).then(onRefresh)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Assign" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((m) => (
                      <SelectItem key={m.id} value={String(m.id)}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Notes</Label>
                <Textarea
                  defaultValue={d.notes ?? ""}
                  onBlur={(e) => {
                    if (e.target.value !== (d.notes ?? ""))
                      void updateDeal({ data: { id: d.id, notes: e.target.value } }).then(onRefresh);
                  }}
                />
              </div>
            </div>
            <Separator />
            <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Comments</h3>
            <ul className="space-y-3">
              {d.comments.map((c) => (
                <li key={c.id} className="flex gap-2">
                  <MemberAvatar initials={c.authorInitials ?? "?"} tone={c.authorTone} size="sm" />
                  <div>
                    <div className="text-xs text-muted-foreground">
                      {c.authorName} · {formatDateTime(c.createdAt)}
                    </div>
                    <p className="text-sm">{c.body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comment, use @name to mention"
                onKeyDown={(e) => e.key === "Enter" && void saveComment()}
              />
              <Button onClick={saveComment} variant="secondary">
                Post
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="products" className="mt-0 space-y-3">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-muted-foreground">
                <tr>
                  <th className="pb-2 font-medium">Item</th>
                  <th className="pb-2 font-medium">Qty</th>
                  <th className="pb-2 text-right font-medium">Line</th>
                </tr>
              </thead>
              <tbody>
                {d.products.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="py-2">
                      {p.name}
                      <div className="text-xs text-muted-foreground">{p.sku}</div>
                    </td>
                    <td className="py-2 tabular-nums">
                      {p.qty} {p.unit}
                    </td>
                    <td className="py-2 text-right font-mono tabular-nums">
                      {formatUsdFull(p.qty * p.price * (1 - p.discount / 100))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Catalog total</span>
              <span className="font-mono tabular-nums">{formatUsdFull(lineTotal)}</span>
            </div>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!productId) return;
                void addDealProduct({ data: { dealId: d.id, productId: Number(productId), qty: Number(qty || 1) } }).then(onRefresh);
              }}
            >
              <Select value={productId} onValueChange={setProductId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Add from catalog" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input value={qty} onChange={(e) => setQty(e.target.value)} type="number" className="w-20" />
              <Button type="submit" variant="secondary">
                Add
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="activity" className="mt-0 space-y-3">
            {d.activities.length === 0 && <p className="text-sm text-muted-foreground">No activities yet.</p>}
            {d.activities.map((a) => (
              <div key={a.id} className="flex gap-3 rounded-lg bg-muted p-3">
                <Clock className="mt-0.5 size-4 text-muted-foreground" />
                <div className="min-w-0">
                  <div className="text-sm">
                    {a.subject}
                    {a.done && (
                      <Badge variant="success" className="ml-2">
                        Done
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {a.type} · {formatDateTime(a.dueAt)} · {a.ownerName}
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="files" className="mt-0 space-y-3">
            {d.files.map((f) => (
              <div key={f.id} className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
                <Paperclip className="size-4 text-muted-foreground" />
                <span className="flex-1 truncate">{f.name}</span>
                <span className="text-xs text-muted-foreground">{f.sizeKb} kb</span>
              </div>
            ))}
            {d.documents.map((doc) => (
              <div key={doc.id} className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
                <FileText className="size-4 text-muted-foreground" />
                <span className="flex-1 truncate">{doc.name}</span>
                <Badge variant="outline">{doc.status}</Badge>
              </div>
            ))}
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                addFileMeta({
                  data: {
                    entityType: "deal",
                    entityId: d.id,
                    name: `plot_v${d.files.length + 1}.pdf`,
                    uploadedBy: memberId,
                  },
                }).then(onRefresh)
              }
            >
              Attach plot PDF
            </Button>
          </TabsContent>

          <TabsContent value="mail" className="mt-0 space-y-3">
            {d.emails.map((e) => (
              <div key={e.id} className="rounded-lg bg-muted p-3">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="font-medium">{e.subject}</span>
                  <span className="text-xs text-muted-foreground">{formatDateTime(e.sentAt ?? e.createdAt)}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {e.fromName} → {e.toAddr}
                  {e.opened ? " · opened" : ""}
                  {e.clicked ? " · clicked" : ""}
                </p>
                <p className="mt-2 text-sm">{e.body}</p>
              </div>
            ))}
            <Compose deal={d} memberId={memberId} onSent={onRefresh} />
          </TabsContent>

          <TabsContent value="notes" className="mt-0">
            <EventNotesPanel dealId={d.id} />
          </TabsContent>

          <TabsContent value="history" className="mt-0 space-y-3">
            {(d.history ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground">No history yet — moves and status changes land here.</p>
            )}
            {(d.history ?? []).map((h) => (
              <div key={h.id} className="flex gap-3 border-b border-border pb-3 last:border-0">
                <div className="min-w-0 flex-1">
                  <div className="text-sm">
                    {h.actor} <span className="text-muted-foreground">{h.action}</span>
                  </div>
                  {h.detail && <p className="text-xs text-muted-foreground">{h.detail}</p>}
                </div>
                <span className="text-xs text-muted-foreground">{formatDateTime(h.createdAt)}</span>
              </div>
            ))}
            {d.lostReason && (
              <p className="text-sm">
                Lost reason: <span className="font-medium">{d.lostReason}</span>
              </p>
            )}
          </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

function EventNotesPanel({ dealId }: { dealId: number }) {
  const qc = useQueryClient();
  const notes = useQuery({
    queryKey: ["event-notes", dealId],
    queryFn: () => listEventNotes({ data: { dealId } }),
  });
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("production");

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Pinned, categorized notes live on the event — not a side document.
      </p>
      <form
        className="space-y-2 rounded-lg border border-border p-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!body.trim()) return;
          void addEventNote({ data: { dealId, body: body.trim(), category } }).then(() => {
            setBody("");
            toast.success("Note on the event");
            qc.invalidateQueries({ queryKey: ["event-notes", dealId] });
          });
        }}
      >
        <div className="flex flex-wrap gap-2">
          <select
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="production">Production</option>
            <option value="client">Client</option>
            <option value="labor">Labor</option>
            <option value="site">Site</option>
          </select>
          <Button type="submit" size="sm">
            Add note
          </Button>
        </div>
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Load-in, power, talent, holds…"
          rows={4}
        />
      </form>
      <ul className="space-y-2">
        {(notes.data ?? []).map((n) => (
          <li key={n.id} className="rounded-lg bg-muted p-3">
            <div className="flex items-center gap-2">
              <Badge variant={n.pinned ? "steel" : "outline"}>{n.category}</Badge>
              {n.pinned && <Pin className="size-3 text-muted-foreground" />}
              <span className="flex-1 text-xs text-muted-foreground">
                {n.author} · {formatDateTime(n.createdAt)}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  pinNote({ data: { id: n.id, pinned: !n.pinned } }).then(() =>
                    qc.invalidateQueries({ queryKey: ["event-notes", dealId] }),
                  )
                }
              >
                {n.pinned ? "Unpin" : "Pin"}
              </Button>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm">{n.body}</p>
          </li>
        ))}
        {(notes.data ?? []).length === 0 && (
          <p className="text-sm text-muted-foreground">No event notes yet.</p>
        )}
      </ul>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function Compose({
  deal,
  memberId,
  onSent,
}: {
  deal: DealDetail;
  memberId: number;
  onSent: () => void;
}) {
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const me = boot.data?.members.find((m) => m.id === memberId);
  const [subject, setSubject] = useState(`Following up — ${deal.title}`);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  async function draft() {
    setBusy(true);
    const res = await draftFromDeal({
      data: { dealId: deal.id, prompt: subject || "Follow up on load-in and next steps." },
    });
    setBusy(false);
    if (res.ok) {
      setBody(res.body);
      toast.success("Draft ready — still yours to send");
    } else toast.error(res.error);
  }

  async function send() {
    if (!me) return;
    await sendEmail({
      data: {
        fromName: me.name,
        fromAddr: me.email,
        toAddr: deal.personEmail ?? "client@example.com",
        subject,
        body,
        dealId: deal.id,
      },
    });
    toast.success("Queued to sent (tracked)");
    setBody("");
    onSent();
  }

  return (
    <div className="space-y-2 rounded-lg border border-border p-3">
      <div className="flex items-center justify-between">
        <Label>Compose</Label>
        <Button size="sm" variant="ghost" onClick={draft} disabled={busy}>
          <Sparkles className="size-3.5" />
          {busy ? "Drafting…" : "One-click AI draft"}
        </Button>
      </div>
      <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
      <Textarea rows={5} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Message" />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Users className="size-3" />
          Open & click tracking on · merge tags filled
        </span>
        <Button size="sm" onClick={send} disabled={!body}>
          Send
        </Button>
      </div>
    </div>
  );
}
