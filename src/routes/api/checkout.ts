import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import type Stripe from "stripe";
import { z } from "zod";
import { getStripe } from "@/lib/stripe.server";
import { getProductsByIds } from "@/lib/shop-data.server";

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().min(1).max(99),
      }),
    )
    .min(1)
    .max(50),
});

export const Route = createFileRoute("/api/checkout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: z.infer<typeof checkoutSchema>;
        try {
          payload = checkoutSchema.parse(await request.json());
        } catch {
          return Response.json({ error: "Ungültige Warenkorbdaten." }, { status: 400 });
        }

        try {
          // Merge duplicate lines defensively.
          const quantities = new Map<string, number>();
          for (const item of payload.items) {
            quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
          }

          // Prices always come from the database — never from the client.
          const products = await getProductsByIds([...quantities.keys()]);
          const productById = new Map(products.map((p) => [p.id, p]));
          const origin = new URL(request.url).origin;

          const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
          for (const [productId, quantity] of quantities) {
            const product = productById.get(productId);
            if (!product || !product.active) {
              return Response.json(
                { error: "Ein Produkt im Warenkorb ist nicht mehr verfügbar." },
                { status: 409 },
              );
            }
            if (product.stock < quantity) {
              return Response.json(
                {
                  error: `„${product.title}“ ist nur noch ${product.stock}× auf Lager.`,
                },
                { status: 409 },
              );
            }
            const images: string[] = [];
            if (product.imageUrl) {
              // Stripe only accepts absolute URLs.
              try {
                images.push(new URL(product.imageUrl, origin).toString());
              } catch {
                /* skip invalid image URLs */
              }
            }
            lineItems.push({
              quantity,
              price_data: {
                currency: product.currency.toLowerCase(),
                unit_amount: product.priceCents,
                product_data: {
                  name: product.title,
                  ...(product.unit ? { description: product.unit } : {}),
                  ...(images.length > 0 ? { images } : {}),
                  // Used by the webhook to map line items back to products.
                  metadata: { product_id: product.id },
                },
              },
            });
          }

          const session = await getStripe().checkout.sessions.create({
            mode: "payment",
            locale: "de",
            line_items: lineItems,
            shipping_address_collection: { allowed_countries: ["DE"] },
            phone_number_collection: { enabled: true },
            success_url: `${origin}/bestellung-erfolg?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/produkte`,
            metadata: { source: "frankos-webshop" },
          });

          if (!session.url) {
            throw new Error("Stripe hat keine Checkout-URL zurückgegeben.");
          }
          return Response.json({ url: session.url });
        } catch (error) {
          console.error("POST /api/checkout failed:", error);
          return Response.json(
            { error: "Checkout konnte nicht gestartet werden. Bitte erneut versuchen." },
            { status: 500 },
          );
        }
      },
    },
  },
});
