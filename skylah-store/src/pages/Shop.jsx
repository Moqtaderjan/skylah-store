import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';

export default function Shop() {
  const { filteredProducts } = useStore();

  return (
    <section className="container section">
      <div className="section-head">
        <h2>Shop Products</h2>
        <p>Browse all products in Skylah Store.</p>
      </div>

      <SearchBar />
      <CategoryFilter />

      {filteredProducts.length === 0 ? (
        <p className="empty-message">No products found.</p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
