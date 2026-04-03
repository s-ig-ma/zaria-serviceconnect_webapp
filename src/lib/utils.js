export function getDisplayServiceName(provider) {
  return provider?.service_name?.trim() || provider?.category?.name || "General Service";
}

export function formatDateLabel(value) {
  if (!value) {
    return "Not set";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export function formatDateTime(date, time) {
  return `${formatDateLabel(date)} at ${time || "Not set"}`;
}

export function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "SC";
}
