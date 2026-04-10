import { useStore } from '../context/StoreContext';

const categories = ['All', 'Accessories', 'Watches', 'Lighting', 'Furniture', 'Fashion', 'Electronics'];

export default function CategoryFilter() {
  const { selectedCategory, setSelectedCategory } = useStore();

  return (
    <div className="category-filter">
      {categories.map((category) => (
        <button
          key={category}
          className={selectedCategory === category ? 'category-btn active' : 'category-btn'}
          onClick={() => setSelectedCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
