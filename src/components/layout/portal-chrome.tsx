import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useUi } from "@/lib/crm/store";

export function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(!localStorage.getItem("nl-cookie"));
  }, []);
  if (!show) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card px-4 py-3 shadow-[var(--shadow-lift)] sm:px-6">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          We use necessary cookies for sign-in and optional analytics for the portal. See the privacy notice.
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              localStorage.setItem("nl-cookie", "essential");
              setShow(false);
            }}
          >
            Essential only
          </Button>
          <Button
            size="sm"
            onClick={() => {
              localStorage.setItem("nl-cookie", "all");
              setShow(false);
            }}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DirtyGuard() {
  const dirty = useUi((s) => s.dirty);
  useEffect(() => {
    const onBefore = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBefore);
    return () => window.removeEventListener("beforeunload", onBefore);
  }, [dirty]);
  return null;
}

export function SessionWatch() {
  useEffect(() => {
    const started = Date.now();
    const warnAt = 25 * 60 * 1000;
    const t = window.setTimeout(() => {
      toast("Session expires in 5 minutes", { description: "Save your work. The idle lock will ask for a code." });
    }, warnAt);
    void started;
    return () => window.clearTimeout(t);
  }, []);
  return null;
}
