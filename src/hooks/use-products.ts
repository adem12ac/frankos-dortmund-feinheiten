import { useQuery } from "@tanstack/react-query";
import type { Product } from "@/lib/shop-types";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Produkte konnten nicht geladen werden");
      const data = (await response.json()) as { products: Product[] };
      return data.products;
    },
    staleTime: 60_000,
  });
}

export function useProduct(handle: string) {
  return useQuery({
    queryKey: ["product", handle],
    queryFn: async (): Promise<Product | null> => {
      const response = await fetch(`/api/products/${encodeURIComponent(handle)}`);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error("Produkt konnte nicht geladen werden");
      const data = (await response.json()) as { product: Product };
      return data.product;
    },
    staleTime: 60_000,
  });
}
