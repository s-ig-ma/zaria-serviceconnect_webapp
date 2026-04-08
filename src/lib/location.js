const LOCATION_KEY = "zaria_web_location";

export function getSavedLocation() {
  const raw = localStorage.getItem(LOCATION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveLocation(location) {
  localStorage.setItem(LOCATION_KEY, JSON.stringify(location));
}

export function loadBrowserLocation() {
  const saved = getSavedLocation();
  if (saved?.latitude != null && saved?.longitude != null) {
    return Promise.resolve(saved);
  }

  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        saveLocation(nextLocation);
        resolve(nextLocation);
      },
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 }
    );
  });
}
