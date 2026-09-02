import { ShoppingBag, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState } from "@/components/portal/ui";
import { formatPence } from "@/lib/utils";
import Modal from "@/components/admin/Modal";
import ProductForm from "@/components/admin/ProductForm";

const CATEGORY_LABEL: Record<string, string> = {
  BOOK: "Book",
  PERFUME: "Perfume",
  OTHER: "Other",
};

export default async function ShopAdminPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    take: 200,
  });

  return (
    <div>
      <PageHeader
        title="Shop products"
        subtitle="Books, perfumes and other items sold on the website"
        actions={
          <Modal trigger={<><Plus className="h-4 w-4" /> Add product</>} title="Add product">
            <ProductForm />
          </Modal>
        }
      />

      {products.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="No products yet" hint="Add the first product to build the shop." />
      ) : (
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Visible</th>
                <th>Order</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <p className="font-bold text-green-900">{p.name}</p>
                    <p className="text-xs text-ink-soft">/{p.slug}</p>
                  </td>
                  <td>{CATEGORY_LABEL[p.category] ?? p.category}</td>
                  <td className="font-bold">{formatPence(p.pricePence)}</td>
                  <td>
                    {p.inStock ? (
                      <span className="badge badge-ok">In stock</span>
                    ) : (
                      <span className="badge badge-red">Out of stock</span>
                    )}
                  </td>
                  <td>
                    {p.isActive ? (
                      <span className="badge badge-ok">Live</span>
                    ) : (
                      <span className="badge badge-neutral">Hidden</span>
                    )}
                  </td>
                  <td>{p.sortOrder}</td>
                  <td>
                    <Modal trigger="Edit" triggerClassName="btn btn-outline !py-1.5" title={`Edit — ${p.name}`}>
                      <ProductForm
                        product={{
                          id: p.id,
                          name: p.name,
                          slug: p.slug,
                          description: p.description,
                          category: p.category,
                          pricePence: p.pricePence,
                          imageUrl: p.imageUrl,
                          inStock: p.inStock,
                          isActive: p.isActive,
                          sortOrder: p.sortOrder,
                        }}
                      />
                    </Modal>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
