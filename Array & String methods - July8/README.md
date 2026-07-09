# JS Method Lab

Plain vanilla JavaScript — no React, no framework, no build step.

## Run it

Just open `index.html` in any browser. Two tabs:

- **01 · Array Methods** — filter, find, findIndex, map, reduce, sort (asc/desc), some, every — run live against the `employees` array.
- **02 · String Methods** — split/reverse/join, trim, replace, regex match, Set dedup — run against the `employeeNames` array.

Each card shows the exact code used and its real computed output.

## Reuse the logic elsewhere

All the data and functions live in the `<script>` tag in `index.html` and have zero DOM dependencies except the rendering step at the very bottom. Copy anything above the "Rendering helpers" comment into a plain `.js` file or Node script and it runs identically.
