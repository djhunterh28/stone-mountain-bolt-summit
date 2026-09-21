import { useRef, useState, type DragEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  BarChart3,
  Bot,
  Calendar,
  CalendarRange,
  CheckSquare,
  ClipboardCheck,
  Compass,
  FileText,
  FolderOpen,
  FormInput,
  Globe,
  GripVertical,
  Handshake,
  HeartPulse,
  Home,
  Inbox,
  Kanban,
  KeyRound,
  LayoutGrid,
  Mail,
  MailCheck,
  Map as MapIcon,
  Megaphone,
  MessageSquare,
  Monitor,
  PenLine,
  Plug,
  Radar,
  Receipt,
  ScanLine,
  Send,
  Settings,
  Smartphone,
  Sparkles,
  Star,
  Target,
  Truck,
  UserCheck,
  UserCircle,
  UserPlus,
  Users,
  Wallet,
  Waypoints,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { getNavPrefs, insertBefore, mergeNavLayout, saveNavPrefs, type NavLayout } from "@/lib/crm/prefs";
import { useUi } from "@/lib/crm/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type NavItem = { href: string; label: string; icon: LucideIcon };

export const STAFF_PRIMARY: NavItem[] = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/", label: "Pipeline", icon: Kanban },
  { href: "/leads", label: "Leads", icon: Inbox },
  { href: "/lifecycle", label: "Lifecycle", icon: Waypoints },
  { href: "/pulse", label: "Pulse", icon: Radar },
  { href: "/registry", label: "Registry", icon: Users },
  { href: "/activities", label: "Calendar", icon: Calendar },
  { href: "/projects", label: "Projects", icon: LayoutGrid },
  { href: "/insights", label: "Insights", icon: BarChart3 },
  { href: "/goals", label: "Goals", icon: Target },
];

