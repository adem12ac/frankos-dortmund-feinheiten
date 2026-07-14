import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import type { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth.server";
import { productInputSchema, slugify } from "@/lib/product-input";
import { mapProductRow } from "@/lib/shop-data.server";
import { getSupabaseAdmin, type ProductRow } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/admin/products")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const unauthorized = await requireAdmin(request);
        if (unauthorized) return unauthorized;
        try {
          const { data, error } = await getSupabaseAdmin()
            .from("products")
            .select("*")
            .order("created_at", { ascending: true });
          if (error) throw new Error(error.message);
          return Response.json({
            products: (data as ProductRow[]).map(mapProductRow),
          });
        } catch (error) {
          console.error("GET /api/admin/products failed:", error);
          return Response.json(
            { error: "Produkte konnten nicht geladen werden." },
            { status: 500 },
          );
        }
      },

      POST: async ({ request }) => {
        const unauthorized = await requireAdmin(request);
        if (unauthorized) return unauthorized;

        let input: z.infer<typeof productInputSchema>;
        try {
          input = productInputSchema.parse(await request.json());
        } catch (error) {
          return Response.json(
            { error: "Ungültige Produktdaten.", details: String(error) },
            { status: 400 },
          );
        }

        try {
          const handle = input.handle || slugify(input.title);
          if (!handle) {
            return Response.json(
              { error: "Aus dem Titel konnte kein Handle erzeugt werden." },
              { status: 400 },
            );
          }
          const { data, error } = await getSupabaseAdmin()
            .from("products")
            .insert({
              title: input.title,
              handle,
              description: input.description,
              category: input.category,
              price_cents: input.priceCents,
              unit: input.unit,
              image_url: input.imageUrl,
              badge: input.badge,
              stock: input.stock,
              active: input.active,
            })
            .select("*")
            .single();
          if (error) {
            if (error.code === "23505") {
              return Response.json(
                { error: "Ein Produkt mit diesem Handle existiert bereits." },
                { status: 409 },
              );
            }
            throw new Error(error.message);
          }
          return Response.json({ product: mapProductRow(data as ProductRow) }, { status: 201 });
        } catch (error) {
          console.error("POST /api/admin/products failed:", error);
          return Response.json({ error: "Produkt konnte nicht angelegt werden." }, { status: 500 });
        }
      },
    },
  },
});
