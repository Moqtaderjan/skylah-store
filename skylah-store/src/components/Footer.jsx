import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://skylah-store.com';
  const shareText = encodeURIComponent(
    'Discover Skylah LLC — premium wholesale and retail goods, fast Amazon FBA fulfillment, and global customer service.'
  );
  const encodedUrl = encodeURIComponent(shareUrl);

  const handleInstagramShare = async (event) => {
    event.preventDefault();
    const caption = `Discover Skylah LLC — premium wholesale and retail goods with fast Amazon FBA fulfillment. Visit ${shareUrl}`;

    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(caption);
    }

    window.open('https://www.instagram.com', '_blank', 'noopener,noreferrer');
  };

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
            <li><Link to="/checkout">Checkout</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>

        <div>
          <h4>Share Skylah</h4>
          <div className="footer-social">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link facebook"
              aria-label="Share on Facebook"
            >
              <Facebook size={18} />
              <span>Facebook</span>
            </a>
            <button
              type="button"
              onClick={handleInstagramShare}
              className="social-link instagram"
              aria-label="Share on Instagram"
            >
              <Instagram size={18} />
              <span>Instagram</span>
            </button>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link twitter"
              aria-label="Share on Twitter"
            >
              <Twitter size={18} />
              <span>Twitter</span>
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link linkedin"
              aria-label="Share on LinkedIn"
            >
              <Linkedin size={18} />
              <span>LinkedIn</span>
            </a>
          </div>
          <p className="share-note">Click a platform to open it with your share message ready to use.</p>
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
