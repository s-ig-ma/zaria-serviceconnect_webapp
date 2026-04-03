import { API_BASE_URL } from "../config";
import { getToken } from "../lib/session";

export async function request(path, options = {}) {
  const headers = {
    ...(options.headers || {})
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || data.message || "Request failed.");
  }

  return data;
}
