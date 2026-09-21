import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUi } from "@/lib/crm/store";
import { resolveTheme, type ThemePreference } from "@/lib/crm/theme";
import { cn } from "@/lib/utils";

const ITEMS: { id: ThemePreference; label: string; icon: typeof Sun }[] = [
  { id: "light", label: "White", icon: Sun },
  { id: "dark", label: "Nightline", icon: Moon },
  { id: "system", label: "System", icon: Monitor },
];

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const theme = useUi((s) => s.theme);
  const setTheme = useUi((s) => s.setTheme);
  const resolved = resolveTheme(theme);
  const TriggerIcon = resolved === "light" ? Sun : Moon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={compact ? "ghost" : "secondary"}
          size={compact ? "icon-sm" : "sm"}
          aria-label={`Appearance: ${theme}`}
        >
          <TriggerIcon className="size-4" />
          {!compact && <span className="hidden sm:inline">Appearance</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active = theme === item.id;
          return (
            <DropdownMenuItem
              key={item.id}
              onSelect={() => setTheme(item.id)}
              className={cn(active && "bg-accent")}
            >
              <Icon className="size-4" />
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
