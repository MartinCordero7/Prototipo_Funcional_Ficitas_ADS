import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import Modal from "../components/shared/Modal.jsx";
import PatientForm from "../components/forms/PatientForm.jsx";

export default function Patients() {
  const { patients, deletePatient, loading } = useApp();
  const [showForm,  setShowForm]  = useState(false);
  const [search,    setSearch]    = useState("");
  const [selected,  setSelected]  = useState(null);

  const filtered = patients.filter(p =>
    `${p.nombre} ${p.apellido} ${p.ocupacion}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id, name) => {
    if (!confirm(`¿Eliminar al paciente "${name}"?`)) return;
    try { await deletePatient(id); }
    catch (err) { alert(err.message); }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem" }}>
        <div>
          <h1 className="page-title">Pacientes</h1>
          <p className="page-subtitle">{patients.length} pacientes registrados</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Registrar paciente
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          className="form-control" type="text"
          placeholder="🔍  Buscar por nombre, apellido u ocupación..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <span>👤</span>
            {search ? "Sin resultados para esa búsqueda" : "No hay pacientes registrados aún"}
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th><th>Edad</th><th>Sexo</th><th>Peso</th>
                  <th>Estatura</th><th>IMC</th><th>Ocupación</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.nombre} {p.apellido}</div>
                      {p.historialMedico && (
                        <div style={{ fontSize: ".75rem", color: "var(--clr-muted)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {p.historialMedico}
                        </div>
                      )}
                    </td>
                    <td>{p.edad} años</td>
                    <td>{p.sexo}</td>
                    <td>{p.peso} kg</td>
                    <td>{p.estatura} cm</td>
                    <td>
                      <span style={{ fontWeight: 600, color: "var(--clr-primary)" }}>
                        {p.estatura > 0 ? (p.peso / Math.pow(p.estatura / 100, 2)).toFixed(1) : "—"}
                      </span>
                    </td>
                    <td>{p.ocupacion}</td>
                    <td>
                      <div style={{ display: "flex", gap: ".4rem" }}>
                        <button className="btn btn-outline btn-sm" onClick={() => setSelected(p)}>Ver</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id, p.nombre + " " + p.apellido)}>✕</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <Modal title="Registrar nuevo paciente" onClose={() => setShowForm(false)}>
          <PatientForm onClose={() => setShowForm(false)} />
        </Modal>
      )}

      {selected && (
        <Modal title="Detalle del paciente" onClose={() => setSelected(null)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: ".9rem" }}>
            {[
              ["Nombre completo", `${selected.nombre} ${selected.apellido}`],
              ["Edad", `${selected.edad} años`],
              ["Sexo", selected.sexo],
              ["Peso", `${selected.peso} kg`],
              ["Estatura", `${selected.estatura} cm`],
              ["IMC", selected.estatura > 0 ? (selected.peso / Math.pow(selected.estatura / 100, 2)).toFixed(1) : "—"],
              ["Ocupación", selected.ocupacion],
              ["Teléfono WA", selected.telefono || "—"],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: ".75rem", fontWeight: 700, color: "var(--clr-muted)", textTransform: "uppercase", marginBottom: ".2rem" }}>{k}</div>
                <div style={{ fontWeight: 600 }}>{v}</div>
              </div>
            ))}
            <div style={{ gridColumn: "1/-1" }}>
              <div style={{ fontSize: ".75rem", fontWeight: 700, color: "var(--clr-muted)", textTransform: "uppercase", marginBottom: ".4rem" }}>Historial médico</div>
              <div style={{ background: "var(--clr-bg)", padding: ".75rem", borderRadius: "var(--radius)", lineHeight: 1.6 }}>
                {selected.historialMedico || <em style={{ color: "var(--clr-muted)" }}>Sin historial registrado</em>}
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-outline" onClick={() => setSelected(null)}>Cerrar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
