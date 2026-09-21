import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFloorPlans, saveFloorPlan } from "@/lib/crm/ops";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/floorplans")({ component: FloorPage });

const KINDS = [
  { id: "power", label: "Power" },
  { id: "loadin", label: "Load-in" },
  { id: "egress", label: "Egress" },
  { id: "stage", label: "Stage" },
  { id: "seat", label: "Seating" },
  { id: "hold", label: "Restricted" },
] as const;

function FloorPage() {
  const plans = useQuery({ queryKey: ["floors"], queryFn: () => getFloorPlans() });
  const qc = useQueryClient();
  const plan = plans.data?.[0];
  const [kind, setKind] = useState<(typeof KINDS)[number]["id"]>("power");
  const marks = plan?.marks ?? [];

  function addAt(e: React.MouseEvent<SVGSVGElement>) {
    if (!plan) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - r.left) / r.width) * 100);
    const y = Math.round(((e.clientY - r.top) / r.height) * 100);
    const next = [...marks, { id: `m${Date.now()}`, kind, x, y, label: KINDS.find((k) => k.id === kind)?.label ?? kind }];
    void saveFloorPlan({ data: { id: plan.id, marks: next } }).then(() => {
      toast.success("Mark saved");
      qc.invalidateQueries({ queryKey: ["floors"] });
    });
  }

  return (
    <div className="pb-12">
      <PageHeader title="Floor plans" subtitle="Store a venue once. Mark power, dock, egress, stage, seating, restricted." />
      <div className="flex flex-wrap gap-2 px-4 sm:px-6">
        {KINDS.map((k) => (
          <Button key={k.id} size="sm" variant={kind === k.id ? "secondary" : "ghost"} onClick={() => setKind(k.id)}>
            {k.label}
          </Button>
        ))}
      </div>
      <div className="mx-4 mt-4 sm:mx-6">
        <p className="mb-2 text-sm text-muted-foreground">{plan?.name} · click to drop a {kind} mark</p>
        <svg viewBox="0 0 100 60" className="w-full max-w-3xl cursor-crosshair rounded-xl bg-card shadow-[var(--shadow-border)]" onClick={addAt}>
          <rect x="2" y="2" width="96" height="56" fill="none" stroke="currentColor" opacity="0.2" />
          <rect x="38" y="4" width="24" height="10" fill="currentColor" opacity="0.12" />
          <text x="50" y="11" textAnchor="middle" fontSize="3" fill="currentColor" opacity="0.5">
            STAGE
          </text>
          {marks.map((m) => (
            <g key={m.id}>
              <circle cx={m.x} cy={m.y * 0.6} r="2.2" className={cn(m.kind === "hold" ? "fill-destructive" : "fill-primary")} />
              <text x={m.x} y={m.y * 0.6 + 5} textAnchor="middle" fontSize="2.4" fill="currentColor">
                {m.label}
              </text>
            </g>
          ))}
        </svg>
        <ul className="mt-3 flex flex-wrap gap-2">
          {marks.map((m) => (
            <Badge key={m.id} variant="outline">{m.kind} · {m.label}</Badge>
          ))}
        </ul>
      </div>
    </div>
  );
}
