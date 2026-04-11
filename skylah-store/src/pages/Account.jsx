import { useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { CreditCard, History, Package, Settings, Store, UserCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { auth } from '../lib/firebase';

const getScopedKey = (uid, key) => `skylah-${key}-${uid}`;
const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\s]).{6,}$/;
const RESET_COOLDOWN_SECONDS = 60;
const VERIFICATION_COOLDOWN_SECONDS = 60;

export default function Account() {
  const { user, authLoading, authConfigured } = useStore();
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');
  const [passwordResetCooldownUntil, setPasswordResetCooldownUntil] = useState(0);
  const [verificationCooldownUntil, setVerificationCooldownUntil] = useState(0);
  const [nowTs, setNowTs] = useState(Date.now());
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState({ displayName: '', email: '', phone: '', photoURL: '' });
  const [paymentDraft, setPaymentDraft] = useState({ brand: 'Visa', label: '', last4: '' });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [activityHistory, setActivityHistory] = useState([]);

  const tabs = useMemo(
    () => [
      { id: 'overview', label: 'Overview', icon: <UserCircle2 size={16} /> },
      { id: 'orders', label: 'Orders', icon: <Package size={16} /> },
      { id: 'amazon', label: 'Amazon', icon: <Store size={16} /> },
      { id: 'history', label: 'History', icon: <History size={16} /> },
      { id: 'payments', label: 'Payment Methods', icon: <CreditCard size={16} /> },
      { id: 'settings', label: 'Account Settings', icon: <Settings size={16} /> },
    ],
    []
  );

  const passwordRequirements = useMemo(
    () => [
      { key: 'length', label: 'At least 6 characters', passed: password.length >= 6 },
      { key: 'letter', label: 'Includes a letter (A-Z)', passed: /[A-Za-z]/.test(password) },
      { key: 'number', label: 'Includes a number (0-9)', passed: /\d/.test(password) },
      { key: 'special', label: 'Includes a special character', passed: /[^\w\s]/.test(password) },
    ],
    [password]
  );

  const missingPasswordRequirements = passwordRequirements
    .filter((requirement) => !requirement.passed)
    .map((requirement) => requirement.label);

  const passwordHelpMessage =
    isSignUp && password.length > 0 && missingPasswordRequirements.length > 0
      ? `Password must include: ${missingPasswordRequirements.join(', ')}.`
      : '';

  const passwordResetSecondsLeft = Math.max(0, Math.ceil((passwordResetCooldownUntil - nowTs) / 1000));
  const verificationSecondsLeft = Math.max(0, Math.ceil((verificationCooldownUntil - nowTs) / 1000));

  useEffect(() => {
    if (!user?.emailVerified) {
      setIsEmailVerified(false);
      return;
    }

    setIsEmailVerified(true);
    setPendingVerificationEmail('');
  }, [user?.emailVerified]);

  useEffect(() => {
    if (passwordResetSecondsLeft <= 0 && verificationSecondsLeft <= 0) return;

    const timer = window.setInterval(() => {
      setNowTs(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [passwordResetSecondsLeft, verificationSecondsLeft]);

  useEffect(() => {
    if (!user?.uid || !isEmailVerified) return;

    const profileKey = getScopedKey(user.uid, 'profile');
    const paymentsKey = getScopedKey(user.uid, 'payments');
    const ordersKey = getScopedKey(user.uid, 'orders');
    const historyKey = getScopedKey(user.uid, 'history');

    const savedProfile = localStorage.getItem(profileKey);
    const savedPayments = localStorage.getItem(paymentsKey);
    const savedOrders = localStorage.getItem(ordersKey);
    const savedHistory = localStorage.getItem(historyKey);

    setProfile(
      savedProfile
        ? JSON.parse(savedProfile)
        : {
            displayName: user.name || '',
            email: user.email || '',
            phone: '',
            photoURL: user.photoURL || '',
          }
    );
    setPaymentMethods(savedPayments ? JSON.parse(savedPayments) : []);
    setOrderHistory(savedOrders ? JSON.parse(savedOrders) : []);
    setActivityHistory(savedHistory ? JSON.parse(savedHistory) : []);
    setActiveTab('overview');
  }, [user?.uid, user?.email, user?.name, user?.photoURL, isEmailVerified]);

  useEffect(() => {
    if (!user?.uid || !isEmailVerified) return;
    localStorage.setItem(getScopedKey(user.uid, 'profile'), JSON.stringify(profile));
  }, [profile, user?.uid, isEmailVerified]);

  useEffect(() => {
    if (!user?.uid || !isEmailVerified) return;
    localStorage.setItem(getScopedKey(user.uid, 'payments'), JSON.stringify(paymentMethods));
  }, [paymentMethods, user?.uid, isEmailVerified]);

  useEffect(() => {
    if (!user?.uid || !isEmailVerified) return;
    localStorage.setItem(getScopedKey(user.uid, 'orders'), JSON.stringify(orderHistory));
  }, [orderHistory, user?.uid, isEmailVerified]);

  useEffect(() => {
    if (!user?.uid || !isEmailVerified) return;
    localStorage.setItem(getScopedKey(user.uid, 'history'), JSON.stringify(activityHistory));
  }, [activityHistory, user?.uid, isEmailVerified]);

  useEffect(() => {
    if (user?.uid && user.email && !user.emailVerified) {
      setPendingVerificationEmail(user.email);
      setStatus('Please verify your email before entering the account dashboard.');
      signOut(auth).catch(() => {});
    }
  }, [user?.uid, user?.email, user?.emailVerified]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authConfigured || !auth) {
      setStatus('Authentication is not configured yet. Add Firebase credentials to your .env file.');
      return;
    }

    if (isSignUp && !PASSWORD_RULE.test(password)) {
      setStatus(`Password must include: ${missingPasswordRequirements.join(', ')}.`);
      return;
    }

    setIsSubmitting(true);
    setStatus('');

    try {
      if (isSignUp) {
        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        if (name.trim()) {
          await updateProfile(credential.user, { displayName: name.trim() });
        }
        await sendEmailVerification(credential.user, {
          url: `${window.location.origin}/verify-email`,
          handleCodeInApp: true,
        });
        setPendingVerificationEmail(email.trim());
        setVerificationCooldownUntil(Date.now() + VERIFICATION_COOLDOWN_SECONDS * 1000);
        setNowTs(Date.now());
        await signOut(auth);
        setStatus(`Verification email sent to ${email.trim()}. Please verify your email before signing in.`);
      } else {
        const result = await signInWithEmailAndPassword(auth, email.trim(), password);
        if (!result.user.emailVerified) {
          setPendingVerificationEmail(result.user.email || email.trim());
          await signOut(auth);
          setStatus('Please verify your email before signing in. Your account is locked until verification is complete.');
        } else {
          setStatus('Signed in successfully.');
        }
      }

      setPassword('');
    } catch (error) {
      setStatus(error.message || 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!authConfigured || !auth) {
      setStatus('Authentication is not configured yet. Add Firebase credentials to your .env file.');
      return;
    }

    if (!email.trim()) {
      setStatus('Enter your email first, then click Forgot Password.');
      return;
    }

    if (passwordResetSecondsLeft > 0) {
      setStatus(`Please wait ${passwordResetSecondsLeft}s before sending another password reset email.`);
      return;
    }

    try {
      const normalizedEmail = email.trim();
      await sendPasswordResetEmail(auth, normalizedEmail);
      setPasswordResetCooldownUntil(Date.now() + RESET_COOLDOWN_SECONDS * 1000);
      setNowTs(Date.now());
      setStatus(`Password reset email sent to ${normalizedEmail}. Check your inbox and spam folder.`);
    } catch (error) {
      setStatus(error.message || 'Unable to send password reset email.');
    }
  };

  const handleSendVerificationEmail = async () => {
    if (!auth?.currentUser) {
      setStatus('Sign in first to resend a verification email.');
      return;
    }

    if (verificationSecondsLeft > 0) {
      setStatus(`Please wait ${verificationSecondsLeft}s before resending verification.`);
      return;
    }

    try {
      await sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/verify-email`,
        handleCodeInApp: true,
      });
      const currentEmail = auth.currentUser.email || pendingVerificationEmail;
      setVerificationCooldownUntil(Date.now() + VERIFICATION_COOLDOWN_SECONDS * 1000);
      setNowTs(Date.now());
      setStatus(`Verification email sent to ${currentEmail}. Use the email link to verify, then click "I Verified, Check Again".`);
    } catch (error) {
      setStatus(error.message || 'Unable to send verification email.');
    }
  };

  const handleRefreshVerification = async () => {
    if (!auth?.currentUser) return;

    try {
      await reload(auth.currentUser);
      const verified = Boolean(auth.currentUser.emailVerified);
      setIsEmailVerified(verified);

      if (verified) {
        setPendingVerificationEmail('');
        setStatus('Email verified successfully. Full account access unlocked.');
      } else {
        setStatus('Email is still unverified. Please verify from inbox, then check again.');
      }
    } catch (error) {
      setStatus(error.message || 'Unable to refresh verification status.');
    }
  };

  const handleLogout = async () => {
    if (!auth) return;

    await signOut(auth);
    setStatus('Signed out.');
    setName('');
    setEmail('');
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!auth?.currentUser) return;

    await updateProfile(auth.currentUser, {
      displayName: profile.displayName,
      photoURL: profile.photoURL,
    });

    setStatus('Profile settings updated.');
    setActivityHistory((prev) => [
      { id: crypto.randomUUID(), title: 'Profile settings updated', time: new Date().toLocaleString() },
      ...prev,
    ]);
  };

  const handlePaymentMethodAdd = (e) => {
    e.preventDefault();

    if (!paymentDraft.label.trim() || paymentDraft.last4.length !== 4) {
      setStatus('Add a label and exactly 4 digits for the card ending.');
      return;
    }

    const entry = {
      id: crypto.randomUUID(),
      brand: paymentDraft.brand,
      label: paymentDraft.label.trim(),
      last4: paymentDraft.last4,
    };

    setPaymentMethods((prev) => [entry, ...prev]);
    setPaymentDraft({ brand: 'Visa', label: '', last4: '' });
    setStatus('Payment method label saved.');
  };

  const handlePaymentMethodRemove = (id) => {
    setPaymentMethods((prev) => prev.filter((method) => method.id !== id));
  };

  const showVerifiedDashboard = Boolean(user?.uid && isEmailVerified);

  return (
    <section className="container section account-section">
      <div className="section-head">
        <h2>My Account</h2>
        <p>Personalized dashboard with account-specific data and activity.</p>
      </div>

      {!authConfigured && (
        <div className="checkout-alert" role="alert">
          Firebase is not configured. Add values in .env (see .env.example), then restart the dev server.
        </div>
      )}

      {authLoading ? (
        <div className="legal-card">
          <p>Loading account session...</p>
        </div>
      ) : showVerifiedDashboard ? (
        <div className="account-dashboard animate-in">
          <aside className="account-sidebar">
            <div className="account-profile-glass">
              <div className="account-avatar-wrap">
                {profile.photoURL ? (
                  <img src={profile.photoURL} alt="Profile" className="account-avatar" />
                ) : (
                  <div className="account-avatar account-avatar-fallback">
                    {(profile.displayName || user.email || 'U').slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
              <h3>{profile.displayName || 'Member'}</h3>
              <p>{profile.email || user.email}</p>
            </div>

            <nav className="account-tabs" aria-label="Account sections">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`account-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>

            <button type="button" className="btn btn-secondary full-btn" onClick={handleLogout}>Log Out</button>
          </aside>

          <div className="account-content-panel">
            {activeTab === 'overview' && (
              <div className="account-dashboard-grid">
                <article className="account-stat-card">
                  <h4>Account ID</h4>
                  <p>{user.uid}</p>
                </article>
                <article className="account-stat-card">
                  <h4>Saved Payment Labels</h4>
                  <p>{paymentMethods.length}</p>
                </article>
                <article className="account-stat-card">
                  <h4>Total Orders</h4>
                  <p>{orderHistory.length}</p>
                </article>
                <article className="account-stat-card">
                  <h4>Recent Activity</h4>
                  <p>{activityHistory.length}</p>
                </article>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="legal-card">
                <h3>Orders</h3>
                {orderHistory.length === 0 ? (
                  <p>No orders yet for this account.</p>
                ) : (
                  <ul className="account-list">
                    {orderHistory.map((order) => (
                      <li key={order.id}>{order.reference} - {order.status}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {activeTab === 'amazon' && (
              <div className="legal-card">
                <h3>Amazon Channel</h3>
                <p>Marketplace integration status for this account profile.</p>
                <div className="account-amazon-grid">
                  <div className="account-amazon-card">
                    <h4>Fulfillment Mode</h4>
                    <p>Amazon FBA Enabled</p>
                  </div>
                  <div className="account-amazon-card">
                    <h4>Seller Support</h4>
                    <p>Priority Response Window</p>
                  </div>
                  <div className="account-amazon-card">
                    <h4>Sync Status</h4>
                    <p>Connected to account profile</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="legal-card">
                <h3>Account History</h3>
                {activityHistory.length === 0 ? (
                  <p>No activity recorded yet for this account.</p>
                ) : (
                  <ul className="account-list">
                    {activityHistory.map((item) => (
                      <li key={item.id}>{item.title} - {item.time}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="legal-card">
                <h3>Payment Methods</h3>
                <p>Store only non-sensitive labels for now. Do not store full card data.</p>
                <form className="contact-form compact-form" onSubmit={handlePaymentMethodAdd}>
                  <div className="checkout-inline-fields">
                    <select
                      value={paymentDraft.brand}
                      onChange={(e) => setPaymentDraft((prev) => ({ ...prev, brand: e.target.value }))}
                    >
                      <option>Visa</option>
                      <option>Mastercard</option>
                      <option>Amex</option>
                      <option>Discover</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Label (e.g. Business Card)"
                      value={paymentDraft.label}
                      onChange={(e) => setPaymentDraft((prev) => ({ ...prev, label: e.target.value }))}
                      required
                    />
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="Last 4 Digits"
                    value={paymentDraft.last4}
                    onChange={(e) =>
                      setPaymentDraft((prev) => ({ ...prev, last4: e.target.value.replace(/\D/g, '').slice(0, 4) }))
                    }
                    required
                  />
                  <button type="submit" className="btn btn-primary">Add Payment Label</button>
                </form>

                <ul className="account-payment-list">
                  {paymentMethods.map((method) => (
                    <li key={method.id}>
                      <div>
                        <strong>{method.brand}</strong>
                        <p>{method.label} - ending in {method.last4}</p>
                      </div>
                      <button type="button" className="btn btn-secondary" onClick={() => handlePaymentMethodRemove(method.id)}>
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'settings' && (
              <form className="contact-form" onSubmit={handleProfileSave}>
                <h3>Account Settings</h3>
                <input
                  type="text"
                  placeholder="Display Name"
                  value={profile.displayName}
                  onChange={(e) => setProfile((prev) => ({ ...prev, displayName: e.target.value }))}
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={profile.email}
                  onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                  disabled
                />
                <input
                  type="tel"
                  placeholder="Phone Number (Optional)"
                  value={profile.phone}
                  onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                />
                <input
                  type="url"
                  placeholder="Profile Picture URL (Optional)"
                  value={profile.photoURL}
                  onChange={(e) => setProfile((prev) => ({ ...prev, photoURL: e.target.value }))}
                />
                <button type="submit" className="btn btn-primary">Save Settings</button>
              </form>
            )}

            {status && <p className="checkout-status" role="status">{status}</p>}
          </div>
        </div>
      ) : pendingVerificationEmail ? (
        <div className="legal-card">
          <h3>Verify Your Email</h3>
          <p>
            We sent a verification email to <strong>{pendingVerificationEmail}</strong>. Please verify your email before signing in.
          </p>
          <div className="auth-inline-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSendVerificationEmail}
              disabled={verificationSecondsLeft > 0}
            >
              {verificationSecondsLeft > 0 ? `Resend in ${verificationSecondsLeft}s` : 'Resend Verification Email'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleRefreshVerification}>
              I Verified, Check Again
            </button>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ marginTop: '12px' }}
            onClick={() => {
              setPendingVerificationEmail('');
              setStatus('');
            }}
          >
            Back to Sign In
          </button>
          {status && <p className="checkout-status" role="status">{status}</p>}
        </div>
      ) : (
        <form className="contact-form auth-form" noValidate onSubmit={handleSubmit}>
          {isSignUp && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            required
          />

          <div className={`auth-message ${passwordHelpMessage || status ? 'visible' : ''}`} role="status" aria-live="polite">
            {status || passwordHelpMessage || ' '}
          </div>

          {isSignUp && (
            <div className="password-guidance">
              <div className="password-checklist" aria-label="Password requirements">
                {passwordRequirements.map((requirement) => (
                  <div
                    key={requirement.key}
                    className={`password-check ${requirement.passed ? 'passed' : 'missing'}`}
                  >
                    <span className="password-check-icon">{requirement.passed ? '✓' : '✕'}</span>
                    <span>{requirement.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={isSubmitting || !authConfigured}>
            {isSubmitting ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setIsSignUp((prev) => !prev);
              setStatus('');
              setPassword('');
            }}
          >
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Create one'}
          </button>
          {!isSignUp && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleForgotPassword}
              disabled={passwordResetSecondsLeft > 0}
            >
              {passwordResetSecondsLeft > 0 ? `Forgot Password (${passwordResetSecondsLeft}s)` : 'Forgot Password'}
            </button>
          )}
        </form>
      )}
    </section>
  );
}
