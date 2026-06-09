import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth }        from "./context/AuthContext.jsx";
import Sidebar            from "./components/layout/Sidebar.jsx";
import ToastContainer     from "./components/shared/ToastContainer.jsx";
import Dashboard          from "./pages/Dashboard.jsx";
import Patients           from "./pages/Patients.jsx";
import Appointments       from "./pages/Appointments.jsx";
import LoginPage          from "./pages/LoginPage.jsx";

export default function App() {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/"         element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />

          {/* Solo AYUDANTE puede agendar citas */}
          {role === "AYUDANTE" && (
            <Route path="/appointments" element={<Appointments />} />
          )}

          {/* Cualquier otra ruta → Dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ToastContainer />
    </div>
  );
}

