import mongoose from "mongoose";

/**
 * Schema — Usuario del sistema
 * Colección: users (en BD Ficitas)
 */
const userSchema = new mongoose.Schema(
  {
    username:    { type: String, required: true, unique: true },
    password:    { type: String, required: true },
    role:        { type: String, enum: ["ADMINISTRADOR", "AYUDANTE"], required: true },
    displayName: { type: String, required: true },
    failCount:   { type: Number, default: 0 },
    lockedUntil: { type: Date,   default: null },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
