import { v4 as uuidv4 } from "uuid";

/**
 * PATRÓN FACTORY METHOD
 * Define una interfaz para crear objetos, pero delega la decisión
 * del tipo de objeto concreto a las subclases / métodos especializados.
 */

// ── Productos concretos ──────────────────────────────────────────────────────

class Patient {
  constructor({ nombre, apellido, edad, peso, estatura, historialMedico, sexo, ocupacion }) {
    this.id = uuidv4();
    this.type = "patient";
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = Number(edad);
    this.peso = Number(peso);          // kg
    this.estatura = Number(estatura);  // cm
    this.historialMedico = historialMedico || "";
    this.sexo = sexo;
    this.ocupacion = ocupacion;
    this.createdAt = new Date().toISOString();
  }

  get fullName() {
    return `${this.nombre} ${this.apellido}`;
  }

  get imc() {
    const m = this.estatura / 100;
    return m > 0 ? (this.peso / (m * m)).toFixed(1) : null;
  }
}

class Appointment {
  constructor({ patientId, doctorId, fecha, hora, motivo, estado }) {
    this.id = uuidv4();
    this.type = "appointment";
    this.patientId = patientId;
    this.doctorId = doctorId;
    this.fecha = fecha;
    this.hora = hora;
    this.motivo = motivo || "";
    this.estado = estado || "pendiente"; // pendiente | confirmada | cancelada | completada
    this.createdAt = new Date().toISOString();
  }
}

// ── Creator (Factory) ────────────────────────────────────────────────────────

class EntityFactory {
  /**
   * Factory Method: crea la entidad correcta según el tipo solicitado.
   * @param {"patient"|"appointment"} type
   * @param {object} data
   */
  static create(type, data) {
    switch (type) {
      case "patient":
        EntityFactory._validatePatient(data);
        return new Patient(data);

      case "appointment":
        EntityFactory._validateAppointment(data);
        return new Appointment(data);

      default:
        throw new Error(`[Factory] Tipo de entidad desconocido: "${type}"`);
    }
  }

  // ── Validaciones internas ──────────────────────────────────────────────────

  static _validatePatient(data) {
    const required = ["nombre", "apellido", "edad", "peso", "estatura", "sexo", "ocupacion"];
    const missing = required.filter(f => !data[f] && data[f] !== 0);
    if (missing.length) {
      throw new Error(`[Factory] Campos requeridos faltantes en Patient: ${missing.join(", ")}`);
    }
    if (data.edad < 0 || data.edad > 150) throw new Error("[Factory] Edad inválida.");
    if (data.peso <= 0)     throw new Error("[Factory] Peso inválido.");
    if (data.estatura <= 0) throw new Error("[Factory] Estatura inválida.");
  }

  static _validateAppointment(data) {
    const required = ["patientId", "doctorId", "fecha", "hora"];
    const missing = required.filter(f => !data[f]);
    if (missing.length) {
      throw new Error(`[Factory] Campos requeridos faltantes en Appointment: ${missing.join(", ")}`);
    }
  }
}

export default EntityFactory;
export { Patient, Appointment };
