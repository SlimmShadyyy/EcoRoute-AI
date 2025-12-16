import express from "express";
import cors from "cors";
import ecoimpactRoutes from "./routes/ecoimpact.routes.js";
import routeRoutes from "./routes/route.routes.js";
import aiRoutes from "./routes/ai.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/ecoimpact", ecoimpactRoutes);
app.use("/api/route", routeRoutes);
app.use("/api/ai", aiRoutes);

export default app;