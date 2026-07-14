import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getProductByHandle } from "@/lib/shop-data.server";

export const Route = createFileRoute("/api/products/$handle")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const product = await getProductByHandle(params.handle);
          if (!product) {
            return Response.json({ error: "Produkt nicht gefunden." }, { status: 404 });
          }
          return Response.json(
            { product },
            { headers: { "Cache-Control": "public, max-age=0, s-maxage=30" } },
          );
        } catch (error) {
          console.error("GET /api/products/$handle failed:", error);
          return Response.json({ error: "Produkt konnte nicht geladen werden." }, { status: 500 });
        }
      },
    },
  },
});
