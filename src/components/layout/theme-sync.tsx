import { useEffect } from "react";
import { useUi } from "@/lib/crm/store";
import { applyResolvedTheme, resolveTheme } from "@/lib/crm/theme";

export function ThemeSync() {
  const theme = useUi((s) => s.theme);

  useEffect(() => {
    const apply = () => applyResolvedTheme(resolveTheme(theme));
    apply();
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);

  return null;
}
