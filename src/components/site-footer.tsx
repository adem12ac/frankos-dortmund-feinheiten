import { Link } from "@tanstack/react-router";
import { Facebook, Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import logoImg from "@/assets/img/frankos-logo.jpg";
import { InstagramIcon, TikTokIcon } from "@/components/social-icons";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-[oklch(0.22_0.03_40)] text-[oklch(0.94_0.02_75)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="Frankos Logo"
              className="h-14 w-14 rounded-full"
              width={56}
              height={56}
            />
            <div>
              <div className="font-display text-xl font-bold text-white">FRANKOS</div>
              <div className="text-xs uppercase tracking-widest text-accent">Balkan Food</div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Ihr Fachgeschäft für authentische Balkan-Spezialitäten in Dortmund. Frisch, ehrlich und
            mit Liebe zur Heimat.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Navigation</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/" className="text-white/70 hover:text-accent">
                Startseite
              </Link>
            </li>
            <li>
              <Link to="/produkte" className="text-white/70 hover:text-accent">
                Produkte
              </Link>
            </li>
            <li>
              <Link to="/ueber-uns" className="text-white/70 hover:text-accent">
                Über uns
              </Link>
            </li>
            <li>
              <Link to="/kontakt" className="text-white/70 hover:text-accent">
                Kontakt
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Kontakt</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>
                Arnoldstraße 4<br />
                44147 Dortmund
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-accent" />
              <a href="tel:+491741696161" className="hover:text-accent">
                +49 174 1696161
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-accent" />
              <a
                href="mailto:bardhyl.saliaj@frankos-gmbh.de"
                className="break-all hover:text-accent"
              >
                bardhyl.saliaj@frankos-gmbh.de
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Folgen & Chatten
          </h3>
          <div className="mt-4 flex gap-3">
            <a
              href="https://www.facebook.com/FRANKOSGmbH/?locale=de_DE"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-accent hover:text-primary"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com/frankos_gmbh"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-accent hover:text-primary"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a
              href="https://www.tiktok.com/@frankos_gmbh"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-accent hover:text-primary"
            >
              <TikTokIcon className="h-5 w-5" />
            </a>
            <a
              href="https://wa.me/491741696161"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-[color:var(--whatsapp)] hover:text-white"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
          <div className="mt-6 space-y-1 text-xs text-white/60">
            <p>
              <strong className="text-white/80">Öffnungszeiten</strong>
            </p>
            <p>Mo – Fr: 08:00 – 20:00</p>
            <p>Sa: 08:00 – 20:00</p>
            <p>So: geschlossen</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-white/60 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Frankos GmbH. Alle Rechte vorbehalten.</p>
          <div className="flex gap-5">
            <Link to="/impressum" className="hover:text-accent">
              Impressum
            </Link>
            <Link to="/datenschutz" className="hover:text-accent">
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
