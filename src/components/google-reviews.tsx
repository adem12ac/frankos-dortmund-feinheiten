import { Star, ExternalLink } from "lucide-react";

const GOOGLE_MAPS_REVIEW_URL =
  "https://www.google.com/maps/search/?api=1&query=Frankos+Balkan+Food+Arnoldstra%C3%9Fe+4+Dortmund";

export function GoogleReviews() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-secondary">Bewertungen</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
            Was unsere Kunden sagen
          </h2>
          <p className="mt-3 text-muted-foreground">
            Lesen Sie echte Google-Rezensionen über Frankos Balkan Food oder hinterlassen Sie
            selbst eine Bewertung.
          </p>
        </div>
        <a
          href={GOOGLE_MAPS_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:bg-muted"
        >
          <GoogleIcon /> Auf Google ansehen <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="mt-10 rounded-3xl border border-dashed border-border bg-card p-10 text-center">
        <div className="flex items-center justify-center gap-1 text-accent">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-6 w-6" fill="none" />
          ))}
        </div>
        <p className="mt-4 text-muted-foreground">
          Aktuelle Rezensionen finden Sie direkt auf unserem Google-Profil.
        </p>
        <a
          href={GOOGLE_MAPS_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          Rezensionen auf Google Maps ansehen <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </section>
  );
}

export function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.24 1.06-3.72 1.06-2.86 0-5.28-1.93-6.14-4.52H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.86 14.12A6.6 6.6 0 0 1 5.5 12c0-.74.13-1.46.36-2.12V7.04H2.18A11 11 0 0 0 1 12c0 1.78.42 3.46 1.18 4.96l3.68-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.2 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.04l3.68 2.84C6.72 7.31 9.14 5.38 12 5.38Z" />
    </svg>
  );
}