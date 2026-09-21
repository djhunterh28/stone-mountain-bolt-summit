import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Paperclip } from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { attachTaskFiles, downloadPortalFile, listTaskLists, mutateTask } from "@/lib/portal/server";
import { formatBytes, saveBase64File } from "@/lib/utils";

export const Route = createFileRoute("/tasks")({ component: TasksPage });

async function encodeFiles(list: File[]) {
  const out: { name: string; sizeBytes: number; mime: string; contentB64: string }[] = [];
  for (const file of list.slice(0, 12)) {
    const buf = await file.arrayBuffer();
    const slice = new Uint8Array(buf).slice(0, 240);
    const b64 = btoa(String.fromCharCode(...slice));
    out.push({
      name: file.name,
      sizeBytes: file.size,
      mime: file.type || "application/octet-stream",
      contentB64: b64,
    });
  }
  return out;
}

function TasksPage() {
  const qc = useQueryClient();
  const lists = useQuery({ queryKey: ["task-lists"], queryFn: () => listTaskLists() });
  const [listName, setListName] = useState("");
  const [item, setItem] = useState<Record<number, string>>({});
  const [pending, setPending] = useState<{ id: number; name: string; step: 1 | 2 } | null>(null);
  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ["task-lists"] });
    void qc.invalidateQueries({ queryKey: ["portal-files"] });
  };

  function onAttach(itemId: number, files: File[]) {
    if (!files.length) return;
    void encodeFiles(files)
      .then((payload) => attachTaskFiles({ data: { itemId, files: payload } }))
      .then((r) => {
        if (!r.ok) toast.error("error" in r ? r.error : "Could not attach");
        else toast.success(`${r.attached} file${r.attached === 1 ? "" : "s"} on the task`);
        refresh();
      });
  }

  const active = (lists.data ?? []).filter((l) => !l.archivedAt);
  const archived = (lists.data ?? []).filter((l) => l.archivedAt);

  return (
    <div className="pb-12">
      <PageHeader title="Task lists" subtitle="Archive a list to get it off the floor. Permanent delete takes two confirms." />
      <form
        className="mb-6 flex gap-2 px-4 sm:px-6"
        onSubmit={(e) => {
          e.preventDefault();
          void mutateTask({ data: { op: "addList", name: listName || "Checklist" } }).then(() => {
            setListName("");
            refresh();
          });
        }}
      >
        <Input value={listName} onChange={(e) => setListName(e.target.value)} placeholder="New list" className="max-w-xs" />
        <Button type="submit" variant="secondary">
          Add list
        </Button>
      </form>
      <div className="grid gap-4 px-4 sm:grid-cols-2 sm:px-6 xl:grid-cols-3">
        {active.map((l) => (
          <TaskListCard
            key={l.id}
            list={l}
            itemValue={item[l.id] ?? ""}
            onItemChange={(v) => setItem((s) => ({ ...s, [l.id]: v }))}
            onAttach={onAttach}
            onArchive={() =>
              mutateTask({ data: { op: "archiveList", id: l.id } }).then(() => {
                toast.success(`Archived ${l.name}`);
                refresh();
              })
            }
            refresh={refresh}
          />
        ))}
      </div>
      {archived.length > 0 && (
        <section className="mt-10 px-4 sm:px-6">
          <h2 className="text-sm font-medium">Archived</h2>
          <p className="mt-1 text-xs text-muted-foreground">Restore to use again, or delete with two confirms.</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {archived.map((l) => (
              <TaskListCard
                key={l.id}
                list={l}
                archived
                itemValue={item[l.id] ?? ""}
                onItemChange={(v) => setItem((s) => ({ ...s, [l.id]: v }))}
                onAttach={onAttach}
                onRestore={() =>
                  mutateTask({ data: { op: "restoreList", id: l.id } }).then(() => {
                    toast.success(`Restored ${l.name}`);
                    refresh();
                  })
                }
                onDelete={() => setPending({ id: l.id, name: l.name, step: 1 })}
                refresh={refresh}
              />
            ))}
          </div>
        </section>
      )}
      <Dialog open={Boolean(pending)} onOpenChange={(open) => !open && setPending(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{pending?.step === 2 ? "Permanently delete this list?" : "Delete this list?"}</DialogTitle>
            <DialogDescription>
              {pending?.step === 2
                ? `${pending.name} and every task on it will be removed. This cannot be undone.`
                : `Archive is safer. Delete ${pending?.name ?? "this list"} only if you are sure.`}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setPending(null)}>
              Cancel
            </Button>
            {pending?.step === 1 ? (
              <Button type="button" variant="secondary" onClick={() => setPending((p) => (p ? { ...p, step: 2 } : p))}>
                Continue
              </Button>
            ) : (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  if (!pending) return;
                  void mutateTask({ data: { op: "delList", id: pending.id } }).then(() => {
                    toast.success(`Deleted ${pending.name}`);
                    setPending(null);
                    refresh();
                  });
                }}
              >
                Permanently delete
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TaskListCard({
  list,
  archived,
  itemValue,
  onItemChange,
  onAttach,
  onArchive,
  onRestore,
  onDelete,
  refresh,
}: {
  list: {
    id: number;
    name: string;
    archivedAt?: string | null;
    items: { id: number; title: string; done: boolean; files: { id: number; name: string; sizeBytes: number; mime: string }[] }[];
  };
  archived?: boolean;
  itemValue: string;
  onItemChange: (v: string) => void;
  onAttach: (itemId: number, files: File[]) => void;
  onArchive?: () => void;
  onRestore?: () => void;
  onDelete?: () => void;
  refresh: () => void;
}) {
  return (
    <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium">{list.name}</h2>
        <div className="flex items-center gap-2">
          {archived && <Badge variant="outline">Archived</Badge>}
          {archived ? (
            <>
              <button className="text-xs text-muted-foreground hover:text-foreground" onClick={onRestore}>
                Restore
              </button>
              <button className="text-xs text-destructive hover:underline" onClick={onDelete}>
                Delete
              </button>
            </>
          ) : (
            <button className="text-xs text-muted-foreground hover:text-foreground" onClick={onArchive}>
              Archive
            </button>
          )}
        </div>
      </div>
      <ul className="mt-3 space-y-3">
        {list.items.map((i) => (
          <li key={i.id} className="space-y-1">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={i.done}
                disabled={archived}
                onCheckedChange={() => mutateTask({ data: { op: "toggle", id: i.id } }).then(refresh)}
              />
              <span className={i.done ? "min-w-0 flex-1 text-sm text-muted-foreground line-through" : "min-w-0 flex-1 text-sm"}>
                {i.title}
              </span>
              <label className="inline-flex shrink-0">
                <input
                  type="file"
                  multiple
                  className="sr-only"
                  disabled={archived}
                  onChange={(e) => {
                    onAttach(i.id, [...(e.target.files ?? [])]);
                    e.target.value = "";
                  }}
                />
                <span className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-md px-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground">
                  <Paperclip className="size-3.5" />
                  {i.files.length ? i.files.length : "Files"}
                </span>
              </label>
              {!archived && (
                <button className="text-xs text-muted-foreground" onClick={() => mutateTask({ data: { op: "delItem", id: i.id } }).then(refresh)}>
                  ×
                </button>
              )}
            </div>
            {i.files.length > 0 && (
              <ul className="ml-6 space-y-0.5">
                {i.files.map((f) => (
                  <li key={f.id} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <Paperclip className="size-3 shrink-0" />
                    <button
                      type="button"
                      className="min-w-0 truncate text-left hover:text-foreground hover:underline"
                      onClick={() =>
                        downloadPortalFile({ data: { id: f.id } }).then((r) => {
                          if (r.ok) saveBase64File(r.filename, r.contentB64, r.mime);
                          else toast.error("Download blocked");
                        })
                      }
                    >
                      {f.name}
                    </button>
                    <span>{formatBytes(f.sizeBytes)}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      {!archived && (
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void mutateTask({ data: { op: "addItem", listId: list.id, title: itemValue || "Task" } }).then(() => {
              onItemChange("");
              refresh();
            });
          }}
        >
          <Input value={itemValue} onChange={(e) => onItemChange(e.target.value)} placeholder="Add item" />
          <Button type="submit" size="sm" variant="secondary">
            Add
          </Button>
        </form>
      )}
    </section>
  );
}
