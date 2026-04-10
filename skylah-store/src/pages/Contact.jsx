export default function Contact() {
  return (
    <section className="container section narrow-section">
      <div className="section-head">
        <h2>Contact Skylah Store</h2>
        <p>Send us a message.</p>
      </div>

      <form className="contact-form">
        <input type="text" placeholder="Your Name" />
        <input type="email" placeholder="Your Email" />
        <input type="text" placeholder="Subject" />
        <textarea rows="6" placeholder="Your Message"></textarea>
        <button type="submit" className="btn btn-primary">Send Message</button>
      </form>
    </section>
  );
}
