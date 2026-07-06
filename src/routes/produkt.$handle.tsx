import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Loader2, ShoppingCart, Check } from "lucide-react";
import {
  PRODUCT_BY_HANDLE_QUERY,
  formatPrice,
  storefrontApiRequest,
} from "@/lib/shopify";
import { useCartStore } from "@/stores/cart-store";

export const Route = createFileRoute("/produkt/$handle")({
  component: ProductPage,
  head: ({ params }) => ({
    meta: [
      { title: `Produkt: ${params.handle} — Frankos Balkan Food` },
      { name: "description", content: `Details und Bestellung für ${params.handle} bei Frankos Balkan Food Dortmund.` },
      { property: "og:url", content: `/produkt/${params.handle}` },
    ],
    links: [{ rel: "canonical", href: `/produkt/${params.handle}` }],
  }),
});

function ProductPage() {
  const { handle } = Route.useParams();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const isCartLoading = useCartStore((s) => s.isLoading);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["shopify-product", handle],
    queryFn: async () => {
      const res = await storefrontApiRequest<any>(PRODUCT_BY_HANDLE_QUERY, { handle });
      return res?.data?.product ?? null;
    },
    staleTime: 60_000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Produkt nicht gefunden</h1>
        <p className="mt-3 text-muted-foreground">Dieses Produkt existiert nicht mehr oder ist derzeit nicht verfügbar.</p>
        <Link to="/produkte" className="mt-6 inline-flex items-center gap-2 text-primary">
          <ArrowLeft className="h-4 w-4" /> Zurück zum Shop
        </Link>
      </div>
    );
  }

  const variants = data.variants.edges.map((e: any) => e.node);
  const currentVariant =
    variants.find((v: any) => v.id === selectedVariantId) ?? variants[0];
  const images = data.images.edges.map((e: any) => e.node);
  const price = currentVariant.price;

  const handleAdd = async () => {
    await addItem({
      product: { node: data },
      variantId: currentVariant.id,
      variantTitle: currentVariant.title,
      price: currentVariant.price,
      quantity: 1,
      selectedOptions: currentVariant.selectedOptions ?? [],
    });
    toast.success("Zum Warenkorb hinzugefügt", { description: data.title });
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
          {images[0] && (
            <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-muted">
              <img
                src={images[0].url}
                alt={images[0].altText ?? data.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.slice(1, 5).map((img: any, i: number) => (
                <div key={i} className="aspect-square overflow-hidden rounded-lg border border-border bg-muted">
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">{data.title}</h1>
          <p className="mt-4 font-display text-3xl font-bold text-primary">
            {formatPrice(price.amount, price.currencyCode)}
          </p>
          <div
            className="prose prose-sm mt-6 max-w-none text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: data.descriptionHtml ?? "" }}
          />

          {variants.length > 1 && (
            <div className="mt-6">
              <div className="text-sm font-semibold text-foreground">Variante</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {variants.map((v: any) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantId(v.id)}
                    disabled={!v.availableForSale}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition ${
                      currentVariant.id === v.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:border-primary/40"
                    } disabled:opacity-40`}
                  >
                    {currentVariant.id === v.id && <Check className="h-3 w-3" />}
                    {v.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleAdd}
            disabled={isCartLoading || !currentVariant?.availableForSale}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-lg transition hover:bg-primary/90 disabled:opacity-50 sm:w-auto"
          >
            {isCartLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ShoppingCart className="h-5 w-5" />
            )}
            {currentVariant?.availableForSale === false ? "Ausverkauft" : "In den Warenkorb"}
          </button>

          <div className="mt-8 space-y-2 border-t border-border pt-6 text-sm text-muted-foreground">
            <p>✓ Sicheres Checkout über Shopify</p>
            <p>✓ Versand in ganz Deutschland (außer Bayern &amp; BW)</p>
            <p>✓ Fragen? Kontakt per WhatsApp: +49 174 1696161</p>
          </div>
        </div>
      </div>
    </div>
  );
}