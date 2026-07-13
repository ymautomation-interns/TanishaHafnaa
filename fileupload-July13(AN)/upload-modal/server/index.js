import express from "express";
import cors from "cors";
import multer from "multer";
import axios from "axios";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

/**
 * Minimal but real backend for the upload modal demo.
 *
 * - POST /api/uploads             multipart file upload (multer), saved to disk
 * - POST /api/uploads/url         starts a server-side download of a remote file
 * - GET  /api/uploads/url/:id/events   SSE stream of that download's real progress
 *
 * Nothing here fakes progress: multer reports real bytes received, and the
 * URL job tracks real bytes read from the upstream response stream.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files back out, useful for confirming an upload landed.
app.use("/files", express.static(UPLOAD_DIR));

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => cb(null, `${randomUUID()}-${file.originalname}`),
  }),
  limits: { fileSize: 25 * 1024 * 1024 }, // keep in sync with utils/validators.js
});

app.post("/api/uploads", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file was received." });
  }
  res.json({
    id: req.file.filename,
    url: `/files/${req.file.filename}`,
    fileName: req.file.originalname,
    size: req.file.size,
  });
});

// --- URL-based uploads, streamed over Server-Sent Events -------------------

const jobs = new Map(); // jobId -> { events: [{event, data}], listeners: Set<res> }

function createJob() {
  const jobId = randomUUID();
  jobs.set(jobId, { events: [], listeners: new Set() });
  return jobId;
}

function emit(jobId, event, data) {
  const job = jobs.get(jobId);
  if (!job) return;
  job.events.push({ event, data });
  for (const res of job.listeners) writeSSE(res, event, data);
}

function writeSSE(res, event, data) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

async function runUrlDownload(jobId, sourceUrl) {
  try {
    const response = await axios.get(sourceUrl, {
      responseType: "stream",
      timeout: 15000,
      maxContentLength: 25 * 1024 * 1024,
    });

    const total = Number(response.headers["content-length"]) || 0;
    const originalName = path.basename(new URL(sourceUrl).pathname) || "downloaded-file";
    const destPath = path.join(UPLOAD_DIR, `${randomUUID()}-${originalName}`);
    const writeStream = fs.createWriteStream(destPath);

    let loaded = 0;
    let lastEmit = 0;

    response.data.on("data", (chunk) => {
      loaded += chunk.length;
      const now = Date.now();
      // Throttle SSE messages to ~10/sec so we don't flood the client.
      if (now - lastEmit > 100 || loaded === total) {
        lastEmit = now;
        emit(jobId, "progress", { loaded, total });
      }
    });

    response.data.pipe(writeStream);

    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
      response.data.on("error", reject);
    });

    const stats = fs.statSync(destPath);
    const fileName = path.basename(destPath);
    emit(jobId, "complete", {
      id: fileName,
      url: `/files/${fileName}`,
      fileName: originalName,
      size: stats.size,
    });
  } catch (err) {
    emit(jobId, "error", {
      message: err.message?.includes("maxContentLength")
        ? "That file is larger than the 25 MB limit."
        : "Couldn't download the file from that URL.",
    });
  } finally {
    // Give clients a moment to receive the final event before cleanup.
    setTimeout(() => jobs.delete(jobId), 30000);
  }
}

app.post("/api/uploads/url", (req, res) => {
  const { url } = req.body || {};
  if (!url) return res.status(400).json({ message: "A URL is required." });

  let parsed;
  try {
    parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
  } catch {
    return res.status(400).json({ message: "That doesn't look like a valid URL." });
  }

  const jobId = createJob();
  res.json({ jobId });

  // Kick off the download after responding — any progress/complete/error
  // events emitted before the client subscribes are buffered in job.events
  // and replayed on connect, so there's no race condition.
  runUrlDownload(jobId, url);
});

app.get("/api/uploads/url/:jobId/events", (req, res) => {
  const job = jobs.get(req.params.jobId);
  if (!job) {
    res.status(404).end();
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  // Replay anything that already happened before this client connected.
  for (const { event, data } of job.events) writeSSE(res, event, data);

  job.listeners.add(res);
  req.on("close", () => job.listeners.delete(res));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Mock upload backend running at http://localhost:${PORT}`);
});
