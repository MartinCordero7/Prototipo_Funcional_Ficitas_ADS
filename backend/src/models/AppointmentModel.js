import database from "../patterns/Database.singleton.js";
import EntityFactory from "../patterns/EntityFactory.factory.js";

/**
 * MODEL — Cita
 * Gestiona la lógica de negocio y el acceso a datos de citas.
 */
class AppointmentModel {
  getAll() {
    const appointments = database.getAppointments();
    // Enriquecer con datos de paciente y doctor
    return appointments.map(a => this._enrich(a));
  }

  getById(id) {
    const appt = database.findAppointmentById(id);
    if (!appt) throw new Error(`Cita con id "${id}" no encontrada.`);
    return this._enrich(appt);
  }

  create(data) {
    // Verificar que el paciente exista
    const patient = database.findPatientById(data.patientId);
    if (!patient) throw new Error(`Paciente con id "${data.patientId}" no existe.`);

    // Verificar que el doctor exista
    const doctor = database.findDoctorById(data.doctorId);
    if (!doctor) throw new Error(`Doctor con id "${data.doctorId}" no existe.`);

    const appt = EntityFactory.create("appointment", data);
    database.addAppointment(appt);
    return this._enrich(appt);
  }

  update(id, data) {
    this.getById(id); // verifica existencia
    const updated = database.updateAppointment(id, data);
    return this._enrich(updated);
  }

  delete(id) {
    this.getById(id);
    return database.deleteAppointment(id);
  }

  // Agrega nombre de paciente y doctor al objeto cita
  _enrich(appt) {
    const patient = database.findPatientById(appt.patientId);
    const doctor  = database.findDoctorById(appt.doctorId);
    return {
      ...appt,
      patientName: patient ? `${patient.nombre} ${patient.apellido}` : "Desconocido",
      doctorName:  doctor  ? doctor.name : "Desconocido",
      doctorSpecialty: doctor ? doctor.specialty : "",
    };
  }
}

export default new AppointmentModel();
