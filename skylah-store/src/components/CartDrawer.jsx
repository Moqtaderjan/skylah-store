import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    cart,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    clearCart,
  } = useStore();

  return (
    <>
      <div className="cart-overlay" onClick={() => setCartOpen(false)}></div>
      <aside className="cart-drawer">
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="icon-btn" onClick={() => setCartOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p>${item.price.toFixed(2)}</p>
                  <div className="qty-row">
                    <button onClick={() => updateQuantity(item.id, -1)}>
                      <Minus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <button className="delete-btn" onClick={() => removeFromCart(item.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <h3>Total: ${cartTotal.toFixed(2)}</h3>
          <button
            className="btn btn-primary full-btn"
            onClick={() => {
              setCartOpen(false);
              navigate('/checkout');
            }}
          >
            Checkout
          </button>
          <button className="btn btn-secondary full-btn" onClick={clearCart}>Clear Cart</button>
        </div>
      </aside>
    </>
  );
}
