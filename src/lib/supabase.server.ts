// Server-only Supabase client using the service role key.
// All database access goes through API routes — the browser never talks to
// Supabase directly, so RLS can stay locked down completely.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { requireEnv } from "./env.server";

let client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!client) {
    client = createClient(requireEnv("SUPABASE_URL"), requireEnv("SUPABASE_SERVICE_ROLE_KEY"), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

// --- Database row types ---

export interface ProductRow {
  id: string;
  handle: string;
  title: string;
  description: string;
  category: string;
  price_cents: number;
  currency: string;
  unit: string | null;
  image_url: string | null;
  badge: string | null;
  stock: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderRow {
  id: string;
  order_number: string;
  stripe_session_id: string;
  stripe_payment_intent: string | null;
  customer_name: string;
  email: string;
  phone: string | null;
  shipping_address: ShippingAddress | null;
  amount_total_cents: number;
  currency: string;
  payment_status: string;
  shipping_status: ShippingStatus;
  created_at: string;
}

export interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string | null;
  title: string;
  unit: string | null;
  quantity: number;
  unit_price_cents: number;
  total_cents: number;
}

export interface ShippingAddress {
  line1?: string | null;
  line2?: string | null;
  postal_code?: string | null;
  city?: string | null;
  country?: string | null;
}

export const SHIPPING_STATUSES = ["offen", "in_bearbeitung", "versendet", "zugestellt"] as const;

export type ShippingStatus = (typeof SHIPPING_STATUSES)[number];

export const SHIPPING_STATUS_LABELS: Record<ShippingStatus, string> = {
  offen: "Offen",
  in_bearbeitung: "In Bearbeitung",
  versendet: "Versendet",
  zugestellt: "Zugestellt",
};
