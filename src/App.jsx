import { useEffect, useMemo, useState } from "react";
import { getMyProfile } from "./api/auth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { clearSession, getSession, saveSession } from "./lib/session";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { BookingPage } from "./pages/resident/BookingPage";
import { ProviderProfilePage } from "./pages/resident/ProviderProfilePage";
import { ProvidersPage } from "./pages/resident/ProvidersPage";
import { ResidentBookingsPage } from "./pages/resident/ResidentBookingsPage";
import { ResidentHomePage } from "./pages/resident/ResidentHomePage";
import { ResidentMessagesPage } from "./pages/resident/ResidentMessagesPage";
import { ResidentNotificationsPage } from "./pages/resident/ResidentNotificationsPage";
import { ResidentProfilePage } from "./pages/resident/ResidentProfilePage";
import { ProviderDashboardPage } from "./pages/provider/ProviderDashboardPage";
import { ProviderHistoryPage } from "./pages/provider/ProviderHistoryPage";
import { ProviderMessagesPage } from "./pages/provider/ProviderMessagesPage";
import { ProviderNotificationsPage } from "./pages/provider/ProviderNotificationsPage";
import { ProviderProfileSettingsPage } from "./pages/provider/ProviderProfileSettingsPage";
import { ProviderRequestsPage } from "./pages/provider/ProviderRequestsPage";

function getCurrentLocation() {
  return {
    pathname: window.location.pathname,
    search: window.location.search
  };
}

function getHomeRouteForRole(role) {
  return role === "provider" ? "/provider" : "/resident";
}

export default function App() {
  const [session, setSession] = useState(getSession());
  const [route, setRoute] = useState(getCurrentLocation());
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    function handlePopState() {
      setRoute(getCurrentLocation());
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    async function validateSession() {
      const saved = getSession();

      if (!saved?.access_token) {
        setChecking(false);
        return;
      }

      try {
        const profile = await getMyProfile();
        if (profile.role === "admin") {
          clearSession();
          setSession(null);
        } else {
          const nextSession = { ...saved, role: profile.role, name: profile.name };
          saveSession(nextSession);
          setSession(nextSession);

          if (["/", "/login", "/register"].includes(window.location.pathname)) {
            window.history.replaceState({}, "", getHomeRouteForRole(profile.role));
            setRoute(getCurrentLocation());
          }
        }
      } catch (error) {
        clearSession();
        setSession(null);
      } finally {
        setChecking(false);
      }
    }

    validateSession();
  }, []);

  function navigate(path) {
    window.history.pushState({}, "", path);
    setRoute(getCurrentLocation());
  }

  function logout() {
    clearSession();
    setSession(null);
    navigate("/login");
  }

  function handleSessionUpdate(nextSession) {
    saveSession(nextSession);
    setSession(nextSession);
  }

  const page = useMemo(() => {
    const { pathname, search } = route;
    const searchParams = new URLSearchParams(search);

    if (pathname === "/") {
      return <LandingPage onNavigate={navigate} />;
    }

    if (pathname === "/login") {
      return <LoginPage onNavigate={navigate} onLoggedIn={setSession} />;
    }

    if (pathname === "/register") {
      return <RegisterPage onNavigate={navigate} />;
    }

    if (pathname === "/resident") {
      return (
        <ProtectedRoute session={session} role="resident" onRedirect={navigate}>
          <ResidentHomePage session={session} onNavigate={navigate} onLogout={logout} />
        </ProtectedRoute>
      );
    }

    if (pathname === "/resident/providers") {
      return (
        <ProtectedRoute session={session} role="resident" onRedirect={navigate}>
          <ProvidersPage
            session={session}
            onNavigate={navigate}
            onLogout={logout}
            searchParams={searchParams}
          />
        </ProtectedRoute>
      );
    }

    if (pathname.startsWith("/resident/providers/")) {
      const providerId = pathname.split("/").pop();

      return (
        <ProtectedRoute session={session} role="resident" onRedirect={navigate}>
          <ProviderProfilePage
            session={session}
            providerId={providerId}
            onNavigate={navigate}
            onLogout={logout}
          />
        </ProtectedRoute>
      );
    }

    if (pathname.startsWith("/resident/book/")) {
      const providerId = pathname.split("/").pop();

      return (
        <ProtectedRoute session={session} role="resident" onRedirect={navigate}>
          <BookingPage
            session={session}
            providerId={providerId}
            onNavigate={navigate}
            onLogout={logout}
          />
        </ProtectedRoute>
      );
    }

    if (pathname === "/resident/bookings") {
      return (
        <ProtectedRoute session={session} role="resident" onRedirect={navigate}>
          <ResidentBookingsPage session={session} onNavigate={navigate} onLogout={logout} />
        </ProtectedRoute>
      );
    }

    if (pathname === "/resident/messages") {
      return (
        <ProtectedRoute session={session} role="resident" onRedirect={navigate}>
          <ResidentMessagesPage session={session} onNavigate={navigate} onLogout={logout} />
        </ProtectedRoute>
      );
    }

    if (pathname === "/resident/notifications") {
      return (
        <ProtectedRoute session={session} role="resident" onRedirect={navigate}>
          <ResidentNotificationsPage session={session} onNavigate={navigate} onLogout={logout} />
        </ProtectedRoute>
      );
    }

    if (pathname === "/resident/profile") {
      return (
        <ProtectedRoute session={session} role="resident" onRedirect={navigate}>
          <ResidentProfilePage
            session={session}
            onNavigate={navigate}
            onLogout={logout}
            onSessionUpdate={handleSessionUpdate}
          />
        </ProtectedRoute>
      );
    }

    if (pathname === "/provider") {
      return (
        <ProtectedRoute session={session} role="provider" onRedirect={navigate}>
          <ProviderDashboardPage session={session} onNavigate={navigate} onLogout={logout} />
        </ProtectedRoute>
      );
    }

    if (pathname === "/provider/requests") {
      return (
        <ProtectedRoute session={session} role="provider" onRedirect={navigate}>
          <ProviderRequestsPage session={session} onNavigate={navigate} onLogout={logout} />
        </ProtectedRoute>
      );
    }

    if (pathname === "/provider/history") {
      return (
        <ProtectedRoute session={session} role="provider" onRedirect={navigate}>
          <ProviderHistoryPage session={session} onNavigate={navigate} onLogout={logout} />
        </ProtectedRoute>
      );
    }

    if (pathname === "/provider/messages") {
      return (
        <ProtectedRoute session={session} role="provider" onRedirect={navigate}>
          <ProviderMessagesPage session={session} onNavigate={navigate} onLogout={logout} />
        </ProtectedRoute>
      );
    }

    if (pathname === "/provider/notifications") {
      return (
        <ProtectedRoute session={session} role="provider" onRedirect={navigate}>
          <ProviderNotificationsPage session={session} onNavigate={navigate} onLogout={logout} />
        </ProtectedRoute>
      );
    }

    if (pathname === "/provider/profile") {
      return (
        <ProtectedRoute session={session} role="provider" onRedirect={navigate}>
          <ProviderProfileSettingsPage
            session={session}
            onNavigate={navigate}
            onLogout={logout}
            onSessionUpdate={handleSessionUpdate}
          />
        </ProtectedRoute>
      );
    }

    return <LandingPage onNavigate={navigate} />;
  }, [route, session]);

  if (checking) {
    return <div className="loading-screen">Checking saved session...</div>;
  }

  return page;
}
