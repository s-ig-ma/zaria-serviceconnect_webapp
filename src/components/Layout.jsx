import { useEffect, useRef, useState } from "react";

export function Layout({ session, title, subtitle, onNavigate, onLogout, children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileNavRef = useRef(null);
  const role = session?.role;
  const residentLinks = [
    { label: "Home", path: "/resident" },
    { label: "Providers", path: "/resident/providers" },
    { label: "My Bookings", path: "/resident/bookings" },
    { label: "Messages", path: "/resident/messages" },
    { label: "Notifications", path: "/resident/notifications" },
    { label: "Profile", path: "/resident/profile" }
  ];
  const providerLinks = [
    { label: "Dashboard", path: "/provider" },
    { label: "Requests", path: "/provider/requests" },
    { label: "History", path: "/provider/history" },
    { label: "Messages", path: "/provider/messages" },
    { label: "Notifications", path: "/provider/notifications" },
    { label: "Profile", path: "/provider/profile" }
  ];
  const links = role === "provider" ? providerLinks : residentLinks;
  const currentPath = window.location.pathname;

  useEffect(() => {
    function handleOutsideClick(event) {
      if (!mobileNavRef.current?.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  function handleNavigate(path) {
    setIsMobileMenuOpen(false);
    onNavigate(path);
  }

  function handleLogout() {
    setIsMobileMenuOpen(false);
    onLogout();
  }

  function isActivePath(path) {
    return (
      currentPath === path ||
      (path !== "/resident" && path !== "/provider" && currentPath.startsWith(`${path}/`))
    );
  }

  return (
    <div className="shell">
      <header className="hero-bar">
        <div className="hero-copy">
          <span className="eyebrow">Zaria ServiceConnect</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        <div className="hero-actions">
          <div className="user-pill">
            <strong>{session?.name}</strong>
            <span>{role}</span>
          </div>
          <button className="ghost-button light" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <nav className="page-nav">
        {links.map((link) => (
          <button key={link.path} className="nav-link" onClick={() => onNavigate(link.path)}>
            {link.label}
          </button>
        ))}
      </nav>

      <div className="mobile-nav" ref={mobileNavRef}>
        <button
          className={`mobile-menu-toggle ${isMobileMenuOpen ? "open" : ""}`}
          type="button"
          aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
        >
          <span className="mobile-menu-icon" aria-hidden="true" />
        </button>

        {isMobileMenuOpen && (
          <div className="mobile-menu">
            {links.map((link) => (
              <button
                key={link.path}
                className={`mobile-menu-link ${isActivePath(link.path) ? "active" : ""}`}
                type="button"
                onClick={() => handleNavigate(link.path)}
              >
                {link.label}
              </button>
            ))}
            <button className="mobile-menu-link danger" type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>

      <main className="page-body">{children}</main>
    </div>
  );
}
