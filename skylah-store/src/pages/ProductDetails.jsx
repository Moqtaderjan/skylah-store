import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useStore } from '../context/StoreContext';

export default function ProductDetails() {
  const { id } = useParams();
  const { products, addToCart } = useStore();
  const product = products.find((item) => item.id === Number(id));
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <section className="container section">
        <h2>Product not found.</h2>
      </section>
    );
  }

  return (
    <section className="container section product-details">
      <div className="product-gallery">
        {/* Main Image */}
        <div className="main-image-container">
          <img
            src={product.images[selectedImage]}
            alt={product.name}
            className="main-image"
          />
        </div>

        {/* Thumbnail Images */}
        <div className="thumbnail-gallery">
          {product.images.map((image, index) => (
            <button
              key={index}
              className={`thumbnail-btn ${selectedImage === index ? 'active' : ''}`}
              onClick={() => setSelectedImage(index)}
            >
              <img
                src={image}
                alt={`${product.name} view ${index + 1}`}
                className="thumbnail-image"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="product-details-content">
        <span className="product-category">{product.category}</span>
        <h1>{product.name}</h1>
        <p className="product-description">{product.description}</p>
        <div className="product-price">
          <h2>${product.price.toFixed(2)}</h2>
        </div>
        <button className="btn btn-primary add-to-cart-large" onClick={() => addToCart(product)}>
          Add to Cart
        </button>

        <div className="product-features">
          <h3>Product Features</h3>
          <ul>
            <li>Premium quality materials</li>
            <li>Modern design</li>
            <li>Easy to use</li>
            <li>Long-lasting durability</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
