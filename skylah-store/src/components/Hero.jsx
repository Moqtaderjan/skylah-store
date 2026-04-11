import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const slides = [
  {
    category: 'Lighting',
    title: 'Illuminate your workspace with premium LED design',
    description: 'Discover sleek desk lamps and smart lighting solutions made for modern offices and home studios.',
    image: '/products/lamp/lamp.jpg',
    button: 'Shop Lighting',
    path: '/shop',
  },
  {
    category: 'Accessories',
    title: 'Elevate everyday style with luxury fashion accessories',
    description: 'Browse premium jewelry, leather goods, and daily essentials that blend bold design with unmatched quality.',
    image: '/products/ring/ring.jpg',
    button: 'Shop Accessories',
    path: '/shop',
  },
  {
    category: 'Electronics',
    title: 'Smart living essentials crafted for performance',
    description: 'From smart watches to premium headphones, our curated tech collection is built for active lifestyles.',
    image: '/products/watch/watch.jpg',
    button: 'Shop Electronics',
    path: '/shop',
  },
  {
    category: 'Furniture',
    title: 'Workspace comfort reimagined for premium productivity',
    description: 'Find ergonomic office chairs and premium furniture designed to help teams perform better every day.',
    image: '/products/chair/chair.jpg',
    button: 'Shop Furniture',
    path: '/shop',
  },
];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const slide = slides[activeIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero container hero-slider">
      <div className="hero-text">
        <span className="hero-badge">{slide.category}</span>
        <h2>{slide.title}</h2>
        <p>{slide.description}</p>

        <div className="hero-actions">
          <Link to={slide.path} className="btn btn-primary">{slide.button}</Link>
          <Link to="/about" className="btn btn-secondary">Our Story</Link>
        </div>

        <div className="hero-notice">
          <span>Experience premium product visuals curated to spark desire and drive confident buying decisions.</span>
        </div>
      </div>

      <div className="hero-card hero-card-slide">
        <div className="hero-card-image-wrap">
          <img key={slide.image} src={slide.image} alt={slide.title} />
          <div className="hero-card-tag">Featured Product</div>
        </div>

        <div className="hero-indicators">
          {slides.map((item, index) => (
            <button
              key={item.category}
              type="button"
              className={index === activeIndex ? 'hero-indicator active' : 'hero-indicator'}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${item.category} slide`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
