import mongoose from "mongoose";

/**
 * Schema — Doctor
 * Colección: doctors (en BD Ficitas)
 */
const doctorSchema = new mongoose.Schema(
  {
    name:      { type: String, required: [true, "El nombre del doctor es requerido"] },
    specialty: { type: String, required: [true, "La especialidad es requerida"] },
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);
