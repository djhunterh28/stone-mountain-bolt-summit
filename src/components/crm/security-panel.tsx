import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { getSecurity, resolveAlert, toggleRule } from "@/lib/crm/server";
import {
  ACCESS_LOCATIONS,
  getAccessState,
  getUsage,
  lockSession,
  setSessionContext,
  testSignIn,
  updateAccessPolicy,
} from "@/lib/crm/governance";
import { ULTIMATE_LIMITS } from "@/lib/crm/limits";
import { useUi } from "@/lib/crm/store";
import { cn, formatDateTime } from "@/lib/utils";

export function SecurityPanel() {
  const data = useQuery({ queryKey: ["security"], queryFn: () => getSecurity() });
  const access = useQuery({ queryKey: ["access"], queryFn: () => getAccessState() });
  const usage = useQuery({ queryKey: ["usage"], queryFn: () => getUsage() });
  const qc = useQueryClient();
  const d = data.data;
  const a = access.data;
  const { memberId } = useUi();

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Login policy, IP and hours, suspicious activity, encryption — Ultimate governance.
      </p>
      {a && !a.allowed && (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Access currently denied: {a.reason}
        </p>
      )}
      <Tabs defaultValue="policy">
        <TabsList className="flex h-auto flex-wrap">
          <TabsTrigger value="policy">Login policy</TabsTrigger>
          <TabsTrigger value="access">IP & hours</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="fortify">Fortified</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="audit">Audit log</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="policy" className="mt-4 space-y-4">
          {a && (
            <>
              <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
                <PolicyRow
                  label="MFA required"
                  hint="Every seat. Recovery codes held by Dana."
                  checked={a.policy.mfaRequired}
                  onChange={(v) =>
                    updateAccessPolicy({ data: { mfaRequired: v } }).then(() =>
                      qc.invalidateQueries({ queryKey: ["access"] }),
                    )
                  }
                />
                <PolicyRow
                  label="Admin approval for new devices"
                  hint="Owners confirm first login from an unknown machine."
                  checked={a.policy.adminApproval}
                  onChange={(v) =>
                    updateAccessPolicy({ data: { adminApproval: v } }).then(() =>
                      qc.invalidateQueries({ queryKey: ["access"] }),
                    )
                  }
                />
                <PolicyRow
                  label="Notify on export"
                  hint="CSV and bulk mail raise a real-time alert."
                  checked={a.policy.exportApproval}
                  onChange={(v) =>
                    updateAccessPolicy({ data: { exportApproval: v } }).then(() =>
                      qc.invalidateQueries({ queryKey: ["access"] }),
                    )
                  }
                />
              </ul>
              <div className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
                <label className="text-xs text-muted-foreground">Idle lock (minutes)</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Input
                    type="number"
                    defaultValue={a.policy.idleMinutes}
                    className="h-9 w-24"
                    onBlur={(e) =>
                      updateAccessPolicy({ data: { idleMinutes: Number(e.target.value) || 15 } }).then(() =>
                        qc.invalidateQueries({ queryKey: ["access"] }),
                      )
                    }
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      lockSession().then(() => {
                        qc.invalidateQueries({ queryKey: ["access"] });
                        toast.message("Workspace locked");
                      })
                    }
                  >
                    Lock now
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      void testSignIn({ data: { memberName: "current seat" } }).then((r) => {
                        qc.invalidateQueries({ queryKey: ["access"] });
                        qc.invalidateQueries({ queryKey: ["security"] });
                        if (r.ok) toast.success("Sign-in allowed");
                        else toast.error(r.reason ?? "Denied");
                      });
                    }}
                  >
                    Test sign-in
                  </Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Failed attempts {a.session.failedAttempts} / {a.policy.maxFailed}. Seat id {memberId}.
                </p>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="access" className="mt-4 space-y-4">
          {a && (
            <>
              <p className="text-sm text-muted-foreground">
                Clock {a.hourLabel}. Simulate a location or off-hours to see the policy fire.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {ACCESS_LOCATIONS.map((loc) => {
                  const active = a.session.ip === loc.ip;
                  return (
                    <button
                      key={loc.ip}
                      type="button"
                      onClick={() =>
                        setSessionContext({
                          data: { locationLabel: loc.label, ip: loc.ip, clockMode: a.session.clockMode },
                        }).then((r) => {
                          qc.invalidateQueries({ queryKey: ["access"] });
                          qc.invalidateQueries({ queryKey: ["security"] });
                          if (!r.ok) toast.error(r.reason ?? "Denied");
                          else toast.success(`Session from ${loc.label}`);
                        })
                      }
                      className={cn(
                        "rounded-xl p-4 text-left shadow-[var(--shadow-border)]",
                        active ? "bg-card ring-1 ring-ring" : "bg-card hover:shadow-[var(--shadow-border-hover)]",
                      )}
                    >
                      <div className="text-sm font-medium">{loc.label}</div>
                      <div className="font-mono text-xs text-muted-foreground">{loc.ip}</div>
                    </button>
                  );
                })}
              </div>
              <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
                <PolicyRow
                  label="IP allow list"
                  hint="Shop + home ranges. Anything else is blocked and alerted."
                  checked={a.policy.ipEnforced}
                  onChange={(v) =>
                    updateAccessPolicy({ data: { ipEnforced: v } }).then(() =>
                      qc.invalidateQueries({ queryKey: ["access"] }),
                    )
                  }
                />
                <PolicyRow
                  label="Office hours only"
                  hint={`${a.policy.officeStart}–${a.policy.officeEnd} ${a.policy.timezone}`}
                  checked={a.policy.hoursEnforced}
                  onChange={(v) =>
                    updateAccessPolicy({ data: { hoursEnforced: v } }).then(() =>
                      qc.invalidateQueries({ queryKey: ["access"] }),
                    )
                  }
                />
                <PolicyRow
                  label="Pretend it is 02:30 ET"
                  hint="Forces the off-hours rule without waiting for midnight."
                  checked={a.session.clockMode === "offhours"}
                  onChange={(v) =>
                    setSessionContext({
                      data: {
                        locationLabel: a.session.locationLabel,
                        ip: a.session.ip,
                        clockMode: v ? "offhours" : "live",
                      },
                    }).then((r) => {
                      qc.invalidateQueries({ queryKey: ["access"] });
                      qc.invalidateQueries({ queryKey: ["security"] });
                      if (!r.ok) toast.error(r.reason ?? "Denied");
                    })
                  }
                />
              </ul>
              <div className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
                <label className="text-xs text-muted-foreground">Allow list (CIDR or IP, one per line)</label>
                <Textarea
                  className="mt-2"
                  rows={3}
                  defaultValue={a.policy.ipAllowlist.join("\n")}
                  onBlur={(e) =>
                    updateAccessPolicy({ data: { ipAllowlist: e.target.value } }).then(() =>
                      qc.invalidateQueries({ queryKey: ["access"] }),
                    )
                  }
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  <Input
                    defaultValue={a.policy.officeStart}
                    className="h-9 w-24"
                    onBlur={(e) =>
                      updateAccessPolicy({ data: { officeStart: e.target.value } }).then(() =>
                        qc.invalidateQueries({ queryKey: ["access"] }),
                      )
                    }
                  />
                  <span className="self-center text-xs text-muted-foreground">to</span>
                  <Input
                    defaultValue={a.policy.officeEnd}
                    className="h-9 w-24"
                    onBlur={(e) =>
                      updateAccessPolicy({ data: { officeEnd: e.target.value } }).then(() =>
                        qc.invalidateQueries({ queryKey: ["access"] }),
                      )
                    }
                  />
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="alerts" className="mt-4">
          <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
            {(d?.alerts ?? []).map((al) => (
              <li key={al.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <Badge variant={al.severity === "high" ? "danger" : al.severity === "medium" ? "warn" : "outline"}>
                  {al.severity}
                </Badge>
                <div className="min-w-0 flex-1">
                  <div className="text-sm">{al.title}</div>
                  <p className="text-xs text-muted-foreground">{al.detail}</p>
                </div>
                {al.resolved ? (
                  <Badge variant="success">resolved</Badge>
                ) : (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      resolveAlert({ data: { id: al.id } }).then(() => qc.invalidateQueries({ queryKey: ["security"] }))
                    }
                  >
                    Resolve
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="fortify" className="mt-4 space-y-4">
          {a && usage.data && (
            <>
              <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
                <li className="flex items-start gap-3 px-4 py-3">
                  <Switch
                    checked={a.policy.encryptionAtRest}
                    onCheckedChange={(v) =>
                      updateAccessPolicy({ data: { encryptionAtRest: v } }).then(() =>
                        qc.invalidateQueries({ queryKey: ["access"] }),
                      )
                    }
                    className="mt-1"
                  />
                  <div>
                    <div className="text-sm font-medium">Encryption at rest</div>
                    <p className="text-sm text-muted-foreground">
                      Postgres volume encrypted. Field-level wrap on payment cards and signed documents.
                    </p>
                  </div>
                </li>
                <li className="px-4 py-3 text-sm">
                  <div className="font-medium">Transport</div>
                  <p className="text-muted-foreground">TLS 1.3. Session tokens rotate every 12 hours.</p>
                </li>
                <li className="px-4 py-3 text-sm">
                  <div className="font-medium">SSO</div>
                  <p className="text-muted-foreground">SAML / OIDC ready. Northline currently uses seat MFA.</p>
                </li>
              </ul>
              <div className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
                <h3 className="text-sm font-medium">Ultimate capacity</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  <Meter label="Custom reports" used={usage.data.reports} cap={ULTIMATE_LIMITS.reports} />
                  <Meter label="Custom fields" used={usage.data.fields} cap={ULTIMATE_LIMITS.fields} />
                  <Meter label="Automations" used={usage.data.automations} cap={ULTIMATE_LIMITS.automations} />
                  <Meter label="Team inboxes" used={usage.data.teamInboxes} cap={ULTIMATE_LIMITS.teamInboxes} />
                  <Meter
                    label="Enrichment credits"
                    used={usage.data.enrichmentUsed}
                    cap={ULTIMATE_LIMITS.enrichmentCredits}
                  />
                </ul>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="rules" className="mt-4">
          <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
            {(d?.rules ?? []).map((r) => (
              <li key={r.id} className="flex items-start gap-3 px-4 py-3">
                <Switch
                  checked={r.active}
                  onCheckedChange={(v) =>
                    toggleRule({ data: { id: r.id, active: v } }).then(() =>
                      qc.invalidateQueries({ queryKey: ["security"] }),
                    )
                  }
                  className="mt-1"
                />
                <div>
                  <div className="text-sm font-medium">{r.name}</div>
                  <p className="text-sm text-muted-foreground">{r.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="devices" className="mt-4">
          <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
            {(d?.devices ?? []).map((dev) => (
              <li key={dev.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                <div className="flex-1">
                  <div>
                    {dev.memberName} · {dev.device}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {dev.location} · {formatDateTime(dev.lastActive)}
                  </div>
                </div>
                {dev.current && <Badge variant="steel">current</Badge>}
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="audit" className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">When</th>
                <th className="px-3 py-2 font-medium">Actor</th>
                <th className="px-3 py-2 font-medium">Action</th>
                <th className="px-3 py-2 font-medium">Detail</th>
              </tr>
            </thead>
            <tbody>
              {(d?.auditLog ?? []).map((row) => (
                <tr key={row.id} className="border-t border-border">
                  <td className="px-3 py-2 text-xs text-muted-foreground">{formatDateTime(row.createdAt)}</td>
                  <td className="px-3 py-2">{row.actor}</td>
                  <td className="px-3 py-2">
                    {row.action} {row.entity}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {row.detail} · {row.ip} · {row.device}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabsContent>
        <TabsContent value="webhooks" className="mt-4">
          <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
            {(d?.webhooks ?? []).map((w) => (
              <li key={w.id} className="px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <code className="text-xs">{w.url}</code>
                  <Badge variant={w.active ? "success" : "outline"}>{w.event}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{w.lastStatus}</p>
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PolicyRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <li className="flex items-start gap-3 px-4 py-3">
      <Switch checked={checked} onCheckedChange={onChange} className="mt-1" />
      <div>
        <div className="text-sm font-medium">{label}</div>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </div>
    </li>
  );
}

function Meter({ label, used, cap }: { label: string; used: number; cap: number }) {
  const pct = Math.min(100, Math.round((used / cap) * 100));
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
