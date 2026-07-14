import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe.server";
import { requireEnv } from "@/lib/env.server";
import { getSupabaseAdmin, type ShippingAddress } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const signature = request.headers.get("stripe-signature");
        if (!signature) {
          return Response.json({ error: "Signatur fehlt." }, { status: 400 });
        }

        const rawBody = await request.text();
        let event: Stripe.Event;
        try {
          // constructEventAsync works on both Node and edge runtimes.
          event = await getStripe().webhooks.constructEventAsync(
            rawBody,
            signature,
            requireEnv("STRIPE_WEBHOOK_SECRET"),
          );
        } catch (error) {
          console.error("Webhook signature verification failed:", error);
          return Response.json({ error: "Ungültige Signatur." }, { status: 400 });
        }

        try {
          switch (event.type) {
            case "checkout.session.completed":
            case "checkout.session.async_payment_succeeded": {
              await handleCompletedCheckout(event.data.object as Stripe.Checkout.Session);
              break;
            }
            case "checkout.session.async_payment_failed": {
              const session = event.data.object as Stripe.Checkout.Session;
              await getSupabaseAdmin()
                .from("orders")
                .update({ payment_status: "failed" })
                .eq("stripe_session_id", session.id);
              break;
            }
            default:
              break; // Ignore unrelated events.
          }
          return Response.json({ received: true });
        } catch (error) {
          console.error(`Webhook handler failed for ${event.type}:`, error);
          // 500 → Stripe retries the delivery automatically.
          return Response.json({ error: "Interner Fehler." }, { status: 500 });
        }
      },
    },
  },
});

async function handleCompletedCheckout(sessionEvent: Stripe.Checkout.Session) {
  const supabase = getSupabaseAdmin();

  // Idempotency: Stripe may deliver events more than once.
  const { data: existing, error: existingError } = await supabase
    .from("orders")
    .select("id, payment_status")
    .eq("stripe_session_id", sessionEvent.id)
    .maybeSingle();
  if (existingError) throw new Error(existingError.message);

  // Fetch the full session incl. line items and their product metadata.
  const session = await getStripe().checkout.sessions.retrieve(sessionEvent.id, {
    expand: ["line_items.data.price.product"],
  });

  if (existing) {
    // Order already stored (e.g. async payment now succeeded) → update status only.
    await supabase
      .from("orders")
      .update({
        payment_status: session.payment_status ?? "paid",
        stripe_payment_intent:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : (session.payment_intent?.id ?? null),
      })
      .eq("id", existing.id);
    return;
  }

  const shipping = extractShippingAddress(session);
  const customerName = shipping.name || session.customer_details?.name || "Unbekannt";

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      stripe_session_id: session.id,
      stripe_payment_intent:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : (session.payment_intent?.id ?? null),
      customer_name: customerName,
      email: session.customer_details?.email ?? "",
      phone: session.customer_details?.phone ?? null,
      shipping_address: shipping.address,
      amount_total_cents: session.amount_total ?? 0,
      currency: (session.currency ?? "eur").toUpperCase(),
      payment_status: session.payment_status ?? "unpaid",
      shipping_status: "offen",
    })
    .select("id")
    .single();
  if (orderError) throw new Error(orderError.message);

  const lineItems = session.line_items?.data ?? [];
  const itemRows = lineItems.map((line) => {
    const product = line.price?.product;
    const productId =
      product && typeof product !== "string" && !("deleted" in product)
        ? (product.metadata?.product_id ?? null)
        : null;
    const unit =
      product && typeof product !== "string" && !("deleted" in product)
        ? (product.description ?? null)
        : null;
    return {
      order_id: order.id,
      product_id: productId,
      title: line.description ?? "Artikel",
      unit,
      quantity: line.quantity ?? 1,
      unit_price_cents: line.price?.unit_amount ?? 0,
      total_cents: line.amount_total ?? 0,
    };
  });

  if (itemRows.length > 0) {
    const { error: itemsError } = await supabase.from("order_items").insert(itemRows);
    if (itemsError) throw new Error(itemsError.message);

    // Decrement stock atomically per product.
    for (const row of itemRows) {
      if (!row.product_id) continue;
      const { error: stockError } = await supabase.rpc("decrement_stock", {
        p_product_id: row.product_id,
        p_quantity: row.quantity,
      });
      if (stockError) {
        console.error(`Stock decrement failed for product ${row.product_id}:`, stockError.message);
      }
    }
  }
}

function extractShippingAddress(session: Stripe.Checkout.Session): {
  name: string | null;
  address: ShippingAddress | null;
} {
  // Depending on the API version, shipping lives on collected_information
  // or (in older versions) directly on the session; fall back to the
  // billing address from customer_details.
  const collected = session as unknown as {
    collected_information?: {
      shipping_details?: {
        name?: string | null;
        address?: Stripe.Address | null;
      } | null;
    } | null;
    shipping_details?: {
      name?: string | null;
      address?: Stripe.Address | null;
    } | null;
  };
  const details =
    collected.collected_information?.shipping_details ?? collected.shipping_details ?? null;
  const address = details?.address ?? session.customer_details?.address ?? null;
  return {
    name: details?.name ?? null,
    address: address
      ? {
          line1: address.line1,
          line2: address.line2,
          postal_code: address.postal_code,
          city: address.city,
          country: address.country,
        }
      : null,
  };
}
