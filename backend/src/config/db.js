import mongoose from "mongoose";

/**
 * Conecta a MongoDB Atlas usando la URI definida en .env
 * Se llama una sola vez al arrancar el servidor.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[MongoDB] ✅ Conectado a: ${conn.connection.host} — BD: ${conn.connection.name}`);
  } catch (error) {
    console.error("[MongoDB] ❌ Error de conexión:", error.message);
    process.exit(1);
  }
};

export default connectDB;
