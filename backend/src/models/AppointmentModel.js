import Appointment from "../schemas/Appointment.schema.js";
import Doctor      from "../schemas/Doctor.schema.js";
import Patient     from "../schemas/Patient.schema.js";
import {
  sendAppointmentCreated,
  sendAppointmentConfirmed,
  sendAppointmentCancelled,
  sendAppointmentCompleted,
} from "../services/whatsapp.service.js";

/**
 * MODEL — Cita
 * Gestiona la lógica de negocio y el acceso a datos de citas (MongoDB).
 */
class AppointmentModel {
  async getAll() {
    const appointments = await Appointment.find()
      .populate("patientId", "nombre apellido telefono")
      .populate("doctorId",  "name specialty")
      .sort({ fecha: 1, hora: 1 });
    return appointments.map(a => this._enrich(a));
  }

  async getById(id) {
    const appt = await Appointment.findById(id)
      .populate("patientId", "nombre apellido telefono")
      .populate("doctorId",  "name specialty");
    if (!appt) throw new Error(`Cita con id "${id}" no encontrada.`);
    return this._enrich(appt);
  }

  async create(data) {
    const { patientId, doctorId, fecha, hora } = data;
    const required = { patientId, doctorId, fecha, hora };
    const missing = Object.keys(required).filter(k => !required[k]);
    if (missing.length) throw new Error(`Campos requeridos faltantes: ${missing.join(", ")}`);

    // Verificar que el paciente existe
    const patient = await Patient.findById(patientId);
    if (!patient) throw new Error(`Paciente con id "${patientId}" no existe.`);

    // Verificar que el doctor existe
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) throw new Error(`Doctor con id "${doctorId}" no existe.`);

    // Validar que la cita no sea en el pasado
    const appointmentDate = new Date(`${fecha}T${hora}`);
    if (isNaN(appointmentDate.getTime())) throw new Error("Fecha/hora de cita inválida.");
    if (appointmentDate < new Date()) throw new Error("No se pueden agendar citas en el pasado.");

    // Validar rango horario de atención (08:00 a 18:00)
    const [h, m] = hora.split(":");
    const hourInt = parseInt(h, 10);
    const minInt = parseInt(m, 10);
    if (hourInt < 8 || hourInt > 18 || (hourInt === 18 && minInt > 0)) {
      throw new Error("El horario de atención es de 08:00 a 18:00.");
    }

    const appt = await Appointment.create({
      patientId: patient._id,
      doctorId:  doctor._id,
      fecha,
      hora,
      motivo: data.motivo || "",
      estado: data.estado || "pendiente",
    });

    // ── Notificación WhatsApp ──────────────────────────────────────────────
    sendAppointmentCreated({
      telefono:    patient.telefono,
      patientName: `${patient.nombre} ${patient.apellido}`,
      fecha,
      hora,
      doctorName:  doctor.name,
      specialty:   doctor.specialty,
    });

    return this.getById(appt._id);
  }

  async update(id, data) {
    const before = await this.getById(id); // verifica existencia y guarda estado previo
    await Appointment.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    const after = await this.getById(id);

    // ── Notificaciones por cambio de estado ────────────────────────────────
    if (data.estado && data.estado !== before.estado) {
      const patient = await Patient.findById(before.patientId?._id || before.patientId);
      const name    = patient ? `${patient.nombre} ${patient.apellido}` : "Paciente";
      const tel     = patient?.telefono || "";

      if (data.estado === "confirmada") {
        sendAppointmentConfirmed({
          telefono:    tel,
          patientName: name,
          fecha:       before.fecha,
          hora:        before.hora,
          doctorName:  before.doctorName,
        });
      } else if (data.estado === "cancelada") {
        sendAppointmentCancelled({
          telefono:    tel,
          patientName: name,
          fecha:       before.fecha,
          hora:        before.hora,
        });
      } else if (data.estado === "completada") {
        sendAppointmentCompleted({
          telefono:    tel,
          patientName: name,
          doctorName:  before.doctorName,
        });
      }
    }

    return after;
  }

  async delete(id) {
    await this.getById(id);
    await Appointment.findByIdAndDelete(id);
    return true;
  }

  // Agrega nombre de paciente y doctor al objeto cita (ya viene del populate)
  _enrich(appt) {
    const obj = appt.toObject ? appt.toObject() : appt;
    const patient = obj.patientId;
    const doctor  = obj.doctorId;
    return {
      ...obj,
      patientName:     patient ? `${patient.nombre} ${patient.apellido}` : "Desconocido",
      doctorName:      doctor  ? doctor.name      : "Desconocido",
      doctorSpecialty: doctor  ? doctor.specialty : "",
    };
  }
}

export default new AppointmentModel();
