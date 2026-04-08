import { useEffect, useMemo, useState } from "react";
import { getMyComplaints } from "../../api/complaints";
import { getComplaintMessages, sendMessage } from "../../api/messages";
import { Layout } from "../../components/Layout";

function getMessageRoleClass(role) {
  if (role === "admin") {
    return "message-bubble admin";
  }
  if (role === "provider") {
    return "message-bubble provider";
  }
  return "message-bubble resident";
}

export function ProviderMessagesPage({ session, onNavigate, onLogout }) {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);

  const selectedComplaint =
    complaints.find((complaint) => complaint.id === selectedComplaintId) || null;

  const replyTarget = useMemo(
    () => [...messages].reverse().find((item) => item.sender.role === "admin") || null,
    [messages]
  );

  async function loadThread(complaintId, options = {}) {
    try {
      if (!options.silent) {
        setThreadLoading(true);
      }
      const thread = await getComplaintMessages(complaintId);
      setMessages(thread);
    } catch (err) {
      setError(err.message);
    } finally {
      setThreadLoading(false);
    }
  }

  async function refreshComplaints(options = {}) {
    try {
      if (!options.silent) {
        setLoading(true);
      }
      setError("");
      const data = await getMyComplaints();
      setComplaints(data);

      if (!data.length) {
        setSelectedComplaintId(null);
        setMessages([]);
        return;
      }

      const nextComplaintId =
        data.some((complaint) => complaint.id === selectedComplaintId)
          ? selectedComplaintId
          : data[0].id;

      setSelectedComplaintId(nextComplaintId);

      if (nextComplaintId != null) {
        await loadThread(nextComplaintId, { silent: options.silent });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectComplaint(complaintId) {
    setSelectedComplaintId(complaintId);
    setDraft("");
    setSuccessMessage("");
    await loadThread(complaintId);
  }

  useEffect(() => {
    refreshComplaints();
    const timer = window.setInterval(() => {
      refreshComplaints({ silent: true });
    }, 15000);
    return () => window.clearInterval(timer);
  }, []);

  async function handleSendMessage() {
    if (!selectedComplaint || !draft.trim()) {
      return;
    }

    try {
      setSuccessMessage("");
      setError("");
      await sendMessage({
        recipient_user_id: replyTarget?.sender.id ?? null,
        complaint_id: selectedComplaint.id,
        content: draft.trim()
      });
      setDraft("");
      setSuccessMessage("Reply sent successfully.");
      await loadThread(selectedComplaint.id, { silent: true });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Layout
      session={session}
      title="Messages"
      subtitle="Chat directly with admin about complaint cases. Resident messages do not appear here."
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <section className="messages-shell">
        <aside className="panel message-sidebar">
          <div className="section-title">
            <h2>Complaint Threads</h2>
            <span>{complaints.length}</span>
          </div>
          {loading ? <p className="muted">Loading complaints...</p> : null}
          {error ? <div className="message error">{error}</div> : null}
          <div className="stack-list">
            {complaints.map((complaint) => (
              <button
                key={complaint.id}
                className={
                  selectedComplaintId === complaint.id
                    ? "thread-card active"
                    : "thread-card"
                }
                onClick={() => handleSelectComplaint(complaint.id)}
              >
                <strong>Complaint #{complaint.id}</strong>
                <span>Status: {complaint.status}</span>
                <span>
                  From: {complaint.user?.name || "Resident"}
                </span>
              </button>
            ))}
          </div>
        </aside>

        <div className="panel message-stage">
          {!selectedComplaint ? <p className="muted">Select a complaint to view messages.</p> : null}

          {selectedComplaint ? (
            <>
              <div className="message-stage-header provider">
                <div>
                  <span className="eyebrow">Provider Inbox</span>
                  <h2>Complaint #{selectedComplaint.id}</h2>
                  <p>
                    Admin support chat about {selectedComplaint.user?.name || "the resident"}
                  </p>
                </div>
                <div className="message-stage-badge provider">Provider</div>
              </div>

              {successMessage ? <div className="message success">{successMessage}</div> : null}

              <div className="message-thread">
                {threadLoading ? <p className="muted">Refreshing conversation...</p> : null}
                {!threadLoading && !messages.length ? (
                  <p className="muted">No messages yet for this complaint.</p>
                ) : null}
                {messages.map((item) => (
                  <article key={item.id} className={getMessageRoleClass(item.sender.role)}>
                    <div className="message-bubble-head">
                      <strong>{item.sender.name}</strong>
                      <span>{item.sender.role === "admin" ? "admin" : "provider"}</span>
                    </div>
                    <p>{item.content}</p>
                  </article>
                ))}
              </div>

              <div className="message-composer provider">
                <div className="composer-head">
                  <strong>Reply to Admin</strong>
                  <span>
                    {replyTarget
                      ? `Sending to ${replyTarget.sender.name}`
                      : "Sending to admin"}
                  </span>
                </div>
                <label>
                  <textarea
                    rows="5"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder={
                      replyTarget
                        ? "Write your reply here..."
                        : "Write your message to admin here..."
                    }
                  />
                </label>
                <button
                  className="primary-button"
                  type="button"
                  disabled={!draft.trim()}
                  onClick={handleSendMessage}
                >
                  Send to Admin
                </button>
              </div>
            </>
          ) : null}
        </div>
      </section>
    </Layout>
  );
}
