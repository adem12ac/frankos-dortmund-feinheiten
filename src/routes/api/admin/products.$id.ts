import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth.server";
import { productUpdateSchema, type ProductUpdate } from "@/lib/product-input";
import { mapProductRow } from "@/lib/shop-data.server";
import { getSupabaseAdmin, type ProductRow } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/admin/products/$id")({
  server: {
    handlers: {
      PATCH: async ({ request, params }) => {
        const unauthorized = await requireAdmin(request);
        if (unauthorized) return unauthorized;
        if (!z.string().uuid().safeParse(params.id).success) {
          return Response.json({ error: "Ungültige ID." }, { status: 400 });
        }

        let input: ProductUpdate;
        try {
          input = productUpdateSchema.parse(await request.json());
        } catch (error) {
          return Response.json(
            { error: "Ungültige Produktdaten.", details: String(error) },
            { status: 400 },
          );
        }

        const update: Record<string, unknown> = {};
        if (input.title !== undefined) update.title = input.title;
        if (input.handle !== undefined) update.handle = input.handle;
        if (input.description !== undefined) update.description = input.description;
        if (input.category !== undefined) update.category = input.category;
        if (input.priceCents !== undefined) update.price_cents = input.priceCents;
        if (input.unit !== undefined) update.unit = input.unit;
        if (input.imageUrl !== undefined) update.image_url = input.imageUrl;
        if (input.badge !== undefined) update.badge = input.badge;
        if (input.stock !== undefined) update.stock = input.stock;
        if (input.active !== undefined) update.active = input.active;
        if (Object.keys(update).length === 0) {
          return Response.json({ error: "Keine Änderungen." }, { status: 400 });
        }
        update.updated_at = new Date().toISOString();

        try {
          const { data, error } = await getSupabaseAdmin()
            .from("products")
            .update(update)
            .eq("id", params.id)
            .select("*")
            .maybeSingle();
          if (error) {
            if (error.code === "23505") {
              return Response.json(
                { error: "Ein Produkt mit diesem Handle existiert bereits." },
                { status: 409 },
              );
            }
            throw new Error(error.message);
          }
          if (!data) {
            return Response.json({ error: "Produkt nicht gefunden." }, { status: 404 });
          }
          return Response.json({ product: mapProductRow(data as ProductRow) });
        } catch (error) {
          console.error("PATCH /api/admin/products/$id failed:", error);
          return Response.json(
            { error: "Produkt konnte nicht gespeichert werden." },
            { status: 500 },
          );
        }
      },

      DELETE: async ({ request, params }) => {
        const unauthorized = await requireAdmin(request);
        if (unauthorized) return unauthorized;
        if (!z.string().uuid().safeParse(params.id).success) {
          return Response.json({ error: "Ungültige ID." }, { status: 400 });
        }
        try {
          // order_items.product_id is ON DELETE SET NULL — past orders keep
          // their snapshot (title, price), so hard delete is safe.
          const { error } = await getSupabaseAdmin().from("products").delete().eq("id", params.id);
          if (error) throw new Error(error.message);
          return Response.json({ ok: true });
        } catch (error) {
          console.error("DELETE /api/admin/products/$id failed:", error);
          return Response.json({ error: "Produkt konnte nicht gelöscht werden." }, { status: 500 });
        }
      },
    },
  },
});
