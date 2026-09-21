import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { confirmUnsub, getUnsubPage } from "@/lib/crm/broadcast";

export const Route = createFileRoute("/u/$token")({ component: UnsubPage });

function UnsubPage() {
  const { token } = Route.useParams();
  const q = useQuery({
    queryKey: ["unsub", token],
    queryFn: () => getUnsubPage({ data: { token } }),
  });
  const [done, setDone] = useState(false);
  const data = q.data;

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">Hurricane Productions</p>
      <h1 className="mt-2 text-xl font-semibold">Unsubscribe</h1>
      {!data || q.isLoading ? (
        <p className="mt-4 text-sm text-muted-foreground">Checking this link…</p>
      ) : !data.ok ? (
        <p className="mt-4 text-sm text-muted-foreground">This link is not valid. If you still receive mail, forward it to the shop and we will take you off by hand.</p>
      ) : data.already || done ? (
        <p className="mt-4 text-sm leading-relaxed">
          {data.email} is off the client list. We will not send commercial mail to this address again. Transactional show mail (call sheets, invoices) may still arrive.
        </p>
      ) : (
        <>
          <p className="mt-4 text-sm leading-relaxed">
            Stop commercial mail to {data.email}. One click. We keep a physical record of the request.
          </p>
          <Button
            className="mt-6"
            onClick={() =>
              confirmUnsub({ data: { token } }).then((r) => {
                if (r.ok) setDone(true);
              })
            }
          >
            Take me off the list
          </Button>
        </>
      )}
    </div>
  );
}
