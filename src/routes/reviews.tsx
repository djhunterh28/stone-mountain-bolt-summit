import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { getReviewsDesk, requestReview, runDueReviews, saveReviewSchedule } from "@/lib/crm/reviews";
import { formatDate, formatDateTime } from "@/lib/utils";

export const Route = createFileRoute("/reviews")({ component: ReviewsPage });

function copy(text: string) {
  void navigator.clipboard.writeText(text).then(() => toast.success("Link copied"));
}

function ReviewsPage() {
  const desk = useQuery({ queryKey: ["reviews-desk"], queryFn: () => getReviewsDesk() });
  const qc = useQueryClient();
  const d = desk.data;
  const [days, setDays] = useState<number | "">("");
  const [channel, setChannel] = useState("");

  function refresh() {
    void qc.invalidateQueries({ queryKey: ["reviews-desk"] });
    void qc.invalidateQueries({ queryKey: ["directory-profile"] });
  }

  return (
    <div className="pb-12">
      <PageHeader
        title="Reviews"
        subtitle="Ask after the show on a schedule. Client replies here, then we point them at Google, Yelp, Facebook, WeddingWire, The Knot, or Zola. Directory and WordPress drafts follow."
      />

      {desk.isLoading || !d ? (
        <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-5 sm:px-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-5 sm:px-6">
          <Stat label="Asked" value={String(d.stats.asked)} hint="Waiting on the client" />
          <Stat label="Received" value={String(d.stats.received)} hint="In the house" />
          <Stat label="Posted out" value={String(d.stats.published)} hint="Google / Yelp / etc." />
          <Stat label="Directory" value={String(d.stats.directory)} hint="Zenvents profile" />
          <Stat label="WP drafts" value={String(d.stats.wp)} hint="Staged, not live" />
        </div>
      )}

      {d && (
        <div className="mt-6 grid gap-4 px-4 lg:grid-cols-2 sm:px-6">
          <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
            <h2 className="text-sm font-medium">Schedule</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Requests fire {d.schedule.daysAfter} days after the event via {d.schedule.channel}.{" "}
              {d.schedule.enabled ? "On." : "Paused."}
            </p>
            <form
              className="mt-3 flex flex-wrap items-end gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void saveReviewSchedule({
                  data: {
                    daysAfter: typeof days === "number" ? days : d.schedule.daysAfter,
                    channel: channel || d.schedule.channel,
                    enabled: true,
                  },
                }).then((r) => {
                  toast.success(`Ask ${r.daysAfter} days after via ${r.channel}`);
                  refresh();
                });
              }}
            >
              <div>
                <Label htmlFor="days">Days after</Label>
                <Input
                  id="days"
                  type="number"
                  min={0}
                  max={60}
                  className="w-24"
                  defaultValue={d.schedule.daysAfter}
                  onChange={(e) => setDays(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="ch">Channel</Label>
                <select
                  id="ch"
                  className="h-9 rounded-md bg-secondary px-2 text-sm shadow-[var(--shadow-border)]"
                  defaultValue={d.schedule.channel}
                  onChange={(e) => setChannel(e.target.value)}
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="portal">Portal</option>
                </select>
              </div>
              <Button type="submit" size="sm">
                Save schedule
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() =>
                  runDueReviews().then((r) => {
                    toast.success(`${r.sent} of ${r.due} due requests sent`);
                    refresh();
                  })
                }
              >
                Run due now
              </Button>
            </form>
          </section>

          <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
            <h2 className="text-sm font-medium">Ask a won show</h2>
            <ul className="mt-3 divide-y divide-border">
              {d.won.map((w) => (
                <li key={w.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                  <div>
                    <div className="text-sm">{w.title}</div>
                    <p className="text-xs text-muted-foreground">
                      {w.person} · {formatDate(w.eventDate)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      requestReview({ data: { dealId: w.id, sendNow: true } }).then((r) => {
                        if (!r.ok) toast.error(r.error ?? "Blocked");
                        else toast.success("Request sent");
                        refresh();
                      })
                    }
                  >
                    Send now
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      <section className="mt-6 px-4 sm:px-6">
        <h2 className="text-sm font-medium">Requests</h2>
        <ul className="mt-3 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
          {(d?.reviews ?? []).map((r) => (
            <li key={r.id} className="space-y-1.5 px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">{r.author ?? "Client"}</span>
                {r.stars > 0 && <span className="text-xs text-muted-foreground">{r.stars}★</span>}
                <span className="text-xs text-muted-foreground">{r.deal}</span>
                <Badge variant={r.status === "published" ? "success" : r.status === "received" ? "steel" : "outline"}>
                  {r.status}
                </Badge>
                {r.platform && <Badge variant="outline">{r.platform}</Badge>}
                {r.directoryAt && <Badge variant="success">directory</Badge>}
                {r.wpDraft && <Badge variant="outline">WP draft</Badge>}
              </div>
              {r.body && <p className="text-sm text-muted-foreground">{r.body}</p>}
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>
                  {r.source ?? r.channel}
                  {r.dueAt ? ` · due ${formatDateTime(r.dueAt)}` : ""}
                </span>
                {r.token && (
                  <Button size="sm" variant="ghost" onClick={() => copy(`${window.location.origin}/r/${r.token}`)}>
                    Copy link
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {d && d.drafts.length > 0 && (
        <section className="mt-6 px-4 sm:px-6">
          <h2 className="text-sm font-medium">WordPress drafts</h2>
          <ul className="mt-3 divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
            {d.drafts.map((w) => (
              <li key={w.id} className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{w.title}</span>
                  <Badge variant="outline">{w.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{w.body}</p>
                <p className="mt-1 text-xs text-muted-foreground">Staged {formatDateTime(w.stagedAt)}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {d && d.clicks.length > 0 && (
        <p className="mt-4 px-4 text-xs text-muted-foreground sm:px-6">
          Platforms used: {d.clicks.map((c) => `${c.platform} ×${c.n}`).join(" · ")}
        </p>
      )}
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <article className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
      <div className="text-xs tracking-wide text-muted-foreground uppercase">{label}</div>
      <div className="mt-2 font-mono text-2xl tabular-nums">{value}</div>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </article>
  );
}
