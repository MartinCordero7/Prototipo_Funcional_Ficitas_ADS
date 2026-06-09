import PatientModel from "../models/PatientModel.js";

/**
 * CONTROLLER — Paciente
 * Recibe las peticiones HTTP, delega al Model y devuelve la respuesta.
 */
class PatientController {
  getAll(req, res) {
    try {
      const patients = PatientModel.getAll();
      res.json({ success: true, data: patients, total: patients.length });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  getById(req, res) {
    try {
      const patient = PatientModel.getById(req.params.id);
      res.json({ success: true, data: patient });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  create(req, res) {
    try {
      const patient = PatientModel.create(req.body);
      res.status(201).json({ success: true, data: patient, message: "Paciente registrado exitosamente." });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  update(req, res) {
    try {
      const patient = PatientModel.update(req.params.id, req.body);
      res.json({ success: true, data: patient, message: "Paciente actualizado exitosamente." });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  delete(req, res) {
    try {
      PatientModel.delete(req.params.id);
      res.json({ success: true, message: "Paciente eliminado exitosamente." });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }
}

export default new PatientController();
