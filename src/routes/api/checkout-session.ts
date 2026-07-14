import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getStripe } from "@/lib/stripe.server";

export const Route = createFileRoute("/api/checkout-session")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const sessionId = new URL(request.url).searchParams.get("session_id");
        // Basic shape check to avoid arbitrary lookups.
        if (!sessionId || !/^cs_[a-zA-Z0-9_]+$/.test(sessionId)) {
          return Response.json({ error: "Ungültige Session." }, { status: 400 });
        }
        try {
          const session = await getStripe().checkout.sessions.retrieve(sessionId);
          return Response.json({
            status: session.status,
            paymentStatus: session.payment_status,
            customerEmail: session.customer_details?.email ?? null,
            amountTotalCents: session.amount_total ?? 0,
            currency: (session.currency ?? "eur").toUpperCase(),
          });
        } catch (error) {
          console.error("GET /api/checkout-session failed:", error);
          return Response.json(
            { error: "Bestellung konnte nicht geladen werden." },
            { status: 404 },
          );
        }
      },
    },
  },
});
