# Excel → PostgreSQL → PDF/Excel Export

Full stack app: React frontend uploads an Excel file, Node/Express backend
parses it and saves the rows into PostgreSQL (as JSONB, so any column
structure is supported), and you can download the stored data back out as
a formatted PDF or Excel file.

## Structure
```
backend/    Express API (upload, save to Postgres, export PDF/Excel)
frontend/   React (Vite) UI
```

## 1. Database setup
```bash
createdb excel_app
psql -U postgres -d excel_app -f backend/schema.sql
```

## 2. Backend setup
```bash
cd backend
cp .env.example .env   # edit DB credentials if needed
npm install
npm run dev             # or: npm start
# -> http://localhost:5000
```

## 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
# -> http://localhost:3000
```

## How it works
1. Pick an `.xlsx`/`.xls` file in the browser and click **Upload**.
2. Backend parses it with `xlsx`, inserts a row into `uploaded_files`,
   and bulk-inserts each spreadsheet row as JSONB into `excel_rows`.
3. The UI fetches the saved rows and renders them as a table.
4. **Download Excel** streams a freshly generated `.xlsx` (via `exceljs`)
   built from the Postgres data.
5. **Download PDF** streams a generated `.pdf` (via `pdfkit`) of the same data.

## Notes / next steps
- CORS is wide open for local dev — restrict `cors()` origin in production.
- No auth is included — add it before deploying publicly.
- Excel parsing takes the first sheet only; extend `server.js` if you need
  multi-sheet support.
- For very large files, consider streaming inserts or a background job
  instead of one request/transaction.
