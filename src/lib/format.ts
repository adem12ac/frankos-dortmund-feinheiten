/** Formats an amount in cents as a localized currency string, e.g. "8,90 €". */
export function formatPriceCents(cents: number, currencyCode = "EUR"): string {
  const amount = cents / 100;
  try {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: currencyCode,
    }).format(amount);
  } catch {
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
}

/** Formats an ISO timestamp as a German date + time string. */
export function formatDateTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat("de-DE", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
