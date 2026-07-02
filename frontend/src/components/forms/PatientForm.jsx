import { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";

const INITIAL = {
  nombre: "", apellido: "", edad: "", peso: "", estatura: "",
  historialMedico: "", sexo: "", ocupacion: "", telefono: "",
};

const SEXO_OPTIONS = ["Masculino", "Femenino", "Otro", "Prefiero no decir"];

function validate(form) {
  const errors = {};
  if (!form.nombre.trim())    errors.nombre    = "El nombre es requerido";
  if (!form.apellido.trim())  errors.apellido  = "El apellido es requerido";
  if (!form.edad || isNaN(form.edad) || form.edad < 0 || form.edad > 150)
    errors.edad = "Ingresa una edad válida (0–150)";
  if (!form.peso || isNaN(form.peso) || form.peso <= 0)
    errors.peso = "Ingresa un peso válido en kg";
  if (!form.estatura || isNaN(form.estatura) || form.estatura <= 0)
    errors.estatura = "Ingresa una estatura válida en cm";
  if (!form.sexo)             errors.sexo      = "Selecciona el sexo";
  if (!form.ocupacion.trim()) errors.ocupacion = "La ocupación es requerida";
  return errors;
}

// Field definido FUERA del componente padre para que React no lo desmonte en cada render
function Field({ name, label, type = "text", value, onChange, error, ...props }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        className={`form-control${error ? " error" : ""}`}
        name={name} type={type} value={value}
        onChange={onChange} {...props}
      />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

export default function PatientForm({ onClose, onSuccess }) {
  const { createPatient } = useApp();
  const [form,   setForm]   = useState(INITIAL);
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
      const patient = await createPatient({
        ...form,
        edad: Number(form.edad),
        peso: Number(form.peso),
        estatura: Number(form.estatura),
      });
      onSuccess?.(patient);
      onClose?.();
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      {errors.general && (
        <div style={{ background: "#f8d7da", color: "#842029", padding: ".75rem 1rem", borderRadius: "var(--radius)", marginBottom: "1rem", fontSize: ".875rem" }}>
          {errors.general}
        </div>
      )}

      {/* Datos personales */}
      <div style={{ marginBottom: "1.25rem" }}>
        <p style={{ fontSize: ".78rem", fontWeight: 700, color: "var(--clr-muted)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: ".75rem" }}>
          Datos personales
        </p>
        <div className="form-grid">
          <Field name="nombre"    label="Nombre *"    value={form.nombre}    onChange={change} error={errors.nombre}    placeholder="Ej: Juan" />
          <Field name="apellido"  label="Apellido *"  value={form.apellido}  onChange={change} error={errors.apellido}  placeholder="Ej: Pérez" />
          <Field name="edad"      label="Edad *"      value={form.edad}      onChange={change} error={errors.edad}      type="number" min="0" max="150" placeholder="Años" />
          <div className="form-group">
            <label className="form-label">Sexo *</label>
            <select
              name="sexo" className={`form-control${errors.sexo ? " error" : ""}`}
              value={form.sexo} onChange={change}
            >
              <option value="">Seleccionar...</option>
              {SEXO_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            {errors.sexo && <span className="form-error">{errors.sexo}</span>}
          </div>
          <Field name="ocupacion" label="Ocupación *" value={form.ocupacion} onChange={change} error={errors.ocupacion} placeholder="Ej: Ingeniero" />
          <Field
            name="telefono"
            label="Teléfono WhatsApp"
            type="tel"
            value={form.telefono}
            onChange={change}
            error={errors.telefono}
            placeholder="+593XXXXXXXXX"
          />
        </div>
      </div>

      {/* Datos físicos */}
      <div style={{ marginBottom: "1.25rem" }}>
        <p style={{ fontSize: ".78rem", fontWeight: 700, color: "var(--clr-muted)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: ".75rem" }}>
          Datos físicos
        </p>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Peso (kg) *</label>
            <input
              className={`form-control${errors.peso ? " error" : ""}`}
              name="peso" type="number" step="0.1" min="0" value={form.peso}
              onChange={change} placeholder="Ej: 70.5"
            />
            {errors.peso && <span className="form-error">{errors.peso}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Estatura (cm) *</label>
            <input
              className={`form-control${errors.estatura ? " error" : ""}`}
              name="estatura" type="number" step="0.1" min="0" value={form.estatura}
              onChange={change} placeholder="Ej: 175"
            />
            {errors.estatura && <span className="form-error">{errors.estatura}</span>}
          </div>
          {form.peso && form.estatura && (
            <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: ".1rem" }}>
              <div style={{
                background: "var(--clr-bg)", border: "1.5px solid var(--clr-border)",
                borderRadius: "var(--radius)", padding: ".5rem .85rem", width: "100%",
              }}>
                <div style={{ fontSize: ".72rem", fontWeight: 700, color: "var(--clr-muted)", textTransform: "uppercase" }}>IMC calculado</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--clr-primary)", marginTop: ".1rem" }}>
                  {(form.peso / Math.pow(form.estatura / 100, 2)).toFixed(1)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Historial médico */}
      <div style={{ marginBottom: "1rem" }}>
        <p style={{ fontSize: ".78rem", fontWeight: 700, color: "var(--clr-muted)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: ".75rem" }}>
          Historial médico
        </p>
        <div className="form-group">
          <label className="form-label">Historial / Antecedentes</label>
          <textarea
            className="form-control" name="historialMedico"
            value={form.historialMedico} onChange={change}
            rows={4} placeholder="Enfermedades previas, alergias, medicamentos actuales, cirugías, etc."
            style={{ resize: "vertical" }}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onClose} disabled={saving}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Guardando…" : "Registrar paciente"}
        </button>
      </div>
    </form>
  );
}
