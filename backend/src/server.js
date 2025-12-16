import express from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

// 🔹 your API routes go HERE
// app.post("/api/ecoimpact/analyze", analyzeEcoImpact);

const __dirname = new URL(".", import.meta.url).pathname;

// 🔹 serve frontend
app.use(express.static(path.join(__dirname, "../../frontend/.next")));

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../frontend/.next/server/pages/index.html")
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
