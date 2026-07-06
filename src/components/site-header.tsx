import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, ShoppingBag } from "lucide-react";
import logoAsset from "@/assets/frankos-logo.jpg.asset.json";
import { CartDrawer } from "@/components/cart-drawer";
import { InstagramIcon, TikTokIcon } from "@/components/social-icons";

const nav = [
  { to: "/", label: "Startseite" },
  { to: "/produkte", label: "Produkte" },
  { to: "/ueber-uns", label: "Über uns" },
  { to: "/kontakt", label: "Kontakt" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img
            src={logoAsset.url}
            alt="Frankos Balkan Food Logo"
            className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20"
            width={48}
            height={48}
          />
          <div className="leading-tight">
            <div className="font-display text-lg font-bold text-primary">FRANKOS</div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-secondary">
              Balkan Food
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://www.instagram.com/frankos_gmbh"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-foreground/70 transition hover:bg-muted hover:text-primary sm:inline-flex"
          >
            <InstagramIcon className="h-4 w-4" />
          </a>
          <a
            href="https://www.tiktok.com/@frankos_gmbh"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-foreground/70 transition hover:bg-muted hover:text-primary sm:inline-flex"
          >
            <TikTokIcon className="h-4 w-4" />
          </a>
          <CartDrawer />
          <Link
            to="/produkte"
            className="hidden items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 md:inline-flex"
          >
            <ShoppingBag className="h-4 w-4" /> Shop
          </Link>
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-base font-medium text-foreground/80 hover:bg-muted hover:text-primary"
                activeProps={{ className: "text-primary bg-muted" }}
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/produkte"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              <ShoppingBag className="h-4 w-4" /> Jetzt bestellen
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}