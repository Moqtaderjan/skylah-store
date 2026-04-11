import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import products from '../data/products';
import { auth, hasRequiredConfig } from '../lib/firebase';

const StoreContext = createContext();
const LEGACY_CART_KEY = 'skylah-cart';
const GUEST_CART_KEY = 'skylah-cart-guest';
const GUEST_SESSION_ID_KEY = 'skylah-guest-session-id';

function generateGuestSessionId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getGuestSessionId() {
  if (typeof window === 'undefined') return 'server';

  const existing = sessionStorage.getItem(GUEST_SESSION_ID_KEY);
  if (existing) return existing;

  const nextId = generateGuestSessionId();
  sessionStorage.setItem(GUEST_SESSION_ID_KEY, nextId);
  return nextId;
}

export function StoreProvider({ children }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [cartReady, setCartReady] = useState(false);
  const [guestSessionId] = useState(() => getGuestSessionId());
  const [cartOpen, setCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const cartStorageKey = useMemo(
    () => (user?.uid ? `skylah-cart-${user.uid}` : `${GUEST_CART_KEY}-${guestSessionId}`),
    [user?.uid, guestSessionId]
  );

  useEffect(() => {
    const legacyGuestCart = localStorage.getItem(LEGACY_CART_KEY);
    const oldGuestCart = localStorage.getItem(GUEST_CART_KEY);
    const sessionGuestKey = `${GUEST_CART_KEY}-${guestSessionId}`;
    const existingSessionGuestCart = localStorage.getItem(sessionGuestKey);

    if (legacyGuestCart && !existingSessionGuestCart) {
      localStorage.setItem(sessionGuestKey, legacyGuestCart);
    }

    if (oldGuestCart && !existingSessionGuestCart) {
      localStorage.setItem(sessionGuestKey, oldGuestCart);
    }

    localStorage.removeItem(LEGACY_CART_KEY);
    localStorage.removeItem(GUEST_CART_KEY);
  }, [guestSessionId]);

  useEffect(() => {
    setCartReady(false);

    try {
      const saved = localStorage.getItem(cartStorageKey);
      setCart(saved ? JSON.parse(saved) : []);
    } catch {
      setCart([]);
    } finally {
      setCartReady(true);
    }
  }, [cartStorageKey]);

  useEffect(() => {
    if (!cartReady) return;
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  }, [cart, cartStorageKey, cartReady]);

  useEffect(() => {
    if (!hasRequiredConfig || !auth) {
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setAuthLoading(false);
        return;
      }

      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || '',
        emailVerified: firebaseUser.emailVerified,
        photoURL: firebaseUser.photoURL || '',
      });
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;

      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, amount) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + amount) }
            : item
        )
        .filter(Boolean)
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = {
    products,
    filteredProducts,
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
    cartOpen,
    setCartOpen,
    user,
    setUser,
    authLoading,
    authConfigured: hasRequiredConfig,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext);
}
