import DoctorModel from "../models/DoctorModel.js";

/**
 * CONTROLLER — Doctor
 */
class DoctorController {
  getAll(req, res) {
    try {
      const doctors = DoctorModel.getAll();
      res.json({ success: true, data: doctors });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

export default new DoctorController();
