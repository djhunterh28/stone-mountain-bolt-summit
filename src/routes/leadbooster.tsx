import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/leadbooster")({
  beforeLoad: () => {
    throw redirect({ to: "/leads", search: { tab: "booster" } });
  },
});
