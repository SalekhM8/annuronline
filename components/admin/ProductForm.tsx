"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { callApi, poundsToPence } from "./api";
import { useModalClose } from "./Modal";

export type ProductFormData = {
  id?: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  pricePence: number;
  imageUrl: string | null;
  inStock: boolean;
  isActive: boolean;
  sortOrder: number;
};

/** Create (no `product.id`) or edit a shop product. */
export default function ProductForm({ product }: { product?: ProductFormData }) {
  const router = useRouter();
  const close = useModalClose();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const pricePence = poundsToPence(get("price"));
    if (pricePence == null) {
      setError("Enter a valid price in pounds");
      setBusy(false);
      return;
    }
    const payload = {
      name: get("name"),
      description: get("description") || null,
      category: get("category"),
      pricePence,
      imageUrl: get("imageUrl") || null,
      inStock: f.get("inStock") === "on",
      isActive: f.get("isActive") === "on",
      sortOrder: Number(get("sortOrder") || "0"),
    };
    try {
      if (product?.id) {
        await callApi(`/api/admin/products/${product.id}`, "PATCH", payload);
      } else {
        await callApi("/api/admin/products", "POST", payload);
      }
      router.refresh();
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Name *</label>
          <input className="input" name="name" required defaultValue={product?.name ?? ""} />
        </div>
        <div>
          <label className="label">Category</label>
          <select className="select" name="category" defaultValue={product?.category ?? "OTHER"}>
            <option value="BOOK">Book</option>
            <option value="PERFUME">Perfume</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div>
          <label className="label">Price (£) *</label>
          <input
            className="input"
            name="price"
            inputMode="decimal"
            required
            defaultValue={product ? (product.pricePence / 100).toFixed(2) : ""}
          />
        </div>
        <div>
          <label className="label">Sort order</label>
          <input className="input" name="sortOrder" type="number" defaultValue={product?.sortOrder ?? 0} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Image URL</label>
          <input className="input" name="imageUrl" defaultValue={product?.imageUrl ?? ""} placeholder="/images/… or https://…" />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Description</label>
          <textarea className="textarea" name="description" rows={3} defaultValue={product?.description ?? ""} />
        </div>
      </div>
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" name="inStock" defaultChecked={product?.inStock ?? true} />
          In stock
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" name="isActive" defaultChecked={product?.isActive ?? true} />
          Visible in shop
        </label>
      </div>
      {product?.slug && <p className="text-xs text-ink-soft">Slug: {product.slug}</p>}
      {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? "Saving…" : product?.id ? "Save changes" : "Create product"}
      </button>
    </form>
  );
}
