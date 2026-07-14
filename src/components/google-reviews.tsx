import { Star, ExternalLink, BadgeCheck } from "lucide-react";

const GOOGLE_MAPS_REVIEW_URL =
  "https://www.google.com/maps/search/?api=1&query=Frankos+Balkan+Food+Arnoldstra%C3%9Fe+4+Dortmund";

interface Review {
  name: string;
  meta: string;
  timeAgo: string;
  rating: number;
  text: string;
}

// Echte Google-Rezensionen von Frankos Balkan Food, manuell gepflegt.
const REVIEWS: Review[] = [
  {
    name: "Shemsi Dirks",
    meta: "7 Rezensionen",
    timeAgo: "vor einem Jahr",
    rating: 5,
    text: "Ein Besuch in diesem Laden bringt heimische Produkte zurück. Die herzliche Gastfreundschaft, Großzügigkeit und Aufrichtigkeit der Mitarbeiter wecken für einen Moment Erinnerungen an ihre Heimat. Viel Glück! Mach weiter so und bleib so, wie ich es dir heute gesagt habe! Du bist für jeden Ruhm da! Verschiedene Waren von jedem albanischen Stamm! Viel Glück, Bardhyl, und allen Freunden!",
  },
  {
    name: "Zajo",
    meta: "Local Guide · 21 Rezensionen · 3 Fotos",
    timeAgo: "vor 6 Monaten",
    rating: 5,
    text: "Ich habe heute meinen Wocheneinkauf getätigt. Bei Frankos ist die Auswahl an Produkten sehr viel größer als bei der Konkurrenz. Die Preise sind absolut fair. Ganz hervorheben möchte ich das Angebot von echtem albanischen Olivenöl. Der Inhaber ist sehr freundlich und hilfsbereit bei jeder Angelegenheit. Danke & Faleminderit!",
  },
  {
    name: "Tromb Kastrati",
    meta: "Local Guide · 19 Rezensionen · 4 Fotos",
    timeAgo: "vor 8 Monaten",
    rating: 5,
    text: "Günstiger als im Kosovo! Alle Artikel zu einem vernünftigen Preis.",
  },
];

export function GoogleReviews() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-secondary">
            Bewertungen
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
            Was unsere Kunden sagen
          </h2>
          <p className="mt-3 text-muted-foreground">
            Echte Google-Rezensionen über Frankos Balkan Food.
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

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {REVIEWS.map((review) => (
          <ReviewCard key={review.name} review={review} />
        ))}
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-accent">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4" fill={i < review.rating ? "currentColor" : "none"} />
          ))}
        </div>
        <GoogleIcon />
      </div>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">{review.text}</p>
      <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 font-semibold text-primary">
          {review.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1 truncate text-sm font-semibold text-foreground">
            {review.name}
            {review.meta.includes("Local Guide") && (
              <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-primary" aria-label="Local Guide" />
            )}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {review.meta} · {review.timeAgo}
          </div>
        </div>
      </div>
    </div>
  );
}

export function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.24 1.06-3.72 1.06-2.86 0-5.28-1.93-6.14-4.52H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.86 14.12A6.6 6.6 0 0 1 5.5 12c0-.74.13-1.46.36-2.12V7.04H2.18A11 11 0 0 0 1 12c0 1.78.42 3.46 1.18 4.96l3.68-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.2 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.04l3.68 2.84C6.72 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}
