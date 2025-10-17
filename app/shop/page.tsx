export default function ShopPage() {
  const products = [
    { name: "Ahsanul Qawa'id", price: "£4.99", image: "/images/islamicstudies.png", emoji: "📖", description: "Learn Arabic basics!" },
    { name: "Quran", price: "£14.99", image: "/images/quran.png", emoji: "📚", description: "Beautiful copy!" },
    { name: "Electronic Tasbeeh", price: "£5.99", image: "/images/tasbeeh.png", emoji: "📿", description: "Count your dhikr!" },
  ];
  
  return (
    <div className="py-10 space-y-12 max-w-6xl mx-auto">
      {/* 🛍️ HERO */}
      <div className="text-center space-y-6">
        <div className="text-7xl">🛍️</div>
        <h1 className="text-5xl md:text-6xl font-bold text-playful gradient-text">
          Islamic Shop! 🌟
        </h1>
        <p className="text-2xl md:text-3xl text-[--brand-green-dark] font-semibold">
          Quality Islamic Learning Materials! 📚✨
        </p>
      </div>

      {/* 📦 PRODUCTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((product, idx) => (
          <div 
            key={product.name}
            className={idx % 2 === 0 ? "fun-box-green text-white" : "fun-box-gold text-[--brand-green-dark]"}
          >
            <div className="space-y-4">
              {/* Image */}
              <div className="h-48 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Info */}
              <div className="text-center space-y-3">
                <div className="text-5xl">{product.emoji}</div>
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
                  href={`mailto:info@annur.online?subject=Shop order: ${product.name}`}
                  className={idx % 2 === 0 ? "btn-fun-gold block w-full text-center" : "btn-fun block w-full text-center"}
                >
                  📧 Contact to Order
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 💬 INFO BOX */}
      <div className="fun-box-white text-center space-y-4">
        <div className="text-6xl">📦</div>
        <h2 className="text-3xl md:text-4xl font-bold text-playful text-[--brand-green]">
          How to Order? 🤔
        </h2>
        <p className="text-xl text-[--brand-green-dark] font-semibold">
          Click "Contact to Order" on any product and send us an email! 📧<br />
          We'll get back to you with delivery details! 🚀
        </p>
      </div>
    </div>
  );
}


