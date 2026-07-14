import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAdminOrders, useAdminSession, useUpdateShippingStatus } from "@/hooks/use-admin";
import { formatDateTime, formatPriceCents } from "@/lib/format";
import type { Order } from "@/lib/shop-types";

const SHIPPING_OPTIONS = [
  { value: "offen", label: "Offen" },
  { value: "in_bearbeitung", label: "In Bearbeitung" },
  { value: "versendet", label: "Versendet" },
  { value: "zugestellt", label: "Zugestellt" },
];

const PAYMENT_LABELS: Record<string, { label: string; className: string }> = {
  paid: { label: "Bezahlt", className: "bg-primary/10 text-primary" },
  unpaid: { label: "Ausstehend", className: "bg-secondary/15 text-secondary" },
  failed: {
    label: "Fehlgeschlagen",
    className: "bg-destructive/10 text-destructive",
  },
  no_payment_required: { label: "Keine Zahlung", className: "bg-muted text-muted-foreground" },
};

export const Route = createFileRoute("/admin/bestellungen")({
  component: AdminOrders,
});

function AdminOrders() {
  const { data: session } = useAdminSession();
  const { data: orders, isLoading, isError } = useAdminOrders(Boolean(session?.authenticated));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="py-16 text-center text-muted-foreground">
        Bestellungen konnten nicht geladen werden.
      </p>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <p className="py-16 text-center text-muted-foreground">Noch keine Bestellungen vorhanden.</p>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const updateStatus = useUpdateShippingStatus();
  const payment = PAYMENT_LABELS[order.paymentStatus] ?? {
    label: order.paymentStatus,
    className: "bg-muted text-muted-foreground",
  };

  return (
    <div className="rounded-2xl border border-border bg-card">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full flex-wrap items-center justify-between gap-3 p-5 text-left"
        aria-expanded={expanded}
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-lg font-bold text-foreground">
              {order.orderNumber}
            </span>
            <Badge className={payment.className} variant="outline">
              {payment.label}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatDateTime(order.createdAt)} · {order.customerName} · {order.email}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-display text-lg font-bold text-primary">
            {formatPriceCents(order.amountTotalCents, order.currency)}
          </span>
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border p-5">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Lieferadresse
              </h3>
              {order.shippingAddress ? (
                <p className="mt-2 text-sm leading-relaxed text-foreground">
                  {order.customerName}
                  <br />
                  {order.shippingAddress.line1}
                  {order.shippingAddress.line2 && (
                    <>
                      <br />
                      {order.shippingAddress.line2}
                    </>
                  )}
                  <br />
                  {order.shippingAddress.postal_code} {order.shippingAddress.city}
                  <br />
                  {order.shippingAddress.country}
                </p>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">Keine Adresse hinterlegt.</p>
              )}
              {order.phone && (
                <p className="mt-2 text-sm text-muted-foreground">Tel.: {order.phone}</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Versandstatus
              </h3>
              <div className="mt-2 max-w-xs">
                <Select
                  value={order.shippingStatus}
                  onValueChange={(value) =>
                    updateStatus.mutate({ id: order.id, shippingStatus: value })
                  }
                  disabled={updateStatus.isPending}
                >
                  <SelectTrigger aria-label="Versandstatus ändern">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SHIPPING_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Bestellte Produkte
          </h3>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="py-2 pr-4 font-medium">Produkt</th>
                  <th className="py-2 pr-4 font-medium">Menge</th>
                  <th className="py-2 pr-4 font-medium">Einzelpreis</th>
                  <th className="py-2 text-right font-medium">Summe</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b border-border/60">
                    <td className="py-2 pr-4 text-foreground">
                      {item.title}
                      {item.unit && <span className="text-muted-foreground"> · {item.unit}</span>}
                    </td>
                    <td className="py-2 pr-4">{item.quantity}</td>
                    <td className="py-2 pr-4">
                      {formatPriceCents(item.unitPriceCents, order.currency)}
                    </td>
                    <td className="py-2 text-right">
                      {formatPriceCents(item.totalCents, order.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="py-2 pr-4 font-semibold">
                    Gesamtsumme
                  </td>
                  <td className="py-2 text-right font-semibold">
                    {formatPriceCents(order.amountTotalCents, order.currency)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
