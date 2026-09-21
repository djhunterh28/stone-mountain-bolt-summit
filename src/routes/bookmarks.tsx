import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listBookmarks, mutateBookmark } from "@/lib/portal/server";

export const Route = createFileRoute("/bookmarks")({ component: BookmarksPage });

function BookmarksPage() {
  const qc = useQueryClient();
  const marks = useQuery({ queryKey: ["bookmarks"], queryFn: () => listBookmarks() });
  const [label, setLabel] = useState("");
  const [href, setHref] = useState("/home");
  const refresh = () => qc.invalidateQueries({ queryKey: ["bookmarks"] });

  return (
    <div className="pb-12">
      <PageHeader title="Bookmarks" subtitle="Pin shows, files, and signing envelopes." />
      <form
        className="mb-6 flex flex-wrap gap-2 px-4 sm:px-6"
        onSubmit={(e) => {
          e.preventDefault();
          void mutateBookmark({ data: { op: "add", label, href } }).then(() => {
            setLabel("");
            refresh();
          });
        }}
      >
        <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label" required className="max-w-xs" />
        <Input value={href} onChange={(e) => setHref(e.target.value)} placeholder="/projects/3" className="max-w-xs" />
        <Button type="submit" variant="secondary">
          Add
        </Button>
      </form>
      <ul className="divide-y divide-border border-t border-border">
        {(marks.data ?? []).map((b, i, arr) => (
          <li key={b.id} className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <Link to={b.href as "/"} className="flex-1 text-sm hover:underline">
              {b.label}
              <span className="ml-2 text-xs text-muted-foreground">{b.href}</span>
            </Link>
            <Button
              size="sm"
              variant="ghost"
              disabled={i === 0}
              onClick={() => {
                const ids = arr.map((x) => x.id);
                [ids[i - 1], ids[i]] = [ids[i], ids[i - 1]];
                void mutateBookmark({ data: { op: "reorder", ids } }).then(refresh);
              }}
            >
              Up
            </Button>
            <Button size="sm" variant="ghost" onClick={() => mutateBookmark({ data: { op: "del", id: b.id } }).then(refresh)}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
