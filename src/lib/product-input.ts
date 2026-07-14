import { z } from "zod";

export const productInputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  handle: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Ungültiger Handle")
    .max(200)
    .optional(),
  description: z.string().trim().max(5000).default(""),
  category: z.string().trim().min(1).max(100),
  priceCents: z.number().int().min(1).max(10_000_000),
  unit: z.string().trim().max(100).nullable().default(null),
  imageUrl: z.string().trim().max(2000).nullable().default(null),
  badge: z.string().trim().max(50).nullable().default(null),
  stock: z.number().int().min(0).max(1_000_000).default(0),
  active: z.boolean().default(true),
});

export type ProductInput = z.infer<typeof productInputSchema>;

export const productUpdateSchema = productInputSchema.partial();

export type ProductUpdate = z.infer<typeof productUpdateSchema>;

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}
