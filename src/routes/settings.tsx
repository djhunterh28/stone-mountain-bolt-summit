import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Monitor, Moon, Sun, Star, ChevronUp, ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MemberAvatar } from "@/components/crm/avatar";
import { createField, getBootstrap, listFields, listScores, updateStage } from "@/lib/crm/server";
import { createApiToken, getAdmin, revokeToken } from "@/lib/crm/ultimate";
import { createTeamInbox, getUsage } from "@/lib/crm/governance";
import { ULTIMATE_LIMITS } from "@/lib/crm/limits";
import { getBranding, saveBranding, syncPipedrive } from "@/lib/portal/server";
import { getAiDesk, saveAiProfile } from "@/lib/crm/ops";
import { ImportPanel } from "@/components/crm/import-panel";
import { SandboxPanel } from "@/components/crm/sandbox-panel";
import { AdminPanel } from "@/components/crm/admin-panel";
import { SecurityPanel } from "@/components/crm/security-panel";
import { MarketplacePanel } from "@/components/crm/marketplace-panel";
import { STAFF_NAV, catalogFor } from "@/components/layout/sidebar-nav";
import { getNavPrefs, insertBefore, mergeNavLayout, saveNavPrefs } from "@/lib/crm/prefs";
import { useUi } from "@/lib/crm/store";
import { THEME_OPTIONS, THEME_SWATCHES, type ThemePreference } from "@/lib/crm/theme";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  validateSearch: (s: Record<string, unknown>): { tab?: string } => ({
    tab: typeof s.tab === "string" ? s.tab : undefined,
  }),
});

const THEME_ICONS = { light: Sun, dark: Moon, system: Monitor } as const;

