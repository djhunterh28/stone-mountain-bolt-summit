import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { addTask, getProject, moveTask } from "@/lib/crm/server";
import { addProjectRequest, downloadPortalFile, getPortalProject, toggleProjectNote } from "@/lib/portal/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatBytes, formatDate, saveBase64File } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects/$projectId")({ component: ProjectBoard });

const COLS = ["To do", "In progress", "Done"];

function ProjectBoard() {
  const { projectId } = Route.useParams();
  const id = Number(projectId);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["project", id], queryFn: () => getProject({ data: { id } }) });
  const portal = useQuery({ queryKey: ["portal-project", id], queryFn: () => getPortalProject({ data: { id } }) });
  const [title, setTitle] = useState("");
  const [reqTitle, setReqTitle] = useState("");
  const [reqBody, setReqBody] = useState("");
  if (!q.data) return <p className="p-6 text-sm text-muted-foreground">Loading…</p>;
  const { project, tasks } = q.data;
  const portalP = portal.data;

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3 sm:px-6">
        <Button asChild size="icon-sm" variant="ghost">
          <Link to="/projects">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold">{project.name}</h1>
          <p className="text-xs text-muted-foreground">
            {project.venue} · {formatDate(project.startDate)} – {formatDate(project.endDate)}
            {portalP ? ` · ${portalP.project.stageLabel}` : ""}
          </p>
        </div>
        <Badge variant={project.status === "done" ? "success" : "steel"}>{portalP?.project.stageLabel ?? project.status}</Badge>
      </div>
      <Tabs defaultValue="board" className="flex min-h-0 flex-1 flex-col">
        <div className="border-b border-border px-4 sm:px-6">
          <TabsList className="my-2 flex h-auto flex-wrap">
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="digital">Digital</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="board" className="mt-0 flex min-h-0 flex-1 flex-col">
      <form
        className="flex gap-2 px-4 py-3 sm:px-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          void addTask({ data: { projectId: id, title: title.trim() } }).then(() => {
            setTitle("");
            qc.invalidateQueries({ queryKey: ["project", id] });
          });
        }}
      >
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a production task" />
        <Button type="submit" variant="secondary">
          Add
        </Button>
      </form>
      <div className="flex min-h-0 flex-1 gap-3 overflow-x-auto px-4 pb-6 sm:px-6">
        {COLS.map((col) => (
          <section
            key={col}
            className="kanban-col flex flex-col rounded-xl bg-card p-2 shadow-[var(--shadow-border)]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const taskId = Number(e.dataTransfer.getData("text/task-id"));
              if (taskId) void moveTask({ data: { id: taskId, columnName: col } }).then(() => qc.invalidateQueries({ queryKey: ["project", id] }));
            }}
          >
            <h2 className="px-2 py-2 text-sm font-medium">{col}</h2>
            <div className="flex flex-col gap-2">
              {tasks
                .filter((t) => t.columnName === col)
                .map((t) => (
                  <article
                    key={t.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("text/task-id", String(t.id))}
                    className={cn("rounded-lg bg-background p-3 text-sm shadow-[var(--shadow-border)]")}
                  >
                    {t.title}
                    <div className="mt-1 text-[11px] text-muted-foreground">{t.assigneeName}</div>
                  </article>
                ))}
            </div>
          </section>
        ))}
      </div>
        </TabsContent>
        {(["files", "billing", "digital"] as const).map((folder) => (
          <TabsContent key={folder} value={folder} className="mt-0 overflow-auto px-4 py-4 sm:px-6">
            <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
              {(portalP?.files ?? [])
                .filter((f) => f.folder === folder)
                .map((f) => (
                  <li key={f.id} className="flex items-center justify-between gap-2 px-4 py-3 text-sm">
                    <button
                      className="text-left hover:underline"
                      onClick={() =>
                        downloadPortalFile({ data: { id: f.id } }).then((r) => {
                          if (r.ok) saveBase64File(r.filename, r.contentB64, r.mime);
                        })
                      }
                    >
                      {f.name}
                      <span className="ml-2 text-xs text-muted-foreground">{formatBytes(f.sizeBytes)}</span>
                    </button>
                  </li>
                ))}
              {(portalP?.files ?? []).filter((f) => f.folder === folder).length === 0 && (
                <li className="px-4 py-6 text-sm text-muted-foreground">Nothing in this folder.</li>
              )}
            </ul>
          </TabsContent>
        ))}
        <TabsContent value="notes" className="mt-0 overflow-auto px-4 py-4 sm:px-6">
          <ul className="space-y-3">
            {(portalP?.notes ?? []).map((n) => (
              <li key={n.id} className="rounded-xl bg-card p-4 text-sm shadow-[var(--shadow-border)]">
                <p>{n.body}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{n.author}</span>
                  <button
                    className="underline"
                    onClick={() => toggleProjectNote({ data: { id: n.id, visible: !n.visible } }).then(() => qc.invalidateQueries({ queryKey: ["portal-project", id] }))}
                  >
                    {n.visible ? "Hide" : "Show"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="requests" className="mt-0 overflow-auto px-4 py-4 sm:px-6">
          <form
            className="mb-4 space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              void addProjectRequest({ data: { projectId: id, title: reqTitle, body: reqBody } }).then(() => {
                setReqTitle("");
                setReqBody("");
                toast.success("Request filed");
                qc.invalidateQueries({ queryKey: ["portal-project", id] });
              });
            }}
          >
            <Input value={reqTitle} onChange={(e) => setReqTitle(e.target.value)} placeholder="Request" required />
            <Textarea value={reqBody} onChange={(e) => setReqBody(e.target.value)} placeholder="Details" />
            <Button type="submit" size="sm">
              Submit request
            </Button>
          </form>
          <ul className="space-y-2">
            {(portalP?.requests ?? []).map((r) => (
              <li key={r.id} className="rounded-xl bg-card p-4 text-sm shadow-[var(--shadow-border)]">
                <div className="font-medium">{r.title}</div>
                <p className="text-muted-foreground">{r.body}</p>
                <Badge variant="outline" className="mt-2">
                  {r.status}
                </Badge>
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  );
}
