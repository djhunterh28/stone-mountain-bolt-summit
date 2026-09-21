import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/sequences")({
  beforeLoad: () => {
    throw redirect({ to: "/settings", search: { tab: "sequences" } });
  },
});
