import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { trackSmtp } from "@/lib/crm/smtp";

export const Route = createFileRoute("/t/$id")({ component: TrackPage });

function TrackPage() {
  const { id } = Route.useParams();
  const click = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("c") === "1";
  const q = useQuery({
    queryKey: ["smtp-track", id, click],
    queryFn: () => trackSmtp({ data: { id: Number(id), click } }),
  });
  const d = q.data;

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">Hurricane Productions</p>
      <h1 className="mt-2 text-xl font-semibold">{d?.clicked ? "Link recorded" : "Receipt opened"}</h1>
      {!d || q.isLoading ? (
        <p className="mt-4 text-sm text-muted-foreground">Recording delivery…</p>
      ) : !d.ok ? (
        <p className="mt-4 text-sm text-muted-foreground">This tracking link is not valid.</p>
      ) : (
        <p className="mt-4 text-sm leading-relaxed">
          {d.subject} was marked {d.clicked ? "clicked" : "opened"} for {d.toAddr}. This is a transactional receipt, not marketing mail.
        </p>
      )}
    </div>
  );
}
