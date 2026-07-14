import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Boxes, Euro, Loader2, ShoppingBag, Truck } from "lucide-react";
import { useAdminSession, useAdminStats } from "@/hooks/use-admin";
import { formatPriceCents } from "@/lib/format";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: session } = useAdminSession();
  const { data: stats, isLoading, isError } = useAdminStats(Boolean(session?.authenticated));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <p className="py-16 text-center text-muted-foreground">
        Statistiken konnten nicht geladen werden.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Euro className="h-5 w-5" />}
          label="Gesamtumsatz (bezahlt)"
          value={formatPriceCents(stats.totalRevenueCents)}
        />
        <StatCard
          icon={<ShoppingBag className="h-5 w-5" />}
          label="Bestellungen gesamt"
          value={String(stats.orderCount)}
        />
        <StatCard
          icon={<Truck className="h-5 w-5" />}
          label="Offene Bestellungen"
          value={String(stats.openOrderCount)}
        />
        <StatCard
          icon={<Boxes className="h-5 w-5" />}
          label="Lagerbestand (aktiv)"
          value={String(stats.totalStock)}
        />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-secondary" />
          <h2 className="font-display text-xl font-bold text-foreground">Niedriger Lagerbestand</h2>
        </div>
        {stats.lowStockProducts.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Alle Produkte sind ausreichend auf Lager.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {stats.lowStockProducts.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-3 text-sm">
                <span className="font-medium text-foreground">{p.title}</span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    p.stock === 0
                      ? "bg-destructive/10 text-destructive"
                      : "bg-secondary/15 text-secondary"
                  }`}
                >
                  {p.stock === 0 ? "Ausverkauft" : `Nur noch ${p.stock}×`}
                </span>
              </li>
            ))}
          </ul>
        )}
        <Link
          to="/admin/produkte"
          className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
        >
          Zur Produktverwaltung →
        </Link>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}
