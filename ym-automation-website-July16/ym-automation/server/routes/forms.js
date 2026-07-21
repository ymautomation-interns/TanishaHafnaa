import { Router } from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import { pool } from "../db.js";

const UPLOAD_DIR = path.resolve("uploads");

// We accept PDF files for the job application
const ALLOWED_TYPES = new Set(["application/pdf"]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = crypto.randomBytes(8).toString("hex");
    cb(null, `app-${Date.now()}-${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max for PDFs
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_TYPES.has(file.mimetype)) {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
});

export const formsRouter = Router();

// POST /api/forms/contact
formsRouter.post("/contact", async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    await pool.query(
      `INSERT INTO contact_messages (name, phone, email, message)
       VALUES ($1, $2, $3, $4)`,
      [name, phone, email, message]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Error saving contact message:", err);
    res.status(500).json({ error: "Failed to save message" });
  }
});

// POST /api/forms/apply
formsRouter.post(
  "/apply",
  upload.fields([
    { name: "coverLetter", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { jobId, name, email, phone } = req.body;
      const files = req.files || {};
      
      if (!name || !email || !phone) {
        return res.status(400).json({ error: "Name, email, and phone are required" });
      }

      const coverLetter = files.coverLetter?.[0];
      const resume = files.resume?.[0];

      if (!coverLetter || !resume) {
        return res.status(400).json({ error: "Cover letter and resume are required" });
      }

      const coverLetterUrl = `/uploads/${coverLetter.filename}`;
      const resumeUrl = `/uploads/${resume.filename}`;

      await pool.query(
        `INSERT INTO job_applications (job_id, name, email, phone, cover_letter_url, resume_url)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [jobId || null, name, email, phone, coverLetterUrl, resumeUrl]
      );

      res.json({ success: true });
    } catch (err) {
      console.error("Error saving application:", err);
      res.status(500).json({ error: "Failed to save application" });
    }
  }
);

formsRouter.use((err, _req, res, _next) => {
  res.status(400).json({ error: err.message || "Request failed" });
});
