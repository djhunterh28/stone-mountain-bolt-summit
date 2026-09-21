import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/portal-domain")({
  beforeLoad: () => {
    throw redirect({ to: "/settings", search: { tab: "portal" } });
  },
});
