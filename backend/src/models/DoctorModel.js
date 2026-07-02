import Doctor from "../schemas/Doctor.schema.js";

/**
 * MODEL — Doctor
 * Acceso de solo lectura a la lista de médicos (MongoDB).
 */
class DoctorModel {
  async getAll() {
    return Doctor.find().sort({ name: 1 });
  }

  async getById(id) {
    const doctor = await Doctor.findById(id);
    if (!doctor) throw new Error(`Doctor con id "${id}" no encontrado.`);
    return doctor;
  }
}

export default new DoctorModel();
