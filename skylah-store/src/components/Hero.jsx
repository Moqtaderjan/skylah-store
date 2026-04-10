import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="hero container">
      <div className="hero-text">
        <span className="hero-badge">Premium Wholesale & Retail</span>
        <h2>Quality Products, Trusted Partnerships, Global Reach</h2>
        <p>
          Skylah LLC is your trusted wholesale and retail partner, specializing in premium consumer electronics,
          fashion, home essentials, and lifestyle products. With Amazon FBA fulfillment and professional operations,
          we deliver quality products worldwide with unmatched reliability and customer service.
        </p>
        <div className="hero-actions">
          <Link to="/shop" className="btn btn-primary">Explore Products</Link>
          <Link to="/about" className="btn btn-secondary">Our Story</Link>
        </div>
      </div>

      <div className="hero-card">
        <img src="/logo.png" alt="Skylah LLC logo" />
      </div>
    </section>
  );
}
