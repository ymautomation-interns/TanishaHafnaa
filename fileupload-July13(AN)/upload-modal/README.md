# Upload Modal

A production-ready, enterprise-style file upload modal built with React,
Tailwind CSS, React Dropzone, Axios, and Framer Motion. Supports drag-and-drop
uploads and upload-by-URL, both driven by **real** progress events — nothing
in this project fakes progress with a timer.

## Quick start

This runs a real frontend + real backend, in two terminals.

**Terminal 1 — backend:**
```bash
npm install
npm run server
```
Starts the mock upload API at `http://localhost:4000`. It really does write
uploaded files to `server/uploads/` and really does stream download progress
over SSE for URL uploads — nothing here is faked.

**Terminal 2 — frontend:**
```bash
npm run dev
```
Open the printed URL (usually `http://localhost:5173`) and click **Upload
Files**. Requests to `/api/*` are proxied by Vite straight to the backend on
port 4000 (see `vite.config.js`), so there's no CORS setup needed.

## Project structure

```
server/
  index.js              # Express backend: multer upload + SSE URL-download job
  uploads/                # Where uploaded/downloaded files actually land
src/
  components/
    UploadModal.jsx      # Composes everything, owns the upload hook
    Dropzone.jsx          # Drag-and-drop + click-to-browse surface
    UploadProgress.jsx    # Live uploading / success / error card
    CircularProgress.jsx  # SVG ring synced to live percent
    ProgressBar.jsx        # Linear bar synced to live percent
    UrlUploader.jsx        # URL input + submit
    FileCard.jsx            # File icon + name/size chip
    FooterActions.jsx       # Cancel / Continue footer
  hooks/
    useFileUpload.js       # All upload state + progress math lives here
  api/
    uploadService.js       # Axios calls (multipart upload + URL upload)
  utils/
    validators.js          # File type / size / URL validation
    formatters.js           # Bytes, duration, speed formatting
  App.jsx                   # Example usage
```

## How real progress is calculated

`useFileUpload` never sets progress on a timer. Instead:

- **Direct file uploads** use Axios' `onUploadProgress` callback, which
  reports the actual `loaded` / `total` bytes sent over the wire. Percent is
  `Math.round((loaded / total) * 100)`.
- **URL uploads** POST the URL to `POST /api/uploads/url`, which is expected
  to respond immediately with `{ jobId }`. The client then subscribes to
  `GET /api/uploads/url/:jobId/events` (Server-Sent Events) for `progress` and
  `complete` events streamed by the backend as it downloads/ingests the
  remote file. A polling fallback (`pollUrlUploadProgress`) is included in
  `uploadService.js` for backends that can't offer SSE.
- Upload speed is sampled over a rolling ~1.2s window of real byte deltas
  (not a cumulative average), so it reflects current network conditions.
  Estimated time remaining is derived from that speed and the remaining
  bytes.

Because `CircularProgress` and `ProgressBar` both simply render whatever
`percent` they're given, they're guaranteed to stay in sync — there's a
single source of truth (`progress.percent` in the hook).

## Backend contract expected by `uploadService.js`

The included `server/index.js` implements this contract for real — it's not
a stub. Point `uploadService.js` at any backend that honors the same shape:

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/uploads` | `POST` (multipart/form-data) | Direct file upload |
| `/api/uploads/url` | `POST` `{ url }` | Starts a server-side fetch, returns `{ jobId }` |
| `/api/uploads/url/:jobId/events` | `GET` (SSE) | Streams `progress` / `complete` / `error` events |

Adjust `VITE_API_BASE_URL` (or the `BASE_URL` constant in
`uploadService.js`) to point at a different host — the default `/api` relies
on the Vite proxy pointing at `http://localhost:4000`.

## Customization

- File type / size limits live in `utils/validators.js`
  (`ACCEPTED_FILE_TYPES`, `MAX_FILE_SIZE_BYTES`) — the Dropzone helper text
  and validation both read from these, so they can't drift out of sync.
- Colors are plain Tailwind utility classes (indigo primary, emerald
  success, red error, slate neutrals) — swap them centrally by search/replace
  or by introducing Tailwind theme tokens.
- `onImport` on `<UploadModal />` receives the backend's response payload for
  the completed upload so you can wire it into your own import flow.
