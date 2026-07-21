import { Router } from "express";
import { getAllSections, getSection, setSection } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

export const contentRouter = Router();

const KNOWN_SECTIONS = [
  "hero",
  "services",
  "services_page",
  "projects_home",
  "projects_details",
  "gallery",
];

function isKnownSection(section) {
  return KNOWN_SECTIONS.includes(section);
}

// Public: anyone visiting the site can read content.
contentRouter.get("/", async (_req, res) => {
  try {
    const all = await getAllSections();
    res.json(all);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load content" });
  }
});

contentRouter.get("/:section", async (req, res) => {
  const { section } = req.params;
  if (!isKnownSection(section)) {
    return res.status(404).json({ error: "Unknown section" });
  }
  try {
    const data = await getSection(section);
    if (data === null) return res.status(404).json({ error: "Not seeded yet" });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load section" });
  }
});

// Protected: only the logged-in admin can write content.
contentRouter.put("/:section", requireAuth, async (req, res) => {
  const { section } = req.params;
  if (!isKnownSection(section)) {
    return res.status(404).json({ error: "Unknown section" });
  }
  if (req.body === undefined) {
    return res.status(400).json({ error: "Missing request body" });
  }
  try {
    const saved = await setSection(section, req.body);
    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save section" });
  }
});
