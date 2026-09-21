import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getBootstrap, exportDealsCsv } from "@/lib/crm/server";
import { importDeals } from "@/lib/crm/ultimate";
import { useUi } from "@/lib/crm/store";

function parseCsv(text: string) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const header = split(lines[0]!).map((h) => h.trim().toLowerCase());
  const idx = (name: string) => header.findIndex((h) => h === name || h.includes(name));
  const t = idx("title") >= 0 ? idx("title") : 0;
  const v = idx("value") >= 0 ? idx("value") : 1;
  const venue = idx("venue");
  const org = idx("org");
  const source = idx("source");
  return lines.slice(1).map((line) => {
    const cols = split(line);
    return {
      title: cols[t] || "Imported show",
      value: Number(String(cols[v] ?? "0").replace(/[^0-9.]/g, "")) || 0,
      venue: venue >= 0 ? cols[venue] : undefined,
      orgName: org >= 0 ? cols[org] : undefined,
      source: source >= 0 ? cols[source] : "Import",
    };
  });
}

function split(line: string) {
  const out: string[] = [];
  let cur = "";
  let q = false;
  for (const ch of line) {
    if (ch === '"') q = !q;
    else if (ch === "," && !q) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

export function ImportPanel() {
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const { memberId } = useUi();
  const qc = useQueryClient();
  const [text, setText] = useState(
    "title,value,venue,org,source\nBrooklyn Navy Yard open studios,48000,Building 92,Brooklyn Navy Yard,Prospector",
  );
  const [busy, setBusy] = useState(false);
  const pipe = boot.data?.pipelines[0];

  return (
    <div className="max-w-2xl space-y-3">
      <p className="text-sm text-muted-foreground">
        CSV in and out. Header row required — title, value, venue, org, source. Up to 50 rows per run. New
        organizations are created when the name is new.
      </p>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} className="font-mono text-sm" />
      <div className="flex flex-wrap gap-2">
        <Button
          disabled={busy}
          onClick={() => {
            const rows = parseCsv(text);
            if (!rows.length) {
              toast.error("Need a header and at least one row");
              return;
            }
            setBusy(true);
            void importDeals({
              data: {
                rows,
                ownerId: memberId,
                pipelineId: pipe?.id ?? 1,
                stageId: pipe?.stages[0]?.id ?? 1,
              },
            }).then((r) => {
              setBusy(false);
              toast.success(`Imported ${r.created} deals`);
              qc.invalidateQueries({ queryKey: ["deals"] });
              qc.invalidateQueries({ queryKey: ["orgs"] });
            });
          }}
        >
          {busy ? "Importing…" : "Import into Live Events"}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={async () => {
            const res = await exportDealsCsv({ data: { pipelineId: pipe?.id ?? 1 } });
            if (res.error) {
              toast.error(res.error);
              return;
            }
            const blob = new Blob([res.csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "hurricane-deals.csv";
            a.click();
            URL.revokeObjectURL(url);
            toast.success("Exported current book");
          }}
        >
          Export current book
        </Button>
      </div>
    </div>
  );
}
