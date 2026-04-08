import { useState } from "react";
import { login } from "../api/auth";
import { saveSession } from "../lib/session";

function getHomeRouteForRole(role) {
  return role === "provider" ? "/provider" : "/resident";
}

export function LoginPage({ onNavigate, onLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const session = await login(email.trim(), password);
      if (session.role === "admin") {
        throw new Error("This web app is for resident and provider accounts only.");
      }

      saveSession(session);
      onLoggedIn(session);
      onNavigate(getHomeRouteForRole(session.role));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={handleSubmit}>
        <span className="eyebrow">Welcome back</span>
        <h1>Login to your account</h1>
        <p>Use your existing resident or provider account from the backend.</p>

        <label>
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
        </label>

        <label>
          Password
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
          />
        </label>

        {error ? <div className="message error">{error}</div> : null}

        <button
          className="primary-button"
          type="submit"
          disabled={loading || !email.trim() || !password}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button className="text-button" type="button" onClick={() => onNavigate("/register")}>
          Need an account? Register
        </button>
      </form>
    </div>
  );
}
