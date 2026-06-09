import database from "../patterns/Database.singleton.js";

const MAX_ATTEMPTS  = 3;
const LOCKOUT_MS    = 10 * 60 * 1000; // 10 minutos

/**
 * CONTROLLER — Autenticación
 * Maneja login (con bloqueo por intentos) y cambio de contraseña.
 */
const AuthController = {

  /**
   * POST /api/auth/login
   * Body: { username, password }
   */
  login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Usuario y contraseña son requeridos." });
    }

    const attempts = database.getLoginAttempts(username);

    // Verificar bloqueo activo
    if (attempts.lockedUntil && new Date() < new Date(attempts.lockedUntil)) {
      const remaining = Math.ceil((new Date(attempts.lockedUntil) - Date.now()) / 1000);
      return res.status(403).json({
        success:   false,
        locked:    true,
        remaining, // segundos restantes
        message:   `Cuenta bloqueada. Intente en ${Math.ceil(remaining / 60)} minuto(s).`,
      });
    }

    // Si el bloqueo ya expiró, resetear
    if (attempts.lockedUntil && new Date() >= new Date(attempts.lockedUntil)) {
      database.resetLoginAttempts(username);
    }

    const user = database.findUserByUsername(username);

    // Credenciales incorrectas
    if (!user || user.password !== password) {
      const updated    = database.recordFailedAttempt(username);
      const remaining  = MAX_ATTEMPTS - updated.failCount;
      const nowLocked  = updated.failCount >= MAX_ATTEMPTS;

      return res.status(401).json({
        success:     false,
        locked:      nowLocked,
        attemptsLeft: nowLocked ? 0 : remaining,
        remaining:    nowLocked ? LOCKOUT_MS / 1000 : null,
        message:     nowLocked
          ? "Cuenta bloqueada por 10 minutos tras demasiados intentos fallidos."
          : `Credenciales incorrectas. Intentos restantes: ${remaining}.`,
      });
    }

    // Login exitoso
    database.resetLoginAttempts(username);

    return res.json({
      success: true,
      data: {
        id:          user.id,
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
  changePassword(req, res) {
    const { username, currentPassword, newPassword } = req.body;

    if (!username || !currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Todos los campos son requeridos." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "La nueva contraseña debe tener al menos 6 caracteres." });
    }

    const user = database.findUserByUsername(username);
    if (!user || user.password !== currentPassword) {
      return res.status(401).json({ success: false, message: "La contraseña actual es incorrecta." });
    }

    database.changePassword(username, newPassword);
    return res.json({ success: true, message: "Contraseña actualizada exitosamente." });
  },
};

export default AuthController;
