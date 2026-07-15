import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Truck, Leaf, Award, Clock, MapPin, Phone } from "lucide-react";
import heroAsset from "@/assets/frankos-hero.jpg.asset.json";
import shelfAsset from "@/assets/store-shelf.jpg.asset.json";
import prsutaAsset from "@/assets/prsuta-slices.jpg.asset.json";
import { categories } from "@/lib/products";
import { DeliveryInfo } from "@/components/delivery-info";
import { GoogleReviews } from "@/components/google-reviews";
import { FeaturedProducts } from "@/components/featured-products";
import { LocationMap } from "@/components/location-map";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Frankos Balkan Food — Balkan Spezialitäten aus Dortmund" },
      {
        name: "description",
        content:
          "Willkommen bei Frankos GmbH in Dortmund. Authentische Balkan-Spezialitäten: Pršuta, Ajvar, eingelegtes Gemüse und mehr. Jetzt online bestellen oder im Laden vorbeikommen.",
      },
      { property: "og:url", content: "/" },
      { property: "og:image", content: heroAsset.url },
      { name: "twitter:image", content: heroAsset.url },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "GroceryStore",
          name: "Frankos Balkan Food",
          image: heroAsset.url,
          address: {
            "@type": "PostalAddress",
            streetAddress: "Arnoldstraße 4",
            postalCode: "44147",
            addressLocality: "Dortmund",
            addressCountry: "DE",
          },
          telephone: "+491741696161",
          email: "bardhyl.saliaj@frankos-gmbh.de",
          sameAs: ["https://www.facebook.com/FRANKOSGmbH/?locale=de_DE"],
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <video
            className="h-full w-full object-cover"
            src="/videos/hero.mp4"
            poster={heroAsset.url}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          >
            {/* Fällt automatisch auf das poster-Bild zurück, falls Video
                nicht abgespielt werden kann (z. B. sehr alte Browser). */}
            <img
              src={heroAsset.url}
              alt="Balkan Spezialitäten von Frankos"
              className="h-full w-full object-cover"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="max-w-2xl fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/95 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
              <span>★</span> Seit über 10 Jahren in Dortmund
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
              Der Geschmack des <span className="text-accent">Balkans</span>
              <span className="block font-script text-4xl font-normal text-accent sm:text-5xl">
                — mitten in Dortmund
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/90">
              Bei <strong>Frankos GmbH</strong> finden Sie authentische Spezialitäten aus
              Montenegro, Serbien, Kroatien und Albanien. Frisch, ehrlich und mit Liebe ausgewählt.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/produkte"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-lg transition hover:bg-primary/90"
              >
                Produkte entdecken <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/kontakt"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                <Phone className="h-4 w-4" /> Kontakt aufnehmen
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* USPs */}
      <section className="border-b border-border/60 bg-card">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { icon: Leaf, title: "Authentisch", text: "Direkt vom Balkan importiert" },
            { icon: Award, title: "Beste Qualität", text: "Sorgfältig ausgewählt" },
            { icon: Truck, title: "Schnelle Lieferung", text: "In & um Dortmund" },
            { icon: Clock, title: "Frisch täglich", text: "6 Tage die Woche geöffnet" },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-foreground">{title}</div>
                <div className="text-sm text-muted-foreground">{text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-secondary">
            Unser Sortiment
          </p>
          <h2 className="mt-2 font-display text-4xl font-bold text-foreground sm:text-5xl">
            Balkan-Spezialitäten für jeden Anlass
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Von hausgemachtem Ajvar bis luftgetrocknetem Pršuta – entdecken Sie unsere sorgfältig
            kuratierte Auswahl.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/produkte"
              hash={c.id}
              className="group relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card to-muted p-8 transition hover:-translate-y-1 hover:shadow-[var(--shadow-warm)]"
            >
              <div className="text-5xl">{c.emoji}</div>
              <h3 className="mt-4 font-display text-xl font-bold text-foreground">{c.label}</h3>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Ansehen <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="bg-[color:var(--brand-cream)]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="fade-up">
            <p className="text-sm font-semibold uppercase tracking-widest text-secondary">
              Unsere Geschichte
            </p>
            <h2 className="mt-2 font-display text-4xl font-bold text-foreground sm:text-5xl">
              Ein Stück Heimat in jedem Bissen
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Frankos wurde mit einer einfachen Vision gegründet: Menschen in Dortmund und Umgebung
              Zugang zu den echten Geschmäckern des Balkans zu geben. Wir arbeiten direkt mit
              kleinen Familienbetrieben aus Montenegro, Serbien und Albanien zusammen.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Jedes Produkt in unserem Sortiment wird persönlich ausgewählt – nach traditionellen
              Rezepten, handwerklich hergestellt und ohne unnötige Zusätze.
            </p>
            <Link
              to="/ueber-uns"
              className="mt-8 inline-flex items-center gap-2 text-base font-semibold text-primary hover:text-primary/80"
            >
              Mehr über uns erfahren <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative">
            <img
              src={shelfAsset.url}
              alt="Regale voller Balkan-Spezialitäten im Frankos Ladengeschäft"
              className="rounded-3xl object-cover shadow-[var(--shadow-warm)]"
              loading="lazy"
            />
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-card p-5 shadow-lg sm:block">
              <div className="font-display text-3xl font-bold text-primary">200+</div>
              <div className="text-sm text-muted-foreground">Balkan-Produkte im Sortiment</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <FeaturedProducts />

      {/* DELIVERY */}
      <DeliveryInfo />

      {/* GOOGLE REVIEWS */}
      <GoogleReviews />

      {/* CTA */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 opacity-15">
          <img src={prsutaAsset.url} alt="" className="h-full w-full object-cover" aria-hidden />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
          <div>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Besuchen Sie uns in Dortmund
            </h2>
            <p className="mt-3 max-w-2xl text-lg text-white/85">
              Kommen Sie vorbei, probieren Sie unsere Spezialitäten und lassen Sie sich beraten. Wir
              freuen uns auf Sie!
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-5 text-sm">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Arnoldstraße 4, 44147 Dortmund</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+49 174 1696161</span>
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://wa.me/491741696161"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-primary transition hover:bg-white/90"
            >
              WhatsApp Bestellung
            </a>
            <Link
              to="/kontakt"
              className="inline-flex items-center gap-2 rounded-full border border-white/50 px-6 py-3 font-semibold text-white hover:bg-white/10"
            >
              Kontaktformular
            </Link>
          </div>
        </div>
      </section>

      {/* STANDORT */}
      <LocationMap />
    </>
  );
}
