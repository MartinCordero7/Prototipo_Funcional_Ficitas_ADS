import "dotenv/config";
import express            from "express";
import cors               from "cors";
import connectDB          from "./config/db.js";
import patientRoutes      from "./routes/patientRoutes.js";
import appointmentRoutes  from "./routes/appointmentRoutes.js";
import doctorRoutes       from "./routes/doctorRoutes.js";
import authRoutes         from "./routes/authRoutes.js";
import Doctor             from "./schemas/Doctor.schema.js";
import User               from "./schemas/User.schema.js";

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

// ── Seed inicial: inserta datos base si las colecciones están vacías ────────
async function seedDatabase() {
  // Seed doctors
  const doctorCount = await Doctor.countDocuments();
  if (doctorCount === 0) {
    await Doctor.insertMany([
      { name: "Dra. Mónica Viteri", specialty: "Fisioterapia" },
    ]);
    console.log("[Seed] ✅ Doctor inicial insertado.");
  }

  // Seed users
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    await User.insertMany([
      { username: "admin",    password: "admin123", role: "ADMINISTRADOR", displayName: "Administrador" },
      { username: "ayudante", password: "ayuda123", role: "AYUDANTE",      displayName: "Ayudante"      },
    ]);
    console.log("[Seed] ✅ Usuarios iniciales insertados.");
  }
}

// ── Arranque ───────────────────────────────────────────────────────────────
async function startServer() {
  await connectDB();
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`\n🏥 Servidor de Citas Médicas corriendo en http://localhost:${PORT}`);
    console.log(`   Base de datos: MongoDB Atlas — BD Ficitas\n`);
  });
}

startServer();

export default app;
