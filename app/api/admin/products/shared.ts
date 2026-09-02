import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(5000).nullable(),
  category: z.enum(["BOOK", "PERFUME", "OTHER"]),
  pricePence: z.number().int().min(0).max(10_000_00),
  imageUrl: z.string().max(500).nullable(),
  inStock: z.boolean(),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
});

export function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "") // strip combining diacritics
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") || "product"
  );
}
