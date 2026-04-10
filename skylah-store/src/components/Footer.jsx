import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h3>Skylah LLC</h3>
          <p>
            Your trusted wholesale and retail partner for premium consumer products.
            Specializing in electronics, fashion, home essentials, and lifestyle products
            with Amazon FBA fulfillment and worldwide shipping.
          </p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4>Services</h4>
          <ul>
            <li>Wholesale Distribution</li>
            <li>Amazon FBA Fulfillment</li>
            <li>Quality Assurance</li>
            <li>Global Shipping</li>
          </ul>
        </div>

        <div>
          <h4>Contact Information</h4>
          <p>Email: info@skylah.us</p>
          <p>Phone: +1 (971) 303-8521</p>
          <p>Business Hours: Mon-Fri 9AM-6PM PST</p>
          <p>Headquarters: Seattle, WA, USA</p>
        </div>
      </div>
      <div className="footer-bottom">© 2023-2025 Skylah LLC. All rights reserved.</div>
    </footer>
  );
}
