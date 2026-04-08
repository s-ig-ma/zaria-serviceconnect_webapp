export function Layout({ session, title, subtitle, onNavigate, onLogout, children }) {
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

      <main className="page-body">{children}</main>
    </div>
  );
}
