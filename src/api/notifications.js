import { request } from "./client";

export function getMyNotifications() {
  return request("/notifications/my");
}

export function markNotificationRead(notificationId) {
  return request(`/notifications/${notificationId}/read`, {
    method: "PATCH"
  });
}

export function markAllNotificationsRead() {
  return request("/notifications/read-all", {
    method: "PATCH"
  });
}
