// Embeds Google Maps via the free, key-less Maps Embed (place) mode.
// No API key required — this is Google's public iframe embed endpoint.
const MAPS_EMBED_SRC =
  "https://www.google.com/maps?q=Frankos+Balkan+Food,+Arnoldstra%C3%9Fe+4,+44147+Dortmund&output=embed";
const MAPS_DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=Frankos+Balkan+Food+Arnoldstra%C3%9Fe+4+44147+Dortmund";

export function LocationMap() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-secondary">Standort</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
            So finden Sie uns
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Arnoldstraße 4, 44147 Dortmund — mitten in Dortmund, gut erreichbar mit Auto und ÖPNV.
          </p>
        </div>
        <a
          href={MAPS_DIRECTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:bg-muted"
        >
          Route planen
        </a>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-warm)]">
        <iframe
          src={MAPS_EMBED_SRC}
          title="Frankos Balkan Food Standort auf Google Maps"
          className="h-[420px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}
