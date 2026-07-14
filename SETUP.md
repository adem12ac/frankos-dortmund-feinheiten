# Setup: Stripe-Zahlungen & Admin-Dashboard

Der Shop nutzt jetzt **Supabase** als Datenbank und **Stripe Checkout** für die
Zahlungsabwicklung. Die Shopify-Anbindung wurde vollständig ersetzt.

---

## 1. Environment Variables

Alle Variablen sind **server-only** und landen nie im Browser-Bundle. Lokal in
eine `.env` eintragen (Vorlage: `.env.example`), auf Vercel unter
**Project → Settings → Environment Variables** — für *Production*, *Preview*
und *Development*.

| Variable | Woher | Zweck |
| --- | --- | --- |
| `SUPABASE_URL` | Supabase → Settings → API → Project URL | Datenbank-Endpunkt |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → `service_role` | Server-Zugriff auf die DB (geheim!) |
| `STRIPE_SECRET_KEY` | Stripe → Entwickler → API-Schlüssel | Checkout-Sessions erstellen |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Entwickler → Webhooks → Endpunkt | Webhook-Signaturen verifizieren |
| `ADMIN_PASSWORD` | selbst wählen | Login unter `/admin` |
| `ADMIN_SESSION_SECRET` | `openssl rand -base64 48` | Signiert die Admin-Session-Cookies |

> **Wichtig:** Der `service_role`-Key umgeht Row Level Security. Er darf
> ausschließlich als Environment Variable existieren — niemals im Code,
> niemals im Git-Repository.

---

## 2. Datenbank einrichten (Supabase)

1. Projekt auf [supabase.com](https://supabase.com) anlegen.
2. Im **SQL Editor** nacheinander ausführen:
   - `supabase/schema.sql` — Tabellen, Indizes, RLS, Bestellnummern-Sequenz
   - `supabase/seed.sql` — das bisherige Startsortiment (optional)
3. Bild-URLs der Produkte anschließend im Admin-Dashboard pflegen.

**Tabellen**

- `products` — Sortiment inkl. Preis (in Cent), Lagerbestand, Sichtbarkeit
- `orders` — Bestellungen mit Bestellnummer (`FRK-2026-00001`), Zahlungs- und Versandstatus
- `order_items` — Bestellpositionen als Snapshot (Titel & Preis bleiben erhalten,
  auch wenn das Produkt später gelöscht wird)

RLS ist auf allen Tabellen aktiv und ohne Policies — es gibt also **keinen**
direkten Zugriff aus dem Browser. Sämtliche Zugriffe laufen über die
serverseitigen API-Routen.

---

## 3. Stripe einrichten

1. Im Stripe-Dashboard den **Secret Key** kopieren → `STRIPE_SECRET_KEY`.
2. **Entwickler → Webhooks → Endpunkt hinzufügen**
   - URL: `https://<deine-domain>/api/stripe-webhook`
   - Events: `checkout.session.completed`,
     `checkout.session.async_payment_succeeded`,
     `checkout.session.async_payment_failed`
3. Das **Signaturgeheimnis** (`whsec_…`) kopieren → `STRIPE_WEBHOOK_SECRET`.

**Lokal testen** mit der Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe-webhook
# Das ausgegebene whsec_… als STRIPE_WEBHOOK_SECRET in die .env eintragen
stripe trigger checkout.session.completed
```

Testkarte im Checkout: `4242 4242 4242 4242`, beliebiges künftiges Datum, beliebige CVC.

---

## 4. Ablauf einer Bestellung

1. Kunde legt Produkte in den Warenkorb (nur `localStorage`, kein Server-State).
2. Klick auf **Zur Kasse** → `POST /api/checkout`.
   Der Server lädt die Preise **aus der Datenbank** (nie aus dem Request),
   prüft Verfügbarkeit und Lagerbestand und erstellt die Stripe-Session.
3. Kunde bezahlt bei Stripe.
4. Stripe ruft `POST /api/stripe-webhook` auf. Die Signatur wird verifiziert,
   danach werden Bestellung + Positionen gespeichert und der Lagerbestand
   atomar reduziert (`decrement_stock`). Der Handler ist idempotent — mehrfach
   zugestellte Events erzeugen keine Duplikate.
5. Kunde landet auf `/bestellung-erfolg`, der Warenkorb wird geleert.

Preise werden **niemals** vom Client übernommen: Der Request enthält nur
Produkt-ID und Menge.

---

## 5. Admin-Dashboard

Erreichbar unter **`/admin`**, geschützt durch `ADMIN_PASSWORD`. Nach dem Login
wird ein HttpOnly-Cookie gesetzt, das mit `ADMIN_SESSION_SECRET` per HMAC-SHA256
signiert ist (Laufzeit: 7 Tage). Jede Admin-API-Route prüft dieses Cookie
serverseitig.

| Bereich | Funktion |
| --- | --- |
| `/admin` | Gesamtumsatz, Anzahl Bestellungen, offene Bestellungen, Lagerbestand, Warnung bei niedrigem Bestand |
| `/admin/bestellungen` | Alle Bestellungen: Nummer, Datum, Kundenname, E-Mail, Telefon, Lieferadresse, Produkte, Mengen, Gesamtsumme, Zahlungsstatus. Versandstatus änderbar: Offen → In Bearbeitung → Versendet → Zugestellt |
| `/admin/produkte` | Produkte anlegen, bearbeiten, löschen; Preis, Lagerbestand, Kategorie, Bild-URL, Badge, Sichtbarkeit |

`/admin`, `/api` und `/bestellung-erfolg` sind in `robots.txt` und per
`noindex`-Meta-Tag von Suchmaschinen ausgeschlossen.

---

## 6. Deployment auf Vercel

Das Projekt baut mit Nitro. Auf Vercel wird das Vercel-Preset automatisch
erkannt (Ausgabe nach `.vercel/output`), lokal ist Cloudflare der Fallback —
es ist keine zusätzliche Konfiguration nötig.

1. Repository in Vercel importieren.
2. Alle sechs Environment Variables eintragen.
3. Deployen.
4. Stripe-Webhook auf die Live-Domain zeigen lassen und das
   `STRIPE_WEBHOOK_SECRET` entsprechend aktualisieren.

Für den Livegang: `sk_test_…` durch `sk_live_…` ersetzen und im Stripe-Dashboard
vom Test- in den Live-Modus wechseln (das Webhook-Secret unterscheidet sich).

---

## 7. Sicherheitshinweis zur alten Shopify-Anbindung

Die Datei `src/lib/shopify.ts` enthielt einen **fest einkompilierten
Storefront-Access-Token**. Sie wurde entfernt, der Token liegt aber weiterhin in
der Git-Historie und war im öffentlichen Repository sichtbar.

**Bitte diesen Token im Shopify-Admin widerrufen** (Apps → App-Entwicklung →
Storefront-API-Token). Storefront-Tokens sind zwar für den Client gedacht und
nur lesend, sollten aber trotzdem rotiert werden, wenn sie öffentlich waren.

---

## 8. Vor dem ersten Deploy: Lockfile aktualisieren

Das Projekt nutzt **bun** als Paketmanager. Die neuen Dependencies (`stripe`,
`@supabase/supabase-js`) stehen bereits in der `package.json`, die `bun.lock`
muss aber einmal lokal aktualisiert und mitcommittet werden:

```bash
bun install
git add bun.lock package.json
git commit -m "Add stripe and supabase dependencies"
```

Ohne diesen Schritt schlägt der Vercel-Build mit einem Lockfile-Mismatch fehl.
