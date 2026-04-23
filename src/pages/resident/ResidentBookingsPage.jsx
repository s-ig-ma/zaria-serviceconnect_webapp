import { useEffect, useMemo, useState } from "react";
import { getResidentBookings, updateBookingStatus } from "../../api/bookings";
import { getMyComplaints, submitComplaint } from "../../api/complaints";
import { getProviderReviews, submitReview } from "../../api/reviews";
import { Layout } from "../../components/Layout";
import { useIsMobileOrTablet } from "../../lib/device";
import { StatusBadge } from "../../components/StatusBadge";
import { formatDateTime, getDisplayServiceName } from "../../lib/utils";

export function ResidentBookingsPage({ session, onNavigate, onLogout }) {
  const [bookings, setBookings] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [reviewsByProvider, setReviewsByProvider] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeReview, setActiveReview] = useState({});
  const [activeComplaint, setActiveComplaint] = useState({});
  const isMobileOrTablet = useIsMobileOrTablet();

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const bookingData = await getResidentBookings();
      setBookings(bookingData);

      const complaintData = await getMyComplaints().catch(() => []);
      setComplaints(complaintData);

      const uniqueProviderIds = [
        ...new Set(bookingData.map((booking) => booking.provider?.id).filter(Boolean))
      ];
      const reviewPairs = await Promise.all(
        uniqueProviderIds.map(async (providerId) => [providerId, await getProviderReviews(providerId)])
      );

      setReviewsByProvider(Object.fromEntries(reviewPairs));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const complaintBookingIds = useMemo(
    () => new Set(complaints.map((complaint) => complaint.booking_id)),
    [complaints]
  );

  async function handleCancelBooking(bookingId) {
    try {
      setMessage("");
      setError("");
      await updateBookingStatus(bookingId, { status: "cancelled" });
      setMessage("Booking cancelled successfully.");
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleConfirmCompletion(bookingId) {
    try {
      setMessage("");
      setError("");
      await updateBookingStatus(bookingId, { status: "completed" });
      setMessage("Job marked as completed successfully.");
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSubmitReview(booking) {
    const reviewState = activeReview[booking.id] || { rating: 5, comment: "" };

    try {
      setMessage("");
      setError("");
      await submitReview({
        booking_id: booking.id,
        rating: Number(reviewState.rating),
        comment: reviewState.comment.trim() || null
      });
      setMessage("Review submitted successfully.");
      setActiveReview({ ...activeReview, [booking.id]: { rating: 5, comment: "", open: false } });
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSubmitComplaint(booking) {
    const complaintState = activeComplaint[booking.id] || { message: "" };

    try {
      setMessage("");
      setError("");
      await submitComplaint({
        booking_id: booking.id,
        message: complaintState.message.trim()
      });
      setMessage("Complaint submitted successfully.");
      setActiveComplaint({ ...activeComplaint, [booking.id]: { message: "", open: false } });
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Layout
      session={session}
      title="My Bookings"
      subtitle="Track booking progress, leave a review, or raise a complaint where supported."
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <section className="panel">
        {message ? <div className="message success">{message}</div> : null}
        {error ? <div className="message error">{error}</div> : null}
        {loading ? <p className="muted">Loading your booking history...</p> : null}

        <div className="stack-list">
          {bookings.map((booking) => {
            const provider = booking.provider;
            const providerReviews = reviewsByProvider[provider?.id] || [];
            const alreadyReviewed = providerReviews.some((review) => review.booking_id === booking.id);
            const alreadyComplained = complaintBookingIds.has(booking.id);
            const reviewForm = activeReview[booking.id] || { rating: 5, comment: "", open: false };
            const complaintForm = activeComplaint[booking.id] || { message: "", open: false };

            return (
              <article key={booking.id} className="booking-card">
                <div className="booking-head">
                  <div>
                    <h3>{provider?.user?.name || "Provider"}</h3>
                    <p>{provider ? getDisplayServiceName(provider) : "Service"}</p>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>

                <div className="detail-list">
                  <p><strong>Booking ID:</strong> #{booking.id}</p>
                  <p><strong>Schedule:</strong> {formatDateTime(booking.scheduled_date, booking.scheduled_time)}</p>
                  <p><strong>Description:</strong> {booking.service_description}</p>
                  <p><strong>Service Address:</strong> {booking.service_address || "No address saved."}</p>
                  <p><strong>Notes:</strong> {booking.notes || "No note added."}</p>
                  <p><strong>Provider Note:</strong> {booking.provider_notes || "No provider note yet."}</p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {isMobileOrTablet ? (
                      <a href={`tel:${provider?.user?.phone}`}>{provider?.user?.phone}</a>
                    ) : (
                      <span>{provider?.user?.phone}</span>
                    )}
                  </p>
                </div>

                <div className="button-row">
                  {booking.status === "pending" ? (
                    <button className="ghost-button danger" onClick={() => handleCancelBooking(booking.id)}>
                      Cancel Booking
                    </button>
                  ) : null}

                  {booking.status === "completion_requested" ? (
                    <button className="primary-button" onClick={() => handleConfirmCompletion(booking.id)}>
                      Confirm Satisfaction
                    </button>
                  ) : null}

                  {booking.status === "completed" && !alreadyReviewed ? (
                    <button
                      className="ghost-button"
                      onClick={() =>
                        setActiveReview({
                          ...activeReview,
                          [booking.id]: { ...reviewForm, open: !reviewForm.open }
                        })
                      }
                    >
                      Leave Review
                    </button>
                  ) : null}

                  {!alreadyComplained ? (
                    <button
                      className="ghost-button"
                      onClick={() =>
                        setActiveComplaint({
                          ...activeComplaint,
                          [booking.id]: { ...complaintForm, open: !complaintForm.open }
                        })
                      }
                    >
                      Submit Complaint
                    </button>
                  ) : null}
                </div>

                {alreadyReviewed ? <p className="helper-text">Review already submitted for this booking.</p> : null}
                {alreadyComplained ? <p className="helper-text">Complaint already submitted for this booking.</p> : null}
                {booking.status === "completion_requested" ? (
                  <p className="helper-text">The provider has requested completion. Confirm only if you are satisfied.</p>
                ) : null}

                {reviewForm.open ? (
                  <div className="inline-form">
                    <label>
                      Rating
                      <select
                        value={reviewForm.rating}
                        onChange={(event) =>
                          setActiveReview({
                            ...activeReview,
                            [booking.id]: {
                              ...reviewForm,
                              rating: Number(event.target.value)
                            }
                          })
                        }
                      >
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <option key={rating} value={rating}>
                            {rating}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label>
                      Comment
                      <textarea
                        rows="3"
                        value={reviewForm.comment}
                        onChange={(event) =>
                          setActiveReview({
                            ...activeReview,
                            [booking.id]: {
                              ...reviewForm,
                              comment: event.target.value
                            }
                          })
                        }
                      />
                    </label>

                    <button className="primary-button" onClick={() => handleSubmitReview(booking)}>
                      Submit Review
                    </button>
                  </div>
                ) : null}

                {complaintForm.open ? (
                  <div className="inline-form">
                    <label>
                      Complaint Message
                      <textarea
                        rows="4"
                        value={complaintForm.message}
                        onChange={(event) =>
                          setActiveComplaint({
                            ...activeComplaint,
                            [booking.id]: {
                              ...complaintForm,
                              message: event.target.value
                            }
                          })
                        }
                      />
                    </label>

                    <button className="primary-button" onClick={() => handleSubmitComplaint(booking)}>
                      Submit Complaint
                    </button>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>

        {!loading && !bookings.length ? (
          <div className="empty-state">
            <h3>No bookings yet</h3>
            <p>Your booking history will appear here after you book a provider.</p>
          </div>
        ) : null}
      </section>
    </Layout>
  );
}
