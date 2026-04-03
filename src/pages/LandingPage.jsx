export function LandingPage({ onNavigate }) {
  return (
    <div className="landing-page">
      <section className="landing-hero">
        <div className="landing-copy">
          <span className="eyebrow">Local services made simple</span>
          <h1>Book trusted home service providers in Zaria from the web.</h1>
          <p>
            Residents can quickly find help, while providers can manage bookings and job progress
            using the same backend that already powers the mobile app.
          </p>

          <div className="landing-actions">
            <button className="primary-button" onClick={() => onNavigate("/login")}>
              Login
            </button>
            <button className="ghost-button" onClick={() => onNavigate("/register")}>
              Create Account
            </button>
          </div>
        </div>

        <div className="demo-card-grid">
          <div className="demo-card accent">
            <h3>Residents</h3>
            <p>Search providers, book services, track bookings, submit reviews, and raise complaints.</p>
          </div>
          <div className="demo-card">
            <h3>Providers</h3>
            <p>Review requests, accept or decline jobs, mark work completed, and manage availability.</p>
          </div>
          <div className="demo-card">
            <h3>Flexible Service System</h3>
            <p>Providers show their custom service name first, then their category when needed.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
