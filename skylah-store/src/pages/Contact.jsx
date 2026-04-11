import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { sendContactMessage } from '../lib/contactService';

const INITIAL_FORM = {
  name: '',
  email: '',
  subject: '',
  message: '',
  website: ''
};

const CONTACT_FORM_COOLDOWN_SECONDS = 60;
const CONTACT_DAILY_LIMIT = 10;
const CONTACT_LIMIT_STORAGE_KEY = 'skylah-contact-send-limits-v1';

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getLimitIdentity(userUid, email) {
  if (userUid) return `uid:${userUid}`;
  return `email:${email.trim().toLowerCase()}`;
}

function readSendLimits() {
  try {
    const raw = localStorage.getItem(CONTACT_LIMIT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function getTodaysSendCount(identity, todayKey) {
  const allLimits = readSendLimits();
  const record = allLimits[identity];
  if (!record || record.date !== todayKey) return 0;
  return typeof record.count === 'number' ? record.count : 0;
}

function incrementTodaysSendCount(identity, todayKey) {
  const allLimits = readSendLimits();
  const currentCount = getTodaysSendCount(identity, todayKey);

  allLimits[identity] = {
    date: todayKey,
    count: currentCount + 1,
  };

  localStorage.setItem(CONTACT_LIMIT_STORAGE_KEY, JSON.stringify(allLimits));
}

export default function Contact() {
  const { user } = useStore();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [cooldownUntil, setCooldownUntil] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const identity = getLimitIdentity(user?.uid, formData.email);
    const todayKey = getTodayKey();
    const sendsToday = getTodaysSendCount(identity, todayKey);

    if (sendsToday >= CONTACT_DAILY_LIMIT) {
      setStatus({
        type: 'error',
        message: `Daily limit reached (${CONTACT_DAILY_LIMIT} messages). Please try again tomorrow.`
      });
      return;
    }

    const secondsLeft = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
    if (secondsLeft > 0) {
      setStatus({
        type: 'error',
        message: `Please wait ${secondsLeft}s before sending another message.`
      });
      return;
    }

    setIsSending(true);
    setStatus({ type: '', message: '' });

    try {
      await sendContactMessage(
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          website: formData.website,
        },
        user?.uid
      );

      setStatus({
        type: 'success',
        message: 'Message sent successfully. We will contact you shortly.'
      });
      incrementTodaysSendCount(identity, todayKey);
      setCooldownUntil(Date.now() + CONTACT_FORM_COOLDOWN_SECONDS * 1000);
      setFormData(INITIAL_FORM);
    } catch {
      setStatus({
        type: 'error',
        message: 'Sending failed. Please try again in a moment.'
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="container section narrow-section">
      <div className="section-head">
        <h2>Contact Skylah Store</h2>
        <p>Send us a message.</p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={handleChange}
          tabIndex="-1"
          autoComplete="off"
          aria-hidden="true"
          style={{ display: 'none' }}
        />
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />
        <textarea
          rows="6"
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit" className="btn btn-primary" disabled={isSending}>
          {isSending ? 'Sending...' : 'Send Message'}
        </button>
        {status.message && (
          <p className={`contact-status ${status.type}`} role="status" aria-live="polite">
            {status.message}
          </p>
        )}
      </form>
    </section>
  );
}
