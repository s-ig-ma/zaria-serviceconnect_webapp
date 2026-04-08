import { request } from "./client";

export function getComplaintMessages(complaintId, counterpartUserId = null) {
  const search = counterpartUserId
    ? `?counterpart_user_id=${counterpartUserId}`
    : "";
  return request(`/messages/complaint/${complaintId}${search}`);
}

export function sendMessage(payload) {
  return request("/messages/", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
