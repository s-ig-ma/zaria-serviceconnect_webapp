import { useEffect, useState } from "react";
import { registerProvider, registerResident } from "../api/auth";
import { getCategories } from "../api/providers";

const initialResidentForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  location: "",
  home_address: ""
};

const initialProviderForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  location: "",
  category_id: "",
  service_name: "",
  years_of_experience: 0,
  description: "",
  has_shop_in_zaria: false,
  shop_address: "",
  passport_photo: null,
  id_document: null,
  skill_proof: null
};

export function RegisterPage({ onNavigate }) {
  const [mode, setMode] = useState("resident");
  const [categories, setCategories] = useState([]);
  const [residentForm, setResidentForm] = useState(initialResidentForm);
  const [providerForm, setProviderForm] = useState(initialProviderForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  async function handleResidentSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await registerResident(residentForm);
      setMessage(response.message);
      setResidentForm(initialResidentForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleProviderSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await registerProvider({
        ...providerForm,
        category_id: providerForm.category_id ? Number(providerForm.category_id) : null
      });
      setMessage(response.message);
      setProviderForm(initialProviderForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card wide">
        <div className="segmented">
          <button
            className={mode === "resident" ? "segment active" : "segment"}
            onClick={() => setMode("resident")}
            type="button"
          >
            Resident
          </button>
          <button
            className={mode === "provider" ? "segment active" : "segment"}
            onClick={() => setMode("provider")}
            type="button"
          >
            Provider
          </button>
        </div>

        {mode === "resident" ? (
          <form onSubmit={handleResidentSubmit}>
            <span className="eyebrow">Resident Registration</span>
            <h1>Create a resident account</h1>
            <p>Residents can find providers, create bookings, and manage service history.</p>

            <div className="form-grid">
              <label>
                Full Name
                <input
                  value={residentForm.name}
                  onChange={(event) =>
                    setResidentForm({ ...residentForm, name: event.target.value })
                  }
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={residentForm.email}
                  onChange={(event) =>
                    setResidentForm({ ...residentForm, email: event.target.value })
                  }
                />
              </label>

              <label>
                Phone
                <input
                  value={residentForm.phone}
                  onChange={(event) =>
                    setResidentForm({ ...residentForm, phone: event.target.value })
                  }
                />
              </label>

              <label>
                Area / Location
                <input
                  value={residentForm.location}
                  onChange={(event) =>
                    setResidentForm({ ...residentForm, location: event.target.value })
                  }
                />
              </label>

              <label className="full-width">
                Home Address in Zaria
                <input
                  value={residentForm.home_address}
                  onChange={(event) =>
                    setResidentForm({ ...residentForm, home_address: event.target.value })
                  }
                  placeholder="House address the provider can use during bookings"
                />
              </label>

              <label className="full-width">
                Password
                <input
                  type="password"
                  value={residentForm.password}
                  onChange={(event) =>
                    setResidentForm({ ...residentForm, password: event.target.value })
                  }
                />
              </label>
            </div>

            {message ? <div className="message success">{message}</div> : null}
            {error ? <div className="message error">{error}</div> : null}

            <button
              className="primary-button"
              type="submit"
              disabled={
                loading ||
                !residentForm.name.trim() ||
                !residentForm.email.trim() ||
                !residentForm.phone.trim() ||
                residentForm.password.length < 6
              }
            >
              {loading ? "Creating account..." : "Create Resident Account"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleProviderSubmit}>
            <span className="eyebrow">Provider Registration</span>
            <h1>Create a provider account</h1>
            <p>Choose a category or add a custom service name, then upload your verification files.</p>

            <div className="form-grid">
              <label>
                Full Name
                <input
                  value={providerForm.name}
                  onChange={(event) =>
                    setProviderForm({ ...providerForm, name: event.target.value })
                  }
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={providerForm.email}
                  onChange={(event) =>
                    setProviderForm({ ...providerForm, email: event.target.value })
                  }
                />
              </label>

              <label>
                Phone
                <input
                  value={providerForm.phone}
                  onChange={(event) =>
                    setProviderForm({ ...providerForm, phone: event.target.value })
                  }
                />
              </label>

              <label>
                Location
                <input
                  value={providerForm.location}
                  onChange={(event) =>
                    setProviderForm({ ...providerForm, location: event.target.value })
                  }
                />
              </label>

              <label>
                Service Category
                <select
                  value={providerForm.category_id}
                  onChange={(event) =>
                    setProviderForm({ ...providerForm, category_id: event.target.value })
                  }
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Custom Service Name
                <input
                  value={providerForm.service_name}
                  onChange={(event) =>
                    setProviderForm({ ...providerForm, service_name: event.target.value })
                  }
                  placeholder="Optional if category is selected"
                />
              </label>

              <label>
                Years of Experience
                <input
                  type="number"
                  min="0"
                  value={providerForm.years_of_experience}
                  onChange={(event) =>
                    setProviderForm({
                      ...providerForm,
                      years_of_experience: Number(event.target.value || 0)
                    })
                  }
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={providerForm.password}
                  onChange={(event) =>
                    setProviderForm({ ...providerForm, password: event.target.value })
                  }
                />
              </label>

              <label className="full-width">
                About Your Service
                <textarea
                  rows="4"
                  value={providerForm.description}
                  onChange={(event) =>
                    setProviderForm({ ...providerForm, description: event.target.value })
                  }
                />
              </label>

              <label className="full-width">
                Passport Photograph
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(event) =>
                    setProviderForm({
                      ...providerForm,
                      passport_photo: event.target.files?.[0] || null
                    })
                  }
                />
              </label>

              <label className="full-width">
                ID Document
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(event) =>
                    setProviderForm({
                      ...providerForm,
                      id_document: event.target.files?.[0] || null
                    })
                  }
                />
              </label>

              <label className="full-width">
                Skill Proof / Certificate
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(event) =>
                    setProviderForm({
                      ...providerForm,
                      skill_proof: event.target.files?.[0] || null
                    })
                  }
                />
              </label>

              <label className="full-width checkbox-row">
                <input
                  type="checkbox"
                  checked={providerForm.has_shop_in_zaria}
                  onChange={(event) =>
                    setProviderForm({
                      ...providerForm,
                      has_shop_in_zaria: event.target.checked,
                      shop_address: event.target.checked ? providerForm.shop_address : ""
                    })
                  }
                />
                <span>I own a shop in Zaria</span>
              </label>

              {providerForm.has_shop_in_zaria ? (
                <label className="full-width">
                  Shop Address in Zaria
                  <input
                    value={providerForm.shop_address}
                    onChange={(event) =>
                      setProviderForm({ ...providerForm, shop_address: event.target.value })
                    }
                  />
                </label>
              ) : null}
            </div>

            {message ? <div className="message success">{message}</div> : null}
            {error ? <div className="message error">{error}</div> : null}

            <button
              className="primary-button"
              type="submit"
              disabled={
                loading ||
                !providerForm.name.trim() ||
                !providerForm.email.trim() ||
                !providerForm.phone.trim() ||
                providerForm.password.length < 6 ||
                (!providerForm.category_id && !providerForm.service_name.trim()) ||
                !providerForm.passport_photo ||
                !providerForm.id_document ||
                !providerForm.skill_proof ||
                (providerForm.has_shop_in_zaria && !providerForm.shop_address.trim())
              }
            >
              {loading ? "Submitting..." : "Create Provider Account"}
            </button>
          </form>
        )}

        <button className="text-button" type="button" onClick={() => onNavigate("/login")}>
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}
