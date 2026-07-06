import { useQuery } from "@tanstack/react-query";
import { PRODUCTS_QUERY, storefrontApiRequest, type ShopifyProduct } from "@/lib/shopify";

export function useShopifyProducts(first = 50, query?: string) {
  return useQuery({
    queryKey: ["shopify-products", first, query ?? ""],
    queryFn: async () => {
      const data = await storefrontApiRequest<any>(PRODUCTS_QUERY, {
        first,
        query: query ?? null,
      });
      const edges: ShopifyProduct[] = data?.data?.products?.edges ?? [];
      return edges;
    },
    staleTime: 60_000,
  });
}