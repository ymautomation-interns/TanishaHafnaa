import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

export const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : new Pool({
      host: process.env.PGHOST,
      port: Number(process.env.PGPORT) || 5432,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
    });

// Simple key -> JSON blob content store. Each "section" (home hero, services,
// projects, gallery, ...) is one row. This keeps the schema flexible so the
// admin panel can add/edit fields without needing a migration every time.
export async function initSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_content (
      section TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT NOT NULL,
      message TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS job_applications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      job_id TEXT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      cover_letter_url TEXT NOT NULL,
      resume_url TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}

export async function getSection(section) {
  const { rows } = await pool.query(
    "SELECT data FROM site_content WHERE section = $1",
    [section]
  );
  return rows[0]?.data ?? null;
}

export async function getAllSections() {
  const { rows } = await pool.query("SELECT section, data FROM site_content");
  const result = {};
  for (const row of rows) result[row.section] = row.data;
  return result;
}

export async function setSection(section, data) {
  await pool.query(
    `INSERT INTO site_content (section, data, updated_at)
     VALUES ($1, $2, now())
     ON CONFLICT (section)
     DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
    [section, data]
  );
  return data;
}
