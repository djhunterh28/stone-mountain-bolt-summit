import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/domain")({
  beforeLoad: () => {
    throw redirect({ to: "/settings", search: { tab: "domain" } });
  },
});
