import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function ProductCard({ product }) {
  const { addToCart } = useStore();

  const truncateText = (text, maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="product-card animate-in">
      <Link to={`/product/${product.id}`} className="product-image-wrap">
        <img src={product.image} alt={product.name} className="product-image" />
        <div className="product-overlay">
          <span className="view-details">View Details</span>
        </div>
      </Link>

      <div className="product-info">
        <span className="product-category animate-slide-up">{product.category}</span>
        <Link to={`/product/${product.id}`} className="product-title animate-slide-up">
          {product.name}
        </Link>
        <p className="product-description">
          {truncateText(product.description)}
        </p>
        <div className="product-bottom animate-slide-up">
          <strong className="price">${product.price.toFixed(2)}</strong>
          <button
            className="btn btn-primary add-to-cart-btn"
            onClick={() => addToCart(product)}
          >
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
