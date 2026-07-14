import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getActiveProducts } from "@/lib/shop-data.server";

export const Route = createFileRoute("/api/products")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const products = await getActiveProducts();
          return Response.json(
            { products },
            { headers: { "Cache-Control": "public, max-age=0, s-maxage=30" } },
          );
        } catch (error) {
          console.error("GET /api/products failed:", error);
          return Response.json(
            { error: "Produkte konnten nicht geladen werden." },
            { status: 500 },
          );
        }
      },
    },
  },
});
