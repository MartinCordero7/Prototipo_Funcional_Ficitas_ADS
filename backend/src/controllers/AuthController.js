import User from "../schemas/User.schema.js";

const MAX_ATTEMPTS = 3;
const LOCKOUT_MS   = 10 * 60 * 1000; // 10 minutos

/**
 * CONTROLLER — Autenticación
 * Maneja login (con bloqueo por intentos) y cambio de contraseña.
 * Los usuarios se leen y persisten en MongoDB (colección users).
 */
const AuthController = {

  /**
   * POST /api/auth/login
   * Body: { username, password }
   */
  async login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Usuario y contraseña son requeridos." });
    }

    const user = await User.findOne({ username });

    // Verificar bloqueo activo
    if (user && user.lockedUntil && new Date() < new Date(user.lockedUntil)) {
      const remaining = Math.ceil((new Date(user.lockedUntil) - Date.now()) / 1000);
      return res.status(403).json({
        success:   false,
        locked:    true,
        remaining,
        message:   `Cuenta bloqueada. Intente en ${Math.ceil(remaining / 60)} minuto(s).`,
      });
    }

    // Si el bloqueo ya expiró, resetear contadores
    if (user && user.lockedUntil && new Date() >= new Date(user.lockedUntil)) {
      await User.updateOne({ username }, { failCount: 0, lockedUntil: null });
      user.failCount   = 0;
      user.lockedUntil = null;
    }

    // Credenciales incorrectas (usuario no existe o contraseña mal)
    if (!user || user.password !== password) {
      if (user) {
        const newCount    = (user.failCount || 0) + 1;
        const lockedUntil = newCount >= MAX_ATTEMPTS ? new Date(Date.now() + LOCKOUT_MS) : null;
        await User.updateOne({ username }, { failCount: newCount, lockedUntil });
        const remaining  = MAX_ATTEMPTS - newCount;
        const nowLocked  = newCount >= MAX_ATTEMPTS;
        return res.status(401).json({
          success:      false,
          locked:       nowLocked,
          attemptsLeft: nowLocked ? 0 : remaining,
          remaining:    nowLocked ? LOCKOUT_MS / 1000 : null,
          message:      nowLocked
            ? "Cuenta bloqueada por 10 minutos tras demasiados intentos fallidos."
            : `Credenciales incorrectas. Intentos restantes: ${remaining}.`,
        });
      }
      return res.status(401).json({ success: false, message: "Credenciales incorrectas." });
    }

    // Login exitoso — resetear intentos
    await User.updateOne({ username }, { failCount: 0, lockedUntil: null });

    return res.json({
      success: true,
      data: {
        id:          user._id,
        username:    user.username,
        role:        user.role,
        displayName: user.displayName,
      },
      message: "Inicio de sesión exitoso.",
    });
  },

  /**
   * POST /api/auth/change-password
   * Body: { username, currentPassword, newPassword }
   */
  async changePassword(req, res) {
    const { username, currentPassword, newPassword } = req.body;

    if (!username || !currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Todos los campos son requeridos." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "La nueva contraseña debe tener al menos 6 caracteres." });
    }

    const user = await User.findOne({ username });
    if (!user || user.password !== currentPassword) {
      return res.status(401).json({ success: false, message: "La contraseña actual es incorrecta." });
    }

    await User.updateOne({ username }, { password: newPassword });
    return res.json({ success: true, message: "Contraseña actualizada exitosamente." });
  },
};

export default AuthController;
