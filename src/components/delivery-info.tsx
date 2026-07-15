import {
  Truck,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingCart,
  PackageCheck,
  Home,
} from "lucide-react";

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
              Wir liefern unsere Balkan-Spezialitäten mit eigenem Versand in ganz Deutschland — mit
              einer Ausnahme: Süddeutschland (Bayern &amp; Baden-Württemberg) beliefern wir aktuell
              nicht.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              <Feature icon={Truck} title="Eigene Lieferung">
                Frisch und gekühlt verpackt
              </Feature>
              <Feature icon={Package} title="Sichere Verpackung">
                Speziell für Lebensmittel
              </Feature>
              <Feature icon={ShieldCheck} title="Frische garantiert">
                Kühlkette lückenlos
              </Feature>
              <Feature icon={MapPin} title="In ganz Deutschland">
                Außer Bayern &amp; BW
              </Feature>
            </ul>
            <p className="mt-6 rounded-2xl border border-border bg-background/60 p-4 text-sm text-muted-foreground">
              <strong className="text-foreground">Hinweis:</strong> Bestellungen aus Bayern oder
              Baden-Württemberg können aktuell nicht ausgeliefert werden. Für persönliche Abholung
              besuchen Sie uns gerne in Dortmund.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-8">
            <p className="text-center text-sm font-semibold uppercase tracking-widest text-secondary">
              So läuft Ihre Lieferung ab
            </p>

            <ol className="mt-8 space-y-0">
              <DeliveryStep
                icon={ShoppingCart}
                step={1}
                title="Warenkorb"
                description="Produkte auswählen und sicher bei Stripe bezahlen"
                isLast={false}
              />
              <DeliveryStep
                icon={PackageCheck}
                step={2}
                title="Frisch verpackt"
                description="Wir verpacken Ihre Bestellung gekühlt & lebensmittelsicher"
                isLast={false}
              />
              <DeliveryStep
                icon={Home}
                step={3}
                title="Geliefert"
                description="Ankunft direkt an Ihrer Haustür — deutschlandweit"
                isLast
              />
            </ol>

            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-border bg-background/70 p-4">
              <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="text-sm">
                <div className="font-semibold text-foreground">Liefergebiet: ganz Deutschland</div>
                <div className="mt-0.5 text-muted-foreground">
                  Ausgenommen{" "}
                  <span className="font-medium text-foreground">
                    Bayern &amp; Baden-Württemberg
                  </span>
                </div>
              </div>
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

function DeliveryStep({
  icon: Icon,
  step,
  title,
  description,
  isLast,
}: {
  icon: React.ElementType;
  step: number;
  title: string;
  description: string;
  isLast: boolean;
}) {
  return (
    <li className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-primary bg-background text-primary shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        {!isLast && <div className="my-1 w-0.5 flex-1 bg-primary/25" />}
      </div>
      <div className={isLast ? "pb-0" : "pb-7"}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-primary">Schritt {step}</span>
        </div>
        <div className="font-display text-lg font-bold text-foreground">{title}</div>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
    </li>
  );
}
