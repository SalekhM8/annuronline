import { ShoppingBag, BookOpen, BookMarked, Star, Package, Mail, MessageCircle } from "lucide-react";

export default function ShopPage() {
  const products = [
    { name: "Ahsanul Qawa'id", price: "£4.99", image: "/images/islamicstudies.png", Icon: BookOpen, description: "Learn Arabic basics!" },
    { name: "Quran", price: "£14.99", image: "/images/quran.png", Icon: BookMarked, description: "Beautiful copy!" },
    { name: "Electronic Tasbeeh", price: "£5.99", image: "/images/tasbeeh.png", Icon: Star, description: "Count your dhikr!" },
  ];
  
  return (
    <div className="py-10 space-y-12 max-w-6xl mx-auto">
      {/* 🛍️ HERO */}
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <ShoppingBag className="w-20 h-20 text-brand-green" strokeWidth={2.5} />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-playful gradient-text flex items-center justify-center gap-3">
          <Star className="w-12 h-12" fill="currentColor" />
          Islamic Shop!
        </h1>
        <p className="text-2xl md:text-3xl text-brand-green-dark font-semibold flex items-center justify-center gap-2">
          <Package className="w-8 h-8" />
          Quality Islamic Learning Materials!
        </p>
      </div>

      {/* 📦 PRODUCTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((product, idx) => (
          <div 
            key={product.name}
            className={idx % 2 === 0 ? "fun-box-green text-white" : "fun-box-gold text-brand-green-dark"}
          >
            <div className="space-y-4">
              {/* Image */}
              <div className="h-48 rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/40">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Info */}
              <div className="text-center space-y-3 relative z-10">
                <div className="flex justify-center">
                  <product.Icon className="w-14 h-14" strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-playful">
                  {product.name}
                </h3>
                <p className="text-lg font-semibold">
                  {product.description}
                </p>
                <div className="text-3xl font-bold">
                  {product.price}
                </div>
                <a 
                  href={`mailto:an-nuracademy@outlook.com?subject=Shop order: ${product.name}`}
                  className={idx % 2 === 0 ? "btn-fun-gold block w-full text-center flex items-center justify-center gap-2" : "btn-fun block w-full text-center flex items-center justify-center gap-2"}
                >
                  <Mail className={idx % 2 === 0 ? "w-5 h-5 text-brand-green-dark" : "w-5 h-5 text-white"} />
                  Contact to Order
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 💬 INFO BOX */}
      <div className="fun-box-white text-center space-y-4">
        <div className="flex justify-center relative z-10">
          <Package className="w-16 h-16 text-brand-green" strokeWidth={2.5} />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-playful text-brand-green flex items-center justify-center gap-2 relative z-10">
          How to Order?
        </h2>
        <p className="text-xl text-brand-green-dark font-semibold flex flex-col items-center gap-2 relative z-10">
          <span className="flex items-center gap-2">
            <Mail className="w-6 h-6" />
            Click &ldquo;Contact to Order&rdquo; on any product and send us an email!
          </span>
          <span className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            We&apos;ll get back to you with delivery details!
          </span>
        </p>
      </div>
    </div>
  );
}


