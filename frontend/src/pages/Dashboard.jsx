import { useApp } from "../context/AppContext.jsx";

const STATUS_COLOR = { pendiente: "#fd7e14", confirmada: "#198754", cancelada: "#dc3545", completada: "#0dcaf0" };

export default function Dashboard() {
  const { patients, appointments, doctors, loading } = useApp();

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  const stats = [
    { label: "Pacientes registrados", value: patients.length,     icon: "👤", color: "var(--clr-primary)" },
    { label: "Citas totales",         value: appointments.length, icon: "📅", color: "var(--clr-accent)"  },
    { label: "Doctores disponibles",  value: doctors.length,      icon: "🩺", color: "#6f42c1"            },
    { label: "Citas pendientes",
      value: appointments.filter(a => a.estado === "pendiente").length,
      icon: "⏳", color: "var(--clr-warning)" },
  ];

  const recent = [...appointments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Resumen general del sistema de agendación</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {stats.map(s => (
          <div key={s.label} className="card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: ".8rem", color: "var(--clr-muted)", fontWeight: 600, marginBottom: ".4rem" }}>{s.label}</div>
                <div style={{ fontSize: "2rem", fontFamily: "var(--font-display)", fontWeight: 700, color: s.color }}>{s.value}</div>
              </div>
              <span style={{ fontSize: "2rem" }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recientes */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {/* Últimas citas */}
        <div className="card">
          <div className="card-header">
            <span>📅</span>
            <span className="section-title">Citas recientes</span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {recent.length === 0
              ? <div className="empty-state"><span>📋</span>Sin citas registradas</div>
              : recent.map(a => (
                <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".9rem 1.25rem", borderBottom: "1px solid var(--clr-border)" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: ".875rem" }}>{a.patientName}</div>
                    <div style={{ fontSize: ".78rem", color: "var(--clr-muted)" }}>{a.fecha} · {a.hora} · {a.doctorName}</div>
                  </div>
                  <span className={`badge badge-${a.estado}`}>{a.estado}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Doctores */}
        <div className="card">
          <div className="card-header">
            <span>🩺</span>
            <span className="section-title">Equipo médico</span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {doctors.map(d => (
              <div key={d.id} style={{ display: "flex", alignItems: "center", gap: ".75rem", padding: ".9rem 1.25rem", borderBottom: "1px solid var(--clr-border)" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(13,110,253,.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>
                  👨‍⚕️
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: ".875rem" }}>{d.name}</div>
                  <div style={{ fontSize: ".78rem", color: "var(--clr-muted)" }}>{d.specialty}</div>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <span style={{ background: "rgba(13,110,253,.09)", color: "var(--clr-primary)", borderRadius: 999, padding: ".2rem .6rem", fontSize: ".72rem", fontWeight: 600 }}>
                    {appointments.filter(a => a.doctorId === d.id).length} citas
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pattern info banner */}
      <div style={{ marginTop: "1.5rem", background: "rgba(13,110,253,.06)", border: "1.5px solid rgba(13,110,253,.15)", borderRadius: "var(--radius-lg)", padding: "1.25rem 1.5rem" }}>
        <div style={{ fontWeight: 700, marginBottom: ".5rem", color: "var(--clr-primary)" }}>🏗️ Patrones de diseño implementados</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", fontSize: ".875rem" }}>
          <div><strong>🔒 Singleton (Backend)</strong> — Una única instancia de la base de datos en memoria garantiza consistencia global.</div>
          <div><strong>🏭 Factory Method (Backend)</strong> — EntityFactory.create() decide qué clase instanciar (Patient | Appointment) según el tipo.</div>
          <div><strong>🔒 Singleton (Frontend)</strong> — NotificationStore garantiza un único canal de notificaciones para toda la app.</div>
          <div><strong>🗂️ MVC</strong> — Routes → Controllers → Models con separación clara de responsabilidades.</div>
        </div>
      </div>
    </div>
  );
}
