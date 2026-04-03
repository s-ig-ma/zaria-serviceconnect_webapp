export function StatusBadge({ status, tone = "default" }) {
  const key = `${tone}-${status || "default"}`;
  return <span className={`status-badge ${key}`}>{formatLabel(status)}</span>;
}

function formatLabel(value = "unknown") {
  return value.replaceAll("_", " ");
}
