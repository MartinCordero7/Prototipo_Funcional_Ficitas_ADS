import database from "../patterns/Database.singleton.js";
import EntityFactory from "../patterns/EntityFactory.factory.js";

/**
 * MODEL — Paciente
 * Gestiona la lógica de negocio y el acceso a datos de pacientes.
 */
class PatientModel {
  getAll() {
    return database.getPatients();
  }

  getById(id) {
    const patient = database.findPatientById(id);
    if (!patient) throw new Error(`Paciente con id "${id}" no encontrado.`);
    return patient;
  }

  create(data) {
    const patient = EntityFactory.create("patient", data);
    return database.addPatient(patient);
  }

  update(id, data) {
    // Aseguramos que el paciente exista antes de actualizar
    this.getById(id);
    return database.updatePatient(id, data);
  }

  delete(id) {
    this.getById(id);
    return database.deletePatient(id);
  }
}

export default new PatientModel();
