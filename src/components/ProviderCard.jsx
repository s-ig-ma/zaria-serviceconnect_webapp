import { getDisplayServiceName, getInitials } from "../lib/utils";
import { getImageUrl } from "../lib/images";
import { StatusBadge } from "./StatusBadge";

export function ProviderCard({ provider, onView, compact = false }) {
  const imageUrl = getImageUrl(provider.user?.profile_photo);

  return (
    <article className={`provider-card ${compact ? "compact" : ""}`}>
      <div className="provider-card-header">
        {imageUrl ? (
          <img className="avatar avatar-image" src={imageUrl} alt={provider.user?.name || "Provider"} />
        ) : (
          <div className="avatar">{getInitials(provider.user?.name)}</div>
        )}
        <div>
          <h3>{provider.user?.name}</h3>
          <p>{getDisplayServiceName(provider)}</p>
        </div>
      </div>

      <div className="provider-meta">
        <StatusBadge status={provider.availability_status || "available"} tone="availability" />
        <span>{provider.average_rating || 0} stars</span>
        <span>{provider.years_of_experience || 0} yrs exp</span>
      </div>

      <p className="muted">{provider.location || "Location not set"}</p>
      {provider.distance_km != null ? (
        <p className="muted">
          {provider.distance_km < 1
            ? `${Math.round(provider.distance_km * 1000)}m away`
            : `${provider.distance_km.toFixed(1)}km away`}
        </p>
      ) : null}
      <p className="provider-description">
        {provider.description || "No provider description yet."}
      </p>

      <button className="primary-button secondary" onClick={onView}>
        View Profile
      </button>
    </article>
  );
}
