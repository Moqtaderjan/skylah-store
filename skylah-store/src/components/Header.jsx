import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../context/StoreContext';

export default function Header() {
  const { cartCount, setCartOpen, search, setSearch } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (searchTerm) => {
    setSearch(searchTerm);
    navigate('/shop');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchTerm = formData.get('search') || '';
    handleSearch(searchTerm);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e.target.value);
    }
  };

  return (
    <header className="site-header">
      <div className="top-bar">Free shipping on orders over $100</div>

      <div className="nav-wrap container">
        <Link to="/" className="brand">
          <img src="/logo.png" alt="Skylah Store Logo" className="brand-logo" />
          <div>
            <h1>Skylah Store</h1>
            <p>Modern style. Daily essentials.</p>
          </div>
        </Link>

        <form className="header-search desktop-only" onSubmit={handleSearchSubmit}>
          <Search size={18} />
          <input
            type="text"
            name="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button type="submit" className="search-submit-btn" aria-label="Search">
            <Search size={16} />
          </button>
        </form>

        <div className="header-actions">
          <Link to="/account" className="icon-btn" aria-label="Account">
            <User size={20} />
          </Link>
          <button className="icon-btn" onClick={() => setCartOpen(true)} aria-label="Cart">
            <ShoppingCart size={20} />
            <span className="cart-badge">{cartCount}</span>
          </button>
          <button className="icon-btn mobile-only" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <nav className="menu-bar container desktop-only">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/shop">Shop</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        <NavLink to="/account">Account</NavLink>
      </nav>

      {menuOpen && (
        <div className="mobile-menu container">
          <form className="header-search" onSubmit={handleSearchSubmit}>
            <Search size={18} />
            <input
              type="text"
              name="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button type="submit" className="search-submit-btn" aria-label="Search">
              <Search size={16} />
            </button>
          </form>
          <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/shop" onClick={() => setMenuOpen(false)}>Shop</NavLink>
          <NavLink to="/about" onClick={() => setMenuOpen(false)}>About</NavLink>
          <NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLink>
          <NavLink to="/account" onClick={() => setMenuOpen(false)}>Account</NavLink>
        </div>
      )}
    </header>
  );
}
