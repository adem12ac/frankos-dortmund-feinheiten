import { MapPin, ShoppingCart, PackageCheck, Home } from "lucide-react";

export function DeliveryInfo() {
  return (
    <section id="lieferung" className="border-y border-border/60 bg-card">
      <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-secondary">
          Versand &amp; Lieferung
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
          Deutschlandweiter Versand — direkt von Frankos zu Ihnen
        </h2>

        <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-8 sm:p-10">
          <ol className="grid gap-8 text-left sm:grid-cols-3 sm:gap-6">
            <DeliveryStep
              icon={ShoppingCart}
              step={1}
              title="Warenkorb"
              description="Produkte auswählen und sicher bei Stripe bezahlen"
            />
            <DeliveryStep
              icon={PackageCheck}
              step={2}
              title="Frisch verpackt"
              description="Wir verpacken Ihre Bestellung gekühlt & lebensmittelsicher"
            />
            <DeliveryStep
              icon={Home}
              step={3}
              title="Geliefert"
              description="Ankunft direkt an Ihrer Haustür — deutschlandweit"
            />
          </ol>

          <div className="mx-auto mt-8 flex max-w-md items-start gap-3 rounded-2xl border border-border bg-background/70 p-4 text-left">
            <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="text-sm">
              <div className="font-semibold text-foreground">Liefergebiet: ganz Deutschland</div>
              <div className="mt-0.5 text-muted-foreground">
                Ausgenommen{" "}
                <span className="font-medium text-foreground">Bayern &amp; Baden-Württemberg</span>{" "}
                — für persönliche Abholung besuchen Sie uns gerne in Dortmund.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DeliveryStep({
  icon: Icon,
  step,
  title,
  description,
}: {
  icon: React.ElementType;
  step: number;
  title: string;
  description: string;
}) {
  return (
    <li className="flex flex-col items-start gap-3 sm:items-center sm:text-center">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-primary bg-background text-primary shadow-sm">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <span className="text-xs font-bold text-primary">Schritt {step}</span>
        <div className="font-display text-lg font-bold text-foreground">{title}</div>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
    </li>
  );
}
