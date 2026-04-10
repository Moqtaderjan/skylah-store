import { useState } from 'react';
import { useStore } from '../context/StoreContext';

export default function Account() {
  const { user, setUser } = useStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser({ name, email });
    alert('Account saved locally in browser.');
  };

  const handleLogout = () => {
    setUser(null);
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <section className="container section narrow-section">
      <div className="section-head">
        <h2>Account</h2>
        <p>This is a front-end account page stored in local browser storage.</p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Save Account</button>
        {user && (
          <button type="button" className="btn btn-secondary" onClick={handleLogout}>
            Log Out
          </button>
        )}
      </form>
    </section>
  );
}
