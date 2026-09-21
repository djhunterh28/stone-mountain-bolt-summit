import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getDashboard,
  listAudit,
  listEventRequests,
  listNotifPrefs,
  listSubusers,
  listTenants,
  setNotifPref,
  setTenantQuota,
  switchTenant,
} from "@/lib/portal/server";
import { formatBytes } from "@/lib/utils";

export function AdminPanel() {
  const qc = useQueryClient();
  const tenants = useQuery({ queryKey: ["tenants"], queryFn: () => listTenants() });
  const audit = useQuery({ queryKey: ["audit"], queryFn: () => listAudit() });
  const events = useQuery({ queryKey: ["event-requests"], queryFn: () => listEventRequests() });
  const prefs = useQuery({ queryKey: ["notif-prefs"], queryFn: () => listNotifPrefs() });
  const team = useQuery({ queryKey: ["subusers"], queryFn: () => listSubusers() });
  const dash = useQuery({ queryKey: ["dashboard"], queryFn: () => getDashboard() });
  const [password, setPassword] = useState("");
  const [quota, setQuota] = useState<Record<number, string>>({});

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Hurricane staff controls — clients, storage, audit, and event requests from the marketing site.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
          <div className="text-xs text-muted-foreground uppercase">Tenants</div>
          <div className="mt-2 font-mono text-2xl">{tenants.data?.length ?? "—"}</div>
        </div>
        <div className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
          <div className="text-xs text-muted-foreground uppercase">Open signatures</div>
          <div className="mt-2 font-mono text-2xl">{dash.data?.signatures ?? "—"}</div>
        </div>
        <div className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
          <div className="text-xs text-muted-foreground uppercase">Event requests</div>
          <div className="mt-2 font-mono text-2xl">{events.data?.length ?? "—"}</div>
        </div>
      </div>
      <Tabs defaultValue="clients">
        <TabsList className="flex h-auto flex-wrap">
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="switch">Switcher</TabsTrigger>
          <TabsTrigger value="events">Event requests</TabsTrigger>
          <TabsTrigger value="notes">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="clients" className="mt-4">
          <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
            {(tenants.data ?? []).map((t) => (
              <li key={t.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {t.industry} · {t.slug}
                  </div>
                </div>
                <Badge variant="outline">
                  {Math.round(t.usedMb)} MB / {t.quotaGb} GB
                </Badge>
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="team" className="mt-4">
          <ul className="divide-y divide-border rounded-xl bg-card text-sm shadow-[var(--shadow-border)]">
            {(team.data ?? []).map((s) => (
              <li key={s.userId} className="px-4 py-3">
                {s.name} · {s.email}
              </li>
            ))}
            {(team.data ?? []).length === 0 && <li className="px-4 py-6 text-muted-foreground">Invite from Profile.</li>}
          </ul>
        </TabsContent>
        <TabsContent value="audit" className="mt-4">
          <ul className="max-h-[28rem] overflow-auto divide-y divide-border rounded-xl bg-card text-sm shadow-[var(--shadow-border)]">
            {(audit.data ?? []).map((a) => (
              <li key={a.id} className="px-4 py-2.5">
                <span className="font-medium">{a.action}</span> {a.entity}
                <div className="text-xs text-muted-foreground">
                  {a.email} · {a.ip} · {a.at}
                </div>
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="storage" className="mt-4 space-y-3">
          {(tenants.data ?? []).map((t) => (
            <div key={t.id} className="flex flex-wrap items-center gap-3 rounded-xl bg-card px-4 py-3 shadow-[var(--shadow-border)]">
              <div className="min-w-40 flex-1">
                <div className="text-sm">{t.name}</div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary" style={{ width: `${Math.min(100, (t.usedMb / (t.quotaGb * 1000)) * 100)}%` }} />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {formatBytes(t.usedMb * 1_000_000)} of {t.quotaGb} GB
                </div>
              </div>
              <Input
                className="w-24"
                type="number"
                value={quota[t.id] ?? String(t.quotaGb)}
                onChange={(e) => setQuota((s) => ({ ...s, [t.id]: e.target.value }))}
              />
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  setTenantQuota({ data: { tenantId: t.id, quotaGb: Number(quota[t.id] ?? t.quotaGb) } }).then(() => {
                    toast.success("Quota saved");
                    qc.invalidateQueries({ queryKey: ["tenants"] });
                  })
                }
              >
                Set
              </Button>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="switch" className="mt-4 max-w-md space-y-3">
          <p className="text-sm text-muted-foreground">Re-enter staff password to impersonate a client tenant.</p>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Staff password" />
          {(tenants.data ?? []).map((t) => (
            <Button
              key={t.id}
              variant="secondary"
              className="w-full justify-between"
              onClick={() =>
                switchTenant({ data: { tenantId: t.id, password } }).then((r) => {
                  if (!r.ok) toast.error("error" in r ? r.error : "Blocked");
                  else {
                    toast.success(`Now viewing ${t.name}`);
                    qc.invalidateQueries({ queryKey: ["portal-me"] });
                    qc.invalidateQueries({ queryKey: ["dashboard"] });
                  }
                })
              }
            >
              {t.name}
              <span className="text-xs text-muted-foreground">impersonate</span>
            </Button>
          ))}
          <Button variant="ghost" onClick={() => switchTenant({ data: { tenantId: null } }).then(() => qc.invalidateQueries({ queryKey: ["portal-me"] }))}>
            Exit impersonation
          </Button>
        </TabsContent>
        <TabsContent value="events" className="mt-4">
          <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
            {(events.data ?? []).map((e) => (
              <li key={e.id} className="px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{e.name}</span>
                  <Badge variant="outline">{e.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {e.email} · {e.venue} · {e.guests ?? "?"} pax
                </p>
                <p className="mt-1 text-sm">{e.notes}</p>
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="notes" className="mt-4 space-y-2">
          {(prefs.data ?? []).map((n) => (
            <label key={`${n.tenantId}-${n.kind}`} className="flex items-center justify-between rounded-lg bg-card px-4 py-3 text-sm shadow-[var(--shadow-border)]">
              Tenant {n.tenantId} · {n.kind}
              <input
                type="checkbox"
                checked={n.enabled}
                onChange={(e) =>
                  setNotifPref({ data: { tenantId: n.tenantId, kind: n.kind, enabled: e.target.checked } }).then(() =>
                    qc.invalidateQueries({ queryKey: ["notif-prefs"] }),
                  )
                }
              />
            </label>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
