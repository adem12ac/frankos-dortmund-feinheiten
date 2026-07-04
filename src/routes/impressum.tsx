import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/impressum")({
  component: Impressum,
  head: () => ({
    meta: [
      { title: "Impressum — Frankos Balkan Food" },
      { name: "description", content: "Impressum und Anbieterkennzeichnung der Frankos GmbH, Dortmund." },
      { name: "robots", content: "noindex" },
      { property: "og:url", content: "/impressum" },
    ],
    links: [{ rel: "canonical", href: "/impressum" }],
  }),
});

function Impressum() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-bold text-foreground">Impressum</h1>
      <div className="mt-8 space-y-8 text-foreground/90">
        <section>
          <h2 className="font-display text-xl font-bold">Angaben gemäß § 5 TMG</h2>
          <p className="mt-2">
            Frankos GmbH<br />
            Arnoldstraße 4<br />
            44147 Dortmund<br />
            Deutschland
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold">Vertreten durch</h2>
          <p className="mt-2">Bardhyl Saliaj (Geschäftsführer)</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold">Kontakt</h2>
          <p className="mt-2">
            Telefon: <a className="text-primary hover:underline" href="tel:+491741696161">+49 174 1696161</a><br />
            E-Mail:{" "}
            <a className="text-primary hover:underline break-all" href="mailto:bardhyl.saliaj@frankos-gmbh.de">
              bardhyl.saliaj@frankos-gmbh.de
            </a>
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold">Handelsregister</h2>
          <p className="mt-2">
            Registergericht: Amtsgericht Dortmund<br />
            Registernummer: HRB [bitte ergänzen]<br />
            Umsatzsteuer-ID gemäß § 27 a UStG: [bitte ergänzen]
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <p className="mt-2">Bardhyl Saliaj, Arnoldstraße 4, 44147 Dortmund</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold">Streitschlichtung</h2>
          <p className="mt-2">
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
            <a className="text-primary hover:underline" href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
              https://ec.europa.eu/consumers/odr
            </a>. Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold">Haftung für Inhalte</h2>
          <p className="mt-2">
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.
          </p>
        </section>
      </div>
    </article>
  );
}