import { useEffect, useState } from "react";
import { getCategories } from "../../api/providers";
import { Layout } from "../../components/Layout";

export function ResidentHomePage({ session, onNavigate, onLogout }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        setCategories(await getCategories());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <Layout
      session={session}
      title="Resident Home"
      subtitle="Browse service categories, discover providers, and track your bookings."
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <section className="panel-grid">
        <div className="panel highlight-panel">
          <span className="eyebrow">Quick actions</span>
          <h2>Need help today?</h2>
          <p>
            Start by browsing available categories or view all providers across different service
            types.
          </p>
          <div className="button-row">
            <button className="primary-button" onClick={() => onNavigate("/resident/providers")}>
              Browse Providers
            </button>
            <button className="ghost-button" onClick={() => onNavigate("/resident/bookings")}>
              My Bookings
            </button>
          </div>
        </div>

        <div className="panel">
          <div className="section-title">
            <h2>Service Categories</h2>
            <span>{loading ? "Loading..." : `${categories.length} available`}</span>
          </div>

          {error ? <div className="message error">{error}</div> : null}

          <div className="category-grid">
            {categories.map((category) => (
              <button
                key={category.id}
                className="category-card"
                onClick={() => onNavigate(`/resident/providers?category=${category.id}`)}
              >
                <strong>{category.name}</strong>
                <span>{category.description || "Browse available providers in this category."}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
