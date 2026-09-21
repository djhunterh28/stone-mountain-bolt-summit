import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { useUi } from "@/lib/crm/store";
import { resolveTheme } from "@/lib/crm/theme";

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 15_000, refetchOnWindowFocus: false },
        },
      }),
  );
  const theme = useUi((s) => s.theme);
  const [resolved, setResolved] = useState<"light" | "dark">(() => resolveTheme(theme));

  useEffect(() => {
    const apply = () => setResolved(resolveTheme(theme));
    apply();
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);

  return (
    <QueryClientProvider client={client}>
      <TooltipProvider delayDuration={250}>
        {children}
        <Toaster
          theme={resolved}
          position="bottom-right"
          toastOptions={{
            className: "bg-card text-foreground shadow-[var(--shadow-border)]",
          }}
        />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
