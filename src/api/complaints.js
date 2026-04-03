import { request } from "./client";

export function submitComplaint(payload) {
  return request("/complaints/", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getMyComplaints() {
  return request("/complaints/my");
}
