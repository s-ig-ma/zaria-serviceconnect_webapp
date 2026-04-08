import { useEffect, useState } from "react";
import {
  getMyNotifications,
  markAllNotificationsRead,
  markNotificationRead
} from "../../api/notifications";
import { Layout } from "../../components/Layout";

export function ProviderNotificationsPage({ session, onNavigate, onLogout }) {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadNotifications() {
    try {
      setLoading(true);
      setError("");
      setNotifications(await getMyNotifications());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
    const timer = window.setInterval(loadNotifications, 15000);
    return () => window.clearInterval(timer);
  }, []);

  async function handleMarkRead(notificationId) {
    await markNotificationRead(notificationId);
    await loadNotifications();
  }

  async function handleMarkAllRead() {
    const response = await markAllNotificationsRead();
    setMessage(response.message);
    await loadNotifications();
  }

  return (
    <Layout
      session={session}
      title="Notifications"
      subtitle="View important updates about bookings, complaints, and admin communication."
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <section className="panel">
        {message ? <div className="message success">{message}</div> : null}
        {error ? <div className="message error">{error}</div> : null}
        <div className="section-title">
          <h2>My Notifications</h2>
          <button className="ghost-button" type="button" onClick={handleMarkAllRead}>
            Mark All Read
          </button>
        </div>
        {loading ? <p className="muted">Loading notifications...</p> : null}
        <div className="stack-list">
          {notifications.map((item) => (
            <article key={item.id} className="booking-card">
              <div className="booking-head">
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.message}</p>
                </div>
                {!item.is_read ? (
                  <button className="ghost-button" type="button" onClick={() => handleMarkRead(item.id)}>
                    Mark Read
                  </button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
        {!loading && !notifications.length ? <p className="muted">No notifications yet.</p> : null}
      </section>
    </Layout>
  );
}
