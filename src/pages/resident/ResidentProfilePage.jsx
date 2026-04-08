import { useEffect, useState } from "react";
import { getMyUserProfile, updateMyUserProfile } from "../../api/users";
import { Layout } from "../../components/Layout";
import { getImageUrl } from "../../lib/images";

export function ResidentProfilePage({ session, onNavigate, onLogout, onSessionUpdate }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    home_address: "",
    profile_photo: null
  });
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const profile = await getMyUserProfile();
        setForm((current) => ({
          ...current,
          name: profile.name || "",
          phone: profile.phone || "",
          location: profile.location || "",
          home_address: profile.home_address || ""
        }));
        setPreview(getImageUrl(profile.profile_photo));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setSaving(true);
      setMessage("");
      setError("");
      const updated = await updateMyUserProfile(form);
      setMessage("Profile updated successfully.");
      setPreview(getImageUrl(updated.profile_photo));
      onSessionUpdate?.({ ...session, name: updated.name });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout
      session={session}
      title="My Profile"
      subtitle="Update your account details, profile photo, and home address."
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <form className="panel" onSubmit={handleSubmit}>
        {loading ? <p className="muted">Loading profile...</p> : null}
        {message ? <div className="message success">{message}</div> : null}
        {error ? <div className="message error">{error}</div> : null}

        {preview ? <img className="profile-photo-preview" src={preview} alt="Profile" /> : null}

        <div className="form-grid">
          <label>
            Full Name
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </label>
          <label>
            Phone
            <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          </label>
          <label>
            Area / Location
            <input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} />
          </label>
          <label className="full-width">
            Home Address in Zaria
            <textarea rows="3" value={form.home_address} onChange={(event) => setForm({ ...form, home_address: event.target.value })} />
          </label>
          <label className="full-width">
            Profile Picture
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(event) => setForm({ ...form, profile_photo: event.target.files?.[0] || null })}
            />
          </label>
        </div>

        <div className="button-row">
          <button className="primary-button" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </button>
          <button className="ghost-button danger" type="button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </form>
    </Layout>
  );
}
