import { useEffect, useState } from "react";
import { Shield } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAccessState, lockSession, unlockSession } from "@/lib/crm/governance";
import { toast } from "sonner";

export function SessionLock() {
  const qc = useQueryClient();
  const access = useQuery({ queryKey: ["access"], queryFn: () => getAccessState() });
  const [code, setCode] = useState("");
  const locked = Boolean(access.data?.session.locked);
  const idleMin = access.data?.policy.idleMinutes ?? 15;

  useEffect(() => {
    if (!access.data || locked) return;
    let t: ReturnType<typeof setTimeout>;
    const bump = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        void lockSession().then(() => qc.invalidateQueries({ queryKey: ["access"] }));
      }, idleMin * 60_000);
    };
    bump();
    window.addEventListener("pointerdown", bump);
    window.addEventListener("keydown", bump);
    return () => {
      clearTimeout(t);
      window.removeEventListener("pointerdown", bump);
      window.removeEventListener("keydown", bump);
    };
  }, [access.data, idleMin, locked, qc]);

  if (!locked) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-overlay/80 px-4">
      <div className="w-full max-w-sm rounded-xl bg-card p-6 shadow-[var(--shadow-border),var(--shadow-lift)]">
        <Shield className="size-5 text-primary" />
        <h2 className="mt-3 text-base font-semibold">Workspace locked</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Idle lock and MFA are on. Enter recovery code 482193 — Dana holds the rest.
        </p>
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            void unlockSession({ data: { code } }).then((r) => {
              if (r.ok) {
                toast.success("Session restored");
                setCode("");
                qc.invalidateQueries({ queryKey: ["access"] });
              } else toast.error(r.error ?? "Denied");
            });
          }}
        >
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Recovery code"
            autoFocus
            inputMode="numeric"
          />
          <Button type="submit" className="w-full">
            Confirm MFA
          </Button>
        </form>
      </div>
    </div>
  );
}
