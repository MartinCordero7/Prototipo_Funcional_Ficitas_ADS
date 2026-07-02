import { useApp }  from "../context/AppContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const STATUS_COLOR = { pendiente: "#fd7e14", confirmada: "#198754", cancelada: "#dc3545", completada: "#0dcaf0" };

export default function Dashboard() {
  const { patients, appointments, doctors, loading, updateAppointment } = useApp();
  const { role } = useAuth();

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
  const pending = appointments.filter(a => a.estado === "pendiente").sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  const confirmAppt = async (id) => {
    try { await updateAppointment(id, { estado: "confirmada" }); }
    catch (err) { alert(err.message); }
  };

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

      {/* ── ADMINISTRADOR: Citas pendientes ──────────────────────────────────── */}
      {role === "ADMINISTRADOR" && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <div className="card-header" style={{ background: "rgba(253,126,20,.06)" }}>
            <span>⏳</span>
            <span className="section-title" style={{ color: "var(--clr-warning)" }}>
              Citas pendientes de revisión
            </span>
            <span style={{
              marginLeft: "auto", background: "#fff3cd", color: "#856404",
              borderRadius: 999, padding: ".18rem .65rem", fontSize: ".72rem", fontWeight: 700,
            }}>
              {pending.length} pendiente{pending.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {pending.length === 0 ? (
              <div className="empty-state">
                <span>✅</span>No hay citas pendientes
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Paciente</th><th>Doctor</th><th>Especialidad</th>
                      <th>Fecha</th><th>Hora</th><th>Motivo</th><th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pending.map(a => (
                      <tr key={a.id}>
                        <td style={{ fontWeight: 600 }}>{a.patientName}</td>
                        <td>{a.doctorName}</td>
                        <td style={{ color: "var(--clr-muted)", fontSize: ".83rem" }}>{a.doctorSpecialty}</td>
                        <td>{a.fecha}</td>
                        <td>{a.hora}</td>
                        <td style={{ color: "var(--clr-muted)", fontSize: ".83rem" }}>{a.motivo || "—"}</td>
                        <td>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => confirmAppt(a._id)}
                          >
                            ✓ Confirmar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recientes + Doctores */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
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


    </div>
  );
}

