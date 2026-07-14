import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { CheckCircle2, Clock, Loader2, ShoppingBag } from "lucide-react";
import { formatPriceCents } from "@/lib/format";
import { useCartStore } from "@/stores/cart-store";

interface SessionStatus {
  status: string | null;
  paymentStatus: string | null;
  customerEmail: string | null;
  amountTotalCents: number;
  currency: string;
}

export const Route = createFileRoute("/bestellung-erfolg")({
  component: OrderSuccessPage,
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: typeof search.session_id === "string" ? search.session_id : "",
  }),
  head: () => ({
    meta: [
      { title: "Bestellung erfolgreich — Frankos Balkan Food" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function OrderSuccessPage() {
  const { session_id } = Route.useSearch();
  const clearCart = useCartStore((s) => s.clearCart);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["checkout-session", session_id],
    enabled: session_id.length > 0,
    queryFn: async (): Promise<SessionStatus> => {
      const response = await fetch(
        `/api/checkout-session?session_id=${encodeURIComponent(session_id)}`,
      );
      if (!response.ok) throw new Error("Session nicht gefunden");
      return (await response.json()) as SessionStatus;
    },
  });

  const isPaid = data?.paymentStatus === "paid";
  const isComplete = data?.status === "complete";

  // Clear the cart once the checkout is confirmed as completed.
  useEffect(() => {
    if (isComplete) clearCart();
  }, [isComplete, clearCart]);

  if (!session_id || isError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Bestellung nicht gefunden</h1>
        <p className="mt-3 text-muted-foreground">
          Wir konnten diese Bestellung nicht zuordnen. Falls Sie bezahlt haben, erhalten Sie in
          Kürze eine Bestätigung per E-Mail.
        </p>
        <Link
          to="/produkte"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <ShoppingBag className="h-4 w-4" /> Zurück zum Shop
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      {isPaid ? (
        <CheckCircle2 className="mx-auto h-16 w-16 text-primary" />
      ) : (
        <Clock className="mx-auto h-16 w-16 text-secondary" />
      )}
      <h1 className="mt-6 font-display text-3xl font-bold text-foreground sm:text-4xl">
        {isPaid ? "Vielen Dank für Ihre Bestellung!" : "Zahlung wird verarbeitet"}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        {isPaid
          ? "Ihre Zahlung war erfolgreich. Wir bereiten Ihre Bestellung jetzt für den Versand vor."
          : "Ihre Zahlung wird noch verarbeitet. Sie erhalten eine Bestätigung, sobald sie abgeschlossen ist."}
      </p>
      {data && (
        <div className="mx-auto mt-8 max-w-sm rounded-2xl border border-border bg-card p-6 text-left">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Gesamtbetrag</span>
            <span className="font-semibold text-foreground">
              {formatPriceCents(data.amountTotalCents, data.currency)}
            </span>
          </div>
          {data.customerEmail && (
            <div className="mt-3 flex items-center justify-between gap-4 text-sm">
              <span className="text-muted-foreground">Bestätigung an</span>
              <span className="truncate font-medium text-foreground">{data.customerEmail}</span>
            </div>
          )}
        </div>
      )}
      <Link
        to="/produkte"
        className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
      >
        <ShoppingBag className="h-4 w-4" /> Weiter einkaufen
      </Link>
    </div>
  );
}
