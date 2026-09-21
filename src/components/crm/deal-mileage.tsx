import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDealTravel, tripCost } from "@/lib/crm/travel";
import { useUi } from "@/lib/crm/store";
import { getBootstrap } from "@/lib/crm/server";
import { Stat, TripForm, TripList, usd } from "@/components/crm/mileage-shared";

export function DealMileageDesk({ dealId, venue }: { dealId: number; venue?: string | null }) {
  const qc = useQueryClient();
  const memberId = useUi((s) => s.memberId);
  const desk = useQuery({ queryKey: ["deal-travel", dealId], queryFn: () => getDealTravel({ data: { dealId } }) });
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const trips = desk.data?.trips ?? [];
  const totals = trips.reduce(
    (acc, t) => {
      const c = tripCost(t);
      acc.miles += t.miles;
      acc.trips += 1;
      acc.cost += c.total;
      acc.reimbursable += c.reimbursable;
      return acc;
    },
    { miles: 0, trips: 0, cost: 0, reimbursable: 0 },
  );

  function refresh() {
    void qc.invalidateQueries({ queryKey: ["deal-travel", dealId] });
    void qc.invalidateQueries({ queryKey: ["travel"] });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Shop-to-venue miles for this show{venue ? ` · ${venue}` : ""}. House totals live on{" "}
        <Link to="/travel" className="text-primary hover:underline">
          Mileage
        </Link>
        .
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Miles on this deal" value={`${totals.miles.toFixed(1)} mi`} hint={`${totals.trips} trips`} />
        <Stat label="Cost" value={usd(totals.cost)} hint="Fuel, IRS, tolls" />
        <Stat label="Reimbursable" value={usd(totals.reimbursable)} hint="Personal + IRS" />
      </div>
      <TripForm
        vehicles={desk.data?.vehicles ?? []}
        places={desk.data?.places ?? []}
        members={boot.data?.members ?? []}
        driverId={memberId}
        dealId={dealId}
        defaultDestId={desk.data?.destId}
        onSaved={refresh}
      />
      <TripList trips={trips} onStatus={refresh} />
    </div>
  );
}
