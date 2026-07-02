import mongoose from "mongoose";

/**
 * Schema — Paciente
 * Colección: patients (en BD Ficitas)
 */
const patientSchema = new mongoose.Schema(
  {
    nombre:          { type: String, required: [true, "El nombre es requerido"] },
    apellido:        { type: String, required: [true, "El apellido es requerido"] },
    edad:            { type: Number, required: [true, "La edad es requerida"], min: 0, max: 150 },
    peso:            { type: Number, required: [true, "El peso es requerido"], min: 0 },   // kg
    estatura:        { type: Number, required: [true, "La estatura es requerida"], min: 0 }, // cm
    sexo:            { type: String, required: [true, "El sexo es requerido"] },
    ocupacion:       { type: String, required: [true, "La ocupación es requerida"] },
    historialMedico: { type: String, default: "" },
    telefono:        { type: String, default: "" },   // formato E.164: +593XXXXXXXXX
  },
  { timestamps: true }
);

export default mongoose.model("Patient", patientSchema);
