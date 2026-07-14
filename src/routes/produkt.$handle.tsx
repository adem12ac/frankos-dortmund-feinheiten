import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft, Loader2, ShoppingCart } from "lucide-react";
import { useProduct } from "@/hooks/use-products";
import { formatPriceCents } from "@/lib/format";
import { useCartStore } from "@/stores/cart-store";

export const Route = createFileRoute("/produkt/$handle")({
  component: ProductPage,
  head: ({ params }) => ({
    meta: [
      { title: `Produkt: ${params.handle} — Frankos Balkan Food` },
      {
        name: "description",
        content: `Details und Bestellung für ${params.handle} bei Frankos Balkan Food Dortmund.`,
      },
      { property: "og:url", content: `/produkt/${params.handle}` },
    ],
    links: [{ rel: "canonical", href: `/produkt/${params.handle}` }],
  }),
});

function ProductPage() {
  const { handle } = Route.useParams();
  const addItem = useCartStore((s) => s.addItem);
  const isCartLoading = useCartStore((s) => s.isLoading);
  const { data: product, isLoading, isError } = useProduct(handle);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Produkt nicht gefunden</h1>
        <p className="mt-3 text-muted-foreground">
          Dieses Produkt existiert nicht mehr oder ist derzeit nicht verfügbar.
        </p>
        <Link to="/produkte" className="mt-6 inline-flex items-center gap-2 text-primary">
          <ArrowLeft className="h-4 w-4" /> Zurück zum Shop
        </Link>
      </div>
    );
  }

  const inStock = product.stock > 0;

  const handleAdd = () => {
    if (!inStock) return;
    addItem(product, 1);
    toast.success("Zum Warenkorb hinzugefügt", { description: product.title });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        to="/produkte"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Zurück zum Shop
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-muted">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                Kein Bild
              </div>
            )}
          </div>
        </div>

        <div>
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            {product.title}
          </h1>
          <p className="mt-4 font-display text-3xl font-bold text-primary">
            {formatPriceCents(product.priceCents, product.currency)}
          </p>
          {product.unit && <p className="mt-1 text-sm text-muted-foreground">{product.unit}</p>}
          <div className="prose prose-sm mt-6 max-w-none whitespace-pre-line text-muted-foreground">
            {product.description}
          </div>

          <button
            onClick={handleAdd}
            disabled={isCartLoading || !inStock}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-lg transition hover:bg-primary/90 disabled:opacity-50 sm:w-auto"
          >
            {isCartLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ShoppingCart className="h-5 w-5" />
            )}
            {inStock ? "In den Warenkorb" : "Ausverkauft"}
          </button>

          <div className="mt-8 space-y-2 border-t border-border pt-6 text-sm text-muted-foreground">
            <p>✓ Sicheres Checkout über Stripe</p>
            <p>✓ Versand in ganz Deutschland (außer Bayern &amp; BW)</p>
            <p>✓ Fragen? Kontakt per WhatsApp: +49 174 1696161</p>
          </div>
        </div>
      </div>
    </div>
  );
}
