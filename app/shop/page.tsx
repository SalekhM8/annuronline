export default function ShopPage() {
  const products = [
    { name: "Ahsanul Qawa’id", price: "£4.99", image: "/images/islamicstudies.png" },
    { name: "Quran", price: "£14.99", image: "/images/quran.png" },
    { name: "Electronic Tasbeeh", price: "£5.99", image: "/images/tasbeeh.png" },
  ];
  return (
    <div className="py-10">
      <h1 className="text-3xl font-semibold">Shop</h1>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {products.map((p) => (
          <div key={p.name} className="rounded-2xl bg-white/90 p-6 shadow-md ring-1 ring-[--brand-gold]/20">
            <div className="h-36 rounded-xl bg-[length:cover] bg-center" style={{ backgroundImage: `url(${p.image ?? "/images/islamicstudies.png"})` }} />
            <div className="mt-4 font-medium">{p.name}</div>
            <div className="text-sm text-neutral-600">{p.price}</div>
            <a className="btn-secondary mt-4" href={`mailto:info@annur.online?subject=Shop order: ${p.name}`}>Contact to order</a>
          </div>
        ))}
      </div>
    </div>
  );
}


