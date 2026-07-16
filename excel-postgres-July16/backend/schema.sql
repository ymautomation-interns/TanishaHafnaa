-- Run this once against your PostgreSQL database:
--   psql -U postgres -d excel_app -f schema.sql

CREATE TABLE IF NOT EXISTS uploaded_files (
  id SERIAL PRIMARY KEY,
  filename TEXT NOT NULL,
  uploaded_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- row_data is JSONB so it can store ANY excel column structure,
-- no matter what headers the uploaded sheet has.
CREATE TABLE IF NOT EXISTS excel_rows (
  id SERIAL PRIMARY KEY,
  file_id INTEGER NOT NULL REFERENCES uploaded_files(id) ON DELETE CASCADE,
  row_number INTEGER NOT NULL,
  row_data JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_excel_rows_file_id ON excel_rows(file_id);
