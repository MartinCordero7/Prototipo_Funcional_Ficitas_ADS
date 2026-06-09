import AppointmentModel from "../models/AppointmentModel.js";

/**
 * CONTROLLER — Cita
 */
class AppointmentController {
  getAll(req, res) {
    try {
      const appointments = AppointmentModel.getAll();
      res.json({ success: true, data: appointments, total: appointments.length });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  getById(req, res) {
    try {
      const appt = AppointmentModel.getById(req.params.id);
      res.json({ success: true, data: appt });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  create(req, res) {
    try {
      const appt = AppointmentModel.create(req.body);
      res.status(201).json({ success: true, data: appt, message: "Cita agendada exitosamente." });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  update(req, res) {
    try {
      const appt = AppointmentModel.update(req.params.id, req.body);
      res.json({ success: true, data: appt, message: "Cita actualizada exitosamente." });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  delete(req, res) {
    try {
      AppointmentModel.delete(req.params.id);
      res.json({ success: true, message: "Cita cancelada exitosamente." });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }
}

export default new AppointmentController();
