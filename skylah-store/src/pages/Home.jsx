import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { Truck, Star, Briefcase } from 'lucide-react';

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
          <div className="section-head">
            <span className="section-tag">Why Skylah LLC?</span>
            <h2>Built for fast delivery, premium quality, and wholesale confidence.</h2>
            <p>Every order is handled with enterprise-grade logistics, rigorous quality checks, and a partner-first mindset.</p>
          </div>

          <div className="promo-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Truck size={32} />
              </div>
              <h4>Fast & Reliable Shipping</h4>
              <p>Amazon FBA and global logistics power on-time delivery with clear tracking every step of the way.</p>
            </div>
            <div className="feature-card feature-card-strong">
              <div className="feature-icon">
                <Star size={32} />
              </div>
              <h4>Premium Quality Assurance</h4>
              <p>Each product is inspected, tested, and packaged with care so your customers receive excellence every time.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Briefcase size={32} />
              </div>
              <h4>Wholesale Partnership Ready</h4>
              <p>Scale confidently with established supplier processes, flexible order support, and business-grade service.</p>
            </div>
          </div>

          <div className="promo-stats">
            <div>
              <strong>1K+</strong>
              <span>orders fulfilled</span>
            </div>
            <div>
              <strong>50+</strong>
              <span>curated products</span>
            </div>
            <div>
              <strong>4.8/5</strong>
              <span>average rating</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container section testimonials-section">
        <div className="section-head">
          <span className="section-tag">Trusted by Customers</span>
          <h2>Real reviews from buyers and business partners.</h2>
          <p>See why brands and customers choose Skylah LLC for dependable products, responsive support, and strong results.</p>
        </div>
        <div className="testimonials-grid">
          <div className="info-card testimonial-card">
            <div className="testimonial-badge">Customer</div>
            <div className="testimonial-stars">★★★★★</div>
            <p>"Fast shipping and the kitchen chopper works amazingly well. Very satisfied with my purchase."</p>
            <cite>- Michael Chen, Verified Customer</cite>
          </div>
          <div className="info-card testimonial-card">
            <div className="testimonial-badge">Partner</div>
            <div className="testimonial-stars">★★★★★</div>
            <p>"Excellent quality products and outstanding customer service. Highly recommended for wholesale partners."</p>
            <cite>- Sarah Johnson, Retail Partner</cite>
          </div>
          <div className="info-card testimonial-card">
            <div className="testimonial-badge">Supplier</div>
            <div className="testimonial-stars">★★★★★</div>
            <p>"Professional operation with reliable shipping. Great experience working with Skylah LLC."</p>
            <cite>- David Rodriguez, Supplier</cite>
          </div>
        </div>
      </section>
    </>
  );
}
