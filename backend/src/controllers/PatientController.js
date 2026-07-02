import PatientModel from "../models/PatientModel.js";

/**
 * CONTROLLER — Paciente
 * Recibe las peticiones HTTP, delega al Model y devuelve la respuesta.
 */
class PatientController {
  async getAll(req, res) {
    try {
      const patients = await PatientModel.getAll();
      res.json({ success: true, data: patients, total: patients.length });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getById(req, res) {
    try {
      const patient = await PatientModel.getById(req.params.id);
      res.json({ success: true, data: patient });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  async create(req, res) {
    try {
      const patient = await PatientModel.create(req.body);
      res.status(201).json({ success: true, data: patient, message: "Paciente registrado exitosamente." });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async update(req, res) {
    try {
      const patient = await PatientModel.update(req.params.id, req.body);
      res.json({ success: true, data: patient, message: "Paciente actualizado exitosamente." });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async delete(req, res) {
    try {
      await PatientModel.delete(req.params.id);
      res.json({ success: true, message: "Paciente eliminado exitosamente." });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }
}

export default new PatientController();
