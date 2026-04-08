import { useEffect, useState } from "react";
import { createBooking } from "../../api/bookings";
import { getProviderById } from "../../api/providers";
import { getMyUserProfile } from "../../api/users";
import { Layout } from "../../components/Layout";
import { getDisplayServiceName } from "../../lib/utils";

export function BookingPage({ session, providerId, onNavigate, onLogout }) {
  const [provider, setProvider] = useState(null);
  const [form, setForm] = useState({
    service_description: "",
    scheduled_date: "",
    scheduled_time: "",
    service_address: "",
    notes: ""
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProvider() {
      try {
        setLoading(true);
        const [providerData, userProfile] = await Promise.all([
          getProviderById(providerId),
          getMyUserProfile().catch(() => null)
        ]);
        setProvider(providerData);
        setForm((current) => ({
          ...current,
          service_address: userProfile?.home_address || current.service_address || ""
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProvider();
  }, [providerId]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const response = await createBooking({
        provider_id: Number(providerId),
        ...form,
        service_address: form.service_address.trim(),
        notes: form.notes.trim() || null
      });
      setMessage(`Booking #${response.id} created successfully.`);
      setForm({
        service_description: "",
        scheduled_date: "",
        scheduled_time: "",
        service_address: "",
        notes: ""
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout
      session={session}
      title="Book a Provider"
      subtitle="Fill in the service details and choose your preferred date and time."
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <section className="panel-grid">
        <div className="panel">
          {loading ? <p className="muted">Loading provider details...</p> : null}
          {provider ? (
            <>
              <span className="eyebrow">Selected Provider</span>
              <h2>{provider.user?.name}</h2>
              <p>{getDisplayServiceName(provider)}</p>
              <p className="muted">{provider.location || "Location not set"}</p>
              <p className="muted">Availability: {provider.availability_status || "available"}</p>
              <a className="inline-link" href={`tel:${provider.user?.phone}`}>
                Call: {provider.user?.phone}
              </a>
            </>
          ) : null}
        </div>

        <form className="panel" onSubmit={handleSubmit}>
          <h2>Booking Details</h2>

          <label>
            Service Description
            <textarea
              rows="4"
              value={form.service_description}
              onChange={(event) =>
                setForm({ ...form, service_description: event.target.value })
              }
              placeholder="Describe the exact work you need done"
            />
          </label>

          <label>
            Scheduled Date
            <input
              type="date"
              value={form.scheduled_date}
              onChange={(event) => setForm({ ...form, scheduled_date: event.target.value })}
            />
          </label>

          <label>
            Scheduled Time
            <input
              type="time"
              value={form.scheduled_time}
              onChange={(event) => setForm({ ...form, scheduled_time: event.target.value })}
            />
          </label>

          <label>
            Home Address for This Booking
            <textarea
              rows="3"
              value={form.service_address}
              onChange={(event) => setForm({ ...form, service_address: event.target.value })}
              placeholder="This auto-fills from your profile, but you can change it for this booking"
            />
          </label>

          <label>
            Notes
            <textarea
              rows="3"
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
              placeholder="Optional extra note for the provider"
            />
          </label>

          {message ? <div className="message success">{message}</div> : null}
          {error ? <div className="message error">{error}</div> : null}

          <div className="button-row">
            <button className="primary-button" type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Create Booking"}
            </button>
            <button
              className="ghost-button"
              type="button"
              onClick={() => onNavigate("/resident/bookings")}
            >
              View My Bookings
            </button>
          </div>
        </form>
      </section>
    </Layout>
  );
}
