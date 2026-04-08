import { useEffect, useMemo, useState } from "react";
import { getMyProviderProfile } from "../../api/providers";
import { getProviderBookings, updateAvailability } from "../../api/bookings";
import { Layout } from "../../components/Layout";
import { StatusBadge } from "../../components/StatusBadge";
import { getDisplayServiceName } from "../../lib/utils";

export function ProviderDashboardPage({ session, onNavigate, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [profileData, bookingData] = await Promise.all([
        getMyProviderProfile(),
        getProviderBookings()
      ]);
      setProfile(profileData);
      setBookings(bookingData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(
    () => ({
      pending: bookings.filter((booking) => booking.status === "pending").length,
      accepted: bookings.filter((booking) => ["accepted", "completion_requested"].includes(booking.status)).length,
      completed: bookings.filter((booking) => booking.status === "completed").length
    }),
    [bookings]
  );

  async function handleAvailabilityChange(value) {
    try {
      setMessage("");
      setError("");
      const response = await updateAvailability(value);
      setMessage(response.message);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Layout
      session={session}
      title="Provider Dashboard"
      subtitle="See your current status, booking summary, and availability information."
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      {message ? <div className="message success">{message}</div> : null}
      {error ? <div className="message error">{error}</div> : null}
      {loading ? <p className="muted">Loading provider dashboard...</p> : null}

      {profile ? (
        <section className="panel-grid">
          <div className="panel">
            <span className="eyebrow">My Service Profile</span>
            <h2>{profile.user?.name}</h2>
            <p>{getDisplayServiceName(profile)}</p>

            <div className="provider-meta">
              <StatusBadge status={profile.status} />
              <StatusBadge status={profile.availability_status} tone="availability" />
            </div>

            <div className="detail-list">
              <p><strong>Email:</strong> {profile.user?.email}</p>
              <p><strong>Phone:</strong> <a href={`tel:${profile.user?.phone}`}>{profile.user?.phone}</a></p>
              <p><strong>Location:</strong> {profile.location || "Not set"}</p>
              <p><strong>Shop in Zaria:</strong> {profile.has_shop_in_zaria ? "Yes" : "No"}</p>
              <p><strong>Shop Address:</strong> {profile.shop_address || "Not set"}</p>
              <p><strong>Experience:</strong> {profile.years_of_experience} years</p>
              <p><strong>Description:</strong> {profile.description || "No description yet."}</p>
            </div>
          </div>

          <div className="panel">
            <div className="section-title">
              <h2>Availability</h2>
              <span>Update manually</span>
            </div>

            <div className="button-row">
              {["available", "busy", "offline"].map((status) => (
                <button
                  key={status}
                  className={profile.availability_status === status ? "primary-button" : "ghost-button"}
                  onClick={() => handleAvailabilityChange(status)}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="summary-grid">
              <div className="summary-card">
                <strong>{stats.pending}</strong>
                <span>Pending Requests</span>
              </div>
              <div className="summary-card">
                <strong>{stats.accepted}</strong>
                <span>Active Jobs</span>
              </div>
              <div className="summary-card">
                <strong>{stats.completed}</strong>
                <span>Completed Jobs</span>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </Layout>
  );
}
