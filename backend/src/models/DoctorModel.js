import database from "../patterns/Database.singleton.js";

/**
 * MODEL — Doctor
 * Acceso de solo lectura a la lista de médicos.
 */
class DoctorModel {
  getAll() {
    return database.getDoctors();
  }

  getById(id) {
    const doctor = database.findDoctorById(id);
    if (!doctor) throw new Error(`Doctor con id "${id}" no encontrado.`);
    return doctor;
  }
}

export default new DoctorModel();
