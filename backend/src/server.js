import express from "express";
import cors from "cors";
import patientRoutes     from "./routes/patientRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import doctorRoutes      from "./routes/doctorRoutes.js";
import authRoutes        from "./routes/authRoutes.js";

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ─────────────────────────────────────────────────────────────
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://localhost:5173"];
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// ── Rutas ──────────────────────────────────────────────────────────────────
app.use("/api/auth",         authRoutes);
app.use("/api/patients",     patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors",      doctorRoutes);


// Health check
app.get("/api/health", (_req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

// 404 handler
app.use((_req, res) => res.status(404).json({ success: false, message: "Ruta no encontrada." }));

// ── Arranque ───────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🏥 Servidor de Citas Médicas corriendo en http://localhost:${PORT}`);
  console.log(`   Patrón Singleton: Base de datos única inicializada.`);
  console.log(`   Patrón Factory:   EntityFactory listo para crear entidades.\n`);
});

export default app;
