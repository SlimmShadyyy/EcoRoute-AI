import express from "express";
import { explainImpact } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/explain", explainImpact);

export default router;
