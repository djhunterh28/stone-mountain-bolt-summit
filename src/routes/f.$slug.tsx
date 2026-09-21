import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormFill, useEmbedHeight } from "@/components/crm/form-fill";
import { Button } from "@/components/ui/button";
import { getFormBySlug, submitForm } from "@/lib/crm/forms";
import { cn } from "@/lib/utils";

type Search = { embed?: true; vendor?: string };

export const Route = createFileRoute("/f/$slug")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    embed: s.embed === "1" || s.embed === true ? true : undefined,
    vendor: typeof s.vendor === "string" ? s.vendor : undefined,
  }),
  component: PublicForm,
});

function PublicForm() {
  const { slug } = Route.useParams();
  const search = Route.useSearch();
  const embed = Boolean(search.embed);
  const vendor = search.vendor;
  const q = useQuery({
    queryKey: ["form", slug, vendor ?? ""],
    queryFn: () => getFormBySlug({ data: { slug, vendor } }),
  });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  useEmbedHeight(embed);

  const data = q.data;
  const form = data && data.ok ? data.form : null;
  const vendorName = data && data.ok ? data.vendor?.name : null;

  const chrome = useMemo(() => !embed, [embed]);

  return (
    <div className={cn("mx-auto min-h-dvh max-w-lg", embed ? "px-3 py-4" : "px-5 py-12")}>
      {chrome && (
        <div className="mb-8 flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="size-6 text-primary" aria-hidden>
            <rect x="4" y="5" width="3.2" height="14" rx="0.6" fill="currentColor" />
            <rect x="9.4" y="8" width="3.2" height="11" rx="0.6" fill="currentColor" opacity="0.7" />
            <rect x="14.8" y="3" width="3.2" height="16" rx="0.6" fill="currentColor" />
          </svg>
          <span className="text-sm font-semibold">Northline</span>
        </div>
      )}

      {q.isLoading && <p className="text-sm text-muted-foreground">Loading form…</p>}

      {data && !data.ok && data.reason === "vendor" && (
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{data.form?.name ?? "Assigned form"}</h1>
          <p className="text-sm text-muted-foreground">
            This packet is vendor-specific. Open the link Accounts sent — the token in the URL is the key, no login.
          </p>
        </div>
      )}

      {data && !data.ok && data.reason !== "vendor" && (
        <p className="text-sm text-muted-foreground">Form not found or no longer active.</p>
      )}

      {form && !sent && (
        <FormFill
          name={form.name}
          description={form.description}
          thankYou={form.thankYou}
          fields={form.fields}
          steps={form.steps}
          wizard={form.wizard}
          vendorName={vendorName}
          submitting={busy}
          onSubmit={(payload, files) => {
            setBusy(true);
            void submitForm({
              data: {
                slug,
                payload,
                vendorToken: vendor,
                source: embed ? "embed" : vendor ? "vendor" : "public",
                files,
              },
            }).then((r) => {
              setBusy(false);
              if (r.ok) {
                setSent(true);
                toast.success("Received");
                if (embed) window.parent?.postMessage({ type: "nl-form-submitted", slug }, "*");
              } else {
                toast.error("error" in r ? r.error : "Could not submit");
              }
            });
          }}
        />
      )}

      {form && sent && (
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Got it.</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {form.thankYou || "An account executive will be in touch. If this is load-in this week, call the shop."}
          </p>
          {chrome && (
            <Button asChild className="mt-6" variant="secondary">
              <Link to="/leads">Back to workspace</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
