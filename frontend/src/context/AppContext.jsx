import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { patientService, appointmentService, doctorService } from "../services/api.service.js";
import notificationStore from "../patterns/NotificationStore.singleton.js";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [patients,     setPatients]     = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctors,      setDoctors]      = useState([]);
  const [loading,      setLoading]      = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [p, a, d] = await Promise.all([
        patientService.getAll(),
        appointmentService.getAll(),
        doctorService.getAll(),
      ]);
      setPatients(p.data);
      setAppointments(a.data);
      setDoctors(d.data);
    } catch (err) {
      notificationStore.error("Error al cargar datos: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Pacientes ────────────────────────────────────────────────────────────
  const createPatient = async (data) => {
    const res = await patientService.create(data);
    setPatients(prev => [...prev, res.data]);
    notificationStore.success("Paciente registrado exitosamente.");
    return res.data;
  };

  const deletePatient = async (id) => {
    await patientService.delete(id);
    setPatients(prev => prev.filter(p => p.id !== id));
    notificationStore.success("Paciente eliminado.");
  };

  // ── Citas ────────────────────────────────────────────────────────────────
  const createAppointment = async (data) => {
    const res = await appointmentService.create(data);
    setAppointments(prev => [...prev, res.data]);
    notificationStore.success("Cita agendada exitosamente.");
    return res.data;
  };

  const updateAppointment = async (id, data) => {
    const res = await appointmentService.update(id, data);
    setAppointments(prev => prev.map(a => a.id === id ? res.data : a));
    notificationStore.success("Cita actualizada.");
    return res.data;
  };

  const deleteAppointment = async (id) => {
    await appointmentService.delete(id);
    setAppointments(prev => prev.filter(a => a.id !== id));
    notificationStore.success("Cita cancelada.");
  };

  return (
    <AppContext.Provider value={{
      patients, appointments, doctors, loading, fetchAll,
      createPatient, deletePatient,
      createAppointment, updateAppointment, deleteAppointment,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de <AppProvider>");
  return ctx;
};
