import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Facebook, MessageCircle, Send, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/kontakt")({
  component: KontaktPage,
  head: () => ({
    meta: [
      { title: "Kontakt — Frankos Balkan Food Dortmund" },
      {
        name: "description",
        content:
          "Kontaktieren Sie Frankos GmbH in Dortmund: Arnoldstraße 4, 44147 Dortmund. Telefon, WhatsApp, E-Mail oder Kontaktformular.",
      },
      { property: "og:title", content: "Kontakt — Frankos Balkan Food" },
      { property: "og:url", content: "/kontakt" },
    ],
    links: [{ rel: "canonical", href: "/kontakt" }],
  }),
});

function KontaktPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "Bestellung", message: "" });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = encodeURIComponent(
      `Name: ${form.name}\nE-Mail: ${form.email}\nTelefon: ${form.phone}\n\n${form.message}`
    );
    const subject = encodeURIComponent(`[${form.subject}] Anfrage über Website`);
    window.location.href = `mailto:bardhyl.saliaj@frankos-gmbh.de?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <>
      <section className="border-b border-border/60 bg-[color:var(--brand-cream)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-secondary">Kontakt</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-foreground sm:text-5xl">
            Wir freuen uns auf Ihre Nachricht
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Ob Bestellung, Beratung oder Feedback – wir sind für Sie da. Rufen Sie uns an, schreiben Sie uns per
            WhatsApp oder nutzen Sie das Formular.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:px-8">
        {/* Info */}
        <div className="space-y-6">
          <InfoCard icon={MapPin} title="Adresse">
            Arnoldstraße 4<br />44147 Dortmund<br />Deutschland
          </InfoCard>
          <InfoCard icon={Phone} title="Telefon">
            <a href="tel:+491741696161" className="hover:text-primary">+49 174 1696161</a>
            <br />
            <span className="text-sm text-muted-foreground">0174 1696161</span>
          </InfoCard>
          <InfoCard icon={Mail} title="E-Mail">
            <a href="mailto:bardhyl.saliaj@frankos-gmbh.de" className="break-all hover:text-primary">
              bardhyl.saliaj@frankos-gmbh.de
            </a>
          </InfoCard>
          <InfoCard icon={Clock} title="Öffnungszeiten">
            Mo – Sa: 08:00 – 20:00 Uhr<br />So: geschlossen
          </InfoCard>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://wa.me/491741696161"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--whatsapp)] px-5 py-3 text-sm font-semibold text-white hover:brightness-110"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp Chat
            </a>
            <a
              href="https://www.facebook.com/FRANKOSGmbH/?locale=de_DE"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#1877F2] px-5 py-3 text-sm font-semibold text-white hover:brightness-110"
            >
              <Facebook className="h-4 w-4" /> Facebook
            </a>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8">
          {sent ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <CheckCircle2 className="h-12 w-12 text-[color:var(--whatsapp)]" />
              <h2 className="font-display text-2xl font-bold text-foreground">Danke!</h2>
              <p className="text-muted-foreground">
                Ihre E-Mail-App sollte sich öffnen. Wir melden uns schnellstmöglich zurück.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-foreground">Kontaktformular</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" required>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 outline-none ring-primary focus:ring-2"
                  />
                </Field>
                <Field label="E-Mail" required>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 outline-none ring-primary focus:ring-2"
                  />
                </Field>
                <Field label="Telefon">
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 outline-none ring-primary focus:ring-2"
                  />
                </Field>
                <Field label="Anliegen">
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 outline-none ring-primary focus:ring-2"
                  >
                    <option>Bestellung</option>
                    <option>Produktanfrage</option>
                    <option>Feedback</option>
                    <option>Sonstiges</option>
                  </select>
                </Field>
              </div>
              <Field label="Nachricht" required>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 outline-none ring-primary focus:ring-2"
                />
              </Field>
              <p className="text-xs text-muted-foreground">
                Mit dem Absenden akzeptieren Sie unsere Datenschutzerklärung.
              </p>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <Send className="h-4 w-4" /> Nachricht senden
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Map */}
      <section className="border-t border-border/60">
        <iframe
          title="Standort Frankos GmbH auf Google Maps"
          src="https://www.google.com/maps?q=Arnoldstra%C3%9Fe+4,+44147+Dortmund&output=embed"
          className="h-[400px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  );
}

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="font-semibold text-foreground">{title}</div>
        <div className="mt-1 text-sm text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label} {required && <span className="text-primary">*</span>}
      </span>
      {children}
    </label>
  );
}