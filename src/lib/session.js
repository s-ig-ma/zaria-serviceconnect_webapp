const SESSION_KEY = "zaria_web_session";

export function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function getToken() {
  return getSession()?.access_token || "";
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
