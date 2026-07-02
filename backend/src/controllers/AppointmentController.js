import AppointmentModel from "../models/AppointmentModel.js";

/**
 * CONTROLLER — Cita
 */
class AppointmentController {
  async getAll(req, res) {
    try {
      const appointments = await AppointmentModel.getAll();
      res.json({ success: true, data: appointments, total: appointments.length });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getById(req, res) {
    try {
      const appt = await AppointmentModel.getById(req.params.id);
      res.json({ success: true, data: appt });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  async create(req, res) {
    try {
      const appt = await AppointmentModel.create(req.body);
      res.status(201).json({ success: true, data: appt, message: "Cita agendada exitosamente." });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async update(req, res) {
    try {
      const appt = await AppointmentModel.update(req.params.id, req.body);
      res.json({ success: true, data: appt, message: "Cita actualizada exitosamente." });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async delete(req, res) {
    try {
      await AppointmentModel.delete(req.params.id);
      res.json({ success: true, message: "Cita cancelada exitosamente." });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }
}

export default new AppointmentController();
