import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";

// ─── Sub-componente: Cambio de contraseña ────────────────────────────────────
function ChangePasswordPanel({ username, onSuccess, onCancel }) {
  const { changePassword } = useAuth();
  const [current, setCurrent]   = useState("");
  const [next,    setNext]      = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error,   setError]     = useState("");
  const [ok,      setOk]        = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (next !== confirm) { setError("Las contraseñas nuevas no coinciden."); return; }
    if (next.length < 6)  { setError("La nueva contraseña debe tener al menos 6 caracteres."); return; }
    setLoading(true);
    try {
      await changePassword(current, next);
      setOk(true);
      setTimeout(() => { onSuccess?.(); }, 1800);
    } catch (err) {
      setError(err.message || "Error al cambiar contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div className="form-group">
        <label className="form-label">Contraseña actual</label>
        <input
          id="cp-current"
          type="password" className="form-control"
          value={current} onChange={e => setCurrent(e.target.value)}
          placeholder="••••••" required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Nueva contraseña</label>
        <input
          id="cp-new"
          type="password" className="form-control"
          value={next} onChange={e => setNext(e.target.value)}
          placeholder="Mínimo 6 caracteres" required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Confirmar nueva contraseña</label>
        <input
          id="cp-confirm"
          type="password" className="form-control"
          value={confirm} onChange={e => setConfirm(e.target.value)}
          placeholder="Repite la nueva contraseña" required
        />
      </div>

      {error && (
        <div className="login-alert login-alert-error">⚠ {error}</div>
      )}
      {ok && (
        <div className="login-alert login-alert-success">✓ Contraseña actualizada exitosamente.</div>
      )}

      <div style={{ display: "flex", gap: ".75rem", justifyContent: "flex-end" }}>
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={loading || ok}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading || ok} id="cp-submit-btn">
          {loading ? "Guardando…" : "Actualizar contraseña"}
        </button>
      </div>
    </form>
  );
}


// ─── Pantalla principal de Login ─────────────────────────────────────────────
export default function LoginPage() {
  const { login } = useAuth();

  const [username,      setUsername]      = useState("");
  const [password,      setPassword]      = useState("");
  const [error,         setError]         = useState("");
  const [locked,        setLocked]        = useState(false);
  const [attemptsLeft,  setAttemptsLeft]  = useState(null);
  const [countdown,     setCountdown]     = useState(0);
  const [loading,       setLoading]       = useState(false);
  const [showChangePwd, setShowChangePwd] = useState(false);

  const timerRef = useRef(null);

  // Countdown cuando está bloqueado
  useEffect(() => {
    if (locked && countdown > 0) {
      timerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setLocked(false);
            setError("");
            setAttemptsLeft(3);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [locked, countdown]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (locked) return;
    setError("");
    setLoading(true);

    try {
      await login(username, password);
      // Éxito: App.jsx detectará el cambio de auth y ocultará este login
    } catch (errData) {
      if (errData.locked) {
        setLocked(true);
        setCountdown(errData.remaining || 600);
        setError(errData.message);
        setAttemptsLeft(0);
      } else {
        setAttemptsLeft(errData.attemptsLeft ?? null);
        setError(errData.message || "Credenciales incorrectas.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background orbs */}
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />

      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo">🏥</div>
          <h1 className="login-title">FiCitas</h1>
          <p className="login-subtitle">Sistema de Agendación Médica</p>
        </div>

        {/* Panel principal: Login o Cambio de contraseña */}
        {showChangePwd ? (
          <div className="login-body">
            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem", color: "var(--clr-text)" }}>
              🔑 Cambiar contraseña
            </h2>
            <ChangePasswordPanel
              username={username}
              onSuccess={() => setShowChangePwd(false)}
              onCancel={() => setShowChangePwd(false)}
            />
          </div>
        ) : (
          <form className="login-body" onSubmit={handleLogin} noValidate>
            {/* Bloqueo */}
            {locked && (
              <div className="login-lockout">
                <div className="login-lockout-icon">🔒</div>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: ".25rem" }}>Cuenta bloqueada</div>
                  <div style={{ fontSize: ".85rem", opacity: .85 }}>
                    Podrá intentarlo nuevamente en
                  </div>
                  <div className="login-countdown">{formatTime(countdown)}</div>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="login-username">Usuario</label>
              <input
                id="login-username"
                type="text" className="form-control"
                value={username} onChange={e => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                disabled={locked || loading}
                autoComplete="username"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Contraseña</label>
              <input
                id="login-password"
                type="password" className="form-control"
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={locked || loading}
                autoComplete="current-password"
                required
              />
            </div>

            {/* Intentos restantes */}
            {attemptsLeft !== null && !locked && (
              <div className="login-attempts">
                ⚠ Intentos restantes: <strong>{attemptsLeft}</strong>
              </div>
            )}

            {/* Error */}
            {error && !locked && (
              <div className="login-alert login-alert-error">{error}</div>
            )}

            <button
              id="login-submit-btn"
              type="submit"
              className="btn btn-primary login-btn"
              disabled={locked || loading}
            >
              {loading ? <span className="login-spinner" /> : null}
              {loading ? "Verificando…" : "Iniciar sesión"}
            </button>

            {/* Cambiar contraseña */}
            <button
              type="button"
              className="login-link-btn"
              onClick={() => setShowChangePwd(true)}
              id="open-change-pwd-btn"
            >
              🔑 Cambiar contraseña
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="login-footer">
          MVC · Singleton · Factory &nbsp;|&nbsp; Patrones de diseño
        </div>
      </div>
    </div>
  );
}
