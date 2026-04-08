import { API_BASE_URL } from "../config";
import { getToken } from "../lib/session";

function extractErrorMessage(payload) {
  if (!payload) {
    return "Request failed.";
  }

  const raw = payload.detail ?? payload.message ?? payload.error;
  if (typeof raw === "string" && raw.trim()) {
    return raw;
  }

  if (Array.isArray(raw) && raw.length) {
    const first = raw[0];
    if (typeof first === "string") {
      return first;
    }
    if (first?.msg) {
      return first.msg;
    }
  }

  if (raw && typeof raw === "object") {
    if (raw.msg) {
      return raw.msg;
    }
    if (raw.message) {
      return raw.message;
    }
  }

  return "Request failed.";
}

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
    throw new Error(extractErrorMessage(data));
  }

  return data;
}
