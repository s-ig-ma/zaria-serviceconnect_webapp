import { useEffect, useState } from "react";
import { getProviderById } from "../../api/providers";
import { getProviderReviews } from "../../api/reviews";
import { Layout } from "../../components/Layout";
import { StatusBadge } from "../../components/StatusBadge";
import { formatDateLabel, getDisplayServiceName, getInitials } from "../../lib/utils";

export function ProviderProfilePage({ session, providerId, onNavigate, onLogout }) {
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const [providerData, reviewData] = await Promise.all([
          getProviderById(providerId),
          getProviderReviews(providerId)
        ]);
        setProvider(providerData);
        setReviews(reviewData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [providerId]);

  return (
    <Layout
      session={session}
      title="Provider Profile"
      subtitle="Review service details, ratings, and contact information before booking."
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      {error ? <div className="message error">{error}</div> : null}
      {loading ? <p className="muted">Loading provider profile...</p> : null}

      {provider ? (
        <section className="panel-grid profile-grid">
          <div className="panel">
            <div className="profile-head">
              <div className="avatar large">{getInitials(provider.user?.name)}</div>
              <div>
                <h2>{provider.user?.name}</h2>
                <p>{getDisplayServiceName(provider)}</p>
              </div>
            </div>

            <div className="provider-meta">
              <StatusBadge status={provider.availability_status || "available"} tone="availability" />
              <span>{provider.average_rating} stars</span>
              <span>{provider.total_reviews} reviews</span>
            </div>

            <div className="detail-list">
              <p><strong>Phone:</strong> <a href={`tel:${provider.user?.phone}`}>{provider.user?.phone}</a></p>
              <p><strong>Location:</strong> {provider.location || "Not set"}</p>
              <p><strong>Experience:</strong> {provider.years_of_experience} years</p>
              <p><strong>Description:</strong> {provider.description || "No description yet."}</p>
            </div>

            <div className="button-row">
              <button
                className="primary-button"
                onClick={() => onNavigate(`/resident/book/${provider.id}`)}
              >
                Book This Provider
              </button>
              <a className="ghost-button link-button" href={`tel:${provider.user?.phone}`}>
                Call Provider
              </a>
            </div>
          </div>

          <div className="panel">
            <div className="section-title">
              <h2>Reviews</h2>
              <span>{reviews.length} total</span>
            </div>

            {!reviews.length ? (
              <div className="empty-state compact">
                <h3>No reviews yet</h3>
                <p>This provider has not received a review yet.</p>
              </div>
            ) : (
              <div className="stack-list">
                {reviews.map((review) => (
                  <article key={review.id} className="review-card">
                    <div className="review-head">
                      <strong>{review.resident?.name}</strong>
                      <span>{review.rating}/5</span>
                    </div>
                    <p>{review.comment || "No written comment."}</p>
                    <small>{formatDateLabel(review.created_at)}</small>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      ) : null}
    </Layout>
  );
}
