import { useEffect, useState } from "react";
import { getCategories, getProviders, searchProviders } from "../../api/providers";
import { Layout } from "../../components/Layout";
import { ProviderCard } from "../../components/ProviderCard";
import { loadBrowserLocation } from "../../lib/location";

export function ProvidersPage({ session, onNavigate, onLogout, searchParams }) {
  const initialCategory = searchParams.get("category") || "";
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryId, setCategoryId] = useState(initialCategory);
  const [query, setQuery] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    loadBrowserLocation().then(setUserLocation);
  }, []);

  useEffect(() => {
    async function loadProviders() {
      try {
        setLoading(true);
        setError("");

        const data = query.trim()
          ? await searchProviders({
              query: query.trim(),
              userLat: userLocation?.latitude,
              userLon: userLocation?.longitude
            })
          : await getProviders({
              categoryId: categoryId ? Number(categoryId) : null,
              userLat: userLocation?.latitude,
              userLon: userLocation?.longitude
            });

        setProviders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProviders();
  }, [categoryId, query, userLocation]);

  return (
    <Layout
      session={session}
      title="Find Providers"
      subtitle="Search by provider name, service, category, or location."
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <section className="panel">
        <div className="toolbar">
          <label>
            Search
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search provider, service, or area"
            />
          </label>

          <label>
            Filter by Category
            <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error ? <div className="message error">{error}</div> : null}
        {loading ? <p className="muted">Loading providers...</p> : null}

        <div className="cards-grid">
          {providers.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onView={() => onNavigate(`/resident/providers/${provider.id}`)}
            />
          ))}
        </div>

        {!loading && !providers.length ? (
          <div className="empty-state">
            <h3>No providers found</h3>
            <p>Try another search term or clear the category filter.</p>
          </div>
        ) : null}
      </section>
    </Layout>
  );
}
