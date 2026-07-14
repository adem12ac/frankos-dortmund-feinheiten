import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { z } from "zod";
import {
  createSessionToken,
  sessionCookieHeader,
  verifyAdminPassword,
} from "@/lib/admin-auth.server";

const loginSchema = z.object({ password: z.string().min(1).max(200) });

export const Route = createFileRoute("/api/admin/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let password: string;
        try {
          password = loginSchema.parse(await request.json()).password;
        } catch {
          return Response.json({ error: "Ungültige Anfrage." }, { status: 400 });
        }

        try {
          if (!verifyAdminPassword(password)) {
            return Response.json({ error: "Falsches Passwort." }, { status: 401 });
          }
          const token = await createSessionToken();
          return Response.json(
            { ok: true },
            { headers: { "Set-Cookie": sessionCookieHeader(token, request) } },
          );
        } catch (error) {
          // Most commonly: ADMIN_PASSWORD or ADMIN_SESSION_SECRET is missing,
          // or not set for this environment (e.g. only "Preview" instead of
          // "Production" in Vercel).
          console.error("POST /api/admin/login failed:", error);
          return Response.json(
            {
              error:
                "Server-Konfiguration unvollständig: ADMIN_PASSWORD oder ADMIN_SESSION_SECRET fehlt für dieses Environment.",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
