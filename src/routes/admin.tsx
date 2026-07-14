import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { KeyRound, LayoutDashboard, Loader2, LogOut, Package, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminLogin, useAdminLogout, useAdminSession } from "@/hooks/use-admin";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  head: () => ({
    meta: [
      { title: "Admin — Frankos Balkan Food" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function AdminLayout() {
  const { data: session, isLoading } = useAdminSession();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session?.authenticated) {
    return <AdminLogin />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-secondary">
            Verwaltung
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-foreground sm:text-4xl">
            Admin-Dashboard
          </h1>
        </div>
        <LogoutButton />
      </div>

      <nav className="mt-8 flex flex-wrap gap-2 border-b border-border pb-4">
        <AdminNavLink to="/admin" exact icon={<LayoutDashboard className="h-4 w-4" />}>
          Übersicht
        </AdminNavLink>
        <AdminNavLink to="/admin/bestellungen" icon={<ShoppingBag className="h-4 w-4" />}>
          Bestellungen
        </AdminNavLink>
        <AdminNavLink to="/admin/produkte" icon={<Package className="h-4 w-4" />}>
          Produkte
        </AdminNavLink>
      </nav>

      <div className="mt-8">
        <Outlet />
      </div>
    </div>
  );
}

function AdminNavLink({
  to,
  exact,
  icon,
  children,
}: {
  to: string;
  exact?: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const normalized = pathname.replace(/\/$/, "") || "/";
  const active = exact ? normalized === to : normalized.startsWith(to);
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted"
      }`}
    >
      {icon}
      {children}
    </Link>
  );
}

function LogoutButton() {
  const logout = useAdminLogout();
  return (
    <Button variant="outline" onClick={() => logout.mutate()} disabled={logout.isPending}>
      <LogOut className="mr-2 h-4 w-4" /> Abmelden
    </Button>
  );
}

function AdminLogin() {
  const [password, setPassword] = useState("");
  const login = useAdminLogin();

  const handleSubmit = () => {
    if (!password || login.isPending) return;
    login.mutate(password);
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24">
      <div className="w-full rounded-2xl border border-border bg-card p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <KeyRound className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">Admin-Bereich</h1>
            <p className="text-sm text-muted-foreground">Bitte Passwort eingeben</p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            placeholder="Passwort"
            aria-label="Admin-Passwort"
            autoFocus
          />
          <Button className="w-full" onClick={handleSubmit} disabled={!password || login.isPending}>
            {login.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Anmelden"}
          </Button>
        </div>
      </div>
    </div>
  );
}
