import path from "path";
import app from "./app.js";
import { env } from "./config/env.js";

const __dirname = new URL(".", import.meta.url).pathname;

app.use(express.static(path.join(__dirname, "../../frontend/.next")));

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../frontend/.next/server/pages/index.html")
  );
});

app.listen(env.PORT, () => {
  console.log(`Backend running on port ${env.PORT}`);
});