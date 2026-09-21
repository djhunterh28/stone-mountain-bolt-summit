import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HpMark } from "@/components/portal/hp-mark";
import {
  REVIEW_PLATFORMS,
  clickReviewPlatform,
  getReviewPublic,
  submitReview,
} from "@/lib/crm/reviews";
import { formatDate } from "@/lib/utils";

export const Route = createFileRoute("/r/$token")({ component: PublicReview });

function PublicReview() {
  const { token } = Route.useParams();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["review-public", token],
    queryFn: () => getReviewPublic({ data: { token } }),
  });
  const [stars, setStars] = useState(5);
  const [body, setBody] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const r = q.data?.review;
  const done = Boolean(r?.submittedAt && r.body);

  return (
    <main className="min-h-dvh bg-[#F5F3EE] text-[#0B1220]">
      <div className="mx-auto max-w-lg px-6 py-12">
        <div className="flex items-center gap-2.5">
          <HpMark className="size-8" />
          <div>
            <div className="text-sm font-semibold tracking-tight">Hurricane Productions</div>
            <p className="text-[11px] tracking-wide text-black/45 uppercase">How was the show</p>
          </div>
        </div>

        {!q.data?.ok || !r ? (
          <p className="mt-10 text-sm text-black/55">This review link is not valid.</p>
        ) : (
          <>
            <h1 className="mt-10 text-3xl font-semibold tracking-tight text-balance">{r.deal ?? "Your event"}</h1>
            <p className="mt-2 text-sm text-black/55">
              {r.venue}
              {r.eventDate ? ` · ${formatDate(r.eventDate)}` : ""}
            </p>

            {!done ? (
              <form
                className="mt-8 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  void submitReview({ data: { token, stars, body, source: "link" } }).then((res) => {
                    if (!res.ok) setErr(res.error ?? "Could not save");
                    else {
                      setErr(null);
                      void qc.invalidateQueries({ queryKey: ["review-public", token] });
                    }
                  });
                }}
              >
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className="h-10 w-10 rounded-md text-lg"
                      style={{ background: n <= stars ? "#0D47A1" : "#e6e2d8", color: n <= stars ? "#F5F3EE" : "#0B1220" }}
                      onClick={() => setStars(n)}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={5}
                  placeholder="What should the next producer know?"
                />
                {err && <p className="text-sm text-red-800">{err}</p>}
                <Button type="submit" className="bg-[#0D47A1] text-[#F5F3EE] hover:bg-[#0D47A1]/90">
                  Submit review
                </Button>
              </form>
            ) : (
              <div className="mt-8">
                <p className="text-sm">
                  <span className="font-medium">{r.stars}★</span> — thank you. It is on our directory and staged as a WordPress draft.
                </p>
                <blockquote className="mt-3 border-l-2 border-[#0D47A1] pl-3 text-sm text-black/70">{r.body}</blockquote>
                <h2 className="mt-8 text-sm font-medium">Post it where it counts</h2>
                <p className="mt-1 text-xs text-black/50">
                  We record which platform you open. Google, Yelp, Facebook, WeddingWire, The Knot, or Zola.
                </p>
                <ul className="mt-4 grid grid-cols-2 gap-2">
                  {REVIEW_PLATFORMS.map((p) => {
                    const used = r.clicks.includes(p.id) || r.platform === p.id;
                    return (
                      <li key={p.id}>
                        <Button
                          className="w-full"
                          variant={used ? "secondary" : "default"}
                          onClick={() =>
                            clickReviewPlatform({ data: { token, platform: p.id } }).then((res) => {
                              void qc.invalidateQueries({ queryKey: ["review-public", token] });
                              if (res.href) window.open(res.href, "_blank", "noopener");
                            })
                          }
                        >
                          {used ? `Posted on ${p.label}` : p.label}
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
