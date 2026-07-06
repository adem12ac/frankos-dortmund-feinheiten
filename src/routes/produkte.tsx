import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { useShopifyProducts } from "@/hooks/use-shopify-products";
import { ProductCard } from "@/components/featured-products";

export const Route = createFileRoute("/produkte")({
  component: ProduktePage,
  head: () => ({
    meta: [
      { title: "Produkte — Frankos Balkan Food Dortmund" },
      {
        name: "description",
        content:
          "Entdecken Sie unser Sortiment an Balkan-Spezialitäten: Pršuta, Sudžuk, Ajvar, eingelegtes Gemüse, Snacks und mehr. Jetzt bei Frankos in Dortmund bestellen.",
      },
      { property: "og:title", content: "Produkte — Frankos Balkan Food" },
      { property: "og:description", content: "Unser komplettes Balkan-Sortiment im Überblick." },
      { property: "og:url", content: "/produkte" },
    ],
    links: [{ rel: "canonical", href: "/produkte" }],
  }),
});

function ProduktePage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("alle");
  const { data: products, isLoading, isError } = useShopifyProducts(100);

  // Derive categories dynamically from productType/tags returned by Shopify.
  const categories = useMemo(() => {
    const set = new Map<string, string>();
    (products ?? []).forEach((p) => {
      const t = p.node.productType?.trim();
      if (t) set.set(t.toLowerCase(), t);
    });
    return Array.from(set.entries()).map(([id, label]) => ({ id, label }));
  }, [products]);

  const filtered = (products ?? []).filter((p) => {
    const n = p.node;
    const matchesQ =
      n.title.toLowerCase().includes(q.toLowerCase()) ||
      (n.description ?? "").toLowerCase().includes(q.toLowerCase());
    const matchesCat =
      cat === "alle" || (n.productType ?? "").toLowerCase() === cat;
    return matchesQ && matchesCat;
  });

  return (
    <>
      <section className="border-b border-border/60 bg-[color:var(--brand-cream)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-secondary">Sortiment</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-foreground sm:text-5xl">Unsere Produkte</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Handverlesene Spezialitäten aus dem Balkan – direkt in Ihren Warenkorb. Für eine Bestellung kontaktieren
            Sie uns bequem per WhatsApp oder Formular.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Produkt suchen..."
                aria-label="Produkte durchsuchen"
                className="w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none ring-primary focus:ring-2"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <FilterChip active={cat === "alle"} onClick={() => setCat("alle")}>Alle</FilterChip>
              {categories.map((c) => (
                <FilterChip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
                  {c.label}
                </FilterChip>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <p className="py-16 text-center text-muted-foreground">
            Produkte konnten nicht geladen werden. Bitte später erneut versuchen.
          </p>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            Keine Produkte gefunden. Passen Sie Suche oder Kategorie an.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.node.id} product={p} />
            ))}
          </div>
        )}

        <div className="mt-16 rounded-3xl border border-border bg-card p-8 text-center sm:p-12">
          <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Ihr Produkt nicht dabei?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Wir führen weit über 200 Produkte im Ladengeschäft. Fragen Sie uns gerne nach Ihrer Balkan-Spezialität!
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/kontakt"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Anfrage senden
            </Link>
            <a
              href="https://wa.me/491741696161"
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Per WhatsApp fragen
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}