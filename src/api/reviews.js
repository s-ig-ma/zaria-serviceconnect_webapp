import { request } from "./client";

export function getProviderReviews(providerId) {
  return request(`/reviews/provider/${providerId}`);
}

export function submitReview(payload) {
  return request("/reviews/", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
