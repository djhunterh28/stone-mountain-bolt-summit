import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/floorplans")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