function AppearancePanel() {
  const theme = useUi((s) => s.theme);
  const setTheme = useUi((s) => s.setTheme);
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Daylight is warm paper and graphite. Nightline is the original steel desk. System follows the device.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {THEME_OPTIONS.map((opt) => {
          const Icon = THEME_ICONS[opt.id];
          const active = theme === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTheme(opt.id as ThemePreference)}
              className={cn(
                "rounded-xl p-4 text-left shadow-[var(--shadow-border)] transition-[box-shadow,background-color] duration-150 ease-out",
                active ? "bg-card ring-1 ring-ring" : "bg-card hover:shadow-[var(--shadow-border-hover)]",
              )}
            >
              <span className="flex items-center justify-between">
                <Icon className="size-4 text-muted-foreground" />
                {active && <Badge variant="steel">on</Badge>}
              </span>
              <div className="mt-6 text-sm font-medium">{opt.label}</div>
              <p className="mt-0.5 text-xs text-muted-foreground">{opt.hint}</p>
              <span className="mt-4 flex h-10 overflow-hidden rounded-md shadow-[var(--shadow-border)]" aria-hidden>
                {opt.id === "system" ? (
                  <>
                    <span className="w-1/2" style={{ background: THEME_SWATCHES.light.surface }} />
                    <span className="w-1/2" style={{ background: THEME_SWATCHES.dark.surface }} />
                  </>
                ) : (
                  <>
                    <span className="w-1/3" style={{ background: THEME_SWATCHES[opt.id].rail }} />
                    <span className="flex-1" style={{ background: THEME_SWATCHES[opt.id].surface }} />
                    <span className="w-8" style={{ background: THEME_SWATCHES[opt.id].ink }} />
                  </>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function IntegrationsPanel() {
  const brand = useQuery({ queryKey: ["branding"], queryFn: () => getBranding() });
  const qc = useQueryClient();
  const b = brand.data;
  if (!b) return <p className="text-sm text-muted-foreground">Loading connectors…</p>;
  return (
    <div className="space-y-4">
      <article className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
        <h3 className="text-sm font-medium">Pipedrive</h3>
        <p className="mt-1 text-xs text-muted-foreground">Last sync {b.pipedriveSyncedAt ?? "never"} · bidirectional upsert</p>
        <div className="mt-3 flex gap-2">
          <Input defaultValue={b.pipedriveToken} placeholder="API token" />
          <Button
            size="sm"
            onClick={() =>
              syncPipedrive().then((r) => {
                toast.success(`Synced ${r.people} people · ${r.deals} deals`);
                qc.invalidateQueries({ queryKey: ["branding"] });
              })
            }
          >
            Sync now
          </Button>
        </div>
      </article>
      <article className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
        <h3 className="text-sm font-medium">Google Drive</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {b.driveConnected ? "Connected · chunked uploads to 10 GB" : "Disconnected"}
        </p>
      </article>
      <article className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
        <h3 className="text-sm font-medium">Calendly, TidyCal, Acuity & Zoom</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Per-user scheduling plus Deezer and Google Places live on Integrations.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button asChild size="sm" variant="secondary">
            <Link to="/scheduler">Scheduler</Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link to="/integrations">All integrations</Link>
          </Button>
        </div>
      </article>
      <article className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
        <h3 className="text-sm font-medium">Zoho Books</h3>
        <Input defaultValue={b.zohoOrg} placeholder="Org id" onBlur={(e) => saveBranding({ data: { zohoOrg: e.target.value } })} />
      </article>
      <article className="space-y-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
        <h3 className="text-sm font-medium">E-sign branding</h3>
        <Input defaultValue={b.logoText} onBlur={(e) => saveBranding({ data: { logoText: e.target.value } })} />
        <Input defaultValue={b.senderName} onBlur={(e) => saveBranding({ data: { senderName: e.target.value } })} />
        <Input defaultValue={b.watermarkText} onBlur={(e) => saveBranding({ data: { watermarkText: e.target.value } })} />
        <Textarea defaultValue={b.reminderTemplate} onBlur={(e) => saveBranding({ data: { reminderTemplate: e.target.value } })} />
      </article>
    </div>
  );
}

function SettingsPage() {
  const { tab } = Route.useSearch();
  const navigate = useNavigate({ from: "/settings" });
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const fields = useQuery({ queryKey: ["fields"], queryFn: () => listFields() });
  const scores = useQuery({ queryKey: ["scores"], queryFn: () => listScores() });
  const admin = useQuery({ queryKey: ["admin"], queryFn: () => getAdmin() });
  const usage = useQuery({ queryKey: ["usage"], queryFn: () => getUsage() });
  const qc = useQueryClient();
  const [pipeId, setPipeId] = useState<number>(1);
  const pipe = boot.data?.pipelines.find((p) => p.id === pipeId) ?? boot.data?.pipelines[0];

  return (
    <div className="pb-12">
      <PageHeader title="Settings" subtitle="Appearance, sidebar, pipelines, import, sandbox, admin, security, marketplace, fields, capacity, connectors, and team inboxes." />
      <div className="px-4 sm:px-6">
        <Tabs
          value={tab ?? "appearance"}
          onValueChange={(v) => void navigate({ search: { tab: v === "appearance" ? undefined : v } })}
        >
          <TabsList className="flex h-auto flex-wrap">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="sidebar">Sidebar</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
            <TabsTrigger value="sandbox">Sandbox</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="pipelines">Pipelines</TabsTrigger>
            <TabsTrigger value="fields">Fields</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="visibility">Visibility</TabsTrigger>
            <TabsTrigger value="routing">Lead routing</TabsTrigger>
            <TabsTrigger value="mailboxes">Mailboxes</TabsTrigger>
            <TabsTrigger value="capacity">Capacity</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="scores">Scores</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="portal">White-label</TabsTrigger>
          </TabsList>
          <TabsContent value="appearance" className="mt-4">
            <AppearancePanel />
          </TabsContent>
          <TabsContent value="sidebar" className="mt-4">
            <SidebarPrefsPanel />
          </TabsContent>
          <TabsContent value="import" className="mt-4">
            <ImportPanel />
          </TabsContent>
          <TabsContent value="sandbox" className="mt-4">
            <SandboxPanel />
          </TabsContent>
          <TabsContent value="admin" className="mt-4">
            <AdminPanel />
          </TabsContent>
          <TabsContent value="security" className="mt-4">
            <SecurityPanel />
          </TabsContent>
          <TabsContent value="pipelines" className="mt-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              {(boot.data?.pipelines ?? []).map((p) => (
                <Button key={p.id} size="sm" variant={pipeId === p.id ? "secondary" : "ghost"} onClick={() => setPipeId(p.id)}>
                  {p.name}
                </Button>
              ))}
            </div>
            <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
              {pipe?.stages.map((s, i) => (
                <li key={s.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <span className="w-6 text-xs text-muted-foreground">{i + 1}</span>
                  <Input
                    defaultValue={s.name}
                    className="h-9 max-w-48"
                    onBlur={(e) => {
                      if (e.target.value !== s.name)
                        void updateStage({ data: { id: s.id, name: e.target.value } }).then(() => {
                          toast.success("Stage renamed");
                          qc.invalidateQueries({ queryKey: ["bootstrap"] });
                        });
                    }}
                  />
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    Rotting
                    <Input
                      type="number"
                      defaultValue={s.rottingDays}
                      className="h-9 w-16"
                      onBlur={(e) => updateStage({ data: { id: s.id, rottingDays: Number(e.target.value) } }).then(() => qc.invalidateQueries({ queryKey: ["bootstrap"] }))}
                    />
                    d
                  </label>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    Win
                    <Input
                      type="number"
                      defaultValue={s.probability}
                      className="h-9 w-16"
                      onBlur={(e) => updateStage({ data: { id: s.id, probability: Number(e.target.value) } }).then(() => qc.invalidateQueries({ queryKey: ["bootstrap"] }))}
                    />
                    %
                  </label>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="fields" className="mt-4">
            <p className="mb-3 text-sm text-muted-foreground">Required and pipeline-specific fields. Ultimate allows 500 custom fields.</p>
            <form
              className="mb-4 flex flex-wrap gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const fd = new FormData(form);
                void createField({
                  data: {
                    entity: String(fd.get("entity") || "deal"),
                    name: String(fd.get("name") || "New field"),
                    fieldType: String(fd.get("fieldType") || "text"),
                    required: fd.get("required") === "on",
                    pipelineId: pipeId,
                  },
                }).then((r) => {
                  if (r && "error" in r && r.error) toast.error(r.error);
                  else {
                    toast.success("Field added");
                    form.reset();
                  }
                  qc.invalidateQueries({ queryKey: ["fields"] });
                  qc.invalidateQueries({ queryKey: ["usage"] });
                });
              }}
            >
              <Input name="name" placeholder="Field name" className="w-40" />
              <Input name="entity" placeholder="deal / person / org" className="w-36" defaultValue="deal" />
              <Input name="fieldType" placeholder="type" className="w-28" defaultValue="text" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="required" /> Required
              </label>
              <Button type="submit" size="sm">
                Add field
              </Button>
            </form>
            <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
              {(fields.data ?? []).map((f) => (
                <li key={f.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                  <span className="flex-1">{f.name}</span>
                  <span className="text-muted-foreground">{f.entity}</span>
                  <Badge variant="outline">{f.fieldType}</Badge>
                  {f.required && <Badge variant="warn">required</Badge>}
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="team" className="mt-4">
            <p className="mb-3 text-sm text-muted-foreground">25 teams, 25 visibility groups, 25 permission sets on Ultimate.</p>
            <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
              {(boot.data?.members ?? []).map((m) => (
                <li key={m.id} className="flex items-center gap-3 px-4 py-3">
                  <MemberAvatar initials={m.initials} tone={m.tone} />
                  <div className="flex-1">
                    <div className="text-sm">{m.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {m.title} · {m.teamName} · {m.email}
                    </div>
                  </div>
                  <Badge variant="outline">{m.role}</Badge>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="visibility" className="mt-4 space-y-4">
            <p className="text-sm text-muted-foreground">25 visibility groups and 25 permission sets on Ultimate.</p>
            <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
              {(admin.data?.groups ?? []).map((g) => (
                <li key={g.id} className="px-4 py-3">
                  <div className="text-sm font-medium">{g.name}</div>
                  <p className="text-sm text-muted-foreground">{g.detail}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{g.memberIds.length} seats</p>
                </li>
              ))}
            </ul>
            <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
              {(admin.data?.permissions ?? []).map((p) => (
                <li key={p.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{p.name}</div>
                    <p className="text-sm text-muted-foreground">{p.detail}</p>
                  </div>
                  {p.canAdmin && <Badge variant="steel">admin</Badge>}
                  {p.canExport && <Badge variant="outline">export</Badge>}
                  {p.canDelete && <Badge variant="warn">delete</Badge>}
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="routing" className="mt-4">
            <p className="mb-3 text-sm text-muted-foreground">Source rules. Web forms already land on the mapped AE.</p>
            <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
              {(admin.data?.routes ?? []).map((r) => (
                <li key={r.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                  <span className="flex-1">{r.source}</span>
                  <span className="text-muted-foreground">{r.ownerName ?? "Unassigned"}</span>
                  <Badge variant={r.active ? "success" : "outline"}>{r.active ? "on" : "off"}</Badge>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="mailboxes" className="mt-4">
            <p className="mb-3 text-sm text-muted-foreground">
              5 synced accounts per user, plus {ULTIMATE_LIMITS.teamInboxes} shared team inboxes. Outbound still leaves from the{" "}
              <Link to="/domain" className="underline underline-offset-2">
                authenticated sending domain
              </Link>
              .
            </p>
            <form
              className="mb-4 flex flex-wrap gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const fd = new FormData(form);
                void createTeamInbox({ data: { address: String(fd.get("address") || "") } }).then((r) => {
                  if (!r.ok) toast.error(r.error ?? "Could not add inbox");
                  else {
                    toast.success("Shared inbox live");
                    form.reset();
                  }
                  qc.invalidateQueries({ queryKey: ["admin"] });
                  qc.invalidateQueries({ queryKey: ["usage"] });
                });
              }}
            >
              <Input name="address" placeholder="ops@northline.av" className="w-56" />
              <Button type="submit" size="sm">
                Add team inbox
              </Button>
            </form>
            <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
              {(admin.data?.accounts ?? []).map((a) => (
                <li key={a.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                  <div className="flex-1">
                    <div>{a.address}</div>
                    <div className="text-xs text-muted-foreground">
                      {a.kind} · {a.memberName ?? "shared"}
                    </div>
                  </div>
                  <Badge variant={a.synced ? "success" : "outline"}>{a.synced ? "synced" : "paused"}</Badge>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="capacity" className="mt-4">
            <p className="mb-3 text-sm text-muted-foreground">
              Ultimate ceilings: 500 reports, 500 fields, 500 automations, 10 team inboxes, 500 enrichment credits.
            </p>
            <ul className="space-y-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
              <Meter label="Custom reports" used={usage.data?.reports ?? 0} cap={ULTIMATE_LIMITS.reports} />
              <Meter label="Custom fields" used={usage.data?.fields ?? 0} cap={ULTIMATE_LIMITS.fields} />
              <Meter label="Automations" used={usage.data?.automations ?? 0} cap={ULTIMATE_LIMITS.automations} />
              <Meter label="Team inboxes" used={usage.data?.teamInboxes ?? 0} cap={ULTIMATE_LIMITS.teamInboxes} />
              <Meter label="Enrichment credits used" used={usage.data?.enrichmentUsed ?? 0} cap={ULTIMATE_LIMITS.enrichmentCredits} />
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              {usage.data ? `${usage.data.enrichmentRemaining} enrichment lookups remaining this cycle.` : "Loading usage…"}
            </p>
          </TabsContent>
          <TabsContent value="api" className="mt-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Token-based REST. Ultimate rate limit is 210,000 × seats. Full catalog, Try-it, and webhook payloads live on Developers.
            </p>
            <Button asChild size="sm" variant="secondary">
              <Link to="/developers">Open developer console</Link>
            </Button>
            <form
              className="flex flex-wrap gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                void createApiToken({
                  data: { name: String(fd.get("name") || "Token"), scopes: String(fd.get("scopes") || "events:read,clients:read") },
                }).then((r) => {
                  toast.success(`Token ${r.token} — copy it now`);
                  qc.invalidateQueries({ queryKey: ["admin"] });
                  qc.invalidateQueries({ queryKey: ["developer"] });
                });
              }}
            >
              <Input name="name" placeholder="Token name" className="w-40" />
              <Input name="scopes" placeholder="events:read,clients:read" className="w-56" />
              <Button type="submit" size="sm">
                Mint key
              </Button>
            </form>
            <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
              {(admin.data?.tokens ?? []).map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                  <span>
                    {t.name}
                    <span className="ml-2 text-xs text-muted-foreground">
                      {t.scopes} · {t.revoked ? "revoked" : t.tokenHint}
                    </span>
                  </span>
                  {!t.revoked && (
                    <Button size="sm" variant="ghost" onClick={() => revokeToken({ data: { id: t.id } }).then(() => qc.invalidateQueries({ queryKey: ["admin"] }))}>
                      Revoke
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="scores" className="mt-4">
            <p className="mb-3 text-sm text-muted-foreground">Custom scoring models — 10 on Ultimate.</p>
            {(scores.data ?? []).map((s) => (
              <article key={s.id} className="mb-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">{s.name}</h3>
                  <Switch checked={s.active} />
                </div>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {s.rules.map((r, i) => (
                    <li key={i}>
                      {r.field} {r.op} {r.value} → +{r.points}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </TabsContent>
          <TabsContent value="integrations" className="mt-4 max-w-lg">
            <IntegrationsPanel />
          </TabsContent>
          <TabsContent value="marketplace" className="mt-4">
            <MarketplacePanel />
          </TabsContent>
          <TabsContent value="portal" className="mt-4 max-w-lg">
            <PortalDomainPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function SidebarPrefsPanel() {
  const memberId = useUi((s) => s.memberId);
  const qc = useQueryClient();
  const catalog = catalogFor(false);
  const prefs = useQuery({
    queryKey: ["nav-prefs", memberId],
    queryFn: () => getNavPrefs({ data: { memberId } }),
  });
  const layout = mergeNavLayout(
    catalog.map((i) => i.href),
    prefs.data ?? { pins: [], order: [] },
  );
  const byHref = new Map(STAFF_NAV.map((i) => [i.href, i]));
  const rows = layout.order.map((h) => byHref.get(h)).filter((i): i is (typeof STAFF_NAV)[number] => Boolean(i));

  function persist(next: { pins: string[]; order: string[] }) {
    const applied = mergeNavLayout(catalog.map((i) => i.href), next);
    qc.setQueryData(["nav-prefs", memberId], applied);
    void saveNavPrefs({ data: { memberId, ...applied } }).then(() => toast.success("Sidebar saved for this seat"));
  }

  return (
    <div className="max-w-xl space-y-3">
      <p className="text-sm text-muted-foreground">
        Order and pins are stored on your seat, not the company. Star a module to pin it to the top of the rail. Use
        the arrows here or drag from Arrange sidebar.
      </p>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => persist({ pins: [], order: catalog.map((i) => i.href) })}
      >
        Reset to default
      </Button>
      <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
        {rows.map((item, i) => {
          const pinned = layout.pins.includes(item.href);
          return (
            <li key={item.href} className="flex items-center gap-2 px-3 py-2 text-sm">
              <button
                type="button"
                className={cn("size-7 rounded-sm", pinned ? "text-primary" : "text-muted-foreground")}
                onClick={() =>
                  persist({
                    pins: pinned ? layout.pins.filter((h) => h !== item.href) : [...layout.pins, item.href],
                    order: layout.order,
                  })
                }
                aria-label={pinned ? `Unpin ${item.label}` : `Pin ${item.label}`}
              >
                <Star className={cn("mx-auto size-3.5", pinned && "fill-current")} />
              </button>
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {pinned && <Badge variant="steel">pinned</Badge>}
              <Button
                size="icon-sm"
                variant="ghost"
                disabled={i === 0}
                onClick={() => persist({ pins: layout.pins, order: insertBefore(layout.order, item.href, rows[i - 1]?.href ?? null) })}
                aria-label={`Move ${item.label} up`}
              >
                <ChevronUp className="size-3.5" />
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                disabled={i === rows.length - 1}
                onClick={() => persist({ pins: layout.pins, order: insertBefore(layout.order, item.href, rows[i + 2]?.href ?? null) })}
                aria-label={`Move ${item.label} down`}
              >
                <ChevronDown className="size-3.5" />
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PortalDomainPanel() {
  const desk = useQuery({ queryKey: ["ai-desk"], queryFn: () => getAiDesk() });
  const p = desk.data?.profile;
  if (!p) return <p className="text-sm text-muted-foreground">Loading portal domain…</p>;
  return (
    <article className="space-y-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
      <h3 className="text-sm font-medium">White-label portal domain</h3>
      <p className="text-sm text-muted-foreground">
        Clients hit your domain. Logo and colors follow the company profile. They never see a third-party address.
      </p>
      <Button asChild size="sm" variant="secondary">
        <Link to="/portal-domain">Open portal domain desk</Link>
      </Button>
      <p className="text-xs text-muted-foreground">Live as https://{p.portalDomain} · brand #{p.brandColor}</p>
    </article>
  );
}

function Meter({ label, used, cap }: { label: string; used: number; cap: number }) {
  const pct = Math.min(100, Math.round((used / Math.max(cap, 1)) * 100));
  return (
    <li>
      <div className="flex justify-between text-xs">
        <span>{label}</span>
        <span className="font-mono tabular-nums text-muted-foreground">
          {used} / {cap}
        </span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </li>
  );
}
