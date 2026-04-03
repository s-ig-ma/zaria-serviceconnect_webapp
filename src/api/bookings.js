import { request } from "./client";

export function createBooking(payload) {
  return request("/bookings/", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getResidentBookings() {
  return request("/bookings/my/resident");
}

export function getProviderBookings() {
  return request("/bookings/my/provider");
}

export function updateBookingStatus(bookingId, payload) {
  return request(`/bookings/${bookingId}/status`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export function updateAvailability(availabilityStatus) {
  const params = new URLSearchParams({
    availability_status: availabilityStatus
  });

  return request(`/bookings/provider/availability?${params.toString()}`, {
    method: "PATCH"
  });
}