export const STAFF_MORE: NavItem[] = [
  { href: "/ai", label: "AI desk", icon: Sparkles },
  { href: "/health", label: "Health", icon: HeartPulse },
  { href: "/finance", label: "Finance", icon: Wallet },
  { href: "/quotes", label: "Quotes", icon: Receipt },
  { href: "/mail", label: "Mail", icon: Mail },
  { href: "/domain", label: "Sending domain", icon: MailCheck },
  { href: "/portal-domain", label: "Portal domain", icon: Globe },
  { href: "/client-portal", label: "Client portal", icon: KeyRound },
  { href: "/smtp", label: "SMTP", icon: Send },
  { href: "/inbox", label: "Unified inbox", icon: MessageSquare },
  { href: "/sms", label: "SMS / QUO", icon: Smartphone },
  { href: "/broadcasts", label: "Broadcasts", icon: Megaphone },
  { href: "/cold", label: "Cold lists", icon: ScanLine },
  { href: "/views", label: "Unique views", icon: CalendarRange },
  { href: "/guests", label: "Guests", icon: UserCheck },
  { href: "/floorplans", label: "Floor plans", icon: MapIcon },
  { href: "/reviews", label: "Reviews", icon: Star },
  { href: "/handoff", label: "Hand-off", icon: Handshake },
  { href: "/discover", label: "Directory", icon: Compass },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/automations", label: "Automations", icon: Workflow },
  { href: "/sequences", label: "Sequences", icon: Zap },
  { href: "/leadbooster", label: "LeadBooster", icon: Bot },
  { href: "/chatbot", label: "Chatbot", icon: Bot },
  { href: "/forms", label: "Forms", icon: FormInput },
  { href: "/prospector", label: "Prospector", icon: UserPlus },
  { href: "/scheduler", label: "Scheduler", icon: Calendar },
  { href: "/forecast", label: "Forecast", icon: Activity },
  { href: "/boards", label: "Display boards", icon: Monitor },
  { href: "/travel", label: "Mileage", icon: Truck },
  { href: "/files", label: "Files", icon: FolderOpen },
  { href: "/approvals", label: "Approvals", icon: ClipboardCheck },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/esign", label: "E-sign", icon: PenLine },
  { href: "/proposals", label: "Proposals", icon: FileText },
  { href: "/developers", label: "Developers", icon: KeyRound },
  { href: "/integrations", label: "Integrations", icon: Plug },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const CLIENT_NAV: NavItem[] = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/projects", label: "Projects", icon: LayoutGrid },
  { href: "/files", label: "Files", icon: FolderOpen },
  { href: "/approvals", label: "Approvals", icon: ClipboardCheck },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

export const STAFF_NAV: NavItem[] = [...STAFF_PRIMARY, ...STAFF_MORE];

export function catalogFor(client: boolean) {
  return client ? CLIENT_NAV : STAFF_NAV;
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/" || pathname.startsWith("/deals/");
  if (href === "/settings") return pathname === "/settings";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function applyLayout(catalog: NavItem[], layout: NavLayout) {
  const byHref = new Map(catalog.map((i) => [i.href, i]));
  const merged = mergeNavLayout(catalog.map((i) => i.href), layout);
  const pick = (hrefs: string[]) => hrefs.map((h) => byHref.get(h)).filter((i): i is NavItem => Boolean(i));
  const pinned = pick(merged.pins);
  const rest = pick(merged.order.filter((h) => !merged.pins.includes(h)));
  return { merged, pinned, rest };
}

export function SidebarNav({
  pathname,
  client,
  compact,
}: {
  pathname: string;
  client: boolean;
  compact?: boolean;
}) {
  const memberId = useUi((s) => s.memberId);
  const qc = useQueryClient();
  const [arrange, setArrange] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const prefs = useQuery({
    queryKey: ["nav-prefs", memberId],
    queryFn: () => getNavPrefs({ data: { memberId } }),
  });
  const catalog = catalogFor(client);
  const { merged, pinned, rest } = applyLayout(catalog, prefs.data ?? { pins: [], order: [] });
  const layoutRef = useRef(merged);
  layoutRef.current = merged;

  function persist(next: NavLayout) {
    const applied = mergeNavLayout(
      catalog.map((i) => i.href),
      next,
    );
    layoutRef.current = applied;
    qc.setQueryData(["nav-prefs", memberId], applied);
    void saveNavPrefs({ data: { memberId, ...applied } });
  }

  function togglePin(href: string) {
    const cur = layoutRef.current;
    const pins = cur.pins.includes(href) ? cur.pins.filter((h) => h !== href) : [...cur.pins, href];
    persist({ pins, order: cur.order });
  }

  function onDragStart(href: string, e: DragEvent) {
    e.dataTransfer.setData("text/plain", href);
    e.dataTransfer.effectAllowed = "move";
    setDragging(href);
  }

  function onDrop(targetHref: string, zone: "pin" | "rest") {
    if (!dragging || dragging === targetHref) {
      setDragging(null);
      setOver(null);
      return;
    }
    const cur = layoutRef.current;
    if (zone === "pin") {
      persist({ pins: insertBefore(cur.pins, dragging, targetHref), order: cur.order });
    } else {
      persist({
        pins: cur.pins.filter((h) => h !== dragging),
        order: insertBefore(cur.order, dragging, targetHref),
      });
    }
    setDragging(null);
    setOver(null);
  }

  function reset() {
    persist({ pins: [], order: catalog.map((i) => i.href) });
    setArrange(false);
  }

  return (
    <nav className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {pinned.length > 0 && (
          <div
            className="mb-1"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (dragging && !merged.pins.includes(dragging)) togglePin(dragging);
              setDragging(null);
            }}
          >
            <p className="mb-1 px-2.5 pt-1 text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
              Pinned
            </p>
            {pinned.map((item) => (
              <NavRow
                key={`pin-${item.href}`}
                item={item}
                pathname={pathname}
                compact={compact}
                arrange={arrange}
                pinned
                dragging={dragging === item.href}
                over={over === `pin:${item.href}`}
                onStar={() => togglePin(item.href)}
                onDragStart={(e) => onDragStart(item.href, e)}
                onDragOver={() => setOver(`pin:${item.href}`)}
                onDrop={() => onDrop(item.href, "pin")}
              />
            ))}
          </div>
        )}
        {rest.map((item) => (
          <NavRow
            key={item.href}
            item={item}
            pathname={pathname}
            compact={compact}
            arrange={arrange}
            pinned={false}
            dragging={dragging === item.href}
            over={over === `rest:${item.href}`}
            onStar={() => togglePin(item.href)}
            onDragStart={(e) => onDragStart(item.href, e)}
            onDragOver={() => setOver(`rest:${item.href}`)}
            onDrop={() => onDrop(item.href, "rest")}
          />
        ))}
      </div>
      <div className="border-t border-border px-2 py-2">
        <Button
          size="sm"
          variant={arrange ? "secondary" : "ghost"}
          className="w-full justify-start text-xs"
          onClick={() => setArrange((v) => !v)}
        >
          {arrange ? "Done arranging" : "Arrange sidebar"}
        </Button>
        {arrange && (
          <button
            type="button"
            className="mt-1 w-full px-2.5 text-left text-[11px] text-muted-foreground hover:text-foreground"
            onClick={reset}
          >
            Reset to default order
          </button>
        )}
      </div>
    </nav>
  );
}

function NavRow({
  item,
  pathname,
  compact,
  arrange,
  pinned,
  dragging,
  over,
  onStar,
  onDragStart,
  onDragOver,
  onDrop,
}: {
  item: NavItem;
  pathname: string;
  compact?: boolean;
  arrange: boolean;
  pinned: boolean;
  dragging: boolean;
  over: boolean;
  onStar: () => void;
  onDragStart: (e: DragEvent) => void;
  onDragOver: () => void;
  onDrop: () => void;
}) {
  const Icon = item.icon;
  const active = isActive(pathname, item.href);
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver();
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop();
      }}
      className={cn("group relative", dragging && "opacity-40", over && "ring-1 ring-ring rounded-md")}
    >
      <Link
        to={item.href as "/"}
        onClick={() => useUi.getState().setSidebarOpen(false)}
        className={cn(
          "flex min-h-10 items-center gap-2 rounded-md px-2 text-sm transition-colors",
          active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
        )}
      >
        <span
          draggable
          onDragStart={onDragStart}
          onDragEnd={() => undefined}
          className={cn(
            "shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing",
            arrange ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
          aria-label={`Reorder ${item.label}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <GripVertical className="size-3.5" />
        </span>
        <Icon className="size-4 shrink-0" />
        <span className="min-w-0 flex-1 truncate">{item.label}</span>
        <button
          type="button"
          aria-label={pinned ? `Unpin ${item.label}` : `Pin ${item.label}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onStar();
          }}
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-sm",
            pinned ? "text-primary opacity-100" : "text-muted-foreground opacity-0 group-hover:opacity-100",
            arrange && "opacity-100",
          )}
        >
          <Star className={cn("size-3.5", pinned && "fill-current")} />
        </button>
      </Link>
    </div>
  );
}
