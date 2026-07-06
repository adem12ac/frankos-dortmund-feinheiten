import { Truck, MapPin, Package, ShieldCheck } from "lucide-react";

export function DeliveryInfo() {
  return (
    <section id="lieferung" className="border-y border-border/60 bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-secondary">
              Versand &amp; Lieferung
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
              Deutschlandweiter Versand — direkt von Frankos zu Ihnen
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Wir liefern unsere Balkan-Spezialitäten mit eigenem Versand in ganz Deutschland
              — mit einer Ausnahme: Süddeutschland (Bayern &amp; Baden-Württemberg) beliefern wir
              aktuell nicht.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              <Feature icon={Truck} title="Eigene Lieferung">Frisch und gekühlt verpackt</Feature>
              <Feature icon={Package} title="Sichere Verpackung">Speziell für Lebensmittel</Feature>
              <Feature icon={ShieldCheck} title="Frische garantiert">Kühlkette lückenlos</Feature>
              <Feature icon={MapPin} title="In ganz Deutschland">Außer Bayern &amp; BW</Feature>
            </ul>
            <p className="mt-6 rounded-2xl border border-border bg-background/60 p-4 text-sm text-muted-foreground">
              <strong className="text-foreground">Hinweis:</strong> Bestellungen aus Bayern
              oder Baden-Württemberg können aktuell nicht ausgeliefert werden. Für persönliche
              Abholung besuchen Sie uns gerne in Dortmund.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-8">
            <div className="mx-auto max-w-sm">
              <GermanyMap />
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs">
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-primary" /> Lieferung möglich
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-muted-foreground/40" /> Keine Lieferung
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3 rounded-xl border border-border bg-background/60 p-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <div className="text-xs text-muted-foreground">{children}</div>
      </div>
    </li>
  );
}

function GermanyMap() {
  return (
    <svg viewBox="0 0 300 400" className="h-auto w-full" role="img" aria-label="Karte Deutschland Lieferzone">
      <path
        d="M110 20 C140 15 170 20 200 30 L230 50 L250 90 L245 130 L260 160 L250 200 L230 230 L210 250 L190 260 L170 260 L150 250 L130 240 L110 235 L90 220 L70 200 L60 170 L55 140 L65 110 L80 80 L95 50 Z"
        className="fill-primary/80 stroke-primary"
        strokeWidth="2"
      />
      <path
        d="M110 235 L130 240 L150 250 L170 260 L190 260 L210 250 L215 275 L225 300 L215 330 L195 355 L165 370 L135 375 L110 365 L90 340 L80 310 L85 275 L95 250 Z"
        className="fill-muted-foreground/30 stroke-muted-foreground/60"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <circle cx="105" cy="145" r="6" className="fill-accent stroke-primary" strokeWidth="2" />
      <text x="115" y="150" className="fill-foreground text-[11px] font-semibold">Dortmund</text>
      <text x="130" y="315" className="fill-muted-foreground text-[10px] font-medium">Süddeutschland: keine Lieferung</text>
    </svg>
  );
}