import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/cold")({
  beforeLoad: () => {
    throw redirect({ to: "/home" });
  },
});
