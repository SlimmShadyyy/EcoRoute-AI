import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import ecoimpactRoutes from "./routes/ecoimpact.routes.js";

dotenv.config();

const app = express();

// ✅ CORS (this fixes your Vercel → Render issue)
app.use(cors({
  origin: "*"
}));

app.use(express.json());

// ✅ API routes
app.use("/api/ecoimpact", ecoimpactRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
