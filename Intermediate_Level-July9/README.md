# Employee Dashboard

Everything is already wired up — just install and run.

## Run it

```bash
npm install
npm run dev
```

Then open the URL it prints (usually http://localhost:5173).

## What's inside

- `src/App.jsx` — the full dashboard (CRUD, simulated React Query fetch, pagination, search/filter, add/edit modal, useLocalStorage hook, useMemo/useCallback/React.memo, Theme Context, sidebar routing)
- `src/main.jsx` — mounts the app
- `src/index.css` — Tailwind directives
- `tailwind.config.js` / `postcss.config.js` — Tailwind setup, already configured to scan `src/**/*.jsx`
- `vite.config.js` — Vite + React plugin

No extra setup needed — `npm install` pulls in React, Vite, Tailwind, and lucide-react (the icon library used in the dashboard).

## Build for production

```bash
npm run build
npm run preview
```
