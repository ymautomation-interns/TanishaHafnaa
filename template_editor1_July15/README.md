# Doc Editor

A Canva-style, in-browser document editor built with React, Tailwind CSS, and lucide-react icons.

## Setup

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
doc-editor-project/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx        # React entry point
    ├── index.css       # Tailwind directives + print styles
    └── DocEditor.jsx   # The editor component (your uploaded file)
```

## Notes

- Requires Node.js 18+.
- Uses Tailwind CSS for utility classes and `lucide-react` for icons — both are wired up already.
- The `.no-print` class (defined in `index.css`) hides toolbar/UI chrome when printing/exporting to PDF via the browser print dialog.
