import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import Modal from "../components/shared/Modal.jsx";
import AppointmentForm from "../components/forms/AppointmentForm.jsx";

const ESTADOS = ["todos", "pendiente", "confirmada", "cancelada", "completada"];

export default function Appointments() {
  const { appointments, updateAppointment, deleteAppointment, loading } = useApp();
  const [showForm, setShowForm]   = useState(false);
  const [filter,   setFilter]     = useState("todos");
  const [search,   setSearch]     = useState("");

  const filtered = appointments.filter(a => {
    const matchEstado  = filter === "todos" || a.estado === filter;
    const matchSearch  = `${a.patientName} ${a.doctorName} ${a.motivo}`.toLowerCase().includes(search.toLowerCase());
    return matchEstado && matchSearch;
  });

  const changeStatus = async (id, newEstado) => {
    try { await updateAppointment(id, { estado: newEstado }); }
    catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Cancelar esta cita?")) return;
    try { await deleteAppointment(id); }
    catch (err) { alert(err.message); }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem" }}>
        <div>
          <h1 className="page-title">Citas</h1>
          <p className="page-subtitle">{appointments.length} citas en el sistema</p>
        </div>
        <button className="btn btn-success" onClick={() => setShowForm(true)}>
          + Agendar cita
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: ".75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <input
          className="form-control" type="text"
          placeholder="🔍  Buscar paciente, doctor..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 300 }}
        />
        <div style={{ display: "flex", gap: ".4rem" }}>
          {ESTADOS.map(e => (
            <button
              key={e} onClick={() => setFilter(e)}
              className={`btn btn-sm ${filter === e ? "btn-primary" : "btn-outline"}`}
              style={{ textTransform: "capitalize" }}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <span>📅</span>
            {search || filter !== "todos" ? "Sin resultados" : "No hay citas agendadas"}
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Paciente</th><th>Doctor</th><th>Especialidad</th>
                  <th>Fecha</th><th>Hora</th><th>Motivo</th><th>Estado</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a._id}>
                    <td style={{ fontWeight: 600 }}>{a.patientName}</td>
                    <td>{a.doctorName}</td>
                    <td style={{ color: "var(--clr-muted)", fontSize: ".83rem" }}>{a.doctorSpecialty}</td>
                    <td>{a.fecha}</td>
                    <td>{a.hora}</td>
                    <td style={{ color: "var(--clr-muted)", fontSize: ".83rem" }}>{a.motivo || "—"}</td>
                    <td><span className={`badge badge-${a.estado}`}>{a.estado}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: ".35rem", flexWrap: "wrap" }}>
                        {a.estado === "pendiente" && (
                          <button className="btn btn-success btn-sm" onClick={() => changeStatus(a._id, "confirmada")}>✓</button>
                        )}
                        {a.estado === "confirmada" && (
                          <button className="btn btn-outline btn-sm" onClick={() => changeStatus(a._id, "completada")}>Completar</button>
                        )}
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a._id)}>✕</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <Modal title="Agendar nueva cita" onClose={() => setShowForm(false)}>
          <AppointmentForm onClose={() => setShowForm(false)} />
        </Modal>
      )}
    </div>
  );
}
