import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  bulkImportCold,
  campaignCold,
  createColdList,
  getColdDesk,
  parsePaste,
  recordColdReply,
  type ColdList,
  type ColdProspect,
} from "@/lib/crm/cold";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cold")({ component: ColdPage });

function ColdPage() {
  const desk = useQuery({ queryKey: ["cold-desk"], queryFn: () => getColdDesk() });
  const qc = useQueryClient();
  const [picked, setPicked] = useState<number[]>([1, 3]);
  const [tag, setTag] = useState("expo");
  const [filter, setFilter] = useState<"all" | "cold" | "lead">("all");
  const [listFilter, setListFilter] = useState<number | "all">("all");

  function refresh() {
    void qc.invalidateQueries({ queryKey: ["cold-desk"] });
    void qc.invalidateQueries({ queryKey: ["leads"] });
    void qc.invalidateQueries({ queryKey: ["lifecycle"] });
    void qc.invalidateQueries({ queryKey: ["emails"] });
  }

  const d = desk.data;
  const lists = d?.lists ?? [];
  const prospects = d?.prospects ?? [];
  const audience = useMemo(() => uniqueAudience(prospects, lists, picked, tag), [prospects, lists, picked, tag]);

  const visible = prospects.filter((p) => {
    if (filter === "cold" && p.promoted) return false;
    if (filter === "lead" && !p.promoted) return false;
    if (listFilter !== "all" && p.listId !== listFilter) return false;
    return true;
  });

  return (
    <div className="pb-12">
      <PageHeader
        title="Cold lists"
        subtitle="Badge scans and bought files live here. They are not leads. A reply dates a real lead from the moment they wrote back — never from the import."
      />

      {desk.isLoading || !d ? (
        <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6">
          <Stat label="Lists" value={String(d.stats.lists)} hint="Expo, bought, manual" />
          <Stat label="Cold names" value={String(d.stats.uniqueCold)} hint={`${d.stats.records} rows across lists`} />
          <Stat label="Promoted" value={String(d.stats.uniquePromoted)} hint="Only after a reply" />
          <Stat
            label="In funnel"
            value={String(d.stats.leaked)}
            hint={d.stats.leaked === 0 ? "Zero cold rows in pipeline" : "Leak — check isolation"}
          />
        </div>
      )}

      {d && d.scanned > 0 && (
        <p className="mt-3 px-4 text-xs text-muted-foreground sm:px-6">
          {d.scanned} inbound {d.scanned === 1 ? "reply" : "replies"} dated a lead from the moment they wrote, not from the scan.
        </p>
      )}

      <div className="mt-6 grid gap-4 px-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] sm:px-6">
        <div className="space-y-4">
          <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
            <h2 className="text-sm font-medium">Lists</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Select one or several for a campaign. The same email on two lists still gets one send.
            </p>
            <ul className="mt-3 space-y-2">
              {lists.map((l) => (
                <ListCard
                  key={l.id}
                  list={l}
                  selected={picked.includes(l.id)}
                  onToggle={() =>
                    setPicked((cur) => (cur.includes(l.id) ? cur.filter((id) => id !== l.id) : [...cur, l.id]))
                  }
                />
              ))}
            </ul>
            <NewListForm onChange={refresh} />
          </section>
          <BulkImport lists={lists} onChange={refresh} />
        </div>

        <div className="space-y-4">
          <CampaignCard
            lists={lists}
            tags={d?.tags ?? []}
            tag={tag}
            onTag={setTag}
            picked={picked}
            audience={audience}
            onChange={refresh}
          />
          <IsolationNote promoted={d?.stats.uniquePromoted ?? 0} inFunnelLeads={d?.stats.inFunnel ?? 0} leaked={d?.stats.leaked ?? 0} />
        </div>
      </div>

      <section className="mt-6 px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium">Prospects</h2>
            <p className="text-xs text-muted-foreground">A separate record. Not a label on a lead.</p>
          </div>
          <div className="flex flex-wrap gap-1">
            {(["all", "cold", "lead"] as const).map((k) => (
              <Button key={k} size="sm" variant={filter === k ? "secondary" : "ghost"} onClick={() => setFilter(k)}>
                {k === "all" ? "All" : k === "cold" ? "Still cold" : "Promoted"}
              </Button>
            ))}
            <select
              className="h-8 rounded-md bg-secondary px-2 text-xs shadow-[var(--shadow-border)]"
              value={listFilter === "all" ? "all" : String(listFilter)}
              onChange={(e) => setListFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
            >
              <option value="all">Every list</option>
              {lists.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <ul className="mt-3 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
          {visible.length === 0 && (
            <li className="px-4 py-3 text-sm text-muted-foreground">Nothing in this filter.</li>
          )}
          {visible.map((p) => (
            <ProspectRow key={p.id} row={p} onChange={refresh} />
          ))}
        </ul>
      </section>

      <section className="mt-6 px-4 sm:px-6">
        <h2 className="text-sm font-medium">Campaigns</h2>
        <ul className="mt-3 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
          {(d?.campaigns ?? []).length === 0 && (
            <li className="px-4 py-3 text-sm text-muted-foreground">No cold campaigns yet.</li>
          )}
          {(d?.campaigns ?? []).map((c) => (
            <li key={c.id} className="flex flex-wrap items-start gap-2 px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm">{c.name}</div>
                <p className="truncate text-xs text-muted-foreground">
                  {c.subject}
                  {c.tag ? ` · tag ${c.tag}` : ""}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                {c.sent} sent · {c.skipped} skipped
              </span>
              <span className="text-xs text-muted-foreground">{formatDateTime(c.createdAt)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function uniqueAudience(prospects: ColdProspect[], lists: ColdList[], picked: number[], tag: string) {
  const tagged = new Set(lists.filter((l) => tag && l.tags.includes(tag)).map((l) => l.id));
  const ids = new Set([...picked, ...tagged]);
  const map = new Map<string, ColdProspect>();
  let dupes = 0;
  let already = 0;
  for (const p of prospects) {
    if (!ids.has(p.listId)) continue;
    const key = p.email.toLowerCase();
    if (map.has(key)) {
      dupes += 1;
      continue;
    }
    if (p.promoted) {
      already += 1;
      continue;
    }
    map.set(key, p);
  }
  return { count: map.size, dupes, already, emails: [...map.values()] };
}

function ListCard({ list, selected, onToggle }: { list: ColdList; selected: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "w-full rounded-lg px-3 py-2.5 text-left shadow-[var(--shadow-border)]",
        selected ? "bg-accent" : "bg-secondary",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-sm">{list.name}</div>
          <p className="text-xs text-muted-foreground">
            {list.source} · {list.n} names · {list.promoted} promoted
          </p>
        </div>
        <Badge variant={selected ? "steel" : "outline"}>{selected ? "in campaign" : "idle"}</Badge>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {list.tags.map((t) => (
          <Badge key={t} variant="outline">
            {t}
          </Badge>
        ))}
      </div>
    </button>
  );
}

function NewListForm({ onChange }: { onChange: () => void }) {
  const [name, setName] = useState("");
  const [tags, setTags] = useState("");
  const [source, setSource] = useState("expo");
  return (
    <form
      className="mt-4 grid gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        void createColdList({ data: { name, tags, source } }).then((r) => {
          if (!r.ok) toast.error(r.error ?? "Could not create");
          else {
            toast.success("List is cold — not in the funnel");
            setName("");
            onChange();
          }
        });
      }}
    >
      <Label htmlFor="list-name">New list</Label>
      <Input id="list-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="NAB hall B scans" />
      <div className="flex flex-wrap gap-2">
        <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="expo,nab" className="w-36" />
        <select
          className="h-10 rounded-md bg-secondary px-2 text-sm shadow-[var(--shadow-border)]"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        >
          <option value="expo">Expo scan</option>
          <option value="bought">Bought file</option>
          <option value="manual">Manual</option>
        </select>
        <Button type="submit" size="sm" disabled={!name.trim()}>
          Create
        </Button>
      </div>
    </form>
  );
}

function BulkImport({ lists, onChange }: { lists: ColdList[]; onChange: () => void }) {
  const [listId, setListId] = useState<string>("");
  const [newName, setNewName] = useState("");
  const [paste, setPaste] = useState("");
  const preview = parsePaste(paste);
  const selected = listId || (lists[0] ? String(lists[0].id) : "new");
  return (
    <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
      <h2 className="text-sm font-medium">Bulk import</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Paste CSV, tabs, or a name and email per line. No broker, no Zapier. Dupes on a list are skipped.
      </p>
      <form
        className="mt-3 space-y-2"
        onSubmit={(e) => {
          e.preventDefault();
          void bulkImportCold({
            data: {
              listId: selected === "new" ? undefined : Number(selected),
              newName: newName || undefined,
              paste,
            },
          }).then((r) => {
            if (!r.ok) toast.error(r.error ?? "Nothing imported");
            else {
              toast.success(`Imported ${r.imported} · skipped ${r.skipped}`);
              setPaste("");
              onChange();
            }
          });
        }}
      >
        <Label htmlFor="cold-paste">Paste</Label>
        <Textarea
          id="cold-paste"
          rows={5}
          value={paste}
          onChange={(e) => setPaste(e.target.value)}
          placeholder={"name,email,company\nCasey Reed,casey@reed.events,Reed Events"}
        />
        <div className="flex flex-wrap gap-2">
          <select
            className="h-10 rounded-md bg-secondary px-2 text-sm shadow-[var(--shadow-border)]"
            value={selected}
            onChange={(e) => setListId(e.target.value)}
          >
            {lists.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
            <option value="new">New list…</option>
          </select>
          {selected === "new" && (
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="List name" className="w-44" />
          )}
          <Button type="submit" size="sm" disabled={!preview.length}>
            Import {preview.length ? preview.length : ""}
          </Button>
        </div>
        {preview.length > 0 && (
          <p className="text-xs text-muted-foreground">{preview.length} unique emails in the paste</p>
        )}
      </form>
    </section>
  );
}

function CampaignCard({
  lists,
  tags,
  tag,
  onTag,
  picked,
  audience,
  onChange,
}: {
  lists: ColdList[];
  tags: string[];
  tag: string;
  onTag: (t: string) => void;
  picked: number[];
  audience: { count: number; dupes: number; already: number };
  onChange: () => void;
}) {
  const [subject, setSubject] = useState("Dates in play — Northline");
  const [body, setBody] = useState(
    "Hi {{first}} —\n\nIf a date is in play in NYC this year, reply to this thread. We will send the one-pager.\n\n— Northline Shows",
  );
  const tagLists = lists.filter((l) => tag && l.tags.includes(tag)).map((l) => l.name);
  return (
    <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
      <h2 className="text-sm font-medium">Campaign</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Several lists at once. Deduped to one email. Promoted names are skipped — they already left this room.
      </p>
      <div className="mt-3 flex flex-wrap gap-1">
        <Button size="sm" variant={tag === "" ? "secondary" : "ghost"} onClick={() => onTag("")}>
          No tag
        </Button>
        {tags.map((t) => (
          <Button key={t} size="sm" variant={tag === t ? "secondary" : "ghost"} onClick={() => onTag(t)}>
            {t}
          </Button>
        ))}
      </div>
      {tag && (
        <p className="mt-2 text-xs text-muted-foreground">
          Tag {tag} pulls {tagLists.join(", ") || "no lists"}
        </p>
      )}
      <form
        className="mt-3 space-y-2"
        onSubmit={(e) => {
          e.preventDefault();
          void campaignCold({
            data: { subject, body, listIds: picked, tag: tag || undefined },
          }).then((r) => {
            if (!r.ok) toast.error(r.error ?? "Could not send");
            else toast.success(`Sent ${r.sent} · skipped ${r.skipped} (dupes and replies)`);
            onChange();
          });
        }}
      >
        <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
        <Textarea rows={5} value={body} onChange={(e) => setBody(e.target.value)} />
        <p className="text-xs text-muted-foreground">
          {audience.count} unique cold names · {audience.dupes} already on another selected list · {audience.already} already
          leads
        </p>
        <Button type="submit" size="sm" disabled={!audience.count || !subject.trim()}>
          Send campaign
        </Button>
      </form>
    </section>
  );
}

function IsolationNote({
  promoted,
  inFunnelLeads,
  leaked,
}: {
  promoted: number;
  inFunnelLeads: number;
  leaked: number;
}) {
  return (
    <article className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
      <h2 className="text-sm font-medium">Kept out of the funnel</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Pipeline, lifecycle, win rate, and source conversion never see a cold row. {promoted} {promoted === 1 ? "person" : "people"}{" "}
        crossed over as <span className="text-foreground">Cold reply</span> leads
        {inFunnelLeads ? ` (${inFunnelLeads} on the lead board)` : ""}. {leaked === 0 ? "No cold email sits on an open deal." : ""}
      </p>
      <p className="mt-3 text-xs">
        <Link to="/lifecycle" className="underline underline-offset-2">
          Open lifecycle
        </Link>
        {" · "}
        <Link to="/leads" className="underline underline-offset-2">
          Open leads
        </Link>
      </p>
    </article>
  );
}

function ProspectRow({ row, onChange }: { row: ColdProspect; onChange: () => void }) {
  return (
    <li className="flex flex-wrap items-center gap-2 px-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm">{row.name}</div>
        <p className="truncate text-xs text-muted-foreground">
          {row.email} · {row.company ?? "—"} · {row.listName}
        </p>
      </div>
      {row.promoted ? (
        <Badge variant="success">lead{row.repliedAt ? ` · ${formatDateTime(row.repliedAt)}` : ""}</Badge>
      ) : (
        <Button
          size="sm"
          variant="secondary"
          onClick={() =>
            recordColdReply({ data: { id: row.id } }).then((r) => {
              if (!r.ok) toast.error(r.error ?? "Could not promote");
              else toast.success("Lead dated from this reply");
              onChange();
            })
          }
        >
          They replied
        </Button>
      )}
    </li>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <article className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
      <div className="text-xs tracking-wide text-muted-foreground uppercase">{label}</div>
      <div className="mt-2 font-mono text-2xl tabular-nums">{value}</div>
      <p className="mt-1 truncate text-xs text-muted-foreground">{hint}</p>
    </article>
  );
}
