import { NavLink } from "react-router-dom";

const links = [
  { to: "/",             label: "Dashboard",  icon: "🏠" },
  { to: "/patients",     label: "Pacientes",  icon: "👤" },
  { to: "/appointments", label: "Citas",      icon: "📅" },
];

export default function Sidebar() {
  return (
    <aside style={{
      width: 220, background: "#fff", borderRight: "1px solid var(--clr-border)",
      display: "flex", flexDirection: "column", minHeight: "100vh",
      padding: "1.5rem 0",
    }}>
      {/* Logo */}
      <div style={{ padding: "0 1.5rem 1.5rem", borderBottom: "1px solid var(--clr-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
          <span style={{ fontSize: "1.6rem" }}>🏥</span>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "var(--clr-primary)" }}>FiCitas</div>
            <div style={{ fontSize: ".7rem", color: "var(--clr-muted)" }}>Sistema de Agendación</div>
          </div>
        </div>
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
              color: isActive ? "var(--clr-primary)" : "var(--clr-text)",
              background: isActive ? "rgba(13,110,253,.09)" : "transparent",
              transition: "background var(--transition)",
            })}
          >
            <span style={{ fontSize: "1.1rem" }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: ".75rem 1.5rem", borderTop: "1px solid var(--clr-border)" }}>
        <div style={{ fontSize: ".7rem", color: "var(--clr-muted)", lineHeight: 1.5 }}>
          <strong>MVC + Singleton + Factory</strong><br />
          Patrones de diseño aplicados
        </div>
      </div>
    </aside>
  );
}
