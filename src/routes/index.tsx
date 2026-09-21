import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Filter, LayoutList } from "lucide-react";
import { getBootstrap, listDeals, moveDeal, exportDealsCsv } from "@/lib/crm/server";
import { formatUsd, formatUsdFull } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Kanban } from "@/components/pipeline/kanban";
import { MemberAvatar } from "@/components/crm/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Search = { pipeline?: string; deal?: string };

export const Route = createFileRoute("/")({
  component: PipelinePage,
  validateSearch: (s: Record<string, unknown>): Search => ({
    pipeline: typeof s.pipeline === "string" ? s.pipeline : undefined,
    deal: typeof s.deal === "string" ? s.deal : undefined,
  }),
});

function PipelinePage() {
  const { pipeline: pipelineParam, deal: dealParam } = Route.useSearch();
  const navigate = useNavigate({ from: "/" });
  const qc = useQueryClient();
  const [status, setStatus] = useState("open");
  const [owner, setOwner] = useState<string>("all");
  const [q, setQ] = useState("");
  const [view, setView] = useState<"board" | "list">("board");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (dealParam) {
      void navigate({ to: "/deals/$dealId", params: { dealId: dealParam }, replace: true });
    }
  }, [dealParam, navigate]);

  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const pipelineId = Number(pipelineParam ?? boot.data?.pipelines[0]?.id ?? 1);
  const pipeline = boot.data?.pipelines.find((p) => p.id === pipelineId) ?? boot.data?.pipelines[0];

  const deals = useQuery({
    queryKey: ["deals", pipelineId, status, owner, q],
    queryFn: () =>
      listDeals({
        data: {
          pipelineId,
          status,
          ownerId: owner === "all" ? undefined : Number(owner),
          q: q || undefined,
        },
      }),
    enabled: !!pipeline,
  });

  const moveMut = useMutation({
    mutationFn: ({ id, stageId }: { id: number; stageId: number }) => moveDeal({ data: { id, stageId } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["deals"] }),
  });

  const list = deals.data ?? [];
  const stats = useMemo(() => {
    const open = list.filter((d) => d.status === "open");
    const value = open.reduce((s, d) => s + d.value, 0);
    const weighted = open.reduce((s, d) => s + d.value * ((d.probability ?? 0) / 100), 0);
    const rotting = open.filter((d) => d.rotting).length;
    return { value, weighted, rotting, count: open.length };
  }, [list]);

  async function onExport() {
    const res = await exportDealsCsv({ data: { pipelineId } });
    if (res.error) {
      toast.error(res.error);
      return;
    }
    const blob = new Blob([res.csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "northline-deals.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported deals CSV");
  }

  function openDeal(id: number) {
    void navigate({ to: "/deals/$dealId", params: { dealId: String(id) } });
  }

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3 sm:px-6">
        <Select
          value={String(pipelineId)}
          onValueChange={(v) => navigate({ search: (s) => ({ ...s, pipeline: v }) })}
        >
          <SelectTrigger className="h-9 w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(boot.data?.pipelines ?? []).map((p) => (
              <SelectItem key={p.id} value={String(p.id)}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Tabs value={status} onValueChange={setStatus}>
          <TabsList>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="won">Won</TabsTrigger>
            <TabsTrigger value="lost">Lost</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select value={owner} onValueChange={setOwner}>
          <SelectTrigger className="h-9 w-40">
            <Filter className="size-3.5" />
            <SelectValue placeholder="Owner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All owners</SelectItem>
            {(boot.data?.members ?? []).map((m) => (
              <SelectItem key={m.id} value={String(m.id)}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter shows…"
          className="h-9 max-w-xs"
        />
        <div className="ml-auto flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>
            Open <span className="font-mono text-foreground tabular-nums">{formatUsd(stats.value)}</span>
          </span>
          <span className="hidden sm:inline">
            Weighted <span className="font-mono text-foreground tabular-nums">{formatUsd(stats.weighted)}</span>
          </span>
          {stats.rotting > 0 && <Badge variant="warn">{stats.rotting} rotting</Badge>}
          <Button size="sm" variant="ghost" onClick={() => setView(view === "board" ? "list" : "board")}>
            <LayoutList className="size-3.5" />
            {view === "board" ? "List" : "Board"}
          </Button>
          <Button size="sm" variant="secondary" onClick={onExport}>
            <Download className="size-3.5" />
            Export
          </Button>
        </div>
      </div>

      {boot.isError && (
        <div className="px-6 py-8 text-sm text-muted-foreground">Could not load the book. Refresh and try again.</div>
      )}
      {view === "board" ? (
        mounted && pipeline ? (
          <div className="min-h-0 flex-1 pt-4">
            <Kanban
              stages={pipeline.stages}
              deals={list.filter((d) => status === "all" || d.status === status)}
              onMove={(id, stageId) => moveMut.mutate({ id, stageId })}
              onOpen={openDeal}
            />
          </div>
        ) : (
          <div className="px-6 py-8 text-sm text-muted-foreground">
            {boot.isError ? "Could not load the book." : "Loading the book…"}
          </div>
        )
      ) : (
        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-background text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium sm:px-6">Deal</th>
                <th className="px-2 py-2 font-medium">Org</th>
                <th className="px-2 py-2 font-medium">Stage</th>
                <th className="px-2 py-2 text-right font-medium">Value</th>
                <th className="px-2 py-2 font-medium">Owner</th>
                <th className="px-4 py-2 font-medium sm:px-6">Event</th>
              </tr>
            </thead>
            <tbody>
              {list.map((d) => (
                <tr
                  key={d.id}
                  className="cursor-pointer border-t border-border hover:bg-accent/50"
                  onClick={() => openDeal(d.id)}
                >
                  <td className="px-4 py-2.5 sm:px-6">
                    {d.title}
                    {d.rotting && (
                      <Badge variant="warn" className="ml-2">
                        rotting
                      </Badge>
                    )}
                  </td>
                  <td className="px-2 py-2.5 text-muted-foreground">{d.orgName ?? "—"}</td>
                  <td className="px-2 py-2.5">{pipeline?.stages.find((s) => s.id === d.stageId)?.name}</td>
                  <td className="px-2 py-2.5 text-right font-mono tabular-nums">{formatUsdFull(d.value)}</td>
                  <td className="px-2 py-2.5">
                    {d.ownerInitials && <MemberAvatar initials={d.ownerInitials} tone={d.ownerTone} size="sm" />}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground sm:px-6">{d.venue ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
