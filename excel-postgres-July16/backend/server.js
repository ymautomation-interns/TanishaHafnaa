require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const XLSX = require('xlsx');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'excel_app',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const ok = /\.(xlsx|xls)$/i.test(file.originalname);
    cb(ok ? null : new Error('Only .xlsx or .xls files are allowed'), ok);
  },
});

// ---------- Helpers ----------
async function getLatestOrGivenFileId(fileId) {
  if (fileId) return fileId;
  const r = await pool.query(
    'SELECT id FROM uploaded_files ORDER BY uploaded_at DESC LIMIT 1'
  );
  return r.rows[0]?.id || null;
}

async function fetchRows(fileId) {
  const dataResult = await pool.query(
    'SELECT row_data FROM excel_rows WHERE file_id = $1 ORDER BY row_number',
    [fileId]
  );
  return dataResult.rows.map((r) => r.row_data);
}

// ---------- Upload Excel -> Postgres ----------
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });

  if (rows.length === 0) {
    return res.status(400).json({ error: 'Excel file has no data rows' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const fileResult = await client.query(
      'INSERT INTO uploaded_files (filename) VALUES ($1) RETURNING id',
      [req.file.originalname]
    );
    const fileId = fileResult.rows[0].id;

    // Batch insert in chunks
    const CHUNK_SIZE = 1000;
    for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
      const chunk = rows.slice(i, i + CHUNK_SIZE);
      const values = [];
      const placeholders = chunk
        .map((row, j) => {
          values.push(fileId, i + j + 1, JSON.stringify(row));
          const base = j * 3;
          return `($${base + 1}, $${base + 2}, $${base + 3})`;
        })
        .join(', ');

      await client.query(
        `INSERT INTO excel_rows (file_id, row_number, row_data) VALUES ${placeholders}`,
        values
      );
    }

    await client.query('COMMIT');
    res.json({ success: true, fileId, rowsInserted: rows.length });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// ---------- List uploaded files ----------
app.get('/api/files', async (req, res) => {
  const r = await pool.query(
    'SELECT id, filename, uploaded_at FROM uploaded_files ORDER BY uploaded_at DESC'
  );
  res.json(r.rows);
});

// ---------- Get data for display ----------
app.get('/api/data', async (req, res) => {
  try {
    const fileId = await getLatestOrGivenFileId(req.query.fileId);
    if (!fileId) return res.json({ fileId: null, rows: [] });
    const rows = await fetchRows(fileId);
    res.json({ fileId, rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- Export as Excel ----------
app.get('/api/export/excel', async (req, res) => {
  try {
    const fileId = await getLatestOrGivenFileId(req.query.fileId);
    if (!fileId) return res.status(404).json({ error: 'No data found' });
    const rows = await fetchRows(fileId);
    if (rows.length === 0) return res.status(404).json({ error: 'No data found' });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Data');
    const headers = Object.keys(rows[0]);
    sheet.columns = headers.map((h) => ({ header: h, key: h, width: 20 }));
    sheet.getRow(1).font = { bold: true };
    rows.forEach((row) => sheet.addRow(row));

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=export.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- Export as PDF ----------
app.get('/api/export/pdf', async (req, res) => {
  try {
    const fileId = await getLatestOrGivenFileId(req.query.fileId);
    if (!fileId) return res.status(404).json({ error: 'No data found' });
    const rows = await fetchRows(fileId);
    if (rows.length === 0) return res.status(404).json({ error: 'No data found' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=export.pdf');

    const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });
    doc.pipe(res);

    const headers = Object.keys(rows[0]);
    const colWidth = (doc.page.width - 60) / headers.length;

    doc.fontSize(14).text('Exported Data', { align: 'center' });
    doc.moveDown();

    doc.fontSize(9).font('Helvetica-Bold');
    let y = doc.y;
    headers.forEach((h, i) => {
      doc.text(String(h), 30 + i * colWidth, y, { width: colWidth, ellipsis: true });
    });
    doc.moveDown();
    doc.font('Helvetica');

    rows.forEach((row) => {
      if (doc.y > doc.page.height - 60) doc.addPage();
      y = doc.y;
      headers.forEach((h, i) => {
        doc.text(String(row[h] ?? ''), 30 + i * colWidth, y, {
          width: colWidth,
          ellipsis: true,
        });
      });
      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
