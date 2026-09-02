import type { Metadata } from "next";
import { Mail, MessageCircle, BookOpen, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPence } from "@/lib/utils";
import { PageHero } from "../_components/shared";

export const metadata: Metadata = {
  title: "Shop — An-Nur Academy",
  description:
    "Books, learning materials and perfumes from An-Nur Academy. Order simply by email or WhatsApp.",
};

export const dynamic = "force-dynamic";

type ShopProduct = {
  id: string;
  name: string;
  description: string | null;
  category: "BOOK" | "PERFUME" | "OTHER";
  pricePence: number;
  imageUrl: string | null;
  inStock: boolean;
};

const PLACEHOLDERS: ShopProduct[] = [
  {
    id: "ph-qawaid",
    name: "Ahsanul Qawa'id",
    description: "The classic Qa'idah primer used in our foundation classes — clear, large print.",
    category: "BOOK",
    pricePence: 499,
    imageUrl: "/images/ahsanulqawaid.webp",
    inStock: true,
  },
  {
    id: "ph-quran",
    name: "The Holy Qur'an",
    description: "A beautiful, easy-to-read mushaf — ideal for students of tajweed and hifz.",
    category: "BOOK",
    pricePence: 1499,
    imageUrl: "/images/quran.png",
    inStock: true,
  },
  {
    id: "ph-tasbeeh",
    name: "Electronic Tasbeeh",
    description: "A discreet digital counter for dhikr on the go — simple, reliable and light.",
    category: "OTHER",
    pricePence: 599,
    imageUrl: "/images/tasbeehdigital.jpg",
    inStock: true,
  },
];

const CATEGORY_LABEL: Record<ShopProduct["category"], string> = {
  BOOK: "Books",
  PERFUME: "Perfumes",
  OTHER: "Other",
};

async function getProducts(): Promise<{ products: ShopProduct[]; isPlaceholder: boolean }> {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        pricePence: true,
        imageUrl: true,
        inStock: true,
      },
    });
    if (products.length > 0) return { products, isPlaceholder: false };
  } catch (e) {
    console.error("Failed to load products:", e);
  }
  return { products: PLACEHOLDERS, isPlaceholder: true };
}

function orderMailto(name: string): string {
  return `mailto:info@an-nur.online?subject=${encodeURIComponent(`Order: ${name}`)}`;
}

function ProductCard({ p }: { p: ShopProduct }) {
  return (
    <div className="card flex flex-col overflow-hidden">
      <div className="bg-cream-deep">
        {p.imageUrl ? (
          <img src={p.imageUrl} alt={p.name} className="aspect-square w-full object-cover" />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center">
            <BookOpen className="h-12 w-12 text-green-800/30" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg">{p.name}</h3>
          <span className="badge badge-neutral shrink-0">{CATEGORY_LABEL[p.category]}</span>
        </div>
        {p.description && <p className="mt-2 flex-1 text-sm text-ink-soft">{p.description}</p>}
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="font-heading text-2xl text-green-900">{formatPence(p.pricePence)}</p>
          {p.inStock ? (
            <a href={orderMailto(p.name)} className="btn-outline text-sm">
              Order
            </a>
          ) : (
            <span className="badge badge-neutral">Out of stock</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function ShopPage() {
  const { products, isPlaceholder } = await getProducts();
  const books = products.filter((p) => p.category === "BOOK");
  const perfumes = products.filter((p) => p.category === "PERFUME");
  const other = products.filter((p) => p.category === "OTHER");

  return (
    <>
      <PageHero
        eyebrow="Academy shop"
        title="Books, learning materials & attar"
        intro="A small, carefully chosen selection — the books our classes use, and a few things that beautify daily worship. Ordering is simple: email or WhatsApp us."
      />

      <section className="container-px pb-10">
        <div className="card-gold flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm font-semibold text-green-900">
            <Sparkles className="mr-1 inline h-4 w-4 text-gold-700" />
            To order, message us with the item name and your address — we&rsquo;ll confirm the
            total including postage.
          </p>
          <div className="flex shrink-0 gap-3">
            <a href="mailto:info@an-nur.online?subject=Shop%20order" className="btn-primary text-sm">
              <Mail className="h-4 w-4" /> Email
            </a>
            <a
              href="https://wa.me/447724343150"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-sm"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
        {isPlaceholder && (
          <p className="mt-4 text-center text-xs text-ink-soft">
            A taste of what we stock — the full range is being added. Message us for current
            availability.
          </p>
        )}
      </section>

      {[
        { title: "Books", items: books },
        { title: "Perfumes", items: perfumes },
        { title: "Other", items: other },
      ]
        .filter((s) => s.items.length > 0)
        .map((section) => (
          <section key={section.title} className="container-px pb-12">
            <div className="mb-6 flex items-center gap-4">
              <h2 className="text-2xl">{section.title}</h2>
              <div className="divider-dot flex-1" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          </section>
        ))}

      <section className="container-px pb-20 pt-4 text-center text-xs text-ink-soft">
        <p>
          Payment is arranged when you order — we&rsquo;ll send you simple payment details with
          your confirmation. UK postage; international orders on request.
        </p>
      </section>
    </>
  );
}
