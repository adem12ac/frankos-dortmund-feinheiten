import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { requireAdmin } from "@/lib/admin-auth.server";
import { getSupabaseAdmin } from "@/lib/supabase.server";
import type { ShopStats } from "@/lib/shop-types";

const LOW_STOCK_THRESHOLD = 5;

export const Route = createFileRoute("/api/admin/stats")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const unauthorized = await requireAdmin(request);
        if (unauthorized) return unauthorized;

        try {
          const supabase = getSupabaseAdmin();
          const [ordersRes, productsRes] = await Promise.all([
            supabase.from("orders").select("amount_total_cents, payment_status, shipping_status"),
            supabase.from("products").select("id, title, stock, active"),
          ]);
          if (ordersRes.error) throw new Error(ordersRes.error.message);
          if (productsRes.error) throw new Error(productsRes.error.message);

          const orders = ordersRes.data as Array<{
            amount_total_cents: number;
            payment_status: string;
            shipping_status: string;
          }>;
          const products = productsRes.data as Array<{
            id: string;
            title: string;
            stock: number;
            active: boolean;
          }>;

          const stats: ShopStats = {
            totalRevenueCents: orders
              .filter((o) => o.payment_status === "paid")
              .reduce((sum, o) => sum + o.amount_total_cents, 0),
            orderCount: orders.length,
            openOrderCount: orders.filter((o) => o.shipping_status === "offen").length,
            totalStock: products.filter((p) => p.active).reduce((sum, p) => sum + p.stock, 0),
            lowStockProducts: products
              .filter((p) => p.active && p.stock <= LOW_STOCK_THRESHOLD)
              .sort((a, b) => a.stock - b.stock)
              .map((p) => ({ id: p.id, title: p.title, stock: p.stock })),
          };
          return Response.json({ stats });
        } catch (error) {
          console.error("GET /api/admin/stats failed:", error);
          return Response.json(
            { error: "Statistiken konnten nicht geladen werden." },
            { status: 500 },
          );
        }
      },
    },
  },
});
