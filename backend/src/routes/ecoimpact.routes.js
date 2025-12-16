import express from "express";
import { analyzeEcoImpact } from "../controllers/ecoimpact.controller.js";

const router = express.Router();

router.post("/analyze", analyzeEcoImpact);

export default router;