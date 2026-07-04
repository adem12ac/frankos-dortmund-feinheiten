import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/datenschutz")({
  component: Datenschutz,
  head: () => ({
    meta: [
      { title: "Datenschutzerklärung — Frankos Balkan Food" },
      { name: "description", content: "Datenschutzerklärung der Frankos GmbH gemäß DSGVO." },
      { name: "robots", content: "noindex" },
      { property: "og:url", content: "/datenschutz" },
    ],
    links: [{ rel: "canonical", href: "/datenschutz" }],
  }),
});

function Datenschutz() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-bold text-foreground">Datenschutzerklärung</h1>
      <div className="mt-8 space-y-6 text-foreground/90">
        <section>
          <h2 className="font-display text-xl font-bold">1. Verantwortlicher</h2>
          <p className="mt-2">
            Frankos GmbH, Arnoldstraße 4, 44147 Dortmund. Kontakt:{" "}
            <a className="text-primary hover:underline break-all" href="mailto:bardhyl.saliaj@frankos-gmbh.de">
              bardhyl.saliaj@frankos-gmbh.de
            </a>.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold">2. Erhebung personenbezogener Daten</h2>
          <p className="mt-2">
            Beim Besuch dieser Website werden automatisch Informationen an unseren Server gesendet (z. B. IP-Adresse, Datum/Uhrzeit, aufgerufene Seiten). Diese Daten werden ausschließlich zur Sicherstellung des Betriebs und zur Verbesserung unseres Angebots verwendet.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold">3. Kontaktformular</h2>
          <p className="mt-2">
            Wenn Sie uns über das Kontaktformular oder per E-Mail Anfragen zukommen lassen, werden Ihre Angaben zur Bearbeitung der Anfrage bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold">4. Google Maps</h2>
          <p className="mt-2">
            Auf unserer Kontaktseite nutzen wir Google Maps, um unseren Standort anzuzeigen. Anbieter ist Google Ireland Limited. Beim Aufruf der Seite werden Daten an Google übertragen.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold">5. Ihre Rechte</h2>
          <p className="mt-2">
            Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft, Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten.
          </p>
        </section>
      </div>
    </article>
  );
}