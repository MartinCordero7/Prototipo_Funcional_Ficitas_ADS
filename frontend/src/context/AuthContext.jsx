import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

const SESSION_KEY = "ficitas_session";

function loadSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(user) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadSession);

  const login = useCallback(async (username, password) => {
    const res = await fetch("/api/auth/login", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      // Retorna el objeto completo para que LoginPage muestre intentos / bloqueo
      throw data;
    }
    saveSession(data.data);
    setUser(data.data);
    return data.data;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    if (!user) throw new Error("No hay sesión activa.");
    const res = await fetch("/api/auth/change-password", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ username: user.username, currentPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Error al cambiar contraseña.");
    return data;
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      role:            user?.role   || null,
      isAuthenticated: !!user,
      login,
      logout,
      changePassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
};
