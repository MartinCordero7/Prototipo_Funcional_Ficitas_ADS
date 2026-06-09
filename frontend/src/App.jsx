import { Routes, Route } from "react-router-dom";
import Sidebar        from "./components/layout/Sidebar.jsx";
import ToastContainer from "./components/shared/ToastContainer.jsx";
import Dashboard      from "./pages/Dashboard.jsx";
import Patients       from "./pages/Patients.jsx";
import Appointments   from "./pages/Appointments.jsx";

export default function App() {
  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/"             element={<Dashboard />} />
          <Route path="/patients"     element={<Patients />} />
          <Route path="/appointments" element={<Appointments />} />
        </Routes>
      </main>
      <ToastContainer />
    </div>
  );
}
