import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Order, Product, ShopStats } from "@/lib/shop-types";
import type { ProductInput, ProductUpdate } from "@/lib/product-input";

async function jsonOrThrow<T>(response: Response): Promise<T> {
  const data = (await response.json().catch(() => ({}))) as T & {
    error?: string;
  };
  if (!response.ok) {
    throw new Error(data.error ?? `Fehler ${response.status}`);
  }
  return data;
}

// --- Auth ---

export function useAdminSession() {
  return useQuery({
    queryKey: ["admin-session"],
    queryFn: async () => {
      const response = await fetch("/api/admin/session");
      return { authenticated: response.ok };
    },
    staleTime: 60_000,
    retry: false,
  });
}

export function useAdminLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (password: string) => {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      return jsonOrThrow<{ ok: boolean }>(response);
    },
    onSuccess: () => {
      queryClient.setQueryData(["admin-session"], { authenticated: true });
    },
    onError: (error: Error) => {
      toast.error("Anmeldung fehlgeschlagen", { description: error.message });
    },
  });
}

export function useAdminLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await fetch("/api/admin/logout", { method: "POST" });
    },
    onSuccess: () => {
      queryClient.setQueryData(["admin-session"], { authenticated: false });
      queryClient.removeQueries({ queryKey: ["admin-orders"] });
      queryClient.removeQueries({ queryKey: ["admin-products"] });
      queryClient.removeQueries({ queryKey: ["admin-stats"] });
    },
  });
}

// --- Orders ---

export function useAdminOrders(enabled: boolean) {
  return useQuery({
    queryKey: ["admin-orders"],
    enabled,
    queryFn: async () => {
      const response = await fetch("/api/admin/orders");
      const data = await jsonOrThrow<{ orders: Order[] }>(response);
      return data.orders;
    },
  });
}

export function useUpdateShippingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string; shippingStatus: string }) => {
      const response = await fetch(`/api/admin/orders/${input.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingStatus: input.shippingStatus }),
      });
      return jsonOrThrow<{ ok: boolean }>(response);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Versandstatus aktualisiert");
    },
    onError: (error: Error) => {
      toast.error("Aktualisierung fehlgeschlagen", {
        description: error.message,
      });
    },
  });
}

// --- Products ---

export function useAdminProducts(enabled: boolean) {
  return useQuery({
    queryKey: ["admin-products"],
    enabled,
    queryFn: async () => {
      const response = await fetch("/api/admin/products");
      const data = await jsonOrThrow<{ products: Product[] }>(response);
      return data.products;
    },
  });
}

function invalidateProductQueries(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: ["admin-products"] });
  void queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
  void queryClient.invalidateQueries({ queryKey: ["products"] });
  void queryClient.invalidateQueries({ queryKey: ["product"] });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ProductInput) => {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      return jsonOrThrow<{ product: Product }>(response);
    },
    onSuccess: () => {
      invalidateProductQueries(queryClient);
      toast.success("Produkt angelegt");
    },
    onError: (error: Error) => {
      toast.error("Produkt konnte nicht angelegt werden", {
        description: error.message,
      });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string; update: ProductUpdate }) => {
      const response = await fetch(`/api/admin/products/${input.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input.update),
      });
      return jsonOrThrow<{ product: Product }>(response);
    },
    onSuccess: () => {
      invalidateProductQueries(queryClient);
      toast.success("Produkt gespeichert");
    },
    onError: (error: Error) => {
      toast.error("Produkt konnte nicht gespeichert werden", {
        description: error.message,
      });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      return jsonOrThrow<{ ok: boolean }>(response);
    },
    onSuccess: () => {
      invalidateProductQueries(queryClient);
      toast.success("Produkt gelöscht");
    },
    onError: (error: Error) => {
      toast.error("Produkt konnte nicht gelöscht werden", {
        description: error.message,
      });
    },
  });
}

// --- Stats ---

export function useAdminStats(enabled: boolean) {
  return useQuery({
    queryKey: ["admin-stats"],
    enabled,
    queryFn: async () => {
      const response = await fetch("/api/admin/stats");
      const data = await jsonOrThrow<{ stats: ShopStats }>(response);
      return data.stats;
    },
  });
}
