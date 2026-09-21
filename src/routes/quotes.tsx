import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/quotes")({
  beforeLoad: () => {
    throw redirect({ to: "/home" });
  },
});
