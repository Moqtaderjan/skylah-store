import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';

export default function Home() {
  const { products } = useStore();
  const featured = products.filter((item) => item.featured);

  return (
    <>
      <Hero />

      <section className="container section">
        <div className="section-head">
          <h2>Premium Featured Products</h2>
          <p>Discover our handpicked selection of high-quality products trusted by customers worldwide.</p>
        </div>
        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="container section promo-section">
        <div className="promo-box">
          <h2>Why Choose Skylah LLC?</h2>
          <div className="promo-grid">
            <div>
              <h4>🚚 Fast & Reliable Shipping</h4>
              <p>Amazon FBA fulfillment ensures lightning-fast delivery worldwide with 24/7 tracking.</p>
            </div>
            <div>
              <h4>⭐ Premium Quality Assurance</h4>
              <p>Every product undergoes rigorous testing and quality control before reaching customers.</p>
            </div>
            <div>
              <h4>💼 Wholesale Partnership Ready</h4>
              <p>Established distribution network and professional operations perfect for supplier partnerships.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>Trusted by Customers Worldwide</h2>
          <p>Join thousands of satisfied customers who trust Skylah LLC for their shopping needs.</p>
        </div>
        <div className="testimonials-grid">
          <div className="info-card">
            <div className="testimonial-stars">★★★★★</div>
            <p>"Fast shipping and the kitchen chopper works amazingly well. Very satisfied with my purchase."</p>
            <cite>- Michael Chen, Verified Customer</cite>
          </div>
          <div className="info-card">
            <div className="testimonial-stars">★★★★★</div>
            <p>"Excellent quality products and outstanding customer service. Highly recommended for wholesale partners."</p>
            <cite>- Sarah Johnson, Retail Partner</cite>
          </div>
          <div className="info-card">
            <div className="testimonial-stars">★★★★★</div>
            <p>"Professional operation with reliable shipping. Great experience working with Skylah LLC."</p>
            <cite>- David Rodriguez, Supplier</cite>
          </div>
        </div>
      </section>
    </>
  );
}
