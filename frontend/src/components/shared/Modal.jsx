import { useEffect } from "react";

export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div className="modal">
        <div className="modal-header">
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} className="btn btn-outline btn-sm btn-icon" aria-label="Cerrar">✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
