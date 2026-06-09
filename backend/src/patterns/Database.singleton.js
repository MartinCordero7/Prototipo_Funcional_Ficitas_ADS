/**
 * PATRÓN SINGLETON
 * Garantiza una única instancia de la base de datos en memoria
 * durante todo el ciclo de vida de la aplicación.
 */
class Database {
  constructor() {
    if (Database._instance) {
      return Database._instance;
    }

    // Almacenamiento en memoria
    this._patients = [];
    this._appointments = [];
    this._doctors = [
      { id: "doc-1", name: "Dra. Mónica Viteri", specialty: "Fisioterapia" },
    ];

    Database._instance = this;
    console.log("[Singleton] Base de datos inicializada — única instancia creada.");
  }

  // --- Patients ---
  getPatients() { return this._patients; }
  addPatient(patient) { this._patients.push(patient); return patient; }
  findPatientById(id) { return this._patients.find(p => p.id === id) || null; }
  updatePatient(id, data) {
    const idx = this._patients.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this._patients[idx] = { ...this._patients[idx], ...data };
    return this._patients[idx];
  }
  deletePatient(id) {
    const idx = this._patients.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this._patients.splice(idx, 1);
    return true;
  }

  // --- Appointments ---
  getAppointments() { return this._appointments; }
  addAppointment(appt) { this._appointments.push(appt); return appt; }
  findAppointmentById(id) { return this._appointments.find(a => a.id === id) || null; }
  updateAppointment(id, data) {
    const idx = this._appointments.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this._appointments[idx] = { ...this._appointments[idx], ...data };
    return this._appointments[idx];
  }
  deleteAppointment(id) {
    const idx = this._appointments.findIndex(a => a.id === id);
    if (idx === -1) return false;
    this._appointments.splice(idx, 1);
    return true;
  }

  // --- Doctors ---
  getDoctors() { return this._doctors; }
  findDoctorById(id) { return this._doctors.find(d => d.id === id) || null; }
}

// Exportar la instancia singleton
const database = new Database();
export default database;
