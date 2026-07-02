import { NavLink }  from "react-router-dom";
import { useAuth }  from "../../context/AuthContext.jsx";

const ALL_LINKS = [
  { to: "/",             label: "Dashboard",  icon: "🏠", roles: ["ADMINISTRADOR", "AYUDANTE"] },
  { to: "/patients",     label: "Pacientes",  icon: "👤", roles: ["ADMINISTRADOR", "AYUDANTE"] },
  { to: "/appointments", label: "Agendar cita", icon: "📅", roles: ["AYUDANTE"] },
];

const ROLE_COLORS = {
  ADMINISTRADOR: { bg: "rgba(13,110,253,.12)", color: "var(--clr-primary)" },
  AYUDANTE:      { bg: "rgba(25,135,84,.12)",  color: "var(--clr-accent)"  },
};

export default function Sidebar() {
  const { user, role, logout } = useAuth();
  const links = ALL_LINKS.filter(l => !role || l.roles.includes(role));
  const rc = ROLE_COLORS[role] || {};

  return (
    <aside style={{
      width: 230, background: "#fff", borderRight: "1px solid var(--clr-border)",
      display: "flex", flexDirection: "column", minHeight: "100vh",
      padding: "1.5rem 0",
    }}>
      {/* Logo */}
      <div style={{ padding: "0 1.5rem 1.25rem", borderBottom: "1px solid var(--clr-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".6rem", marginBottom: ".85rem" }}>
          <span style={{ fontSize: "1.6rem" }}>🏥</span>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "var(--clr-primary)" }}>FiCitas</div>
            <div style={{ fontSize: ".7rem", color: "var(--clr-muted)" }}>Sistema de Agendación</div>
          </div>
        </div>

        {/* Usuario logueado */}
        {user && (
          <div style={{
            background: "var(--clr-bg)", borderRadius: "var(--radius)",
            padding: ".6rem .85rem", display: "flex", alignItems: "center", gap: ".5rem",
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: rc.bg || "var(--clr-bg)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1rem", flexShrink: 0,
            }}>
              {role === "ADMINISTRADOR" ? "👨‍💼" : "🧑‍⚕️"}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: ".8rem", color: "var(--clr-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.displayName}
              </div>
              <div style={{
                fontSize: ".67rem", fontWeight: 700, letterSpacing: ".04em",
                color: rc.color || "var(--clr-muted)", textTransform: "uppercase",
              }}>
                {user.role}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ padding: "1rem .75rem", flex: 1 }}>
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to} to={to} end={to === "/"}
            style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: ".65rem",
              padding: ".6rem .85rem", borderRadius: "var(--radius)",
              marginBottom: ".2rem", textDecoration: "none",
              fontWeight: 500, fontSize: ".9rem",
              color:      isActive ? "var(--clr-primary)" : "var(--clr-text)",
              background: isActive ? "rgba(13,110,253,.09)" : "transparent",
              transition: "background var(--transition)",
            })}
          >
            <span style={{ fontSize: "1.1rem" }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: ".75rem 1rem", borderTop: "1px solid var(--clr-border)", display: "flex", flexDirection: "column", gap: ".5rem" }}>
        <button
          id="sidebar-logout-btn"
          className="btn btn-outline btn-sm"
          onClick={logout}
          style={{ width: "100%", justifyContent: "center", color: "var(--clr-danger)", borderColor: "var(--clr-danger)" }}
        >
          🚪 Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

