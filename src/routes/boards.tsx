import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createBoard, listBoards, revokeBoard, rotateBoard, type BoardKind, type DisplayBoard } from "@/lib/crm/boards";
import { formatDateTime } from "@/lib/utils";

export const Route = createFileRoute("/boards")({ component: BoardsPage });

function boardUrl(token: string) {
  if (typeof window === "undefined") return `/board/${token}`;
  return `${window.location.origin}/board/${token}`;
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Kiosk URL copied");
  } catch {
    toast.message(text);
  }
}

function BoardsPage() {
  const qc = useQueryClient();
  const boards = useQuery({ queryKey: ["display-boards"], queryFn: () => listBoards() });
  const [name, setName] = useState("Shop wall");
  const [location, setLocation] = useState("Warehouse floor");
  const [kind, setKind] = useState<BoardKind>("warehouse");
  const [fresh, setFresh] = useState<DisplayBoard | null>(null);

  return (
    <div className="pb-12">
      <PageHeader
        title="Display boards"
        subtitle="Read-only kiosk screens for the warehouse and the office. Token in the URL — no login."
      />
      <div className="space-y-6 px-4 sm:px-6">
        <form
          className="flex flex-wrap items-end gap-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]"
          onSubmit={(e) => {
            e.preventDefault();
            void createBoard({ data: { name, location, kind } }).then((b) => {
              setFresh(b);
              toast.success("Board minted");
              qc.invalidateQueries({ queryKey: ["display-boards"] });
            });
          }}
        >
          <label className="block text-xs text-muted-foreground">
            Name
            <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-44" />
          </label>
          <label className="block text-xs text-muted-foreground">
            Location
            <Input value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 w-48" />
          </label>
          <label className="block text-xs text-muted-foreground">
            Kind
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as BoardKind)}
              className="mt-1 h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground"
            >
              <option value="warehouse">Warehouse — gear & trucks</option>
              <option value="office">Office — day at a glance</option>
            </select>
          </label>
          <Button type="submit" size="sm">
            Mint kiosk link
          </Button>
        </form>

        {fresh && (
          <article className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
            <p className="text-sm font-medium">New board URL — load this on the wall screen</p>
            <p className="mt-1 break-all font-mono text-sm">{boardUrl(fresh.token)}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => copy(boardUrl(fresh.token))}>
                Copy URL
              </Button>
              <Button size="sm" variant="secondary" asChild>
                <a href={boardUrl(fresh.token)} target="_blank" rel="noreferrer">
                  Open board
                </a>
              </Button>
            </div>
          </article>
        )}

        <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
          {(boards.data ?? []).map((b) => (
            <li key={b.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">{b.name}</span>
                  <Badge variant="outline">{b.kind}</Badge>
                  {!b.active && <Badge variant="warn">revoked</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">
                  {b.location} · {b.tokenHint}
                  {b.lastSeen ? ` · last seen ${formatDateTime(b.lastSeen)}` : " · never opened"}
                </p>
              </div>
              {b.active && (
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary" onClick={() => copy(boardUrl(b.token))}>
                    Copy URL
                  </Button>
                  <Button size="sm" variant="ghost" asChild>
                    <Link to="/board/$token" params={{ token: b.token }}>
                      Preview
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      rotateBoard({ data: { id: b.id } }).then((next) => {
                        if (next) {
                          setFresh(next);
                          toast.success("Token rotated — old screens go dark");
                        }
                        qc.invalidateQueries({ queryKey: ["display-boards"] });
                      })
                    }
                  >
                    Rotate
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      revokeBoard({ data: { id: b.id } }).then(() => {
                        toast.success("Board revoked");
                        qc.invalidateQueries({ queryKey: ["display-boards"] });
                      })
                    }
                  >
                    Revoke
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
