import { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";

const MOTIVOS = ["Consulta general", "Control", "Urgencia", "Seguimiento", "Examen", "Otro"];

function validate(form) {
  const errors = {};
  if (!form.patientId) errors.patientId = "Selecciona un paciente";
  if (!form.doctorId)  errors.doctorId  = "Selecciona un doctor";
  if (!form.fecha)     errors.fecha     = "Selecciona la fecha";
  if (!form.hora)      errors.hora      = "Selecciona la hora";
  return errors;
}

export default function AppointmentForm({ onClose, onSuccess }) {
  const { patients, doctors, createAppointment } = useApp();
  const [form,   setForm]   = useState({ patientId: "", doctorId: "", fecha: "", hora: "", motivo: "", estado: "pendiente" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const change = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const appt = await createAppointment(form);
      onSuccess?.(appt);
      onClose?.();
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setSaving(false);
    }
  };

  const Select = ({ name, label, children }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <select name={name} className={`form-control${errors[name] ? " error" : ""}`} value={form[name]} onChange={change}>
        {children}
      </select>
      {errors[name] && <span className="form-error">{errors[name]}</span>}
    </div>
  );

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={submit} noValidate>
      {errors.general && (
        <div style={{ background: "#f8d7da", color: "#842029", padding: ".75rem 1rem", borderRadius: "var(--radius)", marginBottom: "1rem", fontSize: ".875rem" }}>
          {errors.general}
        </div>
      )}

      <div className="form-grid">
        <Select name="patientId" label="Paciente *">
          <option value="">Seleccionar paciente…</option>
          {patients.map(p => (
            <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>
          ))}
        </Select>

        <Select name="doctorId" label="Doctor *">
          <option value="">Seleccionar doctor…</option>
          {doctors.map(d => (
            <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>
          ))}
        </Select>

        <div className="form-group">
          <label className="form-label">Fecha *</label>
          <input className={`form-control${errors.fecha ? " error" : ""}`} name="fecha" type="date" min={today} value={form.fecha} onChange={change} />
          {errors.fecha && <span className="form-error">{errors.fecha}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Hora *</label>
          <input className={`form-control${errors.hora ? " error" : ""}`} name="hora" type="time" value={form.hora} onChange={change} />
          {errors.hora && <span className="form-error">{errors.hora}</span>}
        </div>

        <Select name="motivo" label="Motivo de consulta">
          <option value="">Sin especificar</option>
          {MOTIVOS.map(m => <option key={m} value={m}>{m}</option>)}
        </Select>

        <Select name="estado" label="Estado">
          {["pendiente","confirmada","cancelada","completada"].map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </Select>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onClose} disabled={saving}>Cancelar</button>
        <button type="submit" className="btn btn-success" disabled={saving}>
          {saving ? "Agendando…" : "Agendar cita"}
        </button>
      </div>
    </form>
  );
}
