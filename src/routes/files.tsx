import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  downloadPortalFile,
  listPortalFiles,
  sharePortalFile,
  uploadPortalFile,
  zipPortalFiles,
} from "@/lib/portal/server";
import { formatBytes, formatDateTime, saveBase64File } from "@/lib/utils";

export const Route = createFileRoute("/files")({ component: FilesPage });

function FilesPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [folder, setFolder] = useState("all");
  const [picked, setPicked] = useState<number[]>([]);
  const [progress, setProgress] = useState<number | null>(null);
  const files = useQuery({
    queryKey: ["portal-files", q, folder],
    queryFn: () => listPortalFiles({ data: { q: q || undefined, folder: folder === "all" ? undefined : folder } }),
  });
  const list = files.data ?? [];
  const total = useMemo(() => list.reduce((s, f) => s + f.sizeBytes, 0), [list]);

  async function onUpload(file: File) {
    setProgress(8);
    const tick = window.setInterval(() => setProgress((p) => Math.min(92, (p ?? 8) + 11)), 180);
    const buf = await file.arrayBuffer();
    const b64 = btoa(String.fromCharCode(...new Uint8Array(buf).slice(0, 240)));
    const res = await uploadPortalFile({
      data: {
        name: file.name,
        sizeBytes: file.size,
        mime: file.type || "application/octet-stream",
        folder: folder === "all" ? "files" : folder,
        contentB64: b64,
      },
    });
    window.clearInterval(tick);
    setProgress(100);
    window.setTimeout(() => setProgress(null), 600);
    if (!res.ok) toast.error("error" in res ? res.error : "Upload failed");
    else toast.success(`Stored on Drive as ${res.sha?.slice(0, 8)}`);
    qc.invalidateQueries({ queryKey: ["portal-files"] });
    qc.invalidateQueries({ queryKey: ["dashboard"] });
  }

  return (
    <div className="pb-12">
      <PageHeader
        title="Files"
        subtitle="Deal attachments, project files, and Drive assets. Every deal upload lands here with a link back to the show."
        actions={
          <>
            <Button
              size="sm"
              variant="secondary"
              disabled={!picked.length}
              onClick={() =>
                zipPortalFiles({ data: { ids: picked } }).then((r) => {
                  if (r.ok) saveBase64File(r.filename, r.contentB64);
                })
              }
            >
              ZIP {picked.length || ""}
            </Button>
            <label className="inline-flex">
              <input
                type="file"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void onUpload(f);
                  e.target.value = "";
                }}
              />
              <Button size="sm" asChild>
                <span>Upload to Drive</span>
              </Button>
            </label>
          </>
        }
      />
      <div className="flex flex-wrap gap-2 px-4 sm:px-6">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search files" className="h-9 max-w-xs" />
        <Select value={folder} onValueChange={setFolder}>
          <SelectTrigger className="h-9 w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All folders</SelectItem>
            <SelectItem value="deals">Deals</SelectItem>
            <SelectItem value="notes">Note attachments</SelectItem>
            <SelectItem value="tasks">Tasks</SelectItem>
            <SelectItem value="files">Project files</SelectItem>
            <SelectItem value="billing">Billing</SelectItem>
            <SelectItem value="digital">Digital assets</SelectItem>
          </SelectContent>
        </Select>
        <span className="self-center text-xs text-muted-foreground">{formatBytes(total)} in view</span>
      </div>
      {progress != null && (
        <div className="mx-4 mt-3 h-1.5 overflow-hidden rounded-full bg-muted sm:mx-6">
          <div className="h-full bg-primary transition-[width]" style={{ width: `${progress}%` }} />
        </div>
      )}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-2 sm:px-6" />
              <th className="px-2 py-2">Name</th>
              <th className="px-2 py-2">Folder</th>
              <th className="px-2 py-2">Deal</th>
              <th className="px-2 py-2">Task</th>
              <th className="px-2 py-2">Project</th>
              <th className="px-2 py-2 text-right">Size</th>
              <th className="px-4 py-2 sm:px-6">Added</th>
            </tr>
          </thead>
          <tbody>
            {list.map((f) => (
              <tr key={f.id} className="border-t border-border">
                <td className="px-4 py-2 sm:px-6">
                  <input
                    type="checkbox"
                    checked={picked.includes(f.id)}
                    onChange={(e) =>
                      setPicked((p) => (e.target.checked ? [...p, f.id] : p.filter((id) => id !== f.id)))
                    }
                  />
                </td>
                <td className="px-2 py-2">
                  <button
                    className="text-left hover:underline"
                    onClick={() =>
                      downloadPortalFile({ data: { id: f.id } }).then((r) => {
                        if (r.ok) saveBase64File(r.filename, r.contentB64, r.mime);
                        else toast.error("Download blocked");
                      })
                    }
                  >
                    {f.name}
                  </button>
                  <div className="text-[11px] text-muted-foreground">sha {f.sha256?.slice(0, 10)} · {f.driveId}</div>
                </td>
                <td className="px-2 py-2">
                  <Badge variant="outline">{f.folder}</Badge>
                </td>
                <td className="px-2 py-2">
                  {f.dealId ? (
                    <Link
                      to="/deals/$dealId"
                      params={{ dealId: String(f.dealId) }}
                      className="text-primary hover:underline"
                    >
                      {f.dealTitle ?? `Deal ${f.dealId}`}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-2 py-2 text-muted-foreground">{f.taskTitle ?? "—"}</td>
                <td className="px-2 py-2 text-muted-foreground">{f.projectName ?? "—"}</td>
                <td className="px-2 py-2 text-right font-mono tabular-nums">{formatBytes(f.sizeBytes)}</td>
                <td className="px-4 py-2 text-muted-foreground sm:px-6">
                  {formatDateTime(f.createdAt)}{" "}
                  <button
                    className="ml-2 text-xs underline"
                    onClick={() => sharePortalFile({ data: { id: f.id, shared: !f.shared } }).then(() => files.refetch())}
                  >
                    {f.shared ? "Unshare" : "Share"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
