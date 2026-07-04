import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Users, Sprout, Globe2 } from "lucide-react";
import heroAsset from "@/assets/frankos-hero.jpg.asset.json";
import shelfAsset from "@/assets/store-shelf.jpg.asset.json";

export const Route = createFileRoute("/ueber-uns")({
  component: UeberUns,
  head: () => ({
    meta: [
      { title: "Über uns — Frankos Balkan Food Dortmund" },
      {
        name: "description",
        content:
          "Lernen Sie Frankos GmbH kennen: Ihr Balkan-Spezialitätengeschäft in Dortmund. Unsere Geschichte, unsere Werte, unser Sortiment.",
      },
      { property: "og:title", content: "Über uns — Frankos Balkan Food" },
      { property: "og:url", content: "/ueber-uns" },
      { property: "og:image", content: shelfAsset.url },
    ],
    links: [{ rel: "canonical", href: "/ueber-uns" }],
  }),
});

const values = [
  { icon: Heart, title: "Leidenschaft", text: "Wir lieben, was wir tun – und das schmeckt man." },
  { icon: Sprout, title: "Herkunft", text: "Direkter Import von Familienbetrieben aus dem Balkan." },
  { icon: Users, title: "Gemeinschaft", text: "Ein Treffpunkt für Balkan-Freunde in Dortmund." },
  { icon: Globe2, title: "Tradition", text: "Rezepte, die seit Generationen weitergegeben werden." },
];

function UeberUns() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroAsset.url} alt="" className="h-full w-full object-cover" aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-black/70" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">Über uns</p>
          <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Balkan-Kultur, mit Herz nach Dortmund gebracht.
          </h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:px-8">
        <div className="prose max-w-none text-lg leading-relaxed text-muted-foreground">
          <p>
            Die <strong className="text-foreground">Frankos GmbH</strong> steht seit über einem Jahrzehnt für ehrliche
            Balkan-Küche mitten in Dortmund. Was als kleines Fachgeschäft begann, ist heute die erste Adresse für alle,
            die Spezialitäten aus Montenegro, Serbien, Kroatien, Bosnien und Albanien lieben.
          </p>
          <p className="mt-4">
            Unsere Kunden kommen aus ganz Nordrhein-Westfalen – nicht nur wegen unseres breiten Sortiments, sondern
            auch wegen der freundlichen, familiären Atmosphäre in unserem Laden an der Arnoldstraße.
          </p>
          <p className="mt-4">
            Wir arbeiten direkt mit ausgewählten Herstellern und kleinen Familienbetrieben zusammen. So können wir
            garantieren: Qualität, die man schmeckt, und Preise, die fair bleiben.
          </p>
        </div>
        <div className="relative">
          <img
            src={shelfAsset.url}
            alt="Blick in das Frankos Ladengeschäft"
            className="rounded-3xl object-cover shadow-[var(--shadow-warm)]"
            loading="lazy"
          />
        </div>
      </section>

      <section className="bg-[color:var(--brand-cream)]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-secondary">Was uns antreibt</p>
            <h2 className="mt-2 font-display text-4xl font-bold text-foreground sm:text-5xl">Unsere Werte</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-6">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
          Besuchen Sie uns – wir freuen uns auf Sie.
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Arnoldstraße 4, 44147 Dortmund. Wir beraten Sie gerne persönlich.
        </p>
        <Link
          to="/kontakt"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Zum Kontakt
        </Link>
      </section>
    </>
  );
}