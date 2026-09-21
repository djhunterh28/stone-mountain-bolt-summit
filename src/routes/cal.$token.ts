import { createFileRoute } from "@tanstack/react-router";
import { webcalBody } from "@/lib/crm/ops";

export const Route = createFileRoute("/cal/$token")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const body = await webcalBody(params.token);
        if (!body) return new Response("Not found", { status: 404 });
        return new Response(body, {
          headers: {
            "Content-Type": "text/calendar; charset=utf-8",
            "Content-Disposition": 'attachment; filename="northline.ics"',
          },
        });
      },
    },
  },
});
