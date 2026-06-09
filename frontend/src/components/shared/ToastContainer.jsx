import { useState, useEffect } from "react";
import notificationStore from "../../patterns/NotificationStore.singleton.js";

const ICONS = { success: "✅", error: "❌", info: "ℹ️" };

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsub = notificationStore.subscribe((n) => {
      setToasts(prev => [...prev, n]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== n.id));
      }, 3500);
    });
    return unsub;
  }, []);

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span>{ICONS[t.type]}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
