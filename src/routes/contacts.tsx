import { useMemo, useState } from "react";
import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { listOrgs, listPeople, mergePeople } from "@/lib/crm/server";
import { useUi } from "@/lib/crm/store";
import { formatUsd } from "@/lib/utils";

export const Route = createFileRoute("/contacts")({ component: ContactsLayout });

function ContactsLayout() {
  const nested = useRouterState({
    select: (s) => s.location.pathname !== "/contacts" && s.location.pathname.startsWith("/contacts/"),
  });
  if (nested) return <Outlet />;
  return <ContactsPage />;
}

function ContactsPage() {
  const [tab, setTab] = useState("people");
  const [q, setQ] = useState("");
  const [keep, setKeep] = useState<number | null>(null);
  const { setAddOpen } = useUi();
  const qc = useQueryClient();
  const people = useQuery({ queryKey: ["people"], queryFn: () => listPeople() });
  const orgs = useQuery({ queryKey: ["orgs"], queryFn: () => listOrgs() });

  const merge = useMutation({
    mutationFn: (dropId: number) => mergePeople({ data: { keepId: keep!, dropId } }),
    onSuccess: () => {
      toast.success("Merged duplicate");
      setKeep(null);
      qc.invalidateQueries({ queryKey: ["people"] });
    },
  });

  const pq = q.toLowerCase();
  const peopleList = (people.data ?? []).filter((p) =>
    `${p.name} ${p.email ?? ""} ${p.orgName ?? ""}`.toLowerCase().includes(pq),
  );
  const orgList = (orgs.data ?? []).filter((o) =>
    `${o.name} ${o.city ?? ""} ${o.industry ?? ""}`.toLowerCase().includes(pq),
  );

  const pins = useMemo(
    () =>
      [...(people.data ?? []), ...(orgs.data ?? [])]
        .filter((x) => x.lat != null && x.lng != null)
        .map((x) => ({
          id: `${"email" in x ? "p" : "o"}-${x.id}`,
          name: x.name,
          city: x.city,
          lat: x.lat as number,
          lng: x.lng as number,
        })),
    [people.data, orgs.data],
  );

  return (
    <div>
      <PageHeader
        title="Contacts"
        subtitle="People, organizations, and a map of the five boroughs."
        actions={
          <>
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="h-9 w-44" />
            <Button size="sm" variant="secondary" onClick={() => setAddOpen(true, tab === "orgs" ? "org" : "person")}>
              Add
            </Button>
          </>
        }
      />
      <div className="px-4 sm:px-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="people">People</TabsTrigger>
            <TabsTrigger value="orgs">Organizations</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {tab === "people" && (
        <div className="mt-3 overflow-x-auto">
          {keep && (
            <p className="px-4 pb-2 text-xs text-muted-foreground sm:px-6">
              Merge mode: click another person to fold them into the keeper.{" "}
              <button className="underline" onClick={() => setKeep(null)}>
                Cancel
              </button>
            </p>
          )}
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium sm:px-6">Name</th>
                <th className="px-2 py-2 font-medium">Org</th>
                <th className="px-2 py-2 font-medium">Email</th>
                <th className="px-2 py-2 text-right font-medium">Open</th>
                <th className="px-4 py-2 sm:px-6" />
              </tr>
            </thead>
            <tbody>
              {peopleList.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-2.5 sm:px-6">
                    <Link to="/contacts/$personId" params={{ personId: String(p.id) }} className="hover:underline">
                      {p.name}
                    </Link>
                    <div className="text-xs text-muted-foreground">{p.title}</div>
                  </td>
                  <td className="px-2 py-2.5 text-muted-foreground">
                    {p.orgId ? (
                      <Link to="/orgs/$orgId" params={{ orgId: String(p.orgId) }} className="hover:underline">
                        {p.orgName}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-2 py-2.5 text-muted-foreground">{p.email ?? "—"}</td>
                  <td className="px-2 py-2.5 text-right font-mono tabular-nums">{formatUsd(p.dealValue)}</td>
                  <td className="px-4 py-2.5 sm:px-6">
                    {keep === p.id ? (
                      <Badge variant="steel">Keeper</Badge>
                    ) : keep ? (
                      <Button size="sm" variant="ghost" onClick={() => merge.mutate(p.id)}>
                        Merge into keeper
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => setKeep(p.id)}>
                        Merge
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "orgs" && (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium sm:px-6">Organization</th>
                <th className="px-2 py-2 font-medium">City</th>
                <th className="px-2 py-2 font-medium">Industry</th>
                <th className="px-2 py-2 text-right font-medium">People</th>
                <th className="px-4 py-2 text-right font-medium sm:px-6">Pipeline</th>
              </tr>
            </thead>
            <tbody>
              {orgList.map((o) => (
                <tr key={o.id} className="border-t border-border">
                  <td className="px-4 py-2.5 sm:px-6">
                    <Link to="/orgs/$orgId" params={{ orgId: String(o.id) }} className="hover:underline">
                      {o.name}
                    </Link>
                    <div className="text-xs text-muted-foreground">{o.address}</div>
                  </td>
                  <td className="px-2 py-2.5">{o.city}</td>
                  <td className="px-2 py-2.5 text-muted-foreground">{o.industry}</td>
                  <td className="px-2 py-2.5 text-right tabular-nums">{o.peopleCount}</td>
                  <td className="px-4 py-2.5 text-right font-mono tabular-nums sm:px-6">{formatUsd(o.dealValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "map" && <NycMap pins={pins} />}
    </div>
  );
}

function NycMap({
  pins,
}: {
  pins: { id: string; name: string; city: string | null; lat: number; lng: number }[];
}) {
  // NYC bounds ~ 40.58–40.92 N, 74.05–73.70 W
  const minLat = 40.56;
  const maxLat = 40.92;
  const minLng = -74.08;
  const maxLng = -73.7;
  return (
    <div className="relative mx-4 my-4 h-[28rem] overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)] sm:mx-6">
      <svg viewBox="0 0 800 520" className="h-full w-full">
        <rect width="800" height="520" fill="var(--color-muted)" />
        <path
          d="M120 80 L260 70 L280 180 L220 260 L140 240 Z"
          fill="var(--color-accent)"
          stroke="var(--color-border)"
        />
        <text x="170" y="150" fill="var(--color-muted-foreground)" fontSize="11">
          Manhattan
        </text>
        <path
          d="M280 200 L480 190 L520 360 L300 400 L250 280 Z"
          fill="var(--color-accent)"
          stroke="var(--color-border)"
        />
        <text x="360" y="300" fill="var(--color-muted-foreground)" fontSize="11">
          Brooklyn
        </text>
        <path
          d="M480 120 L720 140 L700 280 L500 260 Z"
          fill="var(--color-accent)"
          stroke="var(--color-border)"
        />
        <text x="560" y="200" fill="var(--color-muted-foreground)" fontSize="11">
          Queens
        </text>
        <path
          d="M80 280 L220 270 L240 430 L60 440 Z"
          fill="var(--color-accent)"
          stroke="var(--color-border)"
        />
        <text x="110" y="360" fill="var(--color-muted-foreground)" fontSize="11">
          Staten
        </text>
        {pins.map((p) => {
          const x = ((p.lng - minLng) / (maxLng - minLng)) * 800;
          const y = ((maxLat - p.lat) / (maxLat - minLat)) * 520;
          return (
            <g key={p.id}>
              <circle cx={x} cy={y} r="5" fill="var(--color-primary)" />
              <title>{`${p.name} · ${p.city}`}</title>
            </g>
          );
        })}
      </svg>
      <div className="absolute bottom-3 left-3 max-h-40 overflow-auto rounded-md bg-background/90 p-2 text-xs shadow-[var(--shadow-border)]">
        {pins.map((p) => (
          <div key={p.id} className="py-0.5">
            {p.name}
            <span className="text-muted-foreground"> · {p.city}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
