import { useEffect, useMemo, useState } from "react";
import { getProviderBookings } from "../../api/bookings";
import { Layout } from "../../components/Layout";
import { StatusBadge } from "../../components/StatusBadge";
import { formatDateTime } from "../../lib/utils";

export function ProviderHistoryPage({ session, onNavigate, onLogout }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBookings() {
      try {
        setLoading(true);
        setError("");
        setBookings(await getProviderBookings());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, []);

  const historyBookings = useMemo(
    () => bookings.filter((booking) => ["completed", "declined", "cancelled"].includes(booking.status)),
    [bookings]
  );

  return (
    <Layout
      session={session}
      title="Job History"
      subtitle="Review completed, cancelled, and declined provider bookings."
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <section className="panel">
        {error ? <div className="message error">{error}</div> : null}
        {loading ? <p className="muted">Loading booking history...</p> : null}

        <div className="stack-list">
          {historyBookings.map((booking) => (
            <article key={booking.id} className="booking-card">
              <div className="booking-head">
                <div>
                  <h3>{booking.resident?.name || "Resident"}</h3>
                  <p>{formatDateTime(booking.scheduled_date, booking.scheduled_time)}</p>
                </div>
                <StatusBadge status={booking.status} />
              </div>

              <div className="detail-list">
                <p><strong>Booking ID:</strong> #{booking.id}</p>
                <p><strong>Description:</strong> {booking.service_description}</p>
                <p><strong>Resident Note:</strong> {booking.notes || "No resident note."}</p>
                <p><strong>Provider Note:</strong> {booking.provider_notes || "No provider note."}</p>
                <p><strong>Phone:</strong> <a href={`tel:${booking.resident?.phone}`}>{booking.resident?.phone}</a></p>
              </div>
            </article>
          ))}
        </div>

        {!loading && !historyBookings.length ? (
          <div className="empty-state">
            <h3>No job history yet</h3>
            <p>Completed or closed jobs will show here after you process bookings.</p>
          </div>
        ) : null}
      </section>
    </Layout>
  );
}
