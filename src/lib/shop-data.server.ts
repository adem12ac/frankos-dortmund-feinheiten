// Server-side data access built on the Supabase service role client.
import {
  getSupabaseAdmin,
  type OrderItemRow,
  type OrderRow,
  type ProductRow,
} from "./supabase.server";
import type { Order, Product } from "./shop-types";

export function mapProductRow(row: ProductRow): Product {
  return {
    id: row.id,
    handle: row.handle,
    title: row.title,
    description: row.description,
    category: row.category,
    priceCents: row.price_cents,
    currency: row.currency,
    unit: row.unit,
    imageUrl: row.image_url,
    badge: row.badge,
    stock: row.stock,
    active: row.active,
  };
}

export function mapOrderRow(row: OrderRow, items: OrderItemRow[]): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    createdAt: row.created_at,
    customerName: row.customer_name,
    email: row.email,
    phone: row.phone,
    shippingAddress: row.shipping_address,
    amountTotalCents: row.amount_total_cents,
    currency: row.currency,
    paymentStatus: row.payment_status,
    shippingStatus: row.shipping_status,
    items: items.map((i) => ({
      id: i.id,
      productId: i.product_id,
      title: i.title,
      unit: i.unit,
      quantity: i.quantity,
      unitPriceCents: i.unit_price_cents,
      totalCents: i.total_cents,
    })),
  };
}

export async function getActiveProducts(): Promise<Product[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: true });
  if (error) throw new Error(`Produkte konnten nicht geladen werden: ${error.message}`);
  return (data as ProductRow[]).map(mapProductRow);
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .select("*")
    .eq("handle", handle)
    .eq("active", true)
    .maybeSingle();
  if (error) throw new Error(`Produkt konnte nicht geladen werden: ${error.message}`);
  return data ? mapProductRow(data as ProductRow) : null;
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const { data, error } = await getSupabaseAdmin().from("products").select("*").in("id", ids);
  if (error) throw new Error(`Produkte konnten nicht geladen werden: ${error.message}`);
  return (data as ProductRow[]).map(mapProductRow);
}
