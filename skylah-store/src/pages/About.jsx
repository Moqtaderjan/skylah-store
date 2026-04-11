export default function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container section">
          <div className="about-hero-content">
            <div className="hero-stats">
              <div className="stat-item animate-bounce">
                <div className="stat-number">2023</div>
                <div className="stat-label">Founded</div>
              </div>
              <div className="stat-item animate-bounce" style={{animationDelay: '0.2s'}}>
                <div className="stat-number">1K+</div>
                <div className="stat-label">Orders Fulfilled</div>
              </div>
              <div className="stat-item animate-bounce" style={{animationDelay: '0.4s'}}>
                <div className="stat-number">50+</div>
                <div className="stat-label">Curated Products</div>
              </div>
              <div className="stat-item animate-bounce" style={{animationDelay: '0.6s'}}>
                <div className="stat-number">Fast</div>
                <div className="stat-label">Responsive Support</div>
              </div>
            </div>
            <h1 className="about-title animate-in">
              Crafting Excellence in <span className="gradient-text">Every Product</span>
            </h1>
            <p className="about-subtitle animate-slide-up">
              From humble beginnings to industry leadership, Skylah LLC has revolutionized
              the way people shop for premium products worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section container section">
        <div className="story-grid">
          <div className="story-content">
            <h2 className="section-title animate-in">Our Journey</h2>
            <div className="story-timeline">
              <div className="timeline-item animate-slide-up">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h3>2023: The Beginning</h3>
                  <p>Founded with a focus on dependable service, careful product selection, and a better buying experience.</p>
                </div>
              </div>
              <div className="timeline-item animate-slide-up" style={{animationDelay: '0.2s'}}>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h3>Amazon FBA Partnership</h3>
                  <p>Fulfillment support helps us keep shipping organized, fast, and consistent for every order.</p>
                </div>
              </div>
              <div className="timeline-item animate-slide-up" style={{animationDelay: '0.4s'}}>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h3>Global Expansion</h3>
                  <p>Expanded our reach through trusted suppliers and a growing customer base across regions.</p>
                </div>
              </div>
              <div className="timeline-item animate-slide-up" style={{animationDelay: '0.6s'}}>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h3>Industry Leadership</h3>
                  <p>Built a reliable retail presence with steady growth, repeat customers, and dependable service.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="story-visual">
            <div className="futuristic-visual">
              <div className="central-globe">🌍</div>
              <div className="orbiting-shipping" style={{animationDelay: '0s'}}>
                <div className="orbit-icon">🚚</div>
                <div className="orbit-label">Fast Shipping</div>
              </div>
              <div className="orbiting-quality" style={{animationDelay: '1.6s'}}>
                <div className="orbit-icon">⭐</div>
                <div className="orbit-label">Quality First</div>
              </div>
              <div className="orbiting-innovation" style={{animationDelay: '3.2s'}}>
                <div className="orbit-icon">🚀</div>
                <div className="orbit-label">Innovation</div>
              </div>
              <div className="orbiting-support" style={{animationDelay: '4.8s'}}>
                <div className="orbit-icon">🛠️</div>
                <div className="orbit-label">Responsive Support</div>
              </div>
              <div className="orbiting-growth" style={{animationDelay: '6.4s'}}>
                <div className="orbit-icon">📈</div>
                <div className="orbit-label">Steady Growth</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container section">
          <h2 className="section-title text-center animate-in">Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card animate-in">
              <div className="value-icon">🎯</div>
              <h3>Excellence</h3>
              <p>We strive for perfection in every product, service, and interaction. Quality is never compromised.</p>
            </div>
            <div className="value-card animate-in" style={{animationDelay: '0.2s'}}>
              <div className="value-icon">🤝</div>
              <h3>Partnership</h3>
              <p>Building lasting relationships with suppliers, customers, and partners based on trust and mutual success.</p>
            </div>
            <div className="value-card animate-in" style={{animationDelay: '0.4s'}}>
              <div className="value-icon">🚀</div>
              <h3>Innovation</h3>
              <p>Constantly evolving and adapting to bring the latest technology and trends to our customers.</p>
            </div>
            <div className="value-card animate-in" style={{animationDelay: '0.6s'}}>
              <div className="value-icon">💚</div>
              <h3>Integrity</h3>
              <p>Honest, transparent, and ethical business practices in everything we do.</p>
            </div>
            <div className="value-card animate-in" style={{animationDelay: '0.8s'}}>
              <div className="value-icon">🌟</div>
              <h3>Customer Focus</h3>
              <p>Every decision we make is centered around delivering exceptional value to our customers.</p>
            </div>
            <div className="value-card animate-in" style={{animationDelay: '1s'}}>
              <div className="value-icon">🌍</div>
              <h3>Global Impact</h3>
              <p>Making a positive difference in communities worldwide through sustainable and responsible business.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section container section">
        <h2 className="section-title text-center animate-in">Meet Our Leadership</h2>
        <div className="team-grid">
          <div className="team-member animate-in">
            <div className="member-avatar">
              <div className="avatar-placeholder">👨‍💼</div>
            </div>
            <h3>Executive Leadership</h3>
            <p>Experienced professionals with decades of combined expertise in retail, wholesale, and e-commerce operations.</p>
          </div>
          <div className="team-member animate-in" style={{animationDelay: '0.2s'}}>
            <div className="member-avatar">
              <div className="avatar-placeholder">👩‍💻</div>
            </div>
            <h3>Technology Team</h3>
            <p>Innovative developers and designers creating cutting-edge solutions for seamless shopping experiences.</p>
          </div>
          <div className="team-member animate-in" style={{animationDelay: '0.4s'}}>
            <div className="member-avatar">
              <div className="avatar-placeholder">📦</div>
            </div>
            <h3>Operations Team</h3>
            <p>Dedicated logistics and fulfillment experts ensuring perfect order processing and delivery.</p>
          </div>
          <div className="team-member animate-in" style={{animationDelay: '0.6s'}}>
            <div className="member-avatar">
              <div className="avatar-placeholder">🎯</div>
            </div>
            <h3>Quality Assurance</h3>
            <p>Meticulous inspectors maintaining the highest standards across all our products and services.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container section">
          <div className="stats-showcase">
            <div className="stat-metric animate-in">
              <div className="metric-number">1K+</div>
              <div className="metric-label">Orders Fulfilled</div>
            </div>
            <div className="stat-metric animate-in" style={{animationDelay: '0.2s'}}>
              <div className="metric-number">20+</div>
              <div className="metric-label">Trusted Suppliers</div>
            </div>
            <div className="stat-metric animate-in" style={{animationDelay: '0.4s'}}>
              <div className="metric-number">4.8/5</div>
              <div className="metric-label">Customer Rating</div>
            </div>
            <div className="stat-metric animate-in" style={{animationDelay: '0.6s'}}>
              <div className="metric-number">2-5d</div>
              <div className="metric-label">Typical Delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container section">
          <div className="cta-content animate-in">
            <h2>Ready to Partner With Us?</h2>
            <p>Join thousands of satisfied customers and suppliers who trust Skylah LLC for their business needs.</p>
            <div className="cta-buttons">
              <a href="/contact" className="btn btn-primary animate-pulse">Contact Us</a>
              <a href="/shop" className="btn btn-secondary">Explore Products</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
