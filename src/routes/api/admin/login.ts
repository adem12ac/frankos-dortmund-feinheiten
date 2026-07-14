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

        if (!verifyAdminPassword(password)) {
          return Response.json({ error: "Falsches Passwort." }, { status: 401 });
        }

        const token = await createSessionToken();
        return Response.json(
          { ok: true },
          { headers: { "Set-Cookie": sessionCookieHeader(token, request) } },
        );
      },
    },
  },
});
