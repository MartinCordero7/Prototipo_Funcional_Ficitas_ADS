import mongoose from "mongoose";

/**
 * Schema — Cita
 * Colección: appointments (en BD Ficitas)
 */
const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  "Patient",
      required: [true, "El paciente es requerido"],
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  "Doctor",
      required: [true, "El doctor es requerido"],
    },
    fecha:  { type: String, required: [true, "La fecha es requerida"] },  // YYYY-MM-DD
    hora:   { type: String, required: [true, "La hora es requerida"] },   // HH:mm
    motivo: { type: String, default: "" },
    estado: {
      type:    String,
      enum:    ["pendiente", "confirmada", "cancelada", "completada"],
      default: "pendiente",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
