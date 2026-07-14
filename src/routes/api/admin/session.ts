import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { isAdminRequest } from "@/lib/admin-auth.server";

export const Route = createFileRoute("/api/admin/session")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const authenticated = await isAdminRequest(request);
        return Response.json({ authenticated }, { status: authenticated ? 200 : 401 });
      },
    },
  },
});
