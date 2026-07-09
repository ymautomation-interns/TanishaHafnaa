# React Practice — 10 Exercises

A small Vite + React + Tailwind project with one file per exercise, navigable from a numbered sidebar.

## Setup

```bash
npm install
npm run dev
```

Then open the printed local URL in your browser.

## What's inside

| # | Exercise | File |
|---|----------|------|
| 01 | Employee Card (props) | `src/sections/01-EmployeeCard.jsx` |
| 02 | Counter (useState) | `src/sections/02-Counter.jsx` |
| 03 | Login Form with validation | `src/sections/03-LoginForm.jsx` |
| 04 | Theme Toggle | `src/sections/04-ThemeToggle.jsx` |
| 05 | Todo App | `src/sections/05-TodoApp.jsx` |
| 06 | Employee List (map) | `src/sections/06-EmployeeList.jsx` |
| 07 | Search Filter | `src/sections/07-SearchFilter.jsx` |
| 08 | Status Badges (conditional rendering) | `src/sections/08-StatusBadges.jsx` |
| 09 | Reusable Button & Input | `src/sections/09-ReusableComponents.jsx` |
| 10 | Fetch Users (useEffect) | `src/sections/10-FetchUsers.jsx` |

Shared building blocks live in `src/components/`: `Button.jsx`, `Input.jsx`, `EmployeeCard.jsx`, `StatusBadge.jsx`, and `Panel.jsx`.

## Performance strip

Every panel is wrapped in `Panel.jsx`, which uses the `usePerf` hook (`src/components/usePerf.js`) to show two live numbers at the top of each exercise:

- **Renders** — how many times that section has re-rendered since it mounted. Watch this while you type in the Login Form or Search Filter to see exactly which state updates trigger a re-render.
- **Time to paint** — milliseconds from mount to first paint, measured with `performance.now()` and `requestAnimationFrame`.

Each panel also carries a one-line performance note calling out the specific optimization that exercise is a natural fit for (memoization, `useMemo`, `AbortController`, stable keys, functional state updates, and so on) — read these as a checklist of "the next thing to try" rather than as bugs in the current code, since at this scale (a handful of items, one input field) none of it is a real bottleneck yet.

## Build

```bash
npm run build
npm run preview
```
