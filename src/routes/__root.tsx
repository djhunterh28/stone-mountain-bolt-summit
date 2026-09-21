import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { Providers } from "@/components/providers";
import { AppShell } from "@/components/layout/app-shell";
import { ThemeSync } from "@/components/layout/theme-sync";
import { THEME_BOOT_SCRIPT, THEME_COLORS } from "@/lib/crm/theme";
import appCss from "../styles.css?url";

const APP_NAME = "Northline";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "theme-color", content: THEME_COLORS.light },
      {
        name: "description",
        content: "Northline — production CRM for live event AV companies.",
      },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap",
      },
    ],
  }),
  component: () => (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body className="bg-background text-foreground">
        <PreviewHostBridge />
        <AuthProvider>
          <Providers>
            <ThemeSync />
            <AppShell>
              <Outlet />
            </AppShell>
          </Providers>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
