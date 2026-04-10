import { Search } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function SearchBar() {
  const { search, setSearch } = useStore();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchTerm = formData.get('search') || '';
    setSearch(searchTerm);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setSearch(e.target.value);
    }
  };

  return (
    <form className="shop-search" onSubmit={handleSearchSubmit}>
      <Search size={18} />
      <input
        type="text"
        name="search"
        placeholder="Search by name, category, or description..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button type="submit" className="search-submit-btn" aria-label="Search">
        <Search size={16} />
      </button>
    </form>
  );
}
