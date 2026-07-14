import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { requireAdmin } from "@/lib/admin-auth.server";
import { mapOrderRow } from "@/lib/shop-data.server";
import { getSupabaseAdmin, type OrderItemRow, type OrderRow } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/admin/orders")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const unauthorized = await requireAdmin(request);
        if (unauthorized) return unauthorized;

        try {
          const { data, error } = await getSupabaseAdmin()
            .from("orders")
            .select("*, order_items(*)")
            .order("created_at", { ascending: false })
            .limit(500);
          if (error) throw new Error(error.message);

          const orders = (data as Array<OrderRow & { order_items: OrderItemRow[] }>).map((row) =>
            mapOrderRow(row, row.order_items ?? []),
          );
          return Response.json({ orders });
        } catch (error) {
          console.error("GET /api/admin/orders failed:", error);
          return Response.json(
            { error: "Bestellungen konnten nicht geladen werden." },
            { status: 500 },
          );
        }
      },
    },
  },
});
