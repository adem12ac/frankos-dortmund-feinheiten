import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { clearSessionCookieHeader } from "@/lib/admin-auth.server";

export const Route = createFileRoute("/api/admin/logout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        return Response.json(
          { ok: true },
          { headers: { "Set-Cookie": clearSessionCookieHeader(request) } },
        );
      },
    },
  },
});
