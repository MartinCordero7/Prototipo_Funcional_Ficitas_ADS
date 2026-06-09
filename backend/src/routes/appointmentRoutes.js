import { Router } from "express";
import AppointmentController from "../controllers/AppointmentController.js";

const router = Router();

router.get("/",        (req, res) => AppointmentController.getAll(req, res));
router.get("/:id",     (req, res) => AppointmentController.getById(req, res));
router.post("/",       (req, res) => AppointmentController.create(req, res));
router.put("/:id",     (req, res) => AppointmentController.update(req, res));
router.delete("/:id",  (req, res) => AppointmentController.delete(req, res));

export default router;
