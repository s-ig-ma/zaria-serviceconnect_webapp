import { useEffect, useMemo, useState } from "react";
import { getProviderBookings, updateBookingStatus } from "../../api/bookings";
import { Layout } from "../../components/Layout";
import { StatusBadge } from "../../components/StatusBadge";
import { formatDateTime } from "../../lib/utils";

export function ProviderRequestsPage({ session, onNavigate, onLogout }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

  useEffect(() => {
    loadBookings();
  }, []);

  const requestBookings = useMemo(
    () =>
      bookings.filter((booking) =>
        ["pending", "accepted", "completion_requested"].includes(booking.status)
      ),
    [bookings]
  );

  async function handleStatusChange(bookingId, status) {
    try {
      setMessage("");
      setError("");
      await updateBookingStatus(bookingId, { status });
      setMessage(`Booking updated to ${status}.`);
      await loadBookings();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Layout
      session={session}
      title="Booking Requests"
      subtitle="Manage pending requests and current accepted jobs."
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <section className="panel">
        {message ? <div className="message success">{message}</div> : null}
        {error ? <div className="message error">{error}</div> : null}
        {loading ? <p className="muted">Loading booking requests...</p> : null}

        <div className="stack-list">
          {requestBookings.map((booking) => (
            <article className="booking-card" key={booking.id}>
              <div className="booking-head">
                <div>
                  <h3>{booking.resident?.name || "Resident"}</h3>
                  <p>{formatDateTime(booking.scheduled_date, booking.scheduled_time)}</p>
                </div>
                <StatusBadge status={booking.status} />
              </div>

              <div className="detail-list">
                <p><strong>Booking ID:</strong> #{booking.id}</p>
                <p><strong>Service Request:</strong> {booking.service_description}</p>
                <p><strong>Service Address:</strong> {booking.service_address || "No address saved."}</p>
                <p><strong>Resident Note:</strong> {booking.notes || "No note added."}</p>
                <p><strong>Phone:</strong> <a href={`tel:${booking.resident?.phone}`}>{booking.resident?.phone}</a></p>
              </div>

              <div className="button-row">
                {booking.status === "pending" ? (
                  <>
                    <button className="primary-button" onClick={() => handleStatusChange(booking.id, "accepted")}>
                      Accept
                    </button>
                    <button className="ghost-button danger" onClick={() => handleStatusChange(booking.id, "declined")}>
                      Decline
                    </button>
                  </>
                ) : null}

                {booking.status === "accepted" ? (
                  <button className="primary-button" onClick={() => handleStatusChange(booking.id, "completion_requested")}>
                    Request Completion
                  </button>
                ) : null}
              </div>

              {booking.status === "completion_requested" ? (
                <p className="helper-text">Waiting for the resident to confirm satisfaction.</p>
              ) : null}
            </article>
          ))}
        </div>

        {!loading && !requestBookings.length ? (
          <div className="empty-state">
            <h3>No active requests</h3>
            <p>Pending and accepted provider bookings will show here.</p>
          </div>
        ) : null}
      </section>
    </Layout>
  );
}
