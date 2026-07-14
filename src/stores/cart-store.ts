// Local cart store. The cart lives entirely in the browser; prices are
// re-validated server-side when the Stripe Checkout Session is created.
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import type { CartLine, Product } from "@/lib/shop-types";

interface CartStore {
  items: CartLine[];
  isLoading: boolean;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  checkout: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.productId === product.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.productId === product.id
                ? { ...i, quantity: Math.min(i.quantity + quantity, 99) }
                : i,
            ),
          });
          return;
        }
        set({
          items: [
            ...items,
            {
              productId: product.id,
              handle: product.handle,
              title: product.title,
              unit: product.unit,
              imageUrl: product.imageUrl,
              priceCents: product.priceCents,
              currency: product.currency,
              quantity,
            },
          ],
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity: Math.min(quantity, 99) } : i,
          ),
        });
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      clearCart: () => set({ items: [] }),

      checkout: async () => {
        const items = get().items;
        if (items.length === 0) return;
        set({ isLoading: true });
        try {
          const response = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: items.map((i) => ({
                productId: i.productId,
                quantity: i.quantity,
              })),
            }),
          });
          const data = (await response.json()) as {
            url?: string;
            error?: string;
          };
          if (!response.ok || !data.url) {
            toast.error("Checkout fehlgeschlagen", {
              description: data.error ?? "Bitte versuchen Sie es später erneut.",
            });
            return;
          }
          window.location.href = data.url;
        } catch (error) {
          console.error("Checkout failed:", error);
          toast.error("Checkout fehlgeschlagen", {
            description: "Bitte versuchen Sie es später erneut.",
          });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "frankos-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
