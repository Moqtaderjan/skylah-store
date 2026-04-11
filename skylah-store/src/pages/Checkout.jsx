import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const INITIAL_PAYMENT_FORM = {
  fullName: '',
  email: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: ''
};

export default function Checkout() {
  const { cart, cartTotal } = useStore();
  const [formData, setFormData] = useState(INITIAL_PAYMENT_FORM);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const isFormReady = useMemo(() => {
    const requiredFields = [
      formData.fullName,
      formData.email,
      formData.address,
      formData.city,
      formData.state,
      formData.zip,
      formData.country
    ];

    return requiredFields.every((value) => value.trim()) && agreeTerms;
  }, [formData, agreeTerms]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSecureSubmit = (e) => {
    e.preventDefault();

    if (!isFormReady) {
      setStatusMessage('Please complete all required fields and confirmations.');
      return;
    }

    setStatusMessage('Order request received. Online card payment is temporarily unavailable. Our team will contact you to complete the order securely.');
  };

  return (
    <section className="container section checkout-section">
      <div className="section-head">
        <h2>Secure Checkout</h2>
        <p>Complete your order details below. Payment method entry is currently locked.</p>
      </div>

      <div className="checkout-alert" role="note" aria-live="polite">
        <strong>Payment Availability:</strong> Online card processing is temporarily unavailable.
        You can submit order details, and our team will follow up with secure payment instructions.
      </div>

      <div className="checkout-grid">
        <form className="contact-form" onSubmit={handleSecureSubmit} autoComplete="off">
          <h3>Billing Information</h3>
          <input name="fullName" type="text" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
          <input name="address" type="text" placeholder="Street Address" value={formData.address} onChange={handleChange} required />
          <div className="checkout-inline-fields">
            <input name="city" type="text" placeholder="City" value={formData.city} onChange={handleChange} required />
            <input name="state" type="text" placeholder="State" value={formData.state} onChange={handleChange} required />
          </div>
          <div className="checkout-inline-fields">
            <input name="zip" type="text" placeholder="ZIP Code" value={formData.zip} onChange={handleChange} required />
            <input name="country" type="text" placeholder="Country" value={formData.country} onChange={handleChange} required />
          </div>

          <h3>Payment Details</h3>
          <fieldset className="checkout-payment-locked" disabled>
            <input name="cardName" type="text" placeholder="Name on Card" value="" readOnly aria-label="Name on Card (disabled)" />
          <input
            name="cardNumber"
            type="password"
            inputMode="numeric"
            placeholder="Card Number"
            value=""
            readOnly
            aria-label="Card Number (disabled)"
          />
          <div className="checkout-inline-fields">
            <input
              name="expiry"
              type="text"
              inputMode="numeric"
              placeholder="MM/YY"
              value=""
              readOnly
              aria-label="Expiry date (disabled)"
            />
            <input
              name="cvv"
              type="password"
              inputMode="numeric"
              placeholder="CVV"
              value=""
              readOnly
              aria-label="CVV (disabled)"
            />
          </div>
          </fieldset>
          <p className="checkout-disabled-note">Payment fields are disabled until secure online processing is activated.</p>

          <label className="checkout-checkbox">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              required
            />
            <span>
              I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy-policy">Privacy Policy</Link>.
            </span>
          </label>

          <button type="submit" className="btn btn-primary" disabled={!cart.length}>
            Submit Order Request
          </button>

          {statusMessage && (
            <p className="checkout-status" role="status" aria-live="polite">
              {statusMessage}
            </p>
          )}
        </form>

        <aside className="checkout-summary">
          <h3>Order Summary</h3>
          {cart.length === 0 ? (
            <p>Your cart is empty. Add products before checkout.</p>
          ) : (
            <>
              <ul className="checkout-items">
                {cart.map((item) => (
                  <li key={item.id}>
                    <span>{item.name} x {item.quantity}</span>
                    <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                  </li>
                ))}
              </ul>
              <div className="checkout-total-row">
                <span>Total</span>
                <strong>${cartTotal.toFixed(2)}</strong>
              </div>
            </>
          )}
          <p className="checkout-summary-note">
            Payment authorization and card charging are not active on this website at this time.
          </p>
        </aside>
      </div>
    </section>
  );
}
