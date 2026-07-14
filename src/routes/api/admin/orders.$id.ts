import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth.server";
import { getSupabaseAdmin, SHIPPING_STATUSES } from "@/lib/supabase.server";

const updateSchema = z.object({
  shippingStatus: z.enum(SHIPPING_STATUSES),
});

export const Route = createFileRoute("/api/admin/orders/$id")({
  server: {
    handlers: {
      PATCH: async ({ request, params }) => {
        const unauthorized = await requireAdmin(request);
        if (unauthorized) return unauthorized;

        if (!z.string().uuid().safeParse(params.id).success) {
          return Response.json({ error: "Ungültige ID." }, { status: 400 });
        }

        let payload: z.infer<typeof updateSchema>;
        try {
          payload = updateSchema.parse(await request.json());
        } catch {
          return Response.json({ error: "Ungültiger Versandstatus." }, { status: 400 });
        }

        try {
          const { data, error } = await getSupabaseAdmin()
            .from("orders")
            .update({ shipping_status: payload.shippingStatus })
            .eq("id", params.id)
            .select("id")
            .maybeSingle();
          if (error) throw new Error(error.message);
          if (!data) {
            return Response.json({ error: "Bestellung nicht gefunden." }, { status: 404 });
          }
          return Response.json({ ok: true });
        } catch (error) {
          console.error("PATCH /api/admin/orders/$id failed:", error);
          return Response.json({ error: "Status konnte nicht geändert werden." }, { status: 500 });
        }
      },
    },
  },
});
