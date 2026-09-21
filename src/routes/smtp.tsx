import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/smtp")({
  beforeLoad: () => {
    throw redirect({ to: "/settings", search: { tab: "smtp" } });
  },
});
