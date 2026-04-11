import { useState } from 'react';

const INITIAL_FORM = {
  name: '',
  email: '',
  subject: '',
  message: ''
};

export default function Contact() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('https://formsubmit.co/ajax/info@skylah.us', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          _subject: `Skylah Store Contact: ${formData.subject}`,
          _captcha: 'true',
          _template: 'table'
        })
      });

      const result = await response.json();

      if (!response.ok || result.success !== 'true') {
        throw new Error('Unable to send message.');
      }

      setStatus({
        type: 'success',
        message: 'Message sent successfully. We will contact you shortly.'
      });
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
