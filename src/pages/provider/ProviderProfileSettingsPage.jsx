import { useEffect, useState } from "react";
import { getMyProviderProfile, updateMyProviderProfile } from "../../api/providers";
import { Layout } from "../../components/Layout";
import { getImageUrl } from "../../lib/images";

export function ProviderProfileSettingsPage({ session, onNavigate, onLogout, onSessionUpdate }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    service_name: "",
    years_of_experience: 0,
    description: "",
    has_shop_in_zaria: false,
    shop_address: "",
    profile_photo: null,
    passport_photo: null,
    id_document: null,
    skill_proof: null
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
        const profile = await getMyProviderProfile();
        setForm((current) => ({
          ...current,
          name: profile.user?.name || "",
          phone: profile.user?.phone || "",
          location: profile.location || "",
          service_name: profile.service_name || "",
          years_of_experience: profile.years_of_experience || 0,
          description: profile.description || "",
          has_shop_in_zaria: Boolean(profile.has_shop_in_zaria),
          shop_address: profile.shop_address || ""
        }));
        setPreview(getImageUrl(profile.user?.profile_photo));
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
      const updated = await updateMyProviderProfile(form);
      setMessage("Provider profile updated successfully.");
      setPreview(getImageUrl(updated.user?.profile_photo));
      onSessionUpdate?.({ ...session, name: updated.user?.name || session.name });
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
      subtitle="Update your public profile, verification files, photo, and shop details."
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
            Location
            <input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} />
          </label>
          <label>
            Service Name
            <input value={form.service_name} onChange={(event) => setForm({ ...form, service_name: event.target.value })} />
          </label>
          <label>
            Years of Experience
            <input
              type="number"
              min="0"
              value={form.years_of_experience}
              onChange={(event) => setForm({ ...form, years_of_experience: Number(event.target.value || 0) })}
            />
          </label>
          <label className="full-width">
            Description
            <textarea rows="3" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </label>
          <label className="full-width checkbox-row">
            <input
              type="checkbox"
              checked={form.has_shop_in_zaria}
              onChange={(event) =>
                setForm({
                  ...form,
                  has_shop_in_zaria: event.target.checked,
                  shop_address: event.target.checked ? form.shop_address : ""
                })
              }
            />
            <span>I own a shop in Zaria</span>
          </label>
          {form.has_shop_in_zaria ? (
            <label className="full-width">
              Shop Address
              <input value={form.shop_address} onChange={(event) => setForm({ ...form, shop_address: event.target.value })} />
            </label>
          ) : null}
          <label className="full-width">
            Profile Picture
            <input type="file" accept=".jpg,.jpeg,.png" onChange={(event) => setForm({ ...form, profile_photo: event.target.files?.[0] || null })} />
          </label>
          <label>
            Passport Photograph
            <input type="file" accept=".jpg,.jpeg,.png" onChange={(event) => setForm({ ...form, passport_photo: event.target.files?.[0] || null })} />
          </label>
          <label>
            ID Document
            <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(event) => setForm({ ...form, id_document: event.target.files?.[0] || null })} />
          </label>
          <label className="full-width">
            Skill Proof
            <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(event) => setForm({ ...form, skill_proof: event.target.files?.[0] || null })} />
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
