import { useEffect } from "react";

export function ProtectedRoute({ session, role, onRedirect, children }) {
  useEffect(() => {
    if (!session) {
      onRedirect("/login");
      return;
    }

    if (role && session.role !== role) {
      onRedirect(session.role === "provider" ? "/provider" : "/resident");
    }
  }, [onRedirect, role, session]);

  if (!session) {
    return null;
  }

  if (role && session.role !== role) {
    return null;
  }

  return children;
}
