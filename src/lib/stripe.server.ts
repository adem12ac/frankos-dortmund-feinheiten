// Server-only Stripe client (official SDK).
import Stripe from "stripe";
import { requireEnv } from "./env.server";

let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (!client) {
    client = new Stripe(requireEnv("STRIPE_SECRET_KEY"), {
      // Pin the API version the integration was built and tested against
      // (matches the bundled SDK's pinned version).
      apiVersion: "2026-06-24.dahlia",
    });
  }
  return client;
}
