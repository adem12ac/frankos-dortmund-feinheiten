// Shared shop domain types used by both the storefront and the admin area.
// Safe to import from client code — contains no server secrets.

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  category: string;
  /** Price in the smallest currency unit (cents). */
  priceCents: number;
  currency: string;
  unit: string | null;
  imageUrl: string | null;
  badge: string | null;
  stock: number;
  active: boolean;
}

export interface CartLine {
  productId: string;
  handle: string;
  title: string;
  unit: string | null;
  imageUrl: string | null;
  priceCents: number;
  currency: string;
  quantity: number;
}

export interface OrderItem {
  id: string;
  productId: string | null;
  title: string;
  unit: string | null;
  quantity: number;
  unitPriceCents: number;
  totalCents: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  email: string;
  phone: string | null;
  shippingAddress: {
    line1?: string | null;
    line2?: string | null;
    postal_code?: string | null;
    city?: string | null;
    country?: string | null;
  } | null;
  amountTotalCents: number;
  currency: string;
  paymentStatus: string;
  shippingStatus: string;
  items: OrderItem[];
}

export interface ShopStats {
  totalRevenueCents: number;
  orderCount: number;
  openOrderCount: number;
  totalStock: number;
  lowStockProducts: Array<{ id: string; title: string; stock: number }>;
}
