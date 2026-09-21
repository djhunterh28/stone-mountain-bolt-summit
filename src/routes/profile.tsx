import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getPortalMe,
  inviteSubuser,
  listAudit,
  listNotifPrefs,
  listSubusers,
  setNotifPref,
  updatePortalProfile,
} from "@/lib/portal/server";
import { useUi } from "@/lib/crm/store";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

const THEMES = ["paper", "graphite", "stage", "dawn"];

function ProfilePage() {
  const me = useQuery({ queryKey: ["portal-me"], queryFn: () => getPortalMe() });
  const subs = useQuery({ queryKey: ["subusers"], queryFn: () => listSubusers() });
  const prefs = useQuery({ queryKey: ["notif-prefs"], queryFn: () => listNotifPrefs() });
  const audit = useQuery({ queryKey: ["audit-me"], queryFn: () => listAudit() });
  const qc = useQueryClient();
  const setDirty = useUi((s) => s.setDirty);
  const p = me.data;
  const [name, setName] = useState("");
  const [invite, setInvite] = useState({ name: "", email: "" });

  if (!p) return <p className="p-6 text-sm text-muted-foreground">Loading profile…</p>;

  return (
    <div className="pb-12">
      <PageHeader title={p.name} subtitle={`${p.email} · ${p.role} · ${p.tenantName ?? "House"}`} />
      <div className="px-4 sm:px-6">
        <Tabs defaultValue="info">
          <TabsList className="flex h-auto flex-wrap">
            <TabsTrigger value="info">Contact</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="access">Accessibility</TabsTrigger>
            <TabsTrigger value="notes">Notifications</TabsTrigger>
            <TabsTrigger value="audit">Audit</TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="mt-4 max-w-lg space-y-3">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input
                defaultValue={p.name}
                onChange={(e) => {
                  setName(e.target.value);
                  setDirty(true);
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">Email is the username and cannot be changed here. Updates append to Pipedrive.</p>
            <Button
              onClick={() =>
                updatePortalProfile({ data: { name: name || p.name } }).then(() => {
                  setDirty(false);
                  toast.success("Profile saved · Pipedrive append");
                  qc.invalidateQueries({ queryKey: ["portal-me"] });
                })
              }
            >
              Save
            </Button>
          </TabsContent>
          <TabsContent value="team" className="mt-4 space-y-4">
            <form
              className="flex flex-wrap gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void inviteSubuser({
                  data: {
                    ...invite,
                    permissions: { files: true, projects: true, billing: false, approvals: true },
                  },
                }).then((r) => {
                  if (!r.ok) toast.error("error" in r ? r.error : "Invite failed");
                  else toast.success("Invited");
                  qc.invalidateQueries({ queryKey: ["subusers"] });
                });
              }}
            >
              <Input placeholder="Name" value={invite.name} onChange={(e) => setInvite({ ...invite, name: e.target.value })} required />
              <Input type="email" placeholder="Email" value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })} required />
              <Button type="submit" variant="secondary">
                Invite sub-user
              </Button>
            </form>
            <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
              {(subs.data ?? []).map((s) => (
                <li key={s.userId} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span>
                    {s.name}
                    <span className="block text-xs text-muted-foreground">{s.email}</span>
                  </span>
                  <Badge variant="outline">granular</Badge>
                </li>
              ))}
              {(subs.data ?? []).length === 0 && <li className="px-4 py-6 text-sm text-muted-foreground">No teammates yet.</li>}
            </ul>
          </TabsContent>
          <TabsContent value="access" className="mt-4 max-w-lg space-y-4">
            <div className="space-y-1.5">
              <Label>Portal theme</Label>
              <div className="flex flex-wrap gap-2">
                {THEMES.map((t) => (
                  <Button
                    key={t}
                    size="sm"
                    variant={p.theme === t ? "secondary" : "ghost"}
                    onClick={() => updatePortalProfile({ data: { theme: t } }).then(() => qc.invalidateQueries({ queryKey: ["portal-me"] }))}
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </div>
            <label className="flex items-center justify-between gap-3 text-sm">
              Compact mode
              <Switch checked={p.compact} onCheckedChange={(v) => updatePortalProfile({ data: { compact: v } }).then(() => qc.invalidateQueries({ queryKey: ["portal-me"] }))} />
            </label>
            <label className="flex items-center justify-between gap-3 text-sm">
              High contrast
              <Switch checked={p.highContrast} onCheckedChange={(v) => updatePortalProfile({ data: { highContrast: v } }).then(() => qc.invalidateQueries({ queryKey: ["portal-me"] }))} />
            </label>
            <label className="flex items-center justify-between gap-3 text-sm">
              Screen-reader optimization
              <Switch checked={p.screenReader} onCheckedChange={(v) => updatePortalProfile({ data: { screenReader: v } }).then(() => qc.invalidateQueries({ queryKey: ["portal-me"] }))} />
            </label>
          </TabsContent>
          <TabsContent value="notes" className="mt-4 space-y-2">
            {(prefs.data ?? []).map((n) => (
              <label key={`${n.tenantId}-${n.kind}`} className="flex items-center justify-between rounded-lg bg-card px-4 py-3 text-sm shadow-[var(--shadow-border)]">
                {n.kind}
                <Switch
                  checked={n.enabled}
                  onCheckedChange={(v) => setNotifPref({ data: { tenantId: n.tenantId, kind: n.kind, enabled: v } }).then(() => qc.invalidateQueries({ queryKey: ["notif-prefs"] }))}
                />
              </label>
            ))}
          </TabsContent>
          <TabsContent value="audit" className="mt-4">
            <ul className="divide-y divide-border rounded-xl bg-card text-sm shadow-[var(--shadow-border)]">
              {(audit.data ?? []).slice(0, 20).map((a) => (
                <li key={a.id} className="px-4 py-2.5">
                  <span className="font-medium">{a.action}</span>{" "}
                  <span className="text-muted-foreground">{a.entity}</span>
                  <div className="text-xs text-muted-foreground">
                    {a.email} · {a.ip}
                  </div>
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
