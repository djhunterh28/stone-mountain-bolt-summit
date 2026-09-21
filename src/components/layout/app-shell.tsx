import { useEffect, type ReactNode } from "react";
import { Link, Navigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  BarChart3,
  Bell,
  Box,
  Briefcase,
  Bookmark,
  Bot,
  Calendar,
  CheckSquare,
  ChevronDown,
  ClipboardCheck,
  Compass,
  FileText,
  FlaskConical,
  FolderOpen,
  FormInput,
  Handshake,
  HeartPulse,
  Home,
  Inbox,
  Kanban,
  KeyRound,
  LayoutGrid,
  Mail,
  Map,
  Megaphone,
  Menu,
  MessageSquare,
  Monitor,
  PenLine,
  Plug,
  Plus,
  Radar,
  Receipt,
  Search,
  Settings,
  Shield,
  Sparkles,
  Star,
  Store,
  Target,
  Truck,
  Upload,
  UserCheck,
  UserCircle,
  UserPlus,
  Users,
  Wallet,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { getBootstrap, listNotifications, markNotificationsRead } from "@/lib/crm/server";
import { getPortalMe, listBookmarks, listTenants, switchTenant } from "@/lib/portal/server";
import { useUi } from "@/lib/crm/store";
import { cn } from "@/lib/utils";
import { MemberAvatar } from "@/components/crm/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AddDialog } from "@/components/crm/add-dialog";
import { CommandPalette } from "@/components/crm/command-palette";
import { AssistantPanel } from "@/components/crm/assistant";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SessionLock } from "@/components/layout/session-lock";
import { CookieBanner, DirtyGuard, SessionWatch } from "@/components/layout/portal-chrome";
import { getAccessState, testSignIn } from "@/lib/crm/governance";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { authEnabled } from "@/lib/auth/client";
import { toast } from "sonner";

const NAV = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/", label: "Pipeline", icon: Kanban },
  { href: "/leads", label: "Leads", icon: Inbox },
  { href: "/pulse", label: "Pulse", icon: Radar },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/activities", label: "Calendar", icon: Calendar },
  { href: "/projects", label: "Projects", icon: LayoutGrid },
  { href: "/insights", label: "Insights", icon: BarChart3 },
  { href: "/goals", label: "Goals", icon: Target },
];

const CLIENT_NAV = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/projects", label: "Projects", icon: LayoutGrid },
  { href: "/files", label: "Files", icon: FolderOpen },
  { href: "/approvals", label: "Approvals", icon: ClipboardCheck },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

const MORE = [
  { href: "/ai", label: "AI desk", icon: Sparkles },
  { href: "/health", label: "Health", icon: HeartPulse },
  { href: "/finance", label: "Finance", icon: Wallet },
  { href: "/quotes", label: "Quotes", icon: Receipt },
  { href: "/mail", label: "Mail", icon: Mail },
  { href: "/inbox", label: "Unified inbox", icon: MessageSquare },
  { href: "/broadcasts", label: "Broadcasts", icon: Megaphone },
  { href: "/crew", label: "Crew", icon: Users },
  { href: "/guests", label: "Guests", icon: UserCheck },
  { href: "/floorplans", label: "Floor plans", icon: Map },
  { href: "/reviews", label: "Reviews", icon: Star },
  { href: "/gigs", label: "Gigs", icon: Briefcase },
  { href: "/handoff", label: "Hand-off", icon: Handshake },
  { href: "/discover", label: "Directory", icon: Compass },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/products", label: "Products", icon: Box },
  { href: "/automations", label: "Automations", icon: Workflow },
  { href: "/sequences", label: "Sequences", icon: Zap },
  { href: "/leadbooster", label: "LeadBooster", icon: Bot },
  { href: "/chatbot", label: "Chatbot", icon: Bot },
  { href: "/forms", label: "Forms", icon: FormInput },
  { href: "/prospector", label: "Prospector", icon: UserPlus },
  { href: "/scheduler", label: "Scheduler", icon: Calendar },
  { href: "/marketplace", label: "Marketplace", icon: Store },
  { href: "/forecast", label: "Forecast", icon: Activity },
  { href: "/boards", label: "Display boards", icon: Monitor },
  { href: "/travel", label: "Mileage", icon: Truck },
  { href: "/import", label: "Import", icon: Upload },
  { href: "/files", label: "Files", icon: FolderOpen },
  { href: "/approvals", label: "Approvals", icon: ClipboardCheck },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/esign", label: "E-sign", icon: PenLine },
  { href: "/proposals", label: "Proposals", icon: FileText },
  { href: "/admin", label: "Admin", icon: Shield },
  { href: "/sandbox", label: "Sandbox", icon: FlaskConical },
  { href: "/developers", label: "Developers", icon: KeyRound },
  { href: "/integrations", label: "Integrations", icon: Plug },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/security", label: "Security", icon: Shield },
];

