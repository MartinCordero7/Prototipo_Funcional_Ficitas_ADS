import { Router } from "express";
import PatientController from "../controllers/PatientController.js";

const router = Router();

router.get("/",        (req, res) => PatientController.getAll(req, res));
router.get("/:id",     (req, res) => PatientController.getById(req, res));
router.post("/",       (req, res) => PatientController.create(req, res));
router.put("/:id",     (req, res) => PatientController.update(req, res));
router.delete("/:id",  (req, res) => PatientController.delete(req, res));

export default router;
