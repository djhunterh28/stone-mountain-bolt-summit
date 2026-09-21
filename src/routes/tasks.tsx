import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { listTaskLists, mutateTask } from "@/lib/portal/server";

export const Route = createFileRoute("/tasks")({ component: TasksPage });

function TasksPage() {
  const qc = useQueryClient();
  const lists = useQuery({ queryKey: ["task-lists"], queryFn: () => listTaskLists() });
  const [listName, setListName] = useState("");
  const [item, setItem] = useState<Record<number, string>>({});
  const refresh = () => qc.invalidateQueries({ queryKey: ["task-lists"] });

  return (
    <div className="pb-12">
      <PageHeader title="Task lists" subtitle="Show-ready checklists. Attachments live on the project files tab." />
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
        {(lists.data ?? []).map((l) => (
          <section key={l.id} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-medium">{l.name}</h2>
              <button className="text-xs text-muted-foreground hover:text-foreground" onClick={() => mutateTask({ data: { op: "delList", id: l.id } }).then(refresh)}>
                Delete
              </button>
            </div>
            <ul className="mt-3 space-y-2">
              {l.items.map((i) => (
                <li key={i.id} className="flex items-center gap-2">
                  <Checkbox checked={i.done} onCheckedChange={() => mutateTask({ data: { op: "toggle", id: i.id } }).then(refresh)} />
                  <span className={i.done ? "flex-1 text-sm text-muted-foreground line-through" : "flex-1 text-sm"}>{i.title}</span>
                  <button className="text-xs text-muted-foreground" onClick={() => mutateTask({ data: { op: "delItem", id: i.id } }).then(refresh)}>
                    ×
                  </button>
                </li>
              ))}
            </ul>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void mutateTask({ data: { op: "addItem", listId: l.id, title: item[l.id] || "Task" } }).then(() => {
                  setItem((s) => ({ ...s, [l.id]: "" }));
                  refresh();
                });
              }}
            >
              <Input value={item[l.id] ?? ""} onChange={(e) => setItem((s) => ({ ...s, [l.id]: e.target.value }))} placeholder="Add item" />
              <Button type="submit" size="sm" variant="secondary">
                Add
              </Button>
            </form>
          </section>
        ))}
      </div>
    </div>
  );
}
