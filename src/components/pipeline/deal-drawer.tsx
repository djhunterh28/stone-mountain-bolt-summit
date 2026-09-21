import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Mail,
  MapPin,
  MoreHorizontal,
  Paperclip,
  Phone,
  Pin,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MemberAvatar } from "@/components/crm/avatar";
import { DealStageStrip } from "@/components/crm/lifecycle";
import {
  addComment,
  addDealProduct,
  addFileMeta,
  createActivity,
  getBootstrap,
  getDeal,
  moveDeal,
  sendEmail,
  setDealStatus,
  toggleActivity,
  updateDeal,
} from "@/lib/crm/server";
import { addEventNote, draftFromDeal, listEventNotes, pinNote, updateEventNote } from "@/lib/crm/ops";
import { NoteHtml, NOTE_CATEGORIES, notePlain, RichTextEditor, sanitizeNoteHtml } from "@/components/crm/rich-text";
import { FloorPlanDesk } from "@/components/crm/floor-plan-desk";
import { cloneDeal } from "@/lib/crm/ultimate";
import { convertDealToProject, createEnvelope, createProposal } from "@/lib/portal/server";
import { runAi } from "@/lib/crm/ai";
import { useUi } from "@/lib/crm/store";
import { cn, formatDate, formatDateTime, formatUsdFull } from "@/lib/utils";
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
      eventTypes={boot.data?.eventTypes ?? []}
      stages={(boot.data?.pipelines.find((p) => p.id === d.pipelineId) ?? boot.data?.pipelines[0])?.stages ?? []}
      onRefresh={() => {
        void qc.invalidateQueries({ queryKey: ["deal", dealId] });
        void qc.invalidateQueries({ queryKey: ["deals"] });
        void qc.invalidateQueries({ queryKey: ["insights"] });
        void qc.invalidateQueries({ queryKey: ["lifecycle"] });
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
  eventTypes,
  stages,
  onRefresh,
}: {
  d: DealDetail;
  memberId: number;
  members: { id: number; name: string }[];
  products: { id: number; name: string; unitPrice: number; unit: string }[];
  lostReasons: { id: number; name: string; kind?: string }[];
  eventTypes: { id: number; name: string }[];
  stages: { id: number; name: string }[];
  onRefresh: () => void;
}) {
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [ai, setAi] = useState<string | null>(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [productId, setProductId] = useState<string>("");
  const [qty, setQty] = useState("1");
  const [loseOpen, setLoseOpen] = useState<"lost" | "cancelled" | null>(null);
  const [lostReason, setLostReason] = useState("Budget");
  const [pane, setPane] = useState<"activity" | "notes" | "email" | "files" | "invoice" | "floor">("activity");
  const [hist, setHist] = useState<"all" | "activity" | "note" | "email" | "file" | "invoice" | "log">("all");
  const [more, setMore] = useState(false);
  const [actSubject, setActSubject] = useState("");
  const [actType, setActType] = useState("task");
  const [focusOpen, setFocusOpen] = useState(true);
  const [histOpen, setHistOpen] = useState(true);

  const statusMut = useMutation({
    mutationFn: (payload: { status: "won" | "lost" | "cancelled" | "open"; lostReason?: string }) =>
      setDealStatus({ data: { id: d.id, status: payload.status, lostReason: payload.lostReason } }),
    onSuccess: () => {
      toast.success("Deal updated");
      setLoseOpen(null);
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
  const stageName = stages.find((s) => s.id === d.stageId)?.name ?? "Pipeline";
  const missing: { label: string; hint: string }[] = [];
  if (!d.personName) missing.push({ label: "Client facing — project name", hint: "Portal" });
  if (!d.venue) missing.push({ label: "Venue", hint: "Required for load-in" });
  if (!d.eventDate) missing.push({ label: "Event date", hint: "On the calendar" });
  if (!d.expectedClose) missing.push({ label: "Expected close", hint: "Set expected close date" });
  if (d.value === 0) missing.push({ label: "Value", hint: "$0 on the book" });

  const feed = useMemo(() => {
    type Item = { id: string; kind: "activity" | "note" | "email" | "file" | "invoice" | "log"; at: string; title: string; detail: string; meta?: string };
    const items: Item[] = [];
    for (const a of d.activities) {
      items.push({
        id: `a${a.id}`,
        kind: "activity",
        at: a.dueAt ?? a.createdAt ?? "",
        title: a.subject,
        detail: a.notes ?? a.type,
        meta: `${a.type} · ${a.ownerName ?? ""}${a.done ? " · done" : ""}`,
      });
    }
    for (const c of d.comments) {
      items.push({
        id: `c${c.id}`,
        kind: "note",
        at: c.createdAt,
        title: c.authorName ?? "Note",
        detail: c.body,
        meta: "note",
      });
    }
    for (const e of d.emails) {
      items.push({
        id: `e${e.id}`,
        kind: "email",
        at: e.sentAt ?? e.createdAt,
        title: e.subject,
        detail: e.body,
        meta: `${e.fromName} → ${e.toAddr}${e.opened ? " · opened" : ""}`,
      });
    }
    for (const f of d.files) {
      items.push({
        id: `f${f.id}`,
        kind: "file",
        at: f.createdAt ?? d.updatedAt,
        title: f.name,
        detail: `${f.sizeKb} kb`,
        meta: "file",
      });
    }
    for (const doc of d.documents) {
      items.push({
        id: `d${doc.id}`,
        kind: "invoice",
        at: d.updatedAt,
        title: doc.name,
        detail: doc.status,
        meta: "document",
      });
    }
    for (const h of d.history ?? []) {
      items.push({
        id: `h${h.id}`,
        kind: "log",
        at: h.createdAt,
        title: `${h.actor} ${h.action}`,
        detail: h.detail ?? "",
        meta: "changelog",
      });
    }
    items.sort((a, b) => (a.at < b.at ? 1 : -1));
    return hist === "all" ? items : items.filter((i) => i.kind === hist);
  }, [d, hist]);

  const upcoming = d.activities.filter((a) => !a.done);

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] min-h-0 flex-col bg-background">
      <header className="shrink-0 border-b border-border bg-card px-4 pt-3 pb-0 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <Link to="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-3.5" />
              Deals
            </Link>
            <h1 className="mt-1 truncate text-2xl font-semibold tracking-tight">{d.title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={String(d.ownerId ?? "")}
              onValueChange={(v) => updateDeal({ data: { id: d.id, ownerId: Number(v) } }).then(onRefresh)}
            >
              <SelectTrigger className="h-9 w-48">
                <SelectValue placeholder="Owner" />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m.id} value={String(m.id)}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {d.status === "open" ? (
              <>
                <Button size="sm" className="bg-success text-primary-foreground hover:bg-success/90" onClick={() => statusMut.mutate({ status: "won" })}>
                  Won
                </Button>
                <Button
                  size="sm"
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => {
                    setLoseOpen((v) => (v === "lost" ? null : "lost"));
                    setLostReason(lostReasons.find((r) => r.kind !== "cancelled")?.name ?? "Budget");
                  }}
                >
                  Lost
                </Button>
              </>
            ) : (
              <Badge variant={d.status === "won" ? "success" : d.status === "lost" ? "danger" : "warn"}>{d.status}</Badge>
            )}
            <Button size="sm" variant="ghost" onClick={() => setMore((v) => !v)}>
              <MoreHorizontal className="size-4" />
            </Button>
          </div>
        </div>
        {more && (
          <div className="mt-2 flex flex-wrap gap-1 pb-2">
            <Button size="sm" variant="ghost" asChild>
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
              Create project
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
                createProposal({ data: { dealId: d.id, title: d.title, body: d.notes ?? "Production proposal." } }).then((r) =>
                  toast.success(`Proposal /p/${r.token}`),
                )
              }
            >
              Proposal
            </Button>
            {d.status === "open" && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setLoseOpen((v) => (v === "cancelled" ? null : "cancelled"));
                  setLostReason(lostReasons.find((r) => r.kind === "cancelled")?.name ?? "Event cancelled");
                }}
              >
                Event cancelled
              </Button>
            )}
            {(d.status === "lost" || d.status === "cancelled") && (
              <Button size="sm" variant="secondary" onClick={() => statusMut.mutate({ status: "open" })}>
                Reopen
              </Button>
            )}
          </div>
        )}
        {loseOpen && (
          <form
            className="mt-2 flex flex-wrap items-center gap-2 pb-2"
            onSubmit={(e) => {
              e.preventDefault();
              statusMut.mutate({ status: loseOpen, lostReason });
            }}
          >
            <Select value={lostReason} onValueChange={setLostReason}>
              <SelectTrigger className="h-9 w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(
                  (lostReasons.length ? lostReasons : [{ id: 0, name: "Budget", kind: "lost" as const }]).filter((r) =>
                    loseOpen === "cancelled" ? r.kind === "cancelled" : r.kind !== "cancelled",
                  )
                ).map((r) => (
                  <SelectItem key={r.id || r.name} value={r.name}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" type="submit">
              {loseOpen === "cancelled" ? "Confirm cancelled" : "Confirm lost"}
            </Button>
          </form>
        )}
        <div className="mt-3 -mx-4 sm:-mx-6">
          <DealStageStrip
            stages={stages}
            stageId={d.stageId}
            status={d.status}
            daysInStage={d.daysInStage}
            onStage={(id) =>
              moveDeal({ data: { id: d.id, stageId: id } }).then(() => {
                toast.success("Stage updated");
                onRefresh();
              })
            }
            onWon={() => statusMut.mutate({ status: "won" })}
            onLost={() => {
              setLoseOpen("lost");
              setLostReason(lostReasons.find((r) => r.kind !== "cancelled")?.name ?? "Budget");
            }}
          />
        </div>
        <p className="py-2 text-xs text-muted-foreground">
          Pipeline → <span className="text-foreground">{stageName}</span>
          {d.lostReason ? ` · ${d.lostReason}` : ""}
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="border-b border-border bg-card px-4 py-3 lg:hidden">
          <p className="text-sm">
            {d.venue ?? "No venue"} · {d.eventDate ? formatDate(d.eventDate) : "No date"} · {formatUsdFull(d.value)}
          </p>
          {d.personName && (
            <p className="text-xs text-muted-foreground">
              {d.personName} · {d.orgName}
            </p>
          )}
        </div>
        <div className="flex min-h-0 flex-1">
        <aside className="hidden w-72 shrink-0 overflow-y-auto border-r border-border bg-card lg:block">
          {missing.length > 0 && (
            <section className="border-l-2 border-destructive px-4 py-3">
              <h2 className="text-xs font-medium tracking-wide uppercase">Please fill</h2>
              <ul className="mt-2 space-y-2 text-sm">
                {missing.map((m) => (
                  <li key={m.label}>
                    <span className="text-destructive">• </span>
                    {m.label}
                    <span className="block pl-3 text-xs text-muted-foreground">{m.hint}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section className="border-b border-border px-4 py-3">
            <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Summary</h2>
            <ul className="mt-3 space-y-2.5 text-sm">
              <li className="flex gap-2">
                <Calendar className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                <span>{d.eventDate ? formatDate(d.eventDate) : "Set event date"}</span>
              </li>
              <li className="flex gap-2">
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                <span className="text-primary">{d.venue ?? "Add venue"}</span>
              </li>
              {d.eventType && (
                <li className="flex gap-2">
                  <span className="mt-0.5 size-3.5 shrink-0 text-center text-xs text-muted-foreground">T</span>
                  {d.eventType}
                </li>
              )}
              <li className="flex gap-2">
                <Calendar className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                <span>{d.expectedClose ? formatDate(d.expectedClose) : "Set expected close date"}</span>
              </li>
              <li>
                {d.orgName ?? "Independent"}
                {d.personName ? (
                  <Link to="/contacts/$personId" params={{ personId: String(d.personId) }} className="mt-0.5 block text-primary">
                    {d.personName}
                  </Link>
                ) : (
                  <span className="mt-0.5 block text-muted-foreground">+ Person</span>
                )}
              </li>
              <li className="flex flex-wrap gap-1">
                {d.rotting && <Badge variant="danger">Estimate expired</Badge>}
                {d.eventType && <Badge variant="steel">{d.eventType}</Badge>}
                <Badge variant="outline">{formatUsdFull(d.value)}</Badge>
              </li>
            </ul>
          </section>
          <section className="border-b border-border px-4 py-3">
            <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">E-sign</h2>
            <p className="mt-1 text-xs text-muted-foreground">Contracts on this show.</p>
            <Button
              size="sm"
              variant="secondary"
              className="mt-2"
              onClick={() =>
                createEnvelope({
                  data: {
                    dealId: d.id,
                    mode: "sequential",
                    authMethod: "email",
                    recipients: [{ name: d.personName ?? "Client", email: d.personEmail ?? "client@example.com", role: "signer" }],
                  },
                }).then((r) => {
                  toast.success("Signature request sent");
                  if (r.id) void navigate({ to: "/esign/$envelopeId", params: { envelopeId: String(r.id) } });
                })
              }
            >
              Launch e-sign
            </Button>
          </section>
          <section className="px-4 py-3">
            <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Details</h2>
            <dl className="mt-3 space-y-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Value</dt>
                <dd className="font-mono tabular-nums">{formatUsdFull(d.value)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Load-in</dt>
                <dd>{d.loadIn ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Guests</dt>
                <dd>{d.guestCount ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Indoor</dt>
                <dd>{d.indoor == null ? "—" : d.indoor ? "Indoor" : "Outdoor"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Probability</dt>
                <dd>{d.probability ?? 0}%</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Source</dt>
                <dd>{d.source ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Days in stage</dt>
                <dd>{d.daysInStage}d</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Description</dt>
                <dd>
                  <Textarea
                    className="mt-1 min-h-20"
                    defaultValue={d.notes ?? ""}
                    onBlur={(e) => {
                      if (e.target.value !== (d.notes ?? "")) void updateDeal({ data: { id: d.id, notes: e.target.value } }).then(onRefresh);
                    }}
                  />
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Event type</dt>
                <dd className="mt-1">
                  <Select value={d.eventType ?? ""} onValueChange={(v) => updateDeal({ data: { id: d.id, eventType: v } }).then(onRefresh)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Categorize" />
                    </SelectTrigger>
                    <SelectContent>
                      {(eventTypes.length
                        ? eventTypes.map((t) => t.name)
                        : ["Corporate gala", "Wedding", "Brand activation", "Dry hire"]
                      ).map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </dd>
              </div>
            </dl>
            <PinnedEventNotes dealId={d.id} />
          </section>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-muted/40">
          <div className="shrink-0 border-b border-border bg-card px-4 py-2">
            <div className="flex flex-wrap gap-1">
              {(
                [
                  ["activity", "Activity"],
                  ["notes", "Notes"],
                  ["email", "Email"],
                  ["files", "Files"],
                  ["invoice", "Invoice"],
                  ["floor", "Floor plan"],
                ] as const
              ).map(([id, label]) => (
                <Button key={id} size="sm" variant={pane === id ? "secondary" : "ghost"} onClick={() => setPane(id)}>
                  {id === "activity" && <Clock className="size-3.5" />}
                  {id === "notes" && <FileText className="size-3.5" />}
                  {id === "email" && <Mail className="size-3.5" />}
                  {id === "files" && <Paperclip className="size-3.5" />}
                  {id === "floor" && <MapPin className="size-3.5" />}
                  {label}
                </Button>
              ))}
            </div>
            {pane === "activity" && (
              <form
                className="mt-2 flex flex-wrap gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!actSubject.trim()) return;
                  void createActivity({
                    data: {
                      type: actType,
                      subject: actSubject.trim(),
                      ownerId: memberId,
                      dealId: d.id,
                      personId: d.personId,
                      orgId: d.orgId,
                    },
                  }).then(() => {
                    setActSubject("");
                    toast.success("Activity scheduled");
                    onRefresh();
                  });
                }}
              >
                <select
                  className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                  value={actType}
                  onChange={(e) => setActType(e.target.value)}
                >
                  <option value="task">Task</option>
                  <option value="call">Call</option>
                  <option value="meeting">Meeting</option>
                  <option value="deadline">Deadline</option>
                </select>
                <Input
                  value={actSubject}
                  onChange={(e) => setActSubject(e.target.value)}
                  placeholder="Click here to add an activity…"
                  className="min-w-48 flex-1"
                />
                <Button type="submit" size="sm" disabled={!actSubject.trim()}>
                  Schedule
                </Button>
              </form>
            )}
            {pane === "notes" && (
              <div className="mt-2">
                <EventNotesPanel dealId={d.id} memberId={memberId} />
              </div>
            )}
            {pane === "email" && (
              <div className="mt-2">
                <Compose deal={d} memberId={memberId} onSent={onRefresh} />
              </div>
            )}
            {pane === "files" && (
              <div className="mt-2 space-y-2">
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
                      data: { entityType: "deal", entityId: d.id, name: `plot_v${d.files.length + 1}.pdf`, uploadedBy: memberId },
                    }).then(onRefresh)
                  }
                >
                  Attach plot PDF
                </Button>
              </div>
            )}
            {pane === "invoice" && (
              <div className="mt-2 space-y-2">
                <table className="w-full text-sm">
                  <tbody>
                    {d.products.map((p) => (
                      <tr key={p.id} className="border-t border-border">
                        <td className="py-2">{p.name}</td>
                        <td className="py-2 tabular-nums">
                          {p.qty} {p.unit}
                        </td>
                        <td className="py-2 text-right font-mono">{formatUsdFull(p.qty * p.price * (1 - p.discount / 100))}</td>
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
              </div>
            )}
          </div>

          {pane === "floor" ? (
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
              <FloorPlanDesk dealId={d.id} venue={d.venue} title={d.title} />
            </div>
          ) : (
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
            <section className="mb-6">
              <button type="button" className="flex w-full items-center justify-between text-sm font-medium" onClick={() => setFocusOpen((v) => !v)}>
                Focus
                <span className="text-xs font-normal text-muted-foreground">{focusOpen ? "Collapse" : "Expand all items"}</span>
              </button>
              {focusOpen && (
                <div className="mt-3 space-y-2">
                  {upcoming.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No focus items yet. Scheduled activities and pinned notes appear here.</p>}
                  {upcoming.map((a) => (
                    <div key={a.id} className="flex items-start gap-3 rounded-xl bg-card p-3 shadow-[var(--shadow-border)]">
                      <Clock className="mt-0.5 size-4 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm">{a.subject}</div>
                        <div className="text-xs text-muted-foreground">
                          {a.type} · {formatDateTime(a.dueAt)} · {a.ownerName}
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => toggleActivity({ data: { id: a.id, done: true } }).then(onRefresh)}>
                        Done
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <button type="button" className="flex w-full items-center justify-between text-sm font-medium" onClick={() => setHistOpen((v) => !v)}>
                History
                <span className="text-xs font-normal text-muted-foreground">{feed.length}</span>
              </button>
              {histOpen && (
                <>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {(
                      [
                        ["all", "All"],
                        ["activity", "Activities"],
                        ["note", "Notes"],
                        ["email", "Emails"],
                        ["file", "Files"],
                        ["invoice", "Documents"],
                        ["log", "Changelog"],
                      ] as const
                    ).map(([id, label]) => (
                      <Button key={id} size="sm" variant={hist === id ? "secondary" : "ghost"} onClick={() => setHist(id)}>
                        {label}
                      </Button>
                    ))}
                  </div>
                  <ul className="mt-3 space-y-2">
                    {feed.map((item) => (
                      <li key={item.id} className="flex gap-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
                        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                          {item.kind === "email" && <Mail className="size-3.5" />}
                          {item.kind === "activity" && <Clock className="size-3.5" />}
                          {item.kind === "note" && <FileText className="size-3.5" />}
                          {item.kind === "file" && <Paperclip className="size-3.5" />}
                          {item.kind === "invoice" && <FileText className="size-3.5" />}
                          {item.kind === "log" && <Users className="size-3.5" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium">{item.title}</div>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {formatDateTime(item.at)}
                            {item.meta ? ` · ${item.meta}` : ""}
                          </p>
                          {item.detail && <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{item.detail}</p>}
                        </div>
                      </li>
                    ))}
                    {feed.length === 0 && <li className="py-8 text-center text-sm text-muted-foreground">Nothing in this filter.</li>}
                  </ul>
                  <form
                    className="mt-4 flex gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      void saveComment();
                    }}
                  >
                    <Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Comment, use @name to mention" />
                    <Button type="submit" variant="secondary">
                      Post
                    </Button>
                  </form>
                </>
              )}
            </section>
          </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

function PinnedEventNotes({ dealId }: { dealId: number }) {
  const notes = useQuery({
    queryKey: ["event-notes", dealId],
    queryFn: () => listEventNotes({ data: { dealId } }),
  });
  const pinned = (notes.data ?? []).filter((n) => n.pinned);
  if (!pinned.length) return null;
  return (
    <div className="space-y-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
      <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Pinned on this event</h3>
      {pinned.map((n) => (
        <div key={n.id} className="border-b border-border pb-2 last:border-0 last:pb-0">
          <Badge variant="steel">{n.category}</Badge>
          <NoteHtml html={n.body} className="mt-1" />
        </div>
      ))}
    </div>
  );
}

function EventNotesPanel({ dealId, memberId }: { dealId: number; memberId: number }) {
  const qc = useQueryClient();
  const notes = useQuery({
    queryKey: ["event-notes", dealId],
    queryFn: () => listEventNotes({ data: { dealId } }),
  });
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("production");
  const [pin, setPin] = useState(false);
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [editorKey, setEditorKey] = useState(0);

  function refresh() {
    void qc.invalidateQueries({ queryKey: ["event-notes", dealId] });
  }

  const rows = (notes.data ?? []).filter((n) => filter === "all" || n.category === filter);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        These notes live on the event record — pinned, categorized, not a side document.
      </p>
      <form
        className="space-y-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]"
        onSubmit={(e) => {
          e.preventDefault();
          const html = sanitizeNoteHtml(body);
          if (!notePlain(html)) return;
          void addEventNote({
            data: { dealId, body: html, category, pinned: pin, authorId: memberId },
          }).then(() => {
            setBody("");
            setPin(false);
            setEditorKey((k) => k + 1);
            toast.success("Note on the event");
            refresh();
          });
        }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <select
            className="h-9 rounded-md bg-secondary px-2 text-sm shadow-[var(--shadow-border)]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {NOTE_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={pin} onChange={(e) => setPin(e.target.checked)} />
            Pin to event
          </label>
          <Button type="submit" size="sm" disabled={!notePlain(body)}>
            Add note
          </Button>
        </div>
        <RichTextEditor
          key={editorKey}
          value={body}
          onChange={setBody}
          placeholder="Load-in, power, talent, holds…"
        />
      </form>
      <div className="flex flex-wrap gap-1">
        <Button size="sm" variant={filter === "all" ? "secondary" : "ghost"} onClick={() => setFilter("all")}>
          All
        </Button>
        {NOTE_CATEGORIES.map((c) => (
          <Button key={c.id} size="sm" variant={filter === c.id ? "secondary" : "ghost"} onClick={() => setFilter(c.id)}>
            {c.label}
          </Button>
        ))}
      </div>
      <ul className="space-y-2">
        {rows.map((n) => (
          <li key={n.id} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={n.pinned ? "steel" : "outline"}>{n.category}</Badge>
              {n.pinned && <Pin className="size-3 text-muted-foreground" />}
              <select
                className="h-8 rounded-md bg-secondary px-2 text-xs shadow-[var(--shadow-border)]"
                value={n.category}
                onChange={(e) =>
                  updateEventNote({ data: { id: n.id, category: e.target.value } }).then(() => {
                    toast.success("Category on the event");
                    refresh();
                  })
                }
              >
                {NOTE_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
              <span className="flex-1 text-xs text-muted-foreground">
                {n.author} · {formatDateTime(n.createdAt)}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  pinNote({ data: { id: n.id, pinned: !n.pinned } }).then(() => {
                    toast.success(n.pinned ? "Unpinned" : "Pinned to event");
                    refresh();
                  })
                }
              >
                {n.pinned ? "Unpin" : "Pin"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setEditing(n.id);
                  setDraft(n.body);
                }}
              >
                Edit
              </Button>
            </div>
            {editing === n.id ? (
              <form
                className="mt-3 space-y-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  void updateEventNote({ data: { id: n.id, body: sanitizeNoteHtml(draft) } }).then(() => {
                    setEditing(null);
                    toast.success("Saved on the event");
                    refresh();
                  });
                }}
              >
                <RichTextEditor value={draft} onChange={setDraft} />
                <div className="flex gap-2">
                  <Button type="submit" size="sm">
                    Save
                  </Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <NoteHtml html={n.body} className="mt-2" />
            )}
          </li>
        ))}
        {rows.length === 0 && <p className="text-sm text-muted-foreground">No event notes in this category.</p>}
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
        memberId: me.id,
      },
    });
    toast.success("Queued to sent (tracked) · your domain");
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
          Open & click tracking on · merge tags filled · sending domain aligned
        </span>
        <Button size="sm" onClick={send} disabled={!body}>
          Send
        </Button>
      </div>
    </div>
  );
}
