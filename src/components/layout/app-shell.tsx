import { useEffect, type ReactNode } from "react";
import { Link, Navigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  Bookmark,
  ChevronDown,
  Menu,
  Plus,
  Search,
  Sparkles,
  X,
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
import { HurricaneLogo } from "@/components/portal/hp-mark";
import { getPortalBrand } from "@/lib/portal/brand";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { toast } from "sonner";

function isPublic(pathname: string) {
  return (
    pathname.startsWith("/f/") ||
    pathname.startsWith("/book/") ||
    pathname.startsWith("/sign/") ||
    pathname.startsWith("/p/") ||
    pathname.startsWith("/h/") ||
    pathname.startsWith("/r/") ||
    pathname.startsWith("/u/") ||
    pathname.startsWith("/t/") ||
    pathname.startsWith("/board/") ||
    pathname.startsWith("/w/") ||
    pathname === "/portal" ||
    pathname.startsWith("/c/") ||
    pathname.startsWith("/rsvp/") ||
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
  const portalBrand = useQuery({
    queryKey: ["portal-brand"],
    queryFn: () => getPortalBrand(),
    enabled: client,
  });

  useEffect(() => {
    if (!client) return;
    const hex = portalBrand.data?.primaryHex ?? "0D47A1";
    document.documentElement.dataset.brand = "portal";
    document.documentElement.style.setProperty("--nl-primary", `#${hex}`);
    document.documentElement.style.setProperty("--nl-ring", `#${hex}`);
    return () => {
      delete document.documentElement.dataset.brand;
      document.documentElement.style.removeProperty("--nl-primary");
      document.documentElement.style.removeProperty("--nl-ring");
    };
  }, [client, portalBrand.data?.primaryHex]);

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

  const blocked = access.data && access.data.allowed === false && pathname !== "/settings";

  return (
    <div className="flex min-h-dvh bg-background">
      <aside className="nl-rail sticky top-0 hidden h-dvh w-56 shrink-0 flex-col border-r border-border lg:flex">
        <Brand client={client} company={portalBrand.data?.company} primary={portalBrand.data?.primaryHex} />
        <SidebarNav pathname={pathname} client={client} compact />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-overlay/60" onClick={() => setSidebarOpen(false)} aria-label="Close menu" />
          <aside className="nl-rail relative z-10 flex h-full w-72 flex-col shadow-[var(--shadow-lift)]">
            <div className="flex items-center justify-between px-3 py-3">
              <Brand client={client} company={portalBrand.data?.company} primary={portalBrand.data?.primaryHex} />
              <Button size="icon-sm" variant="ghost" onClick={() => setSidebarOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>
            <SidebarNav pathname={pathname} client={client} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-border bg-background/85 px-3 backdrop-blur-md sm:px-4">
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
          <Button size="sm" variant="copper" onClick={() => setAddOpen(true, "deal")}>
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
            <Link to="/settings" search={{ tab: "security" }} className="underline-offset-4 hover:underline">
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

function Brand({
  client,
  company,
  primary,
}: {
  client?: boolean;
  company?: string;
  primary?: string;
}) {
  if (client) {
    return (
      <Link to="/home" className="flex items-center gap-2.5 px-3 py-4 text-foreground">
        <HurricaneLogo className="size-8" />
        <span className="text-sm font-semibold tracking-tight">{company ?? "Hurricane Productions"}</span>
      </Link>
    );
  }
  return (
    <Link to="/home" className="flex items-center gap-2.5 px-3 py-4 text-foreground">
      <HurricaneLogo className="size-8" />
      <span className="text-sm font-semibold tracking-tight">Hurricane</span>
    </Link>
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
