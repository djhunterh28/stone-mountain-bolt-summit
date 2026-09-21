import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createApiToken, revokeToken } from "@/lib/crm/ultimate";
import { createWebhook, getDeveloperDesk, revokeWebhook, testWebhook } from "@/lib/crm/developer";
import { API_SCOPES, AUTH_EXAMPLE, CURL_EXAMPLE, REST_ENDPOINTS, WEBHOOK_EVENTS } from "@/lib/crm/api-spec";
import { formatDateTime } from "@/lib/utils";

export function DevelopersPanel() {
  const desk = useQuery({ queryKey: ["developer"], queryFn: () => getDeveloperDesk() });
  const qc = useQueryClient();
  const [fresh, setFresh] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [path, setPath] = useState("/api/v1/events");
  const [method, setMethod] = useState("GET");
  const [body, setBody] = useState('{\n  "title": "Pier 17 rooftop",\n  "value": 48000,\n  "venue": "Pier 17",\n  "event_date": "2026-10-22"\n}');
  const [result, setResult] = useState<string>("");
  const [picked, setPicked] = useState<string[]>(["events:read", "events:write", "clients:read", "webhooks"]);

  function refresh() {
    qc.invalidateQueries({ queryKey: ["developer"] });
    qc.invalidateQueries({ queryKey: ["admin"] });
  }

  async function tryIt() {
    setResult("…");
    const res = await fetch(path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: method === "GET" || method === "DELETE" ? undefined : body,
    });
    const text = await res.text();
    setResult(`${res.status} ${res.statusText}\n${text}`);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Scoped API keys, a live REST surface, and webhook payloads for Zapier and custom scripts.
      </p>
      <Tabs defaultValue="keys">
          <TabsList className="flex h-auto flex-wrap">
            <TabsTrigger value="keys">API keys</TabsTrigger>
            <TabsTrigger value="rest">REST</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="try">Try it</TabsTrigger>
          </TabsList>

          <TabsContent value="keys" className="mt-4 space-y-4">
            <form
              className="space-y-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                void createApiToken({
                  data: {
                    name: String(fd.get("name") || "Token"),
                    scopes: picked.join(",") || "events:read",
                  },
                }).then((r) => {
                  setFresh(r.token);
                  setToken(r.token);
                  toast.success("Copy the key now — it will not be shown again");
                  refresh();
                });
              }}
            >
              <div className="flex flex-wrap gap-2">
                <Input name="name" placeholder="Zapier production" className="w-56" />
                <Button type="submit" size="sm">
                  Mint key
                </Button>
              </div>
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {API_SCOPES.map((s) => (
                  <li key={s.id}>
                    <label className="flex min-h-9 items-start gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={picked.includes(s.id)}
                        onChange={() =>
                          setPicked((cur) => (cur.includes(s.id) ? cur.filter((id) => id !== s.id) : [...cur, s.id]))
                        }
                      />
                      <span>
                        <span className="font-medium">{s.label}</span>
                        <span className="block text-xs text-muted-foreground">{s.hint}</span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </form>
            {fresh && (
              <p className="rounded-xl bg-card px-4 py-3 font-mono text-sm shadow-[var(--shadow-border)]">
                {fresh}
                <span className="ml-2 text-xs text-muted-foreground">shown once</span>
              </p>
            )}
            <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
              {(desk.data?.tokens ?? []).map((t) => (
                <li key={t.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">{t.name}</span>
                      {t.revoked ? <Badge variant="warn">revoked</Badge> : <Badge variant="success">live</Badge>}
                      {!t.hashed && !t.revoked && <Badge variant="outline">legacy hint only</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t.tokenHint} · {t.scopes} · last used {t.lastUsed ? formatDateTime(t.lastUsed) : "never"}
                    </p>
                  </div>
                  {!t.revoked && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => revokeToken({ data: { id: t.id } }).then(() => { toast.success("Revoked"); refresh(); })}
                    >
                      Revoke
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="rest" className="mt-4 space-y-4">
            <article className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
              <h2 className="text-sm font-medium">Authentication</h2>
              <pre className="mt-2 overflow-x-auto font-mono text-xs text-muted-foreground">{AUTH_EXAMPLE}</pre>
              <pre className="mt-3 overflow-x-auto font-mono text-xs text-muted-foreground">{CURL_EXAMPLE}</pre>
              <p className="mt-3 text-xs text-muted-foreground">
                OpenAPI lives at <code>/api/v1/openapi.json</code>. Public catalog at <code>/api/v1</code>. Rate limit 210,000 requests per seat.
              </p>
            </article>
            <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
              {REST_ENDPOINTS.map((e) => (
                <li key={`${e.method}${e.path}`} className="flex flex-wrap items-start gap-3 px-4 py-3">
                  <Badge variant={e.method === "GET" ? "steel" : e.method === "DELETE" ? "warn" : "success"}>{e.method}</Badge>
                  <div className="min-w-0 flex-1">
                    <code className="text-sm">{e.path}</code>
                    <p className="text-xs text-muted-foreground">{e.summary}</p>
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground">{e.scope ?? "public"}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setPath(e.path.includes(":") ? e.path.replace(":id", "1") : e.path);
                      setMethod(e.method);
                    }}
                  >
                    Try
                  </Button>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="webhooks" className="mt-4 space-y-4">
            <form
              className="grid gap-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:grid-cols-4"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                void createWebhook({
                  data: {
                    url: String(fd.get("url") || ""),
                    event: String(fd.get("event") || "deal.created"),
                    description: String(fd.get("description") || "") || undefined,
                  },
                }).then((r) => {
                  toast.success(`Secret ${r.secret} — copy it now`);
                  refresh();
                });
              }}
            >
              <Input name="url" placeholder="https://hooks.zapier.com/…" className="sm:col-span-2" required />
              <select name="event" className="h-9 rounded-md border border-input bg-background px-2 text-sm">
                {WEBHOOK_EVENTS.map((e) => (
                  <option key={e.event} value={e.event}>
                    {e.event}
                  </option>
                ))}
              </select>
              <Button type="submit" size="sm">
                Subscribe
              </Button>
            </form>
            <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
              {(desk.data?.webhooks ?? []).map((w) => (
                <li key={w.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <code className="text-xs">{w.url}</code>
                      <Badge variant="outline">{w.event}</Badge>
                      <Badge variant={w.active ? "success" : "warn"}>{w.active ? "live" : "off"}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {w.secretHint} · {w.lastStatus ?? "never fired"}
                    </p>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => testWebhook({ data: { id: w.id } }).then(() => { toast.success("Sample delivered"); refresh(); })}>
                    Send sample
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => revokeWebhook({ data: { id: w.id, active: !w.active } }).then(refresh)}>
                    {w.active ? "Pause" : "Resume"}
                  </Button>
                </li>
              ))}
            </ul>
            <section>
              <h2 className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">Payloads</h2>
              <div className="grid gap-3 lg:grid-cols-2">
                {WEBHOOK_EVENTS.map((e) => (
                  <article key={e.event} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-sm">{e.event}</code>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{e.summary}</p>
                    <pre className="mt-3 overflow-x-auto font-mono text-[11px] leading-relaxed text-muted-foreground">
                      {JSON.stringify(e.payload, null, 2)}
                    </pre>
                  </article>
                ))}
              </div>
            </section>
            <section>
              <h2 className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">Recent deliveries</h2>
              <ul className="divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]">
                {(desk.data?.deliveries ?? []).map((d) => (
                  <li key={d.id} className="px-4 py-2.5 text-sm">
                    <span className="font-mono text-xs">{d.event}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {d.statusCode} · {formatDateTime(d.createdAt)} · {d.url}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </TabsContent>

          <TabsContent value="try" className="mt-4 space-y-3">
            <p className="text-sm text-muted-foreground">Paste a live key from API keys. GET /api/v1 is public.</p>
            <div className="grid gap-2 sm:grid-cols-[6rem_1fr]">
              <select className="h-9 rounded-md border border-input bg-background px-2 text-sm" value={method} onChange={(e) => setMethod(e.target.value)}>
                <option>GET</option>
                <option>POST</option>
                <option>PATCH</option>
                <option>DELETE</option>
              </select>
              <Input value={path} onChange={(e) => setPath(e.target.value)} />
            </div>
            <Input value={token} onChange={(e) => setToken(e.target.value)} placeholder="nl_live_…" />
            {method !== "GET" && method !== "DELETE" && (
              <textarea
                className="min-h-28 w-full rounded-md border border-input bg-background p-3 font-mono text-xs"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            )}
            <Button size="sm" onClick={() => void tryIt()}>
              Send
            </Button>
            {result && (
              <pre className="max-h-80 overflow-auto rounded-xl bg-card p-4 font-mono text-xs shadow-[var(--shadow-border)]">{result}</pre>
            )}
          </TabsContent>
        </Tabs>
    </div>
  );
}