function Mark() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
      <rect x="4" y="5" width="3.2" height="14" rx="0.6" fill="currentColor" opacity="0.95" />
      <rect x="9.4" y="8" width="3.2" height="11" rx="0.6" fill="currentColor" opacity="0.7" />
      <rect x="14.8" y="3" width="3.2" height="16" rx="0.6" fill="currentColor" />
    </svg>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/" || pathname.startsWith("/deals/");
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isPublic(pathname: string) {
  return (
    pathname.startsWith("/f/") ||
    pathname.startsWith("/book/") ||
    pathname.startsWith("/sign/") ||
    pathname.startsWith("/p/") ||
    pathname.startsWith("/board/") ||
    pathname.startsWith("/w/") ||
    pathname.startsWith("/rsvp/") ||
    pathname.startsWith("/discover") ||
    pathname.startsWith("/cal/") ||
    pathname === "/login" ||
    pathname === "/forgot" ||
    pathname === "/reset" ||
    pathname === "/lookup" ||
    pathname === "/contact" ||
    pathname === "/request"
  );
}

function isEsignHost() {
  if (typeof window === "undefined") return false;
  return window.location.hostname.startsWith("esign.") || window.location.search.includes("esign=1");
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const publicPage = isPublic(pathname);
  const esign = isEsignHost();
  const { user, isPending } = useCurrentUserState();
  const { memberId, setMemberId, sidebarOpen, setSidebarOpen, setCommandOpen, setAddOpen, setAssistantOpen } =
    useUi();
  const portal = useQuery({ queryKey: ["portal-me"], queryFn: () => getPortalMe(), enabled: !!user && !publicPage });
  const tenants = useQuery({
    queryKey: ["tenants"],
    queryFn: () => listTenants(),
    enabled: portal.data?.role === "staff",
  });
  const marks = useQuery({ queryKey: ["bookmarks"], queryFn: () => listBookmarks(), enabled: !!user && !publicPage });
  const bootstrap = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap(), enabled: !publicPage });
  const access = useQuery({ queryKey: ["access"], queryFn: () => getAccessState(), enabled: !publicPage });
  const notes = useQuery({
    queryKey: ["notifications", memberId],
    queryFn: () => listNotifications({ data: { memberId } }),
    enabled: !publicPage,
  });
  const member = bootstrap.data?.members.find((m) => m.id === memberId) ?? bootstrap.data?.members[0];
  const unread = notes.data?.filter((n) => !n.read).length ?? 0;
  const client = portal.data?.role === "client" || portal.data?.role === "subuser";
  const navItems = client ? CLIENT_NAV : NAV;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setCommandOpen]);

  if (esign && !pathname.startsWith("/esign") && !pathname.startsWith("/sign/")) {
    return <Navigate to="/esign" />;
  }

  if (publicPage) {
    return (
      <>
        {children}
        <CookieBanner />
      </>
    );
  }

  if (authEnabled && isPending) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background text-sm text-muted-foreground">
        Loading the house…
      </div>
    );
  }

  if (authEnabled && !user) {
    return <RedirectToSignIn />;
  }

  const blocked = access.data && access.data.allowed === false && pathname !== "/security";

  return (
    <div className="flex min-h-dvh bg-background">
      <aside className="sticky top-0 hidden h-dvh w-56 shrink-0 flex-col border-r border-border bg-sidebar lg:flex">
        <Brand />
        <Nav pathname={pathname} items={navItems} client={client} compact />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-overlay/60" onClick={() => setSidebarOpen(false)} aria-label="Close menu" />
          <aside className="relative z-10 flex h-full w-72 flex-col bg-sidebar shadow-[var(--shadow-lift)]">
            <div className="flex items-center justify-between px-3 py-3">
              <Brand />
              <Button size="icon-sm" variant="ghost" onClick={() => setSidebarOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>
            <Nav pathname={pathname} items={navItems} client={client} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-border bg-background/90 px-3 backdrop-blur-sm sm:px-4">
          <Button size="icon-sm" variant="ghost" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="size-4" />
          </Button>
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-md bg-muted px-3 text-left text-sm text-muted-foreground sm:max-w-md"
          >
            <Search className="size-3.5 shrink-0" />
            <span className="truncate">Find a show, person, or command</span>
            <kbd className="ml-auto hidden font-mono text-[10px] sm:inline">⌘K</kbd>
          </button>
          <Button size="sm" onClick={() => setAddOpen(true, "deal")}>
            <Plus className="size-3.5" />
            New
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon-sm" variant="ghost" className="relative">
                <Bell className="size-4" />
                {unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-primary" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between border-b border-border px-3 py-2">
                <span className="text-sm font-medium">Notifications</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    markNotificationsRead({ data: { memberId } }).then(() =>
                      notes.refetch(),
                    )
                  }
                >
                  Mark read
                </Button>
              </div>
              <ul className="max-h-72 overflow-y-auto">
                {(notes.data ?? []).slice(0, 12).map((n) => (
                  <li key={n.id} className={cn("border-b border-border px-3 py-2.5 text-sm", !n.read && "bg-muted/50")}>
                    <div className="font-medium">{n.title}</div>
                    <p className="text-xs text-muted-foreground">{n.body}</p>
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon-sm" variant="ghost">
                <Bookmark className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Bookmarks</DropdownMenuLabel>
              {(marks.data ?? []).map((b) => (
                <DropdownMenuItem key={b.id} asChild>
                  <Link to={b.href as "/"}>{b.label}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/bookmarks">Manage</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="icon-sm" variant="ghost" onClick={() => setAssistantOpen(true)}>
            <Sparkles className="size-4" />
          </Button>
          <ThemeToggle />
          {portal.data?.role === "staff" && (tenants.data ?? []).length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="hidden md:inline-flex">
                  Tenant
                  <ChevronDown className="size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {(tenants.data ?? []).map((t) => (
                  <DropdownMenuItem
                    key={t.id}
                    onClick={() =>
                      switchTenant({ data: { tenantId: t.id, password: "northline" } }).then((r) => {
                        if (r.ok) toast.success(`Switched to ${t.name}`);
                        else toast.error(r.error);
                      })
                    }
                  >
                    {t.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem onClick={() => switchTenant({ data: { tenantId: null } })}>
                  Clear impersonation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {member && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="hidden items-center gap-2 rounded-md px-1.5 py-1 hover:bg-accent sm:flex">
                  <MemberAvatar initials={member.initials} tone={member.tone} size="sm" />
                  <span className="text-left text-xs">
                    <span className="block font-medium">{member.name}</span>
                    <span className="text-muted-foreground">{member.role}</span>
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Act as</DropdownMenuLabel>
                {(bootstrap.data?.members ?? []).map((m) => (
                  <DropdownMenuItem
                    key={m.id}
                    onClick={() => {
                      setMemberId(m.id);
                      void testSignIn({ data: { memberName: m.name } }).then((r) => {
                        if (!r.ok) toast.error(r.reason ?? "Policy denied");
                      });
                    }}
                  >
                    {m.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <div className="hidden xl:block">
            <UserButton />
          </div>
        </header>
        {blocked && (
          <div className="border-b border-border bg-muted px-4 py-2 text-sm">
            Access policy blocked this desk.{" "}
            <Link to="/security" className="underline-offset-4 hover:underline">
              Review security
            </Link>
          </div>
        )}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <AddDialog />
      <CommandPalette />
      <AssistantPanel />
      <SessionLock />
      <CookieBanner />
      <DirtyGuard />
      <SessionWatch />
    </div>
  );
}

function Brand() {
  return (
    <Link to="/home" className="flex items-center gap-2 px-3 py-4 text-foreground">
      <Mark />
      <span className="text-sm font-semibold tracking-tight">Northline</span>
    </Link>
  );
}

function Nav({
  pathname,
  items,
  client,
  compact,
}: {
  pathname: string;
  items: { href: string; label: string; icon: typeof Home }[];
  client: boolean;
  compact?: boolean;
}) {
  return (
    <nav className="flex-1 overflow-y-auto px-2 pb-8">
      {items.map((item) => {
        const Icon = item.icon;
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            to={item.href as "/"}
            onClick={() => useUi.getState().setSidebarOpen(false)}
            className={cn(
              "flex min-h-11 items-center gap-2.5 rounded-md px-2.5 text-sm transition-colors",
              active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className={cn(compact && "lg:hidden xl:inline")}>{item.label}</span>
          </Link>
        );
      })}
      {!client && (
        <p className="mt-4 mb-1 px-2.5 text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
          Workspace
        </p>
      )}
      {!client &&
        MORE.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              to={item.href as "/"}
              onClick={() => useUi.getState().setSidebarOpen(false)}
              className={cn(
                "flex min-h-10 items-center gap-2.5 rounded-md px-2.5 text-sm transition-colors",
                active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
    </nav>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 px-4 py-5 sm:px-6">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight text-balance">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
