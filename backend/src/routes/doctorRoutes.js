import { Router } from "express";
import DoctorController from "../controllers/DoctorController.js";

const router = Router();

router.get("/", (req, res) => DoctorController.getAll(req, res));

export default router;
