import Patient from "../schemas/Patient.schema.js";

/**
 * MODEL — Paciente
 * Gestiona la lógica de negocio y el acceso a datos de pacientes (MongoDB).
 */
class PatientModel {
  async getAll() {
    return Patient.find().sort({ createdAt: -1 });
  }

  async getById(id) {
    const patient = await Patient.findById(id);
    if (!patient) throw new Error(`Paciente con id "${id}" no encontrado.`);
    return patient;
  }

  async create(data) {
    const { nombre, apellido, edad, peso, estatura, sexo, ocupacion, historialMedico, telefono } = data;
    const required = { nombre, apellido, edad, peso, estatura, sexo, ocupacion };
    const missing = Object.keys(required).filter(k => required[k] === undefined || required[k] === null || required[k] === "");
    if (missing.length) throw new Error(`Campos requeridos faltantes: ${missing.join(", ")}`);
    if (Number(edad) < 0 || Number(edad) > 150) throw new Error("Edad inválida.");
    if (Number(peso) <= 0) throw new Error("Peso inválido.");
    if (Number(estatura) <= 0) throw new Error("Estatura inválida.");

    return Patient.create({
      nombre,
      apellido,
      edad:            Number(edad),
      peso:            Number(peso),
      estatura:        Number(estatura),
      sexo,
      ocupacion,
      historialMedico: historialMedico || "",
      telefono:        telefono        || "",
    });
  }

  async update(id, data) {
    await this.getById(id); // verifica existencia
    return Patient.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    await this.getById(id);
    await Patient.findByIdAndDelete(id);
    return true;
  }
}

export default new PatientModel();
