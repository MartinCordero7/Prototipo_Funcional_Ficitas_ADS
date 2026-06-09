/**
 * PATRÓN SINGLETON en el frontend
 * Un único store de notificaciones globales accesible desde cualquier componente.
 */
class NotificationStore {
  constructor() {
    if (NotificationStore._instance) return NotificationStore._instance;
    this._listeners = [];
    NotificationStore._instance = this;
  }

  subscribe(fn) {
    this._listeners.push(fn);
    return () => { this._listeners = this._listeners.filter(l => l !== fn); };
  }

  notify(notification) {
    const n = { id: Date.now(), ...notification };
    this._listeners.forEach(fn => fn(n));
  }

  success(message) { this.notify({ type: "success", message }); }
  error(message)   { this.notify({ type: "error",   message }); }
  info(message)    { this.notify({ type: "info",     message }); }
}

const notificationStore = new NotificationStore();
export default notificationStore;
