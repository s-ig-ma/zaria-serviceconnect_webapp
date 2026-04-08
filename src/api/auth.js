import { request } from "./client";

export function login(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

export function registerResident(payload) {
  return request("/auth/register/resident", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function registerProvider(payload) {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("email", payload.email);
  formData.append("phone", payload.phone);
  formData.append("password", payload.password);
  formData.append("location", payload.location || "");
  formData.append("years_of_experience", String(payload.years_of_experience || 0));
  formData.append("description", payload.description || "");
  formData.append("has_shop_in_zaria", String(Boolean(payload.has_shop_in_zaria)));
  formData.append("shop_address", payload.shop_address || "");

  if (payload.category_id) {
    formData.append("category_id", String(payload.category_id));
  }

  if (payload.service_name) {
    formData.append("service_name", payload.service_name);
  }

  formData.append("passport_photo", payload.passport_photo);
  formData.append("id_document", payload.id_document);
  formData.append("skill_proof", payload.skill_proof);

  return request("/auth/register/provider", {
    method: "POST",
    body: formData
  });
}

export function getMyProfile() {
  return request("/auth/me");
}
