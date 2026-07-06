import { Link } from "@tanstack/react-router";
import { ArrowRight, Loader2, ShoppingCart } from "lucide-react";
import { useShopifyProducts } from "@/hooks/use-shopify-products";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";

export function FeaturedProducts() {
  const { data: products, isLoading, isError } = useShopifyProducts(4);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-secondary">
            Beliebt
          </p>
          <h2 className="mt-2 font-display text-4xl font-bold text-foreground sm:text-5xl">
            Unsere Bestseller
          </h2>
        </div>
        <Link
          to="/produkte"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
        >
          Alle Produkte <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-10 flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : isError || !products || products.length === 0 ? (
        <p className="mt-10 py-16 text-center text-muted-foreground">
          Aktuell sind keine Produkte verfügbar.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.node.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const variant = product.node.variants.edges[0]?.node;
  const image = product.node.images.edges[0]?.node;
  const price = product.node.priceRange.minVariantPrice;

  const handleAdd = async () => {
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions ?? [],
    });
    toast.success("Zum Warenkorb hinzugefügt", { description: product.node.title });
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-[var(--shadow-warm)]">
      <Link
        to="/produkt/$handle"
        params={{ handle: product.node.handle }}
        className="relative block aspect-square overflow-hidden bg-muted"
      >
        {image ? (
          <img
            src={image.url}
            alt={image.altText ?? product.node.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            Kein Bild
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <Link
          to="/produkt/$handle"
          params={{ handle: product.node.handle }}
          className="font-display text-lg font-bold text-foreground hover:text-primary"
        >
          {product.node.title}
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {product.node.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="font-display text-xl font-bold text-primary">
            {formatPrice(price.amount, price.currencyCode)}
          </span>
          <button
            type="button"
            onClick={handleAdd}
            disabled={isLoading || !variant?.availableForSale}
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-xs font-semibold text-secondary-foreground transition hover:bg-secondary/90 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ShoppingCart className="h-3.5 w-3.5" />
            )}
            {variant?.availableForSale === false ? "Ausverkauft" : "In den Warenkorb"}
          </button>
        </div>
      </div>
    </article>
  );
}