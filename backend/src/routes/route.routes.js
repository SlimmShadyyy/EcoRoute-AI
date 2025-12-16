import express from "express";
import { optimizeRoute } from "../controllers/route.controller.js";

const router = express.Router();

router.post("/optimize", optimizeRoute);

export default router;