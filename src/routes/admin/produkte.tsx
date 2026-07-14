import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useAdminProducts,
  useAdminSession,
  useCreateProduct,
  useDeleteProduct,
  useUpdateProduct,
} from "@/hooks/use-admin";
import { formatPriceCents } from "@/lib/format";
import type { Product } from "@/lib/shop-types";
import type { ProductInput } from "@/lib/product-input";

export const Route = createFileRoute("/admin/produkte")({
  component: AdminProducts,
});

interface FormState {
  title: string;
  category: string;
  price: string; // "8,90" — parsed to cents on submit
  unit: string;
  description: string;
  imageUrl: string;
  badge: string;
  stock: string;
  active: boolean;
}

const EMPTY_FORM: FormState = {
  title: "",
  category: "",
  price: "",
  unit: "",
  description: "",
  imageUrl: "",
  badge: "",
  stock: "0",
  active: true,
};

function parsePriceToCents(value: string): number | null {
  const normalized = value.replace(/\s|€/g, "").replace(",", ".");
  const amount = Number(normalized);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return Math.round(amount * 100);
}

function productToForm(product: Product): FormState {
  return {
    title: product.title,
    category: product.category,
    price: (product.priceCents / 100).toFixed(2).replace(".", ","),
    unit: product.unit ?? "",
    description: product.description,
    imageUrl: product.imageUrl ?? "",
    badge: product.badge ?? "",
    stock: String(product.stock),
    active: product.active,
  };
}

function formToInput(form: FormState): ProductInput | null {
  const priceCents = parsePriceToCents(form.price);
  const stock = Number(form.stock);
  if (
    !form.title.trim() ||
    !form.category.trim() ||
    priceCents === null ||
    !Number.isInteger(stock) ||
    stock < 0
  ) {
    return null;
  }
  return {
    title: form.title.trim(),
    category: form.category.trim(),
    priceCents,
    unit: form.unit.trim() || null,
    description: form.description.trim(),
    imageUrl: form.imageUrl.trim() || null,
    badge: form.badge.trim() || null,
    stock,
    active: form.active,
  };
}

function AdminProducts() {
  const { data: session } = useAdminSession();
  const { data: products, isLoading, isError } = useAdminProducts(Boolean(session?.authenticated));
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [deleting, setDeleting] = useState<Product | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm(productToForm(product));
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    const input = formToInput(form);
    if (!input) return;
    if (editing) {
      updateProduct.mutate(
        { id: editing.id, update: input },
        { onSuccess: () => setDialogOpen(false) },
      );
    } else {
      createProduct.mutate(input, { onSuccess: () => setDialogOpen(false) });
    }
  };

  const isSaving = createProduct.isPending || updateProduct.isPending;
  const formValid = formToInput(form) !== null;

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
        Produkte konnten nicht geladen werden.
      </p>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{products?.length ?? 0} Produkte</p>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Neues Produkt
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Produkt</th>
              <th className="px-4 py-3 font-medium">Kategorie</th>
              <th className="px-4 py-3 font-medium">Preis</th>
              <th className="px-4 py-3 font-medium">Lager</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {(products ?? []).map((product) => (
              <tr key={product.id} className="border-b border-border/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      {product.imageUrl && (
                        <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{product.title}</p>
                      {product.unit && (
                        <p className="text-xs text-muted-foreground">{product.unit}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3 font-medium text-foreground">
                  {formatPriceCents(product.priceCents, product.currency)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      product.stock === 0
                        ? "font-semibold text-destructive"
                        : product.stock <= 5
                          ? "font-semibold text-secondary"
                          : ""
                    }
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={
                      product.active
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {product.active ? "Aktiv" : "Inaktiv"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(product)}
                      aria-label={`${product.title} bearbeiten`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleting(product)}
                      aria-label={`${product.title} löschen`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Produkt bearbeiten" : "Neues Produkt"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="product-title">Titel *</Label>
              <Input
                id="product-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="z. B. Hausgemachter Ajvar (mild)"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="product-category">Kategorie *</Label>
                <Input
                  id="product-category"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="z. B. Aufstriche & Ajvar"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="product-price">Preis (€) *</Label>
                <Input
                  id="product-price"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="5,90"
                  inputMode="decimal"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="product-unit">Einheit</Label>
                <Input
                  id="product-unit"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  placeholder="z. B. 580 ml"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="product-stock">Lagerbestand *</Label>
                <Input
                  id="product-stock"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  inputMode="numeric"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="product-description">Beschreibung</Label>
              <Textarea
                id="product-description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="product-image">Bild-URL</Label>
              <Input
                id="product-image"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://…"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="product-badge">Badge</Label>
                <Input
                  id="product-badge"
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  placeholder="z. B. Bestseller"
                />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch
                  id="product-active"
                  checked={form.active}
                  onCheckedChange={(checked) => setForm({ ...form, active: checked })}
                />
                <Label htmlFor="product-active">Im Shop sichtbar</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSubmit} disabled={!formValid || isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : editing ? (
                "Speichern"
              ) : (
                "Anlegen"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Produkt löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              „{deleting?.title}“ wird dauerhaft aus dem Shop entfernt. Bestehende Bestellungen
              bleiben unverändert erhalten.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleting) deleteProduct.mutate(deleting.id);
                setDeleting(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
