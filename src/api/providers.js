import { request } from "./client";

export function getCategories() {
  return request("/categories/");
}

export function getProviders({ categoryId, userLat, userLon } = {}) {
  const params = new URLSearchParams();

  if (categoryId) {
    params.set("category_id", String(categoryId));
  }

  if (userLat != null) {
    params.set("user_lat", String(userLat));
  }

  if (userLon != null) {
    params.set("user_lon", String(userLon));
  }

  const query = params.toString();
  return request(`/providers/${query ? `?${query}` : ""}`);
}

export function searchProviders({ query, userLat, userLon }) {
  const params = new URLSearchParams({ q: query });

  if (userLat != null) {
    params.set("user_lat", String(userLat));
  }

  if (userLon != null) {
    params.set("user_lon", String(userLon));
  }

  return request(`/providers/search?${params.toString()}`);
}

export function getProviderById(providerId) {
  return request(`/providers/${providerId}`);
}

export function getMyProviderProfile() {
  return request("/providers/me/profile");
}

export function updateMyProviderProfile(payload) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value == null) {
      return;
    }
    if (value instanceof File) {
      formData.append(key, value);
      return;
    }
    formData.append(key, String(value));
  });

  return request("/providers/me/profile", {
    method: "PATCH",
    body: formData
  });
}
