import express from "express";
import dotenv from "dotenv";
import ecoimpactRoutes from "./routes/ecoimpact.routes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/ecoimpact", ecoimpactRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
