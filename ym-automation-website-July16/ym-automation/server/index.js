import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { initSchema } from "./db.js";
import { authRouter } from "./routes/auth.js";
import { contentRouter } from "./routes/content.js";
import { uploadRouter } from "./routes/upload.js";
import { formsRouter } from "./routes/forms.js";

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());

app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use(express.json({ limit: "2mb" }));

// Serve uploaded images at http://<server>/uploads/<filename>
app.use("/uploads", express.static(path.resolve("uploads")));

app.use("/api/auth", authRouter);
app.use("/api/content", contentRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/forms", formsRouter);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

async function start() {
  await initSchema();
  app.listen(PORT, () => {
    console.log(`YM Automation API listening on http://localhost:${PORT}`);
    console.log(`Allowed frontend origin(s): ${allowedOrigins.join(", ")}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
