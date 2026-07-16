# YM Automation Pvt Ltd — Website Clone

A React + Vite + Tailwind CSS recreation of the YM Automation homepage, with
an admin panel backed by a Node/Express + PostgreSQL API so content and
image edits show up live for every visitor.

## Admin panel — quick start

There are now two things to run: the **API server** (`server/`) and the
**website** (everything else). The website talks to the API to load/save
content; if the API isn't running, the site still shows its original
content, it just won't be editable.

### 1. Create the Postgres database

```bash
createdb ym_automation
# or, from psql: CREATE DATABASE ym_automation;
```

### 2. Set up and start the API server

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env`:
- Set `DATABASE_URL` (or the individual `PG*` vars) to point at your Postgres database.
- Set `ADMIN_USERNAME` to whatever you want to log in with.
- Generate a password hash and paste it into `ADMIN_PASSWORD_HASH`:
  ```bash
  npm run hash-password -- "your-chosen-password"
  ```
- Set `JWT_SECRET` to any long random string.
- Set `CORS_ORIGIN` to the URL the website runs on (default `http://localhost:5173`).

Then seed the database with the site's current content (so nothing changes
visually the first time) and start the server:

```bash
npm run seed
npm start
```

The API now runs at `http://localhost:4000` (change with `PORT` in `.env`).

### 3. Start the website

From the project root (not `server/`):

```bash
npm install
cp .env.example .env   # set VITE_API_URL if your API isn't on localhost:4000
npm run dev
```

Open http://localhost:5173, then go to **http://localhost:5173/admin** and
log in with the username/password you set above.

### What you can edit

- **Home** — hero heading/subtitle/button, and the 3 project previews shown on the homepage.
- **Services** — the 8 service tiles on the homepage (label + icon), and the full content of the `/services` page (title, subtitle, description, image per service).
- **Projects** — the categories and every project on the `/projects` page (title, dates, about text, and its image carousel).
- **Gallery** — every image on the `/gallery` page.

Images can be pasted as a URL or uploaded directly (stored on the API
server under `server/uploads/` and served at `/uploads/...`). Every edit is
saved to Postgres via the API, so it's visible to all visitors immediately
after you click **Save changes** — no rebuild or redeploy needed.

### Deploying

- The API server (`server/`) needs to run continuously somewhere with a
  Postgres database it can reach (a small VPS, Render, Railway, etc.), and
  needs its `uploads/` folder to persist across restarts/deploys.
- The website (`npm run build`) produces static files in `dist/` that can be
  hosted anywhere (Netlify, Vercel, S3, etc.) — just make sure `VITE_API_URL`
  is set to your deployed API's URL at build time.

## Setup (website only, without the admin panel)

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
ym-automation/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example        # VITE_API_URL
├── server/             # Express + Postgres API for the admin panel
│   ├── index.js
│   ├── db.js
│   ├── seed.js          # populates DB with the site's original content
│   ├── hash-password.js # generates ADMIN_PASSWORD_HASH
│   ├── .env.example
│   ├── middleware/auth.js
│   └── routes/ (auth.js, content.js, upload.js)
└── src/
    ├── main.jsx           # React entry point (wraps App in ContentProvider + BrowserRouter)
    ├── App.jsx            # Header + Footer shell, defines routes (incl. /admin)
    ├── index.css          # Tailwind + custom keyframes
    ├── api.js             # fetch helpers for the API (auth, content, uploads)
    ├── context/
    │   └── ContentContext.jsx  # loads editable content, falls back to defaults if API is down
    ├── data/
    │   ├── constants.js   # Nav items, static copy not yet wired to the admin panel
    │   └── iconMap.js     # icon-name -> lucide-react component, used by admin-editable services
    ├── pages/
    │   ├── Home.jsx        # "/" — Hero, About teaser, Services, Approach, Projects, Customers
    │   ├── AboutUsPage.jsx # "/about" — full About Us page
    │   ├── ServicesPage.jsx / ProjectsPage.jsx / GalleryPage.jsx  # now read from ContentContext
    │   └── admin/
    │       ├── AdminLogin.jsx
    │       ├── AdminDashboard.jsx   # tabbed editor: Home / Services / Projects / Gallery
    │       ├── RequireAdmin.jsx     # route guard
    │       ├── ImageField.jsx       # URL input + upload button, shared by all editors
    │       ├── SaveBar.jsx
    │       └── editors/ (HomeEditor.jsx, ServicesEditor.jsx, ProjectsEditor.jsx, GalleryEditor.jsx)
    └── components/
        ├── Logo.jsx
        ├── Header.jsx          # nav highlights the active route
        ├── Hero.jsx            # now reads hero copy from ContentContext
        ├── AboutUs.jsx         # homepage "About Us" teaser section
        ├── OurServices.jsx     # 2/4-column grid, now reads from ContentContext
        ├── OurApproach.jsx
        ├── OurProjects.jsx     # 1/3-column grid, now reads from ContentContext
        ├── OurCustomers.jsx    # auto-scrolling logo marquee
        └── Footer.jsx
```

## Pages

- **Home** (`/`) — the full homepage.
- **About Us** (`/about`) — breadcrumb, intro copy, "Who We Are" (team photo + expertise list), "Our Mission" / "Our Vision", and "Why Choose Us" (Innovation, Commitment, Customer satisfaction).

Click "About Us" in the nav to go between pages — routing is handled by `react-router-dom`.

## Notes

- `Our Services` and `Our Projects` are laid out as CSS grids (`grid-cols-2 md:grid-cols-4` and `grid-cols-1 md:grid-cols-3`), matching the uploaded design exactly.
- Project images are generic stock photos (Unsplash) — swap the `image` URLs in `src/data/constants.js` for your real project photos.
- Customer logos are stylized placeholders — replace `CustomerLogo` in `OurCustomers.jsx` with real logo images/SVGs when available.
- Update the phone/email/address/GST/CIN details in `Footer.jsx` if they change.
