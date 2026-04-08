import { request } from "./client";

export function getMyUserProfile() {
  return request("/users/me");
}

export function updateMyUserProfile(payload) {
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

  return request("/users/me", {
    method: "PATCH",
    body: formData
  });
}
